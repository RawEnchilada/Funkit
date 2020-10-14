

module.exports = (app) =>{

    app.get("/orders/:userid/",(req,res,next) =>{
        //if userid is admin, return all orders
        //else if userid is buyer return own orders
        //else redirect to index
        next();
    });

}