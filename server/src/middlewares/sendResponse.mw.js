module.exports = (_, res) => {
  const { statusCode } = res || {};
  const status = statusCode || 200;
  res.status(status).json(res.data);
};
