import mongoose from "mongoose";

const billingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    orderId:{
        type:String,
        required:true
    },
    paymentId:{
        type:String,
        required:true
    },
    amount:Number,
    currency:{
        type:String,
        default:"PKR"
    },
    credits:{
        type:Number,
        required:true
    },
    plan:{
        type:String
    },
    status:{
        type:String,
        enum:["paid","pending","failed"],
        default:"pending"
    }
  },
  { timestamps: true }
);

const Billing = mongoose.model("Billing", billingSchema);
export default Billing;