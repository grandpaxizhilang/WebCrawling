var vm = require('vm2')
var fs = require('fs')
var documentall = require('./addon.node');
const {VM,VMScript} = vm
var myvm = new VM()

myvm.setGlobals({
    'documentall': documentall,
});

var code = fs.readFileSync('./env.js')
code += fs.readFileSync('./code.js')

debugger;;

const script = new VMScript(code,`${__dirname}/NOWDEBUG.js`);

function get_result(){
    var res = myvm.run(script);
    return res;
}

console.log(get_result())

debugger;;
