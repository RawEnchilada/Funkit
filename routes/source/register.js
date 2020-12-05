module.exports = (req,res,next) => {
    let coll = req.db.collection('users');

    if(req.body.username != "" && req.body.password != ""){   
        coll.countDocuments().then((count)=>{
            if(count === 0){
                coll.insertOne({
                    "username":req.body.username,
                    "password":req.body.password,
                    "account":"admin",
                    "sessionid":req.session.id
                });
            }
            else{
                coll.insertOne({
                    "username":req.body.username,
                    "password":req.body.password,
                    "account":"user",
                    "sessionid":req.session.id
                });
            }
            next();
        });
    }
    else next();
    
}
