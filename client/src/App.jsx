import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

export default function App(){

  const canvasWidth = 5
  const canvasSize = canvasWidth ** 2

  const [pixels, setPixels] = useState(Array(canvasSize).fill('0'))
  const [color, setColor] = useState('black')

  function selectColor(color){
    return(
      setColor(color),
      console.log(color)
    )
  }

  function paint(pixelIndex){
    const updatedPixels = pixels.map((pixel, index) => {
      if(index === pixelIndex)
        // if(pixel != 0)
        //   return 0
        // else
        //   return 1
        return color
      else
        return pixel
    });
    setPixels(updatedPixels)
  }

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
                color={color}/>
              </div>
            </div>
          </div>
          <div id='titleFrame'>
            <h1>Title: </h1>
            <input type='text' id='titleInput'></input>
            <button className='titleButton'>Save</button>
            <button className='titleButton'>Clear</button>
          </div>
        </div>
        <div id='saveFrame'>
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
          // backgroundColor: pixel === 1 ? 'black' : 'white',
          backgroundColor: pixel === color ? color : pixel,
          width: `${100/canvasWidth}%`}}
          onClick={() => paint(index + i)}
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
        style={{backgroundColor: color}} className='color'
        onClick={()=>selectColor(color)}>
      </button>
    )
    )
  }