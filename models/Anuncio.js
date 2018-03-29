'use strict';

const mongoose = require('mongoose');

// primero creamos el esquema
const anuncioSchema = mongoose.Schema({
    nombre: String,
    venta: Boolean,
    precio: Number,
    foto: String,
    tags: [String]
});


// creamos un método estático (del modelo)
anuncioSchema.statics.listar = function(filtro, skip, limit, sort, fields, callback) {
    // obtenemos la query sin ejecutarla
    const query = Anuncio.find(filtro);
    query.skip(skip);
    query.limit(limit);
    query.sort(sort);
    query.select(fields);
    return query.exec(callback);
};

// y por último creamos el modelo
const Anuncio = mongoose.model('Anuncio', anuncioSchema);

// y lo exportamos
module.exports = Anuncio;