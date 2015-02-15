var express = require('express')
, socketio = require('socket.io');
var app     = express()
var routes = require('./routes/index');

app.use(express.static(__dirname + '/public'));

var databaseUrl = "mongodb://user1:user1@ds039321.mongolab.com:39321/appzui"; // "username:password@example.com/mydb"
var collections = ["state", "history"]
var db = require("mongojs").connect(databaseUrl, collections);

app.use(function(req,res,next){
    req.db = db;
    next();
});


app.use('/', routes);
app.set('views', './views');
app.set('view engine', 'jade');

var server = app.listen(3000, function () {
var host = server.address().address
var port = server.address().port
var newmsg = [];

  console.log('Example app listening at http://%s:%s', host, port)

})

socketio.listen(server).on('connection', function (socket) {
    socket.on('setstatus', function (status) {
        console.log('Message Received: ', status);
        socket.broadcast.emit('setstatus', status);       
        newmsg = JSON.parse(JSON.stringify(status));
        db.state.update({_id: newmsg.lightclass}, newmsg,{ upsert: true });
        db.history.save({timestp: new Date().toString(), light: newmsg.lightclass, state: newmsg.newstatus }, function(err, saved) {
      	  if( err || !saved ) console.log("not saved");
      	  else console.log("saved");
        });        
    });
});