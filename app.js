import express from "express"
import { connectDB } from "./config/db.js"
import { router } from "./routes/authRoutes.js"
// import { adminRouter } from "./routes/adminRoutes.js"
// import { eventRouter } from "./routes/eventRoutes.js"
import "dotenv/config"
import  cors from "cors"

const app=express()
app.use(cors())


const PORT=process.env.PORT

app.use(express.json())
app.use("/api",router)
// app.use("/api/admin", adminRouter);

// / error handler
app.use(function (err, req, res, next) {

  const messageArray = err.message.split("::");
  if (messageArray.length > 1) {
    res.status(Number(messageArray[0])).json({
      status: false,
      response_code: Number(messageArray[1]),
      message: messageArray[2],
    });
  } else {
    res.status(500).json({
      status: false,
      response_code: 500,
      message:
        process.env.ENVIRONMENT == "production"
          ? "Validation failed."
          : messageArray[0],
    });
  }
});

app.listen(PORT,()=>{  
    connectDB()
    console.log(`Server is running on port ${PORT}`)
})

