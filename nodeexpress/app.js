const express    = require('express');
const app        = express();
const http       = require('http');
const cors       = require('cors');
const httpServer = http.createServer(app);
const socketIo   = require('socket.io');

const io         = socketIo(httpServer, {
    cors: {
        origin: "http://localhost:4200"
    }
}); 
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var multer       = require('multer');
var upload       = multer();

var user         = require('./routes/user');
var stockerFichier = require('./routes/stockerFichier');

var amies        = require('./routes/amies');



var sqlSelect = require('./data/sqlSelect');
var sqlinsert = require('./data/sqlinsert');

// Enable CORS for origin : http://localhost:4200.
/* app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
} );
 */

/* 
sqlSelect.get_chat(29,32,function(result){
    let cont={
      "id_personne":29,
      "time":"07/06/2021",
      "content":"Test2_29",
      "type":"text",
      "lue" : false
    } 
    result.messages.push(cont);
    sqlinsert.updateJson(29,32,result);

 }) */

app.use(cors());
app.options('http://localhost:4200', cors());


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
app.use('/api/v1/user', amies);


io.use(async (socket, next) => {
    const username = socket.handshake.auth.nom;
    socket.username = username;
    next();
});

io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
});




io.on("connection", (socket) => {
    //socket.id=socket.handshake.auth.id;
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

    socket.on("private message", ({time, content, ID_dest,ID_emet }) => {
       sqlSelect.get_chat(ID_emet,ID_dest,function(result){
          if(is_user_connected(socket,ID_dest)){
            socket.to(ID_dest).emit("private message",time,content,ID_emet);
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
    socket.on("File", ({pas, dataMime, content,ID_dest,ID_emet,time}) => {
        sqlSelect.get_chat(ID_emet,ID_dest,function(result){
            PAS = pas;
            fName = content;
            dataType = dataMime;
            if(is_user_connected(socket,ID_dest)){
                socket.emit("fileChunks", 0, PAS, id);
            }
            let cont={
              "id_personne":ID_emet,
              "time":time,
              "content":content,
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


    socket.on("disconnected",() =>{
        console.log("disconnect");
        ///sockets.socket(users[user_id]).disconnect();
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


});
/*--------------------------------------------------------------------------------- */

var expressJWT = require('express-jwt');


app.use(expressJWT({ secret: process.env.ACCESS_TOKEN_SECRET, algorithms: ['HS256']})
    .unless( // This allows access to /token/sign without token authentication
        { path: [
            '/api/v1/user/inscrire',
            '/api/v1/user/path'
        ]}
    ));



/*--------------------------------------------------------------------------------- */





httpServer.listen(3000, () => {
    console.log("listening to 3000");
});



