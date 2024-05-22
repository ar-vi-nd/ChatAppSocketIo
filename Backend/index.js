const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{
    cors:{
        origin:'*',
        methods:["GET","POST"],
        credentials: true
    }
});

// io.on('message',(socket)=>{
//     console.log(socket)
// })

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });


// IDK why but colons sometimes fuck up the code inside thi io.on('connection'(socket)=>{})


io.on('connection', (socket) => {
  console.log('a user connected : ',socket.id)

//   socket.emit send message back to the socket
  socket.emit('initialmessage','You are connected')


//   socket.broadcast.emit send message to all the sockets connected to the io except the socket it recieved the message from
  socket.broadcast.emit('message',{sender:'SocketIoApp',message:`User ${socket.id} connected`})


//   socket.on listens to the message from the socket

socket.on('firstmessage',(message)=>{
    console.log(message)
    //  io.emit send message to all the sockets
//    io.emit('message','Yeh message sabke liye hai io se '+message)

  })

  socket.on('message',({message,userid,roomid})=>{
    console.log(message)
    if (userid===''&&roomid===''){

        socket.broadcast.emit('message',{sender:socket.id,message:message})
        }

        else if(userid===''&&roomid!==''){
        socket.to(roomid).emit('message',{message,sender:socket.id})
        }
        else if(userid==''&&roomid!==''){
        socket.to(userid).emit('message',{message,sender:socket.id})

        }

    else{
        socket.to(userid).emit('message',{message,sender:socket.id})
        socket.to(roomid).emit('message',{message,sender:socket.id})
    }

  })
  socket.on('personalmessage',({message,roomid})=>{
    console.log(message)
    console.log(roomid)
    // io.to(roomid).emit('personalmessage',{sender:socket.id,message})

    // both these lines will have same effect in case sending to one user but if 
    // two users joined a room io.to will send message to both users
    // but socket.to will only send to other user
    socket.to(roomid).emit('personalmessage',{sender:socket.id,message})


  })
  socket.on('groupmessage',(message)=>{
    console.log(message)
    socket.broadcast.emit('groupmessage',socket.id + " " +message)
  })

  socket.on('joinroom',(roomid)=>{
    socket.join(roomid)
    io.emit('message',{sender:socket.id,message:' joined room '+roomid})
  })

//   setTimeout(() => {
//     socket.emit('message',"Sending message after 10 seconds")
// }, 10000);

});




server.listen(3000, () => {
  console.log('listening on *:3000');
});