const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate  = require("ejs-mate");
const { listingSchema } = require("./schema.js");
const review = require("./models/review.js");
const { Cookie } = require("express-session");

const passport= require("passport");
const LocalStrategy = require("passport-local");
const User= require("./models/user.js");
const { error } = require("console");

const sessionOptions ={
  sevret: "mypass",
  resave:false,
  saveUninitialized: true,
  Cookie:{
    expires:Date.now() + 7 * 24* 60* 60*1000,
    maxAge:  7 * 24* 60* 60*1000,
    httpOnly: true,
  },

};
app.use(session(sessionOptions));
app.use(flash());
app.use((req,res, next) => {
  res.locals.success = req.flash("success");
  next();
})

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

//Authentication 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new  LocalStrategy(User.authenticate()));

app.get("/demouser" , async(req, res) => {
  let fakeUser = new User({
    email: "studentEmailId",
    username: "apnacollehe"
  });
  let registeedUser= await User.register(fakeUser, "password"); //check uniqueness 
})
// ---------
Router.get("/signup", (req,res) => {
    res.render("user/signup.ejs");  //didnit make signup page
});
Router.post("/signup", async(req,res) => {
  try{
    let { username, email,password } = req.body;
    const newUser = new User({email,username});
    const registeedUser = await User.register(newUser, password);
    console.log(registeedUser);
    //--auto signup
    req.login(registeedUser, (err) => {
      if(err){
        return next(err);
      }
    })
  }
  //  req.flash("success", " Welcome to WanderLust");
  catch(e){
    req.flash("error", e.message);
    res.redirect("/listings");
  }

});
//password.authenticate() used for authentication m
Router.post("/login" , password.authenticate("local", { failureRedirect: true}) , async(req,res) => {
   res.send("welcome");
   let redirectUrl = res.locals.redirectUrl || "/listings";
   res.redirect(redirectUrl);
});


//new  isauthuntentication  implemented as middleware
Router.get("/new", (req,res) => {
  if(!req.isAuthenticated()){
    req.flash("error");
    res.redirect("/login");
  }res.render("listings/new.ejs");
});

//logout
Router.get("/logout", (req,res,next) => {
  req.logout((error) => {
    if(err){
      m=next(err);
    }
    req.flash('success');
    res.redirect("/listings");
  })
})
// ---------


//Index Route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
  .populate("reviews")
  .populate("owner"); //populate is used to show obj info not id
  res.render("listings/show.ejs", { listing });
});

//Create Route + err handling
app.post("/listings",wrapAsync (async (req, res ,next) => {
    let result = listingSchema.validate(req.body);
    console.log(result);
    if(result.err){
      throw new expressErr(400, result.err)
    }
      const newListing = new Listing(req.body.listing);
      await newListing.save();
      req.flash("success", "new listing created"); //new prompted
      res.redirect("/listings");
    
    })
);

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//Update Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  // let listing = await Listing.findById(id);
  // if(!listing.owner._id.equals(currUser._id)){   // check if authorized or not
  //   req.flash("error");
  //   res.redirect(`/listings/${id}`);
  // }
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

//Review
app.post("/listings/:id/reviews", async(req,res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new review(req.body.review);
  listing.Reviews.push(newReview);
  await newReview.save();
  await listing.save();
  // console.log("new review");
  // res.send("new review");
  res.redirect(`/listings/${listing._id}`);

});

//delete review
app.delete("/listings/:id/reviews/:reviewsId",
  wrapAsync(async (req,res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {review: reviewId}});
    await review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  })
)
//server side err handling  act as a middleware
app.use((err,req,res,next) => {
  res.send("something went wrong");
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
