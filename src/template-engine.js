var marked = require('marked');
var handlebars = require('handlebars');
var files = require('./file-system');

var fs = require('fs');
var path_module = require('path');

function registerPartial(file) {
	var name = path_module.basename(file).split('.')[0];
	handlebars.registerPartial(name, fs.readFileSync(file, 'utf8'));
}

handlebars.load_partials = function () {
	if(fs.existsSync(files.generators_path)){
		var templates = fs.readdirSync(files.generators_path);
		templates.forEach(function (template) {
			var partials = files.generators_path+'/'+template+'/partials';
			if(fs.existsSync(partials)){
				fs.readdirSync(partials)
				.map(function (f) {
					return partials+'/'+f;
				})
				.forEach(registerPartial);
			}
			});

			var views = fs.readdirSync(files.generators_path+'/views');
			views.forEach(function (view) {
				var partials = files.generators_path+'/views/'+view+'/partials';
				if(fs.existsSync(partials)){
					fs.readdirSync(partials)
					.map(function (f) {
						return partials+'/'+f;
					})
					.forEach(registerPartial);
				}
		});
	}
}


handlebars.registerHelper('toLowerCase', function(value) {
    if(value) {
        return new handlebars.SafeString(value.toLowerCase());
    } else {
        return '';
    }
});

handlebars.registerHelper('markdown', function(value) {
		if(value) {
				return new handlebars.SafeString(marked(value));
		} else {
				return '';
		}
});

module.exports = handlebars;
