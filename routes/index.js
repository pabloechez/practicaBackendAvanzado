var express = require('express');
var router = express.Router();

const Anuncio= require('../models/Anuncio');
const axios = require('axios');


/* GET home page. */
router.get('/', async (req, res, next)=>{
    try {     
       const url='http://localhost:3000/apiv1/anuncios'+req.originalUrl;
        const httpResponse = await axios.get(url);
        const result = httpResponse.data.result; 
        res.render('pages/index', { title: 'Nodepop',results:result });   
      } catch(err) {
        next(err);
        return;
      }  
});


module.exports = router;


