var shortid  = require("shortid");
var validUrl = require('valid-url');
var mongoose = require("mongoose");
var mongodb  = process.env.MONGOLAB_URI || 'mongodb://' + process.env.IP + ':27017/url-shorten';

mongoose.connect(mongodb);

var database = mongoose.connection;
database.on('error', console.error.bind(console, 'MongoDB connection error'));

var urlSchema = new mongoose.Schema({
    originalurl: { type: String, required: true },
    shortenurl: { type: String, required: true }
});

var listUrl = mongoose.model('UrlList', urlSchema);

module.exports = {
    // create shorten url
    create: function(req, res) {
        
        var shortenurl = shortid.generate();
        var originalurl = req.params.url;
        
        if( validUrl.isUri( originalurl ) ) {
            var shortenUrlObj = new listUrl({
                originalurl: originalurl,
                shortenurl: shortenurl
            });
            
            shortenUrlObj.save(function(error) {
                if(error) { // error
                    console.error('error: ' + error);
                }
                res.json({ 
                    original_url: originalurl, 
                    short_url: 'https://vinnlee-url-shorten.herokuapp.com/' + shortenurl
                });
            });
        } else {
            res.json({
                error: 'URL must contain http:// or https://'
            });
        }
        
    },
    //get the url from database
    getUrl: function(req, res) {
        listUrl.find({ shortenurl: req.params.id }, function(error, url) {
            if(error) { // error
                console.error('error: ' + error);
            } else {
                if (url && url.length) {
                    res.redirect(url[0].originalurl);
                } else {
                    res.status(404).send("This URL is not in database.");
                }
            }
        });
    }
};