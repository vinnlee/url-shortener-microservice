var express = require("express");
var router = express.Router();
var home = require("../controller/home");
var theUrl = require("../controller/url");

module.exports = function(app) {
    router.get('/', home.index);
    router.get('/new/:url(*)', theUrl.create);
    router.get('/:id', theUrl.getUrl);
    app.use(router);
};