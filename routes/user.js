const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync");
const passport=require("passport");
const{saveRedirect}=require("../middleware");

const userController=require("../controller/user");

router.get("/signup",userController.signUp);

router.post("/signup",wrapAsync(userController.signupReg));


router.get("/login",(req,res)=>{

    res.render("users/login.ejs");
});


router.post("/login",saveRedirect,passport.authenticate('local',{ failureRedirect: '/login',failureFlash:true }),userController.login);

router.get("/logout",userController.logout);


module.exports=router;