let logout = require("../../database/users/tryLogout");

module.exports = (req,res,next) =>{


    console.log("\nUser trying to logout with Session ID = "+req.session.id);

    if(res.locals.sessionType != "guest"){
        if(logout(req.session.id) == "Failed"){
            console.log("Logout failure");
            next("Logout failure.");
        }
    }
    res.send(res.locals.sessionType);
}