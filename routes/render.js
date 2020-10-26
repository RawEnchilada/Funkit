module.exports = (objRepo,viewName)=>{
    return (req,res){
        res.render(viewName, res.locals);
    }
}