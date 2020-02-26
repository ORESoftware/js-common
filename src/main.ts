'use strict';

import {ConnectionOptions} from "tls";

import * as fs from 'fs';
import * as path from 'path';
import * as pg from 'pg'
import * as cp from 'child_process';

const c = new pg.Client({
  user: 'postgres',
  database: 'creatorpay',
  password: '9JjA8dOB7Pwpwk9r',
  port: 5432,
  host: 'pg.channelmeter.com',
  keepAlive: true,
  ssl: false,
});

const p = c.connect().then(c => {
  console.log('connected');
});

const flattenDeep = (arr: Array<any>): Array<any> => {
  return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flattenDeep(val) : val), [])
};

const getType = (t: string): string => {

  switch (String(t).toUpperCase()) {

    case 'UUID':
    case 'TEXT':
    case 'CHAR':
    case 'VARCHAR':
    case 'VARCHAR2':
    case 'DATE':
    case 'TIMESTAMP':
    case 'INTERVAL':
    case 'TIMESTAMPTZ':
      return 'string';

    case 'INT':
    case 'INT4':
    case 'INT8':
    case 'INT32':
    case 'INT64':
    case 'INTEGER':
    case 'SMALLINT':
    case 'SERIAL':
    case 'BIGINT':
      return 'number';

    case 'BOOL':
    case 'BOOLEAN':
      return 'boolean';

    case 'ARRAY':
      return 'Array<any>';

    case 'JSON':
    case 'JSONB':
      return 'any';

    default:
      return 'any'
  }

};

const f = '/home/oleg/codes/channelmeter/js-common/src/read-only/types.ts';

try {
  fs.unlinkSync(f);
}
catch (err) {
  console.error('Could not delete/unlink file:', f);
}

const s = fs.createWriteStream('/home/oleg/codes/channelmeter/js-common/src/read-only/types.ts');

s.once('end', () => {
  console.log('ended.');
  // fs.chmodSync(f, fs.constants.O_RDONLY);
});

process.once('exit', code => {
  fs.chmodSync(f, fs.constants.O_RDONLY);
  cp.execSync(`chmod 444 ${f}`);
  console.log('Exiting with code:', code);
});

p.then(async () => {

  return c.query('select * from information_schema.tables').then(async v => {

    console.log('row count:', v.rowCount)

    // process.exit(0);

    const tables = [];

    for (let r of v.rows) {
      if (r.table_type == 'VIEW') {
        continue;
      }

      if (r.user_defined_type_schema == null) {
        // continue;
      }

      if (r.table_schema === 'information_schema') {
        continue;
      }

      if (r.table_schema === 'pg_catalog') {
        continue;
      }

      // if(r.table_type == 'BASE_TABLE'){
      //   continue;
      // }

      tables.push(r);

      console.log(r);
    }

    s.write('\n');

    s.write('export namespace cp_tables {\n');

    for (const t of tables) {

      // const v = await c.query(`\\d ${t.table_schema}.${t.table_name}`);

      console.log(t.table_schema, t.table_name);

      const v = await c.query(`
        SELECT COLUMN_NAME, DATA_TYPE
        FROM information_schema.COLUMNS
        WHERE TABLE_NAME = '${t.table_name}';
    `);

      console.log(v);

      const ns = [`\texport namespace ${t.table_name}_fields {`, [], '\t}'] as [string, Array<string>, string];
      const z = [`\texport interface ${t.table_name} {`, [], '\t}'] as [string, Array<string>, string];

      for (let r of v.rows) {
        ns[1].push(`\t\t export type ${r.column_name} = ${getType(r.data_type)};`);
        z[1].push('\t\t' + r.column_name + ': ' + getType(r.data_type))
      }

      s.write('\n');
      s.write(flattenDeep(z).join('\n'));
      s.write('\n\n');
      s.write(flattenDeep(ns).join('\n'));
      s.write('\n');

    }

    s.write('\n');
    s.write('}');
    s.end('\n');

    c.end().catch(console.error);

  });

});
