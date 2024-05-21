import { useEffect, useState } from 'react'

import {io} from 'socket.io-client'


function App() {

  const socket = io.connect('localhost:3000/')

  useEffect(()=>{

  },[])

  return (
    <>
      <h1>Hello World</h1>
    </>
  )
}

export default App
