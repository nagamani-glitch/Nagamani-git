import cors from 'cors'
import express from "express"
import connectDB from './config/db.js'
import dotenv from 'dotenv'
import employeesRouter from './routes/employeesRouter.js'
import authRouter from './routes/authRouter.js'
import profileRouter from './routes/profileRouter.js'
import contractRouter from './routes/contractRouter.js'

dotenv.config()
connectDB()
const app = express()

app.use(cors({
    origin:"*",
    methods:["GET", "POST", "PUT", "DELETE"],
    credentials:true,
}))

app.use(express.json())

app.use('/api/employees', employeesRouter)
app.use('/api/auth', authRouter)
app.use('/api/profiles', profileRouter)
app.use('/api/contracts', contractRouter);


const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running on port ${PORT}`.yellow.bold))