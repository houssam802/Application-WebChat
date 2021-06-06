const express = require('express');
const app = express();
const http = require('http');
const httpServer = http.createServer(app);
const socketIo = require('socket.io');

const io = socketIo(httpServer, {
    cors: {
        origin: "http://localhost:4200"
    }
}); 
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

var user = require('./routes/user');
var stockerFichier = require('./routes/stockerFichier');
var user_friends_generator = require('./routes/user_friends');


// Enable CORS for origin : http://localhost:4200.
app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
} );


app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb', 
    extended: true 
}));
app.use(cookieParser())

app.use('/api/v1/user', user);
app.use('/api/v1/user', stockerFichier);
app.use('/api/v1/user', user_friends_generator);

io.use(async (socket, next) => {
    const username = socket.handshake.auth.nom;
    socket.username = username;
    next();
});

io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
});

var sqlSelect = require('./data/sqlSelect');
var sqlinsert = require('./data/sqlinsert');

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
    socket.on("private message", (time, content, ID_dest,ID_emet) => {
       sqlSelect.get_chat(ID_emet,ID_dest,function(result){
          if(is_user_connected(socket,ID_dest)){
            socket.to(ID_dest).emit("private message", {
            time:time,
            content: content,
            from: ID_emet,
            });
          }
          let cont={
            "id_personne":ID_emet,
            "time":time,
            "content":content,
            "type":"text",
            "lue" : false
          } 
          result.messages.push(cont);
          sqlinsert.updateJson(ID_emet,ID_dest,result);

       })
    });



    var PAS, fName, dataType;
    socket.on("File", (pas, dataMime, filename,ID_dest,ID_emet,time) => {
        sqlSelect.get_chat(ID_emet,ID_dest,function(result){
            PAS = pas;
            fName = filename;
            dataType = dataMime;
            if(is_user_connected(socket,ID_dest)){
                socket.emit("fileChunks", 0, PAS, id);
            }
            let cont={
              "id_personne":ID_emet,
              "time":time,
              "content":filename,
              "type":"file",
              "lue" : false
            } 
            result.messages.push(cont);
            sqlinsert.updateJson(ID_emet,ID_dest,result);
  
         })
    });



    socket.on("fileChunks", (buffer, next, id) => {
        socket.to(id).emit("FileReceived", buffer);
        socket.emit("fileChunks", next, next + PAS, id);
    });
    socket.on("FileSent", (id) => {
        socket.to(id).emit("FileSent", fName, dataType, socket.id, socket.username);
    })



    function is_user_connected(socket,id_dest){
        if(socket.username!=null){
          for (let [id, socket] of io.of("/").sockets) {
            if(id_dest == socket.id){
              return true;
            }
          }
        }
        return false;
    }



    socket.on('disconnect', function () {
        //socket.removeAllListeners('private message');
        io.removeAllListeners('connection');
    });
});





httpServer.listen(3000, () => {
    console.log("listening to 3000");
});



