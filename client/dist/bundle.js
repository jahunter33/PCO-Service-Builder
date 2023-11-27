(() => {
  var t = {
      98: (t, e, r) => {
        var n =
            ("undefined" != typeof globalThis && globalThis) ||
            ("undefined" != typeof self && self) ||
            (void 0 !== r.g && r.g),
          o = (function () {
            function t() {
              (this.fetch = !1), (this.DOMException = n.DOMException);
            }
            return (t.prototype = n), new t();
          })();
        !(function (t) {
          !(function (e) {
            var r =
                (void 0 !== t && t) ||
                ("undefined" != typeof self && self) ||
                (void 0 !== r && r),
              n = "URLSearchParams" in r,
              o = "Symbol" in r && "iterator" in Symbol,
              i =
                "FileReader" in r &&
                "Blob" in r &&
                (function () {
                  try {
                    return new Blob(), !0;
                  } catch (t) {
                    return !1;
                  }
                })(),
              s = "FormData" in r,
              a = "ArrayBuffer" in r;
            if (a)
              var c = [
                  "[object Int8Array]",
                  "[object Uint8Array]",
                  "[object Uint8ClampedArray]",
                  "[object Int16Array]",
                  "[object Uint16Array]",
                  "[object Int32Array]",
                  "[object Uint32Array]",
                  "[object Float32Array]",
                  "[object Float64Array]",
                ],
                u =
                  ArrayBuffer.isView ||
                  function (t) {
                    return (
                      t && c.indexOf(Object.prototype.toString.call(t)) > -1
                    );
                  };
            function d(t) {
              if (
                ("string" != typeof t && (t = String(t)),
                /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(t) || "" === t)
              )
                throw new TypeError(
                  'Invalid character in header field name: "' + t + '"'
                );
              return t.toLowerCase();
            }
            function h(t) {
              return "string" != typeof t && (t = String(t)), t;
            }
            function l(t) {
              var e = {
                next: function () {
                  var e = t.shift();
                  return { done: void 0 === e, value: e };
                },
              };
              return (
                o &&
                  (e[Symbol.iterator] = function () {
                    return e;
                  }),
                e
              );
            }
            function f(t) {
              (this.map = {}),
                t instanceof f
                  ? t.forEach(function (t, e) {
                      this.append(e, t);
                    }, this)
                  : Array.isArray(t)
                  ? t.forEach(function (t) {
                      this.append(t[0], t[1]);
                    }, this)
                  : t &&
                    Object.getOwnPropertyNames(t).forEach(function (e) {
                      this.append(e, t[e]);
                    }, this);
            }
            function p(t) {
              if (t.bodyUsed)
                return Promise.reject(new TypeError("Already read"));
              t.bodyUsed = !0;
            }
            function y(t) {
              return new Promise(function (e, r) {
                (t.onload = function () {
                  e(t.result);
                }),
                  (t.onerror = function () {
                    r(t.error);
                  });
              });
            }
            function b(t) {
              var e = new FileReader(),
                r = y(e);
              return e.readAsArrayBuffer(t), r;
            }
            function m(t) {
              if (t.slice) return t.slice(0);
              var e = new Uint8Array(t.byteLength);
              return e.set(new Uint8Array(t)), e.buffer;
            }
            function v() {
              return (
                (this.bodyUsed = !1),
                (this._initBody = function (t) {
                  var e;
                  (this.bodyUsed = this.bodyUsed),
                    (this._bodyInit = t),
                    t
                      ? "string" == typeof t
                        ? (this._bodyText = t)
                        : i && Blob.prototype.isPrototypeOf(t)
                        ? (this._bodyBlob = t)
                        : s && FormData.prototype.isPrototypeOf(t)
                        ? (this._bodyFormData = t)
                        : n && URLSearchParams.prototype.isPrototypeOf(t)
                        ? (this._bodyText = t.toString())
                        : a &&
                          i &&
                          (e = t) &&
                          DataView.prototype.isPrototypeOf(e)
                        ? ((this._bodyArrayBuffer = m(t.buffer)),
                          (this._bodyInit = new Blob([this._bodyArrayBuffer])))
                        : a && (ArrayBuffer.prototype.isPrototypeOf(t) || u(t))
                        ? (this._bodyArrayBuffer = m(t))
                        : (this._bodyText = t =
                            Object.prototype.toString.call(t))
                      : (this._bodyText = ""),
                    this.headers.get("content-type") ||
                      ("string" == typeof t
                        ? this.headers.set(
                            "content-type",
                            "text/plain;charset=UTF-8"
                          )
                        : this._bodyBlob && this._bodyBlob.type
                        ? this.headers.set("content-type", this._bodyBlob.type)
                        : n &&
                          URLSearchParams.prototype.isPrototypeOf(t) &&
                          this.headers.set(
                            "content-type",
                            "application/x-www-form-urlencoded;charset=UTF-8"
                          ));
                }),
                i &&
                  ((this.blob = function () {
                    var t = p(this);
                    if (t) return t;
                    if (this._bodyBlob) return Promise.resolve(this._bodyBlob);
                    if (this._bodyArrayBuffer)
                      return Promise.resolve(new Blob([this._bodyArrayBuffer]));
                    if (this._bodyFormData)
                      throw new Error("could not read FormData body as blob");
                    return Promise.resolve(new Blob([this._bodyText]));
                  }),
                  (this.arrayBuffer = function () {
                    return this._bodyArrayBuffer
                      ? p(this) ||
                          (ArrayBuffer.isView(this._bodyArrayBuffer)
                            ? Promise.resolve(
                                this._bodyArrayBuffer.buffer.slice(
                                  this._bodyArrayBuffer.byteOffset,
                                  this._bodyArrayBuffer.byteOffset +
                                    this._bodyArrayBuffer.byteLength
                                )
                              )
                            : Promise.resolve(this._bodyArrayBuffer))
                      : this.blob().then(b);
                  })),
                (this.text = function () {
                  var t,
                    e,
                    r,
                    n = p(this);
                  if (n) return n;
                  if (this._bodyBlob)
                    return (
                      (t = this._bodyBlob),
                      (r = y((e = new FileReader()))),
                      e.readAsText(t),
                      r
                    );
                  if (this._bodyArrayBuffer)
                    return Promise.resolve(
                      (function (t) {
                        for (
                          var e = new Uint8Array(t),
                            r = new Array(e.length),
                            n = 0;
                          n < e.length;
                          n++
                        )
                          r[n] = String.fromCharCode(e[n]);
                        return r.join("");
                      })(this._bodyArrayBuffer)
                    );
                  if (this._bodyFormData)
                    throw new Error("could not read FormData body as text");
                  return Promise.resolve(this._bodyText);
                }),
                s &&
                  (this.formData = function () {
                    return this.text().then(E);
                  }),
                (this.json = function () {
                  return this.text().then(JSON.parse);
                }),
                this
              );
            }
            (f.prototype.append = function (t, e) {
              (t = d(t)), (e = h(e));
              var r = this.map[t];
              this.map[t] = r ? r + ", " + e : e;
            }),
              (f.prototype.delete = function (t) {
                delete this.map[d(t)];
              }),
              (f.prototype.get = function (t) {
                return (t = d(t)), this.has(t) ? this.map[t] : null;
              }),
              (f.prototype.has = function (t) {
                return this.map.hasOwnProperty(d(t));
              }),
              (f.prototype.set = function (t, e) {
                this.map[d(t)] = h(e);
              }),
              (f.prototype.forEach = function (t, e) {
                for (var r in this.map)
                  this.map.hasOwnProperty(r) && t.call(e, this.map[r], r, this);
              }),
              (f.prototype.keys = function () {
                var t = [];
                return (
                  this.forEach(function (e, r) {
                    t.push(r);
                  }),
                  l(t)
                );
              }),
              (f.prototype.values = function () {
                var t = [];
                return (
                  this.forEach(function (e) {
                    t.push(e);
                  }),
                  l(t)
                );
              }),
              (f.prototype.entries = function () {
                var t = [];
                return (
                  this.forEach(function (e, r) {
                    t.push([r, e]);
                  }),
                  l(t)
                );
              }),
              o && (f.prototype[Symbol.iterator] = f.prototype.entries);
            var w = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
            function g(t, e) {
              if (!(this instanceof g))
                throw new TypeError(
                  'Please use the "new" operator, this DOM object constructor cannot be called as a function.'
                );
              var r,
                n,
                o = (e = e || {}).body;
              if (t instanceof g) {
                if (t.bodyUsed) throw new TypeError("Already read");
                (this.url = t.url),
                  (this.credentials = t.credentials),
                  e.headers || (this.headers = new f(t.headers)),
                  (this.method = t.method),
                  (this.mode = t.mode),
                  (this.signal = t.signal),
                  o ||
                    null == t._bodyInit ||
                    ((o = t._bodyInit), (t.bodyUsed = !0));
              } else this.url = String(t);
              if (
                ((this.credentials =
                  e.credentials || this.credentials || "same-origin"),
                (!e.headers && this.headers) ||
                  (this.headers = new f(e.headers)),
                (this.method =
                  ((n = (r = e.method || this.method || "GET").toUpperCase()),
                  w.indexOf(n) > -1 ? n : r)),
                (this.mode = e.mode || this.mode || null),
                (this.signal = e.signal || this.signal),
                (this.referrer = null),
                ("GET" === this.method || "HEAD" === this.method) && o)
              )
                throw new TypeError(
                  "Body not allowed for GET or HEAD requests"
                );
              if (
                (this._initBody(o),
                !(
                  ("GET" !== this.method && "HEAD" !== this.method) ||
                  ("no-store" !== e.cache && "no-cache" !== e.cache)
                ))
              ) {
                var i = /([?&])_=[^&]*/;
                i.test(this.url)
                  ? (this.url = this.url.replace(
                      i,
                      "$1_=" + new Date().getTime()
                    ))
                  : (this.url +=
                      (/\?/.test(this.url) ? "&" : "?") +
                      "_=" +
                      new Date().getTime());
              }
            }
            function E(t) {
              var e = new FormData();
              return (
                t
                  .trim()
                  .split("&")
                  .forEach(function (t) {
                    if (t) {
                      var r = t.split("="),
                        n = r.shift().replace(/\+/g, " "),
                        o = r.join("=").replace(/\+/g, " ");
                      e.append(decodeURIComponent(n), decodeURIComponent(o));
                    }
                  }),
                e
              );
            }
            function _(t, e) {
              if (!(this instanceof _))
                throw new TypeError(
                  'Please use the "new" operator, this DOM object constructor cannot be called as a function.'
                );
              e || (e = {}),
                (this.type = "default"),
                (this.status = void 0 === e.status ? 200 : e.status),
                (this.ok = this.status >= 200 && this.status < 300),
                (this.statusText =
                  void 0 === e.statusText ? "" : "" + e.statusText),
                (this.headers = new f(e.headers)),
                (this.url = e.url || ""),
                this._initBody(t);
            }
            (g.prototype.clone = function () {
              return new g(this, { body: this._bodyInit });
            }),
              v.call(g.prototype),
              v.call(_.prototype),
              (_.prototype.clone = function () {
                return new _(this._bodyInit, {
                  status: this.status,
                  statusText: this.statusText,
                  headers: new f(this.headers),
                  url: this.url,
                });
              }),
              (_.error = function () {
                var t = new _(null, { status: 0, statusText: "" });
                return (t.type = "error"), t;
              });
            var T = [301, 302, 303, 307, 308];
            (_.redirect = function (t, e) {
              if (-1 === T.indexOf(e))
                throw new RangeError("Invalid status code");
              return new _(null, { status: e, headers: { location: t } });
            }),
              (e.DOMException = r.DOMException);
            try {
              new e.DOMException();
            } catch (t) {
              (e.DOMException = function (t, e) {
                (this.message = t), (this.name = e);
                var r = Error(t);
                this.stack = r.stack;
              }),
                (e.DOMException.prototype = Object.create(Error.prototype)),
                (e.DOMException.prototype.constructor = e.DOMException);
            }
            function A(t, n) {
              return new Promise(function (o, s) {
                var c = new g(t, n);
                if (c.signal && c.signal.aborted)
                  return s(new e.DOMException("Aborted", "AbortError"));
                var u = new XMLHttpRequest();
                function d() {
                  u.abort();
                }
                (u.onload = function () {
                  var t,
                    e,
                    r = {
                      status: u.status,
                      statusText: u.statusText,
                      headers:
                        ((t = u.getAllResponseHeaders() || ""),
                        (e = new f()),
                        t
                          .replace(/\r?\n[\t ]+/g, " ")
                          .split("\r")
                          .map(function (t) {
                            return 0 === t.indexOf("\n")
                              ? t.substr(1, t.length)
                              : t;
                          })
                          .forEach(function (t) {
                            var r = t.split(":"),
                              n = r.shift().trim();
                            if (n) {
                              var o = r.join(":").trim();
                              e.append(n, o);
                            }
                          }),
                        e),
                    };
                  r.url =
                    "responseURL" in u
                      ? u.responseURL
                      : r.headers.get("X-Request-URL");
                  var n = "response" in u ? u.response : u.responseText;
                  setTimeout(function () {
                    o(new _(n, r));
                  }, 0);
                }),
                  (u.onerror = function () {
                    setTimeout(function () {
                      s(new TypeError("Network request failed"));
                    }, 0);
                  }),
                  (u.ontimeout = function () {
                    setTimeout(function () {
                      s(new TypeError("Network request failed"));
                    }, 0);
                  }),
                  (u.onabort = function () {
                    setTimeout(function () {
                      s(new e.DOMException("Aborted", "AbortError"));
                    }, 0);
                  }),
                  u.open(
                    c.method,
                    (function (t) {
                      try {
                        return "" === t && r.location.href
                          ? r.location.href
                          : t;
                      } catch (e) {
                        return t;
                      }
                    })(c.url),
                    !0
                  ),
                  "include" === c.credentials
                    ? (u.withCredentials = !0)
                    : "omit" === c.credentials && (u.withCredentials = !1),
                  "responseType" in u &&
                    (i
                      ? (u.responseType = "blob")
                      : a &&
                        c.headers.get("Content-Type") &&
                        -1 !==
                          c.headers
                            .get("Content-Type")
                            .indexOf("application/octet-stream") &&
                        (u.responseType = "arraybuffer")),
                  !n || "object" != typeof n.headers || n.headers instanceof f
                    ? c.headers.forEach(function (t, e) {
                        u.setRequestHeader(e, t);
                      })
                    : Object.getOwnPropertyNames(n.headers).forEach(function (
                        t
                      ) {
                        u.setRequestHeader(t, h(n.headers[t]));
                      }),
                  c.signal &&
                    (c.signal.addEventListener("abort", d),
                    (u.onreadystatechange = function () {
                      4 === u.readyState &&
                        c.signal.removeEventListener("abort", d);
                    })),
                  u.send(void 0 === c._bodyInit ? null : c._bodyInit);
              });
            }
            (A.polyfill = !0),
              r.fetch ||
                ((r.fetch = A),
                (r.Headers = f),
                (r.Request = g),
                (r.Response = _)),
              (e.Headers = f),
              (e.Request = g),
              (e.Response = _),
              (e.fetch = A);
          })({});
        })(o),
          (o.fetch.ponyfill = !0),
          delete o.fetch.polyfill;
        var i = n.fetch ? n : o;
        ((e = i.fetch).default = i.fetch),
          (e.fetch = i.fetch),
          (e.Headers = i.Headers),
          (e.Request = i.Request),
          (e.Response = i.Response),
          (t.exports = e);
      },
      188: function (t, e, r) {
        "use strict";
        var n =
          (this && this.__awaiter) ||
          function (t, e, r, n) {
            return new (r || (r = Promise))(function (o, i) {
              function s(t) {
                try {
                  c(n.next(t));
                } catch (t) {
                  i(t);
                }
              }
              function a(t) {
                try {
                  c(n.throw(t));
                } catch (t) {
                  i(t);
                }
              }
              function c(t) {
                var e;
                t.done
                  ? o(t.value)
                  : ((e = t.value),
                    e instanceof r
                      ? e
                      : new r(function (t) {
                          t(e);
                        })).then(s, a);
              }
              c((n = n.apply(t, e || [])).next());
            });
          };
        Object.defineProperty(e, "__esModule", { value: !0 });
        const o = r(240),
          i = r(449),
          s = { date: "" };
        function a(t) {
          return new Date(t).toISOString().split("T")[0];
        }
        function c(t) {
          return t.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
        document.addEventListener("DOMContentLoaded", () => {
          (function () {
            let t = new Date(),
              e = t.getFullYear(),
              r = t.getMonth();
            const n = document.querySelector(".calendar-dates"),
              o = document.querySelector(".calendar-current-date"),
              i = document.querySelectorAll(".calendar-navigation span"),
              a = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ],
              u = () => {
                let i = new Date(e, r, 1).getDay(),
                  u = new Date(e, r + 1, 0).getDate(),
                  d = new Date(e, r, u).getDay(),
                  h = new Date(e, r, 0).getDate(),
                  l = [];
                for (let t = i; t > 0; t--)
                  l.push(`<td class="inactive">${h - t + 1}</td>`);
                for (let n = 1; n <= u; n++) {
                  const o = () =>
                    n === t.getDate() &&
                    r === new Date().getMonth() &&
                    e === new Date().getFullYear()
                      ? "today-active"
                      : "active";
                  l.push(`<td class="${o()}">${n}</td>`);
                }
                for (let t = d; t < 6; t++)
                  l.push(`<td class="inactive">${t - d + 1}</td>`);
                o.innerText = `${a[r]} ${e}`;
                for (let t = 0; t < l.length; t += 9)
                  l.splice(t, 0, "<tr>"), l.splice(t + 8, 0, "</tr>");
                const f = l.join("");
                n.innerHTML = f;
                const p = document.querySelectorAll(".calendar-dates tr td");
                let y = c(t),
                  b = document.getElementById("selected-date");
                (b.innerHTML = y),
                  (s.date = y),
                  p.forEach((n) => {
                    n.addEventListener("click", () => {
                      if (
                        (p.forEach((t) => {
                          t.classList.contains("today-active") &&
                            t.classList.replace("today-active", "active");
                        }),
                        n.classList.contains("active"))
                      ) {
                        n.classList.replace("active", "today-active");
                        const o = n.innerHTML;
                        (t = new Date(`${r + 1} ${o}, ${e}`)),
                          (y = c(t)),
                          (b.innerHTML = y),
                          (s.date = y);
                      }
                    });
                  });
              };
            u(),
              i.forEach((t) => {
                t.addEventListener("click", () => {
                  if (
                    ((r = "calendar-prev" === t.id ? r - 1 : r + 1),
                    r < 0 || r > 11)
                  ) {
                    let t = new Date(e, r, new Date().getDate());
                    (e = t.getFullYear()), (r = t.getMonth());
                  }
                  u();
                });
              });
          })(),
            (function () {
              var t, e, r;
              let c = null;
              null ===
                (t = document.getElementById("schedule-generate-button")) ||
                void 0 === t ||
                t.addEventListener("click", () =>
                  n(this, void 0, void 0, function* () {
                    var t;
                    try {
                      const e = a(s.date);
                      (c = yield (0, i.generateSchedule)(e)),
                        (0, o.printScheduleToDocument)(c),
                        c &&
                          (null ===
                            (t = document.getElementById(
                              "schedule-post-button"
                            )) ||
                            void 0 === t ||
                            t.removeAttribute("disabled"));
                    } catch (t) {
                      console.error("Error: ", t);
                    }
                  })
                ),
                null ===
                  (e = document.getElementById("schedule-getter-button")) ||
                  void 0 === e ||
                  e.addEventListener("click", () =>
                    n(this, void 0, void 0, function* () {
                      try {
                        const t = a(s.date);
                        (c = yield (0, i.getSchedule)(t)),
                          (0, o.printScheduleToDocument)(c);
                      } catch (t) {
                        console.error("Error: ", t);
                      }
                    })
                  ),
                null ===
                  (r = document.getElementById("schedule-post-button")) ||
                  void 0 === r ||
                  r.addEventListener("click", () =>
                    n(this, void 0, void 0, function* () {
                      var t;
                      try {
                        c
                          ? yield (0, i.postSchedule)(c)
                          : console.error("Schedule is null"),
                          null ===
                            (t = document.getElementById(
                              "schedule-post-button"
                            )) ||
                            void 0 === t ||
                            t.setAttribute("disabled", "disabled");
                      } catch (t) {
                        console.error("Error: ", t);
                      }
                    })
                  );
            })();
        });
      },
      807: function (t, e, r) {
        "use strict";
        var n =
          (this && this.__awaiter) ||
          function (t, e, r, n) {
            return new (r || (r = Promise))(function (o, i) {
              function s(t) {
                try {
                  c(n.next(t));
                } catch (t) {
                  i(t);
                }
              }
              function a(t) {
                try {
                  c(n.throw(t));
                } catch (t) {
                  i(t);
                }
              }
              function c(t) {
                var e;
                t.done
                  ? o(t.value)
                  : ((e = t.value),
                    e instanceof r
                      ? e
                      : new r(function (t) {
                          t(e);
                        })).then(s, a);
              }
              c((n = n.apply(t, e || [])).next());
            });
          };
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.fetchLocalApi = void 0);
        const o = r(98);
        e.fetchLocalApi = function (t, e = "GET", r) {
          return n(this, void 0, void 0, function* () {
            const n = new o.Headers();
            n.append("Content-Type", "application/json");
            const i = new URL(`http://localhost:3000${t}`);
            try {
              const t = yield fetch(i.toString(), {
                headers: n,
                method: e,
                body: r ? JSON.stringify(r) : void 0,
              });
              if (!t.ok) {
                const e = t.json();
                return {
                  status: t.status,
                  data: e,
                  error: "Something went wrong",
                };
              }
              const o = yield t.json();
              return { status: t.status, data: o };
            } catch (t) {
              throw new Error(`Response unsuccessful: ${t}`);
            }
          });
        };
      },
      449: function (t, e, r) {
        "use strict";
        var n =
          (this && this.__awaiter) ||
          function (t, e, r, n) {
            return new (r || (r = Promise))(function (o, i) {
              function s(t) {
                try {
                  c(n.next(t));
                } catch (t) {
                  i(t);
                }
              }
              function a(t) {
                try {
                  c(n.throw(t));
                } catch (t) {
                  i(t);
                }
              }
              function c(t) {
                var e;
                t.done
                  ? o(t.value)
                  : ((e = t.value),
                    e instanceof r
                      ? e
                      : new r(function (t) {
                          t(e);
                        })).then(s, a);
              }
              c((n = n.apply(t, e || [])).next());
            });
          };
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.postSchedule = e.getSchedule = e.generateSchedule = void 0);
        const o = r(807);
        (e.generateSchedule = function (t) {
          return n(this, void 0, void 0, function* () {
            return yield (0, o.fetchLocalApi)(`/generate-schedule?date=${t}`);
          });
        }),
          (e.getSchedule = function (t) {
            return n(this, void 0, void 0, function* () {
              return yield (0, o.fetchLocalApi)(`/get-schedule?date=${t}`);
            });
          }),
          (e.postSchedule = function (t) {
            return n(this, void 0, void 0, function* () {
              try {
                (0, o.fetchLocalApi)("/post-schedule", "POST", t.data);
              } catch (t) {
                console.error("An error occured: ", t);
              }
            });
          });
      },
      240: (t, e) => {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.printScheduleToDocument = void 0),
          (e.printScheduleToDocument = function (t) {
            const e = document.getElementById("schedule"),
              r = new Map();
            for (const e of t.data.team_positions)
              for (let t = 0; t < e.team_position_members.length; t++) {
                const n = e.team_position_name,
                  o = e.team_position_members[t].person_name;
                r.has(n) ? r.get(n).push(o) : r.set(n, [o]);
              }
            const n = Array.from(r.keys()).sort();
            let o = "";
            for (const t of n) {
              o += `<p class="team-position">${t}</p>`;
              const e = r.get(t);
              if (e) for (const t of e) o += `<p class="band-member">${t}</p>`;
            }
            e.innerHTML = o;
          });
      },
    },
    e = {};
  function r(n) {
    var o = e[n];
    if (void 0 !== o) return o.exports;
    var i = (e[n] = { exports: {} });
    return t[n].call(i.exports, i, i.exports, r), i.exports;
  }
  (r.g = (function () {
    if ("object" == typeof globalThis) return globalThis;
    try {
      return this || new Function("return this")();
    } catch (t) {
      if ("object" == typeof window) return window;
    }
  })()),
    r(188);
})();
