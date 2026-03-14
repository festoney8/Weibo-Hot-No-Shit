// ==UserScript==
// @name         微博热搜净化 Weibo-Hot-No-Shit
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @author       festoney8
// @description  净化微博热搜边栏，去除闲杂内容，支持关键词过滤
// @license      MIT
// @icon         https://weibo.com/favicon.ico
// @homepage     https://github.com/festoney8/Weibo-Hot-No-Shit
// @supportURL   https://github.com/festoney8/Weibo-Hot-No-Shit
// @downloadURL  https://raw.githubusercontent.com/festoney8/weibo-hot-no-shit/release/weibo-hot-no-shit.github.user.js
// @updateURL    https://raw.githubusercontent.com/festoney8/weibo-hot-no-shit/release/weibo-hot-no-shit.github.user.js
// @match        *://weibo.com/*
// @match        *://s.weibo.com/*
// @exclude      *://weibo.com/ttarticle/*
// @exclude      *://weibo.com/tv
// @exclude      *://weibo.com/tv/*
// @exclude      *://weibo.com/aj/*
// @exclude      *://s.weibo.com/top/*
// @exclude      *://weibo.com/hot/mine*
// @exclude      *://weibo.com/hot/search*
// @exclude      *://weibo.com/hot/entertainment*
// @exclude      *://weibo.com/hot/life*
// @exclude      *://weibo.com/hot/social*
// @require      https://registry.npmmirror.com/vue/3.5.30/files/dist/vue.global.prod.js
// @connect      weibo.com
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_getValue
// @grant        GM_removeValueChangeListener
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

(function (vue) {
  'use strict';

  const d=new Set;const t = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):(document.head||document.documentElement).appendChild(document.createElement("style")).append(t);})(e));};

  t(" .setting-menu[data-v-3519dc98]{display:grid;grid-template-columns:128px 1fr;gap:6px;min-width:620px}.setting-menu__tabs[data-v-3519dc98]{display:flex;flex-direction:column;gap:6px;padding-right:8px;border-right:1px solid #eceef2}.setting-menu__tab[data-v-3519dc98]{border:1px solid transparent;border-radius:4px;background:transparent;color:#5c6570;font-size:13px;text-align:left;padding:8px 10px;cursor:pointer}.setting-menu__tab.is-active[data-v-3519dc98]{background:#f6f8fc;border-color:#d9dee7;color:#1f2d3d;font-weight:600}.setting-menu__editor[data-v-3519dc98]{min-width:0;padding:10px;display:flex;flex-direction:column}.setting-menu__meta[data-v-3519dc98]{align-items:baseline;margin-bottom:8px}.setting-menu__title[data-v-3519dc98]{margin:0;font-size:14px;color:#1f2d3d}.setting-menu__textarea[data-v-3519dc98]{flex:1;resize:none;border:1px solid #d7dce5;border-radius:4px;padding:8px;line-height:1.5;font-size:14px;color:#1f2d3d;min-height:280px;outline:none}.setting-menu__textarea[data-v-3519dc98]:focus{border-color:#8aa4ff;box-shadow:0 0 0 2px #637dff26}html[data-theme=light] .hot-sidebar[data-v-9febae30],html:not([data-theme]) .hot-sidebar[data-v-9febae30]{--hot-color-bg: #fff;--hot-color-border: #eceef2;--hot-color-title: #1f2d3d;--hot-color-text: #1f2d3d;--hot-color-desc: #8b97a6;--hot-color-muted: #9aa4b2;--hot-color-icon: #939393;--hot-color-tab-bg: #f3f4f6;--hot-color-tab-active-bg: #fff;--hot-color-tab-text: #8c98a7;--hot-color-tab-active-text: #1f2d3d;--hot-color-rank: #ff8200;--hot-color-rank-top3: #f26d5f;--hot-color-scrollbar-thumb: rgba(148, 163, 184, .3)}html[data-theme=dark] .hot-sidebar[data-v-9febae30]{--hot-color-bg: #111318;--hot-color-border: #222833;--hot-color-title: #d2d6dd;--hot-color-text: #bfbfbf;--hot-color-desc: #aaaaaa;--hot-color-muted: #7d838d;--hot-color-icon: #7a808a;--hot-color-tab-bg: #0a0d12;--hot-color-tab-active-bg: #161b23;--hot-color-tab-text: #858b95;--hot-color-tab-active-text: #d5dae2;--hot-color-rank: #ff9800;--hot-color-rank-top3: #ff6c5f;--hot-color-scrollbar-thumb: rgba(126, 132, 143, .38)}body:has([state=noside]) aside[data-v-9febae30]{display:none}aside[data-v-9febae30]{position:fixed;top:68px;left:calc(50vw + 274px)}.hot-sidebar[data-v-9febae30]{width:290px;height:calc(100vh - 85px);display:flex;flex-direction:column;background:var(--hot-color-bg);border:1px solid var(--hot-color-border);border-radius:4px;overflow:hidden}.hot-sidebar__header[data-v-9febae30]{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 10px}.hot-sidebar__title[data-v-9febae30]{margin:0;font-size:16px;color:var(--hot-color-title);font-weight:500}.hot-sidebar__title-group[data-v-9febae30]{display:inline-flex;align-items:center}.hot-sidebar__setting[data-v-9febae30]{display:inline-flex;margin-left:6px;align-items:center;justify-content:center;width:24px;height:24px;padding:4px;border:none;background:transparent;color:var(--hot-color-icon);opacity:0;pointer-events:none;transition:opacity .16s ease;cursor:pointer}.hot-sidebar__header:hover .hot-sidebar__setting[data-v-9febae30]{opacity:1;pointer-events:auto}.hot-sidebar__setting-icon[data-v-9febae30]{width:24px;height:24px}.hot-sidebar__refresh[data-v-9febae30]{border:none;background:transparent;color:var(--hot-color-muted);padding:0;display:inline-flex;align-items:center;gap:4px;font-size:14px;cursor:pointer}.hot-sidebar__refresh[data-v-9febae30]:disabled{cursor:default;opacity:.8}.hot-sidebar__refresh-icon[data-v-9febae30]{width:14px;height:14px;font-size:14px;animation:spin-click-9febae30 .45s linear;color:var(--hot-color-icon)}.hot-sidebar__refresh-icon.is-spinning[data-v-9febae30]{animation:spin-9febae30 .9s linear infinite}@keyframes spin-click-9febae30{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.hot-sidebar__tabs[data-v-9febae30]{margin:0 16px;background:var(--hot-color-tab-bg);border-radius:4px;padding:3px;display:grid;grid-template-columns:1fr 1fr;gap:4px}.hot-sidebar__tab[data-v-9febae30]{border:none;background:transparent;color:var(--hot-color-tab-text);border-radius:4px;font-size:13px;padding:2px 0;cursor:pointer}.hot-sidebar__tab.is-active[data-v-9febae30]{background:var(--hot-color-tab-active-bg);color:var(--hot-color-tab-active-text)}.hot-sidebar__list-wrap[data-v-9febae30]{margin-top:8px;padding:0 10px 12px;flex:1;min-height:0;overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--hot-color-scrollbar-thumb) transparent}.hot-sidebar__list-wrap[data-v-9febae30]::-webkit-scrollbar{width:3px}.hot-sidebar__list-wrap[data-v-9febae30]::-webkit-scrollbar-track{background:transparent}.hot-sidebar__list-wrap[data-v-9febae30]::-webkit-scrollbar-thumb{background:var(--hot-color-scrollbar-thumb);border-radius:999px}.hot-list[data-v-9febae30]{list-style:none;margin:0;padding:0}.hot-list__end[data-v-9febae30]{margin:6px 0;text-align:center;font-size:12px;color:var(--hot-color-muted);letter-spacing:.4px;-webkit-user-select:none;user-select:none}.hot-list__item[data-v-9febae30]{display:flex;align-items:center;height:40px}.hot-list__rank[data-v-9febae30]{display:inline-flex;justify-content:center;line-height:1.2;width:24px;flex:0 0 24px;font-size:18px;color:var(--hot-color-rank);font-variant-numeric:tabular-nums;font-family:var(--vc-font-family)}.hot-list__rank.is-top3[data-v-9febae30]{font-weight:700;font-style:italic;color:var(--hot-color-rank-top3)}.hot-list__link[data-v-9febae30]{display:flex;align-items:center;flex:1;min-width:0;text-decoration:none;height:2em}.hot-list__link:hover .hot-list__word[data-v-9febae30],.hot-list__link:hover .hot-list__desc[data-v-9febae30]{color:var(--hot-color-rank)}.hot-list__word[data-v-9febae30]{display:inline-block;flex:1;line-height:1.2;margin-left:6px;min-width:0;font-size:14px;color:var(--hot-color-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.hot-list__desc[data-v-9febae30]{font-size:13px;font-weight:600;margin-left:8px;line-height:1.2;color:var(--hot-color-desc);white-space:nowrap}.setting-menu-dialog[data-v-9febae30]{border:none;border-radius:0;padding:0;margin:0;min-width:0;max-width:none;background:transparent;overflow:visible}.setting-menu-dialog[data-v-9febae30]::backdrop{background:transparent}.setting-menu-panel[data-v-9febae30]{margin:0;border-radius:10px;padding:16px;min-width:640px;background:#fff;box-shadow:0 16px 40px #0f172a33}.setting-menu-dialog__close[data-v-9febae30]{position:absolute;top:8px;right:10px;width:32px;height:32px;border:none;border-radius:8px;background:transparent;color:#7f8998;font-size:28px;line-height:1;cursor:pointer}.setting-menu-dialog__close[data-v-9febae30]:hover{background:#f3f4f6}@keyframes spin-9febae30{0%{transform:rotate(0)}to{transform:rotate(360deg)}} ");

  const waitForHead = () => {
    return new Promise((resolve) => {
      if (document.head) {
        resolve();
        return;
      }
      const observer = new MutationObserver(() => {
        if (document.head) {
          observer.disconnect();
          resolve();
        }
      });
      observer.observe(document, { childList: true, subtree: true });
    });
  };
  const waitForBody = () => {
    return new Promise((resolve) => {
      if (document.body) {
        resolve();
        return;
      }
      const observer = new MutationObserver(() => {
        if (document.body) {
          observer.disconnect();
          resolve();
        }
      });
      observer.observe(document, { childList: true, subtree: true });
    });
  };
  let activePinia;
  const setActivePinia = (pinia) => activePinia = pinia;
  const piniaSymbol = (

Symbol()
  );
  function isPlainObject(o) {
    return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
  }
  var MutationType;
  (function(MutationType2) {
    MutationType2["direct"] = "direct";
    MutationType2["patchObject"] = "patch object";
    MutationType2["patchFunction"] = "patch function";
  })(MutationType || (MutationType = {}));
  function createPinia() {
    const scope = vue.effectScope(true);
    const state = scope.run(() => vue.ref({}));
    let _p = [];
    let toBeInstalled = [];
    const pinia = vue.markRaw({
      install(app) {
        setActivePinia(pinia);
        pinia._a = app;
        app.provide(piniaSymbol, pinia);
        app.config.globalProperties.$pinia = pinia;
        toBeInstalled.forEach((plugin) => _p.push(plugin));
        toBeInstalled = [];
      },
      use(plugin) {
        if (!this._a) {
          toBeInstalled.push(plugin);
        } else {
          _p.push(plugin);
        }
        return this;
      },
      _p,

_a: null,
      _e: scope,
      _s: new Map(),
      state
    });
    return pinia;
  }
  const noop$1 = () => {
  };
  function addSubscription(subscriptions, callback, detached, onCleanup = noop$1) {
    subscriptions.add(callback);
    const removeSubscription = () => {
      const isDel = subscriptions.delete(callback);
      isDel && onCleanup();
    };
    if (!detached && vue.getCurrentScope()) {
      vue.onScopeDispose(removeSubscription);
    }
    return removeSubscription;
  }
  function triggerSubscriptions(subscriptions, ...args) {
    subscriptions.forEach((callback) => {
      callback(...args);
    });
  }
  const fallbackRunWithContext = (fn) => fn();
  const ACTION_MARKER = Symbol();
  const ACTION_NAME = Symbol();
  function mergeReactiveObjects(target, patchToApply) {
    if (target instanceof Map && patchToApply instanceof Map) {
      patchToApply.forEach((value, key) => target.set(key, value));
    } else if (target instanceof Set && patchToApply instanceof Set) {
      patchToApply.forEach(target.add, target);
    }
    for (const key in patchToApply) {
      if (!patchToApply.hasOwnProperty(key))
        continue;
      const subPatch = patchToApply[key];
      const targetValue = target[key];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !vue.isRef(subPatch) && !vue.isReactive(subPatch)) {
        target[key] = mergeReactiveObjects(targetValue, subPatch);
      } else {
        target[key] = subPatch;
      }
    }
    return target;
  }
  const skipHydrateSymbol = (

Symbol()
  );
  function shouldHydrate(obj) {
    return !isPlainObject(obj) || !Object.prototype.hasOwnProperty.call(obj, skipHydrateSymbol);
  }
  const { assign } = Object;
  function isComputed(o) {
    return !!(vue.isRef(o) && o.effect);
  }
  function createOptionsStore(id, options, pinia, hot) {
    const { state, actions, getters } = options;
    const initialState = pinia.state.value[id];
    let store;
    function setup() {
      if (!initialState && true) {
        pinia.state.value[id] = state ? state() : {};
      }
      const localState = vue.toRefs(pinia.state.value[id]);
      return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
        computedGetters[name] = vue.markRaw(vue.computed(() => {
          setActivePinia(pinia);
          const store2 = pinia._s.get(id);
          return getters[name].call(store2, store2);
        }));
        return computedGetters;
      }, {}));
    }
    store = createSetupStore(id, setup, options, pinia, hot, true);
    return store;
  }
  function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
    let scope;
    const optionsForPlugin = assign({ actions: {} }, options);
    const $subscribeOptions = { deep: true };
    let isListening;
    let isSyncListening;
    let subscriptions = new Set();
    let actionSubscriptions = new Set();
    let debuggerEvents;
    const initialState = pinia.state.value[$id];
    if (!isOptionsStore && !initialState && true) {
      pinia.state.value[$id] = {};
    }
    vue.ref({});
    let activeListener;
    function $patch(partialStateOrMutator) {
      let subscriptionMutation;
      isListening = isSyncListening = false;
      if (typeof partialStateOrMutator === "function") {
        partialStateOrMutator(pinia.state.value[$id]);
        subscriptionMutation = {
          type: MutationType.patchFunction,
          storeId: $id,
          events: debuggerEvents
        };
      } else {
        mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
        subscriptionMutation = {
          type: MutationType.patchObject,
          payload: partialStateOrMutator,
          storeId: $id,
          events: debuggerEvents
        };
      }
      const myListenerId = activeListener = Symbol();
      vue.nextTick().then(() => {
        if (activeListener === myListenerId) {
          isListening = true;
        }
      });
      isSyncListening = true;
      triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
    }
    const $reset = isOptionsStore ? function $reset2() {
      const { state } = options;
      const newState = state ? state() : {};
      this.$patch(($state) => {
        assign($state, newState);
      });
    } : (
noop$1
    );
    function $dispose() {
      scope.stop();
      subscriptions.clear();
      actionSubscriptions.clear();
      pinia._s.delete($id);
    }
    const action = (fn, name = "") => {
      if (ACTION_MARKER in fn) {
        fn[ACTION_NAME] = name;
        return fn;
      }
      const wrappedAction = function() {
        setActivePinia(pinia);
        const args = Array.from(arguments);
        const afterCallbackSet = new Set();
        const onErrorCallbackSet = new Set();
        function after(callback) {
          afterCallbackSet.add(callback);
        }
        function onError(callback) {
          onErrorCallbackSet.add(callback);
        }
        triggerSubscriptions(actionSubscriptions, {
          args,
          name: wrappedAction[ACTION_NAME],
          store,
          after,
          onError
        });
        let ret;
        try {
          ret = fn.apply(this && this.$id === $id ? this : store, args);
        } catch (error) {
          triggerSubscriptions(onErrorCallbackSet, error);
          throw error;
        }
        if (ret instanceof Promise) {
          return ret.then((value) => {
            triggerSubscriptions(afterCallbackSet, value);
            return value;
          }).catch((error) => {
            triggerSubscriptions(onErrorCallbackSet, error);
            return Promise.reject(error);
          });
        }
        triggerSubscriptions(afterCallbackSet, ret);
        return ret;
      };
      wrappedAction[ACTION_MARKER] = true;
      wrappedAction[ACTION_NAME] = name;
      return wrappedAction;
    };
    const partialStore = {
      _p: pinia,
$id,
      $onAction: addSubscription.bind(null, actionSubscriptions),
      $patch,
      $reset,
      $subscribe(callback, options2 = {}) {
        const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
        const stopWatcher = scope.run(() => vue.watch(() => pinia.state.value[$id], (state) => {
          if (options2.flush === "sync" ? isSyncListening : isListening) {
            callback({
              storeId: $id,
              type: MutationType.direct,
              events: debuggerEvents
            }, state);
          }
        }, assign({}, $subscribeOptions, options2)));
        return removeSubscription;
      },
      $dispose
    };
    const store = vue.reactive(partialStore);
    pinia._s.set($id, store);
    const runWithContext = pinia._a && pinia._a.runWithContext || fallbackRunWithContext;
    const setupStore = runWithContext(() => pinia._e.run(() => (scope = vue.effectScope()).run(() => setup({ action }))));
    for (const key in setupStore) {
      const prop = setupStore[key];
      if (vue.isRef(prop) && !isComputed(prop) || vue.isReactive(prop)) {
        if (!isOptionsStore) {
          if (initialState && shouldHydrate(prop)) {
            if (vue.isRef(prop)) {
              prop.value = initialState[key];
            } else {
              mergeReactiveObjects(prop, initialState[key]);
            }
          }
          pinia.state.value[$id][key] = prop;
        }
      } else if (typeof prop === "function") {
        const actionValue = action(prop, key);
        setupStore[key] = actionValue;
        optionsForPlugin.actions[key] = prop;
      } else ;
    }
    assign(store, setupStore);
    assign(vue.toRaw(store), setupStore);
    Object.defineProperty(store, "$state", {
      get: () => pinia.state.value[$id],
      set: (state) => {
        $patch(($state) => {
          assign($state, state);
        });
      }
    });
    pinia._p.forEach((extender) => {
      {
        assign(store, scope.run(() => extender({
          store,
          app: pinia._a,
          pinia,
          options: optionsForPlugin
        })));
      }
    });
    if (initialState && isOptionsStore && options.hydrate) {
      options.hydrate(store.$state, initialState);
    }
    isListening = true;
    isSyncListening = true;
    return store;
  }
