const handler = (ErroHandler) => (req, res, next) => {
  Promise.resolve(ErroHandler(req, res, next)).catch(next);
};
module.exports = handler;
