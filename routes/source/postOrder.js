const { ReplSet } = require("mongodb");

module.exports = (req,res,next) => {

   if(res.locals.sessionType != "guest"){
       
        let orders = req.db.collection('orders');
        let products = req.db.collection('products');
        
        products.find({}).toArray((er,docs)=>{
            docs.forEach((product)=>{
                if(product.name == req.body.product){
                    orders.insertOne({
                        "user":res.locals.username,
                        "name":req.body.name,
                        "product":product.name,
                        "email":req.body.email,
                        "address":req.body.address,
                        "amount":req.body.amount,
                        "price": (req.body.amount*product.price) 
                    });
                }
            });
            next();
        });       
                
   }
   else next();
}