function defineStore(id, setup, setupOptions) {
    let options;
    const isSetupStore = typeof setup === "function";
    options = isSetupStore ? setupOptions : setup;
    function useStore(pinia, hot) {
      const hasContext = vue.hasInjectionContext();
      pinia =

pinia || (hasContext ? vue.inject(piniaSymbol, null) : null);
      if (pinia)
        setActivePinia(pinia);
      pinia = activePinia;
      if (!pinia._s.has(id)) {
        if (isSetupStore) {
          createSetupStore(id, setup, options, pinia);
        } else {
          createOptionsStore(id, options, pinia);
        }
      }
      const store = pinia._s.get(id);
      return store;
    }
    useStore.$id = id;
    return useStore;
  }
  function storeToRefs(store) {
    const rawStore = vue.toRaw(store);
    const refs = {};
    for (const key in rawStore) {
      const value = rawStore[key];
      if (value.effect) {
        refs[key] =
vue.computed({
          get: () => store[key],
          set(value2) {
            store[key] = value2;
          }
        });
      } else if (vue.isRef(value) || vue.isReactive(value)) {
        refs[key] =
vue.toRef(store, key);
      }
    }
    return refs;
  }
  function tryOnScopeDispose(fn, failSilently) {
    if (vue.getCurrentScope()) {
      vue.onScopeDispose(fn, failSilently);
      return true;
    }
    return false;
  }
  const localProvidedStateMap = new WeakMap();
  const injectLocal = (...args) => {
    var _getCurrentInstance;
    const key = args[0];
    const instance = (_getCurrentInstance = vue.getCurrentInstance()) === null || _getCurrentInstance === void 0 ? void 0 : _getCurrentInstance.proxy;
    const owner = instance !== null && instance !== void 0 ? instance : vue.getCurrentScope();
    if (owner == null && !vue.hasInjectionContext()) throw new Error("injectLocal must be called in setup");
    if (owner && localProvidedStateMap.has(owner) && key in localProvidedStateMap.get(owner)) return localProvidedStateMap.get(owner)[key];
    return vue.inject(...args);
  };
  const isClient = typeof window !== "undefined" && typeof document !== "undefined";
  typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
  const notNullish = (val) => val != null;
  const toString = Object.prototype.toString;
  const isObject$1 = (val) => toString.call(val) === "[object Object]";
  const noop = () => {
  };
  function toRef(...args) {
    if (args.length !== 1) return vue.toRef(...args);
    const r = args[0];
    return typeof r === "function" ? vue.readonly(vue.customRef(() => ({
      get: r,
      set: noop
    }))) : vue.ref(r);
  }
  function createFilterWrapper(filter, fn) {
    function wrapper(...args) {
      return new Promise((resolve, reject) => {
        Promise.resolve(filter(() => fn.apply(this, args), {
          fn,
          thisArg: this,
          args
        })).then(resolve).catch(reject);
      });
    }
    return wrapper;
  }
  const bypassFilter = (invoke$1) => {
    return invoke$1();
  };
  function debounceFilter(ms, options = {}) {
    let timer;
    let maxTimer;
    let lastRejector = noop;
    const _clearTimeout = (timer$1) => {
      clearTimeout(timer$1);
      lastRejector();
      lastRejector = noop;
    };
    let lastInvoker;
    const filter = (invoke$1) => {
      const duration = vue.toValue(ms);
      const maxDuration = vue.toValue(options.maxWait);
      if (timer) _clearTimeout(timer);
      if (duration <= 0 || maxDuration !== void 0 && maxDuration <= 0) {
        if (maxTimer) {
          _clearTimeout(maxTimer);
          maxTimer = void 0;
        }
        return Promise.resolve(invoke$1());
      }
      return new Promise((resolve, reject) => {
        lastRejector = options.rejectOnCancel ? reject : resolve;
        lastInvoker = invoke$1;
        if (maxDuration && !maxTimer) maxTimer = setTimeout(() => {
          if (timer) _clearTimeout(timer);
          maxTimer = void 0;
          resolve(lastInvoker());
        }, maxDuration);
        timer = setTimeout(() => {
          if (maxTimer) _clearTimeout(maxTimer);
          maxTimer = void 0;
          resolve(invoke$1());
        }, duration);
      });
    };
    return filter;
  }
  function throttleFilter(...args) {
    let lastExec = 0;
    let timer;
    let isLeading = true;
    let lastRejector = noop;
    let lastValue;
    let ms;
    let trailing;
    let leading;
    let rejectOnCancel;
    if (!vue.isRef(args[0]) && typeof args[0] === "object") ({ delay: ms, trailing = true, leading = true, rejectOnCancel = false } = args[0]);
    else [ms, trailing = true, leading = true, rejectOnCancel = false] = args;
    const clear = () => {
      if (timer) {
        clearTimeout(timer);
        timer = void 0;
        lastRejector();
        lastRejector = noop;
      }
    };
    const filter = (_invoke) => {
      const duration = vue.toValue(ms);
      const elapsed = Date.now() - lastExec;
      const invoke$1 = () => {
        return lastValue = _invoke();
      };
      clear();
      if (duration <= 0) {
        lastExec = Date.now();
        return invoke$1();
      }
      if (elapsed > duration) {
        lastExec = Date.now();
        if (leading || !isLeading) invoke$1();
      } else if (trailing) lastValue = new Promise((resolve, reject) => {
        lastRejector = rejectOnCancel ? reject : resolve;
        timer = setTimeout(() => {
          lastExec = Date.now();
          isLeading = true;
          resolve(invoke$1());
          clear();
        }, Math.max(0, duration - elapsed));
      });
      if (!leading && !timer) timer = setTimeout(() => isLeading = true, duration);
      isLeading = false;
      return lastValue;
    };
    return filter;
  }
  function pausableFilter(extendFilter = bypassFilter, options = {}) {
    const { initialState = "active" } = options;
    const isActive = toRef(initialState === "active");
    function pause() {
      isActive.value = false;
    }
    function resume() {
      isActive.value = true;
    }
    const eventFilter = (...args) => {
      if (isActive.value) extendFilter(...args);
    };
    return {
      isActive: vue.readonly(isActive),
      pause,
      resume,
      eventFilter
    };
  }
  function pxValue(px) {
    return px.endsWith("rem") ? Number.parseFloat(px) * 16 : Number.parseFloat(px);
  }
  function toArray(value) {
    return Array.isArray(value) ? value : [value];
  }
  function getLifeCycleTarget(target) {
    return vue.getCurrentInstance();
  }
