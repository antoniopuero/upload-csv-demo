import sqlite3 from 'sqlite3';
import config from '../../config';

if (config.get('env') === 'dev') {
  sqlite3.verbose();
}
const db = new sqlite3.Database(config.get('db'));
initTable();

function promisify(stm, sql) {
  return new Promise((resolve, reject) => {
    stm.run(sql, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
}

function initTable() {
  db.get(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='people'`,
    (err, peopleTable) => {
      if (!peopleTable) {
        createTable();
      }
    }
  );
}

export function dropTable() {
  return promisify(db, 'DROP TABLE IF EXISTS people');
}

export function createTable() {
  return promisify(
    db,
    'CREATE TABLE people(id integer primary key, name text, age integer, address text, team text)'
  );
}

export function insertStatement() {
  return db.prepare(
    'INSERT INTO people(id, name, age, address, team) VALUES(?, ?, ?, ?, ?)'
  );
}

export function insertValues(stm, values) {
  return promisify(stm, values);
}

export function finalizeStatement(stm) {
  return stm.finalize();
}

export function searchValuesByName(name = '', limit = 20, offset = 0) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM people WHERE name LIKE '%${name}%' LIMIT ${limit} OFFSET ${offset}`,
      (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      }
    );
  });
}
