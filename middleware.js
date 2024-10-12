module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.OriginalUrl;
        req.flash("error");
        return res.redirect("/login");
    }
    next();
};

module.exports.savedRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}