function useDebounceFn(fn, ms = 200, options = {}) {
    return createFilterWrapper(debounceFilter(ms, options), fn);
  }
function useThrottleFn(fn, ms = 200, trailing = false, leading = true, rejectOnCancel = false) {
    return createFilterWrapper(throttleFilter(ms, trailing, leading, rejectOnCancel), fn);
  }
  function watchWithFilter(source, cb, options = {}) {
    const { eventFilter = bypassFilter, ...watchOptions } = options;
    return vue.watch(source, createFilterWrapper(eventFilter, cb), watchOptions);
  }
  function watchPausable(source, cb, options = {}) {
    const { eventFilter: filter, initialState = "active", ...watchOptions } = options;
    const { eventFilter, pause, resume, isActive } = pausableFilter(filter, { initialState });
    return {
      stop: watchWithFilter(source, cb, {
        ...watchOptions,
        eventFilter
      }),
      pause,
      resume,
      isActive
    };
  }
  function toRefs(objectRef, options = {}) {
    if (!vue.isRef(objectRef)) return vue.toRefs(objectRef);
    const result = Array.isArray(objectRef.value) ? Array.from({ length: objectRef.value.length }) : {};
    for (const key in objectRef.value) result[key] = vue.customRef(() => ({
      get() {
        return objectRef.value[key];
      },
      set(v) {
        var _toValue;
        if ((_toValue = vue.toValue(options.replaceRef)) !== null && _toValue !== void 0 ? _toValue : true) if (Array.isArray(objectRef.value)) {
          const copy = [...objectRef.value];
          copy[key] = v;
          objectRef.value = copy;
        } else {
          const newObject = {
            ...objectRef.value,
            [key]: v
          };
          Object.setPrototypeOf(newObject, Object.getPrototypeOf(objectRef.value));
          objectRef.value = newObject;
        }
        else objectRef.value[key] = v;
      }
    }));
    return result;
  }
  function tryOnMounted(fn, sync = true, target) {
    if (getLifeCycleTarget()) vue.onMounted(fn, target);
    else if (sync) fn();
    else vue.nextTick(fn);
  }
  function watchDebounced(source, cb, options = {}) {
    const { debounce = 0, maxWait = void 0, ...watchOptions } = options;
    return watchWithFilter(source, cb, {
      ...watchOptions,
      eventFilter: debounceFilter(debounce, { maxWait })
    });
  }
  function watchImmediate(source, cb, options) {
    return vue.watch(source, cb, {
      ...options,
      immediate: true
    });
  }
  const defaultWindow = isClient ? window : void 0;
  function unrefElement(elRef) {
    var _$el;
    const plain = vue.toValue(elRef);
    return (_$el = plain === null || plain === void 0 ? void 0 : plain.$el) !== null && _$el !== void 0 ? _$el : plain;
  }
  function useEventListener(...args) {
    const register = (el, event, listener, options) => {
      el.addEventListener(event, listener, options);
      return () => el.removeEventListener(event, listener, options);
    };
    const firstParamTargets = vue.computed(() => {
      const test = toArray(vue.toValue(args[0])).filter((e) => e != null);
      return test.every((e) => typeof e !== "string") ? test : void 0;
    });
    return watchImmediate(() => {
      var _firstParamTargets$va, _firstParamTargets$va2;
      return [
        (_firstParamTargets$va = (_firstParamTargets$va2 = firstParamTargets.value) === null || _firstParamTargets$va2 === void 0 ? void 0 : _firstParamTargets$va2.map((e) => unrefElement(e))) !== null && _firstParamTargets$va !== void 0 ? _firstParamTargets$va : [defaultWindow].filter((e) => e != null),
        toArray(vue.toValue(firstParamTargets.value ? args[1] : args[0])),
        toArray(vue.unref(firstParamTargets.value ? args[2] : args[1])),
        vue.toValue(firstParamTargets.value ? args[3] : args[2])
      ];
    }, ([raw_targets, raw_events, raw_listeners, raw_options], _, onCleanup) => {
      if (!(raw_targets === null || raw_targets === void 0 ? void 0 : raw_targets.length) || !(raw_events === null || raw_events === void 0 ? void 0 : raw_events.length) || !(raw_listeners === null || raw_listeners === void 0 ? void 0 : raw_listeners.length)) return;
      const optionsClone = isObject$1(raw_options) ? { ...raw_options } : raw_options;
      const cleanups = raw_targets.flatMap((el) => raw_events.flatMap((event) => raw_listeners.map((listener) => register(el, event, listener, optionsClone))));
      onCleanup(() => {
        cleanups.forEach((fn) => fn());
      });
    }, { flush: "post" });
  }
function useMounted() {
    const isMounted = vue.shallowRef(false);
    const instance = vue.getCurrentInstance();
    if (instance) vue.onMounted(() => {
      isMounted.value = true;
    }, instance);
    return isMounted;
  }
function useSupported(callback) {
    const isMounted = useMounted();
    return vue.computed(() => {
      isMounted.value;
      return Boolean(callback());
    });
  }
  function useMutationObserver(target, callback, options = {}) {
    const { window: window$1 = defaultWindow, ...mutationOptions } = options;
    let observer;
    const isSupported = useSupported(() => window$1 && "MutationObserver" in window$1);
    const cleanup = () => {
      if (observer) {
        observer.disconnect();
        observer = void 0;
      }
    };
    const stopWatch = vue.watch(vue.computed(() => {
      const items = toArray(vue.toValue(target)).map(unrefElement).filter(notNullish);
      return new Set(items);
    }), (newTargets) => {
      cleanup();
      if (isSupported.value && newTargets.size) {
        observer = new MutationObserver(callback);
        newTargets.forEach((el) => observer.observe(el, mutationOptions));
      }
    }, {
      immediate: true,
      flush: "post"
    });
    const takeRecords = () => {
      return observer === null || observer === void 0 ? void 0 : observer.takeRecords();
    };
    const stop = () => {
      stopWatch();
      cleanup();
    };
    tryOnScopeDispose(stop);
    return {
      isSupported,
      stop,
      takeRecords
    };
  }
  const ssrWidthSymbol = Symbol("vueuse-ssr-width");
