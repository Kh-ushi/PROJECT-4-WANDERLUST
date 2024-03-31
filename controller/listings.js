

const Listing=require("../models/listing"); 

module.exports.indexRoute=async (req,res)=>{

    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    

}


module.exports.newRoute=(req,res)=>{
    res.render("listings/new.ejs");
 }


module.exports.showRoute=async(req,res)=>{

    let {id}=req.params;
    const dataId=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!dataId){
        req.flash("error","Listing You Are Trying to Access Does Not Exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{dataId});

}

module.exports.createRoute=async (req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image.url=url;
    newListing.image.filename=filename;
    await newListing.save();
    req.flash("success","New Listing Has Been Added SuccessFully");
    res.redirect("/listings");
        
    }

  
 module.exports.editRoute=async(req,res)=>{
    
    let{id}=req.params;
    const dataId=await Listing.findById(id);
    if(!dataId){
        req.flash("error","Listing You Are Trying to Access Does Not Exist");
        res.redirect("/listings");
    }

    let originalUrl=dataId.image.url;
    originalUrl=originalUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{dataId,originalUrl});

} 

module.exports.updateRoute=async (req,res)=>{

    
    let{id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,req.body.listing);

    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;     
    listing.image.url=url;
    listing.image.filename=filename;
    await listing.save();
    }
    
    req.flash("success","Listing Has Been Edited SuccessFully");

    res.redirect(`/listings/${id}`);

}

module.exports.deleteRoute=async (req,res,next)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("delete","Listing has been deleted Successfully");
    res.redirect("/listings");

}