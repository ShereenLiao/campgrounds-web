module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        console.log('************')
        console.log('set the return to',req.session.returnTo);
        console.log('************')
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}