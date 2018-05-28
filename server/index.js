import express from 'express';
import http from 'http';
import logger from 'morgan';
import config from '../config';
import errorHandler from './middleware/errorHandler';
import parcelDevServer from './middleware/parcelDevServer';
import apiRouter from './routes/api';
import { configureSocket } from './socket/client';

const app = express();
const server = http.Server(app);
configureSocket(server);

app.use(logger('tiny'));

if (config.env !== 'dev') {
  app.use(express.static('./dist'));
}

app.use('/', apiRouter);

app.use(errorHandler);

// bundler is here because it handles all the requests which
// didn't match before
if (config.env === 'dev') {
  app.use(parcelDevServer());
}

app.use((req, res) => {
  res.status(404).send("The page you are looking for wasn't found.");
});

server.listen(config.port, () => {
  console.log(
    `Server is listening on localhost:${config.port} env=${config.env}`
  );
});

export default app;
