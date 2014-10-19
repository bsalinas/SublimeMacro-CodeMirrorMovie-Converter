var fs = require('fs')

var commands = {
	"insert": function(args, options){
		var toRet = []
		// var textObj = {text:args['characters']}
		// toRet.push('type: '+JSON.stringify(textObj));
		// return toRet;
		if(args['characters'] == '\n'){
			toRet.push({action:'run',arguments:{command:"newlineAndIndent"}})
			// toRet.push({action:'run',arguments:{command:"indentAuto"}})
			return toRet;
		}
		var parts = args['characters'].split('\n');
		for(var j=0; j<parts.length; j++){
			if(parts[j].length > 0){
				var textObj = {text:parts[j]}
				toRet.push({action:"type", arguments:textObj})
			}
			toRet.push({action:'type',arguments:{text:"\n"}});
			// toRet.push({action:'run',arguments:{command:"newlineAndIndent"}})
			toRet.push({action:'run',arguments:{command:"indentAuto"}})
		}
		toRet.pop();
		toRet.pop();
		return toRet;
	},
	"left_delete": function(args, options){
		return [{action:'run',arguments:{command:"delCharBefore"}}]
	},
	"right_delete": function(args, options){
		return [{action:'run',arguments:{command:"delCharAfter"}}]
	},
	"insert_snippet":function(args, options){
		var toRet = []
		var parts = args['contents'].split('$0');
		if(parts.length > 0){
			var j=0;
			var charCount = 0;
			for(j=0; j<parts.length; j++){
				var textObj = {text:parts[j]}
				toRet.push({action:'type',arguments:textObj})
				charCount += parts[j].length;
			}
			//Now, we need to go back to where we were at the start.
			charCount -= parts[0].length;
			for(var k=0; k<charCount; k++){
				toRet.push({action:'run',arguments:{command:"goCharLeft"}})	
			}
			
		}
		else{
			console.error("Unknown Command: insert_snippet" + JSON.stringify(args, options));
		}
		return toRet;
	},
	"move": function(args, options){
		if(args['by'] == 'characters'){
			if(args['forward']){
				return [{action:'run',arguments:{command:"goCharRight"}}];
			}
			else{
				return [{action:'run',arguments:{command:"goCharLeft"}}]
			}
		}
		if(args['by'] == 'lines'){
			if(args['forward']){
				return [{action:'run',arguments:{command:"goLineDown"}}];
			}
			else{
				return [{action:'run',arguments:{command:"goLineUp"}}]
			}
		}
		console.error("Unknown Command: move with args" + JSON.stringify(args, options));
		return [];
	},
	"move_to": function(args, options){
		if(args['to'] == 'bol'){
			return [{action:'run',arguments:{command:"goLineStartSmart"}}]
		}
		else{
			return [{action:'run',arguments:{command:"goLineEnd"}}];	
		}
	},
	"run_macro_file": function(args, options){
		var fileLoc = args['file'];
		fileLoc = fileLoc.replace('res://', options.sublime_directory);
		var file = (JSON.parse(fs.readFileSync(fileLoc, "utf8")));
		var toRet = parseMacro(file, options);
		return toRet;
	},
	"reindent": function(args, options){
		return [{action:'run',arguments:{command:"indentAuto"}}];
	}

}
var parseMacro = function(steps, options){
	// console.log('Parse Macro With '+steps.length);
	var toRet = []
	var i=0;
	for(i=0; i<steps.length; i++){
		var step = steps[i];
		var command = step['command'];
		if(commands[command]){
			var thisRet = commands[command](step['args'], options);
			for(var j=0; j<thisRet.length; j++){
				toRet.push(thisRet[j]);
			}
		}
		else{
			console.error('No command for '+command);
		}
	}
	return toRet;
}
var collapseSteps = function(steps){
	var toRet = []
	toRet.push(steps[0])
	for(var i=1; i<steps.length; i++){
		var thisStep = steps[i];
		var lastStep = toRet[toRet.length -1];
		if(lastStep['action'] == thisStep['action']){
			if(thisStep['action'] == 'run'){
				if(thisStep['arguments']['command'] == lastStep['arguments']['command']){
					if(lastStep['arguments']['times']){
						lastStep['arguments']['times'] = ""+ (parseInt(lastStep['arguments']['times'])+1);
						toRet[toRet.length -1] = lastStep;
						continue;
					}
					else{
						lastStep['arguments']['times'] = "2";
						toRet[toRet.length -1] = lastStep;	
						continue;
					}
				}
			}
			if(thisStep['action'] == 'type'){
				lastStep['arguments']['text'] = lastStep['arguments']['text'] + thisStep['arguments']['text'];
				toRet[toRet.length -1] = lastStep;
				continue;
			}
		}
		toRet.push(thisStep);
	}
	return toRet;
}
var parseAndCollapse = function(macro, options){
	return collapseSteps(parseMacro(macro, options));
}
exports.parseMacro = parseMacro;
exports.collapseSteps = collapseSteps;
exports.parseAndCollapse = parseAndCollapse;