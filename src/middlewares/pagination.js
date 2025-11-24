export const pagination = (req, res, next) => {
  req.page = parseInt(req.query.page) || 1;
  req.limit = parseInt(req.query.limit) || 10;
  req.offset = (req.page - 1) * req.limit;
  next();
};
