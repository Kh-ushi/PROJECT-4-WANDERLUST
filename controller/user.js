const User=require("../models/user");



module.exports.signUp=(req,res)=>{

    res.render("users/signup.ejs");

}

module.exports.signupReg=async (req,res)=>{

    try{
        let{username,email,password}=req.body;
    const newUser=new User({email,username});

    const registeredUser=await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
         if(err){
            return next(err);
         }
         req.flash("success","Welcome to Wanderlust");
         res.redirect("/listings");
    });
    }
    catch(err){
       req.flash("error",err.message);
       res.redirect("/signup");
    }

}

module.exports.login=async(req,res)=>{

    req.flash("success","Welcome Back To Wanderlust");
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
    
    }

 module.exports.logout=(req,res,next)=>{

    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("delete","You have succesfully logged out");
        res.redirect("/listings");
    })

}   