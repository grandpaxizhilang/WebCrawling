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

            console.table([{"方法":"set-->",'调用者':target,"类型":property,'值':value}]);
            return Reflect.set(...arguments);
        },
        get(target, property, receiver){
            if(property !== 'Math' && property !== 'undefined' && property !== "isNaN"){
                console.table([{"方法":"get<--",'调用者':target,"类型":property,'值':target[property]}]);
            }
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

catchvm.AddPlugin({description:"Portable Document Format" ,filename:"internal-pdf-viewer",name:"PDF Viewer",MimeTypes:[{description: "Portable Document Format",suffixes: "pdf",type: "application/pdf"},{description: "Portable Document Format",suffixes: "pdf",type:"text/pdf"}]});
catchvm.AddPlugin({description:"Portable Document Format" ,filename:"internal-pdf-viewer",name:"Chrome PDF Viewer",MimeTypes:[{description: "Portable Document Format",suffixes: "pdf",type: "application/pdf"},{description: "Portable Document Format",suffixes: "pdf",type: "text/pdf"}]});
catchvm.AddPlugin({description:"Portable Document Format" ,filename:"internal-pdf-viewer",name:"Chromium PDF Viewer",MimeTypes:[{description: "Portable Document Format",suffixes: "pdf",type: "application/pdf"},{description: "Portable Document Format",suffixes: "pdf",type:"text/pdf"}]});
catchvm.AddPlugin({description:"Portable Document Format" ,filename:"internal-pdf-viewer",name:"Microsoft Edge PDF Viewer",MimeTypes:[{description: "Portable Document Format",suffixes: "pdf",type: "application/pdf"},{description: "Portable Document Format",suffixes: "pdf",type:"text/pdf"}]});
catchvm.AddPlugin({description:"Portable Document Format" ,filename:"internal-pdf-viewer",name:"WebKit built-in PDF",MimeTypes:[{description: "Portable Document Format",suffixes: "pdf",type: "application/pdf"},{description: "Portable Document Format",suffixes: "pdf",type:"text/pdf"}]});

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


//此接口待开发，目前不会实现

var DOMException = function DOMException(message){
    var dOMException = new Error(message)
    dOMException.name = 'DOMException'
    return dOMException
};catchvm.func_set_natvie(DOMException)
Object.defineProperties(DOMException.prototype, {
    [Symbol.toStringTag]: {
        value: "DOMException",
        configurable: true
    }
});

///////////////////////////////////////////////////////////////



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

CanvasRenderingContext2D.prototype.fillText = function fillText(){
    return undefined;
}
CanvasRenderingContext2D.prototype.arc = function arc(){
    // debugger;
}

CanvasRenderingContext2D.prototype.stroke = function stroke(){
    // debugger
}

///////////////////////////////////////////////////////////////

catchvm.memory.canvasRenderingContext2D = {};
catchvm.memory.canvasRenderingContext2D.__proto__ = CanvasRenderingContext2D.prototype;

catchvm.memory.canvasRenderingContext2D = catchvm.proxy(catchvm.memory.canvasRenderingContext2D);

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
var BaseAudioContext = function BaseAudioContext(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(BaseAudioContext)
Object.defineProperties(BaseAudioContext.prototype, {
    [Symbol.toStringTag]: {
        value: "BaseAudioContext",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////

BaseAudioContext.prototype.state = 'running'
BaseAudioContext.prototype.sampleRate = ''
BaseAudioContext.prototype.onstatechange = null
BaseAudioContext.prototype.onsinkchange = null

///////////////////////////////////////////////////////////////

BaseAudioContext.prototype.__proto__ = EventTarget.prototype

var AudioContext = function AudioContext(options){
    return catchvm.proxy(AudioContext);
};catchvm.func_set_natvie(AudioContext);
Object.defineProperties(AudioContext.prototype, {
    [Symbol.toStringTag]: {
        value: "AudioContext",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////

AudioContext.prototype.onstatechange = null
AudioContext.prototype.onsinkchange = null

///////////////////////////////////////////////////////////////

AudioContext.prototype.__proto__ = BaseAudioContext.prototype

var External = function External(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(External)
Object.defineProperties(External.prototype, {
    [Symbol.toStringTag]: {
        value: "External",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////


External.prototype.AddSearchProvider = function AddSearchProvider(){debugger;};catchvm.func_set_natvie(External.prototype.AddSearchProvider)
External.prototype.IsSearchProviderInstalled = function IsSearchProviderInstalled(){debugger;};catchvm.func_set_natvie(External.prototype.IsSearchProviderInstalled)

///////////////////////////////////////////////////////////////

external = {};
external.__proto__ = External.prototype
external = catchvm.proxy(external);
var WebGLRenderingContext = function WebGLRenderingContext(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(WebGLRenderingContext)
Object.defineProperties(WebGLRenderingContext.prototype, {
    [Symbol.toStringTag]: {
        value: "WebGLRenderingContext",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////

WebGLRenderingContext.prototype.getExtension = function getExtension(name){
    if(name == 'WEBGL_debug_renderer_info'){
        return catchvm.memory.webGLDebugRendererInfo
    }
    console.log(arguments)
    debugger;
    return null
}

WebGLRenderingContext.prototype.getParameter = function getParameter(pname){
    if(pname == 37445){
        return 'Google Inc. (AMD)'
    }
    if(pname == 37446){
        return 'ANGLE (AMD, AMD Radeon(TM) Graphics (0x00001636) Direct3D11 vs_5_0 ps_5_0, D3D11)'
    }
    console.log(arguments)
    debugger;
    return null
}





///////////////////////////////////////////////////////////////

catchvm.memory.webGLRenderingContext = {}
catchvm.memory.webGLRenderingContext.__proto__ = WebGLRenderingContext.prototype
catchvm.memory.webGLRenderingContext = catchvm.proxy(catchvm.memory.webGLRenderingContext)



var WebGL2RenderingContext = function WebGL2RenderingContext(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(WebGL2RenderingContext)
Object.defineProperties(WebGL2RenderingContext.prototype, {
    [Symbol.toStringTag]: {
        value: "WebGL2RenderingContext",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////




///////////////////////////////////////////////////////////////

catchvm.memory.webGL2RenderingContext = {}
catchvm.memory.webGL2RenderingContext.__proto__ = WebGL2RenderingContext.prototype
catchvm.memory.webGL2RenderingContext = catchvm.proxy(catchvm.memory.webGL2RenderingContext)
var ImageBitmapRenderingContext = function ImageBitmapRenderingContext(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(ImageBitmapRenderingContext)
Object.defineProperties(ImageBitmapRenderingContext.prototype, {
    [Symbol.toStringTag]: {
        value: "ImageBitmapRenderingContext",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////




///////////////////////////////////////////////////////////////

catchvm.memory.imageBitmapRenderingContext = {}
catchvm.memory.imageBitmapRenderingContext.__proto__ = ImageBitmapRenderingContext.prototype
catchvm.memory.imageBitmapRenderingContext = catchvm.proxy(catchvm.memory.imageBitmapRenderingContext)
var Scheduling = function Scheduling(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(Scheduling)
Object.defineProperties(Scheduling.prototype, {
    [Symbol.toStringTag]: {
        value: "Scheduling",
        configurable: true
    }
});

catchvm.memory.scheduling = {}
catchvm.memory.scheduling.__proto__ = Scheduling.prototype
catchvm.memory.scheduling = catchvm.proxy(catchvm.memory.scheduling)



var UserActivation = function UserActivation(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(UserActivation)
Object.defineProperties(UserActivation.prototype, {
    [Symbol.toStringTag]: {
        value: "UserActivation",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
UserActivation.prototype.hasBeenActive = true
UserActivation.prototype.isActive = false
///////////////////////////////////////////////////////////////
catchvm.memory.userActivation = {}
catchvm.memory.userActivation.__proto__ = UserActivation.prototype
catchvm.memory.userActivation = catchvm.proxy(catchvm.memory.userActivation)





var Geolocation = function Geolocation(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(Geolocation)
Object.defineProperties(Geolocation.prototype, {
    [Symbol.toStringTag]: {
        value: "Geolocation",
        configurable: true
    }
});

catchvm.memory.geolocation = {}
catchvm.memory.geolocation.__proto__ = Geolocation.prototype
catchvm.memory.geolocation = catchvm.proxy(catchvm.memory.geolocation)
var NetworkInformation = function NetworkInformation(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(NetworkInformation)
Object.defineProperties(NetworkInformation.prototype, {
    [Symbol.toStringTag]: {
        value: "NetworkInformation",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
NetworkInformation.prototype.downlink = 10
NetworkInformation.prototype.effectiveType = '4g'
NetworkInformation.prototype.onchange = null
NetworkInformation.prototype.rtt = 50
NetworkInformation.prototype.saveData = false


///////////////////////////////////////////////////////////////
NetworkInformation.prototype.__proto__ = EventTarget.prototype

catchvm.memory.connection = {}
catchvm.memory.connection.__proto__ = NetworkInformation.prototype
catchvm.memory.connection = catchvm.proxy(catchvm.memory.connection)
var Bluetooth = function Bluetooth(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(Bluetooth)
Object.defineProperties(Bluetooth.prototype, {
    [Symbol.toStringTag]: {
        value: "Bluetooth",
        configurable: true
    }
});
Bluetooth.prototype.__proto__ = EventTarget.prototype

catchvm.memory.bluetooth = {}
catchvm.memory.bluetooth.__proto__ = Bluetooth.prototype
catchvm.memory.bluetooth = catchvm.proxy(catchvm.memory.bluetooth)
var Clipboard = function Clipboard(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(Clipboard)
Object.defineProperties(Clipboard.prototype, {
    [Symbol.toStringTag]: {
        value: "Clipboard",
        configurable: true
    }
});
Clipboard.prototype.__proto__ = EventTarget.prototype

catchvm.memory.clipboard = {}
catchvm.memory.clipboard.__proto__ = Clipboard.prototype
catchvm.memory.clipboard = catchvm.proxy(catchvm.memory.clipboard)


var CredentialsContainer = function CredentialsContainer(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(CredentialsContainer)
Object.defineProperties(CredentialsContainer.prototype, {
    [Symbol.toStringTag]: {
        value: "CredentialsContainer",
        configurable: true
    }
});

catchvm.memory.credentials = {}
catchvm.memory.credentials.__proto__ = CredentialsContainer.prototype
catchvm.memory.credentials = catchvm.proxy(catchvm.memory.credentials)
var Keyboard = function Keyboard(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(Keyboard)
Object.defineProperties(Keyboard.prototype, {
    [Symbol.toStringTag]: {
        value: "Keyboard",
        configurable: true
    }
});

catchvm.memory.keyboard = {}
catchvm.memory.keyboard.__proto__ = Keyboard.prototype
catchvm.memory.keyboard = catchvm.proxy(catchvm.memory.keyboard)
var NavigatorManagedData = function NavigatorManagedData(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(NavigatorManagedData)
Object.defineProperties(NavigatorManagedData.prototype, {
    [Symbol.toStringTag]: {
        value: "NavigatorManagedData",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
NavigatorManagedData.prototype.onmanagedconfigurationchange = null

///////////////////////////////////////////////////////////////
NavigatorManagedData.prototype.__proto__ = EventTarget.prototype

catchvm.memory.managed = {}
catchvm.memory.managed.__proto__ = NavigatorManagedData.prototype
catchvm.memory.managed = catchvm.proxy(catchvm.memory.managed)
var StorageManager = function StorageManager(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(StorageManager)
Object.defineProperties(StorageManager.prototype, {
    [Symbol.toStringTag]: {
        value: "StorageManager",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////
StorageManager.prototype.__proto__ = EventTarget.prototype

catchvm.memory.storage = {}
catchvm.memory.storage.__proto__ = StorageManager.prototype
catchvm.memory.storage = catchvm.proxy(catchvm.memory.storage)
var ServiceWorkerContainer = function ServiceWorkerContainer(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(ServiceWorkerContainer)
Object.defineProperties(ServiceWorkerContainer.prototype, {
    [Symbol.toStringTag]: {
        value: "ServiceWorkerContainer",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
ServiceWorkerContainer.prototype.controller = null
ServiceWorkerContainer.prototype.oncontrollerchange = null
ServiceWorkerContainer.prototype.onmessage = null
ServiceWorkerContainer.prototype.onmessageerror = null

///////////////////////////////////////////////////////////////
ServiceWorkerContainer.prototype.__proto__ = EventTarget.prototype

catchvm.memory.serviceWorker = {}
catchvm.memory.serviceWorker.__proto__ = ServiceWorkerContainer.prototype
catchvm.memory.serviceWorker = catchvm.proxy(catchvm.memory.serviceWorker)
var VirtualKeyboard = function VirtualKeyboard(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(VirtualKeyboard)
Object.defineProperties(VirtualKeyboard.prototype, {
    [Symbol.toStringTag]: {
        value: "VirtualKeyboard",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////
VirtualKeyboard.prototype.__proto__ = EventTarget.prototype

catchvm.memory.virtualKeyboard = {}
catchvm.memory.virtualKeyboard.__proto__ = VirtualKeyboard.prototype
catchvm.memory.virtualKeyboard = catchvm.proxy(catchvm.memory.virtualKeyboard)
var WakeLock = function WakeLock(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(WakeLock)
Object.defineProperties(WakeLock.prototype, {
    [Symbol.toStringTag]: {
        value: "WakeLock",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////
catchvm.memory.wakeLock = {}
catchvm.memory.wakeLock.__proto__ = WakeLock.prototype
catchvm.memory.wakeLock = catchvm.proxy(catchvm.memory.wakeLock)


var Ink = function Ink(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(Ink)
Object.defineProperties(Ink.prototype, {
    [Symbol.toStringTag]: {
        value: "Ink",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////
catchvm.memory.ink = {}
catchvm.memory.ink.__proto__ = Ink.prototype
catchvm.memory.ink = catchvm.proxy(catchvm.memory.ink)


var HID = function HID(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(HID)
Object.defineProperties(HID.prototype, {
    [Symbol.toStringTag]: {
        value: "HID",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
HID.prototype.onconnect = null
HID.prototype.ondisconnect = null
///////////////////////////////////////////////////////////////
HID.prototype.__proto__ = EventTarget.prototype

catchvm.memory.hid = {}
catchvm.memory.hid.__proto__ = HID.prototype
catchvm.memory.hid = catchvm.proxy(catchvm.memory.hid)
var LockManager = function LockManager(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(LockManager)
Object.defineProperties(LockManager.prototype, {
    [Symbol.toStringTag]: {
        value: "LockManager",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////
catchvm.memory.locks = {}
catchvm.memory.locks.__proto__ = LockManager.prototype
catchvm.memory.locks = catchvm.proxy(catchvm.memory.ink)





var MediaCapabilities = function MediaCapabilities(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(MediaCapabilities)
Object.defineProperties(MediaCapabilities.prototype, {
    [Symbol.toStringTag]: {
        value: "MediaCapabilities",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////
catchvm.memory.mediaCapabilities = {}
catchvm.memory.mediaCapabilities.__proto__ = MediaCapabilities.prototype
catchvm.memory.mediaCapabilities = catchvm.proxy(catchvm.memory.mediaCapabilities)






var MediaSession = function MediaSession(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(MediaSession)
Object.defineProperties(MediaSession.prototype, {
    [Symbol.toStringTag]: {
        value: "MediaSession",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
MediaSession.prototype.metadata = null
MediaSession.prototype.playbackState = 'none'
///////////////////////////////////////////////////////////////
catchvm.memory.mediaSession = {}
catchvm.memory.mediaSession.__proto__ = MediaSession.prototype
catchvm.memory.mediaSession = catchvm.proxy(catchvm.memory.mediaSession)




var Permissions = function Permissions(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(Permissions)
Object.defineProperties(Permissions.prototype, {
    [Symbol.toStringTag]: {
        value: "Permissions",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////
catchvm.memory.permissions = {}
catchvm.memory.permissions.__proto__ = Permissions.prototype
catchvm.memory.permissions = catchvm.proxy(catchvm.memory.permissions)





var Presentation = function Presentation(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(Presentation)
Object.defineProperties(Presentation.prototype, {
    [Symbol.toStringTag]: {
        value: "Presentation",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
Presentation.prototype.defaultRequest = null
Presentation.prototype.receiver = null
///////////////////////////////////////////////////////////////
catchvm.memory.presentation = {}
catchvm.memory.presentation.__proto__ = Presentation.prototype
catchvm.memory.presentation = catchvm.proxy(catchvm.memory.presentation)







var Serial = function Serial(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(Serial)
Object.defineProperties(Serial.prototype, {
    [Symbol.toStringTag]: {
        value: "Serial",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
Serial.prototype.onconnect = null
Serial.prototype.ondisconnect = null
///////////////////////////////////////////////////////////////
Serial.prototype.__proto__ = EventTarget.prototype

catchvm.memory.serial = {}
catchvm.memory.serial.__proto__ = Serial.prototype
catchvm.memory.serial = catchvm.proxy(catchvm.memory.serial)
var GPU = function GPU(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(GPU)
Object.defineProperties(GPU.prototype, {
    [Symbol.toStringTag]: {
        value: "GPU",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////
catchvm.memory.gpu = {}
catchvm.memory.gpu.__proto__ = GPU.prototype
catchvm.memory.gpu = catchvm.proxy(catchvm.memory.gpu)






var USB = function USB(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(USB)
Object.defineProperties(USB.prototype, {
    [Symbol.toStringTag]: {
        value: "USB",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
USB.prototype.onconnect = null
USB.prototype.ondisconnect = null
///////////////////////////////////////////////////////////////
USB.prototype.__proto__ = EventTarget.prototype

catchvm.memory.usb = {}
catchvm.memory.usb.__proto__ = USB.prototype
catchvm.memory.usb = catchvm.proxy(catchvm.memory.usb)


var WindowControlsOverlay = function WindowControlsOverlay(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(WindowControlsOverlay)
Object.defineProperties(WindowControlsOverlay.prototype, {
    [Symbol.toStringTag]: {
        value: "WindowControlsOverlay",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
WindowControlsOverlay.prototype.ongeometrychange = null
WindowControlsOverlay.prototype.visible = false
///////////////////////////////////////////////////////////////
WindowControlsOverlay.prototype.__proto__ = EventTarget.prototype

catchvm.memory.windowControlsOverlay = {}
catchvm.memory.windowControlsOverlay.__proto__ = WindowControlsOverlay.prototype
catchvm.memory.windowControlsOverlay = catchvm.proxy(catchvm.memory.windowControlsOverlay)


var XRSystem = function XRSystem(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(XRSystem)
Object.defineProperties(XRSystem.prototype, {
    [Symbol.toStringTag]: {
        value: "XRSystem",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
XRSystem.prototype.ondevicechange = null

///////////////////////////////////////////////////////////////
XRSystem.prototype.__proto__ = EventTarget.prototype

catchvm.memory.xr = {}
catchvm.memory.xr.__proto__ = XRSystem.prototype
catchvm.memory.xr = catchvm.proxy(catchvm.memory.xr)

var NavigatorUAData = function NavigatorUAData(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(NavigatorUAData)
Object.defineProperties(NavigatorUAData.prototype, {
    [Symbol.toStringTag]: {
        value: "NavigatorUAData",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
NavigatorUAData.prototype.mobile = false
NavigatorUAData.prototype.platform = 'windows'
NavigatorUAData.prototype.brands = {}
///////////////////////////////////////////////////////////////
catchvm.memory.userAgentData = {}
catchvm.memory.userAgentData.__proto__ = NavigatorUAData.prototype
catchvm.memory.userAgentData = catchvm.proxy(catchvm.memory.userAgentData)






var CSSStyleDeclaration = function CSSStyleDeclaration(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(CSSStyleDeclaration)
Object.defineProperties(CSSStyleDeclaration.prototype, {
    [Symbol.toStringTag]: {
        value: "CSSStyleDeclaration",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////
catchvm.memory.style = {
    "accentColor": "",
    "additiveSymbols": "",
    "alignContent": "",
    "alignItems": "",
    "alignSelf": "",
    "alignmentBaseline": "",
    "all": "",
    "animation": "",
    "animationComposition": "",
    "animationDelay": "",
    "animationDirection": "",
    "animationDuration": "",
    "animationFillMode": "",
    "animationIterationCount": "",
    "animationName": "",
    "animationPlayState": "",
    "animationRange": "",
    "animationRangeEnd": "",
    "animationRangeStart": "",
    "animationTimeline": "",
    "animationTimingFunction": "",
    "appRegion": "",
    "appearance": "",
    "ascentOverride": "",
    "aspectRatio": "",
    "backdropFilter": "",
    "backfaceVisibility": "",
    "background": "",
    "backgroundAttachment": "",
    "backgroundBlendMode": "",
    "backgroundClip": "",
    "backgroundColor": "",
    "backgroundImage": "",
    "backgroundOrigin": "",
    "backgroundPosition": "",
    "backgroundPositionX": "",
    "backgroundPositionY": "",
    "backgroundRepeat": "",
    "backgroundSize": "",
    "basePalette": "",
    "baselineShift": "",
    "baselineSource": "",
    "blockSize": "",
    "border": "",
    "borderBlock": "",
    "borderBlockColor": "",
    "borderBlockEnd": "",
    "borderBlockEndColor": "",
    "borderBlockEndStyle": "",
    "borderBlockEndWidth": "",
    "borderBlockStart": "",
    "borderBlockStartColor": "",
    "borderBlockStartStyle": "",
    "borderBlockStartWidth": "",
    "borderBlockStyle": "",
    "borderBlockWidth": "",
    "borderBottom": "",
    "borderBottomColor": "",
    "borderBottomLeftRadius": "",
    "borderBottomRightRadius": "",
    "borderBottomStyle": "",
    "borderBottomWidth": "",
    "borderCollapse": "",
    "borderColor": "",
    "borderEndEndRadius": "",
    "borderEndStartRadius": "",
    "borderImage": "",
    "borderImageOutset": "",
    "borderImageRepeat": "",
    "borderImageSlice": "",
    "borderImageSource": "",
    "borderImageWidth": "",
    "borderInline": "",
    "borderInlineColor": "",
    "borderInlineEnd": "",
    "borderInlineEndColor": "",
    "borderInlineEndStyle": "",
    "borderInlineEndWidth": "",
    "borderInlineStart": "",
    "borderInlineStartColor": "",
    "borderInlineStartStyle": "",
    "borderInlineStartWidth": "",
    "borderInlineStyle": "",
    "borderInlineWidth": "",
    "borderLeft": "",
    "borderLeftColor": "",
    "borderLeftStyle": "",
    "borderLeftWidth": "",
    "borderRadius": "",
    "borderRight": "",
    "borderRightColor": "",
    "borderRightStyle": "",
    "borderRightWidth": "",
    "borderSpacing": "",
    "borderStartEndRadius": "",
    "borderStartStartRadius": "",
    "borderStyle": "",
    "borderTop": "",
    "borderTopColor": "",
    "borderTopLeftRadius": "",
    "borderTopRightRadius": "",
    "borderTopStyle": "",
    "borderTopWidth": "",
    "borderWidth": "",
    "bottom": "",
    "boxShadow": "",
    "boxSizing": "",
    "breakAfter": "",
    "breakBefore": "",
    "breakInside": "",
    "bufferedRendering": "",
    "captionSide": "",
    "caretColor": "",
    "clear": "",
    "clip": "",
    "clipPath": "",
    "clipRule": "",
    "color": "",
    "colorInterpolation": "",
    "colorInterpolationFilters": "",
    "colorRendering": "",
    "colorScheme": "",
    "columnCount": "",
    "columnFill": "",
    "columnGap": "",
    "columnRule": "",
    "columnRuleColor": "",
    "columnRuleStyle": "",
    "columnRuleWidth": "",
    "columnSpan": "",
    "columnWidth": "",
    "columns": "",
    "contain": "",
    "containIntrinsicBlockSize": "",
    "containIntrinsicHeight": "",
    "containIntrinsicInlineSize": "",
    "containIntrinsicSize": "",
    "containIntrinsicWidth": "",
    "container": "",
    "containerName": "",
    "containerType": "",
    "content": "",
    "contentVisibility": "",
    "counterIncrement": "",
    "counterReset": "",
    "counterSet": "",
    "cursor": "",
    "cx": "",
    "cy": "",
    "d": "",
    "descentOverride": "",
    "direction": "",
    "display": "",
    "dominantBaseline": "",
    "emptyCells": "",
    "fallback": "",
    "fill": "",
    "fillOpacity": "",
    "fillRule": "",
    "filter": "",
    "flex": "",
    "flexBasis": "",
    "flexDirection": "",
    "flexFlow": "",
    "flexGrow": "",
    "flexShrink": "",
    "flexWrap": "",
    "float": "",
    "floodColor": "",
    "floodOpacity": "",
    "font": "",
    "fontDisplay": "",
    "fontFamily": "",
    "fontFeatureSettings": "",
    "fontKerning": "",
    "fontOpticalSizing": "",
    "fontPalette": "",
    "fontSize": "",
    "fontStretch": "",
    "fontStyle": "",
    "fontSynthesis": "",
    "fontSynthesisSmallCaps": "",
    "fontSynthesisStyle": "",
    "fontSynthesisWeight": "",
    "fontVariant": "",
    "fontVariantAlternates": "",
    "fontVariantCaps": "",
    "fontVariantEastAsian": "",
    "fontVariantLigatures": "",
    "fontVariantNumeric": "",
    "fontVariantPosition": "",
    "fontVariationSettings": "",
    "fontWeight": "",
    "forcedColorAdjust": "",
    "gap": "",
    "grid": "",
    "gridArea": "",
    "gridAutoColumns": "",
    "gridAutoFlow": "",
    "gridAutoRows": "",
    "gridColumn": "",
    "gridColumnEnd": "",
    "gridColumnGap": "",
    "gridColumnStart": "",
    "gridGap": "",
    "gridRow": "",
    "gridRowEnd": "",
    "gridRowGap": "",
    "gridRowStart": "",
    "gridTemplate": "",
    "gridTemplateAreas": "",
    "gridTemplateColumns": "",
    "gridTemplateRows": "",
    "height": "",
    "hyphenateCharacter": "",
    "hyphenateLimitChars": "",
    "hyphens": "",
    "imageOrientation": "",
    "imageRendering": "",
    "inherits": "",
    "initialLetter": "",
    "initialValue": "",
    "inlineSize": "",
    "inset": "",
    "insetBlock": "",
    "insetBlockEnd": "",
    "insetBlockStart": "",
    "insetInline": "",
    "insetInlineEnd": "",
    "insetInlineStart": "",
    "isolation": "",
    "justifyContent": "",
    "justifyItems": "",
    "justifySelf": "",
    "left": "",
    "letterSpacing": "",
    "lightingColor": "",
    "lineBreak": "",
    "lineGapOverride": "",
    "lineHeight": "",
    "listStyle": "",
    "listStyleImage": "",
    "listStylePosition": "",
    "listStyleType": "",
    "margin": "",
    "marginBlock": "",
    "marginBlockEnd": "",
    "marginBlockStart": "",
    "marginBottom": "",
    "marginInline": "",
    "marginInlineEnd": "",
    "marginInlineStart": "",
    "marginLeft": "",
    "marginRight": "",
    "marginTop": "",
    "marker": "",
    "markerEnd": "",
    "markerMid": "",
    "markerStart": "",
    "mask": "",
    "maskClip": "",
    "maskComposite": "",
    "maskImage": "",
    "maskMode": "",
    "maskOrigin": "",
    "maskPosition": "",
    "maskRepeat": "",
    "maskSize": "",
    "maskType": "",
    "mathDepth": "",
    "mathShift": "",
    "mathStyle": "",
    "maxBlockSize": "",
    "maxHeight": "",
    "maxInlineSize": "",
    "maxWidth": "",
    "minBlockSize": "",
    "minHeight": "",
    "minInlineSize": "",
    "minWidth": "",
    "mixBlendMode": "",
    "negative": "",
    "objectFit": "",
    "objectPosition": "",
    "objectViewBox": "",
    "offset": "",
    "offsetAnchor": "",
    "offsetDistance": "",
    "offsetPath": "",
    "offsetPosition": "",
    "offsetRotate": "",
    "opacity": "",
    "order": "",
    "orphans": "",
    "outline": "",
    "outlineColor": "",
    "outlineOffset": "",
    "outlineStyle": "",
    "outlineWidth": "",
    "overflow": "",
    "overflowAnchor": "",
    "overflowClipMargin": "",
    "overflowWrap": "",
    "overflowX": "",
    "overflowY": "",
    "overlay": "",
    "overrideColors": "",
    "overscrollBehavior": "",
    "overscrollBehaviorBlock": "",
    "overscrollBehaviorInline": "",
    "overscrollBehaviorX": "",
    "overscrollBehaviorY": "",
    "pad": "",
    "padding": "",
    "paddingBlock": "",
    "paddingBlockEnd": "",
    "paddingBlockStart": "",
    "paddingBottom": "",
    "paddingInline": "",
    "paddingInlineEnd": "",
    "paddingInlineStart": "",
    "paddingLeft": "",
    "paddingRight": "",
    "paddingTop": "",
    "page": "",
    "pageBreakAfter": "",
    "pageBreakBefore": "",
    "pageBreakInside": "",
    "pageOrientation": "",
    "paintOrder": "",
    "perspective": "",
    "perspectiveOrigin": "",
    "placeContent": "",
    "placeItems": "",
    "placeSelf": "",
    "pointerEvents": "",
    "position": "",
    "prefix": "",
    "quotes": "",
    "r": "",
    "range": "",
    "resize": "",
    "right": "",
    "rotate": "",
    "rowGap": "",
    "rubyPosition": "",
    "rx": "",
    "ry": "",
    "scale": "",
    "scrollBehavior": "",
    "scrollMargin": "",
    "scrollMarginBlock": "",
    "scrollMarginBlockEnd": "",
    "scrollMarginBlockStart": "",
    "scrollMarginBottom": "",
    "scrollMarginInline": "",
    "scrollMarginInlineEnd": "",
    "scrollMarginInlineStart": "",
    "scrollMarginLeft": "",
    "scrollMarginRight": "",
    "scrollMarginTop": "",
    "scrollPadding": "",
    "scrollPaddingBlock": "",
    "scrollPaddingBlockEnd": "",
    "scrollPaddingBlockStart": "",
    "scrollPaddingBottom": "",
    "scrollPaddingInline": "",
    "scrollPaddingInlineEnd": "",
    "scrollPaddingInlineStart": "",
    "scrollPaddingLeft": "",
    "scrollPaddingRight": "",
    "scrollPaddingTop": "",
    "scrollSnapAlign": "",
    "scrollSnapStop": "",
    "scrollSnapType": "",
    "scrollTimeline": "",
    "scrollTimelineAxis": "",
    "scrollTimelineName": "",
    "scrollbarGutter": "",
    "shapeImageThreshold": "",
    "shapeMargin": "",
    "shapeOutside": "",
    "shapeRendering": "",
    "size": "",
    "sizeAdjust": "",
    "speak": "",
    "speakAs": "",
    "src": "",
    "stopColor": "",
    "stopOpacity": "",
    "stroke": "",
    "strokeDasharray": "",
    "strokeDashoffset": "",
    "strokeLinecap": "",
    "strokeLinejoin": "",
    "strokeMiterlimit": "",
    "strokeOpacity": "",
    "strokeWidth": "",
    "suffix": "",
    "symbols": "",
    "syntax": "",
    "system": "",
    "tabSize": "",
    "tableLayout": "",
    "textAlign": "",
    "textAlignLast": "",
    "textAnchor": "",
    "textCombineUpright": "",
    "textDecoration": "",
    "textDecorationColor": "",
    "textDecorationLine": "",
    "textDecorationSkipInk": "",
    "textDecorationStyle": "",
    "textDecorationThickness": "",
    "textEmphasis": "",
    "textEmphasisColor": "",
    "textEmphasisPosition": "",
    "textEmphasisStyle": "",
    "textIndent": "",
    "textOrientation": "",
    "textOverflow": "",
    "textRendering": "",
    "textShadow": "",
    "textSizeAdjust": "",
    "textTransform": "",
    "textUnderlineOffset": "",
    "textUnderlinePosition": "",
    "textWrap": "",
    "timelineScope": "",
    "top": "",
    "touchAction": "",
    "transform": "",
    "transformBox": "",
    "transformOrigin": "",
    "transformStyle": "",
    "transition": "",
    "transitionBehavior": "",
    "transitionDelay": "",
    "transitionDuration": "",
    "transitionProperty": "",
    "transitionTimingFunction": "",
    "translate": "",
    "unicodeBidi": "",
    "unicodeRange": "",
    "userSelect": "",
    "vectorEffect": "",
    "verticalAlign": "",
    "viewTimeline": "",
    "viewTimelineAxis": "",
    "viewTimelineInset": "",
    "viewTimelineName": "",
    "viewTransitionName": "",
    "visibility": "",
    "webkitAlignContent": "",
    "webkitAlignItems": "",
    "webkitAlignSelf": "",
    "webkitAnimation": "",
    "webkitAnimationDelay": "",
    "webkitAnimationDirection": "",
    "webkitAnimationDuration": "",
    "webkitAnimationFillMode": "",
    "webkitAnimationIterationCount": "",
    "webkitAnimationName": "",
    "webkitAnimationPlayState": "",
    "webkitAnimationTimingFunction": "",
    "webkitAppRegion": "",
    "webkitAppearance": "",
    "webkitBackfaceVisibility": "",
    "webkitBackgroundClip": "",
    "webkitBackgroundOrigin": "",
    "webkitBackgroundSize": "",
    "webkitBorderAfter": "",
    "webkitBorderAfterColor": "",
    "webkitBorderAfterStyle": "",
    "webkitBorderAfterWidth": "",
    "webkitBorderBefore": "",
    "webkitBorderBeforeColor": "",
    "webkitBorderBeforeStyle": "",
    "webkitBorderBeforeWidth": "",
    "webkitBorderBottomLeftRadius": "",
    "webkitBorderBottomRightRadius": "",
    "webkitBorderEnd": "",
    "webkitBorderEndColor": "",
    "webkitBorderEndStyle": "",
    "webkitBorderEndWidth": "",
    "webkitBorderHorizontalSpacing": "",
    "webkitBorderImage": "",
    "webkitBorderRadius": "",
    "webkitBorderStart": "",
    "webkitBorderStartColor": "",
    "webkitBorderStartStyle": "",
    "webkitBorderStartWidth": "",
    "webkitBorderTopLeftRadius": "",
    "webkitBorderTopRightRadius": "",
    "webkitBorderVerticalSpacing": "",
    "webkitBoxAlign": "",
    "webkitBoxDecorationBreak": "",
    "webkitBoxDirection": "",
    "webkitBoxFlex": "",
    "webkitBoxOrdinalGroup": "",
    "webkitBoxOrient": "",
    "webkitBoxPack": "",
    "webkitBoxReflect": "",
    "webkitBoxShadow": "",
    "webkitBoxSizing": "",
    "webkitClipPath": "",
    "webkitColumnBreakAfter": "",
    "webkitColumnBreakBefore": "",
    "webkitColumnBreakInside": "",
    "webkitColumnCount": "",
    "webkitColumnGap": "",
    "webkitColumnRule": "",
    "webkitColumnRuleColor": "",
    "webkitColumnRuleStyle": "",
    "webkitColumnRuleWidth": "",
    "webkitColumnSpan": "",
    "webkitColumnWidth": "",
    "webkitColumns": "",
    "webkitFilter": "",
    "webkitFlex": "",
    "webkitFlexBasis": "",
    "webkitFlexDirection": "",
    "webkitFlexFlow": "",
    "webkitFlexGrow": "",
    "webkitFlexShrink": "",
    "webkitFlexWrap": "",
    "webkitFontFeatureSettings": "",
    "webkitFontSmoothing": "",
    "webkitHyphenateCharacter": "",
    "webkitJustifyContent": "",
    "webkitLineBreak": "",
    "webkitLineClamp": "",
    "webkitLocale": "",
    "webkitLogicalHeight": "",
    "webkitLogicalWidth": "",
    "webkitMarginAfter": "",
    "webkitMarginBefore": "",
    "webkitMarginEnd": "",
    "webkitMarginStart": "",
    "webkitMask": "",
    "webkitMaskBoxImage": "",
    "webkitMaskBoxImageOutset": "",
    "webkitMaskBoxImageRepeat": "",
    "webkitMaskBoxImageSlice": "",
    "webkitMaskBoxImageSource": "",
    "webkitMaskBoxImageWidth": "",
    "webkitMaskClip": "",
    "webkitMaskComposite": "",
    "webkitMaskImage": "",
    "webkitMaskOrigin": "",
    "webkitMaskPosition": "",
    "webkitMaskPositionX": "",
    "webkitMaskPositionY": "",
    "webkitMaskRepeat": "",
    "webkitMaskSize": "",
    "webkitMaxLogicalHeight": "",
    "webkitMaxLogicalWidth": "",
    "webkitMinLogicalHeight": "",
    "webkitMinLogicalWidth": "",
    "webkitOpacity": "",
    "webkitOrder": "",
    "webkitPaddingAfter": "",
    "webkitPaddingBefore": "",
    "webkitPaddingEnd": "",
    "webkitPaddingStart": "",
    "webkitPerspective": "",
    "webkitPerspectiveOrigin": "",
    "webkitPerspectiveOriginX": "",
    "webkitPerspectiveOriginY": "",
    "webkitPrintColorAdjust": "",
    "webkitRtlOrdering": "",
    "webkitRubyPosition": "",
    "webkitShapeImageThreshold": "",
    "webkitShapeMargin": "",
    "webkitShapeOutside": "",
    "webkitTapHighlightColor": "",
    "webkitTextCombine": "",
    "webkitTextDecorationsInEffect": "",
    "webkitTextEmphasis": "",
    "webkitTextEmphasisColor": "",
    "webkitTextEmphasisPosition": "",
    "webkitTextEmphasisStyle": "",
    "webkitTextFillColor": "",
    "webkitTextOrientation": "",
    "webkitTextSecurity": "",
    "webkitTextSizeAdjust": "",
    "webkitTextStroke": "",
    "webkitTextStrokeColor": "",
    "webkitTextStrokeWidth": "",
    "webkitTransform": "",
    "webkitTransformOrigin": "",
    "webkitTransformOriginX": "",
    "webkitTransformOriginY": "",
    "webkitTransformOriginZ": "",
    "webkitTransformStyle": "",
    "webkitTransition": "",
    "webkitTransitionDelay": "",
    "webkitTransitionDuration": "",
    "webkitTransitionProperty": "",
    "webkitTransitionTimingFunction": "",
    "webkitUserDrag": "",
    "webkitUserModify": "",
    "webkitUserSelect": "",
    "webkitWritingMode": "",
    "whiteSpace": "",
    "whiteSpaceCollapse": "",
    "widows": "",
    "width": "",
    "willChange": "",
    "wordBreak": "",
    "wordSpacing": "",
    "wordWrap": "",
    "writingMode": "",
    "x": "",
    "y": "",
    "zIndex": "",
    "zoom": ""
}
catchvm.memory.style.__proto__ = CSSStyleDeclaration.prototype
catchvm.memory.style = catchvm.proxy(catchvm.memory.style)




var DOMImplementation = function DOMImplementation(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(DOMImplementation)
Object.defineProperties(DOMImplementation.prototype, {
    [Symbol.toStringTag]: {
        value: "DOMImplementation",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////
catchvm.memory.implementation = {}
catchvm.memory.implementation.__proto__ = DOMImplementation.prototype
catchvm.memory.implementation = catchvm.proxy(catchvm.memory.implementation)



var WebGLDebugRendererInfo = function WebGLDebugRendererInfo(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(WebGLDebugRendererInfo)
Object.defineProperties(WebGLDebugRendererInfo.prototype, {
    [Symbol.toStringTag]: {
        value: "WebGLDebugRendererInfo",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////

WebGLDebugRendererInfo.prototype.UNMASKED_RENDERER_WEBGL = 37446
WebGLDebugRendererInfo.prototype.UNMASKED_VENDOR_WEBGL = 37445

///////////////////////////////////////////////////////////////

catchvm.memory.webGLDebugRendererInfo = {}
catchvm.memory.webGLDebugRendererInfo.__proto__ = WebGLDebugRendererInfo.prototype
catchvm.memory.webGLDebugRendererInfo = catchvm.proxy(catchvm.memory.webGLDebugRendererInfo)
var HTMLAllCollection = function HTMLAllCollection(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(HTMLAllCollection)
Object.defineProperties(HTMLAllCollection.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLAllCollection",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////

catchvm.memory.htmlAllCollection = {}
catchvm.memory.htmlAllCollection.__proto__ = HTMLAllCollection.prototype
catchvm.memory.htmlAllCollection = catchvm.proxy(catchvm.memory.htmlAllCollection)

var DOMTokenList = function DOMTokenList(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(DOMTokenList)
Object.defineProperties(DOMTokenList.prototype, {
    [Symbol.toStringTag]: {
        value: "DOMTokenList",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
DOMTokenList.prototype.length = 0
DOMTokenList.prototype.value = ''

///////////////////////////////////////////////////////////////

catchvm.memory.domTokenList = {}
catchvm.memory.domTokenList.__proto__ = DOMTokenList.prototype
catchvm.memory.domTokenList = catchvm.proxy(catchvm.memory.domTokenList)
var Performance = function Performance(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(Performance)
Object.defineProperties(Performance.prototype, {
    [Symbol.toStringTag]: {
        value: "Performance",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
Performance.prototype.eventCounts = {}
Performance.prototype.memory = {}
Performance.prototype.navigation = {}
Performance.prototype.onresourcetimingbufferfull = null
Performance.prototype.timeOrigin = {}
Performance.prototype.timing = {}

Performance.prototype.now = function now(){
    return 150328.69999999925
}



///////////////////////////////////////////////////////////////

Performance.prototype.__proto__ = EventTarget.prototype

catchvm.memory.performance = {}
catchvm.memory.performance.__proto__ = Performance.prototype
catchvm.memory.performance = catchvm.proxy(catchvm.memory.performance)


var ScreenOrientation = function ScreenOrientation(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(ScreenOrientation)
Object.defineProperties(ScreenOrientation.prototype, {
    [Symbol.toStringTag]: {
        value: "ScreenOrientation",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
ScreenOrientation.prototype.angle = 0
ScreenOrientation.prototype.onchange = null
ScreenOrientation.prototype.type = "landscape-primary"

///////////////////////////////////////////////////////////////
ScreenOrientation.prototype.__proto__ = EventTarget.prototype

catchvm.memory.orientation = {}
catchvm.memory.orientation.__proto__ = ScreenOrientation.prototype
catchvm.memory.orientation = catchvm.proxy(catchvm.memory.orientation)


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
    console.log(arguments)
    var flag_ = false;
    if(this == aChild){
        debugger
        flag_ = true
    }else{
        for(let p =this;p.father_element !== null;p = p.father_element){
            if(p.father_element == aChild){
                debugger
                flag_ = true
            }
        }
    }

    if(flag_){
        debugger;
        throw new DOMException('Failed to execute \'appendChild\' on \'Node\': The new child element contains the parent.')
    }
    this.childelement.push(aChild)
    aChild.father_element = this;
    return aChild

    // debugger;
};catchvm.func_set_natvie(Node.prototype.appendChild)

Node.prototype.removeChild = function removeChild(Child){
    console.log(arguments)
    // debugger;
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

Element.prototype.tagName = ''
Element.prototype.classList = catchvm.memory.domTokenList





Element.prototype.getAttribute = function getAttribute(attributeName){
    console.log(arguments)
    // debugger;
    return null;
};catchvm.func_set_natvie(Element.prototype.getAttribute)

Element.prototype.remove = function remove(){
    // debugger;
    return null;
};catchvm.func_set_natvie(Element.prototype.remove)


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
HTMLElement.prototype.style = catchvm.memory.style
HTMLElement.prototype.offsetHeight = 0

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
    // debugger;
    this.method = method;
    this.url = url;
    this.async = async;
    this.user = user;
    this.password = password;
};catchvm.func_set_natvie(XMLHttpRequest.prototype.open);

XMLHttpRequest.prototype.send = function send(body = null){
    this.body = body;
    // debugger;
};catchvm.func_set_natvie(XMLHttpRequest.prototype.open);



///////////////////////////////////////////////////////////////

// XMLHttpRequest.prototype.__proto__ = XMLHttpRequestEventTarget.prototype;

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
};catchvm.func_set_natvie(MediaDevices.prototype.enumerateDevices);

MediaDevices.prototype.getDisplayMedia = function getDisplayMedia(){debugger;};catchvm.func_set_natvie(MediaDevices.prototype.getDisplayMedia)
MediaDevices.prototype.getSupportedConstraints = function getSupportedConstraints(){debugger;};catchvm.func_set_natvie(MediaDevices.prototype.getSupportedConstraints)
MediaDevices.prototype.setCaptureHandleConfig = function setCaptureHandleConfig(){debugger;};catchvm.func_set_natvie(MediaDevices.prototype.setCaptureHandleConfig)


///////////////////////////////////////////////////////////////
catchvm.memory.mediaDevices = {};
catchvm.memory.mediaDevices.__proto__ = MediaDevices.prototype;

MediaDevices.prototype.__proto__ = EventTarget.prototype;

catchvm.memory.mediaDevices = catchvm.proxy(catchvm.memory.mediaDevices);
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
    // debugger;
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

if(catchvm.memory.PluginArray._ != undefined){
    var count = 0;
    for(let i = 0;i < catchvm.memory.PluginArray._.length;i++){
        var mimeArray = catchvm.memory.PluginArray._[i];
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
    // x有可能是方法，也有可能是文本
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



window.top = window
window.self = window

window.outerHeight = 834;
window.outerWidth = 1536;
window.innerWidth = 1482;
window.innerHeight = 726;
window.screenX = 0;
window.screenY = 0
window.pageYOffset = 0;
window.devicePixelRatio = 1.25;
window.chrome = catchvm.proxy(class chrome{})
window.name = ''
window.performance = catchvm.memory.performance


//↓↓↓↓↓↓↓↓↓↓↓↓↓可删↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

window.onwheelx = {"_Ax": "0X21"}

//↑↑↑↑↑↑↑↑↑↑↑↑↑可删↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

window.alert = function alert(){
    debugger;
    console.log(arguments)
};catchvm.func_set_natvie(window.alert)
// window.CHAMELEON_LOADED = true;


window.fetch = function fetch(){
    debugger;
};catchvm.func_set_natvie(window.fetch);
window.requestAnimationFrame = function requestAnimationFrame(callback){
    console.log(callback)
    debugger;
    return 1234567
};catchvm.func_set_natvie(window.requestAnimationFrame);
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
        value: "Location",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
location = {};
location.__proto__ = Location.prototype;


location.href = ''
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
Navigator.prototype.plugins = catchvm.memory.PluginArray._;
Navigator.prototype.mimeTypes = catchvm.memory.MimeTypeArray._;
Navigator.prototype.mediaDevices = catchvm.memory.mediaDevices;
Navigator.prototype.language = "zh-CN";
Navigator.prototype.languages = ["zh-CN","en","en-GB","en-US"];
Navigator.prototype.userAgent = ''
Navigator.prototype.vendor = 'Google Inc.'
Navigator.prototype.appName = 'Netscape';
Navigator.prototype.appVersion = ''
Navigator.prototype.cookieEnabled = true;
Navigator.prototype.deviceMemory = 8;
Navigator.prototype.maxTouchPoints = 0;
Navigator.prototype.doNotTrack = null;
Navigator.prototype.productSub = '20030107';
Navigator.prototype.vendorSub = '';
Navigator.prototype.pdfViewerEnabled = true;
Navigator.prototype.appCodeName = 'Mozilla';
Navigator.prototype.onLine = true;


Navigator.prototype.scheduling = catchvm.memory.scheduling
Navigator.prototype.userActivation = catchvm.memory.userActivation
Navigator.prototype.geolocation = catchvm.memory.geolocation
Navigator.prototype.connection = catchvm.memory.connection
Navigator.prototype.bluetooth = catchvm.memory.bluetooth
Navigator.prototype.clipboard = catchvm.memory.clipboard
Navigator.prototype.credentials = catchvm.memory.credentials
Navigator.prototype.keyboard = catchvm.memory.keyboard
Navigator.prototype.managed = catchvm.memory.managed
Navigator.prototype.storage = catchvm.memory.storage
Navigator.prototype.serviceWorker = catchvm.memory.serviceWorker
Navigator.prototype.virtualKeyboard = catchvm.memory.virtualKeyboard
Navigator.prototype.wakeLock = catchvm.memory.wakeLock
Navigator.prototype.ink = catchvm.memory.ink
Navigator.prototype.hid = catchvm.memory.hid
Navigator.prototype.locks = catchvm.memory.locks
Navigator.prototype.mediaCapabilities = catchvm.memory.mediaCapabilities
Navigator.prototype.mediaSession = catchvm.memory.mediaSession
Navigator.prototype.permissions = catchvm.memory.permissions
Navigator.prototype.presentation = catchvm.memory.presentation
Navigator.prototype.serial = catchvm.memory.serial
Navigator.prototype.gpu = catchvm.memory.gpu
Navigator.prototype.usb = catchvm.memory.usb
Navigator.prototype.windowControlsOverlay = catchvm.memory.windowControlsOverlay
Navigator.prototype.xr = catchvm.memory.xr
Navigator.prototype.userAgentData = catchvm.memory.userAgentData

//↓↓↓↓↓↓↓↓↓↓↓↓↓可删↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

Navigator.prototype.vendorSubs = {"ink": Date.now()}

//↑↑↑↑↑↑↑↑↑↑↑↑↑可删↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑



Navigator.prototype.registerProtocolHandler = function registerProtocolHandler(){
    debugger;
};catchvm.func_set_natvie(Navigator.prototype.registerProtocolHandler)

Navigator.prototype.setAppBadge = function setAppBadge(){
    debugger;
};catchvm.func_set_natvie(Navigator.prototype.setAppBadge)

Navigator.prototype.getUserMedia = function getUserMedia(){
    debugger;
};catchvm.func_set_natvie(Navigator.prototype.getUserMedia)

Navigator.prototype.getBattery = function getBattery(){
    debugger;
};catchvm.func_set_natvie(Navigator.prototype.getBattery)

Navigator.prototype.clearAppBadge = function clearAppBadge(){
    debugger;
};catchvm.func_set_natvie(Navigator.prototype.clearAppBadge)

Navigator.prototype.vibrate = function vibrate(){
    debugger;
};catchvm.func_set_natvie(Navigator.prototype.vibrate)

Navigator.prototype.sendBeacon = function sendBeacon(){
    debugger;
};catchvm.func_set_natvie(Navigator.prototype.sendBeacon)

Navigator.prototype.getGamepads = function getGamepads(){
    debugger;
    return [null,]
};catchvm.func_set_natvie(Navigator.prototype.getGamepads)


//网站自己新定义的方法和属性(可删除)↓↓↓↓↓↓↓↓↓↓
Navigator.prototype.hardwareConcurrency = 12;
Navigator.prototype.platform = 'Win32';
Navigator.prototype.product = 'Gecko';
Navigator.prototype.webkitTemporaryStorage = {}
Navigator.prototype.webkitPersistentStorage = {}


Navigator.prototype.unregisterProtocolHandler = function unregisterProtocolHandler(){
    debugger;
};catchvm.func_set_natvie(Navigator.prototype.unregisterProtocolHandler)

Navigator.prototype.getInstalledRelatedApps = function getInstalledRelatedApps(){
    debugger;
};catchvm.func_set_natvie(Navigator.prototype.getInstalledRelatedApps)

Navigator.prototype.webkitGetUserMedia = function webkitGetUserMedia(){
    debugger;
};catchvm.func_set_natvie(Navigator.prototype.webkitGetUserMedia)

Navigator.prototype.requestMediaKeySystemAccess = function requestMediaKeySystemAccess(){
    debugger;
};catchvm.func_set_natvie(Navigator.prototype.requestMediaKeySystemAccess)

Navigator.prototype.requestMIDIAccess = function requestMIDIAccess(){
    debugger;
};catchvm.func_set_natvie(Navigator.prototype.requestMIDIAccess)

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
Screen.prototype.pixelDepth = 24;


Screen.prototype.orientation = catchvm.memory.orientation

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
    console.log(arguments)
    // debugger;
    return this[k];
};catchvm.func_set_natvie(Storage.prototype.getItem);

Storage.prototype.key = function key(index){
    console.log(arguments)
    // debugger;
    return Object.keys(this)[index];
};catchvm.func_set_natvie(Storage.prototype.key);

Storage.prototype.removeItem = function removeItem(k){
    console.log(arguments)
    // debugger;
    delete this[k];
};catchvm.func_set_natvie(Storage.prototype.removeItem);

Storage.prototype.setItem = function setItem(k,v){
    console.log(arguments)
    // debugger;
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
localStorage.sdt_source_storage_key = '{"commonPatch":["/fe_api/burdock/v2/note/post","/api/sns/web/v1/comment/post","/api/sns/web/v1/note/like","/api/sns/web/v1/note/collect","/api/sns/web/v1/user/follow","/api/sns/web/v1/feed","/api/sns/web/v1/login/activate","/api/sns/web/v1/note/metrics_report","/api/redcaptcha","/api/store/jpd/main","/phoenix/api/strategy/getAppStrategy"],"signUrl":"https://fe-video-qc.xhscdn.com/fe-platform/6e0d0a976c31ec4cf07d8dfaea68aefe79a8c678.js","signVersion":"1","url":"https://fe-video-qc.xhscdn.com/fe-platform/7a700537086390bf42ed95a3c3b675820f791299.js","reportUrl":"/api/sec/v1/shield/webprofile","desVersion":"2","validate":true}'
localStorage._byted_param_sw = 'JnfXqTqnLfFr+qj7drY='
localStorage.tt_scid = 'fj9WDjGsZIIRjlfk4MqP8QwzdNZclzad-FJwSFLoCaB84qKtJNGWgLlI3oUW3moO46aa'
localStorage.xmst = 'tvzxtTuBLjwtJOAtN2MbHyVWzlo_xDqyd5spFM8gUbPYLV--CBOmnxP4j7USfqUIOfP350BCnUUkv0Z5xyFFEBXC4iM3-B44A6gHe1QTvTO8vII7q8uy'


localStorage.__proto__ = Storage.prototype;

sessionStorage = {};
sessionStorage.__proto__ = Storage.prototype;


localStorage = catchvm.proxy(localStorage);
sessionStorage = catchvm.proxy(sessionStorage);
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
    div.tagName = 'div'.toUpperCase()
    div.childelement = []
    div.father_element = null


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
    body.tagName = 'body'.toUpperCase()
    body.childelement = []
    body.father_element = null

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
    form.tagName = 'form'.toUpperCase()
    form.childelement = []
    form.father_element = null


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
    Canvas.tagName = 'Canvas'.toUpperCase()
    Canvas.childelement = []
    Canvas.father_element = null

    HTMLCanvasElement.prototype.height = 150;
    HTMLCanvasElement.prototype.width = 300;

    HTMLCanvasElement.prototype.getContext = function getContext(contextType){
        console.log(arguments)
        // debugger;
        if(contextType == '2d'){
            return catchvm.memory.canvasRenderingContext2D;
        }else if(contextType == 'webgl'){
            return catchvm.memory.webGLRenderingContext
        }else if(contextType == 'webgl2'){
            return catchvm.memory.webGL2RenderingContext
        }else if(contextType == 'bitmaprenderer'){
            return catchvm.memory.imageBitmapRenderingContext
        }else{
            return null
        }
    };catchvm.func_set_natvie(HTMLCanvasElement.prototype.getContext)


    HTMLCanvasElement.prototype.toDataURL = function toDataURL(type, encoderOptions){
        console.log(arguments)
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAAXNSR0IArs4c6QAABGJJREFUeF7t1AEJAAAMAsHZv/RyPNwSyDncOQIECEQEFskpJgECBM5geQICBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAgQdWMQCX4yW9owAAAABJRU5ErkJggg=='
    };catchvm.func_set_natvie(HTMLCanvasElement.prototype.toDataURL)


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
    head.tagName = 'head'.toUpperCase()
    head.childelement = []
    head.father_element = null

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
    html.tagName = 'html'.toUpperCase()
    html.childelement = []
    html.father_element = null

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
    iframe.tagName = 'iframe'.toUpperCase()
    iframe.childelement = []
    iframe.father_element = null

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
    script.tagName = 'script'.toUpperCase()
    script.childelement = []
    script.father_element = null

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


catchvm.memory.HTMLElements['a'] = function(){
    var a = new(function(){});
    ///////////////////////////////////////////////
    a.tagName = 'a'.toUpperCase()
    a.childelement = []
    a.father_element = null

    ///////////////////////////////////////////////
    a.__proto__ = HTMLAnchorElement.prototype;
    return a;
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
    button.tagName = 'button'.toUpperCase()
    button.childelement = []
    button.father_element = null

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
    input.tagName = 'input'.toUpperCase()
    input.childelement = []
    input.father_element = null

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
    label.tagName = 'label'.toUpperCase()
    label.childelement = []
    label.father_element = null

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
    link.tagName = 'link'.toUpperCase()
    link.childelement = []
    link.father_element = null

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
    image.tagName = 'image'.toUpperCase()
    image.childelement = []
    image.father_element = null

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
    audio.tagName = 'audio'.toUpperCase()
    audio.childelement = []
    audio.father_element = null

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
    option.tagName = 'option'.toUpperCase()
    option.childelement = []
    option.father_element = null

    ///////////////////////////////////////////////
    option.__proto__ = HTMLOptionElement.prototype;
    return option;
}

var HTMLParagraphElement = function HTMLParagraphElement(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(HTMLParagraphElement)
Object.defineProperties(HTMLParagraphElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLParagraphElement",
        configurable: true
    }
});

HTMLParagraphElement.prototype.__proto__ = HTMLElement.prototype;


catchvm.memory.HTMLElements['p'] = function(){
    var p = new(function(){});
    ///////////////////////////////////////////////
    p.tagName = 'p'.toUpperCase()
    p.childelement = []
    p.father_element = null

    HTMLParagraphElement.prototype.align = '';
    ///////////////////////////////////////////////
    p.__proto__ = HTMLParagraphElement.prototype;
    return p;
}





var HTMLHeadingElement = function HTMLHeadingElement(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(HTMLHeadingElement)
Object.defineProperties(HTMLHeadingElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLHeadingElement",
        configurable: true
    }
});

HTMLHeadingElement.prototype.__proto__ = HTMLElement.prototype;

catchvm.memory.HTMLElements['h1'] = function(){
    var h1 = new(function(){});
    ///////////////////////////////////////////////
    h1.tagName = 'h1'.toUpperCase()
    h1.childelement = []
    h1.father_element = null

    ///////////////////////////////////////////////
    h1.__proto__ = HTMLHeadingElement.prototype;
    return h1;
}

catchvm.memory.HTMLElements['h2'] = function(){
    var h2 = new(function(){});
    ///////////////////////////////////////////////
    h2.tagName = 'h2'.toUpperCase()
    h2.childelement = []
    h2.father_element = null

    ///////////////////////////////////////////////
    h2.__proto__ = HTMLHeadingElement.prototype;
    return h2;
}

catchvm.memory.HTMLElements['h3'] = function(){
    var h3 = new(function(){});
    ///////////////////////////////////////////////
    h3.tagName = 'h3'.toUpperCase()
    h3.childelement = []
    h3.father_element = null

    ///////////////////////////////////////////////
    h3.__proto__ = HTMLHeadingElement.prototype;
    return h3;
}

catchvm.memory.HTMLElements['h4'] = function(){
    var h4 = new(function(){});
    ///////////////////////////////////////////////
    h4.tagName = 'h4'.toUpperCase()
    h4.childelement = []
    h4.father_element = null

    ///////////////////////////////////////////////
    h4.__proto__ = HTMLHeadingElement.prototype;
    return h4;
}

catchvm.memory.HTMLElements['h5'] = function(){
    var h5 = new(function(){});
    ///////////////////////////////////////////////
    h5.tagName = 'h5'.toUpperCase()
    h5.childelement = []
    h5.father_element = null

    ///////////////////////////////////////////////
    h5.__proto__ = HTMLHeadingElement.prototype;
    return h5;
}

catchvm.memory.HTMLElements['h6'] = function(){
    var h6 = new(function(){});
    ///////////////////////////////////////////////
    h6.tagName = 'h6'.toUpperCase()
    h6.childelement = []
    h6.father_element = null

    ///////////////////////////////////////////////
    h6.__proto__ = HTMLHeadingElement.prototype;
    return h6;
}


var HTMLSpanElement = function HTMLSpanElement(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(HTMLSpanElement)
Object.defineProperties(HTMLSpanElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLSpanElement",
        configurable: true
    }
});

HTMLSpanElement.prototype.__proto__ = HTMLElement.prototype;


catchvm.memory.HTMLElements['span'] = function(){
    var span = new(function(){});
    ///////////////////////////////////////////////
    span.tagName = 'span'.toUpperCase()
    span.childelement = []
    span.father_element = null

    ///////////////////////////////////////////////
    span.__proto__ = HTMLSpanElement.prototype;
    return span;
}

var HTMLUListElement = function HTMLUListElement(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(HTMLUListElement)
Object.defineProperties(HTMLUListElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLUListElement",
        configurable: true
    }
});

HTMLUListElement.prototype.__proto__ = HTMLElement.prototype;


catchvm.memory.HTMLElements['ul'] = function(){
    var ul = new(function(){});
    ///////////////////////////////////////////////
    ul.tagName = 'ul'.toUpperCase()
    ul.childelement = []
    ul.father_element = null

    ///////////////////////////////////////////////
    ul.__proto__ = HTMLUListElement.prototype;
    return ul;
}

var HTMLLIElement = function HTMLLabelElement(){
    throw new TypeError("Illegal constructor");
};catchvm.func_set_natvie(HTMLLIElement)
Object.defineProperties(HTMLLIElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLLIElement",
        configurable: true
    }
});

HTMLLIElement.prototype.__proto__ = HTMLElement.prototype;


catchvm.memory.HTMLElements['li'] = function(){
    var li = new(function(){});
    ///////////////////////////////////////////////
    li.tagName = 'li'.toUpperCase()
    li.childelement = []
    li.father_element = null

    ///////////////////////////////////////////////
    li.__proto__ = HTMLLIElement.prototype;
    return li;
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
Document.prototype.cookie = 'device_web_cpu_core=12; device_web_memory_size=8; architecture=amd64; douyin.com; home_can_add_dy_2_desktop=%220%22; dy_swidth=1536; dy_sheight=864; csrf_session_id=5937042835471a2d8a322cf0b051f230; FORCE_LOGIN=%7B%22videoConsumedRemainSeconds%22%3A180%7D; strategyABtestKey=%221713432427.108%22; passport_csrf_token=d3606d01cc731ff35ab16ae185f15880; passport_csrf_token_default=d3606d01cc731ff35ab16ae185f15880; bd_ticket_guard_client_web_domain=2; __ac_signature=_02B4Z6wo00f01zeweSwAAIDAQZ-kYFYnmX83kH2AAKvXd0; stream_recommend_feed_params=%22%7B%5C%22cookie_enabled%5C%22%3Atrue%2C%5C%22screen_width%5C%22%3A1536%2C%5C%22screen_height%5C%22%3A864%2C%5C%22browser_online%5C%22%3Atrue%2C%5C%22cpu_core_num%5C%22%3A12%2C%5C%22device_memory%5C%22%3A8%2C%5C%22downlink%5C%22%3A10%2C%5C%22effective_type%5C%22%3A%5C%224g%5C%22%2C%5C%22round_trip_time%5C%22%3A0%7D%22; bd_ticket_guard_client_data=eyJiZC10aWNrZXQtZ3VhcmQtdmVyc2lvbiI6MiwiYmQtdGlja2V0LWd1YXJkLWl0ZXJhdGlvbi12ZXJzaW9uIjoxLCJiZC10aWNrZXQtZ3VhcmQtcmVlLXB1YmxpYy1rZXkiOiJCSWFobHdtNHVrUndqWnpwdXBUUlZQdUYyb2oreFpzcmd4NnkvMGRmVnJvdW96YmxhbzZGTmxsSXFsaXhyelVXQVlEQ0ZvUUFXYmd3RHVuekZ3YjNZMUU9IiwiYmQtdGlja2V0LWd1YXJkLXdlYi12ZXJzaW9uIjoxfQ%3D%3D; msToken=BD-dgRc4wkAIrxNItMiL0SS6yvqrNNcTPwfgj0j0kquQbRSuJrxWIUI6NAjNtyRLjypRTlVdhIXerMzwTl595LiUo1pR6SqWmsLdm4iqtRf9yvC7I6QS-LXqykNlMg==; download_guide=%222%2F20240418%2F0%22; IsDouyinActive=true'
Document.prototype.referrer = ''
Document.prototype.documentElement = catchvm.proxy(catchvm.memory.HTMLElements['html']())
Document.prototype.body = catchvm.memory.HTMLElements['body']()



Document.prototype.all = catchvm.memory.htmlAllCollection
catchvm.memory.documentcount = 0
Object.defineProperty(Document.prototype, "all", {
    get: function (){
        return [undefined, undefined, catchvm.memory.htmlAllCollection][catchvm.memory.documentcount++]
    }
})




Document.prototype.getElementsByClassName = function getElementsByClassName(){
    console.log(arguments)
    debugger;
};catchvm.func_set_natvie(Document.prototype.getElementsByClassName);

Document.prototype.getElementById = function getElementById(){
    console.log(arguments)
    debugger;
};catchvm.func_set_natvie(Document.prototype.getElementById);

Document.prototype.createElement = function createElement(tagName){
    console.log('createElement --->'+tagName)
    // debugger;
    if((tagName.toString().indexOf('object') != -1) || (tagName.toString() == '')){
        debugger;
        throw new DOMException("Failed to execute 'createElement' on 'Document': The tag name provided ('"+tagName.toString()+"') is not a valid name.")
    }else{
        var tagname = tagName.toLowerCase()+'';
        if(catchvm.memory.HTMLElements[tagname] == undefined){
            debugger;
        }
        return catchvm.proxy(catchvm.memory.HTMLElements[tagname]())
    }

};catchvm.func_set_natvie(Document.prototype.createElement);


Document.prototype.getElementsByTagName = function getElementsByTagName(name){
    console.log(arguments)
    debugger;
    return [{}]
};catchvm.func_set_natvie(Document.prototype.getElementsByTagName);

Document.prototype.querySelectorAll = function querySelectorAll(selectors){
    console.log(arguments)
    debugger;
    return nodelist;
};catchvm.func_set_natvie(Document.prototype.querySelectorAll);


Document.prototype.createEvent = function createEvent(type){
    console.log('createEvent --->'+type)
    console.log(arguments)
    // debugger;
    var Type = type.toLowerCase()+'';

    if(Type == 'touchevent'){
        throw new DOMException("Failed to execute 'createEvent' on 'Document': The provided event type ('TouchEvent') is invalid.")
    }


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
    // debugger;
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



catchvm.memory.tegexp_count = 0
var RegExp = new Proxy(RegExp,{
    construct(target, argArray) {

        console.log(arguments)
        debugger;

        // if(catchvm.memory.tegexp_count > 8){
        //     console.log(arguments)
        //     debugger;
        // }

        catchvm.memory.tegexp_count++
        return new target(...argArray)
    }
})



//冻结navigator防止修改值
Object.freeze(navigator)

catchvm.memory.isFrozen = Object.isFrozen
Object.isFrozen = function isFrozen(obj){
    debugger;
    return catchvm.memory.isFrozen(obj)
};catchvm.func_set_natvie(Object.isFrozen)


catchvm.memory.assign = Object.assign
Object.assign = function assign(target, ...source){


    // console.log(arguments)
    // debugger;
    return catchvm.memory.assign(target, ...source)
}


catchvm.memory.entries = Object.entries
Object.entries = function entries(obj){
    console.log(arguments)
    debugger;
    return catchvm.memory.entries(obj)
};catchvm.func_set_natvie(Object.entries)


catchvm.memory.getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor
Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(obj, prop){
    if(obj == navigator && prop == 'webdriver'){
        console.log("检测了 ——> Object.getOwnPropertyDescriptor(navigator,'webdriver')")
        return undefined
    }

    if(obj.__proto__ == Window.prototype && prop == 'queueMicrotask'){
        console.log("检测了 ——> Object.getOwnPropertyDescriptor(Window.prototype,'queueMicrotask')")
        return undefined
    }

    if(obj.__proto__ == Window.prototype && prop == "fetch"){
        console.log("检测了 ——> Object.getOwnPropertyDescriptor(Window.prototype,'fetch')")
        return undefined
    }

    if(obj.__proto__ == Window.prototype && prop == "Request"){
        console.log("检测了 ——> Object.getOwnPropertyDescriptor(Window.prototype,'Request')")
        return undefined
    }

    if(obj.__proto__ == Window.prototype && prop == "Headers"){
        console.log("检测了 ——> Object.getOwnPropertyDescriptor(Window.prototype,'Headers')")
        return undefined
    }

    console.log(arguments)
    debugger;
    return catchvm.memory.getOwnPropertyDescriptor(obj, prop)
};catchvm.func_set_natvie(Object.getOwnPropertyDescriptor)


catchvm.memory.getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors
Object.getOwnPropertyDescriptors = function getOwnPropertyDescriptors(obj){
    console.log(arguments)
    debugger;
    return catchvm.memory.getOwnPropertyDescriptors(obj)
};catchvm.func_set_natvie(Object.getOwnPropertyDescriptors)


catchvm.memory.getOwnPropertyNames = Object.getOwnPropertyNames
Object.getOwnPropertyNames = function getOwnPropertyNames(obj){
    if(obj == navigator){
        // debugger
        console.log('检测了 ——> Object.getOwnPropertyNames(navigator)')
        return []
    }
    if(obj.category){
        // debugger
        console.log('检测了 ——> Object.getOwnPropertyNames(obj),obj是含有category的一个对象')
        return catchvm.memory.getOwnPropertyNames(obj)
    }
    if(obj == window){
        console.log('检测了 ——> Object.getOwnPropertyNames(window)      注意：这里每个网站检测返回的window可能不一样，需要自己修改')
        return [
    "Object",
    "Function",
    "Array",
    "Number",
    "parseFloat",
    "parseInt",
    "Infinity",
    "NaN",
    "undefined",
    "Boolean",
    "String",
    "Symbol",
    "Date",
    "Promise",
    "RegExp",
    "Error",
    "AggregateError",
    "EvalError",
    "RangeError",
    "ReferenceError",
    "SyntaxError",
    "TypeError",
    "URIError",
    "globalThis",
    "JSON",
    "Math",
    "Intl",
    "ArrayBuffer",
    "Atomics",
    "Uint8Array",
    "Int8Array",
    "Uint16Array",
    "Int16Array",
    "Uint32Array",
    "Int32Array",
    "Float32Array",
    "Float64Array",
    "Uint8ClampedArray",
    "BigUint64Array",
    "BigInt64Array",
    "DataView",
    "Map",
    "BigInt",
    "Set",
    "WeakMap",
    "WeakSet",
    "Proxy",
    "Reflect",
    "FinalizationRegistry",
    "WeakRef",
    "decodeURI",
    "decodeURIComponent",
    "encodeURI",
    "encodeURIComponent",
    "escape",
    "unescape",
    "eval",
    "isFinite",
    "isNaN",
    "console",
    "Option",
    "Image",
    "Audio",
    "webkitURL",
    "webkitRTCPeerConnection",
    "webkitMediaStream",
    "WebKitMutationObserver",
    "WebKitCSSMatrix",
    "XSLTProcessor",
    "XPathResult",
    "XPathExpression",
    "XPathEvaluator",
    "XMLSerializer",
    "XMLHttpRequestUpload",
    "XMLHttpRequestEventTarget",
    "XMLHttpRequest",
    "XMLDocument",
    "WritableStreamDefaultWriter",
    "WritableStreamDefaultController",
    "WritableStream",
    "Worker",
    "WindowControlsOverlayGeometryChangeEvent",
    "WindowControlsOverlay",
    "Window",
    "WheelEvent",
    "WebSocket",
    "WebGLVertexArrayObject",
    "WebGLUniformLocation",
    "WebGLTransformFeedback",
    "WebGLTexture",
    "WebGLSync",
    "WebGLShaderPrecisionFormat",
    "WebGLShader",
    "WebGLSampler",
    "WebGLRenderingContext",
    "WebGLRenderbuffer",
    "WebGLQuery",
    "WebGLProgram",
    "WebGLFramebuffer",
    "WebGLContextEvent",
    "WebGLBuffer",
    "WebGLActiveInfo",
    "WebGL2RenderingContext",
    "WaveShaperNode",
    "VisualViewport",
    "VisibilityStateEntry",
    "VirtualKeyboardGeometryChangeEvent",
    "ViewTransition",
    "VideoFrame",
    "VideoColorSpace",
    "ValidityState",
    "VTTCue",
    "UserActivation",
    "URLSearchParams",
    "URLPattern",
    "URL",
    "UIEvent",
    "TrustedTypePolicyFactory",
    "TrustedTypePolicy",
    "TrustedScriptURL",
    "TrustedScript",
    "TrustedHTML",
    "TreeWalker",
    "TransitionEvent",
    "TransformStreamDefaultController",
    "TransformStream",
    "TrackEvent",
    "TouchList",
    "TouchEvent",
    "Touch",
    "ToggleEvent",
    "TimeRanges",
    "TextTrackList",
    "TextTrackCueList",
    "TextTrackCue",
    "TextTrack",
    "TextMetrics",
    "TextEvent",
    "TextEncoderStream",
    "TextEncoder",
    "TextDecoderStream",
    "TextDecoder",
    "Text",
    "TaskSignal",
    "TaskPriorityChangeEvent",
    "TaskController",
    "TaskAttributionTiming",
    "SyncManager",
    "SubmitEvent",
    "StyleSheetList",
    "StyleSheet",
    "StylePropertyMapReadOnly",
    "StylePropertyMap",
    "StorageEvent",
    "Storage",
    "StereoPannerNode",
    "StaticRange",
    "SourceBufferList",
    "SourceBuffer",
    "ShadowRoot",
    "Selection",
    "SecurityPolicyViolationEvent",
    "ScriptProcessorNode",
    "ScreenOrientation",
    "Screen",
    "Scheduling",
    "Scheduler",
    "SVGViewElement",
    "SVGUseElement",
    "SVGUnitTypes",
    "SVGTransformList",
    "SVGTransform",
    "SVGTitleElement",
    "SVGTextPositioningElement",
    "SVGTextPathElement",
    "SVGTextElement",
    "SVGTextContentElement",
    "SVGTSpanElement",
    "SVGSymbolElement",
    "SVGSwitchElement",
    "SVGStyleElement",
    "SVGStringList",
    "SVGStopElement",
    "SVGSetElement",
    "SVGScriptElement",
    "SVGSVGElement",
    "SVGRectElement",
    "SVGRect",
    "SVGRadialGradientElement",
    "SVGPreserveAspectRatio",
    "SVGPolylineElement",
    "SVGPolygonElement",
    "SVGPointList",
    "SVGPoint",
    "SVGPatternElement",
    "SVGPathElement",
    "SVGNumberList",
    "SVGNumber",
    "SVGMetadataElement",
    "SVGMatrix",
    "SVGMaskElement",
    "SVGMarkerElement",
    "SVGMPathElement",
    "SVGLinearGradientElement",
    "SVGLineElement",
    "SVGLengthList",
    "SVGLength",
    "SVGImageElement",
    "SVGGraphicsElement",
    "SVGGradientElement",
    "SVGGeometryElement",
    "SVGGElement",
    "SVGForeignObjectElement",
    "SVGFilterElement",
    "SVGFETurbulenceElement",
    "SVGFETileElement",
    "SVGFESpotLightElement",
    "SVGFESpecularLightingElement",
    "SVGFEPointLightElement",
    "SVGFEOffsetElement",
    "SVGFEMorphologyElement",
    "SVGFEMergeNodeElement",
    "SVGFEMergeElement",
    "SVGFEImageElement",
    "SVGFEGaussianBlurElement",
    "SVGFEFuncRElement",
    "SVGFEFuncGElement",
    "SVGFEFuncBElement",
    "SVGFEFuncAElement",
    "SVGFEFloodElement",
    "SVGFEDropShadowElement",
    "SVGFEDistantLightElement",
    "SVGFEDisplacementMapElement",
    "SVGFEDiffuseLightingElement",
    "SVGFEConvolveMatrixElement",
    "SVGFECompositeElement",
    "SVGFEComponentTransferElement",
    "SVGFEColorMatrixElement",
    "SVGFEBlendElement",
    "SVGEllipseElement",
    "SVGElement",
    "SVGDescElement",
    "SVGDefsElement",
    "SVGComponentTransferFunctionElement",
    "SVGClipPathElement",
    "SVGCircleElement",
    "SVGAnimationElement",
    "SVGAnimatedTransformList",
    "SVGAnimatedString",
    "SVGAnimatedRect",
    "SVGAnimatedPreserveAspectRatio",
    "SVGAnimatedNumberList",
    "SVGAnimatedNumber",
    "SVGAnimatedLengthList",
    "SVGAnimatedLength",
    "SVGAnimatedInteger",
    "SVGAnimatedEnumeration",
    "SVGAnimatedBoolean",
    "SVGAnimatedAngle",
    "SVGAnimateTransformElement",
    "SVGAnimateMotionElement",
    "SVGAnimateElement",
    "SVGAngle",
    "SVGAElement",
    "Response",
    "ResizeObserverSize",
    "ResizeObserverEntry",
    "ResizeObserver",
    "Request",
    "ReportingObserver",
    "ReadableStreamDefaultReader",
    "ReadableStreamDefaultController",
    "ReadableStreamBYOBRequest",
    "ReadableStreamBYOBReader",
    "ReadableStream",
    "ReadableByteStreamController",
    "Range",
    "RadioNodeList",
    "RTCTrackEvent",
    "RTCStatsReport",
    "RTCSessionDescription",
    "RTCSctpTransport",
    "RTCRtpTransceiver",
    "RTCRtpSender",
    "RTCRtpReceiver",
    "RTCPeerConnectionIceEvent",
    "RTCPeerConnectionIceErrorEvent",
    "RTCPeerConnection",
    "RTCIceTransport",
    "RTCIceCandidate",
    "RTCErrorEvent",
    "RTCError",
    "RTCEncodedVideoFrame",
    "RTCEncodedAudioFrame",
    "RTCDtlsTransport",
    "RTCDataChannelEvent",
    "RTCDataChannel",
    "RTCDTMFToneChangeEvent",
    "RTCDTMFSender",
    "RTCCertificate",
    "PromiseRejectionEvent",
    "ProgressEvent",
    "Profiler",
    "ProcessingInstruction",
    "PopStateEvent",
    "PointerEvent",
    "PluginArray",
    "Plugin",
    "PictureInPictureWindow",
    "PictureInPictureEvent",
    "PeriodicWave",
    "PerformanceTiming",
    "PerformanceServerTiming",
    "PerformanceResourceTiming",
    "PerformancePaintTiming",
    "PerformanceObserverEntryList",
    "PerformanceObserver",
    "PerformanceNavigationTiming",
    "PerformanceNavigation",
    "PerformanceMeasure",
    "PerformanceMark",
    "PerformanceLongTaskTiming",
    "PerformanceEventTiming",
    "PerformanceEntry",
    "PerformanceElementTiming",
    "Performance",
    "Path2D",
    "PannerNode",
    "PageTransitionEvent",
    "OverconstrainedError",
    "OscillatorNode",
    "OffscreenCanvasRenderingContext2D",
    "OffscreenCanvas",
    "OfflineAudioContext",
    "OfflineAudioCompletionEvent",
    "NodeList",
    "NodeIterator",
    "NodeFilter",
    "Node",
    "NetworkInformation",
    "NavigatorUAData",
    "Navigator",
    "NavigationTransition",
    "NavigationHistoryEntry",
    "NavigationDestination",
    "NavigationCurrentEntryChangeEvent",
    "Navigation",
    "NavigateEvent",
    "NamedNodeMap",
    "MutationRecord",
    "MutationObserver",
    "MouseEvent",
    "MimeTypeArray",
    "MimeType",
    "MessagePort",
    "MessageEvent",
    "MessageChannel",
    "MediaStreamTrackVideoStats",
    "MediaStreamTrackProcessor",
    "MediaStreamTrackGenerator",
    "MediaStreamTrackEvent",
    "MediaStreamTrack",
    "MediaStreamEvent",
    "MediaStreamAudioSourceNode",
    "MediaStreamAudioDestinationNode",
    "MediaStream",
    "MediaSourceHandle",
    "MediaSource",
    "MediaRecorder",
    "MediaQueryListEvent",
    "MediaQueryList",
    "MediaList",
    "MediaError",
    "MediaEncryptedEvent",
    "MediaElementAudioSourceNode",
    "MediaCapabilities",
    "MathMLElement",
    "Location",
    "LayoutShiftAttribution",
    "LayoutShift",
    "LargestContentfulPaint",
    "KeyframeEffect",
    "KeyboardEvent",
    "IntersectionObserverEntry",
    "IntersectionObserver",
    "InputEvent",
    "InputDeviceInfo",
    "InputDeviceCapabilities",
    "Ink",
    "ImageTrackList",
    "ImageTrack",
    "ImageData",
    "ImageCapture",
    "ImageBitmapRenderingContext",
    "ImageBitmap",
    "IdleDeadline",
    "IIRFilterNode",
    "IDBVersionChangeEvent",
    "IDBTransaction",
    "IDBRequest",
    "IDBOpenDBRequest",
    "IDBObjectStore",
    "IDBKeyRange",
    "IDBIndex",
    "IDBFactory",
    "IDBDatabase",
    "IDBCursorWithValue",
    "IDBCursor",
    "History",
    "HighlightRegistry",
    "Highlight",
    "Headers",
    "HashChangeEvent",
    "HTMLVideoElement",
    "HTMLUnknownElement",
    "HTMLUListElement",
    "HTMLTrackElement",
    "HTMLTitleElement",
    "HTMLTimeElement",
    "HTMLTextAreaElement",
    "HTMLTemplateElement",
    "HTMLTableSectionElement",
    "HTMLTableRowElement",
    "HTMLTableElement",
    "HTMLTableColElement",
    "HTMLTableCellElement",
    "HTMLTableCaptionElement",
    "HTMLStyleElement",
    "HTMLSpanElement",
    "HTMLSourceElement",
    "HTMLSlotElement",
    "HTMLSelectElement",
    "HTMLScriptElement",
    "HTMLQuoteElement",
    "HTMLProgressElement",
    "HTMLPreElement",
    "HTMLPictureElement",
    "HTMLParamElement",
    "HTMLParagraphElement",
    "HTMLOutputElement",
    "HTMLOptionsCollection",
    "HTMLOptionElement",
    "HTMLOptGroupElement",
    "HTMLObjectElement",
    "HTMLOListElement",
    "HTMLModElement",
    "HTMLMeterElement",
    "HTMLMetaElement",
    "HTMLMenuElement",
    "HTMLMediaElement",
    "HTMLMarqueeElement",
    "HTMLMapElement",
    "HTMLLinkElement",
    "HTMLLegendElement",
    "HTMLLabelElement",
    "HTMLLIElement",
    "HTMLInputElement",
    "HTMLImageElement",
    "HTMLIFrameElement",
    "HTMLHtmlElement",
    "HTMLHeadingElement",
    "HTMLHeadElement",
    "HTMLHRElement",
    "HTMLFrameSetElement",
    "HTMLFrameElement",
    "HTMLFormElement",
    "HTMLFormControlsCollection",
    "HTMLFontElement",
    "HTMLFieldSetElement",
    "HTMLEmbedElement",
    "HTMLElement",
    "HTMLDocument",
    "HTMLDivElement",
    "HTMLDirectoryElement",
    "HTMLDialogElement",
    "HTMLDetailsElement",
    "HTMLDataListElement",
    "HTMLDataElement",
    "HTMLDListElement",
    "HTMLCollection",
    "HTMLCanvasElement",
    "HTMLButtonElement",
    "HTMLBodyElement",
    "HTMLBaseElement",
    "HTMLBRElement",
    "HTMLAudioElement",
    "HTMLAreaElement",
    "HTMLAnchorElement",
    "HTMLAllCollection",
    "GeolocationPositionError",
    "GeolocationPosition",
    "GeolocationCoordinates",
    "Geolocation",
    "GamepadHapticActuator",
    "GamepadEvent",
    "GamepadButton",
    "Gamepad",
    "GainNode",
    "FormDataEvent",
    "FormData",
    "FontFaceSetLoadEvent",
    "FontFace",
    "FocusEvent",
    "FileReader",
    "FileList",
    "File",
    "FeaturePolicy",
    "External",
    "EventTarget",
    "EventSource",
    "EventCounts",
    "Event",
    "ErrorEvent",
    "EncodedVideoChunk",
    "EncodedAudioChunk",
    "ElementInternals",
    "Element",
    "DynamicsCompressorNode",
    "DragEvent",
    "DocumentType",
    "DocumentTimeline",
    "DocumentFragment",
    "Document",
    "DelegatedInkTrailPresenter",
    "DelayNode",
    "DecompressionStream",
    "DataTransferItemList",
    "DataTransferItem",
    "DataTransfer",
    "DOMTokenList",
    "DOMStringMap",
    "DOMStringList",
    "DOMRectReadOnly",
    "DOMRectList",
    "DOMRect",
    "DOMQuad",
    "DOMPointReadOnly",
    "DOMPoint",
    "DOMParser",
    "DOMMatrixReadOnly",
    "DOMMatrix",
    "DOMImplementation",
    "DOMException",
    "DOMError",
    "CustomStateSet",
    "CustomEvent",
    "CustomElementRegistry",
    "Crypto",
    "CountQueuingStrategy",
    "ConvolverNode",
    "ContentVisibilityAutoStateChangeEvent",
    "ConstantSourceNode",
    "CompressionStream",
    "CompositionEvent",
    "Comment",
    "CloseEvent",
    "ClipboardEvent",
    "CharacterData",
    "ChannelSplitterNode",
    "ChannelMergerNode",
    "CanvasRenderingContext2D",
    "CanvasPattern",
    "CanvasGradient",
    "CanvasCaptureMediaStreamTrack",
    "CSSVariableReferenceValue",
    "CSSUnparsedValue",
    "CSSUnitValue",
    "CSSTranslate",
    "CSSTransition",
    "CSSTransformValue",
    "CSSTransformComponent",
    "CSSSupportsRule",
    "CSSStyleValue",
    "CSSStyleSheet",
    "CSSStyleRule",
    "CSSStyleDeclaration",
    "CSSStartingStyleRule",
    "CSSSkewY",
    "CSSSkewX",
    "CSSSkew",
    "CSSScale",
    "CSSRuleList",
    "CSSRule",
    "CSSRotate",
    "CSSPropertyRule",
    "CSSPositionValue",
    "CSSPerspective",
    "CSSPageRule",
    "CSSNumericValue",
    "CSSNumericArray",
    "CSSNamespaceRule",
    "CSSMediaRule",
    "CSSMatrixComponent",
    "CSSMathValue",
    "CSSMathSum",
    "CSSMathProduct",
    "CSSMathNegate",
    "CSSMathMin",
    "CSSMathMax",
    "CSSMathInvert",
    "CSSMathClamp",
    "CSSLayerStatementRule",
    "CSSLayerBlockRule",
    "CSSKeywordValue",
    "CSSKeyframesRule",
    "CSSKeyframeRule",
    "CSSImportRule",
    "CSSImageValue",
    "CSSGroupingRule",
    "CSSFontPaletteValuesRule",
    "CSSFontFaceRule",
    "CSSCounterStyleRule",
    "CSSContainerRule",
    "CSSConditionRule",
    "CSSAnimation",
    "CSS",
    "CDATASection",
    "ByteLengthQueuingStrategy",
    "BrowserCaptureMediaStreamTrack",
    "BroadcastChannel",
    "BlobEvent",
    "Blob",
    "BiquadFilterNode",
    "BeforeUnloadEvent",
    "BeforeInstallPromptEvent",
    "BaseAudioContext",
    "BarProp",
    "AudioWorkletNode",
    "AudioSinkInfo",
    "AudioScheduledSourceNode",
    "AudioProcessingEvent",
    "AudioParamMap",
    "AudioParam",
    "AudioNode",
    "AudioListener",
    "AudioDestinationNode",
    "AudioData",
    "AudioContext",
    "AudioBufferSourceNode",
    "AudioBuffer",
    "Attr",
    "AnimationTimeline",
    "AnimationPlaybackEvent",
    "AnimationEvent",
    "AnimationEffect",
    "Animation",
    "AnalyserNode",
    "AbstractRange",
    "AbortSignal",
    "AbortController",
    "window",
    "self",
    "document",
    "name",
    "location",
    "customElements",
    "history",
    "navigation",
    "locationbar",
    "menubar",
    "personalbar",
    "scrollbars",
    "statusbar",
    "toolbar",
    "status",
    "closed",
    "frames",
    "length",
    "top",
    "opener",
    "parent",
    "frameElement",
    "navigator",
    "origin",
    "external",
    "screen",
    "innerWidth",
    "innerHeight",
    "scrollX",
    "pageXOffset",
    "scrollY",
    "pageYOffset",
    "visualViewport",
    "screenX",
    "screenY",
    "outerWidth",
    "outerHeight",
    "devicePixelRatio",
    "event",
    "clientInformation",
    "offscreenBuffering",
    "screenLeft",
    "screenTop",
    "styleMedia",
    "onsearch",
    "isSecureContext",
    "trustedTypes",
    "performance",
    "onappinstalled",
    "onbeforeinstallprompt",
    "crypto",
    "indexedDB",
    "sessionStorage",
    "localStorage",
    "onbeforexrselect",
    "onabort",
    "onbeforeinput",
    "onbeforematch",
    "onbeforetoggle",
    "onblur",
    "oncancel",
    "oncanplay",
    "oncanplaythrough",
    "onchange",
    "onclick",
    "onclose",
    "oncontentvisibilityautostatechange",
    "oncontextlost",
    "oncontextmenu",
    "oncontextrestored",
    "oncuechange",
    "ondblclick",
    "ondrag",
    "ondragend",
    "ondragenter",
    "ondragleave",
    "ondragover",
    "ondragstart",
    "ondrop",
    "ondurationchange",
    "onemptied",
    "onended",
    "onerror",
    "onfocus",
    "onformdata",
    "oninput",
    "oninvalid",
    "onkeydown",
    "onkeypress",
    "onkeyup",
    "onload",
    "onloadeddata",
    "onloadedmetadata",
    "onloadstart",
    "onmousedown",
    "onmouseenter",
    "onmouseleave",
    "onmousemove",
    "onmouseout",
    "onmouseover",
    "onmouseup",
    "onmousewheel",
    "onpause",
    "onplay",
    "onplaying",
    "onprogress",
    "onratechange",
    "onreset",
    "onresize",
    "onscroll",
    "onsecuritypolicyviolation",
    "onseeked",
    "onseeking",
    "onselect",
    "onslotchange",
    "onstalled",
    "onsubmit",
    "onsuspend",
    "ontimeupdate",
    "ontoggle",
    "onvolumechange",
    "onwaiting",
    "onwebkitanimationend",
    "onwebkitanimationiteration",
    "onwebkitanimationstart",
    "onwebkittransitionend",
    "onwheel",
    "onauxclick",
    "ongotpointercapture",
    "onlostpointercapture",
    "onpointerdown",
    "onpointermove",
    "onpointerrawupdate",
    "onpointerup",
    "onpointercancel",
    "onpointerover",
    "onpointerout",
    "onpointerenter",
    "onpointerleave",
    "onselectstart",
    "onselectionchange",
    "onanimationend",
    "onanimationiteration",
    "onanimationstart",
    "ontransitionrun",
    "ontransitionstart",
    "ontransitionend",
    "ontransitioncancel",
    "onafterprint",
    "onbeforeprint",
    "onbeforeunload",
    "onhashchange",
    "onlanguagechange",
    "onmessage",
    "onmessageerror",
    "onoffline",
    "ononline",
    "onpagehide",
    "onpageshow",
    "onpopstate",
    "onrejectionhandled",
    "onstorage",
    "onunhandledrejection",
    "onunload",
    "crossOriginIsolated",
    "scheduler",
    "alert",
    "atob",
    "blur",
    "btoa",
    "cancelAnimationFrame",
    "cancelIdleCallback",
    "captureEvents",
    "clearInterval",
    "clearTimeout",
    "close",
    "confirm",
    "createImageBitmap",
    "fetch",
    "find",
    "focus",
    "getComputedStyle",
    "getSelection",
    "matchMedia",
    "moveBy",
    "moveTo",
    "open",
    "postMessage",
    "print",
    "prompt",
    "queueMicrotask",
    "releaseEvents",
    "reportError",
    "requestAnimationFrame",
    "requestIdleCallback",
    "resizeBy",
    "resizeTo",
    "scroll",
    "scrollBy",
    "scrollTo",
    "setInterval",
    "setTimeout",
    "stop",
    "structuredClone",
    "webkitCancelAnimationFrame",
    "webkitRequestAnimationFrame",
    "Iterator",
    "chrome",
    "WebAssembly",
    "caches",
    "cookieStore",
    "ondevicemotion",
    "ondeviceorientation",
    "ondeviceorientationabsolute",
    "launchQueue",
    "documentPictureInPicture",
    "AbsoluteOrientationSensor",
    "Accelerometer",
    "AudioDecoder",
    "AudioEncoder",
    "AudioWorklet",
    "BatteryManager",
    "Cache",
    "CacheStorage",
    "Clipboard",
    "ClipboardItem",
    "CookieChangeEvent",
    "CookieStore",
    "CookieStoreManager",
    "Credential",
    "CredentialsContainer",
    "CryptoKey",
    "DeviceMotionEvent",
    "DeviceMotionEventAcceleration",
    "DeviceMotionEventRotationRate",
    "DeviceOrientationEvent",
    "FederatedCredential",
    "GravitySensor",
    "Gyroscope",
    "IdleDetector",
    "ImageDecoder",
    "Keyboard",
    "KeyboardLayoutMap",
    "LinearAccelerationSensor",
    "Lock",
    "LockManager",
    "MIDIAccess",
    "MIDIConnectionEvent",
    "MIDIInput",
    "MIDIInputMap",
    "MIDIMessageEvent",
    "MIDIOutput",
    "MIDIOutputMap",
    "MIDIPort",
    "MediaDeviceInfo",
    "MediaDevices",
    "MediaKeyMessageEvent",
    "MediaKeySession",
    "MediaKeyStatusMap",
    "MediaKeySystemAccess",
    "MediaKeys",
    "NavigationPreloadManager",
    "NavigatorManagedData",
    "OrientationSensor",
    "PasswordCredential",
    "RelativeOrientationSensor",
    "ScreenDetailed",
    "ScreenDetails",
    "Sensor",
    "SensorErrorEvent",
    "ServiceWorker",
    "ServiceWorkerContainer",
    "ServiceWorkerRegistration",
    "StorageManager",
    "SubtleCrypto",
    "VideoDecoder",
    "VideoEncoder",
    "VirtualKeyboard",
    "WebTransport",
    "WebTransportBidirectionalStream",
    "WebTransportDatagramDuplexStream",
    "WebTransportError",
    "Worklet",
    "XRDOMOverlayState",
    "XRLayer",
    "XRWebGLBinding",
    "AuthenticatorAssertionResponse",
    "AuthenticatorAttestationResponse",
    "AuthenticatorResponse",
    "PublicKeyCredential",
    "Bluetooth",
    "BluetoothCharacteristicProperties",
    "BluetoothDevice",
    "BluetoothRemoteGATTCharacteristic",
    "BluetoothRemoteGATTDescriptor",
    "BluetoothRemoteGATTServer",
    "BluetoothRemoteGATTService",
    "CaptureController",
    "CharacterBoundsUpdateEvent",
    "EditContext",
    "TextFormat",
    "TextFormatUpdateEvent",
    "TextUpdateEvent",
    "DocumentPictureInPicture",
    "EyeDropper",
    "FileSystemDirectoryHandle",
    "FileSystemFileHandle",
    "FileSystemHandle",
    "FileSystemWritableFileStream",
    "FontData",
    "FragmentDirective",
    "GPU",
    "GPUAdapter",
    "GPUAdapterInfo",
    "GPUBindGroup",
    "GPUBindGroupLayout",
    "GPUBuffer",
    "GPUBufferUsage",
    "GPUCanvasContext",
    "GPUColorWrite",
    "GPUCommandBuffer",
    "GPUCommandEncoder",
    "GPUCompilationInfo",
    "GPUCompilationMessage",
    "GPUComputePassEncoder",
    "GPUComputePipeline",
    "GPUDevice",
    "GPUDeviceLostInfo",
    "GPUError",
    "GPUExternalTexture",
    "GPUInternalError",
    "GPUMapMode",
    "GPUOutOfMemoryError",
    "GPUPipelineError",
    "GPUPipelineLayout",
    "GPUQuerySet",
    "GPUQueue",
    "GPURenderBundle",
    "GPURenderBundleEncoder",
    "GPURenderPassEncoder",
    "GPURenderPipeline",
    "GPUSampler",
    "GPUShaderModule",
    "GPUShaderStage",
    "GPUSupportedFeatures",
    "GPUSupportedLimits",
    "GPUTexture",
    "GPUTextureUsage",
    "GPUTextureView",
    "GPUUncapturedErrorEvent",
    "GPUValidationError",
    "WGSLLanguageFeatures",
    "HID",
    "HIDConnectionEvent",
    "HIDDevice",
    "HIDInputReportEvent",
    "IdentityCredential",
    "IdentityProvider",
    "IdentityCredentialError",
    "LaunchParams",
    "LaunchQueue",
    "MutationEvent",
    "NavigatorLogin",
    "OTPCredential",
    "PaymentAddress",
    "PaymentRequest",
    "PaymentRequestUpdateEvent",
    "PaymentResponse",
    "PaymentManager",
    "PaymentMethodChangeEvent",
    "Presentation",
    "PresentationAvailability",
    "PresentationConnection",
    "PresentationConnectionAvailableEvent",
    "PresentationConnectionCloseEvent",
    "PresentationConnectionList",
    "PresentationReceiver",
    "PresentationRequest",
    "Serial",
    "SerialPort",
    "StorageBucket",
    "StorageBucketManager",
    "USB",
    "USBAlternateInterface",
    "USBConfiguration",
    "USBConnectionEvent",
    "USBDevice",
    "USBEndpoint",
    "USBInTransferResult",
    "USBInterface",
    "USBIsochronousInTransferPacket",
    "USBIsochronousInTransferResult",
    "USBIsochronousOutTransferPacket",
    "USBIsochronousOutTransferResult",
    "USBOutTransferResult",
    "WakeLock",
    "WakeLockSentinel",
    "XRAnchor",
    "XRAnchorSet",
    "XRBoundedReferenceSpace",
    "XRCPUDepthInformation",
    "XRCamera",
    "XRDepthInformation",
    "XRFrame",
    "XRHitTestResult",
    "XRHitTestSource",
    "XRInputSource",
    "XRInputSourceArray",
    "XRInputSourceEvent",
    "XRInputSourcesChangeEvent",
    "XRLightEstimate",
    "XRLightProbe",
    "XRPose",
    "XRRay",
    "XRReferenceSpace",
    "XRReferenceSpaceEvent",
    "XRRenderState",
    "XRRigidTransform",
    "XRSession",
    "XRSessionEvent",
    "XRSpace",
    "XRSystem",
    "XRTransientInputHitTestResult",
    "XRTransientInputHitTestSource",
    "XRView",
    "XRViewerPose",
    "XRViewport",
    "XRWebGLDepthInformation",
    "XRWebGLLayer",
    "getScreenDetails",
    "queryLocalFonts",
    "showDirectoryPicker",
    "showOpenFilePicker",
    "showSaveFilePicker",
    "originAgentCluster",
    "onpagereveal",
    "credentialless",
    "speechSynthesis",
    "onscrollend",
    "BackgroundFetchManager",
    "BackgroundFetchRecord",
    "BackgroundFetchRegistration",
    "BluetoothUUID",
    "CSSScopeRule",
    "CropTarget",
    "DocumentPictureInPictureEvent",
    "MediaMetadata",
    "MediaSession",
    "NavigationActivation",
    "Notification",
    "PageRevealEvent",
    "PerformanceLongAnimationFrameTiming",
    "PerformanceScriptTiming",
    "PeriodicSyncManager",
    "PermissionStatus",
    "Permissions",
    "PushManager",
    "PushSubscription",
    "PushSubscriptionOptions",
    "RemotePlayback",
    "ScrollTimeline",
    "ViewTimeline",
    "SharedWorker",
    "SpeechSynthesis",
    "SpeechSynthesisErrorEvent",
    "SpeechSynthesisEvent",
    "SpeechSynthesisUtterance",
    "SpeechSynthesisVoice",
    "VideoPlaybackQuality",
    "webkitSpeechGrammar",
    "webkitSpeechGrammarList",
    "webkitSpeechRecognition",
    "webkitSpeechRecognitionError",
    "webkitSpeechRecognitionEvent",
    "webkitRequestFileSystem",
    "webkitResolveLocalFileSystemURL",
    "mark",
    "edenAssetsRetryRuntime",
    "WEBPACK_ASYNC_SCRIPT_COMPLETE",
    "EDEN_ASYNC_WEBPACK_SCRIPT_NAMES",
    "MINI_CSS_EXTRACT_ASYNC_LINK_COMPLETE",
    "TeaAnalyticsObject",
    "collectEvent",
    "Slardar",
    "w0_0x3771f2",
    "_$webrt_1668687510",
    "byted_acrawler",
    "e",
    "U6I7dQDnPIbkh",
    "__core-js_shared__",
    "_sdkGlueVersionMap",
    "_SdkGlueInit",
    "secsdk",
    "xss",
    "filterCSS",
    "filterXSS",
    "getFilterXss",
    "isSafeUrl",
    "isSafeDomain",
    "isSafeProtocol",
    "_xssProject",
    "UAParser",
    "LogPluginObject",
    "isLazyChildren",
    "collectEventInited",
    "ssrData",
    "getCookie",
    "getSSrData",
    "getDate",
    "liveInsertType",
    "getLiveInsertType",
    "safeGetParams",
    "getCommonParams",
    "request",
    "preFeedRequest",
    "__pace_route_manifest_path",
    "__pace_f",
    "$RC",
    "xssNamespace",
    "webpackChunkdouyin_web",
    "hasShowOnce",
    "showAccount",
    "__createFromFetch",
    "__pace_route_status",
    "OPEN_AUTH_SDK",
    "douyinPanel",
    "version",
    "__SLARDAR_REGISTRY__",
    "bdms",
    "onwheelx",
    "regeneratorRuntime",
    "hydrateIsland",
    "SSR_RENDER_DATA_DOC",
    "abTestData",
    "__CMP",
    "cmp",
    "a11yConfigs",
    "tce_cluster",
    "isProductionEnv",
    "updateUserInfo",
    "spec_user_follower_uid_list",
    "__INVISIBLE_QUERY__",
    "setImmediate",
    "clearImmediate",
    "globalCtx",
    "dir",
    "dirxml",
    "profile",
    "profileEnd",
    "clear",
    "table",
    "keys",
    "values",
    "debug",
    "undebug",
    "monitor",
    "unmonitor",
    "inspect",
    "copy",
    "queryObjects",
    "$_",
    "$0",
    "$1",
    "$2",
    "$3",
    "$4",
    "getEventListeners",
    "getAccessibleName",
    "getAccessibleRole",
    "monitorEvents",
    "unmonitorEvents",
    "$",
    "$$",
    "$x"
]
    }

    console.log(arguments)
    debugger;
    return catchvm.memory.getOwnPropertyNames(obj)
};catchvm.func_set_natvie(Object.getOwnPropertyNames)


catchvm.memory.getOwnPropertySymbols = Object.getOwnPropertySymbols
Object.getOwnPropertySymbols = function getOwnPropertySymbols(obj){
    console.log(arguments)
    debugger;
    return catchvm.memory.getOwnPropertySymbols(obj)
};catchvm.func_set_natvie(Object.getOwnPropertySymbols)


catchvm.memory.hasOwn = Object.hasOwn
Object.hasOwn = function hasOwn(obj, prop){
    // console.log(arguments)
    // debugger;
    // console.log(catchvm.memory.hasOwn(obj, prop))
    return catchvm.memory.hasOwn(obj, prop)
};catchvm.func_set_natvie(Object.hasOwn)


catchvm.memory.isExtensible = Object.isExtensible
Object.isExtensible = function isExtensible(obj){
    console.log(arguments)
    debugger;
    return catchvm.memory.isExtensible(obj)
};catchvm.func_set_natvie(Object.isExtensible)


catchvm.memory.isSealed = Object.isSealed
Object.isSealed = function isSealed(obj){
    console.log(arguments)
    debugger;
    return catchvm.memory.isSealed(obj)
};catchvm.func_set_natvie(Object.isSealed)


catchvm.memory.keys = Object.keys
Object.keys = function keys(obj){
    if(obj.toString().indexOf('HTMLDocument') != -1){
        console.log('检测了 ——> Object.keys(HTMLDocument)')
        return []
    }
    if(obj === Document.prototype){
        console.log('检测了 ——> Object.keys(Document.prototype)')
        return [
            "implementation",
            "URL",
            "documentURI",
            "compatMode",
            "characterSet",
            "charset",
            "inputEncoding",
            "contentType",
            "doctype",
            "documentElement",
            "xmlEncoding",
            "xmlVersion",
            "xmlStandalone",
            "domain",
            "referrer",
            "cookie",
            "lastModified",
            "readyState",
            "title",
            "dir",
            "body",
            "head",
            "images",
            "embeds",
            "plugins",
            "links",
            "forms",
            "scripts",
            "currentScript",
            "defaultView",
            "designMode",
            "onreadystatechange",
            "anchors",
            "applets",
            "fgColor",
            "linkColor",
            "vlinkColor",
            "alinkColor",
            "bgColor",
            "all",
            "scrollingElement",
            "onpointerlockchange",
            "onpointerlockerror",
            "hidden",
            "visibilityState",
            "wasDiscarded",
            "prerendering",
            "featurePolicy",
            "webkitVisibilityState",
            "webkitHidden",
            "onbeforecopy",
            "onbeforecut",
            "onbeforepaste",
            "onfreeze",
            "onprerenderingchange",
            "onresume",
            "onsearch",
            "onvisibilitychange",
            "timeline",
            "fullscreenEnabled",
            "fullscreen",
            "onfullscreenchange",
            "onfullscreenerror",
            "webkitIsFullScreen",
            "webkitCurrentFullScreenElement",
            "webkitFullscreenEnabled",
            "webkitFullscreenElement",
            "onwebkitfullscreenchange",
            "onwebkitfullscreenerror",
            "rootElement",
            "pictureInPictureEnabled",
            "onbeforexrselect",
            "onabort",
            "onbeforeinput",
            "onbeforematch",
            "onbeforetoggle",
            "onblur",
            "oncancel",
            "oncanplay",
            "oncanplaythrough",
            "onchange",
            "onclick",
            "onclose",
            "oncontentvisibilityautostatechange",
            "oncontextlost",
            "oncontextmenu",
            "oncontextrestored",
            "oncuechange",
            "ondblclick",
            "ondrag",
            "ondragend",
            "ondragenter",
            "ondragleave",
            "ondragover",
            "ondragstart",
            "ondrop",
            "ondurationchange",
            "onemptied",
            "onended",
            "onerror",
            "onfocus",
            "onformdata",
            "oninput",
            "oninvalid",
            "onkeydown",
            "onkeypress",
            "onkeyup",
            "onload",
            "onloadeddata",
            "onloadedmetadata",
            "onloadstart",
            "onmousedown",
            "onmouseenter",
            "onmouseleave",
            "onmousemove",
            "onmouseout",
            "onmouseover",
            "onmouseup",
            "onmousewheel",
            "onpause",
            "onplay",
            "onplaying",
            "onprogress",
            "onratechange",
            "onreset",
            "onresize",
            "onscroll",
            "onsecuritypolicyviolation",
            "onseeked",
            "onseeking",
            "onselect",
            "onslotchange",
            "onstalled",
            "onsubmit",
            "onsuspend",
            "ontimeupdate",
            "ontoggle",
            "onvolumechange",
            "onwaiting",
            "onwebkitanimationend",
            "onwebkitanimationiteration",
            "onwebkitanimationstart",
            "onwebkittransitionend",
            "onwheel",
            "onauxclick",
            "ongotpointercapture",
            "onlostpointercapture",
            "onpointerdown",
            "onpointermove",
            "onpointerrawupdate",
            "onpointerup",
            "onpointercancel",
            "onpointerover",
            "onpointerout",
            "onpointerenter",
            "onpointerleave",
            "onselectstart",
            "onselectionchange",
            "onanimationend",
            "onanimationiteration",
            "onanimationstart",
            "ontransitionrun",
            "ontransitionstart",
            "ontransitionend",
            "ontransitioncancel",
            "oncopy",
            "oncut",
            "onpaste",
            "children",
            "firstElementChild",
            "lastElementChild",
            "childElementCount",
            "activeElement",
            "styleSheets",
            "pointerLockElement",
            "fullscreenElement",
            "adoptedStyleSheets",
            "pictureInPictureElement",
            "fonts",
            "adoptNode",
            "append",
            "captureEvents",
            "caretRangeFromPoint",
            "clear",
            "close",
            "createAttribute",
            "createAttributeNS",
            "createCDATASection",
            "createComment",
            "createDocumentFragment",
            "createElement",
            "createElementNS",
            "createEvent",
            "createExpression",
            "createNSResolver",
            "createNodeIterator",
            "createProcessingInstruction",
            "createRange",
            "createTextNode",
            "createTreeWalker",
            "elementFromPoint",
            "elementsFromPoint",
            "evaluate",
            "execCommand",
            "exitFullscreen",
            "exitPictureInPicture",
            "exitPointerLock",
            "getAnimations",
            "getElementById",
            "getElementsByClassName",
            "getElementsByName",
            "getElementsByTagName",
            "getElementsByTagNameNS",
            "getSelection",
            "hasFocus",
            "hasStorageAccess",
            "importNode",
            "open",
            "prepend",
            "queryCommandEnabled",
            "queryCommandIndeterm",
            "queryCommandState",
            "queryCommandSupported",
            "queryCommandValue",
            "querySelector",
            "querySelectorAll",
            "releaseEvents",
            "replaceChildren",
            "requestStorageAccess",
            "requestStorageAccessFor",
            "startViewTransition",
            "webkitCancelFullScreen",
            "webkitExitFullscreen",
            "write",
            "writeln",
            "fragmentDirective",
            "hasPrivateToken",
            "hasRedemptionRecord",
            "onscrollend"
        ]
    }
    if(obj.toString().indexOf('HTMLImageElement') != -1){
        console.log('检测了 ——> Object.keys(HTMLImageElement)')
        return []
    }
    if(obj[0] == "directSign"){
        console.log('检测了 ——> Object.keys([directSign, .....])')
        return [
            "directSign",
            "consistent",
            "location",
            "switch",
            "dom",
            "debugger",
            "node",
            "phantom",
            "webdriver",
            "incognito",
            "hook"
        ]
    }


    console.log(arguments)
    debugger;
    return catchvm.memory.keys(obj)
};catchvm.func_set_natvie(Object.keys)


catchvm.memory.values = Object.values
Object.values = function values(obj){
    console.log(arguments)
    debugger;
    return catchvm.memory.values(obj)
};catchvm.func_set_natvie(Object.values)




// Object.groupBy()
// Object.is()
/////////////////////////////////////////////////////////////////
console.clear()
debugger;