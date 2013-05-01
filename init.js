var http = require('http');
var express = require('express');
var fs = require('fs');

var app = express();
var server = http.createServer(app);

app.configure(function() {
    app.use(express.static(__dirname + '/Content'));
    app.use(express.bodyParser());
});

var returnFile = function (repsonse, fileName) {
    fs.readFile(__dirname + '/Content/' + fileName, function(err, data) {
        if (err) {
            response.statusCode(500);
            return;
        }

        response.write(data);
    });
};

var addStatic = function(item) {
    app.get('/', function (request, response) {
        returnFile(response, item);
    });
};

addStatic('index.html');
addStatic('site.js');
addStatic('site.css');

var todoItems = [];
var currentId = 0;

app.post('/add', function (request, response) {
    var newTask = {
        id: currentId++,
        added: new Date(),
        todo: request.body.todo,
        done: false
    };

    var responseText = JSON.stringify(newTask);
    
    todoItems.push(newTask);
    response.send(responseText);
});

app.post('/delete', function(request, response) {
    var idToDelete = request.body.id;
    
    for (var i = todoItems.length; i--;) {
        var item = todoItems[i];
        if (item.id == idToDelete) {
            item.done = true;
            break;
        }
    }

    response.send({ success: true });
});

app.get('/getAll', function(request, response) {
    response.send(JSON.stringify(todoItems));
});


server.listen(8080);