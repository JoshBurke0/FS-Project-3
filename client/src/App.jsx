import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

export default function App(){

  const canvasWidth = 8
  const canvasSize = canvasWidth ** 2

  const [pixels, setPixels] = useState(Array(canvasSize).fill(0))


  function paint(pixelIndex){
    const updatedPixels = pixels.map((pixel, index) => {
      if(index === pixelIndex)
        if(pixel != 0)
          return 0
        else
          return 1
      else
        return pixel
    });
    setPixels(updatedPixels)
  }

  return(
    <>
      <div id='wrapper'>
        <div id='canvasFrame'>
          <CanvasPixel 
          pixels={pixels} 
          canvasWidth={canvasWidth} 
          canvasSize={canvasSize} 
          paint={paint}/>
        </div>
        <div id='saveFrame'>
        </div>
      </div>
    </>
    
  )
}

  function CanvasPixel( {pixels, paint, canvasWidth, canvasSize} ){
    const rows=[]
    for (let i = 0; i < canvasSize; i += canvasWidth){
      rows.push(
        <div key={`row-${i}`} className='pixelRow'>
          {pixels.slice(i, i + canvasWidth).map((pixel, index) => (
          <button key={`pixel-${index + i}`} 
          style={{ backgroundColor: pixel === 1 ? 'black' : 'white' }}
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