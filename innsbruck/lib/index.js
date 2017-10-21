// Greeting ////////////////////////////////////////////////////////////////////
var emoji = require('node-emoji');
var greeting = `
                                _________________________
                               |                    - (  |
                              ,'-.                   . \`-|
  _ _     _      _           (____".       ,-.      '   ||
 (_) |   | |    (_)            |          /\\,-\\   ,-.    |
  _| |__ | | __  _  ___        |      ,-./     \\ /'.-\\   |
 | | '_ \\| |/ / | |/ _ \\       |     /-.,\\      /     \\  |
 | | |_) |   < _| | (_) |      |    /     \\    ,-.     \\ |
 |_|_.__/|_|\\_(_)_|\\___/       |___/_______\\__/___\\_____\\|

 ` + emoji.get('checkered_flag') + '  Welcome to ibk.io\n';
console.log(greeting);

// Process Path ////////////////////////////////////////////////////////////////
process.IBKPATH = require('path').dirname(module.parent.filename) + '/';

// Index ///////////////////////////////////////////////////////////////////////
// globals -> web -> session -> views -> middleware -> controllers -> [index]
var innsbruck = require('./controllers');

module.exports = innsbruck;
