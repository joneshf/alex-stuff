var command = document.querySelector('#command');
var commands = {
	'delete': {
		description: 'This command removes elements.',
		args: 'Element tag name to delete.',
		action: function(f, token) {
			f(function(x) {
				x.remove();
			});
		}
	},
	'go': {
		description: 'Follows a link.',
		args: 'The name of the link to follow.',
		action: function(_, token) {
			execute('a')(function(x) {
				if (x.innerText === token) {
					window.location = x.href;
				}
			});
		}
	},
	'hide': {
		description: 'Hides elements.',
		args: 'Tags to hide.',
		action: function(f, token) {
			f(function(x) {
				x.className = 'hide';
			});
		}
	},
	'highlight': {
		description: 'Highlights elements.',
		args: 'Tags to highlight.',
		action: function(f, token) {
			f(function(x) {
				x.className = 'highlight-things';
			});
		}
	},
	'show': {
		description: 'Shows elements.',
		args: 'Tags to show.',
		action: function(f, token) {
			f(function(x) {
				x.className = 'show';
			});
		}
	}
};

var execute = function(token) {
	return function(f) {
		[].slice.call(document.querySelectorAll(token)).forEach(f);
	};
};

var help = function() {
	var defs = document.createElement('dl');
	Object.keys(commands).forEach(function(key) {
		var commandT = document.createElement('dt');
		commandT.innerText = 'Command';
		var command = document.createElement('dd');
		command.innerText = key;
		var descT = document.createElement('dt');
		descT.innerText = 'Description';
		var desc = document.createElement('dd');
		desc.innerText = commands[key].description;
		var argsT = document.createElement('dt');
		argsT.innerText = 'Arguments';
		var args = document.createElement('dd');
		args.innerText = commands[key].args;

		defs.appendChild(commandT);
		defs.appendChild(command);
		defs.appendChild(descT);
		defs.appendChild(desc);
		defs.appendChild(argsT);
		defs.appendChild(args);
	});
	document.getElementById('help').appendChild(defs);
};

var parse = function(str) {
	var tokens = str.trim().split(' ');
	if (tokens.length === 1) {
		switch(tokens[0]) {
			case 'reboot':
				window.location.reload();
				break;
			case 'help':
				help();
				break;
			default:
				alert("that's not a command.");
		}
	} else if (tokens.length > 1) {
		var exec = execute(tokens[1]);
		commands[tokens[0]].action(exec, tokens[1]);
	} else {
		alert("dafuq");
	}
};

command.onkeydown = function(event) {
	switch(event.keyCode) {
		case 9:
			event.preventDefault();
			var val = event.target.value.trim();
			if (val !== '') {
				var coms = Object.keys(commands).filter(function(command) {
					return command.substr(0, val.length) === val;
				});
				if (coms.length > 0) {
					event.target.value = coms[0];
				}
			}
			break;
		case 13:
			parse(event.target.value);
			event.target.value = '';
			break;
	}
};
