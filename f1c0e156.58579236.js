(window.webpackJsonp=window.webpackJsonp||[]).push([[86],{219:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return u})),r.d(t,"metadata",(function(){return o})),r.d(t,"rightToc",(function(){return l})),r.d(t,"default",(function(){return c}));var n=r(1),i=r(9),a=(r(0),r(229)),u={id:"delete",title:"delete",sidebar_label:"delete"},o={id:"relational/sql/queries/delete",title:"delete",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac euismod odio, eu consequat dui. Nullam molestie consectetur risus id imperdiet. Proin sodales ornare turpis, non mollis massa ultricies id. Nam at nibh scelerisque, feugiat ante non, dapibus tortor. Vivamus volutpat diam quis tellus elementum bibendum. Praesent semper gravida velit quis aliquam. Etiam in cursus neque. Nam lectus ligula, malesuada et mauris a, bibendum faucibus mi. Phasellus ut interdum felis. Phasellus in odio pulvinar, porttitor urna eget, fringilla lectus. Aliquam sollicitudin est eros. Mauris consectetur quam vitae mauris interdum hendrerit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",source:"@site/docs/relational/sql/queries/delete.md",permalink:"/docs/relational/sql/queries/delete",editUrl:"https://github.com/facebook/docusaurus/edit/master/website/docs/relational/sql/queries/delete.md",sidebar_label:"delete",sidebar:"someSidebar",previous:{title:"update",permalink:"/docs/relational/sql/queries/update"},next:{title:"create-schema",permalink:"/docs/relational/sql/queries/create-schema"}},l=[],s={rightToc:l};function c(e){var t=e.components,r=Object(i.a)(e,["components"]);return Object(a.b)("wrapper",Object(n.a)({},s,r,{components:t,mdxType:"MDXLayout"}),Object(a.b)("p",null,"Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac euismod odio, eu consequat dui. Nullam molestie consectetur risus id imperdiet. Proin sodales ornare turpis, non mollis massa ultricies id. Nam at nibh scelerisque, feugiat ante non, dapibus tortor. Vivamus volutpat diam quis tellus elementum bibendum. Praesent semper gravida velit quis aliquam. Etiam in cursus neque. Nam lectus ligula, malesuada et mauris a, bibendum faucibus mi. Phasellus ut interdum felis. Phasellus in odio pulvinar, porttitor urna eget, fringilla lectus. Aliquam sollicitudin est eros. Mauris consectetur quam vitae mauris interdum hendrerit. Lorem ipsum dolor sit amet, consectetur adipiscing elit."),Object(a.b)("pre",null,Object(a.b)("code",Object(n.a)({parentName:"pre"},{className:"language-typescript"}),"import {DeleteSql, table, field, equal} from '@daita/relational';\n\nclass Mountain {\n  height: number;\n}\n\n// DELETE FROM Mountain WHERE height = 800\nconst sql: DeleteSql = {\n  from: table(Mountain),\n  where: equal(field(Mountain, 'height'), 800)\n};\n")))}c.isMDXComponent=!0},229:function(e,t,r){"use strict";r.d(t,"a",(function(){return m})),r.d(t,"b",(function(){return b}));var n=r(0),i=r.n(n);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function u(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?u(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):u(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r,n,i={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var s=i.a.createContext({}),c=function(e){var t=i.a.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):o({},t,{},e)),r},m=function(e){var t=c(e.components);return i.a.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return i.a.createElement(i.a.Fragment,{},t)}},p=Object(n.forwardRef)((function(e,t){var r=e.components,n=e.mdxType,a=e.originalType,u=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),m=c(r),p=n,b=m["".concat(u,".").concat(p)]||m[p]||d[p]||a;return r?i.a.createElement(b,o({ref:t},s,{components:r})):i.a.createElement(b,o({ref:t},s))}));function b(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var a=r.length,u=new Array(a);u[0]=p;var o={};for(var l in t)hasOwnProperty.call(t,l)&&(o[l]=t[l]);o.originalType=e,o.mdxType="string"==typeof e?e:n,u[1]=o;for(var s=2;s<a;s++)u[s]=r[s];return i.a.createElement.apply(null,u)}return i.a.createElement.apply(null,r)}p.displayName="MDXCreateElement"}}]);