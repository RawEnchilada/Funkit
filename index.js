let express = require('express');
let session = require("express-session");
let bodyparser = require("body-parser");

let parser = bodyparser.json();
let app = express();

app.use(session({
        secret: "My Avalanche",
        resave: false,
        saveUninitialized:true
    }),
    express.static('static'),
    parser
);
app.get("/",(req,res,next)=>{
    console.log("GET request");
    next();
});
app.post("/",(req,res,next)=>{
    console.log("POST request");
    next();
});
require("./routes/accounts")(app)
require("./routes/products")(app)
require("./routes/orders")(app)


let server = app.listen(4200, function () {
    console.log("Listening on port 4200...");
});
