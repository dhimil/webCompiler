var fs = require('fs'),
    path = require('path'),
    publicPath,
    codePath;

var FileIO = function(config) {
	var that = {};
  if(!config) {
    config = {}
  }
  publicPath = path.resolve(config.publicPath || "./public/");
  codePath = path.resolve(config.codePath || "./code/");

  try {
    fs.mkdirSync(codePath);
  }catch(e) {
    console.log("code folder already exists");
  }

	that.serverStatic = function(path, callback) {
		completeFilePath = publicPath + path;
    try {
			data = fs.readFileSync(completeFilePath);
			responseData = {status: 200, data: data.toString('utf-8')};
		} catch (e) {
			console.error("Error reading static file.", e.toString());
			responseData = {status: 404, data: "Error serving file"};
		}
		callback(responseData);
	}

  that.writeCodeToFile = function(data, callback) {
      var filename = codePath + "/" + (new Date()).getTime() + "." + data.lang;
      try {
        fs.writeFileSync(filename, data.code);
        console.log("File saved to:", filename);
        callback(filename, null);
      } catch (e) {
        callback(filename, e);
      }
  }

  return that;
}

module.exports = FileIO;