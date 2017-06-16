'use strict';

const periodic = require('periodicjs');
const extensionRouter = periodic.express.Router();
const fs = require('fs-extra');
const path = require('path');
const packageJson = fs.readJsonSync(path.join(__dirname, '../package.json'));

extensionRouter.get(packageJson.name, (req, res) => {
  console.log('ljasldjflsdf')
  res.send(`EXTENSION ${packageJson.name}`);
});

extensionRouter.get('/OKINHERE', (req, res) => {
  res.send({ notaroute: 'ok' })
})

module.exports = extensionRouter;