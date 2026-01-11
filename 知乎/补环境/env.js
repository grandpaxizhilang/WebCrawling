var catchvm = {}
//框架运行内存
catchvm.memory = {
    config:{print: false,proxy: false}
};//默认关闭打印

catchvm.memory.HTMLElements = [];
catchvm.memory.listeners = {};
catchvm.memory.Events = [];
catchvm.memory.PluginArray = {};
catchvm.memory.MimeTypeArray = {};

;;;;;;;;;;;;;;;;;;;;
//主要用来保护伪造的函数，让其更加难以被识破
(() =>{
    'use strict'
    const $toString = Function.toString;
    const myFunction_toString_symbol = Symbol('('.concat('',')_',(Math.random() + '').toString(36)));
    const myToString = function(){
        return typeof this == 'function' && this[myFunction_toString_symbol] || $toString.call(this);
    };
    function set_native(func, key, value){
        Object.defineProperty(func, key, {
            'enumerable':false,
            'configurable':true,
            'writable':true,
            'value':value
        })
    };
    delete Function.prototype['toString'];//删除原型链上面的toString
    set_native(Function.prototype,'toString',myToString);//自己定义一个getter方法
    set_native(Function.prototype.toString,myFunction_toString_symbol,"function toString() { [native code] }");//套娃，保护我们定义的tostring，不然就暴露了
    this.catchvm.func_set_natvie = (func) => {
        set_native(func,myFunction_toString_symbol,`function ${myFunction_toString_symbol,func.name || ''}() { [native code] }`);
    };//导出函数到golobalThis
}).call(this)
//框架日志功能
catchvm.print = {};
catchvm.memory.print = [];
//获取日志
catchvm.print.log = function (){
    if (catchvm.memory.config.print){

    }
};
//获取全部信息
catchvm.print.getall = function(){

};

//框架代理功能
catchvm.proxy = function(o){
    if(catchvm.memory.config.proxy == false){return o};
    return new Proxy(o, {
        set(target, property, value){

            console.table([{"类型":"set-->",'调用者':target,"类型":property,'值':value}]);
            return Reflect.set(...arguments);
        },
        get(target, property, receiver){

            console.table([{"类型":"get<--",'调用者':target,"类型":property,'值':target[property]}]);
            return target[property];
        }
    });
}

//更改浏览器的某些参数 常用的
// catchvm.memory.plugin.new({description:"Portable Document Format" ,filename:"internal-pdf-viewer",name:"PDF Viewer",MimeTypes:[{description: "Portable Document Format",suffixes: "pdf",type: "application/pdf"},{description: "Portable Document Format1",suffixes: "pdf",type: "text/pdf"}]})

catchvm.AddPlugin = function(data){
    if(catchvm.memory.PluginArray.temp == undefined){
        catchvm.memory.PluginArray.temp = [];
    }
    catchvm.memory.PluginArray.temp.push(data)
};



catchvm.memory.config.proxy=true;

    catchvm.AddPlugin({description:"Portable Document Format" ,filename:"internal-pdf-viewer",name:"Microsoft Edge PDF Plugin",MimeTypes:[{description: "Portable Document Format",suffixes: "pdf",type: "application/x-google-chrome-pdf"}]});
    catchvm.AddPlugin({description:"" ,filename:"mhjfbmdgcfjbbpaeojofohoefgiehjai",name:"Microsoft Edge PDF Viewer",MimeTypes:[{description: "",suffixes: "pdf",type: "application/pdf"}]})
