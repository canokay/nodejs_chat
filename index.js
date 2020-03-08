var express=require('express');
var socket=require('socket.io');
var mysql = require('mysql')

var app=express();
var server=app.listen(4000);

var connectionDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chat_db'
  });
  

app.use(express.static('public'));

var io=socket(server);

io.on('connection',function(socket){

    socket.on('chat', function(data){
        //console.log(data.username);
        //console.log(data.message);
        connectionDB.query('INSERT INTO chat (username, message) VALUES (?, ?)', [data.username, data.message]);
        /*var sql = "INSERT INTO chat (username, message) VALUES ('Company Inc', 'Highway 37')";
        connectionDB.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });*/
        io.sockets.emit('chat', data);
    });

    
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });

})


  connectionDB.connect(function(err) {
    if (err) throw err
    console.log('You are now connected mysql...')
  
  })