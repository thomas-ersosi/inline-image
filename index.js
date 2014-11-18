var fs = require('fs');
var path = require('path');

function cached(func){
	var cache = {}, 
		f = function(key){ return (key in cache)? cache[key]: (cache[key] = func.apply(this, arguments)); }
		f.clear = function(){ cache={} };
	return f;
}

var inlineImageRequests = /(inline-image|image-width|image-height)\(\s*(['](?:\\[\s\S]|[^\\'])*[']|["](?:\\[\s\S]|[^\\"])*["]|[^\)]*)\s*\)/g;

module.exports = function(css, imagePath){
	var dimensions = cached(function(file){ return require('image-size')(file); });
	var buffer = cached(function(file){ return fs.readFileSync( file); });
	var mime = cached(function(file){
		return ({
			"jpg": "image/jpeg",
			"jpeg": "image/jpeg",
			"png": "image/png",
			"gif": "image/gif"
		})[ path.extname( file ).substr(1) ];
	});
	
	return css.toString()
		.replace(inlineImageRequests, function(m, cmd, file){
			file = path.resolve(
				imagePath || "./", 
				(file[0]==="'"||file[0]==='"')? 
					(new Function("", "return "+file))():
					file
			);

			if(!fs.existsSync(file)){
				throw new Error("File not Found: " + file);
			}
			
			switch(cmd){
				case "inline-image":
					if(!mime(file)) throw new Error("Filetype not supported "+file);
					return "url(data:" + mime(file) + ";base64," + buffer(file).toString("base64") + ")";
					
				case "image-width": 
					return dimensions(file).width + "px";
					
				case "image-height": 
					return dimensions(file).height + "px";
			}
		});
}
