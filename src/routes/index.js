const express = require('express')
const routes = express.Router();

const HomeController = require('../app/controllers/HomeController');

const products = require('./products');
const users = require('./users');

routes.get('/', HomeController.index);

routes.use('/products', products)
routes.use('/users', users)

// ALIAS
routes.get('/ads/create', function(require, response) {
    return response.redirect("/products/create");
});

routes.get('/accounts', function(require, response) {
    return response.redirect("/users/login");
});

module.exports = routes;