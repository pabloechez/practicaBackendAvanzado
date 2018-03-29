#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('nodepop:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Control del cluster
const cluster = require('cluster');

//si somos el master
if(cluster.isMaster){
  //console.log('Muster has pid', process.pid);

  //nos suscribimos a eventos del cluster
  cluster.on('listening',(worker,address)=>{
    console.log(`Worker ${worker.id} width pid ${worker.process.pid} is connected to port ${address.port}`);
  });

  //al terminar un worker
  cluster.on('exit',(worker,code, signal)=>{
    console.log(`Worker ${worker.process.pid} die width code ${code}, and signal ${signal}`);
    console.log('Starting new worker');
    cluster.fork();
  });

  //averiguo cuantos cores tengo
  const numCPUs = require('os').cpus().length;

  for ( let i=0; i< numCPUs; i++){
    cluster.fork();
  }
}else{
  //soy un clon(fork)
  /**
   * Create HTTP server.
   */

  var server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces.
   */

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
