const mongoose=require("mongoose");
const intidata=require("./data");
const Listing=require("../models/listing");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust1'); 
  }

  main()
  .then(()=>{
    console.log("connected to db");
  })
  .catch(err => console.log(err));

  const initDb= async()=>{
    await Listing.deleteMany({});
    intidata.sampleListings=intidata.sampleListings.map((obj)=>({
      ...obj,
      owner:'660802e5e4d4b205691b5569'
    }));
    
    await Listing.insertMany(intidata.sampleListings);
    console.log("data was initialized");
  }

  initDb();