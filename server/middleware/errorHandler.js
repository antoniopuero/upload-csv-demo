import errors from '../utils/errors';

export default (err, req, res, next) => {
  if (err instanceof errors.BadRequest) {
    res.status(err.status);
    return res.json({ errors: err.errors });
  }

  res.status(err.status);
  let response = { errors: [{ message: err.message || err.path }] };
  res.json(response);
};
