module.exports = (app)=>{


    app.use((req,res,next)=>{
        console.log("rendering");
        res.render(res.locals.page,{locals: res.locals});
        }
    );


}