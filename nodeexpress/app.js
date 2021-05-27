const express = require('express');
const app = express();
const http = require('http');
const httpServer = http.createServer(app);
const socketIo = require('socket.io');


const sqlinsert=require("./data/sqlinsert");
const io = socketIo(httpServer, {
    cors: {
        origin: "http://localhost:4200"
    }
}); 
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var user = require('./routes/user');

// Enable CORS for all origins .
app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
} );


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.use('/api/v1/user', user);

io.use(async (socket, next) => {
    const username = socket.handshake.auth.nom;
    socket.username = username;
    next();
});

io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
});

io.on("connection", (socket) => {
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
      users.push({
        userID: id,
        username: socket.username
      });
    }
    socket.emit("users", users);
    socket.broadcast.emit("user connected", {
        userID: socket.id,
        username: socket.username
    });
    socket.on("private message", (msg, ID) => {
        socket.to(ID).emit("private message", socket.id, socket.username, msg);
    });
    var PAS, fName, dataType;
    socket.on("File", (pas, dataMime, filename, id) => {
        PAS = pas;
        fName = filename;
        dataType = dataMime;
        socket.emit("fileChunks", 0, PAS, id);
    });
    socket.on("fileChunks", (buffer, next, id) => {
        socket.to(id).emit("FileReceived", buffer);
        socket.emit("fileChunks", next, next + PAS, id);
    });
    socket.on("FileSent", (id) => {
        socket.to(id).emit("FileSent", fName, dataType, socket.id, socket.username);
    })
});

httpServer.listen(3000, () => {
    console.log("listening to 3000");
});



