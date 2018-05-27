import { Router, json } from 'express';
import Busboy from 'busboy';
import csv from 'csv-parser';
import queue from 'async/queue';
import isInteger from 'lodash/isInteger';
import isUndefined from 'lodash/isUndefined';
import isString from 'lodash/isString';
import isEmpty from 'lodash/isEmpty';
import compact from 'lodash/compact';
import {
  dropTable,
  createTable,
  insertStatement,
  insertValues,
  finalizeStatement,
  searchValuesByName
} from '../db/client';
import { BadRequest } from '../utils/errors';
import { headers } from '../utils/constants';

const api = Router();

api.use(json());

api.post('/import', uploadFile);

api.post('/search', checkSearchParams, searchPeople);

function uploadFile(req, res, next) {
  const busboy = new Busboy({ headers: req.headers });

  busboy.on('file', (field, fileStream, fileName, encoding, mimeType) => {
    if (!isMimeTypeSupported(mimeType)) {
      return next(
        new BadRequest(`Not supported mimeType: ${mimeType} for ${fileName}`)
      );
    }
    importFile(fileStream);
  });

  busboy.on('finish', () => {
    res.json({ success: true });
  });

  req.pipe(busboy);
}

function importFile(fileStream) {
  const progress = { sent: 0, processed: 0, finished: false };
  const stm = insertStatement();
  const callsQueue = queue((action, done) => {
    action().then(
      () => {
        progress.processed += 1;
        done();
      },
      err => {
        console.error('Error in console queue: ', err);
        done();
      }
    );
  });

  callsQueue.drain = () => {
    finalizeStatement(stm);
  };

  callsQueue.pause();
  callsQueue.push(() => dropTable());
  callsQueue.push(() => createTable());

  fileStream
    .pipe(csv(headers))
    .on('data', row => {
      progress.sent += 1;
      if (callsQueue.paused) {
        callsQueue.resume();
      }
      callsQueue.push(() => insertValues(stm, Object.values(row)));
    })
    .on('end', () => {
      progress.finished = true;
    });
}

function isMimeTypeSupported(mimeType) {
  return ['text/csv', 'application/vnd.ms-excel', 'application/csv'].includes(
    mimeType
  );
}

function checkOptionalParam(field, value, type) {
  const typeChecks = {
    integer: isInteger,
    string: isString
  };
  return !typeChecks[type](value) && !isUndefined(value)
    ? { field, message: `should be valid ${type}` }
    : null;
}

function checkSearchParams(req, res, next) {
  const { query = '', limit, offset } = this.req.body;
  let errors = [];
  errors.push(checkOptionalParam('query', query, 'string'));
  errors.push(checkOptionalParam('limit', limit, 'integer'));
  errors.push(checkOptionalParam('offset', offset, 'integer'));

  if (!isEmpty(compact(errors))) {
    return next(new BadRequest('', errors));
  }
}

function searchPeople(req, res, next) {
  searchValuesByName(req.body.search, req.body.limit).then(
    results => res.json(results),
    err => next(err)
  );
}

export default api;
