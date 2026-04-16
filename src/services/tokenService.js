import express from 'express'
import cors from 'cors'
import postRoutes from './routes/postRoutes.js'
import commentRoutes from './routes/commentRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('API MySQL funcionando 🚀')
})

app.use(postRoutes)
app.use(commentRoutes)

app.listen(3000, () => {
  console.log('🚀 Servidor rodando em http://localhost:3000')
})