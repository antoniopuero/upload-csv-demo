import { expect } from 'chai';
import request from 'supertest';
import io from 'socket.io-client';
import config from '../../config';
import app from '../index';
import { searchValuesByName } from '../db/client';
import { uploadEvents } from '../../config/constants';

const socketURL = `http://0.0.0.0:${config.port}`;

// not arrow function to preserve context for this.timeout
describe('API', function() {
  this.timeout(20000);

  describe('POST /import', () => {
    it('should reject if mimetype is not csv', done => {
      request(app)
        .post(`/import`)
        .attach('file', 'server/__tests__/testdata/download.png')
        .expect(400)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('should import csv and insert it into database', done => {
      const socket = io(socketURL);
      socket.on(uploadEvents.finished, () => {
        searchValuesByName().then(results => {
          expect(results.length).to.equal(10);
          expect(results[0]).to.deep.equal({
            id: 1,
            name: 'Fred Caldwell',
            age: 61,
            address: 'Bater Circle, 339 Posa Grove',
            team: 'YELLOW'
          });
          done();
        });
      });

      request(app)
        .post(`/import`)
        .attach('file', 'server/__tests__/testdata/testdata10.csv')
        .expect(200)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.success).to.be.true;
        });
    });
  });

  describe('POST /search', () => {
    it('should reject if query is not a string', done => {
      request(app)
        .post(`/search`)
        .send({
          query: 1000
        })
        .expect(400)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('should return results which match the query', done => {
      request(app)
        .post(`/search`)
        .send({
          query: 'Fred Caldwell'
        })
        .expect(200)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.results).to.deep.equal([
            {
              id: 1,
              name: 'Fred Caldwell',
              age: 61,
              address: 'Bater Circle, 339 Posa Grove',
              team: 'YELLOW'
            }
          ]);
          done();
        });
    });

    it('should return empty results if nothing matches the query', done => {
      request(app)
        .post(`/search`)
        .send({
          query: 'This string wont match anything'
        })
        .expect(200)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.results).to.be.an('array').that.is.empty;
          done();
        });
    });
  });

  describe('POST /somewhere', () => {
    it('should return 404 if path is not import or search', done => {
      request(app)
        .post(`/somewhere`)
        .expect(404)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
    });
  });

  describe('GET /', () => {
    it('should return html file with all the ui', done => {
      request(app)
        .get(`/`)
        .expect(200)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.type).to.equal('text/html');
          done();
        });
    });
  });
});
