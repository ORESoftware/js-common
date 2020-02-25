'use strict';

import {ConnectionOptions} from "tls";

import * as fs from 'fs';

export const foo = 'bar';

export const r2gSmokeTest = function () {
  // r2g command line app uses this exported function
  return true;
};

import * as pg from 'pg'

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
    case 'VARCHAR':
      return 'string';

    case 'INT':
    case 'INT4':
    case 'BIGINT':
      return 'number';

    case 'BOOL':
    case 'BOOLEAN':
      return 'boolean';

    default:
      return 'any'
  }

};

const s = fs.createWriteStream('/home/oleg/codes/channelmeter/js-common/src/read-only/types.ts');

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
