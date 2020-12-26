const express = require('express')
const routes = express.Router();
const ProductController = require('./app/controllers/ProductController');

routes.get('/', function(require, response) {
    return response.render("layout.njk");
});

routes.get('/products/create', ProductController.create);

routes.get('/ads/create', function(require, response) {
    return response.redirect("/products/create");
});

module.exports = routes;