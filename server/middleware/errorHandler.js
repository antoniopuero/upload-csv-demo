import { BadRequest } from '../utils/errors';

export default (err, req, res, next) => {
  if (err instanceof BadRequest) {
    res.status(err.status);
    return res.json({ errors: err.errors });
  }

  res.status(err.status || 400);
  let response = { errors: [{ message: err.message || err.path }] };
  res.json(response);
};
