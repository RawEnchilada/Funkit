
//if given password and username match, store session id in database and log the user in
module.exports = (req,res,next) => {
    /*
    if session is guest
    if for each database entry username and password is correct
    save session id
    */

    console.log("\nUser trying to login with information: \nSession ID = "+req.session.id);
    console.log(req.body);

   if(res.locals.sessionType == "guest"){
       
        let coll = req.db.collection('users');

        
        coll.find({}).toArray((er,docs)=>{
            docs.forEach((entry)=>{
                if(entry.username == req.body.username && entry.password == req.body.password){
                    coll.updateOne(entry, {$set: {
                        "username":entry.username,
                        "password":entry.password,
                        "account":entry.account,
                        "sessionid":req.session.id
                    }},
                    (eerr,result)=>{
                        console.log(eerr);
                    });
                }
            });
        });
                
   }
   next();
}
