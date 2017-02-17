var express = require("express");
var app = express();
var routes = require("./routes/index");

app.set('port', process.env.PORT || 3300);
app.set('view engine', 'pug');

routes(app);

app.listen(app.get('port'), function() {
    console.log('Server up on port: ' + app.get('port'));
});