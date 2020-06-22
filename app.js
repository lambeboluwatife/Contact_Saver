const express         = require('express'),
      mongoose        = require('mongoose'),
      flash           = require('connect-flash'),
      session         = require('express-session'),
      methodOverride = require('method-override'),
      passport        = require('passport');

// Init app
const app = express();

// Passport config
require('./config/passport')(passport);

// DB COnfig
const db = require('./config/keys').database;

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// EJS
app.set("view engine", "ejs");

// Method Override
app.use(methodOverride("_method"));

// Mongoose Find and Modify
mongoose.set('useFindAndModify', false);


// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Static Folder
app.use(express.static(__dirname + "/public"));

// Express Session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Requiring Routes
app.use('/', require('./routes/index'));
app.use('/contacts', require('./routes/contacts'));
app.use("/users", require('./routes/users'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server Started at port ${PORT}`));
