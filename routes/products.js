
module.exports = (app) =>{


    app.get("/products",(req,res,next) =>{
        next();
    });

}