function useSSRWidth() {
    const ssrWidth = vue.hasInjectionContext() ? injectLocal(ssrWidthSymbol, null) : null;
    return typeof ssrWidth === "number" ? ssrWidth : void 0;
  }
  function useMediaQuery(query, options = {}) {
    const { window: window$1 = defaultWindow, ssrWidth = useSSRWidth() } = options;
    const isSupported = useSupported(() => window$1 && "matchMedia" in window$1 && typeof window$1.matchMedia === "function");
    const ssrSupport = vue.shallowRef(typeof ssrWidth === "number");
    const mediaQuery = vue.shallowRef();
    const matches = vue.shallowRef(false);
    const handler = (event) => {
      matches.value = event.matches;
    };
    vue.watchEffect(() => {
      if (ssrSupport.value) {
        ssrSupport.value = !isSupported.value;
        matches.value = vue.toValue(query).split(",").some((queryString) => {
          const not = queryString.includes("not all");
          const minWidth = queryString.match(/\(\s*min-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);
          const maxWidth = queryString.match(/\(\s*max-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);
          let res = Boolean(minWidth || maxWidth);
          if (minWidth && res) res = ssrWidth >= pxValue(minWidth[1]);
          if (maxWidth && res) res = ssrWidth <= pxValue(maxWidth[1]);
          return not ? !res : res;
        });
        return;
      }
      if (!isSupported.value) return;
      mediaQuery.value = window$1.matchMedia(vue.toValue(query));
      matches.value = mediaQuery.value.matches;
    });
    useEventListener(mediaQuery, "change", handler, { passive: true });
    return vue.computed(() => matches.value);
  }
  const _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  const globalKey = "__vueuse_ssr_handlers__";
  const handlers = getHandlers();
  function getHandlers() {
    if (!(globalKey in _global)) _global[globalKey] = _global[globalKey] || {};
    return _global[globalKey];
  }
  function getSSRHandler(key, fallback) {
    return handlers[key] || fallback;
  }
  function guessSerializerType(rawInit) {
    return rawInit == null ? "any" : rawInit instanceof Set ? "set" : rawInit instanceof Map ? "map" : rawInit instanceof Date ? "date" : typeof rawInit === "boolean" ? "boolean" : typeof rawInit === "string" ? "string" : typeof rawInit === "object" ? "object" : !Number.isNaN(rawInit) ? "number" : "any";
  }
  const StorageSerializers = {
    boolean: {
      read: (v) => v === "true",
      write: (v) => String(v)
    },
    object: {
      read: (v) => JSON.parse(v),
      write: (v) => JSON.stringify(v)
    },
    number: {
      read: (v) => Number.parseFloat(v),
      write: (v) => String(v)
    },
    any: {
      read: (v) => v,
      write: (v) => String(v)
    },
    string: {
      read: (v) => v,
      write: (v) => String(v)
    },
    map: {
      read: (v) => new Map(JSON.parse(v)),
      write: (v) => JSON.stringify(Array.from(v.entries()))
    },
    set: {
      read: (v) => new Set(JSON.parse(v)),
      write: (v) => JSON.stringify(Array.from(v))
    },
    date: {
      read: (v) => new Date(v),
      write: (v) => v.toISOString()
    }
  };
  const customStorageEventName = "vueuse-storage";
  function useStorage(key, defaults$1, storage, options = {}) {
    var _options$serializer;
    const { flush = "pre", deep = true, listenToStorageChanges = true, writeDefaults = true, mergeDefaults = false, shallow, window: window$1 = defaultWindow, eventFilter, onError = (e) => {
      console.error(e);
    }, initOnMounted } = options;
    const data = (shallow ? vue.shallowRef : vue.ref)(typeof defaults$1 === "function" ? defaults$1() : defaults$1);
    const keyComputed = vue.computed(() => vue.toValue(key));
    if (!storage) try {
      storage = getSSRHandler("getDefaultStorage", () => defaultWindow === null || defaultWindow === void 0 ? void 0 : defaultWindow.localStorage)();
    } catch (e) {
      onError(e);
    }
    if (!storage) return data;
    const rawInit = vue.toValue(defaults$1);
    const type = guessSerializerType(rawInit);
    const serializer = (_options$serializer = options.serializer) !== null && _options$serializer !== void 0 ? _options$serializer : StorageSerializers[type];
    const { pause: pauseWatch, resume: resumeWatch } = watchPausable(data, (newValue) => write(newValue), {
      flush,
      deep,
      eventFilter
    });
    vue.watch(keyComputed, () => update(), { flush });
    let firstMounted = false;
    const onStorageEvent = (ev) => {
      if (initOnMounted && !firstMounted) return;
      update(ev);
    };
    const onStorageCustomEvent = (ev) => {
      if (initOnMounted && !firstMounted) return;
      updateFromCustomEvent(ev);
    };
    if (window$1 && listenToStorageChanges) if (storage instanceof Storage) useEventListener(window$1, "storage", onStorageEvent, { passive: true });
    else useEventListener(window$1, customStorageEventName, onStorageCustomEvent);
    if (initOnMounted) tryOnMounted(() => {
      firstMounted = true;
      update();
    });
    else update();
    function dispatchWriteEvent(oldValue, newValue) {
      if (window$1) {
        const payload = {
          key: keyComputed.value,
          oldValue,
          newValue,
          storageArea: storage
        };
        window$1.dispatchEvent(storage instanceof Storage ? new StorageEvent("storage", payload) : new CustomEvent(customStorageEventName, { detail: payload }));
      }
    }
    function write(v) {
      try {
        const oldValue = storage.getItem(keyComputed.value);
        if (v == null) {
          dispatchWriteEvent(oldValue, null);
          storage.removeItem(keyComputed.value);
        } else {
          const serialized = serializer.write(v);
          if (oldValue !== serialized) {
            storage.setItem(keyComputed.value, serialized);
            dispatchWriteEvent(oldValue, serialized);
          }
        }
      } catch (e) {
        onError(e);
      }
    }
    function read(event) {
      const rawValue = event ? event.newValue : storage.getItem(keyComputed.value);
      if (rawValue == null) {
        if (writeDefaults && rawInit != null) storage.setItem(keyComputed.value, serializer.write(rawInit));
        return rawInit;
      } else if (!event && mergeDefaults) {
        const value = serializer.read(rawValue);
        if (typeof mergeDefaults === "function") return mergeDefaults(value, rawInit);
        else if (type === "object" && !Array.isArray(value)) return {
          ...rawInit,
          ...value
        };
        return value;
      } else if (typeof rawValue !== "string") return rawValue;
      else return serializer.read(rawValue);
    }
    function update(event) {
      if (event && event.storageArea !== storage) return;
      if (event && event.key == null) {
        data.value = rawInit;
        return;
      }
      if (event && event.key !== keyComputed.value) return;
      pauseWatch();
      try {
        const serializedData = serializer.write(data.value);
        if (event === void 0 || (event === null || event === void 0 ? void 0 : event.newValue) !== serializedData) data.value = read(event);
      } catch (e) {
        onError(e);
      } finally {
        if (event) vue.nextTick(resumeWatch);
        else resumeWatch();
      }
    }
    function updateFromCustomEvent(event) {
      update(event.detail);
    }
    return data;
  }
  const defaultScrollConfig = {
    speed: 2,
    margin: 30,
    direction: "both"
  };
  function clampContainerScroll(container) {
    if (container.scrollLeft > container.scrollWidth - container.clientWidth) container.scrollLeft = Math.max(0, container.scrollWidth - container.clientWidth);
    if (container.scrollTop > container.scrollHeight - container.clientHeight) container.scrollTop = Math.max(0, container.scrollHeight - container.clientHeight);
  }
  function useDraggable(target, options = {}) {
    var _toValue, _toValue2, _toValue3, _scrollConfig$directi;
    const { pointerTypes, preventDefault: preventDefault$1, stopPropagation, exact, onMove, onEnd, onStart, initialValue, axis = "both", draggingElement = defaultWindow, containerElement, handle: draggingHandle = target, buttons = [0], restrictInView, autoScroll = false } = options;
    const position = vue.ref((_toValue = vue.toValue(initialValue)) !== null && _toValue !== void 0 ? _toValue : {
      x: 0,
      y: 0
    });
    const pressedDelta = vue.ref();
    const filterEvent = (e) => {
      if (pointerTypes) return pointerTypes.includes(e.pointerType);
      return true;
    };
    const handleEvent = (e) => {
      if (vue.toValue(preventDefault$1)) e.preventDefault();
      if (vue.toValue(stopPropagation)) e.stopPropagation();
    };
    const scrollConfig = vue.toValue(autoScroll);
    const scrollSettings = typeof scrollConfig === "object" ? {
      speed: (_toValue2 = vue.toValue(scrollConfig.speed)) !== null && _toValue2 !== void 0 ? _toValue2 : defaultScrollConfig.speed,
      margin: (_toValue3 = vue.toValue(scrollConfig.margin)) !== null && _toValue3 !== void 0 ? _toValue3 : defaultScrollConfig.margin,
      direction: (_scrollConfig$directi = scrollConfig.direction) !== null && _scrollConfig$directi !== void 0 ? _scrollConfig$directi : defaultScrollConfig.direction
    } : defaultScrollConfig;
    const getScrollAxisValues = (value) => typeof value === "number" ? [value, value] : [value.x, value.y];
    const handleAutoScroll = (container, targetRect, position$1) => {
      const { clientWidth, clientHeight, scrollLeft, scrollTop, scrollWidth, scrollHeight } = container;
      const [marginX, marginY] = getScrollAxisValues(scrollSettings.margin);
      const [speedX, speedY] = getScrollAxisValues(scrollSettings.speed);
      let deltaX = 0;
      let deltaY = 0;
      if (scrollSettings.direction === "x" || scrollSettings.direction === "both") {
        if (position$1.x < marginX && scrollLeft > 0) deltaX = -speedX;
        else if (position$1.x + targetRect.width > clientWidth - marginX && scrollLeft < scrollWidth - clientWidth) deltaX = speedX;
      }
      if (scrollSettings.direction === "y" || scrollSettings.direction === "both") {
        if (position$1.y < marginY && scrollTop > 0) deltaY = -speedY;
        else if (position$1.y + targetRect.height > clientHeight - marginY && scrollTop < scrollHeight - clientHeight) deltaY = speedY;
      }
      if (deltaX || deltaY) container.scrollBy({
        left: deltaX,
        top: deltaY,
        behavior: "auto"
      });
    };
    let autoScrollInterval = null;
    const startAutoScroll = () => {
      const container = vue.toValue(containerElement);
      if (container && !autoScrollInterval) autoScrollInterval = setInterval(() => {
        const targetRect = vue.toValue(target).getBoundingClientRect();
        const { x, y } = position.value;
        const relativePosition = {
          x: x - container.scrollLeft,
          y: y - container.scrollTop
        };
        if (relativePosition.x >= 0 && relativePosition.y >= 0) {
          handleAutoScroll(container, targetRect, relativePosition);
          relativePosition.x += container.scrollLeft;
          relativePosition.y += container.scrollTop;
          position.value = relativePosition;
        }
      }, 1e3 / 60);
    };
    const stopAutoScroll = () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
      }
    };
    const isPointerNearEdge = (pointer, container, margin, targetRect) => {
      const [marginX, marginY] = typeof margin === "number" ? [margin, margin] : [margin.x, margin.y];
      const { clientWidth, clientHeight } = container;
      return pointer.x < marginX || pointer.x + targetRect.width > clientWidth - marginX || pointer.y < marginY || pointer.y + targetRect.height > clientHeight - marginY;
    };
    const checkAutoScroll = () => {
      if (vue.toValue(options.disabled) || !pressedDelta.value) return;
      const container = vue.toValue(containerElement);
      if (!container) return;
      const targetRect = vue.toValue(target).getBoundingClientRect();
      const { x, y } = position.value;
      if (isPointerNearEdge({
        x: x - container.scrollLeft,
        y: y - container.scrollTop
      }, container, scrollSettings.margin, targetRect)) startAutoScroll();
      else stopAutoScroll();
    };
    if (vue.toValue(autoScroll)) vue.watch(position, checkAutoScroll);
    const start = (e) => {
      var _container$getBoundin;
      if (!vue.toValue(buttons).includes(e.button)) return;
      if (vue.toValue(options.disabled) || !filterEvent(e)) return;
      if (vue.toValue(exact) && e.target !== vue.toValue(target)) return;
      const container = vue.toValue(containerElement);
      const containerRect = container === null || container === void 0 || (_container$getBoundin = container.getBoundingClientRect) === null || _container$getBoundin === void 0 ? void 0 : _container$getBoundin.call(container);
      const targetRect = vue.toValue(target).getBoundingClientRect();
      const pos = {
        x: e.clientX - (container ? targetRect.left - containerRect.left + (autoScroll ? 0 : container.scrollLeft) : targetRect.left),
        y: e.clientY - (container ? targetRect.top - containerRect.top + (autoScroll ? 0 : container.scrollTop) : targetRect.top)
      };
      if ((onStart === null || onStart === void 0 ? void 0 : onStart(pos, e)) === false) return;
      pressedDelta.value = pos;
      handleEvent(e);
    };
    const move = (e) => {
      if (vue.toValue(options.disabled) || !filterEvent(e)) return;
      if (!pressedDelta.value) return;
      const container = vue.toValue(containerElement);
      if (container instanceof HTMLElement) clampContainerScroll(container);
      const targetRect = vue.toValue(target).getBoundingClientRect();
      let { x, y } = position.value;
      if (axis === "x" || axis === "both") {
        x = e.clientX - pressedDelta.value.x;
        if (container) x = Math.min(Math.max(0, x), container.scrollWidth - targetRect.width);
      }
      if (axis === "y" || axis === "both") {
        y = e.clientY - pressedDelta.value.y;
        if (container) y = Math.min(Math.max(0, y), container.scrollHeight - targetRect.height);
      }
      if (vue.toValue(autoScroll) && container) {
        if (autoScrollInterval === null) handleAutoScroll(container, targetRect, {
          x,
          y
        });
        x += container.scrollLeft;
        y += container.scrollTop;
      }
      if (container && (restrictInView || autoScroll)) {
        if (axis !== "y") {
          const relativeX = x - container.scrollLeft;
          if (relativeX < 0) x = container.scrollLeft;
          else if (relativeX > container.clientWidth - targetRect.width) x = container.clientWidth - targetRect.width + container.scrollLeft;
        }
        if (axis !== "x") {
          const relativeY = y - container.scrollTop;
          if (relativeY < 0) y = container.scrollTop;
          else if (relativeY > container.clientHeight - targetRect.height) y = container.clientHeight - targetRect.height + container.scrollTop;
        }
      }
      position.value = {
        x,
        y
      };
      onMove === null || onMove === void 0 || onMove(position.value, e);
      handleEvent(e);
    };
    const end = (e) => {
      if (vue.toValue(options.disabled) || !filterEvent(e)) return;
      if (!pressedDelta.value) return;
      pressedDelta.value = void 0;
      if (autoScroll) stopAutoScroll();
      onEnd === null || onEnd === void 0 || onEnd(position.value, e);
      handleEvent(e);
    };
    if (isClient) {
      const config = () => {
        var _options$capture;
        return {
          capture: (_options$capture = options.capture) !== null && _options$capture !== void 0 ? _options$capture : true,
          passive: !vue.toValue(preventDefault$1)
        };
      };
      useEventListener(draggingHandle, "pointerdown", start, config);
      useEventListener(draggingElement, "pointermove", move, config);
      useEventListener(draggingElement, "pointerup", end, config);
    }
    return {
      ...toRefs(position),
      position,
      isDragging: vue.computed(() => !!pressedDelta.value),
      style: vue.computed(() => `
      left: ${position.value.x}px;
      top: ${position.value.y}px;
      ${autoScroll ? "text-wrap: nowrap;" : ""}
    `)
    };
  }
  function useResizeObserver(target, callback, options = {}) {
    const { window: window$1 = defaultWindow, ...observerOptions } = options;
    let observer;
    const isSupported = useSupported(() => window$1 && "ResizeObserver" in window$1);
    const cleanup = () => {
      if (observer) {
        observer.disconnect();
        observer = void 0;
      }
    };
    const stopWatch = vue.watch(vue.computed(() => {
      const _targets = vue.toValue(target);
      return Array.isArray(_targets) ? _targets.map((el) => unrefElement(el)) : [unrefElement(_targets)];
    }), (els) => {
      cleanup();
      if (isSupported.value && window$1) {
        observer = new ResizeObserver(callback);
        for (const _el of els) if (_el) observer.observe(_el, observerOptions);
      }
    }, {
      immediate: true,
      flush: "post"
    });
    const stop = () => {
      cleanup();
      stopWatch();
    };
    tryOnScopeDispose(stop);
    return {
      isSupported,
      stop
    };
  }
  function useElementBounding(target, options = {}) {
    const { reset = true, windowResize = true, windowScroll = true, immediate = true, updateTiming = "sync" } = options;
    const height = vue.shallowRef(0);
    const bottom = vue.shallowRef(0);
    const left = vue.shallowRef(0);
    const right = vue.shallowRef(0);
    const top = vue.shallowRef(0);
    const width = vue.shallowRef(0);
    const x = vue.shallowRef(0);
    const y = vue.shallowRef(0);
    function recalculate() {
      const el = unrefElement(target);
      if (!el) {
        if (reset) {
          height.value = 0;
          bottom.value = 0;
          left.value = 0;
          right.value = 0;
          top.value = 0;
          width.value = 0;
          x.value = 0;
          y.value = 0;
        }
        return;
      }
      const rect = el.getBoundingClientRect();
      height.value = rect.height;
      bottom.value = rect.bottom;
      left.value = rect.left;
      right.value = rect.right;
      top.value = rect.top;
      width.value = rect.width;
      x.value = rect.x;
      y.value = rect.y;
    }
    function update() {
      if (updateTiming === "sync") recalculate();
      else if (updateTiming === "next-frame") requestAnimationFrame(() => recalculate());
    }
    useResizeObserver(target, update);
    vue.watch(() => unrefElement(target), (ele) => !ele && update());
    useMutationObserver(target, update, { attributeFilter: ["style", "class"] });
    if (windowScroll) useEventListener("scroll", update, {
      capture: true,
      passive: true
    });
    if (windowResize) useEventListener("resize", update, { passive: true });
    tryOnMounted(() => {
      if (immediate) update();
    });
    return {
      height,
      bottom,
      left,
      right,
      top,
      width,
      x,
      y,
      update
    };
  }
