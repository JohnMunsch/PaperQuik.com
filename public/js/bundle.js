(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
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
          for (var i6 = 0; i6 < tokens.length; i6++) {
            if (typeof tokens[i6] === "object") {
              matches[i6] = new RegExp("^" + tokens[i6].pattern + "$");
            }
          }
          return function(obj) {
            var path = "";
            var data = obj || {};
            for (var i7 = 0; i7 < tokens.length; i7++) {
              var token = tokens[i7];
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
                  if (!matches[i7].test(segment)) {
                    throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"');
                  }
                  path += (j === 0 ? token.prefix : token.delimiter) + segment;
                }
                continue;
              }
              segment = encodeURIComponent(value);
              if (!matches[i7].test(segment)) {
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
            for (var i6 = 0; i6 < groups.length; i6++) {
              keys.push({
                name: i6,
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
          for (var i6 = 0; i6 < path.length; i6++) {
            parts.push(pathToRegexp(path[i6], keys, options).source);
          }
          var regexp = new RegExp("(?:" + parts.join("|") + ")", flags(options));
          return attachKeys(regexp, keys);
        }
        function stringToRegexp(path, keys, options) {
          var tokens = parse(path);
          var re = tokensToRegExp(tokens, options);
          for (var i6 = 0; i6 < tokens.length; i6++) {
            if (typeof tokens[i6] !== "string") {
              keys.push(tokens[i6]);
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
          for (var i6 = 0; i6 < tokens.length; i6++) {
            var token = tokens[i6];
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
          var i6 = 0, j = 0, page3 = this;
          function nextExit() {
            var fn = page3.exits[j++];
            if (!fn)
              return nextEnter();
            fn(prev, nextExit);
          }
          function nextEnter() {
            var fn = page3.callbacks[i6++];
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
          for (var i6 = 1; i6 < arguments.length; ++i6) {
            this.exits.push(route.middleware(arguments[i6]));
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
            for (var i6 = 0; i6 < eventPath.length; i6++) {
              if (!eventPath[i6].nodeName)
                continue;
              if (eventPath[i6].nodeName.toUpperCase() !== "A")
                continue;
              if (!eventPath[i6].href)
                continue;
              el = eventPath[i6];
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
            for (var i6 = 1; i6 < arguments.length; ++i6) {
              this.callbacks.push(route.middleware(arguments[i6]));
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
        function escapeRegExp(s6) {
          return s6.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
        }
        function Context(path, state, pageInstance) {
          var _page = this.page = pageInstance || page2;
          var window2 = _page._window;
          var hashbang = _page._hashbang;
          var pageBase = _page._getBase();
          if (path[0] === "/" && path.indexOf(pageBase) !== 0)
            path = pageBase + (hashbang ? "#!" : "") + path;
          var i6 = path.indexOf("?");
          this.canonicalPath = path;
          var re = new RegExp("^" + escapeRegExp(pageBase));
          this.path = path.replace(re, "") || "/";
          if (hashbang)
            this.path = this.path.replace("#!", "") || "/";
          this.title = hasDocument && window2.document.title;
          this.state = state || {};
          this.state.path = path;
          this.querystring = ~i6 ? _page._decodeURLEncodedURIComponent(path.slice(i6 + 1)) : "";
          this.pathname = _page._decodeURLEncodedURIComponent(~i6 ? path.slice(0, i6) : path);
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
          for (var i6 = 1, len = m2.length; i6 < len; ++i6) {
            var key = keys[i6 - 1];
            var val = this.page._decodeURLEncodedURIComponent(m2[i6]);
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
    constructor(t4, s6) {
      if (s6 !== e)
        throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = t4;
    }
    get styleSheet() {
      return t && this.t === void 0 && (this.t = new CSSStyleSheet(), this.t.replaceSync(this.cssText)), this.t;
    }
    toString() {
      return this.cssText;
    }
  };
  var n = new Map();
  var o = (t4) => {
    let o5 = n.get(t4);
    return o5 === void 0 && n.set(t4, o5 = new s(t4, e)), o5;
  };
  var r = (t4) => o(typeof t4 == "string" ? t4 : t4 + "");
  var i = (t4, ...e4) => {
    const n5 = t4.length === 1 ? t4[0] : e4.reduce((e5, n6, o5) => e5 + ((t5) => {
      if (t5 instanceof s)
        return t5.cssText;
      if (typeof t5 == "number")
        return t5;
      throw Error("Value passed to 'css' function must be a 'css' function result: " + t5 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
    })(n6) + t4[o5 + 1], t4[0]);
    return o(n5);
  };
  var S = (e4, s6) => {
    t ? e4.adoptedStyleSheets = s6.map((t4) => t4 instanceof CSSStyleSheet ? t4 : t4.styleSheet) : s6.forEach((t4) => {
      const s7 = document.createElement("style");
      s7.textContent = t4.cssText, e4.appendChild(s7);
    });
  };
  var u = t ? (t4) => t4 : (t4) => t4 instanceof CSSStyleSheet ? ((t5) => {
    let e4 = "";
    for (const s6 of t5.cssRules)
      e4 += s6.cssText;
    return r(e4);
  })(t4) : t4;

  // node_modules/@lit/reactive-element/reactive-element.js
  var s2;
  var e2;
  var h;
  var r2;
  var o2 = { toAttribute(t4, i6) {
    switch (i6) {
      case Boolean:
        t4 = t4 ? "" : null;
        break;
      case Object:
      case Array:
        t4 = t4 == null ? t4 : JSON.stringify(t4);
    }
    return t4;
  }, fromAttribute(t4, i6) {
    let s6 = t4;
    switch (i6) {
      case Boolean:
        s6 = t4 !== null;
        break;
      case Number:
        s6 = t4 === null ? null : Number(t4);
        break;
      case Object:
      case Array:
        try {
          s6 = JSON.parse(t4);
        } catch (t5) {
          s6 = null;
        }
    }
    return s6;
  } };
  var n2 = (t4, i6) => i6 !== t4 && (i6 == i6 || t4 == t4);
  var l = { attribute: true, type: String, converter: o2, reflect: false, hasChanged: n2 };
  var a = class extends HTMLElement {
    constructor() {
      super(), this.\u03A0i = new Map(), this.\u03A0o = void 0, this.\u03A0l = void 0, this.isUpdatePending = false, this.hasUpdated = false, this.\u03A0h = null, this.u();
    }
    static addInitializer(t4) {
      var i6;
      (i6 = this.v) !== null && i6 !== void 0 || (this.v = []), this.v.push(t4);
    }
    static get observedAttributes() {
      this.finalize();
      const t4 = [];
      return this.elementProperties.forEach((i6, s6) => {
        const e4 = this.\u03A0p(s6, i6);
        e4 !== void 0 && (this.\u03A0m.set(e4, s6), t4.push(e4));
      }), t4;
    }
    static createProperty(t4, i6 = l) {
      if (i6.state && (i6.attribute = false), this.finalize(), this.elementProperties.set(t4, i6), !i6.noAccessor && !this.prototype.hasOwnProperty(t4)) {
        const s6 = typeof t4 == "symbol" ? Symbol() : "__" + t4, e4 = this.getPropertyDescriptor(t4, s6, i6);
        e4 !== void 0 && Object.defineProperty(this.prototype, t4, e4);
      }
    }
    static getPropertyDescriptor(t4, i6, s6) {
      return { get() {
        return this[i6];
      }, set(e4) {
        const h4 = this[t4];
        this[i6] = e4, this.requestUpdate(t4, h4, s6);
      }, configurable: true, enumerable: true };
    }
    static getPropertyOptions(t4) {
      return this.elementProperties.get(t4) || l;
    }
    static finalize() {
      if (this.hasOwnProperty("finalized"))
        return false;
      this.finalized = true;
      const t4 = Object.getPrototypeOf(this);
      if (t4.finalize(), this.elementProperties = new Map(t4.elementProperties), this.\u03A0m = new Map(), this.hasOwnProperty("properties")) {
        const t5 = this.properties, i6 = [...Object.getOwnPropertyNames(t5), ...Object.getOwnPropertySymbols(t5)];
        for (const s6 of i6)
          this.createProperty(s6, t5[s6]);
      }
      return this.elementStyles = this.finalizeStyles(this.styles), true;
    }
    static finalizeStyles(i6) {
      const s6 = [];
      if (Array.isArray(i6)) {
        const e4 = new Set(i6.flat(1 / 0).reverse());
        for (const i7 of e4)
          s6.unshift(u(i7));
      } else
        i6 !== void 0 && s6.push(u(i6));
      return s6;
    }
    static \u03A0p(t4, i6) {
      const s6 = i6.attribute;
      return s6 === false ? void 0 : typeof s6 == "string" ? s6 : typeof t4 == "string" ? t4.toLowerCase() : void 0;
    }
    u() {
      var t4;
      this.\u03A0g = new Promise((t5) => this.enableUpdating = t5), this.L = new Map(), this.\u03A0_(), this.requestUpdate(), (t4 = this.constructor.v) === null || t4 === void 0 || t4.forEach((t5) => t5(this));
    }
    addController(t4) {
      var i6, s6;
      ((i6 = this.\u03A0U) !== null && i6 !== void 0 ? i6 : this.\u03A0U = []).push(t4), this.renderRoot !== void 0 && this.isConnected && ((s6 = t4.hostConnected) === null || s6 === void 0 || s6.call(t4));
    }
    removeController(t4) {
      var i6;
      (i6 = this.\u03A0U) === null || i6 === void 0 || i6.splice(this.\u03A0U.indexOf(t4) >>> 0, 1);
    }
    \u03A0_() {
      this.constructor.elementProperties.forEach((t4, i6) => {
        this.hasOwnProperty(i6) && (this.\u03A0i.set(i6, this[i6]), delete this[i6]);
      });
    }
    createRenderRoot() {
      var t4;
      const s6 = (t4 = this.shadowRoot) !== null && t4 !== void 0 ? t4 : this.attachShadow(this.constructor.shadowRootOptions);
      return S(s6, this.constructor.elementStyles), s6;
    }
    connectedCallback() {
      var t4;
      this.renderRoot === void 0 && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (t4 = this.\u03A0U) === null || t4 === void 0 || t4.forEach((t5) => {
        var i6;
        return (i6 = t5.hostConnected) === null || i6 === void 0 ? void 0 : i6.call(t5);
      }), this.\u03A0l && (this.\u03A0l(), this.\u03A0o = this.\u03A0l = void 0);
    }
    enableUpdating(t4) {
    }
    disconnectedCallback() {
      var t4;
      (t4 = this.\u03A0U) === null || t4 === void 0 || t4.forEach((t5) => {
        var i6;
        return (i6 = t5.hostDisconnected) === null || i6 === void 0 ? void 0 : i6.call(t5);
      }), this.\u03A0o = new Promise((t5) => this.\u03A0l = t5);
    }
    attributeChangedCallback(t4, i6, s6) {
      this.K(t4, s6);
    }
    \u03A0j(t4, i6, s6 = l) {
      var e4, h4;
      const r4 = this.constructor.\u03A0p(t4, s6);
      if (r4 !== void 0 && s6.reflect === true) {
        const n5 = ((h4 = (e4 = s6.converter) === null || e4 === void 0 ? void 0 : e4.toAttribute) !== null && h4 !== void 0 ? h4 : o2.toAttribute)(i6, s6.type);
        this.\u03A0h = t4, n5 == null ? this.removeAttribute(r4) : this.setAttribute(r4, n5), this.\u03A0h = null;
      }
    }
    K(t4, i6) {
      var s6, e4, h4;
      const r4 = this.constructor, n5 = r4.\u03A0m.get(t4);
      if (n5 !== void 0 && this.\u03A0h !== n5) {
        const t5 = r4.getPropertyOptions(n5), l4 = t5.converter, a4 = (h4 = (e4 = (s6 = l4) === null || s6 === void 0 ? void 0 : s6.fromAttribute) !== null && e4 !== void 0 ? e4 : typeof l4 == "function" ? l4 : null) !== null && h4 !== void 0 ? h4 : o2.fromAttribute;
        this.\u03A0h = n5, this[n5] = a4(i6, t5.type), this.\u03A0h = null;
      }
    }
    requestUpdate(t4, i6, s6) {
      let e4 = true;
      t4 !== void 0 && (((s6 = s6 || this.constructor.getPropertyOptions(t4)).hasChanged || n2)(this[t4], i6) ? (this.L.has(t4) || this.L.set(t4, i6), s6.reflect === true && this.\u03A0h !== t4 && (this.\u03A0k === void 0 && (this.\u03A0k = new Map()), this.\u03A0k.set(t4, s6))) : e4 = false), !this.isUpdatePending && e4 && (this.\u03A0g = this.\u03A0q());
    }
    async \u03A0q() {
      this.isUpdatePending = true;
      try {
        for (await this.\u03A0g; this.\u03A0o; )
          await this.\u03A0o;
      } catch (t5) {
        Promise.reject(t5);
      }
      const t4 = this.performUpdate();
      return t4 != null && await t4, !this.isUpdatePending;
    }
    performUpdate() {
      var t4;
      if (!this.isUpdatePending)
        return;
      this.hasUpdated, this.\u03A0i && (this.\u03A0i.forEach((t5, i7) => this[i7] = t5), this.\u03A0i = void 0);
      let i6 = false;
      const s6 = this.L;
      try {
        i6 = this.shouldUpdate(s6), i6 ? (this.willUpdate(s6), (t4 = this.\u03A0U) === null || t4 === void 0 || t4.forEach((t5) => {
          var i7;
          return (i7 = t5.hostUpdate) === null || i7 === void 0 ? void 0 : i7.call(t5);
        }), this.update(s6)) : this.\u03A0$();
      } catch (t5) {
        throw i6 = false, this.\u03A0$(), t5;
      }
      i6 && this.E(s6);
    }
    willUpdate(t4) {
    }
    E(t4) {
      var i6;
      (i6 = this.\u03A0U) === null || i6 === void 0 || i6.forEach((t5) => {
        var i7;
        return (i7 = t5.hostUpdated) === null || i7 === void 0 ? void 0 : i7.call(t5);
      }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t4)), this.updated(t4);
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
    shouldUpdate(t4) {
      return true;
    }
    update(t4) {
      this.\u03A0k !== void 0 && (this.\u03A0k.forEach((t5, i6) => this.\u03A0j(i6, this[i6], t5)), this.\u03A0k = void 0), this.\u03A0$();
    }
    updated(t4) {
    }
    firstUpdated(t4) {
    }
  };
  a.finalized = true, a.elementProperties = new Map(), a.elementStyles = [], a.shadowRootOptions = { mode: "open" }, (e2 = (s2 = globalThis).reactiveElementPlatformSupport) === null || e2 === void 0 || e2.call(s2, { ReactiveElement: a }), ((h = (r2 = globalThis).reactiveElementVersions) !== null && h !== void 0 ? h : r2.reactiveElementVersions = []).push("1.0.0-rc.2");

  // node_modules/lit-html/lit-html.js
  var t2;
  var i2;
  var s3;
  var e3;
  var o3 = globalThis.trustedTypes;
  var l2 = o3 ? o3.createPolicy("lit-html", { createHTML: (t4) => t4 }) : void 0;
  var n3 = `lit$${(Math.random() + "").slice(9)}$`;
  var h2 = "?" + n3;
  var r3 = `<${h2}>`;
  var u2 = document;
  var c = (t4 = "") => u2.createComment(t4);
  var d = (t4) => t4 === null || typeof t4 != "object" && typeof t4 != "function";
  var v = Array.isArray;
  var a2 = (t4) => {
    var i6;
    return v(t4) || typeof ((i6 = t4) === null || i6 === void 0 ? void 0 : i6[Symbol.iterator]) == "function";
  };
  var f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
  var _ = /-->/g;
  var m = />/g;
  var p = />|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g;
  var $ = /'/g;
  var g = /"/g;
  var y = /^(?:script|style|textarea)$/i;
  var b = (t4) => (i6, ...s6) => ({ _$litType$: t4, strings: i6, values: s6 });
  var T = b(1);
  var x = b(2);
  var w = Symbol.for("lit-noChange");
  var A = Symbol.for("lit-nothing");
  var P = new WeakMap();
  var V = (t4, i6, s6) => {
    var e4, o5;
    const l4 = (e4 = s6 == null ? void 0 : s6.renderBefore) !== null && e4 !== void 0 ? e4 : i6;
    let n5 = l4._$litPart$;
    if (n5 === void 0) {
      const t5 = (o5 = s6 == null ? void 0 : s6.renderBefore) !== null && o5 !== void 0 ? o5 : null;
      l4._$litPart$ = n5 = new C(i6.insertBefore(c(), t5), t5, void 0, s6);
    }
    return n5.I(t4), n5;
  };
  var E = u2.createTreeWalker(u2, 129, null, false);
  var M = (t4, i6) => {
    const s6 = t4.length - 1, e4 = [];
    let o5, h4 = i6 === 2 ? "<svg>" : "", u3 = f;
    for (let i7 = 0; i7 < s6; i7++) {
      const s7 = t4[i7];
      let l4, c3, d2 = -1, v2 = 0;
      for (; v2 < s7.length && (u3.lastIndex = v2, c3 = u3.exec(s7), c3 !== null); )
        v2 = u3.lastIndex, u3 === f ? c3[1] === "!--" ? u3 = _ : c3[1] !== void 0 ? u3 = m : c3[2] !== void 0 ? (y.test(c3[2]) && (o5 = RegExp("</" + c3[2], "g")), u3 = p) : c3[3] !== void 0 && (u3 = p) : u3 === p ? c3[0] === ">" ? (u3 = o5 != null ? o5 : f, d2 = -1) : c3[1] === void 0 ? d2 = -2 : (d2 = u3.lastIndex - c3[2].length, l4 = c3[1], u3 = c3[3] === void 0 ? p : c3[3] === '"' ? g : $) : u3 === g || u3 === $ ? u3 = p : u3 === _ || u3 === m ? u3 = f : (u3 = p, o5 = void 0);
      const a4 = u3 === p && t4[i7 + 1].startsWith("/>") ? " " : "";
      h4 += u3 === f ? s7 + r3 : d2 >= 0 ? (e4.push(l4), s7.slice(0, d2) + "$lit$" + s7.slice(d2) + n3 + a4) : s7 + n3 + (d2 === -2 ? (e4.push(void 0), i7) : a4);
    }
    const c2 = h4 + (t4[s6] || "<?>") + (i6 === 2 ? "</svg>" : "");
    return [l2 !== void 0 ? l2.createHTML(c2) : c2, e4];
  };
  var N = class {
    constructor({ strings: t4, _$litType$: i6 }, s6) {
      let e4;
      this.parts = [];
      let l4 = 0, r4 = 0;
      const u3 = t4.length - 1, d2 = this.parts, [v2, a4] = M(t4, i6);
      if (this.el = N.createElement(v2, s6), E.currentNode = this.el.content, i6 === 2) {
        const t5 = this.el.content, i7 = t5.firstChild;
        i7.remove(), t5.append(...i7.childNodes);
      }
      for (; (e4 = E.nextNode()) !== null && d2.length < u3; ) {
        if (e4.nodeType === 1) {
          if (e4.hasAttributes()) {
            const t5 = [];
            for (const i7 of e4.getAttributeNames())
              if (i7.endsWith("$lit$") || i7.startsWith(n3)) {
                const s7 = a4[r4++];
                if (t5.push(i7), s7 !== void 0) {
                  const t6 = e4.getAttribute(s7.toLowerCase() + "$lit$").split(n3), i8 = /([.?@])?(.*)/.exec(s7);
                  d2.push({ type: 1, index: l4, name: i8[2], strings: t6, ctor: i8[1] === "." ? I : i8[1] === "?" ? L : i8[1] === "@" ? R : H });
                } else
                  d2.push({ type: 6, index: l4 });
              }
            for (const i7 of t5)
              e4.removeAttribute(i7);
          }
          if (y.test(e4.tagName)) {
            const t5 = e4.textContent.split(n3), i7 = t5.length - 1;
            if (i7 > 0) {
              e4.textContent = o3 ? o3.emptyScript : "";
              for (let s7 = 0; s7 < i7; s7++)
                e4.append(t5[s7], c()), E.nextNode(), d2.push({ type: 2, index: ++l4 });
              e4.append(t5[i7], c());
            }
          }
        } else if (e4.nodeType === 8)
          if (e4.data === h2)
            d2.push({ type: 2, index: l4 });
          else {
            let t5 = -1;
            for (; (t5 = e4.data.indexOf(n3, t5 + 1)) !== -1; )
              d2.push({ type: 7, index: l4 }), t5 += n3.length - 1;
          }
        l4++;
      }
    }
    static createElement(t4, i6) {
      const s6 = u2.createElement("template");
      return s6.innerHTML = t4, s6;
    }
  };
  function S2(t4, i6, s6 = t4, e4) {
    var o5, l4, n5, h4;
    if (i6 === w)
      return i6;
    let r4 = e4 !== void 0 ? (o5 = s6.\u03A3i) === null || o5 === void 0 ? void 0 : o5[e4] : s6.\u03A3o;
    const u3 = d(i6) ? void 0 : i6._$litDirective$;
    return (r4 == null ? void 0 : r4.constructor) !== u3 && ((l4 = r4 == null ? void 0 : r4.O) === null || l4 === void 0 || l4.call(r4, false), u3 === void 0 ? r4 = void 0 : (r4 = new u3(t4), r4.T(t4, s6, e4)), e4 !== void 0 ? ((n5 = (h4 = s6).\u03A3i) !== null && n5 !== void 0 ? n5 : h4.\u03A3i = [])[e4] = r4 : s6.\u03A3o = r4), r4 !== void 0 && (i6 = S2(t4, r4.S(t4, i6.values), r4, e4)), i6;
  }
  var k = class {
    constructor(t4, i6) {
      this.l = [], this.N = void 0, this.D = t4, this.M = i6;
    }
    u(t4) {
      var i6;
      const { el: { content: s6 }, parts: e4 } = this.D, o5 = ((i6 = t4 == null ? void 0 : t4.creationScope) !== null && i6 !== void 0 ? i6 : u2).importNode(s6, true);
      E.currentNode = o5;
      let l4 = E.nextNode(), n5 = 0, h4 = 0, r4 = e4[0];
      for (; r4 !== void 0; ) {
        if (n5 === r4.index) {
          let i7;
          r4.type === 2 ? i7 = new C(l4, l4.nextSibling, this, t4) : r4.type === 1 ? i7 = new r4.ctor(l4, r4.name, r4.strings, this, t4) : r4.type === 6 && (i7 = new z(l4, this, t4)), this.l.push(i7), r4 = e4[++h4];
        }
        n5 !== (r4 == null ? void 0 : r4.index) && (l4 = E.nextNode(), n5++);
      }
      return o5;
    }
    v(t4) {
      let i6 = 0;
      for (const s6 of this.l)
        s6 !== void 0 && (s6.strings !== void 0 ? (s6.I(t4, s6, i6), i6 += s6.strings.length - 2) : s6.I(t4[i6])), i6++;
    }
  };
  var C = class {
    constructor(t4, i6, s6, e4) {
      this.type = 2, this.N = void 0, this.A = t4, this.B = i6, this.M = s6, this.options = e4;
    }
    setConnected(t4) {
      var i6;
      (i6 = this.P) === null || i6 === void 0 || i6.call(this, t4);
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
    I(t4, i6 = this) {
      t4 = S2(this, t4, i6), d(t4) ? t4 === A || t4 == null || t4 === "" ? (this.H !== A && this.R(), this.H = A) : t4 !== this.H && t4 !== w && this.m(t4) : t4._$litType$ !== void 0 ? this._(t4) : t4.nodeType !== void 0 ? this.$(t4) : a2(t4) ? this.g(t4) : this.m(t4);
    }
    k(t4, i6 = this.B) {
      return this.A.parentNode.insertBefore(t4, i6);
    }
    $(t4) {
      this.H !== t4 && (this.R(), this.H = this.k(t4));
    }
    m(t4) {
      const i6 = this.A.nextSibling;
      i6 !== null && i6.nodeType === 3 && (this.B === null ? i6.nextSibling === null : i6 === this.B.previousSibling) ? i6.data = t4 : this.$(u2.createTextNode(t4)), this.H = t4;
    }
    _(t4) {
      var i6;
      const { values: s6, _$litType$: e4 } = t4, o5 = typeof e4 == "number" ? this.C(t4) : (e4.el === void 0 && (e4.el = N.createElement(e4.h, this.options)), e4);
      if (((i6 = this.H) === null || i6 === void 0 ? void 0 : i6.D) === o5)
        this.H.v(s6);
      else {
        const t5 = new k(o5, this), i7 = t5.u(this.options);
        t5.v(s6), this.$(i7), this.H = t5;
      }
    }
    C(t4) {
      let i6 = P.get(t4.strings);
      return i6 === void 0 && P.set(t4.strings, i6 = new N(t4)), i6;
    }
    g(t4) {
      v(this.H) || (this.H = [], this.R());
      const i6 = this.H;
      let s6, e4 = 0;
      for (const o5 of t4)
        e4 === i6.length ? i6.push(s6 = new C(this.k(c()), this.k(c()), this, this.options)) : s6 = i6[e4], s6.I(o5), e4++;
      e4 < i6.length && (this.R(s6 && s6.B.nextSibling, e4), i6.length = e4);
    }
    R(t4 = this.A.nextSibling, i6) {
      var s6;
      for ((s6 = this.P) === null || s6 === void 0 || s6.call(this, false, true, i6); t4 && t4 !== this.B; ) {
        const i7 = t4.nextSibling;
        t4.remove(), t4 = i7;
      }
    }
  };
  var H = class {
    constructor(t4, i6, s6, e4, o5) {
      this.type = 1, this.H = A, this.N = void 0, this.V = void 0, this.element = t4, this.name = i6, this.M = e4, this.options = o5, s6.length > 2 || s6[0] !== "" || s6[1] !== "" ? (this.H = Array(s6.length - 1).fill(A), this.strings = s6) : this.H = A;
    }
    get tagName() {
      return this.element.tagName;
    }
    I(t4, i6 = this, s6, e4) {
      const o5 = this.strings;
      let l4 = false;
      if (o5 === void 0)
        t4 = S2(this, t4, i6, 0), l4 = !d(t4) || t4 !== this.H && t4 !== w, l4 && (this.H = t4);
      else {
        const e5 = t4;
        let n5, h4;
        for (t4 = o5[0], n5 = 0; n5 < o5.length - 1; n5++)
          h4 = S2(this, e5[s6 + n5], i6, n5), h4 === w && (h4 = this.H[n5]), l4 || (l4 = !d(h4) || h4 !== this.H[n5]), h4 === A ? t4 = A : t4 !== A && (t4 += (h4 != null ? h4 : "") + o5[n5 + 1]), this.H[n5] = h4;
      }
      l4 && !e4 && this.W(t4);
    }
    W(t4) {
      t4 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t4 != null ? t4 : "");
    }
  };
  var I = class extends H {
    constructor() {
      super(...arguments), this.type = 3;
    }
    W(t4) {
      this.element[this.name] = t4 === A ? void 0 : t4;
    }
  };
  var L = class extends H {
    constructor() {
      super(...arguments), this.type = 4;
    }
    W(t4) {
      t4 && t4 !== A ? this.element.setAttribute(this.name, "") : this.element.removeAttribute(this.name);
    }
  };
  var R = class extends H {
    constructor() {
      super(...arguments), this.type = 5;
    }
    I(t4, i6 = this) {
      var s6;
      if ((t4 = (s6 = S2(this, t4, i6, 0)) !== null && s6 !== void 0 ? s6 : A) === w)
        return;
      const e4 = this.H, o5 = t4 === A && e4 !== A || t4.capture !== e4.capture || t4.once !== e4.once || t4.passive !== e4.passive, l4 = t4 !== A && (e4 === A || o5);
      o5 && this.element.removeEventListener(this.name, this, e4), l4 && this.element.addEventListener(this.name, this, t4), this.H = t4;
    }
    handleEvent(t4) {
      var i6, s6;
      typeof this.H == "function" ? this.H.call((s6 = (i6 = this.options) === null || i6 === void 0 ? void 0 : i6.host) !== null && s6 !== void 0 ? s6 : this.element, t4) : this.H.handleEvent(t4);
    }
  };
  var z = class {
    constructor(t4, i6, s6) {
      this.element = t4, this.type = 6, this.N = void 0, this.V = void 0, this.M = i6, this.options = s6;
    }
    I(t4) {
      S2(this, t4);
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
      super(...arguments), this.renderOptions = { host: this }, this.\u03A6t = void 0;
    }
    createRenderRoot() {
      var t4, e4;
      const r4 = super.createRenderRoot();
      return (t4 = (e4 = this.renderOptions).renderBefore) !== null && t4 !== void 0 || (e4.renderBefore = r4.firstChild), r4;
    }
    update(t4) {
      const r4 = this.render();
      super.update(t4), this.\u03A6t = V(r4, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
      var t4;
      super.connectedCallback(), (t4 = this.\u03A6t) === null || t4 === void 0 || t4.setConnected(true);
    }
    disconnectedCallback() {
      var t4;
      super.disconnectedCallback(), (t4 = this.\u03A6t) === null || t4 === void 0 || t4.setConnected(false);
    }
    render() {
      return w;
    }
  };
  h3.finalized = true, h3._$litElement$ = true, (o4 = (l3 = globalThis).litElementHydrateSupport) === null || o4 === void 0 || o4.call(l3, { LitElement: h3 }), (n4 = (s4 = globalThis).litElementPlatformSupport) === null || n4 === void 0 || n4.call(s4, { LitElement: h3 });

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

  // node_modules/lit-html/directive.js
  var t3 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
  var i4 = (t4) => (...i6) => ({ _$litDirective$: t4, values: i6 });
  var s5 = class {
    constructor(t4) {
    }
    T(t4, i6, s6) {
      this.\u03A3dt = t4, this.M = i6, this.\u03A3ct = s6;
    }
    S(t4, i6) {
      return this.update(t4, i6);
    }
    update(t4, i6) {
      return this.render(...i6);
    }
  };

  // node_modules/lit-html/directives/style-map.js
  var i5 = i4(class extends s5 {
    constructor(t4) {
      var e4;
      if (super(t4), t4.type !== t3.ATTRIBUTE || t4.name !== "style" || ((e4 = t4.strings) === null || e4 === void 0 ? void 0 : e4.length) > 2)
        throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
    }
    render(t4) {
      return Object.keys(t4).reduce((e4, r4) => {
        const s6 = t4[r4];
        return s6 == null ? e4 : e4 + `${r4 = r4.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s6};`;
      }, "");
    }
    update(e4, [r4]) {
      const { style: s6 } = e4.element;
      if (this.St === void 0) {
        this.St = new Set();
        for (const t4 in r4)
          this.St.add(t4);
        return this.render(r4);
      }
      this.St.forEach((t4) => {
        r4[t4] == null && (this.St.delete(t4), t4.includes("-") ? s6.removeProperty(t4) : s6[t4] = "");
      });
      for (const t4 in r4) {
        const e5 = r4[t4];
        e5 != null && (this.St.add(t4), t4.includes("-") ? s6.setProperty(t4, e5) : s6[t4] = e5);
      }
      return w;
    }
  });

  // public/js/paper-generation.js
  var paperLayouts = [
    {
      id: "blank",
      name: "Blank"
    },
    {
      id: "dot-grid",
      name: "Dot Grid"
    },
    {
      id: "dotted-ruled-lines",
      name: "Dotted Ruled"
    },
    {
      id: "ruled-lines",
      name: "Ruled Lines"
    },
    {
      id: "square-graph",
      name: "Square Graph"
    }
  ];
  var paperSizes = [
    {
      id: "letter",
      name: "Letter",
      width: 215.9,
      height: 279.4
    },
    {
      id: "letterl",
      name: "Letter",
      width: 279.4,
      height: 215.9
    },
    {
      id: "legal",
      name: "Legal",
      width: 215.9,
      height: 355.6
    },
    {
      id: "legall",
      name: "Legal",
      width: 355.6,
      height: 215.9
    },
    {
      id: "a4",
      name: "A4",
      width: 210,
      height: 297
    },
    {
      id: "a4l",
      name: "A4",
      width: 297,
      height: 210
    },
    {
      id: "a5",
      name: "A5",
      width: 148,
      height: 210
    }
  ];
  function paper(print, paperSize) {
    return T`<svg
    class="${print ? "d-none d-print-block" : ""}"
    width="${paperSize.width}mm"
    height="${paperSize.height}mm"
    viewBox="0 0 ${paperSize.width} ${paperSize.height}"
    version="1.1"
  >
    <g>
      <rect
        style="fill:${print ? "none" : "white"};fill-rule:evenodd;"
        width="215.9"
        height="279.4"
        x="0"
        y="0"
      />
      <rect
        style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:0.1;stroke-opacity:1"
        width="191.73621"
        height="255.73621"
        x="12.131895"
        y="12.131895"
      />
    </g>
  </svg>`;
  }

  // public/js/pq-menu.js
  var PaperQuikMenu = class extends h3 {
    static get it() {
      return "pq-menu";
    }
    static get properties() {
      return { active: String };
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
      return { size: { type: String }, layout: { type: String } };
    }
    constructor() {
      super();
      this.paperSize = null;
    }
    createRenderRoot() {
      return this;
    }
    jumbotron() {
      return T` <div class="panel jumbotron" ng-show="$storage.showWelcome">
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
    </div>`;
    }
    adBlock() {
      return T`<div class="panel panel-default">
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
    </div>`;
    }
    paperIconStyle(paperSize) {
      return {
        width: `${paperSize.width / 2.8}px`,
        height: `${paperSize.height / 2.8}px`
      };
    }
    stepOne() {
      return T`<div class="panel panel-default size-section">
      <div class="panel-heading">
        <h2>1: Pick a paper size</h2>
      </div>
      <div class="panel-body">
        ${paperSizes.map((paperSize) => {
        return T`<a href="/paper/${paperSize.id}">
            <div
              class="paperIcon ${paperSize.id === this.size ? "selected" : "notSelected"}"
              style="${i5(this.paperIconStyle(paperSize))}"
            >
              <span class="paperName">${paperSize.name}</span>
            </div>
          </a>`;
      })}
      </div>
    </div>`;
    }
    stepTwo() {
      return T` <div class="panel panel-default layout-section">
      <div class="panel-heading">
        <h2>
          2: Pick a layout
          ${this.paperSize ? `for ${this.paperSize.name} size paper` : ""}
        </h2>
      </div>
      <div class="panel-body">
        ${this.size ? T` <div>
              ${paperLayouts.map((paperLayout) => {
        return T`<a href="/${this.size}/${paperLayout.id}">
                  <div class="layoutIcon">
                    <span class="layoutName">${paperLayout.name}</span>
                    <div
                      style="width: 100%; height: 125px; border: 1px solid black; overflow: hidden;"
                    >
                      <img
                        style="position: relative; width: 100%;"
                        src="/img/${paperLayout.id}-paper.jpg"
                      />
                    </div>
                  </div>
                </a>`;
      })}
            </div>` : T`<div>
              You must pick a paper size before you pick a layout for your page.
            </div>`}
      </div>
    </div>`;
    }
    stepThree() {
      return T`<div class="panel panel-default print-section">
      <div class="panel-heading">
        <h2>3: Print your paper</h2>
      </div>
      <div class="panel-body">
        <div class="row">
          <div class="col-md-8 preview">${paper(false, paperSizes[0])}</div>
          <div class="col-md-4">
            <button class="btn btn-primary btn-block" ng-click="print()">
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
        </div>
      </div>
    </div> `;
    }
    willUpdate(changedProperties) {
      if (changedProperties.has("size")) {
        this.paperSize = paperSizes.find((paperSize) => paperSize.id === this.size);
      }
    }
    render() {
      return T`<div>
      ${paper(true, paperSizes[0])}
      <pq-menu class="d-print-none" active="paper"></pq-menu>

      <div class="container d-print-none">
        ${this.jumbotron()} ${this.adBlock()} ${this.stepOne()}
        ${this.stepTwo()} ${this.stepThree()} ${this.adBlock()}

        <footer>
          <p>© 2021 John Munsch</p>
        </footer>
      </div>
    </div>`;
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
    constructor() {
      super();
      (0, import_page.default)("/about", () => {
        this.renderer = () => T`<about-page></about-page>`;
        this.requestUpdate();
      });
      (0, import_page.default)("/paper/:size?/:layout?", (ctx) => {
        console.log(ctx);
        this.renderer = () => T`<paper-page
          .size="${ctx.params.size}"
          .layout="${ctx.params.layout}"
        ></paper-page>`;
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
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
