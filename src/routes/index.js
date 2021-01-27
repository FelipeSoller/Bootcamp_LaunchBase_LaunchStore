const express = require('express')
const routes = express.Router();

const HomeController = require('../app/controllers/HomeController');

const products = require('./products');
const users = require('./users');
const cart = require('./cart');

routes.get('/', HomeController.index);

routes.use('/products', products)
routes.use('/users', users)
routes.use('/cart', cart)

// ALIAS
routes.get('/ads/create', function(require, response) {
    return response.redirect("/products/create");
});

routes.get('/accounts', function(require, response) {
    return response.redirect("/users/login");
});

module.exports = routes;