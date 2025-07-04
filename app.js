import express from "express"
import { connectDB } from "./config/db.js"
import { router } from "./routes/authRoutes.js"
import "dotenv/config"
import  cors from "cors"

const app=express()
app.use(cors())


const PORT=process.env.PORT

app.use(express.json())
app.use("/api",router)


app.listen(PORT,()=>{  
    connectDB()
    console.log(`Server is running on port ${PORT}`)
})
