var vm = require('vm2')
var fs = require('fs')

const {VM,VMScript} = vm
var myvm = new VM()



debugger;;



function get_result(data){
    var code = fs.readFileSync('D:/Pycharm/code/抖音(未解决)/env.js')
    code += `\n var data_ = '${data}';\r\n`
    code += fs.readFileSync('D:/Pycharm/code/抖音(未解决)/code.js')


    const script = new VMScript(code,`${__dirname}/NOWDEBUG.js`);
    var res = myvm.run(script);
    return res;
}
var data = 'device_platform=webapp&aid=6383&channel=channel_pc_web&pc_client_type=1&version_code=170400&version_name=17.4.0&cookie_enabled=true&screen_width=1536&screen_height=864&browser_language=zh-CN&browser_platform=Win32&browser_name=Edge&browser_version=123.0.0.0&browser_online=true&engine_name=Blink&engine_version=123.0.0.0&os_name=Windows&os_version=10&cpu_core_num=12&device_memory=8&platform=PC&downlink=10&effective_type=4g&round_trip_time=100&webid=7359433100374378023&msToken=tvzxtTuBLjwtJOAtN2MbHyVWzlo_xDqyd5spFM8gUbPYLV--CBOmnxP4j7USfqUIOfP350BCnUUkv0Z5xyFFEBXC4iM3-B44A6gHe1QTvTO8vII7q8uy&msToken=tvzxtTuBLjwtJOAtN2MbHyVWzlo_xDqyd5spFM8gUbPYLV--CBOmnxP4j7USfqUIOfP350BCnUUkv0Z5xyFFEBXC4iM3-B44A6gHe1QTvTO8vII7q8uy'

console.log(get_result(data))

debugger;;