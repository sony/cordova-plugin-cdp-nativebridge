command('jshint app/plugins app/lib/scripts app/scripts -c tests/jshint/jshintrc.json', true);

function command(commandString, shouldEnd) { 
    var commandArguments = commandString.trim().split(' ');
    var cmd = commandArguments.shift() + ((process.platform === 'win32') ? '.cmd' : '');
    var child = require('child_process').spawn(cmd, commandArguments);
    child.stdout.pipe(process.stdout, {end: shouldEnd});
    child.stderr.pipe(process.stderr, {end: shouldEnd});
}
