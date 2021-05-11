(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = {exports: {}}).exports, mod), mod.exports;
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, {get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable});
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? {get: () => module.default, enumerable: true} : {value: module, enumerable: true})), module);
  };

  // node_modules/page/page.js
  var require_page = __commonJS({
    "node_modules/page/page.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global.page = factory();
      })(exports, function() {
        "use strict";
        var isarray = Array.isArray || function(arr) {
          return Object.prototype.toString.call(arr) == "[object Array]";
        };
        var pathToRegexp_1 = pathToRegexp;
        var parse_1 = parse;
        var compile_1 = compile;
        var tokensToFunction_1 = tokensToFunction;
        var tokensToRegExp_1 = tokensToRegExp;
        var PATH_REGEXP = new RegExp([
          "(\\\\.)",
          "([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))"
        ].join("|"), "g");
        function parse(str) {
          var tokens = [];
          var key = 0;
          var index = 0;
          var path = "";
          var res;
          while ((res = PATH_REGEXP.exec(str)) != null) {
            var m2 = res[0];
            var escaped = res[1];
            var offset = res.index;
            path += str.slice(index, offset);
            index = offset + m2.length;
            if (escaped) {
              path += escaped[1];
              continue;
            }
            if (path) {
              tokens.push(path);
              path = "";
            }
            var prefix = res[2];
            var name = res[3];
            var capture = res[4];
            var group = res[5];
            var suffix = res[6];
            var asterisk = res[7];
            var repeat = suffix === "+" || suffix === "*";
            var optional = suffix === "?" || suffix === "*";
            var delimiter = prefix || "/";
            var pattern = capture || group || (asterisk ? ".*" : "[^" + delimiter + "]+?");
            tokens.push({
              name: name || key++,
              prefix: prefix || "",
              delimiter,
              optional,
              repeat,
              pattern: escapeGroup(pattern)
            });
          }
          if (index < str.length) {
            path += str.substr(index);
          }
          if (path) {
            tokens.push(path);
          }
          return tokens;
        }
        function compile(str) {
          return tokensToFunction(parse(str));
        }
        function tokensToFunction(tokens) {
          var matches = new Array(tokens.length);
          for (var i4 = 0; i4 < tokens.length; i4++) {
            if (typeof tokens[i4] === "object") {
              matches[i4] = new RegExp("^" + tokens[i4].pattern + "$");
            }
          }
          return function(obj) {
            var path = "";
            var data = obj || {};
            for (var i5 = 0; i5 < tokens.length; i5++) {
              var token = tokens[i5];
              if (typeof token === "string") {
                path += token;
                continue;
              }
              var value = data[token.name];
              var segment;
              if (value == null) {
                if (token.optional) {
                  continue;
                } else {
                  throw new TypeError('Expected "' + token.name + '" to be defined');
                }
              }
              if (isarray(value)) {
                if (!token.repeat) {
                  throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"');
                }
                if (value.length === 0) {
                  if (token.optional) {
                    continue;
                  } else {
                    throw new TypeError('Expected "' + token.name + '" to not be empty');
                  }
                }
                for (var j = 0; j < value.length; j++) {
                  segment = encodeURIComponent(value[j]);
                  if (!matches[i5].test(segment)) {
                    throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"');
                  }
                  path += (j === 0 ? token.prefix : token.delimiter) + segment;
                }
                continue;
              }
              segment = encodeURIComponent(value);
              if (!matches[i5].test(segment)) {
                throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"');
              }
              path += token.prefix + segment;
            }
            return path;
          };
        }
        function escapeString(str) {
          return str.replace(/([.+*?=^!:${}()[\]|\/])/g, "\\$1");
        }
        function escapeGroup(group) {
          return group.replace(/([=!:$\/()])/g, "\\$1");
        }
        function attachKeys(re, keys) {
          re.keys = keys;
          return re;
        }
        function flags(options) {
          return options.sensitive ? "" : "i";
        }
        function regexpToRegexp(path, keys) {
          var groups = path.source.match(/\((?!\?)/g);
          if (groups) {
            for (var i4 = 0; i4 < groups.length; i4++) {
              keys.push({
                name: i4,
                prefix: null,
                delimiter: null,
                optional: false,
                repeat: false,
                pattern: null
              });
            }
          }
          return attachKeys(path, keys);
        }
        function arrayToRegexp(path, keys, options) {
          var parts = [];
          for (var i4 = 0; i4 < path.length; i4++) {
            parts.push(pathToRegexp(path[i4], keys, options).source);
          }
          var regexp = new RegExp("(?:" + parts.join("|") + ")", flags(options));
          return attachKeys(regexp, keys);
        }
        function stringToRegexp(path, keys, options) {
          var tokens = parse(path);
          var re = tokensToRegExp(tokens, options);
          for (var i4 = 0; i4 < tokens.length; i4++) {
            if (typeof tokens[i4] !== "string") {
              keys.push(tokens[i4]);
            }
          }
          return attachKeys(re, keys);
        }
        function tokensToRegExp(tokens, options) {
          options = options || {};
          var strict = options.strict;
          var end = options.end !== false;
          var route = "";
          var lastToken = tokens[tokens.length - 1];
          var endsWithSlash = typeof lastToken === "string" && /\/$/.test(lastToken);
          for (var i4 = 0; i4 < tokens.length; i4++) {
            var token = tokens[i4];
            if (typeof token === "string") {
              route += escapeString(token);
            } else {
              var prefix = escapeString(token.prefix);
              var capture = token.pattern;
              if (token.repeat) {
                capture += "(?:" + prefix + capture + ")*";
              }
              if (token.optional) {
                if (prefix) {
                  capture = "(?:" + prefix + "(" + capture + "))?";
                } else {
                  capture = "(" + capture + ")?";
                }
              } else {
                capture = prefix + "(" + capture + ")";
              }
              route += capture;
            }
          }
          if (!strict) {
            route = (endsWithSlash ? route.slice(0, -2) : route) + "(?:\\/(?=$))?";
          }
          if (end) {
            route += "$";
          } else {
            route += strict && endsWithSlash ? "" : "(?=\\/|$)";
          }
          return new RegExp("^" + route, flags(options));
        }
        function pathToRegexp(path, keys, options) {
          keys = keys || [];
          if (!isarray(keys)) {
            options = keys;
            keys = [];
          } else if (!options) {
            options = {};
          }
          if (path instanceof RegExp) {
            return regexpToRegexp(path, keys, options);
          }
          if (isarray(path)) {
            return arrayToRegexp(path, keys, options);
          }
          return stringToRegexp(path, keys, options);
        }
        pathToRegexp_1.parse = parse_1;
        pathToRegexp_1.compile = compile_1;
        pathToRegexp_1.tokensToFunction = tokensToFunction_1;
        pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;
        var hasDocument = typeof document !== "undefined";
        var hasWindow = typeof window !== "undefined";
        var hasHistory = typeof history !== "undefined";
        var hasProcess = typeof process !== "undefined";
        var clickEvent = hasDocument && document.ontouchstart ? "touchstart" : "click";
        var isLocation = hasWindow && !!(window.history.location || window.location);
        function Page() {
          this.callbacks = [];
          this.exits = [];
          this.current = "";
          this.len = 0;
          this._decodeURLComponents = true;
          this._base = "";
          this._strict = false;
          this._running = false;
          this._hashbang = false;
          this.clickHandler = this.clickHandler.bind(this);
          this._onpopstate = this._onpopstate.bind(this);
        }
        Page.prototype.configure = function(options) {
          var opts = options || {};
          this._window = opts.window || hasWindow && window;
          this._decodeURLComponents = opts.decodeURLComponents !== false;
          this._popstate = opts.popstate !== false && hasWindow;
          this._click = opts.click !== false && hasDocument;
          this._hashbang = !!opts.hashbang;
          var _window = this._window;
          if (this._popstate) {
            _window.addEventListener("popstate", this._onpopstate, false);
          } else if (hasWindow) {
            _window.removeEventListener("popstate", this._onpopstate, false);
          }
          if (this._click) {
            _window.document.addEventListener(clickEvent, this.clickHandler, false);
          } else if (hasDocument) {
            _window.document.removeEventListener(clickEvent, this.clickHandler, false);
          }
          if (this._hashbang && hasWindow && !hasHistory) {
            _window.addEventListener("hashchange", this._onpopstate, false);
          } else if (hasWindow) {
            _window.removeEventListener("hashchange", this._onpopstate, false);
          }
        };
        Page.prototype.base = function(path) {
          if (arguments.length === 0)
            return this._base;
          this._base = path;
        };
        Page.prototype._getBase = function() {
          var base = this._base;
          if (!!base)
            return base;
          var loc = hasWindow && this._window && this._window.location;
          if (hasWindow && this._hashbang && loc && loc.protocol === "file:") {
            base = loc.pathname;
          }
          return base;
        };
        Page.prototype.strict = function(enable) {
          if (arguments.length === 0)
            return this._strict;
          this._strict = enable;
        };
        Page.prototype.start = function(options) {
          var opts = options || {};
          this.configure(opts);
          if (opts.dispatch === false)
            return;
          this._running = true;
          var url;
          if (isLocation) {
            var window2 = this._window;
            var loc = window2.location;
            if (this._hashbang && ~loc.hash.indexOf("#!")) {
              url = loc.hash.substr(2) + loc.search;
            } else if (this._hashbang) {
              url = loc.search + loc.hash;
            } else {
              url = loc.pathname + loc.search + loc.hash;
            }
          }
          this.replace(url, null, true, opts.dispatch);
        };
        Page.prototype.stop = function() {
          if (!this._running)
            return;
          this.current = "";
          this.len = 0;
          this._running = false;
          var window2 = this._window;
          this._click && window2.document.removeEventListener(clickEvent, this.clickHandler, false);
          hasWindow && window2.removeEventListener("popstate", this._onpopstate, false);
          hasWindow && window2.removeEventListener("hashchange", this._onpopstate, false);
        };
        Page.prototype.show = function(path, state, dispatch, push) {
          var ctx = new Context(path, state, this), prev = this.prevContext;
          this.prevContext = ctx;
          this.current = ctx.path;
          if (dispatch !== false)
            this.dispatch(ctx, prev);
          if (ctx.handled !== false && push !== false)
            ctx.pushState();
          return ctx;
        };
        Page.prototype.back = function(path, state) {
          var page3 = this;
          if (this.len > 0) {
            var window2 = this._window;
            hasHistory && window2.history.back();
            this.len--;
          } else if (path) {
            setTimeout(function() {
              page3.show(path, state);
            });
          } else {
            setTimeout(function() {
              page3.show(page3._getBase(), state);
            });
          }
        };
        Page.prototype.redirect = function(from, to) {
          var inst = this;
          if (typeof from === "string" && typeof to === "string") {
            page2.call(this, from, function(e4) {
              setTimeout(function() {
                inst.replace(to);
              }, 0);
            });
          }
          if (typeof from === "string" && typeof to === "undefined") {
            setTimeout(function() {
              inst.replace(from);
            }, 0);
          }
        };
        Page.prototype.replace = function(path, state, init, dispatch) {
          var ctx = new Context(path, state, this), prev = this.prevContext;
          this.prevContext = ctx;
          this.current = ctx.path;
          ctx.init = init;
          ctx.save();
          if (dispatch !== false)
            this.dispatch(ctx, prev);
          return ctx;
        };
        Page.prototype.dispatch = function(ctx, prev) {
          var i4 = 0, j = 0, page3 = this;
          function nextExit() {
            var fn = page3.exits[j++];
            if (!fn)
              return nextEnter();
            fn(prev, nextExit);
          }
          function nextEnter() {
            var fn = page3.callbacks[i4++];
            if (ctx.path !== page3.current) {
              ctx.handled = false;
              return;
            }
            if (!fn)
              return unhandled.call(page3, ctx);
            fn(ctx, nextEnter);
          }
          if (prev) {
            nextExit();
          } else {
            nextEnter();
          }
        };
        Page.prototype.exit = function(path, fn) {
          if (typeof path === "function") {
            return this.exit("*", path);
          }
          var route = new Route(path, null, this);
          for (var i4 = 1; i4 < arguments.length; ++i4) {
            this.exits.push(route.middleware(arguments[i4]));
          }
        };
        Page.prototype.clickHandler = function(e4) {
          if (this._which(e4) !== 1)
            return;
          if (e4.metaKey || e4.ctrlKey || e4.shiftKey)
            return;
          if (e4.defaultPrevented)
            return;
          var el = e4.target;
          var eventPath = e4.path || (e4.composedPath ? e4.composedPath() : null);
          if (eventPath) {
            for (var i4 = 0; i4 < eventPath.length; i4++) {
              if (!eventPath[i4].nodeName)
                continue;
              if (eventPath[i4].nodeName.toUpperCase() !== "A")
                continue;
              if (!eventPath[i4].href)
                continue;
              el = eventPath[i4];
              break;
            }
          }
          while (el && el.nodeName.toUpperCase() !== "A")
            el = el.parentNode;
          if (!el || el.nodeName.toUpperCase() !== "A")
            return;
          var svg = typeof el.href === "object" && el.href.constructor.name === "SVGAnimatedString";
          if (el.hasAttribute("download") || el.getAttribute("rel") === "external")
            return;
          var link = el.getAttribute("href");
          if (!this._hashbang && this._samePath(el) && (el.hash || link === "#"))
            return;
          if (link && link.indexOf("mailto:") > -1)
            return;
          if (svg ? el.target.baseVal : el.target)
            return;
          if (!svg && !this.sameOrigin(el.href))
            return;
          var path = svg ? el.href.baseVal : el.pathname + el.search + (el.hash || "");
          path = path[0] !== "/" ? "/" + path : path;
          if (hasProcess && path.match(/^\/[a-zA-Z]:\//)) {
            path = path.replace(/^\/[a-zA-Z]:\//, "/");
          }
          var orig = path;
          var pageBase = this._getBase();
          if (path.indexOf(pageBase) === 0) {
            path = path.substr(pageBase.length);
          }
          if (this._hashbang)
            path = path.replace("#!", "");
          if (pageBase && orig === path && (!isLocation || this._window.location.protocol !== "file:")) {
            return;
          }
          e4.preventDefault();
          this.show(orig);
        };
        Page.prototype._onpopstate = function() {
          var loaded = false;
          if (!hasWindow) {
            return function() {
            };
          }
          if (hasDocument && document.readyState === "complete") {
            loaded = true;
          } else {
            window.addEventListener("load", function() {
              setTimeout(function() {
                loaded = true;
              }, 0);
            });
          }
          return function onpopstate(e4) {
            if (!loaded)
              return;
            var page3 = this;
            if (e4.state) {
              var path = e4.state.path;
              page3.replace(path, e4.state);
            } else if (isLocation) {
              var loc = page3._window.location;
              page3.show(loc.pathname + loc.search + loc.hash, void 0, void 0, false);
            }
          };
        }();
        Page.prototype._which = function(e4) {
          e4 = e4 || hasWindow && this._window.event;
          return e4.which == null ? e4.button : e4.which;
        };
        Page.prototype._toURL = function(href) {
          var window2 = this._window;
          if (typeof URL === "function" && isLocation) {
            return new URL(href, window2.location.toString());
          } else if (hasDocument) {
            var anc = window2.document.createElement("a");
            anc.href = href;
            return anc;
          }
        };
        Page.prototype.sameOrigin = function(href) {
          if (!href || !isLocation)
            return false;
          var url = this._toURL(href);
          var window2 = this._window;
          var loc = window2.location;
          return loc.protocol === url.protocol && loc.hostname === url.hostname && (loc.port === url.port || loc.port === "" && (url.port == 80 || url.port == 443));
        };
        Page.prototype._samePath = function(url) {
          if (!isLocation)
            return false;
          var window2 = this._window;
          var loc = window2.location;
          return url.pathname === loc.pathname && url.search === loc.search;
        };
        Page.prototype._decodeURLEncodedURIComponent = function(val) {
          if (typeof val !== "string") {
            return val;
          }
          return this._decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, " ")) : val;
        };
        function createPage() {
          var pageInstance = new Page();
          function pageFn() {
            return page2.apply(pageInstance, arguments);
          }
          pageFn.callbacks = pageInstance.callbacks;
          pageFn.exits = pageInstance.exits;
          pageFn.base = pageInstance.base.bind(pageInstance);
          pageFn.strict = pageInstance.strict.bind(pageInstance);
          pageFn.start = pageInstance.start.bind(pageInstance);
          pageFn.stop = pageInstance.stop.bind(pageInstance);
          pageFn.show = pageInstance.show.bind(pageInstance);
          pageFn.back = pageInstance.back.bind(pageInstance);
          pageFn.redirect = pageInstance.redirect.bind(pageInstance);
          pageFn.replace = pageInstance.replace.bind(pageInstance);
          pageFn.dispatch = pageInstance.dispatch.bind(pageInstance);
          pageFn.exit = pageInstance.exit.bind(pageInstance);
          pageFn.configure = pageInstance.configure.bind(pageInstance);
          pageFn.sameOrigin = pageInstance.sameOrigin.bind(pageInstance);
          pageFn.clickHandler = pageInstance.clickHandler.bind(pageInstance);
          pageFn.create = createPage;
          Object.defineProperty(pageFn, "len", {
            get: function() {
              return pageInstance.len;
            },
            set: function(val) {
              pageInstance.len = val;
            }
          });
          Object.defineProperty(pageFn, "current", {
            get: function() {
              return pageInstance.current;
            },
            set: function(val) {
              pageInstance.current = val;
            }
          });
          pageFn.Context = Context;
          pageFn.Route = Route;
          return pageFn;
        }
        function page2(path, fn) {
          if (typeof path === "function") {
            return page2.call(this, "*", path);
          }
          if (typeof fn === "function") {
            var route = new Route(path, null, this);
            for (var i4 = 1; i4 < arguments.length; ++i4) {
              this.callbacks.push(route.middleware(arguments[i4]));
            }
          } else if (typeof path === "string") {
            this[typeof fn === "string" ? "redirect" : "show"](path, fn);
          } else {
            this.start(path);
          }
        }
        function unhandled(ctx) {
          if (ctx.handled)
            return;
          var current;
          var page3 = this;
          var window2 = page3._window;
          if (page3._hashbang) {
            current = isLocation && this._getBase() + window2.location.hash.replace("#!", "");
          } else {
            current = isLocation && window2.location.pathname + window2.location.search;
          }
          if (current === ctx.canonicalPath)
            return;
          page3.stop();
          ctx.handled = false;
          isLocation && (window2.location.href = ctx.canonicalPath);
        }
        function escapeRegExp(s5) {
          return s5.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
        }
        function Context(path, state, pageInstance) {
          var _page = this.page = pageInstance || page2;
          var window2 = _page._window;
          var hashbang = _page._hashbang;
          var pageBase = _page._getBase();
          if (path[0] === "/" && path.indexOf(pageBase) !== 0)
            path = pageBase + (hashbang ? "#!" : "") + path;
          var i4 = path.indexOf("?");
          this.canonicalPath = path;
          var re = new RegExp("^" + escapeRegExp(pageBase));
          this.path = path.replace(re, "") || "/";
          if (hashbang)
            this.path = this.path.replace("#!", "") || "/";
          this.title = hasDocument && window2.document.title;
          this.state = state || {};
          this.state.path = path;
          this.querystring = ~i4 ? _page._decodeURLEncodedURIComponent(path.slice(i4 + 1)) : "";
          this.pathname = _page._decodeURLEncodedURIComponent(~i4 ? path.slice(0, i4) : path);
          this.params = {};
          this.hash = "";
          if (!hashbang) {
            if (!~this.path.indexOf("#"))
              return;
            var parts = this.path.split("#");
            this.path = this.pathname = parts[0];
            this.hash = _page._decodeURLEncodedURIComponent(parts[1]) || "";
            this.querystring = this.querystring.split("#")[0];
          }
        }
        Context.prototype.pushState = function() {
          var page3 = this.page;
          var window2 = page3._window;
          var hashbang = page3._hashbang;
          page3.len++;
          if (hasHistory) {
            window2.history.pushState(this.state, this.title, hashbang && this.path !== "/" ? "#!" + this.path : this.canonicalPath);
          }
        };
        Context.prototype.save = function() {
          var page3 = this.page;
          if (hasHistory) {
            page3._window.history.replaceState(this.state, this.title, page3._hashbang && this.path !== "/" ? "#!" + this.path : this.canonicalPath);
          }
        };
        function Route(path, options, page3) {
          var _page = this.page = page3 || globalPage;
          var opts = options || {};
          opts.strict = opts.strict || _page._strict;
          this.path = path === "*" ? "(.*)" : path;
          this.method = "GET";
          this.regexp = pathToRegexp_1(this.path, this.keys = [], opts);
        }
        Route.prototype.middleware = function(fn) {
          var self = this;
          return function(ctx, next) {
            if (self.match(ctx.path, ctx.params)) {
              ctx.routePath = self.path;
              return fn(ctx, next);
            }
            next();
          };
        };
        Route.prototype.match = function(path, params) {
          var keys = this.keys, qsIndex = path.indexOf("?"), pathname = ~qsIndex ? path.slice(0, qsIndex) : path, m2 = this.regexp.exec(decodeURIComponent(pathname));
          if (!m2)
            return false;
          delete params[0];
          for (var i4 = 1, len = m2.length; i4 < len; ++i4) {
            var key = keys[i4 - 1];
            var val = this.page._decodeURLEncodedURIComponent(m2[i4]);
            if (val !== void 0 || !hasOwnProperty.call(params, key.name)) {
              params[key.name] = val;
            }
          }
          return true;
        };
        var globalPage = createPage();
        var page_js = globalPage;
        var default_1 = globalPage;
        page_js.default = default_1;
        return page_js;
      });
    }
  });

  // node_modules/@lit/reactive-element/css-tag.js
  var t = window.ShadowRoot && (window.ShadyCSS === void 0 || window.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
  var e = Symbol();
  var s = class {
    constructor(t3, s5) {
      if (s5 !== e)
        throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = t3;
    }
    get styleSheet() {
      return t && this.t === void 0 && (this.t = new CSSStyleSheet(), this.t.replaceSync(this.cssText)), this.t;
    }
    toString() {
      return this.cssText;
    }
  };
  var n = new Map();
  var o = (t3) => {
    let o5 = n.get(t3);
    return o5 === void 0 && n.set(t3, o5 = new s(t3, e)), o5;
  };
  var r = (t3) => o(typeof t3 == "string" ? t3 : t3 + "");
  var i = (t3, ...e4) => {
    const n5 = t3.length === 1 ? t3[0] : e4.reduce((e5, n6, o5) => e5 + ((t4) => {
      if (t4 instanceof s)
        return t4.cssText;
      if (typeof t4 == "number")
        return t4;
      throw Error("Value passed to 'css' function must be a 'css' function result: " + t4 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
    })(n6) + t3[o5 + 1], t3[0]);
    return o(n5);
  };
  var S = (e4, s5) => {
    t ? e4.adoptedStyleSheets = s5.map((t3) => t3 instanceof CSSStyleSheet ? t3 : t3.styleSheet) : s5.forEach((t3) => {
      const s6 = document.createElement("style");
      s6.textContent = t3.cssText, e4.appendChild(s6);
    });
  };
  var u = t ? (t3) => t3 : (t3) => t3 instanceof CSSStyleSheet ? ((t4) => {
    let e4 = "";
    for (const s5 of t4.cssRules)
      e4 += s5.cssText;
    return r(e4);
  })(t3) : t3;

  // node_modules/@lit/reactive-element/reactive-element.js
  var s2;
  var e2;
  var h;
  var r2;
  var o2 = {toAttribute(t3, i4) {
    switch (i4) {
      case Boolean:
        t3 = t3 ? "" : null;
        break;
      case Object:
      case Array:
        t3 = t3 == null ? t3 : JSON.stringify(t3);
    }
    return t3;
  }, fromAttribute(t3, i4) {
    let s5 = t3;
    switch (i4) {
      case Boolean:
        s5 = t3 !== null;
        break;
      case Number:
        s5 = t3 === null ? null : Number(t3);
        break;
      case Object:
      case Array:
        try {
          s5 = JSON.parse(t3);
        } catch (t4) {
          s5 = null;
        }
    }
    return s5;
  }};
  var n2 = (t3, i4) => i4 !== t3 && (i4 == i4 || t3 == t3);
  var l = {attribute: true, type: String, converter: o2, reflect: false, hasChanged: n2};
  var a = class extends HTMLElement {
    constructor() {
      super(), this.\u03A0i = new Map(), this.\u03A0o = void 0, this.\u03A0l = void 0, this.isUpdatePending = false, this.hasUpdated = false, this.\u03A0h = null, this.u();
    }
    static addInitializer(t3) {
      var i4;
      (i4 = this.v) !== null && i4 !== void 0 || (this.v = []), this.v.push(t3);
    }
    static get observedAttributes() {
      this.finalize();
      const t3 = [];
      return this.elementProperties.forEach((i4, s5) => {
        const e4 = this.\u03A0p(s5, i4);
        e4 !== void 0 && (this.\u03A0m.set(e4, s5), t3.push(e4));
      }), t3;
    }
    static createProperty(t3, i4 = l) {
      if (i4.state && (i4.attribute = false), this.finalize(), this.elementProperties.set(t3, i4), !i4.noAccessor && !this.prototype.hasOwnProperty(t3)) {
        const s5 = typeof t3 == "symbol" ? Symbol() : "__" + t3, e4 = this.getPropertyDescriptor(t3, s5, i4);
        e4 !== void 0 && Object.defineProperty(this.prototype, t3, e4);
      }
    }
    static getPropertyDescriptor(t3, i4, s5) {
      return {get() {
        return this[i4];
      }, set(e4) {
        const h4 = this[t3];
        this[i4] = e4, this.requestUpdate(t3, h4, s5);
      }, configurable: true, enumerable: true};
    }
    static getPropertyOptions(t3) {
      return this.elementProperties.get(t3) || l;
    }
    static finalize() {
      if (this.hasOwnProperty("finalized"))
        return false;
      this.finalized = true;
      const t3 = Object.getPrototypeOf(this);
      if (t3.finalize(), this.elementProperties = new Map(t3.elementProperties), this.\u03A0m = new Map(), this.hasOwnProperty("properties")) {
        const t4 = this.properties, i4 = [...Object.getOwnPropertyNames(t4), ...Object.getOwnPropertySymbols(t4)];
        for (const s5 of i4)
          this.createProperty(s5, t4[s5]);
      }
      return this.elementStyles = this.finalizeStyles(this.styles), true;
    }
    static finalizeStyles(i4) {
      const s5 = [];
      if (Array.isArray(i4)) {
        const e4 = new Set(i4.flat(1 / 0).reverse());
        for (const i5 of e4)
          s5.unshift(u(i5));
      } else
        i4 !== void 0 && s5.push(u(i4));
      return s5;
    }
    static \u03A0p(t3, i4) {
      const s5 = i4.attribute;
      return s5 === false ? void 0 : typeof s5 == "string" ? s5 : typeof t3 == "string" ? t3.toLowerCase() : void 0;
    }
    u() {
      var t3;
      this.\u03A0g = new Promise((t4) => this.enableUpdating = t4), this.L = new Map(), this.\u03A0_(), this.requestUpdate(), (t3 = this.constructor.v) === null || t3 === void 0 || t3.forEach((t4) => t4(this));
    }
    addController(t3) {
      var i4, s5;
      ((i4 = this.\u03A0U) !== null && i4 !== void 0 ? i4 : this.\u03A0U = []).push(t3), this.renderRoot !== void 0 && this.isConnected && ((s5 = t3.hostConnected) === null || s5 === void 0 || s5.call(t3));
    }
    removeController(t3) {
      var i4;
      (i4 = this.\u03A0U) === null || i4 === void 0 || i4.splice(this.\u03A0U.indexOf(t3) >>> 0, 1);
    }
    \u03A0_() {
      this.constructor.elementProperties.forEach((t3, i4) => {
        this.hasOwnProperty(i4) && (this.\u03A0i.set(i4, this[i4]), delete this[i4]);
      });
    }
    createRenderRoot() {
      var t3;
      const s5 = (t3 = this.shadowRoot) !== null && t3 !== void 0 ? t3 : this.attachShadow(this.constructor.shadowRootOptions);
      return S(s5, this.constructor.elementStyles), s5;
    }
    connectedCallback() {
      var t3;
      this.renderRoot === void 0 && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (t3 = this.\u03A0U) === null || t3 === void 0 || t3.forEach((t4) => {
        var i4;
        return (i4 = t4.hostConnected) === null || i4 === void 0 ? void 0 : i4.call(t4);
      }), this.\u03A0l && (this.\u03A0l(), this.\u03A0o = this.\u03A0l = void 0);
    }
    enableUpdating(t3) {
    }
    disconnectedCallback() {
      var t3;
      (t3 = this.\u03A0U) === null || t3 === void 0 || t3.forEach((t4) => {
        var i4;
        return (i4 = t4.hostDisconnected) === null || i4 === void 0 ? void 0 : i4.call(t4);
      }), this.\u03A0o = new Promise((t4) => this.\u03A0l = t4);
    }
    attributeChangedCallback(t3, i4, s5) {
      this.K(t3, s5);
    }
    \u03A0j(t3, i4, s5 = l) {
      var e4, h4;
      const r4 = this.constructor.\u03A0p(t3, s5);
      if (r4 !== void 0 && s5.reflect === true) {
        const n5 = ((h4 = (e4 = s5.converter) === null || e4 === void 0 ? void 0 : e4.toAttribute) !== null && h4 !== void 0 ? h4 : o2.toAttribute)(i4, s5.type);
        this.\u03A0h = t3, n5 == null ? this.removeAttribute(r4) : this.setAttribute(r4, n5), this.\u03A0h = null;
      }
    }
    K(t3, i4) {
      var s5, e4, h4;
      const r4 = this.constructor, n5 = r4.\u03A0m.get(t3);
      if (n5 !== void 0 && this.\u03A0h !== n5) {
        const t4 = r4.getPropertyOptions(n5), l4 = t4.converter, a4 = (h4 = (e4 = (s5 = l4) === null || s5 === void 0 ? void 0 : s5.fromAttribute) !== null && e4 !== void 0 ? e4 : typeof l4 == "function" ? l4 : null) !== null && h4 !== void 0 ? h4 : o2.fromAttribute;
        this.\u03A0h = n5, this[n5] = a4(i4, t4.type), this.\u03A0h = null;
      }
    }
    requestUpdate(t3, i4, s5) {
      let e4 = true;
      t3 !== void 0 && (((s5 = s5 || this.constructor.getPropertyOptions(t3)).hasChanged || n2)(this[t3], i4) ? (this.L.has(t3) || this.L.set(t3, i4), s5.reflect === true && this.\u03A0h !== t3 && (this.\u03A0k === void 0 && (this.\u03A0k = new Map()), this.\u03A0k.set(t3, s5))) : e4 = false), !this.isUpdatePending && e4 && (this.\u03A0g = this.\u03A0q());
    }
    async \u03A0q() {
      this.isUpdatePending = true;
      try {
        for (await this.\u03A0g; this.\u03A0o; )
          await this.\u03A0o;
      } catch (t4) {
        Promise.reject(t4);
      }
      const t3 = this.performUpdate();
      return t3 != null && await t3, !this.isUpdatePending;
    }
    performUpdate() {
      var t3;
      if (!this.isUpdatePending)
        return;
      this.hasUpdated, this.\u03A0i && (this.\u03A0i.forEach((t4, i5) => this[i5] = t4), this.\u03A0i = void 0);
      let i4 = false;
      const s5 = this.L;
      try {
        i4 = this.shouldUpdate(s5), i4 ? (this.willUpdate(s5), (t3 = this.\u03A0U) === null || t3 === void 0 || t3.forEach((t4) => {
          var i5;
          return (i5 = t4.hostUpdate) === null || i5 === void 0 ? void 0 : i5.call(t4);
        }), this.update(s5)) : this.\u03A0$();
      } catch (t4) {
        throw i4 = false, this.\u03A0$(), t4;
      }
      i4 && this.E(s5);
    }
    willUpdate(t3) {
    }
    E(t3) {
      var i4;
      (i4 = this.\u03A0U) === null || i4 === void 0 || i4.forEach((t4) => {
        var i5;
        return (i5 = t4.hostUpdated) === null || i5 === void 0 ? void 0 : i5.call(t4);
      }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t3)), this.updated(t3);
    }
    \u03A0$() {
      this.L = new Map(), this.isUpdatePending = false;
    }
    get updateComplete() {
      return this.getUpdateComplete();
    }
    getUpdateComplete() {
      return this.\u03A0g;
    }
    shouldUpdate(t3) {
      return true;
    }
    update(t3) {
      this.\u03A0k !== void 0 && (this.\u03A0k.forEach((t4, i4) => this.\u03A0j(i4, this[i4], t4)), this.\u03A0k = void 0), this.\u03A0$();
    }
    updated(t3) {
    }
    firstUpdated(t3) {
    }
  };
  a.finalized = true, a.elementProperties = new Map(), a.elementStyles = [], a.shadowRootOptions = {mode: "open"}, (e2 = (s2 = globalThis).reactiveElementPlatformSupport) === null || e2 === void 0 || e2.call(s2, {ReactiveElement: a}), ((h = (r2 = globalThis).reactiveElementVersions) !== null && h !== void 0 ? h : r2.reactiveElementVersions = []).push("1.0.0-rc.2");

  // node_modules/lit-html/lit-html.js
  var t2;
  var i2;
  var s3;
  var e3;
  var o3 = globalThis.trustedTypes;
  var l2 = o3 ? o3.createPolicy("lit-html", {createHTML: (t3) => t3}) : void 0;
  var n3 = `lit$${(Math.random() + "").slice(9)}$`;
  var h2 = "?" + n3;
  var r3 = `<${h2}>`;
  var u2 = document;
  var c = (t3 = "") => u2.createComment(t3);
  var d = (t3) => t3 === null || typeof t3 != "object" && typeof t3 != "function";
  var v = Array.isArray;
  var a2 = (t3) => {
    var i4;
    return v(t3) || typeof ((i4 = t3) === null || i4 === void 0 ? void 0 : i4[Symbol.iterator]) == "function";
  };
  var f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
  var _ = /-->/g;
  var m = />/g;
  var p = />|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g;
  var $ = /'/g;
  var g = /"/g;
  var y = /^(?:script|style|textarea)$/i;
  var b = (t3) => (i4, ...s5) => ({_$litType$: t3, strings: i4, values: s5});
  var T = b(1);
  var x = b(2);
  var w = Symbol.for("lit-noChange");
  var A = Symbol.for("lit-nothing");
  var P = new WeakMap();
  var V = (t3, i4, s5) => {
    var e4, o5;
    const l4 = (e4 = s5 == null ? void 0 : s5.renderBefore) !== null && e4 !== void 0 ? e4 : i4;
    let n5 = l4._$litPart$;
    if (n5 === void 0) {
      const t4 = (o5 = s5 == null ? void 0 : s5.renderBefore) !== null && o5 !== void 0 ? o5 : null;
      l4._$litPart$ = n5 = new C(i4.insertBefore(c(), t4), t4, void 0, s5);
    }
    return n5.I(t3), n5;
  };
  var E = u2.createTreeWalker(u2, 129, null, false);
  var M = (t3, i4) => {
    const s5 = t3.length - 1, e4 = [];
    let o5, h4 = i4 === 2 ? "<svg>" : "", u3 = f;
    for (let i5 = 0; i5 < s5; i5++) {
      const s6 = t3[i5];
      let l4, c3, d2 = -1, v2 = 0;
      for (; v2 < s6.length && (u3.lastIndex = v2, c3 = u3.exec(s6), c3 !== null); )
        v2 = u3.lastIndex, u3 === f ? c3[1] === "!--" ? u3 = _ : c3[1] !== void 0 ? u3 = m : c3[2] !== void 0 ? (y.test(c3[2]) && (o5 = RegExp("</" + c3[2], "g")), u3 = p) : c3[3] !== void 0 && (u3 = p) : u3 === p ? c3[0] === ">" ? (u3 = o5 != null ? o5 : f, d2 = -1) : c3[1] === void 0 ? d2 = -2 : (d2 = u3.lastIndex - c3[2].length, l4 = c3[1], u3 = c3[3] === void 0 ? p : c3[3] === '"' ? g : $) : u3 === g || u3 === $ ? u3 = p : u3 === _ || u3 === m ? u3 = f : (u3 = p, o5 = void 0);
      const a4 = u3 === p && t3[i5 + 1].startsWith("/>") ? " " : "";
      h4 += u3 === f ? s6 + r3 : d2 >= 0 ? (e4.push(l4), s6.slice(0, d2) + "$lit$" + s6.slice(d2) + n3 + a4) : s6 + n3 + (d2 === -2 ? (e4.push(void 0), i5) : a4);
    }
    const c2 = h4 + (t3[s5] || "<?>") + (i4 === 2 ? "</svg>" : "");
    return [l2 !== void 0 ? l2.createHTML(c2) : c2, e4];
  };
  var N = class {
    constructor({strings: t3, _$litType$: i4}, s5) {
      let e4;
      this.parts = [];
      let l4 = 0, r4 = 0;
      const u3 = t3.length - 1, d2 = this.parts, [v2, a4] = M(t3, i4);
      if (this.el = N.createElement(v2, s5), E.currentNode = this.el.content, i4 === 2) {
        const t4 = this.el.content, i5 = t4.firstChild;
        i5.remove(), t4.append(...i5.childNodes);
      }
      for (; (e4 = E.nextNode()) !== null && d2.length < u3; ) {
        if (e4.nodeType === 1) {
          if (e4.hasAttributes()) {
            const t4 = [];
            for (const i5 of e4.getAttributeNames())
              if (i5.endsWith("$lit$") || i5.startsWith(n3)) {
                const s6 = a4[r4++];
                if (t4.push(i5), s6 !== void 0) {
                  const t5 = e4.getAttribute(s6.toLowerCase() + "$lit$").split(n3), i6 = /([.?@])?(.*)/.exec(s6);
                  d2.push({type: 1, index: l4, name: i6[2], strings: t5, ctor: i6[1] === "." ? I : i6[1] === "?" ? L : i6[1] === "@" ? R : H});
                } else
                  d2.push({type: 6, index: l4});
              }
            for (const i5 of t4)
              e4.removeAttribute(i5);
          }
          if (y.test(e4.tagName)) {
            const t4 = e4.textContent.split(n3), i5 = t4.length - 1;
            if (i5 > 0) {
              e4.textContent = o3 ? o3.emptyScript : "";
              for (let s6 = 0; s6 < i5; s6++)
                e4.append(t4[s6], c()), E.nextNode(), d2.push({type: 2, index: ++l4});
              e4.append(t4[i5], c());
            }
          }
        } else if (e4.nodeType === 8)
          if (e4.data === h2)
            d2.push({type: 2, index: l4});
          else {
            let t4 = -1;
            for (; (t4 = e4.data.indexOf(n3, t4 + 1)) !== -1; )
              d2.push({type: 7, index: l4}), t4 += n3.length - 1;
          }
        l4++;
      }
    }
    static createElement(t3, i4) {
      const s5 = u2.createElement("template");
      return s5.innerHTML = t3, s5;
    }
  };
  function S2(t3, i4, s5 = t3, e4) {
    var o5, l4, n5, h4;
    if (i4 === w)
      return i4;
    let r4 = e4 !== void 0 ? (o5 = s5.\u03A3i) === null || o5 === void 0 ? void 0 : o5[e4] : s5.\u03A3o;
    const u3 = d(i4) ? void 0 : i4._$litDirective$;
    return (r4 == null ? void 0 : r4.constructor) !== u3 && ((l4 = r4 == null ? void 0 : r4.O) === null || l4 === void 0 || l4.call(r4, false), u3 === void 0 ? r4 = void 0 : (r4 = new u3(t3), r4.T(t3, s5, e4)), e4 !== void 0 ? ((n5 = (h4 = s5).\u03A3i) !== null && n5 !== void 0 ? n5 : h4.\u03A3i = [])[e4] = r4 : s5.\u03A3o = r4), r4 !== void 0 && (i4 = S2(t3, r4.S(t3, i4.values), r4, e4)), i4;
  }
  var k = class {
    constructor(t3, i4) {
      this.l = [], this.N = void 0, this.D = t3, this.M = i4;
    }
    u(t3) {
      var i4;
      const {el: {content: s5}, parts: e4} = this.D, o5 = ((i4 = t3 == null ? void 0 : t3.creationScope) !== null && i4 !== void 0 ? i4 : u2).importNode(s5, true);
      E.currentNode = o5;
      let l4 = E.nextNode(), n5 = 0, h4 = 0, r4 = e4[0];
      for (; r4 !== void 0; ) {
        if (n5 === r4.index) {
          let i5;
          r4.type === 2 ? i5 = new C(l4, l4.nextSibling, this, t3) : r4.type === 1 ? i5 = new r4.ctor(l4, r4.name, r4.strings, this, t3) : r4.type === 6 && (i5 = new z(l4, this, t3)), this.l.push(i5), r4 = e4[++h4];
        }
        n5 !== (r4 == null ? void 0 : r4.index) && (l4 = E.nextNode(), n5++);
      }
      return o5;
    }
    v(t3) {
      let i4 = 0;
      for (const s5 of this.l)
        s5 !== void 0 && (s5.strings !== void 0 ? (s5.I(t3, s5, i4), i4 += s5.strings.length - 2) : s5.I(t3[i4])), i4++;
    }
  };
  var C = class {
    constructor(t3, i4, s5, e4) {
      this.type = 2, this.N = void 0, this.A = t3, this.B = i4, this.M = s5, this.options = e4;
    }
    setConnected(t3) {
      var i4;
      (i4 = this.P) === null || i4 === void 0 || i4.call(this, t3);
    }
    get parentNode() {
      return this.A.parentNode;
    }
    get startNode() {
      return this.A;
    }
    get endNode() {
      return this.B;
    }
    I(t3, i4 = this) {
      t3 = S2(this, t3, i4), d(t3) ? t3 === A || t3 == null || t3 === "" ? (this.H !== A && this.R(), this.H = A) : t3 !== this.H && t3 !== w && this.m(t3) : t3._$litType$ !== void 0 ? this._(t3) : t3.nodeType !== void 0 ? this.$(t3) : a2(t3) ? this.g(t3) : this.m(t3);
    }
    k(t3, i4 = this.B) {
      return this.A.parentNode.insertBefore(t3, i4);
    }
    $(t3) {
      this.H !== t3 && (this.R(), this.H = this.k(t3));
    }
    m(t3) {
      const i4 = this.A.nextSibling;
      i4 !== null && i4.nodeType === 3 && (this.B === null ? i4.nextSibling === null : i4 === this.B.previousSibling) ? i4.data = t3 : this.$(u2.createTextNode(t3)), this.H = t3;
    }
    _(t3) {
      var i4;
      const {values: s5, _$litType$: e4} = t3, o5 = typeof e4 == "number" ? this.C(t3) : (e4.el === void 0 && (e4.el = N.createElement(e4.h, this.options)), e4);
      if (((i4 = this.H) === null || i4 === void 0 ? void 0 : i4.D) === o5)
        this.H.v(s5);
      else {
        const t4 = new k(o5, this), i5 = t4.u(this.options);
        t4.v(s5), this.$(i5), this.H = t4;
      }
    }
    C(t3) {
      let i4 = P.get(t3.strings);
      return i4 === void 0 && P.set(t3.strings, i4 = new N(t3)), i4;
    }
    g(t3) {
      v(this.H) || (this.H = [], this.R());
      const i4 = this.H;
      let s5, e4 = 0;
      for (const o5 of t3)
        e4 === i4.length ? i4.push(s5 = new C(this.k(c()), this.k(c()), this, this.options)) : s5 = i4[e4], s5.I(o5), e4++;
      e4 < i4.length && (this.R(s5 && s5.B.nextSibling, e4), i4.length = e4);
    }
    R(t3 = this.A.nextSibling, i4) {
      var s5;
      for ((s5 = this.P) === null || s5 === void 0 || s5.call(this, false, true, i4); t3 && t3 !== this.B; ) {
        const i5 = t3.nextSibling;
        t3.remove(), t3 = i5;
      }
    }
  };
  var H = class {
    constructor(t3, i4, s5, e4, o5) {
      this.type = 1, this.H = A, this.N = void 0, this.V = void 0, this.element = t3, this.name = i4, this.M = e4, this.options = o5, s5.length > 2 || s5[0] !== "" || s5[1] !== "" ? (this.H = Array(s5.length - 1).fill(A), this.strings = s5) : this.H = A;
    }
    get tagName() {
      return this.element.tagName;
    }
    I(t3, i4 = this, s5, e4) {
      const o5 = this.strings;
      let l4 = false;
      if (o5 === void 0)
        t3 = S2(this, t3, i4, 0), l4 = !d(t3) || t3 !== this.H && t3 !== w, l4 && (this.H = t3);
      else {
        const e5 = t3;
        let n5, h4;
        for (t3 = o5[0], n5 = 0; n5 < o5.length - 1; n5++)
          h4 = S2(this, e5[s5 + n5], i4, n5), h4 === w && (h4 = this.H[n5]), l4 || (l4 = !d(h4) || h4 !== this.H[n5]), h4 === A ? t3 = A : t3 !== A && (t3 += (h4 != null ? h4 : "") + o5[n5 + 1]), this.H[n5] = h4;
      }
      l4 && !e4 && this.W(t3);
    }
    W(t3) {
      t3 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t3 != null ? t3 : "");
    }
  };
  var I = class extends H {
    constructor() {
      super(...arguments), this.type = 3;
    }
    W(t3) {
      this.element[this.name] = t3 === A ? void 0 : t3;
    }
  };
  var L = class extends H {
    constructor() {
      super(...arguments), this.type = 4;
    }
    W(t3) {
      t3 && t3 !== A ? this.element.setAttribute(this.name, "") : this.element.removeAttribute(this.name);
    }
  };
  var R = class extends H {
    constructor() {
      super(...arguments), this.type = 5;
    }
    I(t3, i4 = this) {
      var s5;
      if ((t3 = (s5 = S2(this, t3, i4, 0)) !== null && s5 !== void 0 ? s5 : A) === w)
        return;
      const e4 = this.H, o5 = t3 === A && e4 !== A || t3.capture !== e4.capture || t3.once !== e4.once || t3.passive !== e4.passive, l4 = t3 !== A && (e4 === A || o5);
      o5 && this.element.removeEventListener(this.name, this, e4), l4 && this.element.addEventListener(this.name, this, t3), this.H = t3;
    }
    handleEvent(t3) {
      var i4, s5;
      typeof this.H == "function" ? this.H.call((s5 = (i4 = this.options) === null || i4 === void 0 ? void 0 : i4.host) !== null && s5 !== void 0 ? s5 : this.element, t3) : this.H.handleEvent(t3);
    }
  };
  var z = class {
    constructor(t3, i4, s5) {
      this.element = t3, this.type = 6, this.N = void 0, this.V = void 0, this.M = i4, this.options = s5;
    }
    I(t3) {
      S2(this, t3);
    }
  };
  (i2 = (t2 = globalThis).litHtmlPlatformSupport) === null || i2 === void 0 || i2.call(t2, N, C), ((s3 = (e3 = globalThis).litHtmlVersions) !== null && s3 !== void 0 ? s3 : e3.litHtmlVersions = []).push("2.0.0-rc.3");

  // node_modules/lit-element/lit-element.js
  var i3;
  var l3;
  var o4;
  var s4;
  var n4;
  var a3;
  ((i3 = (a3 = globalThis).litElementVersions) !== null && i3 !== void 0 ? i3 : a3.litElementVersions = []).push("3.0.0-rc.2");
  var h3 = class extends a {
    constructor() {
      super(...arguments), this.renderOptions = {host: this}, this.\u03A6t = void 0;
    }
    createRenderRoot() {
      var t3, e4;
      const r4 = super.createRenderRoot();
      return (t3 = (e4 = this.renderOptions).renderBefore) !== null && t3 !== void 0 || (e4.renderBefore = r4.firstChild), r4;
    }
    update(t3) {
      const r4 = this.render();
      super.update(t3), this.\u03A6t = V(r4, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
      var t3;
      super.connectedCallback(), (t3 = this.\u03A6t) === null || t3 === void 0 || t3.setConnected(true);
    }
    disconnectedCallback() {
      var t3;
      super.disconnectedCallback(), (t3 = this.\u03A6t) === null || t3 === void 0 || t3.setConnected(false);
    }
    render() {
      return w;
    }
  };
  h3.finalized = true, h3._$litElement$ = true, (o4 = (l3 = globalThis).litElementHydrateSupport) === null || o4 === void 0 || o4.call(l3, {LitElement: h3}), (n4 = (s4 = globalThis).litElementPlatformSupport) === null || n4 === void 0 || n4.call(s4, {LitElement: h3});

  // public/js/main.js
  var import_page = __toModule(require_page());

  // public/js/about-page.js
  var AboutPage = class extends h3 {
    static get it() {
      return "about-page";
    }
    static get properties() {
      return {};
    }
    static get styles() {
      return i``;
    }
    constructor() {
      super();
    }
    createRenderRoot() {
      return this;
    }
    render() {
      return T`<pq-menu active="about"></pq-menu>`;
    }
  };
  customElements.define(AboutPage.it, AboutPage);

  // public/js/pq-menu.js
  var PaperQuikMenu = class extends h3 {
    static get it() {
      return "pq-menu";
    }
    static get properties() {
      return {active: String};
    }
    static get styles() {
      return i``;
    }
    constructor() {
      super();
    }
    createRenderRoot() {
      return this;
    }
    render() {
      return T` <style>
        nav {
          background-color: #bf5a16;
          color: white;
        }
      </style>
      <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">PaperQuik</a>
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
                  class="nav-link ${this.active === "paper" ? "active" : ""}"
                  aria-current="page"
                  href="/paper"
                  >Home</a
                >
              </li>
              <li class="nav-item">
                <a
                  class="nav-link ${this.active === "about" ? "active" : ""}"
                  href="/about"
                  >About</a
                >
              </li>
            </ul>
          </div>
        </div>
      </nav>`;
    }
  };
  customElements.define(PaperQuikMenu.it, PaperQuikMenu);

  // public/js/paper-page.js
  var PaperPage = class extends h3 {
    static get it() {
      return "paper-page";
    }
    static get properties() {
      return {name: {type: String}};
    }
    static get styles() {
      return i``;
    }
    constructor() {
      super();
    }
    createRenderRoot() {
      return this;
    }
    render() {
      return T` <style>
        body {
          background-color: #2f3d4e;
          color: white;
        }

        .panel {
          margin-bottom: 20px;
          background-color: #4e5d6c;
        }

        .panel-heading {
          padding: 10px 15px 10px 15px;
          background-color: #485563;
        }

        .panel-body {
          padding: 15px;
        }
      </style>
      <pq-menu active="paper"></pq-menu>

      <div class="container">
        <div class="jumbotron" ng-show="$storage.showWelcome">
          <h1>The Paper You Need - Available Right Away</h1>
          <p></p>
          <p>
            <button
              class="btn btn-primary btn-lg"
              ng-click="$storage.showWelcome = false"
            >
              Get Started
            </button>
          </p>
        </div>

        <div class="panel panel-default">
          <div class="panel-body">
            <div class="leaderboardAd">
              <script
                async
                src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
              ></script>
              <!-- PaperQuik Leaderboard -->
              <ins
                class="adsbygoogle"
                style="display:inline-block;width:728px;height:90px"
                data-ad-client="ca-pub-8376642740439271"
                data-ad-slot="6535942993"
              ></ins>
              <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
              </script>
            </div>
          </div>
        </div>

        <div class="panel panel-default size-section">
          <div class="panel-heading">
            <h2>1: Pick a paper size</h2>
          </div>
          <div class="panel-body">
            <a href="#/paper/{{ paper.id }}" ng-repeat="paper in paperSizes()">
              <div
                class="paperIcon"
                ng-style="paperIconStyle(paper)"
                ng-class="{ 'notSelected' : selectedPaper !== paper }"
              >
                <span class="paperName">{{ paper.name }}</span>
              </div></a
            >
          </div>
        </div>

        <div class="panel panel-default layout-section">
          <div class="panel-heading">
            <h2>
              2: Pick a layout
              <span ng-show="selectedPaper"
                >for {{ selectedPaper.name }} size paper</span
              >
            </h2>
          </div>
          <div class="panel-body">
            <div>
              <a
                href="#/layout/{{ layout.id }}"
                ng-repeat="layout in paperLayouts(selectedPaper)"
              >
                <div class="layoutIcon">
                  <span class="layoutName">{{ layout.name }}</span>
                  <div
                    style="width: 100%; height: 125px; border: 1px solid black; overflow: hidden;"
                  >
                    <img
                      style="position: relative; width: 100%;"
                      ng-src="{{ layout.image }}"
                    />
                  </div>
                </div>
              </a>
            </div>

            <div ng-if="!selectedPaper">
              You must pick a paper size before you pick a layout for your page.
            </div>
          </div>
        </div>

        <div class="panel panel-default">
          <div class="panel-body">
            <div class="leaderboardAd">
              <script
                async
                src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
              ></script>
              <!-- PaperQuik Leaderboard -->
              <ins
                class="adsbygoogle"
                style="display:inline-block;width:728px;height:90px"
                data-ad-client="ca-pub-8376642740439271"
                data-ad-slot="6535942993"
              ></ins>
              <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
              </script>
            </div>
          </div>
        </div>

        <footer>
          <p>© 2021 John Munsch</p>
        </footer>
      </div>
      <!-- /.container -->`;
    }
  };
  customElements.define(PaperPage.it, PaperPage);

  // public/js/main.js
  var PaperQuikApp = class extends h3 {
    static get it() {
      return "paperquik-app";
    }
    static get properties() {
      return {};
    }
    static get styles() {
      return i``;
    }
    constructor() {
      super();
      (0, import_page.default)("/about", () => {
        this.renderer = () => T`<about-page></about-page>`;
        this.requestUpdate();
      });
      (0, import_page.default)("/paper/:size?/:layout?", () => {
        this.renderer = () => T`<paper-page></paper-page>`;
        this.requestUpdate();
      });
      (0, import_page.default)("*", "/paper");
      (0, import_page.default)();
    }
    createRenderRoot() {
      return this;
    }
    render() {
      return this.renderer();
    }
  };
  customElements.define(PaperQuikApp.it, PaperQuikApp);
})();
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
