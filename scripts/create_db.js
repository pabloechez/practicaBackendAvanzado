'use strict';
require('dotenv').config();

const MongooseSeed = require('mongoose-seed-db');
const config = require('../lib/local_config');
const path = require('path');
//var db= path.join(`${config.server}:${config.port}`,config.db);
//import MongooseSeed from 'mongoose-seed-db'; //ES6

if(process.env.DATABASE_URI){
    var db= process.env.DATABASE_URI;
}else{
    var db= path.join(`${config.server}:${config.port}`,config.db);
    db='mongodb://'+ db;
}

MongooseSeed.connect(db).then(() => {
  MongooseSeed.loadModels(path.join(__dirname, '/../models'));
  MongooseSeed.clearAll().then(() => {
    MongooseSeed.populate(path.join(__dirname, '/../data')).then(() => {
      process.exit()
    })
  })
});



