const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { application } = require('express');
const isLoggedIn = require('../utils/isLoggedIn');

// **********************************************
// INDEX - renders the register page
// **********************************************
router.get('/register', (req, res) => {
    res.render('users/register');
});
// **********************************************
// CREATE - creates a new user
// **********************************************
router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        //After register a user, login for that user.
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

// **********************************************
// INDEX - renders the login page
// **********************************************
router.get('/login', (req, res) => {
    console.log('***************************************')
    console.log('in the login: ',req.session.returnTo)
    console.log('***************************************')
    res.render('users/login');
});

// **********************************************
// LOGIN - login to the web
// **********************************************
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login',keepSessionInfo:true }), (req, res) => {
    //set secret source = keepSessionInfo: true, so that one can be redirected to returnTo page
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

// **********************************************
// LOGOUT - logout from the web
// **********************************************
router.get('/logout', (req, res,next) => {
    //The other major change is that that req.logout() is now an asynchronous function, whereas previously it was synchronous. 
    req.logout(function (err) {
        if (err) { r
            return next(err); 
        }
        req.flash('success', "Goodbye!");
        res.redirect('/campgrounds');
    });
});

module.exports = router;