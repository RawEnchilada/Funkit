let checkSes = require("../../database/users/getTypeFromId")


module.exports = (req,res,next) =>{
    //if session id belongs to user save to res.locals type: user, admin, guest
    res.locals.sessionType = checkSes(req.session.id);
    next();
}