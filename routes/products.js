
module.exports = (app) =>{

    app.get("/products",(req,res,next) =>{

        let coll = req.db.collection('products');
        
        coll.find({}).toArray((er,docs)=>{
            res.locals.table = new Array(docs.length);
            docs.forEach((entry)=>{
                res.locals.table.push(entry);
            });
        });

        
        next();
    });

}