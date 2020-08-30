(window.webpackJsonp=window.webpackJsonp||[]).push([[31],{150:function(e,t,a){"use strict";a.d(t,"a",(function(){return s})),a.d(t,"b",(function(){return f}));var r=a(0),n=a.n(r);function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function c(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){i(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function d(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},i=Object.keys(e);for(r=0;r<i.length;r++)a=i[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)a=i[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var l=n.a.createContext({}),u=function(e){var t=n.a.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):c(c({},t),e)),a},s=function(e){var t=u(e.components);return n.a.createElement(l.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return n.a.createElement(n.a.Fragment,{},t)}},p=n.a.forwardRef((function(e,t){var a=e.components,r=e.mdxType,i=e.originalType,o=e.parentName,l=d(e,["components","mdxType","originalType","parentName"]),s=u(a),p=r,f=s["".concat(o,".").concat(p)]||s[p]||b[p]||i;return a?n.a.createElement(f,c(c({ref:t},l),{},{components:a})):n.a.createElement(f,c({ref:t},l))}));function f(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=a.length,o=new Array(i);o[0]=p;var c={};for(var d in t)hasOwnProperty.call(t,d)&&(c[d]=t[d]);c.originalType=e,c.mdxType="string"==typeof e?e:r,o[1]=c;for(var l=2;l<i;l++)o[l]=a[l];return n.a.createElement.apply(null,o)}return n.a.createElement.apply(null,a)}p.displayName="MDXCreateElement"},86:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return o})),a.d(t,"metadata",(function(){return c})),a.d(t,"rightToc",(function(){return d})),a.d(t,"default",(function(){return u}));var r=a(2),n=a(6),i=(a(0),a(150)),o={id:"about-daita",title:"About daita",sidebar_label:"About daita"},c={unversionedId:"daita/about-daita",id:"daita/about-daita",isDocsHomePage:!1,title:"About daita",description:"TL;DR",source:"@site/docs/daita/about-daita.md",slug:"/daita/about-daita",permalink:"/docs/daita/about-daita",editUrl:"https://github.com/facebook/docusaurus/edit/master/website/docs/daita/about-daita.md",version:"current",sidebar_label:"About daita",sidebar:"someSidebar",next:{title:"Getting started",permalink:"/docs/daita/getting-started"}},d=[{value:"TL;DR",id:"tldr",children:[]},{value:"Introduction",id:"introduction",children:[]},{value:"Design goals",id:"design-goals",children:[]},{value:"Features",id:"features",children:[{value:"Backward compatible",id:"backward-compatible",children:[]},{value:"Compile safe",id:"compile-safe",children:[]},{value:"Cli",id:"cli",children:[]},{value:"api backend",id:"api-backend",children:[]}]}],l={rightToc:d};function u(e){var t=e.components,a=Object(n.a)(e,["components"]);return Object(i.b)("wrapper",Object(r.a)({},l,a,{components:t,mdxType:"MDXLayout"}),Object(i.b)("h2",{id:"tldr"},"TL;DR"),Object(i.b)("h2",{id:"introduction"},"Introduction"),Object(i.b)("p",null,"Daita is backward compatible ORM for relational and document databases."),Object(i.b)("h2",{id:"design-goals"},"Design goals"),Object(i.b)("h2",{id:"features"},"Features"),Object(i.b)("h3",{id:"backward-compatible"},"Backward compatible"),Object(i.b)("p",null,"Daita generates migrations based on the defined models in your source code. As in other ORM frameworks those migrations can be applied to a database to modify your data structure. The difference is that with the daita tooling the modifications are backward compatible to your last migrations. This means your old version of your application can run side to side with your new version. This should make zero downtime and canary deployments easy and straight forward for everyone."),Object(i.b)("h3",{id:"compile-safe"},"Compile safe"),Object(i.b)("p",null,"100% compile safe data handling"),Object(i.b)("h3",{id:"cli"},"Cli"),Object(i.b)("p",null,"Cli to managing migrations"),Object(i.b)("h3",{id:"api-backend"},"api backend"),Object(i.b)("p",null,"Api to serve data without a backend"))}u.isMDXComponent=!0}}]);