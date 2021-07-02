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
var sqlupdate = require('./data/sqlupdate');


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



io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
});


io.on("connection", (socket) => {
    /* Une fois l'utilisateur est connecter, il sera informer par les amies connectées. */
    new Promise((resolve, reject) => {
        resolve(socket.handshake.auth.id);
    }).then(
        result => {
            var list_conn_users=[];
            sqlSelect.get_all_chats(result, (amies) => {
                for(let amie of amies){
                    if( is_user_connected(socket, amie.id) ){
                        list_conn_users.push(amie.id);
                    }
                }
            socket.emit('users',list_conn_users);
            }, (error) => {
            });
        }
    )
    /* -------------------------------------------------------------------------------- */

    /* Informer les utilisateurs en revlation avec, qu'il est en ligne . */
    new Promise((resolve, reject) => {
        resolve(socket.handshake.auth.id);
    }).then(
        res => {
            sqlSelect.get_all_chats(res, (amies) => {
                for(let amie of amies){
                    if( is_user_connected(socket, amie.id) ){
                        socket.to(get_socket_id(socket, amie.id)).emit('user connected', res);
                    }
                }
            }, (error) => {
            });
        }
    )
    /*--------------------------------------------------------------------*/
    socket.on("private message", ({time, content, ID_dest,ID_emet }) => {
       sqlSelect.get_chat(ID_emet,ID_dest,function(result){
          if(is_user_connected(socket,ID_dest)){
              console.log('connected')
              socket.to(get_socket_id(socket,ID_dest)).emit("private message",{time  : time, content : content ,ID_emet : ID_emet,ID_dest : ID_dest});
          }
          let cont={
            "id_personne":ID_emet,
            "time":time,
            "content":content,
            "type":"text",
            "lue" : false
          } 
          result.messages.push(cont);
          sqlupdate.updateJson(ID_emet,ID_dest,result);
       })
    });


    socket.on("message_lue", ({time, content, ID_dest,ID_emet }) => {
        console.log(ID_emet+": "+ID_dest)
        sqlSelect.get_chat(ID_emet,ID_dest,function(result){
           result.messages[result.messages.length-1].lue=true;
           sqlupdate.updateJson(ID_emet,ID_dest,result);
        })
     });



    socket.on("File", ({content, ID_dest, ID_emet, time}) => {
        console.log(ID_dest+" : "+ID_emet)
        sqlSelect.get_chat(ID_emet,ID_dest,function(result){
            if(is_user_connected(socket,ID_dest)){
                socket.to(get_socket_id(socket,ID_dest)).emit("File", content, time, ID_emet,ID_dest);
            }
            let cont={
              "id_personne":ID_emet,
              "time":time,
              "content":content,
              "type":"file",
              "lue" : false
            } 
            result.messages.push(cont);
            sqlupdate.updateJson(ID_emet,ID_dest,result);
        })
    });

    socket.on('disconnect',function(){
        console.log(socket.handshake.auth.username + " disconnected");
        sqlSelect.get_all_chats(socket.handshake.auth.id, (amies) => {
            for(let amie of amies){
                if( is_user_connected(socket, amie.id) ){
                    socket.to(get_socket_id(socket, amie.id)).emit('user disconnected', socket.handshake.auth.id);
                }
            }
        }, (error) => {
        });
    });

});

function is_user_connected(socket,id_dest){
    if(socket.handshake.auth.username!=null){
      for (let [id,socket] of io.of("/").sockets) {
        if(id_dest == socket.handshake.auth.id){
            return true;
        }
      }
    }
    return false;
}


function get_socket_id(socket,id_dest){
    if(socket.handshake.auth.username!=null){
      for (let [id, socket] of io.of("/").sockets) {
        if(id_dest == socket.handshake.auth.id){
          return socket.id;
        }
      }
    }
    return null;
}

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