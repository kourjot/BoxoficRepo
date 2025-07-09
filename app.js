import express from "express"
import "dotenv/config"
import  cors from "cors"
import { connectDB } from "./config/db.js"
import { router } from "./routes/authRoutes.js"
import { adminRouter } from "./routes/adminRoutes.js"
import { eventRouter } from "./routes/eventRoutes.js"
import { errorHandler } from "./middleware/globalErrorHandler.js"
import {teamLeadRoutes} from "./routes/teamLeadRoutes.js";
import { stageRouter } from "./routes/stageRoutes.js";
import { pipelineRouter } from "./routes/pipelineRoutes.js";

import { dealRouter } from "./routes/dealRoutes.js";

const app=express()
app.use(cors())


const PORT=process.env.PORT

app.use(express.json())
app.use("/api",router)
app.use("/api/admin", adminRouter);

app.use("/api/event", eventRouter);

app.use("/api/teamLead", teamLeadRoutes);

app.use("/api/stage", stageRouter);

app.use("/api/pipeline", pipelineRouter);

app.use("/api/deal", dealRouter);
app.get("/",async(req,res)=>{
    res.status(200).json({
        message:"Welcome to BoxOfic Backend"
    })
})

app.use(errorHandler)

app.listen(PORT,()=>{  
    connectDB()
    console.log(`Server is running on port ${PORT}`)
})