function useWindowSize(options = {}) {
    const { window: window$1 = defaultWindow, initialWidth = Number.POSITIVE_INFINITY, initialHeight = Number.POSITIVE_INFINITY, listenOrientation = true, includeScrollbar = true, type = "inner" } = options;
    const width = vue.shallowRef(initialWidth);
    const height = vue.shallowRef(initialHeight);
    const update = () => {
      if (window$1) if (type === "outer") {
        width.value = window$1.outerWidth;
        height.value = window$1.outerHeight;
      } else if (type === "visual" && window$1.visualViewport) {
        const { width: visualViewportWidth, height: visualViewportHeight, scale } = window$1.visualViewport;
        width.value = Math.round(visualViewportWidth * scale);
        height.value = Math.round(visualViewportHeight * scale);
      } else if (includeScrollbar) {
        width.value = window$1.innerWidth;
        height.value = window$1.innerHeight;
      } else {
        width.value = window$1.document.documentElement.clientWidth;
        height.value = window$1.document.documentElement.clientHeight;
      }
    };
    update();
    tryOnMounted(update);
    const listenerOptions = { passive: true };
    useEventListener("resize", update, listenerOptions);
    if (window$1 && type === "visual" && window$1.visualViewport) useEventListener(window$1.visualViewport, "resize", update, listenerOptions);
    if (listenOrientation) vue.watch(useMediaQuery("(orientation: portrait)"), () => update());
    return {
      width,
      height
    };
  }
  const WORD_HISTORY_MAX_AGE_MS = 5 * 86400 * 1e3;
  const createWordHistoryStore = (id, storageKey) => {
    return defineStore(id, () => {
      const wordMap = useStorage(storageKey, {}, localStorage);
      const pruneExpired = (now = Date.now()) => {
        const nextMap = { ...wordMap.value };
        Object.entries(nextMap).forEach(([word, timestamp]) => {
          if (timestamp < now - WORD_HISTORY_MAX_AGE_MS) {
            delete nextMap[word];
          }
        });
        wordMap.value = nextMap;
      };
      const touchWords = (words, now = Date.now()) => {
        const nextMap = { ...wordMap.value };
        for (let word of words) {
          word = word.trim();
          if (word) {
            nextMap[word] = now;
          }
        }
        wordMap.value = nextMap;
        pruneExpired(now);
      };
      const hasWord = (word) => {
        word = word.trim();
        if (!word) {
          return false;
        }
        return typeof wordMap.value[word] === "number";
      };
      return {
        wordMap,
        pruneExpired,
        touchWords,
        hasWord
      };
    });
  };
  const useEntmtWordHistoryStore = createWordHistoryStore(
    "history-word-entmt",
    "weibo-hot-no-shit:history:entmt-word-map"
  );
  const useLifeWordHistoryStore = createWordHistoryStore(
    "history-word-life",
    "weibo-hot-no-shit:history:life-word-map"
  );
  const updateEntmtWordHistory = (response) => {
    const store = useEntmtWordHistoryStore();
    const words = response.data.band_list.map((item) => item.word);
    store.touchWords(words);
  };
  const updateLifeWordHistory = (response) => {
    const store = useLifeWordHistoryStore();
    const words = response.data.band_list.map((item) => item.word);
    store.touchWords(words);
  };
  var _GM_addValueChangeListener = (() => typeof GM_addValueChangeListener != "undefined" ? GM_addValueChangeListener : void 0)();
  var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_removeValueChangeListener = (() => typeof GM_removeValueChangeListener != "undefined" ? GM_removeValueChangeListener : void 0)();
  var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const DEFAULT_TIMEOUT = 1e4;
  const DEFAULT_ACCEPT = "application/json, text/plain, */*";
  const DEFAULT_REFERER = "https://weibo.com/";
  const getHeader = (headers, name) => {
    if (!headers) {
      return void 0;
    }
    const entry = Object.entries(headers).find(([key]) => key.toLowerCase() === name.toLowerCase());
    return entry?.[1];
  };
  const compactHeaders = (headers) => {
    return Object.fromEntries(
      Object.entries(headers).filter(([, value]) => typeof value === "string" && value.length > 0)
    );
  };
  const parseResponseHeaders = (raw) => {
    const headers = {};
    raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).forEach((line) => {
      const index = line.indexOf(":");
      if (index <= 0) {
        return;
      }
      const key = line.slice(0, index).trim().toLowerCase();
      const value = line.slice(index + 1).trim();
      headers[key] = value;
    });
    return headers;
  };
  const buildHeaders = (customHeaders) => {
    const merged = {
      Accept: getHeader(customHeaders, "Accept") ?? DEFAULT_ACCEPT,
      Referer: getHeader(customHeaders, "Referer") ?? DEFAULT_REFERER,
      ...customHeaders ?? {}
    };
    return compactHeaders(merged);
  };
  const parseJson = (responseText, url) => {
    try {
      return JSON.parse(responseText);
    } catch {
      throw new Error(`API 返回非 JSON 数据: ${url}`);
    }
  };
  const requestGet = (url, config) => {
    const headers = buildHeaders(config?.headers);
    const cookie = getHeader(config?.headers, "Cookie") ?? document.cookie;
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        method: "GET",
        url,
        timeout: DEFAULT_TIMEOUT,
        responseType: "text",
        anonymous: false,
        headers,
        cookie,
        onload: (response) => {
          const parsedHeaders = parseResponseHeaders(response.responseHeaders);
          const contentType = parsedHeaders["content-type"];
          if (typeof contentType === "string" && contentType.includes("text/html")) {
            reject(new Error("API 返回 HTML，可能未登录或无权限"));
            return;
          }
          const text = typeof response.responseText === "string" ? response.responseText : "";
          const data = parseJson(text, url);
          resolve({
            data,
            headers: parsedHeaders,
            status: response.status,
            statusText: response.statusText
          });
        },
        onerror: () => {
          reject(new Error(`API 请求失败: ${url}`));
        },
        ontimeout: () => {
          reject(new Error(`API 请求超时: ${url}`));
        },
        onabort: () => {
          reject(new Error(`API 请求被中止: ${url}`));
        }
      });
    });
  };
  const hotApiClient = {
    get: requestGet
  };
  const isObject = (value) => {
    return typeof value === "object" && value !== null;
  };
  const getOkValue = (payload) => {
    if (!isObject(payload)) {
      return void 0;
    }
    const ok = payload.ok;
    return typeof ok === "number" ? ok : void 0;
  };
  const hasDataField = (payload) => {
    if (!isObject(payload)) {
      return false;
    }
    return "data" in payload;
  };
  class ApiResponseError extends Error {
    constructor(message, endpoint, payload) {
      super(message);
      this.endpoint = endpoint;
      this.payload = payload;
      this.name = "ApiResponseError";
    }
  }
  const assertSuccessPayload = (payload, endpoint) => {
    if (!isObject(payload)) {
      throw new ApiResponseError("API 返回非 JSON 对象", endpoint, payload);
    }
    const ok = getOkValue(payload);
    if (ok !== 1) {
      throw new ApiResponseError(`API 返回失败状态 ok=${String(ok)}`, endpoint, payload);
    }
    if (!hasDataField(payload)) {
      throw new ApiResponseError("API 成功响应缺少 data 字段", endpoint, payload);
    }
    return payload;
  };
  const MINE_BAND_PATH = "https://weibo.com/ajax/statuses/mineBand";
  const fetchMine = async (headers) => {
    const response = await hotApiClient.get(MINE_BAND_PATH, {
      headers: {
        ...headers ?? {}
      }
    });
    return assertSuccessPayload(response.data, MINE_BAND_PATH);
  };
  const DEFAULT_HOT_SEARCH_PATH = "https://weibo.com/ajax/side/hotSearch";
  const fetchDefault = async (headers) => {
    const response = await hotApiClient.get(DEFAULT_HOT_SEARCH_PATH, {
      headers: {
        ...headers ?? {}
      }
    });
    return assertSuccessPayload(response.data, DEFAULT_HOT_SEARCH_PATH);
  };
  const ENTERTAINMENT_HOT_PATH = "https://weibo.com/ajax/statuses/entertainment";
  const fetchEntmt = async (headers) => {
    const response = await hotApiClient.get(ENTERTAINMENT_HOT_PATH, {
      headers: {
        ...headers ?? {}
      }
    });
    return assertSuccessPayload(response.data, ENTERTAINMENT_HOT_PATH);
  };
  const LIFE_HOT_PATH = "https://weibo.com/ajax/statuses/life";
  const fetchLife = async (headers) => {
    const response = await hotApiClient.get(LIFE_HOT_PATH, {
      headers: {
        ...headers ?? {}
      }
    });
    return assertSuccessPayload(response.data, LIFE_HOT_PATH);
  };
  const SOCIAL_HOT_PATH = "https://weibo.com/ajax/statuses/social";
  const fetchSocial = async (headers) => {
    const response = await hotApiClient.get(SOCIAL_HOT_PATH, {
      headers: {
        ...headers ?? {}
      }
    });
    return assertSuccessPayload(response.data, SOCIAL_HOT_PATH);
  };
  const PROJECT_NAME = "[Weibo-Hot-No-Shit]";
  const time = () => performance.now().toFixed(2);
  const logger = {
    log(...args) {
      console.log(PROJECT_NAME, time() + "ms", ...args);
    },
    error(...args) {
      console.error(PROJECT_NAME, time() + "ms", ...args);
    },
    warn(...args) {
      console.warn(PROJECT_NAME, time() + "ms", ...args);
    },
    info(...args) {
      console.info(PROJECT_NAME, time() + "ms", ...args);
    },
    debug(...args) {
    }
  };
  const RAW_TTL_MS = 3 * 60 * 1e3;
  const createInitialState = () => {
    return {
      data: null,
      updatedAt: 0
    };
  };
  const createRawStore = (options) => {
    return defineStore(options.id, () => {
      const state = useStorage(options.storageKey, createInitialState(), localStorage);
      const loading = vue.ref(false);
      const error = vue.ref(null);
      const ensureFresh = async (force = false) => {
        if (!force && state.value.data && Date.now() - state.value.updatedAt < RAW_TTL_MS) {
          logger.info(`${options.sourceLabel} API cache hit. Returning cached data.`);
          return state.value.data;
        }
        loading.value = true;
        error.value = null;
        try {
          const response = await options.fetcher();
          state.value = {
            data: response,
            updatedAt: Date.now()
          };
          options.onSuccess?.(response);
          return response;
        } catch (cause) {
          const currentError = cause instanceof Error ? cause : new Error(options.unknownErrorMessage);
          error.value = currentError;
          if (cause instanceof ApiResponseError) {
            logger.warn(`${options.sourceLabel} API response invalid:`, cause.endpoint, cause.payload);
          } else {
            logger.error(`${options.sourceLabel} API request failed:`, cause);
          }
          if (state.value.data) {
            logger.warn(`${options.sourceLabel} API failed, keep stale cache`);
            return state.value.data;
          }
          throw currentError;
        } finally {
          loading.value = false;
          logger.info(`${options.sourceLabel} API fetch finished. Success: ${!error.value}, Force: ${force}`);
        }
      };
      const refresh = async () => ensureFresh(true);
      return {
        state,
        loading,
        error,
        ensureFresh,
        refresh
      };
    });
  };
  const useMineRawStore = createRawStore({
    id: "raw-mine",
    storageKey: "weibo-hot-no-shit:raw:mine",
    sourceLabel: "Mine",
    fetcher: fetchMine,
    unknownErrorMessage: "Unknown error while fetching mine hot list"
  });
  const useDefaultRawStore = createRawStore({
    id: "raw-default",
    storageKey: "weibo-hot-no-shit:raw:default",
    sourceLabel: "Default",
    fetcher: fetchDefault,
    unknownErrorMessage: "Unknown error while fetching default hot list"
  });
  const useEntmtRawStore = createRawStore({
    id: "raw-entmt",
    storageKey: "weibo-hot-no-shit:raw:entmt",
    sourceLabel: "Entertainment",
    fetcher: fetchEntmt,
    unknownErrorMessage: "Unknown error while fetching entertainment hot list",
    onSuccess: updateEntmtWordHistory
  });
  const useLifeRawStore = createRawStore({
    id: "raw-life",
    storageKey: "weibo-hot-no-shit:raw:life",
    sourceLabel: "Life",
    fetcher: fetchLife,
    unknownErrorMessage: "Unknown error while fetching life hot list",
    onSuccess: updateLifeWordHistory
  });
  const useSocialRawStore = createRawStore({
    id: "raw-social",
    storageKey: "weibo-hot-no-shit:raw:social",
    sourceLabel: "Social",
    fetcher: fetchSocial,
    unknownErrorMessage: "Unknown error while fetching social hot list"
  });
  const ensureAllRawStoresFresh = async (pinia, force = false) => {
    const mine = useMineRawStore(pinia);
    const defaultStore = useDefaultRawStore(pinia);
    const entmt = useEntmtRawStore(pinia);
    const life = useLifeRawStore(pinia);
    const social = useSocialRawStore(pinia);
    const results = await Promise.allSettled([
      mine.ensureFresh(force),
      defaultStore.ensureFresh(force),
      entmt.ensureFresh(force),
      life.ensureFresh(force),
      social.ensureFresh(force)
    ]);
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        const source = ["mine", "default", "entmt", "life", "social"][index];
        logger.warn(`Raw prefetch failed for ${source}:`, result.reason);
      }
    });
  };
  const useGMValue = (key, initialValue, options = {}) => {
    const { deep = true, flush = "pre", listenToChanges = true, debounceMs = 1e3 } = options;
    const state = vue.ref(_GM_getValue(key, initialValue));
    let ms = debounceMs;
    if (ms <= 0) {
      ms = 200;
    }
    watchDebounced(
      state,
      (value) => {
        _GM_setValue(key, value);
      },
      {
        deep,
        flush,
        debounce: ms
      }
    );
    let listenerId;
    if (listenToChanges) {
      listenerId = _GM_addValueChangeListener(key, (_name, _oldValue, newValue) => {
        state.value = newValue;
      });
    }
    vue.onScopeDispose(() => {
      if (listenerId != null) {
        _GM_removeValueChangeListener(listenerId);
      }
    });
    return state;
  };
  const normalizeList = (items) => {
    const normalized = items.map((item) => item.trim()).filter((item) => item.length > 0);
    return Array.from(new Set(normalized));
  };
  const buildMergedRegex = (items) => {
    const validNormalParts = [];
    const validBackrefParts = [];
    for (const item of items) {
      const trimmed = item.trim();
      if (!trimmed || trimmed === "//") {
        continue;
      }
      let rawPattern;
      if (trimmed.startsWith("/") && trimmed.endsWith("/")) {
        rawPattern = trimmed.slice(1, -1);
      } else {
        rawPattern = trimmed.replace(/[*+?^${}().|[\]\\]/g, "\\$&");
      }
      try {
        void new RegExp(rawPattern, "iu");
        const withoutEscapedSlash = rawPattern.replace(/\\\\/g, "");
        if (/\\\d|\\k</.test(withoutEscapedSlash)) {
          validBackrefParts.push(rawPattern);
        } else {
          validNormalParts.push(rawPattern);
        }
      } catch (error) {
        logger.warn("Skip invalid regex pattern in settings:", rawPattern, error);
      }
    }
    const mergedRegex = [];
    try {
      if (validNormalParts.length > 0) {
        mergedRegex.push(new RegExp(validNormalParts.join("|"), "iu"));
      }
      for (const pattern of validBackrefParts) {
        mergedRegex.push(new RegExp(pattern, "iu"));
      }
    } catch (error) {
      logger.error("Build merged regex failed in settings store:", error);
    }
    return mergedRegex;
  };
  const matchesByMergedRegex = (value, mergedRegex) => {
    const text = value.trim();
    if (!text) {
      return false;
    }
    return mergedRegex.some((regex) => regex.test(text));
  };
  const usePluginSettingsStore = defineStore("plugin-settings", () => {
    const keywords = useGMValue("blacklist.keywords", []);
    const names = useGMValue("blacklist.names", []);
    const keywordMergedRegex = vue.computed(() => buildMergedRegex(keywords.value));
    const nameMergedRegex = vue.computed(() => buildMergedRegex(names.value));
    const commitKeywords = useDebounceFn((nextKeywords) => {
      keywords.value = normalizeList(nextKeywords);
    }, 100);
    const commitNames = useDebounceFn((nextNames) => {
      names.value = normalizeList(nextNames);
    }, 100);
    const setKeywords = (nextKeywords) => {
      commitKeywords(nextKeywords);
    };
    const setNames = (nextNames) => {
      commitNames(nextNames);
    };
    const matchKeyword = (value) => {
      return matchesByMergedRegex(value, keywordMergedRegex.value);
    };
    const matchName = (value) => {
      return matchesByMergedRegex(value, nameMergedRegex.value);
    };
    return {
      keywords,
      names,
      keywordMergedRegex,
      nameMergedRegex,
      setKeywords,
      setNames,
      matchKeyword,
      matchName
    };
  });
  const useFilteredDefaultHotSearch = () => {
    const defaultRawStore = useDefaultRawStore();
    const { state } = storeToRefs(defaultRawStore);
    const lifeWordHistoryStore = useLifeWordHistoryStore();
    const entmtWordHistoryStore = useEntmtWordHistoryStore();
    const pluginSettingsStore = usePluginSettingsStore();
    const hotSearches = vue.computed(() => {
      const sourceItems = state.value.data?.data.realtime ?? [];
      const filteredItems = sourceItems.filter((item) => {
        const word = item.word.trim();
        if (!word) {
          return false;
        }
        if (item.icon_desc && ["辟谣"].includes(item.icon_desc.trim())) {
          return true;
        }
        if (item.is_ad === 1 || item.topic_ad === 1 || item.small_icon_desc === "商" || item.monitors) {
          return false;
        }
        if (item.flag_desc && ["剧集", "电影", "综艺", "盛典", "演出"].includes(item.flag_desc.trim())) {
          return false;
        }
        if (lifeWordHistoryStore.hasWord(word) || entmtWordHistoryStore.hasWord(word)) {
          return false;
        }
        if (pluginSettingsStore.matchKeyword(word) || pluginSettingsStore.matchKeyword(item.word_scheme)) {
          return false;
        }
        if (pluginSettingsStore.matchName(word) || pluginSettingsStore.matchName(item.word_scheme)) {
          return false;
        }
        return true;
      });
      return filteredItems.map((item, index) => {
        return {
          rank: index + 1,
          word: item.word,
          desc: (item.num / 1e4).toFixed(1) + "万",
          color: item.icon_desc_color ?? ""
        };
      });
    });
    return {
      hotSearches
    };
  };
  const useFilteredMineHotSearch = () => {
    const mineRawStore = useMineRawStore();
    const { state } = storeToRefs(mineRawStore);
    const lifeWordHistoryStore = useLifeWordHistoryStore();
    const entmtWordHistoryStore = useEntmtWordHistoryStore();
    const pluginSettingsStore = usePluginSettingsStore();
    const hotSearches = vue.computed(() => {
      const sourceItems = state.value.data?.data.realtime ?? [];
      const filteredItems = sourceItems.filter((item) => {
        const word = item.word.trim();
        if (!word) {
          return false;
        }
        if (item.icon_desc && ["辟谣"].includes(item.icon_desc.trim())) {
          return true;
        }
        if (item.small_icon_desc === "商" || item.rank === null) {
          return false;
        }
        if (item.icon_desc && ["官宣", "亮相"].includes(item.icon_desc.trim())) {
          return false;
        }
        if (lifeWordHistoryStore.hasWord(word) || entmtWordHistoryStore.hasWord(word)) {
          return false;
        }
        if (pluginSettingsStore.matchKeyword(word) || pluginSettingsStore.matchKeyword(item.word_scheme)) {
          return false;
        }
        if (pluginSettingsStore.matchName(word) || pluginSettingsStore.matchName(item.word_scheme)) {
          return false;
        }
        return true;
      });
      return filteredItems.map((item, index) => {
        let desc = "";
        if (typeof item.description === "number") {
          desc = (item.description / 1e4).toFixed(1) + "万";
        } else if (typeof item.description === "string") {
          if (item.description === "好友正在看") {
            desc = "●";
          } else if (item.description.endsWith("登顶")) {
            desc = "登顶";
          } else if (item.description.endsWith("霸榜")) {
            desc = "霸榜";
          } else {
            desc = item.description;
          }
        }
        if (item.icon_desc === "辟谣") {
          desc = "辟谣";
        }
        return {
          rank: index + 1,
          word: item.word,
          desc,
          color: item.icon_desc_color ?? ""
        };
      });
    });
    return {
      hotSearches
    };
  };
  const _hoisted_1$3 = {
    class: "setting-menu",
    "aria-label": "过滤设置"
  };
  const _hoisted_2$1 = {
    class: "setting-menu__tabs",
    "aria-label": "过滤类型"
  };
  const _hoisted_3$1 = ["aria-selected"];
  const _hoisted_4$1 = ["aria-selected"];
  const _hoisted_5$1 = { class: "setting-menu__editor" };
  const _hoisted_6$1 = { class: "setting-menu__meta" };
  const _hoisted_7$1 = { class: "setting-menu__title" };
  const _hoisted_8$1 = ["placeholder"];
  const _sfc_main$4 = vue.defineComponent({
    __name: "SettingMenu",
    setup(__props) {
      const settingsStore = usePluginSettingsStore();
      const { keywords, names } = storeToRefs(settingsStore);
      const activeTab = vue.ref("keywords");
      const keywordsDraft = vue.ref("");
      const namesDraft = vue.ref("");
      const textareaRef = vue.ref(null);
      const toMultiline = (items) => items.join("\n");
      vue.watch(
        keywords,
        (value) => {
          if (textareaRef.value === document.activeElement) {
            return;
          }
          keywordsDraft.value = toMultiline(value);
        },
        { immediate: true }
      );
      vue.watch(
        names,
        (value) => {
          if (textareaRef.value === document.activeElement) {
            return;
          }
          namesDraft.value = toMultiline(value);
        },
        { immediate: true }
      );
      const parseLines = (value) => {
        return value.split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 0);
      };
      const currentDraft = vue.computed({
        get: () => {
          return activeTab.value === "keywords" ? keywordsDraft.value : namesDraft.value;
        },
        set: (value) => {
          if (activeTab.value === "keywords") {
            keywordsDraft.value = value;
            return;
          }
          namesDraft.value = value;
        }
      });
      const currentPlaceholder = vue.computed(() => {
        if (activeTab.value === "keywords") {
          return "每行一个关键词，不区分大小写\n支持正则（无需flag）如：/abc|\\d+/";
        }
        return "每行一个人名，项目 README 提供热搜常见人名列表";
      });
      const preventSavePageShortcut = (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
          event.preventDefault();
          event.stopPropagation();
        }
      };
      const syncDraftToStore = () => {
        settingsStore.setKeywords(parseLines(keywordsDraft.value));
        settingsStore.setNames(parseLines(namesDraft.value));
      };
      vue.watch([keywordsDraft, namesDraft], syncDraftToStore);
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("section", _hoisted_1$3, [
          vue.createElementVNode("nav", _hoisted_2$1, [
            vue.createElementVNode("button", {
              class: vue.normalizeClass(["setting-menu__tab", { "is-active": activeTab.value === "keywords" }]),
              type: "button",
              role: "tab",
              "aria-selected": activeTab.value === "keywords",
              onClick: _cache[0] || (_cache[0] = ($event) => activeTab.value = "keywords")
            }, " 关键词列表 ", 10, _hoisted_3$1),
            vue.createElementVNode("button", {
              class: vue.normalizeClass(["setting-menu__tab", { "is-active": activeTab.value === "names" }]),
              type: "button",
              role: "tab",
              "aria-selected": activeTab.value === "names",
              onClick: _cache[1] || (_cache[1] = ($event) => activeTab.value = "names")
            }, " 人名列表 ", 10, _hoisted_4$1)
          ]),
          vue.createElementVNode("div", _hoisted_5$1, [
            vue.createElementVNode("header", _hoisted_6$1, [
              vue.createElementVNode("h3", _hoisted_7$1, vue.toDisplayString(activeTab.value === "keywords" ? "关键词列表" : "人名列表"), 1)
            ]),
            vue.withDirectives(vue.createElementVNode("textarea", {
              ref_key: "textareaRef",
              ref: textareaRef,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => currentDraft.value = $event),
              class: "setting-menu__textarea",
              placeholder: currentPlaceholder.value,
              rows: "16",
              spellcheck: "false",
              onKeydown: preventSavePageShortcut,
              onCancel: _cache[3] || (_cache[3] = vue.withModifiers(() => {
              }, ["prevent"]))
            }, null, 40, _hoisted_8$1), [
              [vue.vModelText, currentDraft.value]
            ])
          ])
        ]);
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const SettingMenu = _export_sfc(_sfc_main$4, [["__scopeId", "data-v-3519dc98"]]);
  const _sfc_main$3 = {};
  const _hoisted_1$2 = {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24"
  };
  function _sfc_render$2(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$2, [..._cache[0] || (_cache[0] = [
      vue.createElementVNode("g", {
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "2"
      }, [
        vue.createElementVNode("path", { d: "M3.082 13.945c-.529-.95-.793-1.426-.793-1.945s.264-.994.793-1.944L4.43 7.63l1.426-2.381c.559-.933.838-1.4 1.287-1.66c.45-.259.993-.267 2.08-.285L12 3.26l2.775.044c1.088.018 1.631.026 2.08.286s.73.726 1.288 1.659L19.57 7.63l1.35 2.426c.528.95.792 1.425.792 1.944s-.264.994-.793 1.944L19.57 16.37l-1.426 2.381c-.559.933-.838 1.4-1.287 1.66c-.45.259-.993.267-2.08.285L12 20.74l-2.775-.044c-1.088-.018-1.631-.026-2.08-.286s-.73-.726-1.288-1.659L4.43 16.37z" }),
        vue.createElementVNode("circle", {
          cx: "12",
          cy: "12",
          r: "3"
        })
      ], -1)
    ])]);
  }
  const SettingAltLine = _export_sfc(_sfc_main$3, [["render", _sfc_render$2]]);
  const _sfc_main$2 = {};
  const _hoisted_1$1 = {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24"
  };
  function _sfc_render$1(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$1, [..._cache[0] || (_cache[0] = [
      vue.createElementVNode("path", {
        fill: "currentColor",
        d: "M21.074 12.154a.75.75 0 0 1 .672.82c-.49 4.93-4.658 8.776-9.724 8.776c-2.724 0-5.364-.933-7.238-2.68L3 20.85a.75.75 0 0 1-.75-.75v-3.96c0-.714.58-1.29 1.291-1.29h3.97a.75.75 0 0 1 .75.75l-2.413 2.407c1.558 1.433 3.78 2.243 6.174 2.243c4.29 0 7.817-3.258 8.232-7.424a.75.75 0 0 1 .82-.672m-18.82-1.128c.49-4.93 4.658-8.776 9.724-8.776c2.724 0 5.364.933 7.238 2.68L21 3.15a.75.75 0 0 1 .75.75v3.96c0 .714-.58 1.29-1.291 1.29h-3.97a.75.75 0 0 1-.75-.75l2.413-2.408c-1.558-1.432-3.78-2.242-6.174-2.242c-4.29 0-7.817 3.258-8.232 7.424a.75.75 0 1 1-1.492-.148"
      }, null, -1)
    ])]);
  }
  const RefreshSolid = _export_sfc(_sfc_main$2, [["render", _sfc_render$1]]);
  const _hoisted_1 = {
    class: "hot-sidebar",
    "aria-label": "微博热搜侧栏"
  };
  const _hoisted_2 = { class: "hot-sidebar__header" };
  const _hoisted_3 = { class: "hot-sidebar__title-group" };
  const _hoisted_4 = ["disabled"];
  const _hoisted_5 = {
    class: "hot-sidebar__tabs",
    role: "tablist",
    "aria-label": "热搜来源切换"
  };
  const _hoisted_6 = ["aria-selected"];
  const _hoisted_7 = ["aria-selected"];
  const _hoisted_8 = { class: "hot-sidebar__list-wrap" };
  const _hoisted_9 = { class: "hot-list" };
  const _hoisted_10 = ["href", "title"];
  const _hoisted_11 = { class: "hot-list__word" };
  const REFRESH_COOLDOWN_MS = 3e4;
  const _sfc_main$1 = vue.defineComponent({
    __name: "HotSearch",
    setup(__props) {
      const activeSource = vue.ref("mine");
      const mineRawStore = useMineRawStore();
      const defaultRawStore = useDefaultRawStore();
      const { loading: mineLoading } = storeToRefs(mineRawStore);
      const { loading: defaultLoading } = storeToRefs(defaultRawStore);
      const { hotSearches: mineHotSearches } = useFilteredMineHotSearch();
      const { hotSearches: defaultHotSearches } = useFilteredDefaultHotSearch();
      const currentList = vue.computed(() => {
        return activeSource.value === "mine" ? mineHotSearches.value : defaultHotSearches.value;
      });
      const isRefreshing = vue.computed(() => {
        return activeSource.value === "mine" ? mineLoading.value : defaultLoading.value;
      });
      const refreshCooldownUntil = vue.ref(0);
      const hasManualRefreshed = vue.ref(false);
      const nowTs = vue.ref(Date.now());
      const refreshIconKey = vue.ref(0);
      let cooldownTimer = null;
      const ensureCooldownTicker = () => {
        if (cooldownTimer) {
          return;
        }
        cooldownTimer = setInterval(() => {
          nowTs.value = Date.now();
          if (nowTs.value >= refreshCooldownUntil.value && cooldownTimer) {
            clearInterval(cooldownTimer);
            cooldownTimer = null;
          }
        }, 1e3);
      };
      const cooldownRemainingSec = vue.computed(() => {
        const remainMs = refreshCooldownUntil.value - nowTs.value;
        return remainMs > 0 ? Math.ceil(remainMs / 1e3) : 0;
      });
      const isInCooldown = vue.computed(() => cooldownRemainingSec.value > 0);
      const canRefresh = vue.computed(() => {
        if (isRefreshing.value) {
          return false;
        }
        if (!hasManualRefreshed.value) {
          return true;
        }
        return !isInCooldown.value;
      });
      const startRefreshCooldown = () => {
        refreshCooldownUntil.value = Date.now() + REFRESH_COOLDOWN_MS;
        nowTs.value = Date.now();
        ensureCooldownTicker();
      };
      const doRefreshCurrent = async () => {
        try {
          if (activeSource.value === "mine") {
            await mineRawStore.refresh();
            return;
          }
          await defaultRawStore.refresh();
        } catch (error) {
          logger.error("Manual refresh failed:", error);
        }
      };
      const throttledRefresh = useThrottleFn(
        async () => {
          startRefreshCooldown();
          await doRefreshCurrent();
        },
        REFRESH_COOLDOWN_MS,
        true,
        false
      );
      const refreshCurrent = async () => {
        refreshIconKey.value += 1;
        if (!canRefresh.value) {
          return;
        }
        if (!hasManualRefreshed.value) {
          hasManualRefreshed.value = true;
          startRefreshCooldown();
          await doRefreshCurrent();
          return;
        }
        await throttledRefresh();
      };
      const buildWeiboSearchUrl = (word) => {
        return `https://s.weibo.com/weibo?q=${encodeURIComponent(`#${word}#`)}`;
      };
      const showSettingMenu = vue.ref(false);
      const settingDialogRef = vue.ref(null);
      const settingMenuDragHandleRef = vue.ref(null);
      const settingMenuPanelRef = vue.ref(null);
      const hasInitializedSettingPanelPos = vue.ref(false);
      const windowSize = useWindowSize({ includeScrollbar: false });
      const { width: panelWidth, height: panelHeight } = useElementBounding(settingMenuPanelRef, {
        windowScroll: false
      });
      const {
        x: panelX,
        y: panelY,
        style: settingPanelDragStyle
      } = useDraggable(settingMenuPanelRef, {
        initialValue: {
          x: 0,
          y: 0
        },
        handle: settingMenuDragHandleRef,
        preventDefault: true,
        stopPropagation: true,
        onMove: (position) => {
          const maxX = Math.max(windowSize.width.value - panelWidth.value, 0);
          const maxY = Math.max(windowSize.height.value - panelHeight.value, 0);
          if (position.x < 0) {
            position.x = 0;
          }
          if (position.y < 0) {
            position.y = 0;
          }
          if (position.x > maxX) {
            position.x = maxX;
          }
          if (position.y > maxY) {
            position.y = maxY;
          }
        }
      });
      const centerSettingPanel = () => {
        if (!settingMenuPanelRef.value) {
          return;
        }
        const rect = settingMenuPanelRef.value.getBoundingClientRect();
        panelX.value = Math.max((windowSize.width.value - rect.width) / 2, 0);
        panelY.value = Math.max((windowSize.height.value - rect.height) / 2, 0);
      };
      const openSettingMenu = () => {
        showSettingMenu.value = true;
        queueMicrotask(() => {
          if (settingDialogRef.value && !settingDialogRef.value.open) {
            settingDialogRef.value.showModal();
          }
          vue.nextTick(() => {
            if (!settingDialogRef.value) {
              return;
            }
            settingMenuDragHandleRef.value = settingDialogRef.value.querySelector(".setting-menu__tabs");
            if (!hasInitializedSettingPanelPos.value) {
              centerSettingPanel();
              hasInitializedSettingPanelPos.value = true;
            }
          });
        });
      };
      const closeSettingMenu = () => {
        if (settingDialogRef.value?.open) {
          settingDialogRef.value.close();
        }
        showSettingMenu.value = false;
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createElementVNode("aside", _hoisted_1, [
            vue.createElementVNode("header", _hoisted_2, [
              vue.createElementVNode("div", _hoisted_3, [
                _cache[4] || (_cache[4] = vue.createElementVNode("h2", { class: "hot-sidebar__title" }, "微博热搜", -1)),
                vue.createElementVNode("button", {
                  class: "hot-sidebar__setting",
                  type: "button",
                  "aria-label": "打开设置",
                  onClick: openSettingMenu
                }, [
                  vue.createVNode(SettingAltLine, { class: "hot-sidebar__setting-icon" })
                ])
              ]),
              vue.createElementVNode("button", {
                class: "hot-sidebar__refresh",
                type: "button",
                disabled: isRefreshing.value,
                onClick: refreshCurrent
              }, [
                (vue.openBlock(), vue.createBlock(RefreshSolid, {
                  class: vue.normalizeClass(["hot-sidebar__refresh-icon", { "is-spinning": isRefreshing.value }]),
                  key: refreshIconKey.value
                }, null, 8, ["class"])),
                _cache[5] || (_cache[5] = vue.createElementVNode("span", null, vue.toDisplayString("点击刷新"), -1))
              ], 8, _hoisted_4)
            ]),
            vue.createElementVNode("div", _hoisted_5, [
              vue.createElementVNode("button", {
                class: vue.normalizeClass(["hot-sidebar__tab", { "is-active": activeSource.value === "mine" }]),
                type: "button",
                role: "tab",
                "aria-selected": activeSource.value === "mine",
                onClick: _cache[0] || (_cache[0] = ($event) => activeSource.value = "mine")
              }, " 我的 ", 10, _hoisted_6),
              vue.createElementVNode("button", {
                class: vue.normalizeClass(["hot-sidebar__tab", { "is-active": activeSource.value === "default" }]),
                type: "button",
                role: "tab",
                "aria-selected": activeSource.value === "default",
                onClick: _cache[1] || (_cache[1] = ($event) => activeSource.value = "default")
              }, " 热搜 ", 10, _hoisted_7)
            ]),
            vue.createElementVNode("div", _hoisted_8, [
              vue.createElementVNode("ul", _hoisted_9, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(currentList.value, (item) => {
                  return vue.openBlock(), vue.createElementBlock("li", {
                    key: `${activeSource.value}-${item.rank}-${item.word}`,
                    class: "hot-list__item"
                  }, [
                    vue.createElementVNode("span", {
                      class: vue.normalizeClass(["hot-list__rank", { "is-top3": item.rank <= 3 }])
                    }, vue.toDisplayString(item.rank), 3),
                    vue.createElementVNode("a", {
                      class: "hot-list__link",
                      href: buildWeiboSearchUrl(item.word),
                      title: item.word,
                      target: "_blank",
                      rel: "noopener noreferrer"
                    }, [
                      vue.createElementVNode("span", _hoisted_11, vue.toDisplayString(item.word), 1),
                      vue.createElementVNode("span", {
                        class: "hot-list__desc",
                        style: vue.normalizeStyle({ color: item.color || "var(--hot-color-desc)" })
                      }, vue.toDisplayString(item.desc), 5)
                    ], 8, _hoisted_10)
                  ]);
                }), 128))
              ]),
              _cache[6] || (_cache[6] = vue.createElementVNode("div", {
                class: "hot-list__end",
                "aria-hidden": "true"
              }, "—— END ——", -1))
            ])
          ]),
          vue.createElementVNode("dialog", {
            ref_key: "settingDialogRef",
            ref: settingDialogRef,
            class: "setting-menu-dialog",
            onClose: _cache[2] || (_cache[2] = ($event) => showSettingMenu.value = false),
            onCancel: _cache[3] || (_cache[3] = vue.withModifiers(() => {
            }, ["prevent"]))
          }, [
            vue.createElementVNode("div", {
              ref_key: "settingMenuPanelRef",
              ref: settingMenuPanelRef,
              class: "setting-menu-panel",
              style: vue.normalizeStyle([vue.unref(settingPanelDragStyle), { position: "fixed" }])
            }, [
              vue.createElementVNode("button", {
                class: "setting-menu-dialog__close",
                type: "button",
                "aria-label": "关闭设置",
                onClick: closeSettingMenu
              }, " × "),
              vue.createVNode(SettingMenu)
            ], 4)
          ], 544)
        ], 64);
      };
    }
  });
  const __unplugin_components_0 = _export_sfc(_sfc_main$1, [["__scopeId", "data-v-9febae30"]]);
  const _sfc_main = {};
  function _sfc_render(_ctx, _cache) {
    const _component_HotSearch = __unplugin_components_0;
    return vue.openBlock(), vue.createBlock(_component_HotSearch);
  }
  const App = _export_sfc(_sfc_main, [["render", _sfc_render]]);
  const css = "#__sidebar,.wbpro-side-main,#pl_feed_main .main-side,.m-main .main-side{display:none!important}#pl_common_scrollToTop .m-gotop{right:unset!important;left:calc(50vw + 566px)!important}";
  const main = async () => {
    logger.info("script start", location.href);
    if (location.hostname === "s.weibo.com" && location.pathname === "/") {
      logger.info("skip page", location.href);
      return;
    }
    const pinia = createPinia();
    void ensureAllRawStoresFresh(pinia, false);
    waitForHead().then(() => {
      const el = document.createElement("style");
      el.id = "no-shit";
      el.textContent = css;
      document.documentElement.appendChild(el);
    });
    waitForBody().then(() => {
      vue.createApp(App).use(pinia).mount(
        (() => {
          const app = document.createElement("div");
          document.body.append(app);
          return app;
        })()
      );
    });
  };
  main().catch((e) => {
    logger.error("Error in main:", e);
  });

})(Vue);