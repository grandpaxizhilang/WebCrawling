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

    catchvm.AddPlugin({description:"Portable Document Format" ,filename:"internal-pdf-viewer",name:"PDF Viewer",MimeTypes:[{description: "Portable Document Format",suffixes: "pdf",type: "application/pdf1"},{description: "Portable Document Format1",suffixes: "pdf",type: "text/pdf3"}]});
    catchvm.AddPlugin({description:"Portable Document Format" ,filename:"internal-pdf-viewer",name:"PDF Viewer3",MimeTypes:[{description: "Portable Document Format",suffixes: "pdf",type: "application/pdf2"},{description: "Portable Document Format4",suffixes: "pdf",type: "text/pdf"}]})
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
    var event = new (function(){});
    event.__proto__ = Event.prototype;
    event.type = type;
    return catchvm.proxy(event);
};catchvm.func_set_natvie(Event);
Object.defineProperties(Event.prototype, {
    [Symbol.toStringTag]: {
        value: "Event",
        configurable: true
    }
});

///////////////////////////////////////////////////////////////
Event.prototype.type = '';
Event.prototype.bubbles = false;
Event.prototype.cancelable = false;
Event.prototype.composed = false;


Event.prototype.AT_TARGET = 2;
Event.prototype.BUBBLING_PHASE = 3;
Event.prototype.CAPTURING_PHASE = 1;
Event.prototype.NONE = 1;
///////////////////////////////////////////////////////////////

catchvm.memory.Events['event'] = function(){
    var event = new (function(){});
    event.__proto__ = Event.prototype;
    return event;
};

catchvm.memory.Events['events'] = function(){
    var event = new (function(){});
    event.__proto__ = Event.prototype;
    return event;
};

var UIEvent = function UIEvent(type){
    var UIevent = new (function(){});
    UIevent.__proto__ = UIEvent.prototype;
    UIevent.type = type;
    return catchvm.proxy(UIevent);
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



// for (var property_ in Node.prototype) {
//     if(!(typeof Node.prototype[property_] === 'function')){
//         Node.prototype.__defineGetter__(property_, function () {
//             throw new TypeError("Illegal invocation");
//         });
//     }
// }


///////////////////////////////////////////////////////////////


Node.prototype.__proto__ = EventTarget.prototype;



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


Window.prototype.PERSISTENT = 1;
Window.prototype.TEMPORARY = 0;


window.outerHeight = 834;
window.outerWidth = 1536;
window.chrome = catchvm.proxy(class chrome{})
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
        value: "Location",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
location = {};
location.__proto__ = Location.prototype;


location.href = ''
location.port = ''

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
Navigator.prototype.languages = ["zh-CN","en","en-GB","en-US"];
Navigator.prototype.userAgent = ''


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
localStorage.__proto__ = Storage.prototype;

sessionStorage = {};
sessionStorage.__proto__ = Storage.prototype;


localStorage = catchvm.proxy(localStorage);
sessionStorage = catchvm.proxy(sessionStorage);
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
Document.prototype.cookie = ''
Document.prototype.referrer = ''





Document.prototype.getElementById = function getElementById(){
    debugger;
};catchvm.func_set_natvie(Document.prototype.getElementById);

Document.prototype.createElement = function createElement(tagName){
    debugger;
    var tagname = tagName.toLowerCase()+'';
    if(catchvm.memory.HTMLElements[tagname] == 'undefined'){
        debugger;
    }
    return catchvm.proxy(catchvm.memory.HTMLElements[tagname]())
};catchvm.func_set_natvie(Document.prototype.createElement);


//未实现
// Document.prototype.createEvent = function createEvent(type){
//     debugger;
//     var Type = type.toLowerCase()+'';
//     if(catchvm.memory.Events[Type] == 'undefined'){
//         debugger;
//     }
//     return catchvm.proxy(catchvm.memory.Events[Type]())
// };catchvm.func_set_natvie(Document.prototype.createEvent);





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


debugger;