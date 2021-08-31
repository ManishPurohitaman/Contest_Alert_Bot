const express = require("express")
const app = express()
const http = require("http");
const socket = require("socket.io");

app.use(express.static('.'))
const path = require('path')
app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'index.html'))
})

const server = http.createServer(app);
// node server which will handle socket io connections
const io = socket(server, {
    cors: {
        origin: '*',
    }
});
const users = {};

 io.on('connection', socket=>{
     socket.on('new-user-joined', name=>{
         console.log("New user", name);
         users[socket.id] = name;
         socket.broadcast.emit('user-joined', name);
     });

     socket.on('send', message=>{
         socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
     });

     socket.on('disconnect', message=>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
 })

 const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
}
)