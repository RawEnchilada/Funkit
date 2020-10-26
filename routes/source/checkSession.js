
//returns session type from database if logged in
module.exports = (req,res,next) =>{
    //if session id belongs to user save to res.locals type: user, admin, guest

    let coll = req.db.collection('users');

    let type = "guest";
    console.log(Date.now()+"     type variable created");
    

    coll.find({}).toArray((er,docs)=>{
        docs.forEach((entry)=>{
            console.log(Date.now()+"     Checking session:\n       "+entry.username+"\n       "+entry.sessionid+"\n       "+req.session.id);
            if(entry.sessionid == req.session.id){
                console.log(Date.now()+"     actual value: "+entry.account+"\n");
                type = entry.account;
            }
        });
        res.locals.sessionType = type;
        next();
    });
    /*let query = { "sessionid":req.session.id};
    coll.findOne(query,(entry)=>{

        console.log(Date.now()+"     Checking session:\n       "+entry.username+"\n       "+entry.sessionid+"\n       "+req.session.id);
        console.log(Date.now()+"     actual value: "+entry.account+"\n");
        type = entry.account;
    });*/
}