;
var EventTarget = function EventTarget(){

};catchvm.func_set_natvie(EventTarget)
Object.defineProperties(EventTarget.prototype, {
    [Symbol.toStringTag]: {
        value: "EventTarget",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////

EventTarget.prototype.addEventListener = function addEventListener(type,listener){
    // debugger;
    if(catchvm.memory.listeners[type] === undefined){
        catchvm.memory.listeners[type] = [];
    }
    if(catchvm.memory.listeners[type].indexOf(listener) === -1){
        catchvm.memory.listeners[type].push(listener);
    }
};catchvm.func_set_natvie(EventTarget.prototype.addEventListener);

EventTarget.prototype.dispatchEvent = function dispatchEvent(event){
    debugger;
    if (event.type in catchvm.memory.listeners) {
        let stack = catchvm.memory.listeners[event.type];
        event.target = this;
        stack.forEach(callback => {
            callback.call(this,event);
        })
    }

};catchvm.func_set_natvie(EventTarget.prototype.dispatchEvent);

EventTarget.prototype.removeEventListener = function removeEventListener(type,callback){
    debugger;
    if (type in catchvm.memory.listeners) {
        let stack = catchvm.memory.listeners[type];
        let index = stack.indexOf(callback);
        console.log(index);
        //可能会添加多个
        while (index !== -1) {
            stack.splice(index, 1);
            index = stack.indexOf(callback);
        }
    }
};catchvm.func_set_natvie(EventTarget.prototype.removeEventListener);




///////////////////////////////////////////////////////////////

var Event = function Event(type){
    return catchvm.memory.Events['event'](type);
};catchvm.func_set_natvie(Event);
Object.defineProperties(Event.prototype, {
    [Symbol.toStringTag]: {
        value: "Event",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////

Event.prototype.type = '';
Event.prototype.bubbles = '';
Event.prototype.cancelable = '';
Event.prototype.composed = '';


Event.prototype.AT_TARGET = 2;
Event.prototype.BUBBLING_PHASE = 3;
Event.prototype.CAPTURING_PHASE = 1;
Event.prototype.NONE = 1;



for (let temp in Event.prototype) {
    if(!(typeof Event.prototype[temp] === 'function') && temp.toLowerCase() === temp){
        Event.prototype.__defineGetter__(temp, function () {
            throw new TypeError("Illegal invocation");
        });
    }
}

///////////////////////////////////////////////////////////////

catchvm.memory.Events['event'] = function(type){
    var event = {};
    ////////////////////////////////////////////////
    if(type != undefined){
        event.type = type;
    }else{
        event.type = ''
    }
    event.bubbles = false;
    event.cancelable = false;
    event.composed = false;
    /////////////////////////////////////////////////

    event.__proto__ = Event.prototype;
    return catchvm.proxy(event);
};

catchvm.memory.Events['events'] = function(type){
    return catchvm.memory.Events['event'](type);
};

var UIEvent = function UIEvent(type){
    return catchvm.memory.Events['uievent'](type);
};catchvm.func_set_natvie(UIEvent);
Object.defineProperties(UIEvent.prototype, {
    [Symbol.toStringTag]: {
        value: "UIEvent",
        configurable: true
    }
});

///////////////////////////////////////////////////////////////
UIEvent.prototype.view = null;
UIEvent.prototype.detail = 0;
UIEvent.prototype.which = 0;



///////////////////////////////////////////////////////////////
UIEvent.prototype.__proto__ = Event.prototype;

catchvm.memory.Events['uievent'] = function(type){
    var uievent = {};
    ////////////////////////////////////////////////
    if(type != undefined){
        uievent.type = type;
    }else{
        uievent.type = ''
    }

    /////////////////////////////////////////////////
    uievent.__proto__ = UIEvent.prototype;
    return catchvm.proxy(uievent);
};

catchvm.memory.Events['uievents'] = function(type){
    return catchvm.memory.Events['uievent'](type);
};


var TextMetrics = function TextMetrics(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(TextMetrics)
Object.defineProperties(TextMetrics.prototype, {
    [Symbol.toStringTag]: {
        value: "TextMetrics",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////

TextMetrics.prototype.width = 16;
TextMetrics.prototype.actualBoundingBoxAscent = '';
TextMetrics.prototype.actualBoundingBoxDescent = '';
TextMetrics.prototype.actualBoundingBoxLeft = '';
TextMetrics.prototype.alphabeticBaseline = '';
TextMetrics.prototype.fontBoundingBoxAscent = '';
TextMetrics.prototype.fontBoundingBoxDescent = '';
TextMetrics.prototype.hangingBaseline = '';
TextMetrics.prototype.ideographicBaseline = '';


///////////////////////////////////////////////////////////////

var textMetrics = {};
textMetrics.__proto__ = TextMetrics.prototype;

textMetrics = catchvm.proxy(textMetrics);
var CanvasRenderingContext2D = function CanvasRenderingContext2D(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(CanvasRenderingContext2D)
Object.defineProperties(CanvasRenderingContext2D.prototype, {
    [Symbol.toStringTag]: {
        value: "CanvasRenderingContext2D",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////

CanvasRenderingContext2D.prototype.measureText = function measureText(text){
    debugger;
    return textMetrics;
};catchvm.func_set_natvie(CanvasRenderingContext2D.prototype.measureText);


///////////////////////////////////////////////////////////////

var canvasRenderingContext2D = {};
canvasRenderingContext2D.__proto__ = CanvasRenderingContext2D.prototype;

canvasRenderingContext2D = catchvm.proxy(canvasRenderingContext2D);

var MouseEvent = function MouseEvent(type){
    return catchvm.memory.Events['mouseevent'](type);
};catchvm.func_set_natvie(MouseEvent);
Object.defineProperties(MouseEvent.prototype, {
    [Symbol.toStringTag]: {
        value: "MouseEvent",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////

MouseEvent.prototype.screenX = 0;
MouseEvent.prototype.screenY = 0;
MouseEvent.prototype.clientX = 0;
MouseEvent.prototype.clientY = 0;

///////////////////////////////////////////////////////////////

MouseEvent.prototype.__proto__ = UIEvent.prototype;

catchvm.memory.Events['mouseevent'] = function(type){
    var mouseevent = {};
    ////////////////////////////////////////////////
    if(type != undefined){
        mouseevent.type = type;
    }else{
        mouseevent.type = ''
    }
    mouseevent.screenX = 0;
    mouseevent.screenY = 0;
    mouseevent.clientX = 0;
    mouseevent.clientY = 0;
    /////////////////////////////////////////////////
    mouseevent.__proto__ = MouseEvent.prototype;
    return catchvm.proxy(mouseevent);
};

catchvm.memory.Events['mouseevents'] = function(type){
    return catchvm.memory.Events['mouseevent'](type);
};


var Option = function Option(){
    debugger;
    if(catchvm.memory.HTMLElements['option'] == 'undefined'){
        debugger;
    }
    return catchvm.proxy(catchvm.memory.HTMLElements['option']())
};catchvm.func_set_natvie(Option)
Object.defineProperties(Option.prototype, {
    [Symbol.toStringTag]: {
        value: "Option",
        configurable: true
    }
});
var WindowProperties  =function WindowProperties(){

};catchvm.func_set_natvie(WindowProperties)
Object.defineProperties(WindowProperties.prototype, {
    [Symbol.toStringTag]: {
        value: "WindowProperties",
        configurable: true
    }
});
WindowProperties.prototype.__proto__ = EventTarget.prototype;





var Node = function Node(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(Node)
Object.defineProperties(Node.prototype, {
    [Symbol.toStringTag]: {
        value: "Node",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
Node.prototype.ATTRIBUTE_NODE = 2;


Node.prototype.appendChild = function appendChild(aChild){
    debugger;
};catchvm.func_set_natvie(Node.prototype.appendChild)

Node.prototype.removeChild = function removeChild(Child){
    debugger;
};catchvm.func_set_natvie(Node.prototype.removeChild)




// for (var property_ in Node.prototype) {
//     if(!(typeof Node.prototype[property_] === 'function')){
//         Node.prototype.__defineGetter__(property_, function () {
//             throw new TypeError("Illegal invocation");
//         });
//     }
// }


///////////////////////////////////////////////////////////////


Node.prototype.__proto__ = EventTarget.prototype;



var NodeList = function NodeList(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(NodeList)
Object.defineProperties(NodeList.prototype, {
    [Symbol.toStringTag]: {
        value: "NodeList",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
NodeList.prototype.length = 0;

NodeList.prototype.entries = function entries(){debugger;};catchvm.func_set_natvie(NodeList.prototype.entries)
NodeList.prototype.forEach = function forEach(){debugger;};catchvm.func_set_natvie(NodeList.prototype.forEach)
NodeList.prototype.keys = function keys(){debugger;};catchvm.func_set_natvie(NodeList.prototype.keys)
NodeList.prototype.values = function values(){debugger;};catchvm.func_set_natvie(NodeList.prototype.values)

///////////////////////////////////////////////////////////////
nodelist = [];
nodelist.__proto__ = NodeList.prototype;

nodelist = catchvm.proxy(nodelist);




var Element = function Element(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(Element)
Object.defineProperties(Element.prototype, {
    [Symbol.toStringTag]: {
        value: "Element",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////

Element.prototype.__proto__ = Node.prototype;


var HTMLElement = function HTMLElement(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(HTMLElement)
Object.defineProperties(HTMLElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLElement",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////

HTMLElement.prototype.__proto__ = Element.prototype;

var XMLHttpRequestEventTarget = function XMLHttpRequestEventTarget(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(XMLHttpRequestEventTarget)
Object.defineProperties(XMLHttpRequestEventTarget.prototype, {
    [Symbol.toStringTag]: {
        value: "XMLHttpRequestEventTarget",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////

XMLHttpRequestEventTarget.prototype.__proto__ = EventTarget.prototype;
var XMLHttpRequest = function XMLHttpRequest(){

    // return catchvm.proxy(XMLHttpRequest);
};catchvm.func_set_natvie(XMLHttpRequest);
Object.defineProperties(XMLHttpRequest.prototype, {
    [Symbol.toStringTag]: {
        value: "XMLHttpRequest",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
XMLHttpRequest.prototype.open = function open(method,url,async = true,user = '',password = ''){
    debugger;
    this.method = method;
    this.url = url;
    this.async = async;
    this.user = user;
    this.password = password;
};catchvm.func_set_natvie(XMLHttpRequest.prototype.open);

XMLHttpRequest.prototype.send = function send(body = null){
    this.body = body;
    debugger;
};catchvm.func_set_natvie(XMLHttpRequest.prototype.open);



///////////////////////////////////////////////////////////////

// XMLHttpRequest.prototype.__proto__ = XMLHttpRequestEventTarget.prototype;


window = this;
delete global;
delete Buffer;

var Window = function Window(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(Window)
Object.defineProperties(Window.prototype, {
    [Symbol.toStringTag]: {
        value: "Window",
        configurable: true
    }
});

///////////////////////////////////////////////////////////////
window.setTimeout = function setTimeout(){
    //x有可能是方法，也有可能是文本
    typeof(x) === 'function'?x():undefined;
    typeof(x) === 'string'?x():undefined;
    //正确的应该 生成uuid（每个id都不一样） 并且保存到内存中
    return 0;
};catchvm.func_set_natvie(window.setTimeout)

window.setInterval = function setInterval(x,y){
    return x();
};catchvm.func_set_natvie(window.setInterval)

window.clearTimeout = function clearTimeout(id){
    debugger;
};catchvm.func_set_natvie(window.clearTimeout)



Window.prototype.PERSISTENT = 1;
Window.prototype.TEMPORARY = 0;


window.outerHeight = 834;
window.outerWidth = 1536;
window.innerWidth = 0;
window.innerHeight = 0;
window.devicePixelRatio = 1.25;
window.chrome = catchvm.proxy(class chrome{})
window.name = ''

window.alert = function alert(){
    debugger;
    console.log(arguments)
};catchvm.func_set_natvie(window.alert)
// window.CHAMELEON_LOADED = true;



window.CSSRule = function CSSRule(){
    debugger;
};catchvm.func_set_natvie(window.CSSRule);
window.DeviceOrientationEvent = function DeviceOrientationEvent(){
    debugger;
};catchvm.func_set_natvie(window.DeviceOrientationEvent);
window.DeviceMotionEvent = function DeviceMotionEvent(){
    debugger;
};catchvm.func_set_natvie(window.DeviceMotionEvent);


///////////////////////////////////////////////////////////////

Window.prototype.__proto__ = WindowProperties.prototype
window.__proto__ = Window.prototype;


window = catchvm.proxy(window)














var Location = function Location(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(Location)
Object.defineProperties(Location.prototype, {
    [Symbol.toStringTag]: {
        value: 'https://www.zhihu.com/search?type=content&q=%E7%88%AC%E8%99%AB',
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
location = {};
location.__proto__ = Location.prototype;


location.href = 'https://www.zhihu.com/search?type=content&q=%E7%88%AC%E8%99%AB'
location.port = ''
location.hostname = ''
location.host = ''
location.protocol = 'https:'
location.search =

//网站自己新定义的方法和属性(可删除)↓↓↓↓↓↓↓↓↓↓
location.pathname = '';

//网站自己新定义的方法和属性(可删除)↑↑↑↑↑↑↑↑↑↑




///////////////////////////////////////////////////////////////



location = catchvm.proxy(location);
var Navigator = function Navigator(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(Navigator)
Object.defineProperties(Navigator.prototype, {
    [Symbol.toStringTag]: {
        value: "Navigator",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
Navigator.prototype.webdriver = false;
Navigator.prototype.plugins = [];
Navigator.prototype.mimeTypes = [];
Navigator.prototype.language = "zh-CN"
Navigator.prototype.languages = ["zh-CN","en","en-GB","en-US"];
Navigator.prototype.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0'
Navigator.prototype.vendor = 'Google Inc.'
Navigator.prototype.mediaDevices = {};
Navigator.prototype.appName = 'Netscape';
Navigator.prototype.appVersion = '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0'
Navigator.prototype.cookieEnabled = true;
Navigator.prototype.deviceMemory = 8;
Navigator.prototype.maxTouchPoints = 0;
Navigator.prototype.doNotTrack = null;
Navigator.prototype.productSub = '20030107';
Navigator.prototype.vendorSub = '';



//网站自己新定义的方法和属性(可删除)↓↓↓↓↓↓↓↓↓↓
Navigator.prototype.hardwareConcurrency = 12;
Navigator.prototype.platform = 'Win32';
Navigator.prototype.product = 'Gecko';


Navigator.prototype.javaEnabled = function javaEnabled(){
    debugger;
    return false;
};catchvm.func_set_natvie(Navigator.prototype.javaEnabled)

//网站自己新定义的方法和属性(可删除)↑↑↑↑↑↑↑↑↑↑


navigator = {};
navigator.__proto__ = Navigator.prototype;


for (let temp in Navigator.prototype) {
    navigator[temp] = Navigator.prototype[temp];
    if(!(typeof Navigator.prototype[temp] === 'function')){
        Navigator.prototype.__defineGetter__(temp, function () {
            throw new TypeError("Illegal invocation");
        });
    }
}

///////////////////////////////////////////////////////////////



navigator = catchvm.proxy(navigator);





var History = function History(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(History)
Object.defineProperties(History.prototype, {
    [Symbol.toStringTag]: {
        value: "History",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
History.prototype.length = 2;


History.prototype.back = function back(){
    debugger;
};catchvm.func_set_natvie(History.prototype.back)



///////////////////////////////////////////////////////////////

history = {};
history.__proto__ = History.prototype;

history = catchvm.proxy(history);

var Screen = function Screen(){

};catchvm.func_set_natvie(Screen)
Object.defineProperties(Screen.prototype, {
    [Symbol.toStringTag]: {
        value: "Screen",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
Screen.prototype.availHeight = 834;
Screen.prototype.availWidth = 1536;
Screen.prototype.availLeft = 0;
Screen.prototype.availTop = 0;
Screen.prototype.width = 1536;
Screen.prototype.height = 864;
Screen.prototype.colorDepth = 24;


screen = {};
screen.__proto__ = Screen.prototype;

for (var property_ in Screen.prototype) {
    screen[property_] = Screen.prototype[property_];
    if(!(typeof Screen.prototype[property_] === 'function')){
        Screen.prototype.__defineGetter__(property_, function () {
            throw new TypeError("Illegal invocation");
        });
    }
}

///////////////////////////////////////////////////////////////


screen = catchvm.proxy(screen);

var Storage = function Storage(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(Storage);
Object.defineProperties(Storage.prototype, {
    [Symbol.toStringTag]: {
        value: "Storage",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////

Storage.prototype['hexin-v'] = NaN;

Storage.prototype.length = 0;
Storage.prototype.clear = function clear(){
    debugger;
    let temp = Object.keys(this)
    for(var i = 0;i < temp.length;i++){
        delete this[temp[i]]
    }
};catchvm.func_set_natvie(Storage.prototype.clear);

Storage.prototype.getItem = function getItem(k){
    debugger;
    return this[k];
};catchvm.func_set_natvie(Storage.prototype.getItem);

Storage.prototype.key = function key(index){
    debugger;
    return Object.keys(this)[index];
};catchvm.func_set_natvie(Storage.prototype.key);

Storage.prototype.removeItem = function removeItem(k){
    debugger;
    delete this[k];
};catchvm.func_set_natvie(Storage.prototype.removeItem);

Storage.prototype.setItem = function setItem(k,v){
    debugger;
    this[k] = v;
};catchvm.func_set_natvie(Storage.prototype.setItem);


//////可能会被检测
Storage.prototype.__defineGetter__('length', function length() {
    return Object.keys(this).length;
});


///////////////////////////////////////////////////////////////

localStorage = {};
localStorage._c_f2 = 'cd4b9d6d851982137835cd15deb8d341cjcp'
localStorage._dev_ha = 'dcdd5770c63deb47e35549150a89ba93'

localStorage.__proto__ = Storage.prototype;

sessionStorage = {};
sessionStorage.__proto__ = Storage.prototype;


localStorage = catchvm.proxy(localStorage);
sessionStorage = catchvm.proxy(sessionStorage);
var MediaDevices = function MediaDevices(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(MediaDevices)
Object.defineProperties(MediaDevices.prototype, {
    [Symbol.toStringTag]: {
        value: "MediaDevices",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
MediaDevices.prototype.ondevicechange = null;


MediaDevices.prototype.enumerateDevices = function enumerateDevices(){
    debugger;
    return Promise;
};catchvm.func_set_natvie(MediaDevices.prototype.enumerateDevices);

MediaDevices.prototype.getDisplayMedia = function getDisplayMedia(){debugger;};catchvm.func_set_natvie(MediaDevices.prototype.getDisplayMedia)
MediaDevices.prototype.getSupportedConstraints = function getSupportedConstraints(){debugger;};catchvm.func_set_natvie(MediaDevices.prototype.getSupportedConstraints)
MediaDevices.prototype.setCaptureHandleConfig = function setCaptureHandleConfig(){debugger;};catchvm.func_set_natvie(MediaDevices.prototype.setCaptureHandleConfig)




///////////////////////////////////////////////////////////////
navigator.mediaDevices = {};
navigator.mediaDevices.__proto__ = MediaDevices.prototype;

MediaDevices.prototype.__proto__ = EventTarget.prototype;


navigator.mediaDevices = catchvm.proxy(navigator.mediaDevices);
catchvm.memory.plugin = {};

var Plugin = function Plugin(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(Plugin)

catchvm.memory.plugin.iterator = function values(){
    debugger;
    return {
        next:function(){
            if(this.index_ == undefined){
                this.index_ = 0;
            }
            var temp = this.self_[this.index_];
            this.index_++;
            if(temp == undefined){
                return{
                    done:true,
                    value:temp
                }
            }else{
                return{
                    done:false,
                    value:temp
                }
            }

        },
        self_:this
    }
};catchvm.func_set_natvie(catchvm.memory.plugin.iterator);

Object.defineProperties(Plugin.prototype, {
    [Symbol.toStringTag]: {
        value: "Plugin",
        configurable: true
    },
    [Symbol.iterator]: {
        value: catchvm.memory.plugin.iterator,
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
Plugin.prototype.description = '';
Plugin.prototype.filename = '';
Plugin.prototype.length = '';
Plugin.prototype.name = '';

Plugin.prototype.item = function item(index){
    debugger;
    return this[index];
};catchvm.func_set_natvie(Plugin.prototype.item);

Plugin.prototype.namedItem = function namedItem(key){
    debugger;
    return this[key];
};catchvm.func_set_natvie(Plugin.prototype.namedItem);

for (let temp in Plugin.prototype) {
    if(!(typeof Plugin.prototype[temp] === 'function')){
        Plugin.prototype.__defineGetter__(temp, function () {
            throw new TypeError("Illegal invocation");
        });
    }
}

///////////////////////////////////////////////////////////////

catchvm.memory.plugin.new = function (data){
    plugin = {};
    if(data != undefined){
        plugin.description = data.description;
        plugin.filename = data.filename
        plugin.name = data.name
        // MimeType
        for(let mtindex = 0;mtindex < data.MimeTypes.length;mtindex++){
            var mimetype = data.MimeTypes[mtindex];
            var mt = catchvm.memory.MimeType.new(mimetype,plugin);

            plugin[mtindex] = mt;
            Object.defineProperty(plugin,mt.type,{
                value : mt
            })
        }
        plugin.length = data.MimeTypes.length;
    };

    plugin.__proto__ = Plugin.prototype;
    return plugin;
}










catchvm.memory.MimeType = {}

var MimeType = function MimeType(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(MimeType)
Object.defineProperties(MimeType.prototype, {
    [Symbol.toStringTag]: {
        value: "MimeType",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
MimeType.prototype.description = '';
MimeType.prototype.suffixes = '';
MimeType.prototype.type = '';
MimeType.prototype.enabledPlugin = '';

for (let temp in MimeType.prototype) {
    if(!(typeof MimeType.prototype[temp] === 'function')){
        MimeType.prototype.__defineGetter__(temp, function () {
            throw new TypeError("Illegal invocation");
        });
    }
};

///////////////////////////////////////////////////////////////

catchvm.memory.MimeType.new = function (data,plugin){
    var mimeType = {};
    if(data != undefined){
        mimeType.description = data.description;
        mimeType.suffixes = data.suffixes;
        mimeType.type = data.type;
        mimeType.enabledPlugin = plugin;
    };
    mimeType.__proto__ = MimeType.prototype;
    return mimeType;
};

var PluginArray = function PluginArray(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(PluginArray)

catchvm.memory.PluginArray.iterator = function values(){
    debugger;
    return {
        next:function(){
            if(this.index_ == undefined){
                this.index_ = 0;
            }
            var temp = this.self_[this.index_];
            this.index_++;
            if(temp == undefined){
                return{
                    done:true,
                    value:temp
                }
            }else{
                return{
                    done:false,
                    value:temp
                }
            }
        },
        self_:this
    }
};catchvm.func_set_natvie(catchvm.memory.PluginArray.iterator);

Object.defineProperties(PluginArray.prototype, {
    [Symbol.toStringTag]: {
        value: "PluginArray",
        configurable: true
    },
    [Symbol.iterator]: {
        value: catchvm.memory.PluginArray.iterator,
        configurable: true
    }
});

///////////////////////////////////////////////////////////////
PluginArray.prototype.length = '';

PluginArray.prototype.item = function item(index){
    debugger;
    return this[index];
};catchvm.func_set_natvie(PluginArray.prototype.item)

PluginArray.prototype.namedItem = function namedItemem(key){
    debugger;
    return this[key];
};catchvm.func_set_natvie(PluginArray.prototype.namedItem)

PluginArray.prototype.refresh = function refresh(){
    debugger;
};catchvm.func_set_natvie(PluginArray.prototype.refresh)


PluginArray.prototype.__defineGetter__('length', function () {
    throw new TypeError("Illegal invocation");
});


///////////////////////////////////////////////////////////////

catchvm.memory.PluginArray._ = {};

if(catchvm.memory.PluginArray.temp != undefined){
    for(let i = 0;i<catchvm.memory.PluginArray.temp.length;i++){
        var plugindata = catchvm.memory.PluginArray.temp[i];
        var pa = catchvm.memory.plugin.new(plugindata);

        catchvm.memory.PluginArray._[i] = pa;
        Object.defineProperty(catchvm.memory.PluginArray._,pa.name,{
            value : pa
        });
    }
    catchvm.memory.PluginArray._.length = catchvm.memory.PluginArray.temp.length;
}

catchvm.memory.PluginArray._.__proto__ = PluginArray.prototype;
catchvm.memory.PluginArray._ =  catchvm.proxy(catchvm.memory.PluginArray._);


navigator.plugins = catchvm.memory.PluginArray._;

var MimeTypeArray = function MimeTypeArray(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(MimeTypeArray)

catchvm.memory.MimeTypeArray.iterator = function values(){
    debugger;
    return {
        next:function(){
            if(this.index_ == undefined){
                this.index_ = 0;
            }
            var temp = this.self_[this.index_];
            this.index_++;
            if(temp == undefined){
                return{
                    done:true,
                    value:temp
                }
            }else{
                return{
                    done:false,
                    value:temp
                }
            }
        },
        self_:this
    }
};catchvm.func_set_natvie(catchvm.memory.MimeTypeArray.iterator);

Object.defineProperties(MimeTypeArray.prototype, {
    [Symbol.toStringTag]: {
        value: "MimeTypeArray",
        configurable: true
    },
    [Symbol.iterator]: {
        value: catchvm.memory.MimeTypeArray.iterator,
        configurable: true
    }
});

///////////////////////////////////////////////////////////////
MimeTypeArray.prototype.length = '';

MimeTypeArray.prototype.item = function item(index){
    debugger;
    return this[index];
};;catchvm.func_set_natvie(MimeTypeArray.prototype.item)
MimeTypeArray.prototype.namedItem = function namedItemem(key){
    debugger;
    return this[key];
};catchvm.func_set_natvie(MimeTypeArray.prototype.namedItem)

MimeTypeArray.prototype.__defineGetter__('length', function () {
    throw new TypeError("Illegal invocation");
});

///////////////////////////////////////////////////////////////

catchvm.memory.MimeTypeArray._ = {};

if(navigator.plugins != undefined){
    var count = 0;
    for(let i = 0;i < navigator.plugins.length;i++){
        var mimeArray = navigator.plugins[i];
        for(let k = 0;k < mimeArray.length;k++){
            if(catchvm.memory.MimeTypeArray._[mimeArray[k].type] == undefined){
                catchvm.memory.MimeTypeArray._[count] = mimeArray[k];
                Object.defineProperty(catchvm.memory.MimeTypeArray._,mimeArray[k].type,{
                    value : mimeArray[k]
                });
                count++;
            }
        }
    }
    catchvm.memory.MimeTypeArray._.length = count;
}

catchvm.memory.MimeTypeArray._.__proto__ = MimeTypeArray.prototype
catchvm.memory.MimeTypeArray._ =  catchvm.proxy(catchvm.memory.MimeTypeArray._);

navigator.mimeTypes = catchvm.memory.MimeTypeArray._;


var HTMLDivElement = function HTMLDivElement(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(HTMLDivElement)
Object.defineProperties(HTMLDivElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLDivElement",
        configurable: true
    }
});

HTMLDivElement.prototype.__proto__ = HTMLElement.prototype;


catchvm.memory.HTMLElements['div'] = function(){
    var div = new(function(){});
    ///////////////////////////////////////////////
    HTMLDivElement.prototype.align = '';
    ///////////////////////////////////////////////
    div.__proto__ = HTMLDivElement.prototype;
    return div;
}





var HTMLBodyElement = function HTMLBodyElement(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(HTMLBodyElement)
Object.defineProperties(HTMLBodyElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLBodyElement",
        configurable: true
    }
});

HTMLBodyElement.prototype.__proto__ = HTMLElement.prototype;


catchvm.memory.HTMLElements['body'] = function(){
    var body = new(function(){});
    ///////////////////////////////////////////////
    HTMLBodyElement.prototype.aLink = ''
    HTMLBodyElement.prototype.background = ''
    HTMLBodyElement.prototype.bgColor = ''
    HTMLBodyElement.prototype.link = ''
    HTMLBodyElement.prototype.text = ''
    HTMLBodyElement.prototype.vLink = ''
    ///////////////////////////////////////////////
    body.__proto__ = HTMLBodyElement.prototype;
    return body;
}

var HTMLFormElement = function HTMLFormElement(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(HTMLFormElement)
Object.defineProperties(HTMLFormElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLFormElement",
        configurable: true
    }
});

HTMLFormElement.prototype.__proto__ = HTMLElement.prototype;


catchvm.memory.HTMLElements['form'] = function(){
    var form = new(function(){});
    ///////////////////////////////////////////////



    ///////////////////////////////////////////////
    form.__proto__ = HTMLFormElement.prototype;
    return form;
}




var HTMLCanvasElement = function HTMLCanvasElement(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(HTMLCanvasElement)
Object.defineProperties(HTMLCanvasElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLCanvasElement",
        configurable: true
    }
});

HTMLCanvasElement.prototype.__proto__ = HTMLElement.prototype;


catchvm.memory.HTMLElements['canvas'] = function(){
    var Canvas = new(function(){});
    ///////////////////////////////////////////////
    HTMLCanvasElement.prototype.height = 150;
    HTMLCanvasElement.prototype.width = 300;

    HTMLCanvasElement.prototype.getContext = function getContext(contextType){
        // debugger;
        if(contextType == '2d'){
            return canvasRenderingContext2D;
        }
    };catchvm.func_set_natvie(HTMLCanvasElement.prototype.getContext)

    ///////////////////////////////////////////////
    Canvas.__proto__ = HTMLCanvasElement.prototype;
    return Canvas;
}

var HTMLHeadElement = function HTMLHeadElement(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(HTMLHeadElement)
Object.defineProperties(HTMLHeadElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLHeadElement",
        configurable: true
    }
});

HTMLHeadElement.prototype.__proto__ = HTMLElement.prototype;


catchvm.memory.HTMLElements['head'] = function(){
    var head = new(function(){});
    ///////////////////////////////////////////////



    ///////////////////////////////////////////////
    head.__proto__ = HTMLHeadElement.prototype;
    return head;
}

var HTMLHtmlElement = function HTMLHtmlElement(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(HTMLHtmlElement)
Object.defineProperties(HTMLHtmlElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLHtmlElement",
        configurable: true
    }
});

HTMLHtmlElement.prototype.__proto__ = HTMLElement.prototype;


catchvm.memory.HTMLElements['html'] = function(){
    var html = new(function(){});
    ///////////////////////////////////////////////



    ///////////////////////////////////////////////
    html.__proto__ = HTMLHtmlElement.prototype;
    return html;
}

var HTMLIFrameElement = function HTMLIFrameElement(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(HTMLIFrameElement)
Object.defineProperties(HTMLIFrameElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLIFrameElement",
        configurable: true
    }
});

HTMLIFrameElement.prototype.__proto__ = HTMLElement.prototype;


catchvm.memory.HTMLElements['iframe'] = function(){
    var iframe = new(function(){});
    ///////////////////////////////////////////////



    ///////////////////////////////////////////////
    iframe.__proto__ = HTMLIFrameElement.prototype;
    return iframe;
}


var HTMLScriptElement = function HTMLScriptElement(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(HTMLScriptElement)
Object.defineProperties(HTMLScriptElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLScriptElement",
        configurable: true
    }
});

HTMLScriptElement.prototype.__proto__ = HTMLElement.prototype;


catchvm.memory.HTMLElements['script'] = function(){
    var script = new(function(){});
    ///////////////////////////////////////////////



    ///////////////////////////////////////////////
    script.__proto__ = HTMLDivElement.prototype;
    return script;
}


var HTMLAnchorElement = function HTMLAnchorElement(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(HTMLAnchorElement)
Object.defineProperties(HTMLAnchorElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLAnchorElement",
        configurable: true
    }
});

HTMLAnchorElement.prototype.__proto__ = HTMLElement.prototype;


catchvm.memory.HTMLElements['anchor'] = function(){
    var anchor = new(function(){});
    ///////////////////////////////////////////////



    ///////////////////////////////////////////////
    anchor.__proto__ = HTMLAnchorElement.prototype;
    return anchor;
}





var HTMLButtonElement = function HTMLButtonElement(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(HTMLButtonElement)
Object.defineProperties(HTMLButtonElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLButtonElement",
        configurable: true
    }
});

HTMLButtonElement.prototype.__proto__ = HTMLElement.prototype;


catchvm.memory.HTMLElements['button'] = function(){
    var button = new(function(){});
    ///////////////////////////////////////////////



    ///////////////////////////////////////////////
    button.__proto__ = HTMLButtonElement.prototype;
    return button;
}

var HTMLInputElement = function HTMLInputElement(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(HTMLInputElement)
Object.defineProperties(HTMLInputElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLInputElement",
        configurable: true
    }
});

HTMLInputElement.prototype.__proto__ = HTMLElement.prototype;


catchvm.memory.HTMLElements['input'] = function(){
    var input = new(function(){});
    ///////////////////////////////////////////////



    ///////////////////////////////////////////////
    input.__proto__ = HTMLInputElement.prototype;
    return input;
}
var HTMLLabelElement = function HTMLLabelElement(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(HTMLLabelElement)
Object.defineProperties(HTMLLabelElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLLabelElement",
        configurable: true
    }
});

HTMLLabelElement.prototype.__proto__ = HTMLElement.prototype;


catchvm.memory.HTMLElements['label'] = function(){
    var label = new(function(){});
    ///////////////////////////////////////////////



    ///////////////////////////////////////////////
    label.__proto__ = HTMLLabelElement.prototype;
    return label;
}
var HTMLLinkElement = function HTMLLinkElement(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(HTMLLinkElement)
Object.defineProperties(HTMLLinkElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLLinkElement",
        configurable: true
    }
});

HTMLLinkElement.prototype.__proto__ = HTMLElement.prototype;


catchvm.memory.HTMLElements['link'] = function(){
    var link = new(function(){});
    ///////////////////////////////////////////////



    ///////////////////////////////////////////////
    link.__proto__ = HTMLLinkElement.prototype;
    return link;
}
var HTMLImageElement = function HTMLImageElement(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(HTMLImageElement)
Object.defineProperties(HTMLImageElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLImageElement",
        configurable: true
    }
});





HTMLImageElement.prototype.__proto__ = HTMLElement.prototype;


catchvm.memory.HTMLElements['image'] = function(width, height){
    var image = new(function(){});
    ///////////////////////////////////////////////
    HTMLImageElement.prototype.width = width;
    HTMLImageElement.prototype.height = height;

    ///////////////////////////////////////////////
    image.__proto__ = HTMLImageElement.prototype;
    return image;
}
var HTMLAudioElement = function HTMLAudioElement(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(HTMLAudioElement)
Object.defineProperties(HTMLAudioElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLAudioElement",
        configurable: true
    }
});

HTMLAudioElement.prototype.__proto__ = HTMLElement.prototype;


catchvm.memory.HTMLElements['audio'] = function(){
    var audio = new(function(){});
    ///////////////////////////////////////////////



    ///////////////////////////////////////////////
    audio.__proto__ = HTMLAudioElement.prototype;
    return audio;
}
var HTMLOptionElement = function HTMLOptionElement(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(HTMLOptionElement)
Object.defineProperties(HTMLOptionElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLOptionElement",
        configurable: true
    }
});

HTMLOptionElement.prototype.__proto__ = HTMLElement.prototype;


catchvm.memory.HTMLElements['option'] = function(){
    var option = new(function(){});
    ///////////////////////////////////////////////



    ///////////////////////////////////////////////
    option.__proto__ = HTMLOptionElement.prototype;
    return option;
}


var Document = function Document(){

};catchvm.func_set_natvie(Document)
Object.defineProperties(Document.prototype, {
    [Symbol.toStringTag]: {
        value: "Document",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
Document.prototype.URL = ''
Document.prototype.cookie = '_zap=56ff6e48-342e-4d08-a0d5-4777f51d1114; _xsrf=ce2c9bb5-6a12-4f62-a84d-4d374c71df54; d_c0=AADaFoMaPRiPTjdnD2BJK6kOpy3wxu7BBYs=|1709197451; __snaker__id=Cek7E6yMcoM54g3R; gdxidpyhxdE=eUkIUspLN%2FEHA73w1EMz%5CbG307EJOXUd67J4h3lEIwa38jAIdB0g2O7u%2Bs9Eqha2thO5kBlq09WdWgUqwUj%2BIWq8WZiZQJLlth%2FSrfgbx7zaj1I6PbGwdR2OdfUCHOQbYj%2Fy5OKmqLVt%2BCeI62E8LWBt7l2corqQLClHLh9fZg%2Bt4Duz%3A1712478122550; SESSIONID=Vi5h3YgFtCiXgUneJVQ1S3A6hYIatK3wBwt1k0INgYh; KLBRSID=cdfcc1d45d024a211bb7144f66bda2cf|1712498553|1712497253'
Document.prototype.referrer = ''
Document.prototype.documentElement = catchvm.memory.HTMLElements['html']()
Document.prototype.body = catchvm.memory.HTMLElements['body']()




Document.prototype.getElementsByClassName = function getElementsByClassName(){
    debugger;
};catchvm.func_set_natvie(Document.prototype.getElementsByClassName);

Document.prototype.getElementById = function getElementById(){
    debugger;
};catchvm.func_set_natvie(Document.prototype.getElementById);

Document.prototype.createElement = function createElement(tagName){
    // debugger;
    var tagname = tagName.toLowerCase()+'';
    if(catchvm.memory.HTMLElements[tagname] == 'undefined'){
        debugger;
    }
    return catchvm.proxy(catchvm.memory.HTMLElements[tagname]())
};catchvm.func_set_natvie(Document.prototype.createElement);


Document.prototype.getElementsByTagName = function getElementsByTagName(name){
    debugger;
    return [{}]
};catchvm.func_set_natvie(Document.prototype.getElementsByTagName);

Document.prototype.querySelectorAll = function querySelectorAll(selectors){
    debugger;
    return nodelist;
};catchvm.func_set_natvie(Document.prototype.querySelectorAll);


Document.prototype.createEvent = function createEvent(type){
    debugger;
    var Type = type.toLowerCase()+'';
    if(catchvm.memory.Events[Type] == 'undefined'){
        debugger;
    }
    return catchvm.proxy(catchvm.memory.Events[Type]())
};catchvm.func_set_natvie(Document.prototype.createEvent);





// for (var property_ in Document.prototype) {
//     if(!(typeof Document.prototype[property_] === 'function')){
//         Document.prototype.__defineGetter__(property_, function () {
//             throw new TypeError("Illegal invocation");
//         });
//     }
// }


///////////////////////////////////////////////////////////////

Document.prototype.__proto__ = Node.prototype;





var HTMLDocument = function HTMLDocument(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(HTMLDocument)
Object.defineProperties(HTMLDocument.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLDocument",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////



document = {};
document.__proto__ = HTMLDocument.prototype;


for (var property_ in HTMLDocument.prototype) {
    document[property_] = HTMLDocument.prototype[property_];
    if(!(typeof HTMLDocument.prototype[property_] === 'function')){
        HTMLDocument.prototype.__defineGetter__(property_, function () {
            throw new TypeError("Illegal invocation");
        });
    }
}



///////////////////////////////////////////////////////////////


HTMLDocument.prototype.__proto__ = Document.prototype;
document = catchvm.proxy(document);


var Image = function Image(width, height){
    debugger;
    if(catchvm.memory.HTMLElements['image'] == 'undefined'){
        debugger;
    }
    return catchvm.proxy(catchvm.memory.HTMLElements['image'](width, height))
};catchvm.func_set_natvie(Image)
Object.defineProperties(Image.prototype, {
    [Symbol.toStringTag]: {
        value: "Image",
        configurable: true
    }
});

var ImageData = function ImageData(width, height){
    var imagedata = {};
    ////////////////////////////////////////////////
    imagedata.colorSpace = 'srgb';
    imagedata.data = [];
    imagedata.height = height;
    imagedata.width = width;
    ////////////////////////////////////////////////

    imagedata.__proto__ = ImageData.prototype;
    return catchvm.proxy(imagedata);

};catchvm.func_set_natvie(ImageData)
Object.defineProperties(ImageData.prototype, {
    [Symbol.toStringTag]: {
        value: "ImageData",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////

ImageData.prototype.colorSpace = '';
ImageData.prototype.data = '';
ImageData.prototype.height = 0;
ImageData.prototype.width = 0;

for (let temp in ImageData.prototype) {
    if(!(typeof ImageData.prototype[temp] === 'function')){
        ImageData.prototype.__defineGetter__(temp, function () {
            throw new TypeError("Illegal invocation");
        });
    }
};

///////////////////////////////////////////////////////////////
