(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key2 of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key2) && key2 !== except)
          __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

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
          var key2 = 0;
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
              name: name || key2++,
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
          for (var i5 = 0; i5 < tokens.length; i5++) {
            if (typeof tokens[i5] === "object") {
              matches[i5] = new RegExp("^" + tokens[i5].pattern + "$");
            }
          }
          return function(obj) {
            var path = "";
            var data = obj || {};
            for (var i6 = 0; i6 < tokens.length; i6++) {
              var token = tokens[i6];
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
                  if (!matches[i6].test(segment)) {
                    throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"');
                  }
                  path += (j === 0 ? token.prefix : token.delimiter) + segment;
                }
                continue;
              }
              segment = encodeURIComponent(value);
              if (!matches[i6].test(segment)) {
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
            for (var i5 = 0; i5 < groups.length; i5++) {
              keys.push({
                name: i5,
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
          for (var i5 = 0; i5 < path.length; i5++) {
            parts.push(pathToRegexp(path[i5], keys, options).source);
          }
          var regexp = new RegExp("(?:" + parts.join("|") + ")", flags(options));
          return attachKeys(regexp, keys);
        }
        function stringToRegexp(path, keys, options) {
          var tokens = parse(path);
          var re = tokensToRegExp(tokens, options);
          for (var i5 = 0; i5 < tokens.length; i5++) {
            if (typeof tokens[i5] !== "string") {
              keys.push(tokens[i5]);
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
          for (var i5 = 0; i5 < tokens.length; i5++) {
            var token = tokens[i5];
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
            page2.call(this, from, function(e5) {
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
          var i5 = 0, j = 0, page3 = this;
          function nextExit() {
            var fn = page3.exits[j++];
            if (!fn)
              return nextEnter();
            fn(prev, nextExit);
          }
          function nextEnter() {
            var fn = page3.callbacks[i5++];
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
          for (var i5 = 1; i5 < arguments.length; ++i5) {
            this.exits.push(route.middleware(arguments[i5]));
          }
        };
        Page.prototype.clickHandler = function(e5) {
          if (this._which(e5) !== 1)
            return;
          if (e5.metaKey || e5.ctrlKey || e5.shiftKey)
            return;
          if (e5.defaultPrevented)
            return;
          var el = e5.target;
          var eventPath = e5.path || (e5.composedPath ? e5.composedPath() : null);
          if (eventPath) {
            for (var i5 = 0; i5 < eventPath.length; i5++) {
              if (!eventPath[i5].nodeName)
                continue;
              if (eventPath[i5].nodeName.toUpperCase() !== "A")
                continue;
              if (!eventPath[i5].href)
                continue;
              el = eventPath[i5];
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
          e5.preventDefault();
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
          return function onpopstate(e5) {
            if (!loaded)
              return;
            var page3 = this;
            if (e5.state) {
              var path = e5.state.path;
              page3.replace(path, e5.state);
            } else if (isLocation) {
              var loc = page3._window.location;
              page3.show(loc.pathname + loc.search + loc.hash, void 0, void 0, false);
            }
          };
        }();
        Page.prototype._which = function(e5) {
          e5 = e5 || hasWindow && this._window.event;
          return e5.which == null ? e5.button : e5.which;
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
            for (var i5 = 1; i5 < arguments.length; ++i5) {
              this.callbacks.push(route.middleware(arguments[i5]));
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
          var i5 = path.indexOf("?");
          this.canonicalPath = path;
          var re = new RegExp("^" + escapeRegExp(pageBase));
          this.path = path.replace(re, "") || "/";
          if (hashbang)
            this.path = this.path.replace("#!", "") || "/";
          this.title = hasDocument && window2.document.title;
          this.state = state || {};
          this.state.path = path;
          this.querystring = ~i5 ? _page._decodeURLEncodedURIComponent(path.slice(i5 + 1)) : "";
          this.pathname = _page._decodeURLEncodedURIComponent(~i5 ? path.slice(0, i5) : path);
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
          for (var i5 = 1, len = m2.length; i5 < len; ++i5) {
            var key2 = keys[i5 - 1];
            var val = this.page._decodeURLEncodedURIComponent(m2[i5]);
            if (val !== void 0 || !hasOwnProperty.call(params, key2.name)) {
              params[key2.name] = val;
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
  var n = /* @__PURE__ */ new Map();
  var s = class {
    constructor(t4, n5) {
      if (this._$cssResult$ = true, n5 !== e)
        throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = t4;
    }
    get styleSheet() {
      let e5 = n.get(this.cssText);
      return t && e5 === void 0 && (n.set(this.cssText, e5 = new CSSStyleSheet()), e5.replaceSync(this.cssText)), e5;
    }
    toString() {
      return this.cssText;
    }
  };
  var o = (t4) => new s(typeof t4 == "string" ? t4 : t4 + "", e);
  var i = (e5, n5) => {
    t ? e5.adoptedStyleSheets = n5.map((t4) => t4 instanceof CSSStyleSheet ? t4 : t4.styleSheet) : n5.forEach((t4) => {
      const n6 = document.createElement("style"), s5 = window.litNonce;
      s5 !== void 0 && n6.setAttribute("nonce", s5), n6.textContent = t4.cssText, e5.appendChild(n6);
    });
  };
  var S = t ? (t4) => t4 : (t4) => t4 instanceof CSSStyleSheet ? ((t5) => {
    let e5 = "";
    for (const n5 of t5.cssRules)
      e5 += n5.cssText;
    return o(e5);
  })(t4) : t4;

  // node_modules/@lit/reactive-element/reactive-element.js
  var s2;
  var e2 = window.trustedTypes;
  var r2 = e2 ? e2.emptyScript : "";
  var h = window.reactiveElementPolyfillSupport;
  var o2 = { toAttribute(t4, i5) {
    switch (i5) {
      case Boolean:
        t4 = t4 ? r2 : null;
        break;
      case Object:
      case Array:
        t4 = t4 == null ? t4 : JSON.stringify(t4);
    }
    return t4;
  }, fromAttribute(t4, i5) {
    let s5 = t4;
    switch (i5) {
      case Boolean:
        s5 = t4 !== null;
        break;
      case Number:
        s5 = t4 === null ? null : Number(t4);
        break;
      case Object:
      case Array:
        try {
          s5 = JSON.parse(t4);
        } catch (t5) {
          s5 = null;
        }
    }
    return s5;
  } };
  var n2 = (t4, i5) => i5 !== t4 && (i5 == i5 || t4 == t4);
  var l = { attribute: true, type: String, converter: o2, reflect: false, hasChanged: n2 };
  var a = class extends HTMLElement {
    constructor() {
      super(), this._$Et = /* @__PURE__ */ new Map(), this.isUpdatePending = false, this.hasUpdated = false, this._$Ei = null, this.o();
    }
    static addInitializer(t4) {
      var i5;
      (i5 = this.l) !== null && i5 !== void 0 || (this.l = []), this.l.push(t4);
    }
    static get observedAttributes() {
      this.finalize();
      const t4 = [];
      return this.elementProperties.forEach((i5, s5) => {
        const e5 = this._$Eh(s5, i5);
        e5 !== void 0 && (this._$Eu.set(e5, s5), t4.push(e5));
      }), t4;
    }
    static createProperty(t4, i5 = l) {
      if (i5.state && (i5.attribute = false), this.finalize(), this.elementProperties.set(t4, i5), !i5.noAccessor && !this.prototype.hasOwnProperty(t4)) {
        const s5 = typeof t4 == "symbol" ? Symbol() : "__" + t4, e5 = this.getPropertyDescriptor(t4, s5, i5);
        e5 !== void 0 && Object.defineProperty(this.prototype, t4, e5);
      }
    }
    static getPropertyDescriptor(t4, i5, s5) {
      return { get() {
        return this[i5];
      }, set(e5) {
        const r4 = this[t4];
        this[i5] = e5, this.requestUpdate(t4, r4, s5);
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
      if (t4.finalize(), this.elementProperties = new Map(t4.elementProperties), this._$Eu = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
        const t5 = this.properties, i5 = [...Object.getOwnPropertyNames(t5), ...Object.getOwnPropertySymbols(t5)];
        for (const s5 of i5)
          this.createProperty(s5, t5[s5]);
      }
      return this.elementStyles = this.finalizeStyles(this.styles), true;
    }
    static finalizeStyles(i5) {
      const s5 = [];
      if (Array.isArray(i5)) {
        const e5 = new Set(i5.flat(1 / 0).reverse());
        for (const i6 of e5)
          s5.unshift(S(i6));
      } else
        i5 !== void 0 && s5.push(S(i5));
      return s5;
    }
    static _$Eh(t4, i5) {
      const s5 = i5.attribute;
      return s5 === false ? void 0 : typeof s5 == "string" ? s5 : typeof t4 == "string" ? t4.toLowerCase() : void 0;
    }
    o() {
      var t4;
      this._$Ep = new Promise((t5) => this.enableUpdating = t5), this._$AL = /* @__PURE__ */ new Map(), this._$Em(), this.requestUpdate(), (t4 = this.constructor.l) === null || t4 === void 0 || t4.forEach((t5) => t5(this));
    }
    addController(t4) {
      var i5, s5;
      ((i5 = this._$Eg) !== null && i5 !== void 0 ? i5 : this._$Eg = []).push(t4), this.renderRoot !== void 0 && this.isConnected && ((s5 = t4.hostConnected) === null || s5 === void 0 || s5.call(t4));
    }
    removeController(t4) {
      var i5;
      (i5 = this._$Eg) === null || i5 === void 0 || i5.splice(this._$Eg.indexOf(t4) >>> 0, 1);
    }
    _$Em() {
      this.constructor.elementProperties.forEach((t4, i5) => {
        this.hasOwnProperty(i5) && (this._$Et.set(i5, this[i5]), delete this[i5]);
      });
    }
    createRenderRoot() {
      var t4;
      const s5 = (t4 = this.shadowRoot) !== null && t4 !== void 0 ? t4 : this.attachShadow(this.constructor.shadowRootOptions);
      return i(s5, this.constructor.elementStyles), s5;
    }
    connectedCallback() {
      var t4;
      this.renderRoot === void 0 && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (t4 = this._$Eg) === null || t4 === void 0 || t4.forEach((t5) => {
        var i5;
        return (i5 = t5.hostConnected) === null || i5 === void 0 ? void 0 : i5.call(t5);
      });
    }
    enableUpdating(t4) {
    }
    disconnectedCallback() {
      var t4;
      (t4 = this._$Eg) === null || t4 === void 0 || t4.forEach((t5) => {
        var i5;
        return (i5 = t5.hostDisconnected) === null || i5 === void 0 ? void 0 : i5.call(t5);
      });
    }
    attributeChangedCallback(t4, i5, s5) {
      this._$AK(t4, s5);
    }
    _$ES(t4, i5, s5 = l) {
      var e5, r4;
      const h3 = this.constructor._$Eh(t4, s5);
      if (h3 !== void 0 && s5.reflect === true) {
        const n5 = ((r4 = (e5 = s5.converter) === null || e5 === void 0 ? void 0 : e5.toAttribute) !== null && r4 !== void 0 ? r4 : o2.toAttribute)(i5, s5.type);
        this._$Ei = t4, n5 == null ? this.removeAttribute(h3) : this.setAttribute(h3, n5), this._$Ei = null;
      }
    }
    _$AK(t4, i5) {
      var s5, e5, r4;
      const h3 = this.constructor, n5 = h3._$Eu.get(t4);
      if (n5 !== void 0 && this._$Ei !== n5) {
        const t5 = h3.getPropertyOptions(n5), l4 = t5.converter, a3 = (r4 = (e5 = (s5 = l4) === null || s5 === void 0 ? void 0 : s5.fromAttribute) !== null && e5 !== void 0 ? e5 : typeof l4 == "function" ? l4 : null) !== null && r4 !== void 0 ? r4 : o2.fromAttribute;
        this._$Ei = n5, this[n5] = a3(i5, t5.type), this._$Ei = null;
      }
    }
    requestUpdate(t4, i5, s5) {
      let e5 = true;
      t4 !== void 0 && (((s5 = s5 || this.constructor.getPropertyOptions(t4)).hasChanged || n2)(this[t4], i5) ? (this._$AL.has(t4) || this._$AL.set(t4, i5), s5.reflect === true && this._$Ei !== t4 && (this._$EC === void 0 && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(t4, s5))) : e5 = false), !this.isUpdatePending && e5 && (this._$Ep = this._$E_());
    }
    async _$E_() {
      this.isUpdatePending = true;
      try {
        await this._$Ep;
      } catch (t5) {
        Promise.reject(t5);
      }
      const t4 = this.scheduleUpdate();
      return t4 != null && await t4, !this.isUpdatePending;
    }
    scheduleUpdate() {
      return this.performUpdate();
    }
    performUpdate() {
      var t4;
      if (!this.isUpdatePending)
        return;
      this.hasUpdated, this._$Et && (this._$Et.forEach((t5, i6) => this[i6] = t5), this._$Et = void 0);
      let i5 = false;
      const s5 = this._$AL;
      try {
        i5 = this.shouldUpdate(s5), i5 ? (this.willUpdate(s5), (t4 = this._$Eg) === null || t4 === void 0 || t4.forEach((t5) => {
          var i6;
          return (i6 = t5.hostUpdate) === null || i6 === void 0 ? void 0 : i6.call(t5);
        }), this.update(s5)) : this._$EU();
      } catch (t5) {
        throw i5 = false, this._$EU(), t5;
      }
      i5 && this._$AE(s5);
    }
    willUpdate(t4) {
    }
    _$AE(t4) {
      var i5;
      (i5 = this._$Eg) === null || i5 === void 0 || i5.forEach((t5) => {
        var i6;
        return (i6 = t5.hostUpdated) === null || i6 === void 0 ? void 0 : i6.call(t5);
      }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t4)), this.updated(t4);
    }
    _$EU() {
      this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
    }
    get updateComplete() {
      return this.getUpdateComplete();
    }
    getUpdateComplete() {
      return this._$Ep;
    }
    shouldUpdate(t4) {
      return true;
    }
    update(t4) {
      this._$EC !== void 0 && (this._$EC.forEach((t5, i5) => this._$ES(i5, this[i5], t5)), this._$EC = void 0), this._$EU();
    }
    updated(t4) {
    }
    firstUpdated(t4) {
    }
  };
  a.finalized = true, a.elementProperties = /* @__PURE__ */ new Map(), a.elementStyles = [], a.shadowRootOptions = { mode: "open" }, h == null || h({ ReactiveElement: a }), ((s2 = globalThis.reactiveElementVersions) !== null && s2 !== void 0 ? s2 : globalThis.reactiveElementVersions = []).push("1.3.1");

  // node_modules/lit-html/lit-html.js
  var t2;
  var i2 = globalThis.trustedTypes;
  var s3 = i2 ? i2.createPolicy("lit-html", { createHTML: (t4) => t4 }) : void 0;
  var e3 = `lit$${(Math.random() + "").slice(9)}$`;
  var o3 = "?" + e3;
  var n3 = `<${o3}>`;
  var l2 = document;
  var h2 = (t4 = "") => l2.createComment(t4);
  var r3 = (t4) => t4 === null || typeof t4 != "object" && typeof t4 != "function";
  var d = Array.isArray;
  var u = (t4) => {
    var i5;
    return d(t4) || typeof ((i5 = t4) === null || i5 === void 0 ? void 0 : i5[Symbol.iterator]) == "function";
  };
  var c = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
  var v = /-->/g;
  var a2 = />/g;
  var f = />|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g;
  var _ = /'/g;
  var m = /"/g;
  var g = /^(?:script|style|textarea|title)$/i;
  var p = (t4) => (i5, ...s5) => ({ _$litType$: t4, strings: i5, values: s5 });
  var $ = p(1);
  var y = p(2);
  var b = Symbol.for("lit-noChange");
  var w = Symbol.for("lit-nothing");
  var T = /* @__PURE__ */ new WeakMap();
  var x = (t4, i5, s5) => {
    var e5, o5;
    const n5 = (e5 = s5 == null ? void 0 : s5.renderBefore) !== null && e5 !== void 0 ? e5 : i5;
    let l4 = n5._$litPart$;
    if (l4 === void 0) {
      const t5 = (o5 = s5 == null ? void 0 : s5.renderBefore) !== null && o5 !== void 0 ? o5 : null;
      n5._$litPart$ = l4 = new N(i5.insertBefore(h2(), t5), t5, void 0, s5 != null ? s5 : {});
    }
    return l4._$AI(t4), l4;
  };
  var A = l2.createTreeWalker(l2, 129, null, false);
  var C = (t4, i5) => {
    const o5 = t4.length - 1, l4 = [];
    let h3, r4 = i5 === 2 ? "<svg>" : "", d2 = c;
    for (let i6 = 0; i6 < o5; i6++) {
      const s5 = t4[i6];
      let o6, u3, p2 = -1, $2 = 0;
      for (; $2 < s5.length && (d2.lastIndex = $2, u3 = d2.exec(s5), u3 !== null); )
        $2 = d2.lastIndex, d2 === c ? u3[1] === "!--" ? d2 = v : u3[1] !== void 0 ? d2 = a2 : u3[2] !== void 0 ? (g.test(u3[2]) && (h3 = RegExp("</" + u3[2], "g")), d2 = f) : u3[3] !== void 0 && (d2 = f) : d2 === f ? u3[0] === ">" ? (d2 = h3 != null ? h3 : c, p2 = -1) : u3[1] === void 0 ? p2 = -2 : (p2 = d2.lastIndex - u3[2].length, o6 = u3[1], d2 = u3[3] === void 0 ? f : u3[3] === '"' ? m : _) : d2 === m || d2 === _ ? d2 = f : d2 === v || d2 === a2 ? d2 = c : (d2 = f, h3 = void 0);
      const y2 = d2 === f && t4[i6 + 1].startsWith("/>") ? " " : "";
      r4 += d2 === c ? s5 + n3 : p2 >= 0 ? (l4.push(o6), s5.slice(0, p2) + "$lit$" + s5.slice(p2) + e3 + y2) : s5 + e3 + (p2 === -2 ? (l4.push(void 0), i6) : y2);
    }
    const u2 = r4 + (t4[o5] || "<?>") + (i5 === 2 ? "</svg>" : "");
    if (!Array.isArray(t4) || !t4.hasOwnProperty("raw"))
      throw Error("invalid template strings array");
    return [s3 !== void 0 ? s3.createHTML(u2) : u2, l4];
  };
  var E = class {
    constructor({ strings: t4, _$litType$: s5 }, n5) {
      let l4;
      this.parts = [];
      let r4 = 0, d2 = 0;
      const u2 = t4.length - 1, c2 = this.parts, [v2, a3] = C(t4, s5);
      if (this.el = E.createElement(v2, n5), A.currentNode = this.el.content, s5 === 2) {
        const t5 = this.el.content, i5 = t5.firstChild;
        i5.remove(), t5.append(...i5.childNodes);
      }
      for (; (l4 = A.nextNode()) !== null && c2.length < u2; ) {
        if (l4.nodeType === 1) {
          if (l4.hasAttributes()) {
            const t5 = [];
            for (const i5 of l4.getAttributeNames())
              if (i5.endsWith("$lit$") || i5.startsWith(e3)) {
                const s6 = a3[d2++];
                if (t5.push(i5), s6 !== void 0) {
                  const t6 = l4.getAttribute(s6.toLowerCase() + "$lit$").split(e3), i6 = /([.?@])?(.*)/.exec(s6);
                  c2.push({ type: 1, index: r4, name: i6[2], strings: t6, ctor: i6[1] === "." ? M : i6[1] === "?" ? H : i6[1] === "@" ? I : S2 });
                } else
                  c2.push({ type: 6, index: r4 });
              }
            for (const i5 of t5)
              l4.removeAttribute(i5);
          }
          if (g.test(l4.tagName)) {
            const t5 = l4.textContent.split(e3), s6 = t5.length - 1;
            if (s6 > 0) {
              l4.textContent = i2 ? i2.emptyScript : "";
              for (let i5 = 0; i5 < s6; i5++)
                l4.append(t5[i5], h2()), A.nextNode(), c2.push({ type: 2, index: ++r4 });
              l4.append(t5[s6], h2());
            }
          }
        } else if (l4.nodeType === 8)
          if (l4.data === o3)
            c2.push({ type: 2, index: r4 });
          else {
            let t5 = -1;
            for (; (t5 = l4.data.indexOf(e3, t5 + 1)) !== -1; )
              c2.push({ type: 7, index: r4 }), t5 += e3.length - 1;
          }
        r4++;
      }
    }
    static createElement(t4, i5) {
      const s5 = l2.createElement("template");
      return s5.innerHTML = t4, s5;
    }
  };
  function P(t4, i5, s5 = t4, e5) {
    var o5, n5, l4, h3;
    if (i5 === b)
      return i5;
    let d2 = e5 !== void 0 ? (o5 = s5._$Cl) === null || o5 === void 0 ? void 0 : o5[e5] : s5._$Cu;
    const u2 = r3(i5) ? void 0 : i5._$litDirective$;
    return (d2 == null ? void 0 : d2.constructor) !== u2 && ((n5 = d2 == null ? void 0 : d2._$AO) === null || n5 === void 0 || n5.call(d2, false), u2 === void 0 ? d2 = void 0 : (d2 = new u2(t4), d2._$AT(t4, s5, e5)), e5 !== void 0 ? ((l4 = (h3 = s5)._$Cl) !== null && l4 !== void 0 ? l4 : h3._$Cl = [])[e5] = d2 : s5._$Cu = d2), d2 !== void 0 && (i5 = P(t4, d2._$AS(t4, i5.values), d2, e5)), i5;
  }
  var V = class {
    constructor(t4, i5) {
      this.v = [], this._$AN = void 0, this._$AD = t4, this._$AM = i5;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    p(t4) {
      var i5;
      const { el: { content: s5 }, parts: e5 } = this._$AD, o5 = ((i5 = t4 == null ? void 0 : t4.creationScope) !== null && i5 !== void 0 ? i5 : l2).importNode(s5, true);
      A.currentNode = o5;
      let n5 = A.nextNode(), h3 = 0, r4 = 0, d2 = e5[0];
      for (; d2 !== void 0; ) {
        if (h3 === d2.index) {
          let i6;
          d2.type === 2 ? i6 = new N(n5, n5.nextSibling, this, t4) : d2.type === 1 ? i6 = new d2.ctor(n5, d2.name, d2.strings, this, t4) : d2.type === 6 && (i6 = new L(n5, this, t4)), this.v.push(i6), d2 = e5[++r4];
        }
        h3 !== (d2 == null ? void 0 : d2.index) && (n5 = A.nextNode(), h3++);
      }
      return o5;
    }
    m(t4) {
      let i5 = 0;
      for (const s5 of this.v)
        s5 !== void 0 && (s5.strings !== void 0 ? (s5._$AI(t4, s5, i5), i5 += s5.strings.length - 2) : s5._$AI(t4[i5])), i5++;
    }
  };
  var N = class {
    constructor(t4, i5, s5, e5) {
      var o5;
      this.type = 2, this._$AH = w, this._$AN = void 0, this._$AA = t4, this._$AB = i5, this._$AM = s5, this.options = e5, this._$Cg = (o5 = e5 == null ? void 0 : e5.isConnected) === null || o5 === void 0 || o5;
    }
    get _$AU() {
      var t4, i5;
      return (i5 = (t4 = this._$AM) === null || t4 === void 0 ? void 0 : t4._$AU) !== null && i5 !== void 0 ? i5 : this._$Cg;
    }
    get parentNode() {
      let t4 = this._$AA.parentNode;
      const i5 = this._$AM;
      return i5 !== void 0 && t4.nodeType === 11 && (t4 = i5.parentNode), t4;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t4, i5 = this) {
      t4 = P(this, t4, i5), r3(t4) ? t4 === w || t4 == null || t4 === "" ? (this._$AH !== w && this._$AR(), this._$AH = w) : t4 !== this._$AH && t4 !== b && this.$(t4) : t4._$litType$ !== void 0 ? this.T(t4) : t4.nodeType !== void 0 ? this.k(t4) : u(t4) ? this.S(t4) : this.$(t4);
    }
    M(t4, i5 = this._$AB) {
      return this._$AA.parentNode.insertBefore(t4, i5);
    }
    k(t4) {
      this._$AH !== t4 && (this._$AR(), this._$AH = this.M(t4));
    }
    $(t4) {
      this._$AH !== w && r3(this._$AH) ? this._$AA.nextSibling.data = t4 : this.k(l2.createTextNode(t4)), this._$AH = t4;
    }
    T(t4) {
      var i5;
      const { values: s5, _$litType$: e5 } = t4, o5 = typeof e5 == "number" ? this._$AC(t4) : (e5.el === void 0 && (e5.el = E.createElement(e5.h, this.options)), e5);
      if (((i5 = this._$AH) === null || i5 === void 0 ? void 0 : i5._$AD) === o5)
        this._$AH.m(s5);
      else {
        const t5 = new V(o5, this), i6 = t5.p(this.options);
        t5.m(s5), this.k(i6), this._$AH = t5;
      }
    }
    _$AC(t4) {
      let i5 = T.get(t4.strings);
      return i5 === void 0 && T.set(t4.strings, i5 = new E(t4)), i5;
    }
    S(t4) {
      d(this._$AH) || (this._$AH = [], this._$AR());
      const i5 = this._$AH;
      let s5, e5 = 0;
      for (const o5 of t4)
        e5 === i5.length ? i5.push(s5 = new N(this.M(h2()), this.M(h2()), this, this.options)) : s5 = i5[e5], s5._$AI(o5), e5++;
      e5 < i5.length && (this._$AR(s5 && s5._$AB.nextSibling, e5), i5.length = e5);
    }
    _$AR(t4 = this._$AA.nextSibling, i5) {
      var s5;
      for ((s5 = this._$AP) === null || s5 === void 0 || s5.call(this, false, true, i5); t4 && t4 !== this._$AB; ) {
        const i6 = t4.nextSibling;
        t4.remove(), t4 = i6;
      }
    }
    setConnected(t4) {
      var i5;
      this._$AM === void 0 && (this._$Cg = t4, (i5 = this._$AP) === null || i5 === void 0 || i5.call(this, t4));
    }
  };
  var S2 = class {
    constructor(t4, i5, s5, e5, o5) {
      this.type = 1, this._$AH = w, this._$AN = void 0, this.element = t4, this.name = i5, this._$AM = e5, this.options = o5, s5.length > 2 || s5[0] !== "" || s5[1] !== "" ? (this._$AH = Array(s5.length - 1).fill(new String()), this.strings = s5) : this._$AH = w;
    }
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t4, i5 = this, s5, e5) {
      const o5 = this.strings;
      let n5 = false;
      if (o5 === void 0)
        t4 = P(this, t4, i5, 0), n5 = !r3(t4) || t4 !== this._$AH && t4 !== b, n5 && (this._$AH = t4);
      else {
        const e6 = t4;
        let l4, h3;
        for (t4 = o5[0], l4 = 0; l4 < o5.length - 1; l4++)
          h3 = P(this, e6[s5 + l4], i5, l4), h3 === b && (h3 = this._$AH[l4]), n5 || (n5 = !r3(h3) || h3 !== this._$AH[l4]), h3 === w ? t4 = w : t4 !== w && (t4 += (h3 != null ? h3 : "") + o5[l4 + 1]), this._$AH[l4] = h3;
      }
      n5 && !e5 && this.C(t4);
    }
    C(t4) {
      t4 === w ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t4 != null ? t4 : "");
    }
  };
  var M = class extends S2 {
    constructor() {
      super(...arguments), this.type = 3;
    }
    C(t4) {
      this.element[this.name] = t4 === w ? void 0 : t4;
    }
  };
  var k = i2 ? i2.emptyScript : "";
  var H = class extends S2 {
    constructor() {
      super(...arguments), this.type = 4;
    }
    C(t4) {
      t4 && t4 !== w ? this.element.setAttribute(this.name, k) : this.element.removeAttribute(this.name);
    }
  };
  var I = class extends S2 {
    constructor(t4, i5, s5, e5, o5) {
      super(t4, i5, s5, e5, o5), this.type = 5;
    }
    _$AI(t4, i5 = this) {
      var s5;
      if ((t4 = (s5 = P(this, t4, i5, 0)) !== null && s5 !== void 0 ? s5 : w) === b)
        return;
      const e5 = this._$AH, o5 = t4 === w && e5 !== w || t4.capture !== e5.capture || t4.once !== e5.once || t4.passive !== e5.passive, n5 = t4 !== w && (e5 === w || o5);
      o5 && this.element.removeEventListener(this.name, this, e5), n5 && this.element.addEventListener(this.name, this, t4), this._$AH = t4;
    }
    handleEvent(t4) {
      var i5, s5;
      typeof this._$AH == "function" ? this._$AH.call((s5 = (i5 = this.options) === null || i5 === void 0 ? void 0 : i5.host) !== null && s5 !== void 0 ? s5 : this.element, t4) : this._$AH.handleEvent(t4);
    }
  };
  var L = class {
    constructor(t4, i5, s5) {
      this.element = t4, this.type = 6, this._$AN = void 0, this._$AM = i5, this.options = s5;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t4) {
      P(this, t4);
    }
  };
  var z = window.litHtmlPolyfillSupport;
  z == null || z(E, N), ((t2 = globalThis.litHtmlVersions) !== null && t2 !== void 0 ? t2 : globalThis.litHtmlVersions = []).push("2.2.2");

  // node_modules/lit-element/lit-element.js
  var l3;
  var o4;
  var s4 = class extends a {
    constructor() {
      super(...arguments), this.renderOptions = { host: this }, this._$Dt = void 0;
    }
    createRenderRoot() {
      var t4, e5;
      const i5 = super.createRenderRoot();
      return (t4 = (e5 = this.renderOptions).renderBefore) !== null && t4 !== void 0 || (e5.renderBefore = i5.firstChild), i5;
    }
    update(t4) {
      const i5 = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t4), this._$Dt = x(i5, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
      var t4;
      super.connectedCallback(), (t4 = this._$Dt) === null || t4 === void 0 || t4.setConnected(true);
    }
    disconnectedCallback() {
      var t4;
      super.disconnectedCallback(), (t4 = this._$Dt) === null || t4 === void 0 || t4.setConnected(false);
    }
    render() {
      return b;
    }
  };
  s4.finalized = true, s4._$litElement$ = true, (l3 = globalThis.litElementHydrateSupport) === null || l3 === void 0 || l3.call(globalThis, { LitElement: s4 });
  var n4 = globalThis.litElementPolyfillSupport;
  n4 == null || n4({ LitElement: s4 });
  ((o4 = globalThis.litElementVersions) !== null && o4 !== void 0 ? o4 : globalThis.litElementVersions = []).push("3.2.0");

  // public/js/main.js
  var import_page = __toESM(require_page());

  // public/js/pq-adblock.js
  var PaperQuikAdblock = class extends s4 {
    static get it() {
      return "pq-adblock";
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
      return $`<div class="panel panel-default">
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
    </div>`;
    }
    firstUpdated() {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    }
  };
  customElements.define(PaperQuikAdblock.it, PaperQuikAdblock);

  // public/js/pq-footer.js
  var PaperQuikFooter = class extends s4 {
    static get it() {
      return "pq-footer";
    }
    static get properties() {
      return { name: { type: String } };
    }
    constructor() {
      super();
    }
    createRenderRoot() {
      return this;
    }
    render() {
      return $`<footer>
      <small>&copy; Copyright 2022, John Munsch</small>
    </footer> `;
    }
  };
  customElements.define(PaperQuikFooter.it, PaperQuikFooter);

  // public/js/pages/about-page.component.js
  var AboutPage = class extends s4 {
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
      return $`<pq-menu active="about"></pq-menu>
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
      </div>`;
    }
  };
  customElements.define(AboutPage.it, AboutPage);

  // public/js/generation/sizes.js
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

  // public/js/generation/paper-generation.js
  var halfInch = 12.131895;
  function calculateBoxes(paperSize, margins) {
    const gap = 2.5;
    const backgroundBox = {
      x: 0,
      y: 0,
      width: paperSize.width,
      height: paperSize.height
    };
    const headerBox = {
      x: margins.left,
      y: margins.top,
      width: paperSize.width - (margins.left + margins.right),
      height: 15
    };
    const footerBox = {
      x: margins.left,
      y: paperSize.height - margins.bottom - 2,
      width: paperSize.width - (margins.left + margins.right),
      height: 2
    };
    const bodyBox = {
      x: margins.left,
      y: margins.top + headerBox.height + gap,
      width: paperSize.width - (margins.left + margins.right),
      height: paperSize.height - (margins.top + headerBox.height + gap + footerBox.height + margins.bottom)
    };
    return {
      backgroundBox,
      headerBox,
      bodyBox,
      footerBox
    };
  }
  function background(backgroundBox) {
    return y`<rect class="background"
    style="fill-rule:evenodd;"
    width="${backgroundBox.width}"
    height="${backgroundBox.height}"
    x="${backgroundBox.x}"
    y="${backgroundBox.y}"
  />`;
  }
  function header(headerBox) {
    return y`<rect style="fill: none;fill-rule:evenodd;"
                   width="${headerBox.width}"
                   height="${headerBox.height}"
                   x="${headerBox.x}"
                   y="${headerBox.y}"/>
    <line x1="${headerBox.x}" y1="${headerBox.y}"
          x2="${headerBox.x + headerBox.width}"
          y2="${headerBox.y}"
          stroke="black" stroke-width="0.1"/>
    <line x1="${headerBox.x}" y1="${headerBox.y + headerBox.height}"
          x2="${headerBox.x + headerBox.width}"
          y2="${headerBox.y + headerBox.height}"
          stroke="black" stroke-width="0.1" />
    <line x1="${headerBox.x + headerBox.width * 0.2}"
          y1="${headerBox.y + 1}"
          x2="${headerBox.x + headerBox.width * 0.2}"
          y2="${headerBox.y + headerBox.height - 1}"
          stroke="black" stroke-width="0.1" />
    <text
       style="font-size:0.6mm;font-family:Lato;fill:#000000;"
       x="${headerBox.x + 2}"
       y="${headerBox.y + 3}">Date/Number</text>
    <text
       style="font-size:0.6mm;
       font-family:Lato;fill:#000000;"
       x="${headerBox.x + headerBox.width * 0.2 + 2}"
       y="${headerBox.y + 3}">Title/Subject</text>`;
  }
  function dotGrid(bodyBox, rows, cols) {
    return y`${rows.map((row) => {
      return cols.map((col) => y`<circle cx="${bodyBox.x + col}"
                        cy="${bodyBox.y + row}" r=".2"/>`);
    })}`;
  }
  function ruledLines(bodyBox, rows) {
    return y`${rows.map((row) => y`<line x1="${bodyBox.x}"
          y1="${bodyBox.y + row}"
          x2="${bodyBox.x + bodyBox.width}"
          y2="${bodyBox.y + row}"
          stroke="black" stroke-width="0.1" />`)}`;
  }
  function squareGraphColumns(bodyBox, cols) {
    return y`${cols.map((col) => y`<line x1="${bodyBox.x + col}"
          y1="${bodyBox.y}"
          x2="${bodyBox.x + col}"
          y2="${bodyBox.y + bodyBox.height}"
          stroke="black" stroke-width="0.1" />`)}`;
  }
  function bodyLayout(bodyBox, layout) {
    const rowHeight = 5;
    const colWidth = 5;
    let rows = [];
    let cols = [];
    let row = rowHeight;
    while (row + rowHeight < bodyBox.height) {
      rows.push(row);
      row += rowHeight;
    }
    let col = 0;
    let adjustment = (bodyBox.width % colWidth + colWidth) / 2;
    while (col + adjustment < bodyBox.width) {
      cols.push(col + adjustment);
      col += colWidth;
    }
    switch (layout) {
      case "blank":
        return y``;
      case "dot-grid":
        return dotGrid(bodyBox, rows, cols);
      case "dotted-ruled-lines":
        return y`${dotGrid(bodyBox, rows, cols)}${ruledLines(bodyBox, rows)}`;
      case "ruled-lines":
        return ruledLines(bodyBox, rows);
      case "square-graph":
        return y`${ruledLines(bodyBox, rows)}
      ${squareGraphColumns(bodyBox, cols)}`;
    }
  }
  function body(bodyBox, layout) {
    return y`
    <rect
      style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:0.1;"
      width="${bodyBox.width}"
      height="${bodyBox.height}"
      x="${bodyBox.x}"
      y="${bodyBox.y}"
    />
    ${bodyLayout(bodyBox, layout)}`;
  }
  function footer(footerBox) {
    return y`<rect style="fill:none;fill-rule:evenodd;"
                   width="${footerBox.width}"
                   height="${footerBox.height}"
                   x="${footerBox.x}"
                   y="${footerBox.y}" />
  <text text-anchor="end"
        x="${footerBox.x + footerBox.width}"
        y="${footerBox.y + footerBox.height}" class="logo">
  PAPERQUIK.com</text>`;
  }
  function paper(print, paperSize, layout) {
    if (!paperSize) {
      return y``;
    }
    const margins = {
      top: halfInch,
      right: halfInch,
      bottom: halfInch,
      left: halfInch
    };
    let { backgroundBox, headerBox, bodyBox, footerBox } = calculateBoxes(paperSize, margins);
    return y`
    <svg
      class="${print ? "d-none d-print-block" : "preview"}"
      width="${paperSize.width}mm"
      height="${paperSize.height}mm"
      viewBox="0 0 ${paperSize.width} ${paperSize.height}"
      version="1.1"
    >
      <g>
        ${background(backgroundBox)}
        ${header(headerBox)}
        ${body(bodyBox, layout)}
        ${footer(footerBox)}
      </g>
    </svg>`;
  }
  function getDayNames(locale = "en", format = "long") {
    const formatter = new Intl.DateTimeFormat(locale, {
      weekday: format,
      timeZone: "UTC"
    });
    const days = [1, 2, 3, 4, 5, 6, 7].map((day) => {
      const dd = day < 10 ? `0${day}` : day;
      return new Date(`2017-01-${dd}T00:00:00+00:00`);
    });
    return days.map((date) => formatter.format(date));
  }
  function getMonthNames(locale = "en", format = "long") {
    const formatter = new Intl.DateTimeFormat(locale, {
      month: format,
      timeZone: "UTC"
    });
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => {
      const mm = month < 10 ? `0${month}` : month;
      return new Date(`2017-${mm}-01T00:00:00+00:00`);
    });
    return months.map((date) => formatter.format(date));
  }
  var preferredLanguage = navigator.language;
  console.log(preferredLanguage);
  console.log(getDayNames(preferredLanguage));
  console.log(getMonthNames(preferredLanguage));
  console.log(getDayNames("es"));
  console.log(getMonthNames("es"));
  console.log(getDayNames("fr"));
  console.log(getMonthNames("fr"));

  // public/js/pq-jumbotron.js
  var key = "pq-jumbotron";
  var PaperQuikJumbotron = class extends s4 {
    static get it() {
      return "pq-jumbotron";
    }
    static get properties() {
      return { show: { type: Boolean } };
    }
    constructor() {
      super();
    }
    hide() {
      this.show = false;
      window.localStorage.setItem(key, "false");
    }
    createRenderRoot() {
      return this;
    }
    render() {
      if (!((window.localStorage.getItem(key) ?? "true") === "true")) {
        return $``;
      }
      return $`<div class="panel jumbotron">
      <h1>The Paper You Need - Available Right Away</h1>
      <p></p>
      <p>
        <button class="btn btn-primary btn-lg" @click="${this.hide}">
          Get Started
        </button>
      </p>
    </div>`;
    }
  };
  customElements.define(PaperQuikJumbotron.it, PaperQuikJumbotron);

  // node_modules/lit-html/directive.js
  var t3 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
  var e4 = (t4) => (...e5) => ({ _$litDirective$: t4, values: e5 });
  var i3 = class {
    constructor(t4) {
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AT(t4, e5, i5) {
      this._$Ct = t4, this._$AM = e5, this._$Ci = i5;
    }
    _$AS(t4, e5) {
      return this.update(t4, e5);
    }
    update(t4, e5) {
      return this.render(...e5);
    }
  };

  // node_modules/lit-html/directives/style-map.js
  var i4 = e4(class extends i3 {
    constructor(t4) {
      var e5;
      if (super(t4), t4.type !== t3.ATTRIBUTE || t4.name !== "style" || ((e5 = t4.strings) === null || e5 === void 0 ? void 0 : e5.length) > 2)
        throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
    }
    render(t4) {
      return Object.keys(t4).reduce((e5, r4) => {
        const s5 = t4[r4];
        return s5 == null ? e5 : e5 + `${r4 = r4.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s5};`;
      }, "");
    }
    update(e5, [r4]) {
      const { style: s5 } = e5.element;
      if (this.ct === void 0) {
        this.ct = /* @__PURE__ */ new Set();
        for (const t4 in r4)
          this.ct.add(t4);
        return this.render(r4);
      }
      this.ct.forEach((t4) => {
        r4[t4] == null && (this.ct.delete(t4), t4.includes("-") ? s5.removeProperty(t4) : s5[t4] = "");
      });
      for (const t4 in r4) {
        const e6 = r4[t4];
        e6 != null && (this.ct.add(t4), t4.includes("-") ? s5.setProperty(t4, e6) : s5[t4] = e6);
      }
      return b;
    }
  });

  // public/js/pq-step-one.js
  var PaperQuikStepOne = class extends s4 {
    static get it() {
      return "pq-step-one";
    }
    static get properties() {
      return { size: { type: String } };
    }
    constructor() {
      super();
    }
    createRenderRoot() {
      return this;
    }
    paperIconStyle(paperSize) {
      return {
        width: `${paperSize.width / 2.8}px`,
        height: `${paperSize.height / 2.8}px`
      };
    }
    render() {
      return $`<div class="panel panel-default size-section">
      <div class="panel-heading">
        <h2>1: Pick a paper size</h2>
      </div>
      <div class="panel-body">
        ${paperSizes.map((paperSize) => {
        return $`<a href="/paper/${paperSize.id}">
            <div
              class="paperIcon ${paperSize.id === this.size ? "selected" : "notSelected"}"
              style="${i4(this.paperIconStyle(paperSize))}"
            >
              <span class="paperName">${paperSize.name}</span>
            </div>
          </a>`;
      })}
      </div>
    </div>`;
    }
  };
  customElements.define(PaperQuikStepOne.it, PaperQuikStepOne);

  // public/js/generation/layouts.js
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

  // public/js/pq-step-two.js
  var PaperQuikStepTwo = class extends s4 {
    static get it() {
      return "pq-step-two";
    }
    static get properties() {
      return { size: { type: String }, layout: { type: String } };
    }
    constructor() {
      super();
    }
    createRenderRoot() {
      return this;
    }
    render() {
      return $` <div class="panel panel-default layout-section">
      <div class="panel-heading">
        <h2>
          2: Pick a layout
          ${this.paperSize ? `for ${this.paperSize.name} size paper` : ""}
        </h2>
      </div>
      <div class="panel-body">
        ${this.size ? $` <div class="layouts-wrapper">
              ${paperLayouts.map((paperLayout) => {
        return $`<a href="/paper/${this.size}/${paperLayout.id}">
                  <div
                    class="layoutIcon ${paperLayout.id === this.layout ? "selected" : "notSelected"}"
                  >
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
            </div>` : $`<div>
              You must pick a paper size before you pick a layout for your page.
            </div>`}
      </div>
    </div>`;
    }
  };
  customElements.define(PaperQuikStepTwo.it, PaperQuikStepTwo);

  // public/js/pq-step-three.js
  var PaperQuikStepThree = class extends s4 {
    static get it() {
      return "pq-step-three";
    }
    static get properties() {
      return {
        size: { type: String },
        layout: { type: String },
        paperSize: { type: Object }
      };
    }
    constructor() {
      super();
    }
    printModal() {
      var myModal = new bootstrap.Modal(document.getElementById("exampleModal"), {});
      myModal.show();
    }
    print() {
      var myModal = new bootstrap.Modal(document.getElementById("exampleModal"), {});
      myModal.hide();
      window.print();
    }
    createRenderRoot() {
      return this;
    }
    modal() {
      return $` <!-- Modal -->
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
      </div>`;
    }
    render() {
      return $`<div class="panel panel-default print-section">
        <div class="panel-heading">
          <h2>3: Print your paper</h2>
        </div>
        <div class="panel-body">
          ${this.size && this.layout ? $`<div class="row">
                <div class="col-md-8 preview">
                  ${paper(false, this.paperSize, this.layout)}
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
              </div>` : $`<div>
                You must pick a paper size and layout before you can print your
                page.
              </div>`}
        </div>
      </div>
      ${this.modal()}`;
    }
  };
  customElements.define(PaperQuikStepThree.it, PaperQuikStepThree);

  // public/js/pq-menu.js
  var PaperQuikMenu = class extends s4 {
    static get it() {
      return "pq-menu";
    }
    static get properties() {
      return { active: String };
    }
    constructor() {
      super();
    }
    createRenderRoot() {
      return this;
    }
    render() {
      return $`<nav class="navbar navbar-expand-lg navbar-dark">
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

  // public/js/pages/paper-page.component.js
  var PaperPage = class extends s4 {
    static get it() {
      return "paper-page";
    }
    static get properties() {
      return {
        layout: { type: String },
        size: { type: String },
        showJumbotron: { state: true, type: Boolean }
      };
    }
    constructor() {
      super();
      this.paperSize = null;
      this.showJumbotron = true;
    }
    createRenderRoot() {
      return this;
    }
    willUpdate(changedProperties) {
      if (changedProperties.has("size")) {
        this.paperSize = paperSizes.find((paperSize) => paperSize.id === this.size);
      }
    }
    render() {
      return $`<div>
      ${paper(true, this.paperSize, this.layout)}
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
    </div>`;
    }
  };
  customElements.define(PaperPage.it, PaperPage);

  // public/js/main.js
  var PaperQuikApp = class extends s4 {
    static get it() {
      return "paperquik-app";
    }
    static get properties() {
      return {};
    }
    constructor() {
      super();
      this.renderer = () => {
        return $``;
      };
      (0, import_page.default)("/about", () => {
        this.renderer = () => $`<about-page></about-page>`;
        this.requestUpdate();
      });
      (0, import_page.default)("/paper/:size?/:layout?", (ctx) => {
        this.renderer = () => $`<paper-page
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
//# sourceMappingURL=bundle.js.map
