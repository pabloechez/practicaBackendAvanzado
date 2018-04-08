'use strict';

//servicio creación de thumbnail

const cote = require('cote');
const Jimp = require("jimp");
const path = require('path');

const responder = new cote.Responder({ name: 'image thumbnail responder'});


// req:{ image: name.jpg, name: newName.jpg}
responder.on('thumbnail',(req, done)=>{

    Jimp.read(path.join(__dirname, '../uploads/'+req.image)).then(function (image) {
        image.resize(100, 100)
            .quality(60)
            .write(path.join(__dirname, '../uploads/'+'thumbnail-'+ req.name));
    }).catch(function (err) {
        console.error(err);
    });

    done(req.image);

});
