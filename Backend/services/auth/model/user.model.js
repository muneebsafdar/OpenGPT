import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    FbUserId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    plan:{
      type:String,
      enum:["free","starter","pro"],
      default:"free"
    },
    credits:{
      type:Number,
      default:100
    },
    totalCredits:{
      type:Number,
      default:100
    },
    PlanExpiresAt:{
      type:Date,
      default:Date.now()
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;