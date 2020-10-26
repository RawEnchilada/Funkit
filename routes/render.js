module.exports = (app)=>{


    app.use((req,res,next)=>{
        res.render(res.locals.page,res.locals);
        }
    );


}