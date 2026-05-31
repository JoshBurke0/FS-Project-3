const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();

const drawingModel = require('./schema/drawingSchema')

// Middleware
app.use(cors());
app.use(express.json());

//personalized stuff goes below here vvv

app.post('/api/newDrawing', async (req, res) => {
  try{
    const drawing = new drawingModel({
      title: req.body.body.title,
      pixels: req.body.body.pixels
    });
    await drawing.save()
    const allDrawings = await drawingModel.find({})
    res.json(allDrawings)
  } catch (err){
    res.status(500).send(err)
  }
});

app.get('/api/getDrawings', async (req, res) => {
  try{
    const allDrawings = await drawingModel.find({})
    res.json(allDrawings)
  } catch (err){
    res.status(500).send(err)
  }
})

app.delete('/api/deleteDrawing/:id', async (req, res) => {
  try{
    const id = req.params.id //this grabs the id from the url, as it is '/:id'
    await drawingModel.findByIdAndDelete(id);
    const allDrawings = await drawingModel.find({})
    res.json(allDrawings)
    console.log('delete hit, id:', req.params.id)
  } catch (err){
    res.status(500).send(err)
  }
})

app.put('/api/editDrawing/:id', async (req, res) => {
  try{
    const id = req.params.id
    await drawingModel.findByIdAndUpdate(
      id,
      {pixels: req.body.body.pixels}
    )
    const allDrawings = await drawingModel.find({})
    res.json(allDrawings)
  } catch (err){
    res.status(500).send(err)
  }
});

// Database Connection
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log("DB Connection Error:", err));