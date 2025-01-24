const  mongoose  = require("mongoose");
const customerSchema= new mongoose.Schema({
    name: { type: String, required: true },
email: { type: String, required: true, unique: true },
phone: { type: String, required: false },
location: { type: String, required: false },
isActive: { type: Boolean, default: true },
});
customerSchema.index({name:1});
customerSchema.index({email:1});
customerSchema.index({location:1});

const Customer=mongoose.model('Customer',customerSchema);
module.exports=Customer;
