/* jshint laxcomma:true */

// Process arguments
var args = process.argv || [];

if (args.length < 2 || args.length > 5){
  console.log('Usage: ' + args[0] + '[http port] [websocket port]');
  process.exit();
}

// Open websocket to connections
var ports = {
  http:   args[2] || 80,
  socket: args[3] || 8080
};

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: ports.socket });

wss.on('connection', function(ws){

  ws.on('message', function crawl(url){

    // Spawn phantomjs and stream results back
    var spawn = require('child_process').spawn
      , child = spawn('phantomjs', ['./capture.js', url]);

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function(data) {
      ws.send(data);
    });

    child.on('exit', function (code) {
      console.log('child process exited with code ' + code);
    });
  });
});


// Serve public http
var http = require('http')
  , url  = require('url')
  , path = require('path')
  , fs   = require('fs');

http.createServer(function(request, response){

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), 'public/' + uri);

  fs.exists(filename, function(exists) {
    if(!exists) {
      respond('Resource not found.', 'text/plain', 404);
      return;
    }

    if (fs.statSync(filename).isDirectory()) {
      filename += '/index.html';
    }

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        respond('Error: ' + err + '.', 'text/plain', 500);
        return;
      }

      var host = request.headers.host.split(':')[0];

      // Replace template stuff
      file = file.replace('{{server}}', host);
      file = file.replace('{{port}}', ports.socket);

      respond(file, 'text/html', 200);
    });
  });

  function respond(string, type, code){

    var origin = "http://alexose.github.io";

    type = type || "text/html";
    code = code || 200;

    response.writeHead(code, {
      "Content-Type": type,
      "Access-Control-Allow-Origin": origin
    });
    response.write(string);
    response.end();
  }

}).listen(ports.http);

