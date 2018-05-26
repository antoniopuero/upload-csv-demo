import express from 'express';
import logger from 'morgan';
import config from '../config';
import errorHandler from './middleware/errorHandler';
import parcelDevServer from './middleware/parcelDevServer';
import apiRouter from './routes/api';
const app = express();

if (config.get('env') !== 'test') {
  app.use(logger('tiny'));
}

if (config.get('env') === 'prod') {
  app.use(express.static('./dist'));
}

app.use('/', apiRouter);

app.use(errorHandler);

if (config.get('env') === 'dev') {
  app.use(parcelDevServer());
}

app.use((req, res) => {
  res.status(404).send("The page you are looking for wasn't found.");
});

app.listen(config.get('port'), () => {
  console.log(
    `Server is listening on localhost:${config.get('port')} env=${config.get(
      'env'
    )}`
  );
});

export default app;
