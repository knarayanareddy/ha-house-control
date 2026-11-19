/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Os = globalThis, Ro = Os.ShadowRoot && (Os.ShadyCSS === void 0 || Os.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Co = Symbol(), ra = /* @__PURE__ */ new WeakMap();
let Nl = class {
  constructor(t, e, n) {
    if (this._$cssResult$ = !0, n !== Co) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Ro && t === void 0) {
      const n = e !== void 0 && e.length === 1;
      n && (t = ra.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), n && ra.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Dc = (i) => new Nl(typeof i == "string" ? i : i + "", void 0, Co), Po = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((n, s, r) => n + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + i[r + 1], i[0]);
  return new Nl(e, i, Co);
}, Uc = (i, t) => {
  if (Ro) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const n = document.createElement("style"), s = Os.litNonce;
    s !== void 0 && n.setAttribute("nonce", s), n.textContent = e.cssText, i.appendChild(n);
  }
}, oa = Ro ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const n of t.cssRules) e += n.cssText;
  return Dc(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ic, defineProperty: Nc, getOwnPropertyDescriptor: Fc, getOwnPropertyNames: Oc, getOwnPropertySymbols: Bc, getPrototypeOf: zc } = Object, js = globalThis, aa = js.trustedTypes, kc = aa ? aa.emptyScript : "", Hc = js.reactiveElementPolyfillSupport, Ki = (i, t) => i, Br = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? kc : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, Fl = (i, t) => !Ic(i, t), la = { attribute: !0, type: String, converter: Br, reflect: !1, useDefault: !1, hasChanged: Fl };
Symbol.metadata ??= Symbol("metadata"), js.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let pi = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = la) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const n = Symbol(), s = this.getPropertyDescriptor(t, n, e);
      s !== void 0 && Nc(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, n) {
    const { get: s, set: r } = Fc(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: s, set(o) {
      const a = s?.call(this);
      r?.call(this, o), this.requestUpdate(t, a, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? la;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Ki("elementProperties"))) return;
    const t = zc(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Ki("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Ki("properties"))) {
      const e = this.properties, n = [...Oc(e), ...Bc(e)];
      for (const s of n) this.createProperty(s, e[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [n, s] of e) this.elementProperties.set(n, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, n] of this.elementProperties) {
      const s = this._$Eu(e, n);
      s !== void 0 && this._$Eh.set(s, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const n = new Set(t.flat(1 / 0).reverse());
      for (const s of n) e.unshift(oa(s));
    } else t !== void 0 && e.push(oa(t));
    return e;
  }
  static _$Eu(t, e) {
    const n = e.attribute;
    return n === !1 ? void 0 : typeof n == "string" ? n : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const n of e.keys()) this.hasOwnProperty(n) && (t.set(n, this[n]), delete this[n]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Uc(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, n) {
    this._$AK(t, n);
  }
  _$ET(t, e) {
    const n = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, n);
    if (s !== void 0 && n.reflect === !0) {
      const r = (n.converter?.toAttribute !== void 0 ? n.converter : Br).toAttribute(e, n.type);
      this._$Em = t, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const n = this.constructor, s = n._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const r = n.getPropertyOptions(s), o = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : Br;
      this._$Em = s;
      const a = o.fromAttribute(e, r.type);
      this[s] = a ?? this._$Ej?.get(s) ?? a, this._$Em = null;
    }
  }
  requestUpdate(t, e, n, s = !1, r) {
    if (t !== void 0) {
      const o = this.constructor;
      if (s === !1 && (r = this[t]), n ??= o.getPropertyOptions(t), !((n.hasChanged ?? Fl)(r, e) || n.useDefault && n.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, n)))) return;
      this.C(t, e, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: n, reflect: s, wrapped: r }, o) {
    n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), r !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || n || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [s, r] of this._$Ep) this[s] = r;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [s, r] of n) {
        const { wrapped: o } = r, a = this[s];
        o !== !0 || this._$AL.has(s) || a === void 0 || this.C(s, void 0, r, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((n) => n.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (n) {
      throw t = !1, this._$EM(), n;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
pi.elementStyles = [], pi.shadowRootOptions = { mode: "open" }, pi[Ki("elementProperties")] = /* @__PURE__ */ new Map(), pi[Ki("finalized")] = /* @__PURE__ */ new Map(), Hc?.({ ReactiveElement: pi }), (js.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Lo = globalThis, ca = (i) => i, $s = Lo.trustedTypes, ha = $s ? $s.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, Ol = "$lit$", wn = `lit$${Math.random().toFixed(9).slice(2)}$`, Bl = "?" + wn, Vc = `<${Bl}>`, Zn = document, ts = () => Zn.createComment(""), es = (i) => i === null || typeof i != "object" && typeof i != "function", Do = Array.isArray, Gc = (i) => Do(i) || typeof i?.[Symbol.iterator] == "function", ir = `[ 	
\f\r]`, Oi = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ua = /-->/g, da = />/g, Un = RegExp(`>|${ir}(?:([^\\s"'>=/]+)(${ir}*=${ir}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), fa = /'/g, pa = /"/g, zl = /^(?:script|style|textarea|title)$/i, Wc = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), Rt = Wc(1), yi = Symbol.for("lit-noChange"), me = Symbol.for("lit-nothing"), ma = /* @__PURE__ */ new WeakMap(), $n = Zn.createTreeWalker(Zn, 129);
function kl(i, t) {
  if (!Do(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ha !== void 0 ? ha.createHTML(t) : t;
}
const $c = (i, t) => {
  const e = i.length - 1, n = [];
  let s, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = Oi;
  for (let a = 0; a < e; a++) {
    const l = i[a];
    let h, u, c = -1, f = 0;
    for (; f < l.length && (o.lastIndex = f, u = o.exec(l), u !== null); ) f = o.lastIndex, o === Oi ? u[1] === "!--" ? o = ua : u[1] !== void 0 ? o = da : u[2] !== void 0 ? (zl.test(u[2]) && (s = RegExp("</" + u[2], "g")), o = Un) : u[3] !== void 0 && (o = Un) : o === Un ? u[0] === ">" ? (o = s ?? Oi, c = -1) : u[1] === void 0 ? c = -2 : (c = o.lastIndex - u[2].length, h = u[1], o = u[3] === void 0 ? Un : u[3] === '"' ? pa : fa) : o === pa || o === fa ? o = Un : o === ua || o === da ? o = Oi : (o = Un, s = void 0);
    const d = o === Un && i[a + 1].startsWith("/>") ? " " : "";
    r += o === Oi ? l + Vc : c >= 0 ? (n.push(h), l.slice(0, c) + Ol + l.slice(c) + wn + d) : l + wn + (c === -2 ? a : d);
  }
  return [kl(i, r + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), n];
};
class ns {
  constructor({ strings: t, _$litType$: e }, n) {
    let s;
    this.parts = [];
    let r = 0, o = 0;
    const a = t.length - 1, l = this.parts, [h, u] = $c(t, e);
    if (this.el = ns.createElement(h, n), $n.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (s = $n.nextNode()) !== null && l.length < a; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const c of s.getAttributeNames()) if (c.endsWith(Ol)) {
          const f = u[o++], d = s.getAttribute(c).split(wn), g = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: r, name: g[2], strings: d, ctor: g[1] === "." ? qc : g[1] === "?" ? Yc : g[1] === "@" ? Zc : Ks }), s.removeAttribute(c);
        } else c.startsWith(wn) && (l.push({ type: 6, index: r }), s.removeAttribute(c));
        if (zl.test(s.tagName)) {
          const c = s.textContent.split(wn), f = c.length - 1;
          if (f > 0) {
            s.textContent = $s ? $s.emptyScript : "";
            for (let d = 0; d < f; d++) s.append(c[d], ts()), $n.nextNode(), l.push({ type: 2, index: ++r });
            s.append(c[f], ts());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Bl) l.push({ type: 2, index: r });
      else {
        let c = -1;
        for (; (c = s.data.indexOf(wn, c + 1)) !== -1; ) l.push({ type: 7, index: r }), c += wn.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const n = Zn.createElement("template");
    return n.innerHTML = t, n;
  }
}
function bi(i, t, e = i, n) {
  if (t === yi) return t;
  let s = n !== void 0 ? e._$Co?.[n] : e._$Cl;
  const r = es(t) ? void 0 : t._$litDirective$;
  return s?.constructor !== r && (s?._$AO?.(!1), r === void 0 ? s = void 0 : (s = new r(i), s._$AT(i, e, n)), n !== void 0 ? (e._$Co ??= [])[n] = s : e._$Cl = s), s !== void 0 && (t = bi(i, s._$AS(i, t.values), s, n)), t;
}
class Xc {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: n } = this._$AD, s = (t?.creationScope ?? Zn).importNode(e, !0);
    $n.currentNode = s;
    let r = $n.nextNode(), o = 0, a = 0, l = n[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let h;
        l.type === 2 ? h = new rs(r, r.nextSibling, this, t) : l.type === 1 ? h = new l.ctor(r, l.name, l.strings, this, t) : l.type === 6 && (h = new jc(r, this, t)), this._$AV.push(h), l = n[++a];
      }
      o !== l?.index && (r = $n.nextNode(), o++);
    }
    return $n.currentNode = Zn, s;
  }
  p(t) {
    let e = 0;
    for (const n of this._$AV) n !== void 0 && (n.strings !== void 0 ? (n._$AI(t, n, e), e += n.strings.length - 2) : n._$AI(t[e])), e++;
  }
}
class rs {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, n, s) {
    this.type = 2, this._$AH = me, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = n, this.options = s, this._$Cv = s?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = bi(this, t, e), es(t) ? t === me || t == null || t === "" ? (this._$AH !== me && this._$AR(), this._$AH = me) : t !== this._$AH && t !== yi && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Gc(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== me && es(this._$AH) ? this._$AA.nextSibling.data = t : this.T(Zn.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: n } = t, s = typeof n == "number" ? this._$AC(t) : (n.el === void 0 && (n.el = ns.createElement(kl(n.h, n.h[0]), this.options)), n);
    if (this._$AH?._$AD === s) this._$AH.p(e);
    else {
      const r = new Xc(s, this), o = r.u(this.options);
      r.p(e), this.T(o), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = ma.get(t.strings);
    return e === void 0 && ma.set(t.strings, e = new ns(t)), e;
  }
  k(t) {
    Do(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let n, s = 0;
    for (const r of t) s === e.length ? e.push(n = new rs(this.O(ts()), this.O(ts()), this, this.options)) : n = e[s], n._$AI(r), s++;
    s < e.length && (this._$AR(n && n._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const n = ca(t).nextSibling;
      ca(t).remove(), t = n;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class Ks {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, n, s, r) {
    this.type = 1, this._$AH = me, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = r, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = me;
  }
  _$AI(t, e = this, n, s) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) t = bi(this, t, e, 0), o = !es(t) || t !== this._$AH && t !== yi, o && (this._$AH = t);
    else {
      const a = t;
      let l, h;
      for (t = r[0], l = 0; l < r.length - 1; l++) h = bi(this, a[n + l], e, l), h === yi && (h = this._$AH[l]), o ||= !es(h) || h !== this._$AH[l], h === me ? t = me : t !== me && (t += (h ?? "") + r[l + 1]), this._$AH[l] = h;
    }
    o && !s && this.j(t);
  }
  j(t) {
    t === me ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class qc extends Ks {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === me ? void 0 : t;
  }
}
class Yc extends Ks {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== me);
  }
}
class Zc extends Ks {
  constructor(t, e, n, s, r) {
    super(t, e, n, s, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = bi(this, t, e, 0) ?? me) === yi) return;
    const n = this._$AH, s = t === me && n !== me || t.capture !== n.capture || t.once !== n.once || t.passive !== n.passive, r = t !== me && (n === me || s);
    s && this.element.removeEventListener(this.name, this, n), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class jc {
  constructor(t, e, n) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = n;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    bi(this, t);
  }
}
const Kc = Lo.litHtmlPolyfillSupport;
Kc?.(ns, rs), (Lo.litHtmlVersions ??= []).push("3.3.3");
const Jc = (i, t, e) => {
  const n = e?.renderBefore ?? t;
  let s = n._$litPart$;
  if (s === void 0) {
    const r = e?.renderBefore ?? null;
    n._$litPart$ = s = new rs(t.insertBefore(ts(), r), r, void 0, e ?? {});
  }
  return s._$AI(i), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Uo = globalThis;
class Yn extends pi {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Jc(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return yi;
  }
}
Yn._$litElement$ = !0, Yn.finalized = !0, Uo.litElementHydrateSupport?.({ LitElement: Yn });
const Qc = Uo.litElementPolyfillSupport;
Qc?.({ LitElement: Yn });
(Uo.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
const Io = "170", th = 0, ga = 1, eh = 2, Hl = 1, Vl = 2, ln = 3, Pn = 0, Ce = 1, hn = 2, An = 0, xi = 1, zr = 2, _a = 3, xa = 4, nh = 5, Gn = 100, ih = 101, sh = 102, rh = 103, oh = 104, ah = 200, lh = 201, ch = 202, hh = 203, kr = 204, Hr = 205, uh = 206, dh = 207, fh = 208, ph = 209, mh = 210, gh = 211, _h = 212, xh = 213, vh = 214, Vr = 0, Gr = 1, Wr = 2, Ei = 3, $r = 4, Xr = 5, qr = 6, Yr = 7, Gl = 0, Mh = 1, Sh = 2, Rn = 0, yh = 1, bh = 2, Eh = 3, Wl = 4, wh = 5, Th = 6, Ah = 7, $l = 300, wi = 301, Ti = 302, Zr = 303, jr = 304, Js = 306, Xs = 1e3, Xn = 1001, Kr = 1002, qe = 1003, Rh = 1004, fs = 1005, Ke = 1006, sr = 1007, qn = 1008, mn = 1009, Xl = 1010, ql = 1011, is = 1012, No = 1013, jn = 1014, un = 1015, os = 1016, Fo = 1017, Oo = 1018, Ai = 1020, Yl = 35902, Zl = 1021, jl = 1022, Xe = 1023, Kl = 1024, Jl = 1025, vi = 1026, Ri = 1027, Ql = 1028, Bo = 1029, tc = 1030, zo = 1031, ko = 1033, Bs = 33776, zs = 33777, ks = 33778, Hs = 33779, Jr = 35840, Qr = 35841, to = 35842, eo = 35843, no = 36196, io = 37492, so = 37496, ro = 37808, oo = 37809, ao = 37810, lo = 37811, co = 37812, ho = 37813, uo = 37814, fo = 37815, po = 37816, mo = 37817, go = 37818, _o = 37819, xo = 37820, vo = 37821, Vs = 36492, Mo = 36494, So = 36495, ec = 36283, yo = 36284, bo = 36285, Eo = 36286, Ch = 3200, Ph = 3201, nc = 0, Lh = 1, Tn = "", Ue = "srgb", Pi = "srgb-linear", Qs = "linear", Jt = "srgb", Qn = 7680, va = 519, Dh = 512, Uh = 513, Ih = 514, ic = 515, Nh = 516, Fh = 517, Oh = 518, Bh = 519, Ma = 35044, Sa = "300 es", dn = 2e3, qs = 2001;
class Li {
  addEventListener(t, e) {
    this._listeners === void 0 && (this._listeners = {});
    const n = this._listeners;
    n[t] === void 0 && (n[t] = []), n[t].indexOf(e) === -1 && n[t].push(e);
  }
  hasEventListener(t, e) {
    if (this._listeners === void 0) return !1;
    const n = this._listeners;
    return n[t] !== void 0 && n[t].indexOf(e) !== -1;
  }
  removeEventListener(t, e) {
    if (this._listeners === void 0) return;
    const s = this._listeners[t];
    if (s !== void 0) {
      const r = s.indexOf(e);
      r !== -1 && s.splice(r, 1);
    }
  }
  dispatchEvent(t) {
    if (this._listeners === void 0) return;
    const n = this._listeners[t.type];
    if (n !== void 0) {
      t.target = this;
      const s = n.slice(0);
      for (let r = 0, o = s.length; r < o; r++)
        s[r].call(this, t);
      t.target = null;
    }
  }
}
const xe = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2a", "2b", "2c", "2d", "2e", "2f", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3a", "3b", "3c", "3d", "3e", "3f", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8a", "8b", "8c", "8d", "8e", "8f", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9a", "9b", "9c", "9d", "9e", "9f", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "ba", "bb", "bc", "bd", "be", "bf", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ca", "cb", "cc", "cd", "ce", "cf", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "da", "db", "dc", "dd", "de", "df", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "ea", "eb", "ec", "ed", "ee", "ef", "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc", "fd", "fe", "ff"];
let ya = 1234567;
const Ji = Math.PI / 180, ss = 180 / Math.PI;
function Di() {
  const i = Math.random() * 4294967295 | 0, t = Math.random() * 4294967295 | 0, e = Math.random() * 4294967295 | 0, n = Math.random() * 4294967295 | 0;
  return (xe[i & 255] + xe[i >> 8 & 255] + xe[i >> 16 & 255] + xe[i >> 24 & 255] + "-" + xe[t & 255] + xe[t >> 8 & 255] + "-" + xe[t >> 16 & 15 | 64] + xe[t >> 24 & 255] + "-" + xe[e & 63 | 128] + xe[e >> 8 & 255] + "-" + xe[e >> 16 & 255] + xe[e >> 24 & 255] + xe[n & 255] + xe[n >> 8 & 255] + xe[n >> 16 & 255] + xe[n >> 24 & 255]).toLowerCase();
}
function Se(i, t, e) {
  return Math.max(t, Math.min(e, i));
}
function Ho(i, t) {
  return (i % t + t) % t;
}
function zh(i, t, e, n, s) {
  return n + (i - t) * (s - n) / (e - t);
}
function kh(i, t, e) {
  return i !== t ? (e - i) / (t - i) : 0;
}
function Qi(i, t, e) {
  return (1 - e) * i + e * t;
}
function Hh(i, t, e, n) {
  return Qi(i, t, 1 - Math.exp(-e * n));
}
function Vh(i, t = 1) {
  return t - Math.abs(Ho(i, t * 2) - t);
}
function Gh(i, t, e) {
  return i <= t ? 0 : i >= e ? 1 : (i = (i - t) / (e - t), i * i * (3 - 2 * i));
}
function Wh(i, t, e) {
  return i <= t ? 0 : i >= e ? 1 : (i = (i - t) / (e - t), i * i * i * (i * (i * 6 - 15) + 10));
}
function $h(i, t) {
  return i + Math.floor(Math.random() * (t - i + 1));
}
function Xh(i, t) {
  return i + Math.random() * (t - i);
}
function qh(i) {
  return i * (0.5 - Math.random());
}
function Yh(i) {
  i !== void 0 && (ya = i);
  let t = ya += 1831565813;
  return t = Math.imul(t ^ t >>> 15, t | 1), t ^= t + Math.imul(t ^ t >>> 7, t | 61), ((t ^ t >>> 14) >>> 0) / 4294967296;
}
function Zh(i) {
  return i * Ji;
}
function jh(i) {
  return i * ss;
}
function Kh(i) {
  return (i & i - 1) === 0 && i !== 0;
}
function Jh(i) {
  return Math.pow(2, Math.ceil(Math.log(i) / Math.LN2));
}
function Qh(i) {
  return Math.pow(2, Math.floor(Math.log(i) / Math.LN2));
}
function tu(i, t, e, n, s) {
  const r = Math.cos, o = Math.sin, a = r(e / 2), l = o(e / 2), h = r((t + n) / 2), u = o((t + n) / 2), c = r((t - n) / 2), f = o((t - n) / 2), d = r((n - t) / 2), g = o((n - t) / 2);
  switch (s) {
    case "XYX":
      i.set(a * u, l * c, l * f, a * h);
      break;
    case "YZY":
      i.set(l * f, a * u, l * c, a * h);
      break;
    case "ZXZ":
      i.set(l * c, l * f, a * u, a * h);
      break;
    case "XZX":
      i.set(a * u, l * g, l * d, a * h);
      break;
    case "YXY":
      i.set(l * d, a * u, l * g, a * h);
      break;
    case "ZYZ":
      i.set(l * g, l * d, a * u, a * h);
      break;
    default:
      console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: " + s);
  }
}
function mi(i, t) {
  switch (t.constructor) {
    case Float32Array:
      return i;
    case Uint32Array:
      return i / 4294967295;
    case Uint16Array:
      return i / 65535;
    case Uint8Array:
      return i / 255;
    case Int32Array:
      return Math.max(i / 2147483647, -1);
    case Int16Array:
      return Math.max(i / 32767, -1);
    case Int8Array:
      return Math.max(i / 127, -1);
    default:
      throw new Error("Invalid component type.");
  }
}
function Ee(i, t) {
  switch (t.constructor) {
    case Float32Array:
      return i;
    case Uint32Array:
      return Math.round(i * 4294967295);
    case Uint16Array:
      return Math.round(i * 65535);
    case Uint8Array:
      return Math.round(i * 255);
    case Int32Array:
      return Math.round(i * 2147483647);
    case Int16Array:
      return Math.round(i * 32767);
    case Int8Array:
      return Math.round(i * 127);
    default:
      throw new Error("Invalid component type.");
  }
}
const fn = {
  DEG2RAD: Ji,
  RAD2DEG: ss,
  generateUUID: Di,
  clamp: Se,
  euclideanModulo: Ho,
  mapLinear: zh,
  inverseLerp: kh,
  lerp: Qi,
  damp: Hh,
  pingpong: Vh,
  smoothstep: Gh,
  smootherstep: Wh,
  randInt: $h,
  randFloat: Xh,
  randFloatSpread: qh,
  seededRandom: Yh,
  degToRad: Zh,
  radToDeg: jh,
  isPowerOfTwo: Kh,
  ceilPowerOfTwo: Jh,
  floorPowerOfTwo: Qh,
  setQuaternionFromProperEuler: tu,
  normalize: Ee,
  denormalize: mi
};
class kt {
  constructor(t = 0, e = 0) {
    kt.prototype.isVector2 = !0, this.x = t, this.y = e;
  }
  get width() {
    return this.x;
  }
  set width(t) {
    this.x = t;
  }
  get height() {
    return this.y;
  }
  set height(t) {
    this.y = t;
  }
  set(t, e) {
    return this.x = t, this.y = e, this;
  }
  setScalar(t) {
    return this.x = t, this.y = t, this;
  }
  setX(t) {
    return this.x = t, this;
  }
  setY(t) {
    return this.y = t, this;
  }
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y);
  }
  copy(t) {
    return this.x = t.x, this.y = t.y, this;
  }
  add(t) {
    return this.x += t.x, this.y += t.y, this;
  }
  addScalar(t) {
    return this.x += t, this.y += t, this;
  }
  addVectors(t, e) {
    return this.x = t.x + e.x, this.y = t.y + e.y, this;
  }
  addScaledVector(t, e) {
    return this.x += t.x * e, this.y += t.y * e, this;
  }
  sub(t) {
    return this.x -= t.x, this.y -= t.y, this;
  }
  subScalar(t) {
    return this.x -= t, this.y -= t, this;
  }
  subVectors(t, e) {
    return this.x = t.x - e.x, this.y = t.y - e.y, this;
  }
  multiply(t) {
    return this.x *= t.x, this.y *= t.y, this;
  }
  multiplyScalar(t) {
    return this.x *= t, this.y *= t, this;
  }
  divide(t) {
    return this.x /= t.x, this.y /= t.y, this;
  }
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  applyMatrix3(t) {
    const e = this.x, n = this.y, s = t.elements;
    return this.x = s[0] * e + s[3] * n + s[6], this.y = s[1] * e + s[4] * n + s[7], this;
  }
  min(t) {
    return this.x = Math.min(this.x, t.x), this.y = Math.min(this.y, t.y), this;
  }
  max(t) {
    return this.x = Math.max(this.x, t.x), this.y = Math.max(this.y, t.y), this;
  }
  clamp(t, e) {
    return this.x = Math.max(t.x, Math.min(e.x, this.x)), this.y = Math.max(t.y, Math.min(e.y, this.y)), this;
  }
  clampScalar(t, e) {
    return this.x = Math.max(t, Math.min(e, this.x)), this.y = Math.max(t, Math.min(e, this.y)), this;
  }
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(Math.max(t, Math.min(e, n)));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this;
  }
  dot(t) {
    return this.x * t.x + this.y * t.y;
  }
  cross(t) {
    return this.x * t.y - this.y * t.x;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  angle() {
    return Math.atan2(-this.y, -this.x) + Math.PI;
  }
  angleTo(t) {
    const e = Math.sqrt(this.lengthSq() * t.lengthSq());
    if (e === 0) return Math.PI / 2;
    const n = this.dot(t) / e;
    return Math.acos(Se(n, -1, 1));
  }
  distanceTo(t) {
    return Math.sqrt(this.distanceToSquared(t));
  }
  distanceToSquared(t) {
    const e = this.x - t.x, n = this.y - t.y;
    return e * e + n * n;
  }
  manhattanDistanceTo(t) {
    return Math.abs(this.x - t.x) + Math.abs(this.y - t.y);
  }
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  lerp(t, e) {
    return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this;
  }
  lerpVectors(t, e, n) {
    return this.x = t.x + (e.x - t.x) * n, this.y = t.y + (e.y - t.y) * n, this;
  }
  equals(t) {
    return t.x === this.x && t.y === this.y;
  }
  fromArray(t, e = 0) {
    return this.x = t[e], this.y = t[e + 1], this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this.x, t[e + 1] = this.y, t;
  }
  fromBufferAttribute(t, e) {
    return this.x = t.getX(e), this.y = t.getY(e), this;
  }
  rotateAround(t, e) {
    const n = Math.cos(e), s = Math.sin(e), r = this.x - t.x, o = this.y - t.y;
    return this.x = r * n - o * s + t.x, this.y = r * s + o * n + t.y, this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y;
  }
}
class It {
  constructor(t, e, n, s, r, o, a, l, h) {
    It.prototype.isMatrix3 = !0, this.elements = [
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ], t !== void 0 && this.set(t, e, n, s, r, o, a, l, h);
  }
  set(t, e, n, s, r, o, a, l, h) {
    const u = this.elements;
    return u[0] = t, u[1] = s, u[2] = a, u[3] = e, u[4] = r, u[5] = l, u[6] = n, u[7] = o, u[8] = h, this;
  }
  identity() {
    return this.set(
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ), this;
  }
  copy(t) {
    const e = this.elements, n = t.elements;
    return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e[4] = n[4], e[5] = n[5], e[6] = n[6], e[7] = n[7], e[8] = n[8], this;
  }
  extractBasis(t, e, n) {
    return t.setFromMatrix3Column(this, 0), e.setFromMatrix3Column(this, 1), n.setFromMatrix3Column(this, 2), this;
  }
  setFromMatrix4(t) {
    const e = t.elements;
    return this.set(
      e[0],
      e[4],
      e[8],
      e[1],
      e[5],
      e[9],
      e[2],
      e[6],
      e[10]
    ), this;
  }
  multiply(t) {
    return this.multiplyMatrices(this, t);
  }
  premultiply(t) {
    return this.multiplyMatrices(t, this);
  }
  multiplyMatrices(t, e) {
    const n = t.elements, s = e.elements, r = this.elements, o = n[0], a = n[3], l = n[6], h = n[1], u = n[4], c = n[7], f = n[2], d = n[5], g = n[8], x = s[0], m = s[3], p = s[6], E = s[1], b = s[4], y = s[7], N = s[2], R = s[5], T = s[8];
    return r[0] = o * x + a * E + l * N, r[3] = o * m + a * b + l * R, r[6] = o * p + a * y + l * T, r[1] = h * x + u * E + c * N, r[4] = h * m + u * b + c * R, r[7] = h * p + u * y + c * T, r[2] = f * x + d * E + g * N, r[5] = f * m + d * b + g * R, r[8] = f * p + d * y + g * T, this;
  }
  multiplyScalar(t) {
    const e = this.elements;
    return e[0] *= t, e[3] *= t, e[6] *= t, e[1] *= t, e[4] *= t, e[7] *= t, e[2] *= t, e[5] *= t, e[8] *= t, this;
  }
  determinant() {
    const t = this.elements, e = t[0], n = t[1], s = t[2], r = t[3], o = t[4], a = t[5], l = t[6], h = t[7], u = t[8];
    return e * o * u - e * a * h - n * r * u + n * a * l + s * r * h - s * o * l;
  }
  invert() {
    const t = this.elements, e = t[0], n = t[1], s = t[2], r = t[3], o = t[4], a = t[5], l = t[6], h = t[7], u = t[8], c = u * o - a * h, f = a * l - u * r, d = h * r - o * l, g = e * c + n * f + s * d;
    if (g === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const x = 1 / g;
    return t[0] = c * x, t[1] = (s * h - u * n) * x, t[2] = (a * n - s * o) * x, t[3] = f * x, t[4] = (u * e - s * l) * x, t[5] = (s * r - a * e) * x, t[6] = d * x, t[7] = (n * l - h * e) * x, t[8] = (o * e - n * r) * x, this;
  }
  transpose() {
    let t;
    const e = this.elements;
    return t = e[1], e[1] = e[3], e[3] = t, t = e[2], e[2] = e[6], e[6] = t, t = e[5], e[5] = e[7], e[7] = t, this;
  }
  getNormalMatrix(t) {
    return this.setFromMatrix4(t).invert().transpose();
  }
  transposeIntoArray(t) {
    const e = this.elements;
    return t[0] = e[0], t[1] = e[3], t[2] = e[6], t[3] = e[1], t[4] = e[4], t[5] = e[7], t[6] = e[2], t[7] = e[5], t[8] = e[8], this;
  }
  setUvTransform(t, e, n, s, r, o, a) {
    const l = Math.cos(r), h = Math.sin(r);
    return this.set(
      n * l,
      n * h,
      -n * (l * o + h * a) + o + t,
      -s * h,
      s * l,
      -s * (-h * o + l * a) + a + e,
      0,
      0,
      1
    ), this;
  }
  //
  scale(t, e) {
    return this.premultiply(rr.makeScale(t, e)), this;
  }
  rotate(t) {
    return this.premultiply(rr.makeRotation(-t)), this;
  }
  translate(t, e) {
    return this.premultiply(rr.makeTranslation(t, e)), this;
  }
  // for 2D Transforms
  makeTranslation(t, e) {
    return t.isVector2 ? this.set(
      1,
      0,
      t.x,
      0,
      1,
      t.y,
      0,
      0,
      1
    ) : this.set(
      1,
      0,
      t,
      0,
      1,
      e,
      0,
      0,
      1
    ), this;
  }
  makeRotation(t) {
    const e = Math.cos(t), n = Math.sin(t);
    return this.set(
      e,
      -n,
      0,
      n,
      e,
      0,
      0,
      0,
      1
    ), this;
  }
  makeScale(t, e) {
    return this.set(
      t,
      0,
      0,
      0,
      e,
      0,
      0,
      0,
      1
    ), this;
  }
  //
  equals(t) {
    const e = this.elements, n = t.elements;
    for (let s = 0; s < 9; s++)
      if (e[s] !== n[s]) return !1;
    return !0;
  }
  fromArray(t, e = 0) {
    for (let n = 0; n < 9; n++)
      this.elements[n] = t[n + e];
    return this;
  }
  toArray(t = [], e = 0) {
    const n = this.elements;
    return t[e] = n[0], t[e + 1] = n[1], t[e + 2] = n[2], t[e + 3] = n[3], t[e + 4] = n[4], t[e + 5] = n[5], t[e + 6] = n[6], t[e + 7] = n[7], t[e + 8] = n[8], t;
  }
  clone() {
    return new this.constructor().fromArray(this.elements);
  }
}
const rr = /* @__PURE__ */ new It();
function sc(i) {
  for (let t = i.length - 1; t >= 0; --t)
    if (i[t] >= 65535) return !0;
  return !1;
}
function Ys(i) {
  return document.createElementNS("http://www.w3.org/1999/xhtml", i);
}
function eu() {
  const i = Ys("canvas");
  return i.style.display = "block", i;
}
const ba = {};
function Zi(i) {
  i in ba || (ba[i] = !0, console.warn(i));
}
function nu(i, t, e) {
  return new Promise(function(n, s) {
    function r() {
      switch (i.clientWaitSync(t, i.SYNC_FLUSH_COMMANDS_BIT, 0)) {
        case i.WAIT_FAILED:
          s();
          break;
        case i.TIMEOUT_EXPIRED:
          setTimeout(r, e);
          break;
        default:
          n();
      }
    }
    setTimeout(r, e);
  });
}
function iu(i) {
  const t = i.elements;
  t[2] = 0.5 * t[2] + 0.5 * t[3], t[6] = 0.5 * t[6] + 0.5 * t[7], t[10] = 0.5 * t[10] + 0.5 * t[11], t[14] = 0.5 * t[14] + 0.5 * t[15];
}
function su(i) {
  const t = i.elements;
  t[11] === -1 ? (t[10] = -t[10] - 1, t[14] = -t[14]) : (t[10] = -t[10], t[14] = -t[14] + 1);
}
const Xt = {
  enabled: !0,
  workingColorSpace: Pi,
  /**
   * Implementations of supported color spaces.
   *
   * Required:
   *	- primaries: chromaticity coordinates [ rx ry gx gy bx by ]
   *	- whitePoint: reference white [ x y ]
   *	- transfer: transfer function (pre-defined)
   *	- toXYZ: Matrix3 RGB to XYZ transform
   *	- fromXYZ: Matrix3 XYZ to RGB transform
   *	- luminanceCoefficients: RGB luminance coefficients
   *
   * Optional:
   *  - outputColorSpaceConfig: { drawingBufferColorSpace: ColorSpace }
   *  - workingColorSpaceConfig: { unpackColorSpace: ColorSpace }
   *
   * Reference:
   * - https://www.russellcottrell.com/photo/matrixCalculator.htm
   */
  spaces: {},
  convert: function(i, t, e) {
    return this.enabled === !1 || t === e || !t || !e || (this.spaces[t].transfer === Jt && (i.r = pn(i.r), i.g = pn(i.g), i.b = pn(i.b)), this.spaces[t].primaries !== this.spaces[e].primaries && (i.applyMatrix3(this.spaces[t].toXYZ), i.applyMatrix3(this.spaces[e].fromXYZ)), this.spaces[e].transfer === Jt && (i.r = Mi(i.r), i.g = Mi(i.g), i.b = Mi(i.b))), i;
  },
  fromWorkingColorSpace: function(i, t) {
    return this.convert(i, this.workingColorSpace, t);
  },
  toWorkingColorSpace: function(i, t) {
    return this.convert(i, t, this.workingColorSpace);
  },
  getPrimaries: function(i) {
    return this.spaces[i].primaries;
  },
  getTransfer: function(i) {
    return i === Tn ? Qs : this.spaces[i].transfer;
  },
  getLuminanceCoefficients: function(i, t = this.workingColorSpace) {
    return i.fromArray(this.spaces[t].luminanceCoefficients);
  },
  define: function(i) {
    Object.assign(this.spaces, i);
  },
  // Internal APIs
  _getMatrix: function(i, t, e) {
    return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ);
  },
  _getDrawingBufferColorSpace: function(i) {
    return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace;
  },
  _getUnpackColorSpace: function(i = this.workingColorSpace) {
    return this.spaces[i].workingColorSpaceConfig.unpackColorSpace;
  }
};
function pn(i) {
  return i < 0.04045 ? i * 0.0773993808 : Math.pow(i * 0.9478672986 + 0.0521327014, 2.4);
}
function Mi(i) {
  return i < 31308e-7 ? i * 12.92 : 1.055 * Math.pow(i, 0.41666) - 0.055;
}
const Ea = [0.64, 0.33, 0.3, 0.6, 0.15, 0.06], wa = [0.2126, 0.7152, 0.0722], Ta = [0.3127, 0.329], Aa = /* @__PURE__ */ new It().set(
  0.4123908,
  0.3575843,
  0.1804808,
  0.212639,
  0.7151687,
  0.0721923,
  0.0193308,
  0.1191948,
  0.9505322
), Ra = /* @__PURE__ */ new It().set(
  3.2409699,
  -1.5373832,
  -0.4986108,
  -0.9692436,
  1.8759675,
  0.0415551,
  0.0556301,
  -0.203977,
  1.0569715
);
Xt.define({
  [Pi]: {
    primaries: Ea,
    whitePoint: Ta,
    transfer: Qs,
    toXYZ: Aa,
    fromXYZ: Ra,
    luminanceCoefficients: wa,
    workingColorSpaceConfig: { unpackColorSpace: Ue },
    outputColorSpaceConfig: { drawingBufferColorSpace: Ue }
  },
  [Ue]: {
    primaries: Ea,
    whitePoint: Ta,
    transfer: Jt,
    toXYZ: Aa,
    fromXYZ: Ra,
    luminanceCoefficients: wa,
    outputColorSpaceConfig: { drawingBufferColorSpace: Ue }
  }
});
let ti;
class ru {
  static getDataURL(t) {
    if (/^data:/i.test(t.src) || typeof HTMLCanvasElement > "u")
      return t.src;
    let e;
    if (t instanceof HTMLCanvasElement)
      e = t;
    else {
      ti === void 0 && (ti = Ys("canvas")), ti.width = t.width, ti.height = t.height;
      const n = ti.getContext("2d");
      t instanceof ImageData ? n.putImageData(t, 0, 0) : n.drawImage(t, 0, 0, t.width, t.height), e = ti;
    }
    return e.width > 2048 || e.height > 2048 ? (console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons", t), e.toDataURL("image/jpeg", 0.6)) : e.toDataURL("image/png");
  }
  static sRGBToLinear(t) {
    if (typeof HTMLImageElement < "u" && t instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && t instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && t instanceof ImageBitmap) {
      const e = Ys("canvas");
      e.width = t.width, e.height = t.height;
      const n = e.getContext("2d");
      n.drawImage(t, 0, 0, t.width, t.height);
      const s = n.getImageData(0, 0, t.width, t.height), r = s.data;
      for (let o = 0; o < r.length; o++)
        r[o] = pn(r[o] / 255) * 255;
      return n.putImageData(s, 0, 0), e;
    } else if (t.data) {
      const e = t.data.slice(0);
      for (let n = 0; n < e.length; n++)
        e instanceof Uint8Array || e instanceof Uint8ClampedArray ? e[n] = Math.floor(pn(e[n] / 255) * 255) : e[n] = pn(e[n]);
      return {
        data: e,
        width: t.width,
        height: t.height
      };
    } else
      return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."), t;
  }
}
let ou = 0;
class rc {
  constructor(t = null) {
    this.isSource = !0, Object.defineProperty(this, "id", { value: ou++ }), this.uuid = Di(), this.data = t, this.dataReady = !0, this.version = 0;
  }
  set needsUpdate(t) {
    t === !0 && this.version++;
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string";
    if (!e && t.images[this.uuid] !== void 0)
      return t.images[this.uuid];
    const n = {
      uuid: this.uuid,
      url: ""
    }, s = this.data;
    if (s !== null) {
      let r;
      if (Array.isArray(s)) {
        r = [];
        for (let o = 0, a = s.length; o < a; o++)
          s[o].isDataTexture ? r.push(or(s[o].image)) : r.push(or(s[o]));
      } else
        r = or(s);
      n.url = r;
    }
    return e || (t.images[this.uuid] = n), n;
  }
}
function or(i) {
  return typeof HTMLImageElement < "u" && i instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && i instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && i instanceof ImageBitmap ? ru.getDataURL(i) : i.data ? {
    data: Array.from(i.data),
    width: i.width,
    height: i.height,
    type: i.data.constructor.name
  } : (console.warn("THREE.Texture: Unable to serialize Texture."), {});
}
let au = 0;
class Ae extends Li {
  constructor(t = Ae.DEFAULT_IMAGE, e = Ae.DEFAULT_MAPPING, n = Xn, s = Xn, r = Ke, o = qn, a = Xe, l = mn, h = Ae.DEFAULT_ANISOTROPY, u = Tn) {
    super(), this.isTexture = !0, Object.defineProperty(this, "id", { value: au++ }), this.uuid = Di(), this.name = "", this.source = new rc(t), this.mipmaps = [], this.mapping = e, this.channel = 0, this.wrapS = n, this.wrapT = s, this.magFilter = r, this.minFilter = o, this.anisotropy = h, this.format = a, this.internalFormat = null, this.type = l, this.offset = new kt(0, 0), this.repeat = new kt(1, 1), this.center = new kt(0, 0), this.rotation = 0, this.matrixAutoUpdate = !0, this.matrix = new It(), this.generateMipmaps = !0, this.premultiplyAlpha = !1, this.flipY = !0, this.unpackAlignment = 4, this.colorSpace = u, this.userData = {}, this.version = 0, this.onUpdate = null, this.isRenderTargetTexture = !1, this.pmremVersion = 0;
  }
  get image() {
    return this.source.data;
  }
  set image(t = null) {
    this.source.data = t;
  }
  updateMatrix() {
    this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return this.name = t.name, this.source = t.source, this.mipmaps = t.mipmaps.slice(0), this.mapping = t.mapping, this.channel = t.channel, this.wrapS = t.wrapS, this.wrapT = t.wrapT, this.magFilter = t.magFilter, this.minFilter = t.minFilter, this.anisotropy = t.anisotropy, this.format = t.format, this.internalFormat = t.internalFormat, this.type = t.type, this.offset.copy(t.offset), this.repeat.copy(t.repeat), this.center.copy(t.center), this.rotation = t.rotation, this.matrixAutoUpdate = t.matrixAutoUpdate, this.matrix.copy(t.matrix), this.generateMipmaps = t.generateMipmaps, this.premultiplyAlpha = t.premultiplyAlpha, this.flipY = t.flipY, this.unpackAlignment = t.unpackAlignment, this.colorSpace = t.colorSpace, this.userData = JSON.parse(JSON.stringify(t.userData)), this.needsUpdate = !0, this;
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string";
    if (!e && t.textures[this.uuid] !== void 0)
      return t.textures[this.uuid];
    const n = {
      metadata: {
        version: 4.6,
        type: "Texture",
        generator: "Texture.toJSON"
      },
      uuid: this.uuid,
      name: this.name,
      image: this.source.toJSON(t).uuid,
      mapping: this.mapping,
      channel: this.channel,
      repeat: [this.repeat.x, this.repeat.y],
      offset: [this.offset.x, this.offset.y],
      center: [this.center.x, this.center.y],
      rotation: this.rotation,
      wrap: [this.wrapS, this.wrapT],
      format: this.format,
      internalFormat: this.internalFormat,
      type: this.type,
      colorSpace: this.colorSpace,
      minFilter: this.minFilter,
      magFilter: this.magFilter,
      anisotropy: this.anisotropy,
      flipY: this.flipY,
      generateMipmaps: this.generateMipmaps,
      premultiplyAlpha: this.premultiplyAlpha,
      unpackAlignment: this.unpackAlignment
    };
    return Object.keys(this.userData).length > 0 && (n.userData = this.userData), e || (t.textures[this.uuid] = n), n;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  transformUv(t) {
    if (this.mapping !== $l) return t;
    if (t.applyMatrix3(this.matrix), t.x < 0 || t.x > 1)
      switch (this.wrapS) {
        case Xs:
          t.x = t.x - Math.floor(t.x);
          break;
        case Xn:
          t.x = t.x < 0 ? 0 : 1;
          break;
        case Kr:
          Math.abs(Math.floor(t.x) % 2) === 1 ? t.x = Math.ceil(t.x) - t.x : t.x = t.x - Math.floor(t.x);
          break;
      }
    if (t.y < 0 || t.y > 1)
      switch (this.wrapT) {
        case Xs:
          t.y = t.y - Math.floor(t.y);
          break;
        case Xn:
          t.y = t.y < 0 ? 0 : 1;
          break;
        case Kr:
          Math.abs(Math.floor(t.y) % 2) === 1 ? t.y = Math.ceil(t.y) - t.y : t.y = t.y - Math.floor(t.y);
          break;
      }
    return this.flipY && (t.y = 1 - t.y), t;
  }
  set needsUpdate(t) {
    t === !0 && (this.version++, this.source.needsUpdate = !0);
  }
  set needsPMREMUpdate(t) {
    t === !0 && this.pmremVersion++;
  }
}
Ae.DEFAULT_IMAGE = null;
Ae.DEFAULT_MAPPING = $l;
Ae.DEFAULT_ANISOTROPY = 1;
class Qt {
  constructor(t = 0, e = 0, n = 0, s = 1) {
    Qt.prototype.isVector4 = !0, this.x = t, this.y = e, this.z = n, this.w = s;
  }
  get width() {
    return this.z;
  }
  set width(t) {
    this.z = t;
  }
  get height() {
    return this.w;
  }
  set height(t) {
    this.w = t;
  }
  set(t, e, n, s) {
    return this.x = t, this.y = e, this.z = n, this.w = s, this;
  }
  setScalar(t) {
    return this.x = t, this.y = t, this.z = t, this.w = t, this;
  }
  setX(t) {
    return this.x = t, this;
  }
  setY(t) {
    return this.y = t, this;
  }
  setZ(t) {
    return this.z = t, this;
  }
  setW(t) {
    return this.w = t, this;
  }
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      case 2:
        this.z = e;
        break;
      case 3:
        this.w = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      case 3:
        return this.w;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z, this.w);
  }
  copy(t) {
    return this.x = t.x, this.y = t.y, this.z = t.z, this.w = t.w !== void 0 ? t.w : 1, this;
  }
  add(t) {
    return this.x += t.x, this.y += t.y, this.z += t.z, this.w += t.w, this;
  }
  addScalar(t) {
    return this.x += t, this.y += t, this.z += t, this.w += t, this;
  }
  addVectors(t, e) {
    return this.x = t.x + e.x, this.y = t.y + e.y, this.z = t.z + e.z, this.w = t.w + e.w, this;
  }
  addScaledVector(t, e) {
    return this.x += t.x * e, this.y += t.y * e, this.z += t.z * e, this.w += t.w * e, this;
  }
  sub(t) {
    return this.x -= t.x, this.y -= t.y, this.z -= t.z, this.w -= t.w, this;
  }
  subScalar(t) {
    return this.x -= t, this.y -= t, this.z -= t, this.w -= t, this;
  }
  subVectors(t, e) {
    return this.x = t.x - e.x, this.y = t.y - e.y, this.z = t.z - e.z, this.w = t.w - e.w, this;
  }
  multiply(t) {
    return this.x *= t.x, this.y *= t.y, this.z *= t.z, this.w *= t.w, this;
  }
  multiplyScalar(t) {
    return this.x *= t, this.y *= t, this.z *= t, this.w *= t, this;
  }
  applyMatrix4(t) {
    const e = this.x, n = this.y, s = this.z, r = this.w, o = t.elements;
    return this.x = o[0] * e + o[4] * n + o[8] * s + o[12] * r, this.y = o[1] * e + o[5] * n + o[9] * s + o[13] * r, this.z = o[2] * e + o[6] * n + o[10] * s + o[14] * r, this.w = o[3] * e + o[7] * n + o[11] * s + o[15] * r, this;
  }
  divide(t) {
    return this.x /= t.x, this.y /= t.y, this.z /= t.z, this.w /= t.w, this;
  }
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  setAxisAngleFromQuaternion(t) {
    this.w = 2 * Math.acos(t.w);
    const e = Math.sqrt(1 - t.w * t.w);
    return e < 1e-4 ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = t.x / e, this.y = t.y / e, this.z = t.z / e), this;
  }
  setAxisAngleFromRotationMatrix(t) {
    let e, n, s, r;
    const l = t.elements, h = l[0], u = l[4], c = l[8], f = l[1], d = l[5], g = l[9], x = l[2], m = l[6], p = l[10];
    if (Math.abs(u - f) < 0.01 && Math.abs(c - x) < 0.01 && Math.abs(g - m) < 0.01) {
      if (Math.abs(u + f) < 0.1 && Math.abs(c + x) < 0.1 && Math.abs(g + m) < 0.1 && Math.abs(h + d + p - 3) < 0.1)
        return this.set(1, 0, 0, 0), this;
      e = Math.PI;
      const b = (h + 1) / 2, y = (d + 1) / 2, N = (p + 1) / 2, R = (u + f) / 4, T = (c + x) / 4, C = (g + m) / 4;
      return b > y && b > N ? b < 0.01 ? (n = 0, s = 0.707106781, r = 0.707106781) : (n = Math.sqrt(b), s = R / n, r = T / n) : y > N ? y < 0.01 ? (n = 0.707106781, s = 0, r = 0.707106781) : (s = Math.sqrt(y), n = R / s, r = C / s) : N < 0.01 ? (n = 0.707106781, s = 0.707106781, r = 0) : (r = Math.sqrt(N), n = T / r, s = C / r), this.set(n, s, r, e), this;
    }
    let E = Math.sqrt((m - g) * (m - g) + (c - x) * (c - x) + (f - u) * (f - u));
    return Math.abs(E) < 1e-3 && (E = 1), this.x = (m - g) / E, this.y = (c - x) / E, this.z = (f - u) / E, this.w = Math.acos((h + d + p - 1) / 2), this;
  }
  setFromMatrixPosition(t) {
    const e = t.elements;
    return this.x = e[12], this.y = e[13], this.z = e[14], this.w = e[15], this;
  }
  min(t) {
    return this.x = Math.min(this.x, t.x), this.y = Math.min(this.y, t.y), this.z = Math.min(this.z, t.z), this.w = Math.min(this.w, t.w), this;
  }
  max(t) {
    return this.x = Math.max(this.x, t.x), this.y = Math.max(this.y, t.y), this.z = Math.max(this.z, t.z), this.w = Math.max(this.w, t.w), this;
  }
  clamp(t, e) {
    return this.x = Math.max(t.x, Math.min(e.x, this.x)), this.y = Math.max(t.y, Math.min(e.y, this.y)), this.z = Math.max(t.z, Math.min(e.z, this.z)), this.w = Math.max(t.w, Math.min(e.w, this.w)), this;
  }
  clampScalar(t, e) {
    return this.x = Math.max(t, Math.min(e, this.x)), this.y = Math.max(t, Math.min(e, this.y)), this.z = Math.max(t, Math.min(e, this.z)), this.w = Math.max(t, Math.min(e, this.w)), this;
  }
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(Math.max(t, Math.min(e, n)));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this.w = Math.ceil(this.w), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this.w = Math.round(this.w), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this.w = Math.trunc(this.w), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this.w = -this.w, this;
  }
  dot(t) {
    return this.x * t.x + this.y * t.y + this.z * t.z + this.w * t.w;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  lerp(t, e) {
    return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this.z += (t.z - this.z) * e, this.w += (t.w - this.w) * e, this;
  }
  lerpVectors(t, e, n) {
    return this.x = t.x + (e.x - t.x) * n, this.y = t.y + (e.y - t.y) * n, this.z = t.z + (e.z - t.z) * n, this.w = t.w + (e.w - t.w) * n, this;
  }
  equals(t) {
    return t.x === this.x && t.y === this.y && t.z === this.z && t.w === this.w;
  }
  fromArray(t, e = 0) {
    return this.x = t[e], this.y = t[e + 1], this.z = t[e + 2], this.w = t[e + 3], this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this.x, t[e + 1] = this.y, t[e + 2] = this.z, t[e + 3] = this.w, t;
  }
  fromBufferAttribute(t, e) {
    return this.x = t.getX(e), this.y = t.getY(e), this.z = t.getZ(e), this.w = t.getW(e), this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this.w = Math.random(), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z, yield this.w;
  }
}
class lu extends Li {
  constructor(t = 1, e = 1, n = {}) {
    super(), this.isRenderTarget = !0, this.width = t, this.height = e, this.depth = 1, this.scissor = new Qt(0, 0, t, e), this.scissorTest = !1, this.viewport = new Qt(0, 0, t, e);
    const s = { width: t, height: e, depth: 1 };
    n = Object.assign({
      generateMipmaps: !1,
      internalFormat: null,
      minFilter: Ke,
      depthBuffer: !0,
      stencilBuffer: !1,
      resolveDepthBuffer: !0,
      resolveStencilBuffer: !0,
      depthTexture: null,
      samples: 0,
      count: 1
    }, n);
    const r = new Ae(s, n.mapping, n.wrapS, n.wrapT, n.magFilter, n.minFilter, n.format, n.type, n.anisotropy, n.colorSpace);
    r.flipY = !1, r.generateMipmaps = n.generateMipmaps, r.internalFormat = n.internalFormat, this.textures = [];
    const o = n.count;
    for (let a = 0; a < o; a++)
      this.textures[a] = r.clone(), this.textures[a].isRenderTargetTexture = !0;
    this.depthBuffer = n.depthBuffer, this.stencilBuffer = n.stencilBuffer, this.resolveDepthBuffer = n.resolveDepthBuffer, this.resolveStencilBuffer = n.resolveStencilBuffer, this.depthTexture = n.depthTexture, this.samples = n.samples;
  }
  get texture() {
    return this.textures[0];
  }
  set texture(t) {
    this.textures[0] = t;
  }
  setSize(t, e, n = 1) {
    if (this.width !== t || this.height !== e || this.depth !== n) {
      this.width = t, this.height = e, this.depth = n;
      for (let s = 0, r = this.textures.length; s < r; s++)
        this.textures[s].image.width = t, this.textures[s].image.height = e, this.textures[s].image.depth = n;
      this.dispose();
    }
    this.viewport.set(0, 0, t, e), this.scissor.set(0, 0, t, e);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    this.width = t.width, this.height = t.height, this.depth = t.depth, this.scissor.copy(t.scissor), this.scissorTest = t.scissorTest, this.viewport.copy(t.viewport), this.textures.length = 0;
    for (let n = 0, s = t.textures.length; n < s; n++)
      this.textures[n] = t.textures[n].clone(), this.textures[n].isRenderTargetTexture = !0;
    const e = Object.assign({}, t.texture.image);
    return this.texture.source = new rc(e), this.depthBuffer = t.depthBuffer, this.stencilBuffer = t.stencilBuffer, this.resolveDepthBuffer = t.resolveDepthBuffer, this.resolveStencilBuffer = t.resolveStencilBuffer, t.depthTexture !== null && (this.depthTexture = t.depthTexture.clone()), this.samples = t.samples, this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
class Kn extends lu {
  constructor(t = 1, e = 1, n = {}) {
    super(t, e, n), this.isWebGLRenderTarget = !0;
  }
}
class oc extends Ae {
  constructor(t = null, e = 1, n = 1, s = 1) {
    super(null), this.isDataArrayTexture = !0, this.image = { data: t, width: e, height: n, depth: s }, this.magFilter = qe, this.minFilter = qe, this.wrapR = Xn, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1, this.layerUpdates = /* @__PURE__ */ new Set();
  }
  addLayerUpdate(t) {
    this.layerUpdates.add(t);
  }
  clearLayerUpdates() {
    this.layerUpdates.clear();
  }
}
class cu extends Ae {
  constructor(t = null, e = 1, n = 1, s = 1) {
    super(null), this.isData3DTexture = !0, this.image = { data: t, width: e, height: n, depth: s }, this.magFilter = qe, this.minFilter = qe, this.wrapR = Xn, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1;
  }
}
class as {
  constructor(t = 0, e = 0, n = 0, s = 1) {
    this.isQuaternion = !0, this._x = t, this._y = e, this._z = n, this._w = s;
  }
  static slerpFlat(t, e, n, s, r, o, a) {
    let l = n[s + 0], h = n[s + 1], u = n[s + 2], c = n[s + 3];
    const f = r[o + 0], d = r[o + 1], g = r[o + 2], x = r[o + 3];
    if (a === 0) {
      t[e + 0] = l, t[e + 1] = h, t[e + 2] = u, t[e + 3] = c;
      return;
    }
    if (a === 1) {
      t[e + 0] = f, t[e + 1] = d, t[e + 2] = g, t[e + 3] = x;
      return;
    }
    if (c !== x || l !== f || h !== d || u !== g) {
      let m = 1 - a;
      const p = l * f + h * d + u * g + c * x, E = p >= 0 ? 1 : -1, b = 1 - p * p;
      if (b > Number.EPSILON) {
        const N = Math.sqrt(b), R = Math.atan2(N, p * E);
        m = Math.sin(m * R) / N, a = Math.sin(a * R) / N;
      }
      const y = a * E;
      if (l = l * m + f * y, h = h * m + d * y, u = u * m + g * y, c = c * m + x * y, m === 1 - a) {
        const N = 1 / Math.sqrt(l * l + h * h + u * u + c * c);
        l *= N, h *= N, u *= N, c *= N;
      }
    }
    t[e] = l, t[e + 1] = h, t[e + 2] = u, t[e + 3] = c;
  }
  static multiplyQuaternionsFlat(t, e, n, s, r, o) {
    const a = n[s], l = n[s + 1], h = n[s + 2], u = n[s + 3], c = r[o], f = r[o + 1], d = r[o + 2], g = r[o + 3];
    return t[e] = a * g + u * c + l * d - h * f, t[e + 1] = l * g + u * f + h * c - a * d, t[e + 2] = h * g + u * d + a * f - l * c, t[e + 3] = u * g - a * c - l * f - h * d, t;
  }
  get x() {
    return this._x;
  }
  set x(t) {
    this._x = t, this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(t) {
    this._y = t, this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(t) {
    this._z = t, this._onChangeCallback();
  }
  get w() {
    return this._w;
  }
  set w(t) {
    this._w = t, this._onChangeCallback();
  }
  set(t, e, n, s) {
    return this._x = t, this._y = e, this._z = n, this._w = s, this._onChangeCallback(), this;
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._w);
  }
  copy(t) {
    return this._x = t.x, this._y = t.y, this._z = t.z, this._w = t.w, this._onChangeCallback(), this;
  }
  setFromEuler(t, e = !0) {
    const n = t._x, s = t._y, r = t._z, o = t._order, a = Math.cos, l = Math.sin, h = a(n / 2), u = a(s / 2), c = a(r / 2), f = l(n / 2), d = l(s / 2), g = l(r / 2);
    switch (o) {
      case "XYZ":
        this._x = f * u * c + h * d * g, this._y = h * d * c - f * u * g, this._z = h * u * g + f * d * c, this._w = h * u * c - f * d * g;
        break;
      case "YXZ":
        this._x = f * u * c + h * d * g, this._y = h * d * c - f * u * g, this._z = h * u * g - f * d * c, this._w = h * u * c + f * d * g;
        break;
      case "ZXY":
        this._x = f * u * c - h * d * g, this._y = h * d * c + f * u * g, this._z = h * u * g + f * d * c, this._w = h * u * c - f * d * g;
        break;
      case "ZYX":
        this._x = f * u * c - h * d * g, this._y = h * d * c + f * u * g, this._z = h * u * g - f * d * c, this._w = h * u * c + f * d * g;
        break;
      case "YZX":
        this._x = f * u * c + h * d * g, this._y = h * d * c + f * u * g, this._z = h * u * g - f * d * c, this._w = h * u * c - f * d * g;
        break;
      case "XZY":
        this._x = f * u * c - h * d * g, this._y = h * d * c - f * u * g, this._z = h * u * g + f * d * c, this._w = h * u * c + f * d * g;
        break;
      default:
        console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: " + o);
    }
    return e === !0 && this._onChangeCallback(), this;
  }
  setFromAxisAngle(t, e) {
    const n = e / 2, s = Math.sin(n);
    return this._x = t.x * s, this._y = t.y * s, this._z = t.z * s, this._w = Math.cos(n), this._onChangeCallback(), this;
  }
  setFromRotationMatrix(t) {
    const e = t.elements, n = e[0], s = e[4], r = e[8], o = e[1], a = e[5], l = e[9], h = e[2], u = e[6], c = e[10], f = n + a + c;
    if (f > 0) {
      const d = 0.5 / Math.sqrt(f + 1);
      this._w = 0.25 / d, this._x = (u - l) * d, this._y = (r - h) * d, this._z = (o - s) * d;
    } else if (n > a && n > c) {
      const d = 2 * Math.sqrt(1 + n - a - c);
      this._w = (u - l) / d, this._x = 0.25 * d, this._y = (s + o) / d, this._z = (r + h) / d;
    } else if (a > c) {
      const d = 2 * Math.sqrt(1 + a - n - c);
      this._w = (r - h) / d, this._x = (s + o) / d, this._y = 0.25 * d, this._z = (l + u) / d;
    } else {
      const d = 2 * Math.sqrt(1 + c - n - a);
      this._w = (o - s) / d, this._x = (r + h) / d, this._y = (l + u) / d, this._z = 0.25 * d;
    }
    return this._onChangeCallback(), this;
  }
  setFromUnitVectors(t, e) {
    let n = t.dot(e) + 1;
    return n < Number.EPSILON ? (n = 0, Math.abs(t.x) > Math.abs(t.z) ? (this._x = -t.y, this._y = t.x, this._z = 0, this._w = n) : (this._x = 0, this._y = -t.z, this._z = t.y, this._w = n)) : (this._x = t.y * e.z - t.z * e.y, this._y = t.z * e.x - t.x * e.z, this._z = t.x * e.y - t.y * e.x, this._w = n), this.normalize();
  }
  angleTo(t) {
    return 2 * Math.acos(Math.abs(Se(this.dot(t), -1, 1)));
  }
  rotateTowards(t, e) {
    const n = this.angleTo(t);
    if (n === 0) return this;
    const s = Math.min(1, e / n);
    return this.slerp(t, s), this;
  }
  identity() {
    return this.set(0, 0, 0, 1);
  }
  invert() {
    return this.conjugate();
  }
  conjugate() {
    return this._x *= -1, this._y *= -1, this._z *= -1, this._onChangeCallback(), this;
  }
  dot(t) {
    return this._x * t._x + this._y * t._y + this._z * t._z + this._w * t._w;
  }
  lengthSq() {
    return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
  }
  length() {
    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
  }
  normalize() {
    let t = this.length();
    return t === 0 ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (t = 1 / t, this._x = this._x * t, this._y = this._y * t, this._z = this._z * t, this._w = this._w * t), this._onChangeCallback(), this;
  }
  multiply(t) {
    return this.multiplyQuaternions(this, t);
  }
  premultiply(t) {
    return this.multiplyQuaternions(t, this);
  }
  multiplyQuaternions(t, e) {
    const n = t._x, s = t._y, r = t._z, o = t._w, a = e._x, l = e._y, h = e._z, u = e._w;
    return this._x = n * u + o * a + s * h - r * l, this._y = s * u + o * l + r * a - n * h, this._z = r * u + o * h + n * l - s * a, this._w = o * u - n * a - s * l - r * h, this._onChangeCallback(), this;
  }
  slerp(t, e) {
    if (e === 0) return this;
    if (e === 1) return this.copy(t);
    const n = this._x, s = this._y, r = this._z, o = this._w;
    let a = o * t._w + n * t._x + s * t._y + r * t._z;
    if (a < 0 ? (this._w = -t._w, this._x = -t._x, this._y = -t._y, this._z = -t._z, a = -a) : this.copy(t), a >= 1)
      return this._w = o, this._x = n, this._y = s, this._z = r, this;
    const l = 1 - a * a;
    if (l <= Number.EPSILON) {
      const d = 1 - e;
      return this._w = d * o + e * this._w, this._x = d * n + e * this._x, this._y = d * s + e * this._y, this._z = d * r + e * this._z, this.normalize(), this;
    }
    const h = Math.sqrt(l), u = Math.atan2(h, a), c = Math.sin((1 - e) * u) / h, f = Math.sin(e * u) / h;
    return this._w = o * c + this._w * f, this._x = n * c + this._x * f, this._y = s * c + this._y * f, this._z = r * c + this._z * f, this._onChangeCallback(), this;
  }
  slerpQuaternions(t, e, n) {
    return this.copy(t).slerp(e, n);
  }
  random() {
    const t = 2 * Math.PI * Math.random(), e = 2 * Math.PI * Math.random(), n = Math.random(), s = Math.sqrt(1 - n), r = Math.sqrt(n);
    return this.set(
      s * Math.sin(t),
      s * Math.cos(t),
      r * Math.sin(e),
      r * Math.cos(e)
    );
  }
  equals(t) {
    return t._x === this._x && t._y === this._y && t._z === this._z && t._w === this._w;
  }
  fromArray(t, e = 0) {
    return this._x = t[e], this._y = t[e + 1], this._z = t[e + 2], this._w = t[e + 3], this._onChangeCallback(), this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this._x, t[e + 1] = this._y, t[e + 2] = this._z, t[e + 3] = this._w, t;
  }
  fromBufferAttribute(t, e) {
    return this._x = t.getX(e), this._y = t.getY(e), this._z = t.getZ(e), this._w = t.getW(e), this._onChangeCallback(), this;
  }
  toJSON() {
    return this.toArray();
  }
  _onChange(t) {
    return this._onChangeCallback = t, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._w;
  }
}
class L {
  constructor(t = 0, e = 0, n = 0) {
    L.prototype.isVector3 = !0, this.x = t, this.y = e, this.z = n;
  }
  set(t, e, n) {
    return n === void 0 && (n = this.z), this.x = t, this.y = e, this.z = n, this;
  }
  setScalar(t) {
    return this.x = t, this.y = t, this.z = t, this;
  }
  setX(t) {
    return this.x = t, this;
  }
  setY(t) {
    return this.y = t, this;
  }
  setZ(t) {
    return this.z = t, this;
  }
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      case 2:
        this.z = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z);
  }
  copy(t) {
    return this.x = t.x, this.y = t.y, this.z = t.z, this;
  }
  add(t) {
    return this.x += t.x, this.y += t.y, this.z += t.z, this;
  }
  addScalar(t) {
    return this.x += t, this.y += t, this.z += t, this;
  }
  addVectors(t, e) {
    return this.x = t.x + e.x, this.y = t.y + e.y, this.z = t.z + e.z, this;
  }
  addScaledVector(t, e) {
    return this.x += t.x * e, this.y += t.y * e, this.z += t.z * e, this;
  }
  sub(t) {
    return this.x -= t.x, this.y -= t.y, this.z -= t.z, this;
  }
  subScalar(t) {
    return this.x -= t, this.y -= t, this.z -= t, this;
  }
  subVectors(t, e) {
    return this.x = t.x - e.x, this.y = t.y - e.y, this.z = t.z - e.z, this;
  }
  multiply(t) {
    return this.x *= t.x, this.y *= t.y, this.z *= t.z, this;
  }
  multiplyScalar(t) {
    return this.x *= t, this.y *= t, this.z *= t, this;
  }
  multiplyVectors(t, e) {
    return this.x = t.x * e.x, this.y = t.y * e.y, this.z = t.z * e.z, this;
  }
  applyEuler(t) {
    return this.applyQuaternion(Ca.setFromEuler(t));
  }
  applyAxisAngle(t, e) {
    return this.applyQuaternion(Ca.setFromAxisAngle(t, e));
  }
  applyMatrix3(t) {
    const e = this.x, n = this.y, s = this.z, r = t.elements;
    return this.x = r[0] * e + r[3] * n + r[6] * s, this.y = r[1] * e + r[4] * n + r[7] * s, this.z = r[2] * e + r[5] * n + r[8] * s, this;
  }
  applyNormalMatrix(t) {
    return this.applyMatrix3(t).normalize();
  }
  applyMatrix4(t) {
    const e = this.x, n = this.y, s = this.z, r = t.elements, o = 1 / (r[3] * e + r[7] * n + r[11] * s + r[15]);
    return this.x = (r[0] * e + r[4] * n + r[8] * s + r[12]) * o, this.y = (r[1] * e + r[5] * n + r[9] * s + r[13]) * o, this.z = (r[2] * e + r[6] * n + r[10] * s + r[14]) * o, this;
  }
  applyQuaternion(t) {
    const e = this.x, n = this.y, s = this.z, r = t.x, o = t.y, a = t.z, l = t.w, h = 2 * (o * s - a * n), u = 2 * (a * e - r * s), c = 2 * (r * n - o * e);
    return this.x = e + l * h + o * c - a * u, this.y = n + l * u + a * h - r * c, this.z = s + l * c + r * u - o * h, this;
  }
  project(t) {
    return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix);
  }
  unproject(t) {
    return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld);
  }
  transformDirection(t) {
    const e = this.x, n = this.y, s = this.z, r = t.elements;
    return this.x = r[0] * e + r[4] * n + r[8] * s, this.y = r[1] * e + r[5] * n + r[9] * s, this.z = r[2] * e + r[6] * n + r[10] * s, this.normalize();
  }
  divide(t) {
    return this.x /= t.x, this.y /= t.y, this.z /= t.z, this;
  }
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  min(t) {
    return this.x = Math.min(this.x, t.x), this.y = Math.min(this.y, t.y), this.z = Math.min(this.z, t.z), this;
  }
  max(t) {
    return this.x = Math.max(this.x, t.x), this.y = Math.max(this.y, t.y), this.z = Math.max(this.z, t.z), this;
  }
  clamp(t, e) {
    return this.x = Math.max(t.x, Math.min(e.x, this.x)), this.y = Math.max(t.y, Math.min(e.y, this.y)), this.z = Math.max(t.z, Math.min(e.z, this.z)), this;
  }
  clampScalar(t, e) {
    return this.x = Math.max(t, Math.min(e, this.x)), this.y = Math.max(t, Math.min(e, this.y)), this.z = Math.max(t, Math.min(e, this.z)), this;
  }
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(Math.max(t, Math.min(e, n)));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this;
  }
  dot(t) {
    return this.x * t.x + this.y * t.y + this.z * t.z;
  }
  // TODO lengthSquared?
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  lerp(t, e) {
    return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this.z += (t.z - this.z) * e, this;
  }
  lerpVectors(t, e, n) {
    return this.x = t.x + (e.x - t.x) * n, this.y = t.y + (e.y - t.y) * n, this.z = t.z + (e.z - t.z) * n, this;
  }
  cross(t) {
    return this.crossVectors(this, t);
  }
  crossVectors(t, e) {
    const n = t.x, s = t.y, r = t.z, o = e.x, a = e.y, l = e.z;
    return this.x = s * l - r * a, this.y = r * o - n * l, this.z = n * a - s * o, this;
  }
  projectOnVector(t) {
    const e = t.lengthSq();
    if (e === 0) return this.set(0, 0, 0);
    const n = t.dot(this) / e;
    return this.copy(t).multiplyScalar(n);
  }
  projectOnPlane(t) {
    return ar.copy(this).projectOnVector(t), this.sub(ar);
  }
  reflect(t) {
    return this.sub(ar.copy(t).multiplyScalar(2 * this.dot(t)));
  }
  angleTo(t) {
    const e = Math.sqrt(this.lengthSq() * t.lengthSq());
    if (e === 0) return Math.PI / 2;
    const n = this.dot(t) / e;
    return Math.acos(Se(n, -1, 1));
  }
  distanceTo(t) {
    return Math.sqrt(this.distanceToSquared(t));
  }
  distanceToSquared(t) {
    const e = this.x - t.x, n = this.y - t.y, s = this.z - t.z;
    return e * e + n * n + s * s;
  }
  manhattanDistanceTo(t) {
    return Math.abs(this.x - t.x) + Math.abs(this.y - t.y) + Math.abs(this.z - t.z);
  }
  setFromSpherical(t) {
    return this.setFromSphericalCoords(t.radius, t.phi, t.theta);
  }
  setFromSphericalCoords(t, e, n) {
    const s = Math.sin(e) * t;
    return this.x = s * Math.sin(n), this.y = Math.cos(e) * t, this.z = s * Math.cos(n), this;
  }
  setFromCylindrical(t) {
    return this.setFromCylindricalCoords(t.radius, t.theta, t.y);
  }
  setFromCylindricalCoords(t, e, n) {
    return this.x = t * Math.sin(e), this.y = n, this.z = t * Math.cos(e), this;
  }
  setFromMatrixPosition(t) {
    const e = t.elements;
    return this.x = e[12], this.y = e[13], this.z = e[14], this;
  }
  setFromMatrixScale(t) {
    const e = this.setFromMatrixColumn(t, 0).length(), n = this.setFromMatrixColumn(t, 1).length(), s = this.setFromMatrixColumn(t, 2).length();
    return this.x = e, this.y = n, this.z = s, this;
  }
  setFromMatrixColumn(t, e) {
    return this.fromArray(t.elements, e * 4);
  }
  setFromMatrix3Column(t, e) {
    return this.fromArray(t.elements, e * 3);
  }
  setFromEuler(t) {
    return this.x = t._x, this.y = t._y, this.z = t._z, this;
  }
  setFromColor(t) {
    return this.x = t.r, this.y = t.g, this.z = t.b, this;
  }
  equals(t) {
    return t.x === this.x && t.y === this.y && t.z === this.z;
  }
  fromArray(t, e = 0) {
    return this.x = t[e], this.y = t[e + 1], this.z = t[e + 2], this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this.x, t[e + 1] = this.y, t[e + 2] = this.z, t;
  }
  fromBufferAttribute(t, e) {
    return this.x = t.getX(e), this.y = t.getY(e), this.z = t.getZ(e), this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this;
  }
  randomDirection() {
    const t = Math.random() * Math.PI * 2, e = Math.random() * 2 - 1, n = Math.sqrt(1 - e * e);
    return this.x = n * Math.cos(t), this.y = e, this.z = n * Math.sin(t), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z;
  }
}
const ar = /* @__PURE__ */ new L(), Ca = /* @__PURE__ */ new as();
class ls {
  constructor(t = new L(1 / 0, 1 / 0, 1 / 0), e = new L(-1 / 0, -1 / 0, -1 / 0)) {
    this.isBox3 = !0, this.min = t, this.max = e;
  }
  set(t, e) {
    return this.min.copy(t), this.max.copy(e), this;
  }
  setFromArray(t) {
    this.makeEmpty();
    for (let e = 0, n = t.length; e < n; e += 3)
      this.expandByPoint(Ve.fromArray(t, e));
    return this;
  }
  setFromBufferAttribute(t) {
    this.makeEmpty();
    for (let e = 0, n = t.count; e < n; e++)
      this.expandByPoint(Ve.fromBufferAttribute(t, e));
    return this;
  }
  setFromPoints(t) {
    this.makeEmpty();
    for (let e = 0, n = t.length; e < n; e++)
      this.expandByPoint(t[e]);
    return this;
  }
  setFromCenterAndSize(t, e) {
    const n = Ve.copy(e).multiplyScalar(0.5);
    return this.min.copy(t).sub(n), this.max.copy(t).add(n), this;
  }
  setFromObject(t, e = !1) {
    return this.makeEmpty(), this.expandByObject(t, e);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return this.min.copy(t.min), this.max.copy(t.max), this;
  }
  makeEmpty() {
    return this.min.x = this.min.y = this.min.z = 1 / 0, this.max.x = this.max.y = this.max.z = -1 / 0, this;
  }
  isEmpty() {
    return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
  }
  getCenter(t) {
    return this.isEmpty() ? t.set(0, 0, 0) : t.addVectors(this.min, this.max).multiplyScalar(0.5);
  }
  getSize(t) {
    return this.isEmpty() ? t.set(0, 0, 0) : t.subVectors(this.max, this.min);
  }
  expandByPoint(t) {
    return this.min.min(t), this.max.max(t), this;
  }
  expandByVector(t) {
    return this.min.sub(t), this.max.add(t), this;
  }
  expandByScalar(t) {
    return this.min.addScalar(-t), this.max.addScalar(t), this;
  }
  expandByObject(t, e = !1) {
    t.updateWorldMatrix(!1, !1);
    const n = t.geometry;
    if (n !== void 0) {
      const r = n.getAttribute("position");
      if (e === !0 && r !== void 0 && t.isInstancedMesh !== !0)
        for (let o = 0, a = r.count; o < a; o++)
          t.isMesh === !0 ? t.getVertexPosition(o, Ve) : Ve.fromBufferAttribute(r, o), Ve.applyMatrix4(t.matrixWorld), this.expandByPoint(Ve);
      else
        t.boundingBox !== void 0 ? (t.boundingBox === null && t.computeBoundingBox(), ps.copy(t.boundingBox)) : (n.boundingBox === null && n.computeBoundingBox(), ps.copy(n.boundingBox)), ps.applyMatrix4(t.matrixWorld), this.union(ps);
    }
    const s = t.children;
    for (let r = 0, o = s.length; r < o; r++)
      this.expandByObject(s[r], e);
    return this;
  }
  containsPoint(t) {
    return t.x >= this.min.x && t.x <= this.max.x && t.y >= this.min.y && t.y <= this.max.y && t.z >= this.min.z && t.z <= this.max.z;
  }
  containsBox(t) {
    return this.min.x <= t.min.x && t.max.x <= this.max.x && this.min.y <= t.min.y && t.max.y <= this.max.y && this.min.z <= t.min.z && t.max.z <= this.max.z;
  }
  getParameter(t, e) {
    return e.set(
      (t.x - this.min.x) / (this.max.x - this.min.x),
      (t.y - this.min.y) / (this.max.y - this.min.y),
      (t.z - this.min.z) / (this.max.z - this.min.z)
    );
  }
  intersectsBox(t) {
    return t.max.x >= this.min.x && t.min.x <= this.max.x && t.max.y >= this.min.y && t.min.y <= this.max.y && t.max.z >= this.min.z && t.min.z <= this.max.z;
  }
  intersectsSphere(t) {
    return this.clampPoint(t.center, Ve), Ve.distanceToSquared(t.center) <= t.radius * t.radius;
  }
  intersectsPlane(t) {
    let e, n;
    return t.normal.x > 0 ? (e = t.normal.x * this.min.x, n = t.normal.x * this.max.x) : (e = t.normal.x * this.max.x, n = t.normal.x * this.min.x), t.normal.y > 0 ? (e += t.normal.y * this.min.y, n += t.normal.y * this.max.y) : (e += t.normal.y * this.max.y, n += t.normal.y * this.min.y), t.normal.z > 0 ? (e += t.normal.z * this.min.z, n += t.normal.z * this.max.z) : (e += t.normal.z * this.max.z, n += t.normal.z * this.min.z), e <= -t.constant && n >= -t.constant;
  }
  intersectsTriangle(t) {
    if (this.isEmpty())
      return !1;
    this.getCenter(Bi), ms.subVectors(this.max, Bi), ei.subVectors(t.a, Bi), ni.subVectors(t.b, Bi), ii.subVectors(t.c, Bi), xn.subVectors(ni, ei), vn.subVectors(ii, ni), In.subVectors(ei, ii);
    let e = [
      0,
      -xn.z,
      xn.y,
      0,
      -vn.z,
      vn.y,
      0,
      -In.z,
      In.y,
      xn.z,
      0,
      -xn.x,
      vn.z,
      0,
      -vn.x,
      In.z,
      0,
      -In.x,
      -xn.y,
      xn.x,
      0,
      -vn.y,
      vn.x,
      0,
      -In.y,
      In.x,
      0
    ];
    return !lr(e, ei, ni, ii, ms) || (e = [1, 0, 0, 0, 1, 0, 0, 0, 1], !lr(e, ei, ni, ii, ms)) ? !1 : (gs.crossVectors(xn, vn), e = [gs.x, gs.y, gs.z], lr(e, ei, ni, ii, ms));
  }
  clampPoint(t, e) {
    return e.copy(t).clamp(this.min, this.max);
  }
  distanceToPoint(t) {
    return this.clampPoint(t, Ve).distanceTo(t);
  }
  getBoundingSphere(t) {
    return this.isEmpty() ? t.makeEmpty() : (this.getCenter(t.center), t.radius = this.getSize(Ve).length() * 0.5), t;
  }
  intersect(t) {
    return this.min.max(t.min), this.max.min(t.max), this.isEmpty() && this.makeEmpty(), this;
  }
  union(t) {
    return this.min.min(t.min), this.max.max(t.max), this;
  }
  applyMatrix4(t) {
    return this.isEmpty() ? this : (nn[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(t), nn[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(t), nn[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(t), nn[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(t), nn[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(t), nn[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(t), nn[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(t), nn[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(t), this.setFromPoints(nn), this);
  }
  translate(t) {
    return this.min.add(t), this.max.add(t), this;
  }
  equals(t) {
    return t.min.equals(this.min) && t.max.equals(this.max);
  }
}
const nn = [
  /* @__PURE__ */ new L(),
  /* @__PURE__ */ new L(),
  /* @__PURE__ */ new L(),
  /* @__PURE__ */ new L(),
  /* @__PURE__ */ new L(),
  /* @__PURE__ */ new L(),
  /* @__PURE__ */ new L(),
  /* @__PURE__ */ new L()
], Ve = /* @__PURE__ */ new L(), ps = /* @__PURE__ */ new ls(), ei = /* @__PURE__ */ new L(), ni = /* @__PURE__ */ new L(), ii = /* @__PURE__ */ new L(), xn = /* @__PURE__ */ new L(), vn = /* @__PURE__ */ new L(), In = /* @__PURE__ */ new L(), Bi = /* @__PURE__ */ new L(), ms = /* @__PURE__ */ new L(), gs = /* @__PURE__ */ new L(), Nn = /* @__PURE__ */ new L();
function lr(i, t, e, n, s) {
  for (let r = 0, o = i.length - 3; r <= o; r += 3) {
    Nn.fromArray(i, r);
    const a = s.x * Math.abs(Nn.x) + s.y * Math.abs(Nn.y) + s.z * Math.abs(Nn.z), l = t.dot(Nn), h = e.dot(Nn), u = n.dot(Nn);
    if (Math.max(-Math.max(l, h, u), Math.min(l, h, u)) > a)
      return !1;
  }
  return !0;
}
const hu = /* @__PURE__ */ new ls(), zi = /* @__PURE__ */ new L(), cr = /* @__PURE__ */ new L();
class tr {
  constructor(t = new L(), e = -1) {
    this.isSphere = !0, this.center = t, this.radius = e;
  }
  set(t, e) {
    return this.center.copy(t), this.radius = e, this;
  }
  setFromPoints(t, e) {
    const n = this.center;
    e !== void 0 ? n.copy(e) : hu.setFromPoints(t).getCenter(n);
    let s = 0;
    for (let r = 0, o = t.length; r < o; r++)
      s = Math.max(s, n.distanceToSquared(t[r]));
    return this.radius = Math.sqrt(s), this;
  }
  copy(t) {
    return this.center.copy(t.center), this.radius = t.radius, this;
  }
  isEmpty() {
    return this.radius < 0;
  }
  makeEmpty() {
    return this.center.set(0, 0, 0), this.radius = -1, this;
  }
  containsPoint(t) {
    return t.distanceToSquared(this.center) <= this.radius * this.radius;
  }
  distanceToPoint(t) {
    return t.distanceTo(this.center) - this.radius;
  }
  intersectsSphere(t) {
    const e = this.radius + t.radius;
    return t.center.distanceToSquared(this.center) <= e * e;
  }
  intersectsBox(t) {
    return t.intersectsSphere(this);
  }
  intersectsPlane(t) {
    return Math.abs(t.distanceToPoint(this.center)) <= this.radius;
  }
  clampPoint(t, e) {
    const n = this.center.distanceToSquared(t);
    return e.copy(t), n > this.radius * this.radius && (e.sub(this.center).normalize(), e.multiplyScalar(this.radius).add(this.center)), e;
  }
  getBoundingBox(t) {
    return this.isEmpty() ? (t.makeEmpty(), t) : (t.set(this.center, this.center), t.expandByScalar(this.radius), t);
  }
  applyMatrix4(t) {
    return this.center.applyMatrix4(t), this.radius = this.radius * t.getMaxScaleOnAxis(), this;
  }
  translate(t) {
    return this.center.add(t), this;
  }
  expandByPoint(t) {
    if (this.isEmpty())
      return this.center.copy(t), this.radius = 0, this;
    zi.subVectors(t, this.center);
    const e = zi.lengthSq();
    if (e > this.radius * this.radius) {
      const n = Math.sqrt(e), s = (n - this.radius) * 0.5;
      this.center.addScaledVector(zi, s / n), this.radius += s;
    }
    return this;
  }
  union(t) {
    return t.isEmpty() ? this : this.isEmpty() ? (this.copy(t), this) : (this.center.equals(t.center) === !0 ? this.radius = Math.max(this.radius, t.radius) : (cr.subVectors(t.center, this.center).setLength(t.radius), this.expandByPoint(zi.copy(t.center).add(cr)), this.expandByPoint(zi.copy(t.center).sub(cr))), this);
  }
  equals(t) {
    return t.center.equals(this.center) && t.radius === this.radius;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const sn = /* @__PURE__ */ new L(), hr = /* @__PURE__ */ new L(), _s = /* @__PURE__ */ new L(), Mn = /* @__PURE__ */ new L(), ur = /* @__PURE__ */ new L(), xs = /* @__PURE__ */ new L(), dr = /* @__PURE__ */ new L();
class Vo {
  constructor(t = new L(), e = new L(0, 0, -1)) {
    this.origin = t, this.direction = e;
  }
  set(t, e) {
    return this.origin.copy(t), this.direction.copy(e), this;
  }
  copy(t) {
    return this.origin.copy(t.origin), this.direction.copy(t.direction), this;
  }
  at(t, e) {
    return e.copy(this.origin).addScaledVector(this.direction, t);
  }
  lookAt(t) {
    return this.direction.copy(t).sub(this.origin).normalize(), this;
  }
  recast(t) {
    return this.origin.copy(this.at(t, sn)), this;
  }
  closestPointToPoint(t, e) {
    e.subVectors(t, this.origin);
    const n = e.dot(this.direction);
    return n < 0 ? e.copy(this.origin) : e.copy(this.origin).addScaledVector(this.direction, n);
  }
  distanceToPoint(t) {
    return Math.sqrt(this.distanceSqToPoint(t));
  }
  distanceSqToPoint(t) {
    const e = sn.subVectors(t, this.origin).dot(this.direction);
    return e < 0 ? this.origin.distanceToSquared(t) : (sn.copy(this.origin).addScaledVector(this.direction, e), sn.distanceToSquared(t));
  }
  distanceSqToSegment(t, e, n, s) {
    hr.copy(t).add(e).multiplyScalar(0.5), _s.copy(e).sub(t).normalize(), Mn.copy(this.origin).sub(hr);
    const r = t.distanceTo(e) * 0.5, o = -this.direction.dot(_s), a = Mn.dot(this.direction), l = -Mn.dot(_s), h = Mn.lengthSq(), u = Math.abs(1 - o * o);
    let c, f, d, g;
    if (u > 0)
      if (c = o * l - a, f = o * a - l, g = r * u, c >= 0)
        if (f >= -g)
          if (f <= g) {
            const x = 1 / u;
            c *= x, f *= x, d = c * (c + o * f + 2 * a) + f * (o * c + f + 2 * l) + h;
          } else
            f = r, c = Math.max(0, -(o * f + a)), d = -c * c + f * (f + 2 * l) + h;
        else
          f = -r, c = Math.max(0, -(o * f + a)), d = -c * c + f * (f + 2 * l) + h;
      else
        f <= -g ? (c = Math.max(0, -(-o * r + a)), f = c > 0 ? -r : Math.min(Math.max(-r, -l), r), d = -c * c + f * (f + 2 * l) + h) : f <= g ? (c = 0, f = Math.min(Math.max(-r, -l), r), d = f * (f + 2 * l) + h) : (c = Math.max(0, -(o * r + a)), f = c > 0 ? r : Math.min(Math.max(-r, -l), r), d = -c * c + f * (f + 2 * l) + h);
    else
      f = o > 0 ? -r : r, c = Math.max(0, -(o * f + a)), d = -c * c + f * (f + 2 * l) + h;
    return n && n.copy(this.origin).addScaledVector(this.direction, c), s && s.copy(hr).addScaledVector(_s, f), d;
  }
  intersectSphere(t, e) {
    sn.subVectors(t.center, this.origin);
    const n = sn.dot(this.direction), s = sn.dot(sn) - n * n, r = t.radius * t.radius;
    if (s > r) return null;
    const o = Math.sqrt(r - s), a = n - o, l = n + o;
    return l < 0 ? null : a < 0 ? this.at(l, e) : this.at(a, e);
  }
  intersectsSphere(t) {
    return this.distanceSqToPoint(t.center) <= t.radius * t.radius;
  }
  distanceToPlane(t) {
    const e = t.normal.dot(this.direction);
    if (e === 0)
      return t.distanceToPoint(this.origin) === 0 ? 0 : null;
    const n = -(this.origin.dot(t.normal) + t.constant) / e;
    return n >= 0 ? n : null;
  }
  intersectPlane(t, e) {
    const n = this.distanceToPlane(t);
    return n === null ? null : this.at(n, e);
  }
  intersectsPlane(t) {
    const e = t.distanceToPoint(this.origin);
    return e === 0 || t.normal.dot(this.direction) * e < 0;
  }
  intersectBox(t, e) {
    let n, s, r, o, a, l;
    const h = 1 / this.direction.x, u = 1 / this.direction.y, c = 1 / this.direction.z, f = this.origin;
    return h >= 0 ? (n = (t.min.x - f.x) * h, s = (t.max.x - f.x) * h) : (n = (t.max.x - f.x) * h, s = (t.min.x - f.x) * h), u >= 0 ? (r = (t.min.y - f.y) * u, o = (t.max.y - f.y) * u) : (r = (t.max.y - f.y) * u, o = (t.min.y - f.y) * u), n > o || r > s || ((r > n || isNaN(n)) && (n = r), (o < s || isNaN(s)) && (s = o), c >= 0 ? (a = (t.min.z - f.z) * c, l = (t.max.z - f.z) * c) : (a = (t.max.z - f.z) * c, l = (t.min.z - f.z) * c), n > l || a > s) || ((a > n || n !== n) && (n = a), (l < s || s !== s) && (s = l), s < 0) ? null : this.at(n >= 0 ? n : s, e);
  }
  intersectsBox(t) {
    return this.intersectBox(t, sn) !== null;
  }
  intersectTriangle(t, e, n, s, r) {
    ur.subVectors(e, t), xs.subVectors(n, t), dr.crossVectors(ur, xs);
    let o = this.direction.dot(dr), a;
    if (o > 0) {
      if (s) return null;
      a = 1;
    } else if (o < 0)
      a = -1, o = -o;
    else
      return null;
    Mn.subVectors(this.origin, t);
    const l = a * this.direction.dot(xs.crossVectors(Mn, xs));
    if (l < 0)
      return null;
    const h = a * this.direction.dot(ur.cross(Mn));
    if (h < 0 || l + h > o)
      return null;
    const u = -a * Mn.dot(dr);
    return u < 0 ? null : this.at(u / o, r);
  }
  applyMatrix4(t) {
    return this.origin.applyMatrix4(t), this.direction.transformDirection(t), this;
  }
  equals(t) {
    return t.origin.equals(this.origin) && t.direction.equals(this.direction);
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
class re {
  constructor(t, e, n, s, r, o, a, l, h, u, c, f, d, g, x, m) {
    re.prototype.isMatrix4 = !0, this.elements = [
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ], t !== void 0 && this.set(t, e, n, s, r, o, a, l, h, u, c, f, d, g, x, m);
  }
  set(t, e, n, s, r, o, a, l, h, u, c, f, d, g, x, m) {
    const p = this.elements;
    return p[0] = t, p[4] = e, p[8] = n, p[12] = s, p[1] = r, p[5] = o, p[9] = a, p[13] = l, p[2] = h, p[6] = u, p[10] = c, p[14] = f, p[3] = d, p[7] = g, p[11] = x, p[15] = m, this;
  }
  identity() {
    return this.set(
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  clone() {
    return new re().fromArray(this.elements);
  }
  copy(t) {
    const e = this.elements, n = t.elements;
    return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e[4] = n[4], e[5] = n[5], e[6] = n[6], e[7] = n[7], e[8] = n[8], e[9] = n[9], e[10] = n[10], e[11] = n[11], e[12] = n[12], e[13] = n[13], e[14] = n[14], e[15] = n[15], this;
  }
  copyPosition(t) {
    const e = this.elements, n = t.elements;
    return e[12] = n[12], e[13] = n[13], e[14] = n[14], this;
  }
  setFromMatrix3(t) {
    const e = t.elements;
    return this.set(
      e[0],
      e[3],
      e[6],
      0,
      e[1],
      e[4],
      e[7],
      0,
      e[2],
      e[5],
      e[8],
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  extractBasis(t, e, n) {
    return t.setFromMatrixColumn(this, 0), e.setFromMatrixColumn(this, 1), n.setFromMatrixColumn(this, 2), this;
  }
  makeBasis(t, e, n) {
    return this.set(
      t.x,
      e.x,
      n.x,
      0,
      t.y,
      e.y,
      n.y,
      0,
      t.z,
      e.z,
      n.z,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  extractRotation(t) {
    const e = this.elements, n = t.elements, s = 1 / si.setFromMatrixColumn(t, 0).length(), r = 1 / si.setFromMatrixColumn(t, 1).length(), o = 1 / si.setFromMatrixColumn(t, 2).length();
    return e[0] = n[0] * s, e[1] = n[1] * s, e[2] = n[2] * s, e[3] = 0, e[4] = n[4] * r, e[5] = n[5] * r, e[6] = n[6] * r, e[7] = 0, e[8] = n[8] * o, e[9] = n[9] * o, e[10] = n[10] * o, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, this;
  }
  makeRotationFromEuler(t) {
    const e = this.elements, n = t.x, s = t.y, r = t.z, o = Math.cos(n), a = Math.sin(n), l = Math.cos(s), h = Math.sin(s), u = Math.cos(r), c = Math.sin(r);
    if (t.order === "XYZ") {
      const f = o * u, d = o * c, g = a * u, x = a * c;
      e[0] = l * u, e[4] = -l * c, e[8] = h, e[1] = d + g * h, e[5] = f - x * h, e[9] = -a * l, e[2] = x - f * h, e[6] = g + d * h, e[10] = o * l;
    } else if (t.order === "YXZ") {
      const f = l * u, d = l * c, g = h * u, x = h * c;
      e[0] = f + x * a, e[4] = g * a - d, e[8] = o * h, e[1] = o * c, e[5] = o * u, e[9] = -a, e[2] = d * a - g, e[6] = x + f * a, e[10] = o * l;
    } else if (t.order === "ZXY") {
      const f = l * u, d = l * c, g = h * u, x = h * c;
      e[0] = f - x * a, e[4] = -o * c, e[8] = g + d * a, e[1] = d + g * a, e[5] = o * u, e[9] = x - f * a, e[2] = -o * h, e[6] = a, e[10] = o * l;
    } else if (t.order === "ZYX") {
      const f = o * u, d = o * c, g = a * u, x = a * c;
      e[0] = l * u, e[4] = g * h - d, e[8] = f * h + x, e[1] = l * c, e[5] = x * h + f, e[9] = d * h - g, e[2] = -h, e[6] = a * l, e[10] = o * l;
    } else if (t.order === "YZX") {
      const f = o * l, d = o * h, g = a * l, x = a * h;
      e[0] = l * u, e[4] = x - f * c, e[8] = g * c + d, e[1] = c, e[5] = o * u, e[9] = -a * u, e[2] = -h * u, e[6] = d * c + g, e[10] = f - x * c;
    } else if (t.order === "XZY") {
      const f = o * l, d = o * h, g = a * l, x = a * h;
      e[0] = l * u, e[4] = -c, e[8] = h * u, e[1] = f * c + x, e[5] = o * u, e[9] = d * c - g, e[2] = g * c - d, e[6] = a * u, e[10] = x * c + f;
    }
    return e[3] = 0, e[7] = 0, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, this;
  }
  makeRotationFromQuaternion(t) {
    return this.compose(uu, t, du);
  }
  lookAt(t, e, n) {
    const s = this.elements;
    return Le.subVectors(t, e), Le.lengthSq() === 0 && (Le.z = 1), Le.normalize(), Sn.crossVectors(n, Le), Sn.lengthSq() === 0 && (Math.abs(n.z) === 1 ? Le.x += 1e-4 : Le.z += 1e-4, Le.normalize(), Sn.crossVectors(n, Le)), Sn.normalize(), vs.crossVectors(Le, Sn), s[0] = Sn.x, s[4] = vs.x, s[8] = Le.x, s[1] = Sn.y, s[5] = vs.y, s[9] = Le.y, s[2] = Sn.z, s[6] = vs.z, s[10] = Le.z, this;
  }
  multiply(t) {
    return this.multiplyMatrices(this, t);
  }
  premultiply(t) {
    return this.multiplyMatrices(t, this);
  }
  multiplyMatrices(t, e) {
    const n = t.elements, s = e.elements, r = this.elements, o = n[0], a = n[4], l = n[8], h = n[12], u = n[1], c = n[5], f = n[9], d = n[13], g = n[2], x = n[6], m = n[10], p = n[14], E = n[3], b = n[7], y = n[11], N = n[15], R = s[0], T = s[4], C = s[8], M = s[12], _ = s[1], A = s[5], F = s[9], O = s[13], G = s[2], $ = s[6], V = s[10], K = s[14], H = s[3], st = s[7], ut = s[11], yt = s[15];
    return r[0] = o * R + a * _ + l * G + h * H, r[4] = o * T + a * A + l * $ + h * st, r[8] = o * C + a * F + l * V + h * ut, r[12] = o * M + a * O + l * K + h * yt, r[1] = u * R + c * _ + f * G + d * H, r[5] = u * T + c * A + f * $ + d * st, r[9] = u * C + c * F + f * V + d * ut, r[13] = u * M + c * O + f * K + d * yt, r[2] = g * R + x * _ + m * G + p * H, r[6] = g * T + x * A + m * $ + p * st, r[10] = g * C + x * F + m * V + p * ut, r[14] = g * M + x * O + m * K + p * yt, r[3] = E * R + b * _ + y * G + N * H, r[7] = E * T + b * A + y * $ + N * st, r[11] = E * C + b * F + y * V + N * ut, r[15] = E * M + b * O + y * K + N * yt, this;
  }
  multiplyScalar(t) {
    const e = this.elements;
    return e[0] *= t, e[4] *= t, e[8] *= t, e[12] *= t, e[1] *= t, e[5] *= t, e[9] *= t, e[13] *= t, e[2] *= t, e[6] *= t, e[10] *= t, e[14] *= t, e[3] *= t, e[7] *= t, e[11] *= t, e[15] *= t, this;
  }
  determinant() {
    const t = this.elements, e = t[0], n = t[4], s = t[8], r = t[12], o = t[1], a = t[5], l = t[9], h = t[13], u = t[2], c = t[6], f = t[10], d = t[14], g = t[3], x = t[7], m = t[11], p = t[15];
    return g * (+r * l * c - s * h * c - r * a * f + n * h * f + s * a * d - n * l * d) + x * (+e * l * d - e * h * f + r * o * f - s * o * d + s * h * u - r * l * u) + m * (+e * h * c - e * a * d - r * o * c + n * o * d + r * a * u - n * h * u) + p * (-s * a * u - e * l * c + e * a * f + s * o * c - n * o * f + n * l * u);
  }
  transpose() {
    const t = this.elements;
    let e;
    return e = t[1], t[1] = t[4], t[4] = e, e = t[2], t[2] = t[8], t[8] = e, e = t[6], t[6] = t[9], t[9] = e, e = t[3], t[3] = t[12], t[12] = e, e = t[7], t[7] = t[13], t[13] = e, e = t[11], t[11] = t[14], t[14] = e, this;
  }
  setPosition(t, e, n) {
    const s = this.elements;
    return t.isVector3 ? (s[12] = t.x, s[13] = t.y, s[14] = t.z) : (s[12] = t, s[13] = e, s[14] = n), this;
  }
  invert() {
    const t = this.elements, e = t[0], n = t[1], s = t[2], r = t[3], o = t[4], a = t[5], l = t[6], h = t[7], u = t[8], c = t[9], f = t[10], d = t[11], g = t[12], x = t[13], m = t[14], p = t[15], E = c * m * h - x * f * h + x * l * d - a * m * d - c * l * p + a * f * p, b = g * f * h - u * m * h - g * l * d + o * m * d + u * l * p - o * f * p, y = u * x * h - g * c * h + g * a * d - o * x * d - u * a * p + o * c * p, N = g * c * l - u * x * l - g * a * f + o * x * f + u * a * m - o * c * m, R = e * E + n * b + s * y + r * N;
    if (R === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const T = 1 / R;
    return t[0] = E * T, t[1] = (x * f * r - c * m * r - x * s * d + n * m * d + c * s * p - n * f * p) * T, t[2] = (a * m * r - x * l * r + x * s * h - n * m * h - a * s * p + n * l * p) * T, t[3] = (c * l * r - a * f * r - c * s * h + n * f * h + a * s * d - n * l * d) * T, t[4] = b * T, t[5] = (u * m * r - g * f * r + g * s * d - e * m * d - u * s * p + e * f * p) * T, t[6] = (g * l * r - o * m * r - g * s * h + e * m * h + o * s * p - e * l * p) * T, t[7] = (o * f * r - u * l * r + u * s * h - e * f * h - o * s * d + e * l * d) * T, t[8] = y * T, t[9] = (g * c * r - u * x * r - g * n * d + e * x * d + u * n * p - e * c * p) * T, t[10] = (o * x * r - g * a * r + g * n * h - e * x * h - o * n * p + e * a * p) * T, t[11] = (u * a * r - o * c * r - u * n * h + e * c * h + o * n * d - e * a * d) * T, t[12] = N * T, t[13] = (u * x * s - g * c * s + g * n * f - e * x * f - u * n * m + e * c * m) * T, t[14] = (g * a * s - o * x * s - g * n * l + e * x * l + o * n * m - e * a * m) * T, t[15] = (o * c * s - u * a * s + u * n * l - e * c * l - o * n * f + e * a * f) * T, this;
  }
  scale(t) {
    const e = this.elements, n = t.x, s = t.y, r = t.z;
    return e[0] *= n, e[4] *= s, e[8] *= r, e[1] *= n, e[5] *= s, e[9] *= r, e[2] *= n, e[6] *= s, e[10] *= r, e[3] *= n, e[7] *= s, e[11] *= r, this;
  }
  getMaxScaleOnAxis() {
    const t = this.elements, e = t[0] * t[0] + t[1] * t[1] + t[2] * t[2], n = t[4] * t[4] + t[5] * t[5] + t[6] * t[6], s = t[8] * t[8] + t[9] * t[9] + t[10] * t[10];
    return Math.sqrt(Math.max(e, n, s));
  }
  makeTranslation(t, e, n) {
    return t.isVector3 ? this.set(
      1,
      0,
      0,
      t.x,
      0,
      1,
      0,
      t.y,
      0,
      0,
      1,
      t.z,
      0,
      0,
      0,
      1
    ) : this.set(
      1,
      0,
      0,
      t,
      0,
      1,
      0,
      e,
      0,
      0,
      1,
      n,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationX(t) {
    const e = Math.cos(t), n = Math.sin(t);
    return this.set(
      1,
      0,
      0,
      0,
      0,
      e,
      -n,
      0,
      0,
      n,
      e,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationY(t) {
    const e = Math.cos(t), n = Math.sin(t);
    return this.set(
      e,
      0,
      n,
      0,
      0,
      1,
      0,
      0,
      -n,
      0,
      e,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationZ(t) {
    const e = Math.cos(t), n = Math.sin(t);
    return this.set(
      e,
      -n,
      0,
      0,
      n,
      e,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationAxis(t, e) {
    const n = Math.cos(e), s = Math.sin(e), r = 1 - n, o = t.x, a = t.y, l = t.z, h = r * o, u = r * a;
    return this.set(
      h * o + n,
      h * a - s * l,
      h * l + s * a,
      0,
      h * a + s * l,
      u * a + n,
      u * l - s * o,
      0,
      h * l - s * a,
      u * l + s * o,
      r * l * l + n,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeScale(t, e, n) {
    return this.set(
      t,
      0,
      0,
      0,
      0,
      e,
      0,
      0,
      0,
      0,
      n,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeShear(t, e, n, s, r, o) {
    return this.set(
      1,
      n,
      r,
      0,
      t,
      1,
      o,
      0,
      e,
      s,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  compose(t, e, n) {
    const s = this.elements, r = e._x, o = e._y, a = e._z, l = e._w, h = r + r, u = o + o, c = a + a, f = r * h, d = r * u, g = r * c, x = o * u, m = o * c, p = a * c, E = l * h, b = l * u, y = l * c, N = n.x, R = n.y, T = n.z;
    return s[0] = (1 - (x + p)) * N, s[1] = (d + y) * N, s[2] = (g - b) * N, s[3] = 0, s[4] = (d - y) * R, s[5] = (1 - (f + p)) * R, s[6] = (m + E) * R, s[7] = 0, s[8] = (g + b) * T, s[9] = (m - E) * T, s[10] = (1 - (f + x)) * T, s[11] = 0, s[12] = t.x, s[13] = t.y, s[14] = t.z, s[15] = 1, this;
  }
  decompose(t, e, n) {
    const s = this.elements;
    let r = si.set(s[0], s[1], s[2]).length();
    const o = si.set(s[4], s[5], s[6]).length(), a = si.set(s[8], s[9], s[10]).length();
    this.determinant() < 0 && (r = -r), t.x = s[12], t.y = s[13], t.z = s[14], Ge.copy(this);
    const h = 1 / r, u = 1 / o, c = 1 / a;
    return Ge.elements[0] *= h, Ge.elements[1] *= h, Ge.elements[2] *= h, Ge.elements[4] *= u, Ge.elements[5] *= u, Ge.elements[6] *= u, Ge.elements[8] *= c, Ge.elements[9] *= c, Ge.elements[10] *= c, e.setFromRotationMatrix(Ge), n.x = r, n.y = o, n.z = a, this;
  }
  makePerspective(t, e, n, s, r, o, a = dn) {
    const l = this.elements, h = 2 * r / (e - t), u = 2 * r / (n - s), c = (e + t) / (e - t), f = (n + s) / (n - s);
    let d, g;
    if (a === dn)
      d = -(o + r) / (o - r), g = -2 * o * r / (o - r);
    else if (a === qs)
      d = -o / (o - r), g = -o * r / (o - r);
    else
      throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + a);
    return l[0] = h, l[4] = 0, l[8] = c, l[12] = 0, l[1] = 0, l[5] = u, l[9] = f, l[13] = 0, l[2] = 0, l[6] = 0, l[10] = d, l[14] = g, l[3] = 0, l[7] = 0, l[11] = -1, l[15] = 0, this;
  }
  makeOrthographic(t, e, n, s, r, o, a = dn) {
    const l = this.elements, h = 1 / (e - t), u = 1 / (n - s), c = 1 / (o - r), f = (e + t) * h, d = (n + s) * u;
    let g, x;
    if (a === dn)
      g = (o + r) * c, x = -2 * c;
    else if (a === qs)
      g = r * c, x = -1 * c;
    else
      throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + a);
    return l[0] = 2 * h, l[4] = 0, l[8] = 0, l[12] = -f, l[1] = 0, l[5] = 2 * u, l[9] = 0, l[13] = -d, l[2] = 0, l[6] = 0, l[10] = x, l[14] = -g, l[3] = 0, l[7] = 0, l[11] = 0, l[15] = 1, this;
  }
  equals(t) {
    const e = this.elements, n = t.elements;
    for (let s = 0; s < 16; s++)
      if (e[s] !== n[s]) return !1;
    return !0;
  }
  fromArray(t, e = 0) {
    for (let n = 0; n < 16; n++)
      this.elements[n] = t[n + e];
    return this;
  }
  toArray(t = [], e = 0) {
    const n = this.elements;
    return t[e] = n[0], t[e + 1] = n[1], t[e + 2] = n[2], t[e + 3] = n[3], t[e + 4] = n[4], t[e + 5] = n[5], t[e + 6] = n[6], t[e + 7] = n[7], t[e + 8] = n[8], t[e + 9] = n[9], t[e + 10] = n[10], t[e + 11] = n[11], t[e + 12] = n[12], t[e + 13] = n[13], t[e + 14] = n[14], t[e + 15] = n[15], t;
  }
}
const si = /* @__PURE__ */ new L(), Ge = /* @__PURE__ */ new re(), uu = /* @__PURE__ */ new L(0, 0, 0), du = /* @__PURE__ */ new L(1, 1, 1), Sn = /* @__PURE__ */ new L(), vs = /* @__PURE__ */ new L(), Le = /* @__PURE__ */ new L(), Pa = /* @__PURE__ */ new re(), La = /* @__PURE__ */ new as();
class Je {
  constructor(t = 0, e = 0, n = 0, s = Je.DEFAULT_ORDER) {
    this.isEuler = !0, this._x = t, this._y = e, this._z = n, this._order = s;
  }
  get x() {
    return this._x;
  }
  set x(t) {
    this._x = t, this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(t) {
    this._y = t, this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(t) {
    this._z = t, this._onChangeCallback();
  }
  get order() {
    return this._order;
  }
  set order(t) {
    this._order = t, this._onChangeCallback();
  }
  set(t, e, n, s = this._order) {
    return this._x = t, this._y = e, this._z = n, this._order = s, this._onChangeCallback(), this;
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._order);
  }
  copy(t) {
    return this._x = t._x, this._y = t._y, this._z = t._z, this._order = t._order, this._onChangeCallback(), this;
  }
  setFromRotationMatrix(t, e = this._order, n = !0) {
    const s = t.elements, r = s[0], o = s[4], a = s[8], l = s[1], h = s[5], u = s[9], c = s[2], f = s[6], d = s[10];
    switch (e) {
      case "XYZ":
        this._y = Math.asin(Se(a, -1, 1)), Math.abs(a) < 0.9999999 ? (this._x = Math.atan2(-u, d), this._z = Math.atan2(-o, r)) : (this._x = Math.atan2(f, h), this._z = 0);
        break;
      case "YXZ":
        this._x = Math.asin(-Se(u, -1, 1)), Math.abs(u) < 0.9999999 ? (this._y = Math.atan2(a, d), this._z = Math.atan2(l, h)) : (this._y = Math.atan2(-c, r), this._z = 0);
        break;
      case "ZXY":
        this._x = Math.asin(Se(f, -1, 1)), Math.abs(f) < 0.9999999 ? (this._y = Math.atan2(-c, d), this._z = Math.atan2(-o, h)) : (this._y = 0, this._z = Math.atan2(l, r));
        break;
      case "ZYX":
        this._y = Math.asin(-Se(c, -1, 1)), Math.abs(c) < 0.9999999 ? (this._x = Math.atan2(f, d), this._z = Math.atan2(l, r)) : (this._x = 0, this._z = Math.atan2(-o, h));
        break;
      case "YZX":
        this._z = Math.asin(Se(l, -1, 1)), Math.abs(l) < 0.9999999 ? (this._x = Math.atan2(-u, h), this._y = Math.atan2(-c, r)) : (this._x = 0, this._y = Math.atan2(a, d));
        break;
      case "XZY":
        this._z = Math.asin(-Se(o, -1, 1)), Math.abs(o) < 0.9999999 ? (this._x = Math.atan2(f, h), this._y = Math.atan2(a, r)) : (this._x = Math.atan2(-u, d), this._y = 0);
        break;
      default:
        console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + e);
    }
    return this._order = e, n === !0 && this._onChangeCallback(), this;
  }
  setFromQuaternion(t, e, n) {
    return Pa.makeRotationFromQuaternion(t), this.setFromRotationMatrix(Pa, e, n);
  }
  setFromVector3(t, e = this._order) {
    return this.set(t.x, t.y, t.z, e);
  }
  reorder(t) {
    return La.setFromEuler(this), this.setFromQuaternion(La, t);
  }
  equals(t) {
    return t._x === this._x && t._y === this._y && t._z === this._z && t._order === this._order;
  }
  fromArray(t) {
    return this._x = t[0], this._y = t[1], this._z = t[2], t[3] !== void 0 && (this._order = t[3]), this._onChangeCallback(), this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this._x, t[e + 1] = this._y, t[e + 2] = this._z, t[e + 3] = this._order, t;
  }
  _onChange(t) {
    return this._onChangeCallback = t, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._order;
  }
}
Je.DEFAULT_ORDER = "XYZ";
class Go {
  constructor() {
    this.mask = 1;
  }
  set(t) {
    this.mask = (1 << t | 0) >>> 0;
  }
  enable(t) {
    this.mask |= 1 << t | 0;
  }
  enableAll() {
    this.mask = -1;
  }
  toggle(t) {
    this.mask ^= 1 << t | 0;
  }
  disable(t) {
    this.mask &= ~(1 << t | 0);
  }
  disableAll() {
    this.mask = 0;
  }
  test(t) {
    return (this.mask & t.mask) !== 0;
  }
  isEnabled(t) {
    return (this.mask & (1 << t | 0)) !== 0;
  }
}
let fu = 0;
const Da = /* @__PURE__ */ new L(), ri = /* @__PURE__ */ new as(), rn = /* @__PURE__ */ new re(), Ms = /* @__PURE__ */ new L(), ki = /* @__PURE__ */ new L(), pu = /* @__PURE__ */ new L(), mu = /* @__PURE__ */ new as(), Ua = /* @__PURE__ */ new L(1, 0, 0), Ia = /* @__PURE__ */ new L(0, 1, 0), Na = /* @__PURE__ */ new L(0, 0, 1), Fa = { type: "added" }, gu = { type: "removed" }, oi = { type: "childadded", child: null }, fr = { type: "childremoved", child: null };
class ge extends Li {
  constructor() {
    super(), this.isObject3D = !0, Object.defineProperty(this, "id", { value: fu++ }), this.uuid = Di(), this.name = "", this.type = "Object3D", this.parent = null, this.children = [], this.up = ge.DEFAULT_UP.clone();
    const t = new L(), e = new Je(), n = new as(), s = new L(1, 1, 1);
    function r() {
      n.setFromEuler(e, !1);
    }
    function o() {
      e.setFromQuaternion(n, void 0, !1);
    }
    e._onChange(r), n._onChange(o), Object.defineProperties(this, {
      position: {
        configurable: !0,
        enumerable: !0,
        value: t
      },
      rotation: {
        configurable: !0,
        enumerable: !0,
        value: e
      },
      quaternion: {
        configurable: !0,
        enumerable: !0,
        value: n
      },
      scale: {
        configurable: !0,
        enumerable: !0,
        value: s
      },
      modelViewMatrix: {
        value: new re()
      },
      normalMatrix: {
        value: new It()
      }
    }), this.matrix = new re(), this.matrixWorld = new re(), this.matrixAutoUpdate = ge.DEFAULT_MATRIX_AUTO_UPDATE, this.matrixWorldAutoUpdate = ge.DEFAULT_MATRIX_WORLD_AUTO_UPDATE, this.matrixWorldNeedsUpdate = !1, this.layers = new Go(), this.visible = !0, this.castShadow = !1, this.receiveShadow = !1, this.frustumCulled = !0, this.renderOrder = 0, this.animations = [], this.userData = {};
  }
  onBeforeShadow() {
  }
  onAfterShadow() {
  }
  onBeforeRender() {
  }
  onAfterRender() {
  }
  applyMatrix4(t) {
    this.matrixAutoUpdate && this.updateMatrix(), this.matrix.premultiply(t), this.matrix.decompose(this.position, this.quaternion, this.scale);
  }
  applyQuaternion(t) {
    return this.quaternion.premultiply(t), this;
  }
  setRotationFromAxisAngle(t, e) {
    this.quaternion.setFromAxisAngle(t, e);
  }
  setRotationFromEuler(t) {
    this.quaternion.setFromEuler(t, !0);
  }
  setRotationFromMatrix(t) {
    this.quaternion.setFromRotationMatrix(t);
  }
  setRotationFromQuaternion(t) {
    this.quaternion.copy(t);
  }
  rotateOnAxis(t, e) {
    return ri.setFromAxisAngle(t, e), this.quaternion.multiply(ri), this;
  }
  rotateOnWorldAxis(t, e) {
    return ri.setFromAxisAngle(t, e), this.quaternion.premultiply(ri), this;
  }
  rotateX(t) {
    return this.rotateOnAxis(Ua, t);
  }
  rotateY(t) {
    return this.rotateOnAxis(Ia, t);
  }
  rotateZ(t) {
    return this.rotateOnAxis(Na, t);
  }
  translateOnAxis(t, e) {
    return Da.copy(t).applyQuaternion(this.quaternion), this.position.add(Da.multiplyScalar(e)), this;
  }
  translateX(t) {
    return this.translateOnAxis(Ua, t);
  }
  translateY(t) {
    return this.translateOnAxis(Ia, t);
  }
  translateZ(t) {
    return this.translateOnAxis(Na, t);
  }
  localToWorld(t) {
    return this.updateWorldMatrix(!0, !1), t.applyMatrix4(this.matrixWorld);
  }
  worldToLocal(t) {
    return this.updateWorldMatrix(!0, !1), t.applyMatrix4(rn.copy(this.matrixWorld).invert());
  }
  lookAt(t, e, n) {
    t.isVector3 ? Ms.copy(t) : Ms.set(t, e, n);
    const s = this.parent;
    this.updateWorldMatrix(!0, !1), ki.setFromMatrixPosition(this.matrixWorld), this.isCamera || this.isLight ? rn.lookAt(ki, Ms, this.up) : rn.lookAt(Ms, ki, this.up), this.quaternion.setFromRotationMatrix(rn), s && (rn.extractRotation(s.matrixWorld), ri.setFromRotationMatrix(rn), this.quaternion.premultiply(ri.invert()));
  }
  add(t) {
    if (arguments.length > 1) {
      for (let e = 0; e < arguments.length; e++)
        this.add(arguments[e]);
      return this;
    }
    return t === this ? (console.error("THREE.Object3D.add: object can't be added as a child of itself.", t), this) : (t && t.isObject3D ? (t.removeFromParent(), t.parent = this, this.children.push(t), t.dispatchEvent(Fa), oi.child = t, this.dispatchEvent(oi), oi.child = null) : console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", t), this);
  }
  remove(t) {
    if (arguments.length > 1) {
      for (let n = 0; n < arguments.length; n++)
        this.remove(arguments[n]);
      return this;
    }
    const e = this.children.indexOf(t);
    return e !== -1 && (t.parent = null, this.children.splice(e, 1), t.dispatchEvent(gu), fr.child = t, this.dispatchEvent(fr), fr.child = null), this;
  }
  removeFromParent() {
    const t = this.parent;
    return t !== null && t.remove(this), this;
  }
  clear() {
    return this.remove(...this.children);
  }
  attach(t) {
    return this.updateWorldMatrix(!0, !1), rn.copy(this.matrixWorld).invert(), t.parent !== null && (t.parent.updateWorldMatrix(!0, !1), rn.multiply(t.parent.matrixWorld)), t.applyMatrix4(rn), t.removeFromParent(), t.parent = this, this.children.push(t), t.updateWorldMatrix(!1, !0), t.dispatchEvent(Fa), oi.child = t, this.dispatchEvent(oi), oi.child = null, this;
  }
  getObjectById(t) {
    return this.getObjectByProperty("id", t);
  }
  getObjectByName(t) {
    return this.getObjectByProperty("name", t);
  }
  getObjectByProperty(t, e) {
    if (this[t] === e) return this;
    for (let n = 0, s = this.children.length; n < s; n++) {
      const o = this.children[n].getObjectByProperty(t, e);
      if (o !== void 0)
        return o;
    }
  }
  getObjectsByProperty(t, e, n = []) {
    this[t] === e && n.push(this);
    const s = this.children;
    for (let r = 0, o = s.length; r < o; r++)
      s[r].getObjectsByProperty(t, e, n);
    return n;
  }
  getWorldPosition(t) {
    return this.updateWorldMatrix(!0, !1), t.setFromMatrixPosition(this.matrixWorld);
  }
  getWorldQuaternion(t) {
    return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(ki, t, pu), t;
  }
  getWorldScale(t) {
    return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(ki, mu, t), t;
  }
  getWorldDirection(t) {
    this.updateWorldMatrix(!0, !1);
    const e = this.matrixWorld.elements;
    return t.set(e[8], e[9], e[10]).normalize();
  }
  raycast() {
  }
  traverse(t) {
    t(this);
    const e = this.children;
    for (let n = 0, s = e.length; n < s; n++)
      e[n].traverse(t);
  }
  traverseVisible(t) {
    if (this.visible === !1) return;
    t(this);
    const e = this.children;
    for (let n = 0, s = e.length; n < s; n++)
      e[n].traverseVisible(t);
  }
  traverseAncestors(t) {
    const e = this.parent;
    e !== null && (t(e), e.traverseAncestors(t));
  }
  updateMatrix() {
    this.matrix.compose(this.position, this.quaternion, this.scale), this.matrixWorldNeedsUpdate = !0;
  }
  updateMatrixWorld(t) {
    this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || t) && (this.matrixWorldAutoUpdate === !0 && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), this.matrixWorldNeedsUpdate = !1, t = !0);
    const e = this.children;
    for (let n = 0, s = e.length; n < s; n++)
      e[n].updateMatrixWorld(t);
  }
  updateWorldMatrix(t, e) {
    const n = this.parent;
    if (t === !0 && n !== null && n.updateWorldMatrix(!0, !1), this.matrixAutoUpdate && this.updateMatrix(), this.matrixWorldAutoUpdate === !0 && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), e === !0) {
      const s = this.children;
      for (let r = 0, o = s.length; r < o; r++)
        s[r].updateWorldMatrix(!1, !0);
    }
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string", n = {};
    e && (t = {
      geometries: {},
      materials: {},
      textures: {},
      images: {},
      shapes: {},
      skeletons: {},
      animations: {},
      nodes: {}
    }, n.metadata = {
      version: 4.6,
      type: "Object",
      generator: "Object3D.toJSON"
    });
    const s = {};
    s.uuid = this.uuid, s.type = this.type, this.name !== "" && (s.name = this.name), this.castShadow === !0 && (s.castShadow = !0), this.receiveShadow === !0 && (s.receiveShadow = !0), this.visible === !1 && (s.visible = !1), this.frustumCulled === !1 && (s.frustumCulled = !1), this.renderOrder !== 0 && (s.renderOrder = this.renderOrder), Object.keys(this.userData).length > 0 && (s.userData = this.userData), s.layers = this.layers.mask, s.matrix = this.matrix.toArray(), s.up = this.up.toArray(), this.matrixAutoUpdate === !1 && (s.matrixAutoUpdate = !1), this.isInstancedMesh && (s.type = "InstancedMesh", s.count = this.count, s.instanceMatrix = this.instanceMatrix.toJSON(), this.instanceColor !== null && (s.instanceColor = this.instanceColor.toJSON())), this.isBatchedMesh && (s.type = "BatchedMesh", s.perObjectFrustumCulled = this.perObjectFrustumCulled, s.sortObjects = this.sortObjects, s.drawRanges = this._drawRanges, s.reservedRanges = this._reservedRanges, s.visibility = this._visibility, s.active = this._active, s.bounds = this._bounds.map((a) => ({
      boxInitialized: a.boxInitialized,
      boxMin: a.box.min.toArray(),
      boxMax: a.box.max.toArray(),
      sphereInitialized: a.sphereInitialized,
      sphereRadius: a.sphere.radius,
      sphereCenter: a.sphere.center.toArray()
    })), s.maxInstanceCount = this._maxInstanceCount, s.maxVertexCount = this._maxVertexCount, s.maxIndexCount = this._maxIndexCount, s.geometryInitialized = this._geometryInitialized, s.geometryCount = this._geometryCount, s.matricesTexture = this._matricesTexture.toJSON(t), this._colorsTexture !== null && (s.colorsTexture = this._colorsTexture.toJSON(t)), this.boundingSphere !== null && (s.boundingSphere = {
      center: s.boundingSphere.center.toArray(),
      radius: s.boundingSphere.radius
    }), this.boundingBox !== null && (s.boundingBox = {
      min: s.boundingBox.min.toArray(),
      max: s.boundingBox.max.toArray()
    }));
    function r(a, l) {
      return a[l.uuid] === void 0 && (a[l.uuid] = l.toJSON(t)), l.uuid;
    }
    if (this.isScene)
      this.background && (this.background.isColor ? s.background = this.background.toJSON() : this.background.isTexture && (s.background = this.background.toJSON(t).uuid)), this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== !0 && (s.environment = this.environment.toJSON(t).uuid);
    else if (this.isMesh || this.isLine || this.isPoints) {
      s.geometry = r(t.geometries, this.geometry);
      const a = this.geometry.parameters;
      if (a !== void 0 && a.shapes !== void 0) {
        const l = a.shapes;
        if (Array.isArray(l))
          for (let h = 0, u = l.length; h < u; h++) {
            const c = l[h];
            r(t.shapes, c);
          }
        else
          r(t.shapes, l);
      }
    }
    if (this.isSkinnedMesh && (s.bindMode = this.bindMode, s.bindMatrix = this.bindMatrix.toArray(), this.skeleton !== void 0 && (r(t.skeletons, this.skeleton), s.skeleton = this.skeleton.uuid)), this.material !== void 0)
      if (Array.isArray(this.material)) {
        const a = [];
        for (let l = 0, h = this.material.length; l < h; l++)
          a.push(r(t.materials, this.material[l]));
        s.material = a;
      } else
        s.material = r(t.materials, this.material);
    if (this.children.length > 0) {
      s.children = [];
      for (let a = 0; a < this.children.length; a++)
        s.children.push(this.children[a].toJSON(t).object);
    }
    if (this.animations.length > 0) {
      s.animations = [];
      for (let a = 0; a < this.animations.length; a++) {
        const l = this.animations[a];
        s.animations.push(r(t.animations, l));
      }
    }
    if (e) {
      const a = o(t.geometries), l = o(t.materials), h = o(t.textures), u = o(t.images), c = o(t.shapes), f = o(t.skeletons), d = o(t.animations), g = o(t.nodes);
      a.length > 0 && (n.geometries = a), l.length > 0 && (n.materials = l), h.length > 0 && (n.textures = h), u.length > 0 && (n.images = u), c.length > 0 && (n.shapes = c), f.length > 0 && (n.skeletons = f), d.length > 0 && (n.animations = d), g.length > 0 && (n.nodes = g);
    }
    return n.object = s, n;
    function o(a) {
      const l = [];
      for (const h in a) {
        const u = a[h];
        delete u.metadata, l.push(u);
      }
      return l;
    }
  }
  clone(t) {
    return new this.constructor().copy(this, t);
  }
  copy(t, e = !0) {
    if (this.name = t.name, this.up.copy(t.up), this.position.copy(t.position), this.rotation.order = t.rotation.order, this.quaternion.copy(t.quaternion), this.scale.copy(t.scale), this.matrix.copy(t.matrix), this.matrixWorld.copy(t.matrixWorld), this.matrixAutoUpdate = t.matrixAutoUpdate, this.matrixWorldAutoUpdate = t.matrixWorldAutoUpdate, this.matrixWorldNeedsUpdate = t.matrixWorldNeedsUpdate, this.layers.mask = t.layers.mask, this.visible = t.visible, this.castShadow = t.castShadow, this.receiveShadow = t.receiveShadow, this.frustumCulled = t.frustumCulled, this.renderOrder = t.renderOrder, this.animations = t.animations.slice(), this.userData = JSON.parse(JSON.stringify(t.userData)), e === !0)
      for (let n = 0; n < t.children.length; n++) {
        const s = t.children[n];
        this.add(s.clone());
      }
    return this;
  }
}
ge.DEFAULT_UP = /* @__PURE__ */ new L(0, 1, 0);
ge.DEFAULT_MATRIX_AUTO_UPDATE = !0;
ge.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0;
const We = /* @__PURE__ */ new L(), on = /* @__PURE__ */ new L(), pr = /* @__PURE__ */ new L(), an = /* @__PURE__ */ new L(), ai = /* @__PURE__ */ new L(), li = /* @__PURE__ */ new L(), Oa = /* @__PURE__ */ new L(), mr = /* @__PURE__ */ new L(), gr = /* @__PURE__ */ new L(), _r = /* @__PURE__ */ new L(), xr = /* @__PURE__ */ new Qt(), vr = /* @__PURE__ */ new Qt(), Mr = /* @__PURE__ */ new Qt();
class $e {
  constructor(t = new L(), e = new L(), n = new L()) {
    this.a = t, this.b = e, this.c = n;
  }
  static getNormal(t, e, n, s) {
    s.subVectors(n, e), We.subVectors(t, e), s.cross(We);
    const r = s.lengthSq();
    return r > 0 ? s.multiplyScalar(1 / Math.sqrt(r)) : s.set(0, 0, 0);
  }
  // static/instance method to calculate barycentric coordinates
  // based on: http://www.blackpawn.com/texts/pointinpoly/default.html
  static getBarycoord(t, e, n, s, r) {
    We.subVectors(s, e), on.subVectors(n, e), pr.subVectors(t, e);
    const o = We.dot(We), a = We.dot(on), l = We.dot(pr), h = on.dot(on), u = on.dot(pr), c = o * h - a * a;
    if (c === 0)
      return r.set(0, 0, 0), null;
    const f = 1 / c, d = (h * l - a * u) * f, g = (o * u - a * l) * f;
    return r.set(1 - d - g, g, d);
  }
  static containsPoint(t, e, n, s) {
    return this.getBarycoord(t, e, n, s, an) === null ? !1 : an.x >= 0 && an.y >= 0 && an.x + an.y <= 1;
  }
  static getInterpolation(t, e, n, s, r, o, a, l) {
    return this.getBarycoord(t, e, n, s, an) === null ? (l.x = 0, l.y = 0, "z" in l && (l.z = 0), "w" in l && (l.w = 0), null) : (l.setScalar(0), l.addScaledVector(r, an.x), l.addScaledVector(o, an.y), l.addScaledVector(a, an.z), l);
  }
  static getInterpolatedAttribute(t, e, n, s, r, o) {
    return xr.setScalar(0), vr.setScalar(0), Mr.setScalar(0), xr.fromBufferAttribute(t, e), vr.fromBufferAttribute(t, n), Mr.fromBufferAttribute(t, s), o.setScalar(0), o.addScaledVector(xr, r.x), o.addScaledVector(vr, r.y), o.addScaledVector(Mr, r.z), o;
  }
  static isFrontFacing(t, e, n, s) {
    return We.subVectors(n, e), on.subVectors(t, e), We.cross(on).dot(s) < 0;
  }
  set(t, e, n) {
    return this.a.copy(t), this.b.copy(e), this.c.copy(n), this;
  }
  setFromPointsAndIndices(t, e, n, s) {
    return this.a.copy(t[e]), this.b.copy(t[n]), this.c.copy(t[s]), this;
  }
  setFromAttributeAndIndices(t, e, n, s) {
    return this.a.fromBufferAttribute(t, e), this.b.fromBufferAttribute(t, n), this.c.fromBufferAttribute(t, s), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return this.a.copy(t.a), this.b.copy(t.b), this.c.copy(t.c), this;
  }
  getArea() {
    return We.subVectors(this.c, this.b), on.subVectors(this.a, this.b), We.cross(on).length() * 0.5;
  }
  getMidpoint(t) {
    return t.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
  }
  getNormal(t) {
    return $e.getNormal(this.a, this.b, this.c, t);
  }
  getPlane(t) {
    return t.setFromCoplanarPoints(this.a, this.b, this.c);
  }
  getBarycoord(t, e) {
    return $e.getBarycoord(t, this.a, this.b, this.c, e);
  }
  getInterpolation(t, e, n, s, r) {
    return $e.getInterpolation(t, this.a, this.b, this.c, e, n, s, r);
  }
  containsPoint(t) {
    return $e.containsPoint(t, this.a, this.b, this.c);
  }
  isFrontFacing(t) {
    return $e.isFrontFacing(this.a, this.b, this.c, t);
  }
  intersectsBox(t) {
    return t.intersectsTriangle(this);
  }
  closestPointToPoint(t, e) {
    const n = this.a, s = this.b, r = this.c;
    let o, a;
    ai.subVectors(s, n), li.subVectors(r, n), mr.subVectors(t, n);
    const l = ai.dot(mr), h = li.dot(mr);
    if (l <= 0 && h <= 0)
      return e.copy(n);
    gr.subVectors(t, s);
    const u = ai.dot(gr), c = li.dot(gr);
    if (u >= 0 && c <= u)
      return e.copy(s);
    const f = l * c - u * h;
    if (f <= 0 && l >= 0 && u <= 0)
      return o = l / (l - u), e.copy(n).addScaledVector(ai, o);
    _r.subVectors(t, r);
    const d = ai.dot(_r), g = li.dot(_r);
    if (g >= 0 && d <= g)
      return e.copy(r);
    const x = d * h - l * g;
    if (x <= 0 && h >= 0 && g <= 0)
      return a = h / (h - g), e.copy(n).addScaledVector(li, a);
    const m = u * g - d * c;
    if (m <= 0 && c - u >= 0 && d - g >= 0)
      return Oa.subVectors(r, s), a = (c - u) / (c - u + (d - g)), e.copy(s).addScaledVector(Oa, a);
    const p = 1 / (m + x + f);
    return o = x * p, a = f * p, e.copy(n).addScaledVector(ai, o).addScaledVector(li, a);
  }
  equals(t) {
    return t.a.equals(this.a) && t.b.equals(this.b) && t.c.equals(this.c);
  }
}
const ac = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
}, yn = { h: 0, s: 0, l: 0 }, Ss = { h: 0, s: 0, l: 0 };
function Sr(i, t, e) {
  return e < 0 && (e += 1), e > 1 && (e -= 1), e < 1 / 6 ? i + (t - i) * 6 * e : e < 1 / 2 ? t : e < 2 / 3 ? i + (t - i) * 6 * (2 / 3 - e) : i;
}
class Pt {
  constructor(t, e, n) {
    return this.isColor = !0, this.r = 1, this.g = 1, this.b = 1, this.set(t, e, n);
  }
  set(t, e, n) {
    if (e === void 0 && n === void 0) {
      const s = t;
      s && s.isColor ? this.copy(s) : typeof s == "number" ? this.setHex(s) : typeof s == "string" && this.setStyle(s);
    } else
      this.setRGB(t, e, n);
    return this;
  }
  setScalar(t) {
    return this.r = t, this.g = t, this.b = t, this;
  }
  setHex(t, e = Ue) {
    return t = Math.floor(t), this.r = (t >> 16 & 255) / 255, this.g = (t >> 8 & 255) / 255, this.b = (t & 255) / 255, Xt.toWorkingColorSpace(this, e), this;
  }
  setRGB(t, e, n, s = Xt.workingColorSpace) {
    return this.r = t, this.g = e, this.b = n, Xt.toWorkingColorSpace(this, s), this;
  }
  setHSL(t, e, n, s = Xt.workingColorSpace) {
    if (t = Ho(t, 1), e = Se(e, 0, 1), n = Se(n, 0, 1), e === 0)
      this.r = this.g = this.b = n;
    else {
      const r = n <= 0.5 ? n * (1 + e) : n + e - n * e, o = 2 * n - r;
      this.r = Sr(o, r, t + 1 / 3), this.g = Sr(o, r, t), this.b = Sr(o, r, t - 1 / 3);
    }
    return Xt.toWorkingColorSpace(this, s), this;
  }
  setStyle(t, e = Ue) {
    function n(r) {
      r !== void 0 && parseFloat(r) < 1 && console.warn("THREE.Color: Alpha component of " + t + " will be ignored.");
    }
    let s;
    if (s = /^(\w+)\(([^\)]*)\)/.exec(t)) {
      let r;
      const o = s[1], a = s[2];
      switch (o) {
        case "rgb":
        case "rgba":
          if (r = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))
            return n(r[4]), this.setRGB(
              Math.min(255, parseInt(r[1], 10)) / 255,
              Math.min(255, parseInt(r[2], 10)) / 255,
              Math.min(255, parseInt(r[3], 10)) / 255,
              e
            );
          if (r = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))
            return n(r[4]), this.setRGB(
              Math.min(100, parseInt(r[1], 10)) / 100,
              Math.min(100, parseInt(r[2], 10)) / 100,
              Math.min(100, parseInt(r[3], 10)) / 100,
              e
            );
          break;
        case "hsl":
        case "hsla":
          if (r = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))
            return n(r[4]), this.setHSL(
              parseFloat(r[1]) / 360,
              parseFloat(r[2]) / 100,
              parseFloat(r[3]) / 100,
              e
            );
          break;
        default:
          console.warn("THREE.Color: Unknown color model " + t);
      }
    } else if (s = /^\#([A-Fa-f\d]+)$/.exec(t)) {
      const r = s[1], o = r.length;
      if (o === 3)
        return this.setRGB(
          parseInt(r.charAt(0), 16) / 15,
          parseInt(r.charAt(1), 16) / 15,
          parseInt(r.charAt(2), 16) / 15,
          e
        );
      if (o === 6)
        return this.setHex(parseInt(r, 16), e);
      console.warn("THREE.Color: Invalid hex color " + t);
    } else if (t && t.length > 0)
      return this.setColorName(t, e);
    return this;
  }
  setColorName(t, e = Ue) {
    const n = ac[t.toLowerCase()];
    return n !== void 0 ? this.setHex(n, e) : console.warn("THREE.Color: Unknown color " + t), this;
  }
  clone() {
    return new this.constructor(this.r, this.g, this.b);
  }
  copy(t) {
    return this.r = t.r, this.g = t.g, this.b = t.b, this;
  }
  copySRGBToLinear(t) {
    return this.r = pn(t.r), this.g = pn(t.g), this.b = pn(t.b), this;
  }
  copyLinearToSRGB(t) {
    return this.r = Mi(t.r), this.g = Mi(t.g), this.b = Mi(t.b), this;
  }
  convertSRGBToLinear() {
    return this.copySRGBToLinear(this), this;
  }
  convertLinearToSRGB() {
    return this.copyLinearToSRGB(this), this;
  }
  getHex(t = Ue) {
    return Xt.fromWorkingColorSpace(ve.copy(this), t), Math.round(Se(ve.r * 255, 0, 255)) * 65536 + Math.round(Se(ve.g * 255, 0, 255)) * 256 + Math.round(Se(ve.b * 255, 0, 255));
  }
  getHexString(t = Ue) {
    return ("000000" + this.getHex(t).toString(16)).slice(-6);
  }
  getHSL(t, e = Xt.workingColorSpace) {
    Xt.fromWorkingColorSpace(ve.copy(this), e);
    const n = ve.r, s = ve.g, r = ve.b, o = Math.max(n, s, r), a = Math.min(n, s, r);
    let l, h;
    const u = (a + o) / 2;
    if (a === o)
      l = 0, h = 0;
    else {
      const c = o - a;
      switch (h = u <= 0.5 ? c / (o + a) : c / (2 - o - a), o) {
        case n:
          l = (s - r) / c + (s < r ? 6 : 0);
          break;
        case s:
          l = (r - n) / c + 2;
          break;
        case r:
          l = (n - s) / c + 4;
          break;
      }
      l /= 6;
    }
    return t.h = l, t.s = h, t.l = u, t;
  }
  getRGB(t, e = Xt.workingColorSpace) {
    return Xt.fromWorkingColorSpace(ve.copy(this), e), t.r = ve.r, t.g = ve.g, t.b = ve.b, t;
  }
  getStyle(t = Ue) {
    Xt.fromWorkingColorSpace(ve.copy(this), t);
    const e = ve.r, n = ve.g, s = ve.b;
    return t !== Ue ? `color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})` : `rgb(${Math.round(e * 255)},${Math.round(n * 255)},${Math.round(s * 255)})`;
  }
  offsetHSL(t, e, n) {
    return this.getHSL(yn), this.setHSL(yn.h + t, yn.s + e, yn.l + n);
  }
  add(t) {
    return this.r += t.r, this.g += t.g, this.b += t.b, this;
  }
  addColors(t, e) {
    return this.r = t.r + e.r, this.g = t.g + e.g, this.b = t.b + e.b, this;
  }
  addScalar(t) {
    return this.r += t, this.g += t, this.b += t, this;
  }
  sub(t) {
    return this.r = Math.max(0, this.r - t.r), this.g = Math.max(0, this.g - t.g), this.b = Math.max(0, this.b - t.b), this;
  }
  multiply(t) {
    return this.r *= t.r, this.g *= t.g, this.b *= t.b, this;
  }
  multiplyScalar(t) {
    return this.r *= t, this.g *= t, this.b *= t, this;
  }
  lerp(t, e) {
    return this.r += (t.r - this.r) * e, this.g += (t.g - this.g) * e, this.b += (t.b - this.b) * e, this;
  }
  lerpColors(t, e, n) {
    return this.r = t.r + (e.r - t.r) * n, this.g = t.g + (e.g - t.g) * n, this.b = t.b + (e.b - t.b) * n, this;
  }
  lerpHSL(t, e) {
    this.getHSL(yn), t.getHSL(Ss);
    const n = Qi(yn.h, Ss.h, e), s = Qi(yn.s, Ss.s, e), r = Qi(yn.l, Ss.l, e);
    return this.setHSL(n, s, r), this;
  }
  setFromVector3(t) {
    return this.r = t.x, this.g = t.y, this.b = t.z, this;
  }
  applyMatrix3(t) {
    const e = this.r, n = this.g, s = this.b, r = t.elements;
    return this.r = r[0] * e + r[3] * n + r[6] * s, this.g = r[1] * e + r[4] * n + r[7] * s, this.b = r[2] * e + r[5] * n + r[8] * s, this;
  }
  equals(t) {
    return t.r === this.r && t.g === this.g && t.b === this.b;
  }
  fromArray(t, e = 0) {
    return this.r = t[e], this.g = t[e + 1], this.b = t[e + 2], this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this.r, t[e + 1] = this.g, t[e + 2] = this.b, t;
  }
  fromBufferAttribute(t, e) {
    return this.r = t.getX(e), this.g = t.getY(e), this.b = t.getZ(e), this;
  }
  toJSON() {
    return this.getHex();
  }
  *[Symbol.iterator]() {
    yield this.r, yield this.g, yield this.b;
  }
}
const ve = /* @__PURE__ */ new Pt();
Pt.NAMES = ac;
let _u = 0;
class Ui extends Li {
  static get type() {
    return "Material";
  }
  get type() {
    return this.constructor.type;
  }
  set type(t) {
  }
  constructor() {
    super(), this.isMaterial = !0, Object.defineProperty(this, "id", { value: _u++ }), this.uuid = Di(), this.name = "", this.blending = xi, this.side = Pn, this.vertexColors = !1, this.opacity = 1, this.transparent = !1, this.alphaHash = !1, this.blendSrc = kr, this.blendDst = Hr, this.blendEquation = Gn, this.blendSrcAlpha = null, this.blendDstAlpha = null, this.blendEquationAlpha = null, this.blendColor = new Pt(0, 0, 0), this.blendAlpha = 0, this.depthFunc = Ei, this.depthTest = !0, this.depthWrite = !0, this.stencilWriteMask = 255, this.stencilFunc = va, this.stencilRef = 0, this.stencilFuncMask = 255, this.stencilFail = Qn, this.stencilZFail = Qn, this.stencilZPass = Qn, this.stencilWrite = !1, this.clippingPlanes = null, this.clipIntersection = !1, this.clipShadows = !1, this.shadowSide = null, this.colorWrite = !0, this.precision = null, this.polygonOffset = !1, this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, this.dithering = !1, this.alphaToCoverage = !1, this.premultipliedAlpha = !1, this.forceSinglePass = !1, this.visible = !0, this.toneMapped = !0, this.userData = {}, this.version = 0, this._alphaTest = 0;
  }
  get alphaTest() {
    return this._alphaTest;
  }
  set alphaTest(t) {
    this._alphaTest > 0 != t > 0 && this.version++, this._alphaTest = t;
  }
  // onBeforeRender and onBeforeCompile only supported in WebGLRenderer
  onBeforeRender() {
  }
  onBeforeCompile() {
  }
  customProgramCacheKey() {
    return this.onBeforeCompile.toString();
  }
  setValues(t) {
    if (t !== void 0)
      for (const e in t) {
        const n = t[e];
        if (n === void 0) {
          console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);
          continue;
        }
        const s = this[e];
        if (s === void 0) {
          console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);
          continue;
        }
        s && s.isColor ? s.set(n) : s && s.isVector3 && n && n.isVector3 ? s.copy(n) : this[e] = n;
      }
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string";
    e && (t = {
      textures: {},
      images: {}
    });
    const n = {
      metadata: {
        version: 4.6,
        type: "Material",
        generator: "Material.toJSON"
      }
    };
    n.uuid = this.uuid, n.type = this.type, this.name !== "" && (n.name = this.name), this.color && this.color.isColor && (n.color = this.color.getHex()), this.roughness !== void 0 && (n.roughness = this.roughness), this.metalness !== void 0 && (n.metalness = this.metalness), this.sheen !== void 0 && (n.sheen = this.sheen), this.sheenColor && this.sheenColor.isColor && (n.sheenColor = this.sheenColor.getHex()), this.sheenRoughness !== void 0 && (n.sheenRoughness = this.sheenRoughness), this.emissive && this.emissive.isColor && (n.emissive = this.emissive.getHex()), this.emissiveIntensity !== void 0 && this.emissiveIntensity !== 1 && (n.emissiveIntensity = this.emissiveIntensity), this.specular && this.specular.isColor && (n.specular = this.specular.getHex()), this.specularIntensity !== void 0 && (n.specularIntensity = this.specularIntensity), this.specularColor && this.specularColor.isColor && (n.specularColor = this.specularColor.getHex()), this.shininess !== void 0 && (n.shininess = this.shininess), this.clearcoat !== void 0 && (n.clearcoat = this.clearcoat), this.clearcoatRoughness !== void 0 && (n.clearcoatRoughness = this.clearcoatRoughness), this.clearcoatMap && this.clearcoatMap.isTexture && (n.clearcoatMap = this.clearcoatMap.toJSON(t).uuid), this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture && (n.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(t).uuid), this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture && (n.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(t).uuid, n.clearcoatNormalScale = this.clearcoatNormalScale.toArray()), this.dispersion !== void 0 && (n.dispersion = this.dispersion), this.iridescence !== void 0 && (n.iridescence = this.iridescence), this.iridescenceIOR !== void 0 && (n.iridescenceIOR = this.iridescenceIOR), this.iridescenceThicknessRange !== void 0 && (n.iridescenceThicknessRange = this.iridescenceThicknessRange), this.iridescenceMap && this.iridescenceMap.isTexture && (n.iridescenceMap = this.iridescenceMap.toJSON(t).uuid), this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture && (n.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(t).uuid), this.anisotropy !== void 0 && (n.anisotropy = this.anisotropy), this.anisotropyRotation !== void 0 && (n.anisotropyRotation = this.anisotropyRotation), this.anisotropyMap && this.anisotropyMap.isTexture && (n.anisotropyMap = this.anisotropyMap.toJSON(t).uuid), this.map && this.map.isTexture && (n.map = this.map.toJSON(t).uuid), this.matcap && this.matcap.isTexture && (n.matcap = this.matcap.toJSON(t).uuid), this.alphaMap && this.alphaMap.isTexture && (n.alphaMap = this.alphaMap.toJSON(t).uuid), this.lightMap && this.lightMap.isTexture && (n.lightMap = this.lightMap.toJSON(t).uuid, n.lightMapIntensity = this.lightMapIntensity), this.aoMap && this.aoMap.isTexture && (n.aoMap = this.aoMap.toJSON(t).uuid, n.aoMapIntensity = this.aoMapIntensity), this.bumpMap && this.bumpMap.isTexture && (n.bumpMap = this.bumpMap.toJSON(t).uuid, n.bumpScale = this.bumpScale), this.normalMap && this.normalMap.isTexture && (n.normalMap = this.normalMap.toJSON(t).uuid, n.normalMapType = this.normalMapType, n.normalScale = this.normalScale.toArray()), this.displacementMap && this.displacementMap.isTexture && (n.displacementMap = this.displacementMap.toJSON(t).uuid, n.displacementScale = this.displacementScale, n.displacementBias = this.displacementBias), this.roughnessMap && this.roughnessMap.isTexture && (n.roughnessMap = this.roughnessMap.toJSON(t).uuid), this.metalnessMap && this.metalnessMap.isTexture && (n.metalnessMap = this.metalnessMap.toJSON(t).uuid), this.emissiveMap && this.emissiveMap.isTexture && (n.emissiveMap = this.emissiveMap.toJSON(t).uuid), this.specularMap && this.specularMap.isTexture && (n.specularMap = this.specularMap.toJSON(t).uuid), this.specularIntensityMap && this.specularIntensityMap.isTexture && (n.specularIntensityMap = this.specularIntensityMap.toJSON(t).uuid), this.specularColorMap && this.specularColorMap.isTexture && (n.specularColorMap = this.specularColorMap.toJSON(t).uuid), this.envMap && this.envMap.isTexture && (n.envMap = this.envMap.toJSON(t).uuid, this.combine !== void 0 && (n.combine = this.combine)), this.envMapRotation !== void 0 && (n.envMapRotation = this.envMapRotation.toArray()), this.envMapIntensity !== void 0 && (n.envMapIntensity = this.envMapIntensity), this.reflectivity !== void 0 && (n.reflectivity = this.reflectivity), this.refractionRatio !== void 0 && (n.refractionRatio = this.refractionRatio), this.gradientMap && this.gradientMap.isTexture && (n.gradientMap = this.gradientMap.toJSON(t).uuid), this.transmission !== void 0 && (n.transmission = this.transmission), this.transmissionMap && this.transmissionMap.isTexture && (n.transmissionMap = this.transmissionMap.toJSON(t).uuid), this.thickness !== void 0 && (n.thickness = this.thickness), this.thicknessMap && this.thicknessMap.isTexture && (n.thicknessMap = this.thicknessMap.toJSON(t).uuid), this.attenuationDistance !== void 0 && this.attenuationDistance !== 1 / 0 && (n.attenuationDistance = this.attenuationDistance), this.attenuationColor !== void 0 && (n.attenuationColor = this.attenuationColor.getHex()), this.size !== void 0 && (n.size = this.size), this.shadowSide !== null && (n.shadowSide = this.shadowSide), this.sizeAttenuation !== void 0 && (n.sizeAttenuation = this.sizeAttenuation), this.blending !== xi && (n.blending = this.blending), this.side !== Pn && (n.side = this.side), this.vertexColors === !0 && (n.vertexColors = !0), this.opacity < 1 && (n.opacity = this.opacity), this.transparent === !0 && (n.transparent = !0), this.blendSrc !== kr && (n.blendSrc = this.blendSrc), this.blendDst !== Hr && (n.blendDst = this.blendDst), this.blendEquation !== Gn && (n.blendEquation = this.blendEquation), this.blendSrcAlpha !== null && (n.blendSrcAlpha = this.blendSrcAlpha), this.blendDstAlpha !== null && (n.blendDstAlpha = this.blendDstAlpha), this.blendEquationAlpha !== null && (n.blendEquationAlpha = this.blendEquationAlpha), this.blendColor && this.blendColor.isColor && (n.blendColor = this.blendColor.getHex()), this.blendAlpha !== 0 && (n.blendAlpha = this.blendAlpha), this.depthFunc !== Ei && (n.depthFunc = this.depthFunc), this.depthTest === !1 && (n.depthTest = this.depthTest), this.depthWrite === !1 && (n.depthWrite = this.depthWrite), this.colorWrite === !1 && (n.colorWrite = this.colorWrite), this.stencilWriteMask !== 255 && (n.stencilWriteMask = this.stencilWriteMask), this.stencilFunc !== va && (n.stencilFunc = this.stencilFunc), this.stencilRef !== 0 && (n.stencilRef = this.stencilRef), this.stencilFuncMask !== 255 && (n.stencilFuncMask = this.stencilFuncMask), this.stencilFail !== Qn && (n.stencilFail = this.stencilFail), this.stencilZFail !== Qn && (n.stencilZFail = this.stencilZFail), this.stencilZPass !== Qn && (n.stencilZPass = this.stencilZPass), this.stencilWrite === !0 && (n.stencilWrite = this.stencilWrite), this.rotation !== void 0 && this.rotation !== 0 && (n.rotation = this.rotation), this.polygonOffset === !0 && (n.polygonOffset = !0), this.polygonOffsetFactor !== 0 && (n.polygonOffsetFactor = this.polygonOffsetFactor), this.polygonOffsetUnits !== 0 && (n.polygonOffsetUnits = this.polygonOffsetUnits), this.linewidth !== void 0 && this.linewidth !== 1 && (n.linewidth = this.linewidth), this.dashSize !== void 0 && (n.dashSize = this.dashSize), this.gapSize !== void 0 && (n.gapSize = this.gapSize), this.scale !== void 0 && (n.scale = this.scale), this.dithering === !0 && (n.dithering = !0), this.alphaTest > 0 && (n.alphaTest = this.alphaTest), this.alphaHash === !0 && (n.alphaHash = !0), this.alphaToCoverage === !0 && (n.alphaToCoverage = !0), this.premultipliedAlpha === !0 && (n.premultipliedAlpha = !0), this.forceSinglePass === !0 && (n.forceSinglePass = !0), this.wireframe === !0 && (n.wireframe = !0), this.wireframeLinewidth > 1 && (n.wireframeLinewidth = this.wireframeLinewidth), this.wireframeLinecap !== "round" && (n.wireframeLinecap = this.wireframeLinecap), this.wireframeLinejoin !== "round" && (n.wireframeLinejoin = this.wireframeLinejoin), this.flatShading === !0 && (n.flatShading = !0), this.visible === !1 && (n.visible = !1), this.toneMapped === !1 && (n.toneMapped = !1), this.fog === !1 && (n.fog = !1), Object.keys(this.userData).length > 0 && (n.userData = this.userData);
    function s(r) {
      const o = [];
      for (const a in r) {
        const l = r[a];
        delete l.metadata, o.push(l);
      }
      return o;
    }
    if (e) {
      const r = s(t.textures), o = s(t.images);
      r.length > 0 && (n.textures = r), o.length > 0 && (n.images = o);
    }
    return n;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    this.name = t.name, this.blending = t.blending, this.side = t.side, this.vertexColors = t.vertexColors, this.opacity = t.opacity, this.transparent = t.transparent, this.blendSrc = t.blendSrc, this.blendDst = t.blendDst, this.blendEquation = t.blendEquation, this.blendSrcAlpha = t.blendSrcAlpha, this.blendDstAlpha = t.blendDstAlpha, this.blendEquationAlpha = t.blendEquationAlpha, this.blendColor.copy(t.blendColor), this.blendAlpha = t.blendAlpha, this.depthFunc = t.depthFunc, this.depthTest = t.depthTest, this.depthWrite = t.depthWrite, this.stencilWriteMask = t.stencilWriteMask, this.stencilFunc = t.stencilFunc, this.stencilRef = t.stencilRef, this.stencilFuncMask = t.stencilFuncMask, this.stencilFail = t.stencilFail, this.stencilZFail = t.stencilZFail, this.stencilZPass = t.stencilZPass, this.stencilWrite = t.stencilWrite;
    const e = t.clippingPlanes;
    let n = null;
    if (e !== null) {
      const s = e.length;
      n = new Array(s);
      for (let r = 0; r !== s; ++r)
        n[r] = e[r].clone();
    }
    return this.clippingPlanes = n, this.clipIntersection = t.clipIntersection, this.clipShadows = t.clipShadows, this.shadowSide = t.shadowSide, this.colorWrite = t.colorWrite, this.precision = t.precision, this.polygonOffset = t.polygonOffset, this.polygonOffsetFactor = t.polygonOffsetFactor, this.polygonOffsetUnits = t.polygonOffsetUnits, this.dithering = t.dithering, this.alphaTest = t.alphaTest, this.alphaHash = t.alphaHash, this.alphaToCoverage = t.alphaToCoverage, this.premultipliedAlpha = t.premultipliedAlpha, this.forceSinglePass = t.forceSinglePass, this.visible = t.visible, this.toneMapped = t.toneMapped, this.userData = JSON.parse(JSON.stringify(t.userData)), this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  set needsUpdate(t) {
    t === !0 && this.version++;
  }
  onBuild() {
    console.warn("Material: onBuild() has been removed.");
  }
}
class cs extends Ui {
  static get type() {
    return "MeshBasicMaterial";
  }
  constructor(t) {
    super(), this.isMeshBasicMaterial = !0, this.color = new Pt(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new Je(), this.combine = Gl, this.reflectivity = 1, this.refractionRatio = 0.98, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.fog = !0, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.color.copy(t.color), this.map = t.map, this.lightMap = t.lightMap, this.lightMapIntensity = t.lightMapIntensity, this.aoMap = t.aoMap, this.aoMapIntensity = t.aoMapIntensity, this.specularMap = t.specularMap, this.alphaMap = t.alphaMap, this.envMap = t.envMap, this.envMapRotation.copy(t.envMapRotation), this.combine = t.combine, this.reflectivity = t.reflectivity, this.refractionRatio = t.refractionRatio, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.wireframeLinecap = t.wireframeLinecap, this.wireframeLinejoin = t.wireframeLinejoin, this.fog = t.fog, this;
  }
}
const ue = /* @__PURE__ */ new L(), ys = /* @__PURE__ */ new kt();
class Ye {
  constructor(t, e, n = !1) {
    if (Array.isArray(t))
      throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");
    this.isBufferAttribute = !0, this.name = "", this.array = t, this.itemSize = e, this.count = t !== void 0 ? t.length / e : 0, this.normalized = n, this.usage = Ma, this.updateRanges = [], this.gpuType = un, this.version = 0;
  }
  onUploadCallback() {
  }
  set needsUpdate(t) {
    t === !0 && this.version++;
  }
  setUsage(t) {
    return this.usage = t, this;
  }
  addUpdateRange(t, e) {
    this.updateRanges.push({ start: t, count: e });
  }
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  copy(t) {
    return this.name = t.name, this.array = new t.array.constructor(t.array), this.itemSize = t.itemSize, this.count = t.count, this.normalized = t.normalized, this.usage = t.usage, this.gpuType = t.gpuType, this;
  }
  copyAt(t, e, n) {
    t *= this.itemSize, n *= e.itemSize;
    for (let s = 0, r = this.itemSize; s < r; s++)
      this.array[t + s] = e.array[n + s];
    return this;
  }
  copyArray(t) {
    return this.array.set(t), this;
  }
  applyMatrix3(t) {
    if (this.itemSize === 2)
      for (let e = 0, n = this.count; e < n; e++)
        ys.fromBufferAttribute(this, e), ys.applyMatrix3(t), this.setXY(e, ys.x, ys.y);
    else if (this.itemSize === 3)
      for (let e = 0, n = this.count; e < n; e++)
        ue.fromBufferAttribute(this, e), ue.applyMatrix3(t), this.setXYZ(e, ue.x, ue.y, ue.z);
    return this;
  }
  applyMatrix4(t) {
    for (let e = 0, n = this.count; e < n; e++)
      ue.fromBufferAttribute(this, e), ue.applyMatrix4(t), this.setXYZ(e, ue.x, ue.y, ue.z);
    return this;
  }
  applyNormalMatrix(t) {
    for (let e = 0, n = this.count; e < n; e++)
      ue.fromBufferAttribute(this, e), ue.applyNormalMatrix(t), this.setXYZ(e, ue.x, ue.y, ue.z);
    return this;
  }
  transformDirection(t) {
    for (let e = 0, n = this.count; e < n; e++)
      ue.fromBufferAttribute(this, e), ue.transformDirection(t), this.setXYZ(e, ue.x, ue.y, ue.z);
    return this;
  }
  set(t, e = 0) {
    return this.array.set(t, e), this;
  }
  getComponent(t, e) {
    let n = this.array[t * this.itemSize + e];
    return this.normalized && (n = mi(n, this.array)), n;
  }
  setComponent(t, e, n) {
    return this.normalized && (n = Ee(n, this.array)), this.array[t * this.itemSize + e] = n, this;
  }
  getX(t) {
    let e = this.array[t * this.itemSize];
    return this.normalized && (e = mi(e, this.array)), e;
  }
  setX(t, e) {
    return this.normalized && (e = Ee(e, this.array)), this.array[t * this.itemSize] = e, this;
  }
  getY(t) {
    let e = this.array[t * this.itemSize + 1];
    return this.normalized && (e = mi(e, this.array)), e;
  }
  setY(t, e) {
    return this.normalized && (e = Ee(e, this.array)), this.array[t * this.itemSize + 1] = e, this;
  }
  getZ(t) {
    let e = this.array[t * this.itemSize + 2];
    return this.normalized && (e = mi(e, this.array)), e;
  }
  setZ(t, e) {
    return this.normalized && (e = Ee(e, this.array)), this.array[t * this.itemSize + 2] = e, this;
  }
  getW(t) {
    let e = this.array[t * this.itemSize + 3];
    return this.normalized && (e = mi(e, this.array)), e;
  }
  setW(t, e) {
    return this.normalized && (e = Ee(e, this.array)), this.array[t * this.itemSize + 3] = e, this;
  }
  setXY(t, e, n) {
    return t *= this.itemSize, this.normalized && (e = Ee(e, this.array), n = Ee(n, this.array)), this.array[t + 0] = e, this.array[t + 1] = n, this;
  }
  setXYZ(t, e, n, s) {
    return t *= this.itemSize, this.normalized && (e = Ee(e, this.array), n = Ee(n, this.array), s = Ee(s, this.array)), this.array[t + 0] = e, this.array[t + 1] = n, this.array[t + 2] = s, this;
  }
  setXYZW(t, e, n, s, r) {
    return t *= this.itemSize, this.normalized && (e = Ee(e, this.array), n = Ee(n, this.array), s = Ee(s, this.array), r = Ee(r, this.array)), this.array[t + 0] = e, this.array[t + 1] = n, this.array[t + 2] = s, this.array[t + 3] = r, this;
  }
  onUpload(t) {
    return this.onUploadCallback = t, this;
  }
  clone() {
    return new this.constructor(this.array, this.itemSize).copy(this);
  }
  toJSON() {
    const t = {
      itemSize: this.itemSize,
      type: this.array.constructor.name,
      array: Array.from(this.array),
      normalized: this.normalized
    };
    return this.name !== "" && (t.name = this.name), this.usage !== Ma && (t.usage = this.usage), t;
  }
}
class lc extends Ye {
  constructor(t, e, n) {
    super(new Uint16Array(t), e, n);
  }
}
class cc extends Ye {
  constructor(t, e, n) {
    super(new Uint32Array(t), e, n);
  }
}
class be extends Ye {
  constructor(t, e, n) {
    super(new Float32Array(t), e, n);
  }
}
let xu = 0;
const Oe = /* @__PURE__ */ new re(), yr = /* @__PURE__ */ new ge(), ci = /* @__PURE__ */ new L(), De = /* @__PURE__ */ new ls(), Hi = /* @__PURE__ */ new ls(), pe = /* @__PURE__ */ new L();
class ze extends Li {
  constructor() {
    super(), this.isBufferGeometry = !0, Object.defineProperty(this, "id", { value: xu++ }), this.uuid = Di(), this.name = "", this.type = "BufferGeometry", this.index = null, this.indirect = null, this.attributes = {}, this.morphAttributes = {}, this.morphTargetsRelative = !1, this.groups = [], this.boundingBox = null, this.boundingSphere = null, this.drawRange = { start: 0, count: 1 / 0 }, this.userData = {};
  }
  getIndex() {
    return this.index;
  }
  setIndex(t) {
    return Array.isArray(t) ? this.index = new (sc(t) ? cc : lc)(t, 1) : this.index = t, this;
  }
  setIndirect(t) {
    return this.indirect = t, this;
  }
  getIndirect() {
    return this.indirect;
  }
  getAttribute(t) {
    return this.attributes[t];
  }
  setAttribute(t, e) {
    return this.attributes[t] = e, this;
  }
  deleteAttribute(t) {
    return delete this.attributes[t], this;
  }
  hasAttribute(t) {
    return this.attributes[t] !== void 0;
  }
  addGroup(t, e, n = 0) {
    this.groups.push({
      start: t,
      count: e,
      materialIndex: n
    });
  }
  clearGroups() {
    this.groups = [];
  }
  setDrawRange(t, e) {
    this.drawRange.start = t, this.drawRange.count = e;
  }
  applyMatrix4(t) {
    const e = this.attributes.position;
    e !== void 0 && (e.applyMatrix4(t), e.needsUpdate = !0);
    const n = this.attributes.normal;
    if (n !== void 0) {
      const r = new It().getNormalMatrix(t);
      n.applyNormalMatrix(r), n.needsUpdate = !0;
    }
    const s = this.attributes.tangent;
    return s !== void 0 && (s.transformDirection(t), s.needsUpdate = !0), this.boundingBox !== null && this.computeBoundingBox(), this.boundingSphere !== null && this.computeBoundingSphere(), this;
  }
  applyQuaternion(t) {
    return Oe.makeRotationFromQuaternion(t), this.applyMatrix4(Oe), this;
  }
  rotateX(t) {
    return Oe.makeRotationX(t), this.applyMatrix4(Oe), this;
  }
  rotateY(t) {
    return Oe.makeRotationY(t), this.applyMatrix4(Oe), this;
  }
  rotateZ(t) {
    return Oe.makeRotationZ(t), this.applyMatrix4(Oe), this;
  }
  translate(t, e, n) {
    return Oe.makeTranslation(t, e, n), this.applyMatrix4(Oe), this;
  }
  scale(t, e, n) {
    return Oe.makeScale(t, e, n), this.applyMatrix4(Oe), this;
  }
  lookAt(t) {
    return yr.lookAt(t), yr.updateMatrix(), this.applyMatrix4(yr.matrix), this;
  }
  center() {
    return this.computeBoundingBox(), this.boundingBox.getCenter(ci).negate(), this.translate(ci.x, ci.y, ci.z), this;
  }
  setFromPoints(t) {
    const e = this.getAttribute("position");
    if (e === void 0) {
      const n = [];
      for (let s = 0, r = t.length; s < r; s++) {
        const o = t[s];
        n.push(o.x, o.y, o.z || 0);
      }
      this.setAttribute("position", new be(n, 3));
    } else {
      for (let n = 0, s = e.count; n < s; n++) {
        const r = t[n];
        e.setXYZ(n, r.x, r.y, r.z || 0);
      }
      t.length > e.count && console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."), e.needsUpdate = !0;
    }
    return this;
  }
  computeBoundingBox() {
    this.boundingBox === null && (this.boundingBox = new ls());
    const t = this.attributes.position, e = this.morphAttributes.position;
    if (t && t.isGLBufferAttribute) {
      console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.", this), this.boundingBox.set(
        new L(-1 / 0, -1 / 0, -1 / 0),
        new L(1 / 0, 1 / 0, 1 / 0)
      );
      return;
    }
    if (t !== void 0) {
      if (this.boundingBox.setFromBufferAttribute(t), e)
        for (let n = 0, s = e.length; n < s; n++) {
          const r = e[n];
          De.setFromBufferAttribute(r), this.morphTargetsRelative ? (pe.addVectors(this.boundingBox.min, De.min), this.boundingBox.expandByPoint(pe), pe.addVectors(this.boundingBox.max, De.max), this.boundingBox.expandByPoint(pe)) : (this.boundingBox.expandByPoint(De.min), this.boundingBox.expandByPoint(De.max));
        }
    } else
      this.boundingBox.makeEmpty();
    (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
  }
  computeBoundingSphere() {
    this.boundingSphere === null && (this.boundingSphere = new tr());
    const t = this.attributes.position, e = this.morphAttributes.position;
    if (t && t.isGLBufferAttribute) {
      console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.", this), this.boundingSphere.set(new L(), 1 / 0);
      return;
    }
    if (t) {
      const n = this.boundingSphere.center;
      if (De.setFromBufferAttribute(t), e)
        for (let r = 0, o = e.length; r < o; r++) {
          const a = e[r];
          Hi.setFromBufferAttribute(a), this.morphTargetsRelative ? (pe.addVectors(De.min, Hi.min), De.expandByPoint(pe), pe.addVectors(De.max, Hi.max), De.expandByPoint(pe)) : (De.expandByPoint(Hi.min), De.expandByPoint(Hi.max));
        }
      De.getCenter(n);
      let s = 0;
      for (let r = 0, o = t.count; r < o; r++)
        pe.fromBufferAttribute(t, r), s = Math.max(s, n.distanceToSquared(pe));
      if (e)
        for (let r = 0, o = e.length; r < o; r++) {
          const a = e[r], l = this.morphTargetsRelative;
          for (let h = 0, u = a.count; h < u; h++)
            pe.fromBufferAttribute(a, h), l && (ci.fromBufferAttribute(t, h), pe.add(ci)), s = Math.max(s, n.distanceToSquared(pe));
        }
      this.boundingSphere.radius = Math.sqrt(s), isNaN(this.boundingSphere.radius) && console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);
    }
  }
  computeTangents() {
    const t = this.index, e = this.attributes;
    if (t === null || e.position === void 0 || e.normal === void 0 || e.uv === void 0) {
      console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");
      return;
    }
    const n = e.position, s = e.normal, r = e.uv;
    this.hasAttribute("tangent") === !1 && this.setAttribute("tangent", new Ye(new Float32Array(4 * n.count), 4));
    const o = this.getAttribute("tangent"), a = [], l = [];
    for (let C = 0; C < n.count; C++)
      a[C] = new L(), l[C] = new L();
    const h = new L(), u = new L(), c = new L(), f = new kt(), d = new kt(), g = new kt(), x = new L(), m = new L();
    function p(C, M, _) {
      h.fromBufferAttribute(n, C), u.fromBufferAttribute(n, M), c.fromBufferAttribute(n, _), f.fromBufferAttribute(r, C), d.fromBufferAttribute(r, M), g.fromBufferAttribute(r, _), u.sub(h), c.sub(h), d.sub(f), g.sub(f);
      const A = 1 / (d.x * g.y - g.x * d.y);
      isFinite(A) && (x.copy(u).multiplyScalar(g.y).addScaledVector(c, -d.y).multiplyScalar(A), m.copy(c).multiplyScalar(d.x).addScaledVector(u, -g.x).multiplyScalar(A), a[C].add(x), a[M].add(x), a[_].add(x), l[C].add(m), l[M].add(m), l[_].add(m));
    }
    let E = this.groups;
    E.length === 0 && (E = [{
      start: 0,
      count: t.count
    }]);
    for (let C = 0, M = E.length; C < M; ++C) {
      const _ = E[C], A = _.start, F = _.count;
      for (let O = A, G = A + F; O < G; O += 3)
        p(
          t.getX(O + 0),
          t.getX(O + 1),
          t.getX(O + 2)
        );
    }
    const b = new L(), y = new L(), N = new L(), R = new L();
    function T(C) {
      N.fromBufferAttribute(s, C), R.copy(N);
      const M = a[C];
      b.copy(M), b.sub(N.multiplyScalar(N.dot(M))).normalize(), y.crossVectors(R, M);
      const A = y.dot(l[C]) < 0 ? -1 : 1;
      o.setXYZW(C, b.x, b.y, b.z, A);
    }
    for (let C = 0, M = E.length; C < M; ++C) {
      const _ = E[C], A = _.start, F = _.count;
      for (let O = A, G = A + F; O < G; O += 3)
        T(t.getX(O + 0)), T(t.getX(O + 1)), T(t.getX(O + 2));
    }
  }
  computeVertexNormals() {
    const t = this.index, e = this.getAttribute("position");
    if (e !== void 0) {
      let n = this.getAttribute("normal");
      if (n === void 0)
        n = new Ye(new Float32Array(e.count * 3), 3), this.setAttribute("normal", n);
      else
        for (let f = 0, d = n.count; f < d; f++)
          n.setXYZ(f, 0, 0, 0);
      const s = new L(), r = new L(), o = new L(), a = new L(), l = new L(), h = new L(), u = new L(), c = new L();
      if (t)
        for (let f = 0, d = t.count; f < d; f += 3) {
          const g = t.getX(f + 0), x = t.getX(f + 1), m = t.getX(f + 2);
          s.fromBufferAttribute(e, g), r.fromBufferAttribute(e, x), o.fromBufferAttribute(e, m), u.subVectors(o, r), c.subVectors(s, r), u.cross(c), a.fromBufferAttribute(n, g), l.fromBufferAttribute(n, x), h.fromBufferAttribute(n, m), a.add(u), l.add(u), h.add(u), n.setXYZ(g, a.x, a.y, a.z), n.setXYZ(x, l.x, l.y, l.z), n.setXYZ(m, h.x, h.y, h.z);
        }
      else
        for (let f = 0, d = e.count; f < d; f += 3)
          s.fromBufferAttribute(e, f + 0), r.fromBufferAttribute(e, f + 1), o.fromBufferAttribute(e, f + 2), u.subVectors(o, r), c.subVectors(s, r), u.cross(c), n.setXYZ(f + 0, u.x, u.y, u.z), n.setXYZ(f + 1, u.x, u.y, u.z), n.setXYZ(f + 2, u.x, u.y, u.z);
      this.normalizeNormals(), n.needsUpdate = !0;
    }
  }
  normalizeNormals() {
    const t = this.attributes.normal;
    for (let e = 0, n = t.count; e < n; e++)
      pe.fromBufferAttribute(t, e), pe.normalize(), t.setXYZ(e, pe.x, pe.y, pe.z);
  }
  toNonIndexed() {
    function t(a, l) {
      const h = a.array, u = a.itemSize, c = a.normalized, f = new h.constructor(l.length * u);
      let d = 0, g = 0;
      for (let x = 0, m = l.length; x < m; x++) {
        a.isInterleavedBufferAttribute ? d = l[x] * a.data.stride + a.offset : d = l[x] * u;
        for (let p = 0; p < u; p++)
          f[g++] = h[d++];
      }
      return new Ye(f, u, c);
    }
    if (this.index === null)
      return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."), this;
    const e = new ze(), n = this.index.array, s = this.attributes;
    for (const a in s) {
      const l = s[a], h = t(l, n);
      e.setAttribute(a, h);
    }
    const r = this.morphAttributes;
    for (const a in r) {
      const l = [], h = r[a];
      for (let u = 0, c = h.length; u < c; u++) {
        const f = h[u], d = t(f, n);
        l.push(d);
      }
      e.morphAttributes[a] = l;
    }
    e.morphTargetsRelative = this.morphTargetsRelative;
    const o = this.groups;
    for (let a = 0, l = o.length; a < l; a++) {
      const h = o[a];
      e.addGroup(h.start, h.count, h.materialIndex);
    }
    return e;
  }
  toJSON() {
    const t = {
      metadata: {
        version: 4.6,
        type: "BufferGeometry",
        generator: "BufferGeometry.toJSON"
      }
    };
    if (t.uuid = this.uuid, t.type = this.type, this.name !== "" && (t.name = this.name), Object.keys(this.userData).length > 0 && (t.userData = this.userData), this.parameters !== void 0) {
      const l = this.parameters;
      for (const h in l)
        l[h] !== void 0 && (t[h] = l[h]);
      return t;
    }
    t.data = { attributes: {} };
    const e = this.index;
    e !== null && (t.data.index = {
      type: e.array.constructor.name,
      array: Array.prototype.slice.call(e.array)
    });
    const n = this.attributes;
    for (const l in n) {
      const h = n[l];
      t.data.attributes[l] = h.toJSON(t.data);
    }
    const s = {};
    let r = !1;
    for (const l in this.morphAttributes) {
      const h = this.morphAttributes[l], u = [];
      for (let c = 0, f = h.length; c < f; c++) {
        const d = h[c];
        u.push(d.toJSON(t.data));
      }
      u.length > 0 && (s[l] = u, r = !0);
    }
    r && (t.data.morphAttributes = s, t.data.morphTargetsRelative = this.morphTargetsRelative);
    const o = this.groups;
    o.length > 0 && (t.data.groups = JSON.parse(JSON.stringify(o)));
    const a = this.boundingSphere;
    return a !== null && (t.data.boundingSphere = {
      center: a.center.toArray(),
      radius: a.radius
    }), t;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    this.index = null, this.attributes = {}, this.morphAttributes = {}, this.groups = [], this.boundingBox = null, this.boundingSphere = null;
    const e = {};
    this.name = t.name;
    const n = t.index;
    n !== null && this.setIndex(n.clone(e));
    const s = t.attributes;
    for (const h in s) {
      const u = s[h];
      this.setAttribute(h, u.clone(e));
    }
    const r = t.morphAttributes;
    for (const h in r) {
      const u = [], c = r[h];
      for (let f = 0, d = c.length; f < d; f++)
        u.push(c[f].clone(e));
      this.morphAttributes[h] = u;
    }
    this.morphTargetsRelative = t.morphTargetsRelative;
    const o = t.groups;
    for (let h = 0, u = o.length; h < u; h++) {
      const c = o[h];
      this.addGroup(c.start, c.count, c.materialIndex);
    }
    const a = t.boundingBox;
    a !== null && (this.boundingBox = a.clone());
    const l = t.boundingSphere;
    return l !== null && (this.boundingSphere = l.clone()), this.drawRange.start = t.drawRange.start, this.drawRange.count = t.drawRange.count, this.userData = t.userData, this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
const Ba = /* @__PURE__ */ new re(), Fn = /* @__PURE__ */ new Vo(), bs = /* @__PURE__ */ new tr(), za = /* @__PURE__ */ new L(), Es = /* @__PURE__ */ new L(), ws = /* @__PURE__ */ new L(), Ts = /* @__PURE__ */ new L(), br = /* @__PURE__ */ new L(), As = /* @__PURE__ */ new L(), ka = /* @__PURE__ */ new L(), Rs = /* @__PURE__ */ new L();
class ye extends ge {
  constructor(t = new ze(), e = new cs()) {
    super(), this.isMesh = !0, this.type = "Mesh", this.geometry = t, this.material = e, this.updateMorphTargets();
  }
  copy(t, e) {
    return super.copy(t, e), t.morphTargetInfluences !== void 0 && (this.morphTargetInfluences = t.morphTargetInfluences.slice()), t.morphTargetDictionary !== void 0 && (this.morphTargetDictionary = Object.assign({}, t.morphTargetDictionary)), this.material = Array.isArray(t.material) ? t.material.slice() : t.material, this.geometry = t.geometry, this;
  }
  updateMorphTargets() {
    const e = this.geometry.morphAttributes, n = Object.keys(e);
    if (n.length > 0) {
      const s = e[n[0]];
      if (s !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let r = 0, o = s.length; r < o; r++) {
          const a = s[r].name || String(r);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[a] = r;
        }
      }
    }
  }
  getVertexPosition(t, e) {
    const n = this.geometry, s = n.attributes.position, r = n.morphAttributes.position, o = n.morphTargetsRelative;
    e.fromBufferAttribute(s, t);
    const a = this.morphTargetInfluences;
    if (r && a) {
      As.set(0, 0, 0);
      for (let l = 0, h = r.length; l < h; l++) {
        const u = a[l], c = r[l];
        u !== 0 && (br.fromBufferAttribute(c, t), o ? As.addScaledVector(br, u) : As.addScaledVector(br.sub(e), u));
      }
      e.add(As);
    }
    return e;
  }
  raycast(t, e) {
    const n = this.geometry, s = this.material, r = this.matrixWorld;
    s !== void 0 && (n.boundingSphere === null && n.computeBoundingSphere(), bs.copy(n.boundingSphere), bs.applyMatrix4(r), Fn.copy(t.ray).recast(t.near), !(bs.containsPoint(Fn.origin) === !1 && (Fn.intersectSphere(bs, za) === null || Fn.origin.distanceToSquared(za) > (t.far - t.near) ** 2)) && (Ba.copy(r).invert(), Fn.copy(t.ray).applyMatrix4(Ba), !(n.boundingBox !== null && Fn.intersectsBox(n.boundingBox) === !1) && this._computeIntersections(t, e, Fn)));
  }
  _computeIntersections(t, e, n) {
    let s;
    const r = this.geometry, o = this.material, a = r.index, l = r.attributes.position, h = r.attributes.uv, u = r.attributes.uv1, c = r.attributes.normal, f = r.groups, d = r.drawRange;
    if (a !== null)
      if (Array.isArray(o))
        for (let g = 0, x = f.length; g < x; g++) {
          const m = f[g], p = o[m.materialIndex], E = Math.max(m.start, d.start), b = Math.min(a.count, Math.min(m.start + m.count, d.start + d.count));
          for (let y = E, N = b; y < N; y += 3) {
            const R = a.getX(y), T = a.getX(y + 1), C = a.getX(y + 2);
            s = Cs(this, p, t, n, h, u, c, R, T, C), s && (s.faceIndex = Math.floor(y / 3), s.face.materialIndex = m.materialIndex, e.push(s));
          }
        }
      else {
        const g = Math.max(0, d.start), x = Math.min(a.count, d.start + d.count);
        for (let m = g, p = x; m < p; m += 3) {
          const E = a.getX(m), b = a.getX(m + 1), y = a.getX(m + 2);
          s = Cs(this, o, t, n, h, u, c, E, b, y), s && (s.faceIndex = Math.floor(m / 3), e.push(s));
        }
      }
    else if (l !== void 0)
      if (Array.isArray(o))
        for (let g = 0, x = f.length; g < x; g++) {
          const m = f[g], p = o[m.materialIndex], E = Math.max(m.start, d.start), b = Math.min(l.count, Math.min(m.start + m.count, d.start + d.count));
          for (let y = E, N = b; y < N; y += 3) {
            const R = y, T = y + 1, C = y + 2;
            s = Cs(this, p, t, n, h, u, c, R, T, C), s && (s.faceIndex = Math.floor(y / 3), s.face.materialIndex = m.materialIndex, e.push(s));
          }
        }
      else {
        const g = Math.max(0, d.start), x = Math.min(l.count, d.start + d.count);
        for (let m = g, p = x; m < p; m += 3) {
          const E = m, b = m + 1, y = m + 2;
          s = Cs(this, o, t, n, h, u, c, E, b, y), s && (s.faceIndex = Math.floor(m / 3), e.push(s));
        }
      }
  }
}
function vu(i, t, e, n, s, r, o, a) {
  let l;
  if (t.side === Ce ? l = n.intersectTriangle(o, r, s, !0, a) : l = n.intersectTriangle(s, r, o, t.side === Pn, a), l === null) return null;
  Rs.copy(a), Rs.applyMatrix4(i.matrixWorld);
  const h = e.ray.origin.distanceTo(Rs);
  return h < e.near || h > e.far ? null : {
    distance: h,
    point: Rs.clone(),
    object: i
  };
}
function Cs(i, t, e, n, s, r, o, a, l, h) {
  i.getVertexPosition(a, Es), i.getVertexPosition(l, ws), i.getVertexPosition(h, Ts);
  const u = vu(i, t, e, n, Es, ws, Ts, ka);
  if (u) {
    const c = new L();
    $e.getBarycoord(ka, Es, ws, Ts, c), s && (u.uv = $e.getInterpolatedAttribute(s, a, l, h, c, new kt())), r && (u.uv1 = $e.getInterpolatedAttribute(r, a, l, h, c, new kt())), o && (u.normal = $e.getInterpolatedAttribute(o, a, l, h, c, new L()), u.normal.dot(n.direction) > 0 && u.normal.multiplyScalar(-1));
    const f = {
      a,
      b: l,
      c: h,
      normal: new L(),
      materialIndex: 0
    };
    $e.getNormal(Es, ws, Ts, f.normal), u.face = f, u.barycoord = c;
  }
  return u;
}
class Qe extends ze {
  constructor(t = 1, e = 1, n = 1, s = 1, r = 1, o = 1) {
    super(), this.type = "BoxGeometry", this.parameters = {
      width: t,
      height: e,
      depth: n,
      widthSegments: s,
      heightSegments: r,
      depthSegments: o
    };
    const a = this;
    s = Math.floor(s), r = Math.floor(r), o = Math.floor(o);
    const l = [], h = [], u = [], c = [];
    let f = 0, d = 0;
    g("z", "y", "x", -1, -1, n, e, t, o, r, 0), g("z", "y", "x", 1, -1, n, e, -t, o, r, 1), g("x", "z", "y", 1, 1, t, n, e, s, o, 2), g("x", "z", "y", 1, -1, t, n, -e, s, o, 3), g("x", "y", "z", 1, -1, t, e, n, s, r, 4), g("x", "y", "z", -1, -1, t, e, -n, s, r, 5), this.setIndex(l), this.setAttribute("position", new be(h, 3)), this.setAttribute("normal", new be(u, 3)), this.setAttribute("uv", new be(c, 2));
    function g(x, m, p, E, b, y, N, R, T, C, M) {
      const _ = y / T, A = N / C, F = y / 2, O = N / 2, G = R / 2, $ = T + 1, V = C + 1;
      let K = 0, H = 0;
      const st = new L();
      for (let ut = 0; ut < V; ut++) {
        const yt = ut * A - O;
        for (let Bt = 0; Bt < $; Bt++) {
          const jt = Bt * _ - F;
          st[x] = jt * E, st[m] = yt * b, st[p] = G, h.push(st.x, st.y, st.z), st[x] = 0, st[m] = 0, st[p] = R > 0 ? 1 : -1, u.push(st.x, st.y, st.z), c.push(Bt / T), c.push(1 - ut / C), K += 1;
        }
      }
      for (let ut = 0; ut < C; ut++)
        for (let yt = 0; yt < T; yt++) {
          const Bt = f + yt + $ * ut, jt = f + yt + $ * (ut + 1), q = f + (yt + 1) + $ * (ut + 1), nt = f + (yt + 1) + $ * ut;
          l.push(Bt, jt, nt), l.push(jt, q, nt), H += 6;
        }
      a.addGroup(d, H, M), d += H, f += K;
    }
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new Qe(t.width, t.height, t.depth, t.widthSegments, t.heightSegments, t.depthSegments);
  }
}
function Ci(i) {
  const t = {};
  for (const e in i) {
    t[e] = {};
    for (const n in i[e]) {
      const s = i[e][n];
      s && (s.isColor || s.isMatrix3 || s.isMatrix4 || s.isVector2 || s.isVector3 || s.isVector4 || s.isTexture || s.isQuaternion) ? s.isRenderTargetTexture ? (console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."), t[e][n] = null) : t[e][n] = s.clone() : Array.isArray(s) ? t[e][n] = s.slice() : t[e][n] = s;
    }
  }
  return t;
}
function we(i) {
  const t = {};
  for (let e = 0; e < i.length; e++) {
    const n = Ci(i[e]);
    for (const s in n)
      t[s] = n[s];
  }
  return t;
}
function Mu(i) {
  const t = [];
  for (let e = 0; e < i.length; e++)
    t.push(i[e].clone());
  return t;
}
function hc(i) {
  const t = i.getRenderTarget();
  return t === null ? i.outputColorSpace : t.isXRRenderTarget === !0 ? t.texture.colorSpace : Xt.workingColorSpace;
}
const Su = { clone: Ci, merge: we };
var yu = `void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`, bu = `void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;
class Ln extends Ui {
  static get type() {
    return "ShaderMaterial";
  }
  constructor(t) {
    super(), this.isShaderMaterial = !0, this.defines = {}, this.uniforms = {}, this.uniformsGroups = [], this.vertexShader = yu, this.fragmentShader = bu, this.linewidth = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.fog = !1, this.lights = !1, this.clipping = !1, this.forceSinglePass = !0, this.extensions = {
      clipCullDistance: !1,
      // set to use vertex shader clipping
      multiDraw: !1
      // set to use vertex shader multi_draw / enable gl_DrawID
    }, this.defaultAttributeValues = {
      color: [1, 1, 1],
      uv: [0, 0],
      uv1: [0, 0]
    }, this.index0AttributeName = void 0, this.uniformsNeedUpdate = !1, this.glslVersion = null, t !== void 0 && this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.fragmentShader = t.fragmentShader, this.vertexShader = t.vertexShader, this.uniforms = Ci(t.uniforms), this.uniformsGroups = Mu(t.uniformsGroups), this.defines = Object.assign({}, t.defines), this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.fog = t.fog, this.lights = t.lights, this.clipping = t.clipping, this.extensions = Object.assign({}, t.extensions), this.glslVersion = t.glslVersion, this;
  }
  toJSON(t) {
    const e = super.toJSON(t);
    e.glslVersion = this.glslVersion, e.uniforms = {};
    for (const s in this.uniforms) {
      const o = this.uniforms[s].value;
      o && o.isTexture ? e.uniforms[s] = {
        type: "t",
        value: o.toJSON(t).uuid
      } : o && o.isColor ? e.uniforms[s] = {
        type: "c",
        value: o.getHex()
      } : o && o.isVector2 ? e.uniforms[s] = {
        type: "v2",
        value: o.toArray()
      } : o && o.isVector3 ? e.uniforms[s] = {
        type: "v3",
        value: o.toArray()
      } : o && o.isVector4 ? e.uniforms[s] = {
        type: "v4",
        value: o.toArray()
      } : o && o.isMatrix3 ? e.uniforms[s] = {
        type: "m3",
        value: o.toArray()
      } : o && o.isMatrix4 ? e.uniforms[s] = {
        type: "m4",
        value: o.toArray()
      } : e.uniforms[s] = {
        value: o
      };
    }
    Object.keys(this.defines).length > 0 && (e.defines = this.defines), e.vertexShader = this.vertexShader, e.fragmentShader = this.fragmentShader, e.lights = this.lights, e.clipping = this.clipping;
    const n = {};
    for (const s in this.extensions)
      this.extensions[s] === !0 && (n[s] = !0);
    return Object.keys(n).length > 0 && (e.extensions = n), e;
  }
}
class uc extends ge {
  constructor() {
    super(), this.isCamera = !0, this.type = "Camera", this.matrixWorldInverse = new re(), this.projectionMatrix = new re(), this.projectionMatrixInverse = new re(), this.coordinateSystem = dn;
  }
  copy(t, e) {
    return super.copy(t, e), this.matrixWorldInverse.copy(t.matrixWorldInverse), this.projectionMatrix.copy(t.projectionMatrix), this.projectionMatrixInverse.copy(t.projectionMatrixInverse), this.coordinateSystem = t.coordinateSystem, this;
  }
  getWorldDirection(t) {
    return super.getWorldDirection(t).negate();
  }
  updateMatrixWorld(t) {
    super.updateMatrixWorld(t), this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
  updateWorldMatrix(t, e) {
    super.updateWorldMatrix(t, e), this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const bn = /* @__PURE__ */ new L(), Ha = /* @__PURE__ */ new kt(), Va = /* @__PURE__ */ new kt();
class Ie extends uc {
  constructor(t = 50, e = 1, n = 0.1, s = 2e3) {
    super(), this.isPerspectiveCamera = !0, this.type = "PerspectiveCamera", this.fov = t, this.zoom = 1, this.near = n, this.far = s, this.focus = 10, this.aspect = e, this.view = null, this.filmGauge = 35, this.filmOffset = 0, this.updateProjectionMatrix();
  }
  copy(t, e) {
    return super.copy(t, e), this.fov = t.fov, this.zoom = t.zoom, this.near = t.near, this.far = t.far, this.focus = t.focus, this.aspect = t.aspect, this.view = t.view === null ? null : Object.assign({}, t.view), this.filmGauge = t.filmGauge, this.filmOffset = t.filmOffset, this;
  }
  /**
   * Sets the FOV by focal length in respect to the current .filmGauge.
   *
   * The default film gauge is 35, so that the focal length can be specified for
   * a 35mm (full frame) camera.
   *
   * Values for focal length and film gauge must have the same unit.
   */
  setFocalLength(t) {
    const e = 0.5 * this.getFilmHeight() / t;
    this.fov = ss * 2 * Math.atan(e), this.updateProjectionMatrix();
  }
  /**
   * Calculates the focal length from the current .fov and .filmGauge.
   */
  getFocalLength() {
    const t = Math.tan(Ji * 0.5 * this.fov);
    return 0.5 * this.getFilmHeight() / t;
  }
  getEffectiveFOV() {
    return ss * 2 * Math.atan(
      Math.tan(Ji * 0.5 * this.fov) / this.zoom
    );
  }
  getFilmWidth() {
    return this.filmGauge * Math.min(this.aspect, 1);
  }
  getFilmHeight() {
    return this.filmGauge / Math.max(this.aspect, 1);
  }
  /**
   * Computes the 2D bounds of the camera's viewable rectangle at a given distance along the viewing direction.
   * Sets minTarget and maxTarget to the coordinates of the lower-left and upper-right corners of the view rectangle.
   */
  getViewBounds(t, e, n) {
    bn.set(-1, -1, 0.5).applyMatrix4(this.projectionMatrixInverse), e.set(bn.x, bn.y).multiplyScalar(-t / bn.z), bn.set(1, 1, 0.5).applyMatrix4(this.projectionMatrixInverse), n.set(bn.x, bn.y).multiplyScalar(-t / bn.z);
  }
  /**
   * Computes the width and height of the camera's viewable rectangle at a given distance along the viewing direction.
   * Copies the result into the target Vector2, where x is width and y is height.
   */
  getViewSize(t, e) {
    return this.getViewBounds(t, Ha, Va), e.subVectors(Va, Ha);
  }
  /**
   * Sets an offset in a larger frustum. This is useful for multi-window or
   * multi-monitor/multi-machine setups.
   *
   * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
   * the monitors are in grid like this
   *
   *   +---+---+---+
   *   | A | B | C |
   *   +---+---+---+
   *   | D | E | F |
   *   +---+---+---+
   *
   * then for each monitor you would call it like this
   *
   *   const w = 1920;
   *   const h = 1080;
   *   const fullWidth = w * 3;
   *   const fullHeight = h * 2;
   *
   *   --A--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
   *   --B--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
   *   --C--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
   *   --D--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
   *   --E--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
   *   --F--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
   *
   *   Note there is no reason monitors have to be the same size or in a grid.
   */
  setViewOffset(t, e, n, s, r, o) {
    this.aspect = t / e, this.view === null && (this.view = {
      enabled: !0,
      fullWidth: 1,
      fullHeight: 1,
      offsetX: 0,
      offsetY: 0,
      width: 1,
      height: 1
    }), this.view.enabled = !0, this.view.fullWidth = t, this.view.fullHeight = e, this.view.offsetX = n, this.view.offsetY = s, this.view.width = r, this.view.height = o, this.updateProjectionMatrix();
  }
  clearViewOffset() {
    this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix();
  }
  updateProjectionMatrix() {
    const t = this.near;
    let e = t * Math.tan(Ji * 0.5 * this.fov) / this.zoom, n = 2 * e, s = this.aspect * n, r = -0.5 * s;
    const o = this.view;
    if (this.view !== null && this.view.enabled) {
      const l = o.fullWidth, h = o.fullHeight;
      r += o.offsetX * s / l, e -= o.offsetY * n / h, s *= o.width / l, n *= o.height / h;
    }
    const a = this.filmOffset;
    a !== 0 && (r += t * a / this.getFilmWidth()), this.projectionMatrix.makePerspective(r, r + s, e, e - n, t, this.far, this.coordinateSystem), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return e.object.fov = this.fov, e.object.zoom = this.zoom, e.object.near = this.near, e.object.far = this.far, e.object.focus = this.focus, e.object.aspect = this.aspect, this.view !== null && (e.object.view = Object.assign({}, this.view)), e.object.filmGauge = this.filmGauge, e.object.filmOffset = this.filmOffset, e;
  }
}
const hi = -90, ui = 1;
class Eu extends ge {
  constructor(t, e, n) {
    super(), this.type = "CubeCamera", this.renderTarget = n, this.coordinateSystem = null, this.activeMipmapLevel = 0;
    const s = new Ie(hi, ui, t, e);
    s.layers = this.layers, this.add(s);
    const r = new Ie(hi, ui, t, e);
    r.layers = this.layers, this.add(r);
    const o = new Ie(hi, ui, t, e);
    o.layers = this.layers, this.add(o);
    const a = new Ie(hi, ui, t, e);
    a.layers = this.layers, this.add(a);
    const l = new Ie(hi, ui, t, e);
    l.layers = this.layers, this.add(l);
    const h = new Ie(hi, ui, t, e);
    h.layers = this.layers, this.add(h);
  }
  updateCoordinateSystem() {
    const t = this.coordinateSystem, e = this.children.concat(), [n, s, r, o, a, l] = e;
    for (const h of e) this.remove(h);
    if (t === dn)
      n.up.set(0, 1, 0), n.lookAt(1, 0, 0), s.up.set(0, 1, 0), s.lookAt(-1, 0, 0), r.up.set(0, 0, -1), r.lookAt(0, 1, 0), o.up.set(0, 0, 1), o.lookAt(0, -1, 0), a.up.set(0, 1, 0), a.lookAt(0, 0, 1), l.up.set(0, 1, 0), l.lookAt(0, 0, -1);
    else if (t === qs)
      n.up.set(0, -1, 0), n.lookAt(-1, 0, 0), s.up.set(0, -1, 0), s.lookAt(1, 0, 0), r.up.set(0, 0, 1), r.lookAt(0, 1, 0), o.up.set(0, 0, -1), o.lookAt(0, -1, 0), a.up.set(0, -1, 0), a.lookAt(0, 0, 1), l.up.set(0, -1, 0), l.lookAt(0, 0, -1);
    else
      throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " + t);
    for (const h of e)
      this.add(h), h.updateMatrixWorld();
  }
  update(t, e) {
    this.parent === null && this.updateMatrixWorld();
    const { renderTarget: n, activeMipmapLevel: s } = this;
    this.coordinateSystem !== t.coordinateSystem && (this.coordinateSystem = t.coordinateSystem, this.updateCoordinateSystem());
    const [r, o, a, l, h, u] = this.children, c = t.getRenderTarget(), f = t.getActiveCubeFace(), d = t.getActiveMipmapLevel(), g = t.xr.enabled;
    t.xr.enabled = !1;
    const x = n.texture.generateMipmaps;
    n.texture.generateMipmaps = !1, t.setRenderTarget(n, 0, s), t.render(e, r), t.setRenderTarget(n, 1, s), t.render(e, o), t.setRenderTarget(n, 2, s), t.render(e, a), t.setRenderTarget(n, 3, s), t.render(e, l), t.setRenderTarget(n, 4, s), t.render(e, h), n.texture.generateMipmaps = x, t.setRenderTarget(n, 5, s), t.render(e, u), t.setRenderTarget(c, f, d), t.xr.enabled = g, n.texture.needsPMREMUpdate = !0;
  }
}
class dc extends Ae {
  constructor(t, e, n, s, r, o, a, l, h, u) {
    t = t !== void 0 ? t : [], e = e !== void 0 ? e : wi, super(t, e, n, s, r, o, a, l, h, u), this.isCubeTexture = !0, this.flipY = !1;
  }
  get images() {
    return this.image;
  }
  set images(t) {
    this.image = t;
  }
}
class wu extends Kn {
  constructor(t = 1, e = {}) {
    super(t, t, e), this.isWebGLCubeRenderTarget = !0;
    const n = { width: t, height: t, depth: 1 }, s = [n, n, n, n, n, n];
    this.texture = new dc(s, e.mapping, e.wrapS, e.wrapT, e.magFilter, e.minFilter, e.format, e.type, e.anisotropy, e.colorSpace), this.texture.isRenderTargetTexture = !0, this.texture.generateMipmaps = e.generateMipmaps !== void 0 ? e.generateMipmaps : !1, this.texture.minFilter = e.minFilter !== void 0 ? e.minFilter : Ke;
  }
  fromEquirectangularTexture(t, e) {
    this.texture.type = e.type, this.texture.colorSpace = e.colorSpace, this.texture.generateMipmaps = e.generateMipmaps, this.texture.minFilter = e.minFilter, this.texture.magFilter = e.magFilter;
    const n = {
      uniforms: {
        tEquirect: { value: null }
      },
      vertexShader: (
        /* glsl */
        `

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`
      ),
      fragmentShader: (
        /* glsl */
        `

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`
      )
    }, s = new Qe(5, 5, 5), r = new Ln({
      name: "CubemapFromEquirect",
      uniforms: Ci(n.uniforms),
      vertexShader: n.vertexShader,
      fragmentShader: n.fragmentShader,
      side: Ce,
      blending: An
    });
    r.uniforms.tEquirect.value = e;
    const o = new ye(s, r), a = e.minFilter;
    return e.minFilter === qn && (e.minFilter = Ke), new Eu(1, 10, this).update(t, o), e.minFilter = a, o.geometry.dispose(), o.material.dispose(), this;
  }
  clear(t, e, n, s) {
    const r = t.getRenderTarget();
    for (let o = 0; o < 6; o++)
      t.setRenderTarget(this, o), t.clear(e, n, s);
    t.setRenderTarget(r);
  }
}
const Er = /* @__PURE__ */ new L(), Tu = /* @__PURE__ */ new L(), Au = /* @__PURE__ */ new It();
class Hn {
  constructor(t = new L(1, 0, 0), e = 0) {
    this.isPlane = !0, this.normal = t, this.constant = e;
  }
  set(t, e) {
    return this.normal.copy(t), this.constant = e, this;
  }
  setComponents(t, e, n, s) {
    return this.normal.set(t, e, n), this.constant = s, this;
  }
  setFromNormalAndCoplanarPoint(t, e) {
    return this.normal.copy(t), this.constant = -e.dot(this.normal), this;
  }
  setFromCoplanarPoints(t, e, n) {
    const s = Er.subVectors(n, e).cross(Tu.subVectors(t, e)).normalize();
    return this.setFromNormalAndCoplanarPoint(s, t), this;
  }
  copy(t) {
    return this.normal.copy(t.normal), this.constant = t.constant, this;
  }
  normalize() {
    const t = 1 / this.normal.length();
    return this.normal.multiplyScalar(t), this.constant *= t, this;
  }
  negate() {
    return this.constant *= -1, this.normal.negate(), this;
  }
  distanceToPoint(t) {
    return this.normal.dot(t) + this.constant;
  }
  distanceToSphere(t) {
    return this.distanceToPoint(t.center) - t.radius;
  }
  projectPoint(t, e) {
    return e.copy(t).addScaledVector(this.normal, -this.distanceToPoint(t));
  }
  intersectLine(t, e) {
    const n = t.delta(Er), s = this.normal.dot(n);
    if (s === 0)
      return this.distanceToPoint(t.start) === 0 ? e.copy(t.start) : null;
    const r = -(t.start.dot(this.normal) + this.constant) / s;
    return r < 0 || r > 1 ? null : e.copy(t.start).addScaledVector(n, r);
  }
  intersectsLine(t) {
    const e = this.distanceToPoint(t.start), n = this.distanceToPoint(t.end);
    return e < 0 && n > 0 || n < 0 && e > 0;
  }
  intersectsBox(t) {
    return t.intersectsPlane(this);
  }
  intersectsSphere(t) {
    return t.intersectsPlane(this);
  }
  coplanarPoint(t) {
    return t.copy(this.normal).multiplyScalar(-this.constant);
  }
  applyMatrix4(t, e) {
    const n = e || Au.getNormalMatrix(t), s = this.coplanarPoint(Er).applyMatrix4(t), r = this.normal.applyMatrix3(n).normalize();
    return this.constant = -s.dot(r), this;
  }
  translate(t) {
    return this.constant -= t.dot(this.normal), this;
  }
  equals(t) {
    return t.normal.equals(this.normal) && t.constant === this.constant;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const On = /* @__PURE__ */ new tr(), Ps = /* @__PURE__ */ new L();
class Wo {
  constructor(t = new Hn(), e = new Hn(), n = new Hn(), s = new Hn(), r = new Hn(), o = new Hn()) {
    this.planes = [t, e, n, s, r, o];
  }
  set(t, e, n, s, r, o) {
    const a = this.planes;
    return a[0].copy(t), a[1].copy(e), a[2].copy(n), a[3].copy(s), a[4].copy(r), a[5].copy(o), this;
  }
  copy(t) {
    const e = this.planes;
    for (let n = 0; n < 6; n++)
      e[n].copy(t.planes[n]);
    return this;
  }
  setFromProjectionMatrix(t, e = dn) {
    const n = this.planes, s = t.elements, r = s[0], o = s[1], a = s[2], l = s[3], h = s[4], u = s[5], c = s[6], f = s[7], d = s[8], g = s[9], x = s[10], m = s[11], p = s[12], E = s[13], b = s[14], y = s[15];
    if (n[0].setComponents(l - r, f - h, m - d, y - p).normalize(), n[1].setComponents(l + r, f + h, m + d, y + p).normalize(), n[2].setComponents(l + o, f + u, m + g, y + E).normalize(), n[3].setComponents(l - o, f - u, m - g, y - E).normalize(), n[4].setComponents(l - a, f - c, m - x, y - b).normalize(), e === dn)
      n[5].setComponents(l + a, f + c, m + x, y + b).normalize();
    else if (e === qs)
      n[5].setComponents(a, c, x, b).normalize();
    else
      throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " + e);
    return this;
  }
  intersectsObject(t) {
    if (t.boundingSphere !== void 0)
      t.boundingSphere === null && t.computeBoundingSphere(), On.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);
    else {
      const e = t.geometry;
      e.boundingSphere === null && e.computeBoundingSphere(), On.copy(e.boundingSphere).applyMatrix4(t.matrixWorld);
    }
    return this.intersectsSphere(On);
  }
  intersectsSprite(t) {
    return On.center.set(0, 0, 0), On.radius = 0.7071067811865476, On.applyMatrix4(t.matrixWorld), this.intersectsSphere(On);
  }
  intersectsSphere(t) {
    const e = this.planes, n = t.center, s = -t.radius;
    for (let r = 0; r < 6; r++)
      if (e[r].distanceToPoint(n) < s)
        return !1;
    return !0;
  }
  intersectsBox(t) {
    const e = this.planes;
    for (let n = 0; n < 6; n++) {
      const s = e[n];
      if (Ps.x = s.normal.x > 0 ? t.max.x : t.min.x, Ps.y = s.normal.y > 0 ? t.max.y : t.min.y, Ps.z = s.normal.z > 0 ? t.max.z : t.min.z, s.distanceToPoint(Ps) < 0)
        return !1;
    }
    return !0;
  }
  containsPoint(t) {
    const e = this.planes;
    for (let n = 0; n < 6; n++)
      if (e[n].distanceToPoint(t) < 0)
        return !1;
    return !0;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
function fc() {
  let i = null, t = !1, e = null, n = null;
  function s(r, o) {
    e(r, o), n = i.requestAnimationFrame(s);
  }
  return {
    start: function() {
      t !== !0 && e !== null && (n = i.requestAnimationFrame(s), t = !0);
    },
    stop: function() {
      i.cancelAnimationFrame(n), t = !1;
    },
    setAnimationLoop: function(r) {
      e = r;
    },
    setContext: function(r) {
      i = r;
    }
  };
}
function Ru(i) {
  const t = /* @__PURE__ */ new WeakMap();
  function e(a, l) {
    const h = a.array, u = a.usage, c = h.byteLength, f = i.createBuffer();
    i.bindBuffer(l, f), i.bufferData(l, h, u), a.onUploadCallback();
    let d;
    if (h instanceof Float32Array)
      d = i.FLOAT;
    else if (h instanceof Uint16Array)
      a.isFloat16BufferAttribute ? d = i.HALF_FLOAT : d = i.UNSIGNED_SHORT;
    else if (h instanceof Int16Array)
      d = i.SHORT;
    else if (h instanceof Uint32Array)
      d = i.UNSIGNED_INT;
    else if (h instanceof Int32Array)
      d = i.INT;
    else if (h instanceof Int8Array)
      d = i.BYTE;
    else if (h instanceof Uint8Array)
      d = i.UNSIGNED_BYTE;
    else if (h instanceof Uint8ClampedArray)
      d = i.UNSIGNED_BYTE;
    else
      throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: " + h);
    return {
      buffer: f,
      type: d,
      bytesPerElement: h.BYTES_PER_ELEMENT,
      version: a.version,
      size: c
    };
  }
  function n(a, l, h) {
    const u = l.array, c = l.updateRanges;
    if (i.bindBuffer(h, a), c.length === 0)
      i.bufferSubData(h, 0, u);
    else {
      c.sort((d, g) => d.start - g.start);
      let f = 0;
      for (let d = 1; d < c.length; d++) {
        const g = c[f], x = c[d];
        x.start <= g.start + g.count + 1 ? g.count = Math.max(
          g.count,
          x.start + x.count - g.start
        ) : (++f, c[f] = x);
      }
      c.length = f + 1;
      for (let d = 0, g = c.length; d < g; d++) {
        const x = c[d];
        i.bufferSubData(
          h,
          x.start * u.BYTES_PER_ELEMENT,
          u,
          x.start,
          x.count
        );
      }
      l.clearUpdateRanges();
    }
    l.onUploadCallback();
  }
  function s(a) {
    return a.isInterleavedBufferAttribute && (a = a.data), t.get(a);
  }
  function r(a) {
    a.isInterleavedBufferAttribute && (a = a.data);
    const l = t.get(a);
    l && (i.deleteBuffer(l.buffer), t.delete(a));
  }
  function o(a, l) {
    if (a.isInterleavedBufferAttribute && (a = a.data), a.isGLBufferAttribute) {
      const u = t.get(a);
      (!u || u.version < a.version) && t.set(a, {
        buffer: a.buffer,
        type: a.type,
        bytesPerElement: a.elementSize,
        version: a.version
      });
      return;
    }
    const h = t.get(a);
    if (h === void 0)
      t.set(a, e(a, l));
    else if (h.version < a.version) {
      if (h.size !== a.array.byteLength)
        throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");
      n(h.buffer, a, l), h.version = a.version;
    }
  }
  return {
    get: s,
    remove: r,
    update: o
  };
}
class hs extends ze {
  constructor(t = 1, e = 1, n = 1, s = 1) {
    super(), this.type = "PlaneGeometry", this.parameters = {
      width: t,
      height: e,
      widthSegments: n,
      heightSegments: s
    };
    const r = t / 2, o = e / 2, a = Math.floor(n), l = Math.floor(s), h = a + 1, u = l + 1, c = t / a, f = e / l, d = [], g = [], x = [], m = [];
    for (let p = 0; p < u; p++) {
      const E = p * f - o;
      for (let b = 0; b < h; b++) {
        const y = b * c - r;
        g.push(y, -E, 0), x.push(0, 0, 1), m.push(b / a), m.push(1 - p / l);
      }
    }
    for (let p = 0; p < l; p++)
      for (let E = 0; E < a; E++) {
        const b = E + h * p, y = E + h * (p + 1), N = E + 1 + h * (p + 1), R = E + 1 + h * p;
        d.push(b, y, R), d.push(y, N, R);
      }
    this.setIndex(d), this.setAttribute("position", new be(g, 3)), this.setAttribute("normal", new be(x, 3)), this.setAttribute("uv", new be(m, 2));
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new hs(t.width, t.height, t.widthSegments, t.heightSegments);
  }
}
var Cu = `#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`, Pu = `#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`, Lu = `#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`, Du = `#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, Uu = `#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`, Iu = `#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`, Nu = `#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`, Fu = `#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`, Ou = `#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`, Bu = `#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`, zu = `vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`, ku = `vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`, Hu = `float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`, Vu = `#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`, Gu = `#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`, Wu = `#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`, $u = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`, Xu = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`, qu = `#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`, Yu = `#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`, Zu = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`, ju = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`, Ku = `#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`, Ju = `#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`, Qu = `#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`, td = `vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`, ed = `#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`, nd = `#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`, id = `#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`, sd = `#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`, rd = "gl_FragColor = linearToOutputTexel( gl_FragColor );", od = `vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`, ad = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`, ld = `#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`, cd = `#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`, hd = `#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`, ud = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`, dd = `#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`, fd = `#ifdef USE_FOG
	varying float vFogDepth;
#endif`, pd = `#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`, md = `#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`, gd = `#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`, _d = `#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`, xd = `LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`, vd = `varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`, Md = `uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`, Sd = `#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`, yd = `ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`, bd = `varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`, Ed = `BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`, wd = `varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`, Td = `PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`, Ad = `struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`, Rd = `
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`, Cd = `#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`, Pd = `#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`, Ld = `#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`, Dd = `#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, Ud = `#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, Id = `#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`, Nd = `#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`, Fd = `#ifdef USE_MAP
	uniform sampler2D map;
#endif`, Od = `#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`, Bd = `#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, zd = `float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`, kd = `#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`, Hd = `#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`, Vd = `#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`, Gd = `#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`, Wd = `#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`, $d = `#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`, Xd = `float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`, qd = `#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`, Yd = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, Zd = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, jd = `#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`, Kd = `#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`, Jd = `#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`, Qd = `#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`, tf = `#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`, ef = `#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`, nf = `#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`, sf = `vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`, rf = `#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`, of = `vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`, af = `#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`, lf = `#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`, cf = `float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`, hf = `#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`, uf = `#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`, df = `#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`, ff = `#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`, pf = `float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`, mf = `#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`, gf = `#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`, _f = `#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`, xf = `#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`, vf = `float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`, Mf = `#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`, Sf = `#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`, yf = `#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`, bf = `#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`, Ef = `#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`, wf = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, Tf = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, Af = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`, Rf = `#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;
const Cf = `varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`, Pf = `uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Lf = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, Df = `#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Uf = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, If = `uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Nf = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`, Ff = `#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`, Of = `#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`, Bf = `#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`, zf = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`, kf = `uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Hf = `uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, Vf = `uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, Gf = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`, Wf = `uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, $f = `#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, Xf = `#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, qf = `#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`, Yf = `#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Zf = `#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`, jf = `#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`, Kf = `#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, Jf = `#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Qf = `#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`, tp = `#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, ep = `#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, np = `#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, ip = `uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`, sp = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, rp = `#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, op = `uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`, ap = `uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, lp = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`, Ot = {
  alphahash_fragment: Cu,
  alphahash_pars_fragment: Pu,
  alphamap_fragment: Lu,
  alphamap_pars_fragment: Du,
  alphatest_fragment: Uu,
  alphatest_pars_fragment: Iu,
  aomap_fragment: Nu,
  aomap_pars_fragment: Fu,
  batching_pars_vertex: Ou,
  batching_vertex: Bu,
  begin_vertex: zu,
  beginnormal_vertex: ku,
  bsdfs: Hu,
  iridescence_fragment: Vu,
  bumpmap_pars_fragment: Gu,
  clipping_planes_fragment: Wu,
  clipping_planes_pars_fragment: $u,
  clipping_planes_pars_vertex: Xu,
  clipping_planes_vertex: qu,
  color_fragment: Yu,
  color_pars_fragment: Zu,
  color_pars_vertex: ju,
  color_vertex: Ku,
  common: Ju,
  cube_uv_reflection_fragment: Qu,
  defaultnormal_vertex: td,
  displacementmap_pars_vertex: ed,
  displacementmap_vertex: nd,
  emissivemap_fragment: id,
  emissivemap_pars_fragment: sd,
  colorspace_fragment: rd,
  colorspace_pars_fragment: od,
  envmap_fragment: ad,
  envmap_common_pars_fragment: ld,
  envmap_pars_fragment: cd,
  envmap_pars_vertex: hd,
  envmap_physical_pars_fragment: Sd,
  envmap_vertex: ud,
  fog_vertex: dd,
  fog_pars_vertex: fd,
  fog_fragment: pd,
  fog_pars_fragment: md,
  gradientmap_pars_fragment: gd,
  lightmap_pars_fragment: _d,
  lights_lambert_fragment: xd,
  lights_lambert_pars_fragment: vd,
  lights_pars_begin: Md,
  lights_toon_fragment: yd,
  lights_toon_pars_fragment: bd,
  lights_phong_fragment: Ed,
  lights_phong_pars_fragment: wd,
  lights_physical_fragment: Td,
  lights_physical_pars_fragment: Ad,
  lights_fragment_begin: Rd,
  lights_fragment_maps: Cd,
  lights_fragment_end: Pd,
  logdepthbuf_fragment: Ld,
  logdepthbuf_pars_fragment: Dd,
  logdepthbuf_pars_vertex: Ud,
  logdepthbuf_vertex: Id,
  map_fragment: Nd,
  map_pars_fragment: Fd,
  map_particle_fragment: Od,
  map_particle_pars_fragment: Bd,
  metalnessmap_fragment: zd,
  metalnessmap_pars_fragment: kd,
  morphinstance_vertex: Hd,
  morphcolor_vertex: Vd,
  morphnormal_vertex: Gd,
  morphtarget_pars_vertex: Wd,
  morphtarget_vertex: $d,
  normal_fragment_begin: Xd,
  normal_fragment_maps: qd,
  normal_pars_fragment: Yd,
  normal_pars_vertex: Zd,
  normal_vertex: jd,
  normalmap_pars_fragment: Kd,
  clearcoat_normal_fragment_begin: Jd,
  clearcoat_normal_fragment_maps: Qd,
  clearcoat_pars_fragment: tf,
  iridescence_pars_fragment: ef,
  opaque_fragment: nf,
  packing: sf,
  premultiplied_alpha_fragment: rf,
  project_vertex: of,
  dithering_fragment: af,
  dithering_pars_fragment: lf,
  roughnessmap_fragment: cf,
  roughnessmap_pars_fragment: hf,
  shadowmap_pars_fragment: uf,
  shadowmap_pars_vertex: df,
  shadowmap_vertex: ff,
  shadowmask_pars_fragment: pf,
  skinbase_vertex: mf,
  skinning_pars_vertex: gf,
  skinning_vertex: _f,
  skinnormal_vertex: xf,
  specularmap_fragment: vf,
  specularmap_pars_fragment: Mf,
  tonemapping_fragment: Sf,
  tonemapping_pars_fragment: yf,
  transmission_fragment: bf,
  transmission_pars_fragment: Ef,
  uv_pars_fragment: wf,
  uv_pars_vertex: Tf,
  uv_vertex: Af,
  worldpos_vertex: Rf,
  background_vert: Cf,
  background_frag: Pf,
  backgroundCube_vert: Lf,
  backgroundCube_frag: Df,
  cube_vert: Uf,
  cube_frag: If,
  depth_vert: Nf,
  depth_frag: Ff,
  distanceRGBA_vert: Of,
  distanceRGBA_frag: Bf,
  equirect_vert: zf,
  equirect_frag: kf,
  linedashed_vert: Hf,
  linedashed_frag: Vf,
  meshbasic_vert: Gf,
  meshbasic_frag: Wf,
  meshlambert_vert: $f,
  meshlambert_frag: Xf,
  meshmatcap_vert: qf,
  meshmatcap_frag: Yf,
  meshnormal_vert: Zf,
  meshnormal_frag: jf,
  meshphong_vert: Kf,
  meshphong_frag: Jf,
  meshphysical_vert: Qf,
  meshphysical_frag: tp,
  meshtoon_vert: ep,
  meshtoon_frag: np,
  points_vert: ip,
  points_frag: sp,
  shadow_vert: rp,
  shadow_frag: op,
  sprite_vert: ap,
  sprite_frag: lp
}, it = {
  common: {
    diffuse: { value: /* @__PURE__ */ new Pt(16777215) },
    opacity: { value: 1 },
    map: { value: null },
    mapTransform: { value: /* @__PURE__ */ new It() },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new It() },
    alphaTest: { value: 0 }
  },
  specularmap: {
    specularMap: { value: null },
    specularMapTransform: { value: /* @__PURE__ */ new It() }
  },
  envmap: {
    envMap: { value: null },
    envMapRotation: { value: /* @__PURE__ */ new It() },
    flipEnvMap: { value: -1 },
    reflectivity: { value: 1 },
    // basic, lambert, phong
    ior: { value: 1.5 },
    // physical
    refractionRatio: { value: 0.98 }
    // basic, lambert, phong
  },
  aomap: {
    aoMap: { value: null },
    aoMapIntensity: { value: 1 },
    aoMapTransform: { value: /* @__PURE__ */ new It() }
  },
  lightmap: {
    lightMap: { value: null },
    lightMapIntensity: { value: 1 },
    lightMapTransform: { value: /* @__PURE__ */ new It() }
  },
  bumpmap: {
    bumpMap: { value: null },
    bumpMapTransform: { value: /* @__PURE__ */ new It() },
    bumpScale: { value: 1 }
  },
  normalmap: {
    normalMap: { value: null },
    normalMapTransform: { value: /* @__PURE__ */ new It() },
    normalScale: { value: /* @__PURE__ */ new kt(1, 1) }
  },
  displacementmap: {
    displacementMap: { value: null },
    displacementMapTransform: { value: /* @__PURE__ */ new It() },
    displacementScale: { value: 1 },
    displacementBias: { value: 0 }
  },
  emissivemap: {
    emissiveMap: { value: null },
    emissiveMapTransform: { value: /* @__PURE__ */ new It() }
  },
  metalnessmap: {
    metalnessMap: { value: null },
    metalnessMapTransform: { value: /* @__PURE__ */ new It() }
  },
  roughnessmap: {
    roughnessMap: { value: null },
    roughnessMapTransform: { value: /* @__PURE__ */ new It() }
  },
  gradientmap: {
    gradientMap: { value: null }
  },
  fog: {
    fogDensity: { value: 25e-5 },
    fogNear: { value: 1 },
    fogFar: { value: 2e3 },
    fogColor: { value: /* @__PURE__ */ new Pt(16777215) }
  },
  lights: {
    ambientLightColor: { value: [] },
    lightProbe: { value: [] },
    directionalLights: { value: [], properties: {
      direction: {},
      color: {}
    } },
    directionalLightShadows: { value: [], properties: {
      shadowIntensity: 1,
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {}
    } },
    directionalShadowMap: { value: [] },
    directionalShadowMatrix: { value: [] },
    spotLights: { value: [], properties: {
      color: {},
      position: {},
      direction: {},
      distance: {},
      coneCos: {},
      penumbraCos: {},
      decay: {}
    } },
    spotLightShadows: { value: [], properties: {
      shadowIntensity: 1,
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {}
    } },
    spotLightMap: { value: [] },
    spotShadowMap: { value: [] },
    spotLightMatrix: { value: [] },
    pointLights: { value: [], properties: {
      color: {},
      position: {},
      decay: {},
      distance: {}
    } },
    pointLightShadows: { value: [], properties: {
      shadowIntensity: 1,
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {},
      shadowCameraNear: {},
      shadowCameraFar: {}
    } },
    pointShadowMap: { value: [] },
    pointShadowMatrix: { value: [] },
    hemisphereLights: { value: [], properties: {
      direction: {},
      skyColor: {},
      groundColor: {}
    } },
    // TODO (abelnation): RectAreaLight BRDF data needs to be moved from example to main src
    rectAreaLights: { value: [], properties: {
      color: {},
      position: {},
      width: {},
      height: {}
    } },
    ltc_1: { value: null },
    ltc_2: { value: null }
  },
  points: {
    diffuse: { value: /* @__PURE__ */ new Pt(16777215) },
    opacity: { value: 1 },
    size: { value: 1 },
    scale: { value: 1 },
    map: { value: null },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new It() },
    alphaTest: { value: 0 },
    uvTransform: { value: /* @__PURE__ */ new It() }
  },
  sprite: {
    diffuse: { value: /* @__PURE__ */ new Pt(16777215) },
    opacity: { value: 1 },
    center: { value: /* @__PURE__ */ new kt(0.5, 0.5) },
    rotation: { value: 0 },
    map: { value: null },
    mapTransform: { value: /* @__PURE__ */ new It() },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new It() },
    alphaTest: { value: 0 }
  }
}, je = {
  basic: {
    uniforms: /* @__PURE__ */ we([
      it.common,
      it.specularmap,
      it.envmap,
      it.aomap,
      it.lightmap,
      it.fog
    ]),
    vertexShader: Ot.meshbasic_vert,
    fragmentShader: Ot.meshbasic_frag
  },
  lambert: {
    uniforms: /* @__PURE__ */ we([
      it.common,
      it.specularmap,
      it.envmap,
      it.aomap,
      it.lightmap,
      it.emissivemap,
      it.bumpmap,
      it.normalmap,
      it.displacementmap,
      it.fog,
      it.lights,
      {
        emissive: { value: /* @__PURE__ */ new Pt(0) }
      }
    ]),
    vertexShader: Ot.meshlambert_vert,
    fragmentShader: Ot.meshlambert_frag
  },
  phong: {
    uniforms: /* @__PURE__ */ we([
      it.common,
      it.specularmap,
      it.envmap,
      it.aomap,
      it.lightmap,
      it.emissivemap,
      it.bumpmap,
      it.normalmap,
      it.displacementmap,
      it.fog,
      it.lights,
      {
        emissive: { value: /* @__PURE__ */ new Pt(0) },
        specular: { value: /* @__PURE__ */ new Pt(1118481) },
        shininess: { value: 30 }
      }
    ]),
    vertexShader: Ot.meshphong_vert,
    fragmentShader: Ot.meshphong_frag
  },
  standard: {
    uniforms: /* @__PURE__ */ we([
      it.common,
      it.envmap,
      it.aomap,
      it.lightmap,
      it.emissivemap,
      it.bumpmap,
      it.normalmap,
      it.displacementmap,
      it.roughnessmap,
      it.metalnessmap,
      it.fog,
      it.lights,
      {
        emissive: { value: /* @__PURE__ */ new Pt(0) },
        roughness: { value: 1 },
        metalness: { value: 0 },
        envMapIntensity: { value: 1 }
      }
    ]),
    vertexShader: Ot.meshphysical_vert,
    fragmentShader: Ot.meshphysical_frag
  },
  toon: {
    uniforms: /* @__PURE__ */ we([
      it.common,
      it.aomap,
      it.lightmap,
      it.emissivemap,
      it.bumpmap,
      it.normalmap,
      it.displacementmap,
      it.gradientmap,
      it.fog,
      it.lights,
      {
        emissive: { value: /* @__PURE__ */ new Pt(0) }
      }
    ]),
    vertexShader: Ot.meshtoon_vert,
    fragmentShader: Ot.meshtoon_frag
  },
  matcap: {
    uniforms: /* @__PURE__ */ we([
      it.common,
      it.bumpmap,
      it.normalmap,
      it.displacementmap,
      it.fog,
      {
        matcap: { value: null }
      }
    ]),
    vertexShader: Ot.meshmatcap_vert,
    fragmentShader: Ot.meshmatcap_frag
  },
  points: {
    uniforms: /* @__PURE__ */ we([
      it.points,
      it.fog
    ]),
    vertexShader: Ot.points_vert,
    fragmentShader: Ot.points_frag
  },
  dashed: {
    uniforms: /* @__PURE__ */ we([
      it.common,
      it.fog,
      {
        scale: { value: 1 },
        dashSize: { value: 1 },
        totalSize: { value: 2 }
      }
    ]),
    vertexShader: Ot.linedashed_vert,
    fragmentShader: Ot.linedashed_frag
  },
  depth: {
    uniforms: /* @__PURE__ */ we([
      it.common,
      it.displacementmap
    ]),
    vertexShader: Ot.depth_vert,
    fragmentShader: Ot.depth_frag
  },
  normal: {
    uniforms: /* @__PURE__ */ we([
      it.common,
      it.bumpmap,
      it.normalmap,
      it.displacementmap,
      {
        opacity: { value: 1 }
      }
    ]),
    vertexShader: Ot.meshnormal_vert,
    fragmentShader: Ot.meshnormal_frag
  },
  sprite: {
    uniforms: /* @__PURE__ */ we([
      it.sprite,
      it.fog
    ]),
    vertexShader: Ot.sprite_vert,
    fragmentShader: Ot.sprite_frag
  },
  background: {
    uniforms: {
      uvTransform: { value: /* @__PURE__ */ new It() },
      t2D: { value: null },
      backgroundIntensity: { value: 1 }
    },
    vertexShader: Ot.background_vert,
    fragmentShader: Ot.background_frag
  },
  backgroundCube: {
    uniforms: {
      envMap: { value: null },
      flipEnvMap: { value: -1 },
      backgroundBlurriness: { value: 0 },
      backgroundIntensity: { value: 1 },
      backgroundRotation: { value: /* @__PURE__ */ new It() }
    },
    vertexShader: Ot.backgroundCube_vert,
    fragmentShader: Ot.backgroundCube_frag
  },
  cube: {
    uniforms: {
      tCube: { value: null },
      tFlip: { value: -1 },
      opacity: { value: 1 }
    },
    vertexShader: Ot.cube_vert,
    fragmentShader: Ot.cube_frag
  },
  equirect: {
    uniforms: {
      tEquirect: { value: null }
    },
    vertexShader: Ot.equirect_vert,
    fragmentShader: Ot.equirect_frag
  },
  distanceRGBA: {
    uniforms: /* @__PURE__ */ we([
      it.common,
      it.displacementmap,
      {
        referencePosition: { value: /* @__PURE__ */ new L() },
        nearDistance: { value: 1 },
        farDistance: { value: 1e3 }
      }
    ]),
    vertexShader: Ot.distanceRGBA_vert,
    fragmentShader: Ot.distanceRGBA_frag
  },
  shadow: {
    uniforms: /* @__PURE__ */ we([
      it.lights,
      it.fog,
      {
        color: { value: /* @__PURE__ */ new Pt(0) },
        opacity: { value: 1 }
      }
    ]),
    vertexShader: Ot.shadow_vert,
    fragmentShader: Ot.shadow_frag
  }
};
je.physical = {
  uniforms: /* @__PURE__ */ we([
    je.standard.uniforms,
    {
      clearcoat: { value: 0 },
      clearcoatMap: { value: null },
      clearcoatMapTransform: { value: /* @__PURE__ */ new It() },
      clearcoatNormalMap: { value: null },
      clearcoatNormalMapTransform: { value: /* @__PURE__ */ new It() },
      clearcoatNormalScale: { value: /* @__PURE__ */ new kt(1, 1) },
      clearcoatRoughness: { value: 0 },
      clearcoatRoughnessMap: { value: null },
      clearcoatRoughnessMapTransform: { value: /* @__PURE__ */ new It() },
      dispersion: { value: 0 },
      iridescence: { value: 0 },
      iridescenceMap: { value: null },
      iridescenceMapTransform: { value: /* @__PURE__ */ new It() },
      iridescenceIOR: { value: 1.3 },
      iridescenceThicknessMinimum: { value: 100 },
      iridescenceThicknessMaximum: { value: 400 },
      iridescenceThicknessMap: { value: null },
      iridescenceThicknessMapTransform: { value: /* @__PURE__ */ new It() },
      sheen: { value: 0 },
      sheenColor: { value: /* @__PURE__ */ new Pt(0) },
      sheenColorMap: { value: null },
      sheenColorMapTransform: { value: /* @__PURE__ */ new It() },
      sheenRoughness: { value: 1 },
      sheenRoughnessMap: { value: null },
      sheenRoughnessMapTransform: { value: /* @__PURE__ */ new It() },
      transmission: { value: 0 },
      transmissionMap: { value: null },
      transmissionMapTransform: { value: /* @__PURE__ */ new It() },
      transmissionSamplerSize: { value: /* @__PURE__ */ new kt() },
      transmissionSamplerMap: { value: null },
      thickness: { value: 0 },
      thicknessMap: { value: null },
      thicknessMapTransform: { value: /* @__PURE__ */ new It() },
      attenuationDistance: { value: 0 },
      attenuationColor: { value: /* @__PURE__ */ new Pt(0) },
      specularColor: { value: /* @__PURE__ */ new Pt(1, 1, 1) },
      specularColorMap: { value: null },
      specularColorMapTransform: { value: /* @__PURE__ */ new It() },
      specularIntensity: { value: 1 },
      specularIntensityMap: { value: null },
      specularIntensityMapTransform: { value: /* @__PURE__ */ new It() },
      anisotropyVector: { value: /* @__PURE__ */ new kt() },
      anisotropyMap: { value: null },
      anisotropyMapTransform: { value: /* @__PURE__ */ new It() }
    }
  ]),
  vertexShader: Ot.meshphysical_vert,
  fragmentShader: Ot.meshphysical_frag
};
const Ls = { r: 0, b: 0, g: 0 }, Bn = /* @__PURE__ */ new Je(), cp = /* @__PURE__ */ new re();
function hp(i, t, e, n, s, r, o) {
  const a = new Pt(0);
  let l = r === !0 ? 0 : 1, h, u, c = null, f = 0, d = null;
  function g(E) {
    let b = E.isScene === !0 ? E.background : null;
    return b && b.isTexture && (b = (E.backgroundBlurriness > 0 ? e : t).get(b)), b;
  }
  function x(E) {
    let b = !1;
    const y = g(E);
    y === null ? p(a, l) : y && y.isColor && (p(y, 1), b = !0);
    const N = i.xr.getEnvironmentBlendMode();
    N === "additive" ? n.buffers.color.setClear(0, 0, 0, 1, o) : N === "alpha-blend" && n.buffers.color.setClear(0, 0, 0, 0, o), (i.autoClear || b) && (n.buffers.depth.setTest(!0), n.buffers.depth.setMask(!0), n.buffers.color.setMask(!0), i.clear(i.autoClearColor, i.autoClearDepth, i.autoClearStencil));
  }
  function m(E, b) {
    const y = g(b);
    y && (y.isCubeTexture || y.mapping === Js) ? (u === void 0 && (u = new ye(
      new Qe(1, 1, 1),
      new Ln({
        name: "BackgroundCubeMaterial",
        uniforms: Ci(je.backgroundCube.uniforms),
        vertexShader: je.backgroundCube.vertexShader,
        fragmentShader: je.backgroundCube.fragmentShader,
        side: Ce,
        depthTest: !1,
        depthWrite: !1,
        fog: !1
      })
    ), u.geometry.deleteAttribute("normal"), u.geometry.deleteAttribute("uv"), u.onBeforeRender = function(N, R, T) {
      this.matrixWorld.copyPosition(T.matrixWorld);
    }, Object.defineProperty(u.material, "envMap", {
      get: function() {
        return this.uniforms.envMap.value;
      }
    }), s.update(u)), Bn.copy(b.backgroundRotation), Bn.x *= -1, Bn.y *= -1, Bn.z *= -1, y.isCubeTexture && y.isRenderTargetTexture === !1 && (Bn.y *= -1, Bn.z *= -1), u.material.uniforms.envMap.value = y, u.material.uniforms.flipEnvMap.value = y.isCubeTexture && y.isRenderTargetTexture === !1 ? -1 : 1, u.material.uniforms.backgroundBlurriness.value = b.backgroundBlurriness, u.material.uniforms.backgroundIntensity.value = b.backgroundIntensity, u.material.uniforms.backgroundRotation.value.setFromMatrix4(cp.makeRotationFromEuler(Bn)), u.material.toneMapped = Xt.getTransfer(y.colorSpace) !== Jt, (c !== y || f !== y.version || d !== i.toneMapping) && (u.material.needsUpdate = !0, c = y, f = y.version, d = i.toneMapping), u.layers.enableAll(), E.unshift(u, u.geometry, u.material, 0, 0, null)) : y && y.isTexture && (h === void 0 && (h = new ye(
      new hs(2, 2),
      new Ln({
        name: "BackgroundMaterial",
        uniforms: Ci(je.background.uniforms),
        vertexShader: je.background.vertexShader,
        fragmentShader: je.background.fragmentShader,
        side: Pn,
        depthTest: !1,
        depthWrite: !1,
        fog: !1
      })
    ), h.geometry.deleteAttribute("normal"), Object.defineProperty(h.material, "map", {
      get: function() {
        return this.uniforms.t2D.value;
      }
    }), s.update(h)), h.material.uniforms.t2D.value = y, h.material.uniforms.backgroundIntensity.value = b.backgroundIntensity, h.material.toneMapped = Xt.getTransfer(y.colorSpace) !== Jt, y.matrixAutoUpdate === !0 && y.updateMatrix(), h.material.uniforms.uvTransform.value.copy(y.matrix), (c !== y || f !== y.version || d !== i.toneMapping) && (h.material.needsUpdate = !0, c = y, f = y.version, d = i.toneMapping), h.layers.enableAll(), E.unshift(h, h.geometry, h.material, 0, 0, null));
  }
  function p(E, b) {
    E.getRGB(Ls, hc(i)), n.buffers.color.setClear(Ls.r, Ls.g, Ls.b, b, o);
  }
  return {
    getClearColor: function() {
      return a;
    },
    setClearColor: function(E, b = 1) {
      a.set(E), l = b, p(a, l);
    },
    getClearAlpha: function() {
      return l;
    },
    setClearAlpha: function(E) {
      l = E, p(a, l);
    },
    render: x,
    addToRenderList: m
  };
}
function up(i, t) {
  const e = i.getParameter(i.MAX_VERTEX_ATTRIBS), n = {}, s = f(null);
  let r = s, o = !1;
  function a(_, A, F, O, G) {
    let $ = !1;
    const V = c(O, F, A);
    r !== V && (r = V, h(r.object)), $ = d(_, O, F, G), $ && g(_, O, F, G), G !== null && t.update(G, i.ELEMENT_ARRAY_BUFFER), ($ || o) && (o = !1, y(_, A, F, O), G !== null && i.bindBuffer(i.ELEMENT_ARRAY_BUFFER, t.get(G).buffer));
  }
  function l() {
    return i.createVertexArray();
  }
  function h(_) {
    return i.bindVertexArray(_);
  }
  function u(_) {
    return i.deleteVertexArray(_);
  }
  function c(_, A, F) {
    const O = F.wireframe === !0;
    let G = n[_.id];
    G === void 0 && (G = {}, n[_.id] = G);
    let $ = G[A.id];
    $ === void 0 && ($ = {}, G[A.id] = $);
    let V = $[O];
    return V === void 0 && (V = f(l()), $[O] = V), V;
  }
  function f(_) {
    const A = [], F = [], O = [];
    for (let G = 0; G < e; G++)
      A[G] = 0, F[G] = 0, O[G] = 0;
    return {
      // for backward compatibility on non-VAO support browser
      geometry: null,
      program: null,
      wireframe: !1,
      newAttributes: A,
      enabledAttributes: F,
      attributeDivisors: O,
      object: _,
      attributes: {},
      index: null
    };
  }
  function d(_, A, F, O) {
    const G = r.attributes, $ = A.attributes;
    let V = 0;
    const K = F.getAttributes();
    for (const H in K)
      if (K[H].location >= 0) {
        const ut = G[H];
        let yt = $[H];
        if (yt === void 0 && (H === "instanceMatrix" && _.instanceMatrix && (yt = _.instanceMatrix), H === "instanceColor" && _.instanceColor && (yt = _.instanceColor)), ut === void 0 || ut.attribute !== yt || yt && ut.data !== yt.data) return !0;
        V++;
      }
    return r.attributesNum !== V || r.index !== O;
  }
  function g(_, A, F, O) {
    const G = {}, $ = A.attributes;
    let V = 0;
    const K = F.getAttributes();
    for (const H in K)
      if (K[H].location >= 0) {
        let ut = $[H];
        ut === void 0 && (H === "instanceMatrix" && _.instanceMatrix && (ut = _.instanceMatrix), H === "instanceColor" && _.instanceColor && (ut = _.instanceColor));
        const yt = {};
        yt.attribute = ut, ut && ut.data && (yt.data = ut.data), G[H] = yt, V++;
      }
    r.attributes = G, r.attributesNum = V, r.index = O;
  }
  function x() {
    const _ = r.newAttributes;
    for (let A = 0, F = _.length; A < F; A++)
      _[A] = 0;
  }
  function m(_) {
    p(_, 0);
  }
  function p(_, A) {
    const F = r.newAttributes, O = r.enabledAttributes, G = r.attributeDivisors;
    F[_] = 1, O[_] === 0 && (i.enableVertexAttribArray(_), O[_] = 1), G[_] !== A && (i.vertexAttribDivisor(_, A), G[_] = A);
  }
  function E() {
    const _ = r.newAttributes, A = r.enabledAttributes;
    for (let F = 0, O = A.length; F < O; F++)
      A[F] !== _[F] && (i.disableVertexAttribArray(F), A[F] = 0);
  }
  function b(_, A, F, O, G, $, V) {
    V === !0 ? i.vertexAttribIPointer(_, A, F, G, $) : i.vertexAttribPointer(_, A, F, O, G, $);
  }
  function y(_, A, F, O) {
    x();
    const G = O.attributes, $ = F.getAttributes(), V = A.defaultAttributeValues;
    for (const K in $) {
      const H = $[K];
      if (H.location >= 0) {
        let st = G[K];
        if (st === void 0 && (K === "instanceMatrix" && _.instanceMatrix && (st = _.instanceMatrix), K === "instanceColor" && _.instanceColor && (st = _.instanceColor)), st !== void 0) {
          const ut = st.normalized, yt = st.itemSize, Bt = t.get(st);
          if (Bt === void 0) continue;
          const jt = Bt.buffer, q = Bt.type, nt = Bt.bytesPerElement, vt = q === i.INT || q === i.UNSIGNED_INT || st.gpuType === No;
          if (st.isInterleavedBufferAttribute) {
            const ot = st.data, Tt = ot.stride, Lt = st.offset;
            if (ot.isInstancedInterleavedBuffer) {
              for (let zt = 0; zt < H.locationSize; zt++)
                p(H.location + zt, ot.meshPerAttribute);
              _.isInstancedMesh !== !0 && O._maxInstanceCount === void 0 && (O._maxInstanceCount = ot.meshPerAttribute * ot.count);
            } else
              for (let zt = 0; zt < H.locationSize; zt++)
                m(H.location + zt);
            i.bindBuffer(i.ARRAY_BUFFER, jt);
            for (let zt = 0; zt < H.locationSize; zt++)
              b(
                H.location + zt,
                yt / H.locationSize,
                q,
                ut,
                Tt * nt,
                (Lt + yt / H.locationSize * zt) * nt,
                vt
              );
          } else {
            if (st.isInstancedBufferAttribute) {
              for (let ot = 0; ot < H.locationSize; ot++)
                p(H.location + ot, st.meshPerAttribute);
              _.isInstancedMesh !== !0 && O._maxInstanceCount === void 0 && (O._maxInstanceCount = st.meshPerAttribute * st.count);
            } else
              for (let ot = 0; ot < H.locationSize; ot++)
                m(H.location + ot);
            i.bindBuffer(i.ARRAY_BUFFER, jt);
            for (let ot = 0; ot < H.locationSize; ot++)
              b(
                H.location + ot,
                yt / H.locationSize,
                q,
                ut,
                yt * nt,
                yt / H.locationSize * ot * nt,
                vt
              );
          }
        } else if (V !== void 0) {
          const ut = V[K];
          if (ut !== void 0)
            switch (ut.length) {
              case 2:
                i.vertexAttrib2fv(H.location, ut);
                break;
              case 3:
                i.vertexAttrib3fv(H.location, ut);
                break;
              case 4:
                i.vertexAttrib4fv(H.location, ut);
                break;
              default:
                i.vertexAttrib1fv(H.location, ut);
            }
        }
      }
    }
    E();
  }
  function N() {
    C();
    for (const _ in n) {
      const A = n[_];
      for (const F in A) {
        const O = A[F];
        for (const G in O)
          u(O[G].object), delete O[G];
        delete A[F];
      }
      delete n[_];
    }
  }
  function R(_) {
    if (n[_.id] === void 0) return;
    const A = n[_.id];
    for (const F in A) {
      const O = A[F];
      for (const G in O)
        u(O[G].object), delete O[G];
      delete A[F];
    }
    delete n[_.id];
  }
  function T(_) {
    for (const A in n) {
      const F = n[A];
      if (F[_.id] === void 0) continue;
      const O = F[_.id];
      for (const G in O)
        u(O[G].object), delete O[G];
      delete F[_.id];
    }
  }
  function C() {
    M(), o = !0, r !== s && (r = s, h(r.object));
  }
  function M() {
    s.geometry = null, s.program = null, s.wireframe = !1;
  }
  return {
    setup: a,
    reset: C,
    resetDefaultState: M,
    dispose: N,
    releaseStatesOfGeometry: R,
    releaseStatesOfProgram: T,
    initAttributes: x,
    enableAttribute: m,
    disableUnusedAttributes: E
  };
}
function dp(i, t, e) {
  let n;
  function s(h) {
    n = h;
  }
  function r(h, u) {
    i.drawArrays(n, h, u), e.update(u, n, 1);
  }
  function o(h, u, c) {
    c !== 0 && (i.drawArraysInstanced(n, h, u, c), e.update(u, n, c));
  }
  function a(h, u, c) {
    if (c === 0) return;
    t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n, h, 0, u, 0, c);
    let d = 0;
    for (let g = 0; g < c; g++)
      d += u[g];
    e.update(d, n, 1);
  }
  function l(h, u, c, f) {
    if (c === 0) return;
    const d = t.get("WEBGL_multi_draw");
    if (d === null)
      for (let g = 0; g < h.length; g++)
        o(h[g], u[g], f[g]);
    else {
      d.multiDrawArraysInstancedWEBGL(n, h, 0, u, 0, f, 0, c);
      let g = 0;
      for (let x = 0; x < c; x++)
        g += u[x] * f[x];
      e.update(g, n, 1);
    }
  }
  this.setMode = s, this.render = r, this.renderInstances = o, this.renderMultiDraw = a, this.renderMultiDrawInstances = l;
}
function fp(i, t, e, n) {
  let s;
  function r() {
    if (s !== void 0) return s;
    if (t.has("EXT_texture_filter_anisotropic") === !0) {
      const T = t.get("EXT_texture_filter_anisotropic");
      s = i.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    } else
      s = 0;
    return s;
  }
  function o(T) {
    return !(T !== Xe && n.convert(T) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT));
  }
  function a(T) {
    const C = T === os && (t.has("EXT_color_buffer_half_float") || t.has("EXT_color_buffer_float"));
    return !(T !== mn && n.convert(T) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE) && // Edge and Chrome Mac < 52 (#9513)
    T !== un && !C);
  }
  function l(T) {
    if (T === "highp") {
      if (i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.HIGH_FLOAT).precision > 0 && i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.HIGH_FLOAT).precision > 0)
        return "highp";
      T = "mediump";
    }
    return T === "mediump" && i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.MEDIUM_FLOAT).precision > 0 && i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.MEDIUM_FLOAT).precision > 0 ? "mediump" : "lowp";
  }
  let h = e.precision !== void 0 ? e.precision : "highp";
  const u = l(h);
  u !== h && (console.warn("THREE.WebGLRenderer:", h, "not supported, using", u, "instead."), h = u);
  const c = e.logarithmicDepthBuffer === !0, f = e.reverseDepthBuffer === !0 && t.has("EXT_clip_control"), d = i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS), g = i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS), x = i.getParameter(i.MAX_TEXTURE_SIZE), m = i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE), p = i.getParameter(i.MAX_VERTEX_ATTRIBS), E = i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS), b = i.getParameter(i.MAX_VARYING_VECTORS), y = i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS), N = g > 0, R = i.getParameter(i.MAX_SAMPLES);
  return {
    isWebGL2: !0,
    // keeping this for backwards compatibility
    getMaxAnisotropy: r,
    getMaxPrecision: l,
    textureFormatReadable: o,
    textureTypeReadable: a,
    precision: h,
    logarithmicDepthBuffer: c,
    reverseDepthBuffer: f,
    maxTextures: d,
    maxVertexTextures: g,
    maxTextureSize: x,
    maxCubemapSize: m,
    maxAttributes: p,
    maxVertexUniforms: E,
    maxVaryings: b,
    maxFragmentUniforms: y,
    vertexTextures: N,
    maxSamples: R
  };
}
function pp(i) {
  const t = this;
  let e = null, n = 0, s = !1, r = !1;
  const o = new Hn(), a = new It(), l = { value: null, needsUpdate: !1 };
  this.uniform = l, this.numPlanes = 0, this.numIntersection = 0, this.init = function(c, f) {
    const d = c.length !== 0 || f || // enable state of previous frame - the clipping code has to
    // run another frame in order to reset the state:
    n !== 0 || s;
    return s = f, n = c.length, d;
  }, this.beginShadows = function() {
    r = !0, u(null);
  }, this.endShadows = function() {
    r = !1;
  }, this.setGlobalState = function(c, f) {
    e = u(c, f, 0);
  }, this.setState = function(c, f, d) {
    const g = c.clippingPlanes, x = c.clipIntersection, m = c.clipShadows, p = i.get(c);
    if (!s || g === null || g.length === 0 || r && !m)
      r ? u(null) : h();
    else {
      const E = r ? 0 : n, b = E * 4;
      let y = p.clippingState || null;
      l.value = y, y = u(g, f, b, d);
      for (let N = 0; N !== b; ++N)
        y[N] = e[N];
      p.clippingState = y, this.numIntersection = x ? this.numPlanes : 0, this.numPlanes += E;
    }
  };
  function h() {
    l.value !== e && (l.value = e, l.needsUpdate = n > 0), t.numPlanes = n, t.numIntersection = 0;
  }
  function u(c, f, d, g) {
    const x = c !== null ? c.length : 0;
    let m = null;
    if (x !== 0) {
      if (m = l.value, g !== !0 || m === null) {
        const p = d + x * 4, E = f.matrixWorldInverse;
        a.getNormalMatrix(E), (m === null || m.length < p) && (m = new Float32Array(p));
        for (let b = 0, y = d; b !== x; ++b, y += 4)
          o.copy(c[b]).applyMatrix4(E, a), o.normal.toArray(m, y), m[y + 3] = o.constant;
      }
      l.value = m, l.needsUpdate = !0;
    }
    return t.numPlanes = x, t.numIntersection = 0, m;
  }
}
function mp(i) {
  let t = /* @__PURE__ */ new WeakMap();
  function e(o, a) {
    return a === Zr ? o.mapping = wi : a === jr && (o.mapping = Ti), o;
  }
  function n(o) {
    if (o && o.isTexture) {
      const a = o.mapping;
      if (a === Zr || a === jr)
        if (t.has(o)) {
          const l = t.get(o).texture;
          return e(l, o.mapping);
        } else {
          const l = o.image;
          if (l && l.height > 0) {
            const h = new wu(l.height);
            return h.fromEquirectangularTexture(i, o), t.set(o, h), o.addEventListener("dispose", s), e(h.texture, o.mapping);
          } else
            return null;
        }
    }
    return o;
  }
  function s(o) {
    const a = o.target;
    a.removeEventListener("dispose", s);
    const l = t.get(a);
    l !== void 0 && (t.delete(a), l.dispose());
  }
  function r() {
    t = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: n,
    dispose: r
  };
}
class pc extends uc {
  constructor(t = -1, e = 1, n = 1, s = -1, r = 0.1, o = 2e3) {
    super(), this.isOrthographicCamera = !0, this.type = "OrthographicCamera", this.zoom = 1, this.view = null, this.left = t, this.right = e, this.top = n, this.bottom = s, this.near = r, this.far = o, this.updateProjectionMatrix();
  }
  copy(t, e) {
    return super.copy(t, e), this.left = t.left, this.right = t.right, this.top = t.top, this.bottom = t.bottom, this.near = t.near, this.far = t.far, this.zoom = t.zoom, this.view = t.view === null ? null : Object.assign({}, t.view), this;
  }
  setViewOffset(t, e, n, s, r, o) {
    this.view === null && (this.view = {
      enabled: !0,
      fullWidth: 1,
      fullHeight: 1,
      offsetX: 0,
      offsetY: 0,
      width: 1,
      height: 1
    }), this.view.enabled = !0, this.view.fullWidth = t, this.view.fullHeight = e, this.view.offsetX = n, this.view.offsetY = s, this.view.width = r, this.view.height = o, this.updateProjectionMatrix();
  }
  clearViewOffset() {
    this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix();
  }
  updateProjectionMatrix() {
    const t = (this.right - this.left) / (2 * this.zoom), e = (this.top - this.bottom) / (2 * this.zoom), n = (this.right + this.left) / 2, s = (this.top + this.bottom) / 2;
    let r = n - t, o = n + t, a = s + e, l = s - e;
    if (this.view !== null && this.view.enabled) {
      const h = (this.right - this.left) / this.view.fullWidth / this.zoom, u = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
      r += h * this.view.offsetX, o = r + h * this.view.width, a -= u * this.view.offsetY, l = a - u * this.view.height;
    }
    this.projectionMatrix.makeOrthographic(r, o, a, l, this.near, this.far, this.coordinateSystem), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return e.object.zoom = this.zoom, e.object.left = this.left, e.object.right = this.right, e.object.top = this.top, e.object.bottom = this.bottom, e.object.near = this.near, e.object.far = this.far, this.view !== null && (e.object.view = Object.assign({}, this.view)), e;
  }
}
const gi = 4, Ga = [0.125, 0.215, 0.35, 0.446, 0.526, 0.582], Wn = 20, wr = /* @__PURE__ */ new pc(), Wa = /* @__PURE__ */ new Pt();
let Tr = null, Ar = 0, Rr = 0, Cr = !1;
const Vn = (1 + Math.sqrt(5)) / 2, di = 1 / Vn, $a = [
  /* @__PURE__ */ new L(-Vn, di, 0),
  /* @__PURE__ */ new L(Vn, di, 0),
  /* @__PURE__ */ new L(-di, 0, Vn),
  /* @__PURE__ */ new L(di, 0, Vn),
  /* @__PURE__ */ new L(0, Vn, -di),
  /* @__PURE__ */ new L(0, Vn, di),
  /* @__PURE__ */ new L(-1, 1, -1),
  /* @__PURE__ */ new L(1, 1, -1),
  /* @__PURE__ */ new L(-1, 1, 1),
  /* @__PURE__ */ new L(1, 1, 1)
];
class Xa {
  constructor(t) {
    this._renderer = t, this._pingPongRenderTarget = null, this._lodMax = 0, this._cubeSize = 0, this._lodPlanes = [], this._sizeLods = [], this._sigmas = [], this._blurMaterial = null, this._cubemapMaterial = null, this._equirectMaterial = null, this._compileMaterial(this._blurMaterial);
  }
  /**
   * Generates a PMREM from a supplied Scene, which can be faster than using an
   * image if networking bandwidth is low. Optional sigma specifies a blur radius
   * in radians to be applied to the scene before PMREM generation. Optional near
   * and far planes ensure the scene is rendered in its entirety (the cubeCamera
   * is placed at the origin).
   */
  fromScene(t, e = 0, n = 0.1, s = 100) {
    Tr = this._renderer.getRenderTarget(), Ar = this._renderer.getActiveCubeFace(), Rr = this._renderer.getActiveMipmapLevel(), Cr = this._renderer.xr.enabled, this._renderer.xr.enabled = !1, this._setSize(256);
    const r = this._allocateTargets();
    return r.depthBuffer = !0, this._sceneToCubeUV(t, n, s, r), e > 0 && this._blur(r, 0, 0, e), this._applyPMREM(r), this._cleanup(r), r;
  }
  /**
   * Generates a PMREM from an equirectangular texture, which can be either LDR
   * or HDR. The ideal input image size is 1k (1024 x 512),
   * as this matches best with the 256 x 256 cubemap output.
   * The smallest supported equirectangular image size is 64 x 32.
   */
  fromEquirectangular(t, e = null) {
    return this._fromTexture(t, e);
  }
  /**
   * Generates a PMREM from an cubemap texture, which can be either LDR
   * or HDR. The ideal input cube size is 256 x 256,
   * as this matches best with the 256 x 256 cubemap output.
   * The smallest supported cube size is 16 x 16.
   */
  fromCubemap(t, e = null) {
    return this._fromTexture(t, e);
  }
  /**
   * Pre-compiles the cubemap shader. You can get faster start-up by invoking this method during
   * your texture's network fetch for increased concurrency.
   */
  compileCubemapShader() {
    this._cubemapMaterial === null && (this._cubemapMaterial = Za(), this._compileMaterial(this._cubemapMaterial));
  }
  /**
   * Pre-compiles the equirectangular shader. You can get faster start-up by invoking this method during
   * your texture's network fetch for increased concurrency.
   */
  compileEquirectangularShader() {
    this._equirectMaterial === null && (this._equirectMaterial = Ya(), this._compileMaterial(this._equirectMaterial));
  }
  /**
   * Disposes of the PMREMGenerator's internal memory. Note that PMREMGenerator is a static class,
   * so you should not need more than one PMREMGenerator object. If you do, calling dispose() on
   * one of them will cause any others to also become unusable.
   */
  dispose() {
    this._dispose(), this._cubemapMaterial !== null && this._cubemapMaterial.dispose(), this._equirectMaterial !== null && this._equirectMaterial.dispose();
  }
  // private interface
  _setSize(t) {
    this._lodMax = Math.floor(Math.log2(t)), this._cubeSize = Math.pow(2, this._lodMax);
  }
  _dispose() {
    this._blurMaterial !== null && this._blurMaterial.dispose(), this._pingPongRenderTarget !== null && this._pingPongRenderTarget.dispose();
    for (let t = 0; t < this._lodPlanes.length; t++)
      this._lodPlanes[t].dispose();
  }
  _cleanup(t) {
    this._renderer.setRenderTarget(Tr, Ar, Rr), this._renderer.xr.enabled = Cr, t.scissorTest = !1, Ds(t, 0, 0, t.width, t.height);
  }
  _fromTexture(t, e) {
    t.mapping === wi || t.mapping === Ti ? this._setSize(t.image.length === 0 ? 16 : t.image[0].width || t.image[0].image.width) : this._setSize(t.image.width / 4), Tr = this._renderer.getRenderTarget(), Ar = this._renderer.getActiveCubeFace(), Rr = this._renderer.getActiveMipmapLevel(), Cr = this._renderer.xr.enabled, this._renderer.xr.enabled = !1;
    const n = e || this._allocateTargets();
    return this._textureToCubeUV(t, n), this._applyPMREM(n), this._cleanup(n), n;
  }
  _allocateTargets() {
    const t = 3 * Math.max(this._cubeSize, 112), e = 4 * this._cubeSize, n = {
      magFilter: Ke,
      minFilter: Ke,
      generateMipmaps: !1,
      type: os,
      format: Xe,
      colorSpace: Pi,
      depthBuffer: !1
    }, s = qa(t, e, n);
    if (this._pingPongRenderTarget === null || this._pingPongRenderTarget.width !== t || this._pingPongRenderTarget.height !== e) {
      this._pingPongRenderTarget !== null && this._dispose(), this._pingPongRenderTarget = qa(t, e, n);
      const { _lodMax: r } = this;
      ({ sizeLods: this._sizeLods, lodPlanes: this._lodPlanes, sigmas: this._sigmas } = gp(r)), this._blurMaterial = _p(r, t, e);
    }
    return s;
  }
  _compileMaterial(t) {
    const e = new ye(this._lodPlanes[0], t);
    this._renderer.compile(e, wr);
  }
  _sceneToCubeUV(t, e, n, s) {
    const a = new Ie(90, 1, e, n), l = [1, -1, 1, 1, 1, 1], h = [1, 1, 1, -1, -1, -1], u = this._renderer, c = u.autoClear, f = u.toneMapping;
    u.getClearColor(Wa), u.toneMapping = Rn, u.autoClear = !1;
    const d = new cs({
      name: "PMREM.Background",
      side: Ce,
      depthWrite: !1,
      depthTest: !1
    }), g = new ye(new Qe(), d);
    let x = !1;
    const m = t.background;
    m ? m.isColor && (d.color.copy(m), t.background = null, x = !0) : (d.color.copy(Wa), x = !0);
    for (let p = 0; p < 6; p++) {
      const E = p % 3;
      E === 0 ? (a.up.set(0, l[p], 0), a.lookAt(h[p], 0, 0)) : E === 1 ? (a.up.set(0, 0, l[p]), a.lookAt(0, h[p], 0)) : (a.up.set(0, l[p], 0), a.lookAt(0, 0, h[p]));
      const b = this._cubeSize;
      Ds(s, E * b, p > 2 ? b : 0, b, b), u.setRenderTarget(s), x && u.render(g, a), u.render(t, a);
    }
    g.geometry.dispose(), g.material.dispose(), u.toneMapping = f, u.autoClear = c, t.background = m;
  }
  _textureToCubeUV(t, e) {
    const n = this._renderer, s = t.mapping === wi || t.mapping === Ti;
    s ? (this._cubemapMaterial === null && (this._cubemapMaterial = Za()), this._cubemapMaterial.uniforms.flipEnvMap.value = t.isRenderTargetTexture === !1 ? -1 : 1) : this._equirectMaterial === null && (this._equirectMaterial = Ya());
    const r = s ? this._cubemapMaterial : this._equirectMaterial, o = new ye(this._lodPlanes[0], r), a = r.uniforms;
    a.envMap.value = t;
    const l = this._cubeSize;
    Ds(e, 0, 0, 3 * l, 2 * l), n.setRenderTarget(e), n.render(o, wr);
  }
  _applyPMREM(t) {
    const e = this._renderer, n = e.autoClear;
    e.autoClear = !1;
    const s = this._lodPlanes.length;
    for (let r = 1; r < s; r++) {
      const o = Math.sqrt(this._sigmas[r] * this._sigmas[r] - this._sigmas[r - 1] * this._sigmas[r - 1]), a = $a[(s - r - 1) % $a.length];
      this._blur(t, r - 1, r, o, a);
    }
    e.autoClear = n;
  }
  /**
   * This is a two-pass Gaussian blur for a cubemap. Normally this is done
   * vertically and horizontally, but this breaks down on a cube. Here we apply
   * the blur latitudinally (around the poles), and then longitudinally (towards
   * the poles) to approximate the orthogonally-separable blur. It is least
   * accurate at the poles, but still does a decent job.
   */
  _blur(t, e, n, s, r) {
    const o = this._pingPongRenderTarget;
    this._halfBlur(
      t,
      o,
      e,
      n,
      s,
      "latitudinal",
      r
    ), this._halfBlur(
      o,
      t,
      n,
      n,
      s,
      "longitudinal",
      r
    );
  }
  _halfBlur(t, e, n, s, r, o, a) {
    const l = this._renderer, h = this._blurMaterial;
    o !== "latitudinal" && o !== "longitudinal" && console.error(
      "blur direction must be either latitudinal or longitudinal!"
    );
    const u = 3, c = new ye(this._lodPlanes[s], h), f = h.uniforms, d = this._sizeLods[n] - 1, g = isFinite(r) ? Math.PI / (2 * d) : 2 * Math.PI / (2 * Wn - 1), x = r / g, m = isFinite(r) ? 1 + Math.floor(u * x) : Wn;
    m > Wn && console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Wn}`);
    const p = [];
    let E = 0;
    for (let T = 0; T < Wn; ++T) {
      const C = T / x, M = Math.exp(-C * C / 2);
      p.push(M), T === 0 ? E += M : T < m && (E += 2 * M);
    }
    for (let T = 0; T < p.length; T++)
      p[T] = p[T] / E;
    f.envMap.value = t.texture, f.samples.value = m, f.weights.value = p, f.latitudinal.value = o === "latitudinal", a && (f.poleAxis.value = a);
    const { _lodMax: b } = this;
    f.dTheta.value = g, f.mipInt.value = b - n;
    const y = this._sizeLods[s], N = 3 * y * (s > b - gi ? s - b + gi : 0), R = 4 * (this._cubeSize - y);
    Ds(e, N, R, 3 * y, 2 * y), l.setRenderTarget(e), l.render(c, wr);
  }
}
function gp(i) {
  const t = [], e = [], n = [];
  let s = i;
  const r = i - gi + 1 + Ga.length;
  for (let o = 0; o < r; o++) {
    const a = Math.pow(2, s);
    e.push(a);
    let l = 1 / a;
    o > i - gi ? l = Ga[o - i + gi - 1] : o === 0 && (l = 0), n.push(l);
    const h = 1 / (a - 2), u = -h, c = 1 + h, f = [u, u, c, u, c, c, u, u, c, c, u, c], d = 6, g = 6, x = 3, m = 2, p = 1, E = new Float32Array(x * g * d), b = new Float32Array(m * g * d), y = new Float32Array(p * g * d);
    for (let R = 0; R < d; R++) {
      const T = R % 3 * 2 / 3 - 1, C = R > 2 ? 0 : -1, M = [
        T,
        C,
        0,
        T + 2 / 3,
        C,
        0,
        T + 2 / 3,
        C + 1,
        0,
        T,
        C,
        0,
        T + 2 / 3,
        C + 1,
        0,
        T,
        C + 1,
        0
      ];
      E.set(M, x * g * R), b.set(f, m * g * R);
      const _ = [R, R, R, R, R, R];
      y.set(_, p * g * R);
    }
    const N = new ze();
    N.setAttribute("position", new Ye(E, x)), N.setAttribute("uv", new Ye(b, m)), N.setAttribute("faceIndex", new Ye(y, p)), t.push(N), s > gi && s--;
  }
  return { lodPlanes: t, sizeLods: e, sigmas: n };
}
function qa(i, t, e) {
  const n = new Kn(i, t, e);
  return n.texture.mapping = Js, n.texture.name = "PMREM.cubeUv", n.scissorTest = !0, n;
}
function Ds(i, t, e, n, s) {
  i.viewport.set(t, e, n, s), i.scissor.set(t, e, n, s);
}
function _p(i, t, e) {
  const n = new Float32Array(Wn), s = new L(0, 1, 0);
  return new Ln({
    name: "SphericalGaussianBlur",
    defines: {
      n: Wn,
      CUBEUV_TEXEL_WIDTH: 1 / t,
      CUBEUV_TEXEL_HEIGHT: 1 / e,
      CUBEUV_MAX_MIP: `${i}.0`
    },
    uniforms: {
      envMap: { value: null },
      samples: { value: 1 },
      weights: { value: n },
      latitudinal: { value: !1 },
      dTheta: { value: 0 },
      mipInt: { value: 0 },
      poleAxis: { value: s }
    },
    vertexShader: $o(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`
    ),
    blending: An,
    depthTest: !1,
    depthWrite: !1
  });
}
function Ya() {
  return new Ln({
    name: "EquirectangularToCubeUV",
    uniforms: {
      envMap: { value: null }
    },
    vertexShader: $o(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`
    ),
    blending: An,
    depthTest: !1,
    depthWrite: !1
  });
}
function Za() {
  return new Ln({
    name: "CubemapToCubeUV",
    uniforms: {
      envMap: { value: null },
      flipEnvMap: { value: -1 }
    },
    vertexShader: $o(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`
    ),
    blending: An,
    depthTest: !1,
    depthWrite: !1
  });
}
function $o() {
  return (
    /* glsl */
    `

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`
  );
}
function xp(i) {
  let t = /* @__PURE__ */ new WeakMap(), e = null;
  function n(a) {
    if (a && a.isTexture) {
      const l = a.mapping, h = l === Zr || l === jr, u = l === wi || l === Ti;
      if (h || u) {
        let c = t.get(a);
        const f = c !== void 0 ? c.texture.pmremVersion : 0;
        if (a.isRenderTargetTexture && a.pmremVersion !== f)
          return e === null && (e = new Xa(i)), c = h ? e.fromEquirectangular(a, c) : e.fromCubemap(a, c), c.texture.pmremVersion = a.pmremVersion, t.set(a, c), c.texture;
        if (c !== void 0)
          return c.texture;
        {
          const d = a.image;
          return h && d && d.height > 0 || u && d && s(d) ? (e === null && (e = new Xa(i)), c = h ? e.fromEquirectangular(a) : e.fromCubemap(a), c.texture.pmremVersion = a.pmremVersion, t.set(a, c), a.addEventListener("dispose", r), c.texture) : null;
        }
      }
    }
    return a;
  }
  function s(a) {
    let l = 0;
    const h = 6;
    for (let u = 0; u < h; u++)
      a[u] !== void 0 && l++;
    return l === h;
  }
  function r(a) {
    const l = a.target;
    l.removeEventListener("dispose", r);
    const h = t.get(l);
    h !== void 0 && (t.delete(l), h.dispose());
  }
  function o() {
    t = /* @__PURE__ */ new WeakMap(), e !== null && (e.dispose(), e = null);
  }
  return {
    get: n,
    dispose: o
  };
}
function vp(i) {
  const t = {};
  function e(n) {
    if (t[n] !== void 0)
      return t[n];
    let s;
    switch (n) {
      case "WEBGL_depth_texture":
        s = i.getExtension("WEBGL_depth_texture") || i.getExtension("MOZ_WEBGL_depth_texture") || i.getExtension("WEBKIT_WEBGL_depth_texture");
        break;
      case "EXT_texture_filter_anisotropic":
        s = i.getExtension("EXT_texture_filter_anisotropic") || i.getExtension("MOZ_EXT_texture_filter_anisotropic") || i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
        break;
      case "WEBGL_compressed_texture_s3tc":
        s = i.getExtension("WEBGL_compressed_texture_s3tc") || i.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
        break;
      case "WEBGL_compressed_texture_pvrtc":
        s = i.getExtension("WEBGL_compressed_texture_pvrtc") || i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
        break;
      default:
        s = i.getExtension(n);
    }
    return t[n] = s, s;
  }
  return {
    has: function(n) {
      return e(n) !== null;
    },
    init: function() {
      e("EXT_color_buffer_float"), e("WEBGL_clip_cull_distance"), e("OES_texture_float_linear"), e("EXT_color_buffer_half_float"), e("WEBGL_multisampled_render_to_texture"), e("WEBGL_render_shared_exponent");
    },
    get: function(n) {
      const s = e(n);
      return s === null && Zi("THREE.WebGLRenderer: " + n + " extension not supported."), s;
    }
  };
}
function Mp(i, t, e, n) {
  const s = {}, r = /* @__PURE__ */ new WeakMap();
  function o(c) {
    const f = c.target;
    f.index !== null && t.remove(f.index);
    for (const g in f.attributes)
      t.remove(f.attributes[g]);
    for (const g in f.morphAttributes) {
      const x = f.morphAttributes[g];
      for (let m = 0, p = x.length; m < p; m++)
        t.remove(x[m]);
    }
    f.removeEventListener("dispose", o), delete s[f.id];
    const d = r.get(f);
    d && (t.remove(d), r.delete(f)), n.releaseStatesOfGeometry(f), f.isInstancedBufferGeometry === !0 && delete f._maxInstanceCount, e.memory.geometries--;
  }
  function a(c, f) {
    return s[f.id] === !0 || (f.addEventListener("dispose", o), s[f.id] = !0, e.memory.geometries++), f;
  }
  function l(c) {
    const f = c.attributes;
    for (const g in f)
      t.update(f[g], i.ARRAY_BUFFER);
    const d = c.morphAttributes;
    for (const g in d) {
      const x = d[g];
      for (let m = 0, p = x.length; m < p; m++)
        t.update(x[m], i.ARRAY_BUFFER);
    }
  }
  function h(c) {
    const f = [], d = c.index, g = c.attributes.position;
    let x = 0;
    if (d !== null) {
      const E = d.array;
      x = d.version;
      for (let b = 0, y = E.length; b < y; b += 3) {
        const N = E[b + 0], R = E[b + 1], T = E[b + 2];
        f.push(N, R, R, T, T, N);
      }
    } else if (g !== void 0) {
      const E = g.array;
      x = g.version;
      for (let b = 0, y = E.length / 3 - 1; b < y; b += 3) {
        const N = b + 0, R = b + 1, T = b + 2;
        f.push(N, R, R, T, T, N);
      }
    } else
      return;
    const m = new (sc(f) ? cc : lc)(f, 1);
    m.version = x;
    const p = r.get(c);
    p && t.remove(p), r.set(c, m);
  }
  function u(c) {
    const f = r.get(c);
    if (f) {
      const d = c.index;
      d !== null && f.version < d.version && h(c);
    } else
      h(c);
    return r.get(c);
  }
  return {
    get: a,
    update: l,
    getWireframeAttribute: u
  };
}
function Sp(i, t, e) {
  let n;
  function s(f) {
    n = f;
  }
  let r, o;
  function a(f) {
    r = f.type, o = f.bytesPerElement;
  }
  function l(f, d) {
    i.drawElements(n, d, r, f * o), e.update(d, n, 1);
  }
  function h(f, d, g) {
    g !== 0 && (i.drawElementsInstanced(n, d, r, f * o, g), e.update(d, n, g));
  }
  function u(f, d, g) {
    if (g === 0) return;
    t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n, d, 0, r, f, 0, g);
    let m = 0;
    for (let p = 0; p < g; p++)
      m += d[p];
    e.update(m, n, 1);
  }
  function c(f, d, g, x) {
    if (g === 0) return;
    const m = t.get("WEBGL_multi_draw");
    if (m === null)
      for (let p = 0; p < f.length; p++)
        h(f[p] / o, d[p], x[p]);
    else {
      m.multiDrawElementsInstancedWEBGL(n, d, 0, r, f, 0, x, 0, g);
      let p = 0;
      for (let E = 0; E < g; E++)
        p += d[E] * x[E];
      e.update(p, n, 1);
    }
  }
  this.setMode = s, this.setIndex = a, this.render = l, this.renderInstances = h, this.renderMultiDraw = u, this.renderMultiDrawInstances = c;
}
function yp(i) {
  const t = {
    geometries: 0,
    textures: 0
  }, e = {
    frame: 0,
    calls: 0,
    triangles: 0,
    points: 0,
    lines: 0
  };
  function n(r, o, a) {
    switch (e.calls++, o) {
      case i.TRIANGLES:
        e.triangles += a * (r / 3);
        break;
      case i.LINES:
        e.lines += a * (r / 2);
        break;
      case i.LINE_STRIP:
        e.lines += a * (r - 1);
        break;
      case i.LINE_LOOP:
        e.lines += a * r;
        break;
      case i.POINTS:
        e.points += a * r;
        break;
      default:
        console.error("THREE.WebGLInfo: Unknown draw mode:", o);
        break;
    }
  }
  function s() {
    e.calls = 0, e.triangles = 0, e.points = 0, e.lines = 0;
  }
  return {
    memory: t,
    render: e,
    programs: null,
    autoReset: !0,
    reset: s,
    update: n
  };
}
function bp(i, t, e) {
  const n = /* @__PURE__ */ new WeakMap(), s = new Qt();
  function r(o, a, l) {
    const h = o.morphTargetInfluences, u = a.morphAttributes.position || a.morphAttributes.normal || a.morphAttributes.color, c = u !== void 0 ? u.length : 0;
    let f = n.get(a);
    if (f === void 0 || f.count !== c) {
      let M = function() {
        T.dispose(), n.delete(a), a.removeEventListener("dispose", M);
      };
      f !== void 0 && f.texture.dispose();
      const d = a.morphAttributes.position !== void 0, g = a.morphAttributes.normal !== void 0, x = a.morphAttributes.color !== void 0, m = a.morphAttributes.position || [], p = a.morphAttributes.normal || [], E = a.morphAttributes.color || [];
      let b = 0;
      d === !0 && (b = 1), g === !0 && (b = 2), x === !0 && (b = 3);
      let y = a.attributes.position.count * b, N = 1;
      y > t.maxTextureSize && (N = Math.ceil(y / t.maxTextureSize), y = t.maxTextureSize);
      const R = new Float32Array(y * N * 4 * c), T = new oc(R, y, N, c);
      T.type = un, T.needsUpdate = !0;
      const C = b * 4;
      for (let _ = 0; _ < c; _++) {
        const A = m[_], F = p[_], O = E[_], G = y * N * 4 * _;
        for (let $ = 0; $ < A.count; $++) {
          const V = $ * C;
          d === !0 && (s.fromBufferAttribute(A, $), R[G + V + 0] = s.x, R[G + V + 1] = s.y, R[G + V + 2] = s.z, R[G + V + 3] = 0), g === !0 && (s.fromBufferAttribute(F, $), R[G + V + 4] = s.x, R[G + V + 5] = s.y, R[G + V + 6] = s.z, R[G + V + 7] = 0), x === !0 && (s.fromBufferAttribute(O, $), R[G + V + 8] = s.x, R[G + V + 9] = s.y, R[G + V + 10] = s.z, R[G + V + 11] = O.itemSize === 4 ? s.w : 1);
        }
      }
      f = {
        count: c,
        texture: T,
        size: new kt(y, N)
      }, n.set(a, f), a.addEventListener("dispose", M);
    }
    if (o.isInstancedMesh === !0 && o.morphTexture !== null)
      l.getUniforms().setValue(i, "morphTexture", o.morphTexture, e);
    else {
      let d = 0;
      for (let x = 0; x < h.length; x++)
        d += h[x];
      const g = a.morphTargetsRelative ? 1 : 1 - d;
      l.getUniforms().setValue(i, "morphTargetBaseInfluence", g), l.getUniforms().setValue(i, "morphTargetInfluences", h);
    }
    l.getUniforms().setValue(i, "morphTargetsTexture", f.texture, e), l.getUniforms().setValue(i, "morphTargetsTextureSize", f.size);
  }
  return {
    update: r
  };
}
function Ep(i, t, e, n) {
  let s = /* @__PURE__ */ new WeakMap();
  function r(l) {
    const h = n.render.frame, u = l.geometry, c = t.get(l, u);
    if (s.get(c) !== h && (t.update(c), s.set(c, h)), l.isInstancedMesh && (l.hasEventListener("dispose", a) === !1 && l.addEventListener("dispose", a), s.get(l) !== h && (e.update(l.instanceMatrix, i.ARRAY_BUFFER), l.instanceColor !== null && e.update(l.instanceColor, i.ARRAY_BUFFER), s.set(l, h))), l.isSkinnedMesh) {
      const f = l.skeleton;
      s.get(f) !== h && (f.update(), s.set(f, h));
    }
    return c;
  }
  function o() {
    s = /* @__PURE__ */ new WeakMap();
  }
  function a(l) {
    const h = l.target;
    h.removeEventListener("dispose", a), e.remove(h.instanceMatrix), h.instanceColor !== null && e.remove(h.instanceColor);
  }
  return {
    update: r,
    dispose: o
  };
}
class mc extends Ae {
  constructor(t, e, n, s, r, o, a, l, h, u = vi) {
    if (u !== vi && u !== Ri)
      throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");
    n === void 0 && u === vi && (n = jn), n === void 0 && u === Ri && (n = Ai), super(null, s, r, o, a, l, u, n, h), this.isDepthTexture = !0, this.image = { width: t, height: e }, this.magFilter = a !== void 0 ? a : qe, this.minFilter = l !== void 0 ? l : qe, this.flipY = !1, this.generateMipmaps = !1, this.compareFunction = null;
  }
  copy(t) {
    return super.copy(t), this.compareFunction = t.compareFunction, this;
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return this.compareFunction !== null && (e.compareFunction = this.compareFunction), e;
  }
}
const gc = /* @__PURE__ */ new Ae(), ja = /* @__PURE__ */ new mc(1, 1), _c = /* @__PURE__ */ new oc(), xc = /* @__PURE__ */ new cu(), vc = /* @__PURE__ */ new dc(), Ka = [], Ja = [], Qa = new Float32Array(16), tl = new Float32Array(9), el = new Float32Array(4);
function Ii(i, t, e) {
  const n = i[0];
  if (n <= 0 || n > 0) return i;
  const s = t * e;
  let r = Ka[s];
  if (r === void 0 && (r = new Float32Array(s), Ka[s] = r), t !== 0) {
    n.toArray(r, 0);
    for (let o = 1, a = 0; o !== t; ++o)
      a += e, i[o].toArray(r, a);
  }
  return r;
}
function de(i, t) {
  if (i.length !== t.length) return !1;
  for (let e = 0, n = i.length; e < n; e++)
    if (i[e] !== t[e]) return !1;
  return !0;
}
function fe(i, t) {
  for (let e = 0, n = t.length; e < n; e++)
    i[e] = t[e];
}
function er(i, t) {
  let e = Ja[t];
  e === void 0 && (e = new Int32Array(t), Ja[t] = e);
  for (let n = 0; n !== t; ++n)
    e[n] = i.allocateTextureUnit();
  return e;
}
function wp(i, t) {
  const e = this.cache;
  e[0] !== t && (i.uniform1f(this.addr, t), e[0] = t);
}
function Tp(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y) && (i.uniform2f(this.addr, t.x, t.y), e[0] = t.x, e[1] = t.y);
  else {
    if (de(e, t)) return;
    i.uniform2fv(this.addr, t), fe(e, t);
  }
}
function Ap(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) && (i.uniform3f(this.addr, t.x, t.y, t.z), e[0] = t.x, e[1] = t.y, e[2] = t.z);
  else if (t.r !== void 0)
    (e[0] !== t.r || e[1] !== t.g || e[2] !== t.b) && (i.uniform3f(this.addr, t.r, t.g, t.b), e[0] = t.r, e[1] = t.g, e[2] = t.b);
  else {
    if (de(e, t)) return;
    i.uniform3fv(this.addr, t), fe(e, t);
  }
}
function Rp(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) && (i.uniform4f(this.addr, t.x, t.y, t.z, t.w), e[0] = t.x, e[1] = t.y, e[2] = t.z, e[3] = t.w);
  else {
    if (de(e, t)) return;
    i.uniform4fv(this.addr, t), fe(e, t);
  }
}
function Cp(i, t) {
  const e = this.cache, n = t.elements;
  if (n === void 0) {
    if (de(e, t)) return;
    i.uniformMatrix2fv(this.addr, !1, t), fe(e, t);
  } else {
    if (de(e, n)) return;
    el.set(n), i.uniformMatrix2fv(this.addr, !1, el), fe(e, n);
  }
}
function Pp(i, t) {
  const e = this.cache, n = t.elements;
  if (n === void 0) {
    if (de(e, t)) return;
    i.uniformMatrix3fv(this.addr, !1, t), fe(e, t);
  } else {
    if (de(e, n)) return;
    tl.set(n), i.uniformMatrix3fv(this.addr, !1, tl), fe(e, n);
  }
}
function Lp(i, t) {
  const e = this.cache, n = t.elements;
  if (n === void 0) {
    if (de(e, t)) return;
    i.uniformMatrix4fv(this.addr, !1, t), fe(e, t);
  } else {
    if (de(e, n)) return;
    Qa.set(n), i.uniformMatrix4fv(this.addr, !1, Qa), fe(e, n);
  }
}
function Dp(i, t) {
  const e = this.cache;
  e[0] !== t && (i.uniform1i(this.addr, t), e[0] = t);
}
function Up(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y) && (i.uniform2i(this.addr, t.x, t.y), e[0] = t.x, e[1] = t.y);
  else {
    if (de(e, t)) return;
    i.uniform2iv(this.addr, t), fe(e, t);
  }
}
function Ip(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) && (i.uniform3i(this.addr, t.x, t.y, t.z), e[0] = t.x, e[1] = t.y, e[2] = t.z);
  else {
    if (de(e, t)) return;
    i.uniform3iv(this.addr, t), fe(e, t);
  }
}
function Np(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) && (i.uniform4i(this.addr, t.x, t.y, t.z, t.w), e[0] = t.x, e[1] = t.y, e[2] = t.z, e[3] = t.w);
  else {
    if (de(e, t)) return;
    i.uniform4iv(this.addr, t), fe(e, t);
  }
}
function Fp(i, t) {
  const e = this.cache;
  e[0] !== t && (i.uniform1ui(this.addr, t), e[0] = t);
}
function Op(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y) && (i.uniform2ui(this.addr, t.x, t.y), e[0] = t.x, e[1] = t.y);
  else {
    if (de(e, t)) return;
    i.uniform2uiv(this.addr, t), fe(e, t);
  }
}
function Bp(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) && (i.uniform3ui(this.addr, t.x, t.y, t.z), e[0] = t.x, e[1] = t.y, e[2] = t.z);
  else {
    if (de(e, t)) return;
    i.uniform3uiv(this.addr, t), fe(e, t);
  }
}
function zp(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) && (i.uniform4ui(this.addr, t.x, t.y, t.z, t.w), e[0] = t.x, e[1] = t.y, e[2] = t.z, e[3] = t.w);
  else {
    if (de(e, t)) return;
    i.uniform4uiv(this.addr, t), fe(e, t);
  }
}
function kp(i, t, e) {
  const n = this.cache, s = e.allocateTextureUnit();
  n[0] !== s && (i.uniform1i(this.addr, s), n[0] = s);
  let r;
  this.type === i.SAMPLER_2D_SHADOW ? (ja.compareFunction = ic, r = ja) : r = gc, e.setTexture2D(t || r, s);
}
function Hp(i, t, e) {
  const n = this.cache, s = e.allocateTextureUnit();
  n[0] !== s && (i.uniform1i(this.addr, s), n[0] = s), e.setTexture3D(t || xc, s);
}
function Vp(i, t, e) {
  const n = this.cache, s = e.allocateTextureUnit();
  n[0] !== s && (i.uniform1i(this.addr, s), n[0] = s), e.setTextureCube(t || vc, s);
}
function Gp(i, t, e) {
  const n = this.cache, s = e.allocateTextureUnit();
  n[0] !== s && (i.uniform1i(this.addr, s), n[0] = s), e.setTexture2DArray(t || _c, s);
}
function Wp(i) {
  switch (i) {
    case 5126:
      return wp;
    // FLOAT
    case 35664:
      return Tp;
    // _VEC2
    case 35665:
      return Ap;
    // _VEC3
    case 35666:
      return Rp;
    // _VEC4
    case 35674:
      return Cp;
    // _MAT2
    case 35675:
      return Pp;
    // _MAT3
    case 35676:
      return Lp;
    // _MAT4
    case 5124:
    case 35670:
      return Dp;
    // INT, BOOL
    case 35667:
    case 35671:
      return Up;
    // _VEC2
    case 35668:
    case 35672:
      return Ip;
    // _VEC3
    case 35669:
    case 35673:
      return Np;
    // _VEC4
    case 5125:
      return Fp;
    // UINT
    case 36294:
      return Op;
    // _VEC2
    case 36295:
      return Bp;
    // _VEC3
    case 36296:
      return zp;
    // _VEC4
    case 35678:
    // SAMPLER_2D
    case 36198:
    // SAMPLER_EXTERNAL_OES
    case 36298:
    // INT_SAMPLER_2D
    case 36306:
    // UNSIGNED_INT_SAMPLER_2D
    case 35682:
      return kp;
    case 35679:
    // SAMPLER_3D
    case 36299:
    // INT_SAMPLER_3D
    case 36307:
      return Hp;
    case 35680:
    // SAMPLER_CUBE
    case 36300:
    // INT_SAMPLER_CUBE
    case 36308:
    // UNSIGNED_INT_SAMPLER_CUBE
    case 36293:
      return Vp;
    case 36289:
    // SAMPLER_2D_ARRAY
    case 36303:
    // INT_SAMPLER_2D_ARRAY
    case 36311:
    // UNSIGNED_INT_SAMPLER_2D_ARRAY
    case 36292:
      return Gp;
  }
}
function $p(i, t) {
  i.uniform1fv(this.addr, t);
}
function Xp(i, t) {
  const e = Ii(t, this.size, 2);
  i.uniform2fv(this.addr, e);
}
function qp(i, t) {
  const e = Ii(t, this.size, 3);
  i.uniform3fv(this.addr, e);
}
function Yp(i, t) {
  const e = Ii(t, this.size, 4);
  i.uniform4fv(this.addr, e);
}
function Zp(i, t) {
  const e = Ii(t, this.size, 4);
  i.uniformMatrix2fv(this.addr, !1, e);
}
function jp(i, t) {
  const e = Ii(t, this.size, 9);
  i.uniformMatrix3fv(this.addr, !1, e);
}
function Kp(i, t) {
  const e = Ii(t, this.size, 16);
  i.uniformMatrix4fv(this.addr, !1, e);
}
function Jp(i, t) {
  i.uniform1iv(this.addr, t);
}
function Qp(i, t) {
  i.uniform2iv(this.addr, t);
}
function tm(i, t) {
  i.uniform3iv(this.addr, t);
}
function em(i, t) {
  i.uniform4iv(this.addr, t);
}
function nm(i, t) {
  i.uniform1uiv(this.addr, t);
}
function im(i, t) {
  i.uniform2uiv(this.addr, t);
}
function sm(i, t) {
  i.uniform3uiv(this.addr, t);
}
function rm(i, t) {
  i.uniform4uiv(this.addr, t);
}
function om(i, t, e) {
  const n = this.cache, s = t.length, r = er(e, s);
  de(n, r) || (i.uniform1iv(this.addr, r), fe(n, r));
  for (let o = 0; o !== s; ++o)
    e.setTexture2D(t[o] || gc, r[o]);
}
function am(i, t, e) {
  const n = this.cache, s = t.length, r = er(e, s);
  de(n, r) || (i.uniform1iv(this.addr, r), fe(n, r));
  for (let o = 0; o !== s; ++o)
    e.setTexture3D(t[o] || xc, r[o]);
}
function lm(i, t, e) {
  const n = this.cache, s = t.length, r = er(e, s);
  de(n, r) || (i.uniform1iv(this.addr, r), fe(n, r));
  for (let o = 0; o !== s; ++o)
    e.setTextureCube(t[o] || vc, r[o]);
}
function cm(i, t, e) {
  const n = this.cache, s = t.length, r = er(e, s);
  de(n, r) || (i.uniform1iv(this.addr, r), fe(n, r));
  for (let o = 0; o !== s; ++o)
    e.setTexture2DArray(t[o] || _c, r[o]);
}
function hm(i) {
  switch (i) {
    case 5126:
      return $p;
    // FLOAT
    case 35664:
      return Xp;
    // _VEC2
    case 35665:
      return qp;
    // _VEC3
    case 35666:
      return Yp;
    // _VEC4
    case 35674:
      return Zp;
    // _MAT2
    case 35675:
      return jp;
    // _MAT3
    case 35676:
      return Kp;
    // _MAT4
    case 5124:
    case 35670:
      return Jp;
    // INT, BOOL
    case 35667:
    case 35671:
      return Qp;
    // _VEC2
    case 35668:
    case 35672:
      return tm;
    // _VEC3
    case 35669:
    case 35673:
      return em;
    // _VEC4
    case 5125:
      return nm;
    // UINT
    case 36294:
      return im;
    // _VEC2
    case 36295:
      return sm;
    // _VEC3
    case 36296:
      return rm;
    // _VEC4
    case 35678:
    // SAMPLER_2D
    case 36198:
    // SAMPLER_EXTERNAL_OES
    case 36298:
    // INT_SAMPLER_2D
    case 36306:
    // UNSIGNED_INT_SAMPLER_2D
    case 35682:
      return om;
    case 35679:
    // SAMPLER_3D
    case 36299:
    // INT_SAMPLER_3D
    case 36307:
      return am;
    case 35680:
    // SAMPLER_CUBE
    case 36300:
    // INT_SAMPLER_CUBE
    case 36308:
    // UNSIGNED_INT_SAMPLER_CUBE
    case 36293:
      return lm;
    case 36289:
    // SAMPLER_2D_ARRAY
    case 36303:
    // INT_SAMPLER_2D_ARRAY
    case 36311:
    // UNSIGNED_INT_SAMPLER_2D_ARRAY
    case 36292:
      return cm;
  }
}
class um {
  constructor(t, e, n) {
    this.id = t, this.addr = n, this.cache = [], this.type = e.type, this.setValue = Wp(e.type);
  }
}
class dm {
  constructor(t, e, n) {
    this.id = t, this.addr = n, this.cache = [], this.type = e.type, this.size = e.size, this.setValue = hm(e.type);
  }
}
class fm {
  constructor(t) {
    this.id = t, this.seq = [], this.map = {};
  }
  setValue(t, e, n) {
    const s = this.seq;
    for (let r = 0, o = s.length; r !== o; ++r) {
      const a = s[r];
      a.setValue(t, e[a.id], n);
    }
  }
}
const Pr = /(\w+)(\])?(\[|\.)?/g;
function nl(i, t) {
  i.seq.push(t), i.map[t.id] = t;
}
function pm(i, t, e) {
  const n = i.name, s = n.length;
  for (Pr.lastIndex = 0; ; ) {
    const r = Pr.exec(n), o = Pr.lastIndex;
    let a = r[1];
    const l = r[2] === "]", h = r[3];
    if (l && (a = a | 0), h === void 0 || h === "[" && o + 2 === s) {
      nl(e, h === void 0 ? new um(a, i, t) : new dm(a, i, t));
      break;
    } else {
      let c = e.map[a];
      c === void 0 && (c = new fm(a), nl(e, c)), e = c;
    }
  }
}
class Gs {
  constructor(t, e) {
    this.seq = [], this.map = {};
    const n = t.getProgramParameter(e, t.ACTIVE_UNIFORMS);
    for (let s = 0; s < n; ++s) {
      const r = t.getActiveUniform(e, s), o = t.getUniformLocation(e, r.name);
      pm(r, o, this);
    }
  }
  setValue(t, e, n, s) {
    const r = this.map[e];
    r !== void 0 && r.setValue(t, n, s);
  }
  setOptional(t, e, n) {
    const s = e[n];
    s !== void 0 && this.setValue(t, n, s);
  }
  static upload(t, e, n, s) {
    for (let r = 0, o = e.length; r !== o; ++r) {
      const a = e[r], l = n[a.id];
      l.needsUpdate !== !1 && a.setValue(t, l.value, s);
    }
  }
  static seqWithValue(t, e) {
    const n = [];
    for (let s = 0, r = t.length; s !== r; ++s) {
      const o = t[s];
      o.id in e && n.push(o);
    }
    return n;
  }
}
function il(i, t, e) {
  const n = i.createShader(t);
  return i.shaderSource(n, e), i.compileShader(n), n;
}
const mm = 37297;
let gm = 0;
function _m(i, t) {
  const e = i.split(`
`), n = [], s = Math.max(t - 6, 0), r = Math.min(t + 6, e.length);
  for (let o = s; o < r; o++) {
    const a = o + 1;
    n.push(`${a === t ? ">" : " "} ${a}: ${e[o]}`);
  }
  return n.join(`
`);
}
const sl = /* @__PURE__ */ new It();
function xm(i) {
  Xt._getMatrix(sl, Xt.workingColorSpace, i);
  const t = `mat3( ${sl.elements.map((e) => e.toFixed(4))} )`;
  switch (Xt.getTransfer(i)) {
    case Qs:
      return [t, "LinearTransferOETF"];
    case Jt:
      return [t, "sRGBTransferOETF"];
    default:
      return console.warn("THREE.WebGLProgram: Unsupported color space: ", i), [t, "LinearTransferOETF"];
  }
}
function rl(i, t, e) {
  const n = i.getShaderParameter(t, i.COMPILE_STATUS), s = i.getShaderInfoLog(t).trim();
  if (n && s === "") return "";
  const r = /ERROR: 0:(\d+)/.exec(s);
  if (r) {
    const o = parseInt(r[1]);
    return e.toUpperCase() + `

` + s + `

` + _m(i.getShaderSource(t), o);
  } else
    return s;
}
function vm(i, t) {
  const e = xm(t);
  return [
    `vec4 ${i}( vec4 value ) {`,
    `	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,
    "}"
  ].join(`
`);
}
function Mm(i, t) {
  let e;
  switch (t) {
    case yh:
      e = "Linear";
      break;
    case bh:
      e = "Reinhard";
      break;
    case Eh:
      e = "Cineon";
      break;
    case Wl:
      e = "ACESFilmic";
      break;
    case Th:
      e = "AgX";
      break;
    case Ah:
      e = "Neutral";
      break;
    case wh:
      e = "Custom";
      break;
    default:
      console.warn("THREE.WebGLProgram: Unsupported toneMapping:", t), e = "Linear";
  }
  return "vec3 " + i + "( vec3 color ) { return " + e + "ToneMapping( color ); }";
}
const Us = /* @__PURE__ */ new L();
function Sm() {
  Xt.getLuminanceCoefficients(Us);
  const i = Us.x.toFixed(4), t = Us.y.toFixed(4), e = Us.z.toFixed(4);
  return [
    "float luminance( const in vec3 rgb ) {",
    `	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,
    "	return dot( weights, rgb );",
    "}"
  ].join(`
`);
}
function ym(i) {
  return [
    i.extensionClipCullDistance ? "#extension GL_ANGLE_clip_cull_distance : require" : "",
    i.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : ""
  ].filter(ji).join(`
`);
}
function bm(i) {
  const t = [];
  for (const e in i) {
    const n = i[e];
    n !== !1 && t.push("#define " + e + " " + n);
  }
  return t.join(`
`);
}
function Em(i, t) {
  const e = {}, n = i.getProgramParameter(t, i.ACTIVE_ATTRIBUTES);
  for (let s = 0; s < n; s++) {
    const r = i.getActiveAttrib(t, s), o = r.name;
    let a = 1;
    r.type === i.FLOAT_MAT2 && (a = 2), r.type === i.FLOAT_MAT3 && (a = 3), r.type === i.FLOAT_MAT4 && (a = 4), e[o] = {
      type: r.type,
      location: i.getAttribLocation(t, o),
      locationSize: a
    };
  }
  return e;
}
function ji(i) {
  return i !== "";
}
function ol(i, t) {
  const e = t.numSpotLightShadows + t.numSpotLightMaps - t.numSpotLightShadowsWithMaps;
  return i.replace(/NUM_DIR_LIGHTS/g, t.numDirLights).replace(/NUM_SPOT_LIGHTS/g, t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g, t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g, e).replace(/NUM_RECT_AREA_LIGHTS/g, t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g, t.numPointLights).replace(/NUM_HEMI_LIGHTS/g, t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g, t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g, t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g, t.numPointLightShadows);
}
function al(i, t) {
  return i.replace(/NUM_CLIPPING_PLANES/g, t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g, t.numClippingPlanes - t.numClipIntersection);
}
const wm = /^[ \t]*#include +<([\w\d./]+)>/gm;
function wo(i) {
  return i.replace(wm, Am);
}
const Tm = /* @__PURE__ */ new Map();
function Am(i, t) {
  let e = Ot[t];
  if (e === void 0) {
    const n = Tm.get(t);
    if (n !== void 0)
      e = Ot[n], console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.', t, n);
    else
      throw new Error("Can not resolve #include <" + t + ">");
  }
  return wo(e);
}
const Rm = /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
function ll(i) {
  return i.replace(Rm, Cm);
}
function Cm(i, t, e, n) {
  let s = "";
  for (let r = parseInt(t); r < parseInt(e); r++)
    s += n.replace(/\[\s*i\s*\]/g, "[ " + r + " ]").replace(/UNROLLED_LOOP_INDEX/g, r);
  return s;
}
function cl(i) {
  let t = `precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;
  return i.precision === "highp" ? t += `
#define HIGH_PRECISION` : i.precision === "mediump" ? t += `
#define MEDIUM_PRECISION` : i.precision === "lowp" && (t += `
#define LOW_PRECISION`), t;
}
function Pm(i) {
  let t = "SHADOWMAP_TYPE_BASIC";
  return i.shadowMapType === Hl ? t = "SHADOWMAP_TYPE_PCF" : i.shadowMapType === Vl ? t = "SHADOWMAP_TYPE_PCF_SOFT" : i.shadowMapType === ln && (t = "SHADOWMAP_TYPE_VSM"), t;
}
function Lm(i) {
  let t = "ENVMAP_TYPE_CUBE";
  if (i.envMap)
    switch (i.envMapMode) {
      case wi:
      case Ti:
        t = "ENVMAP_TYPE_CUBE";
        break;
      case Js:
        t = "ENVMAP_TYPE_CUBE_UV";
        break;
    }
  return t;
}
function Dm(i) {
  let t = "ENVMAP_MODE_REFLECTION";
  if (i.envMap)
    switch (i.envMapMode) {
      case Ti:
        t = "ENVMAP_MODE_REFRACTION";
        break;
    }
  return t;
}
function Um(i) {
  let t = "ENVMAP_BLENDING_NONE";
  if (i.envMap)
    switch (i.combine) {
      case Gl:
        t = "ENVMAP_BLENDING_MULTIPLY";
        break;
      case Mh:
        t = "ENVMAP_BLENDING_MIX";
        break;
      case Sh:
        t = "ENVMAP_BLENDING_ADD";
        break;
    }
  return t;
}
function Im(i) {
  const t = i.envMapCubeUVHeight;
  if (t === null) return null;
  const e = Math.log2(t) - 2, n = 1 / t;
  return { texelWidth: 1 / (3 * Math.max(Math.pow(2, e), 112)), texelHeight: n, maxMip: e };
}
function Nm(i, t, e, n) {
  const s = i.getContext(), r = e.defines;
  let o = e.vertexShader, a = e.fragmentShader;
  const l = Pm(e), h = Lm(e), u = Dm(e), c = Um(e), f = Im(e), d = ym(e), g = bm(r), x = s.createProgram();
  let m, p, E = e.glslVersion ? "#version " + e.glslVersion + `
` : "";
  e.isRawShaderMaterial ? (m = [
    "#define SHADER_TYPE " + e.shaderType,
    "#define SHADER_NAME " + e.shaderName,
    g
  ].filter(ji).join(`
`), m.length > 0 && (m += `
`), p = [
    "#define SHADER_TYPE " + e.shaderType,
    "#define SHADER_NAME " + e.shaderName,
    g
  ].filter(ji).join(`
`), p.length > 0 && (p += `
`)) : (m = [
    cl(e),
    "#define SHADER_TYPE " + e.shaderType,
    "#define SHADER_NAME " + e.shaderName,
    g,
    e.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "",
    e.batching ? "#define USE_BATCHING" : "",
    e.batchingColor ? "#define USE_BATCHING_COLOR" : "",
    e.instancing ? "#define USE_INSTANCING" : "",
    e.instancingColor ? "#define USE_INSTANCING_COLOR" : "",
    e.instancingMorph ? "#define USE_INSTANCING_MORPH" : "",
    e.useFog && e.fog ? "#define USE_FOG" : "",
    e.useFog && e.fogExp2 ? "#define FOG_EXP2" : "",
    e.map ? "#define USE_MAP" : "",
    e.envMap ? "#define USE_ENVMAP" : "",
    e.envMap ? "#define " + u : "",
    e.lightMap ? "#define USE_LIGHTMAP" : "",
    e.aoMap ? "#define USE_AOMAP" : "",
    e.bumpMap ? "#define USE_BUMPMAP" : "",
    e.normalMap ? "#define USE_NORMALMAP" : "",
    e.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
    e.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
    e.displacementMap ? "#define USE_DISPLACEMENTMAP" : "",
    e.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
    e.anisotropy ? "#define USE_ANISOTROPY" : "",
    e.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
    e.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
    e.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
    e.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
    e.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
    e.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
    e.specularMap ? "#define USE_SPECULARMAP" : "",
    e.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
    e.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
    e.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
    e.metalnessMap ? "#define USE_METALNESSMAP" : "",
    e.alphaMap ? "#define USE_ALPHAMAP" : "",
    e.alphaHash ? "#define USE_ALPHAHASH" : "",
    e.transmission ? "#define USE_TRANSMISSION" : "",
    e.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
    e.thicknessMap ? "#define USE_THICKNESSMAP" : "",
    e.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
    e.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
    //
    e.mapUv ? "#define MAP_UV " + e.mapUv : "",
    e.alphaMapUv ? "#define ALPHAMAP_UV " + e.alphaMapUv : "",
    e.lightMapUv ? "#define LIGHTMAP_UV " + e.lightMapUv : "",
    e.aoMapUv ? "#define AOMAP_UV " + e.aoMapUv : "",
    e.emissiveMapUv ? "#define EMISSIVEMAP_UV " + e.emissiveMapUv : "",
    e.bumpMapUv ? "#define BUMPMAP_UV " + e.bumpMapUv : "",
    e.normalMapUv ? "#define NORMALMAP_UV " + e.normalMapUv : "",
    e.displacementMapUv ? "#define DISPLACEMENTMAP_UV " + e.displacementMapUv : "",
    e.metalnessMapUv ? "#define METALNESSMAP_UV " + e.metalnessMapUv : "",
    e.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + e.roughnessMapUv : "",
    e.anisotropyMapUv ? "#define ANISOTROPYMAP_UV " + e.anisotropyMapUv : "",
    e.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + e.clearcoatMapUv : "",
    e.clearcoatNormalMapUv ? "#define CLEARCOAT_NORMALMAP_UV " + e.clearcoatNormalMapUv : "",
    e.clearcoatRoughnessMapUv ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + e.clearcoatRoughnessMapUv : "",
    e.iridescenceMapUv ? "#define IRIDESCENCEMAP_UV " + e.iridescenceMapUv : "",
    e.iridescenceThicknessMapUv ? "#define IRIDESCENCE_THICKNESSMAP_UV " + e.iridescenceThicknessMapUv : "",
    e.sheenColorMapUv ? "#define SHEEN_COLORMAP_UV " + e.sheenColorMapUv : "",
    e.sheenRoughnessMapUv ? "#define SHEEN_ROUGHNESSMAP_UV " + e.sheenRoughnessMapUv : "",
    e.specularMapUv ? "#define SPECULARMAP_UV " + e.specularMapUv : "",
    e.specularColorMapUv ? "#define SPECULAR_COLORMAP_UV " + e.specularColorMapUv : "",
    e.specularIntensityMapUv ? "#define SPECULAR_INTENSITYMAP_UV " + e.specularIntensityMapUv : "",
    e.transmissionMapUv ? "#define TRANSMISSIONMAP_UV " + e.transmissionMapUv : "",
    e.thicknessMapUv ? "#define THICKNESSMAP_UV " + e.thicknessMapUv : "",
    //
    e.vertexTangents && e.flatShading === !1 ? "#define USE_TANGENT" : "",
    e.vertexColors ? "#define USE_COLOR" : "",
    e.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
    e.vertexUv1s ? "#define USE_UV1" : "",
    e.vertexUv2s ? "#define USE_UV2" : "",
    e.vertexUv3s ? "#define USE_UV3" : "",
    e.pointsUvs ? "#define USE_POINTS_UV" : "",
    e.flatShading ? "#define FLAT_SHADED" : "",
    e.skinning ? "#define USE_SKINNING" : "",
    e.morphTargets ? "#define USE_MORPHTARGETS" : "",
    e.morphNormals && e.flatShading === !1 ? "#define USE_MORPHNORMALS" : "",
    e.morphColors ? "#define USE_MORPHCOLORS" : "",
    e.morphTargetsCount > 0 ? "#define MORPHTARGETS_TEXTURE_STRIDE " + e.morphTextureStride : "",
    e.morphTargetsCount > 0 ? "#define MORPHTARGETS_COUNT " + e.morphTargetsCount : "",
    e.doubleSided ? "#define DOUBLE_SIDED" : "",
    e.flipSided ? "#define FLIP_SIDED" : "",
    e.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
    e.shadowMapEnabled ? "#define " + l : "",
    e.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",
    e.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
    e.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
    e.reverseDepthBuffer ? "#define USE_REVERSEDEPTHBUF" : "",
    "uniform mat4 modelMatrix;",
    "uniform mat4 modelViewMatrix;",
    "uniform mat4 projectionMatrix;",
    "uniform mat4 viewMatrix;",
    "uniform mat3 normalMatrix;",
    "uniform vec3 cameraPosition;",
    "uniform bool isOrthographic;",
    "#ifdef USE_INSTANCING",
    "	attribute mat4 instanceMatrix;",
    "#endif",
    "#ifdef USE_INSTANCING_COLOR",
    "	attribute vec3 instanceColor;",
    "#endif",
    "#ifdef USE_INSTANCING_MORPH",
    "	uniform sampler2D morphTexture;",
    "#endif",
    "attribute vec3 position;",
    "attribute vec3 normal;",
    "attribute vec2 uv;",
    "#ifdef USE_UV1",
    "	attribute vec2 uv1;",
    "#endif",
    "#ifdef USE_UV2",
    "	attribute vec2 uv2;",
    "#endif",
    "#ifdef USE_UV3",
    "	attribute vec2 uv3;",
    "#endif",
    "#ifdef USE_TANGENT",
    "	attribute vec4 tangent;",
    "#endif",
    "#if defined( USE_COLOR_ALPHA )",
    "	attribute vec4 color;",
    "#elif defined( USE_COLOR )",
    "	attribute vec3 color;",
    "#endif",
    "#ifdef USE_SKINNING",
    "	attribute vec4 skinIndex;",
    "	attribute vec4 skinWeight;",
    "#endif",
    `
`
  ].filter(ji).join(`
`), p = [
    cl(e),
    "#define SHADER_TYPE " + e.shaderType,
    "#define SHADER_NAME " + e.shaderName,
    g,
    e.useFog && e.fog ? "#define USE_FOG" : "",
    e.useFog && e.fogExp2 ? "#define FOG_EXP2" : "",
    e.alphaToCoverage ? "#define ALPHA_TO_COVERAGE" : "",
    e.map ? "#define USE_MAP" : "",
    e.matcap ? "#define USE_MATCAP" : "",
    e.envMap ? "#define USE_ENVMAP" : "",
    e.envMap ? "#define " + h : "",
    e.envMap ? "#define " + u : "",
    e.envMap ? "#define " + c : "",
    f ? "#define CUBEUV_TEXEL_WIDTH " + f.texelWidth : "",
    f ? "#define CUBEUV_TEXEL_HEIGHT " + f.texelHeight : "",
    f ? "#define CUBEUV_MAX_MIP " + f.maxMip + ".0" : "",
    e.lightMap ? "#define USE_LIGHTMAP" : "",
    e.aoMap ? "#define USE_AOMAP" : "",
    e.bumpMap ? "#define USE_BUMPMAP" : "",
    e.normalMap ? "#define USE_NORMALMAP" : "",
    e.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
    e.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
    e.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
    e.anisotropy ? "#define USE_ANISOTROPY" : "",
    e.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
    e.clearcoat ? "#define USE_CLEARCOAT" : "",
    e.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
    e.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
    e.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
    e.dispersion ? "#define USE_DISPERSION" : "",
    e.iridescence ? "#define USE_IRIDESCENCE" : "",
    e.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
    e.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
    e.specularMap ? "#define USE_SPECULARMAP" : "",
    e.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
    e.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
    e.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
    e.metalnessMap ? "#define USE_METALNESSMAP" : "",
    e.alphaMap ? "#define USE_ALPHAMAP" : "",
    e.alphaTest ? "#define USE_ALPHATEST" : "",
    e.alphaHash ? "#define USE_ALPHAHASH" : "",
    e.sheen ? "#define USE_SHEEN" : "",
    e.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
    e.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
    e.transmission ? "#define USE_TRANSMISSION" : "",
    e.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
    e.thicknessMap ? "#define USE_THICKNESSMAP" : "",
    e.vertexTangents && e.flatShading === !1 ? "#define USE_TANGENT" : "",
    e.vertexColors || e.instancingColor || e.batchingColor ? "#define USE_COLOR" : "",
    e.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
    e.vertexUv1s ? "#define USE_UV1" : "",
    e.vertexUv2s ? "#define USE_UV2" : "",
    e.vertexUv3s ? "#define USE_UV3" : "",
    e.pointsUvs ? "#define USE_POINTS_UV" : "",
    e.gradientMap ? "#define USE_GRADIENTMAP" : "",
    e.flatShading ? "#define FLAT_SHADED" : "",
    e.doubleSided ? "#define DOUBLE_SIDED" : "",
    e.flipSided ? "#define FLIP_SIDED" : "",
    e.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
    e.shadowMapEnabled ? "#define " + l : "",
    e.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "",
    e.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
    e.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "",
    e.decodeVideoTextureEmissive ? "#define DECODE_VIDEO_TEXTURE_EMISSIVE" : "",
    e.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
    e.reverseDepthBuffer ? "#define USE_REVERSEDEPTHBUF" : "",
    "uniform mat4 viewMatrix;",
    "uniform vec3 cameraPosition;",
    "uniform bool isOrthographic;",
    e.toneMapping !== Rn ? "#define TONE_MAPPING" : "",
    e.toneMapping !== Rn ? Ot.tonemapping_pars_fragment : "",
    // this code is required here because it is used by the toneMapping() function defined below
    e.toneMapping !== Rn ? Mm("toneMapping", e.toneMapping) : "",
    e.dithering ? "#define DITHERING" : "",
    e.opaque ? "#define OPAQUE" : "",
    Ot.colorspace_pars_fragment,
    // this code is required here because it is used by the various encoding/decoding function defined below
    vm("linearToOutputTexel", e.outputColorSpace),
    Sm(),
    e.useDepthPacking ? "#define DEPTH_PACKING " + e.depthPacking : "",
    `
`
  ].filter(ji).join(`
`)), o = wo(o), o = ol(o, e), o = al(o, e), a = wo(a), a = ol(a, e), a = al(a, e), o = ll(o), a = ll(a), e.isRawShaderMaterial !== !0 && (E = `#version 300 es
`, m = [
    d,
    "#define attribute in",
    "#define varying out",
    "#define texture2D texture"
  ].join(`
`) + `
` + m, p = [
    "#define varying in",
    e.glslVersion === Sa ? "" : "layout(location = 0) out highp vec4 pc_fragColor;",
    e.glslVersion === Sa ? "" : "#define gl_FragColor pc_fragColor",
    "#define gl_FragDepthEXT gl_FragDepth",
    "#define texture2D texture",
    "#define textureCube texture",
    "#define texture2DProj textureProj",
    "#define texture2DLodEXT textureLod",
    "#define texture2DProjLodEXT textureProjLod",
    "#define textureCubeLodEXT textureLod",
    "#define texture2DGradEXT textureGrad",
    "#define texture2DProjGradEXT textureProjGrad",
    "#define textureCubeGradEXT textureGrad"
  ].join(`
`) + `
` + p);
  const b = E + m + o, y = E + p + a, N = il(s, s.VERTEX_SHADER, b), R = il(s, s.FRAGMENT_SHADER, y);
  s.attachShader(x, N), s.attachShader(x, R), e.index0AttributeName !== void 0 ? s.bindAttribLocation(x, 0, e.index0AttributeName) : e.morphTargets === !0 && s.bindAttribLocation(x, 0, "position"), s.linkProgram(x);
  function T(A) {
    if (i.debug.checkShaderErrors) {
      const F = s.getProgramInfoLog(x).trim(), O = s.getShaderInfoLog(N).trim(), G = s.getShaderInfoLog(R).trim();
      let $ = !0, V = !0;
      if (s.getProgramParameter(x, s.LINK_STATUS) === !1)
        if ($ = !1, typeof i.debug.onShaderError == "function")
          i.debug.onShaderError(s, x, N, R);
        else {
          const K = rl(s, N, "vertex"), H = rl(s, R, "fragment");
          console.error(
            "THREE.WebGLProgram: Shader Error " + s.getError() + " - VALIDATE_STATUS " + s.getProgramParameter(x, s.VALIDATE_STATUS) + `

Material Name: ` + A.name + `
Material Type: ` + A.type + `

Program Info Log: ` + F + `
` + K + `
` + H
          );
        }
      else F !== "" ? console.warn("THREE.WebGLProgram: Program Info Log:", F) : (O === "" || G === "") && (V = !1);
      V && (A.diagnostics = {
        runnable: $,
        programLog: F,
        vertexShader: {
          log: O,
          prefix: m
        },
        fragmentShader: {
          log: G,
          prefix: p
        }
      });
    }
    s.deleteShader(N), s.deleteShader(R), C = new Gs(s, x), M = Em(s, x);
  }
  let C;
  this.getUniforms = function() {
    return C === void 0 && T(this), C;
  };
  let M;
  this.getAttributes = function() {
    return M === void 0 && T(this), M;
  };
  let _ = e.rendererExtensionParallelShaderCompile === !1;
  return this.isReady = function() {
    return _ === !1 && (_ = s.getProgramParameter(x, mm)), _;
  }, this.destroy = function() {
    n.releaseStatesOfProgram(this), s.deleteProgram(x), this.program = void 0;
  }, this.type = e.shaderType, this.name = e.shaderName, this.id = gm++, this.cacheKey = t, this.usedTimes = 1, this.program = x, this.vertexShader = N, this.fragmentShader = R, this;
}
let Fm = 0;
class Om {
  constructor() {
    this.shaderCache = /* @__PURE__ */ new Map(), this.materialCache = /* @__PURE__ */ new Map();
  }
  update(t) {
    const e = t.vertexShader, n = t.fragmentShader, s = this._getShaderStage(e), r = this._getShaderStage(n), o = this._getShaderCacheForMaterial(t);
    return o.has(s) === !1 && (o.add(s), s.usedTimes++), o.has(r) === !1 && (o.add(r), r.usedTimes++), this;
  }
  remove(t) {
    const e = this.materialCache.get(t);
    for (const n of e)
      n.usedTimes--, n.usedTimes === 0 && this.shaderCache.delete(n.code);
    return this.materialCache.delete(t), this;
  }
  getVertexShaderID(t) {
    return this._getShaderStage(t.vertexShader).id;
  }
  getFragmentShaderID(t) {
    return this._getShaderStage(t.fragmentShader).id;
  }
  dispose() {
    this.shaderCache.clear(), this.materialCache.clear();
  }
  _getShaderCacheForMaterial(t) {
    const e = this.materialCache;
    let n = e.get(t);
    return n === void 0 && (n = /* @__PURE__ */ new Set(), e.set(t, n)), n;
  }
  _getShaderStage(t) {
    const e = this.shaderCache;
    let n = e.get(t);
    return n === void 0 && (n = new Bm(t), e.set(t, n)), n;
  }
}
class Bm {
  constructor(t) {
    this.id = Fm++, this.code = t, this.usedTimes = 0;
  }
}
function zm(i, t, e, n, s, r, o) {
  const a = new Go(), l = new Om(), h = /* @__PURE__ */ new Set(), u = [], c = s.logarithmicDepthBuffer, f = s.vertexTextures;
  let d = s.precision;
  const g = {
    MeshDepthMaterial: "depth",
    MeshDistanceMaterial: "distanceRGBA",
    MeshNormalMaterial: "normal",
    MeshBasicMaterial: "basic",
    MeshLambertMaterial: "lambert",
    MeshPhongMaterial: "phong",
    MeshToonMaterial: "toon",
    MeshStandardMaterial: "physical",
    MeshPhysicalMaterial: "physical",
    MeshMatcapMaterial: "matcap",
    LineBasicMaterial: "basic",
    LineDashedMaterial: "dashed",
    PointsMaterial: "points",
    ShadowMaterial: "shadow",
    SpriteMaterial: "sprite"
  };
  function x(M) {
    return h.add(M), M === 0 ? "uv" : `uv${M}`;
  }
  function m(M, _, A, F, O) {
    const G = F.fog, $ = O.geometry, V = M.isMeshStandardMaterial ? F.environment : null, K = (M.isMeshStandardMaterial ? e : t).get(M.envMap || V), H = K && K.mapping === Js ? K.image.height : null, st = g[M.type];
    M.precision !== null && (d = s.getMaxPrecision(M.precision), d !== M.precision && console.warn("THREE.WebGLProgram.getParameters:", M.precision, "not supported, using", d, "instead."));
    const ut = $.morphAttributes.position || $.morphAttributes.normal || $.morphAttributes.color, yt = ut !== void 0 ? ut.length : 0;
    let Bt = 0;
    $.morphAttributes.position !== void 0 && (Bt = 1), $.morphAttributes.normal !== void 0 && (Bt = 2), $.morphAttributes.color !== void 0 && (Bt = 3);
    let jt, q, nt, vt;
    if (st) {
      const Kt = je[st];
      jt = Kt.vertexShader, q = Kt.fragmentShader;
    } else
      jt = M.vertexShader, q = M.fragmentShader, l.update(M), nt = l.getVertexShaderID(M), vt = l.getFragmentShaderID(M);
    const ot = i.getRenderTarget(), Tt = i.state.buffers.depth.getReversed(), Lt = O.isInstancedMesh === !0, zt = O.isBatchedMesh === !0, oe = !!M.map, Wt = !!M.matcap, ce = !!K, I = !!M.aoMap, Ne = !!M.lightMap, Ht = !!M.bumpMap, Vt = !!M.normalMap, Et = !!M.displacementMap, ne = !!M.emissiveMap, bt = !!M.metalnessMap, w = !!M.roughnessMap, v = M.anisotropy > 0, B = M.clearcoat > 0, Y = M.dispersion > 0, j = M.iridescence > 0, X = M.sheen > 0, Mt = M.transmission > 0, at = v && !!M.anisotropyMap, ft = B && !!M.clearcoatMap, $t = B && !!M.clearcoatNormalMap, tt = B && !!M.clearcoatRoughnessMap, pt = j && !!M.iridescenceMap, wt = j && !!M.iridescenceThicknessMap, At = X && !!M.sheenColorMap, mt = X && !!M.sheenRoughnessMap, Gt = !!M.specularMap, Nt = !!M.specularColorMap, te = !!M.specularIntensityMap, P = Mt && !!M.transmissionMap, rt = Mt && !!M.thicknessMap, W = !!M.gradientMap, Z = !!M.alphaMap, ht = M.alphaTest > 0, lt = !!M.alphaHash, Dt = !!M.extensions;
    let ae = Rn;
    M.toneMapped && (ot === null || ot.isXRRenderTarget === !0) && (ae = i.toneMapping);
    const _e = {
      shaderID: st,
      shaderType: M.type,
      shaderName: M.name,
      vertexShader: jt,
      fragmentShader: q,
      defines: M.defines,
      customVertexShaderID: nt,
      customFragmentShaderID: vt,
      isRawShaderMaterial: M.isRawShaderMaterial === !0,
      glslVersion: M.glslVersion,
      precision: d,
      batching: zt,
      batchingColor: zt && O._colorsTexture !== null,
      instancing: Lt,
      instancingColor: Lt && O.instanceColor !== null,
      instancingMorph: Lt && O.morphTexture !== null,
      supportsVertexTextures: f,
      outputColorSpace: ot === null ? i.outputColorSpace : ot.isXRRenderTarget === !0 ? ot.texture.colorSpace : Pi,
      alphaToCoverage: !!M.alphaToCoverage,
      map: oe,
      matcap: Wt,
      envMap: ce,
      envMapMode: ce && K.mapping,
      envMapCubeUVHeight: H,
      aoMap: I,
      lightMap: Ne,
      bumpMap: Ht,
      normalMap: Vt,
      displacementMap: f && Et,
      emissiveMap: ne,
      normalMapObjectSpace: Vt && M.normalMapType === Lh,
      normalMapTangentSpace: Vt && M.normalMapType === nc,
      metalnessMap: bt,
      roughnessMap: w,
      anisotropy: v,
      anisotropyMap: at,
      clearcoat: B,
      clearcoatMap: ft,
      clearcoatNormalMap: $t,
      clearcoatRoughnessMap: tt,
      dispersion: Y,
      iridescence: j,
      iridescenceMap: pt,
      iridescenceThicknessMap: wt,
      sheen: X,
      sheenColorMap: At,
      sheenRoughnessMap: mt,
      specularMap: Gt,
      specularColorMap: Nt,
      specularIntensityMap: te,
      transmission: Mt,
      transmissionMap: P,
      thicknessMap: rt,
      gradientMap: W,
      opaque: M.transparent === !1 && M.blending === xi && M.alphaToCoverage === !1,
      alphaMap: Z,
      alphaTest: ht,
      alphaHash: lt,
      combine: M.combine,
      //
      mapUv: oe && x(M.map.channel),
      aoMapUv: I && x(M.aoMap.channel),
      lightMapUv: Ne && x(M.lightMap.channel),
      bumpMapUv: Ht && x(M.bumpMap.channel),
      normalMapUv: Vt && x(M.normalMap.channel),
      displacementMapUv: Et && x(M.displacementMap.channel),
      emissiveMapUv: ne && x(M.emissiveMap.channel),
      metalnessMapUv: bt && x(M.metalnessMap.channel),
      roughnessMapUv: w && x(M.roughnessMap.channel),
      anisotropyMapUv: at && x(M.anisotropyMap.channel),
      clearcoatMapUv: ft && x(M.clearcoatMap.channel),
      clearcoatNormalMapUv: $t && x(M.clearcoatNormalMap.channel),
      clearcoatRoughnessMapUv: tt && x(M.clearcoatRoughnessMap.channel),
      iridescenceMapUv: pt && x(M.iridescenceMap.channel),
      iridescenceThicknessMapUv: wt && x(M.iridescenceThicknessMap.channel),
      sheenColorMapUv: At && x(M.sheenColorMap.channel),
      sheenRoughnessMapUv: mt && x(M.sheenRoughnessMap.channel),
      specularMapUv: Gt && x(M.specularMap.channel),
      specularColorMapUv: Nt && x(M.specularColorMap.channel),
      specularIntensityMapUv: te && x(M.specularIntensityMap.channel),
      transmissionMapUv: P && x(M.transmissionMap.channel),
      thicknessMapUv: rt && x(M.thicknessMap.channel),
      alphaMapUv: Z && x(M.alphaMap.channel),
      //
      vertexTangents: !!$.attributes.tangent && (Vt || v),
      vertexColors: M.vertexColors,
      vertexAlphas: M.vertexColors === !0 && !!$.attributes.color && $.attributes.color.itemSize === 4,
      pointsUvs: O.isPoints === !0 && !!$.attributes.uv && (oe || Z),
      fog: !!G,
      useFog: M.fog === !0,
      fogExp2: !!G && G.isFogExp2,
      flatShading: M.flatShading === !0,
      sizeAttenuation: M.sizeAttenuation === !0,
      logarithmicDepthBuffer: c,
      reverseDepthBuffer: Tt,
      skinning: O.isSkinnedMesh === !0,
      morphTargets: $.morphAttributes.position !== void 0,
      morphNormals: $.morphAttributes.normal !== void 0,
      morphColors: $.morphAttributes.color !== void 0,
      morphTargetsCount: yt,
      morphTextureStride: Bt,
      numDirLights: _.directional.length,
      numPointLights: _.point.length,
      numSpotLights: _.spot.length,
      numSpotLightMaps: _.spotLightMap.length,
      numRectAreaLights: _.rectArea.length,
      numHemiLights: _.hemi.length,
      numDirLightShadows: _.directionalShadowMap.length,
      numPointLightShadows: _.pointShadowMap.length,
      numSpotLightShadows: _.spotShadowMap.length,
      numSpotLightShadowsWithMaps: _.numSpotLightShadowsWithMaps,
      numLightProbes: _.numLightProbes,
      numClippingPlanes: o.numPlanes,
      numClipIntersection: o.numIntersection,
      dithering: M.dithering,
      shadowMapEnabled: i.shadowMap.enabled && A.length > 0,
      shadowMapType: i.shadowMap.type,
      toneMapping: ae,
      decodeVideoTexture: oe && M.map.isVideoTexture === !0 && Xt.getTransfer(M.map.colorSpace) === Jt,
      decodeVideoTextureEmissive: ne && M.emissiveMap.isVideoTexture === !0 && Xt.getTransfer(M.emissiveMap.colorSpace) === Jt,
      premultipliedAlpha: M.premultipliedAlpha,
      doubleSided: M.side === hn,
      flipSided: M.side === Ce,
      useDepthPacking: M.depthPacking >= 0,
      depthPacking: M.depthPacking || 0,
      index0AttributeName: M.index0AttributeName,
      extensionClipCullDistance: Dt && M.extensions.clipCullDistance === !0 && n.has("WEBGL_clip_cull_distance"),
      extensionMultiDraw: (Dt && M.extensions.multiDraw === !0 || zt) && n.has("WEBGL_multi_draw"),
      rendererExtensionParallelShaderCompile: n.has("KHR_parallel_shader_compile"),
      customProgramCacheKey: M.customProgramCacheKey()
    };
    return _e.vertexUv1s = h.has(1), _e.vertexUv2s = h.has(2), _e.vertexUv3s = h.has(3), h.clear(), _e;
  }
  function p(M) {
    const _ = [];
    if (M.shaderID ? _.push(M.shaderID) : (_.push(M.customVertexShaderID), _.push(M.customFragmentShaderID)), M.defines !== void 0)
      for (const A in M.defines)
        _.push(A), _.push(M.defines[A]);
    return M.isRawShaderMaterial === !1 && (E(_, M), b(_, M), _.push(i.outputColorSpace)), _.push(M.customProgramCacheKey), _.join();
  }
  function E(M, _) {
    M.push(_.precision), M.push(_.outputColorSpace), M.push(_.envMapMode), M.push(_.envMapCubeUVHeight), M.push(_.mapUv), M.push(_.alphaMapUv), M.push(_.lightMapUv), M.push(_.aoMapUv), M.push(_.bumpMapUv), M.push(_.normalMapUv), M.push(_.displacementMapUv), M.push(_.emissiveMapUv), M.push(_.metalnessMapUv), M.push(_.roughnessMapUv), M.push(_.anisotropyMapUv), M.push(_.clearcoatMapUv), M.push(_.clearcoatNormalMapUv), M.push(_.clearcoatRoughnessMapUv), M.push(_.iridescenceMapUv), M.push(_.iridescenceThicknessMapUv), M.push(_.sheenColorMapUv), M.push(_.sheenRoughnessMapUv), M.push(_.specularMapUv), M.push(_.specularColorMapUv), M.push(_.specularIntensityMapUv), M.push(_.transmissionMapUv), M.push(_.thicknessMapUv), M.push(_.combine), M.push(_.fogExp2), M.push(_.sizeAttenuation), M.push(_.morphTargetsCount), M.push(_.morphAttributeCount), M.push(_.numDirLights), M.push(_.numPointLights), M.push(_.numSpotLights), M.push(_.numSpotLightMaps), M.push(_.numHemiLights), M.push(_.numRectAreaLights), M.push(_.numDirLightShadows), M.push(_.numPointLightShadows), M.push(_.numSpotLightShadows), M.push(_.numSpotLightShadowsWithMaps), M.push(_.numLightProbes), M.push(_.shadowMapType), M.push(_.toneMapping), M.push(_.numClippingPlanes), M.push(_.numClipIntersection), M.push(_.depthPacking);
  }
  function b(M, _) {
    a.disableAll(), _.supportsVertexTextures && a.enable(0), _.instancing && a.enable(1), _.instancingColor && a.enable(2), _.instancingMorph && a.enable(3), _.matcap && a.enable(4), _.envMap && a.enable(5), _.normalMapObjectSpace && a.enable(6), _.normalMapTangentSpace && a.enable(7), _.clearcoat && a.enable(8), _.iridescence && a.enable(9), _.alphaTest && a.enable(10), _.vertexColors && a.enable(11), _.vertexAlphas && a.enable(12), _.vertexUv1s && a.enable(13), _.vertexUv2s && a.enable(14), _.vertexUv3s && a.enable(15), _.vertexTangents && a.enable(16), _.anisotropy && a.enable(17), _.alphaHash && a.enable(18), _.batching && a.enable(19), _.dispersion && a.enable(20), _.batchingColor && a.enable(21), M.push(a.mask), a.disableAll(), _.fog && a.enable(0), _.useFog && a.enable(1), _.flatShading && a.enable(2), _.logarithmicDepthBuffer && a.enable(3), _.reverseDepthBuffer && a.enable(4), _.skinning && a.enable(5), _.morphTargets && a.enable(6), _.morphNormals && a.enable(7), _.morphColors && a.enable(8), _.premultipliedAlpha && a.enable(9), _.shadowMapEnabled && a.enable(10), _.doubleSided && a.enable(11), _.flipSided && a.enable(12), _.useDepthPacking && a.enable(13), _.dithering && a.enable(14), _.transmission && a.enable(15), _.sheen && a.enable(16), _.opaque && a.enable(17), _.pointsUvs && a.enable(18), _.decodeVideoTexture && a.enable(19), _.decodeVideoTextureEmissive && a.enable(20), _.alphaToCoverage && a.enable(21), M.push(a.mask);
  }
  function y(M) {
    const _ = g[M.type];
    let A;
    if (_) {
      const F = je[_];
      A = Su.clone(F.uniforms);
    } else
      A = M.uniforms;
    return A;
  }
  function N(M, _) {
    let A;
    for (let F = 0, O = u.length; F < O; F++) {
      const G = u[F];
      if (G.cacheKey === _) {
        A = G, ++A.usedTimes;
        break;
      }
    }
    return A === void 0 && (A = new Nm(i, _, M, r), u.push(A)), A;
  }
  function R(M) {
    if (--M.usedTimes === 0) {
      const _ = u.indexOf(M);
      u[_] = u[u.length - 1], u.pop(), M.destroy();
    }
  }
  function T(M) {
    l.remove(M);
  }
  function C() {
    l.dispose();
  }
  return {
    getParameters: m,
    getProgramCacheKey: p,
    getUniforms: y,
    acquireProgram: N,
    releaseProgram: R,
    releaseShaderCache: T,
    // Exposed for resource monitoring & error feedback via renderer.info:
    programs: u,
    dispose: C
  };
}
function km() {
  let i = /* @__PURE__ */ new WeakMap();
  function t(o) {
    return i.has(o);
  }
  function e(o) {
    let a = i.get(o);
    return a === void 0 && (a = {}, i.set(o, a)), a;
  }
  function n(o) {
    i.delete(o);
  }
  function s(o, a, l) {
    i.get(o)[a] = l;
  }
  function r() {
    i = /* @__PURE__ */ new WeakMap();
  }
  return {
    has: t,
    get: e,
    remove: n,
    update: s,
    dispose: r
  };
}
function Hm(i, t) {
  return i.groupOrder !== t.groupOrder ? i.groupOrder - t.groupOrder : i.renderOrder !== t.renderOrder ? i.renderOrder - t.renderOrder : i.material.id !== t.material.id ? i.material.id - t.material.id : i.z !== t.z ? i.z - t.z : i.id - t.id;
}
function hl(i, t) {
  return i.groupOrder !== t.groupOrder ? i.groupOrder - t.groupOrder : i.renderOrder !== t.renderOrder ? i.renderOrder - t.renderOrder : i.z !== t.z ? t.z - i.z : i.id - t.id;
}
function ul() {
  const i = [];
  let t = 0;
  const e = [], n = [], s = [];
  function r() {
    t = 0, e.length = 0, n.length = 0, s.length = 0;
  }
  function o(c, f, d, g, x, m) {
    let p = i[t];
    return p === void 0 ? (p = {
      id: c.id,
      object: c,
      geometry: f,
      material: d,
      groupOrder: g,
      renderOrder: c.renderOrder,
      z: x,
      group: m
    }, i[t] = p) : (p.id = c.id, p.object = c, p.geometry = f, p.material = d, p.groupOrder = g, p.renderOrder = c.renderOrder, p.z = x, p.group = m), t++, p;
  }
  function a(c, f, d, g, x, m) {
    const p = o(c, f, d, g, x, m);
    d.transmission > 0 ? n.push(p) : d.transparent === !0 ? s.push(p) : e.push(p);
  }
  function l(c, f, d, g, x, m) {
    const p = o(c, f, d, g, x, m);
    d.transmission > 0 ? n.unshift(p) : d.transparent === !0 ? s.unshift(p) : e.unshift(p);
  }
  function h(c, f) {
    e.length > 1 && e.sort(c || Hm), n.length > 1 && n.sort(f || hl), s.length > 1 && s.sort(f || hl);
  }
  function u() {
    for (let c = t, f = i.length; c < f; c++) {
      const d = i[c];
      if (d.id === null) break;
      d.id = null, d.object = null, d.geometry = null, d.material = null, d.group = null;
    }
  }
  return {
    opaque: e,
    transmissive: n,
    transparent: s,
    init: r,
    push: a,
    unshift: l,
    finish: u,
    sort: h
  };
}
function Vm() {
  let i = /* @__PURE__ */ new WeakMap();
  function t(n, s) {
    const r = i.get(n);
    let o;
    return r === void 0 ? (o = new ul(), i.set(n, [o])) : s >= r.length ? (o = new ul(), r.push(o)) : o = r[s], o;
  }
  function e() {
    i = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: t,
    dispose: e
  };
}
function Gm() {
  const i = {};
  return {
    get: function(t) {
      if (i[t.id] !== void 0)
        return i[t.id];
      let e;
      switch (t.type) {
        case "DirectionalLight":
          e = {
            direction: new L(),
            color: new Pt()
          };
          break;
        case "SpotLight":
          e = {
            position: new L(),
            direction: new L(),
            color: new Pt(),
            distance: 0,
            coneCos: 0,
            penumbraCos: 0,
            decay: 0
          };
          break;
        case "PointLight":
          e = {
            position: new L(),
            color: new Pt(),
            distance: 0,
            decay: 0
          };
          break;
        case "HemisphereLight":
          e = {
            direction: new L(),
            skyColor: new Pt(),
            groundColor: new Pt()
          };
          break;
        case "RectAreaLight":
          e = {
            color: new Pt(),
            position: new L(),
            halfWidth: new L(),
            halfHeight: new L()
          };
          break;
      }
      return i[t.id] = e, e;
    }
  };
}
function Wm() {
  const i = {};
  return {
    get: function(t) {
      if (i[t.id] !== void 0)
        return i[t.id];
      let e;
      switch (t.type) {
        case "DirectionalLight":
          e = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new kt()
          };
          break;
        case "SpotLight":
          e = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new kt()
          };
          break;
        case "PointLight":
          e = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new kt(),
            shadowCameraNear: 1,
            shadowCameraFar: 1e3
          };
          break;
      }
      return i[t.id] = e, e;
    }
  };
}
let $m = 0;
function Xm(i, t) {
  return (t.castShadow ? 2 : 0) - (i.castShadow ? 2 : 0) + (t.map ? 1 : 0) - (i.map ? 1 : 0);
}
function qm(i) {
  const t = new Gm(), e = Wm(), n = {
    version: 0,
    hash: {
      directionalLength: -1,
      pointLength: -1,
      spotLength: -1,
      rectAreaLength: -1,
      hemiLength: -1,
      numDirectionalShadows: -1,
      numPointShadows: -1,
      numSpotShadows: -1,
      numSpotMaps: -1,
      numLightProbes: -1
    },
    ambient: [0, 0, 0],
    probe: [],
    directional: [],
    directionalShadow: [],
    directionalShadowMap: [],
    directionalShadowMatrix: [],
    spot: [],
    spotLightMap: [],
    spotShadow: [],
    spotShadowMap: [],
    spotLightMatrix: [],
    rectArea: [],
    rectAreaLTC1: null,
    rectAreaLTC2: null,
    point: [],
    pointShadow: [],
    pointShadowMap: [],
    pointShadowMatrix: [],
    hemi: [],
    numSpotLightShadowsWithMaps: 0,
    numLightProbes: 0
  };
  for (let h = 0; h < 9; h++) n.probe.push(new L());
  const s = new L(), r = new re(), o = new re();
  function a(h) {
    let u = 0, c = 0, f = 0;
    for (let M = 0; M < 9; M++) n.probe[M].set(0, 0, 0);
    let d = 0, g = 0, x = 0, m = 0, p = 0, E = 0, b = 0, y = 0, N = 0, R = 0, T = 0;
    h.sort(Xm);
    for (let M = 0, _ = h.length; M < _; M++) {
      const A = h[M], F = A.color, O = A.intensity, G = A.distance, $ = A.shadow && A.shadow.map ? A.shadow.map.texture : null;
      if (A.isAmbientLight)
        u += F.r * O, c += F.g * O, f += F.b * O;
      else if (A.isLightProbe) {
        for (let V = 0; V < 9; V++)
          n.probe[V].addScaledVector(A.sh.coefficients[V], O);
        T++;
      } else if (A.isDirectionalLight) {
        const V = t.get(A);
        if (V.color.copy(A.color).multiplyScalar(A.intensity), A.castShadow) {
          const K = A.shadow, H = e.get(A);
          H.shadowIntensity = K.intensity, H.shadowBias = K.bias, H.shadowNormalBias = K.normalBias, H.shadowRadius = K.radius, H.shadowMapSize = K.mapSize, n.directionalShadow[d] = H, n.directionalShadowMap[d] = $, n.directionalShadowMatrix[d] = A.shadow.matrix, E++;
        }
        n.directional[d] = V, d++;
      } else if (A.isSpotLight) {
        const V = t.get(A);
        V.position.setFromMatrixPosition(A.matrixWorld), V.color.copy(F).multiplyScalar(O), V.distance = G, V.coneCos = Math.cos(A.angle), V.penumbraCos = Math.cos(A.angle * (1 - A.penumbra)), V.decay = A.decay, n.spot[x] = V;
        const K = A.shadow;
        if (A.map && (n.spotLightMap[N] = A.map, N++, K.updateMatrices(A), A.castShadow && R++), n.spotLightMatrix[x] = K.matrix, A.castShadow) {
          const H = e.get(A);
          H.shadowIntensity = K.intensity, H.shadowBias = K.bias, H.shadowNormalBias = K.normalBias, H.shadowRadius = K.radius, H.shadowMapSize = K.mapSize, n.spotShadow[x] = H, n.spotShadowMap[x] = $, y++;
        }
        x++;
      } else if (A.isRectAreaLight) {
        const V = t.get(A);
        V.color.copy(F).multiplyScalar(O), V.halfWidth.set(A.width * 0.5, 0, 0), V.halfHeight.set(0, A.height * 0.5, 0), n.rectArea[m] = V, m++;
      } else if (A.isPointLight) {
        const V = t.get(A);
        if (V.color.copy(A.color).multiplyScalar(A.intensity), V.distance = A.distance, V.decay = A.decay, A.castShadow) {
          const K = A.shadow, H = e.get(A);
          H.shadowIntensity = K.intensity, H.shadowBias = K.bias, H.shadowNormalBias = K.normalBias, H.shadowRadius = K.radius, H.shadowMapSize = K.mapSize, H.shadowCameraNear = K.camera.near, H.shadowCameraFar = K.camera.far, n.pointShadow[g] = H, n.pointShadowMap[g] = $, n.pointShadowMatrix[g] = A.shadow.matrix, b++;
        }
        n.point[g] = V, g++;
      } else if (A.isHemisphereLight) {
        const V = t.get(A);
        V.skyColor.copy(A.color).multiplyScalar(O), V.groundColor.copy(A.groundColor).multiplyScalar(O), n.hemi[p] = V, p++;
      }
    }
    m > 0 && (i.has("OES_texture_float_linear") === !0 ? (n.rectAreaLTC1 = it.LTC_FLOAT_1, n.rectAreaLTC2 = it.LTC_FLOAT_2) : (n.rectAreaLTC1 = it.LTC_HALF_1, n.rectAreaLTC2 = it.LTC_HALF_2)), n.ambient[0] = u, n.ambient[1] = c, n.ambient[2] = f;
    const C = n.hash;
    (C.directionalLength !== d || C.pointLength !== g || C.spotLength !== x || C.rectAreaLength !== m || C.hemiLength !== p || C.numDirectionalShadows !== E || C.numPointShadows !== b || C.numSpotShadows !== y || C.numSpotMaps !== N || C.numLightProbes !== T) && (n.directional.length = d, n.spot.length = x, n.rectArea.length = m, n.point.length = g, n.hemi.length = p, n.directionalShadow.length = E, n.directionalShadowMap.length = E, n.pointShadow.length = b, n.pointShadowMap.length = b, n.spotShadow.length = y, n.spotShadowMap.length = y, n.directionalShadowMatrix.length = E, n.pointShadowMatrix.length = b, n.spotLightMatrix.length = y + N - R, n.spotLightMap.length = N, n.numSpotLightShadowsWithMaps = R, n.numLightProbes = T, C.directionalLength = d, C.pointLength = g, C.spotLength = x, C.rectAreaLength = m, C.hemiLength = p, C.numDirectionalShadows = E, C.numPointShadows = b, C.numSpotShadows = y, C.numSpotMaps = N, C.numLightProbes = T, n.version = $m++);
  }
  function l(h, u) {
    let c = 0, f = 0, d = 0, g = 0, x = 0;
    const m = u.matrixWorldInverse;
    for (let p = 0, E = h.length; p < E; p++) {
      const b = h[p];
      if (b.isDirectionalLight) {
        const y = n.directional[c];
        y.direction.setFromMatrixPosition(b.matrixWorld), s.setFromMatrixPosition(b.target.matrixWorld), y.direction.sub(s), y.direction.transformDirection(m), c++;
      } else if (b.isSpotLight) {
        const y = n.spot[d];
        y.position.setFromMatrixPosition(b.matrixWorld), y.position.applyMatrix4(m), y.direction.setFromMatrixPosition(b.matrixWorld), s.setFromMatrixPosition(b.target.matrixWorld), y.direction.sub(s), y.direction.transformDirection(m), d++;
      } else if (b.isRectAreaLight) {
        const y = n.rectArea[g];
        y.position.setFromMatrixPosition(b.matrixWorld), y.position.applyMatrix4(m), o.identity(), r.copy(b.matrixWorld), r.premultiply(m), o.extractRotation(r), y.halfWidth.set(b.width * 0.5, 0, 0), y.halfHeight.set(0, b.height * 0.5, 0), y.halfWidth.applyMatrix4(o), y.halfHeight.applyMatrix4(o), g++;
      } else if (b.isPointLight) {
        const y = n.point[f];
        y.position.setFromMatrixPosition(b.matrixWorld), y.position.applyMatrix4(m), f++;
      } else if (b.isHemisphereLight) {
        const y = n.hemi[x];
        y.direction.setFromMatrixPosition(b.matrixWorld), y.direction.transformDirection(m), x++;
      }
    }
  }
  return {
    setup: a,
    setupView: l,
    state: n
  };
}
function dl(i) {
  const t = new qm(i), e = [], n = [];
  function s(u) {
    h.camera = u, e.length = 0, n.length = 0;
  }
  function r(u) {
    e.push(u);
  }
  function o(u) {
    n.push(u);
  }
  function a() {
    t.setup(e);
  }
  function l(u) {
    t.setupView(e, u);
  }
  const h = {
    lightsArray: e,
    shadowsArray: n,
    camera: null,
    lights: t,
    transmissionRenderTarget: {}
  };
  return {
    init: s,
    state: h,
    setupLights: a,
    setupLightsView: l,
    pushLight: r,
    pushShadow: o
  };
}
function Ym(i) {
  let t = /* @__PURE__ */ new WeakMap();
  function e(s, r = 0) {
    const o = t.get(s);
    let a;
    return o === void 0 ? (a = new dl(i), t.set(s, [a])) : r >= o.length ? (a = new dl(i), o.push(a)) : a = o[r], a;
  }
  function n() {
    t = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: e,
    dispose: n
  };
}
class Zm extends Ui {
  static get type() {
    return "MeshDepthMaterial";
  }
  constructor(t) {
    super(), this.isMeshDepthMaterial = !0, this.depthPacking = Ch, this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.wireframe = !1, this.wireframeLinewidth = 1, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.depthPacking = t.depthPacking, this.map = t.map, this.alphaMap = t.alphaMap, this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this;
  }
}
class jm extends Ui {
  static get type() {
    return "MeshDistanceMaterial";
  }
  constructor(t) {
    super(), this.isMeshDistanceMaterial = !0, this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.map = t.map, this.alphaMap = t.alphaMap, this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this;
  }
}
const Km = `void main() {
	gl_Position = vec4( position, 1.0 );
}`, Jm = `uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;
function Qm(i, t, e) {
  let n = new Wo();
  const s = new kt(), r = new kt(), o = new Qt(), a = new Zm({ depthPacking: Ph }), l = new jm(), h = {}, u = e.maxTextureSize, c = { [Pn]: Ce, [Ce]: Pn, [hn]: hn }, f = new Ln({
    defines: {
      VSM_SAMPLES: 8
    },
    uniforms: {
      shadow_pass: { value: null },
      resolution: { value: new kt() },
      radius: { value: 4 }
    },
    vertexShader: Km,
    fragmentShader: Jm
  }), d = f.clone();
  d.defines.HORIZONTAL_PASS = 1;
  const g = new ze();
  g.setAttribute(
    "position",
    new Ye(
      new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]),
      3
    )
  );
  const x = new ye(g, f), m = this;
  this.enabled = !1, this.autoUpdate = !0, this.needsUpdate = !1, this.type = Hl;
  let p = this.type;
  this.render = function(R, T, C) {
    if (m.enabled === !1 || m.autoUpdate === !1 && m.needsUpdate === !1 || R.length === 0) return;
    const M = i.getRenderTarget(), _ = i.getActiveCubeFace(), A = i.getActiveMipmapLevel(), F = i.state;
    F.setBlending(An), F.buffers.color.setClear(1, 1, 1, 1), F.buffers.depth.setTest(!0), F.setScissorTest(!1);
    const O = p !== ln && this.type === ln, G = p === ln && this.type !== ln;
    for (let $ = 0, V = R.length; $ < V; $++) {
      const K = R[$], H = K.shadow;
      if (H === void 0) {
        console.warn("THREE.WebGLShadowMap:", K, "has no shadow.");
        continue;
      }
      if (H.autoUpdate === !1 && H.needsUpdate === !1) continue;
      s.copy(H.mapSize);
      const st = H.getFrameExtents();
      if (s.multiply(st), r.copy(H.mapSize), (s.x > u || s.y > u) && (s.x > u && (r.x = Math.floor(u / st.x), s.x = r.x * st.x, H.mapSize.x = r.x), s.y > u && (r.y = Math.floor(u / st.y), s.y = r.y * st.y, H.mapSize.y = r.y)), H.map === null || O === !0 || G === !0) {
        const yt = this.type !== ln ? { minFilter: qe, magFilter: qe } : {};
        H.map !== null && H.map.dispose(), H.map = new Kn(s.x, s.y, yt), H.map.texture.name = K.name + ".shadowMap", H.camera.updateProjectionMatrix();
      }
      i.setRenderTarget(H.map), i.clear();
      const ut = H.getViewportCount();
      for (let yt = 0; yt < ut; yt++) {
        const Bt = H.getViewport(yt);
        o.set(
          r.x * Bt.x,
          r.y * Bt.y,
          r.x * Bt.z,
          r.y * Bt.w
        ), F.viewport(o), H.updateMatrices(K, yt), n = H.getFrustum(), y(T, C, H.camera, K, this.type);
      }
      H.isPointLightShadow !== !0 && this.type === ln && E(H, C), H.needsUpdate = !1;
    }
    p = this.type, m.needsUpdate = !1, i.setRenderTarget(M, _, A);
  };
  function E(R, T) {
    const C = t.update(x);
    f.defines.VSM_SAMPLES !== R.blurSamples && (f.defines.VSM_SAMPLES = R.blurSamples, d.defines.VSM_SAMPLES = R.blurSamples, f.needsUpdate = !0, d.needsUpdate = !0), R.mapPass === null && (R.mapPass = new Kn(s.x, s.y)), f.uniforms.shadow_pass.value = R.map.texture, f.uniforms.resolution.value = R.mapSize, f.uniforms.radius.value = R.radius, i.setRenderTarget(R.mapPass), i.clear(), i.renderBufferDirect(T, null, C, f, x, null), d.uniforms.shadow_pass.value = R.mapPass.texture, d.uniforms.resolution.value = R.mapSize, d.uniforms.radius.value = R.radius, i.setRenderTarget(R.map), i.clear(), i.renderBufferDirect(T, null, C, d, x, null);
  }
  function b(R, T, C, M) {
    let _ = null;
    const A = C.isPointLight === !0 ? R.customDistanceMaterial : R.customDepthMaterial;
    if (A !== void 0)
      _ = A;
    else if (_ = C.isPointLight === !0 ? l : a, i.localClippingEnabled && T.clipShadows === !0 && Array.isArray(T.clippingPlanes) && T.clippingPlanes.length !== 0 || T.displacementMap && T.displacementScale !== 0 || T.alphaMap && T.alphaTest > 0 || T.map && T.alphaTest > 0) {
      const F = _.uuid, O = T.uuid;
      let G = h[F];
      G === void 0 && (G = {}, h[F] = G);
      let $ = G[O];
      $ === void 0 && ($ = _.clone(), G[O] = $, T.addEventListener("dispose", N)), _ = $;
    }
    if (_.visible = T.visible, _.wireframe = T.wireframe, M === ln ? _.side = T.shadowSide !== null ? T.shadowSide : T.side : _.side = T.shadowSide !== null ? T.shadowSide : c[T.side], _.alphaMap = T.alphaMap, _.alphaTest = T.alphaTest, _.map = T.map, _.clipShadows = T.clipShadows, _.clippingPlanes = T.clippingPlanes, _.clipIntersection = T.clipIntersection, _.displacementMap = T.displacementMap, _.displacementScale = T.displacementScale, _.displacementBias = T.displacementBias, _.wireframeLinewidth = T.wireframeLinewidth, _.linewidth = T.linewidth, C.isPointLight === !0 && _.isMeshDistanceMaterial === !0) {
      const F = i.properties.get(_);
      F.light = C;
    }
    return _;
  }
  function y(R, T, C, M, _) {
    if (R.visible === !1) return;
    if (R.layers.test(T.layers) && (R.isMesh || R.isLine || R.isPoints) && (R.castShadow || R.receiveShadow && _ === ln) && (!R.frustumCulled || n.intersectsObject(R))) {
      R.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse, R.matrixWorld);
      const O = t.update(R), G = R.material;
      if (Array.isArray(G)) {
        const $ = O.groups;
        for (let V = 0, K = $.length; V < K; V++) {
          const H = $[V], st = G[H.materialIndex];
          if (st && st.visible) {
            const ut = b(R, st, M, _);
            R.onBeforeShadow(i, R, T, C, O, ut, H), i.renderBufferDirect(C, null, O, ut, R, H), R.onAfterShadow(i, R, T, C, O, ut, H);
          }
        }
      } else if (G.visible) {
        const $ = b(R, G, M, _);
        R.onBeforeShadow(i, R, T, C, O, $, null), i.renderBufferDirect(C, null, O, $, R, null), R.onAfterShadow(i, R, T, C, O, $, null);
      }
    }
    const F = R.children;
    for (let O = 0, G = F.length; O < G; O++)
      y(F[O], T, C, M, _);
  }
  function N(R) {
    R.target.removeEventListener("dispose", N);
    for (const C in h) {
      const M = h[C], _ = R.target.uuid;
      _ in M && (M[_].dispose(), delete M[_]);
    }
  }
}
const tg = {
  [Vr]: Gr,
  [Wr]: qr,
  [$r]: Yr,
  [Ei]: Xr,
  [Gr]: Vr,
  [qr]: Wr,
  [Yr]: $r,
  [Xr]: Ei
};
function eg(i, t) {
  function e() {
    let P = !1;
    const rt = new Qt();
    let W = null;
    const Z = new Qt(0, 0, 0, 0);
    return {
      setMask: function(ht) {
        W !== ht && !P && (i.colorMask(ht, ht, ht, ht), W = ht);
      },
      setLocked: function(ht) {
        P = ht;
      },
      setClear: function(ht, lt, Dt, ae, _e) {
        _e === !0 && (ht *= ae, lt *= ae, Dt *= ae), rt.set(ht, lt, Dt, ae), Z.equals(rt) === !1 && (i.clearColor(ht, lt, Dt, ae), Z.copy(rt));
      },
      reset: function() {
        P = !1, W = null, Z.set(-1, 0, 0, 0);
      }
    };
  }
  function n() {
    let P = !1, rt = !1, W = null, Z = null, ht = null;
    return {
      setReversed: function(lt) {
        if (rt !== lt) {
          const Dt = t.get("EXT_clip_control");
          rt ? Dt.clipControlEXT(Dt.LOWER_LEFT_EXT, Dt.ZERO_TO_ONE_EXT) : Dt.clipControlEXT(Dt.LOWER_LEFT_EXT, Dt.NEGATIVE_ONE_TO_ONE_EXT);
          const ae = ht;
          ht = null, this.setClear(ae);
        }
        rt = lt;
      },
      getReversed: function() {
        return rt;
      },
      setTest: function(lt) {
        lt ? ot(i.DEPTH_TEST) : Tt(i.DEPTH_TEST);
      },
      setMask: function(lt) {
        W !== lt && !P && (i.depthMask(lt), W = lt);
      },
      setFunc: function(lt) {
        if (rt && (lt = tg[lt]), Z !== lt) {
          switch (lt) {
            case Vr:
              i.depthFunc(i.NEVER);
              break;
            case Gr:
              i.depthFunc(i.ALWAYS);
              break;
            case Wr:
              i.depthFunc(i.LESS);
              break;
            case Ei:
              i.depthFunc(i.LEQUAL);
              break;
            case $r:
              i.depthFunc(i.EQUAL);
              break;
            case Xr:
              i.depthFunc(i.GEQUAL);
              break;
            case qr:
              i.depthFunc(i.GREATER);
              break;
            case Yr:
              i.depthFunc(i.NOTEQUAL);
              break;
            default:
              i.depthFunc(i.LEQUAL);
          }
          Z = lt;
        }
      },
      setLocked: function(lt) {
        P = lt;
      },
      setClear: function(lt) {
        ht !== lt && (rt && (lt = 1 - lt), i.clearDepth(lt), ht = lt);
      },
      reset: function() {
        P = !1, W = null, Z = null, ht = null, rt = !1;
      }
    };
  }
  function s() {
    let P = !1, rt = null, W = null, Z = null, ht = null, lt = null, Dt = null, ae = null, _e = null;
    return {
      setTest: function(Kt) {
        P || (Kt ? ot(i.STENCIL_TEST) : Tt(i.STENCIL_TEST));
      },
      setMask: function(Kt) {
        rt !== Kt && !P && (i.stencilMask(Kt), rt = Kt);
      },
      setFunc: function(Kt, ke, tn) {
        (W !== Kt || Z !== ke || ht !== tn) && (i.stencilFunc(Kt, ke, tn), W = Kt, Z = ke, ht = tn);
      },
      setOp: function(Kt, ke, tn) {
        (lt !== Kt || Dt !== ke || ae !== tn) && (i.stencilOp(Kt, ke, tn), lt = Kt, Dt = ke, ae = tn);
      },
      setLocked: function(Kt) {
        P = Kt;
      },
      setClear: function(Kt) {
        _e !== Kt && (i.clearStencil(Kt), _e = Kt);
      },
      reset: function() {
        P = !1, rt = null, W = null, Z = null, ht = null, lt = null, Dt = null, ae = null, _e = null;
      }
    };
  }
  const r = new e(), o = new n(), a = new s(), l = /* @__PURE__ */ new WeakMap(), h = /* @__PURE__ */ new WeakMap();
  let u = {}, c = {}, f = /* @__PURE__ */ new WeakMap(), d = [], g = null, x = !1, m = null, p = null, E = null, b = null, y = null, N = null, R = null, T = new Pt(0, 0, 0), C = 0, M = !1, _ = null, A = null, F = null, O = null, G = null;
  const $ = i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
  let V = !1, K = 0;
  const H = i.getParameter(i.VERSION);
  H.indexOf("WebGL") !== -1 ? (K = parseFloat(/^WebGL (\d)/.exec(H)[1]), V = K >= 1) : H.indexOf("OpenGL ES") !== -1 && (K = parseFloat(/^OpenGL ES (\d)/.exec(H)[1]), V = K >= 2);
  let st = null, ut = {};
  const yt = i.getParameter(i.SCISSOR_BOX), Bt = i.getParameter(i.VIEWPORT), jt = new Qt().fromArray(yt), q = new Qt().fromArray(Bt);
  function nt(P, rt, W, Z) {
    const ht = new Uint8Array(4), lt = i.createTexture();
    i.bindTexture(P, lt), i.texParameteri(P, i.TEXTURE_MIN_FILTER, i.NEAREST), i.texParameteri(P, i.TEXTURE_MAG_FILTER, i.NEAREST);
    for (let Dt = 0; Dt < W; Dt++)
      P === i.TEXTURE_3D || P === i.TEXTURE_2D_ARRAY ? i.texImage3D(rt, 0, i.RGBA, 1, 1, Z, 0, i.RGBA, i.UNSIGNED_BYTE, ht) : i.texImage2D(rt + Dt, 0, i.RGBA, 1, 1, 0, i.RGBA, i.UNSIGNED_BYTE, ht);
    return lt;
  }
  const vt = {};
  vt[i.TEXTURE_2D] = nt(i.TEXTURE_2D, i.TEXTURE_2D, 1), vt[i.TEXTURE_CUBE_MAP] = nt(i.TEXTURE_CUBE_MAP, i.TEXTURE_CUBE_MAP_POSITIVE_X, 6), vt[i.TEXTURE_2D_ARRAY] = nt(i.TEXTURE_2D_ARRAY, i.TEXTURE_2D_ARRAY, 1, 1), vt[i.TEXTURE_3D] = nt(i.TEXTURE_3D, i.TEXTURE_3D, 1, 1), r.setClear(0, 0, 0, 1), o.setClear(1), a.setClear(0), ot(i.DEPTH_TEST), o.setFunc(Ei), Ht(!1), Vt(ga), ot(i.CULL_FACE), I(An);
  function ot(P) {
    u[P] !== !0 && (i.enable(P), u[P] = !0);
  }
  function Tt(P) {
    u[P] !== !1 && (i.disable(P), u[P] = !1);
  }
  function Lt(P, rt) {
    return c[P] !== rt ? (i.bindFramebuffer(P, rt), c[P] = rt, P === i.DRAW_FRAMEBUFFER && (c[i.FRAMEBUFFER] = rt), P === i.FRAMEBUFFER && (c[i.DRAW_FRAMEBUFFER] = rt), !0) : !1;
  }
  function zt(P, rt) {
    let W = d, Z = !1;
    if (P) {
      W = f.get(rt), W === void 0 && (W = [], f.set(rt, W));
      const ht = P.textures;
      if (W.length !== ht.length || W[0] !== i.COLOR_ATTACHMENT0) {
        for (let lt = 0, Dt = ht.length; lt < Dt; lt++)
          W[lt] = i.COLOR_ATTACHMENT0 + lt;
        W.length = ht.length, Z = !0;
      }
    } else
      W[0] !== i.BACK && (W[0] = i.BACK, Z = !0);
    Z && i.drawBuffers(W);
  }
  function oe(P) {
    return g !== P ? (i.useProgram(P), g = P, !0) : !1;
  }
  const Wt = {
    [Gn]: i.FUNC_ADD,
    [ih]: i.FUNC_SUBTRACT,
    [sh]: i.FUNC_REVERSE_SUBTRACT
  };
  Wt[rh] = i.MIN, Wt[oh] = i.MAX;
  const ce = {
    [ah]: i.ZERO,
    [lh]: i.ONE,
    [ch]: i.SRC_COLOR,
    [kr]: i.SRC_ALPHA,
    [mh]: i.SRC_ALPHA_SATURATE,
    [fh]: i.DST_COLOR,
    [uh]: i.DST_ALPHA,
    [hh]: i.ONE_MINUS_SRC_COLOR,
    [Hr]: i.ONE_MINUS_SRC_ALPHA,
    [ph]: i.ONE_MINUS_DST_COLOR,
    [dh]: i.ONE_MINUS_DST_ALPHA,
    [gh]: i.CONSTANT_COLOR,
    [_h]: i.ONE_MINUS_CONSTANT_COLOR,
    [xh]: i.CONSTANT_ALPHA,
    [vh]: i.ONE_MINUS_CONSTANT_ALPHA
  };
  function I(P, rt, W, Z, ht, lt, Dt, ae, _e, Kt) {
    if (P === An) {
      x === !0 && (Tt(i.BLEND), x = !1);
      return;
    }
    if (x === !1 && (ot(i.BLEND), x = !0), P !== nh) {
      if (P !== m || Kt !== M) {
        if ((p !== Gn || y !== Gn) && (i.blendEquation(i.FUNC_ADD), p = Gn, y = Gn), Kt)
          switch (P) {
            case xi:
              i.blendFuncSeparate(i.ONE, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA);
              break;
            case zr:
              i.blendFunc(i.ONE, i.ONE);
              break;
            case _a:
              i.blendFuncSeparate(i.ZERO, i.ONE_MINUS_SRC_COLOR, i.ZERO, i.ONE);
              break;
            case xa:
              i.blendFuncSeparate(i.ZERO, i.SRC_COLOR, i.ZERO, i.SRC_ALPHA);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", P);
              break;
          }
        else
          switch (P) {
            case xi:
              i.blendFuncSeparate(i.SRC_ALPHA, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA);
              break;
            case zr:
              i.blendFunc(i.SRC_ALPHA, i.ONE);
              break;
            case _a:
              i.blendFuncSeparate(i.ZERO, i.ONE_MINUS_SRC_COLOR, i.ZERO, i.ONE);
              break;
            case xa:
              i.blendFunc(i.ZERO, i.SRC_COLOR);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", P);
              break;
          }
        E = null, b = null, N = null, R = null, T.set(0, 0, 0), C = 0, m = P, M = Kt;
      }
      return;
    }
    ht = ht || rt, lt = lt || W, Dt = Dt || Z, (rt !== p || ht !== y) && (i.blendEquationSeparate(Wt[rt], Wt[ht]), p = rt, y = ht), (W !== E || Z !== b || lt !== N || Dt !== R) && (i.blendFuncSeparate(ce[W], ce[Z], ce[lt], ce[Dt]), E = W, b = Z, N = lt, R = Dt), (ae.equals(T) === !1 || _e !== C) && (i.blendColor(ae.r, ae.g, ae.b, _e), T.copy(ae), C = _e), m = P, M = !1;
  }
  function Ne(P, rt) {
    P.side === hn ? Tt(i.CULL_FACE) : ot(i.CULL_FACE);
    let W = P.side === Ce;
    rt && (W = !W), Ht(W), P.blending === xi && P.transparent === !1 ? I(An) : I(P.blending, P.blendEquation, P.blendSrc, P.blendDst, P.blendEquationAlpha, P.blendSrcAlpha, P.blendDstAlpha, P.blendColor, P.blendAlpha, P.premultipliedAlpha), o.setFunc(P.depthFunc), o.setTest(P.depthTest), o.setMask(P.depthWrite), r.setMask(P.colorWrite);
    const Z = P.stencilWrite;
    a.setTest(Z), Z && (a.setMask(P.stencilWriteMask), a.setFunc(P.stencilFunc, P.stencilRef, P.stencilFuncMask), a.setOp(P.stencilFail, P.stencilZFail, P.stencilZPass)), ne(P.polygonOffset, P.polygonOffsetFactor, P.polygonOffsetUnits), P.alphaToCoverage === !0 ? ot(i.SAMPLE_ALPHA_TO_COVERAGE) : Tt(i.SAMPLE_ALPHA_TO_COVERAGE);
  }
  function Ht(P) {
    _ !== P && (P ? i.frontFace(i.CW) : i.frontFace(i.CCW), _ = P);
  }
  function Vt(P) {
    P !== th ? (ot(i.CULL_FACE), P !== A && (P === ga ? i.cullFace(i.BACK) : P === eh ? i.cullFace(i.FRONT) : i.cullFace(i.FRONT_AND_BACK))) : Tt(i.CULL_FACE), A = P;
  }
  function Et(P) {
    P !== F && (V && i.lineWidth(P), F = P);
  }
  function ne(P, rt, W) {
    P ? (ot(i.POLYGON_OFFSET_FILL), (O !== rt || G !== W) && (i.polygonOffset(rt, W), O = rt, G = W)) : Tt(i.POLYGON_OFFSET_FILL);
  }
  function bt(P) {
    P ? ot(i.SCISSOR_TEST) : Tt(i.SCISSOR_TEST);
  }
  function w(P) {
    P === void 0 && (P = i.TEXTURE0 + $ - 1), st !== P && (i.activeTexture(P), st = P);
  }
  function v(P, rt, W) {
    W === void 0 && (st === null ? W = i.TEXTURE0 + $ - 1 : W = st);
    let Z = ut[W];
    Z === void 0 && (Z = { type: void 0, texture: void 0 }, ut[W] = Z), (Z.type !== P || Z.texture !== rt) && (st !== W && (i.activeTexture(W), st = W), i.bindTexture(P, rt || vt[P]), Z.type = P, Z.texture = rt);
  }
  function B() {
    const P = ut[st];
    P !== void 0 && P.type !== void 0 && (i.bindTexture(P.type, null), P.type = void 0, P.texture = void 0);
  }
  function Y() {
    try {
      i.compressedTexImage2D.apply(i, arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function j() {
    try {
      i.compressedTexImage3D.apply(i, arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function X() {
    try {
      i.texSubImage2D.apply(i, arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function Mt() {
    try {
      i.texSubImage3D.apply(i, arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function at() {
    try {
      i.compressedTexSubImage2D.apply(i, arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function ft() {
    try {
      i.compressedTexSubImage3D.apply(i, arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function $t() {
    try {
      i.texStorage2D.apply(i, arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function tt() {
    try {
      i.texStorage3D.apply(i, arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function pt() {
    try {
      i.texImage2D.apply(i, arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function wt() {
    try {
      i.texImage3D.apply(i, arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function At(P) {
    jt.equals(P) === !1 && (i.scissor(P.x, P.y, P.z, P.w), jt.copy(P));
  }
  function mt(P) {
    q.equals(P) === !1 && (i.viewport(P.x, P.y, P.z, P.w), q.copy(P));
  }
  function Gt(P, rt) {
    let W = h.get(rt);
    W === void 0 && (W = /* @__PURE__ */ new WeakMap(), h.set(rt, W));
    let Z = W.get(P);
    Z === void 0 && (Z = i.getUniformBlockIndex(rt, P.name), W.set(P, Z));
  }
  function Nt(P, rt) {
    const Z = h.get(rt).get(P);
    l.get(rt) !== Z && (i.uniformBlockBinding(rt, Z, P.__bindingPointIndex), l.set(rt, Z));
  }
  function te() {
    i.disable(i.BLEND), i.disable(i.CULL_FACE), i.disable(i.DEPTH_TEST), i.disable(i.POLYGON_OFFSET_FILL), i.disable(i.SCISSOR_TEST), i.disable(i.STENCIL_TEST), i.disable(i.SAMPLE_ALPHA_TO_COVERAGE), i.blendEquation(i.FUNC_ADD), i.blendFunc(i.ONE, i.ZERO), i.blendFuncSeparate(i.ONE, i.ZERO, i.ONE, i.ZERO), i.blendColor(0, 0, 0, 0), i.colorMask(!0, !0, !0, !0), i.clearColor(0, 0, 0, 0), i.depthMask(!0), i.depthFunc(i.LESS), o.setReversed(!1), i.clearDepth(1), i.stencilMask(4294967295), i.stencilFunc(i.ALWAYS, 0, 4294967295), i.stencilOp(i.KEEP, i.KEEP, i.KEEP), i.clearStencil(0), i.cullFace(i.BACK), i.frontFace(i.CCW), i.polygonOffset(0, 0), i.activeTexture(i.TEXTURE0), i.bindFramebuffer(i.FRAMEBUFFER, null), i.bindFramebuffer(i.DRAW_FRAMEBUFFER, null), i.bindFramebuffer(i.READ_FRAMEBUFFER, null), i.useProgram(null), i.lineWidth(1), i.scissor(0, 0, i.canvas.width, i.canvas.height), i.viewport(0, 0, i.canvas.width, i.canvas.height), u = {}, st = null, ut = {}, c = {}, f = /* @__PURE__ */ new WeakMap(), d = [], g = null, x = !1, m = null, p = null, E = null, b = null, y = null, N = null, R = null, T = new Pt(0, 0, 0), C = 0, M = !1, _ = null, A = null, F = null, O = null, G = null, jt.set(0, 0, i.canvas.width, i.canvas.height), q.set(0, 0, i.canvas.width, i.canvas.height), r.reset(), o.reset(), a.reset();
  }
  return {
    buffers: {
      color: r,
      depth: o,
      stencil: a
    },
    enable: ot,
    disable: Tt,
    bindFramebuffer: Lt,
    drawBuffers: zt,
    useProgram: oe,
    setBlending: I,
    setMaterial: Ne,
    setFlipSided: Ht,
    setCullFace: Vt,
    setLineWidth: Et,
    setPolygonOffset: ne,
    setScissorTest: bt,
    activeTexture: w,
    bindTexture: v,
    unbindTexture: B,
    compressedTexImage2D: Y,
    compressedTexImage3D: j,
    texImage2D: pt,
    texImage3D: wt,
    updateUBOMapping: Gt,
    uniformBlockBinding: Nt,
    texStorage2D: $t,
    texStorage3D: tt,
    texSubImage2D: X,
    texSubImage3D: Mt,
    compressedTexSubImage2D: at,
    compressedTexSubImage3D: ft,
    scissor: At,
    viewport: mt,
    reset: te
  };
}
function fl(i, t, e, n) {
  const s = ng(n);
  switch (e) {
    // https://registry.khronos.org/OpenGL-Refpages/es3.0/html/glTexImage2D.xhtml
    case Zl:
      return i * t;
    case Kl:
      return i * t;
    case Jl:
      return i * t * 2;
    case Ql:
      return i * t / s.components * s.byteLength;
    case Bo:
      return i * t / s.components * s.byteLength;
    case tc:
      return i * t * 2 / s.components * s.byteLength;
    case zo:
      return i * t * 2 / s.components * s.byteLength;
    case jl:
      return i * t * 3 / s.components * s.byteLength;
    case Xe:
      return i * t * 4 / s.components * s.byteLength;
    case ko:
      return i * t * 4 / s.components * s.byteLength;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_s3tc_srgb/
    case Bs:
    case zs:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 8;
    case ks:
    case Hs:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 16;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_pvrtc/
    case Qr:
    case eo:
      return Math.max(i, 16) * Math.max(t, 8) / 4;
    case Jr:
    case to:
      return Math.max(i, 8) * Math.max(t, 8) / 2;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_etc/
    case no:
    case io:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 8;
    case so:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 16;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_astc/
    case ro:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 16;
    case oo:
      return Math.floor((i + 4) / 5) * Math.floor((t + 3) / 4) * 16;
    case ao:
      return Math.floor((i + 4) / 5) * Math.floor((t + 4) / 5) * 16;
    case lo:
      return Math.floor((i + 5) / 6) * Math.floor((t + 4) / 5) * 16;
    case co:
      return Math.floor((i + 5) / 6) * Math.floor((t + 5) / 6) * 16;
    case ho:
      return Math.floor((i + 7) / 8) * Math.floor((t + 4) / 5) * 16;
    case uo:
      return Math.floor((i + 7) / 8) * Math.floor((t + 5) / 6) * 16;
    case fo:
      return Math.floor((i + 7) / 8) * Math.floor((t + 7) / 8) * 16;
    case po:
      return Math.floor((i + 9) / 10) * Math.floor((t + 4) / 5) * 16;
    case mo:
      return Math.floor((i + 9) / 10) * Math.floor((t + 5) / 6) * 16;
    case go:
      return Math.floor((i + 9) / 10) * Math.floor((t + 7) / 8) * 16;
    case _o:
      return Math.floor((i + 9) / 10) * Math.floor((t + 9) / 10) * 16;
    case xo:
      return Math.floor((i + 11) / 12) * Math.floor((t + 9) / 10) * 16;
    case vo:
      return Math.floor((i + 11) / 12) * Math.floor((t + 11) / 12) * 16;
    // https://registry.khronos.org/webgl/extensions/EXT_texture_compression_bptc/
    case Vs:
    case Mo:
    case So:
      return Math.ceil(i / 4) * Math.ceil(t / 4) * 16;
    // https://registry.khronos.org/webgl/extensions/EXT_texture_compression_rgtc/
    case ec:
    case yo:
      return Math.ceil(i / 4) * Math.ceil(t / 4) * 8;
    case bo:
    case Eo:
      return Math.ceil(i / 4) * Math.ceil(t / 4) * 16;
  }
  throw new Error(
    `Unable to determine texture byte length for ${e} format.`
  );
}
function ng(i) {
  switch (i) {
    case mn:
    case Xl:
      return { byteLength: 1, components: 1 };
    case is:
    case ql:
    case os:
      return { byteLength: 2, components: 1 };
    case Fo:
    case Oo:
      return { byteLength: 2, components: 4 };
    case jn:
    case No:
    case un:
      return { byteLength: 4, components: 1 };
    case Yl:
      return { byteLength: 4, components: 3 };
  }
  throw new Error(`Unknown texture type ${i}.`);
}
function ig(i, t, e, n, s, r, o) {
  const a = t.has("WEBGL_multisampled_render_to_texture") ? t.get("WEBGL_multisampled_render_to_texture") : null, l = typeof navigator > "u" ? !1 : /OculusBrowser/g.test(navigator.userAgent), h = new kt(), u = /* @__PURE__ */ new WeakMap();
  let c;
  const f = /* @__PURE__ */ new WeakMap();
  let d = !1;
  try {
    d = typeof OffscreenCanvas < "u" && new OffscreenCanvas(1, 1).getContext("2d") !== null;
  } catch {
  }
  function g(w, v) {
    return d ? (
      // eslint-disable-next-line compat/compat
      new OffscreenCanvas(w, v)
    ) : Ys("canvas");
  }
  function x(w, v, B) {
    let Y = 1;
    const j = bt(w);
    if ((j.width > B || j.height > B) && (Y = B / Math.max(j.width, j.height)), Y < 1)
      if (typeof HTMLImageElement < "u" && w instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && w instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && w instanceof ImageBitmap || typeof VideoFrame < "u" && w instanceof VideoFrame) {
        const X = Math.floor(Y * j.width), Mt = Math.floor(Y * j.height);
        c === void 0 && (c = g(X, Mt));
        const at = v ? g(X, Mt) : c;
        return at.width = X, at.height = Mt, at.getContext("2d").drawImage(w, 0, 0, X, Mt), console.warn("THREE.WebGLRenderer: Texture has been resized from (" + j.width + "x" + j.height + ") to (" + X + "x" + Mt + ")."), at;
      } else
        return "data" in w && console.warn("THREE.WebGLRenderer: Image in DataTexture is too big (" + j.width + "x" + j.height + ")."), w;
    return w;
  }
  function m(w) {
    return w.generateMipmaps;
  }
  function p(w) {
    i.generateMipmap(w);
  }
  function E(w) {
    return w.isWebGLCubeRenderTarget ? i.TEXTURE_CUBE_MAP : w.isWebGL3DRenderTarget ? i.TEXTURE_3D : w.isWebGLArrayRenderTarget || w.isCompressedArrayTexture ? i.TEXTURE_2D_ARRAY : i.TEXTURE_2D;
  }
  function b(w, v, B, Y, j = !1) {
    if (w !== null) {
      if (i[w] !== void 0) return i[w];
      console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '" + w + "'");
    }
    let X = v;
    if (v === i.RED && (B === i.FLOAT && (X = i.R32F), B === i.HALF_FLOAT && (X = i.R16F), B === i.UNSIGNED_BYTE && (X = i.R8)), v === i.RED_INTEGER && (B === i.UNSIGNED_BYTE && (X = i.R8UI), B === i.UNSIGNED_SHORT && (X = i.R16UI), B === i.UNSIGNED_INT && (X = i.R32UI), B === i.BYTE && (X = i.R8I), B === i.SHORT && (X = i.R16I), B === i.INT && (X = i.R32I)), v === i.RG && (B === i.FLOAT && (X = i.RG32F), B === i.HALF_FLOAT && (X = i.RG16F), B === i.UNSIGNED_BYTE && (X = i.RG8)), v === i.RG_INTEGER && (B === i.UNSIGNED_BYTE && (X = i.RG8UI), B === i.UNSIGNED_SHORT && (X = i.RG16UI), B === i.UNSIGNED_INT && (X = i.RG32UI), B === i.BYTE && (X = i.RG8I), B === i.SHORT && (X = i.RG16I), B === i.INT && (X = i.RG32I)), v === i.RGB_INTEGER && (B === i.UNSIGNED_BYTE && (X = i.RGB8UI), B === i.UNSIGNED_SHORT && (X = i.RGB16UI), B === i.UNSIGNED_INT && (X = i.RGB32UI), B === i.BYTE && (X = i.RGB8I), B === i.SHORT && (X = i.RGB16I), B === i.INT && (X = i.RGB32I)), v === i.RGBA_INTEGER && (B === i.UNSIGNED_BYTE && (X = i.RGBA8UI), B === i.UNSIGNED_SHORT && (X = i.RGBA16UI), B === i.UNSIGNED_INT && (X = i.RGBA32UI), B === i.BYTE && (X = i.RGBA8I), B === i.SHORT && (X = i.RGBA16I), B === i.INT && (X = i.RGBA32I)), v === i.RGB && B === i.UNSIGNED_INT_5_9_9_9_REV && (X = i.RGB9_E5), v === i.RGBA) {
      const Mt = j ? Qs : Xt.getTransfer(Y);
      B === i.FLOAT && (X = i.RGBA32F), B === i.HALF_FLOAT && (X = i.RGBA16F), B === i.UNSIGNED_BYTE && (X = Mt === Jt ? i.SRGB8_ALPHA8 : i.RGBA8), B === i.UNSIGNED_SHORT_4_4_4_4 && (X = i.RGBA4), B === i.UNSIGNED_SHORT_5_5_5_1 && (X = i.RGB5_A1);
    }
    return (X === i.R16F || X === i.R32F || X === i.RG16F || X === i.RG32F || X === i.RGBA16F || X === i.RGBA32F) && t.get("EXT_color_buffer_float"), X;
  }
  function y(w, v) {
    let B;
    return w ? v === null || v === jn || v === Ai ? B = i.DEPTH24_STENCIL8 : v === un ? B = i.DEPTH32F_STENCIL8 : v === is && (B = i.DEPTH24_STENCIL8, console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")) : v === null || v === jn || v === Ai ? B = i.DEPTH_COMPONENT24 : v === un ? B = i.DEPTH_COMPONENT32F : v === is && (B = i.DEPTH_COMPONENT16), B;
  }
  function N(w, v) {
    return m(w) === !0 || w.isFramebufferTexture && w.minFilter !== qe && w.minFilter !== Ke ? Math.log2(Math.max(v.width, v.height)) + 1 : w.mipmaps !== void 0 && w.mipmaps.length > 0 ? w.mipmaps.length : w.isCompressedTexture && Array.isArray(w.image) ? v.mipmaps.length : 1;
  }
  function R(w) {
    const v = w.target;
    v.removeEventListener("dispose", R), C(v), v.isVideoTexture && u.delete(v);
  }
  function T(w) {
    const v = w.target;
    v.removeEventListener("dispose", T), _(v);
  }
  function C(w) {
    const v = n.get(w);
    if (v.__webglInit === void 0) return;
    const B = w.source, Y = f.get(B);
    if (Y) {
      const j = Y[v.__cacheKey];
      j.usedTimes--, j.usedTimes === 0 && M(w), Object.keys(Y).length === 0 && f.delete(B);
    }
    n.remove(w);
  }
  function M(w) {
    const v = n.get(w);
    i.deleteTexture(v.__webglTexture);
    const B = w.source, Y = f.get(B);
    delete Y[v.__cacheKey], o.memory.textures--;
  }
  function _(w) {
    const v = n.get(w);
    if (w.depthTexture && (w.depthTexture.dispose(), n.remove(w.depthTexture)), w.isWebGLCubeRenderTarget)
      for (let Y = 0; Y < 6; Y++) {
        if (Array.isArray(v.__webglFramebuffer[Y]))
          for (let j = 0; j < v.__webglFramebuffer[Y].length; j++) i.deleteFramebuffer(v.__webglFramebuffer[Y][j]);
        else
          i.deleteFramebuffer(v.__webglFramebuffer[Y]);
        v.__webglDepthbuffer && i.deleteRenderbuffer(v.__webglDepthbuffer[Y]);
      }
    else {
      if (Array.isArray(v.__webglFramebuffer))
        for (let Y = 0; Y < v.__webglFramebuffer.length; Y++) i.deleteFramebuffer(v.__webglFramebuffer[Y]);
      else
        i.deleteFramebuffer(v.__webglFramebuffer);
      if (v.__webglDepthbuffer && i.deleteRenderbuffer(v.__webglDepthbuffer), v.__webglMultisampledFramebuffer && i.deleteFramebuffer(v.__webglMultisampledFramebuffer), v.__webglColorRenderbuffer)
        for (let Y = 0; Y < v.__webglColorRenderbuffer.length; Y++)
          v.__webglColorRenderbuffer[Y] && i.deleteRenderbuffer(v.__webglColorRenderbuffer[Y]);
      v.__webglDepthRenderbuffer && i.deleteRenderbuffer(v.__webglDepthRenderbuffer);
    }
    const B = w.textures;
    for (let Y = 0, j = B.length; Y < j; Y++) {
      const X = n.get(B[Y]);
      X.__webglTexture && (i.deleteTexture(X.__webglTexture), o.memory.textures--), n.remove(B[Y]);
    }
    n.remove(w);
  }
  let A = 0;
  function F() {
    A = 0;
  }
  function O() {
    const w = A;
    return w >= s.maxTextures && console.warn("THREE.WebGLTextures: Trying to use " + w + " texture units while this GPU supports only " + s.maxTextures), A += 1, w;
  }
  function G(w) {
    const v = [];
    return v.push(w.wrapS), v.push(w.wrapT), v.push(w.wrapR || 0), v.push(w.magFilter), v.push(w.minFilter), v.push(w.anisotropy), v.push(w.internalFormat), v.push(w.format), v.push(w.type), v.push(w.generateMipmaps), v.push(w.premultiplyAlpha), v.push(w.flipY), v.push(w.unpackAlignment), v.push(w.colorSpace), v.join();
  }
  function $(w, v) {
    const B = n.get(w);
    if (w.isVideoTexture && Et(w), w.isRenderTargetTexture === !1 && w.version > 0 && B.__version !== w.version) {
      const Y = w.image;
      if (Y === null)
        console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");
      else if (Y.complete === !1)
        console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");
      else {
        q(B, w, v);
        return;
      }
    }
    e.bindTexture(i.TEXTURE_2D, B.__webglTexture, i.TEXTURE0 + v);
  }
  function V(w, v) {
    const B = n.get(w);
    if (w.version > 0 && B.__version !== w.version) {
      q(B, w, v);
      return;
    }
    e.bindTexture(i.TEXTURE_2D_ARRAY, B.__webglTexture, i.TEXTURE0 + v);
  }
  function K(w, v) {
    const B = n.get(w);
    if (w.version > 0 && B.__version !== w.version) {
      q(B, w, v);
      return;
    }
    e.bindTexture(i.TEXTURE_3D, B.__webglTexture, i.TEXTURE0 + v);
  }
  function H(w, v) {
    const B = n.get(w);
    if (w.version > 0 && B.__version !== w.version) {
      nt(B, w, v);
      return;
    }
    e.bindTexture(i.TEXTURE_CUBE_MAP, B.__webglTexture, i.TEXTURE0 + v);
  }
  const st = {
    [Xs]: i.REPEAT,
    [Xn]: i.CLAMP_TO_EDGE,
    [Kr]: i.MIRRORED_REPEAT
  }, ut = {
    [qe]: i.NEAREST,
    [Rh]: i.NEAREST_MIPMAP_NEAREST,
    [fs]: i.NEAREST_MIPMAP_LINEAR,
    [Ke]: i.LINEAR,
    [sr]: i.LINEAR_MIPMAP_NEAREST,
    [qn]: i.LINEAR_MIPMAP_LINEAR
  }, yt = {
    [Dh]: i.NEVER,
    [Bh]: i.ALWAYS,
    [Uh]: i.LESS,
    [ic]: i.LEQUAL,
    [Ih]: i.EQUAL,
    [Oh]: i.GEQUAL,
    [Nh]: i.GREATER,
    [Fh]: i.NOTEQUAL
  };
  function Bt(w, v) {
    if (v.type === un && t.has("OES_texture_float_linear") === !1 && (v.magFilter === Ke || v.magFilter === sr || v.magFilter === fs || v.magFilter === qn || v.minFilter === Ke || v.minFilter === sr || v.minFilter === fs || v.minFilter === qn) && console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."), i.texParameteri(w, i.TEXTURE_WRAP_S, st[v.wrapS]), i.texParameteri(w, i.TEXTURE_WRAP_T, st[v.wrapT]), (w === i.TEXTURE_3D || w === i.TEXTURE_2D_ARRAY) && i.texParameteri(w, i.TEXTURE_WRAP_R, st[v.wrapR]), i.texParameteri(w, i.TEXTURE_MAG_FILTER, ut[v.magFilter]), i.texParameteri(w, i.TEXTURE_MIN_FILTER, ut[v.minFilter]), v.compareFunction && (i.texParameteri(w, i.TEXTURE_COMPARE_MODE, i.COMPARE_REF_TO_TEXTURE), i.texParameteri(w, i.TEXTURE_COMPARE_FUNC, yt[v.compareFunction])), t.has("EXT_texture_filter_anisotropic") === !0) {
      if (v.magFilter === qe || v.minFilter !== fs && v.minFilter !== qn || v.type === un && t.has("OES_texture_float_linear") === !1) return;
      if (v.anisotropy > 1 || n.get(v).__currentAnisotropy) {
        const B = t.get("EXT_texture_filter_anisotropic");
        i.texParameterf(w, B.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(v.anisotropy, s.getMaxAnisotropy())), n.get(v).__currentAnisotropy = v.anisotropy;
      }
    }
  }
  function jt(w, v) {
    let B = !1;
    w.__webglInit === void 0 && (w.__webglInit = !0, v.addEventListener("dispose", R));
    const Y = v.source;
    let j = f.get(Y);
    j === void 0 && (j = {}, f.set(Y, j));
    const X = G(v);
    if (X !== w.__cacheKey) {
      j[X] === void 0 && (j[X] = {
        texture: i.createTexture(),
        usedTimes: 0
      }, o.memory.textures++, B = !0), j[X].usedTimes++;
      const Mt = j[w.__cacheKey];
      Mt !== void 0 && (j[w.__cacheKey].usedTimes--, Mt.usedTimes === 0 && M(v)), w.__cacheKey = X, w.__webglTexture = j[X].texture;
    }
    return B;
  }
  function q(w, v, B) {
    let Y = i.TEXTURE_2D;
    (v.isDataArrayTexture || v.isCompressedArrayTexture) && (Y = i.TEXTURE_2D_ARRAY), v.isData3DTexture && (Y = i.TEXTURE_3D);
    const j = jt(w, v), X = v.source;
    e.bindTexture(Y, w.__webglTexture, i.TEXTURE0 + B);
    const Mt = n.get(X);
    if (X.version !== Mt.__version || j === !0) {
      e.activeTexture(i.TEXTURE0 + B);
      const at = Xt.getPrimaries(Xt.workingColorSpace), ft = v.colorSpace === Tn ? null : Xt.getPrimaries(v.colorSpace), $t = v.colorSpace === Tn || at === ft ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
      i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, v.flipY), i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, v.premultiplyAlpha), i.pixelStorei(i.UNPACK_ALIGNMENT, v.unpackAlignment), i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, $t);
      let tt = x(v.image, !1, s.maxTextureSize);
      tt = ne(v, tt);
      const pt = r.convert(v.format, v.colorSpace), wt = r.convert(v.type);
      let At = b(v.internalFormat, pt, wt, v.colorSpace, v.isVideoTexture);
      Bt(Y, v);
      let mt;
      const Gt = v.mipmaps, Nt = v.isVideoTexture !== !0, te = Mt.__version === void 0 || j === !0, P = X.dataReady, rt = N(v, tt);
      if (v.isDepthTexture)
        At = y(v.format === Ri, v.type), te && (Nt ? e.texStorage2D(i.TEXTURE_2D, 1, At, tt.width, tt.height) : e.texImage2D(i.TEXTURE_2D, 0, At, tt.width, tt.height, 0, pt, wt, null));
      else if (v.isDataTexture)
        if (Gt.length > 0) {
          Nt && te && e.texStorage2D(i.TEXTURE_2D, rt, At, Gt[0].width, Gt[0].height);
          for (let W = 0, Z = Gt.length; W < Z; W++)
            mt = Gt[W], Nt ? P && e.texSubImage2D(i.TEXTURE_2D, W, 0, 0, mt.width, mt.height, pt, wt, mt.data) : e.texImage2D(i.TEXTURE_2D, W, At, mt.width, mt.height, 0, pt, wt, mt.data);
          v.generateMipmaps = !1;
        } else
          Nt ? (te && e.texStorage2D(i.TEXTURE_2D, rt, At, tt.width, tt.height), P && e.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, tt.width, tt.height, pt, wt, tt.data)) : e.texImage2D(i.TEXTURE_2D, 0, At, tt.width, tt.height, 0, pt, wt, tt.data);
      else if (v.isCompressedTexture)
        if (v.isCompressedArrayTexture) {
          Nt && te && e.texStorage3D(i.TEXTURE_2D_ARRAY, rt, At, Gt[0].width, Gt[0].height, tt.depth);
          for (let W = 0, Z = Gt.length; W < Z; W++)
            if (mt = Gt[W], v.format !== Xe)
              if (pt !== null)
                if (Nt) {
                  if (P)
                    if (v.layerUpdates.size > 0) {
                      const ht = fl(mt.width, mt.height, v.format, v.type);
                      for (const lt of v.layerUpdates) {
                        const Dt = mt.data.subarray(
                          lt * ht / mt.data.BYTES_PER_ELEMENT,
                          (lt + 1) * ht / mt.data.BYTES_PER_ELEMENT
                        );
                        e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY, W, 0, 0, lt, mt.width, mt.height, 1, pt, Dt);
                      }
                      v.clearLayerUpdates();
                    } else
                      e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY, W, 0, 0, 0, mt.width, mt.height, tt.depth, pt, mt.data);
                } else
                  e.compressedTexImage3D(i.TEXTURE_2D_ARRAY, W, At, mt.width, mt.height, tt.depth, 0, mt.data, 0, 0);
              else
                console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");
            else
              Nt ? P && e.texSubImage3D(i.TEXTURE_2D_ARRAY, W, 0, 0, 0, mt.width, mt.height, tt.depth, pt, wt, mt.data) : e.texImage3D(i.TEXTURE_2D_ARRAY, W, At, mt.width, mt.height, tt.depth, 0, pt, wt, mt.data);
        } else {
          Nt && te && e.texStorage2D(i.TEXTURE_2D, rt, At, Gt[0].width, Gt[0].height);
          for (let W = 0, Z = Gt.length; W < Z; W++)
            mt = Gt[W], v.format !== Xe ? pt !== null ? Nt ? P && e.compressedTexSubImage2D(i.TEXTURE_2D, W, 0, 0, mt.width, mt.height, pt, mt.data) : e.compressedTexImage2D(i.TEXTURE_2D, W, At, mt.width, mt.height, 0, mt.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : Nt ? P && e.texSubImage2D(i.TEXTURE_2D, W, 0, 0, mt.width, mt.height, pt, wt, mt.data) : e.texImage2D(i.TEXTURE_2D, W, At, mt.width, mt.height, 0, pt, wt, mt.data);
        }
      else if (v.isDataArrayTexture)
        if (Nt) {
          if (te && e.texStorage3D(i.TEXTURE_2D_ARRAY, rt, At, tt.width, tt.height, tt.depth), P)
            if (v.layerUpdates.size > 0) {
              const W = fl(tt.width, tt.height, v.format, v.type);
              for (const Z of v.layerUpdates) {
                const ht = tt.data.subarray(
                  Z * W / tt.data.BYTES_PER_ELEMENT,
                  (Z + 1) * W / tt.data.BYTES_PER_ELEMENT
                );
                e.texSubImage3D(i.TEXTURE_2D_ARRAY, 0, 0, 0, Z, tt.width, tt.height, 1, pt, wt, ht);
              }
              v.clearLayerUpdates();
            } else
              e.texSubImage3D(i.TEXTURE_2D_ARRAY, 0, 0, 0, 0, tt.width, tt.height, tt.depth, pt, wt, tt.data);
        } else
          e.texImage3D(i.TEXTURE_2D_ARRAY, 0, At, tt.width, tt.height, tt.depth, 0, pt, wt, tt.data);
      else if (v.isData3DTexture)
        Nt ? (te && e.texStorage3D(i.TEXTURE_3D, rt, At, tt.width, tt.height, tt.depth), P && e.texSubImage3D(i.TEXTURE_3D, 0, 0, 0, 0, tt.width, tt.height, tt.depth, pt, wt, tt.data)) : e.texImage3D(i.TEXTURE_3D, 0, At, tt.width, tt.height, tt.depth, 0, pt, wt, tt.data);
      else if (v.isFramebufferTexture) {
        if (te)
          if (Nt)
            e.texStorage2D(i.TEXTURE_2D, rt, At, tt.width, tt.height);
          else {
            let W = tt.width, Z = tt.height;
            for (let ht = 0; ht < rt; ht++)
              e.texImage2D(i.TEXTURE_2D, ht, At, W, Z, 0, pt, wt, null), W >>= 1, Z >>= 1;
          }
      } else if (Gt.length > 0) {
        if (Nt && te) {
          const W = bt(Gt[0]);
          e.texStorage2D(i.TEXTURE_2D, rt, At, W.width, W.height);
        }
        for (let W = 0, Z = Gt.length; W < Z; W++)
          mt = Gt[W], Nt ? P && e.texSubImage2D(i.TEXTURE_2D, W, 0, 0, pt, wt, mt) : e.texImage2D(i.TEXTURE_2D, W, At, pt, wt, mt);
        v.generateMipmaps = !1;
      } else if (Nt) {
        if (te) {
          const W = bt(tt);
          e.texStorage2D(i.TEXTURE_2D, rt, At, W.width, W.height);
        }
        P && e.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, pt, wt, tt);
      } else
        e.texImage2D(i.TEXTURE_2D, 0, At, pt, wt, tt);
      m(v) && p(Y), Mt.__version = X.version, v.onUpdate && v.onUpdate(v);
    }
    w.__version = v.version;
  }
  function nt(w, v, B) {
    if (v.image.length !== 6) return;
    const Y = jt(w, v), j = v.source;
    e.bindTexture(i.TEXTURE_CUBE_MAP, w.__webglTexture, i.TEXTURE0 + B);
    const X = n.get(j);
    if (j.version !== X.__version || Y === !0) {
      e.activeTexture(i.TEXTURE0 + B);
      const Mt = Xt.getPrimaries(Xt.workingColorSpace), at = v.colorSpace === Tn ? null : Xt.getPrimaries(v.colorSpace), ft = v.colorSpace === Tn || Mt === at ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
      i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, v.flipY), i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, v.premultiplyAlpha), i.pixelStorei(i.UNPACK_ALIGNMENT, v.unpackAlignment), i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, ft);
      const $t = v.isCompressedTexture || v.image[0].isCompressedTexture, tt = v.image[0] && v.image[0].isDataTexture, pt = [];
      for (let Z = 0; Z < 6; Z++)
        !$t && !tt ? pt[Z] = x(v.image[Z], !0, s.maxCubemapSize) : pt[Z] = tt ? v.image[Z].image : v.image[Z], pt[Z] = ne(v, pt[Z]);
      const wt = pt[0], At = r.convert(v.format, v.colorSpace), mt = r.convert(v.type), Gt = b(v.internalFormat, At, mt, v.colorSpace), Nt = v.isVideoTexture !== !0, te = X.__version === void 0 || Y === !0, P = j.dataReady;
      let rt = N(v, wt);
      Bt(i.TEXTURE_CUBE_MAP, v);
      let W;
      if ($t) {
        Nt && te && e.texStorage2D(i.TEXTURE_CUBE_MAP, rt, Gt, wt.width, wt.height);
        for (let Z = 0; Z < 6; Z++) {
          W = pt[Z].mipmaps;
          for (let ht = 0; ht < W.length; ht++) {
            const lt = W[ht];
            v.format !== Xe ? At !== null ? Nt ? P && e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Z, ht, 0, 0, lt.width, lt.height, At, lt.data) : e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Z, ht, Gt, lt.width, lt.height, 0, lt.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()") : Nt ? P && e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Z, ht, 0, 0, lt.width, lt.height, At, mt, lt.data) : e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Z, ht, Gt, lt.width, lt.height, 0, At, mt, lt.data);
          }
        }
      } else {
        if (W = v.mipmaps, Nt && te) {
          W.length > 0 && rt++;
          const Z = bt(pt[0]);
          e.texStorage2D(i.TEXTURE_CUBE_MAP, rt, Gt, Z.width, Z.height);
        }
        for (let Z = 0; Z < 6; Z++)
          if (tt) {
            Nt ? P && e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Z, 0, 0, 0, pt[Z].width, pt[Z].height, At, mt, pt[Z].data) : e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Z, 0, Gt, pt[Z].width, pt[Z].height, 0, At, mt, pt[Z].data);
            for (let ht = 0; ht < W.length; ht++) {
              const Dt = W[ht].image[Z].image;
              Nt ? P && e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Z, ht + 1, 0, 0, Dt.width, Dt.height, At, mt, Dt.data) : e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Z, ht + 1, Gt, Dt.width, Dt.height, 0, At, mt, Dt.data);
            }
          } else {
            Nt ? P && e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Z, 0, 0, 0, At, mt, pt[Z]) : e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Z, 0, Gt, At, mt, pt[Z]);
            for (let ht = 0; ht < W.length; ht++) {
              const lt = W[ht];
              Nt ? P && e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Z, ht + 1, 0, 0, At, mt, lt.image[Z]) : e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Z, ht + 1, Gt, At, mt, lt.image[Z]);
            }
          }
      }
      m(v) && p(i.TEXTURE_CUBE_MAP), X.__version = j.version, v.onUpdate && v.onUpdate(v);
    }
    w.__version = v.version;
  }
  function vt(w, v, B, Y, j, X) {
    const Mt = r.convert(B.format, B.colorSpace), at = r.convert(B.type), ft = b(B.internalFormat, Mt, at, B.colorSpace), $t = n.get(v), tt = n.get(B);
    if (tt.__renderTarget = v, !$t.__hasExternalTextures) {
      const pt = Math.max(1, v.width >> X), wt = Math.max(1, v.height >> X);
      j === i.TEXTURE_3D || j === i.TEXTURE_2D_ARRAY ? e.texImage3D(j, X, ft, pt, wt, v.depth, 0, Mt, at, null) : e.texImage2D(j, X, ft, pt, wt, 0, Mt, at, null);
    }
    e.bindFramebuffer(i.FRAMEBUFFER, w), Vt(v) ? a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, Y, j, tt.__webglTexture, 0, Ht(v)) : (j === i.TEXTURE_2D || j >= i.TEXTURE_CUBE_MAP_POSITIVE_X && j <= i.TEXTURE_CUBE_MAP_NEGATIVE_Z) && i.framebufferTexture2D(i.FRAMEBUFFER, Y, j, tt.__webglTexture, X), e.bindFramebuffer(i.FRAMEBUFFER, null);
  }
  function ot(w, v, B) {
    if (i.bindRenderbuffer(i.RENDERBUFFER, w), v.depthBuffer) {
      const Y = v.depthTexture, j = Y && Y.isDepthTexture ? Y.type : null, X = y(v.stencilBuffer, j), Mt = v.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, at = Ht(v);
      Vt(v) ? a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER, at, X, v.width, v.height) : B ? i.renderbufferStorageMultisample(i.RENDERBUFFER, at, X, v.width, v.height) : i.renderbufferStorage(i.RENDERBUFFER, X, v.width, v.height), i.framebufferRenderbuffer(i.FRAMEBUFFER, Mt, i.RENDERBUFFER, w);
    } else {
      const Y = v.textures;
      for (let j = 0; j < Y.length; j++) {
        const X = Y[j], Mt = r.convert(X.format, X.colorSpace), at = r.convert(X.type), ft = b(X.internalFormat, Mt, at, X.colorSpace), $t = Ht(v);
        B && Vt(v) === !1 ? i.renderbufferStorageMultisample(i.RENDERBUFFER, $t, ft, v.width, v.height) : Vt(v) ? a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER, $t, ft, v.width, v.height) : i.renderbufferStorage(i.RENDERBUFFER, ft, v.width, v.height);
      }
    }
    i.bindRenderbuffer(i.RENDERBUFFER, null);
  }
  function Tt(w, v) {
    if (v && v.isWebGLCubeRenderTarget) throw new Error("Depth Texture with cube render targets is not supported");
    if (e.bindFramebuffer(i.FRAMEBUFFER, w), !(v.depthTexture && v.depthTexture.isDepthTexture))
      throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");
    const Y = n.get(v.depthTexture);
    Y.__renderTarget = v, (!Y.__webglTexture || v.depthTexture.image.width !== v.width || v.depthTexture.image.height !== v.height) && (v.depthTexture.image.width = v.width, v.depthTexture.image.height = v.height, v.depthTexture.needsUpdate = !0), $(v.depthTexture, 0);
    const j = Y.__webglTexture, X = Ht(v);
    if (v.depthTexture.format === vi)
      Vt(v) ? a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, i.DEPTH_ATTACHMENT, i.TEXTURE_2D, j, 0, X) : i.framebufferTexture2D(i.FRAMEBUFFER, i.DEPTH_ATTACHMENT, i.TEXTURE_2D, j, 0);
    else if (v.depthTexture.format === Ri)
      Vt(v) ? a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, i.DEPTH_STENCIL_ATTACHMENT, i.TEXTURE_2D, j, 0, X) : i.framebufferTexture2D(i.FRAMEBUFFER, i.DEPTH_STENCIL_ATTACHMENT, i.TEXTURE_2D, j, 0);
    else
      throw new Error("Unknown depthTexture format");
  }
  function Lt(w) {
    const v = n.get(w), B = w.isWebGLCubeRenderTarget === !0;
    if (v.__boundDepthTexture !== w.depthTexture) {
      const Y = w.depthTexture;
      if (v.__depthDisposeCallback && v.__depthDisposeCallback(), Y) {
        const j = () => {
          delete v.__boundDepthTexture, delete v.__depthDisposeCallback, Y.removeEventListener("dispose", j);
        };
        Y.addEventListener("dispose", j), v.__depthDisposeCallback = j;
      }
      v.__boundDepthTexture = Y;
    }
    if (w.depthTexture && !v.__autoAllocateDepthBuffer) {
      if (B) throw new Error("target.depthTexture not supported in Cube render targets");
      Tt(v.__webglFramebuffer, w);
    } else if (B) {
      v.__webglDepthbuffer = [];
      for (let Y = 0; Y < 6; Y++)
        if (e.bindFramebuffer(i.FRAMEBUFFER, v.__webglFramebuffer[Y]), v.__webglDepthbuffer[Y] === void 0)
          v.__webglDepthbuffer[Y] = i.createRenderbuffer(), ot(v.__webglDepthbuffer[Y], w, !1);
        else {
          const j = w.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, X = v.__webglDepthbuffer[Y];
          i.bindRenderbuffer(i.RENDERBUFFER, X), i.framebufferRenderbuffer(i.FRAMEBUFFER, j, i.RENDERBUFFER, X);
        }
    } else if (e.bindFramebuffer(i.FRAMEBUFFER, v.__webglFramebuffer), v.__webglDepthbuffer === void 0)
      v.__webglDepthbuffer = i.createRenderbuffer(), ot(v.__webglDepthbuffer, w, !1);
    else {
      const Y = w.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, j = v.__webglDepthbuffer;
      i.bindRenderbuffer(i.RENDERBUFFER, j), i.framebufferRenderbuffer(i.FRAMEBUFFER, Y, i.RENDERBUFFER, j);
    }
    e.bindFramebuffer(i.FRAMEBUFFER, null);
  }
  function zt(w, v, B) {
    const Y = n.get(w);
    v !== void 0 && vt(Y.__webglFramebuffer, w, w.texture, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, 0), B !== void 0 && Lt(w);
  }
  function oe(w) {
    const v = w.texture, B = n.get(w), Y = n.get(v);
    w.addEventListener("dispose", T);
    const j = w.textures, X = w.isWebGLCubeRenderTarget === !0, Mt = j.length > 1;
    if (Mt || (Y.__webglTexture === void 0 && (Y.__webglTexture = i.createTexture()), Y.__version = v.version, o.memory.textures++), X) {
      B.__webglFramebuffer = [];
      for (let at = 0; at < 6; at++)
        if (v.mipmaps && v.mipmaps.length > 0) {
          B.__webglFramebuffer[at] = [];
          for (let ft = 0; ft < v.mipmaps.length; ft++)
            B.__webglFramebuffer[at][ft] = i.createFramebuffer();
        } else
          B.__webglFramebuffer[at] = i.createFramebuffer();
    } else {
      if (v.mipmaps && v.mipmaps.length > 0) {
        B.__webglFramebuffer = [];
        for (let at = 0; at < v.mipmaps.length; at++)
          B.__webglFramebuffer[at] = i.createFramebuffer();
      } else
        B.__webglFramebuffer = i.createFramebuffer();
      if (Mt)
        for (let at = 0, ft = j.length; at < ft; at++) {
          const $t = n.get(j[at]);
          $t.__webglTexture === void 0 && ($t.__webglTexture = i.createTexture(), o.memory.textures++);
        }
      if (w.samples > 0 && Vt(w) === !1) {
        B.__webglMultisampledFramebuffer = i.createFramebuffer(), B.__webglColorRenderbuffer = [], e.bindFramebuffer(i.FRAMEBUFFER, B.__webglMultisampledFramebuffer);
        for (let at = 0; at < j.length; at++) {
          const ft = j[at];
          B.__webglColorRenderbuffer[at] = i.createRenderbuffer(), i.bindRenderbuffer(i.RENDERBUFFER, B.__webglColorRenderbuffer[at]);
          const $t = r.convert(ft.format, ft.colorSpace), tt = r.convert(ft.type), pt = b(ft.internalFormat, $t, tt, ft.colorSpace, w.isXRRenderTarget === !0), wt = Ht(w);
          i.renderbufferStorageMultisample(i.RENDERBUFFER, wt, pt, w.width, w.height), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + at, i.RENDERBUFFER, B.__webglColorRenderbuffer[at]);
        }
        i.bindRenderbuffer(i.RENDERBUFFER, null), w.depthBuffer && (B.__webglDepthRenderbuffer = i.createRenderbuffer(), ot(B.__webglDepthRenderbuffer, w, !0)), e.bindFramebuffer(i.FRAMEBUFFER, null);
      }
    }
    if (X) {
      e.bindTexture(i.TEXTURE_CUBE_MAP, Y.__webglTexture), Bt(i.TEXTURE_CUBE_MAP, v);
      for (let at = 0; at < 6; at++)
        if (v.mipmaps && v.mipmaps.length > 0)
          for (let ft = 0; ft < v.mipmaps.length; ft++)
            vt(B.__webglFramebuffer[at][ft], w, v, i.COLOR_ATTACHMENT0, i.TEXTURE_CUBE_MAP_POSITIVE_X + at, ft);
        else
          vt(B.__webglFramebuffer[at], w, v, i.COLOR_ATTACHMENT0, i.TEXTURE_CUBE_MAP_POSITIVE_X + at, 0);
      m(v) && p(i.TEXTURE_CUBE_MAP), e.unbindTexture();
    } else if (Mt) {
      for (let at = 0, ft = j.length; at < ft; at++) {
        const $t = j[at], tt = n.get($t);
        e.bindTexture(i.TEXTURE_2D, tt.__webglTexture), Bt(i.TEXTURE_2D, $t), vt(B.__webglFramebuffer, w, $t, i.COLOR_ATTACHMENT0 + at, i.TEXTURE_2D, 0), m($t) && p(i.TEXTURE_2D);
      }
      e.unbindTexture();
    } else {
      let at = i.TEXTURE_2D;
      if ((w.isWebGL3DRenderTarget || w.isWebGLArrayRenderTarget) && (at = w.isWebGL3DRenderTarget ? i.TEXTURE_3D : i.TEXTURE_2D_ARRAY), e.bindTexture(at, Y.__webglTexture), Bt(at, v), v.mipmaps && v.mipmaps.length > 0)
        for (let ft = 0; ft < v.mipmaps.length; ft++)
          vt(B.__webglFramebuffer[ft], w, v, i.COLOR_ATTACHMENT0, at, ft);
      else
        vt(B.__webglFramebuffer, w, v, i.COLOR_ATTACHMENT0, at, 0);
      m(v) && p(at), e.unbindTexture();
    }
    w.depthBuffer && Lt(w);
  }
  function Wt(w) {
    const v = w.textures;
    for (let B = 0, Y = v.length; B < Y; B++) {
      const j = v[B];
      if (m(j)) {
        const X = E(w), Mt = n.get(j).__webglTexture;
        e.bindTexture(X, Mt), p(X), e.unbindTexture();
      }
    }
  }
  const ce = [], I = [];
  function Ne(w) {
    if (w.samples > 0) {
      if (Vt(w) === !1) {
        const v = w.textures, B = w.width, Y = w.height;
        let j = i.COLOR_BUFFER_BIT;
        const X = w.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, Mt = n.get(w), at = v.length > 1;
        if (at)
          for (let ft = 0; ft < v.length; ft++)
            e.bindFramebuffer(i.FRAMEBUFFER, Mt.__webglMultisampledFramebuffer), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + ft, i.RENDERBUFFER, null), e.bindFramebuffer(i.FRAMEBUFFER, Mt.__webglFramebuffer), i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0 + ft, i.TEXTURE_2D, null, 0);
        e.bindFramebuffer(i.READ_FRAMEBUFFER, Mt.__webglMultisampledFramebuffer), e.bindFramebuffer(i.DRAW_FRAMEBUFFER, Mt.__webglFramebuffer);
        for (let ft = 0; ft < v.length; ft++) {
          if (w.resolveDepthBuffer && (w.depthBuffer && (j |= i.DEPTH_BUFFER_BIT), w.stencilBuffer && w.resolveStencilBuffer && (j |= i.STENCIL_BUFFER_BIT)), at) {
            i.framebufferRenderbuffer(i.READ_FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.RENDERBUFFER, Mt.__webglColorRenderbuffer[ft]);
            const $t = n.get(v[ft]).__webglTexture;
            i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, $t, 0);
          }
          i.blitFramebuffer(0, 0, B, Y, 0, 0, B, Y, j, i.NEAREST), l === !0 && (ce.length = 0, I.length = 0, ce.push(i.COLOR_ATTACHMENT0 + ft), w.depthBuffer && w.resolveDepthBuffer === !1 && (ce.push(X), I.push(X), i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, I)), i.invalidateFramebuffer(i.READ_FRAMEBUFFER, ce));
        }
        if (e.bindFramebuffer(i.READ_FRAMEBUFFER, null), e.bindFramebuffer(i.DRAW_FRAMEBUFFER, null), at)
          for (let ft = 0; ft < v.length; ft++) {
            e.bindFramebuffer(i.FRAMEBUFFER, Mt.__webglMultisampledFramebuffer), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + ft, i.RENDERBUFFER, Mt.__webglColorRenderbuffer[ft]);
            const $t = n.get(v[ft]).__webglTexture;
            e.bindFramebuffer(i.FRAMEBUFFER, Mt.__webglFramebuffer), i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0 + ft, i.TEXTURE_2D, $t, 0);
          }
        e.bindFramebuffer(i.DRAW_FRAMEBUFFER, Mt.__webglMultisampledFramebuffer);
      } else if (w.depthBuffer && w.resolveDepthBuffer === !1 && l) {
        const v = w.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT;
        i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, [v]);
      }
    }
  }
  function Ht(w) {
    return Math.min(s.maxSamples, w.samples);
  }
  function Vt(w) {
    const v = n.get(w);
    return w.samples > 0 && t.has("WEBGL_multisampled_render_to_texture") === !0 && v.__useRenderToTexture !== !1;
  }
  function Et(w) {
    const v = o.render.frame;
    u.get(w) !== v && (u.set(w, v), w.update());
  }
  function ne(w, v) {
    const B = w.colorSpace, Y = w.format, j = w.type;
    return w.isCompressedTexture === !0 || w.isVideoTexture === !0 || B !== Pi && B !== Tn && (Xt.getTransfer(B) === Jt ? (Y !== Xe || j !== mn) && console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.") : console.error("THREE.WebGLTextures: Unsupported texture color space:", B)), v;
  }
  function bt(w) {
    return typeof HTMLImageElement < "u" && w instanceof HTMLImageElement ? (h.width = w.naturalWidth || w.width, h.height = w.naturalHeight || w.height) : typeof VideoFrame < "u" && w instanceof VideoFrame ? (h.width = w.displayWidth, h.height = w.displayHeight) : (h.width = w.width, h.height = w.height), h;
  }
  this.allocateTextureUnit = O, this.resetTextureUnits = F, this.setTexture2D = $, this.setTexture2DArray = V, this.setTexture3D = K, this.setTextureCube = H, this.rebindTextures = zt, this.setupRenderTarget = oe, this.updateRenderTargetMipmap = Wt, this.updateMultisampleRenderTarget = Ne, this.setupDepthRenderbuffer = Lt, this.setupFrameBufferTexture = vt, this.useMultisampledRTT = Vt;
}
function sg(i, t) {
  function e(n, s = Tn) {
    let r;
    const o = Xt.getTransfer(s);
    if (n === mn) return i.UNSIGNED_BYTE;
    if (n === Fo) return i.UNSIGNED_SHORT_4_4_4_4;
    if (n === Oo) return i.UNSIGNED_SHORT_5_5_5_1;
    if (n === Yl) return i.UNSIGNED_INT_5_9_9_9_REV;
    if (n === Xl) return i.BYTE;
    if (n === ql) return i.SHORT;
    if (n === is) return i.UNSIGNED_SHORT;
    if (n === No) return i.INT;
    if (n === jn) return i.UNSIGNED_INT;
    if (n === un) return i.FLOAT;
    if (n === os) return i.HALF_FLOAT;
    if (n === Zl) return i.ALPHA;
    if (n === jl) return i.RGB;
    if (n === Xe) return i.RGBA;
    if (n === Kl) return i.LUMINANCE;
    if (n === Jl) return i.LUMINANCE_ALPHA;
    if (n === vi) return i.DEPTH_COMPONENT;
    if (n === Ri) return i.DEPTH_STENCIL;
    if (n === Ql) return i.RED;
    if (n === Bo) return i.RED_INTEGER;
    if (n === tc) return i.RG;
    if (n === zo) return i.RG_INTEGER;
    if (n === ko) return i.RGBA_INTEGER;
    if (n === Bs || n === zs || n === ks || n === Hs)
      if (o === Jt)
        if (r = t.get("WEBGL_compressed_texture_s3tc_srgb"), r !== null) {
          if (n === Bs) return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;
          if (n === zs) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
          if (n === ks) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
          if (n === Hs) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
        } else
          return null;
      else if (r = t.get("WEBGL_compressed_texture_s3tc"), r !== null) {
        if (n === Bs) return r.COMPRESSED_RGB_S3TC_DXT1_EXT;
        if (n === zs) return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        if (n === ks) return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        if (n === Hs) return r.COMPRESSED_RGBA_S3TC_DXT5_EXT;
      } else
        return null;
    if (n === Jr || n === Qr || n === to || n === eo)
      if (r = t.get("WEBGL_compressed_texture_pvrtc"), r !== null) {
        if (n === Jr) return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        if (n === Qr) return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        if (n === to) return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
        if (n === eo) return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
      } else
        return null;
    if (n === no || n === io || n === so)
      if (r = t.get("WEBGL_compressed_texture_etc"), r !== null) {
        if (n === no || n === io) return o === Jt ? r.COMPRESSED_SRGB8_ETC2 : r.COMPRESSED_RGB8_ETC2;
        if (n === so) return o === Jt ? r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : r.COMPRESSED_RGBA8_ETC2_EAC;
      } else
        return null;
    if (n === ro || n === oo || n === ao || n === lo || n === co || n === ho || n === uo || n === fo || n === po || n === mo || n === go || n === _o || n === xo || n === vo)
      if (r = t.get("WEBGL_compressed_texture_astc"), r !== null) {
        if (n === ro) return o === Jt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : r.COMPRESSED_RGBA_ASTC_4x4_KHR;
        if (n === oo) return o === Jt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR : r.COMPRESSED_RGBA_ASTC_5x4_KHR;
        if (n === ao) return o === Jt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR : r.COMPRESSED_RGBA_ASTC_5x5_KHR;
        if (n === lo) return o === Jt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR : r.COMPRESSED_RGBA_ASTC_6x5_KHR;
        if (n === co) return o === Jt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR : r.COMPRESSED_RGBA_ASTC_6x6_KHR;
        if (n === ho) return o === Jt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR : r.COMPRESSED_RGBA_ASTC_8x5_KHR;
        if (n === uo) return o === Jt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR : r.COMPRESSED_RGBA_ASTC_8x6_KHR;
        if (n === fo) return o === Jt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR : r.COMPRESSED_RGBA_ASTC_8x8_KHR;
        if (n === po) return o === Jt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR : r.COMPRESSED_RGBA_ASTC_10x5_KHR;
        if (n === mo) return o === Jt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR : r.COMPRESSED_RGBA_ASTC_10x6_KHR;
        if (n === go) return o === Jt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR : r.COMPRESSED_RGBA_ASTC_10x8_KHR;
        if (n === _o) return o === Jt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR : r.COMPRESSED_RGBA_ASTC_10x10_KHR;
        if (n === xo) return o === Jt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR : r.COMPRESSED_RGBA_ASTC_12x10_KHR;
        if (n === vo) return o === Jt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR : r.COMPRESSED_RGBA_ASTC_12x12_KHR;
      } else
        return null;
    if (n === Vs || n === Mo || n === So)
      if (r = t.get("EXT_texture_compression_bptc"), r !== null) {
        if (n === Vs) return o === Jt ? r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : r.COMPRESSED_RGBA_BPTC_UNORM_EXT;
        if (n === Mo) return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
        if (n === So) return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
      } else
        return null;
    if (n === ec || n === yo || n === bo || n === Eo)
      if (r = t.get("EXT_texture_compression_rgtc"), r !== null) {
        if (n === Vs) return r.COMPRESSED_RED_RGTC1_EXT;
        if (n === yo) return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;
        if (n === bo) return r.COMPRESSED_RED_GREEN_RGTC2_EXT;
        if (n === Eo) return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
      } else
        return null;
    return n === Ai ? i.UNSIGNED_INT_24_8 : i[n] !== void 0 ? i[n] : null;
  }
  return { convert: e };
}
class rg extends Ie {
  constructor(t = []) {
    super(), this.isArrayCamera = !0, this.cameras = t;
  }
}
class Te extends ge {
  constructor() {
    super(), this.isGroup = !0, this.type = "Group";
  }
}
const og = { type: "move" };
class Lr {
  constructor() {
    this._targetRay = null, this._grip = null, this._hand = null;
  }
  getHandSpace() {
    return this._hand === null && (this._hand = new Te(), this._hand.matrixAutoUpdate = !1, this._hand.visible = !1, this._hand.joints = {}, this._hand.inputState = { pinching: !1 }), this._hand;
  }
  getTargetRaySpace() {
    return this._targetRay === null && (this._targetRay = new Te(), this._targetRay.matrixAutoUpdate = !1, this._targetRay.visible = !1, this._targetRay.hasLinearVelocity = !1, this._targetRay.linearVelocity = new L(), this._targetRay.hasAngularVelocity = !1, this._targetRay.angularVelocity = new L()), this._targetRay;
  }
  getGripSpace() {
    return this._grip === null && (this._grip = new Te(), this._grip.matrixAutoUpdate = !1, this._grip.visible = !1, this._grip.hasLinearVelocity = !1, this._grip.linearVelocity = new L(), this._grip.hasAngularVelocity = !1, this._grip.angularVelocity = new L()), this._grip;
  }
  dispatchEvent(t) {
    return this._targetRay !== null && this._targetRay.dispatchEvent(t), this._grip !== null && this._grip.dispatchEvent(t), this._hand !== null && this._hand.dispatchEvent(t), this;
  }
  connect(t) {
    if (t && t.hand) {
      const e = this._hand;
      if (e)
        for (const n of t.hand.values())
          this._getHandJoint(e, n);
    }
    return this.dispatchEvent({ type: "connected", data: t }), this;
  }
  disconnect(t) {
    return this.dispatchEvent({ type: "disconnected", data: t }), this._targetRay !== null && (this._targetRay.visible = !1), this._grip !== null && (this._grip.visible = !1), this._hand !== null && (this._hand.visible = !1), this;
  }
  update(t, e, n) {
    let s = null, r = null, o = null;
    const a = this._targetRay, l = this._grip, h = this._hand;
    if (t && e.session.visibilityState !== "visible-blurred") {
      if (h && t.hand) {
        o = !0;
        for (const x of t.hand.values()) {
          const m = e.getJointPose(x, n), p = this._getHandJoint(h, x);
          m !== null && (p.matrix.fromArray(m.transform.matrix), p.matrix.decompose(p.position, p.rotation, p.scale), p.matrixWorldNeedsUpdate = !0, p.jointRadius = m.radius), p.visible = m !== null;
        }
        const u = h.joints["index-finger-tip"], c = h.joints["thumb-tip"], f = u.position.distanceTo(c.position), d = 0.02, g = 5e-3;
        h.inputState.pinching && f > d + g ? (h.inputState.pinching = !1, this.dispatchEvent({
          type: "pinchend",
          handedness: t.handedness,
          target: this
        })) : !h.inputState.pinching && f <= d - g && (h.inputState.pinching = !0, this.dispatchEvent({
          type: "pinchstart",
          handedness: t.handedness,
          target: this
        }));
      } else
        l !== null && t.gripSpace && (r = e.getPose(t.gripSpace, n), r !== null && (l.matrix.fromArray(r.transform.matrix), l.matrix.decompose(l.position, l.rotation, l.scale), l.matrixWorldNeedsUpdate = !0, r.linearVelocity ? (l.hasLinearVelocity = !0, l.linearVelocity.copy(r.linearVelocity)) : l.hasLinearVelocity = !1, r.angularVelocity ? (l.hasAngularVelocity = !0, l.angularVelocity.copy(r.angularVelocity)) : l.hasAngularVelocity = !1));
      a !== null && (s = e.getPose(t.targetRaySpace, n), s === null && r !== null && (s = r), s !== null && (a.matrix.fromArray(s.transform.matrix), a.matrix.decompose(a.position, a.rotation, a.scale), a.matrixWorldNeedsUpdate = !0, s.linearVelocity ? (a.hasLinearVelocity = !0, a.linearVelocity.copy(s.linearVelocity)) : a.hasLinearVelocity = !1, s.angularVelocity ? (a.hasAngularVelocity = !0, a.angularVelocity.copy(s.angularVelocity)) : a.hasAngularVelocity = !1, this.dispatchEvent(og)));
    }
    return a !== null && (a.visible = s !== null), l !== null && (l.visible = r !== null), h !== null && (h.visible = o !== null), this;
  }
  // private method
  _getHandJoint(t, e) {
    if (t.joints[e.jointName] === void 0) {
      const n = new Te();
      n.matrixAutoUpdate = !1, n.visible = !1, t.joints[e.jointName] = n, t.add(n);
    }
    return t.joints[e.jointName];
  }
}
const ag = `
void main() {

	gl_Position = vec4( position, 1.0 );

}`, lg = `
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;
class cg {
  constructor() {
    this.texture = null, this.mesh = null, this.depthNear = 0, this.depthFar = 0;
  }
  init(t, e, n) {
    if (this.texture === null) {
      const s = new Ae(), r = t.properties.get(s);
      r.__webglTexture = e.texture, (e.depthNear != n.depthNear || e.depthFar != n.depthFar) && (this.depthNear = e.depthNear, this.depthFar = e.depthFar), this.texture = s;
    }
  }
  getMesh(t) {
    if (this.texture !== null && this.mesh === null) {
      const e = t.cameras[0].viewport, n = new Ln({
        vertexShader: ag,
        fragmentShader: lg,
        uniforms: {
          depthColor: { value: this.texture },
          depthWidth: { value: e.z },
          depthHeight: { value: e.w }
        }
      });
      this.mesh = new ye(new hs(20, 20), n);
    }
    return this.mesh;
  }
  reset() {
    this.texture = null, this.mesh = null;
  }
  getDepthTexture() {
    return this.texture;
  }
}
class hg extends Li {
  constructor(t, e) {
    super();
    const n = this;
    let s = null, r = 1, o = null, a = "local-floor", l = 1, h = null, u = null, c = null, f = null, d = null, g = null;
    const x = new cg(), m = e.getContextAttributes();
    let p = null, E = null;
    const b = [], y = [], N = new kt();
    let R = null;
    const T = new Ie();
    T.viewport = new Qt();
    const C = new Ie();
    C.viewport = new Qt();
    const M = [T, C], _ = new rg();
    let A = null, F = null;
    this.cameraAutoUpdate = !0, this.enabled = !1, this.isPresenting = !1, this.getController = function(q) {
      let nt = b[q];
      return nt === void 0 && (nt = new Lr(), b[q] = nt), nt.getTargetRaySpace();
    }, this.getControllerGrip = function(q) {
      let nt = b[q];
      return nt === void 0 && (nt = new Lr(), b[q] = nt), nt.getGripSpace();
    }, this.getHand = function(q) {
      let nt = b[q];
      return nt === void 0 && (nt = new Lr(), b[q] = nt), nt.getHandSpace();
    };
    function O(q) {
      const nt = y.indexOf(q.inputSource);
      if (nt === -1)
        return;
      const vt = b[nt];
      vt !== void 0 && (vt.update(q.inputSource, q.frame, h || o), vt.dispatchEvent({ type: q.type, data: q.inputSource }));
    }
    function G() {
      s.removeEventListener("select", O), s.removeEventListener("selectstart", O), s.removeEventListener("selectend", O), s.removeEventListener("squeeze", O), s.removeEventListener("squeezestart", O), s.removeEventListener("squeezeend", O), s.removeEventListener("end", G), s.removeEventListener("inputsourceschange", $);
      for (let q = 0; q < b.length; q++) {
        const nt = y[q];
        nt !== null && (y[q] = null, b[q].disconnect(nt));
      }
      A = null, F = null, x.reset(), t.setRenderTarget(p), d = null, f = null, c = null, s = null, E = null, jt.stop(), n.isPresenting = !1, t.setPixelRatio(R), t.setSize(N.width, N.height, !1), n.dispatchEvent({ type: "sessionend" });
    }
    this.setFramebufferScaleFactor = function(q) {
      r = q, n.isPresenting === !0 && console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.");
    }, this.setReferenceSpaceType = function(q) {
      a = q, n.isPresenting === !0 && console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.");
    }, this.getReferenceSpace = function() {
      return h || o;
    }, this.setReferenceSpace = function(q) {
      h = q;
    }, this.getBaseLayer = function() {
      return f !== null ? f : d;
    }, this.getBinding = function() {
      return c;
    }, this.getFrame = function() {
      return g;
    }, this.getSession = function() {
      return s;
    }, this.setSession = async function(q) {
      if (s = q, s !== null) {
        if (p = t.getRenderTarget(), s.addEventListener("select", O), s.addEventListener("selectstart", O), s.addEventListener("selectend", O), s.addEventListener("squeeze", O), s.addEventListener("squeezestart", O), s.addEventListener("squeezeend", O), s.addEventListener("end", G), s.addEventListener("inputsourceschange", $), m.xrCompatible !== !0 && await e.makeXRCompatible(), R = t.getPixelRatio(), t.getSize(N), s.renderState.layers === void 0) {
          const nt = {
            antialias: m.antialias,
            alpha: !0,
            depth: m.depth,
            stencil: m.stencil,
            framebufferScaleFactor: r
          };
          d = new XRWebGLLayer(s, e, nt), s.updateRenderState({ baseLayer: d }), t.setPixelRatio(1), t.setSize(d.framebufferWidth, d.framebufferHeight, !1), E = new Kn(
            d.framebufferWidth,
            d.framebufferHeight,
            {
              format: Xe,
              type: mn,
              colorSpace: t.outputColorSpace,
              stencilBuffer: m.stencil
            }
          );
        } else {
          let nt = null, vt = null, ot = null;
          m.depth && (ot = m.stencil ? e.DEPTH24_STENCIL8 : e.DEPTH_COMPONENT24, nt = m.stencil ? Ri : vi, vt = m.stencil ? Ai : jn);
          const Tt = {
            colorFormat: e.RGBA8,
            depthFormat: ot,
            scaleFactor: r
          };
          c = new XRWebGLBinding(s, e), f = c.createProjectionLayer(Tt), s.updateRenderState({ layers: [f] }), t.setPixelRatio(1), t.setSize(f.textureWidth, f.textureHeight, !1), E = new Kn(
            f.textureWidth,
            f.textureHeight,
            {
              format: Xe,
              type: mn,
              depthTexture: new mc(f.textureWidth, f.textureHeight, vt, void 0, void 0, void 0, void 0, void 0, void 0, nt),
              stencilBuffer: m.stencil,
              colorSpace: t.outputColorSpace,
              samples: m.antialias ? 4 : 0,
              resolveDepthBuffer: f.ignoreDepthValues === !1
            }
          );
        }
        E.isXRRenderTarget = !0, this.setFoveation(l), h = null, o = await s.requestReferenceSpace(a), jt.setContext(s), jt.start(), n.isPresenting = !0, n.dispatchEvent({ type: "sessionstart" });
      }
    }, this.getEnvironmentBlendMode = function() {
      if (s !== null)
        return s.environmentBlendMode;
    }, this.getDepthTexture = function() {
      return x.getDepthTexture();
    };
    function $(q) {
      for (let nt = 0; nt < q.removed.length; nt++) {
        const vt = q.removed[nt], ot = y.indexOf(vt);
        ot >= 0 && (y[ot] = null, b[ot].disconnect(vt));
      }
      for (let nt = 0; nt < q.added.length; nt++) {
        const vt = q.added[nt];
        let ot = y.indexOf(vt);
        if (ot === -1) {
          for (let Lt = 0; Lt < b.length; Lt++)
            if (Lt >= y.length) {
              y.push(vt), ot = Lt;
              break;
            } else if (y[Lt] === null) {
              y[Lt] = vt, ot = Lt;
              break;
            }
          if (ot === -1) break;
        }
        const Tt = b[ot];
        Tt && Tt.connect(vt);
      }
    }
    const V = new L(), K = new L();
    function H(q, nt, vt) {
      V.setFromMatrixPosition(nt.matrixWorld), K.setFromMatrixPosition(vt.matrixWorld);
      const ot = V.distanceTo(K), Tt = nt.projectionMatrix.elements, Lt = vt.projectionMatrix.elements, zt = Tt[14] / (Tt[10] - 1), oe = Tt[14] / (Tt[10] + 1), Wt = (Tt[9] + 1) / Tt[5], ce = (Tt[9] - 1) / Tt[5], I = (Tt[8] - 1) / Tt[0], Ne = (Lt[8] + 1) / Lt[0], Ht = zt * I, Vt = zt * Ne, Et = ot / (-I + Ne), ne = Et * -I;
      if (nt.matrixWorld.decompose(q.position, q.quaternion, q.scale), q.translateX(ne), q.translateZ(Et), q.matrixWorld.compose(q.position, q.quaternion, q.scale), q.matrixWorldInverse.copy(q.matrixWorld).invert(), Tt[10] === -1)
        q.projectionMatrix.copy(nt.projectionMatrix), q.projectionMatrixInverse.copy(nt.projectionMatrixInverse);
      else {
        const bt = zt + Et, w = oe + Et, v = Ht - ne, B = Vt + (ot - ne), Y = Wt * oe / w * bt, j = ce * oe / w * bt;
        q.projectionMatrix.makePerspective(v, B, Y, j, bt, w), q.projectionMatrixInverse.copy(q.projectionMatrix).invert();
      }
    }
    function st(q, nt) {
      nt === null ? q.matrixWorld.copy(q.matrix) : q.matrixWorld.multiplyMatrices(nt.matrixWorld, q.matrix), q.matrixWorldInverse.copy(q.matrixWorld).invert();
    }
    this.updateCamera = function(q) {
      if (s === null) return;
      let nt = q.near, vt = q.far;
      x.texture !== null && (x.depthNear > 0 && (nt = x.depthNear), x.depthFar > 0 && (vt = x.depthFar)), _.near = C.near = T.near = nt, _.far = C.far = T.far = vt, (A !== _.near || F !== _.far) && (s.updateRenderState({
        depthNear: _.near,
        depthFar: _.far
      }), A = _.near, F = _.far), T.layers.mask = q.layers.mask | 2, C.layers.mask = q.layers.mask | 4, _.layers.mask = T.layers.mask | C.layers.mask;
      const ot = q.parent, Tt = _.cameras;
      st(_, ot);
      for (let Lt = 0; Lt < Tt.length; Lt++)
        st(Tt[Lt], ot);
      Tt.length === 2 ? H(_, T, C) : _.projectionMatrix.copy(T.projectionMatrix), ut(q, _, ot);
    };
    function ut(q, nt, vt) {
      vt === null ? q.matrix.copy(nt.matrixWorld) : (q.matrix.copy(vt.matrixWorld), q.matrix.invert(), q.matrix.multiply(nt.matrixWorld)), q.matrix.decompose(q.position, q.quaternion, q.scale), q.updateMatrixWorld(!0), q.projectionMatrix.copy(nt.projectionMatrix), q.projectionMatrixInverse.copy(nt.projectionMatrixInverse), q.isPerspectiveCamera && (q.fov = ss * 2 * Math.atan(1 / q.projectionMatrix.elements[5]), q.zoom = 1);
    }
    this.getCamera = function() {
      return _;
    }, this.getFoveation = function() {
      if (!(f === null && d === null))
        return l;
    }, this.setFoveation = function(q) {
      l = q, f !== null && (f.fixedFoveation = q), d !== null && d.fixedFoveation !== void 0 && (d.fixedFoveation = q);
    }, this.hasDepthSensing = function() {
      return x.texture !== null;
    }, this.getDepthSensingMesh = function() {
      return x.getMesh(_);
    };
    let yt = null;
    function Bt(q, nt) {
      if (u = nt.getViewerPose(h || o), g = nt, u !== null) {
        const vt = u.views;
        d !== null && (t.setRenderTargetFramebuffer(E, d.framebuffer), t.setRenderTarget(E));
        let ot = !1;
        vt.length !== _.cameras.length && (_.cameras.length = 0, ot = !0);
        for (let Lt = 0; Lt < vt.length; Lt++) {
          const zt = vt[Lt];
          let oe = null;
          if (d !== null)
            oe = d.getViewport(zt);
          else {
            const ce = c.getViewSubImage(f, zt);
            oe = ce.viewport, Lt === 0 && (t.setRenderTargetTextures(
              E,
              ce.colorTexture,
              f.ignoreDepthValues ? void 0 : ce.depthStencilTexture
            ), t.setRenderTarget(E));
          }
          let Wt = M[Lt];
          Wt === void 0 && (Wt = new Ie(), Wt.layers.enable(Lt), Wt.viewport = new Qt(), M[Lt] = Wt), Wt.matrix.fromArray(zt.transform.matrix), Wt.matrix.decompose(Wt.position, Wt.quaternion, Wt.scale), Wt.projectionMatrix.fromArray(zt.projectionMatrix), Wt.projectionMatrixInverse.copy(Wt.projectionMatrix).invert(), Wt.viewport.set(oe.x, oe.y, oe.width, oe.height), Lt === 0 && (_.matrix.copy(Wt.matrix), _.matrix.decompose(_.position, _.quaternion, _.scale)), ot === !0 && _.cameras.push(Wt);
        }
        const Tt = s.enabledFeatures;
        if (Tt && Tt.includes("depth-sensing")) {
          const Lt = c.getDepthInformation(vt[0]);
          Lt && Lt.isValid && Lt.texture && x.init(t, Lt, s.renderState);
        }
      }
      for (let vt = 0; vt < b.length; vt++) {
        const ot = y[vt], Tt = b[vt];
        ot !== null && Tt !== void 0 && Tt.update(ot, nt, h || o);
      }
      yt && yt(q, nt), nt.detectedPlanes && n.dispatchEvent({ type: "planesdetected", data: nt }), g = null;
    }
    const jt = new fc();
    jt.setAnimationLoop(Bt), this.setAnimationLoop = function(q) {
      yt = q;
    }, this.dispose = function() {
    };
  }
}
const zn = /* @__PURE__ */ new Je(), ug = /* @__PURE__ */ new re();
function dg(i, t) {
  function e(m, p) {
    m.matrixAutoUpdate === !0 && m.updateMatrix(), p.value.copy(m.matrix);
  }
  function n(m, p) {
    p.color.getRGB(m.fogColor.value, hc(i)), p.isFog ? (m.fogNear.value = p.near, m.fogFar.value = p.far) : p.isFogExp2 && (m.fogDensity.value = p.density);
  }
  function s(m, p, E, b, y) {
    p.isMeshBasicMaterial || p.isMeshLambertMaterial ? r(m, p) : p.isMeshToonMaterial ? (r(m, p), c(m, p)) : p.isMeshPhongMaterial ? (r(m, p), u(m, p)) : p.isMeshStandardMaterial ? (r(m, p), f(m, p), p.isMeshPhysicalMaterial && d(m, p, y)) : p.isMeshMatcapMaterial ? (r(m, p), g(m, p)) : p.isMeshDepthMaterial ? r(m, p) : p.isMeshDistanceMaterial ? (r(m, p), x(m, p)) : p.isMeshNormalMaterial ? r(m, p) : p.isLineBasicMaterial ? (o(m, p), p.isLineDashedMaterial && a(m, p)) : p.isPointsMaterial ? l(m, p, E, b) : p.isSpriteMaterial ? h(m, p) : p.isShadowMaterial ? (m.color.value.copy(p.color), m.opacity.value = p.opacity) : p.isShaderMaterial && (p.uniformsNeedUpdate = !1);
  }
  function r(m, p) {
    m.opacity.value = p.opacity, p.color && m.diffuse.value.copy(p.color), p.emissive && m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity), p.map && (m.map.value = p.map, e(p.map, m.mapTransform)), p.alphaMap && (m.alphaMap.value = p.alphaMap, e(p.alphaMap, m.alphaMapTransform)), p.bumpMap && (m.bumpMap.value = p.bumpMap, e(p.bumpMap, m.bumpMapTransform), m.bumpScale.value = p.bumpScale, p.side === Ce && (m.bumpScale.value *= -1)), p.normalMap && (m.normalMap.value = p.normalMap, e(p.normalMap, m.normalMapTransform), m.normalScale.value.copy(p.normalScale), p.side === Ce && m.normalScale.value.negate()), p.displacementMap && (m.displacementMap.value = p.displacementMap, e(p.displacementMap, m.displacementMapTransform), m.displacementScale.value = p.displacementScale, m.displacementBias.value = p.displacementBias), p.emissiveMap && (m.emissiveMap.value = p.emissiveMap, e(p.emissiveMap, m.emissiveMapTransform)), p.specularMap && (m.specularMap.value = p.specularMap, e(p.specularMap, m.specularMapTransform)), p.alphaTest > 0 && (m.alphaTest.value = p.alphaTest);
    const E = t.get(p), b = E.envMap, y = E.envMapRotation;
    b && (m.envMap.value = b, zn.copy(y), zn.x *= -1, zn.y *= -1, zn.z *= -1, b.isCubeTexture && b.isRenderTargetTexture === !1 && (zn.y *= -1, zn.z *= -1), m.envMapRotation.value.setFromMatrix4(ug.makeRotationFromEuler(zn)), m.flipEnvMap.value = b.isCubeTexture && b.isRenderTargetTexture === !1 ? -1 : 1, m.reflectivity.value = p.reflectivity, m.ior.value = p.ior, m.refractionRatio.value = p.refractionRatio), p.lightMap && (m.lightMap.value = p.lightMap, m.lightMapIntensity.value = p.lightMapIntensity, e(p.lightMap, m.lightMapTransform)), p.aoMap && (m.aoMap.value = p.aoMap, m.aoMapIntensity.value = p.aoMapIntensity, e(p.aoMap, m.aoMapTransform));
  }
  function o(m, p) {
    m.diffuse.value.copy(p.color), m.opacity.value = p.opacity, p.map && (m.map.value = p.map, e(p.map, m.mapTransform));
  }
  function a(m, p) {
    m.dashSize.value = p.dashSize, m.totalSize.value = p.dashSize + p.gapSize, m.scale.value = p.scale;
  }
  function l(m, p, E, b) {
    m.diffuse.value.copy(p.color), m.opacity.value = p.opacity, m.size.value = p.size * E, m.scale.value = b * 0.5, p.map && (m.map.value = p.map, e(p.map, m.uvTransform)), p.alphaMap && (m.alphaMap.value = p.alphaMap, e(p.alphaMap, m.alphaMapTransform)), p.alphaTest > 0 && (m.alphaTest.value = p.alphaTest);
  }
  function h(m, p) {
    m.diffuse.value.copy(p.color), m.opacity.value = p.opacity, m.rotation.value = p.rotation, p.map && (m.map.value = p.map, e(p.map, m.mapTransform)), p.alphaMap && (m.alphaMap.value = p.alphaMap, e(p.alphaMap, m.alphaMapTransform)), p.alphaTest > 0 && (m.alphaTest.value = p.alphaTest);
  }
  function u(m, p) {
    m.specular.value.copy(p.specular), m.shininess.value = Math.max(p.shininess, 1e-4);
  }
  function c(m, p) {
    p.gradientMap && (m.gradientMap.value = p.gradientMap);
  }
  function f(m, p) {
    m.metalness.value = p.metalness, p.metalnessMap && (m.metalnessMap.value = p.metalnessMap, e(p.metalnessMap, m.metalnessMapTransform)), m.roughness.value = p.roughness, p.roughnessMap && (m.roughnessMap.value = p.roughnessMap, e(p.roughnessMap, m.roughnessMapTransform)), p.envMap && (m.envMapIntensity.value = p.envMapIntensity);
  }
  function d(m, p, E) {
    m.ior.value = p.ior, p.sheen > 0 && (m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen), m.sheenRoughness.value = p.sheenRoughness, p.sheenColorMap && (m.sheenColorMap.value = p.sheenColorMap, e(p.sheenColorMap, m.sheenColorMapTransform)), p.sheenRoughnessMap && (m.sheenRoughnessMap.value = p.sheenRoughnessMap, e(p.sheenRoughnessMap, m.sheenRoughnessMapTransform))), p.clearcoat > 0 && (m.clearcoat.value = p.clearcoat, m.clearcoatRoughness.value = p.clearcoatRoughness, p.clearcoatMap && (m.clearcoatMap.value = p.clearcoatMap, e(p.clearcoatMap, m.clearcoatMapTransform)), p.clearcoatRoughnessMap && (m.clearcoatRoughnessMap.value = p.clearcoatRoughnessMap, e(p.clearcoatRoughnessMap, m.clearcoatRoughnessMapTransform)), p.clearcoatNormalMap && (m.clearcoatNormalMap.value = p.clearcoatNormalMap, e(p.clearcoatNormalMap, m.clearcoatNormalMapTransform), m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale), p.side === Ce && m.clearcoatNormalScale.value.negate())), p.dispersion > 0 && (m.dispersion.value = p.dispersion), p.iridescence > 0 && (m.iridescence.value = p.iridescence, m.iridescenceIOR.value = p.iridescenceIOR, m.iridescenceThicknessMinimum.value = p.iridescenceThicknessRange[0], m.iridescenceThicknessMaximum.value = p.iridescenceThicknessRange[1], p.iridescenceMap && (m.iridescenceMap.value = p.iridescenceMap, e(p.iridescenceMap, m.iridescenceMapTransform)), p.iridescenceThicknessMap && (m.iridescenceThicknessMap.value = p.iridescenceThicknessMap, e(p.iridescenceThicknessMap, m.iridescenceThicknessMapTransform))), p.transmission > 0 && (m.transmission.value = p.transmission, m.transmissionSamplerMap.value = E.texture, m.transmissionSamplerSize.value.set(E.width, E.height), p.transmissionMap && (m.transmissionMap.value = p.transmissionMap, e(p.transmissionMap, m.transmissionMapTransform)), m.thickness.value = p.thickness, p.thicknessMap && (m.thicknessMap.value = p.thicknessMap, e(p.thicknessMap, m.thicknessMapTransform)), m.attenuationDistance.value = p.attenuationDistance, m.attenuationColor.value.copy(p.attenuationColor)), p.anisotropy > 0 && (m.anisotropyVector.value.set(p.anisotropy * Math.cos(p.anisotropyRotation), p.anisotropy * Math.sin(p.anisotropyRotation)), p.anisotropyMap && (m.anisotropyMap.value = p.anisotropyMap, e(p.anisotropyMap, m.anisotropyMapTransform))), m.specularIntensity.value = p.specularIntensity, m.specularColor.value.copy(p.specularColor), p.specularColorMap && (m.specularColorMap.value = p.specularColorMap, e(p.specularColorMap, m.specularColorMapTransform)), p.specularIntensityMap && (m.specularIntensityMap.value = p.specularIntensityMap, e(p.specularIntensityMap, m.specularIntensityMapTransform));
  }
  function g(m, p) {
    p.matcap && (m.matcap.value = p.matcap);
  }
  function x(m, p) {
    const E = t.get(p).light;
    m.referencePosition.value.setFromMatrixPosition(E.matrixWorld), m.nearDistance.value = E.shadow.camera.near, m.farDistance.value = E.shadow.camera.far;
  }
  return {
    refreshFogUniforms: n,
    refreshMaterialUniforms: s
  };
}
function fg(i, t, e, n) {
  let s = {}, r = {}, o = [];
  const a = i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);
  function l(E, b) {
    const y = b.program;
    n.uniformBlockBinding(E, y);
  }
  function h(E, b) {
    let y = s[E.id];
    y === void 0 && (g(E), y = u(E), s[E.id] = y, E.addEventListener("dispose", m));
    const N = b.program;
    n.updateUBOMapping(E, N);
    const R = t.render.frame;
    r[E.id] !== R && (f(E), r[E.id] = R);
  }
  function u(E) {
    const b = c();
    E.__bindingPointIndex = b;
    const y = i.createBuffer(), N = E.__size, R = E.usage;
    return i.bindBuffer(i.UNIFORM_BUFFER, y), i.bufferData(i.UNIFORM_BUFFER, N, R), i.bindBuffer(i.UNIFORM_BUFFER, null), i.bindBufferBase(i.UNIFORM_BUFFER, b, y), y;
  }
  function c() {
    for (let E = 0; E < a; E++)
      if (o.indexOf(E) === -1)
        return o.push(E), E;
    return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."), 0;
  }
  function f(E) {
    const b = s[E.id], y = E.uniforms, N = E.__cache;
    i.bindBuffer(i.UNIFORM_BUFFER, b);
    for (let R = 0, T = y.length; R < T; R++) {
      const C = Array.isArray(y[R]) ? y[R] : [y[R]];
      for (let M = 0, _ = C.length; M < _; M++) {
        const A = C[M];
        if (d(A, R, M, N) === !0) {
          const F = A.__offset, O = Array.isArray(A.value) ? A.value : [A.value];
          let G = 0;
          for (let $ = 0; $ < O.length; $++) {
            const V = O[$], K = x(V);
            typeof V == "number" || typeof V == "boolean" ? (A.__data[0] = V, i.bufferSubData(i.UNIFORM_BUFFER, F + G, A.__data)) : V.isMatrix3 ? (A.__data[0] = V.elements[0], A.__data[1] = V.elements[1], A.__data[2] = V.elements[2], A.__data[3] = 0, A.__data[4] = V.elements[3], A.__data[5] = V.elements[4], A.__data[6] = V.elements[5], A.__data[7] = 0, A.__data[8] = V.elements[6], A.__data[9] = V.elements[7], A.__data[10] = V.elements[8], A.__data[11] = 0) : (V.toArray(A.__data, G), G += K.storage / Float32Array.BYTES_PER_ELEMENT);
          }
          i.bufferSubData(i.UNIFORM_BUFFER, F, A.__data);
        }
      }
    }
    i.bindBuffer(i.UNIFORM_BUFFER, null);
  }
  function d(E, b, y, N) {
    const R = E.value, T = b + "_" + y;
    if (N[T] === void 0)
      return typeof R == "number" || typeof R == "boolean" ? N[T] = R : N[T] = R.clone(), !0;
    {
      const C = N[T];
      if (typeof R == "number" || typeof R == "boolean") {
        if (C !== R)
          return N[T] = R, !0;
      } else if (C.equals(R) === !1)
        return C.copy(R), !0;
    }
    return !1;
  }
  function g(E) {
    const b = E.uniforms;
    let y = 0;
    const N = 16;
    for (let T = 0, C = b.length; T < C; T++) {
      const M = Array.isArray(b[T]) ? b[T] : [b[T]];
      for (let _ = 0, A = M.length; _ < A; _++) {
        const F = M[_], O = Array.isArray(F.value) ? F.value : [F.value];
        for (let G = 0, $ = O.length; G < $; G++) {
          const V = O[G], K = x(V), H = y % N, st = H % K.boundary, ut = H + st;
          y += st, ut !== 0 && N - ut < K.storage && (y += N - ut), F.__data = new Float32Array(K.storage / Float32Array.BYTES_PER_ELEMENT), F.__offset = y, y += K.storage;
        }
      }
    }
    const R = y % N;
    return R > 0 && (y += N - R), E.__size = y, E.__cache = {}, this;
  }
  function x(E) {
    const b = {
      boundary: 0,
      // bytes
      storage: 0
      // bytes
    };
    return typeof E == "number" || typeof E == "boolean" ? (b.boundary = 4, b.storage = 4) : E.isVector2 ? (b.boundary = 8, b.storage = 8) : E.isVector3 || E.isColor ? (b.boundary = 16, b.storage = 12) : E.isVector4 ? (b.boundary = 16, b.storage = 16) : E.isMatrix3 ? (b.boundary = 48, b.storage = 48) : E.isMatrix4 ? (b.boundary = 64, b.storage = 64) : E.isTexture ? console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group.") : console.warn("THREE.WebGLRenderer: Unsupported uniform value type.", E), b;
  }
  function m(E) {
    const b = E.target;
    b.removeEventListener("dispose", m);
    const y = o.indexOf(b.__bindingPointIndex);
    o.splice(y, 1), i.deleteBuffer(s[b.id]), delete s[b.id], delete r[b.id];
  }
  function p() {
    for (const E in s)
      i.deleteBuffer(s[E]);
    o = [], s = {}, r = {};
  }
  return {
    bind: l,
    update: h,
    dispose: p
  };
}
class pg {
  constructor(t = {}) {
    const {
      canvas: e = eu(),
      context: n = null,
      depth: s = !0,
      stencil: r = !1,
      alpha: o = !1,
      antialias: a = !1,
      premultipliedAlpha: l = !0,
      preserveDrawingBuffer: h = !1,
      powerPreference: u = "default",
      failIfMajorPerformanceCaveat: c = !1,
      reverseDepthBuffer: f = !1
    } = t;
    this.isWebGLRenderer = !0;
    let d;
    if (n !== null) {
      if (typeof WebGLRenderingContext < "u" && n instanceof WebGLRenderingContext)
        throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");
      d = n.getContextAttributes().alpha;
    } else
      d = o;
    const g = new Uint32Array(4), x = new Int32Array(4);
    let m = null, p = null;
    const E = [], b = [];
    this.domElement = e, this.debug = {
      /**
       * Enables error checking and reporting when shader programs are being compiled
       * @type {boolean}
       */
      checkShaderErrors: !0,
      /**
       * Callback for custom error reporting.
       * @type {?Function}
       */
      onShaderError: null
    }, this.autoClear = !0, this.autoClearColor = !0, this.autoClearDepth = !0, this.autoClearStencil = !0, this.sortObjects = !0, this.clippingPlanes = [], this.localClippingEnabled = !1, this._outputColorSpace = Ue, this.toneMapping = Rn, this.toneMappingExposure = 1;
    const y = this;
    let N = !1, R = 0, T = 0, C = null, M = -1, _ = null;
    const A = new Qt(), F = new Qt();
    let O = null;
    const G = new Pt(0);
    let $ = 0, V = e.width, K = e.height, H = 1, st = null, ut = null;
    const yt = new Qt(0, 0, V, K), Bt = new Qt(0, 0, V, K);
    let jt = !1;
    const q = new Wo();
    let nt = !1, vt = !1;
    const ot = new re(), Tt = new re(), Lt = new L(), zt = new Qt(), oe = { background: null, fog: null, environment: null, overrideMaterial: null, isScene: !0 };
    let Wt = !1;
    function ce() {
      return C === null ? H : 1;
    }
    let I = n;
    function Ne(S, D) {
      return e.getContext(S, D);
    }
    try {
      const S = {
        alpha: !0,
        depth: s,
        stencil: r,
        antialias: a,
        premultipliedAlpha: l,
        preserveDrawingBuffer: h,
        powerPreference: u,
        failIfMajorPerformanceCaveat: c
      };
      if ("setAttribute" in e && e.setAttribute("data-engine", `three.js r${Io}`), e.addEventListener("webglcontextlost", Z, !1), e.addEventListener("webglcontextrestored", ht, !1), e.addEventListener("webglcontextcreationerror", lt, !1), I === null) {
        const D = "webgl2";
        if (I = Ne(D, S), I === null)
          throw Ne(D) ? new Error("Error creating WebGL context with your selected attributes.") : new Error("Error creating WebGL context.");
      }
    } catch (S) {
      throw console.error("THREE.WebGLRenderer: " + S.message), S;
    }
    let Ht, Vt, Et, ne, bt, w, v, B, Y, j, X, Mt, at, ft, $t, tt, pt, wt, At, mt, Gt, Nt, te, P;
    function rt() {
      Ht = new vp(I), Ht.init(), Nt = new sg(I, Ht), Vt = new fp(I, Ht, t, Nt), Et = new eg(I, Ht), Vt.reverseDepthBuffer && f && Et.buffers.depth.setReversed(!0), ne = new yp(I), bt = new km(), w = new ig(I, Ht, Et, bt, Vt, Nt, ne), v = new mp(y), B = new xp(y), Y = new Ru(I), te = new up(I, Y), j = new Mp(I, Y, ne, te), X = new Ep(I, j, Y, ne), At = new bp(I, Vt, w), tt = new pp(bt), Mt = new zm(y, v, B, Ht, Vt, te, tt), at = new dg(y, bt), ft = new Vm(), $t = new Ym(Ht), wt = new hp(y, v, B, Et, X, d, l), pt = new Qm(y, X, Vt), P = new fg(I, ne, Vt, Et), mt = new dp(I, Ht, ne), Gt = new Sp(I, Ht, ne), ne.programs = Mt.programs, y.capabilities = Vt, y.extensions = Ht, y.properties = bt, y.renderLists = ft, y.shadowMap = pt, y.state = Et, y.info = ne;
    }
    rt();
    const W = new hg(y, I);
    this.xr = W, this.getContext = function() {
      return I;
    }, this.getContextAttributes = function() {
      return I.getContextAttributes();
    }, this.forceContextLoss = function() {
      const S = Ht.get("WEBGL_lose_context");
      S && S.loseContext();
    }, this.forceContextRestore = function() {
      const S = Ht.get("WEBGL_lose_context");
      S && S.restoreContext();
    }, this.getPixelRatio = function() {
      return H;
    }, this.setPixelRatio = function(S) {
      S !== void 0 && (H = S, this.setSize(V, K, !1));
    }, this.getSize = function(S) {
      return S.set(V, K);
    }, this.setSize = function(S, D, z = !0) {
      if (W.isPresenting) {
        console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");
        return;
      }
      V = S, K = D, e.width = Math.floor(S * H), e.height = Math.floor(D * H), z === !0 && (e.style.width = S + "px", e.style.height = D + "px"), this.setViewport(0, 0, S, D);
    }, this.getDrawingBufferSize = function(S) {
      return S.set(V * H, K * H).floor();
    }, this.setDrawingBufferSize = function(S, D, z) {
      V = S, K = D, H = z, e.width = Math.floor(S * z), e.height = Math.floor(D * z), this.setViewport(0, 0, S, D);
    }, this.getCurrentViewport = function(S) {
      return S.copy(A);
    }, this.getViewport = function(S) {
      return S.copy(yt);
    }, this.setViewport = function(S, D, z, k) {
      S.isVector4 ? yt.set(S.x, S.y, S.z, S.w) : yt.set(S, D, z, k), Et.viewport(A.copy(yt).multiplyScalar(H).round());
    }, this.getScissor = function(S) {
      return S.copy(Bt);
    }, this.setScissor = function(S, D, z, k) {
      S.isVector4 ? Bt.set(S.x, S.y, S.z, S.w) : Bt.set(S, D, z, k), Et.scissor(F.copy(Bt).multiplyScalar(H).round());
    }, this.getScissorTest = function() {
      return jt;
    }, this.setScissorTest = function(S) {
      Et.setScissorTest(jt = S);
    }, this.setOpaqueSort = function(S) {
      st = S;
    }, this.setTransparentSort = function(S) {
      ut = S;
    }, this.getClearColor = function(S) {
      return S.copy(wt.getClearColor());
    }, this.setClearColor = function() {
      wt.setClearColor.apply(wt, arguments);
    }, this.getClearAlpha = function() {
      return wt.getClearAlpha();
    }, this.setClearAlpha = function() {
      wt.setClearAlpha.apply(wt, arguments);
    }, this.clear = function(S = !0, D = !0, z = !0) {
      let k = 0;
      if (S) {
        let U = !1;
        if (C !== null) {
          const et = C.texture.format;
          U = et === ko || et === zo || et === Bo;
        }
        if (U) {
          const et = C.texture.type, ct = et === mn || et === jn || et === is || et === Ai || et === Fo || et === Oo, gt = wt.getClearColor(), _t = wt.getClearAlpha(), Ct = gt.r, Ut = gt.g, xt = gt.b;
          ct ? (g[0] = Ct, g[1] = Ut, g[2] = xt, g[3] = _t, I.clearBufferuiv(I.COLOR, 0, g)) : (x[0] = Ct, x[1] = Ut, x[2] = xt, x[3] = _t, I.clearBufferiv(I.COLOR, 0, x));
        } else
          k |= I.COLOR_BUFFER_BIT;
      }
      D && (k |= I.DEPTH_BUFFER_BIT), z && (k |= I.STENCIL_BUFFER_BIT, this.state.buffers.stencil.setMask(4294967295)), I.clear(k);
    }, this.clearColor = function() {
      this.clear(!0, !1, !1);
    }, this.clearDepth = function() {
      this.clear(!1, !0, !1);
    }, this.clearStencil = function() {
      this.clear(!1, !1, !0);
    }, this.dispose = function() {
      e.removeEventListener("webglcontextlost", Z, !1), e.removeEventListener("webglcontextrestored", ht, !1), e.removeEventListener("webglcontextcreationerror", lt, !1), ft.dispose(), $t.dispose(), bt.dispose(), v.dispose(), B.dispose(), X.dispose(), te.dispose(), P.dispose(), Mt.dispose(), W.dispose(), W.removeEventListener("sessionstart", Ko), W.removeEventListener("sessionend", Jo), Dn.stop();
    };
    function Z(S) {
      S.preventDefault(), console.log("THREE.WebGLRenderer: Context Lost."), N = !0;
    }
    function ht() {
      console.log("THREE.WebGLRenderer: Context Restored."), N = !1;
      const S = ne.autoReset, D = pt.enabled, z = pt.autoUpdate, k = pt.needsUpdate, U = pt.type;
      rt(), ne.autoReset = S, pt.enabled = D, pt.autoUpdate = z, pt.needsUpdate = k, pt.type = U;
    }
    function lt(S) {
      console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ", S.statusMessage);
    }
    function Dt(S) {
      const D = S.target;
      D.removeEventListener("dispose", Dt), ae(D);
    }
    function ae(S) {
      _e(S), bt.remove(S);
    }
    function _e(S) {
      const D = bt.get(S).programs;
      D !== void 0 && (D.forEach(function(z) {
        Mt.releaseProgram(z);
      }), S.isShaderMaterial && Mt.releaseShaderCache(S));
    }
    this.renderBufferDirect = function(S, D, z, k, U, et) {
      D === null && (D = oe);
      const ct = U.isMesh && U.matrixWorld.determinant() < 0, gt = Cc(S, D, z, k, U);
      Et.setMaterial(k, ct);
      let _t = z.index, Ct = 1;
      if (k.wireframe === !0) {
        if (_t = j.getWireframeAttribute(z), _t === void 0) return;
        Ct = 2;
      }
      const Ut = z.drawRange, xt = z.attributes.position;
      let qt = Ut.start * Ct, ee = (Ut.start + Ut.count) * Ct;
      et !== null && (qt = Math.max(qt, et.start * Ct), ee = Math.min(ee, (et.start + et.count) * Ct)), _t !== null ? (qt = Math.max(qt, 0), ee = Math.min(ee, _t.count)) : xt != null && (qt = Math.max(qt, 0), ee = Math.min(ee, xt.count));
      const ie = ee - qt;
      if (ie < 0 || ie === 1 / 0) return;
      te.setup(U, k, gt, z, _t);
      let Re, Yt = mt;
      if (_t !== null && (Re = Y.get(_t), Yt = Gt, Yt.setIndex(Re)), U.isMesh)
        k.wireframe === !0 ? (Et.setLineWidth(k.wireframeLinewidth * ce()), Yt.setMode(I.LINES)) : Yt.setMode(I.TRIANGLES);
      else if (U.isLine) {
        let St = k.linewidth;
        St === void 0 && (St = 1), Et.setLineWidth(St * ce()), U.isLineSegments ? Yt.setMode(I.LINES) : U.isLineLoop ? Yt.setMode(I.LINE_LOOP) : Yt.setMode(I.LINE_STRIP);
      } else U.isPoints ? Yt.setMode(I.POINTS) : U.isSprite && Yt.setMode(I.TRIANGLES);
      if (U.isBatchedMesh)
        if (U._multiDrawInstances !== null)
          Yt.renderMultiDrawInstances(U._multiDrawStarts, U._multiDrawCounts, U._multiDrawCount, U._multiDrawInstances);
        else if (Ht.get("WEBGL_multi_draw"))
          Yt.renderMultiDraw(U._multiDrawStarts, U._multiDrawCounts, U._multiDrawCount);
        else {
          const St = U._multiDrawStarts, en = U._multiDrawCounts, Zt = U._multiDrawCount, He = _t ? Y.get(_t).bytesPerElement : 1, Jn = bt.get(k).currentProgram.getUniforms();
          for (let Pe = 0; Pe < Zt; Pe++)
            Jn.setValue(I, "_gl_DrawID", Pe), Yt.render(St[Pe] / He, en[Pe]);
        }
      else if (U.isInstancedMesh)
        Yt.renderInstances(qt, ie, U.count);
      else if (z.isInstancedBufferGeometry) {
        const St = z._maxInstanceCount !== void 0 ? z._maxInstanceCount : 1 / 0, en = Math.min(z.instanceCount, St);
        Yt.renderInstances(qt, ie, en);
      } else
        Yt.render(qt, ie);
    };
    function Kt(S, D, z) {
      S.transparent === !0 && S.side === hn && S.forceSinglePass === !1 ? (S.side = Ce, S.needsUpdate = !0, ds(S, D, z), S.side = Pn, S.needsUpdate = !0, ds(S, D, z), S.side = hn) : ds(S, D, z);
    }
    this.compile = function(S, D, z = null) {
      z === null && (z = S), p = $t.get(z), p.init(D), b.push(p), z.traverseVisible(function(U) {
        U.isLight && U.layers.test(D.layers) && (p.pushLight(U), U.castShadow && p.pushShadow(U));
      }), S !== z && S.traverseVisible(function(U) {
        U.isLight && U.layers.test(D.layers) && (p.pushLight(U), U.castShadow && p.pushShadow(U));
      }), p.setupLights();
      const k = /* @__PURE__ */ new Set();
      return S.traverse(function(U) {
        if (!(U.isMesh || U.isPoints || U.isLine || U.isSprite))
          return;
        const et = U.material;
        if (et)
          if (Array.isArray(et))
            for (let ct = 0; ct < et.length; ct++) {
              const gt = et[ct];
              Kt(gt, z, U), k.add(gt);
            }
          else
            Kt(et, z, U), k.add(et);
      }), b.pop(), p = null, k;
    }, this.compileAsync = function(S, D, z = null) {
      const k = this.compile(S, D, z);
      return new Promise((U) => {
        function et() {
          if (k.forEach(function(ct) {
            bt.get(ct).currentProgram.isReady() && k.delete(ct);
          }), k.size === 0) {
            U(S);
            return;
          }
          setTimeout(et, 10);
        }
        Ht.get("KHR_parallel_shader_compile") !== null ? et() : setTimeout(et, 10);
      });
    };
    let ke = null;
    function tn(S) {
      ke && ke(S);
    }
    function Ko() {
      Dn.stop();
    }
    function Jo() {
      Dn.start();
    }
    const Dn = new fc();
    Dn.setAnimationLoop(tn), typeof self < "u" && Dn.setContext(self), this.setAnimationLoop = function(S) {
      ke = S, W.setAnimationLoop(S), S === null ? Dn.stop() : Dn.start();
    }, W.addEventListener("sessionstart", Ko), W.addEventListener("sessionend", Jo), this.render = function(S, D) {
      if (D !== void 0 && D.isCamera !== !0) {
        console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");
        return;
      }
      if (N === !0) return;
      if (S.matrixWorldAutoUpdate === !0 && S.updateMatrixWorld(), D.parent === null && D.matrixWorldAutoUpdate === !0 && D.updateMatrixWorld(), W.enabled === !0 && W.isPresenting === !0 && (W.cameraAutoUpdate === !0 && W.updateCamera(D), D = W.getCamera()), S.isScene === !0 && S.onBeforeRender(y, S, D, C), p = $t.get(S, b.length), p.init(D), b.push(p), Tt.multiplyMatrices(D.projectionMatrix, D.matrixWorldInverse), q.setFromProjectionMatrix(Tt), vt = this.localClippingEnabled, nt = tt.init(this.clippingPlanes, vt), m = ft.get(S, E.length), m.init(), E.push(m), W.enabled === !0 && W.isPresenting === !0) {
        const et = y.xr.getDepthSensingMesh();
        et !== null && nr(et, D, -1 / 0, y.sortObjects);
      }
      nr(S, D, 0, y.sortObjects), m.finish(), y.sortObjects === !0 && m.sort(st, ut), Wt = W.enabled === !1 || W.isPresenting === !1 || W.hasDepthSensing() === !1, Wt && wt.addToRenderList(m, S), this.info.render.frame++, nt === !0 && tt.beginShadows();
      const z = p.state.shadowsArray;
      pt.render(z, S, D), nt === !0 && tt.endShadows(), this.info.autoReset === !0 && this.info.reset();
      const k = m.opaque, U = m.transmissive;
      if (p.setupLights(), D.isArrayCamera) {
        const et = D.cameras;
        if (U.length > 0)
          for (let ct = 0, gt = et.length; ct < gt; ct++) {
            const _t = et[ct];
            ta(k, U, S, _t);
          }
        Wt && wt.render(S);
        for (let ct = 0, gt = et.length; ct < gt; ct++) {
          const _t = et[ct];
          Qo(m, S, _t, _t.viewport);
        }
      } else
        U.length > 0 && ta(k, U, S, D), Wt && wt.render(S), Qo(m, S, D);
      C !== null && (w.updateMultisampleRenderTarget(C), w.updateRenderTargetMipmap(C)), S.isScene === !0 && S.onAfterRender(y, S, D), te.resetDefaultState(), M = -1, _ = null, b.pop(), b.length > 0 ? (p = b[b.length - 1], nt === !0 && tt.setGlobalState(y.clippingPlanes, p.state.camera)) : p = null, E.pop(), E.length > 0 ? m = E[E.length - 1] : m = null;
    };
    function nr(S, D, z, k) {
      if (S.visible === !1) return;
      if (S.layers.test(D.layers)) {
        if (S.isGroup)
          z = S.renderOrder;
        else if (S.isLOD)
          S.autoUpdate === !0 && S.update(D);
        else if (S.isLight)
          p.pushLight(S), S.castShadow && p.pushShadow(S);
        else if (S.isSprite) {
          if (!S.frustumCulled || q.intersectsSprite(S)) {
            k && zt.setFromMatrixPosition(S.matrixWorld).applyMatrix4(Tt);
            const ct = X.update(S), gt = S.material;
            gt.visible && m.push(S, ct, gt, z, zt.z, null);
          }
        } else if ((S.isMesh || S.isLine || S.isPoints) && (!S.frustumCulled || q.intersectsObject(S))) {
          const ct = X.update(S), gt = S.material;
          if (k && (S.boundingSphere !== void 0 ? (S.boundingSphere === null && S.computeBoundingSphere(), zt.copy(S.boundingSphere.center)) : (ct.boundingSphere === null && ct.computeBoundingSphere(), zt.copy(ct.boundingSphere.center)), zt.applyMatrix4(S.matrixWorld).applyMatrix4(Tt)), Array.isArray(gt)) {
            const _t = ct.groups;
            for (let Ct = 0, Ut = _t.length; Ct < Ut; Ct++) {
              const xt = _t[Ct], qt = gt[xt.materialIndex];
              qt && qt.visible && m.push(S, ct, qt, z, zt.z, xt);
            }
          } else gt.visible && m.push(S, ct, gt, z, zt.z, null);
        }
      }
      const et = S.children;
      for (let ct = 0, gt = et.length; ct < gt; ct++)
        nr(et[ct], D, z, k);
    }
    function Qo(S, D, z, k) {
      const U = S.opaque, et = S.transmissive, ct = S.transparent;
      p.setupLightsView(z), nt === !0 && tt.setGlobalState(y.clippingPlanes, z), k && Et.viewport(A.copy(k)), U.length > 0 && us(U, D, z), et.length > 0 && us(et, D, z), ct.length > 0 && us(ct, D, z), Et.buffers.depth.setTest(!0), Et.buffers.depth.setMask(!0), Et.buffers.color.setMask(!0), Et.setPolygonOffset(!1);
    }
    function ta(S, D, z, k) {
      if ((z.isScene === !0 ? z.overrideMaterial : null) !== null)
        return;
      p.state.transmissionRenderTarget[k.id] === void 0 && (p.state.transmissionRenderTarget[k.id] = new Kn(1, 1, {
        generateMipmaps: !0,
        type: Ht.has("EXT_color_buffer_half_float") || Ht.has("EXT_color_buffer_float") ? os : mn,
        minFilter: qn,
        samples: 4,
        stencilBuffer: r,
        resolveDepthBuffer: !1,
        resolveStencilBuffer: !1,
        colorSpace: Xt.workingColorSpace
      }));
      const et = p.state.transmissionRenderTarget[k.id], ct = k.viewport || A;
      et.setSize(ct.z, ct.w);
      const gt = y.getRenderTarget();
      y.setRenderTarget(et), y.getClearColor(G), $ = y.getClearAlpha(), $ < 1 && y.setClearColor(16777215, 0.5), y.clear(), Wt && wt.render(z);
      const _t = y.toneMapping;
      y.toneMapping = Rn;
      const Ct = k.viewport;
      if (k.viewport !== void 0 && (k.viewport = void 0), p.setupLightsView(k), nt === !0 && tt.setGlobalState(y.clippingPlanes, k), us(S, z, k), w.updateMultisampleRenderTarget(et), w.updateRenderTargetMipmap(et), Ht.has("WEBGL_multisampled_render_to_texture") === !1) {
        let Ut = !1;
        for (let xt = 0, qt = D.length; xt < qt; xt++) {
          const ee = D[xt], ie = ee.object, Re = ee.geometry, Yt = ee.material, St = ee.group;
          if (Yt.side === hn && ie.layers.test(k.layers)) {
            const en = Yt.side;
            Yt.side = Ce, Yt.needsUpdate = !0, ea(ie, z, k, Re, Yt, St), Yt.side = en, Yt.needsUpdate = !0, Ut = !0;
          }
        }
        Ut === !0 && (w.updateMultisampleRenderTarget(et), w.updateRenderTargetMipmap(et));
      }
      y.setRenderTarget(gt), y.setClearColor(G, $), Ct !== void 0 && (k.viewport = Ct), y.toneMapping = _t;
    }
    function us(S, D, z) {
      const k = D.isScene === !0 ? D.overrideMaterial : null;
      for (let U = 0, et = S.length; U < et; U++) {
        const ct = S[U], gt = ct.object, _t = ct.geometry, Ct = k === null ? ct.material : k, Ut = ct.group;
        gt.layers.test(z.layers) && ea(gt, D, z, _t, Ct, Ut);
      }
    }
    function ea(S, D, z, k, U, et) {
      S.onBeforeRender(y, D, z, k, U, et), S.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse, S.matrixWorld), S.normalMatrix.getNormalMatrix(S.modelViewMatrix), U.onBeforeRender(y, D, z, k, S, et), U.transparent === !0 && U.side === hn && U.forceSinglePass === !1 ? (U.side = Ce, U.needsUpdate = !0, y.renderBufferDirect(z, D, k, U, S, et), U.side = Pn, U.needsUpdate = !0, y.renderBufferDirect(z, D, k, U, S, et), U.side = hn) : y.renderBufferDirect(z, D, k, U, S, et), S.onAfterRender(y, D, z, k, U, et);
    }
    function ds(S, D, z) {
      D.isScene !== !0 && (D = oe);
      const k = bt.get(S), U = p.state.lights, et = p.state.shadowsArray, ct = U.state.version, gt = Mt.getParameters(S, U.state, et, D, z), _t = Mt.getProgramCacheKey(gt);
      let Ct = k.programs;
      k.environment = S.isMeshStandardMaterial ? D.environment : null, k.fog = D.fog, k.envMap = (S.isMeshStandardMaterial ? B : v).get(S.envMap || k.environment), k.envMapRotation = k.environment !== null && S.envMap === null ? D.environmentRotation : S.envMapRotation, Ct === void 0 && (S.addEventListener("dispose", Dt), Ct = /* @__PURE__ */ new Map(), k.programs = Ct);
      let Ut = Ct.get(_t);
      if (Ut !== void 0) {
        if (k.currentProgram === Ut && k.lightsStateVersion === ct)
          return ia(S, gt), Ut;
      } else
        gt.uniforms = Mt.getUniforms(S), S.onBeforeCompile(gt, y), Ut = Mt.acquireProgram(gt, _t), Ct.set(_t, Ut), k.uniforms = gt.uniforms;
      const xt = k.uniforms;
      return (!S.isShaderMaterial && !S.isRawShaderMaterial || S.clipping === !0) && (xt.clippingPlanes = tt.uniform), ia(S, gt), k.needsLights = Lc(S), k.lightsStateVersion = ct, k.needsLights && (xt.ambientLightColor.value = U.state.ambient, xt.lightProbe.value = U.state.probe, xt.directionalLights.value = U.state.directional, xt.directionalLightShadows.value = U.state.directionalShadow, xt.spotLights.value = U.state.spot, xt.spotLightShadows.value = U.state.spotShadow, xt.rectAreaLights.value = U.state.rectArea, xt.ltc_1.value = U.state.rectAreaLTC1, xt.ltc_2.value = U.state.rectAreaLTC2, xt.pointLights.value = U.state.point, xt.pointLightShadows.value = U.state.pointShadow, xt.hemisphereLights.value = U.state.hemi, xt.directionalShadowMap.value = U.state.directionalShadowMap, xt.directionalShadowMatrix.value = U.state.directionalShadowMatrix, xt.spotShadowMap.value = U.state.spotShadowMap, xt.spotLightMatrix.value = U.state.spotLightMatrix, xt.spotLightMap.value = U.state.spotLightMap, xt.pointShadowMap.value = U.state.pointShadowMap, xt.pointShadowMatrix.value = U.state.pointShadowMatrix), k.currentProgram = Ut, k.uniformsList = null, Ut;
    }
    function na(S) {
      if (S.uniformsList === null) {
        const D = S.currentProgram.getUniforms();
        S.uniformsList = Gs.seqWithValue(D.seq, S.uniforms);
      }
      return S.uniformsList;
    }
    function ia(S, D) {
      const z = bt.get(S);
      z.outputColorSpace = D.outputColorSpace, z.batching = D.batching, z.batchingColor = D.batchingColor, z.instancing = D.instancing, z.instancingColor = D.instancingColor, z.instancingMorph = D.instancingMorph, z.skinning = D.skinning, z.morphTargets = D.morphTargets, z.morphNormals = D.morphNormals, z.morphColors = D.morphColors, z.morphTargetsCount = D.morphTargetsCount, z.numClippingPlanes = D.numClippingPlanes, z.numIntersection = D.numClipIntersection, z.vertexAlphas = D.vertexAlphas, z.vertexTangents = D.vertexTangents, z.toneMapping = D.toneMapping;
    }
    function Cc(S, D, z, k, U) {
      D.isScene !== !0 && (D = oe), w.resetTextureUnits();
      const et = D.fog, ct = k.isMeshStandardMaterial ? D.environment : null, gt = C === null ? y.outputColorSpace : C.isXRRenderTarget === !0 ? C.texture.colorSpace : Pi, _t = (k.isMeshStandardMaterial ? B : v).get(k.envMap || ct), Ct = k.vertexColors === !0 && !!z.attributes.color && z.attributes.color.itemSize === 4, Ut = !!z.attributes.tangent && (!!k.normalMap || k.anisotropy > 0), xt = !!z.morphAttributes.position, qt = !!z.morphAttributes.normal, ee = !!z.morphAttributes.color;
      let ie = Rn;
      k.toneMapped && (C === null || C.isXRRenderTarget === !0) && (ie = y.toneMapping);
      const Re = z.morphAttributes.position || z.morphAttributes.normal || z.morphAttributes.color, Yt = Re !== void 0 ? Re.length : 0, St = bt.get(k), en = p.state.lights;
      if (nt === !0 && (vt === !0 || S !== _)) {
        const Fe = S === _ && k.id === M;
        tt.setState(k, S, Fe);
      }
      let Zt = !1;
      k.version === St.__version ? (St.needsLights && St.lightsStateVersion !== en.state.version || St.outputColorSpace !== gt || U.isBatchedMesh && St.batching === !1 || !U.isBatchedMesh && St.batching === !0 || U.isBatchedMesh && St.batchingColor === !0 && U.colorTexture === null || U.isBatchedMesh && St.batchingColor === !1 && U.colorTexture !== null || U.isInstancedMesh && St.instancing === !1 || !U.isInstancedMesh && St.instancing === !0 || U.isSkinnedMesh && St.skinning === !1 || !U.isSkinnedMesh && St.skinning === !0 || U.isInstancedMesh && St.instancingColor === !0 && U.instanceColor === null || U.isInstancedMesh && St.instancingColor === !1 && U.instanceColor !== null || U.isInstancedMesh && St.instancingMorph === !0 && U.morphTexture === null || U.isInstancedMesh && St.instancingMorph === !1 && U.morphTexture !== null || St.envMap !== _t || k.fog === !0 && St.fog !== et || St.numClippingPlanes !== void 0 && (St.numClippingPlanes !== tt.numPlanes || St.numIntersection !== tt.numIntersection) || St.vertexAlphas !== Ct || St.vertexTangents !== Ut || St.morphTargets !== xt || St.morphNormals !== qt || St.morphColors !== ee || St.toneMapping !== ie || St.morphTargetsCount !== Yt) && (Zt = !0) : (Zt = !0, St.__version = k.version);
      let He = St.currentProgram;
      Zt === !0 && (He = ds(k, D, U));
      let Jn = !1, Pe = !1, Ni = !1;
      const se = He.getUniforms(), Ze = St.uniforms;
      if (Et.useProgram(He.program) && (Jn = !0, Pe = !0, Ni = !0), k.id !== M && (M = k.id, Pe = !0), Jn || _ !== S) {
        Et.buffers.depth.getReversed() ? (ot.copy(S.projectionMatrix), iu(ot), su(ot), se.setValue(I, "projectionMatrix", ot)) : se.setValue(I, "projectionMatrix", S.projectionMatrix), se.setValue(I, "viewMatrix", S.matrixWorldInverse);
        const gn = se.map.cameraPosition;
        gn !== void 0 && gn.setValue(I, Lt.setFromMatrixPosition(S.matrixWorld)), Vt.logarithmicDepthBuffer && se.setValue(
          I,
          "logDepthBufFC",
          2 / (Math.log(S.far + 1) / Math.LN2)
        ), (k.isMeshPhongMaterial || k.isMeshToonMaterial || k.isMeshLambertMaterial || k.isMeshBasicMaterial || k.isMeshStandardMaterial || k.isShaderMaterial) && se.setValue(I, "isOrthographic", S.isOrthographicCamera === !0), _ !== S && (_ = S, Pe = !0, Ni = !0);
      }
      if (U.isSkinnedMesh) {
        se.setOptional(I, U, "bindMatrix"), se.setOptional(I, U, "bindMatrixInverse");
        const Fe = U.skeleton;
        Fe && (Fe.boneTexture === null && Fe.computeBoneTexture(), se.setValue(I, "boneTexture", Fe.boneTexture, w));
      }
      U.isBatchedMesh && (se.setOptional(I, U, "batchingTexture"), se.setValue(I, "batchingTexture", U._matricesTexture, w), se.setOptional(I, U, "batchingIdTexture"), se.setValue(I, "batchingIdTexture", U._indirectTexture, w), se.setOptional(I, U, "batchingColorTexture"), U._colorsTexture !== null && se.setValue(I, "batchingColorTexture", U._colorsTexture, w));
      const Fi = z.morphAttributes;
      if ((Fi.position !== void 0 || Fi.normal !== void 0 || Fi.color !== void 0) && At.update(U, z, He), (Pe || St.receiveShadow !== U.receiveShadow) && (St.receiveShadow = U.receiveShadow, se.setValue(I, "receiveShadow", U.receiveShadow)), k.isMeshGouraudMaterial && k.envMap !== null && (Ze.envMap.value = _t, Ze.flipEnvMap.value = _t.isCubeTexture && _t.isRenderTargetTexture === !1 ? -1 : 1), k.isMeshStandardMaterial && k.envMap === null && D.environment !== null && (Ze.envMapIntensity.value = D.environmentIntensity), Pe && (se.setValue(I, "toneMappingExposure", y.toneMappingExposure), St.needsLights && Pc(Ze, Ni), et && k.fog === !0 && at.refreshFogUniforms(Ze, et), at.refreshMaterialUniforms(Ze, k, H, K, p.state.transmissionRenderTarget[S.id]), Gs.upload(I, na(St), Ze, w)), k.isShaderMaterial && k.uniformsNeedUpdate === !0 && (Gs.upload(I, na(St), Ze, w), k.uniformsNeedUpdate = !1), k.isSpriteMaterial && se.setValue(I, "center", U.center), se.setValue(I, "modelViewMatrix", U.modelViewMatrix), se.setValue(I, "normalMatrix", U.normalMatrix), se.setValue(I, "modelMatrix", U.matrixWorld), k.isShaderMaterial || k.isRawShaderMaterial) {
        const Fe = k.uniformsGroups;
        for (let gn = 0, _n = Fe.length; gn < _n; gn++) {
          const sa = Fe[gn];
          P.update(sa, He), P.bind(sa, He);
        }
      }
      return He;
    }
    function Pc(S, D) {
      S.ambientLightColor.needsUpdate = D, S.lightProbe.needsUpdate = D, S.directionalLights.needsUpdate = D, S.directionalLightShadows.needsUpdate = D, S.pointLights.needsUpdate = D, S.pointLightShadows.needsUpdate = D, S.spotLights.needsUpdate = D, S.spotLightShadows.needsUpdate = D, S.rectAreaLights.needsUpdate = D, S.hemisphereLights.needsUpdate = D;
    }
    function Lc(S) {
      return S.isMeshLambertMaterial || S.isMeshToonMaterial || S.isMeshPhongMaterial || S.isMeshStandardMaterial || S.isShadowMaterial || S.isShaderMaterial && S.lights === !0;
    }
    this.getActiveCubeFace = function() {
      return R;
    }, this.getActiveMipmapLevel = function() {
      return T;
    }, this.getRenderTarget = function() {
      return C;
    }, this.setRenderTargetTextures = function(S, D, z) {
      bt.get(S.texture).__webglTexture = D, bt.get(S.depthTexture).__webglTexture = z;
      const k = bt.get(S);
      k.__hasExternalTextures = !0, k.__autoAllocateDepthBuffer = z === void 0, k.__autoAllocateDepthBuffer || Ht.has("WEBGL_multisampled_render_to_texture") === !0 && (console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"), k.__useRenderToTexture = !1);
    }, this.setRenderTargetFramebuffer = function(S, D) {
      const z = bt.get(S);
      z.__webglFramebuffer = D, z.__useDefaultFramebuffer = D === void 0;
    }, this.setRenderTarget = function(S, D = 0, z = 0) {
      C = S, R = D, T = z;
      let k = !0, U = null, et = !1, ct = !1;
      if (S) {
        const _t = bt.get(S);
        if (_t.__useDefaultFramebuffer !== void 0)
          Et.bindFramebuffer(I.FRAMEBUFFER, null), k = !1;
        else if (_t.__webglFramebuffer === void 0)
          w.setupRenderTarget(S);
        else if (_t.__hasExternalTextures)
          w.rebindTextures(S, bt.get(S.texture).__webglTexture, bt.get(S.depthTexture).__webglTexture);
        else if (S.depthBuffer) {
          const xt = S.depthTexture;
          if (_t.__boundDepthTexture !== xt) {
            if (xt !== null && bt.has(xt) && (S.width !== xt.image.width || S.height !== xt.image.height))
              throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");
            w.setupDepthRenderbuffer(S);
          }
        }
        const Ct = S.texture;
        (Ct.isData3DTexture || Ct.isDataArrayTexture || Ct.isCompressedArrayTexture) && (ct = !0);
        const Ut = bt.get(S).__webglFramebuffer;
        S.isWebGLCubeRenderTarget ? (Array.isArray(Ut[D]) ? U = Ut[D][z] : U = Ut[D], et = !0) : S.samples > 0 && w.useMultisampledRTT(S) === !1 ? U = bt.get(S).__webglMultisampledFramebuffer : Array.isArray(Ut) ? U = Ut[z] : U = Ut, A.copy(S.viewport), F.copy(S.scissor), O = S.scissorTest;
      } else
        A.copy(yt).multiplyScalar(H).floor(), F.copy(Bt).multiplyScalar(H).floor(), O = jt;
      if (Et.bindFramebuffer(I.FRAMEBUFFER, U) && k && Et.drawBuffers(S, U), Et.viewport(A), Et.scissor(F), Et.setScissorTest(O), et) {
        const _t = bt.get(S.texture);
        I.framebufferTexture2D(I.FRAMEBUFFER, I.COLOR_ATTACHMENT0, I.TEXTURE_CUBE_MAP_POSITIVE_X + D, _t.__webglTexture, z);
      } else if (ct) {
        const _t = bt.get(S.texture), Ct = D || 0;
        I.framebufferTextureLayer(I.FRAMEBUFFER, I.COLOR_ATTACHMENT0, _t.__webglTexture, z || 0, Ct);
      }
      M = -1;
    }, this.readRenderTargetPixels = function(S, D, z, k, U, et, ct) {
      if (!(S && S.isWebGLRenderTarget)) {
        console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
        return;
      }
      let gt = bt.get(S).__webglFramebuffer;
      if (S.isWebGLCubeRenderTarget && ct !== void 0 && (gt = gt[ct]), gt) {
        Et.bindFramebuffer(I.FRAMEBUFFER, gt);
        try {
          const _t = S.texture, Ct = _t.format, Ut = _t.type;
          if (!Vt.textureFormatReadable(Ct)) {
            console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");
            return;
          }
          if (!Vt.textureTypeReadable(Ut)) {
            console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");
            return;
          }
          D >= 0 && D <= S.width - k && z >= 0 && z <= S.height - U && I.readPixels(D, z, k, U, Nt.convert(Ct), Nt.convert(Ut), et);
        } finally {
          const _t = C !== null ? bt.get(C).__webglFramebuffer : null;
          Et.bindFramebuffer(I.FRAMEBUFFER, _t);
        }
      }
    }, this.readRenderTargetPixelsAsync = async function(S, D, z, k, U, et, ct) {
      if (!(S && S.isWebGLRenderTarget))
        throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
      let gt = bt.get(S).__webglFramebuffer;
      if (S.isWebGLCubeRenderTarget && ct !== void 0 && (gt = gt[ct]), gt) {
        const _t = S.texture, Ct = _t.format, Ut = _t.type;
        if (!Vt.textureFormatReadable(Ct))
          throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");
        if (!Vt.textureTypeReadable(Ut))
          throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");
        if (D >= 0 && D <= S.width - k && z >= 0 && z <= S.height - U) {
          Et.bindFramebuffer(I.FRAMEBUFFER, gt);
          const xt = I.createBuffer();
          I.bindBuffer(I.PIXEL_PACK_BUFFER, xt), I.bufferData(I.PIXEL_PACK_BUFFER, et.byteLength, I.STREAM_READ), I.readPixels(D, z, k, U, Nt.convert(Ct), Nt.convert(Ut), 0);
          const qt = C !== null ? bt.get(C).__webglFramebuffer : null;
          Et.bindFramebuffer(I.FRAMEBUFFER, qt);
          const ee = I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE, 0);
          return I.flush(), await nu(I, ee, 4), I.bindBuffer(I.PIXEL_PACK_BUFFER, xt), I.getBufferSubData(I.PIXEL_PACK_BUFFER, 0, et), I.deleteBuffer(xt), I.deleteSync(ee), et;
        } else
          throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.");
      }
    }, this.copyFramebufferToTexture = function(S, D = null, z = 0) {
      S.isTexture !== !0 && (Zi("WebGLRenderer: copyFramebufferToTexture function signature has changed."), D = arguments[0] || null, S = arguments[1]);
      const k = Math.pow(2, -z), U = Math.floor(S.image.width * k), et = Math.floor(S.image.height * k), ct = D !== null ? D.x : 0, gt = D !== null ? D.y : 0;
      w.setTexture2D(S, 0), I.copyTexSubImage2D(I.TEXTURE_2D, z, 0, 0, ct, gt, U, et), Et.unbindTexture();
    }, this.copyTextureToTexture = function(S, D, z = null, k = null, U = 0) {
      S.isTexture !== !0 && (Zi("WebGLRenderer: copyTextureToTexture function signature has changed."), k = arguments[0] || null, S = arguments[1], D = arguments[2], U = arguments[3] || 0, z = null);
      let et, ct, gt, _t, Ct, Ut, xt, qt, ee;
      const ie = S.isCompressedTexture ? S.mipmaps[U] : S.image;
      z !== null ? (et = z.max.x - z.min.x, ct = z.max.y - z.min.y, gt = z.isBox3 ? z.max.z - z.min.z : 1, _t = z.min.x, Ct = z.min.y, Ut = z.isBox3 ? z.min.z : 0) : (et = ie.width, ct = ie.height, gt = ie.depth || 1, _t = 0, Ct = 0, Ut = 0), k !== null ? (xt = k.x, qt = k.y, ee = k.z) : (xt = 0, qt = 0, ee = 0);
      const Re = Nt.convert(D.format), Yt = Nt.convert(D.type);
      let St;
      D.isData3DTexture ? (w.setTexture3D(D, 0), St = I.TEXTURE_3D) : D.isDataArrayTexture || D.isCompressedArrayTexture ? (w.setTexture2DArray(D, 0), St = I.TEXTURE_2D_ARRAY) : (w.setTexture2D(D, 0), St = I.TEXTURE_2D), I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL, D.flipY), I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL, D.premultiplyAlpha), I.pixelStorei(I.UNPACK_ALIGNMENT, D.unpackAlignment);
      const en = I.getParameter(I.UNPACK_ROW_LENGTH), Zt = I.getParameter(I.UNPACK_IMAGE_HEIGHT), He = I.getParameter(I.UNPACK_SKIP_PIXELS), Jn = I.getParameter(I.UNPACK_SKIP_ROWS), Pe = I.getParameter(I.UNPACK_SKIP_IMAGES);
      I.pixelStorei(I.UNPACK_ROW_LENGTH, ie.width), I.pixelStorei(I.UNPACK_IMAGE_HEIGHT, ie.height), I.pixelStorei(I.UNPACK_SKIP_PIXELS, _t), I.pixelStorei(I.UNPACK_SKIP_ROWS, Ct), I.pixelStorei(I.UNPACK_SKIP_IMAGES, Ut);
      const Ni = S.isDataArrayTexture || S.isData3DTexture, se = D.isDataArrayTexture || D.isData3DTexture;
      if (S.isRenderTargetTexture || S.isDepthTexture) {
        const Ze = bt.get(S), Fi = bt.get(D), Fe = bt.get(Ze.__renderTarget), gn = bt.get(Fi.__renderTarget);
        Et.bindFramebuffer(I.READ_FRAMEBUFFER, Fe.__webglFramebuffer), Et.bindFramebuffer(I.DRAW_FRAMEBUFFER, gn.__webglFramebuffer);
        for (let _n = 0; _n < gt; _n++)
          Ni && I.framebufferTextureLayer(I.READ_FRAMEBUFFER, I.COLOR_ATTACHMENT0, bt.get(S).__webglTexture, U, Ut + _n), S.isDepthTexture ? (se && I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER, I.COLOR_ATTACHMENT0, bt.get(D).__webglTexture, U, ee + _n), I.blitFramebuffer(_t, Ct, et, ct, xt, qt, et, ct, I.DEPTH_BUFFER_BIT, I.NEAREST)) : se ? I.copyTexSubImage3D(St, U, xt, qt, ee + _n, _t, Ct, et, ct) : I.copyTexSubImage2D(St, U, xt, qt, ee + _n, _t, Ct, et, ct);
        Et.bindFramebuffer(I.READ_FRAMEBUFFER, null), Et.bindFramebuffer(I.DRAW_FRAMEBUFFER, null);
      } else
        se ? S.isDataTexture || S.isData3DTexture ? I.texSubImage3D(St, U, xt, qt, ee, et, ct, gt, Re, Yt, ie.data) : D.isCompressedArrayTexture ? I.compressedTexSubImage3D(St, U, xt, qt, ee, et, ct, gt, Re, ie.data) : I.texSubImage3D(St, U, xt, qt, ee, et, ct, gt, Re, Yt, ie) : S.isDataTexture ? I.texSubImage2D(I.TEXTURE_2D, U, xt, qt, et, ct, Re, Yt, ie.data) : S.isCompressedTexture ? I.compressedTexSubImage2D(I.TEXTURE_2D, U, xt, qt, ie.width, ie.height, Re, ie.data) : I.texSubImage2D(I.TEXTURE_2D, U, xt, qt, et, ct, Re, Yt, ie);
      I.pixelStorei(I.UNPACK_ROW_LENGTH, en), I.pixelStorei(I.UNPACK_IMAGE_HEIGHT, Zt), I.pixelStorei(I.UNPACK_SKIP_PIXELS, He), I.pixelStorei(I.UNPACK_SKIP_ROWS, Jn), I.pixelStorei(I.UNPACK_SKIP_IMAGES, Pe), U === 0 && D.generateMipmaps && I.generateMipmap(St), Et.unbindTexture();
    }, this.copyTextureToTexture3D = function(S, D, z = null, k = null, U = 0) {
      return S.isTexture !== !0 && (Zi("WebGLRenderer: copyTextureToTexture3D function signature has changed."), z = arguments[0] || null, k = arguments[1] || null, S = arguments[2], D = arguments[3], U = arguments[4] || 0), Zi('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'), this.copyTextureToTexture(S, D, z, k, U);
    }, this.initRenderTarget = function(S) {
      bt.get(S).__webglFramebuffer === void 0 && w.setupRenderTarget(S);
    }, this.initTexture = function(S) {
      S.isCubeTexture ? w.setTextureCube(S, 0) : S.isData3DTexture ? w.setTexture3D(S, 0) : S.isDataArrayTexture || S.isCompressedArrayTexture ? w.setTexture2DArray(S, 0) : w.setTexture2D(S, 0), Et.unbindTexture();
    }, this.resetState = function() {
      R = 0, T = 0, C = null, Et.reset(), te.reset();
    }, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }
  get coordinateSystem() {
    return dn;
  }
  get outputColorSpace() {
    return this._outputColorSpace;
  }
  set outputColorSpace(t) {
    this._outputColorSpace = t;
    const e = this.getContext();
    e.drawingBufferColorspace = Xt._getDrawingBufferColorSpace(t), e.unpackColorSpace = Xt._getUnpackColorSpace();
  }
}
class Mc extends ge {
  constructor() {
    super(), this.isScene = !0, this.type = "Scene", this.background = null, this.environment = null, this.fog = null, this.backgroundBlurriness = 0, this.backgroundIntensity = 1, this.backgroundRotation = new Je(), this.environmentIntensity = 1, this.environmentRotation = new Je(), this.overrideMaterial = null, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }
  copy(t, e) {
    return super.copy(t, e), t.background !== null && (this.background = t.background.clone()), t.environment !== null && (this.environment = t.environment.clone()), t.fog !== null && (this.fog = t.fog.clone()), this.backgroundBlurriness = t.backgroundBlurriness, this.backgroundIntensity = t.backgroundIntensity, this.backgroundRotation.copy(t.backgroundRotation), this.environmentIntensity = t.environmentIntensity, this.environmentRotation.copy(t.environmentRotation), t.overrideMaterial !== null && (this.overrideMaterial = t.overrideMaterial.clone()), this.matrixAutoUpdate = t.matrixAutoUpdate, this;
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return this.fog !== null && (e.object.fog = this.fog.toJSON()), this.backgroundBlurriness > 0 && (e.object.backgroundBlurriness = this.backgroundBlurriness), this.backgroundIntensity !== 1 && (e.object.backgroundIntensity = this.backgroundIntensity), e.object.backgroundRotation = this.backgroundRotation.toArray(), this.environmentIntensity !== 1 && (e.object.environmentIntensity = this.environmentIntensity), e.object.environmentRotation = this.environmentRotation.toArray(), e;
  }
}
class Sc extends Ui {
  static get type() {
    return "PointsMaterial";
  }
  constructor(t) {
    super(), this.isPointsMaterial = !0, this.color = new Pt(16777215), this.map = null, this.alphaMap = null, this.size = 1, this.sizeAttenuation = !0, this.fog = !0, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.color.copy(t.color), this.map = t.map, this.alphaMap = t.alphaMap, this.size = t.size, this.sizeAttenuation = t.sizeAttenuation, this.fog = t.fog, this;
  }
}
const pl = /* @__PURE__ */ new re(), To = /* @__PURE__ */ new Vo(), Is = /* @__PURE__ */ new tr(), Ns = /* @__PURE__ */ new L();
class mg extends ge {
  constructor(t = new ze(), e = new Sc()) {
    super(), this.isPoints = !0, this.type = "Points", this.geometry = t, this.material = e, this.updateMorphTargets();
  }
  copy(t, e) {
    return super.copy(t, e), this.material = Array.isArray(t.material) ? t.material.slice() : t.material, this.geometry = t.geometry, this;
  }
  raycast(t, e) {
    const n = this.geometry, s = this.matrixWorld, r = t.params.Points.threshold, o = n.drawRange;
    if (n.boundingSphere === null && n.computeBoundingSphere(), Is.copy(n.boundingSphere), Is.applyMatrix4(s), Is.radius += r, t.ray.intersectsSphere(Is) === !1) return;
    pl.copy(s).invert(), To.copy(t.ray).applyMatrix4(pl);
    const a = r / ((this.scale.x + this.scale.y + this.scale.z) / 3), l = a * a, h = n.index, c = n.attributes.position;
    if (h !== null) {
      const f = Math.max(0, o.start), d = Math.min(h.count, o.start + o.count);
      for (let g = f, x = d; g < x; g++) {
        const m = h.getX(g);
        Ns.fromBufferAttribute(c, m), ml(Ns, m, l, s, t, e, this);
      }
    } else {
      const f = Math.max(0, o.start), d = Math.min(c.count, o.start + o.count);
      for (let g = f, x = d; g < x; g++)
        Ns.fromBufferAttribute(c, g), ml(Ns, g, l, s, t, e, this);
    }
  }
  updateMorphTargets() {
    const e = this.geometry.morphAttributes, n = Object.keys(e);
    if (n.length > 0) {
      const s = e[n[0]];
      if (s !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let r = 0, o = s.length; r < o; r++) {
          const a = s[r].name || String(r);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[a] = r;
        }
      }
    }
  }
}
function ml(i, t, e, n, s, r, o) {
  const a = To.distanceSqToPoint(i);
  if (a < e) {
    const l = new L();
    To.closestPointToPoint(i, l), l.applyMatrix4(n);
    const h = s.ray.origin.distanceTo(l);
    if (h < s.near || h > s.far) return;
    r.push({
      distance: h,
      distanceToRay: Math.sqrt(a),
      point: l,
      index: t,
      face: null,
      faceIndex: null,
      barycoord: null,
      object: o
    });
  }
}
class gg extends Ae {
  constructor(t, e, n, s, r, o, a, l, h) {
    super(t, e, n, s, r, o, a, l, h), this.isCanvasTexture = !0, this.needsUpdate = !0;
  }
}
class Xo extends ze {
  constructor(t = 1, e = 1, n = 1, s = 32, r = 1, o = !1, a = 0, l = Math.PI * 2) {
    super(), this.type = "CylinderGeometry", this.parameters = {
      radiusTop: t,
      radiusBottom: e,
      height: n,
      radialSegments: s,
      heightSegments: r,
      openEnded: o,
      thetaStart: a,
      thetaLength: l
    };
    const h = this;
    s = Math.floor(s), r = Math.floor(r);
    const u = [], c = [], f = [], d = [];
    let g = 0;
    const x = [], m = n / 2;
    let p = 0;
    E(), o === !1 && (t > 0 && b(!0), e > 0 && b(!1)), this.setIndex(u), this.setAttribute("position", new be(c, 3)), this.setAttribute("normal", new be(f, 3)), this.setAttribute("uv", new be(d, 2));
    function E() {
      const y = new L(), N = new L();
      let R = 0;
      const T = (e - t) / n;
      for (let C = 0; C <= r; C++) {
        const M = [], _ = C / r, A = _ * (e - t) + t;
        for (let F = 0; F <= s; F++) {
          const O = F / s, G = O * l + a, $ = Math.sin(G), V = Math.cos(G);
          N.x = A * $, N.y = -_ * n + m, N.z = A * V, c.push(N.x, N.y, N.z), y.set($, T, V).normalize(), f.push(y.x, y.y, y.z), d.push(O, 1 - _), M.push(g++);
        }
        x.push(M);
      }
      for (let C = 0; C < s; C++)
        for (let M = 0; M < r; M++) {
          const _ = x[M][C], A = x[M + 1][C], F = x[M + 1][C + 1], O = x[M][C + 1];
          (t > 0 || M !== 0) && (u.push(_, A, O), R += 3), (e > 0 || M !== r - 1) && (u.push(A, F, O), R += 3);
        }
      h.addGroup(p, R, 0), p += R;
    }
    function b(y) {
      const N = g, R = new kt(), T = new L();
      let C = 0;
      const M = y === !0 ? t : e, _ = y === !0 ? 1 : -1;
      for (let F = 1; F <= s; F++)
        c.push(0, m * _, 0), f.push(0, _, 0), d.push(0.5, 0.5), g++;
      const A = g;
      for (let F = 0; F <= s; F++) {
        const G = F / s * l + a, $ = Math.cos(G), V = Math.sin(G);
        T.x = M * V, T.y = m * _, T.z = M * $, c.push(T.x, T.y, T.z), f.push(0, _, 0), R.x = $ * 0.5 + 0.5, R.y = V * 0.5 * _ + 0.5, d.push(R.x, R.y), g++;
      }
      for (let F = 0; F < s; F++) {
        const O = N + F, G = A + F;
        y === !0 ? u.push(G, G + 1, O) : u.push(G + 1, G, O), C += 3;
      }
      h.addGroup(p, C, y === !0 ? 1 : 2), p += C;
    }
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new Xo(t.radiusTop, t.radiusBottom, t.height, t.radialSegments, t.heightSegments, t.openEnded, t.thetaStart, t.thetaLength);
  }
}
class qo extends ze {
  constructor(t = [], e = [], n = 1, s = 0) {
    super(), this.type = "PolyhedronGeometry", this.parameters = {
      vertices: t,
      indices: e,
      radius: n,
      detail: s
    };
    const r = [], o = [];
    a(s), h(n), u(), this.setAttribute("position", new be(r, 3)), this.setAttribute("normal", new be(r.slice(), 3)), this.setAttribute("uv", new be(o, 2)), s === 0 ? this.computeVertexNormals() : this.normalizeNormals();
    function a(E) {
      const b = new L(), y = new L(), N = new L();
      for (let R = 0; R < e.length; R += 3)
        d(e[R + 0], b), d(e[R + 1], y), d(e[R + 2], N), l(b, y, N, E);
    }
    function l(E, b, y, N) {
      const R = N + 1, T = [];
      for (let C = 0; C <= R; C++) {
        T[C] = [];
        const M = E.clone().lerp(y, C / R), _ = b.clone().lerp(y, C / R), A = R - C;
        for (let F = 0; F <= A; F++)
          F === 0 && C === R ? T[C][F] = M : T[C][F] = M.clone().lerp(_, F / A);
      }
      for (let C = 0; C < R; C++)
        for (let M = 0; M < 2 * (R - C) - 1; M++) {
          const _ = Math.floor(M / 2);
          M % 2 === 0 ? (f(T[C][_ + 1]), f(T[C + 1][_]), f(T[C][_])) : (f(T[C][_ + 1]), f(T[C + 1][_ + 1]), f(T[C + 1][_]));
        }
    }
    function h(E) {
      const b = new L();
      for (let y = 0; y < r.length; y += 3)
        b.x = r[y + 0], b.y = r[y + 1], b.z = r[y + 2], b.normalize().multiplyScalar(E), r[y + 0] = b.x, r[y + 1] = b.y, r[y + 2] = b.z;
    }
    function u() {
      const E = new L();
      for (let b = 0; b < r.length; b += 3) {
        E.x = r[b + 0], E.y = r[b + 1], E.z = r[b + 2];
        const y = m(E) / 2 / Math.PI + 0.5, N = p(E) / Math.PI + 0.5;
        o.push(y, 1 - N);
      }
      g(), c();
    }
    function c() {
      for (let E = 0; E < o.length; E += 6) {
        const b = o[E + 0], y = o[E + 2], N = o[E + 4], R = Math.max(b, y, N), T = Math.min(b, y, N);
        R > 0.9 && T < 0.1 && (b < 0.2 && (o[E + 0] += 1), y < 0.2 && (o[E + 2] += 1), N < 0.2 && (o[E + 4] += 1));
      }
    }
    function f(E) {
      r.push(E.x, E.y, E.z);
    }
    function d(E, b) {
      const y = E * 3;
      b.x = t[y + 0], b.y = t[y + 1], b.z = t[y + 2];
    }
    function g() {
      const E = new L(), b = new L(), y = new L(), N = new L(), R = new kt(), T = new kt(), C = new kt();
      for (let M = 0, _ = 0; M < r.length; M += 9, _ += 6) {
        E.set(r[M + 0], r[M + 1], r[M + 2]), b.set(r[M + 3], r[M + 4], r[M + 5]), y.set(r[M + 6], r[M + 7], r[M + 8]), R.set(o[_ + 0], o[_ + 1]), T.set(o[_ + 2], o[_ + 3]), C.set(o[_ + 4], o[_ + 5]), N.copy(E).add(b).add(y).divideScalar(3);
        const A = m(N);
        x(R, _ + 0, E, A), x(T, _ + 2, b, A), x(C, _ + 4, y, A);
      }
    }
    function x(E, b, y, N) {
      N < 0 && E.x === 1 && (o[b] = E.x - 1), y.x === 0 && y.z === 0 && (o[b] = N / 2 / Math.PI + 0.5);
    }
    function m(E) {
      return Math.atan2(E.z, -E.x);
    }
    function p(E) {
      return Math.atan2(-E.y, Math.sqrt(E.x * E.x + E.z * E.z));
    }
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new qo(t.vertices, t.indices, t.radius, t.details);
  }
}
class Yo extends qo {
  constructor(t = 1, e = 0) {
    const n = (1 + Math.sqrt(5)) / 2, s = [
      -1,
      n,
      0,
      1,
      n,
      0,
      -1,
      -n,
      0,
      1,
      -n,
      0,
      0,
      -1,
      n,
      0,
      1,
      n,
      0,
      -1,
      -n,
      0,
      1,
      -n,
      n,
      0,
      -1,
      n,
      0,
      1,
      -n,
      0,
      -1,
      -n,
      0,
      1
    ], r = [
      0,
      11,
      5,
      0,
      5,
      1,
      0,
      1,
      7,
      0,
      7,
      10,
      0,
      10,
      11,
      1,
      5,
      9,
      5,
      11,
      4,
      11,
      10,
      2,
      10,
      7,
      6,
      7,
      1,
      8,
      3,
      9,
      4,
      3,
      4,
      2,
      3,
      2,
      6,
      3,
      6,
      8,
      3,
      8,
      9,
      4,
      9,
      5,
      2,
      4,
      11,
      6,
      2,
      10,
      8,
      6,
      7,
      9,
      8,
      1
    ];
    super(s, r, t, e), this.type = "IcosahedronGeometry", this.parameters = {
      radius: t,
      detail: e
    };
  }
  static fromJSON(t) {
    return new Yo(t.radius, t.detail);
  }
}
class Zo extends ze {
  constructor(t = 1, e = 32, n = 16, s = 0, r = Math.PI * 2, o = 0, a = Math.PI) {
    super(), this.type = "SphereGeometry", this.parameters = {
      radius: t,
      widthSegments: e,
      heightSegments: n,
      phiStart: s,
      phiLength: r,
      thetaStart: o,
      thetaLength: a
    }, e = Math.max(3, Math.floor(e)), n = Math.max(2, Math.floor(n));
    const l = Math.min(o + a, Math.PI);
    let h = 0;
    const u = [], c = new L(), f = new L(), d = [], g = [], x = [], m = [];
    for (let p = 0; p <= n; p++) {
      const E = [], b = p / n;
      let y = 0;
      p === 0 && o === 0 ? y = 0.5 / e : p === n && l === Math.PI && (y = -0.5 / e);
      for (let N = 0; N <= e; N++) {
        const R = N / e;
        c.x = -t * Math.cos(s + R * r) * Math.sin(o + b * a), c.y = t * Math.cos(o + b * a), c.z = t * Math.sin(s + R * r) * Math.sin(o + b * a), g.push(c.x, c.y, c.z), f.copy(c).normalize(), x.push(f.x, f.y, f.z), m.push(R + y, 1 - b), E.push(h++);
      }
      u.push(E);
    }
    for (let p = 0; p < n; p++)
      for (let E = 0; E < e; E++) {
        const b = u[p][E + 1], y = u[p][E], N = u[p + 1][E], R = u[p + 1][E + 1];
        (p !== 0 || o > 0) && d.push(b, y, R), (p !== n - 1 || l < Math.PI) && d.push(y, N, R);
      }
    this.setIndex(d), this.setAttribute("position", new be(g, 3)), this.setAttribute("normal", new be(x, 3)), this.setAttribute("uv", new be(m, 2));
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new Zo(t.radius, t.widthSegments, t.heightSegments, t.phiStart, t.phiLength, t.thetaStart, t.thetaLength);
  }
}
class Cn extends Ui {
  static get type() {
    return "MeshStandardMaterial";
  }
  constructor(t) {
    super(), this.isMeshStandardMaterial = !0, this.defines = { STANDARD: "" }, this.color = new Pt(16777215), this.roughness = 1, this.metalness = 0, this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new Pt(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = nc, this.normalScale = new kt(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.roughnessMap = null, this.metalnessMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new Je(), this.envMapIntensity = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.flatShading = !1, this.fog = !0, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.defines = { STANDARD: "" }, this.color.copy(t.color), this.roughness = t.roughness, this.metalness = t.metalness, this.map = t.map, this.lightMap = t.lightMap, this.lightMapIntensity = t.lightMapIntensity, this.aoMap = t.aoMap, this.aoMapIntensity = t.aoMapIntensity, this.emissive.copy(t.emissive), this.emissiveMap = t.emissiveMap, this.emissiveIntensity = t.emissiveIntensity, this.bumpMap = t.bumpMap, this.bumpScale = t.bumpScale, this.normalMap = t.normalMap, this.normalMapType = t.normalMapType, this.normalScale.copy(t.normalScale), this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this.roughnessMap = t.roughnessMap, this.metalnessMap = t.metalnessMap, this.alphaMap = t.alphaMap, this.envMap = t.envMap, this.envMapRotation.copy(t.envMapRotation), this.envMapIntensity = t.envMapIntensity, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.wireframeLinecap = t.wireframeLinecap, this.wireframeLinejoin = t.wireframeLinejoin, this.flatShading = t.flatShading, this.fog = t.fog, this;
  }
}
class jo extends ge {
  constructor(t, e = 1) {
    super(), this.isLight = !0, this.type = "Light", this.color = new Pt(t), this.intensity = e;
  }
  dispose() {
  }
  copy(t, e) {
    return super.copy(t, e), this.color.copy(t.color), this.intensity = t.intensity, this;
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return e.object.color = this.color.getHex(), e.object.intensity = this.intensity, this.groundColor !== void 0 && (e.object.groundColor = this.groundColor.getHex()), this.distance !== void 0 && (e.object.distance = this.distance), this.angle !== void 0 && (e.object.angle = this.angle), this.decay !== void 0 && (e.object.decay = this.decay), this.penumbra !== void 0 && (e.object.penumbra = this.penumbra), this.shadow !== void 0 && (e.object.shadow = this.shadow.toJSON()), this.target !== void 0 && (e.object.target = this.target.uuid), e;
  }
}
class _g extends jo {
  constructor(t, e, n) {
    super(t, n), this.isHemisphereLight = !0, this.type = "HemisphereLight", this.position.copy(ge.DEFAULT_UP), this.updateMatrix(), this.groundColor = new Pt(e);
  }
  copy(t, e) {
    return super.copy(t, e), this.groundColor.copy(t.groundColor), this;
  }
}
const Dr = /* @__PURE__ */ new re(), gl = /* @__PURE__ */ new L(), _l = /* @__PURE__ */ new L();
class yc {
  constructor(t) {
    this.camera = t, this.intensity = 1, this.bias = 0, this.normalBias = 0, this.radius = 1, this.blurSamples = 8, this.mapSize = new kt(512, 512), this.map = null, this.mapPass = null, this.matrix = new re(), this.autoUpdate = !0, this.needsUpdate = !1, this._frustum = new Wo(), this._frameExtents = new kt(1, 1), this._viewportCount = 1, this._viewports = [
      new Qt(0, 0, 1, 1)
    ];
  }
  getViewportCount() {
    return this._viewportCount;
  }
  getFrustum() {
    return this._frustum;
  }
  updateMatrices(t) {
    const e = this.camera, n = this.matrix;
    gl.setFromMatrixPosition(t.matrixWorld), e.position.copy(gl), _l.setFromMatrixPosition(t.target.matrixWorld), e.lookAt(_l), e.updateMatrixWorld(), Dr.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse), this._frustum.setFromProjectionMatrix(Dr), n.set(
      0.5,
      0,
      0,
      0.5,
      0,
      0.5,
      0,
      0.5,
      0,
      0,
      0.5,
      0.5,
      0,
      0,
      0,
      1
    ), n.multiply(Dr);
  }
  getViewport(t) {
    return this._viewports[t];
  }
  getFrameExtents() {
    return this._frameExtents;
  }
  dispose() {
    this.map && this.map.dispose(), this.mapPass && this.mapPass.dispose();
  }
  copy(t) {
    return this.camera = t.camera.clone(), this.intensity = t.intensity, this.bias = t.bias, this.radius = t.radius, this.mapSize.copy(t.mapSize), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  toJSON() {
    const t = {};
    return this.intensity !== 1 && (t.intensity = this.intensity), this.bias !== 0 && (t.bias = this.bias), this.normalBias !== 0 && (t.normalBias = this.normalBias), this.radius !== 1 && (t.radius = this.radius), (this.mapSize.x !== 512 || this.mapSize.y !== 512) && (t.mapSize = this.mapSize.toArray()), t.camera = this.camera.toJSON(!1).object, delete t.camera.matrix, t;
  }
}
const xl = /* @__PURE__ */ new re(), Vi = /* @__PURE__ */ new L(), Ur = /* @__PURE__ */ new L();
class xg extends yc {
  constructor() {
    super(new Ie(90, 1, 0.5, 500)), this.isPointLightShadow = !0, this._frameExtents = new kt(4, 2), this._viewportCount = 6, this._viewports = [
      // These viewports map a cube-map onto a 2D texture with the
      // following orientation:
      //
      //  xzXZ
      //   y Y
      //
      // X - Positive x direction
      // x - Negative x direction
      // Y - Positive y direction
      // y - Negative y direction
      // Z - Positive z direction
      // z - Negative z direction
      // positive X
      new Qt(2, 1, 1, 1),
      // negative X
      new Qt(0, 1, 1, 1),
      // positive Z
      new Qt(3, 1, 1, 1),
      // negative Z
      new Qt(1, 1, 1, 1),
      // positive Y
      new Qt(3, 0, 1, 1),
      // negative Y
      new Qt(1, 0, 1, 1)
    ], this._cubeDirections = [
      new L(1, 0, 0),
      new L(-1, 0, 0),
      new L(0, 0, 1),
      new L(0, 0, -1),
      new L(0, 1, 0),
      new L(0, -1, 0)
    ], this._cubeUps = [
      new L(0, 1, 0),
      new L(0, 1, 0),
      new L(0, 1, 0),
      new L(0, 1, 0),
      new L(0, 0, 1),
      new L(0, 0, -1)
    ];
  }
  updateMatrices(t, e = 0) {
    const n = this.camera, s = this.matrix, r = t.distance || n.far;
    r !== n.far && (n.far = r, n.updateProjectionMatrix()), Vi.setFromMatrixPosition(t.matrixWorld), n.position.copy(Vi), Ur.copy(n.position), Ur.add(this._cubeDirections[e]), n.up.copy(this._cubeUps[e]), n.lookAt(Ur), n.updateMatrixWorld(), s.makeTranslation(-Vi.x, -Vi.y, -Vi.z), xl.multiplyMatrices(n.projectionMatrix, n.matrixWorldInverse), this._frustum.setFromProjectionMatrix(xl);
  }
}
class vg extends jo {
  constructor(t, e, n = 0, s = 2) {
    super(t, e), this.isPointLight = !0, this.type = "PointLight", this.distance = n, this.decay = s, this.shadow = new xg();
  }
  get power() {
    return this.intensity * 4 * Math.PI;
  }
  set power(t) {
    this.intensity = t / (4 * Math.PI);
  }
  dispose() {
    this.shadow.dispose();
  }
  copy(t, e) {
    return super.copy(t, e), this.distance = t.distance, this.decay = t.decay, this.shadow = t.shadow.clone(), this;
  }
}
class Mg extends yc {
  constructor() {
    super(new pc(-5, 5, 5, -5, 0.5, 500)), this.isDirectionalLightShadow = !0;
  }
}
class Sg extends jo {
  constructor(t, e) {
    super(t, e), this.isDirectionalLight = !0, this.type = "DirectionalLight", this.position.copy(ge.DEFAULT_UP), this.updateMatrix(), this.target = new ge(), this.shadow = new Mg();
  }
  dispose() {
    this.shadow.dispose();
  }
  copy(t) {
    return super.copy(t), this.target = t.target.clone(), this.shadow = t.shadow.clone(), this;
  }
}
const vl = /* @__PURE__ */ new re();
class yg {
  constructor(t, e, n = 0, s = 1 / 0) {
    this.ray = new Vo(t, e), this.near = n, this.far = s, this.camera = null, this.layers = new Go(), this.params = {
      Mesh: {},
      Line: { threshold: 1 },
      LOD: {},
      Points: { threshold: 1 },
      Sprite: {}
    };
  }
  set(t, e) {
    this.ray.set(t, e);
  }
  setFromCamera(t, e) {
    e.isPerspectiveCamera ? (this.ray.origin.setFromMatrixPosition(e.matrixWorld), this.ray.direction.set(t.x, t.y, 0.5).unproject(e).sub(this.ray.origin).normalize(), this.camera = e) : e.isOrthographicCamera ? (this.ray.origin.set(t.x, t.y, (e.near + e.far) / (e.near - e.far)).unproject(e), this.ray.direction.set(0, 0, -1).transformDirection(e.matrixWorld), this.camera = e) : console.error("THREE.Raycaster: Unsupported camera type: " + e.type);
  }
  setFromXRController(t) {
    return vl.identity().extractRotation(t.matrixWorld), this.ray.origin.setFromMatrixPosition(t.matrixWorld), this.ray.direction.set(0, 0, -1).applyMatrix4(vl), this;
  }
  intersectObject(t, e = !0, n = []) {
    return Ao(t, this, n, e), n.sort(Ml), n;
  }
  intersectObjects(t, e = !0, n = []) {
    for (let s = 0, r = t.length; s < r; s++)
      Ao(t[s], this, n, e);
    return n.sort(Ml), n;
  }
}
function Ml(i, t) {
  return i.distance - t.distance;
}
function Ao(i, t, e, n) {
  let s = !0;
  if (i.layers.test(t.layers) && i.raycast(t, e) === !1 && (s = !1), s === !0 && n === !0) {
    const r = i.children;
    for (let o = 0, a = r.length; o < a; o++)
      Ao(r[o], t, e, !0);
  }
}
class bg {
  constructor(t = 1, e = 0, n = 0) {
    return this.radius = t, this.phi = e, this.theta = n, this;
  }
  set(t, e, n) {
    return this.radius = t, this.phi = e, this.theta = n, this;
  }
  copy(t) {
    return this.radius = t.radius, this.phi = t.phi, this.theta = t.theta, this;
  }
  // restrict phi to be between EPS and PI-EPS
  makeSafe() {
    return this.phi = Math.max(1e-6, Math.min(Math.PI - 1e-6, this.phi)), this;
  }
  setFromVector3(t) {
    return this.setFromCartesianCoords(t.x, t.y, t.z);
  }
  setFromCartesianCoords(t, e, n) {
    return this.radius = Math.sqrt(t * t + e * e + n * n), this.radius === 0 ? (this.theta = 0, this.phi = 0) : (this.theta = Math.atan2(t, n), this.phi = Math.acos(Se(e / this.radius, -1, 1))), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register", { detail: {
  revision: Io
} }));
typeof window < "u" && (window.__THREE__ ? console.warn("WARNING: Multiple instances of Three.js being imported.") : window.__THREE__ = Io);
const Gi = new L();
function Be(i, t, e, n, s, r) {
  const o = 2 * Math.PI * s / 4, a = Math.max(r - 2 * s, 0), l = Math.PI / 4;
  Gi.copy(t), Gi[n] = 0, Gi.normalize();
  const h = 0.5 * o / (o + a), u = 1 - Gi.angleTo(i) / l;
  return Math.sign(Gi[e]) === 1 ? u * h : a / (o + a) + h + h * (1 - u);
}
class Eg extends Qe {
  constructor(t = 1, e = 1, n = 1, s = 2, r = 0.1) {
    if (s = s * 2 + 1, r = Math.min(t / 2, e / 2, n / 2, r), super(1, 1, 1, s, s, s), s === 1) return;
    const o = this.toNonIndexed();
    this.index = null, this.attributes.position = o.attributes.position, this.attributes.normal = o.attributes.normal, this.attributes.uv = o.attributes.uv;
    const a = new L(), l = new L(), h = new L(t, e, n).divideScalar(2).subScalar(r), u = this.attributes.position.array, c = this.attributes.normal.array, f = this.attributes.uv.array, d = u.length / 6, g = new L(), x = 0.5 / s;
    for (let m = 0, p = 0; m < u.length; m += 3, p += 2)
      switch (a.fromArray(u, m), l.copy(a), l.x -= Math.sign(l.x) * x, l.y -= Math.sign(l.y) * x, l.z -= Math.sign(l.z) * x, l.normalize(), u[m + 0] = h.x * Math.sign(a.x) + l.x * r, u[m + 1] = h.y * Math.sign(a.y) + l.y * r, u[m + 2] = h.z * Math.sign(a.z) + l.z * r, c[m + 0] = l.x, c[m + 1] = l.y, c[m + 2] = l.z, Math.floor(m / d)) {
        case 0:
          g.set(1, 0, 0), f[p + 0] = Be(g, l, "z", "y", r, n), f[p + 1] = 1 - Be(g, l, "y", "z", r, e);
          break;
        case 1:
          g.set(-1, 0, 0), f[p + 0] = 1 - Be(g, l, "z", "y", r, n), f[p + 1] = 1 - Be(g, l, "y", "z", r, e);
          break;
        case 2:
          g.set(0, 1, 0), f[p + 0] = 1 - Be(g, l, "x", "z", r, t), f[p + 1] = Be(g, l, "z", "x", r, n);
          break;
        case 3:
          g.set(0, -1, 0), f[p + 0] = 1 - Be(g, l, "x", "z", r, t), f[p + 1] = 1 - Be(g, l, "z", "x", r, n);
          break;
        case 4:
          g.set(0, 0, 1), f[p + 0] = 1 - Be(g, l, "x", "y", r, t), f[p + 1] = 1 - Be(g, l, "y", "x", r, e);
          break;
        case 5:
          g.set(0, 0, -1), f[p + 0] = Be(g, l, "x", "y", r, t), f[p + 1] = 1 - Be(g, l, "y", "x", r, e);
          break;
      }
  }
}
const Sl = /* @__PURE__ */ new Map();
function J(i, { rough: t = 0.85, metal: e = 0, emissive: n = null, emissiveIntensity: s = 1, opacity: r = 1 } = {}) {
  const o = [i, t, e, n, s, r].join("|");
  let a = Sl.get(o);
  return a || (a = new Cn({ color: i, roughness: t, metalness: e }), n && (a.emissive = new Pt(n), a.emissiveIntensity = s), r < 1 && (a.transparent = !0, a.opacity = r), Sl.set(o, a)), a;
}
function dt(i, t, e, n, { r: s = 0.02 } = {}) {
  const r = Math.max(0, Math.min(s, Math.min(i, t, e) / 2 - 1e-3)), o = r > 2e-3 ? new Eg(i, t, e, 2, r) : new Qe(i, t, e);
  return o.translate(0, t / 2, 0), new ye(o, n);
}
function le(i, t, e, n, s = 28) {
  const r = new Xo(i, t, e, s);
  return r.translate(0, e / 2, 0), new ye(r, n);
}
function Q(i, t = 0, e = 0, n = 0) {
  return i.position.set(t, e, n), i;
}
function Zs(i) {
  let t = i >>> 0 || 1;
  return () => {
    t = t + 1831565813 | 0;
    let e = Math.imul(t ^ t >>> 15, 1 | t);
    return e = e + Math.imul(e ^ e >>> 7, 61 | e) ^ e, ((e ^ e >>> 14) >>> 0) / 4294967296;
  };
}
const yl = 2.4;
function bc(i, t) {
  if (typeof document > "u") return null;
  const e = document.createElement("canvas");
  e.width = e.height = i, t(e.getContext("2d"), i);
  const n = new gg(e);
  return n.wrapS = n.wrapT = Xs, n.colorSpace = Ue, n.anisotropy = 8, n;
}
function Ec(i, t) {
  const e = new Pt(i), n = { h: 0, s: 0, l: 0 };
  return e.getHSL(n), e.setHSL(n.h, n.s, Math.min(1, Math.max(0, n.l + t))), `#${e.getHexString()}`;
}
function bl(i) {
  return bc(1024, (t, e) => {
    const n = Zs(i.length * 97 + i.charCodeAt(3)), s = 16, r = e / s;
    for (let o = 0; o < s; o++) {
      let a = -n() * e * 0.5;
      for (; a < e; ) {
        const l = e * (0.35 + n() * 0.35);
        t.fillStyle = Ec(i, (n() - 0.5) * 0.09), t.fillRect(a, o * r, l, r), t.fillStyle = "rgba(0,0,0,0.28)", t.fillRect(a, o * r, 1.5, r), t.strokeStyle = "rgba(0,0,0,0.05)";
        for (let h = 0; h < 3; h++) {
          const u = o * r + n() * r;
          t.beginPath(), t.moveTo(a, u), t.lineTo(a + l, u + (n() - 0.5) * 3), t.stroke();
        }
        a += l;
      }
      t.fillStyle = "rgba(0,0,0,0.3)", t.fillRect(0, o * r, e, 1.5);
    }
  });
}
function El(i, t, e) {
  return bc(512, (n, s) => {
    const r = Zs(t * 31 + i.charCodeAt(2)), o = s / t;
    n.fillStyle = e, n.fillRect(0, 0, s, s);
    for (let a = 0; a < t; a++)
      for (let l = 0; l < t; l++)
        n.fillStyle = Ec(i, (r() - 0.5) * 0.05), n.fillRect(a * o + 2, l * o + 2, o - 4, o - 4);
  });
}
const wl = {
  oak: { tex: () => bl("#c7a47c"), color: "#c7a47c", rough: 0.75 },
  walnut: { tex: () => bl("#94705a"), color: "#94705a", rough: 0.75 },
  tile: { tex: () => El("#d5dade", 4, "#aab0b8"), color: "#d5dade", rough: 0.55 },
  stone: { tex: () => El("#a2a7ae", 3, "#7c828b"), color: "#a2a7ae", rough: 0.55 }
}, Ir = /* @__PURE__ */ new Map();
function wg(i) {
  const t = wl[i] ? i : "oak";
  if (!Ir.has(t)) {
    const e = wl[t], n = e.tex();
    Ir.set(
      t,
      new Cn(
        n ? { map: n, roughness: e.rough } : { color: e.color, roughness: e.rough }
      )
    );
  }
  return Ir.get(t);
}
function Tg(i, t) {
  const e = new hs(i.w, i.d);
  e.rotateX(-Math.PI / 2), e.translate(i.x + i.w / 2, 0, i.z + i.d / 2);
  const n = e.attributes.position, s = e.attributes.uv;
  for (let o = 0; o < n.count; o++) s.setXY(o, n.getX(o) / yl, n.getZ(o) / yl);
  const r = new ye(e, wg(t));
  return r.receiveShadow = !0, r;
}
const Nr = 0.2, Ag = 0.1, Tl = 0.14, Fr = 1e-4, Al = 0.15, Rl = 0.05, Rg = 0.28, Wi = (i) => Math.round(i * 1e3);
function Cg(i, t) {
  const e = /* @__PURE__ */ new Map(), n = (r, o) => {
    const a = `${r}:${Wi(o)}`;
    return e.has(a) || e.set(a, { axis: r, c: o, edges: [], openings: [] }), e.get(a);
  };
  for (const r of i)
    n("x", r.z).edges.push({ a: r.x, b: r.x + r.w, inside: 1 }), n("x", r.z + r.d).edges.push({ a: r.x, b: r.x + r.w, inside: -1 }), n("z", r.x).edges.push({ a: r.z, b: r.z + r.d, inside: 1 }), n("z", r.x + r.w).edges.push({ a: r.z, b: r.z + r.d, inside: -1 });
  for (const r of t) {
    const o = r.from[1] === r.to[1], a = o ? `x:${Wi(r.from[1])}` : `z:${Wi(r.from[0])}`, l = e.get(a);
    if (!l) continue;
    const h = o ? [r.from[0], r.to[0]] : [r.from[1], r.to[1]];
    l.openings.push({ ...r, a: Math.min(...h), b: Math.max(...h) });
  }
  const s = [];
  for (const r of e.values()) {
    const o = [...new Set([...r.edges, ...r.openings].flatMap((l) => [Wi(l.a), Wi(l.b)]))].sort((l, h) => l - h).map((l) => l / 1e3), a = [];
    for (let l = 0; l < o.length - 1; l++) {
      const h = (o[l] + o[l + 1]) / 2, u = r.edges.filter((d) => d.a < h && h < d.b);
      if (!u.length) continue;
      const c = {
        axis: r.axis,
        c: r.c,
        a: o[l],
        b: o[l + 1],
        kind: u.length > 1 ? "interior" : "exterior",
        inside: u[0].inside,
        opening: r.openings.find((d) => d.a < h && h < d.b) || null
      }, f = a[a.length - 1];
      f && Math.abs(f.b - c.a) < Fr && f.kind === c.kind && f.inside === c.inside && f.opening === c.opening ? f.b = c.b : a.push(c);
    }
    a.forEach((l, h) => {
      l.freeA = !(a[h - 1] && Math.abs(a[h - 1].b - l.a) < Fr), l.freeB = !(a[h + 1] && Math.abs(a[h + 1].a - l.b) < Fr);
    }), s.push(...a);
  }
  return s;
}
function Pg(i) {
  const t = new Te(), e = [], n = i.wallHeight, s = Math.min(i.interiorWallHeight, n), r = i.rooms, o = i.openings, { minX: a, minZ: l, maxX: h, maxZ: u } = i.bounds, c = dt(h - a + 0.7, 0.3, u - l + 0.7, J("#141927", { rough: 0.9 }), { r: 0.12 });
  Q(c, (a + h) / 2, -0.305, (l + u) / 2), c.receiveShadow = !0, t.add(c);
  for (const T of r) {
    const C = Tg(T, T.floor);
    C.userData = { kind: "room", id: T.id }, e.push(C), t.add(C);
  }
  const f = J("#e7e3db", { rough: 0.95 }), d = J("#262b3a", { rough: 0.8 }), g = [f, f, d, f, f, f], x = new cs({ colorWrite: !1, depthWrite: !1 }), m = new Cn({
    color: "#9cc0ff",
    roughness: 0.08,
    transparent: !0,
    opacity: 0.22,
    emissive: "#3d5fae",
    emissiveIntensity: 0.5
  }), p = J("#2c3142", { rough: 0.6 }), E = (T, C, M, _, A, F, O = g, G = t) => {
    const $ = M - C, V = T.axis === "x" ? new Qe($, A - _, F) : new Qe(F, A - _, $), K = new ye(V, O), H = (C + M) / 2;
    return K.position.set(T.axis === "x" ? H : T.c, (_ + A) / 2, T.axis === "x" ? T.c : H), K.castShadow = K.receiveShadow = !0, G.add(K), K;
  }, b = /* @__PURE__ */ new Map(), y = (T, C) => {
    const M = `${T},${C}`;
    if (!b.has(M)) {
      const _ = { nx: T, nz: C, tall: new Te(), curb: new Te(), near: null, up: 1 };
      t.add(_.tall, _.curb), b.set(M, _);
    }
    return b.get(M);
  };
  for (const T of Cg(r, o)) {
    const C = T.kind === "exterior", M = C ? Nr : Ag, _ = T.a - (T.freeA ? Nr / 2 : 0), A = T.b + (T.freeB ? Nr / 2 : 0), F = T.opening?.type;
    let O = t;
    if (C) {
      const $ = y(T.axis === "z" ? -T.inside : 0, T.axis === "x" ? -T.inside : 0);
      F !== "door" && E(T, _, A, 0, Tl, M, g, $.curb), O = $.tall;
    }
    if (F === "door" || F === "open") continue;
    const G = C ? n : s;
    if (F === "window" && C) {
      const { sill: $, head: V } = T.opening;
      E(T, _, A, 0, $, M, g, O), E(T, _, A, Math.min(V, n), n, M, g, O);
      const K = E(T, _, A, $, V, 0.03, m, O);
      K.castShadow = !1;
      const H = 0.05, st = [
        [_, _ + H, $, V],
        [A - H, A, $, V],
        [_, A, $, $ + H],
        [_, A, V - H, V]
      ];
      A - _ > 1.2 && st.push([(_ + A) / 2 - H / 2, (_ + A) / 2 + H / 2, $, V]);
      for (const [ut, yt, Bt, jt] of st) E(T, ut, yt, Bt, jt, 0.07, p, O);
      continue;
    }
    F !== "window" && (E(T, _, A, 0, G, M, g, O), !C && s < n && (E(T, _, A, s, n, 0.04, x).receiveShadow = !1));
  }
  const N = Tl / n, R = (T) => {
    const C = T.up === 0;
    T.curb.visible = C, T.tall.visible = !C, T.tall.scale.y = N + (1 - N) * T.up * T.up * (3 - 2 * T.up);
  };
  return {
    group: t,
    floors: e,
    view(T, C) {
      for (const M of b.values()) {
        const _ = M.nx * T + M.nz * C;
        M.near === null ? (M.near = _ > Al, M.up = M.near ? 0 : 1, R(M)) : M.near = _ > Al + (M.near ? -Rl : Rl);
      }
    },
    update(T) {
      let C = !1, M = !1;
      for (const _ of b.values()) {
        const A = _.near ? 0 : 1;
        if (_.up === A) continue;
        const F = T / Rg;
        _.up = A > _.up ? Math.min(A, _.up + F) : Math.max(A, _.up - F), R(_), _.up === A ? M = !0 : C = !0;
      }
      return C ? "moving" : M ? "stopped" : null;
    }
  };
}
const kn = "#a98459", $i = "#5a4334", En = "#eceae5", Me = "#1b1c21", Xi = "#9a9fa8", he = (...i) => {
  const t = new Te();
  return t.add(...i.flat().filter(Boolean)), t;
};
function Ws(i, t = 0.75) {
  return `#${new Pt(i).multiplyScalar(t).getHexString()}`;
}
function cn(i, t, e, n, s = 0.06, r = 0.022) {
  const o = [];
  for (const a of [-1, 1])
    for (const l of [-1, 1])
      o.push(Q(le(r, r * 0.8, e, n, 10), a * (i / 2 - s), 0, l * (t / 2 - s)));
  return o;
}
function Cl(i, t, e, n) {
  const s = J(e, { rough: 1 }), r = J(Ws(e, 0.82), { rough: 1 }), o = 0.2, a = i - o * 2, l = [
    ...cn(i, t, 0.1, J(Me, { rough: 0.5 }), 0.08),
    Q(dt(i, 0.2, t, r, { r: 0.05 }), 0, 0.1, 0),
    Q(dt(a, 0.52, 0.24, r, { r: 0.09 }), 0, 0.3, -t / 2 + 0.12)
  ];
  for (const u of [-1, 1]) l.push(Q(dt(o, 0.36, t, r, { r: 0.08 }), u * (i / 2 - o / 2), 0.3, 0));
  const h = a / n;
  for (let u = 0; u < n; u++) {
    const c = -a / 2 + h * (u + 0.5);
    l.push(Q(dt(h - 0.02, 0.17, t - 0.3, s, { r: 0.06 }), c, 0.3, 0.1));
    const f = Q(dt(h - 0.04, 0.36, 0.16, s, { r: 0.07 }), c, 0.46, -t / 2 + 0.3);
    f.rotation.x = -0.14, l.push(f);
  }
  return he(...l);
}
function Pl(i = Me) {
  const t = J(i, { rough: 0.7 }), e = Q(dt(0.42, 0.4, 0.04, t, { r: 0.02 }), 0, 0.47, -0.2);
  return e.rotation.x = -0.1, he(...cn(0.42, 0.42, 0.44, t, 0.04, 0.015), Q(dt(0.44, 0.05, 0.44, t, { r: 0.02 }), 0, 0.42, 0), e);
}
function fi(i, t, e, n, s, r) {
  const o = [];
  for (let a = 1; a < s; a++) o.push(Q(dt(8e-3, t, 6e-3, r, { r: 0 }), -i / 2 + i / s * a, e, n));
  return o;
}
const wc = {
  rug({ size: i = [2, 1.4], color: t = "#3b4a66" }) {
    const e = he(
      Q(dt(i[0], 0.016, i[1], J(t, { rough: 1 }), { r: 6e-3 }), 0, 0, 0),
      Q(dt(i[0] - 0.24, 0.018, i[1] - 0.24, J(Ws(t, 1.18), { rough: 1 }), { r: 6e-3 }), 0, 0, 0)
    );
    return e.userData.flat = !0, e;
  },
  sofa({ width: i = 2.2, color: t = "#8b93a7" }) {
    const e = Cl(i, 0.95, t, i > 2 ? 3 : 2), n = Q(dt(0.36, 0.36, 0.12, J("#d9b98a", { rough: 1 }), { r: 0.05 }), -i / 2 + 0.42, 0.46, -0.1);
    return n.rotation.set(-0.25, 0.3, 0.1), e.add(n), e;
  },
  armchair({ color: i = "#c28a5a" }) {
    return Cl(0.92, 0.88, i, 1);
  },
  coffeeTable({ width: i = 1.1 }) {
    const t = J(kn, { rough: 0.6 });
    return he(
      Q(dt(i, 0.04, 0.58, t, { r: 0.015 }), 0, 0.36, 0),
      Q(dt(i - 0.16, 0.02, 0.44, J(Me, { rough: 0.5 }), { r: 8e-3 }), 0, 0.14, 0),
      ...cn(i, 0.58, 0.36, J(Me, { rough: 0.5 }), 0.07, 0.015),
      Q(dt(0.24, 0.035, 0.17, J("#c9553f", { rough: 0.9 }), { r: 6e-3 }), 0.22, 0.4, 0.05),
      Q(le(0.05, 0.04, 0.09, J(En, { rough: 0.4 })), -0.3, 0.4, -0.08)
    );
  },
  tv({ width: i = 1.7 }) {
    const t = i * 0.84, e = t * 0.5625, n = new Cn({
      color: "#05070c",
      roughness: 0.25,
      emissive: "#27407a",
      emissiveIntensity: 0.35
    });
    return he(
      Q(dt(i, 0.36, 0.4, J($i, { rough: 0.6 }), { r: 0.015 }), 0, 0.1, 0),
      ...cn(i, 0.4, 0.1, J(Me), 0.08, 0.015),
      ...fi(i, 0.3, 0.13, 0.2, 3, J(Me)),
      Q(dt(t + 0.03, e + 0.03, 0.035, J(Me, { rough: 0.4 }), { r: 8e-3 }), 0, 0.72, -0.15),
      Q(dt(t - 0.02, e - 0.02, 0.01, n, { r: 0 }), 0, 0.745, -0.129),
      Q(dt(0.5, 0.07, 0.09, J("#2a2c33", { rough: 0.7 }), { r: 0.02 }), 0, 0.46, 0.05)
    );
  },
  sideboard({ width: i = 1.6 }) {
    return he(
      ...cn(i, 0.42, 0.16, J(Me), 0.07, 0.015),
      Q(dt(i, 0.6, 0.42, J(kn, { rough: 0.6 }), { r: 0.015 }), 0, 0.16, 0),
      ...fi(i, 0.54, 0.19, 0.21, 4, J($i)),
      Q(le(0.07, 0.05, 0.26, J("#3d6b8c", { rough: 0.35 })), -i / 2 + 0.3, 0.76, 0),
      Q(dt(0.3, 0.05, 0.2, J("#d8c9a8", { rough: 0.9 }), { r: 6e-3 }), i / 2 - 0.35, 0.76, 0)
    );
  },
  diningSet({ width: i = 1.8, chairs: t = 6 }) {
    const n = J("#b48d63", { rough: 0.55 }), s = he(
      Q(dt(i, 0.05, 0.95, n, { r: 0.02 }), 0, 0.71, 0),
      ...cn(i, 0.95, 0.71, J(Me, { rough: 0.5 }), 0.1, 0.028),
      Q(le(0.16, 0.1, 0.07, J(En, { rough: 0.4 })), 0, 0.76, 0)
    ), r = Math.ceil(t / 2);
    for (let o = 0; o < t; o++) {
      const a = o < r ? 1 : -1, l = o < r ? o : o - r, h = o < r ? r : t - r, u = Pl("#2b2e37");
      u.position.set(-i / 2 + i / h * (l + 0.5), 0, a * (0.95 / 2 + 0.12)), u.rotation.y = a > 0 ? Math.PI : 0, s.add(u);
    }
    return s;
  },
  island({ width: i = 2, stools: t = 3 }) {
    const e = he(
      Q(dt(i - 0.12, 0.88, 0.62, J("#39424f", { rough: 0.7 }), { r: 0.015 }), 0, 0, -0.04),
      Q(dt(i, 0.05, 0.86, J("#e9e7e2", { rough: 0.3 }), { r: 0.015 }), 0, 0.88, 0)
    );
    for (let n = 0; n < t; n++) {
      const s = -i / 2 + i / t * (n + 0.5);
      e.add(
        he(
          Q(le(0.16, 0.16, 0.012, J(Me, { rough: 0.4 })), s, 0, 0.62),
          Q(le(0.015, 0.015, 0.64, J(Xi, { rough: 0.3, metal: 0.8 }), 10), s, 0, 0.62),
          Q(le(0.17, 0.15, 0.05, J("#c28a5a", { rough: 0.9 })), s, 0.64, 0.62)
        )
      );
    }
    return e;
  },
  kitchen({ width: i = 3, upper: t = !0 }) {
    const e = J("#e4e1da", { rough: 0.6 }), n = J("#b9b6ae"), s = Math.max(2, Math.round(i / 0.6)), r = he(
      Q(dt(i, 0.86, 0.6, e, { r: 8e-3 }), 0, 0, 0),
      ...fi(i, 0.78, 0.06, 0.3, s, n),
      Q(dt(i + 0.02, 0.04, 0.63, J("#33363d", { rough: 0.35 }), { r: 8e-3 }), 0, 0.86, 5e-3),
      Q(dt(0.58, 0.012, 0.5, J("#0c0d10", { rough: 0.15 }), { r: 0 }), -i / 4, 0.9, 0),
      Q(dt(0.5, 0.012, 0.38, J(Xi, { rough: 0.3, metal: 0.9 }), { r: 0 }), i / 4, 0.9, 0.02),
      Q(le(0.015, 0.015, 0.24, J(Xi, { rough: 0.25, metal: 0.9 }), 10), i / 4, 0.9, -0.22)
    );
    return t && r.add(
      Q(dt(i, 0.72, 0.35, e, { r: 8e-3 }), 0, 1.48, -0.125),
      ...fi(i, 0.66, 1.51, 0.05, s, n),
      Q(dt(0.7, 0.1, 0.42, J("#2f3239", { rough: 0.4, metal: 0.4 }), { r: 8e-3 }), -i / 4, 1.42, -0.09)
    ), r;
  },
  fridge() {
    const i = J("#c5c9d0", { rough: 0.35, metal: 0.5 });
    return he(
      Q(dt(0.7, 1.92, 0.68, i, { r: 0.025 }), 0, 0, 0),
      Q(dt(0.66, 8e-3, 5e-3, J("#7c8088"), { r: 0 }), 0, 1.25, 0.34),
      Q(dt(0.02, 0.5, 0.03, J("#70747c", { metal: 0.7, rough: 0.3 }), { r: 8e-3 }), -0.26, 1.34, 0.35),
      Q(dt(0.02, 0.4, 0.03, J("#70747c", { metal: 0.7, rough: 0.3 }), { r: 8e-3 }), -0.26, 0.76, 0.35)
    );
  },
  bed({ width: i = 1.6, color: t = "#7f8fb5" }) {
    const n = J("#f1efea", { rough: 1 }), s = he(
      Q(dt(i + 0.1, 0.26, 2.1 + 0.04, J($i, { rough: 0.7 }), { r: 0.03 }), 0, 0.04, 0),
      Q(dt(i + 0.16, 1.02, 0.1, J(Ws(t, 0.6), { rough: 1 }), { r: 0.04 }), 0, 0, -2.1 / 2),
      Q(dt(i, 0.2, 2.1 - 0.06, n, { r: 0.07 }), 0, 0.28, 0.02),
      Q(dt(i + 0.05, 0.13, 2.1 * 0.63, J(t, { rough: 1 }), { r: 0.06 }), 0, 0.4, 2.1 * 0.17),
      Q(dt(i + 0.06, 0.05, 0.3, J(Ws(t, 0.8), { rough: 1 }), { r: 0.02 }), 0, 0.5, 2.1 * 0.36)
    );
    for (const r of [-1, 1]) {
      const o = Q(dt(i / 2 - 0.14, 0.13, 0.42, n, { r: 0.06 }), r * i / 4, 0.46, -0.6900000000000001);
      o.rotation.x = -0.18, s.add(o);
    }
    return s;
  },
  nightstand() {
    return he(
      Q(dt(0.46, 0.44, 0.4, J(kn, { rough: 0.6 }), { r: 0.015 }), 0, 0.06, 0),
      ...cn(0.46, 0.4, 0.06, J(Me), 0.06, 0.014),
      Q(dt(0.4, 6e-3, 5e-3, J($i), { r: 0 }), 0, 0.28, 0.2)
    );
  },
  dresser({ width: i = 1.3 }) {
    const t = he(
      ...cn(i, 0.45, 0.1, J(Me), 0.06, 0.015),
      Q(dt(i, 0.74, 0.45, J(En, { rough: 0.6 }), { r: 0.015 }), 0, 0.1, 0),
      Q(le(0.09, 0.07, 0.18, J("#c9a15e", { rough: 0.4 })), i / 2 - 0.3, 0.84, 0)
    );
    for (let e = 1; e < 3; e++) t.add(Q(dt(i - 0.06, 6e-3, 5e-3, J("#b9b6ae"), { r: 0 }), 0, 0.1 + 0.247 * e, 0.226));
    return t;
  },
  plant({ height: i = 1.2 }) {
    const t = Zs(Math.round(i * 1e3)), e = [J("#3f7d52", { rough: 0.9 }), J("#4f9462", { rough: 0.9 }), J("#35694a", { rough: 0.9 })], n = he(
      Q(le(0.17, 0.12, 0.3, J("#d7d0c4", { rough: 0.8 })), 0, 0, 0),
      Q(le(0.15, 0.15, 0.02, J("#3a2c22", { rough: 1 })), 0, 0.285, 0),
      Q(le(0.015, 0.02, i * 0.55, J("#6b4a33", { rough: 1 }), 8), 0, 0.3, 0)
    ), s = Math.round(6 + i * 5);
    for (let r = 0; r < s; r++) {
      const o = r / (s - 1), a = 0.5 + o * (i - 0.62), l = 0.28 * Math.sin(Math.PI * (0.25 + o * 0.7)), h = t() * Math.PI * 2, u = new ye(new Yo(0.13 + t() * 0.1, 1), e[r % 3]);
      u.position.set(Math.cos(h) * l * t(), a, Math.sin(h) * l * t()), u.scale.y = 0.75 + t() * 0.3, n.add(u);
    }
    return n;
  },
  vanity({ width: i = 1 }) {
    const t = new Cn({ color: "#b9c7dc", roughness: 0.12, metalness: 0.9 });
    return he(
      Q(dt(i, 0.62, 0.48, J(kn, { rough: 0.6 }), { r: 0.012 }), 0, 0.2, 0),
      ...fi(i, 0.56, 0.23, 0.24, 2, J($i)),
      Q(dt(i + 0.03, 0.04, 0.5, J(En, { rough: 0.25 }), { r: 0.012 }), 0, 0.82, 0),
      Q(le(0.19, 0.15, 0.1, J(En, { rough: 0.2 })), 0, 0.86, 0.02),
      Q(le(0.012, 0.012, 0.2, J(Xi, { rough: 0.2, metal: 0.9 }), 10), 0, 0.86, -0.18),
      Q(dt(i * 0.82, 0.8, 0.025, t, { r: 0.01 }), 0, 1.08, -0.225)
    );
  },
  bathtub() {
    return he(
      Q(dt(1.7, 0.56, 0.78, J(En, { rough: 0.25 }), { r: 0.1 }), 0, 0, 0),
      Q(dt(1.5, 0.02, 0.58, J("#9fd3ec", { rough: 0.1, emissive: "#1d4f6b", emissiveIntensity: 0.25 }), { r: 9e-3 }), 0, 0.545, 0),
      Q(le(0.014, 0.014, 0.2, J(Xi, { rough: 0.2, metal: 0.9 }), 10), -0.74, 0.56, 0)
    );
  },
  toilet() {
    const i = J(En, { rough: 0.25 }), t = Q(le(0.19, 0.13, 0.4, i), 0, 0, 0.1);
    t.scale.z = 1.25;
    const e = Q(le(0.2, 0.2, 0.03, i), 0, 0.4, 0.1);
    return e.scale.z = 1.25, he(Q(dt(0.38, 0.78, 0.17, i, { r: 0.03 }), 0, 0, -0.24), t, e);
  },
  desk({ width: i = 1.4 }) {
    const t = Pl("#2b2e37");
    return t.position.z = 0.5, t.rotation.y = Math.PI, he(
      Q(dt(i, 0.04, 0.65, J(kn, { rough: 0.55 }), { r: 0.012 }), 0, 0.72, 0),
      ...cn(i, 0.65, 0.72, J(Me), 0.06, 0.02),
      Q(dt(0.56, 0.34, 0.025, J(Me, { rough: 0.3 }), { r: 8e-3 }), 0, 0.86, -0.18),
      Q(dt(0.2, 0.1, 0.12, J(Me), { r: 8e-3 }), 0, 0.76, -0.18),
      t
    );
  },
  wardrobe({ width: i = 1.6, height: t = 2.1 }) {
    return he(
      Q(dt(i, t, 0.6, J(En, { rough: 0.6 }), { r: 0.015 }), 0, 0, 0),
      ...fi(i, t - 0.08, 0.04, 0.3, Math.max(2, Math.round(i / 0.55)), J("#b9b6ae"))
    );
  },
  bookshelf({ width: i = 1, height: t = 1.8 }) {
    const e = Zs(Math.round(i * 100 + t * 7)), n = J(kn, { rough: 0.6 }), s = he(Q(dt(i, t, 0.04, n, { r: 0 }), 0, 0, -0.14));
    for (const a of [-1, 1]) s.add(Q(dt(0.03, t, 0.32, n, { r: 0 }), a * (i / 2 - 0.015), 0, 0));
    const r = Math.round(t / 0.38), o = ["#c9553f", "#3d6b8c", "#d8c9a8", "#4f9462", "#8b93a7", "#d9b98a"];
    for (let a = 0; a <= r; a++) {
      const l = (t - 0.03) * (a / r);
      if (s.add(Q(dt(i, 0.03, 0.32, n, { r: 0 }), 0, l, 0)), a === r) break;
      let h = -i / 2 + 0.06;
      for (; h < i / 2 - 0.12; ) {
        const u = 0.03 + e() * 0.04, c = 0.2 + e() * 0.1;
        s.add(Q(dt(u, c, 0.2, J(o[Math.floor(e() * o.length)], { rough: 0.9 }), { r: 0 }), h + u / 2, l + 0.03, 0)), h += u + 4e-3, e() < 0.12 && (h += 0.12);
      }
    }
    return s;
  },
  // A straight flight up to the floor above: you step on at the front (+z) and climb towards the back.
  stairs({ width: i = 1, depth: t = 2.8, height: e = 2.9 }) {
    const n = Math.max(3, Math.round(e / 0.18)), s = e / n, r = t / n, o = J("#d9d4cb", { rough: 0.9 }), a = J(kn, { rough: 0.6 }), l = new Te();
    for (let d = 0; d < n; d++) {
      const g = t / 2 - r * (d + 0.5);
      l.add(Q(dt(i, s * d + s - 0.03, r, o, { r: 0 }), 0, 0, g)), l.add(Q(dt(i + 0.02, 0.03, r + 0.02, a, { r: 8e-3 }), 0, s * (d + 1) - 0.03, g));
    }
    const h = J(Me, { rough: 0.5 }), u = Math.atan2(e, t), c = Math.hypot(e, t), f = Q(dt(0.04, 0.04, c, h, { r: 0.015 }), i / 2 - 0.03, e / 2 + 0.9, 0);
    f.rotation.x = u, l.add(f);
    for (const d of [0.1, 0.5, 0.9])
      l.add(Q(dt(0.025, 0.9, 0.025, h, { r: 0 }), i / 2 - 0.03, e * d, t / 2 - t * d));
    return l;
  }
}, a0 = Object.keys(wc);
function l0(i) {
  const t = i.width;
  switch (i.type) {
    case "rug":
      return i.size || [2, 1.4];
    case "sofa":
      return [t || 2.2, 0.95];
    case "armchair":
      return [0.92, 0.88];
    case "coffeeTable":
      return [t || 1.1, 0.58];
    case "tv":
      return [t || 1.7, 0.4];
    case "sideboard":
      return [t || 1.6, 0.42];
    case "diningSet":
      return [t || 1.8, 1.9];
    case "island":
      return [t || 2, 1.1];
    case "kitchen":
      return [t || 3, 0.62];
    case "fridge":
      return [0.7, 0.68];
    case "bed":
      return [(t || 1.6) + 0.1, 2.14];
    case "nightstand":
      return [0.46, 0.4];
    case "dresser":
      return [t || 1.3, 0.45];
    case "plant":
      return [0.45, 0.45];
    case "vanity":
      return [t || 1, 0.5];
    case "bathtub":
      return [1.7, 0.78];
    case "toilet":
      return [0.4, 0.66];
    case "desk":
      return [t || 1.4, 0.65];
    case "wardrobe":
      return [t || 1.6, 0.6];
    case "bookshelf":
      return [t || 1, 0.32];
    case "stairs":
      return [t || 1, i.depth || 2.8];
    default:
      return [0.6, 0.6];
  }
}
function Lg(i) {
  const t = new Te();
  for (const e of i) {
    const n = wc[e.type];
    if (!n || !Array.isArray(e.pos)) {
      console.warn(`[plan] skipping furniture of unknown type "${e.type}"`);
      continue;
    }
    const s = n(e);
    s.position.set(e.pos[0], e.y || 0, e.pos[1]), s.rotation.y = fn.degToRad(e.rot || 0);
    const r = s.userData.flat;
    s.traverse((o) => {
      o.isMesh && (o.castShadow = !r, o.receiveShadow = !0);
    }), t.add(s);
  }
  return t;
}
const qi = [[2200, "#ff9438"], [3e3, "#ffbd7a"], [4200, "#ffe2c2"], [6500, "#dfe9ff"]];
function Dg(i) {
  const t = fn.clamp(i, 2200, 6500);
  for (let e = 0; e < qi.length - 1; e++) {
    const [n, s] = qi[e], [r, o] = qi[e + 1];
    if (t <= r) return new Pt(s).lerp(new Pt(o), (t - n) / (r - n));
  }
  return new Pt(qi[qi.length - 1][1]);
}
class Ug {
  constructor(t, e = t.id) {
    this.config = t, this.entityId = e, this.group.position.set(t.pos[0], 0, t.pos[1]), this.group.rotation.y = fn.degToRad(t.rot);
    const n = t.type;
    let s;
    n === "floor" ? (s = Q(le(0.13, 0.17, 1.35, J("#272a32"), 20), 0, 0.68, 0), this.glow = new Cn({ color: "#8d8f96", emissive: "#000000", emissiveIntensity: 0 }), s.add(Q(le(0.19, 0.14, 0.24, this.glow, 24), 0, 0.64, 0))) : n === "strip" ? (this.glow = new Cn({ color: "#8d8f96", emissive: "#000000", emissiveIntensity: 0 }), s = Q(dt(t.length ?? 1, 0.025, 0.025, this.glow), 0, t.y, 0)) : (s = Q(le(n === "spots" ? 0.25 : 0.14, n === "spots" ? 0.25 : 0.14, 0.09, J("#343741"), 24), 0, t.y, 0), this.glow = new Cn({ color: "#8d8f96", emissive: "#000000", emissiveIntensity: 0 }), s.add(Q(le(n === "spots" ? 0.2 : 0.105, n === "spots" ? 0.2 : 0.105, 0.035, this.glow, 24), 0, -0.04, 0)), n === "pendant" && s.add(Q(le(7e-3, 7e-3, 0.24, J("#343741"), 8), 0, 0.14, 0))), s.traverse((o) => {
      o.isMesh && (o.castShadow = !1, o.userData = { kind: "light", entityId: e });
    }), this.group.add(s), this.light = new vg(16777215, 0, 7, 2), this.light.position.set(0, t.y || 1.5, 0), this.light.castShadow = !1, this.group.add(this.light);
    const r = new ye(new Zo(0.6, 12, 10), new cs({ transparent: !0, opacity: 0, depthWrite: !1 }));
    r.position.y = t.y || 1.5, r.userData = { kind: "light", entityId: e }, this.group.add(r);
  }
  group = new Te();
  light;
  entityId;
  goal = 0;
  level = 0;
  goalColor = new Pt("#ffbd7a");
  color = this.goalColor.clone();
  glow;
  highlighted = !1;
  setHighlighted(t) {
    this.highlighted = t, this.glow.emissiveIntensity = this.level * 2 + (t ? 0.7 : 0);
  }
  apply(t) {
    this.goal = t.on ? fn.clamp(t.brightness, 0, 1) : 0, this.goalColor = t.color ? new Pt(t.color) : t.colorTempKelvin ? Dg(t.colorTempKelvin) : this.goalColor;
  }
  update(t) {
    const e = 1 - Math.exp(-t * 7);
    return this.level += (this.goal - this.level) * e, this.color.lerp(this.goalColor, e), this.light.intensity = this.level * 12, this.light.color.copy(this.color), this.glow.emissive.copy(this.color), this.glow.emissiveIntensity = this.level * 2 + (this.highlighted ? 0.7 : 0), Math.abs(this.goal - this.level) > 5e-3;
  }
}
class Ig {
  group = new Te();
  units;
  constructor(t, e = {}) {
    this.units = t.map((n) => new Ug(n, e[n.id] ?? n.id)), this.units.forEach((n) => this.group.add(n.group));
  }
  apply(t, e) {
    this.units.find((n) => n.entityId === t || n.config.id === t)?.apply(e);
  }
  highlight(t) {
    this.units.forEach((e) => e.setHighlighted(!!t && (e.entityId === t || e.config.id === t)));
  }
  update(t) {
    return this.units.reduce((e, n) => n.update(t) || e, !1);
  }
}
const Or = { cool: 5556223, heat: 16747578, dry: 6480079, fan: 13622527, auto: 10211978 };
class Ng {
  constructor(t, e = t.id) {
    this.config = t, this.entityId = e, this.group.position.set(t.pos[0], t.y, t.pos[1]), this.group.rotation.y = { north: 0, south: Math.PI, west: Math.PI / 2, east: -Math.PI / 2 }[t.wall];
    const n = new Te();
    n.position.z = 0.2, n.add(Q(dt(0.9, 0.28, 0.2, J("#f3f4f6")), 0, -0.14, 0)), n.add(Q(dt(0.78, 0.025, 0.04, J("#262a30")), 0, -0.25, 0.07)), n.traverse((a) => {
      a.isMesh && (a.userData = { kind: "climate", entityId: e });
    }), this.group.add(n);
    const s = 42;
    this.positions = new Float32Array(s * 3);
    const r = new ze();
    r.setAttribute("position", new Ye(this.positions, 3)), this.flow = new mg(r, new Sc({ color: this.color, size: 0.045, transparent: !0, opacity: 0, depthWrite: !1, blending: zr })), this.flow.position.set(0, -0.3, 0.34), this.flow.frustumCulled = !1, this.group.add(this.flow);
    const o = new ye(new Qe(1.4, 0.8, 0.8), new cs({ transparent: !0, opacity: 0, depthWrite: !1 }));
    o.position.set(0, -0.15, 0.2), o.userData = { kind: "climate", entityId: e }, this.group.add(o);
  }
  group = new Te();
  entityId;
  flow;
  positions;
  color = new Pt(Or.cool);
  goalColor = this.color.clone();
  power = 0;
  goal = 0;
  phase = 0;
  fanSpeed = 1;
  temps;
  highlighted = !1;
  setHighlighted(t) {
    this.highlighted = t, this.group.scale.setScalar(t ? 1.04 : 1);
  }
  apply(t) {
    this.goal = t.on ? 1 : 0, this.goalColor.setHex(Or[t.mode] ?? Or.auto), this.temps = { current: t.currentTemperature, target: t.temperature }, this.fanSpeed = { auto: 0.55, low: 0.35, medium: 0.65, high: 1, turbo: 1.4 }[t.fan ?? "auto"] ?? 0.55;
  }
  update(t) {
    this.phase += t, this.power += (this.goal - this.power) * (1 - Math.exp(-t * 3.5)), this.color.lerp(this.goalColor, 1 - Math.exp(-t * 5));
    const e = this.flow.geometry.getAttribute("position");
    for (let n = 0; n < this.positions.length / 3; n++) {
      const s = (n / (this.positions.length / 3) + this.phase * 0.48 * this.fanSpeed) % 1;
      this.positions[n * 3] = Math.sin(n * 12.37 + this.phase) * (0.08 + s * 0.45), this.positions[n * 3 + 1] = -s * 1.25, this.positions[n * 3 + 2] = s * 1.55;
    }
    return e.needsUpdate = !0, this.flow.material.color.copy(this.color), this.flow.material.opacity = this.power * 0.7, this.flow.visible = this.power > 0.01, this.power > 0.01 || Math.abs(this.goal - this.power) > 5e-3;
  }
}
class Fg {
  group = new Te();
  units;
  constructor(t, e = {}) {
    this.units = t.map((n) => new Ng(n, e[n.id] ?? n.id)), this.units.forEach((n) => this.group.add(n.group));
  }
  apply(t, e) {
    this.units.find((n) => n.entityId === t || n.config.id === t)?.apply(e);
  }
  highlight(t) {
    this.units.forEach((e) => e.setHighlighted(!!t && (e.entityId === t || e.config.id === t)));
  }
  update(t) {
    return this.units.reduce((e, n) => n.update(t) || e, !1);
  }
}
function Og(i, t = new Mc(), e) {
  const n = Pg(i), s = Lg(i.furniture), r = new Ig(i.lightUnits, e?.lights), o = new Fg(i.acUnits, e?.climates);
  return t.add(n.group, s, r.group, o.group), { scene: t, house: n, furniture: s, lighting: r, acs: o };
}
function Bg(i, t, e = 38) {
  const { minX: n, minZ: s, maxX: r, maxZ: o } = i.bounds, a = (n + r) / 2, l = (s + o) / 2, u = Math.max(r - n, o - s) / (2 * Math.tan(fn.degToRad(e / 2))) * 1.55 + 2, c = fn.degToRad(i.camera.azimuth), f = fn.degToRad(i.camera.elevation);
  return { position: new L(
    a + Math.sin(c) * Math.cos(f) * u,
    Math.sin(f) * u + 1,
    l + Math.cos(c) * Math.cos(f) * u
  ), target: new L(a, 1, l) };
}
const zg = "#0a0e1a";
function kg(i, t, e = {}) {
  const n = new pg({ canvas: i, antialias: !0, powerPreference: "default" });
  n.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)), n.toneMapping = Wl, n.toneMappingExposure = 1.05, n.shadowMap.enabled = !0, n.shadowMap.type = Vl;
  const s = new Mc();
  s.background = new Pt(e.background ?? zg);
  const r = new Ie(38, 1, 0.1, 200), o = Bg(t);
  r.position.copy(o.position), r.up.set(0, 1, 0), r.lookAt(o.target);
  const { house: a, lighting: l, acs: h } = Og(t, s, e.entities);
  s.add(new _g(9348863, 724503, 0.5));
  const { minX: u, minZ: c, maxX: f, maxZ: d } = t.bounds, g = Math.max(f - u, d - c), x = new Sg(11124991, 1.1);
  x.position.set((u + f) / 2 + 4, 10, (c + d) / 2 - 4), x.castShadow = !0, x.shadow.mapSize.set(1024, 1024);
  const m = x.shadow.camera;
  m.left = m.bottom = -g * 0.85, m.right = m.top = g * 0.85, m.near = 1, m.far = 30, x.shadow.bias = -8e-4, x.shadow.normalBias = 0.04, s.add(x, x.target), x.target.position.set((u + f) / 2, 0, (c + d) / 2);
  const p = new L().subVectors(r.position, o.target).setY(0).normalize();
  a.view(p.x, p.z);
  let E = 0, b = 0, y = !1;
  function N(M = 2) {
    b = Math.max(b, M), !E && !y && (E = requestAnimationFrame(R));
  }
  function R() {
    E = 0;
    const M = a.update(1 / 60) != null || l.update(1 / 60) || h.update(1 / 60);
    (b > 0 || M) && (n.render(s, r), b = Math.max(0, b - 1), (b > 0 || M) && (E = requestAnimationFrame(R)));
  }
  function T() {
    const M = i.parentElement, _ = M?.clientWidth || i.clientWidth || 1, A = M?.clientHeight || i.clientHeight || 1;
    !_ || !A || (n.setSize(_, A, !1), r.aspect = _ / A, r.updateProjectionMatrix(), N(3));
  }
  const C = typeof ResizeObserver < "u" ? new ResizeObserver(T) : null;
  return C && i.parentElement && C.observe(i.parentElement), window.addEventListener("resize", T), T(), N(4), {
    scene: s,
    camera: r,
    renderer: n,
    lighting: l,
    acs: h,
    resize: T,
    requestRender: N,
    renderNow() {
      n.render(s, r);
    },
    viewFromCamera() {
      const M = new L();
      r.getWorldDirection(M), a.view(-M.x, -M.z), N(30);
    },
    dispose() {
      y = !0, E && cancelAnimationFrame(E), E = 0, window.removeEventListener("resize", T), C?.disconnect(), s.traverse((M) => {
        const _ = M;
        _.geometry && _.geometry.dispose();
        const A = _.material;
        A && (Array.isArray(A) ? A : [A]).forEach((F) => F.dispose());
      }), n.dispose();
    }
  };
}
class Si extends Error {
}
const Tc = ["north", "east", "south", "west"];
function Ac(i, t) {
  const { x: e, y: n, width: s, length: r } = i;
  switch (t) {
    case "north":
      return { from: [e, n], to: [e + s, n] };
    case "south":
      return { from: [e, n + r], to: [e + s, n + r] };
    case "west":
      return { from: [e, n], to: [e, n + r] };
    case "east":
      return { from: [e + s, n], to: [e + s, n + r] };
  }
}
function Hg(i) {
  const t = i.lastIndexOf("_");
  if (t < 0) throw new Si(`Opening wallId "${i}" must look like "<roomId>_<side>"`);
  const e = i.slice(0, t), n = i.slice(t + 1);
  if (!Tc.includes(n)) throw new Si(`Opening wallId "${i}" has unknown side "${n}"`);
  return { roomId: e, side: n };
}
function Ll(i, t, e) {
  const { roomId: n, side: s } = Hg(i.wallId), r = t.get(n);
  if (!r) throw new Si(`Opening "${i.wallId}" refers to unknown room "${n}"`);
  const { from: o, to: a } = Ac(r, s), l = o[1] === a[1], h = Math.min(Math.max(i.offset, 0), (l ? r.width : r.length) - i.width), u = l ? o[0] + h : o[1] + h, c = u + i.width, f = e === "window" ? i.sill ?? 0.85 : 0, d = i.height ?? (e === "door" ? 2.1 : 1.2);
  return {
    type: e,
    from: l ? [u, o[1]] : [o[0], u],
    to: l ? [c, o[1]] : [o[0], c],
    sill: f,
    head: f + d
  };
}
function Vg(i) {
  const t = [];
  for (const e of Tc) {
    const n = i.walls?.[e];
    if (n !== "open" && n !== "window") continue;
    const { from: s, to: r } = Ac(i, e), o = Math.hypot(r[0] - s[0], r[1] - s[1]), a = n === "open" ? o : Math.min(1.4, o * 0.6), l = (o - a) / 2, h = s[1] === r[1], u = (h ? s[0] : s[1]) + l;
    t.push({
      type: n,
      from: h ? [u, s[1]] : [s[0], u],
      to: h ? [u + a, s[1]] : [s[0], u + a],
      sill: n === "window" ? 0.85 : 0,
      head: n === "window" ? 2.05 : 2.1
    });
  }
  return t;
}
function Yi(i) {
  if (!i || !Array.isArray(i.rooms) || i.rooms.length === 0)
    throw new Si('Plan needs at least one room in "rooms"');
  const t = i.wallHeight ?? i.rooms.find((d) => d.height != null)?.height ?? 2.8, e = i.rooms.map((d) => {
    const [g, x, m, p] = d.rect ?? [d.x, d.y, d.width, d.length];
    if (!(m > 0 && p > 0)) throw new Si(`Room "${d.id}" has an empty rect`);
    return { id: d.id, name: d.name || d.id, x: g, z: x, w: m, d: p, floor: d.floor || "oak" };
  }), n = new Map(i.rooms.map((d) => [d.id, d])), s = [...i.openings ?? []];
  for (const d of i.rooms) d.rect || s.push(...Vg(d));
  for (const d of i.doors ?? []) s.push(Ll(d, n, "door"));
  for (const d of i.windows ?? []) s.push(Ll(d, n, "window"));
  const r = (i.furniture ?? []).map((d) => ({
    ...d,
    y: 0,
    pos: d.pos ?? [d.x ?? 0, d.y ?? 0],
    rot: d.rot ?? d.rotation ?? 0
  })), o = { ceiling: "ceiling", pendant: "pendant", ceiling_pendant: "pendant", spots: "spots", floor: "floor", floor_lamp: "floor", table: "table", table_lamp: "table", strip: "strip", lamp: "table" }, a = (i.lights ?? []).map((d) => {
    const g = o[d.type ?? d.fixture ?? "pendant"] ?? "pendant", x = d.pos ?? [d.x ?? 0, d.y ?? 0];
    return { id: d.id, name: d.name ?? d.id, room: d.room ?? d.roomId ?? "", capabilities: d.capabilities ?? ["brightness"], pos: x, y: d.z ?? d.y ?? (g === "ceiling" || g === "spots" ? t - 0.15 : g === "floor" ? 1.4 : g === "table" ? 0.5 : g === "strip" ? 1.4 : 1.8), type: g, rot: d.rot ?? 0, length: d.length };
  }), l = (i.acs ?? []).map((d) => {
    const g = d.room ?? d.roomId ?? "", x = e.find((p) => p.id === g);
    if (!x) throw new Si(`AC "${d.id}" refers to unknown room "${g}"`);
    let m;
    if (d.pos) m = d.pos;
    else switch (d.wall) {
      case "north":
        m = [x.x + (d.x ?? 0), x.z];
        break;
      case "south":
        m = [x.x + (d.x ?? 0), x.z + x.d];
        break;
      case "west":
        m = [x.x, x.z + (d.x ?? 0)];
        break;
      case "east":
        m = [x.x + x.w, x.z + (d.x ?? 0)];
        break;
    }
    return { id: d.id, name: d.name ?? d.id, room: g, pos: m, y: d.y, wall: d.wall };
  }), h = Math.min(...e.map((d) => d.x)), u = Math.min(...e.map((d) => d.z)), c = Math.max(...e.map((d) => d.x + d.w)), f = Math.max(...e.map((d) => d.z + d.d));
  return {
    name: i.name || "Home",
    wallHeight: t,
    interiorWallHeight: Math.min(i.interiorWallHeight ?? 1.25, t),
    camera: { azimuth: i.camera?.azimuth ?? 34, elevation: i.camera?.elevation ?? 47 },
    rooms: e,
    openings: s,
    furniture: r,
    lightUnits: a,
    acUnits: l,
    scenes: i.scenes ?? [],
    bounds: { minX: h, minZ: u, maxX: c, maxZ: f }
  };
}
const Gg = "Home", Wg = 29, $g = { azimuth: 34, elevation: 47 }, Xg = [{ id: "bright", name: "Bright", icon: "sun", lights: { "*": { on: !0, brightness: 1, temp: 4200 } } }, { id: "cozy", name: "Cozy", icon: "sofa", lights: { "*": { on: !1 }, "living.floor": { on: !0 }, "living.tv": { on: !0, brightness: 0.7, color: "#ff7a3c" }, "dining.pendant": { on: !0, brightness: 0.45, temp: 2400 }, "kitchen.strip": { on: !0, brightness: 0.6, temp: 2700 }, "bedroom.left": { on: !0 }, "bedroom.right": { on: !0 } } }, { id: "movie", name: "Movie", icon: "film", lights: { "*": { on: !1 }, "living.tv": { on: !0, brightness: 0.9, color: "#6a4cff" }, "kitchen.strip": { on: !0, brightness: 0.2, temp: 2400 } } }, { id: "night", name: "Night", icon: "moon", lights: { "*": { on: !1 }, "bedroom.left": { on: !0 }, "bath.mirror": { on: !0, brightness: 0.25, temp: 2300 } }, acs: { "bedroom.ac": { sleep: !0 } } }, { id: "away", name: "Away", icon: "door", lights: { "*": { on: !1 } }, acs: { "*": { on: !1 } } }], qg = 2.6, Yg = 1.25, Zg = [{ id: "living", name: "Living", x: 0, y: 3.6, width: 6.4, length: 4.6, floor: "oak" }, { id: "dining", name: "Dining", x: 6.4, y: 3.6, width: 4, length: 4.6, floor: "oak" }, { id: "kitchen", name: "Kitchen", x: 6.4, y: 0, width: 4, length: 3.6, floor: "stone" }, { id: "bedroom", name: "Bedroom", x: 0, y: 0, width: 4.2, length: 3.6, floor: "walnut" }, { id: "bath", name: "Bathroom", x: 4.2, y: 0, width: 2.2, length: 3.6, floor: "tile" }], jg = [{ type: "door", from: [3.1, 3.6], to: [4, 3.6], sill: 0, head: 2.1 }, { type: "door", from: [4.7, 3.6], to: [5.5, 3.6], sill: 0, head: 2.1 }, { type: "open", from: [6.4, 4.2], to: [6.4, 7.8], sill: 0, head: 2.1 }, { type: "open", from: [7, 3.6], to: [10, 3.6], sill: 0, head: 2.1 }, { type: "window", from: [0, 1], to: [0, 2.6], sill: 0, head: 2.1 }, { type: "window", from: [0, 7], to: [0, 7.9], sill: 0, head: 2.1 }, { type: "window", from: [0.9, 0], to: [2.3, 0], sill: 1.5, head: 2.2 }], Kg = [{ type: "rug", x: 2.3, y: 6, size: [2.5, 3.1], color: "#3b4a66", rotation: 0 }, { type: "tv", x: 0.32, y: 6, width: 1.7, rotation: 90 }, { type: "sofa", x: 3.95, y: 6, width: 2.5, color: "#8b93a7", rotation: -90 }, { type: "coffeeTable", x: 2.3, y: 6, rotation: 90 }, { type: "armchair", x: 1.9, y: 4.35, color: "#c28a5a", rotation: 12 }, { type: "plant", x: 0.5, y: 7.65, height: 1.5, rotation: 0 }, { type: "sideboard", x: 5.2, y: 7.85, width: 1.6, rotation: 180 }, { type: "diningSet", x: 8.5, y: 6.4, width: 1.9, chairs: 6, rotation: 0 }, { type: "plant", x: 9.95, y: 7.75, height: 1.1, rotation: 0 }, { type: "island", x: 8.5, y: 3.75, width: 2.2, stools: 3, rotation: 0 }, { type: "kitchen", x: 8.05, y: 0.41, width: 3.1, upper: !0, rotation: 0 }, { type: "fridge", x: 10.02, y: 0.45, rotation: 0 }, { type: "rug", x: 2.1, y: 2.3, size: [2.6, 1.6], color: "#6a5a52", rotation: 0 }, { type: "bed", x: 2.1, y: 1.2, width: 1.7, color: "#7f8fb5", rotation: 0 }, { type: "nightstand", x: 0.85, y: 0.4, rotation: 0 }, { type: "nightstand", x: 3.35, y: 0.4, rotation: 0 }, { type: "dresser", x: 3.87, y: 2.5, width: 1.3, rotation: -90 }, { type: "plant", x: 0.45, y: 3.15, height: 0.9, rotation: 0 }, { type: "vanity", x: 4.95, y: 0.38, width: 1, rotation: 0 }, { type: "bathtub", x: 5.92, y: 1.35, rotation: 90 }, { type: "toilet", x: 4.58, y: 2.5, rotation: 90 }], Jg = [{ id: "living.main", name: "Ceiling", roomId: "living", x: 2.9, y: 6, z: 2.45, fixture: "ceiling", rot: 0, length: null, capabilities: ["brightness", "temp"] }, { id: "living.floor", name: "Floor lamp", roomId: "living", x: 0.6, y: 4.2, z: 1.4, fixture: "floor", rot: 0, length: null, capabilities: ["brightness"] }, { id: "living.tv", name: "TV backlight", roomId: "living", x: 0.13, y: 6, z: 1.05, fixture: "strip", rot: 90, length: 1.5, capabilities: ["brightness", "color"] }, { id: "dining.pendant", name: "Pendant", roomId: "dining", x: 8.5, y: 6.4, z: 1.75, fixture: "pendant", rot: 0, length: null, capabilities: ["brightness", "temp"] }, { id: "kitchen.spots", name: "Spots", roomId: "kitchen", x: 8.4, y: 2, z: 2.45, fixture: "spots", rot: 0, length: null, capabilities: ["brightness"] }, { id: "kitchen.strip", name: "Counter light", roomId: "kitchen", x: 8.05, y: 0.42, z: 1.42, fixture: "strip", rot: 0, length: 2.9, capabilities: ["brightness", "temp"] }, { id: "bedroom.main", name: "Ceiling", roomId: "bedroom", x: 2.1, y: 2.3, z: 2.45, fixture: "ceiling", rot: 0, length: null, capabilities: ["brightness", "temp"] }, { id: "bedroom.left", name: "Bedside left", roomId: "bedroom", x: 0.85, y: 0.4, z: 0.5, fixture: "table", rot: 0, length: null, capabilities: ["brightness"] }, { id: "bedroom.right", name: "Bedside right", roomId: "bedroom", x: 3.35, y: 0.4, z: 0.5, fixture: "table", rot: 0, length: null, capabilities: ["brightness"] }, { id: "bath.main", name: "Ceiling", roomId: "bath", x: 5.2, y: 2, z: 2.45, fixture: "ceiling", rot: 0, length: null, capabilities: ["brightness"] }, { id: "bath.mirror", name: "Mirror light", roomId: "bath", x: 4.95, y: 0.14, z: 1.95, fixture: "strip", rot: 0, length: 0.8, capabilities: ["brightness", "temp"] }], Qg = [{ id: "living.ac", name: "Living AC", roomId: "living", wall: "west", x: 4.45, y: 2.2, pos: [0, 4.45] }, { id: "bedroom.ac", name: "Bedroom AC", roomId: "bedroom", wall: "north", x: 3.3, y: 2.2, pos: [3.3, 0] }], _i = {
  name: Gg,
  outdoorTemp: Wg,
  camera: $g,
  scenes: Xg,
  wallHeight: qg,
  interiorWallHeight: Yg,
  rooms: Zg,
  openings: jg,
  furniture: Kg,
  lights: Jg,
  acs: Qg
}, Dl = (i) => typeof i == "number" ? Math.max(0, Math.min(1, i / 255)) : 1;
class t0 {
  constructor(t, e, n = {}, s = () => {
  }) {
    this.lights = t, this.acs = e, this.bindings = n, this.changed = s;
  }
  hass;
  previous = /* @__PURE__ */ new Map();
  localStates = /* @__PURE__ */ new Map();
  setHass(t) {
    this.hass = t, t && this.updateEntities(t.states);
  }
  updateEntities(t) {
    let e = !1;
    for (const n of this.lights.units) {
      const s = this.bindings.lights?.[n.config.id] ?? n.entityId, r = t[s];
      if (!r) continue;
      const o = `${r.state}|${JSON.stringify(r.attributes)}`;
      if (this.previous.get(s) === o) continue;
      this.previous.set(s, o), e = !0;
      const a = r.attributes, l = Array.isArray(a.rgb_color) ? `#${a.rgb_color.map((f) => Math.round(f).toString(16).padStart(2, "0")).join("")}` : void 0, h = Number(a.color_temp_kelvin) || (Number(a.color_temp) ? 1e6 / Number(a.color_temp) : void 0), u = r.state === "on";
      this.localStates.set(s, { on: u, brightness: Dl(a.brightness), kelvin: Number(a.color_temp_kelvin) || (Number(a.color_temp) ? 1e6 / Number(a.color_temp) : void 0) });
      const c = { on: u, brightness: Dl(a.brightness), color: l, colorTempKelvin: h };
      this.lights.apply(s, c);
    }
    for (const n of this.acs.units) {
      const s = this.bindings.climates?.[n.config.id] ?? n.entityId, r = t[s];
      if (!r) continue;
      const o = `${r.state}|${JSON.stringify(r.attributes)}`;
      if (this.previous.get(s) === o) continue;
      this.previous.set(s, o), e = !0;
      const a = r.attributes, l = r.state !== "off" && r.state !== "unavailable" && r.state !== "unknown";
      this.localStates.set(s, { on: l, mode: r.state, target: a.temperature, current: a.current_temperature, fan: a.fan_mode });
      const h = { on: l, mode: r.state, currentTemperature: a.current_temperature, temperature: a.temperature, fan: a.fan_mode };
      this.acs.apply(s, h);
    }
    e && this.changed();
  }
  toggle(t) {
    if (t.startsWith("light.") || this.lights.units.some((s) => s.entityId === t || s.config.id === t)) {
      const s = this.state(t), r = !s.on;
      this.localStates.set(t, { ...s, on: r, brightness: s.brightness ?? 1 }), this.lights.apply(t, { on: r, brightness: s.brightness ?? 1, colorTempKelvin: s.kelvin }), this.changed();
      const o = this.bindings.lights?.[t] ?? t;
      this.hass && this.hass.states[o] && o.startsWith("light.") && this.hass.callService("light", "toggle", { entity_id: o });
      return;
    }
    if (t.startsWith("climate.") || this.acs.units.some((s) => s.entityId === t || s.config.id === t)) {
      const s = this.state(t), r = !s.on, o = r ? "cool" : "off";
      this.localStates.set(t, { ...s, on: r, mode: o, target: s.target ?? 22, current: s.current ?? 24 }), this.acs.apply(t, { on: r, mode: o, temperature: s.target ?? 22, currentTemperature: s.current ?? 24 }), this.changed();
      const a = this.bindings.climates?.[t] ?? t;
      this.hass && this.hass.states[a] && a.startsWith("climate.") && this.hass.callService("climate", "set_hvac_mode", { entity_id: a, hvac_mode: o });
      return;
    }
  }
  state(t) {
    if (this.localStates.has(t)) return this.localStates.get(t);
    const e = this.bindings.lights?.[t];
    if (e && this.localStates.has(e)) return this.localStates.get(e);
    const n = this.bindings.climates?.[t];
    return n && this.localStates.has(n) ? this.localStates.get(n) : { on: !1, brightness: 1, mode: "off" };
  }
  setBrightness(t, e) {
    const n = Math.max(0, Math.min(100, Math.round(e))), s = this.state(t), r = n > 0;
    this.localStates.set(t, { ...s, on: r, brightness: n / 100 }), this.lights.apply(t, { on: r, brightness: n / 100, colorTempKelvin: s.kelvin }), this.changed();
    const o = this.bindings.lights?.[t] ?? t;
    this.hass?.states[o] && o.startsWith("light.") && (n === 0 ? this.hass.callService("light", "turn_off", { entity_id: o }) : this.hass.callService("light", "turn_on", { entity_id: o, brightness_pct: n }));
  }
  setLightColor(t, e) {
    const n = this.state(t);
    this.localStates.set(t, { ...n, on: !0 }), this.lights.apply(t, { on: !0, brightness: n.brightness ?? 1, color: e }), this.changed();
    const s = this.bindings.lights?.[t] ?? t;
    if (this.hass?.states[s] && s.startsWith("light.")) {
      const r = e.match(/[0-9a-f]{2}/gi)?.map((o) => parseInt(o, 16));
      r?.length === 3 && this.hass.callService("light", "turn_on", { entity_id: s, rgb_color: r });
    }
  }
  setKelvin(t, e) {
    const n = this.state(t);
    this.localStates.set(t, { ...n, on: !0, kelvin: e }), this.lights.apply(t, { on: !0, brightness: n.brightness ?? 1, colorTempKelvin: e }), this.changed();
    const s = this.bindings.lights?.[t] ?? t;
    this.hass?.states[s] && s.startsWith("light.") && this.hass.callService("light", "turn_on", { entity_id: s, color_temp_kelvin: e });
  }
  setTemperature(t, e) {
    const n = this.state(t);
    this.localStates.set(t, { ...n, on: !0, target: e }), this.acs.apply(t, { on: !0, mode: n.mode ?? "cool", temperature: e, currentTemperature: n.current ?? 24 }), this.changed();
    const s = this.bindings.climates?.[t] ?? t;
    this.hass?.states[s] && s.startsWith("climate.") && this.hass.callService("climate", "set_temperature", { entity_id: s, temperature: e });
  }
  setFanMode(t, e) {
    const n = this.state(t);
    this.localStates.set(t, { ...n, fan: e }), this.acs.apply(t, { on: n.on, mode: n.mode ?? "cool", fan: e }), this.changed();
    const s = this.bindings.climates?.[t] ?? t;
    this.hass?.states[s] && s.startsWith("climate.") && this.hass.callService("climate", "set_fan_mode", { entity_id: s, fan_mode: e });
  }
  setClimateMode(t, e) {
    const n = this.state(t), s = e !== "off";
    this.localStates.set(t, { ...n, on: s, mode: e }), this.acs.apply(t, { on: s, mode: e, temperature: n.target ?? 22, currentTemperature: n.current ?? 24 }), this.changed();
    const r = this.bindings.climates?.[t] ?? t;
    this.hass?.states[r] && r.startsWith("climate.") && this.hass.callService("climate", "set_hvac_mode", { entity_id: r, hvac_mode: e });
  }
  setLightPower(t, e) {
    const n = this.state(t);
    this.localStates.set(t, { ...n, on: e, brightness: n.brightness ?? 1 }), this.lights.apply(t, { on: e, brightness: n.brightness ?? 1, colorTempKelvin: n.kelvin }), this.changed();
    const s = this.bindings.lights?.[t] ?? t;
    this.hass?.states[s] && s.startsWith("light.") && this.hass.callService("light", e ? "turn_on" : "turn_off", { entity_id: s });
  }
  setClimatePower(t, e) {
    const n = this.state(t);
    this.setClimateMode(t, e ? n.mode === "off" ? "cool" : n.mode ?? "cool" : "off");
  }
  applyScene(t) {
    for (const e of this.lights.units) {
      const n = t.lights?.[e.config.id] ?? t.lights?.["*"];
      if (n) {
        const s = e.entityId;
        this.localStates.set(s, { ...this.state(s), on: n.on ?? this.state(s).on, brightness: n.brightness ?? this.state(s).brightness ?? 1 }), this.lights.apply(s, { on: n.on ?? this.state(s).on, brightness: n.brightness ?? this.state(s).brightness ?? 1, color: n.color, colorTempKelvin: n.temp });
      }
    }
    for (const e of this.acs.units) {
      const n = t.acs?.[e.config.id] ?? t.acs?.["*"];
      n?.on !== void 0 && this.setClimatePower(e.entityId, n.on);
    }
    if (this.changed(), this.hass) for (const e of this.lights.units) {
      const n = t.lights?.[e.config.id] ?? t.lights?.["*"], s = e.entityId;
      !n || !this.hass.states[s] || !s.startsWith("light.") || (n.on === !1 ? this.hass.callService("light", "turn_off", { entity_id: s }) : this.hass.callService("light", "turn_on", { entity_id: s, ...n.brightness !== void 0 ? { brightness_pct: Math.round(n.brightness * 100) } : {}, ...n.temp !== void 0 ? { color_temp_kelvin: n.temp } : {} }));
    }
  }
}
const Ul = 0.1, Fs = 0.6, Il = { oak: "#4a3d2e", walnut: "#3c2f28", tile: "#39424b", stone: "#30353c" }, Ft = (i) => Math.round(i / Ul) * Ul;
function e0(i, t, e) {
  const s = i.ownerSVGElement.createSVGPoint();
  s.x = t, s.y = e;
  const r = s.matrixTransform(i.getScreenCTM().inverse());
  return [r.x, r.y];
}
class n0 extends Yn {
  static properties = { plan: { attribute: !1 }, selected: { state: !0 }, mode: { state: !0 }, zoom: { state: !0 }, panX: { state: !0 }, panY: { state: !0 } };
  selected;
  mode = "select";
  zoom = 1;
  panX = 36;
  panY = 34;
  pointers = /* @__PURE__ */ new Map();
  gesture;
  roomCounter = 1;
  static styles = Po`
    :host{display:block;height:100%;box-sizing:border-box;color:var(--primary-text-color,#eee);font:13px/1.35 system-ui,sans-serif}.toolbar{display:flex;gap:5px;flex-wrap:wrap;padding:7px;background:#151b28;border-radius:8px 8px 0 0}.toolbar button{border:1px solid #495264;background:#232c3d;color:inherit;border-radius:6px;padding:6px 9px;cursor:pointer}.toolbar button.active{background:#385c8c;border-color:#83b5ff}.viewport{width:100%;height:calc(100% - 70px);min-height:280px;background:#111722;border:1px solid #384152;border-radius:0 0 8px 8px;overflow:hidden;touch-action:none;cursor:grab}.viewport:active{cursor:grabbing}.room{stroke:#d6dce6;stroke-width:.055;vector-effect:non-scaling-stroke;cursor:move}.room.selected{stroke:#72aaff;stroke-width:.09}.room-label{fill:#fff;paint-order:stroke;stroke:#111722;stroke-width:.06;text-anchor:middle;dominant-baseline:middle;font-size:.32px;pointer-events:none}.handle{fill:#f8fbff;stroke:#4287ef;stroke-width:.045;vector-effect:non-scaling-stroke;cursor:move}.opening{stroke:#f4d7a4;stroke-width:.14;stroke-linecap:round;vector-effect:non-scaling-stroke;cursor:move}.opening.window{stroke:#80b5ff;stroke-width:.09}.fixture{fill:#ffe19a;stroke:#111722;stroke-width:.055;vector-effect:non-scaling-stroke;cursor:move}.ac{fill:#7ee6ff;stroke:#101722;stroke-width:.05;vector-effect:non-scaling-stroke;cursor:move}.furniture{fill:#a6adbf99;stroke:#e0e5ef;stroke-width:.045;vector-effect:non-scaling-stroke;cursor:move}.furn-label{fill:#fff;font-size:.18px;text-anchor:middle;pointer-events:none}.grid-label{fill:#8290a4;font-size:.22px;pointer-events:none}.legend{display:flex;justify-content:space-between;color:#aab5c6;padding:5px 2px;font-size:11px}
  `;
  willUpdate(t) {
    t.has("plan") && !this.plan && (this.plan = { rooms: [] });
  }
  emit(t) {
    this.dispatchEvent(new CustomEvent("plan-changed", { detail: { plan: t }, bubbles: !0, composed: !0 }));
  }
  select(t, e, n) {
    this.selected = { kind: t, index: e, id: n }, this.dispatchEvent(new CustomEvent("selection-changed", { detail: this.selected, bubbles: !0, composed: !0 }));
  }
  point(t) {
    const e = this.renderRoot.querySelector("#world");
    return e ? e0(e, t.clientX, t.clientY) : [0, 0];
  }
  canvasPoint(t, e) {
    const n = this.renderRoot.querySelector("svg"), s = n?.getBoundingClientRect();
    return s ? [(t - s.left) / s.width * 800, (e - s.top) / s.height * 430] : [0, 0];
  }
  roomById(t) {
    return this.plan.rooms.find((e) => e.id === t);
  }
  openingList() {
    return this.plan.openings ?? [];
  }
  devicePoint(t) {
    if (t.pos) return t.pos;
    const e = this.roomById(t.roomId ?? t.room ?? "");
    if (!e) return [t.x ?? 0, 0];
    switch (t.wall) {
      case "north":
        return [e.x + (t.x ?? 0), e.y];
      case "south":
        return [e.x + (t.x ?? 0), e.y + e.length];
      case "west":
        return [e.x, e.y + (t.x ?? 0)];
      case "east":
        return [e.x + e.width, e.y + (t.x ?? 0)];
    }
  }
  nearestWall(t, e, n) {
    const s = [Math.abs(n - t.y), Math.abs(e - (t.x + t.width)), Math.abs(n - (t.y + t.length)), Math.abs(e - t.x)], r = s.indexOf(Math.min(...s)), o = ["north", "east", "south", "west"][r], a = r % 2 === 0 ? Math.max(0, Math.min(t.width, e - t.x)) : Math.max(0, Math.min(t.length, n - t.y));
    return { wall: o, along: a };
  }
  addAt(t, e) {
    const n = structuredClone(this.plan);
    if (this.mode === "add-room") {
      const s = { id: `room_${this.roomCounter++}`, name: "New Room", x: Ft(t), y: Ft(e), width: 3, length: 3, floor: "oak" };
      n.rooms.push(s), this.select("room", n.rooms.length - 1, s.id);
    }
    if (this.mode === "add-door" || this.mode === "add-window") {
      const s = n.rooms.find((u) => t >= u.x - 0.5 && t <= u.x + u.width + 0.5 && e >= u.y - 0.5 && e <= u.y + u.length + 0.5) ?? n.rooms[0];
      if (!s) return;
      const { wall: r, along: o } = this.nearestWall(s, t, e);
      let a, l;
      const h = this.mode === "add-door" ? 0.9 : 1.2;
      if (r === "north" || r === "south") {
        const u = Math.max(s.x, Math.min(s.x + s.width - h, s.x + o - h / 2)), c = r === "north" ? s.y : s.y + s.length;
        a = [Ft(u), c], l = [Ft(u + h), c];
      } else {
        const u = Math.max(s.y, Math.min(s.y + s.length - h, s.y + o - h / 2)), c = r === "west" ? s.x : s.x + s.width;
        a = [c, Ft(u)], l = [c, Ft(u + h)];
      }
      n.openings = [...n.openings ?? [], { type: this.mode === "add-door" ? "door" : "window", from: a, to: l, sill: this.mode === "add-window" ? 0.85 : 0, head: this.mode === "add-window" ? 2.05 : 2.1 }], this.select("opening", n.openings.length - 1, `opening_${n.openings.length}`);
    }
    if (this.mode === "add-light") {
      const s = n.rooms.find((o) => t >= o.x && t <= o.x + o.width && e >= o.y && e <= o.y + o.length) ?? n.rooms[0];
      if (!s) return;
      const r = { id: `light_fixture_${(n.lights?.length ?? 0) + 1}`, name: "New Light", roomId: s.id, x: Ft(t), y: Ft(e), z: 2.5, fixture: "pendant", capabilities: ["brightness", "temp"] };
      n.lights = [...n.lights ?? [], r], this.select("light", n.lights.length - 1, r.id);
    }
    if (this.mode === "add-ac") {
      const s = n.rooms.find((l) => t >= l.x - 0.6 && t <= l.x + l.width + 0.6 && e >= l.y - 0.6 && e <= l.y + l.length + 0.6) ?? n.rooms[0];
      if (!s) return;
      const { wall: r, along: o } = this.nearestWall(s, t, e), a = { id: `climate_ac_${(n.acs?.length ?? 0) + 1}`, name: "New AC", roomId: s.id, wall: r, x: Ft(o), y: 2.2 };
      n.acs = [...n.acs ?? [], a], this.select("ac", n.acs.length - 1, a.id);
    }
    if (this.mode === "add-furniture") {
      const s = { type: "sofa", x: Ft(t), y: Ft(e), rotation: 0 };
      n.furniture = [...n.furniture ?? [], s], this.select("furniture", n.furniture.length - 1, `furniture_${n.furniture.length}`);
    }
    this.emit(n), this.mode = "select";
  }
  down = (t) => {
    t.currentTarget.setPointerCapture(t.pointerId), this.pointers.set(t.pointerId, { x: t.clientX, y: t.clientY });
    const [n, s] = this.point(t), o = t.target.closest("[data-kind]"), a = o?.dataset.kind, l = o?.dataset.id ?? "", h = Number(o?.dataset.index ?? -1), u = o?.dataset.handle;
    if (this.pointers.size >= 2) {
      const c = [...this.pointers.values()];
      this.gesture = { kind: "pinch", id: "", index: -1, start: [this.panX, this.panY], startZoom: this.zoom, startDistance: Math.hypot(c[0].x - c[1].x, c[0].y - c[1].y), startCenter: [(c[0].x + c[1].x) / 2, (c[0].y + c[1].y) / 2] };
      return;
    }
    if (this.mode === "add-room") {
      this.addAt(n, s);
      return;
    }
    if (this.mode !== "select") {
      this.addAt(n, s);
      return;
    }
    if (a === "room" && h >= 0) {
      const c = this.plan.rooms[h];
      this.select("room", h, c.id), this.gesture = { kind: u ? "resize" : "room", id: l, index: h, handle: u, start: [n, s], room: structuredClone(c) };
      return;
    }
    if (a === "opening" || a === "light" || a === "ac" || a === "furniture") {
      this.select(a, h, l), this.gesture = { kind: a, id: l, index: h, start: [n, s], opening: a === "opening" ? structuredClone(this.openingList()[h]) : void 0 };
      return;
    }
    this.selected = void 0, this.dispatchEvent(new CustomEvent("selection-changed", { detail: void 0, bubbles: !0, composed: !0 })), this.gesture = { kind: "pan", id: "", index: -1, start: [this.canvasPoint(t.clientX, t.clientY)[0] - this.panX, this.canvasPoint(t.clientX, t.clientY)[1] - this.panY] };
  };
  move = (t) => {
    if (!this.pointers.has(t.pointerId)) return;
    this.pointers.set(t.pointerId, { x: t.clientX, y: t.clientY });
    const e = this.gesture;
    if (!e) return;
    if (e.kind === "pinch" && this.pointers.size >= 2) {
      const l = [...this.pointers.values()].map((c) => this.canvasPoint(c.x, c.y)), h = Math.hypot(l[0][0] - l[1][0], l[0][1] - l[1][1]), u = [(l[0][0] + l[1][0]) / 2, (l[0][1] + l[1][1]) / 2];
      this.zoom = Math.max(0.45, Math.min(3, (e.startZoom ?? 1) * h / Math.max(1, e.startDistance ?? 1))), this.panX = e.start[0] + (u[0] - (e.startCenter?.[0] ?? u[0])), this.panY = e.start[1] + (u[1] - (e.startCenter?.[1] ?? u[1]));
      return;
    }
    const [n, s] = this.point(t), r = n - e.start[0], o = s - e.start[1], a = structuredClone(this.plan);
    if (e.kind === "pan") {
      const [l, h] = this.canvasPoint(t.clientX, t.clientY);
      this.panX = l - e.start[0], this.panY = h - e.start[1];
      return;
    }
    if (e.kind === "room") {
      const l = e.index, h = a.rooms[l], u = e.room;
      h.x = Ft(u.x + r), h.y = Ft(u.y + o);
      for (const c of a.openings ?? []) {
        const f = Math.abs(c.from[0] - c.to[0]) < 0.01 && [u.x, u.x + u.width].some((g) => Math.abs(c.from[0] - g) < 0.15), d = Math.abs(c.from[1] - c.to[1]) < 0.01 && [u.y, u.y + u.length].some((g) => Math.abs(c.from[1] - g) < 0.15);
        f && c.from[1] >= u.y - 0.1 && c.to[1] <= u.y + u.length + 0.1 ? (c.from = [Ft(c.from[0] + r), Ft(c.from[1] + o)], c.to = [Ft(c.to[0] + r), Ft(c.to[1] + o)]) : d && c.from[0] >= u.x - 0.1 && c.to[0] <= u.x + u.width + 0.1 && (c.from = [Ft(c.from[0] + r), Ft(c.from[1] + o)], c.to = [Ft(c.to[0] + r), Ft(c.to[1] + o)]);
      }
      for (const c of a.lights ?? []) (c.roomId ?? c.room) === u.id && (c.x = Ft((c.x ?? 0) + r), c.y = Ft((c.y ?? 0) + o));
      for (const c of a.furniture ?? []) {
        const f = c.x ?? c.pos?.[0] ?? NaN, d = c.y ?? c.pos?.[1] ?? NaN;
        f >= u.x && f <= u.x + u.width && d >= u.y && d <= u.y + u.length && (c.x = Ft(f + r), c.y = Ft(d + o), delete c.pos);
      }
      for (const c of a.acs ?? []) (c.roomId ?? c.room) === u.id && c.pos && (c.pos = [Ft(c.pos[0] + r), Ft(c.pos[1] + o)]);
      this.emit(a);
      return;
    }
    if (e.kind === "resize") {
      const l = e.index, h = a.rooms[l], u = e.room, c = e.handle;
      let f = u.x, d = u.y, g = u.x + u.width, x = u.y + u.length;
      c.includes("w") && (f = Math.min(g - Fs, Ft(u.x + r))), c.includes("e") && (g = Math.max(f + Fs, Ft(u.x + u.width + r))), c.includes("n") && (d = Math.min(x - Fs, Ft(u.y + o))), c.includes("s") && (x = Math.max(d + Fs, Ft(u.y + u.length + o))), h.x = f, h.y = d, h.width = g - f, h.length = x - d, this.emit(a);
      return;
    }
    if (e.kind === "opening") {
      const l = a.openings?.[e.index], h = e.opening;
      if (l && h) {
        let u;
        for (const c of a.rooms) {
          const f = this.nearestWall(c, n, s), d = f.wall === "north" ? Math.abs(s - c.y) : f.wall === "south" ? Math.abs(s - (c.y + c.length)) : f.wall === "west" ? Math.abs(n - c.x) : Math.abs(n - (c.x + c.width));
          (!u || d < u.distance) && (u = { room: c, wall: f.wall, along: f.along, distance: d });
        }
        if (u) {
          const c = Math.hypot(h.to[0] - h.from[0], h.to[1] - h.from[1]), f = u.room;
          if (u.wall === "north" || u.wall === "south") {
            const d = Math.max(f.x, Math.min(f.x + f.width - c, f.x + u.along - c / 2)), g = u.wall === "north" ? f.y : f.y + f.length;
            l.from = [Ft(d), g], l.to = [Ft(d + c), g];
          } else {
            const d = Math.max(f.y, Math.min(f.y + f.length - c, f.y + u.along - c / 2)), g = u.wall === "west" ? f.x : f.x + f.width;
            l.from = [g, Ft(d)], l.to = [g, Ft(d + c)];
          }
          this.emit(a);
        }
      }
      return;
    }
    if (e.kind === "light") {
      const l = a.lights?.[e.index];
      l && (l.x = Ft(n), l.y = Ft(s), this.emit(a));
      return;
    }
    if (e.kind === "ac") {
      const l = a.acs?.[e.index];
      if (l) {
        const h = a.rooms.find((f) => f.id === (l.roomId ?? l.room)) ?? a.rooms[0], { wall: u, along: c } = this.nearestWall(h, n, s);
        l.wall = u, l.x = Ft(c), delete l.pos, this.emit(a);
      }
      return;
    }
    if (e.kind === "furniture") {
      const l = a.furniture?.[e.index];
      l && (l.x = Ft(n), l.y = Ft(s), delete l.pos, this.emit(a));
    }
  };
  up = (t) => {
    if (this.pointers.delete(t.pointerId), this.pointers.size === 0) this.gesture = void 0;
    else if (this.pointers.size === 1) {
      const e = [...this.pointers.values()][0];
      this.gesture = { kind: "pan", id: "", index: -1, start: [this.canvasPoint(e.x, e.y)[0] - this.panX, this.canvasPoint(e.x, e.y)[1] - this.panY] };
    }
  };
  wheel = (t) => {
    t.preventDefault();
    const n = t.currentTarget.getBoundingClientRect(), s = (t.clientX - n.left) * 800 / n.width, r = (t.clientY - n.top) * 430 / n.height, o = Math.max(0.45, Math.min(3, this.zoom * Math.exp(-t.deltaY * 1e-3))), a = o / this.zoom;
    this.panX = s - (s - this.panX) * a, this.panY = r - (r - this.panY) * a, this.zoom = o;
  };
  addRoom = () => {
    this.mode = "add-room";
  };
  handles(t, e) {
    if (this.selected?.kind !== "room" || this.selected.index !== e) return Rt``;
    const n = 0.14;
    return [["nw", t.x, t.y], ["n", t.x + t.width / 2, t.y], ["ne", t.x + t.width, t.y], ["e", t.x + t.width, t.y + t.length / 2], ["se", t.x + t.width, t.y + t.length], ["s", t.x + t.width / 2, t.y + t.length], ["sw", t.x, t.y + t.length], ["w", t.x, t.y + t.length / 2]].map(([r, o, a]) => Rt`<circle class="handle" data-kind="room" data-index=${e} data-id=${t.id} data-handle=${r} cx=${o} cy=${a} r=${n}></circle>`);
  }
  render() {
    const t = this.plan?.rooms ?? [], e = t.flatMap((c) => [c.x, c.x + c.width]), n = t.flatMap((c) => [c.y, c.y + c.length]), s = Math.max(12, ...e) + 1, r = Math.max(9, ...n) + 1, o = this.plan?.furniture ?? [], a = this.plan?.lights ?? [], l = this.plan?.acs ?? [], h = this.openingList(), u = (c, f) => Rt`<button class=${this.mode === c ? "active" : ""} @click=${() => this.mode = c}>${f}</button>`;
    return Rt`<div class="toolbar">${u("select", "Select")}${u("add-room", "＋ Room")}${u("add-door", "Door")}${u("add-window", "Window")}${u("add-light", "＋ Light")}${u("add-ac", "＋ AC")}${u("add-furniture", "＋ Sofa")}<button @click=${() => {
      this.zoom = Math.min(3, this.zoom * 1.2);
    }}>＋</button><button @click=${() => {
      this.zoom = Math.max(0.45, this.zoom / 1.2);
    }}>−</button><button @click=${() => {
      this.zoom = 1, this.panX = 36, this.panY = 34;
    }}>Fit</button></div>
      <svg class="viewport" viewBox="0 0 800 430" role="application" aria-label="Interactive floor plan in metres" @pointerdown=${this.down} @pointermove=${this.move} @pointerup=${this.up} @pointercancel=${this.up} @wheel=${this.wheel}>
        <defs><pattern id="minor-grid" width="0.5" height="0.5" patternUnits="userSpaceOnUse"><path d="M .5 0 H0 V.5" fill="none" stroke="#2b3545" stroke-width=".012"/></pattern><pattern id="major-grid" width="1" height="1" patternUnits="userSpaceOnUse"><path d="M1 0H0V1" fill="none" stroke="#445166" stroke-width=".022"/></pattern></defs>
        <g id="world" transform=${`translate(${this.panX} ${this.panY}) scale(${48 * this.zoom})`}>
          <rect x="-2" y="-2" width=${s + 4} height=${r + 4} fill="url(#minor-grid)"/><rect x="-2" y="-2" width=${s + 4} height=${r + 4} fill="url(#major-grid)"/>
          ${t.map((c, f) => Rt`<g><rect class=${`room ${this.selected?.kind === "room" && this.selected.index === f ? "selected" : ""}`} data-kind="room" data-id=${c.id} data-index=${f} x=${c.x} y=${c.y} width=${c.width} height=${c.length} rx=".03" fill=${Il[c.floor ?? "oak"] ?? Il.oak}/><text class="room-label" x=${c.x + c.width / 2} y=${c.y + c.length / 2}>${c.name ?? c.id} · ${c.width.toFixed(1)}×${c.length.toFixed(1)}m</text>${this.handles(c, f)}</g>`)}
          ${h.map((c, f) => Rt`<line class=${`opening ${c.type === "window" ? "window" : ""}`} data-kind="opening" data-id=${`opening_${f}`} data-index=${f} x1=${c.from[0]} y1=${c.from[1]} x2=${c.to[0]} y2=${c.to[1]}/>`)}
          ${a.map((c, f) => Rt`<g data-kind="light" data-id=${c.id} data-index=${f}><circle class="fixture" cx=${c.x ?? 0} cy=${c.y ?? 0} r=".16"/><text class="furn-label" x=${c.x ?? 0} y=${(c.y ?? 0) + 0.34}>${c.name ?? "Light"}</text></g>`)}
          ${l.map((c, f) => {
      const [d, g] = this.devicePoint(c);
      return Rt`<g data-kind="ac" data-id=${c.id} data-index=${f}><rect class="ac" x=${d - 0.18} y=${g - 0.12} width=".36" height=".24" rx=".04"/><text class="furn-label" x=${d} y=${g + 0.32}>AC</text></g>`;
    })}
          ${o.map((c, f) => {
      const d = c.x ?? c.pos?.[0] ?? 0, g = c.y ?? c.pos?.[1] ?? 0, x = Number(c.width ?? (c.type === "bed" ? 1.7 : c.type === "sofa" ? 2.1 : 1)), m = Number(c.depth ?? (c.type === "bed" ? 2 : c.type === "sofa" ? 0.85 : 0.7));
      return Rt`<g data-kind="furniture" data-id=${`furniture_${f}`} data-index=${f}><rect class="furniture" x=${d - x / 2} y=${g - m / 2} width=${x} height=${m} rx=".05" transform=${`rotate(${c.rotation ?? c.rot ?? 0} ${d} ${g})`}/><text class="furn-label" x=${d} y=${g + 0.04}>${c.type}</text></g>`;
    })}
          
        </g>
        <text class="grid-label" x="12" y="20">Grid: 0.5 m · snap: 0.1 m · wheel/pinch to zoom · drag background to pan</text>
      </svg><div class="legend"><span>Floor plan · X/Z in metres</span><span>${this.mode === "select" ? "Select or drag an item" : `Click on plan to ${this.mode.replace("add-", "add ")}`}</span></div>`;
  }
}
customElements.get("floorplan-canvas") || customElements.define("floorplan-canvas", n0);
typeof window < "u" && (window.HOUSE_CONTROL_VERSION = "0.2.0");
class i0 extends Yn {
  activeSheet;
  activeMode = "3d";
  assistantMessage = "";
  promptBusy = !1;
  hoveredFixture;
  renderError;
  static properties = {
    hass: { attribute: !1 },
    config: { attribute: !1 },
    activeSheet: { state: !0 },
    hoveredFixture: { state: !0 },
    activeMode: { state: !0 },
    assistantMessage: { state: !0 },
    promptBusy: { state: !0 },
    renderError: { state: !0 }
  };
  _config;
  world;
  gesture = /* @__PURE__ */ new Map();
  gestureStart = /* @__PURE__ */ new Map();
  lastGesture;
  cameraTarget = new L();
  get config() {
    return this._config;
  }
  set config(t) {
    const e = this._config;
    this._config = t, this.requestUpdate("config", e);
  }
  bridge;
  raycaster = new yg();
  pointer = new kt();
  canvas;
  fixtureFor(t) {
    const n = t?.object?.userData;
    if (!n?.entityId) return;
    const s = n.kind === "climate" ? "climate" : "light", r = s === "light" ? this.world?.lighting.units.find((o) => o.entityId === n.entityId || o.config.id === n.entityId) : this.world?.acs.units.find((o) => o.entityId === n.entityId || o.config.id === n.entityId);
    return r ? { kind: s, id: r.config.id, entityId: r.entityId, name: r.config.name, room: r.config.room } : void 0;
  }
  updateHover(t) {
    if (!this.canvas || !this.world || this.gesture.size) return;
    const e = this.canvas.getBoundingClientRect();
    this.pointer.set((t.clientX - e.left) / e.width * 2 - 1, -((t.clientY - e.top) / e.height) * 2 + 1), this.raycaster.setFromCamera(this.pointer, this.world.camera);
    const n = this.raycaster.intersectObjects(this.world.scene.children, !0).find((o) => o.object.userData.entityId), s = this.fixtureFor(n);
    if (this.hoveredFixture?.entityId !== s?.entityId && (this.world.lighting.highlight(s?.kind === "light" ? s.entityId : void 0), this.world.acs.highlight(s?.kind === "climate" ? s.entityId : void 0), this.world.requestRender(2)), this.canvas.style.cursor = s ? "pointer" : "grab", s) {
      const o = this.bridge?.state(s.entityId) ?? { on: !1, brightness: 0, mode: "off" }, a = s.kind === "light" ? o.on ? `${Math.round((o.brightness ?? 1) * 100)}%` : "Off" : `${o.mode ?? "off"}${o.target ? ` · ${o.target}°` : ""}`;
      this.hoveredFixture = { ...s, stateText: a, x: t.clientX - e.left, y: t.clientY - e.top };
    } else this.hoveredFixture = void 0;
  }
  onPointerDown = (t) => {
    !this.canvas || !this.world || (this.canvas.setPointerCapture(t.pointerId), this.gesture.set(t.pointerId, { x: t.clientX, y: t.clientY }), this.gestureStart.set(t.pointerId, { x: t.clientX, y: t.clientY }), this.lastGesture = this.measureGesture());
  };
  onPointerMove = (t) => {
    if (!this.gesture.has(t.pointerId) || !this.world) {
      this.updateHover(t);
      return;
    }
    this.gesture.set(t.pointerId, { x: t.clientX, y: t.clientY });
    const e = this.measureGesture();
    if (!this.lastGesture || !e) return;
    const n = this.world.camera, s = n.position.clone().sub(this.cameraTarget), r = new bg().setFromVector3(s);
    if (this.gesture.size === 1)
      r.theta -= (e.x - this.lastGesture.x) * 6e-3, r.phi = fn.clamp(r.phi + (e.y - this.lastGesture.y) * 6e-3, 0.18, Math.PI * 0.47);
    else {
      const o = this.lastGesture.distance / Math.max(1, e.distance);
      r.radius = fn.clamp(r.radius * o, 2, 35);
      const a = (e.x - this.lastGesture.x) * 4e-3 * r.radius, l = (e.y - this.lastGesture.y) * 4e-3 * r.radius;
      this.cameraTarget.add(new L(a, 0, l).applyAxisAngle(new L(0, 1, 0), r.theta));
    }
    n.position.copy(this.cameraTarget).add(new L().setFromSpherical(r)), n.lookAt(this.cameraTarget), this.world.viewFromCamera(), this.world.requestRender(4), this.lastGesture = e;
  };
  onPointerUp = (t) => {
    const e = this.gestureStart.get(t.pointerId), n = e ? Math.hypot(e.x - t.clientX, e.y - t.clientY) : 0;
    if (this.gesture.delete(t.pointerId), this.gestureStart.delete(t.pointerId), this.lastGesture = this.measureGesture(), this.canvas && (this.canvas.style.cursor = "grab"), n > 12 || this.gesture.size || !this.canvas || !this.world || !this.bridge) return;
    const s = this.canvas.getBoundingClientRect();
    this.pointer.set((t.clientX - s.left) / s.width * 2 - 1, -((t.clientY - s.top) / s.height) * 2 + 1), this.raycaster.setFromCamera(this.pointer, this.world.camera);
    const r = this.raycaster.intersectObjects(this.world.scene.children, !0).find((a) => a.object.userData.entityId), o = this.fixtureFor(r);
    o && (this.bridge.toggle(o.entityId), this.activeSheet = o, this.hoveredFixture = void 0, this.world.requestRender(60), this.requestUpdate());
  };
  measureGesture() {
    const t = [...this.gesture.values()];
    if (!t.length) return;
    if (t.length === 1) return { x: t[0].x, y: t[0].y, distance: 0 };
    const e = t.reduce((s, r) => s + r.x, 0) / t.length, n = t.reduce((s, r) => s + r.y, 0) / t.length;
    return { x: e, y: n, distance: Math.hypot(t[0].x - t[1].x, t[0].y - t[1].y) };
  }
  static styles = Po`
    :host {
      display: block;
      width: 100%;
      height: 480px;
      border-radius: 16px;
      overflow: hidden;
      position: relative;
      background: #0a0e1a !important;
      color: #f7f8fc;
      font-family: system-ui, sans-serif;
    }
    .stage { position:absolute; inset:0; background:#0a0e1a; }
    .error-box { display:flex; align-items:center; justify-content:center; text-align:center; padding:24px; box-sizing:border-box; }
    .error-box strong { font-size:16px; margin-bottom:6px; display:block; color:#f87171; }
    .retry-btn { margin-top:14px; padding:8px 20px; border-radius:999px; background:#3b82f6; border:1px solid #60a5fa; color:#fff; font:inherit; font-size:13px; font-weight:600; cursor:pointer; }
    .retry-btn:hover { background:#2563eb; }
    canvas {
      width: 100%;
      height: 100%;
      display: block;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
    }
    .scenes{position:absolute;z-index:2;top:60px;left:50%;transform:translateX(-50%);display:flex;gap:6px;max-width:calc(100% - 20px);overflow:auto;padding:5px;border-radius:16px;background:#101727bb;backdrop-filter:blur(12px)}
    .scenes button,.close,.power,.step button,.mode button,.fan button{border:1px solid #ffffff25;background:#ffffff12;color:inherit;border-radius:999px;padding:7px 12px;font:inherit;cursor:pointer;white-space:nowrap;user-select:none}.scenes button:hover,.mode button.selected,.fan button.selected{background:#3b82f6;border-color:#60a5fa;color:#fff}
    .tooltip{position:absolute;z-index:3;pointer-events:none;transform:translate(12px,12px);padding:8px 11px;border:1px solid #ffffff25;border-radius:10px;background:#111827dd;backdrop-filter:blur(10px);font-size:12px;box-shadow:0 8px 30px #0006}.tooltip strong{display:block}
    .veil{position:absolute;inset:0;z-index:10;background:#02040a66;backdrop-filter:blur(2px);display:flex;align-items:flex-end;justify-content:center;cursor:default}
    .sheet{position:relative;z-index:11;width:min(420px,100%);max-height:88%;overflow:auto;box-sizing:border-box;padding:20px 20px max(20px,env(safe-area-inset-bottom));border:1px solid #ffffff24;border-bottom:0;border-radius:24px 24px 0 0;background:linear-gradient(145deg,#1e2638f8,#0e1420fc);box-shadow:0 -14px 50px #00000099;backdrop-filter:blur(18px);animation:rise .18s ease-out}
    @keyframes rise{from{transform:translateY(24px);opacity:.5}to{transform:translateY(0);opacity:1}}
    .sheet-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}.sheet-head h3{margin:0;font-size:19px}.subtle{color:#aab5c9;font-size:12px;margin-top:3px}
    .close{font-size:22px;line-height:1;width:34px;height:34px;display:flex;align-items:center;justify-content:center;border-radius:50%;padding:0}.close:hover{background:#ffffff33;border-color:#ffffff66}
    .control{display:grid;gap:8px;margin:16px 0}.control label{display:flex;justify-content:space-between;color:#dce3ef;font-size:13px}.control input[type=range]{width:100%;accent-color:#60a5fa;min-height:32px;cursor:pointer}
    .power{width:100%;padding:10px 16px;font-size:14px;font-weight:600;border-radius:12px;transition:background .15s, border-color .15s}.power.on{background:#2563eb;border-color:#60a5fa;color:#ffffff;box-shadow:0 0 16px #3b82f655}
    .swatches{display:flex;gap:9px;flex-wrap:wrap}.swatches button{width:29px;height:29px;border-radius:50%;border:2px solid #ffffff70;cursor:pointer}
    .step{display:flex;align-items:center;justify-content:center;gap:24px;margin:12px}.step output{font-size:42px;font-variant-numeric:tabular-nums}.step button{width:48px;height:48px;font-size:24px;padding:0}.mode,.fan{display:flex;gap:6px;flex-wrap:wrap}.climate-meta{text-align:center;color:#bdc7d8;font-size:13px}
    .mode-toggle{position:absolute;z-index:5;top:10px;left:50%;transform:translateX(-50%);display:flex;gap:3px;padding:4px;border:1px solid #ffffff26;border-radius:999px;background:#0f172acc;backdrop-filter:blur(14px);box-shadow:0 6px 24px #0005}
    .mode-toggle button{border:0;border-radius:999px;background:transparent;color:#d5dfef;padding:8px 12px;font:600 12px/1 system-ui,sans-serif;cursor:pointer;white-space:nowrap}.mode-toggle button.active{background:#38bdf8;color:#062132;box-shadow:0 0 16px #38bdf855}
    .content{position:absolute;inset:0}.three-pane,.two-pane{display:none;min-width:0;min-height:0}.content.mode-3d .three-pane{display:block;position:absolute;inset:0}.content.mode-2d .two-pane{display:block;position:absolute;inset:0}.content.mode-split{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#526074}.content.mode-split .three-pane,.content.mode-split .two-pane{display:block;position:relative;overflow:hidden;background:#0a0e1a}.three-pane canvas{width:100%;height:100%;display:block;touch-action:none}.two-pane floorplan-canvas{display:block;width:100%;height:100%;overflow:auto}.mode-split .two-pane floorplan-canvas{height:100%}
    .assist-wrap{position:absolute;z-index:7;bottom:64px;left:50%;transform:translateX(-50%);width:min(540px,90%)}.assist-response{margin:0 0 8px auto;max-width:92%;max-height:112px;overflow:auto;padding:11px 14px;border:1px solid #ffffff2b;border-radius:16px;background:#101827e8;color:#eef5ff;backdrop-filter:blur(16px);box-shadow:0 8px 30px #0007;font-size:13px}.assist-bar{display:flex;align-items:center;gap:9px;padding:6px 8px 6px 14px;border:1px solid #ffffff35;border-radius:999px;background:#101827dd;backdrop-filter:blur(16px);box-shadow:0 8px 32px #0008}.assist-bar .sparkle{font-size:19px}.assist-bar input{min-width:0;flex:1;border:0;outline:0;background:transparent;color:#fff;font:14px system-ui,sans-serif}.assist-bar input::placeholder{color:#aab6c8}.assist-bar button{width:34px;height:34px;border:0;border-radius:50%;background:#38bdf8;color:#062132;font-size:20px;line-height:1;cursor:pointer}.assist-bar button:disabled{opacity:.55;cursor:wait}
    .error-overlay{position:absolute;inset:0;z-index:8;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;box-sizing:border-box;background:#0a0e1aee}
    @media(max-width:620px){.mode-toggle button{padding:8px 8px;font-size:11px}.content.mode-split{grid-template-columns:1fr;grid-template-rows:1fr 1fr}.assist-wrap{bottom:54px}.assist-bar input{font-size:13px}}
    @media(max-width:480px){:host{height:min(72vh,520px);min-height:380px}.scenes{top:auto;bottom:8px;transform:translateX(-50%)}.scenes button{padding:7px 10px}.sheet{padding:18px 16px max(18px,env(safe-area-inset-bottom))}}
  `;
  setConfig(t) {
    if (!t) throw new Error("Invalid configuration");
    this.config = t, this.mountWorld();
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => s0), document.createElement("house-control-card-editor");
  }
  static getStubConfig() {
    return { type: "custom:house-control-card", plan: _i };
  }
  getCardSize() {
    return 6;
  }
  switchMode(t) {
    if (this.activeMode === t) return;
    const e = this.activeMode;
    this.activeMode = t, this.activeSheet = void 0, this.requestUpdate("activeMode", e);
  }
  onFrontPlanChanged = (t) => {
    const n = t.detail?.plan ?? t.detail;
    n?.rooms && (this.config = { ...this.config ?? { type: "custom:house-control-card" }, plan: n }, this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: !0, composed: !0 })), this.mountWorld());
  };
  addRoomFromPrompt(t) {
    if (!/\b(add|create|draw|build)\b.*\b(room|balcony|extension|space)\b|\bbalcony\b|\bexpand\s+(?:the\s+)?living room\b/i.test(t)) return;
    const n = this.config?.plan ?? _i, s = t.match(/(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)/i), r = s ? Number(s[1]) : 3, o = s ? Number(s[2]) : 3, a = t.toLowerCase(), l = a.includes("balcony") ? "Balcony" : a.includes("living room") ? "Living Room Extension" : a.includes("bedroom") ? "Bedroom Extension" : "New Room", h = l.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""), u = new Set(n.rooms.map((b) => b.id));
    let c = h, f = 2;
    for (; u.has(c); ) c = `${h}_${f++}`;
    const d = n.rooms.length ? Math.max(...n.rooms.map((b) => b.x + b.width)) : 0, g = n.rooms.length ? Math.min(...n.rooms.map((b) => b.y)) : 0, x = n.rooms.find((b) => `${b.name ?? ""} ${b.id}`.toLowerCase().includes("living"));
    let m = d, p = g;
    l === "Living Room Extension" && x ? (m = x.x, p = x.y + x.length) : l === "Balcony" && x && (m = x.x - r, p = x.y + Math.max(0, (x.length - o) / 2));
    const E = { ...n, rooms: [...n.rooms, { id: c, name: l, x: m, y: p, width: r, length: o, floor: "oak" }] };
    return this.onFrontPlanChanged(new CustomEvent("plan-changed", { detail: { plan: E } })), `Added ${l} (${r} × ${o} m) to the floor plan.`;
  }
  onPromptSubmit = async (t) => {
    t.preventDefault();
    const n = t.currentTarget.querySelector('input[name="query"]'), s = n.value.trim();
    if (!s) return;
    const r = this.addRoomFromPrompt(s);
    this.assistantMessage = r ?? "Sending your request to Home Assistant Assist…", this.promptBusy = !0, n.value = "", this.requestUpdate();
    try {
      if (!this.hass?.callService) throw new Error("Home Assistant is not connected to this card.");
      const a = await this.hass.callService("conversation", "process", { text: s }), l = a?.response?.speech?.plain?.speech ?? a?.speech?.plain?.speech ?? a?.response?.text ?? a?.text;
      this.assistantMessage = [r, l].filter(Boolean).join(" ") || "Request sent to Home Assistant Assist.";
    } catch (o) {
      const a = o instanceof Error ? o.message : String(o);
      this.assistantMessage = [r, `Assist could not respond: ${a}`].filter(Boolean).join(" ");
    } finally {
      this.promptBusy = !1, this.requestUpdate();
    }
  };
  closeSheet = (t) => {
    t && (t.preventDefault(), t.stopPropagation()), this.activeSheet = void 0, this.requestUpdate();
  };
  applyScene = (t) => {
    this.bridge?.applyScene(t), this.world?.requestRender(90), this.requestUpdate();
  };
  setLightPower = (t, e) => {
    this.bridge?.setLightPower(t, e), this.world?.requestRender(60), this.requestUpdate();
  };
  changeBrightness = (t, e) => {
    this.bridge?.setBrightness(t, e), this.world?.requestRender(60), this.requestUpdate();
  };
  changeKelvin = (t, e) => {
    this.bridge?.setKelvin(t, e), this.world?.requestRender(60), this.requestUpdate();
  };
  changeColor = (t, e) => {
    this.bridge?.setLightColor(t, e), this.world?.requestRender(60), this.requestUpdate();
  };
  setClimatePower = (t, e) => {
    this.bridge?.setClimatePower(t, e), this.world?.requestRender(60), this.requestUpdate();
  };
  changeTemperature = (t, e) => {
    this.bridge?.setTemperature(t, e), this.world?.requestRender(60), this.requestUpdate();
  };
  changeClimateMode = (t, e) => {
    this.bridge?.setClimateMode(t, e), this.world?.requestRender(60), this.requestUpdate();
  };
  changeFanMode = (t, e) => {
    this.bridge?.setFanMode(t, e), this.world?.requestRender(60), this.requestUpdate();
  };
  render() {
    const t = this.config?.plan ?? _i, e = this.activeSheet, n = e?.kind === "light" ? this.world?.lighting.units.find((d) => d.config.id === e.id) : void 0, s = e?.kind === "climate" ? this.world?.acs.units.find((d) => d.config.id === e.id) : void 0, r = e ? this.bridge?.state(e.entityId) ?? { on: !1, brightness: 1, mode: "off" } : void 0, o = e?.kind === "climate" ? this.hass?.states?.[e.entityId]?.attributes : void 0, a = Math.round((r?.brightness ?? 1) * 100), l = r?.target ?? (Number(o?.temperature) || 22), h = r?.current ?? (Number(o?.current_temperature) || 24), u = r?.kelvin ?? (Number(this.hass?.states?.[e?.entityId ?? ""]?.attributes?.color_temp_kelvin) || 4e3), c = e ? t.rooms.find((d) => d.id === (n?.config.room ?? s?.config.room))?.name ?? n?.config.room ?? s?.config.room : "", f = ["#ff5a4f", "#ff9a3c", "#ffd84a", "#5fe08a", "#42d6e8", "#4f8dff", "#8b5cff", "#ff5fc4"];
    return Rt`<div class="stage">
      <div class=${`content mode-${this.activeMode}`}>
        <div class="three-pane"><canvas id="three-stage"></canvas></div>
        <div class="two-pane"><floorplan-canvas .plan=${t} @plan-changed=${this.onFrontPlanChanged}></floorplan-canvas></div>
      </div>
      <nav class="mode-toggle" aria-label="View mode">
        <button class=${this.activeMode === "3d" ? "active" : ""} @click=${() => this.switchMode("3d")}>🏠 3D Twin</button>
        <button class=${this.activeMode === "2d" ? "active" : ""} @click=${() => this.switchMode("2d")}>📐 2D Sketcher</button>
        <button class=${this.activeMode === "split" ? "active" : ""} @click=${() => this.switchMode("split")}>◫ Split View</button>
      </nav>
      ${this.renderError ? Rt`<div class="error-overlay"><div><strong>WebGL Initialization Issue</strong><p>${this.renderError}</p><button class="retry-btn" @click=${() => this.mountWorld()}>Retry 3D Stage</button></div></div>` : ""}
      <form class="assist-wrap" @submit=${this.onPromptSubmit}>
        ${this.assistantMessage ? Rt`<div class="assist-response" role="status">${this.assistantMessage}</div>` : ""}
        <label class="assist-bar"><span class="sparkle" aria-hidden="true">✨</span><input type="text" name="query" autocomplete="off" placeholder="Ask AI... (e.g. 'Make bedroom cozy', 'Turn off all ACs', 'Add a 4x3 balcony')" ?disabled=${this.promptBusy}><button type="submit" aria-label="Send prompt" ?disabled=${this.promptBusy}>${this.promptBusy ? "…" : "➔"}</button></label>
      </form>
      ${t.scenes?.length ? Rt`<nav class="scenes" aria-label="Lighting scenes">${t.scenes.map((d) => Rt`<button @click=${() => this.applyScene(d)}>${d.name}</button>`)}</nav>` : ""}
      ${this.hoveredFixture ? Rt`<div class="tooltip" style=${`left:${Math.min(this.hoveredFixture.x, (this.clientWidth || 400) - 220)}px;top:${Math.min(this.hoveredFixture.y, 80)}px`}><strong>${this.hoveredFixture.room} · ${this.hoveredFixture.name}</strong>${this.hoveredFixture.stateText}</div>` : ""}
      ${e ? Rt`<div class="veil" @click=${this.closeSheet}><section class="sheet" role="dialog" aria-modal="true" @click=${(d) => d.stopPropagation()}>
        <header class="sheet-head"><div><h3>${n?.config.name ?? s?.config.name}</h3><div class="subtle">${c} · ${e.entityId}</div></div><button class="close" aria-label="Close" @click=${this.closeSheet}>×</button></header>
        ${n ? Rt`<button class="power ${r?.on ? "on" : ""}" @click=${() => this.setLightPower(e.entityId, !r?.on)}>${r?.on ? "● On" : "○ Off"}</button>
          <div class="control"><label>Brightness <span>${a}%</span></label><input aria-label="Brightness" type="range" min="0" max="100" .value=${String(a)} @input=${(d) => this.changeBrightness(e.entityId, Number(d.target.value))}></div>
          ${n.config.capabilities.includes("temp") ? Rt`<div class="control"><label>Color temperature <span>${Math.round(u)} K</span></label><input aria-label="Color temperature" type="range" min="2200" max="6500" step="100" .value=${String(u)} @input=${(d) => this.changeKelvin(e.entityId, Number(d.target.value))}><div class="hint">2200 K · Candle　　4000 K · Neutral　　6500 K · Daylight</div></div>` : ""}
          ${n.config.capabilities.includes("color") ? Rt`<div class="control"><label>Color</label><div class="swatches">${f.map((d) => Rt`<button style=${`background:${d}`} aria-label=${d} @click=${() => this.changeColor(e.entityId, d)}></button>`)}</div></div>` : ""}` : ""}
        ${s ? Rt`<button class="power ${r?.on ? "on" : ""}" @click=${() => this.setClimatePower(e.entityId, !r?.on)}>${r?.on ? "● On" : "○ Off"}</button>
          <div class="climate-meta">Current temperature · ${h}°</div><div class="step"><button aria-label="Decrease target temperature" @click=${() => this.changeTemperature(e.entityId, Number(l) - 1)}>−</button><output>${Number(l).toFixed(1)}°</output><button aria-label="Increase target temperature" @click=${() => this.changeTemperature(e.entityId, Number(l) + 1)}>+</button></div>
          <div class="control"><label>HVAC mode</label><div class="mode">${["cool", "heat", "fan", "dry", "auto", "off"].map((d) => Rt`<button class=${r?.mode === d ? "selected" : ""} @click=${() => this.changeClimateMode(e.entityId, d)}>${d[0].toUpperCase() + d.slice(1)}</button>`)}</div></div>
          <div class="control"><label>Fan speed</label><div class="fan">${["auto", "low", "medium", "high", "turbo"].map((d) => Rt`<button class=${r?.fan === d ? "selected" : ""} @click=${() => this.changeFanMode(e.entityId, d)}>${d}</button>`)}</div></div>` : ""}
      </section></div>` : ""}
    </div>`;
  }
  firstUpdated() {
    const t = this.shadowRoot.querySelector("#three-stage");
    this.canvas = t, this.mountWorld(), t.addEventListener("pointerdown", this.onPointerDown), t.addEventListener("pointermove", this.onPointerMove), t.addEventListener("pointerup", this.onPointerUp), t.addEventListener("pointercancel", this.onPointerUp);
  }
  mountWorld() {
    if (this.canvas)
      try {
        this.world?.dispose();
        const t = this.config?.plan ?? _i;
        this.world = kg(this.canvas, Yi(t), { entities: this.config?.entities }), this.cameraTarget.set((Yi(t).bounds.minX + Yi(t).bounds.maxX) / 2, 1, (Yi(t).bounds.minZ + Yi(t).bounds.maxZ) / 2), this.bridge = new t0(this.world.lighting, this.world.acs, this.config?.entities, () => {
          this.world?.requestRender(30), this.requestUpdate();
        }), this.hass && this.bridge.setHass(this.hass), this.renderError = void 0, this.world.requestRender(10);
      } catch (t) {
        console.error("HouseControl: Error initializing 3D stage", t), this.renderError = t instanceof Error ? t.message : String(t), this.requestUpdate();
      }
  }
  updated(t) {
    super.updated(t), t.has("hass") && this.hass && this.bridge?.setHass(this.hass), t.has("activeMode") && (this.world?.resize(), this.world?.requestRender(4));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.canvas?.removeEventListener("pointerdown", this.onPointerDown), this.canvas?.removeEventListener("pointermove", this.onPointerMove), this.canvas?.removeEventListener("pointerup", this.onPointerUp), this.canvas?.removeEventListener("pointercancel", this.onPointerUp), this.canvas = void 0, this.bridge = void 0, this.world?.dispose(), this.world = void 0;
  }
}
customElements.get("house-control-card") || customElements.define("house-control-card", i0);
class Rc extends Yn {
  static properties = { hass: { attribute: !1 }, _config: { state: !0 }, tab: { state: !0 }, selected: { state: !0 } };
  _config = { type: "custom:house-control-card", plan: _i };
  tab = "plan";
  selected;
  static styles = Po`
    :host{display:block;font:14px/1.45 var(--primary-font-family,Arial,sans-serif);color:var(--primary-text-color,#222)}
    .wrap{display:grid;gap:10px}.tabs{display:flex;gap:5px;border-bottom:1px solid var(--divider-color,#bbb);overflow:auto}.tabs button{white-space:nowrap;border:0;border-bottom:3px solid transparent;background:none;color:inherit;padding:10px 12px;cursor:pointer;font:inherit}.tabs button.active{border-color:#4287ef;color:var(--primary-color,#4287ef);font-weight:600}.layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(220px,280px);gap:10px;align-items:start}.section,.inspector{border:1px solid var(--divider-color,#bbb);border-radius:8px;padding:12px;background:var(--card-background-color,#fff)}.inspector{display:grid;gap:10px;max-height:500px;overflow:auto}.inspector h3{margin:0}.hint,small{opacity:.72;font-size:12px}label{display:grid;gap:4px;margin:6px 0}input,select,textarea,button{box-sizing:border-box;font:inherit;color:inherit;background:var(--card-background-color,#fff);border:1px solid var(--divider-color,#bbb);border-radius:6px;padding:8px;min-width:0}input,select{width:100%}textarea{width:100%;min-height:350px;font-family:monospace;white-space:pre}.actions{display:flex;gap:7px;flex-wrap:wrap}button{cursor:pointer}.danger{color:#b33}.empty{font-size:13px;opacity:.7}.entity-list{display:grid;gap:10px}.entity{display:grid;grid-template-columns:minmax(120px,1fr) minmax(180px,2fr);align-items:center;gap:12px;border-bottom:1px solid var(--divider-color,#ddd);padding:5px 0}.entity select{max-width:420px}.yaml-help{font-size:12px;opacity:.72}
    @media(max-width:760px){.layout{grid-template-columns:1fr}.inspector{max-height:none}.entity{grid-template-columns:1fr}.tabs button{padding:9px 8px}}
  `;
  setConfig(t) {
    this._config = structuredClone(t), this.requestUpdate();
  }
  plan() {
    return this._config.plan ?? _i;
  }
  commit(t) {
    this._config = t, this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: t }, bubbles: !0, composed: !0 }));
  }
  patchPlan(t) {
    this.commit({ ...this._config, plan: { ...this.plan(), ...t } });
  }
  onPlanChanged(t) {
    this.patchPlan(t.detail.plan);
  }
  entities(t) {
    return Object.keys(this.hass?.states ?? {}).filter((e) => e.startsWith(`${t}.`)).sort();
  }
  bind(t, e, n) {
    const s = { ...this._config.entities?.[t] ?? {} };
    n ? s[e] = n : delete s[e], this.commit({ ...this._config, entities: { ...this._config.entities, [t]: s } });
  }
  selectedRoom() {
    return this.selected?.kind === "room" ? this.plan().rooms[this.selected.index] : void 0;
  }
  editRoom(t) {
    if (!this.selected || this.selected.kind !== "room") return;
    const e = [...this.plan().rooms];
    e[this.selected.index] = { ...e[this.selected.index], ...t }, this.patchPlan({ rooms: e });
  }
  deleteSelected() {
    if (!this.selected) return;
    const t = this.plan();
    this.selected.kind === "room" && this.patchPlan({ rooms: t.rooms.filter((e, n) => n !== this.selected.index) }), this.selected.kind === "opening" && this.patchPlan({ openings: (t.openings ?? []).filter((e, n) => n !== this.selected.index) }), this.selected.kind === "light" && this.patchPlan({ lights: (t.lights ?? []).filter((e, n) => n !== this.selected.index) }), this.selected.kind === "ac" && this.patchPlan({ acs: (t.acs ?? []).filter((e, n) => n !== this.selected.index) }), this.selected.kind === "furniture" && this.patchPlan({ furniture: (t.furniture ?? []).filter((e, n) => n !== this.selected.index) }), this.selected = void 0;
  }
  addLight() {
    const t = this.plan(), e = (t.lights?.length ?? 0) + 1, n = t.rooms[0];
    this.patchPlan({ lights: [...t.lights ?? [], { id: `light_fixture_${e}`, name: "New Light", roomId: n?.id ?? "", x: (n?.x ?? 0) + 1, y: (n?.y ?? 0) + 1, z: 2.5, fixture: "pendant", capabilities: ["brightness", "temp"] }] });
  }
  addAc() {
    const t = this.plan(), e = (t.acs?.length ?? 0) + 1, n = t.rooms[0];
    this.patchPlan({ acs: [...t.acs ?? [], { id: `climate_ac_${e}`, name: "New AC", roomId: n?.id ?? "", wall: "north", x: 0.8, y: 2.2 }] });
  }
  updateJson(t) {
    try {
      const e = JSON.parse(t);
      e.plan ? this.commit(e) : this.commit({ ...this._config, plan: e });
    } catch {
    }
  }
  roomInspector(t) {
    return Rt`<h3>${t.name ?? t.id}</h3><label>Name<input .value=${t.name ?? t.id} @change=${(e) => this.editRoom({ name: e.target.value })}></label><label>Floor finish<select .value=${t.floor ?? "oak"} @change=${(e) => this.editRoom({ floor: e.target.value })}><option value="oak">Oak</option><option value="walnut">Walnut</option><option value="tile">Tile</option><option value="stone">Stone</option></select></label><div class="hint">Drag the room or one of its eight handles on the plan. Coordinates and dimensions snap to 0.1 m.</div><div class="actions"><button class="danger" @click=${this.deleteSelected}>Delete room</button></div>`;
  }
  inspector() {
    const t = this.plan(), e = this.selected;
    if (!e) return Rt`<h3>Inspector</h3><div class="empty">Select a room, opening, device, or furniture item on the plan. Use the toolbar to add items.</div><div class="actions"><button @click=${this.addLight}>Add light</button><button @click=${this.addAc}>Add AC</button></div>`;
    if (e.kind === "room") {
      const s = this.selectedRoom();
      return s ? this.roomInspector(s) : Rt``;
    }
    if (e.kind === "opening") {
      const s = t.openings?.[e.index];
      return s ? Rt`<h3>${s.type === "door" ? "Door" : s.type === "window" ? "Window" : "Opening"}</h3><label>Opening type<select .value=${s.type} @change=${(r) => {
        const o = [...t.openings ?? []];
        o[e.index] = { ...s, type: r.target.value }, this.patchPlan({ openings: o });
      }}><option value="door">Door</option><option value="window">Window</option><option value="open">Open passage</option></select></label><label>Height (m)<input type="number" step="0.1" .value=${String(s.head - s.sill)} @change=${(r) => {
        const o = [...t.openings ?? []];
        o[e.index] = { ...s, head: s.sill + Number(r.target.value) }, this.patchPlan({ openings: o });
      }}></label><div class="actions"><button class="danger" @click=${this.deleteSelected}>Delete opening</button></div>` : Rt``;
    }
    if (e.kind === "light") {
      const s = t.lights?.[e.index];
      return s ? Rt`<h3>${s.name ?? "Light fixture"}</h3><label>Fixture type<select .value=${s.fixture ?? "pendant"} @change=${(r) => {
        const o = [...t.lights ?? []];
        o[e.index] = { ...s, fixture: r.target.value }, this.patchPlan({ lights: o });
      }}>${["ceiling", "pendant", "spots", "floor", "table", "strip"].map((r) => Rt`<option value=${r}>${r}</option>`)}</select></label><label>Height (m)<input type="number" step="0.1" .value=${String(s.z ?? 2.5)} @change=${(r) => {
        const o = [...t.lights ?? []];
        o[e.index] = { ...s, z: Number(r.target.value) }, this.patchPlan({ lights: o });
      }}></label><div class="hint">Drag the light marker to place it. Select an entity in Entity Bindings.</div><button class="danger" @click=${this.deleteSelected}>Delete light</button>` : Rt``;
    }
    if (e.kind === "ac") {
      const s = t.acs?.[e.index];
      return s ? Rt`<h3>${s.name ?? "Climate unit"}</h3><label>Wall<select .value=${s.wall} @change=${(r) => {
        const o = [...t.acs ?? []];
        o[e.index] = { ...s, wall: r.target.value }, this.patchPlan({ acs: o });
      }}>${["north", "east", "south", "west"].map((r) => Rt`<option value=${r}>${r}</option>`)}</select></label><label>Mount height (m)<input type="number" step="0.1" .value=${String(s.y)} @change=${(r) => {
        const o = [...t.acs ?? []];
        o[e.index] = { ...s, y: Number(r.target.value) }, this.patchPlan({ acs: o });
      }}></label><div class="hint">Drag the marker to snap it to its nearest room wall.</div><button class="danger" @click=${this.deleteSelected}>Delete AC</button>` : Rt``;
    }
    const n = t.furniture?.[e.index];
    return n ? Rt`<h3>${n.type}</h3><label>Furniture type<select .value=${n.type} @change=${(s) => {
      const r = [...t.furniture ?? []];
      r[e.index] = { ...n, type: s.target.value }, this.patchPlan({ furniture: r });
    }}>${["sofa", "armchair", "coffeeTable", "tv", "bed", "diningSet", "island", "kitchen", "fridge", "wardrobe", "bookshelf", "plant", "vanity", "bathtub", "toilet", "desk", "rug", "sideboard"].map((s) => Rt`<option value=${s}>${s}</option>`)}</select></label><label>Rotation<input type="number" step="15" .value=${String(n.rotation ?? n.rot ?? 0)} @change=${(s) => {
      const r = [...t.furniture ?? []];
      r[e.index] = { ...n, rotation: Number(s.target.value) }, this.patchPlan({ furniture: r });
    }}></label><button class="danger" @click=${this.deleteSelected}>Delete furniture</button>` : Rt``;
  }
  render() {
    const t = this.plan();
    return Rt`<div class="wrap"><label>Card title<input .value=${this._config.title ?? ""} @change=${(e) => this.commit({ ...this._config, title: e.target.value })}></label><nav class="tabs"><button class=${this.tab === "plan" ? "active" : ""} @click=${() => this.tab = "plan"}>📐 2D Floor Plan</button><button class=${this.tab === "entities" ? "active" : ""} @click=${() => this.tab = "entities"}>💡 Entity Bindings</button><button class=${this.tab === "json" ? "active" : ""} @click=${() => this.tab = "json"}>⚙️ YAML / JSON</button></nav>
      ${this.tab === "plan" ? Rt`<div class="layout"><section><floorplan-canvas .plan=${t} @plan-changed=${(e) => this.onPlanChanged(e)} @selection-changed=${(e) => this.selected = e.detail}></floorplan-canvas></section><aside class="inspector">${this.inspector()}</aside></div>` : ""}
      ${this.tab === "entities" ? Rt`<section class="section"><h3>Home Assistant entity bindings</h3><p class="hint">Choose a matching HA device or leave it unassigned to use the local simulator.</p><div class="entity-list">${(t.lights ?? []).map((e) => Rt`<div class="entity"><span>💡 ${e.name ?? e.id} <small>${e.id}</small></span><select .value=${this._config.entities?.lights?.[e.id] ?? (e.id.startsWith("light.") ? e.id : "")} @change=${(n) => this.bind("lights", e.id, n.target.value)}><option value="">Simulation only</option>${this.entities("light").map((n) => Rt`<option value=${n}>${n}</option>`)}</select></div>`)}${(t.acs ?? []).map((e) => Rt`<div class="entity"><span>❄️ ${e.name ?? e.id} <small>${e.id}</small></span><select .value=${this._config.entities?.climates?.[e.id] ?? (e.id.startsWith("climate.") ? e.id : "")} @change=${(n) => this.bind("climates", e.id, n.target.value)}><option value="">Simulation only</option>${this.entities("climate").map((n) => Rt`<option value=${n}>${n}</option>`)}</select></div>`)}</div><div class="actions"><button @click=${this.addLight}>Add light fixture</button><button @click=${this.addAc}>Add AC unit</button></div></section>` : ""}
      ${this.tab === "json" ? Rt`<section class="section"><h3>Card configuration JSON</h3><p class="yaml-help">Edit the full declarative card config, including plan and entity bindings. Invalid JSON is not applied until corrected.</p><textarea spellcheck="false" .value=${JSON.stringify(this._config, null, 2)} @change=${(e) => this.updateJson(e.target.value)}></textarea></section>` : ""}
    </div>`;
  }
}
customElements.get("house-control-card-editor") || customElements.define("house-control-card-editor", Rc);
const s0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HouseControlCardEditor: Rc
}, Symbol.toStringTag, { value: "Module" }));
export {
  a0 as FURNITURE_TYPES,
  i0 as HouseControlCard,
  Lg as buildFurniture,
  Pg as buildHouse,
  Og as buildScene,
  kg as createWorld,
  l0 as footprint,
  Bg as frameCamera,
  Yi as normalizePlan
};
