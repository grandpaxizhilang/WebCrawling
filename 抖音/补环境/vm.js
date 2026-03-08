var vm = require('vm2')
var fs = require('fs')

const {VM,VMScript} = vm
var myvm = new VM()



debugger;;



function get_result(data){
    var code = fs.readFileSync('D:/Pycharm/code/抖音(未解决)/env.js')
    code += `\n var Mstoken = '${data}';\r\n`
    code += fs.readFileSync('D:/Pycharm/code/抖音(未解决)/code.js')


    const script = new VMScript(code,`${__dirname}/NOWDEBUG.js`);
    var res = myvm.run(script);
    return res;
}
// var data = 'msToken=royQxoD6u1r2n5o9LW0rCZifoQEDkLA-rOiCI8Th2nCAq-b2aHhziwCTMZOuHfvGzEybtp9lN7A50R-irHlKPvmW3Os4tcLrB9rEWBsBgb9b_qKSu11Mr7YQenaitrOZ&msToken=royQxoD6u1r2n5o9LW0rCZifoQEDkLA-rOiCI8Th2nCAq-b2aHhziwCTMZOuHfvGzEybtp9lN7A50R-irHlKPvmW3Os4tcLrB9rEWBsBgb9b_qKSu11Mr7YQenaitrOZ'
//
// console.log(get_result(data))

debugger;;