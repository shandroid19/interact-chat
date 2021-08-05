const PORT = process.env.PORT || 8900;
const io = require('socket.io')(PORT,{
    cors:{
        // origin:'http://localhost:3000',
        origin:'https://interact-3d602.web.app',
    },
})
var users=[]

const addUser = (userId, socketId)=>{
    !users.some((user)=>user.userId===userId) &&  
    users.push({userId,socketId})
}

const removeUser = (socketId)=>{
    users = users.filter((user)=>user.socketId!== socketId)
}

const getUser=(userId)=>{
    return users.find(user=>user.userId === userId)
}


io.on("connection",(socket)=>{

    io.emit("a user connected")

    socket.on('addUser',userId=>{
        console.log(userId,socket.id)
        addUser(userId,socket.id)
        io.emit('getUsers',users)
    })
    
    socket.on('sendMessage',({sender,receiverId,message})=>{
        console.log(receiverId,users)
        const user = getUser(receiverId);
        if(user){
        io.to(user.socketId).emit("getMessage",{
            sender,message,
        })
    }
    })

    socket.on("disconnect",()=>{
        removeUser(socket.id);
        io.emit('getUsers',users)
    })
    })