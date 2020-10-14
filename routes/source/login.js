let login = require("../../database/users/tryLogin");

module.exports = (req,res,next) => {
    /*
    if session is guest
    if for each database entry username and password is correct
    save session id
    */
    console.log("\nUser trying to login with information: \nSession ID = "+req.session.id);
    console.log(req.body);

   if(res.locals.sessionType == "guest"){
       if(login(req.body.username,req.body.password,req.session.id) == "Failed"){
           console.log("Login failure");
           next("Login failure.");
       }
   }
   res.send(res.locals.sessionType);
}
                                         