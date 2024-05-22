import { useEffect, useMemo, useState } from 'react'

import {io} from 'socket.io-client'


function App() {
  const socket = useMemo(()=>{return io.connect('localhost:3000/')},[])

  // ithe react da me ek doubt clear kr dea ki yeh jo data variable hai yeh
  // ek object hai aur agar ise aise define karo
  // const [data,setInput] = useState({})
  // toh abhi iske andr empty text field hai
  // ab agar ise me use kr raha hu kisi input field ki value ki jagah
  // toh starting me uski value hogi undefined like value = data.message
  // kyunki data.message jaisi koi cheez hai hi nahi

  // aur jaise hi me kuch enter karunga input me yeh value change ho jaygi
  // undefined se {message:'arvind'}
  // toh react ek warning dega ki uncontrolled way me koi component change ho raha hais
  

  const [socketId,setsocketId] = useState()
  const [data,setInput] = useState({message:'',userid:'',roomid:'' })
  const [groupmessages,setgroupMessages] = useState([])
  const [personalmessages,setpersonalMessages] = useState([])
  

  const inputhandler = (e)=>{
    // console.log(data)
    setInput({...data,[e.target.name]:e.target.value})
  }

  const sendmessagehandler = (e)=>{
    // console.log(e)
    e.preventDefault()
    // socket.emit('message',data)
    
    // if(data.userid ===''&&data.roomid===''){
    //   socket.emit('groupmessage',data.message)
    // }
    // else if(data.roomid===''){
    //   socket.emit('personalmessage',data)
    // } 

    socket.emit('personalmessage',{message:data.message,roomid:data.userid})
    setInput({message:'',roomid:'',userid:''})
  }

  const joinroomhandler = (e)=>{
    socket.emit('joinroom',data.roomid)
    setInput({message:'',roomid:'',userid:''})


  }


  // Note : How am I able to use these socket.on functioinalities in use effect
  // i thought it will only run once during the initial render but even after 10 seconds 
  // i am getting messages on socket.on('message)


  // the reason to write all socket.emit in useeffect is that otherwise even when i type
  // something in the input tag that will change the state of message and
  // that will cause rerender and on each render a socket.on('connect') will run and server 
  // will recieve the message again and again on each render


//   socket.on('connect',()=>{
//     console.log(socket.id)
//   })

//   socket.on('initialmessage',(message)=>{
// console.log(message)
//   })
//   socket.on('message',(message)=>{
// console.log(message)
//   })

  // socket.emit('message','hello from user')
  

  useEffect(()=>{ 

    socket.on('connect',()=>{
      setsocketId(socket.id)
      console.log(socket.id)

    // socket.emit('firstmessage',`hello from ${socket.id}`)

    // again i can write this socket.emit here inside socket.on('connect')
    // or even just after socket.on or whereever i want
    
    // NOTE: if i try to console.log(socket.id) outside the socket.on('connect') i'll get undefined
    // at the server for socket.id

    // so conclusion is that you can socket.emit form anywhere but you'll have access to socket.id in socket.connect only

    })


    // socket.emit('message',`hello from ${socket.id}`)

  
    socket.on('initialmessage',(message)=>{
  console.log(message)
    })

    socket.on('message',(message)=>{
      console.log(message)
    })

   

    socket.on('personalmessage',(message)=>{
  console.log(message)
  setpersonalMessages([...personalmessages,{message}])
  // thers issue if i update the state like
  // setpersonalMessages([...personalmessages,{message}]) dont know why

  // this might be the reason
  // When you use setGroupMessages([...groupMessages, { message }]), you're directly using the current groupMessages variable from the closure of the useEffect or wherever this code is running. If this closure contains an outdated version of groupMessages, the new state will be based on that outdated version. This can lead to unexpected behavior, especially in an asynchronous environment where state updates might not be immediate or when the state changes between renders.

  // and yes i was correct useeffect has gorupmessages = [] in its closure
})




socket.on('groupmessage',(message)=>{
  // console.log(message)
  // let newmessages = [...groupmessages]
  // console.log(newmessages)
  // newmessages.push({message:message})
  // console.log(newmessages)

  // let newestmessages = []
  // console.log(groupmessages)
  // for(let message of groupmessages){
  //   newestmessages.push(message)
  // }

  //  let incomingmessage = {message:message}

  //  console.log(incomingmessage)

  //  newestmessages.push(incomingmessage)

  //  console.log(newestmessages)

  // setgroupMessages(newestmessages)
  // setgroupMessages([...groupmessages, { message }])
  setgroupMessages((prevMessages) => [...prevMessages, { message }])
})


  

  },[])



  return (
    <>
    <div className='container'>

      <div><h2>{socketId}</h2></div>

      <form onSubmit={sendmessagehandler}>
  <div className="mb-3">
    <label htmlFor="exampleInputMessage" className="form-label">Message</label>
    <input type="text" className="form-control" value={data.message} onChange={inputhandler} name='message' id="exampleInputMessage" aria-describedby="emailHelp"/>
  </div>
  <div className="mb-3">
    <label htmlFor="exampleInputUser" className="form-label">Userid</label>
    <input type="text" className="form-control" value={data.userid} onChange={inputhandler} name='userid' id="exampleInputRoom" aria-describedby="emailHelp"/>
  </div>
  <div className="mb-3">
    <label htmlFor="exampleInputRoom" className="form-label">Roomid</label>
    <input type="text" className="form-control" value={data.roomid} onChange={inputhandler} name='roomid' id="exampleInputRoom" aria-describedby="emailHelp"/>
  </div>

  <button type="submit" className="btn btn-primary">Send</button>
  <button type="button" onClick={joinroomhandler} className="btn btn-primary">Join Room</button>
</form>
</div>

{groupmessages.length !== 0 &&
        <div className='container'>
          <ul>
          {groupmessages.map((message, index) => <li key={index}>{message.message}</li>)}
          </ul>
        </div>
      }

    </>
  )
}

export default App
