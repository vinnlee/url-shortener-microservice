const express = require("express");
const router = express.Router();
const home = require("../controller/home");
const theUrl = require("../controller/url");

module.exports = function(app) {
    router.get('/', home.index);
    router.get('/new/:url(*)', theUrl.create);
    router.get('/:id', theUrl.getUrl);
    app.use(router);
};