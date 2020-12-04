module.exports = (app)=>{
    app.use("/", (req,res,next)=>{
        res.locals.page = "home";
        res.locals.permissions = ["guest","user","admin"];
        next();
    });
    app.use("/orders", (req,res,next)=>{
        res.locals.page = "orders";
        res.locals.permissions = ["user","admin"];
        next();
    });
    app.use("/products", (req,res,next)=>{
        res.locals.page = "products";
        res.locals.permissions = ["guest","user","admin"];
        next();
    });
    app.use("/login", (req,res,next)=>{
        res.locals.page = "login";
        res.locals.permissions = ["guest"];
        next();
    });
    app.use("/order", (req,res,next)=>{
        res.locals.page = "order";
        res.locals.permissions = ["user","admin"];
        next();
    });
    app.use("/addproduct", (req,res,next)=>{
        res.locals.page = "product";
        res.locals.permissions = ["admin"];
        next();
    });

}