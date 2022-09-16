const User = require('../models/user');

// **********************************************
// INDEX - renders the register page
// **********************************************
module.exports.renderRegister=(req, res) => {
    res.render('users/register');
};

// **********************************************
// CREATE - creates a new user
// **********************************************
module.exports.createUser=async (req, res, next) => {
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
};

// **********************************************
// INDEX - renders the login page
// **********************************************
module.exports.renderLogin=(req, res) => {
    // console.log('***************************************')
    // console.log('in the login: ',req.session.returnTo)
    // console.log('***************************************')
    res.render('users/login');
};

// **********************************************
// LOGIN - login to the web
// **********************************************
module.exports.login = (req, res) => {
    //set secret source = keepSessionInfo: true, so that one can be redirected to returnTo page
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

// **********************************************
// LOGOUT - logout from the web
// **********************************************
module.exports.logout=(req, res,next) => {
    //The other major change is that that req.logout() is now an asynchronous function, whereas previously it was synchronous. 
    req.logout(function (err) {
        if (err) { r
            return next(err); 
        }
        req.flash('success', "Goodbye!");
        res.redirect('/campgrounds');
    });
};