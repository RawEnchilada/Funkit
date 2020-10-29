
let login = require("./source/login");
let register = require("./source/register");
let logout = require("./source/logout");
let checkSession = require("./source/checkSession");

//Subscribe account handling middlewares
module.exports = (app) => {    

    app.use(checkSession);

    app.get("/getSession",(req,res,next) =>{
        console.log(Date.now()+"     get request:"+res.locals.sessionType);
        res.send(res.locals.sessionType);
    });

    app.post("/login/login",login);

    app.post("/login/register",register);

    app.use("/logout",logout);//does not call next

}
