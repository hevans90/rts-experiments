(function(e){function t(t){for(var n,o,s=t[0],c=t[1],u=t[2],l=0,f=[];l<s.length;l++)o=s[l],Object.prototype.hasOwnProperty.call(i,o)&&i[o]&&f.push(i[o][0]),i[o]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(e[n]=c[n]);m&&m(t);while(f.length)f.shift()();return a.push.apply(a,u||[]),r()}function r(){for(var e,t=0;t<a.length;t++){for(var r=a[t],n=!0,o=1;o<r.length;o++){var s=r[o];0!==i[s]&&(n=!1)}n&&(a.splice(t--,1),e=c(c.s=r[0]))}return e}var n={},o={app:0},i={app:0},a=[];function s(e){return c.p+"js/"+({"game~isometric":"game~isometric",game:"game",isometric:"isometric"}[e]||e)+"."+{"game~isometric":"7704ed48",game:"0b625277",isometric:"6d1bf867"}[e]+".js"}function c(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,c),r.l=!0,r.exports}c.e=function(e){var t=[],r={game:1,isometric:1};o[e]?t.push(o[e]):0!==o[e]&&r[e]&&t.push(o[e]=new Promise((function(t,r){for(var n="css/"+({"game~isometric":"game~isometric",game:"game",isometric:"isometric"}[e]||e)+"."+{"game~isometric":"31d6cfe0",game:"4b2eec0e",isometric:"03d73845"}[e]+".css",i=c.p+n,a=document.getElementsByTagName("link"),s=0;s<a.length;s++){var u=a[s],l=u.getAttribute("data-href")||u.getAttribute("href");if("stylesheet"===u.rel&&(l===n||l===i))return t()}var f=document.getElementsByTagName("style");for(s=0;s<f.length;s++){u=f[s],l=u.getAttribute("data-href");if(l===n||l===i)return t()}var m=document.createElement("link");m.rel="stylesheet",m.type="text/css",m.onload=t,m.onerror=function(t){var n=t&&t.target&&t.target.src||i,a=new Error("Loading CSS chunk "+e+" failed.\n("+n+")");a.code="CSS_CHUNK_LOAD_FAILED",a.request=n,delete o[e],m.parentNode.removeChild(m),r(a)},m.href=i;var d=document.getElementsByTagName("head")[0];d.appendChild(m)})).then((function(){o[e]=0})));var n=i[e];if(0!==n)if(n)t.push(n[2]);else{var a=new Promise((function(t,r){n=i[e]=[t,r]}));t.push(n[2]=a);var u,l=document.createElement("script");l.charset="utf-8",l.timeout=120,c.nc&&l.setAttribute("nonce",c.nc),l.src=s(e);var f=new Error;u=function(t){l.onerror=l.onload=null,clearTimeout(m);var r=i[e];if(0!==r){if(r){var n=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src;f.message="Loading chunk "+e+" failed.\n("+n+": "+o+")",f.name="ChunkLoadError",f.type=n,f.request=o,r[1](f)}i[e]=void 0}};var m=setTimeout((function(){u({type:"timeout",target:l})}),12e4);l.onerror=l.onload=u,document.head.appendChild(l)}return Promise.all(t)},c.m=e,c.c=n,c.d=function(e,t,r){c.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},c.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.t=function(e,t){if(1&t&&(e=c(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(c.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)c.d(r,n,function(t){return e[t]}.bind(null,n));return r},c.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return c.d(t,"a",t),t},c.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},c.p="/rts-experiments/",c.oe=function(e){throw console.error(e),e};var u=window["webpackJsonp"]=window["webpackJsonp"]||[],l=u.push.bind(u);u.push=t,u=u.slice();for(var f=0;f<u.length;f++)t(u[f]);var m=l;a.push([0,"chunk-vendors"]),r()})({0:function(e,t,r){e.exports=r("cd49")},1341:function(e,t,r){},4494:function(e,t,r){},"5c0b":function(e,t,r){"use strict";var n=r("e332"),o=r.n(n);o.a},ad8a:function(e,t,r){"use strict";var n=r("1341"),o=r.n(n);o.a},cd49:function(e,t,r){"use strict";r.r(t);r("cadf"),r("551c"),r("f751"),r("097d");var n=r("2b0e"),o=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{id:"app"}},[r("router-view")],1)},i=[],a=(r("5c0b"),r("2877")),s={},c=Object(a["a"])(s,o,i,!1,null,null,null),u=c.exports,l=r("8c4f"),f=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"home"},[n("img",{attrs:{alt:"Vue logo",src:r("cf05")}}),n("HelloWorld",{attrs:{msg:"the ultimate game"}})],1)},m=[],d=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"nav"},[r("router-link",{attrs:{to:"/game"}},[e._v("Play "+e._s(e.msg))]),r("router-link",{attrs:{to:"/isometric"}},[e._v("What the hell is this?")])],1)},p=[],g=n["a"].extend({name:"HelloWorld",props:{msg:String}}),h=g,v=(r("d11b"),Object(a["a"])(h,d,p,!1,null,"7038a07d",null)),b=v.exports,y=n["a"].extend({name:"home",components:{HelloWorld:b}}),w=y,_=(r("ad8a"),Object(a["a"])(w,f,m,!1,null,"12d312f6",null)),j=_.exports;n["a"].use(l["a"]);var x=new l["a"]({mode:"history",base:"/rts-experiments/",routes:[{path:"/",name:"home",component:j},{path:"/game",name:"game",component:function(){return Promise.all([r.e("game~isometric"),r.e("game")]).then(r.bind(null,"7d36"))}},{path:"/isometric",name:"isometric",component:function(){return Promise.all([r.e("game~isometric"),r.e("isometric")]).then(r.bind(null,"7781"))}}]}),O=r("2f62");n["a"].use(O["a"]);var k=new O["a"].Store({state:{},mutations:{},actions:{}}),E=r("9483");Object(E["a"])("".concat("/rts-experiments/","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered:function(){console.log("Service worker has been registered.")},cached:function(){console.log("Content has been cached for offline use.")},updatefound:function(){console.log("New content is downloading.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(e){console.error("Error during service worker registration:",e)}}),n["a"].config.productionTip=!1,new n["a"]({router:x,store:k,render:function(e){return e(u)}}).$mount("#app")},cf05:function(e,t,r){e.exports=r.p+"img/logo.99eaa701.png"},d11b:function(e,t,r){"use strict";var n=r("4494"),o=r.n(n);o.a},e332:function(e,t,r){}});
//# sourceMappingURL=app.c074c3e2.js.map