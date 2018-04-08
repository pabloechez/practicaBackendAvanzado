'use strict';

const express = require('express');
const router = express.Router();

const Anuncio= require('../../models/Anuncio');
const upload = require('../../lib/uploadConfig');
const Jimp = require("jimp");
const path = require('path');
const cote = require('cote');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');


router.get('/', async(req, res, next)=>{
    try {
        // recogemos parámetros de entrada
        const name = req.query.nombre;
        const sale = req.query.venta;
        const price = req.query.precio;
        const tag = req.query.tag;
        const skip = parseInt(req.query.start);
        const limit = parseInt(req.query.limit);
        const sort = req.query.sort;
        const fields = req.query.fields;
    
    
        const filtro = {};

    
        if (typeof name !== 'undefined') {
            filtro.nombre = new RegExp('^'+ name, "i") 
        }

        if (typeof sale !== 'undefined') { 
            filtro.venta = sale; 
        }

        if (typeof tag !== 'undefined') { 
            filtro.tags = tag; 
        }

       
        if (typeof price !== 'undefined') { 
            const parts = price.split('-');
        

            if(parts.length==1){
                filtro.precio = price

            }else{
                const price2 = parts.pop();
                const price1 = parts.pop();
     
                if(price2!='' && price1!=''){
                    filtro.precio = { '$gte': price1, '$lte': price2 }      
                }else{
                    if(price2!=''){
                        filtro.precio = {'$lte': price2} 
                    }
                    if(price1!=''){
                        filtro.precio = {'$gte': price1} 
                    }
                }
            }  
        }
    
        const docs = await Anuncio.listar(filtro, skip, limit, sort, fields); // si usamos await, la función donde estoy
        
        res.json({ success: true, result: docs });  
    } catch(err) {
        next(err);
        return;
    }   
});

router.get('/tags', async(req, res, next)=>{
    try {
             
        const docs = await Anuncio.find().distinct('tags').exec();
        
        res.json({ success: true, result: docs });  
      } catch(err) {
        next(err);
        return;
      }   
});


const validateBody = [
    check('nombre').isLength({ min: 1 }).exists().withMessage('Nombre obligatorio'),
    check('precio').isLength({ min: 1 }).exists().matches('^[0-9]+$').withMessage('Obligatorio, sólo números'),
    check('tags').isLength({ min: 1 }).exists().withMessage('Palabras obligatorio'),
];

router.post('/', upload.single('imagen'),...validateBody, (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });

    }

    const data = req.body;
    console.log('upload:', req.file);
    data.foto=req.file.filename;

    data.thumbnail='thumbnail-'+data.foto;

    if(req.body.venta==1){
        data.venta=true;
    }else{
        data.venta=false;
    }

    data.tags= req.body.tags.split(",");

    const anuncio = new Anuncio(data);
    anuncio.save((err, anuncioGuardado) => {
        if (err) {
            next(err);
            return;
        }
        res.redirect('/admin');
    });

    //cliente de creacion de thumbnail
    const requester = new cote.Requester({ name: 'image thumbail client'});

    requester.send({
        type: 'thumbnail',
        image: data.foto,
        name: data.foto,
    });

});

module.exports = router;