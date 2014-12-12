#! /usr/bin/env node

var http = require('http'),
    querystring = require('querystring'),
		fileio = require('./fileio')({}),
    process = require('./process')({}),
		port = 9898;

var server = http.createServer(function (req, res) {
	if(req.method == 'GET' && req.url.match("/$|js|html|css|$/")) {
		serveStatic(req, res);
	} else if (req.method == 'POST' && req.url == "/compile")  {
    serveCompileCode(req, res);
  } else {
    respondError(res, new Error("Cannot serve the content"));
	}
});

server.listen(port);
console.log('Server started on :' + port);

var serveStatic = function(req, res) {
  fileio.serverStatic(req.url, function(responseData) {
    console.log("Served:", req.url, "with status", responseData.status);
    res.writeHead(responseData.status);
    res.end(responseData.data);
  });
}

var serveCompileCode = function(req, res) {
  consumeRequest(req, function(data, error) {
    if(error) {
      respondError(res, e);
      return;
    }
    fileio.writeCodeToFile(data, function(filename, error) {
      if(error) {
        respondError(res, error);
        return;
      }
      process.compile(filename, res);
    });
  });
}

var respondError = function(res, e) {
  console.error("Error reading request and writing to file", e.toString(), e.stack.toString());
  res.writeHead(500);
  res.end(e.toString());
}

var consumeRequest = function(req, callback) {
  var data = "";
  req.on('data', function(tempData) {
    data += tempData;
  });

  req.on('end', function() {
    try {
      data = JSON.parse(data);
    } catch (e) {
      if(data.indexOf("&") > -1) {
        data = querystring.parse(data);
      }
    }
    callback(data);
  });

  req.on('error', function(e) {
    callback(null, e);
  });
}
