require('express-async-errors');
const winston = require('winston');

const logging = function () {
  winston.exceptions.handle(
    new winston.transports.File({ filename: 'logfile.log' })
  );

  process.on('unhandledRejection', (ex) => {
    throw new Error(ex);
  });

  winston.add(new winston.transports.File({ filename: 'logfile.log' }));
};

module.exports = logging;