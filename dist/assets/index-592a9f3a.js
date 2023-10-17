(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function i(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=i(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const z=window,ot=z.ShadowRoot&&(z.ShadyCSS===void 0||z.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,qt=Symbol(),ft=new WeakMap;let ie=class{constructor(t,i,n){if(this._$cssResult$=!0,n!==qt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=i}get styleSheet(){let t=this.o;const i=this.t;if(ot&&t===void 0){const n=i!==void 0&&i.length===1;n&&(t=ft.get(i)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&ft.set(i,t))}return t}toString(){return this.cssText}};const ne=e=>new ie(typeof e=="string"?e:e+"",void 0,qt),se=(e,t)=>{ot?e.adoptedStyleSheets=t.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet):t.forEach(i=>{const n=document.createElement("style"),s=z.litNonce;s!==void 0&&n.setAttribute("nonce",s),n.textContent=i.cssText,e.appendChild(n)})},vt=ot?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let i="";for(const n of t.cssRules)i+=n.cssText;return ne(i)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var J;const D=window,gt=D.trustedTypes,re=gt?gt.emptyScript:"",mt=D.reactiveElementPolyfillSupport,et={toAttribute(e,t){switch(t){case Boolean:e=e?re:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=e!==null;break;case Number:i=e===null?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch{i=null}}return i}},jt=(e,t)=>t!==e&&(t==t||e==e),K={attribute:!0,type:String,converter:et,reflect:!1,hasChanged:jt},it="finalized";let C=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var i;this.finalize(),((i=this.h)!==null&&i!==void 0?i:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((i,n)=>{const s=this._$Ep(n,i);s!==void 0&&(this._$Ev.set(s,n),t.push(s))}),t}static createProperty(t,i=K){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const n=typeof t=="symbol"?Symbol():"__"+t,s=this.getPropertyDescriptor(t,n,i);s!==void 0&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,i,n){return{get(){return this[i]},set(s){const r=this[t];this[i]=s,this.requestUpdate(t,r,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||K}static finalize(){if(this.hasOwnProperty(it))return!1;this[it]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),t.h!==void 0&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const i=this.properties,n=[...Object.getOwnPropertyNames(i),...Object.getOwnPropertySymbols(i)];for(const s of n)this.createProperty(s,i[s])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const n=new Set(t.flat(1/0).reverse());for(const s of n)i.unshift(vt(s))}else t!==void 0&&i.push(vt(t));return i}static _$Ep(t,i){const n=i.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach(i=>i(this))}addController(t){var i,n;((i=this._$ES)!==null&&i!==void 0?i:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((n=t.hostConnected)===null||n===void 0||n.call(t))}removeController(t){var i;(i=this._$ES)===null||i===void 0||i.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,i)=>{this.hasOwnProperty(i)&&(this._$Ei.set(i,this[i]),delete this[i])})}createRenderRoot(){var t;const i=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return se(i,this.constructor.elementStyles),i}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach(i=>{var n;return(n=i.hostConnected)===null||n===void 0?void 0:n.call(i)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach(i=>{var n;return(n=i.hostDisconnected)===null||n===void 0?void 0:n.call(i)})}attributeChangedCallback(t,i,n){this._$AK(t,n)}_$EO(t,i,n=K){var s;const r=this.constructor._$Ep(t,n);if(r!==void 0&&n.reflect===!0){const o=(((s=n.converter)===null||s===void 0?void 0:s.toAttribute)!==void 0?n.converter:et).toAttribute(i,n.type);this._$El=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$El=null}}_$AK(t,i){var n;const s=this.constructor,r=s._$Ev.get(t);if(r!==void 0&&this._$El!==r){const o=s.getPropertyOptions(r),a=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)===null||n===void 0?void 0:n.fromAttribute)!==void 0?o.converter:et;this._$El=r,this[r]=a.fromAttribute(i,o.type),this._$El=null}}requestUpdate(t,i,n){let s=!0;t!==void 0&&(((n=n||this.constructor.getPropertyOptions(t)).hasChanged||jt)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),n.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,n))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(i){Promise.reject(i)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((s,r)=>this[r]=s),this._$Ei=void 0);let i=!1;const n=this._$AL;try{i=this.shouldUpdate(n),i?(this.willUpdate(n),(t=this._$ES)===null||t===void 0||t.forEach(s=>{var r;return(r=s.hostUpdate)===null||r===void 0?void 0:r.call(s)}),this.update(n)):this._$Ek()}catch(s){throw i=!1,this._$Ek(),s}i&&this._$AE(n)}willUpdate(t){}_$AE(t){var i;(i=this._$ES)===null||i===void 0||i.forEach(n=>{var s;return(s=n.hostUpdated)===null||s===void 0?void 0:s.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((i,n)=>this._$EO(n,this[n],i)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};C[it]=!0,C.elementProperties=new Map,C.elementStyles=[],C.shadowRootOptions={mode:"open"},mt==null||mt({ReactiveElement:C}),((J=D.reactiveElementVersions)!==null&&J!==void 0?J:D.reactiveElementVersions=[]).push("1.6.3");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var Z;const V=window,R=V.trustedTypes,$t=R?R.createPolicy("lit-html",{createHTML:e=>e}):void 0,nt="$lit$",_=`lit$${(Math.random()+"").slice(9)}$`,zt="?"+_,oe=`<${zt}>`,E=document,L=()=>E.createComment(""),I=e=>e===null||typeof e!="object"&&typeof e!="function",Dt=Array.isArray,ae=e=>Dt(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",Y=`[ 	
\f\r]`,T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,yt=/-->/g,bt=/>/g,w=RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),_t=/'/g,wt=/"/g,Vt=/^(?:script|style|textarea|title)$/i,Qt=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),u=Qt(1),m=Qt(2),S=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),At=new WeakMap,A=E.createTreeWalker(E,129,null,!1);function Wt(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return $t!==void 0?$t.createHTML(t):t}const le=(e,t)=>{const i=e.length-1,n=[];let s,r=t===2?"<svg>":"",o=T;for(let a=0;a<i;a++){const l=e[a];let h,c,d=-1,f=0;for(;f<l.length&&(o.lastIndex=f,c=o.exec(l),c!==null);)f=o.lastIndex,o===T?c[1]==="!--"?o=yt:c[1]!==void 0?o=bt:c[2]!==void 0?(Vt.test(c[2])&&(s=RegExp("</"+c[2],"g")),o=w):c[3]!==void 0&&(o=w):o===w?c[0]===">"?(o=s??T,d=-1):c[1]===void 0?d=-2:(d=o.lastIndex-c[2].length,h=c[1],o=c[3]===void 0?w:c[3]==='"'?wt:_t):o===wt||o===_t?o=w:o===yt||o===bt?o=T:(o=w,s=void 0);const g=o===w&&e[a+1].startsWith("/>")?" ":"";r+=o===T?l+oe:d>=0?(n.push(h),l.slice(0,d)+nt+l.slice(d)+_+g):l+_+(d===-2?(n.push(void 0),a):g)}return[Wt(e,r+(e[i]||"<?>")+(t===2?"</svg>":"")),n]};class O{constructor({strings:t,_$litType$:i},n){let s;this.parts=[];let r=0,o=0;const a=t.length-1,l=this.parts,[h,c]=le(t,i);if(this.el=O.createElement(h,n),A.currentNode=this.el.content,i===2){const d=this.el.content,f=d.firstChild;f.remove(),d.append(...f.childNodes)}for(;(s=A.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes()){const d=[];for(const f of s.getAttributeNames())if(f.endsWith(nt)||f.startsWith(_)){const g=c[o++];if(d.push(f),g!==void 0){const F=s.getAttribute(g.toLowerCase()+nt).split(_),x=/([.?@])?(.*)/.exec(g);l.push({type:1,index:r,name:x[2],strings:F,ctor:x[1]==="."?ce:x[1]==="?"?ue:x[1]==="@"?pe:Q})}else l.push({type:6,index:r})}for(const f of d)s.removeAttribute(f)}if(Vt.test(s.tagName)){const d=s.textContent.split(_),f=d.length-1;if(f>0){s.textContent=R?R.emptyScript:"";for(let g=0;g<f;g++)s.append(d[g],L()),A.nextNode(),l.push({type:2,index:++r});s.append(d[f],L())}}}else if(s.nodeType===8)if(s.data===zt)l.push({type:2,index:r});else{let d=-1;for(;(d=s.data.indexOf(_,d+1))!==-1;)l.push({type:7,index:r}),d+=_.length-1}r++}}static createElement(t,i){const n=E.createElement("template");return n.innerHTML=t,n}}function P(e,t,i=e,n){var s,r,o,a;if(t===S)return t;let l=n!==void 0?(s=i._$Co)===null||s===void 0?void 0:s[n]:i._$Cl;const h=I(t)?void 0:t._$litDirective$;return(l==null?void 0:l.constructor)!==h&&((r=l==null?void 0:l._$AO)===null||r===void 0||r.call(l,!1),h===void 0?l=void 0:(l=new h(e),l._$AT(e,i,n)),n!==void 0?((o=(a=i)._$Co)!==null&&o!==void 0?o:a._$Co=[])[n]=l:i._$Cl=l),l!==void 0&&(t=P(e,l._$AS(e,t.values),l,n)),t}class he{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var i;const{el:{content:n},parts:s}=this._$AD,r=((i=t==null?void 0:t.creationScope)!==null&&i!==void 0?i:E).importNode(n,!0);A.currentNode=r;let o=A.nextNode(),a=0,l=0,h=s[0];for(;h!==void 0;){if(a===h.index){let c;h.type===2?c=new H(o,o.nextSibling,this,t):h.type===1?c=new h.ctor(o,h.name,h.strings,this,t):h.type===6&&(c=new fe(o,this,t)),this._$AV.push(c),h=s[++l]}a!==(h==null?void 0:h.index)&&(o=A.nextNode(),a++)}return A.currentNode=E,r}v(t){let i=0;for(const n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,i),i+=n.strings.length-2):n._$AI(t[i])),i++}}class H{constructor(t,i,n,s){var r;this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=n,this.options=s,this._$Cp=(r=s==null?void 0:s.isConnected)===null||r===void 0||r}get _$AU(){var t,i;return(i=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&i!==void 0?i:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return i!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=P(this,t,i),I(t)?t===v||t==null||t===""?(this._$AH!==v&&this._$AR(),this._$AH=v):t!==this._$AH&&t!==S&&this._(t):t._$litType$!==void 0?this.g(t):t.nodeType!==void 0?this.$(t):ae(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==v&&I(this._$AH)?this._$AA.nextSibling.data=t:this.$(E.createTextNode(t)),this._$AH=t}g(t){var i;const{values:n,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=O.createElement(Wt(s.h,s.h[0]),this.options)),s);if(((i=this._$AH)===null||i===void 0?void 0:i._$AD)===r)this._$AH.v(n);else{const o=new he(r,this),a=o.u(this.options);o.v(n),this.$(a),this._$AH=o}}_$AC(t){let i=At.get(t.strings);return i===void 0&&At.set(t.strings,i=new O(t)),i}T(t){Dt(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let n,s=0;for(const r of t)s===i.length?i.push(n=new H(this.k(L()),this.k(L()),this,this.options)):n=i[s],n._$AI(r),s++;s<i.length&&(this._$AR(n&&n._$AB.nextSibling,s),i.length=s)}_$AR(t=this._$AA.nextSibling,i){var n;for((n=this._$AP)===null||n===void 0||n.call(this,!1,!0,i);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var i;this._$AM===void 0&&(this._$Cp=t,(i=this._$AP)===null||i===void 0||i.call(this,t))}}class Q{constructor(t,i,n,s,r){this.type=1,this._$AH=v,this._$AN=void 0,this.element=t,this.name=i,this._$AM=s,this.options=r,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=v}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,n,s){const r=this.strings;let o=!1;if(r===void 0)t=P(this,t,i,0),o=!I(t)||t!==this._$AH&&t!==S,o&&(this._$AH=t);else{const a=t;let l,h;for(t=r[0],l=0;l<r.length-1;l++)h=P(this,a[n+l],i,l),h===S&&(h=this._$AH[l]),o||(o=!I(h)||h!==this._$AH[l]),h===v?t=v:t!==v&&(t+=(h??"")+r[l+1]),this._$AH[l]=h}o&&!s&&this.j(t)}j(t){t===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class ce extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===v?void 0:t}}const de=R?R.emptyScript:"";class ue extends Q{constructor(){super(...arguments),this.type=4}j(t){t&&t!==v?this.element.setAttribute(this.name,de):this.element.removeAttribute(this.name)}}class pe extends Q{constructor(t,i,n,s,r){super(t,i,n,s,r),this.type=5}_$AI(t,i=this){var n;if((t=(n=P(this,t,i,0))!==null&&n!==void 0?n:v)===S)return;const s=this._$AH,r=t===v&&s!==v||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==v&&(s===v||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var i,n;typeof this._$AH=="function"?this._$AH.call((n=(i=this.options)===null||i===void 0?void 0:i.host)!==null&&n!==void 0?n:this.element,t):this._$AH.handleEvent(t)}}class fe{constructor(t,i,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){P(this,t)}}const Et=V.litHtmlPolyfillSupport;Et==null||Et(O,H),((Z=V.litHtmlVersions)!==null&&Z!==void 0?Z:V.litHtmlVersions=[]).push("2.8.0");const ve=(e,t,i)=>{var n,s;const r=(n=i==null?void 0:i.renderBefore)!==null&&n!==void 0?n:t;let o=r._$litPart$;if(o===void 0){const a=(s=i==null?void 0:i.renderBefore)!==null&&s!==void 0?s:null;r._$litPart$=o=new H(t.insertBefore(L(),a),a,void 0,i??{})}return o._$AI(e),o};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var X,B;class $ extends C{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,i;const n=super.createRenderRoot();return(t=(i=this.renderOptions).renderBefore)!==null&&t!==void 0||(i.renderBefore=n.firstChild),n}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ve(i,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!1)}render(){return S}}$.finalized=!0,$._$litElement$=!0,(X=globalThis.litElementHydrateSupport)===null||X===void 0||X.call(globalThis,{LitElement:$});const St=globalThis.litElementPolyfillSupport;St==null||St({LitElement:$});((B=globalThis.litElementVersions)!==null&&B!==void 0?B:globalThis.litElementVersions=[]).push("3.3.3");var st=Array.isArray||function(e){return Object.prototype.toString.call(e)=="[object Array]"},M=Kt,ge=at,me=_e,$e=Gt,ye=Jt,be=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))"].join("|"),"g");function at(e){for(var t=[],i=0,n=0,s="",r;(r=be.exec(e))!=null;){var o=r[0],a=r[1],l=r.index;if(s+=e.slice(n,l),n=l+o.length,a){s+=a[1];continue}s&&(t.push(s),s="");var h=r[2],c=r[3],d=r[4],f=r[5],g=r[6],F=r[7],x=g==="+"||g==="*",te=g==="?"||g==="*",pt=h||"/",ee=d||f||(F?".*":"[^"+pt+"]+?");t.push({name:c||i++,prefix:h||"",delimiter:pt,optional:te,repeat:x,pattern:we(ee)})}return n<e.length&&(s+=e.substr(n)),s&&t.push(s),t}function _e(e){return Gt(at(e))}function Gt(e){for(var t=new Array(e.length),i=0;i<e.length;i++)typeof e[i]=="object"&&(t[i]=new RegExp("^"+e[i].pattern+"$"));return function(n){for(var s="",r=n||{},o=0;o<e.length;o++){var a=e[o];if(typeof a=="string"){s+=a;continue}var l=r[a.name],h;if(l==null){if(a.optional)continue;throw new TypeError('Expected "'+a.name+'" to be defined')}if(st(l)){if(!a.repeat)throw new TypeError('Expected "'+a.name+'" to not repeat, but received "'+l+'"');if(l.length===0){if(a.optional)continue;throw new TypeError('Expected "'+a.name+'" to not be empty')}for(var c=0;c<l.length;c++){if(h=encodeURIComponent(l[c]),!t[o].test(h))throw new TypeError('Expected all "'+a.name+'" to match "'+a.pattern+'", but received "'+h+'"');s+=(c===0?a.prefix:a.delimiter)+h}continue}if(h=encodeURIComponent(l),!t[o].test(h))throw new TypeError('Expected "'+a.name+'" to match "'+a.pattern+'", but received "'+h+'"');s+=a.prefix+h}return s}}function xt(e){return e.replace(/([.+*?=^!:${}()[\]|\/])/g,"\\$1")}function we(e){return e.replace(/([=!:$\/()])/g,"\\$1")}function lt(e,t){return e.keys=t,e}function Ft(e){return e.sensitive?"":"i"}function Ae(e,t){var i=e.source.match(/\((?!\?)/g);if(i)for(var n=0;n<i.length;n++)t.push({name:n,prefix:null,delimiter:null,optional:!1,repeat:!1,pattern:null});return lt(e,t)}function Ee(e,t,i){for(var n=[],s=0;s<e.length;s++)n.push(Kt(e[s],t,i).source);var r=new RegExp("(?:"+n.join("|")+")",Ft(i));return lt(r,t)}function Se(e,t,i){for(var n=at(e),s=Jt(n,i),r=0;r<n.length;r++)typeof n[r]!="string"&&t.push(n[r]);return lt(s,t)}function Jt(e,t){t=t||{};for(var i=t.strict,n=t.end!==!1,s="",r=e[e.length-1],o=typeof r=="string"&&/\/$/.test(r),a=0;a<e.length;a++){var l=e[a];if(typeof l=="string")s+=xt(l);else{var h=xt(l.prefix),c=l.pattern;l.repeat&&(c+="(?:"+h+c+")*"),l.optional?h?c="(?:"+h+"("+c+"))?":c="("+c+")?":c=h+"("+c+")",s+=c}}return i||(s=(o?s.slice(0,-2):s)+"(?:\\/(?=$))?"),n?s+="$":s+=i&&o?"":"(?=\\/|$)",new RegExp("^"+s,Ft(t))}function Kt(e,t,i){return t=t||[],st(t)?i||(i={}):(i=t,t=[]),e instanceof RegExp?Ae(e,t):st(e)?Ee(e,t,i):Se(e,t,i)}M.parse=ge;M.compile=me;M.tokensToFunction=$e;M.tokensToRegExp=ye;var k=typeof document<"u",y=typeof window<"u",W=typeof history<"u",xe=typeof process<"u",rt=k&&document.ontouchstart?"touchstart":"click",b=y&&!!(window.history.location||window.location);function p(){this.callbacks=[],this.exits=[],this.current="",this.len=0,this._decodeURLComponents=!0,this._base="",this._strict=!1,this._running=!1,this._hashbang=!1,this.clickHandler=this.clickHandler.bind(this),this._onpopstate=this._onpopstate.bind(this)}p.prototype.configure=function(e){var t=e||{};this._window=t.window||y&&window,this._decodeURLComponents=t.decodeURLComponents!==!1,this._popstate=t.popstate!==!1&&y,this._click=t.click!==!1&&k,this._hashbang=!!t.hashbang;var i=this._window;this._popstate?i.addEventListener("popstate",this._onpopstate,!1):y&&i.removeEventListener("popstate",this._onpopstate,!1),this._click?i.document.addEventListener(rt,this.clickHandler,!1):k&&i.document.removeEventListener(rt,this.clickHandler,!1),this._hashbang&&y&&!W?i.addEventListener("hashchange",this._onpopstate,!1):y&&i.removeEventListener("hashchange",this._onpopstate,!1)};p.prototype.base=function(e){if(arguments.length===0)return this._base;this._base=e};p.prototype._getBase=function(){var e=this._base;if(e)return e;var t=y&&this._window&&this._window.location;return y&&this._hashbang&&t&&t.protocol==="file:"&&(e=t.pathname),e};p.prototype.strict=function(e){if(arguments.length===0)return this._strict;this._strict=e};p.prototype.start=function(e){var t=e||{};if(this.configure(t),t.dispatch!==!1){this._running=!0;var i;if(b){var n=this._window,s=n.location;this._hashbang&&~s.hash.indexOf("#!")?i=s.hash.substr(2)+s.search:this._hashbang?i=s.search+s.hash:i=s.pathname+s.search+s.hash}this.replace(i,null,!0,t.dispatch)}};p.prototype.stop=function(){if(this._running){this.current="",this.len=0,this._running=!1;var e=this._window;this._click&&e.document.removeEventListener(rt,this.clickHandler,!1),y&&e.removeEventListener("popstate",this._onpopstate,!1),y&&e.removeEventListener("hashchange",this._onpopstate,!1)}};p.prototype.show=function(e,t,i,n){var s=new N(e,t,this),r=this.prevContext;return this.prevContext=s,this.current=s.path,i!==!1&&this.dispatch(s,r),s.handled!==!1&&n!==!1&&s.pushState(),s};p.prototype.back=function(e,t){var i=this;if(this.len>0){var n=this._window;W&&n.history.back(),this.len--}else setTimeout(e?function(){i.show(e,t)}:function(){i.show(i._getBase(),t)})};p.prototype.redirect=function(e,t){var i=this;typeof e=="string"&&typeof t=="string"&&G.call(this,e,function(n){setTimeout(function(){i.replace(t)},0)}),typeof e=="string"&&typeof t>"u"&&setTimeout(function(){i.replace(e)},0)};p.prototype.replace=function(e,t,i,n){var s=new N(e,t,this),r=this.prevContext;return this.prevContext=s,this.current=s.path,s.init=i,s.save(),n!==!1&&this.dispatch(s,r),s};p.prototype.dispatch=function(e,t){var i=0,n=0,s=this;function r(){var a=s.exits[n++];if(!a)return o();a(t,r)}function o(){var a=s.callbacks[i++];if(e.path!==s.current){e.handled=!1;return}if(!a)return Ce.call(s,e);a(e,o)}t?r():o()};p.prototype.exit=function(e,t){if(typeof e=="function")return this.exit("*",e);for(var i=new q(e,null,this),n=1;n<arguments.length;++n)this.exits.push(i.middleware(arguments[n]))};p.prototype.clickHandler=function(e){if(this._which(e)===1&&!(e.metaKey||e.ctrlKey||e.shiftKey)&&!e.defaultPrevented){var t=e.target,i=e.path||(e.composedPath?e.composedPath():null);if(i){for(var n=0;n<i.length;n++)if(i[n].nodeName&&i[n].nodeName.toUpperCase()==="A"&&i[n].href){t=i[n];break}}for(;t&&t.nodeName.toUpperCase()!=="A";)t=t.parentNode;if(!(!t||t.nodeName.toUpperCase()!=="A")){var s=typeof t.href=="object"&&t.href.constructor.name==="SVGAnimatedString";if(!(t.hasAttribute("download")||t.getAttribute("rel")==="external")){var r=t.getAttribute("href");if(!(!this._hashbang&&this._samePath(t)&&(t.hash||r==="#"))&&!(r&&r.indexOf("mailto:")>-1)&&!(s?t.target.baseVal:t.target)&&!(!s&&!this.sameOrigin(t.href))){var o=s?t.href.baseVal:t.pathname+t.search+(t.hash||"");o=o[0]!=="/"?"/"+o:o,xe&&o.match(/^\/[a-zA-Z]:\//)&&(o=o.replace(/^\/[a-zA-Z]:\//,"/"));var a=o,l=this._getBase();o.indexOf(l)===0&&(o=o.substr(l.length)),this._hashbang&&(o=o.replace("#!","")),!(l&&a===o&&(!b||this._window.location.protocol!=="file:"))&&(e.preventDefault(),this.show(a))}}}}};p.prototype._onpopstate=function(){var e=!1;return y?(k&&document.readyState==="complete"?e=!0:window.addEventListener("load",function(){setTimeout(function(){e=!0},0)}),function(i){if(e){var n=this;if(i.state){var s=i.state.path;n.replace(s,i.state)}else if(b){var r=n._window.location;n.show(r.pathname+r.search+r.hash,void 0,void 0,!1)}}}):function(){}}();p.prototype._which=function(e){return e=e||y&&this._window.event,e.which==null?e.button:e.which};p.prototype._toURL=function(e){var t=this._window;if(typeof URL=="function"&&b)return new URL(e,t.location.toString());if(k){var i=t.document.createElement("a");return i.href=e,i}};p.prototype.sameOrigin=function(e){if(!e||!b)return!1;var t=this._toURL(e),i=this._window,n=i.location;return n.protocol===t.protocol&&n.hostname===t.hostname&&(n.port===t.port||n.port===""&&(t.port==80||t.port==443))};p.prototype._samePath=function(e){if(!b)return!1;var t=this._window,i=t.location;return e.pathname===i.pathname&&e.search===i.search};p.prototype._decodeURLEncodedURIComponent=function(e){return typeof e!="string"?e:this._decodeURLComponents?decodeURIComponent(e.replace(/\+/g," ")):e};function Zt(){var e=new p;function t(){return G.apply(e,arguments)}return t.callbacks=e.callbacks,t.exits=e.exits,t.base=e.base.bind(e),t.strict=e.strict.bind(e),t.start=e.start.bind(e),t.stop=e.stop.bind(e),t.show=e.show.bind(e),t.back=e.back.bind(e),t.redirect=e.redirect.bind(e),t.replace=e.replace.bind(e),t.dispatch=e.dispatch.bind(e),t.exit=e.exit.bind(e),t.configure=e.configure.bind(e),t.sameOrigin=e.sameOrigin.bind(e),t.clickHandler=e.clickHandler.bind(e),t.create=Zt,Object.defineProperty(t,"len",{get:function(){return e.len},set:function(i){e.len=i}}),Object.defineProperty(t,"current",{get:function(){return e.current},set:function(i){e.current=i}}),t.Context=N,t.Route=q,t}function G(e,t){if(typeof e=="function")return G.call(this,"*",e);if(typeof t=="function")for(var i=new q(e,null,this),n=1;n<arguments.length;++n)this.callbacks.push(i.middleware(arguments[n]));else typeof e=="string"?this[typeof t=="string"?"redirect":"show"](e,t):this.start(e)}function Ce(e){if(!e.handled){var t,i=this,n=i._window;i._hashbang?t=b&&this._getBase()+n.location.hash.replace("#!",""):t=b&&n.location.pathname+n.location.search,t!==e.canonicalPath&&(i.stop(),e.handled=!1,b&&(n.location.href=e.canonicalPath))}}function Re(e){return e.replace(/([.+*?=^!:${}()[\]|/\\])/g,"\\$1")}function N(e,t,i){var n=this.page=i||G,s=n._window,r=n._hashbang,o=n._getBase();e[0]==="/"&&e.indexOf(o)!==0&&(e=o+(r?"#!":"")+e);var a=e.indexOf("?");this.canonicalPath=e;var l=new RegExp("^"+Re(o));if(this.path=e.replace(l,"")||"/",r&&(this.path=this.path.replace("#!","")||"/"),this.title=k&&s.document.title,this.state=t||{},this.state.path=e,this.querystring=~a?n._decodeURLEncodedURIComponent(e.slice(a+1)):"",this.pathname=n._decodeURLEncodedURIComponent(~a?e.slice(0,a):e),this.params={},this.hash="",!r){if(!~this.path.indexOf("#"))return;var h=this.path.split("#");this.path=this.pathname=h[0],this.hash=n._decodeURLEncodedURIComponent(h[1])||"",this.querystring=this.querystring.split("#")[0]}}N.prototype.pushState=function(){var e=this.page,t=e._window,i=e._hashbang;e.len++,W&&t.history.pushState(this.state,this.title,i&&this.path!=="/"?"#!"+this.path:this.canonicalPath)};N.prototype.save=function(){var e=this.page;W&&e._window.history.replaceState(this.state,this.title,e._hashbang&&this.path!=="/"?"#!"+this.path:this.canonicalPath)};function q(e,t,i){var n=this.page=i||ht,s=t||{};s.strict=s.strict||n._strict,this.path=e==="*"?"(.*)":e,this.method="GET",this.regexp=M(this.path,this.keys=[],s)}q.prototype.middleware=function(e){var t=this;return function(i,n){if(t.match(i.path,i.params))return i.routePath=t.path,e(i,n);n()}};q.prototype.match=function(e,t){var i=this.keys,n=e.indexOf("?"),s=~n?e.slice(0,n):e,r=this.regexp.exec(decodeURIComponent(s));if(!r)return!1;delete t[0];for(var o=1,a=r.length;o<a;++o){var l=i[o-1],h=this.page._decodeURLEncodedURIComponent(r[o]);(h!==void 0||!hasOwnProperty.call(t,l.name))&&(t[l.name]=h)}return!0};var ht=Zt(),U=ht,Pe=ht;U.default=Pe;class Ct extends ${static get it(){return"pq-adblock"}static get properties(){return{}}constructor(){super()}createRenderRoot(){return this}render(){return u`<div class="panel panel-default">
      <div class="panel-body">
        <div class="leaderboardAd">
          <ins
            class="adsbygoogle"
            style="display:inline-block;width:728px;height:90px"
            data-ad-client="ca-pub-8376642740439271"
            data-ad-slot="6535942993"
          ></ins>
        </div>
      </div>
    </div>`}firstUpdated(){window.adsbygoogle=window.adsbygoogle||[],window.adsbygoogle.push({})}}customElements.define(Ct.it,Ct);class Rt extends ${static get it(){return"pq-footer"}static get properties(){return{name:{type:String}}}constructor(){super()}createRenderRoot(){return this}render(){return u`<footer>
      <small>&copy; Copyright 2022, John Munsch</small>
    </footer> `}}customElements.define(Rt.it,Rt);class Pt extends ${static get it(){return"about-page"}static get properties(){return{}}constructor(){super()}createRenderRoot(){return this}render(){return u`<pq-menu active="about"></pq-menu>
      <div class="container">
        <pq-adblock></pq-adblock>

        <h2>About PaperQuik</h2>

        <p>
          I apparently started building the first version of PaperQuik some time
          around 2013-14. At that time I encountered a lot(!) of problems (SVG
          wouldn't print properly in any major browser so I had to make a huge
          image to print instead), I was using
          AngularJS/jQuery/Paper.js/Underscore.js/etc.
        </p>
        <p>
          It looked dead for many years, but I kept it running on the server
          because I actually used myself regularly to print out sheets for
          whatever project or idea I happened to be working on at the time.
        </p>
        <p>
          Fast forward to 2021 and the new version of same project uses only
          <a href="https://lit.dev">lit</a> and
          <a href="https://github.com/visionmedia/page.js">page</a> to do all
          the same work. I still use
          <a href="https://getbootstrap.com">Bootstrap</a> because I couldn't
          design my way out of a wet paper bag, but otherwise the code has
          gotten enormously simpler and should form the basis of something I can
          build on much more easily. Also, IE is finally dead so I don't have to
          care about that at all. Yay!
        </p>

        <h2>Credits</h2>

        <p>print by Adrien Coquet from the Noun Project</p>

        <pq-adblock></pq-adblock>

        <pq-footer></pq-footer>
      </div>`}}customElements.define(Pt.it,Pt);const Yt=[{id:"letter",name:"Letter",width:215.9,height:279.4},{id:"letterl",name:"Letter",width:279.4,height:215.9},{id:"legal",name:"Legal",width:215.9,height:355.6},{id:"legall",name:"Legal",width:355.6,height:215.9},{id:"a4",name:"A4",width:210,height:297},{id:"a4l",name:"A4",width:297,height:210},{id:"a5",name:"A5",width:148,height:210}],j=12.131895;function ke(e,t){const n={x:0,y:0,width:e.width,height:e.height},s={x:t.left,y:t.top,width:e.width-(t.left+t.right),height:15},r={x:t.left,y:e.height-t.bottom-2,width:e.width-(t.left+t.right),height:2},o={x:t.left,y:t.top+s.height+2.5,width:e.width-(t.left+t.right),height:e.height-(t.top+s.height+2.5+r.height+t.bottom)};return{backgroundBox:n,headerBox:s,bodyBox:o,footerBox:r}}function Te(e){return m`<rect class="background"
    style="fill-rule:evenodd;"
    width="${e.width}"
    height="${e.height}"
    x="${e.x}"
    y="${e.y}"
  />`}function Ue(e){return m`<rect style="fill: none;fill-rule:evenodd;"
                   width="${e.width}"
                   height="${e.height}"
                   x="${e.x}"
                   y="${e.y}"/>
    <line x1="${e.x}" y1="${e.y}"
          x2="${e.x+e.width}"
          y2="${e.y}"
          stroke="black" stroke-width="0.1"/>
    <line x1="${e.x}" y1="${e.y+e.height}"
          x2="${e.x+e.width}"
          y2="${e.y+e.height}"
          stroke="black" stroke-width="0.1" />
    <line x1="${e.x+e.width*.2}"
          y1="${e.y+1}"
          x2="${e.x+e.width*.2}"
          y2="${e.y+e.height-1}"
          stroke="black" stroke-width="0.1" />
    <text
       style="font-size:0.6mm;font-family:Lato;fill:#000000;"
       x="${e.x+2}"
       y="${e.y+3}">Date/Number</text>
    <text
       style="font-size:0.6mm;
       font-family:Lato;fill:#000000;"
       x="${e.x+e.width*.2+2}"
       y="${e.y+3}">Title/Subject</text>`}function kt(e,t,i){return m`${t.map(n=>i.map(s=>m`<circle cx="${e.x+s}"
                        cy="${e.y+n}" r=".2"/>`))}`}function tt(e,t){return m`${t.map(i=>m`<line x1="${e.x}"
          y1="${e.y+i}"
          x2="${e.x+e.width}"
          y2="${e.y+i}"
          stroke="black" stroke-width="0.1" />`)}`}function Le(e,t){return m`${t.map(i=>m`<line x1="${e.x+i}"
          y1="${e.y}"
          x2="${e.x+i}"
          y2="${e.y+e.height}"
          stroke="black" stroke-width="0.1" />`)}`}function Ie(e,t){let s=[],r=[],o=5;for(;o+5<e.height;)s.push(o),o+=5;let a=0,l=(e.width%5+5)/2;for(;a+l<e.width;)r.push(a+l),a+=5;switch(t){case"blank":return m``;case"dot-grid":return kt(e,s,r);case"dotted-ruled-lines":return m`${kt(e,s,r)}${tt(e,s)}`;case"ruled-lines":return tt(e,s);case"square-graph":return m`${tt(e,s)}
      ${Le(e,r)}`}}function Oe(e,t){return m`
    <rect
      style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:0.1;"
      width="${e.width}"
      height="${e.height}"
      x="${e.x}"
      y="${e.y}"
    />
    ${Ie(e,t)}`}function He(e){return m`<rect style="fill:none;fill-rule:evenodd;"
                   width="${e.width}"
                   height="${e.height}"
                   x="${e.x}"
                   y="${e.y}" />
  <text text-anchor="end"
        x="${e.x+e.width}"
        y="${e.y+e.height}" class="logo">
  PAPERQUIK.com</text>`}function Xt(e,t,i){if(!t)return m``;const n={top:j,right:j,bottom:j,left:j};let{backgroundBox:s,headerBox:r,bodyBox:o,footerBox:a}=ke(t,n);return m`
    <svg
      class="${e?"d-none d-print-block":"preview"}"
      width="${t.width}mm"
      height="${t.height}mm"
      viewBox="0 0 ${t.width} ${t.height}"
      version="1.1"
    >
      <g>
        ${Te(s)}
        ${Ue(r)}
        ${Oe(o,i)}
        ${He(a)}
      </g>
    </svg>`}function ct(e="en",t="long"){const i=new Intl.DateTimeFormat(e,{weekday:t,timeZone:"UTC"});return[1,2,3,4,5,6,7].map(s=>{const r=s<10?`0${s}`:s;return new Date(`2017-01-${r}T00:00:00+00:00`)}).map(s=>i.format(s))}function dt(e="en",t="long"){const i=new Intl.DateTimeFormat(e,{month:t,timeZone:"UTC"});return[1,2,3,4,5,6,7,8,9,10,11,12].map(s=>{const r=s<10?`0${s}`:s;return new Date(`2017-${r}-01T00:00:00+00:00`)}).map(s=>i.format(s))}let ut=navigator.language;console.log(ut);console.log(ct(ut));console.log(dt(ut));console.log(ct("es"));console.log(dt("es"));console.log(ct("fr"));console.log(dt("fr"));const Tt="pq-jumbotron";class Ut extends ${static get it(){return"pq-jumbotron"}static get properties(){return{show:{type:Boolean}}}constructor(){super()}hide(){this.show=!1,window.localStorage.setItem(Tt,"false")}createRenderRoot(){return this}render(){return(window.localStorage.getItem(Tt)??"true")!=="true"?u``:u`<div class="panel jumbotron">
      <h1>The Paper You Need - Available Right Away</h1>
      <p></p>
      <p>
        <button class="btn btn-primary btn-lg" @click="${this.hide}">
          Get Started
        </button>
      </p>
    </div>`}}customElements.define(Ut.it,Ut);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Me={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ne=e=>(...t)=>({_$litDirective$:e,values:t});let qe=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,i,n){this._$Ct=t,this._$AM=i,this._$Ci=n}_$AS(t,i){return this.update(t,i)}update(t,i){return this.render(...i)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Bt="important",je=" !"+Bt,ze=Ne(class extends qe{constructor(e){var t;if(super(e),e.type!==Me.ATTRIBUTE||e.name!=="style"||((t=e.strings)===null||t===void 0?void 0:t.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,i)=>{const n=e[i];return n==null?t:t+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${n};`},"")}update(e,[t]){const{style:i}=e.element;if(this.ht===void 0){this.ht=new Set;for(const n in t)this.ht.add(n);return this.render(t)}this.ht.forEach(n=>{t[n]==null&&(this.ht.delete(n),n.includes("-")?i.removeProperty(n):i[n]="")});for(const n in t){const s=t[n];if(s!=null){this.ht.add(n);const r=typeof s=="string"&&s.endsWith(je);n.includes("-")||r?i.setProperty(n,r?s.slice(0,-11):s,r?Bt:""):i[n]=s}}return S}});class Lt extends ${static get it(){return"pq-step-one"}static get properties(){return{size:{type:String}}}constructor(){super()}createRenderRoot(){return this}paperIconStyle(t){return{width:`${t.width/2.8}px`,height:`${t.height/2.8}px`}}render(){return u`<div class="panel panel-default size-section">
      <div class="panel-heading">
        <h2>1: Pick a paper size</h2>
      </div>
      <div class="panel-body">
        ${Yt.map(t=>u`<a href="/paper/${t.id}">
            <div
              class="paperIcon ${t.id===this.size?"selected":"notSelected"}"
              style="${ze(this.paperIconStyle(t))}"
            >
              <span class="paperName">${t.name}</span>
            </div>
          </a>`)}
      </div>
    </div>`}}customElements.define(Lt.it,Lt);const De=[{id:"blank",name:"Blank"},{id:"dot-grid",name:"Dot Grid"},{id:"dotted-ruled-lines",name:"Dotted Ruled"},{id:"ruled-lines",name:"Ruled Lines"},{id:"square-graph",name:"Square Graph"}];class It extends ${static get it(){return"pq-step-two"}static get properties(){return{size:{type:String},layout:{type:String}}}constructor(){super()}createRenderRoot(){return this}render(){return u` <div class="panel panel-default layout-section">
      <div class="panel-heading">
        <h2>
          2: Pick a layout
          ${this.paperSize?`for ${this.paperSize.name} size paper`:""}
        </h2>
      </div>
      <div class="panel-body">
        ${this.size?u` <div class="layouts-wrapper">
              ${De.map(t=>u`<a href="/paper/${this.size}/${t.id}">
                  <div
                    class="layoutIcon ${t.id===this.layout?"selected":"notSelected"}"
                  >
                    <span class="layoutName">${t.name}</span>
                    <div
                      style="width: 100%; height: 125px; border: 1px solid black; overflow: hidden;"
                    >
                      <img
                        style="position: relative; width: 100%;"
                        src="/img/${t.id}-paper.jpg"
                      />
                    </div>
                  </div>
                </a>`)}
            </div>`:u`<div>
              You must pick a paper size before you pick a layout for your page.
            </div>`}
      </div>
    </div>`}}customElements.define(It.it,It);class Ot extends ${static get it(){return"pq-step-three"}static get properties(){return{size:{type:String},layout:{type:String},paperSize:{type:Object}}}constructor(){super()}printModal(){var t=new bootstrap.Modal(document.getElementById("exampleModal"),{});t.show()}print(){var t=new bootstrap.Modal(document.getElementById("exampleModal"),{});t.hide(),window.print()}createRenderRoot(){return this}modal(){return u` <!-- Modal -->
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">This is my modal body!</div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="${this.print}"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      </div>`}render(){return u` <div class="panel panel-default print-section">
        <div class="panel-heading">
          <h2>3: Print your paper</h2>
        </div>
        <div class="panel-body">
          ${this.size&&this.layout?u`<div class="row">
                <div class="col-md-8 preview">
                  ${Xt(!1,this.paperSize,this.layout)}
                </div>
                <div class="col-md-4">
                  <button
                    class="btn btn-primary btn-block"
                    @click="${this.printModal}"
                  >
                    Print your paper
                  </button>

                  <div id="mc_embed_signup">
                    <form
                      action="http://johnmunsch.us8.list-manage.com/subscribe/post?u=bd3c8c7355797b6633a3503e7&amp;id=e3f181919d"
                      method="post"
                      id="mc-embedded-subscribe-form"
                      name="mc-embedded-subscribe-form"
                      class="validate"
                      target="_blank"
                      novalidate
                    >
                      <label for="mce-EMAIL"
                        >Subscribe to learn when PaperQuik updates</label
                      >
                      <input
                        type="email"
                        value=""
                        name="EMAIL"
                        class="email"
                        id="mce-EMAIL"
                        placeholder="email address"
                        required
                      />
                      <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
                      <div style="position: absolute; left: -5000px;">
                        <input
                          type="text"
                          name="b_bd3c8c7355797b6633a3503e7_e3f181919d"
                          value=""
                        />
                      </div>
                      <div class="clear">
                        <button
                          type="submit"
                          name="subscribe"
                          id="mc-embedded-subscribe"
                          class="btn btn-primary"
                        >
                          Subscribe
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>`:u`<div>
                You must pick a paper size and layout before you can print your
                page.
              </div>`}
        </div>
      </div>
      ${this.modal()}`}}customElements.define(Ot.it,Ot);class Ht extends ${static get it(){return"pq-menu"}static get properties(){return{active:String}}constructor(){super()}createRenderRoot(){return this}render(){return u`<nav class="navbar navbar-expand-lg navbar-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="/paper"
          ><img src="/img/noun_print_3053742.svg" /> PaperQuik</a
        >
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a
                class="nav-link ${this.active==="paper"?"active":""}"
                aria-current="page"
                href="/paper"
                >Home</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link ${this.active==="about"?"active":""}"
                href="/about"
                >About</a
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>`}}customElements.define(Ht.it,Ht);class Mt extends ${static get it(){return"paper-page"}static get properties(){return{layout:{type:String},size:{type:String},showJumbotron:{state:!0,type:Boolean}}}constructor(){super(),this.paperSize=null,this.showJumbotron=!0}createRenderRoot(){return this}willUpdate(t){t.has("size")&&(this.paperSize=Yt.find(i=>i.id===this.size))}render(){return u`<div>
      ${Xt(!0,this.paperSize,this.layout)}
      <pq-menu class="d-print-none" active="paper"></pq-menu>
      <div class="container d-print-none">
        <pq-jumbotron .show="${this.showJumbotron}"></pq-jumbotron>
        <pq-adblock></pq-adblock>

        <pq-step-one .size="${this.size}"></pq-step-one>
        <pq-step-two
          .size="${this.size}"
          .layout="${this.layout}"
        ></pq-step-two>
        <pq-step-three
          .size="${this.size}"
          .layout="${this.layout}"
          .paperSize="${this.paperSize}"
        ></pq-step-three>

        <pq-adblock></pq-adblock>

        <pq-footer></pq-footer>
      </div>
    </div>`}}customElements.define(Mt.it,Mt);class Nt extends ${static get it(){return"paperquik-app"}static get properties(){return{}}constructor(){super(),this.renderer=()=>u``,U("/about",()=>{this.renderer=()=>u`<about-page></about-page>`,this.requestUpdate()}),U("/paper/:size?/:layout?",t=>{this.renderer=()=>u`<paper-page
          .size="${t.params.size}"
          .layout="${t.params.layout}"
        ></paper-page>`,this.requestUpdate()}),U("*","/paper"),U()}createRenderRoot(){return this}render(){return this.renderer()}}customElements.define(Nt.it,Nt);
