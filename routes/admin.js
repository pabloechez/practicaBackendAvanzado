var express = require('express');
var router = express.Router();
var i18n = require('i18n');

const sessionAuth =  require('../lib/sessionAuth');


/* GET home page. */
router.get('/', sessionAuth(),async function (req, res, next) {

    res.render('pages/admin');
});

router.post('/', async function (req, res, next) {
    console.log(req.body.email);

    res.render('pages/admin');
});




module.exports = router;


