const express=require("express");
const router=express.Router({mergeParams:true});
const {reviewSchema}=require("../schema");
const ExpressError=require("../utils/ExpressError");
const wrapAsync=require("../utils/wrapAsync");
const {isLoggedIn,isAuthor}=require("../middleware");
const reviewController=require("../controller/review");



const validateReview=(res,req,next)=>{
    let result=reviewSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error);
      }
       else{
          next();
       }
}

//REVIEWS
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));


//DELETE REVIEW ROUTE

 router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReview));


 module.exports=router;