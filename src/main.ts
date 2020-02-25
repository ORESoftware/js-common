'use strict';

import {ConnectionOptions} from "tls";

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

c.connect().then(c => {
  console.log('connected');
});

c.query('select * from information_schema.tables').then(async v => {

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

  for(const t of tables){

    // const v = await c.query(`\\d ${t.table_schema}.${t.table_name}`);

    console.log(t.table_schema, t.table_name);

    const v = await c.query(`
        SELECT COLUMN_NAME, DATA_TYPE
        FROM information_schema.COLUMNS
        WHERE TABLE_NAME = '${t.table_name}';
    `);

    console.log(v);
  }



});
