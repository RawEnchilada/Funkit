
let login = require("./source/login");
let logout = require("./source/logout");
let checkSession = require("./source/checkSession");

module.exports = (app) => {

    

    app.use(checkSession);

    app.get("/getSession",(req,res,next) =>{
        console.log(Date.now()+"     get request:"+res.locals.sessionType);
        res.send(res.locals.sessionType);
    });

    app.post("/login.html/login",login);

    app.post("/logout",logout);

}