const shortid  = require("shortid");
const validUrl = require('valid-url');
const mongoose = require("mongoose");
const mongodb  = process.env.MONGOLAB_URI || 'mongodb://' + process.env.IP + ':27017/url-shorten';

mongoose.connect(mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const database = mongoose.connection;
database.on('error', console.error.bind(console, 'MongoDB connection error: '));

const urlSchema = new mongoose.Schema({
    originalurl: { type: String, required: true },
    shortenurl: { type: String, required: true }
});

const listUrl = mongoose.model('UrlList', urlSchema);

module.exports = {
    // create shorten url
    create: function(req, res) {
        const shortenurl = shortid.generate();
        const originalurl = req.params.url;
        
        if (validUrl.isUri(originalurl)) {
            const shortenUrlObj = new listUrl({
                originalurl,
                shortenurl
            });
            
            shortenUrlObj.save(function(error) {
                if (error) {
                    console.error('Error: ' + error);
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
            if (error) {
                console.error('Error: ' + error);
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