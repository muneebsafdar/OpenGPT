import express from "express";
import "dotenv/config";
import cors from "cors";
import conn from "./config/db.js";
import agentRouter from "./routes/agent.router.js";


const app = express();


app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use((error,req,res,next)=>{
  console.log(error)
  if(error.status){
    return res.status(400).json({
      success:false,
      message:error.message,
      code:error.code
    })
  }
  return res.status(500).json({
    success:false,
    message:error.message,  
    code:500
  })
})
app.use("/", agentRouter);

app.get("/health", (req, res) => {
  res.json({ message: `Agent Service is running on port ${process.env.PORT}` });
});


app.listen(process.env.PORT, async () => {
  await conn();
  console.log(`Agent Service is running on port ${process.env.PORT}`);
});