'use strict';

const path = require('path');

module.exports = (config, devServer) => {
  devServer.listen(3000, '0.0.0.0', () => {
    console.log('Development server running on http://localhost:3000');
  });
};
