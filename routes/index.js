var express = require('express');
var router = express.Router();
var i18n = require('i18n');

const fs = require('fs');
const Anuncio = require('../models/Anuncio');
const sessionAuth =  require('../lib/sessionAuth');


/* GET home page. */
router.get('/', sessionAuth(),async function (req, res, next) {

    try {
        const skip = parseInt(req.query.start) || 0;
        const limit = parseInt(req.query.limit) || 1000; // nuestro api devuelve max 1000 registros
        const sort = req.query.sort|| '_id';

        const filtro = {};
        if (req.query.tag) {
            filtro.tags = req.query.tag;
        }
        if (req.query.venta) {
            filtro.venta = req.query.venta;
        }

        const rows= await Anuncio.listar(filtro, skip, limit, sort);

        res.render('pages/index', {title: 'Nodepop', results: rows });
    } catch(err) { return res.next(err);}
});


module.exports = router;


