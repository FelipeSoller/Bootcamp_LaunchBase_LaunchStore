const express = require('express')
const routes = express.Router();

routes.get('/', function(require, response) {
    return response.render("layout.njk");
});

module.exports = routes;