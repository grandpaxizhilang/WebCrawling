var vm = require('vm2')
var fs = require('fs')

const {VM,VMScript} = vm
var myvm = new VM()

var code = fs.readFileSync('D:/Pycharm/code/小红书/env.js')
code += fs.readFileSync('D:/Pycharm/code/小红书/code.js')

debugger;;

const script = new VMScript(code,`${__dirname}/NOWDEBUG.js`);

function get_result(){
    var res = myvm.run(script);
    return res;
}

console.log(get_result())

debugger;;