const { ReplSet } = require("mongodb");

module.exports = (req,res,next) => {

   if(res.locals.sessionType == "admin"){
        let products = req.db.collection('products');
        
        products.insertOne({
            "image":req.body.image,
            "name":req.body.name,
            "description":req.body.description,
            "price":req.body.price
        }).then(next);     
                
   }
   else next();
}
