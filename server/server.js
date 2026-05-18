const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();

const taskModel = require('./schema/taskSchema')

// Middleware
app.use(cors());
app.use(express.json());


app.get('/api/getTasks', async (req, res) => {
  try{
    const allTasks = await taskModel.find({})
    res.json(allTasks)
  } catch (err){
    res.status(500).send(err)
  }

  
})

app.post('/api/newTask', async (req, res) => {
  try{
    const task = new taskModel({
      title: req.body.body.title,
      desc: req.body.body.desc,
      date: req.body.body.date,
      priority: req.body.body.priority
    });

    await task.save()

    const allTasks = await taskModel.find({})

    res.json(allTasks)

  } catch (err){
    res.status(500).send(err)
  }
});

app.delete('/api/deleteTask/:id', async (req, res) => {
  try{
    const id = req.params.id //this grabs the id from the url, as it is '/:id'
    await taskModel.findByIdAndDelete(id);

    const allTasks = await taskModel.find({})
    res.json(allTasks)
  } catch (err){
    res.status(500).send(err)
  }
})


// Database Connection
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log("DB Connection Error:", err));