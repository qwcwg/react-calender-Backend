import express from "express"
import mysql from "mysql2"
import cors from "cors"
import dotenv from "dotenv";

dotenv.config()
const app = express()
const PORT = 8001

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASS,
  database: 'test_schedule_1'
})

app.use(express.json())
app.use(cors())


app.get('/', (req, res) => {
  res.json("test!!")
})


app.get('/schedule', (req, res) => { 
  const sql = 'SELECT id, writer_id, date_format(schedule_date, "%Y-%m-%d") as schedule_date , content, title, create_time FROM schedules'

  db.query(sql, (err, data) => {
    if(err) return res.json(err)
    return res.json(data)
  })
})


app.get('/schedule/:id', (req, res) => { 
  const scheduleID = req.params.id
  const sql = 'SELECT * FROM schedules WHERE id= ? ' 

  db.query(sql, [scheduleID], (err, data) => {
    if(err) return res.json(err)
    return res.json(data)
  })
})


app.post('/schedule', (req, res) => {
  const sql = 'INSERT INTO schedules (`writer_id`, `schedule_date`, `content`, `title`, `create_time`) VALUES (?)'
  const values = [
    req.body.writer_id,
    req.body.schedule_date,
    req.body.content,
    req.body.title,
    new Date()
  ]

  db.query(sql, [values], (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})


app.put('/schedule/:id', (req, res) => {
  const scheduleID = req.params.id
  const sql = 'UPDATE schedules SET `writer_id`=?, `schedule_date`=?, `content`=?, `title`=? WHERE id= ?'
  const values = [
    req.body.writer_id,
    req.body.schedule_date,
    req.body.content,
    req.body.title,
  ]

  db.query(sql, [...values,scheduleID], (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})


app.delete("/schedule/:id", (req, res) => {
  const scheduleID = req.params.id
  const sql = "DELETE FROM schedules WHERE id= ? "

  db.query(sql, [scheduleID], (err, data) => {
    if (err) return res.send(err)
    return res.json(data)
  })
})


app.listen(PORT, () => {
  console.log(`listen at ${PORT}!!!`)
})
