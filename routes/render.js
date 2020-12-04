module.exports = (app)=>{


    app.use((req,res,next)=>{
        if(res.locals.permissions.includes(res.locals.sessionType)){
            console.log("rendering");
            res.render(res.locals.page,{locals: res.locals});
        }
        else{
            res.render("404",{locals: null});
        }

    });
}