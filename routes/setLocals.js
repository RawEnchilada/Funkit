module.exports = (app)=>{
    app.use("/", (req,res,next)=>{
        res.locals.page = "home";
        next();
    });
    app.use("/orders", (req,res,next)=>{
        res.locals.page = "orders";
        next();
    });
    app.use("/products", (req,res,next)=>{
        res.locals.page = "products";
        next();
    });
    app.use("/login", (req,res,next)=>{
        res.locals.page = "login";
        next();
    });

}