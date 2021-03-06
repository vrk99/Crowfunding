// importing modules
const express = require("express");
const mongoose = require("mongoose");
const passport = require('passport');
const session = require('express-session');
const methodOverride = require("method-override");

// passport config
require('./config/passport')(passport);

// connecting to database
mongoose.connect("mongodb://localhost:27017/fundraiser");

// setting up the app
const app = express();
app.use(methodOverride('_method'));
app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));

// adding body parser middleware
app.use(express.urlencoded({ extended: true }));

// express session
app.use(session({ secret: process.env.SECRET || 'secret', resave: true, saveUninitialized: true }));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// global variables
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});

// routes
app.get("/", (req, res) => res.render("landing"));
app.use("/student", require("./routes/students"));
app.use("/investor", require("./routes/investors"));
app.use("/invest", require("./routes/invest"));
app.use("/fundraiser", require("./routes/fundraiser"));
app.use("/fundraiser/:id/", require("./routes/review"));

// starting the server
app.listen(process.env.PORT || 3000, process.env.IP);