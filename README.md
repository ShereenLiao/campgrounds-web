## Contents

The project contains the following:

```text
.
├── README.md
├── app.js
├── cloudinary
│   └── index.js
├── controllers
│   ├── campgrounds.js
│   ├── reviews.js
│   └── users.js
├── home3.ejs
├── middleware.js
├── models
│   ├── campground.js
│   ├── review.js
│   └── user.js
├── package-lock.json
├── package.json
├── public
│   ├── javascripts
│   │   ├── clusterMap.js
│   │   ├── showPageMap.js
│   │   └── validateForms.js
│   └── stylesheets
│       ├── app.css
│       ├── home.css
│       └── stars.css
├── routes
│   ├── campgrounds.js
│   ├── reviews.js
│   └── users.js
├── schema.js
├── seeds
│   ├── cities.js
│   ├── index.js
│   └── seedHelpers.js
├── utils
│   ├── ExpressError.js
│   ├── catchAsync.js
│   └── isLoggedIn.js
└── views
    ├── campgrounds
    │   ├── edit.ejs
    │   ├── index.ejs
    │   ├── new.ejs
    │   └── show.ejs
    ├── error.ejs
    ├── home.ejs
    ├── layouts
    │   └── boilerplate.ejs
    ├── partials
    │   ├── flash.ejs
    │   ├── footer.ejs
    │   ├── navbar.ejs
    │   └── searchBar.ejs
    ├── resume
    │   └── index.ejs
    └── users
        ├── login.ejs
        └── register.ejs
```
## API Routes Documentation
### Campground:
| HTTP Method | URL | Description|Input|Return
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Render the homepage |None|None
| `GET` | `/campgrounds/{campground_id}` | Get campground by campground_ID |'campground_id': string|campgroundModel Object
| `GET` | `/campgrounds` | Returns a list of all the campgrounds |None|campgroundModel Object
| `POST` | `/campgrounds` | Creates a new campground record in the database |{'title': string, 'location': string, 'price': numbser, 'author': User Object, geometry:{type:String,coorindates:[Number]},reviews:[Review Object]}|campgroundModel Object
| `PUT` | `/campgrounds/{campground_id}` | Updates/Modify a campground record in the database |{'title': string, 'location': string, 'price': numbser, 'author': User Object, geometry:{type:String,coorindates:[Number],images:[img]}
| `DELETE` | `/campgrounds/{campground_id}` | Delete the campground with the given id number |'campground_id': string|204 Status Code
|`GET`|`/campgrounds?title=<string:title>&locaion=<string:location>&<price:number>`|List campgrounds by title(optional), location(optional) and price(optional)|{'title':string,'location':string,'price':number}|CAMPGROUND Object

### User:
| HTTP Method | URL | Description|Input|Return
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/login `| Render the login page |None|None
| `POST` | `/login`| User login  |{'username':string,'password':string}|None
| `GET` | `/register`| Render the register page |None|None
| `POST` | `/register` | Creates a new user record in the database |{'username':string,'email':string,'passowrd':string}|REVIEW Object

### Reviews:
| HTTP Method | URL | Description|Input|Return
| :--- | :--- | :--- | :--- | :--- |
| `DELETE` | `/reviews` | Delete a reivew |{'body': String,'rating': Number,'author': User object}|None
| `POST` | `/reviews` | Creates a new review record in the database |{'body': String,'rating': Number,'author': User object}|Review Object

## Prerequisite Software Installation

This project uses Node.js(7.18.6)to provide a consistent repeatable disposable development environment.

You will need the following software installed:

- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)

All of these can be installed manually by clicking on the links above or you can use a package manager like **Homebrew** on Mac of **Chocolatey** on Windows.

## Bring up the development environment

To bring up the development environment you should clone this repo, change into the repo directory:

```bash
$ git clone git@github.com:ShereenLiao/CampWeb.git
$ cd CampWeb
$ npm install 
```

### Install dependent packages
```bash
$ npm install
```

## Runing the application
```bash
$ node app.js
```
You can change the port listened at file app.js. For example, if you change the port to 3000, you should be able to reach the service at: http://localhost:3000. 

## Shutdown development environment

If you are using node/nodemon, Press CTRL+ c (even on a Mac, especially on a Mac), or just call the process. exit() method to exit from the Node console. They will start up again the next time you need to develop as long as you don't manually delete them.


## What's featured in the project?


    * routes -- forward the supported requests using  Express 
    * views -- views (templates) to display those pages
    * controllers/users -- manager users using passport.js
    * models -- the data model using Mongoose
    * public/javascripts/*Map.js -- display campgrounds location and cluster map using MapBox
    * schema.js -- the data model for validation using Joi
    * cloudinary -- stored campgrounds images on clouds
    * middleware.js -- using middles to validate input data and user status
    * app.js -- handle sessions and cookies. Store data in MongoDB.
  