
let deleteOrder = require("./source/deleteOrder");
let postOrder = require("./source/postOrder");

module.exports = (app) =>{

    app.get("/orders",(req,res,next) =>{
        let coll = req.db.collection('orders');
        res.locals.table = 0;
        
        coll.find({}).toArray((er,docs)=>{
            res.locals.table = new Array(0);
            docs.forEach((entry)=>{
                if(res.locals.username == entry.user || res.locals.sessionType == "admin"){
                    res.locals.table.push(entry);
                }
            });            
            next();
        });
    });

    app.get("/order",(req,res,next) =>{
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

    app.post("/deleteOrder",deleteOrder);
    app.post("/postOrder",postOrder);

}