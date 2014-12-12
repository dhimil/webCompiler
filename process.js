var spawn = require('child_process').spawn,
    path = require('path'),
    compileScript;

var Compiler = function(config) {
  var that = {};

  if(!config) {
    config = {}
  }

  compileScript = path.resolve(config.compileScript || "./scripts/run_cpp.sh");

  that.compile = function(filename, res) {
    var output = {
      stdout: "",
      stderr: ""
    };
    res.writeHead(200);
    compileProcess = spawn('bash', [compileScript, filename]);
    compileProcess.stdout.on('data', function(data) {
      output.stdout += data;
    });
    compileProcess.stderr.on('data', function(data) {
      output.stderr += data;
    });
    compileProcess.on('close', function(close) {
      console.log("Exit status:", close);
      output.exitStatus = close;
      res.write(JSON.stringify(output));
      res.end();
    });
  }

  return that;
}

module.exports = Compiler;