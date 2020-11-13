
module.exports = (app) =>{

    app.get("/products",(req,res,next) =>{

        let coll = req.db.collection('products');
        res.locals.table = 0;
        
        coll.find({}).toArray((er,docs)=>{
            res.locals.table = new Array(docs.length);
            let index = 0;
            docs.forEach((entry)=>{
                res.locals.table[index] = entry;
                index++;
            });            
            next();
        });
    });

}