const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const Joi = require('joi')
const {campgroundSchema, reviewSchema} = require('./schemas.js')
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash')
const Campground = require('./models/campground');
const Review = require('./models/review');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')

// Connect to MongoDB

mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('Connection error:', err));

// Set up EJS engine and views directory
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
  secret: 'thisshouldbeasecret',
  resave: false,
  saveUninitialized: true,
  cookie:{
    httpOnly: true,
    expires: Date.now() + 1000*60*60*24*7,
    maxAge: 1000*60*60*24*7
  }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.currentUser= req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

const validateCampground = (req,res,next)=>{
   const {error} = campgroundSchema.validate(req.body);
   if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400)
   }else{
    next();
   }
}

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
      const msg = error.details.map(el => el.message).join(', ');
      throw new ExpressError(msg, 400);
  } else {
      next();
  }
};

app.use('/',userRoutes)
app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)

// Routes
app.get('/', (req, res) => {
  res.render('Home');
});



app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('Page not found!',404))
})

app.use((err,req,res,next)=>{
    const{statusCode = 500} = err;
    if(!err.message) err.message = 'Oh no, something went wrong.'
    res.status(statusCode).render('error',{err})
})

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
