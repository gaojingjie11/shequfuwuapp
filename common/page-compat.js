const LIFECYCLE_KEYS = new Set([
  'onLoad',
  'onReady',
  'onShow',
  'onHide',
  'onUnload',
  'onPullDownRefresh',
  'onReachBottom',
  'onPageScroll',
  'onResize',
  'onTabItemTap',
  'onNavigationBarButtonTap',
  'onBackPress',
  'onShareAppMessage',
  'onShareTimeline'
]);

function deepClone(obj) {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map((it) => deepClone(it));
  if (typeof obj === 'object') {
    const out = {};
    Object.keys(obj).forEach((k) => {
      out[k] = deepClone(obj[k]);
    });
    return out;
  }
  return obj;
}

function parsePath(path) {
  return String(path)
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean);
}

function applyByPath(target, rawPath, value, vm) {
  const segs = parsePath(rawPath);
  if (segs.length === 0) return;

  let cur = target;
  for (let i = 0; i < segs.length - 1; i += 1) {
    const key = segs[i];
    const nextIsIndex = /^\d+$/.test(segs[i + 1]);
    if (cur[key] === undefined || cur[key] === null) {
      const initVal = nextIsIndex ? [] : {};
      if (vm && typeof vm.$set === 'function') {
        vm.$set(cur, key, initVal);
      } else {
        cur[key] = initVal;
      }
    }
    cur = cur[key];
  }

  const last = segs[segs.length - 1];
  if (vm && typeof vm.$set === 'function') {
    vm.$set(cur, last, value);
  } else {
    cur[last] = value;
  }
}

function createPage(pageDef) {
  const def = pageDef && pageDef.default ? pageDef.default : pageDef || {};

  const vueDef = {
    data() {
      return deepClone(def.data || {});
    },
    methods: {
      setData(patch, cb) {
        if (!patch || typeof patch !== 'object') {
          if (typeof cb === 'function') this.$nextTick(() => cb.call(this));
          return;
        }
        Object.keys(patch).forEach((k) => applyByPath(this, k, patch[k], this));
        if (typeof cb === 'function') {
          this.$nextTick(() => cb.call(this));
        }
      }
    },
    beforeCreate() {
      Object.defineProperty(this, 'data', {
        configurable: true,
        enumerable: false,
        get: () => this.$data
      });
    }
  };

  Object.keys(def).forEach((key) => {
    if (key === 'data') return;
    const val = def[key];
    if (typeof val === 'function') {
      if (LIFECYCLE_KEYS.has(key)) {
        vueDef[key] = val;
      } else {
        vueDef.methods[key] = val;
      }
      return;
    }
    vueDef[key] = val;
  });

  return vueDef;
}

export { createPage };
