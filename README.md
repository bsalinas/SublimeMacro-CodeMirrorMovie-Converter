SublimeMacro-CodeMirrorMovie-Converter
======================================

This node.js script converts recorder SublimeText macros into [CodeMirror Movie](https://github.com/sergeche/codemirror-movie) scripts. [CodeMirror Movie](https://github.com/sergeche/codemirror-movie) allows you to script code examples that run inside a [CodeMirror](http://codemirror.net/) editor. Generally, scripting CodeMirror Movies can be a little bit tedious. This script will take a macro recorded in SublimeText 2 and attempt to output a script for CodeMirror Movie.

## Usage
To use this script, you must first record a Sublime Text macro (see the [Sublime documentation](http://docs.sublimetext.info/en/latest/extensibility/macros.html) for more information). Once you have your macro, you must save it and then point this script to that file. *Note that Sublime macros do not support navigating the document by clicking.*

See the examples directory for an example macro and the resulting CodeMirror Movie script playing with live preview.

## How it Works
Within the script, there is a `commands` object which has keys representing the name of the different Sublime commands and objects which are functions that accept the arguments. For instance, the `left_delete` function is shown below.
```javascript
"left_delete": function(args){
	return [{action:'run',arguments:{command:"delCharBefore"}}]
},
```
Each of these functions return an array of objects which map to the actions available in CodeMirror Movie (see [the README](https://github.com/sergeche/codemirror-movie/#movie-commands)). In many cases the CodeMirror Movie `run` command is used. This accepts a CodeMirror command (listed at the [CodeMirror Documentation](http://codemirror.net/doc/manual.html#commands)).

After iterating through all of the commands present in your Sublime Macro (using `parseMacro`), the script then attempts to compress the CodeMirror Movie using the `collapseSteps`. This will result in a movie which runs faster.

## Sublime Support
Sublime has many commands that are available in its macros (see [this list](http://sublime-text-unofficial-documentation.readthedocs.org/en/latest/reference/commands.html#cmd-list)). This script only supports a small subset of those. In particular, it supports:
* `insert`
* `left_delete`
* `right_delete`
* `insert_snippet`
* `move` (partial support)
* `move_to` (partial support)
* `reindent`
* `run_macro_file`

More commands can be supported by adding them to the `commands` object within the script. Pull requests with enhancements will be accepted.

