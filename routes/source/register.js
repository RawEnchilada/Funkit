module.exports = (req,res,next) => {
   let coll = req.db.collection('users');
   
    coll.insertOne({
        "username":req.body.username,
        "password":req.body.password,
        "account":"user",
        "sessionid":req.session.id
    });

   next();
}
