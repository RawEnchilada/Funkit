const { ReplSet } = require("mongodb");
let ObjectId = require('mongodb').ObjectId; 

module.exports = (req,res,next) => {

   if(res.locals.sessionType != "guest" && req.body.id != undefined){
       
        let coll = req.db.collection('orders');        
        

        if(res.locals.sessionType == "admin"){
            coll.deleteOne({"_id": ObjectId(req.body.id)});
        }                
        else{
            coll.deleteOne({"_id": ObjectId(req.body.id),"user": res.locals.username});
        }
   }
   next();
}
