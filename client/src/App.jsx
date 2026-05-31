import { useState, useEffect, useReducer } from 'react'
import './App.css'
import axios from 'axios'

export default function App(){

  const canvasWidth = 16
  const canvasSize = canvasWidth ** 2

  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [pixels, setPixels] = useState(Array(canvasSize).fill('white'))
  const [color, setColor] = useState('black')
  const [title, setTitle] = useState('')
  const [drawings, setDrawings] = useState([]) 
  // const [currentDrawing, SetCurrentDrawing] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [idToEdit, setIdToEdit] = useState('')
  const [brushType, SetBrushType] = useState('fill')

  useEffect(() =>{
    axios.get('http://localhost:5000/api/getDrawings')
    .then((response) =>{
      setDrawings(response.data)
    })
    .catch((err) => console.log(err))
  }, []);

  function handleSubmit() {

    if(isEditing == true){
      //editing
      console.log("editing drawing")
      
      const editedDrawing = {
      title: title,
      pixels: pixels
      };
      axios.put(`http://localhost:5000/api/editDrawing/${idToEdit}`, {
      'body': editedDrawing
      })
      .then((response) => {
      setDrawings(response.data)
      });

      setTitle("")
      setIsEditing(false)
    }
    else{
      const newDrawing = {
      title: title,
      pixels: pixels
      };
      axios.post('http://localhost:5000/api/newDrawing/', {
      'body': newDrawing
      })
      .then((response) => {
      setDrawings(response.data)
      });

      setTitle("")
    }
  }

  function loadDrawingForEdit(inputDrawing){
    setPixels(inputDrawing.pixels)
    setTitle(inputDrawing.title)
    setIsEditing(true)
    setIdToEdit(inputDrawing._id)
  }

  function deleteDrawing(idToDelete){

    axios.delete(`http://localhost:5000/api/deleteDrawing/${idToDelete}`)
    .then((response) => {
      setDrawings(response.data)
    });
  }

  function handleClear() {
    setPixels(Array(canvasSize).fill('white'))
  }

  function selectColor(color){
    return(
      setColor(color)
    )
  }

  function loadDrawing(inputPixels){
    setPixels(inputPixels)
    setIsEditing(false)
  }

  function brush(pixelIndex){
      const updatedPixels = pixels.map((pixel, index) => {
        if(index === pixelIndex)
          return color
        else
          return pixel
      });
      setPixels(updatedPixels)
  }

  function paint(pixelIndex, clickedColor, rowIndex){
    if(brushType === 'brush'){
      brush(pixelIndex)
    }
    else{
      // fill(pixelIndex, clickedColor, rowIndex)
      floodFill(pixelIndex, clickedColor, rowIndex)
    }
  }

  function fill(clickedPixelIndex, clickedColor, clickedRow){
    console.log("attempting flood fill")
    const pixelsToFill = [...pixels]
    let pixelsToCheck = [clickedPixelIndex]

    for(let i = 0; i < 1000; i++){
      const item = pixelsToCheck.shift()
      console.log("item:", item)
      if (pixelsToFill[item] === clickedColor){
        pixelsToFill[item] = color  
        pixelsToCheck.push(item + 1)
        pixelsToCheck.push(item - 1)
        pixelsToCheck.push(item + canvasWidth)
        pixelsToCheck.push(item - canvasWidth)

      }
    }
    setPixels(pixelsToFill)
  }

  // function fill(clickedPixelIndex, clickedColor, clickedRow){
  //   console.log('attempting fill')
  //   const pixelsToFill = [...pixels]
  //   let prevPixelsToFill = [...pixels]
  //   console.log(pixelsToFill)

    
  //   //rows below:

  //   for(let a=clickedRow; a<16; a++){

  //     console.log("beginning new loop")
  //     console.log(`clicked row: ${clickedRow}`)

  //   const startOfRow = a * canvasWidth
  //   const endOfRow = canvasWidth * (a + 1)

  //     for (let i=clickedPixelIndex+(a-clickedRow)*canvasWidth; i < endOfRow; i++){
  //       console.log("a:",a)
  //       console.log("clickedPixelIndex:", clickedPixelIndex)
  //       console.log("i:", clickedPixelIndex +(a-clickedRow)*canvasWidth)
  //       if(pixels[i] === clickedColor){
  //         pixelsToFill[i] = color
  //         console.log('attempting brush')
  //       }
  //       else{
  //         break;
  //       }
  //     }
      
      //Fill pixels to the left
  //   xx

  return(
    <>
      <div id='wrapper'>
        <div id='drawingFrame'>
          <div id='drawingSection'>
            <div id='toolbar'>
              <ColorPallet
              selectColor={selectColor}/>
            </div>
            <div id='canvasSection'>
              <div id='canvasFrame'>
                <CanvasPixel 
                pixels={pixels} 
                canvasWidth={canvasWidth} 
                canvasSize={canvasSize} 
                paint={paint}
                color={color}
                fill={fill}
                brushType={brushType}/>
              </div>
            </div>
          </div>
          <div id='titleFrame'>
            <h1>Title: </h1>
            <TitleInput
            setTitle={setTitle}
            title={title}/>
            <Button
            // title='Save'
            title={isEditing === false ? 'Save' : 'Update' }
            func={handleSubmit}
            color='Blue'/>
            <Button
            title='Clear'
            func={handleClear}
            color='red'/>
          </div>
        </div>
        <div id='saveFrame'>
          <div id='saveFrameTitle'>
            <h1>Load Drawings</h1>
          </div>
          <div id='saveList'>
            <SavedDrawings
            drawings={drawings}
            loadDrawing={loadDrawing}
            loadDrawingForEdit={loadDrawingForEdit}
            deleteDrawing={deleteDrawing}/>
          </div>
        </div>
      </div>
    </>
  )
}

  function CanvasPixel( {pixels, paint, canvasWidth, canvasSize, color} ){
    
    const rows=[]
    for (let i = 0; i < canvasSize; i += canvasWidth){
      rows.push(
        <div key={`row-${i}`} className='pixelRow'
        style={{height: `${100/canvasWidth}%`}}>
          {pixels.slice(i, i + canvasWidth).map((pixel, index) => (
          <button key={`pixel-${index + i}`} 
          style={{ 
          backgroundColor: pixel === color ? color : pixel,
          width: `${100/canvasWidth}%`}}
          onClick={() => paint(index + i, pixel, i/canvasWidth)}
          className='pixel'>
            &nbsp;
            </button>))}
        </div>)
    }
    return(
      <>{rows}</>
    )
  }

  function ColorPallet({ selectColor }){
    const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'black', 'white']
    
    return(
      colors.map((color) => 
      <button 
        style={{backgroundColor: color}} 
        className='color'
        key={color}
        onClick={()=>selectColor(color)}>
      </button>
    )
    )
  }

  function TitleInput({ title, setTitle }){
    return(
      <input 
      type='text' 
      id='titleInput'
      value={title}
      onChange={(e)=>setTitle(e.target.value)}
      ></input>
    )
  }

  function Button({ title, func, color}){
    return(
      <button 
      className='titleButton'
      style={{backgroundColor: color}}
      onClick={func}
      >{title}</button>
    )
  }

  function SavedDrawings({ drawings, loadDrawing, deleteDrawing, loadDrawingForEdit }){
    return(
      <>
        {drawings.map((drawing, index) => (
          <div key={`${drawing.title}-${index}`}>
            <h3>{drawing.title}</h3>
            <button
            onClick={() => (loadDrawing(drawing.pixels))}
            >Load</button>
            <button
            onClick={() => (loadDrawingForEdit(drawing))}
            >Edit</button>
            <button
            onClick={() => (deleteDrawing(drawing._id))}
            >Delete</button>
          </div>
        ))}
      </>
    )
  }