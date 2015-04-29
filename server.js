var express = require("express"), 
    app = express(),
    http = require("http"),
    io = require("socket.io"),
    // import the mongoose library
    mongoose = require("mongoose"),
    port = 3000;

app.use(express.static(__dirname + "/client"));
app.use(express.bodyParser());

// connect to the amazeriffic data store in mongo
mongoose.connect('mongodb://localhost/amazeriffic');

// This is our mongoose model for todos
var ToDoSchema = mongoose.Schema({
    description: String,
    tags: [ String ]
});

var ToDo = mongoose.model("ToDo", ToDoSchema);

// Following inspired by: http://code.tutsplus.com/tutorials/real-time-chat-with-nodejs-socketio-and-expressjs--net-31708
// and
// https://github.com/yashchheda/Assignment_9_Socket_Io_Amazeriffic/blob/master/server.js
var io = new io(http.createServer(app));
http.createServer(app).listen(port);

console.log("Magic happening on port " + port);

io.on("connection", function (socket) {
  console.log("Connection has been made!");

  socket.on("disconnect", function () {
    console.log("Well, it was nice while it lasted.");
  });

  socket.on("addTodo", function (content) {
    // use incoming to-do item
    console.log(content); // testing content

    // Following inspired by: https://github.com/tcrane20/AmazerifficSIO/blob/master/server.js
    // save client's to-do item
    var newTodo = new ToDo({
      "description": content.description,
      "tags": content.tags
    });

    newTodo.save(function (err, result) {
      if (err !== null) {
        console.log(err);
        socket.emit("Error", err);
      } else {
        ToDo.find({}, function (err, result) {
          if (err !== null) {
            socket.emit("Error", err);
            return;
          }
          socket.emit("Great, your task has been saved.");
          socket.broadcast.emit("Hi, everyone. Your pal's task has been saved.", result);
        });
      }
    });
  });
});

// ROUTES //

app.get("/todos.json", function (req, res) {
    ToDo.find({}, function (err, toDos) {
	    res.json(toDos);
    });
});

app.post("/todos", function (req, res) {
    console.log(req.body); // testing

    var newToDo = new ToDo({
        "description":req.body.description,
        "tags":req.body.tags
    });

    newToDo.save(function (err, result) {
	      if (err !== null) {
	        // the element did not get saved!
	        console.log(err);
	        res.send("ERROR");
	      } else {
	          // our client expects *all* of the todo items to be returned, so we'll do
	          // an additional request to maintain compatibility
	          ToDo.find({}, function (err, result) {
		            if (err !== null) {
	    	            // the element did not get saved!
		                res.send("ERROR");
  		          }
	              res.json(result);
	          });
	      }
    });
});
