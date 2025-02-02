const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemas.js')
const {isLoggedIn} = require('../middleware.js')

const validateCampground = (req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
         const msg = error.details.map(el=>el.message).join(',');
         throw new ExpressError(msg,400)
    }else{
     next();
    }
  }

// Display all campgrounds
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
  }));
  
  // Form to create a new campground
  router.get('/new',isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
  });
  
  // Create a new campground
  router.post('/',isLoggedIn ,validateCampground, catchAsync(async (req, res,next) => {
      // if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400)
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success','Successfully made a new campground!')
    res.redirect(`/${campground._id}`);
  }));
  
  // Show details of a single campground
  router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    console.log(campground);
    if (!campground) {
      req.flash('error', 'Campground not found');
      return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground});
  }));
  
  // Form to edit an existing campground
  router.get('/:id/edit',isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds')
      }
    res.render('campgrounds/edit', { campground });
  }));
  
  // Update a campground
  router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    if (!campground) {
      return res.status(404).send('Campground not found');
    }
    req.flash('success','Successfully updated the campground!')
    res.redirect(`/${campground._id}`);
  }));
  
  // Delete a campground
  router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted the campground!')
    res.redirect('/');
  }));
  
  module.exports = router;