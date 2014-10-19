var macro_converter = require('../macro_converter');
var fs = require('fs');
//Load the macro from the file.
var macro = (JSON.parse(fs.readFileSync('gas_macro.sublime-macro', "utf8")));

var options = {
	//we need this if you use any of sublimes other macros so we can load those files.
	sublime_directory: '/Users/ben/Library/Application\ Support/Sublime\ Text\ 2/'
}
//Verbose commands
// var unCollapsed = macro_converter.parseMacro(macro, options);
// var collapsed = macro_converter.collapseSteps(unCollapsed);

//Using parseAndCollapse, we get out an array of CodeMirrorMovie Objects.
var collapsed = macro_converter.parseAndCollapse(macro, options);

//Then, we have to print them out for the actual file.
var stringVersion = ""
for(i=0; i<collapsed.length; i++){
	stringVersion = stringVersion + collapsed[i]['action']+': '+JSON.stringify(collapsed[i]['arguments'])+'\n';
}
var err = fs.writeFileSync('movie.txt',stringVersion);
if(err){
	console.error("Error writing file!");
	console.error(err);
}
else{
	console.log("Done. Your movie is in movie.txt");
}
