const { isCelebrateError } = require("celebrate");
const { NODE_ENV } = require("../config/env");
const { ENV } = require("../constants/enums");

module.exports = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let status = err.status || "error";
  let message = err.message || "Something went wrong!";
  const isDev = NODE_ENV === ENV.DEV;
  if (isCelebrateError(err)) {
    let errors = [];
    for (const [_, joiError] of err.details.entries()) {
      errors = joiError.details.map((detail) => {
        return `${detail.message.replace(/["]/g, "")}`;
      });
    }
    statusCode = 400;
    status = "fail";
    message = errors.join(", ");
  }
  const response = {
    status,
    statusCode,
    message,
  };
  if (isDev) response.stack = err.stack;
  res.status(statusCode).json(response);
};
