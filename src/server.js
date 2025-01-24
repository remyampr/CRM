const express=require("express");
const bodyParser=require('body-parser');
const customerRoutes=require('./routes/customerRoutes');
const mongoose=require('mongoose');
const errorHandler=require('./middleware/errorHandler');
const morgan = require("morgan");

 const app=express();
 const PORT=3030;


 app.use(morgan("dev"));
 app.use(bodyParser.json());

 app.use('/api/customers',customerRoutes);
 app.use(errorHandler);

mongoose.connect('mongodb://127.0.0.1:27017/customerdata',{
   useNewUrlParser: true,
   useUnifiedTopology: true,
})
.then(()=> console.log("connected to mongoDB ::"))
.catch((err) => {
   console.error("Failed to connect to MongoDB:", err);
 });


 app.listen(PORT,()=>{
    console.log(`server running at :  http://localhost:${PORT}` );
 })


