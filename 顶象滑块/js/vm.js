var vm = require('vm2')
var fs = require('fs')
var documentall = require('D:\\pycharm\\code\\Release\\addon.node');
const {VM,VMScript} = vm
var myvm = new VM()

myvm.setGlobals({
    'documentall': documentall,
    'sid' : '41999efd4fb94416a2c2ac42bf16d915',
    'pic_x' : 166,
    'pic_y' : 51,
});

var code = fs.readFileSync('D:\\pycharm\\code\\顶象滑块\\js\\env.js')
code += fs.readFileSync('D:\\pycharm\\code\\顶象滑块\\js\\code.js')

debugger;;

const script = new VMScript(code,`${__dirname}/NOWDEBUG.js`);

function get_result(){
    var res = myvm.run(script);
    return res;
}

// consoleg.log(et_result())

debugger;;
