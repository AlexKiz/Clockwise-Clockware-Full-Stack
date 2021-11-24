import express from 'express'
import cityRouter  from './routes/city.router'
import masterRouter from './routes/master.router'
import orderRouter from './routes/order.router'
import userRouter from './routes/user.router'
import login from './routes/auth.router'
import adminRouter from './routes/admin.router'
import cors from 'cors'
import path from 'path'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({exposedHeaders: 'Authorization',}),)
app.use(express.static(`${__dirname}/../client/build`))
app.use(express.json())


app.use('/api', cityRouter)
app.use('/api', masterRouter)
app.use('/api', orderRouter)
app.use('/api', userRouter)
app.use('/api', adminRouter)
app.use('/api', login)

app.get('/*', function(req, res) {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'))
})

app.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT} `)
})

