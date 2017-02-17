var shortid = require("shortid");
var validUrl = require('valid-url');
var mongoose = require("mongoose");
var mongodb = process.env.MONGOLAB_URI || 'mongodb://' + process.env.IP + ':27017/url-shorten'; // replace

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
                } // else 
                res.json({ 
                    original_url: originalurl, 
                    short_url: 'https://my-freecodecamp-project-leronair.c9users.io' +  '/' + shortenurl // replace
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
        listUrl.find({ shortenurl: req.params.id }, function(error, id) {
            if(error) { // error
                console.error('error: ' + error);
            } else {
                if (id && id.length) {
                    res.redirect(id[0].originalurl);
                } else {
                    res.status(404).send("This URL is not in database.");
                }
            }
        });
    }
};