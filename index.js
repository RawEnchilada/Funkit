let express = require('express');
let session = require("express-session");
let bodyparser = require("body-parser");
let expressdb = require("express-mongo-db");

let parser = bodyparser.json();
let app = express();

app.set("view engine","ejs");


app.use(session({
        secret: "My Avalanche",
        resave: false,
        saveUninitialized:true
    }),
    express.static('static'),
    parser
);


app.use(expressdb('mongodb://localhost:27017/local'));

require("./routes/accounts")(app);
require("./routes/products")(app);
require("./routes/orders")(app);


let server = app.listen(4200, function () {
    console.log("Listening on port 4200...");
});
