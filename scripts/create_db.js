'use strict';

const MongooseSeed = require('mongoose-seed-db');
const config = require('../lib/local_config');
const path = require('path');
var db= path.join(`${config.server}:${config.port}`,config.db);
//import MongooseSeed from 'mongoose-seed-db'; //ES6

MongooseSeed.connect('mongodb://'+db).then(() => {
  MongooseSeed.loadModels(path.join(__dirname, '/../models'));
  MongooseSeed.clearAll().then(() => {
    MongooseSeed.populate(path.join(__dirname, '/../data')).then(() => {
      process.exit()
    })
  })
});



