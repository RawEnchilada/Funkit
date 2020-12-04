
//returns session type from database if logged in
module.exports = (req,res,next) =>{
    //if session id belongs to user save to res.locals type: user, admin, guest

    let coll = req.db.collection('users');

    let type = "guest";

    coll.find({}).toArray((er,docs)=>{
        docs.forEach((entry)=>{
            if(entry.sessionid == req.session.id){
                type = entry.account;
                res.locals.username = entry.username;
            }
        });
        res.locals.sessionType = type;
        next();
    });
}
