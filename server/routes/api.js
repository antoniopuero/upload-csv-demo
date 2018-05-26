import { Router } from 'express';

const api = Router();
api.get('/ping', (req, res) => {
  res.send('pong');
});

api.post('/import', (req, res, next) => {
  res.send('import');
});

api.post('/search', (req, res, next) => {
  res.send('search');
});

export default api;
