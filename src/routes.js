const express = require('express')
const routes = express.Router();
const multer = require('./app/middlewares/multer');
const ProductController = require('./app/controllers/ProductController');

routes.get('/', function(require, response) {
    return response.render("layout.njk");
});

routes.get('/products/create', ProductController.create);
routes.get('/products/:id', ProductController.show)
routes.post('/products', multer.array('photos', 6), ProductController.post);
routes.get('/products/:id/edit', ProductController.edit);
routes.put('/products', multer.array('photos', 6), ProductController.put);
routes.delete('/products', ProductController.delete);

routes.get('/ads/create', function(require, response) {
    return response.redirect("/products/create");
});

module.exports = routes;