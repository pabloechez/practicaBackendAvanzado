'use strict';
/**
 * Modulo con función que devuelve un middleware
 * El middleware verifica si la sesión no esta autenticada para redirigir al login
 */
module.exports = function() {
    return function(req, res, next) {
        if (!req.session.authUser){
            res.redirect('/login');
            return;
        }

        next();
    };
};

