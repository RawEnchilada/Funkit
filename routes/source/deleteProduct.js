const { ReplSet } = require("mongodb");
let ObjectId = require('mongodb').ObjectId; 

module.exports = (req,res,next) => {

   if(res.locals.sessionType == "admin" && req.body.id != undefined){
       
        let coll = req.db.collection('products');        
        
        coll.deleteOne({"_id": ObjectId(req.body.id)}).then(next);
   }
   else next();
}
