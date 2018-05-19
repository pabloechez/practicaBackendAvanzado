'use strict';

const mongoose = require('mongoose');
const conn = mongoose.connection;
var path = require('path');
const config = require('./local_config');
var db= path.join(config.server,config.db);


conn.on('err',err=>{
    console.log('Error de conexión',err);
    process.exit(1);
});

conn.once('open',()=>{
   console.log('Conectado a MongoDB en', mongoose.connection.name);
});

if(process.env.DATABASE_URI){
    mongoose.connect(process.env.DATABASE_URI);
}else{
    mongoose.connect('mongodb://'+db, { useMongoClient: true });
}

module.exports = conn;
