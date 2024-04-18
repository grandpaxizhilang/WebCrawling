var vm = require('vm2')
var fs = require('fs')

const {VM,VMScript} = vm
var myvm = new VM()



debugger;;



function get_result(mstoken){
    var code = fs.readFileSync('D:/Pycharm/code/巨量算数/env.js')
    code += `\n var mstoken = '${mstoken}';\r\n`
    code += fs.readFileSync('D:/Pycharm/code/巨量算数/code.js')


    const script = new VMScript(code,`${__dirname}/NOWDEBUG.js`);
    var res = myvm.run(script);
    return res;
}
// var mstoken = 'dfMMNa5l8gaUd4kUmxV2VX2HbtogA__ZNwI3z2_4xWbP0tbtrsPBK_EfaFFgtjryjnLGv1S9ISoDabhARfjmHEuQYJk7N7FWMDesJbJeG8EmUciYVcklW8RT3ZYLUg=='
//
// console.log(get_result(mstoken))

debugger;;