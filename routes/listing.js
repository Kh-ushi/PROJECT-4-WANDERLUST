const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const {listingSchema}=require("../schema");
const ExpressError=require("../utils/ExpressError");
const Listing=require("../models/listing");
const{isLoggedIn,isOwner}=require("../middleware");
const multer  = require('multer');
const {storage}=require("../cloudConfig");
const upload = multer({ storage});


//MVC
const{indexRoute,newRoute,showRoute,createRoute,editRoute,updateRoute,deleteRoute}=require("../controller/listings");



//SERVER SIDE VALIDATION
const validateListing=(res,req,next)=>{
    let result = listingSchema.validate(req.body);
    if(result.error){
      throw new ExpressError(400,result.error);
    }
     else{
        next();
     }
}

//INDEX AND CREATE ROUTE
router.route("/")
.get(wrapAsync(indexRoute))
.post(isLoggedIn,upload.single('listing[image][url]'),validateListing,wrapAsync(createRoute));

//SEARCH BAR
router.get("/",(req,res)=>{
     res.redirect("/listings);
});

router.post("/searchDest",wrapAsync(async (req,res)=>{
   
  let searchData=req.body.listing.country;
  
  let dataSearch=await Listing.find({country:searchData});
  
  res.render("listings/index.ejs",{dataSearch});
  
  }));

//NEW ROUTE
router.get("/new",isLoggedIn,newRoute);

//SHOW UPDATE DELETE
router.route("/:id")
.get(wrapAsync(showRoute))
.put(isLoggedIn,isOwner,upload.single('listing[image][url]'),validateListing, wrapAsync(updateRoute))
.delete(isLoggedIn,isOwner,wrapAsync(deleteRoute));


 //EDIT ROUTE
 router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(editRoute));

 module.exports=router;
