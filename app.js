var express = require("express"),
    app     = express(),
    server  = app.listen(process.env.PORT, process.env.IP, function(){
        console.log("Chat IO has started !!");
    }),
    io      = require("socket.io").listen(server);
var usernames = [];
app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"));
app.get("/",function(req,res){
    res.render("index");
});

io.sockets.on('connection', function(socket){
    // new user
    socket.on('new user', function(data, callback){
        if(usernames.indexOf(data) != -1){
            callback(false);
        } else {
            callback(true);
            socket.username = data;
            usernames.push(socket.username);
            updateUsernames();
        }
    });
    
    // update Usernames
    function updateUsernames() {
        io.sockets.emit('usernames', usernames);
    }
    
    // send message
    socket.on('send message', function(data){
        io.sockets.emit('new message', {msg : data, user : socket.username});
    });
    
    // Disconnect
    socket.on('disconnect', function(data){
        if(!socket.username) return ;
        usernames.splice(usernames.indexOf(socket.username), 1);
        updateUsernames();
    });
});


