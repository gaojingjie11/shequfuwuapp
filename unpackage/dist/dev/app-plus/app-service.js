if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const LIFECYCLE_KEYS = /* @__PURE__ */ new Set([
    "onLoad",
    "onReady",
    "onShow",
    "onHide",
    "onUnload",
    "onPullDownRefresh",
    "onReachBottom",
    "onPageScroll",
    "onResize",
    "onTabItemTap",
    "onNavigationBarButtonTap",
    "onBackPress",
    "onShareAppMessage",
    "onShareTimeline"
  ]);
  function deepClone(obj) {
    if (obj === null || obj === void 0)
      return obj;
    if (Array.isArray(obj))
      return obj.map((it) => deepClone(it));
    if (typeof obj === "object") {
      const out = {};
      Object.keys(obj).forEach((k) => {
        out[k] = deepClone(obj[k]);
      });
      return out;
    }
    return obj;
  }
  function parsePath(path) {
    return String(path).replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
  }
  function applyByPath(target, rawPath, value, vm) {
    const segs = parsePath(rawPath);
    if (segs.length === 0)
      return;
    let cur = target;
    for (let i = 0; i < segs.length - 1; i += 1) {
      const key = segs[i];
      const nextIsIndex = /^\d+$/.test(segs[i + 1]);
      if (cur[key] === void 0 || cur[key] === null) {
        const initVal = nextIsIndex ? [] : {};
        if (vm && typeof vm.$set === "function") {
          vm.$set(cur, key, initVal);
        } else {
          cur[key] = initVal;
        }
      }
      cur = cur[key];
    }
    const last = segs[segs.length - 1];
    if (vm && typeof vm.$set === "function") {
      vm.$set(cur, last, value);
    } else {
      cur[last] = value;
    }
  }
  function createPage(pageDef2) {
    const def = pageDef2 && pageDef2.default ? pageDef2.default : pageDef2 || {};
    const vueDef = {
      data() {
        return deepClone(def.data || {});
      },
      methods: {
        setData(patch, cb) {
          if (!patch || typeof patch !== "object") {
            if (typeof cb === "function")
              this.$nextTick(() => cb.call(this));
            return;
          }
          Object.keys(patch).forEach((k) => applyByPath(this, k, patch[k], this));
          if (typeof cb === "function") {
            this.$nextTick(() => cb.call(this));
          }
        }
      },
      beforeCreate() {
        Object.defineProperty(this, "data", {
          configurable: true,
          enumerable: false,
          get: () => this.$data
        });
      }
    };
    Object.keys(def).forEach((key) => {
      if (key === "data")
        return;
      const val = def[key];
      if (typeof val === "function") {
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
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const BASE_URL = "http://42.193.104.173:8082/api/v1";
  const normalizeErrorMessage = (msg, fallback = "请求失败") => {
    const text = String(msg || "").trim();
    if (!text)
      return fallback;
    if (/invalid payment password/i.test(text)) {
      return "支付密码错误，请重试";
    }
    return text;
  };
  const request = (options) => {
    return new Promise((resolve, reject) => {
      const token = uni.getStorageSync("token");
      const hasToken = !!token;
      const header = {
        "Content-Type": "application/json",
        ...options.header
      };
      if (token) {
        header.Authorization = `Bearer ${token}`;
      }
      uni.request({
        url: `${BASE_URL}${options.url}`,
        method: options.method || "GET",
        data: options.data,
        timeout: options.timeout || 7e3,
        header,
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const data = res.data || {};
            if (data.code === 200) {
              resolve(data.data);
              return;
            }
            if (data.code === 401) {
              if (hasToken) {
                uni.removeStorageSync("token");
                uni.redirectTo({ url: "/pages/auth/login" });
              }
              reject(data);
              return;
            }
            uni.showToast({
              title: normalizeErrorMessage(data.msg, "请求失败"),
              icon: "none"
            });
            reject(data);
            return;
          }
          if (res.statusCode === 401) {
            if (hasToken) {
              uni.removeStorageSync("token");
              uni.redirectTo({ url: "/pages/auth/login" });
            }
          }
          const responseData = res && res.data ? res.data : {};
          uni.showToast({
            title: normalizeErrorMessage(responseData.msg || responseData.message, "请求失败"),
            icon: "none"
          });
          reject(res);
        },
        fail: (err) => {
          uni.showToast({
            title: "网络错误",
            icon: "none"
          });
          reject(err);
        }
      });
    });
  };
  const __dep2$1 = {
    // 获取公告列表
    getNoticeList(params, options = {}) {
      return request({
        url: "/notices",
        method: "GET",
        data: params,
        ...options
      });
    },
    // 获取公告详情
    getNoticeDetail(id) {
      return request({
        url: `/notice/${id}`,
        method: "GET"
      });
    },
    // 标记公告已读
    readNotice(id) {
      return request({
        url: `/notice/read/${id}`,
        method: "POST"
      });
    },
    // 创建报修
    createRepair(data) {
      return request({
        url: "/repair/create",
        method: "POST",
        data
      });
    },
    // 获取报修列表
    getRepairList(params) {
      return request({
        url: "/repair/list",
        method: "GET",
        data: params
      });
    },
    // 创建访客登记
    createVisitor(data) {
      return request({
        url: "/visitor/create",
        method: "POST",
        data
      });
    },
    // 获取访客列表
    getVisitorList(params) {
      return request({
        url: "/visitor/list",
        method: "GET",
        data: params
      });
    },
    // 获取我的车位
    getMyParking() {
      return request({
        url: "/parking/my",
        method: "GET"
      });
    },
    // 绑定车牌
    bindCar(data) {
      return request({
        url: "/parking/bind",
        method: "POST",
        data
      });
    },
    // 获取物业费列表
    getPropertyFeeList(params) {
      return request({
        url: "/property/list",
        method: "GET",
        data: params
      });
    },
    // 缴纳物业费
    payPropertyFee(data) {
      return request({
        url: "/finance/pay",
        method: "POST",
        data: {
          business_id: data.related_id,
          pay_type: 2,
          password: data.password || ""
        }
      });
    },
    // 获取门店列表
    getStoreList() {
      return request({
        url: "/stores",
        method: "GET"
      });
    }
  };
  const formatTime$5 = (date, withSeconds = true) => {
    if (typeof date === "string") {
      date = new Date(date);
    }
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const part1 = [year, month, day].map(formatNumber).join("/");
    const part2 = [hour, minute, second].map(formatNumber).join(":");
    return withSeconds ? `${part1} ${part2}` : `${part1} ${part2.substring(0, 5)}`;
  };
  const formatNumber = (n) => {
    n = n.toString();
    return n[1] ? n : `0${n}`;
  };
  const __dep3$2 = {
    formatTime: formatTime$5
  };
  const { getNoticeList: getNoticeList$1 } = __dep2$1;
  const { formatTime: formatTime$4 } = __dep3$2;
  const pageDef$l = {
    data: {
      notices: [],
      noticeLoaded: false
    },
    onShow() {
      if (!this.data.noticeLoaded) {
        this.getNotices();
      }
    },
    async getNotices() {
      try {
        const res = await getNoticeList$1({
          page: 1,
          size: 5
        }, {
          timeout: 4e3
        });
        let list = [];
        if (Array.isArray(res)) {
          list = res;
        } else if (res && res.list) {
          list = res.list;
        }
        list = list.map((item) => {
          const date = new Date(item.created_at);
          const isValid = !isNaN(date.getTime()) && date.getFullYear() > 2e3;
          return {
            ...item,
            created_at: isValid ? formatTime$4(date) : ""
          };
        });
        this.setData({
          notices: list.slice(0, 5),
          noticeLoaded: true
        });
      } catch (err) {
        formatAppLog("error", "at pages/home/index.page.js:54", err);
        this.setData({ noticeLoaded: true });
      }
    },
    goToNotice(e) {
      const id = e.currentTarget.dataset.id;
      uni.navigateTo({
        url: `/pages/service/notice?id=${id}`
      });
    },
    showTip() {
      uni.showToast({
        title: "请在PC端查看数据大屏",
        icon: "none"
      });
    }
  };
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$m = createPage(pageDef$l);
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "home-page" }, [
      vue.createElementVNode("view", { class: "banner" }, [
        vue.createElementVNode("view", { class: "container" }, [
          vue.createElementVNode("view", { class: "banner-title" }, "欢迎来到智慧社区"),
          vue.createElementVNode("view", { class: "banner-subtitle" }, "让生活更便捷、更智能、更美好")
        ])
      ]),
      vue.createElementVNode("view", { class: "container" }, [
        vue.createElementVNode("view", { class: "quick-menu" }, [
          vue.createElementVNode("navigator", {
            url: "/pages/mall/index",
            "open-type": "switchTab",
            class: "quick-item"
          }, [
            vue.createElementVNode("view", { class: "quick-icon" }, "📦"),
            vue.createElementVNode("view", { class: "quick-text" }, "社区商城")
          ]),
          vue.createElementVNode("navigator", {
            url: "/pages/service/notice",
            class: "quick-item"
          }, [
            vue.createElementVNode("view", { class: "quick-icon" }, "📙"),
            vue.createElementVNode("view", { class: "quick-text" }, "公告通知")
          ]),
          vue.createElementVNode("navigator", {
            url: "/pages/service/repair",
            class: "quick-item"
          }, [
            vue.createElementVNode("view", { class: "quick-icon" }, "🔧"),
            vue.createElementVNode("view", { class: "quick-text" }, "报修投诉")
          ]),
          vue.createElementVNode("navigator", {
            url: "/pages/service/visitor",
            class: "quick-item"
          }, [
            vue.createElementVNode("view", { class: "quick-icon" }, "👥"),
            vue.createElementVNode("view", { class: "quick-text" }, "访客登记")
          ]),
          vue.createElementVNode("navigator", {
            url: "/pages/service/green-points",
            class: "quick-item"
          }, [
            vue.createElementVNode("view", { class: "quick-icon" }, "🏆"),
            vue.createElementVNode("view", { class: "quick-text" }, "绿色积分")
          ]),
          vue.createElementVNode("navigator", {
            url: "/pages/chat/index",
            class: "quick-item"
          }, [
            vue.createElementVNode("view", { class: "quick-icon" }, "🤖"),
            vue.createElementVNode("view", { class: "quick-text" }, "AI 对话")
          ]),
          vue.createElementVNode("navigator", {
            url: "/pages/service/community-chat",
            class: "quick-item"
          }, [
            vue.createElementVNode("view", { class: "quick-icon" }, "💬"),
            vue.createElementVNode("view", { class: "quick-text" }, "社区群聊")
          ])
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-title" }, "最新公告"),
          vue.createElementVNode("view", { class: "notice-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(_ctx.notices, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item.id,
                  class: "notice-item card",
                  onClick: _cache[0] || (_cache[0] = (...args) => _ctx.goToNotice && _ctx.goToNotice(...args)),
                  "data-id": item.id
                }, [
                  vue.createElementVNode(
                    "view",
                    { class: "notice-title" },
                    vue.toDisplayString(item.title),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "notice-meta" }, [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(item.publisher),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(item.created_at),
                      1
                      /* TEXT */
                    )
                  ])
                ], 8, ["data-id"]);
              }),
              128
              /* KEYED_FRAGMENT */
            )),
            _ctx.notices.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "empty-state"
            }, [
              vue.createElementVNode("text", null, "暂无公告")
            ])) : vue.createCommentVNode("v-if", true)
          ])
        ])
      ])
    ]);
  }
  const PagesHomeIndex = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$l], ["__file", "C:/Users/30776/Desktop/shequapp/shequ-android-uniapp/pages/home/index.vue"]]);
  const __dep1$6 = {
    // 获取商品列表
    getProductList(params) {
      return request({
        url: "/products",
        method: "GET",
        data: params
      });
    },
    // 获取商品详情
    getProductDetail(id) {
      return request({
        url: `/product/${id}`,
        method: "GET"
      });
    },
    // 添加收藏
    addFavorite(productId) {
      return request({
        url: "/favorite/add",
        method: "POST",
        data: { product_id: productId }
      });
    },
    // 取消收藏
    removeFavorite(productId) {
      return request({
        url: "/favorite/delete",
        method: "POST",
        data: { product_id: productId }
      });
    },
    // 获取收藏列表
    getFavoriteList() {
      return request({
        url: "/favorites",
        method: "GET"
      });
    },
    // 检查是否收藏
    checkFavorite(productId) {
      return request({
        url: "/favorite/check",
        method: "GET",
        data: { product_id: productId }
      });
    },
    // 获取分类列表
    getCategories() {
      return request({
        url: "/categories",
        method: "GET"
      });
    }
  };
  const { getProductList, getCategories } = __dep1$6;
  const pageDef$k = {
    data: {
      products: [],
      categories: [],
      searchKeyword: "",
      selectedCategory: 0,
      page: 1,
      size: 10,
      total: 0,
      loading: false
    },
    isProductOnline(product) {
      if (!product || typeof product !== "object")
        return false;
      if (product.status !== void 0 && product.status !== null) {
        return Number(product.status) === 1;
      }
      if (product.is_on_sale !== void 0 && product.is_on_sale !== null) {
        return Number(product.is_on_sale) === 1;
      }
      if (product.is_active !== void 0 && product.is_active !== null) {
        return Number(product.is_active) === 1;
      }
      return true;
    },
    onLoad() {
      this.getCategories();
      this.getProducts(true);
    },
    onPullDownRefresh() {
      this.setData({ page: 1 });
      this.getProducts(true).then(() => {
        uni.stopPullDownRefresh();
      });
    },
    onReachBottom() {
      if (this.data.products.length < this.data.total) {
        this.setData({ page: this.data.page + 1 });
        this.getProducts();
      }
    },
    onSearchInput(e) {
      this.setData({ searchKeyword: e.detail.value });
    },
    handleSearch() {
      this.setData({ page: 1 });
      this.getProducts(true);
    },
    selectCategory(e) {
      const id = e.currentTarget.dataset.id;
      if (this.data.selectedCategory === id)
        return;
      this.setData({ selectedCategory: id, page: 1 });
      this.getProducts(true);
    },
    async getCategories() {
      try {
        const res = await getCategories();
        this.setData({ categories: res || [] });
      } catch (e) {
        formatAppLog("error", "at pages/mall/index.page.js:75", e);
      }
    },
    async getProducts(reset = false) {
      if (this.data.loading)
        return;
      this.setData({ loading: true });
      try {
        const { searchKeyword, selectedCategory, page, size } = this.data;
        const params = {
          page,
          size,
          status: 1
        };
        if (searchKeyword) {
          params.name = searchKeyword;
        }
        if (selectedCategory > 0) {
          params.category_id = selectedCategory;
        }
        const res = await getProductList(params);
        let list = [];
        let total = 0;
        if (Array.isArray(res)) {
          list = res;
          total = res.length;
        } else if (res && (res.list || Array.isArray(res.list))) {
          list = res.list || [];
          total = res.total || 0;
        }
        const mappedList = list.filter((item) => this.isProductOnline(item)).map((item) => item);
        if (reset) {
          this.setData({ products: mappedList, total });
        } else {
          this.setData({ products: [...this.data.products, ...mappedList], total });
        }
      } catch (e) {
        formatAppLog("error", "at pages/mall/index.page.js:125", e);
      } finally {
        this.setData({ loading: false });
      }
    }
  };
  const _sfc_main$l = createPage(pageDef$k);
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "mall-page" }, [
      vue.createElementVNode("view", { class: "top-panel" }, [
        vue.createElementVNode("view", { class: "panel-title" }, "社区商城"),
        vue.createElementVNode("view", { class: "search-bar" }, [
          vue.createElementVNode("text", { class: "search-icon" }, "🔍"),
          vue.createElementVNode("input", {
            class: "search-input",
            placeholder: "搜索商品",
            "confirm-type": "search",
            onConfirm: _cache[0] || (_cache[0] = (...args) => _ctx.handleSearch && _ctx.handleSearch(...args)),
            onInput: _cache[1] || (_cache[1] = (...args) => _ctx.onSearchInput && _ctx.onSearchInput(...args)),
            value: _ctx.searchKeyword
          }, null, 40, ["value"])
        ])
      ]),
      vue.createElementVNode("scroll-view", {
        "scroll-x": "",
        class: "category-scroll",
        "enable-flex": ""
      }, [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass("category-item " + (_ctx.selectedCategory === 0 ? "active" : "")),
            onClick: _cache[2] || (_cache[2] = (...args) => _ctx.selectCategory && _ctx.selectCategory(...args)),
            "data-id": 0
          },
          " 全部 ",
          2
          /* CLASS */
        ),
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList(_ctx.categories, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: item.id,
              class: vue.normalizeClass("category-item " + (_ctx.selectedCategory === item.id ? "active" : "")),
              onClick: _cache[3] || (_cache[3] = (...args) => _ctx.selectCategory && _ctx.selectCategory(...args)),
              "data-id": item.id
            }, vue.toDisplayString(item.name), 11, ["data-id"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createElementVNode("view", { class: "product-grid" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList(_ctx.products, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("navigator", {
              key: item.id,
              url: "/pages/mall/detail?id=" + item.id,
              class: "product-card"
            }, [
              vue.createElementVNode("image", {
                class: "product-img",
                src: item.image_url || "/assets/icons/mall.png",
                mode: "aspectFill"
              }, null, 8, ["src"]),
              vue.createElementVNode("view", { class: "product-info" }, [
                vue.createElementVNode(
                  "view",
                  { class: "product-name" },
                  vue.toDisplayString(item.name),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "product-bottom" }, [
                  vue.createElementVNode("view", { class: "product-price" }, [
                    vue.createElementVNode("text", { class: "price-symbol" }, "¥"),
                    vue.createElementVNode(
                      "text",
                      { class: "price-val" },
                      vue.toDisplayString(item.price),
                      1
                      /* TEXT */
                    )
                  ]),
                  item.is_promotion ? (vue.openBlock(), vue.createElementBlock("text", {
                    key: 0,
                    class: "promo-tag"
                  }, "促销")) : vue.createCommentVNode("v-if", true)
                ])
              ])
            ], 8, ["url"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      _ctx.loading ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "loading-more"
      }, "加载中...")) : vue.createCommentVNode("v-if", true),
      !_ctx.loading && _ctx.products.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "empty-state"
      }, "暂无商品")) : vue.createCommentVNode("v-if", true),
      !_ctx.loading && _ctx.products.length > 0 && _ctx.products.length >= _ctx.total ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "no-more"
      }, "没有更多了")) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesMallIndex = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$k], ["__file", "C:/Users/30776/Desktop/shequapp/shequ-android-uniapp/pages/mall/index.vue"]]);
  const __dep1$5 = {
    // 添加到购物车
    addToCart(data) {
      return request({
        url: "/cart/add",
        method: "POST",
        data
      });
    },
    // 获取购物车列表
    getCartList() {
      return request({
        url: "/cart/list",
        method: "GET"
      });
    },
    // 删除购物车项
    deleteCartItem(id) {
      return request({
        url: `/cart/${id}`,
        method: "DELETE"
      });
    },
    // 修改购物车数量
    updateCartQuantity(id, quantity) {
      return request({
        url: `/cart/${id}`,
        method: "POST",
        data: { quantity }
      });
    },
    // 创建订单
    createOrder(data) {
      return request({
        url: "/order/create",
        method: "POST",
        data
      });
    },
    // 获取订单列表
    getOrderList(params) {
      return request({
        url: "/order/list",
        method: "GET",
        data: params
        // uni.request uses 'data' for query params in GET
      });
    },
    // 支付订单
    payOrder(data) {
      return request({
        url: "/finance/pay",
        method: "POST",
        data: {
          business_id: data.order_id,
          pay_type: 1,
          password: data.password || ""
        }
      });
    },
    // 取消订单
    cancelOrder(orderId) {
      return request({
        url: "/order/cancel",
        method: "POST",
        data: { id: orderId }
      });
    },
    // 确认收货
    receiveOrder(id) {
      return request({
        url: "/order/receive",
        method: "POST",
        data: { id }
      });
    },
    // 获取订单详情
    getOrderDetail(id) {
      return request({
        url: "/order/detail",
        method: "GET",
        data: { id }
      });
    }
  };
  const __dep3$1 = {
    // 获取评论列表
    getCommentList(params) {
      return request({
        url: "/comments",
        method: "GET",
        data: params
      });
    },
    // 发表评论
    createComment(data) {
      return request({
        url: "/comment/create",
        method: "POST",
        data
      });
    }
  };
  const { getProductDetail, addFavorite, removeFavorite: removeFavorite$1, checkFavorite } = __dep1$6;
  const { addToCart } = __dep1$5;
  const { getCommentList } = __dep3$1;
  const pageDef$j = {
    data: {
      product: {},
      isFavorite: false,
      comments: [],
      page: 1,
      size: 10,
      total: 0
    },
    onLoad(options) {
      if (options.id) {
        this.getProductDetail(options.id);
        this.getComments(options.id);
        this.checkFavorite(options.id);
      }
    },
    async getProductDetail(id) {
      try {
        const res = await getProductDetail(id);
        this.setData({ product: res });
      } catch (e) {
        formatAppLog("error", "at pages/mall/detail.page.js:32", e);
      }
    },
    async getComments(id) {
      try {
        const res = await getCommentList({
          product_id: id,
          page: this.data.page,
          size: this.data.size
        });
        const list = (res.list || res || []).map((item) => ({
          ...item,
          created_at: this.formatCommentTime(item.created_at)
        }));
        this.setData({ comments: list });
      } catch (e) {
        formatAppLog("error", "at pages/mall/detail.page.js:49", e);
      }
    },
    formatCommentTime(value) {
      if (!value)
        return "";
      const date = new Date(value);
      if (Number.isNaN(date.getTime()))
        return String(value);
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const hh = String(date.getHours()).padStart(2, "0");
      const mi = String(date.getMinutes()).padStart(2, "0");
      return `${mm}-${dd} ${hh}:${mi}`;
    },
    async checkFavorite(id) {
      try {
        const res = await checkFavorite(id);
        this.setData({ isFavorite: res.is_favorite });
      } catch (e) {
        formatAppLog("error", "at pages/mall/detail.page.js:70", e);
      }
    },
    async toggleFavorite() {
      if (!this.data.product)
        return;
      const id = this.data.product.id;
      try {
        if (this.data.isFavorite) {
          await removeFavorite$1(id);
          this.setData({ isFavorite: false });
          uni.showToast({ title: "已取消", icon: "none" });
        } else {
          await addFavorite(id);
          this.setData({ isFavorite: true });
          uni.showToast({ title: "已收藏", icon: "none" });
        }
      } catch (e) {
        formatAppLog("error", "at pages/mall/detail.page.js:88", e);
        uni.showToast({ title: "操作失败", icon: "none" });
      }
    },
    async addToCart() {
      if (!this.data.product)
        return;
      try {
        await addToCart({
          product_id: this.data.product.id,
          quantity: 1
        });
        uni.showToast({ title: "已加入购物车" });
      } catch (e) {
        formatAppLog("error", "at pages/mall/detail.page.js:102", e);
      }
    }
  };
  const _sfc_main$k = createPage(pageDef$j);
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "detail-page" }, [
      vue.createElementVNode("image", {
        class: "detail-image",
        src: _ctx.product.image_url || "/assets/icons/mall.png",
        mode: "aspectFill"
      }, null, 8, ["src"]),
      vue.createElementVNode("view", { class: "detail-info card" }, [
        vue.createElementVNode(
          "view",
          { class: "detail-title" },
          vue.toDisplayString(_ctx.product.name),
          1
          /* TEXT */
        ),
        vue.createElementVNode(
          "view",
          { class: "detail-desc" },
          vue.toDisplayString(_ctx.product.description),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "detail-price" }, [
          vue.createElementVNode("text", { class: "price-symbol" }, "¥"),
          vue.createElementVNode(
            "text",
            { class: "price-val" },
            vue.toDisplayString(_ctx.product.price),
            1
            /* TEXT */
          ),
          _ctx.product.original_price ? (vue.openBlock(), vue.createElementBlock(
            "text",
            {
              key: 0,
              class: "price-original"
            },
            "¥" + vue.toDisplayString(_ctx.product.original_price),
            1
            /* TEXT */
          )) : vue.createCommentVNode("v-if", true),
          _ctx.product.is_promotion ? (vue.openBlock(), vue.createElementBlock("text", {
            key: 1,
            class: "promo-tag"
          }, "促销中")) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", { class: "detail-meta" }, [
          vue.createElementVNode(
            "view",
            { class: "meta-item" },
            "销量: " + vue.toDisplayString(_ctx.product.sales),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "view",
            { class: "meta-item" },
            "库存: " + vue.toDisplayString(_ctx.product.stock),
            1
            /* TEXT */
          )
        ])
      ]),
      vue.createElementVNode("view", { class: "comments-section card" }, [
        vue.createElementVNode("view", { class: "section-title" }, "商品评价"),
        vue.createElementVNode("view", { class: "comment-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList(_ctx.comments, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: item.id,
                class: "comment-item"
              }, [
                vue.createElementVNode("image", {
                  class: "comment-avatar",
                  src: item.user.avatar || "/assets/icons/user.png"
                }, null, 8, ["src"]),
                vue.createElementVNode("view", { class: "comment-body" }, [
                  vue.createElementVNode("view", { class: "comment-header" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "username" },
                      vue.toDisplayString(item.user.real_name || item.user.username || "匿名用户"),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "time" },
                      vue.toDisplayString(item.created_at),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode(
                    "view",
                    { class: "comment-content" },
                    vue.toDisplayString(item.content),
                    1
                    /* TEXT */
                  )
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          _ctx.comments.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "empty-comment"
          }, "暂无评价")) : vue.createCommentVNode("v-if", true)
        ])
      ]),
      vue.createElementVNode("view", { class: "bottom-bar" }, [
        vue.createElementVNode(
          "button",
          {
            class: vue.normalizeClass("action-btn " + (_ctx.isFavorite ? "fav-active" : "")),
            onClick: _cache[0] || (_cache[0] = (...args) => _ctx.toggleFavorite && _ctx.toggleFavorite(...args))
          },
          [
            vue.createElementVNode(
              "text",
              { class: "icon-star" },
              vue.toDisplayString(_ctx.isFavorite ? "★" : "☆"),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString(_ctx.isFavorite ? "已收藏" : "收藏"),
              1
              /* TEXT */
            )
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode("button", {
          class: "action-btn btn-cart",
          onClick: _cache[1] || (_cache[1] = (...args) => _ctx.addToCart && _ctx.addToCart(...args))
        }, "加入购物车")
      ])
    ]);
  }
  const PagesMallDetail = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$j], ["__file", "C:/Users/30776/Desktop/shequapp/shequ-android-uniapp/pages/mall/detail.vue"]]);
  const { getCartList: getCartList$1, updateCartQuantity, deleteCartItem } = __dep1$5;
  const pageDef$i = {
    data: {
      cartItems: [],
      totalPrice: "0.00"
    },
    onShow() {
      this.getCartList();
    },
    async getCartList() {
      try {
        const res = await getCartList$1();
        this.setData({ cartItems: res || [] });
        this.calculateTotal();
      } catch (e) {
        formatAppLog("error", "at pages/mall/cart.page.js:21", e);
      }
    },
    calculateTotal() {
      let total = 0;
      this.data.cartItems.forEach((item) => {
        const price = parseFloat(item.product.price) || 0;
        total += price * item.quantity;
      });
      this.setData({ totalPrice: total.toFixed(2) });
    },
    async updateQuantity(e) {
      const { index, delta } = e.currentTarget.dataset;
      const item = this.data.cartItems[index];
      const newQty = item.quantity + delta;
      if (newQty < 1)
        return;
      const up = `cartItems[${index}].quantity`;
      this.setData({ [up]: newQty });
      this.calculateTotal();
      try {
        await updateCartQuantity(item.id, newQty);
      } catch (e2) {
        this.setData({ [up]: item.quantity });
        this.calculateTotal();
        formatAppLog("error", "at pages/mall/cart.page.js:53", e2);
      }
    },
    async deleteItem(e) {
      const { id } = e.currentTarget.dataset;
      try {
        await deleteCartItem(id);
        this.getCartList();
      } catch (e2) {
        formatAppLog("error", "at pages/mall/cart.page.js:63", e2);
      }
    },
    checkout() {
      if (this.data.cartItems.length === 0)
        return;
      uni.navigateTo({
        url: "/pages/order/create"
      });
    }
  };
  const _sfc_main$j = createPage(pageDef$i);
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "cart-page" }, [
      _ctx.cartItems.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "cart-list"
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList(_ctx.cartItems, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: item.id,
              class: "cart-item card"
            }, [
              vue.createElementVNode("view", { class: "item-main" }, [
                vue.createElementVNode("image", {
                  class: "item-image",
                  src: item.product.image_url || "/assets/icons/mall.png",
                  mode: "aspectFill"
                }, null, 8, ["src"]),
                vue.createElementVNode("view", { class: "item-info" }, [
                  vue.createElementVNode(
                    "view",
                    { class: "item-name" },
                    vue.toDisplayString(item.product.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    { class: "item-price" },
                    "单价 ¥" + vue.toDisplayString(item.product.price),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", {
                  class: "delete-btn",
                  onClick: _cache[0] || (_cache[0] = (...args) => _ctx.deleteItem && _ctx.deleteItem(...args)),
                  "data-id": item.id
                }, "删除", 8, ["data-id"])
              ]),
              vue.createElementVNode("view", { class: "item-bottom" }, [
                vue.createElementVNode(
                  "view",
                  { class: "subtotal" },
                  "小计 ¥" + vue.toDisplayString(((parseFloat(item.product.price) || 0) * item.quantity).toFixed(2)),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "quantity-control" }, [
                  vue.createElementVNode("view", {
                    class: "qty-btn",
                    onClick: _cache[1] || (_cache[1] = (...args) => _ctx.updateQuantity && _ctx.updateQuantity(...args)),
                    "data-index": index,
                    "data-delta": -1
                  }, "-", 8, ["data-index"]),
                  vue.createElementVNode(
                    "view",
                    { class: "qty-num" },
                    vue.toDisplayString(item.quantity),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", {
                    class: "qty-btn qty-plus",
                    onClick: _cache[2] || (_cache[2] = (...args) => _ctx.updateQuantity && _ctx.updateQuantity(...args)),
                    "data-index": index,
                    "data-delta": 1
                  }, "+", 8, ["data-index"])
                ])
              ])
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "empty-state"
      }, [
        vue.createElementVNode("view", { class: "empty-icon" }, "🛍️"),
        vue.createElementVNode("view", { class: "empty-title" }, "购物车还是空的"),
        vue.createElementVNode("view", { class: "empty-desc" }, "把想买的商品先加入购物车吧"),
        vue.createElementVNode("navigator", {
          url: "/pages/mall/index",
          "open-type": "switchTab",
          class: "btn btn-primary empty-btn"
        }, "去逛商城")
      ])),
      _ctx.cartItems.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "cart-footer"
      }, [
        vue.createElementVNode("view", { class: "total-info" }, [
          vue.createElementVNode("text", { class: "total-label" }, "合计"),
          vue.createElementVNode(
            "text",
            { class: "total-price" },
            "¥" + vue.toDisplayString(_ctx.totalPrice),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("button", {
          class: "btn btn-primary checkout-btn",
          onClick: _cache[3] || (_cache[3] = (...args) => _ctx.checkout && _ctx.checkout(...args))
        }, "结算")
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesMallCart = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$i], ["__file", "C:/Users/30776/Desktop/shequapp/shequ-android-uniapp/pages/mall/cart.vue"]]);
  const pageDef$h = {
    data: {
      menuList: [
        { name: "公告通知", icon: "📙", desc: "查看社区最新公告", url: "/pages/service/notice" },
        { name: "报修投诉", icon: "🔧", desc: "提交报修与投诉", url: "/pages/service/repair" },
        { name: "访客登记", icon: "👥", desc: "登记访客信息", url: "/pages/service/visitor" },
        { name: "车位管理", icon: "🅿️", desc: "查看和绑定车位", url: "/pages/service/parking" },
        { name: "物业费缴纳", icon: "💳", desc: "物业费在线支付", url: "/pages/service/property" },
        { name: "绿色积分", icon: "🏆", desc: "上传照片得积分与排行", url: "/pages/service/green-points" },
        { name: "社区群聊", icon: "💬", desc: "和邻居实时交流消息", url: "/pages/service/community-chat" },
        { name: "AI 对话", icon: "🤖", desc: "智能问答与服务办理", url: "/pages/chat/index" },
        { name: "购物车", icon: "📦", desc: "查看购物车并结算", url: "/pages/mall/cart" }
      ]
    },
    handleTap(e) {
      const item = this.data.menuList.find((i) => i.url === e.currentTarget.dataset.url);
      if (item && item.isTab) {
        uni.switchTab({ url: item.url });
        return;
      }
      uni.navigateTo({ url: e.currentTarget.dataset.url });
    }
  };
  const _sfc_main$i = createPage(pageDef$h);
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "service-page" }, [
      vue.createElementVNode("view", { class: "container" }, [
        vue.createElementVNode("view", { class: "page-title" }, "社区服务"),
        vue.createElementVNode("view", { class: "service-menu" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList(_ctx.menuList, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: item.name,
                class: "service-card card",
                onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleTap && _ctx.handleTap(...args)),
                "data-url": item.url
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "service-icon" },
                  vue.toDisplayString(item.icon),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "service-name" },
                  vue.toDisplayString(item.name),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "service-desc" },
                  vue.toDisplayString(item.desc),
                  1
                  /* TEXT */
                )
              ], 8, ["data-url"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])
    ]);
  }
  const PagesServiceIndex = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__file", "C:/Users/30776/Desktop/shequapp/shequ-android-uniapp/pages/service/index.vue"]]);
  const __dep1$4 = {
    getCommunityMessages(params) {
      return request({
        url: "/community/messages",
        method: "GET",
        data: params
      });
    },
    sendCommunityMessage(data) {
      return request({
        url: "/community/message",
        method: "POST",
        data
      });
    }
  };
  const __dep2 = {
    getUserInfo() {
      return request({
        url: "/user/info",
        method: "GET"
      });
    },
    updateUserInfo(data) {
      return request({
        url: "/user/update",
        method: "POST",
        data
      });
    },
    changePassword(data) {
      return request({
        url: "/user/change_password",
        method: "POST",
        data
      });
    }
  };
  const { getCommunityMessages, sendCommunityMessage } = __dep1$4;
  const { getUserInfo: getUserInfo$5 } = __dep2;
  const POLL_INTERVAL = 5e3;
  const DEFAULT_AVATAR = "/assets/icons/user.png";
  function formatChatTime(value) {
    if (!value)
      return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime()))
      return "";
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mi = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${mm}-${dd} ${hh}:${mi}:${ss}`;
  }
  const pageDef$g = {
    data: {
      messages: [],
      draft: "",
      canSend: false,
      loading: false,
      sending: false,
      currentUserId: 0,
      lastMessageId: "",
      defaultAvatar: DEFAULT_AVATAR
    },
    onLoad() {
      this._pollTimer = null;
    },
    async onShow() {
      await this.ensureCurrentUser();
      await this.fetchMessages();
      this.startPolling();
    },
    onHide() {
      this.stopPolling();
    },
    onUnload() {
      this.stopPolling();
    },
    async onPullDownRefresh() {
      try {
        await this.fetchMessages();
      } finally {
        uni.stopPullDownRefresh();
      }
    },
    async ensureCurrentUser() {
      if (this.data.currentUserId > 0)
        return;
      try {
        const user = await getUserInfo$5();
        this.setData({
          currentUserId: Number(user && user.id || 0)
        });
      } catch (e) {
        formatAppLog("error", "at pages/service/community-chat.page.js:69", "failed to load current user", e);
      }
    },
    startPolling() {
      if (this._pollTimer)
        return;
      this._pollTimer = setInterval(() => {
        this.fetchMessages({ silent: true });
      }, POLL_INTERVAL);
    },
    stopPolling() {
      if (!this._pollTimer)
        return;
      clearInterval(this._pollTimer);
      this._pollTimer = null;
    },
    normalizeMessages(list) {
      const currentUserId = Number(this.data.currentUserId || 0);
      return list.map((item, index) => {
        const uid = Number(item && item.user_id || 0);
        const user = item && item.user || {};
        return {
          id: item.id,
          user_id: uid,
          content: item && item.content || "",
          created_at: item.created_at,
          timeText: formatChatTime(item.created_at),
          avatar: user.avatar || DEFAULT_AVATAR,
          username: user.username || "用户",
          isSelf: currentUserId > 0 && uid === currentUserId,
          viewId: `msg-${index}`
        };
      });
    },
    scrollToBottom() {
      const size = this.data.messages.length;
      if (size <= 0) {
        this.setData({ lastMessageId: "" });
        return;
      }
      this.setData({ lastMessageId: `msg-${size - 1}` });
    },
    async fetchMessages(options = {}) {
      const silent = !!options.silent;
      if (!silent) {
        this.setData({ loading: true });
      }
      try {
        const res = await getCommunityMessages({ page: 1, size: 100 });
        const descList = Array.isArray(res && res.list) ? res.list : [];
        const ascList = descList.slice().reverse();
        const messages = this.normalizeMessages(ascList);
        this.setData({ messages }, () => this.scrollToBottom());
      } catch (e) {
        formatAppLog("error", "at pages/service/community-chat.page.js:127", "failed to fetch community messages", e);
      } finally {
        if (!silent) {
          this.setData({ loading: false });
        }
      }
    },
    onDraftInput(e) {
      const draft = e.detail.value || "";
      this.setData({
        draft,
        canSend: !!String(draft).trim()
      });
    },
    async handleSend() {
      const content = String(this.data.draft || "").trim();
      if (!content || this.data.sending)
        return;
      this.setData({ sending: true });
      try {
        await sendCommunityMessage({ content });
        this.setData({ draft: "", canSend: false });
        await this.fetchMessages({ silent: true });
      } catch (e) {
        formatAppLog("error", "at pages/service/community-chat.page.js:153", "failed to send community message", e);
      } finally {
        this.setData({ sending: false });
      }
    }
  };
  const _sfc_main$h = createPage(pageDef$g);
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "community-chat-page" }, [
      vue.createElementVNode("view", { class: "chat-card card" }, [
        vue.createElementVNode("scroll-view", {
          class: "chat-list",
          "scroll-y": "true",
          "scroll-into-view": _ctx.lastMessageId
        }, [
          _ctx.loading ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "state-text"
          }, "加载中...")) : vue.createCommentVNode("v-if", true),
          !_ctx.loading && _ctx.messages.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "state-text"
          }, "暂无消息，来发第一条吧")) : vue.createCommentVNode("v-if", true),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList(_ctx.messages, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: item.id,
                id: item.viewId,
                class: vue.normalizeClass("message-item " + (item.isSelf ? "is-self" : ""))
              }, [
                vue.createElementVNode("image", {
                  class: "avatar",
                  src: item.avatar || _ctx.defaultAvatar,
                  mode: "aspectFill"
                }, null, 8, ["src"]),
                vue.createElementVNode("view", { class: "bubble-wrap" }, [
                  vue.createElementVNode("view", { class: "meta" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "name" },
                      vue.toDisplayString(item.username),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "time" },
                      vue.toDisplayString(item.timeText),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode(
                    "view",
                    { class: "bubble" },
                    vue.toDisplayString(item.content),
                    1
                    /* TEXT */
                  )
                ])
              ], 10, ["id"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ], 8, ["scroll-into-view"]),
        vue.createElementVNode("view", { class: "composer" }, [
          vue.createElementVNode("textarea", {
            class: "composer-input",
            value: _ctx.draft,
            maxlength: "1000",
            placeholder: "说点什么...",
            "auto-height": "",
            onInput: _cache[0] || (_cache[0] = (...args) => _ctx.onDraftInput && _ctx.onDraftInput(...args))
          }, null, 40, ["value"]),
          vue.createElementVNode("view", { class: "composer-actions" }, [
            vue.createElementVNode("text", { class: "hint" }, "支持最多 1000 字"),
            vue.createElementVNode("button", {
              class: "btn btn-primary send-btn",
              size: "mini",
              onClick: _cache[1] || (_cache[1] = (...args) => _ctx.handleSend && _ctx.handleSend(...args)),
              loading: _ctx.sending,
              disabled: _ctx.sending || !_ctx.canSend
            }, " 发送 ", 8, ["loading", "disabled"])
          ])
        ])
      ])
    ]);
  }
  const PagesServiceCommunityChat = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__file", "C:/Users/30776/Desktop/shequapp/shequ-android-uniapp/pages/service/community-chat.vue"]]);
  const { getNoticeList } = __dep2$1;
  const { formatTime: formatTime$3 } = __dep3$2;
  const pageDef$f = {
    data: {
      notices: [],
      page: 1,
      size: 10,
      total: 0,
      loading: false
    },
    onLoad() {
      this.getNotices(true);
    },
    onPullDownRefresh() {
      this.setData({ page: 1 });
      this.getNotices(true).then(() => {
        uni.stopPullDownRefresh();
      });
    },
    onReachBottom() {
      if (this.data.notices.length < this.data.total) {
        this.setData({ page: this.data.page + 1 });
        this.getNotices();
      }
    },
    async getNotices(reset = false) {
      if (this.data.loading)
        return;
      this.setData({ loading: true });
      try {
        const res = await getNoticeList({
          page: this.data.page,
          size: this.data.size
        });
        let list = [];
        let total = 0;
        if (Array.isArray(res)) {
          list = res;
          total = res.length;
        } else if (res.list) {
          list = res.list;
          total = res.total;
        }
        list = list.map((item) => {
          const date = new Date(item.created_at);
          const isValid = !isNaN(date.getTime()) && date.getFullYear() > 2e3;
          return {
            ...item,
            created_at: isValid ? formatTime$3(date) : ""
          };
        });
        if (reset) {
          this.setData({ notices: list, total: total || list.length });
        } else {
          this.setData({ notices: [...this.data.notices, ...list], total: total || this.data.notices.length + list.length });
        }
      } catch (e) {
        formatAppLog("error", "at pages/service/notice.page.js:73", e);
      } finally {
        this.setData({ loading: false });
      }
    }
  };
  const _sfc_main$g = createPage(pageDef$f);
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "notice-page" }, [
      vue.createElementVNode("view", { class: "notice-list" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList(_ctx.notices, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: item.id,
              class: "notice-card card"
            }, [
              vue.createElementVNode("view", { class: "notice-header" }, [
                vue.createElementVNode(
                  "view",
                  { class: "notice-title" },
                  vue.toDisplayString(item.title),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "notice-meta" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "publisher" },
                    vue.toDisplayString(item.publisher),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "date" },
                    vue.toDisplayString(item.created_at),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createElementVNode(
                "view",
                { class: "notice-content" },
                vue.toDisplayString(item.content),
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", { class: "notice-footer" }, [
                vue.createElementVNode(
                  "text",
                  { class: "views" },
                  "👁 " + vue.toDisplayString(item.view_count || 0) + " 次浏览",
                  1
                  /* TEXT */
                )
              ])
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      _ctx.loading ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "loading-text"
      }, "加载中...")) : vue.createCommentVNode("v-if", true),
      !_ctx.loading && _ctx.notices.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "empty-state"
      }, "暂无公告")) : vue.createCommentVNode("v-if", true),
      !_ctx.loading && _ctx.notices.length > 0 && _ctx.notices.length >= _ctx.total ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "no-more"
      }, "没有更多了")) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesServiceNotice = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__file", "C:/Users/30776/Desktop/shequapp/shequ-android-uniapp/pages/service/notice.vue"]]);
  const { createRepair, getRepairList } = __dep2$1;
  const { formatTime: formatTime$2 } = __dep3$2;
  function formatRepairTime(value) {
    if (!value)
      return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime()) || date.getFullYear() < 2e3) {
      return String(value).replace("T", " ").replace(/\.\d+Z?$/, "");
    }
    return formatTime$2(date, false).replace(/\//g, "-");
  }
  const pageDef$e = {
    data: {
      types: ["请选择", "报修", "投诉"],
      typeIndex: 1,
      category: "",
      content: "",
      submitting: false,
      repairs: [],
      page: 1,
      size: 10,
      total: 0,
      statusMap: { 0: "待处理", 1: "处理中", 2: "已完成" }
    },
    onLoad() {
      this.fetchRepairList();
    },
    bindTypeChange(e) {
      this.setData({ typeIndex: Number(e.detail.value) });
    },
    onInput(e) {
      const field = e.currentTarget.dataset.field;
      this.setData({ [field]: e.detail.value });
    },
    async submitRepair() {
      const { typeIndex, category, content } = this.data;
      if (typeIndex === 0) {
        uni.showToast({ title: "请选择类型", icon: "none" });
        return;
      }
      if (!category || !content) {
        uni.showToast({ title: "请填写完整", icon: "none" });
        return;
      }
      this.setData({ submitting: true });
      try {
        await createRepair({
          type: Number(typeIndex),
          category,
          content
        });
        uni.showToast({ title: "提交成功", icon: "success" });
        this.setData({
          category: "",
          content: ""
        });
        await this.fetchRepairList(true);
      } catch (e) {
        formatAppLog("error", "at pages/service/repair.page.js:69", e);
      } finally {
        this.setData({ submitting: false });
      }
    },
    async fetchRepairList(reset = false) {
      try {
        const res = await getRepairList({ page: 1, size: 20 });
        const list = (res.list || []).map((item) => ({
          ...item,
          created_at_text: formatRepairTime(item.created_at)
        }));
        this.setData({ repairs: list });
      } catch (e) {
        formatAppLog("error", "at pages/service/repair.page.js:84", e);
        if (reset) {
          this.setData({ repairs: [] });
        }
      }
    }
  };
  const _sfc_main$f = createPage(pageDef$e);
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "repair-page" }, [
      vue.createElementVNode("view", { class: "container" }, [
        vue.createElementVNode("view", { class: "page-title" }, "报修投诉"),
        vue.createElementVNode("view", { class: "card repair-form" }, [
          vue.createElementVNode("view", { class: "form-title" }, "提交新的报修或投诉"),
          vue.createElementVNode("picker", {
            value: _ctx.typeIndex,
            range: _ctx.types,
            onChange: _cache[0] || (_cache[0] = (...args) => _ctx.bindTypeChange && _ctx.bindTypeChange(...args))
          }, [
            vue.createElementVNode("view", { class: "form-group" }, [
              vue.createElementVNode("text", { class: "label" }, "类型"),
              vue.createElementVNode("view", { class: "picker-field" }, [
                vue.createElementVNode(
                  "text",
                  { class: "picker-val" },
                  vue.toDisplayString(_ctx.types[_ctx.typeIndex]),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "arrow" }, ">")
              ])
            ])
          ], 40, ["value", "range"]),
          vue.createElementVNode("view", { class: "form-group" }, [
            vue.createElementVNode("text", { class: "label" }, "分类"),
            vue.createElementVNode("input", {
              class: "input",
              placeholder: "例如：水电、门窗、电梯、噪音",
              onInput: _cache[1] || (_cache[1] = (...args) => _ctx.onInput && _ctx.onInput(...args)),
              "data-field": "category",
              value: _ctx.category
            }, null, 40, ["value"])
          ]),
          vue.createElementVNode("view", { class: "form-group" }, [
            vue.createElementVNode("text", { class: "label" }, "详细描述"),
            vue.createElementVNode("textarea", {
              class: "textarea",
              placeholder: "请详细描述问题，便于物业快速处理",
              onInput: _cache[2] || (_cache[2] = (...args) => _ctx.onInput && _ctx.onInput(...args)),
              "data-field": "content",
              value: _ctx.content
            }, null, 40, ["value"])
          ]),
          vue.createElementVNode("button", {
            class: "btn btn-primary btn-submit",
            onClick: _cache[3] || (_cache[3] = (...args) => _ctx.submitRepair && _ctx.submitRepair(...args)),
            loading: _ctx.submitting
          }, " 提交 ", 8, ["loading"])
        ]),
        vue.createElementVNode("view", { class: "section-title" }, "我的记录"),
        vue.createElementVNode("view", { class: "repair-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList(_ctx.repairs, (item) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: item.id,
                class: "repair-card card"
              }, [
                vue.createElementVNode("view", { class: "repair-header" }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass("tag " + (item.type === 1 ? "tag-info" : "tag-warning"))
                    },
                    vue.toDisplayString(item.type === 1 ? "报修" : "投诉"),
                    3
                    /* TEXT, CLASS */
                  ),
                  vue.createElementVNode(
                    "view",
                    { class: "repair-category" },
                    vue.toDisplayString(item.category),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    { class: "tag tag-status" },
                    vue.toDisplayString(_ctx.statusMap[item.status] || "待处理"),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode(
                  "view",
                  { class: "repair-content" },
                  vue.toDisplayString(item.content),
                  1
                  /* TEXT */
                ),
                item.result ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "repair-result"
                }, [
                  vue.createElementVNode("text", { class: "bold" }, "处理结果："),
                  vue.createTextVNode(
                    vue.toDisplayString(item.result),
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true),
                vue.createElementVNode(
                  "view",
                  { class: "repair-time" },
                  vue.toDisplayString(item.created_at_text || "-"),
                  1
                  /* TEXT */
                )
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          _ctx.repairs.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "empty-state"
          }, "暂无记录")) : vue.createCommentVNode("v-if", true)
        ])
      ])
    ]);
  }
  const PagesServiceRepair = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__file", "C:/Users/30776/Desktop/shequapp/shequ-android-uniapp/pages/service/repair.vue"]]);
  const { createVisitor, getVisitorList } = __dep2$1;
  const { formatTime: formatTime$1 } = __dep3$2;
  const pageDef$d = {
    data: {
      activeTab: 0,
      // 0: 登记, 1: 记录
      name: "",
      mobile: "",
      visit_time: "",
      reason: "",
      historyList: [],
      page: 1,
      size: 10,
      total: 0,
      loading: false
    },
    onLoad() {
      const now = /* @__PURE__ */ new Date();
      const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      this.setData({ visit_time: timeStr });
    },
    switchTab(e) {
      const index = Number(e.currentTarget.dataset.index);
      this.setData({ activeTab: index });
      if (index === 1 && this.data.historyList.length === 0) {
        this.getHistory(true);
      }
    },
    bindDateChange(e) {
      this.setData({
        visit_time: e.detail.value
      });
    },
    onInput(e) {
      const field = e.currentTarget.dataset.field;
      this.setData({ [field]: e.detail.value });
    },
    async handleSubmit() {
      const { name, mobile, visit_time, reason } = this.data;
      if (!name || !mobile || !visit_time || !reason) {
        uni.showToast({ title: "请填写必要信息", icon: "none" });
        return;
      }
      let formattedTime = visit_time;
      const date = new Date(visit_time);
      if (!isNaN(date.getTime())) {
        formattedTime = formatTime$1(date);
        formattedTime = formattedTime.replace(/\//g, "-");
      }
      try {
        await createVisitor({
          visitor_name: name,
          visitor_phone: mobile,
          // Correct key per SecurityHandler
          visit_time: formattedTime,
          reason
        });
        uni.showToast({ title: "登记成功", icon: "success" });
        this.setData({
          name: "",
          mobile: "",
          reason: ""
        });
        this.getHistory(true);
      } catch (e) {
        formatAppLog("error", "at pages/service/visitor.page.js:86", e);
      }
    },
    async getHistory(reset = false) {
      if (this.data.loading)
        return;
      this.setData({ loading: true });
      try {
        const res = await getVisitorList({
          page: this.data.page,
          size: this.data.size
        });
        let list = res.list || res || [];
        list = list.map((item) => {
          const date = new Date(item.visit_time);
          const isValid = !isNaN(date.getTime()) && date.getFullYear() > 2e3;
          return {
            ...item,
            visit_time: isValid ? formatTime$1(date) : "",
            visitor_mobile: item.mobile || item.visitor_phone || item.visitor_mobile,
            // Ensure mobile shows
            visitor_name: item.name || item.visitor_name
            // Ensure name shows (model uses 'name')
          };
        });
        if (reset) {
          this.setData({ historyList: list, total: res.total || 0 });
        } else {
          this.setData({ historyList: [...this.data.historyList, ...list], total: res.total || 0 });
        }
      } catch (e) {
        formatAppLog("error", "at pages/service/visitor.page.js:120", e);
      } finally {
        this.setData({ loading: false });
      }
    },
    onReachBottom() {
      if (this.data.activeTab === 1 && this.data.historyList.length < this.data.total) {
        this.setData({ page: this.data.page + 1 });
        this.getHistory();
      }
    }
  };
  const _sfc_main$e = createPage(pageDef$d);
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "tabs" }, [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass("tab-item " + (_ctx.activeTab === 0 ? "active" : "")),
            onClick: _cache[0] || (_cache[0] = (...args) => _ctx.switchTab && _ctx.switchTab(...args)),
            "data-index": "0"
          },
          "访客登记",
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass("tab-item " + (_ctx.activeTab === 1 ? "active" : "")),
            onClick: _cache[1] || (_cache[1] = (...args) => _ctx.switchTab && _ctx.switchTab(...args)),
            "data-index": "1"
          },
          "访客记录",
          2
          /* CLASS */
        )
      ]),
      _ctx.activeTab === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "tab-content"
      }, [
        vue.createElementVNode("view", { class: "form-card card" }, [
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "访客姓名"),
            vue.createElementVNode("input", {
              class: "input",
              placeholder: "请输入姓名",
              onInput: _cache[2] || (_cache[2] = (...args) => _ctx.onInput && _ctx.onInput(...args)),
              "data-field": "name",
              value: _ctx.name
            }, null, 40, ["value"])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "手机号码"),
            vue.createElementVNode("input", {
              class: "input",
              type: "number",
              placeholder: "请输入手机号",
              onInput: _cache[3] || (_cache[3] = (...args) => _ctx.onInput && _ctx.onInput(...args)),
              "data-field": "mobile",
              value: _ctx.mobile
            }, null, 40, ["value"])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "来访时间"),
            vue.createElementVNode("input", {
              class: "input",
              placeholder: "yyyy-MM-dd HH:mm",
              onInput: _cache[4] || (_cache[4] = (...args) => _ctx.onInput && _ctx.onInput(...args)),
              "data-field": "visit_time",
              value: _ctx.visit_time
            }, null, 40, ["value"])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "来访事由"),
            vue.createElementVNode("input", {
              class: "input",
              placeholder: "例如：亲友拜访",
              onInput: _cache[5] || (_cache[5] = (...args) => _ctx.onInput && _ctx.onInput(...args)),
              "data-field": "reason",
              value: _ctx.reason
            }, null, 40, ["value"])
          ]),
          vue.createElementVNode("button", {
            class: "submit-btn",
            type: "primary",
            onClick: _cache[6] || (_cache[6] = (...args) => _ctx.handleSubmit && _ctx.handleSubmit(...args))
          }, "提交登记")
        ])
      ])) : vue.createCommentVNode("v-if", true),
      _ctx.activeTab === 1 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "tab-content"
      }, [
        vue.createElementVNode("button", {
          class: "refresh-btn",
          size: "mini",
          onClick: _cache[7] || (_cache[7] = (...args) => _ctx.getHistory && _ctx.getHistory(...args))
        }, "刷新"),
        vue.createElementVNode("view", { class: "history-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList(_ctx.historyList, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: item.id,
                class: "history-item card"
              }, [
                vue.createElementVNode("view", { class: "row" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "name" },
                    vue.toDisplayString(item.visitor_name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    {
                      class: vue.normalizeClass("status status-" + item.status)
                    },
                    vue.toDisplayString(item.status === 1 ? "已通过" : item.status === 2 ? "已拒绝" : "待审核"),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                vue.createElementVNode("view", { class: "row sub" }, [
                  vue.createElementVNode(
                    "text",
                    null,
                    "手机：" + vue.toDisplayString(item.visitor_mobile),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    null,
                    "时间：" + vue.toDisplayString(item.visit_time),
                    1
                    /* TEXT */
                  )
                ]),
                item.plate_number ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "row sub"
                }, [
                  vue.createElementVNode(
                    "text",
                    null,
                    "车牌：" + vue.toDisplayString(item.plate_number),
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true),
                vue.createElementVNode(
                  "view",
                  { class: "reason" },
                  "事由：" + vue.toDisplayString(item.reason),
                  1
                  /* TEXT */
                )
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          _ctx.historyList.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "empty-text"
          }, "暂无记录")) : vue.createCommentVNode("v-if", true)
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesServiceVisitor = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__file", "C:/Users/30776/Desktop/shequapp/shequ-android-uniapp/pages/service/visitor.vue"]]);
  const { getMyParking, bindCar } = __dep2$1;
  const pageDef$c = {
    data: {
      parkingList: [],
      plate_number: "",
      loading: false,
      showModal: false,
      currentId: null
    },
    onShow() {
      this.getParking();
    },
    async getParking() {
      this.setData({ loading: true });
      try {
        const res = await getMyParking();
        let list = [];
        if (Array.isArray(res)) {
          list = res;
        } else if (res) {
          list = [res];
        }
        this.setData({ parkingList: list });
      } catch (e) {
        formatAppLog("error", "at pages/service/parking.page.js:31", e);
      } finally {
        this.setData({ loading: false });
      }
    },
    onInput(e) {
      this.setData({ plate_number: e.detail.value });
    },
    showBindModal(e) {
      const id = e.currentTarget.dataset.id;
      this.setData({
        showModal: true,
        currentId: id,
        plate_number: ""
        // reset input
      });
    },
    closeModal() {
      this.setData({ showModal: false, currentId: null });
    },
    async handleBindConfirm() {
      if (!this.data.plate_number) {
        uni.showToast({ title: "请输入车牌号", icon: "none" });
        return;
      }
      try {
        await bindCar({
          car_plate: this.data.plate_number,
          // Backend expects car_plate
          parking_id: Number(this.data.currentId)
          // Backend expects parking_id
        });
        uni.showToast({ title: "绑定成功", icon: "success" });
        this.closeModal();
        this.getParking();
      } catch (e) {
        formatAppLog("error", "at pages/service/parking.page.js:70", e);
      }
    }
  };
  const _imports_0$2 = "/assets/service.c34acb4c.png";
  const _sfc_main$d = createPage(pageDef$c);
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "container" }, [
          vue.createElementVNode("view", { class: "header-card card" }, [
            vue.createElementVNode("view", { class: "title" }, "我的车位"),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass("status-badge " + (_ctx.parkingList.length > 0 ? "status-has" : "status-none"))
              },
              vue.toDisplayString(_ctx.parkingList.length > 0 ? "已分配 " + _ctx.parkingList.length + " 个" : "未分配"),
              3
              /* TEXT, CLASS */
            )
          ]),
          _ctx.parkingList.length > 0 ? (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            { key: 0 },
            vue.renderList(_ctx.parkingList, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: item.id,
                class: "info-card card"
              }, [
                vue.createElementVNode("view", { class: "info-item" }, [
                  vue.createElementVNode("text", { class: "label" }, "车位编号"),
                  vue.createElementVNode(
                    "text",
                    { class: "value" },
                    vue.toDisplayString(item.parking_no || "未知编号"),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "info-item" }, [
                  vue.createElementVNode("text", { class: "label" }, "区域位置"),
                  vue.createElementVNode(
                    "text",
                    { class: "value" },
                    vue.toDisplayString(item.location || "地面车位"),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "info-item" }, [
                  vue.createElementVNode("text", { class: "label" }, "绑定车辆"),
                  vue.createElementVNode(
                    "text",
                    { class: "value" },
                    vue.toDisplayString(item.car_plate || "暂无"),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "footer-btn" }, [
                  vue.createElementVNode("button", {
                    class: "bind-btn",
                    type: "primary",
                    size: "mini",
                    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.showBindModal && _ctx.showBindModal(...args)),
                    "data-id": item.id
                  }, vue.toDisplayString(item.car_plate ? "修改绑定" : "绑定车辆"), 9, ["data-id"])
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          )) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "empty-state"
          }, [
            vue.createElementVNode("image", {
              src: _imports_0$2,
              mode: "widthFix",
              class: "empty-icon"
            }),
            vue.createElementVNode("view", { class: "empty-text" }, "您名下暂无车位信息"),
            vue.createElementVNode("view", { class: "empty-sub" }, "请联系物业管理处办理车位租赁/购买")
          ]))
        ]),
        _ctx.showModal ? (vue.openBlock(), vue.createElementBlock(
          vue.Fragment,
          { key: 0 },
          [
            vue.createElementVNode("view", {
              class: "modal-mask",
              onClick: _cache[1] || (_cache[1] = (...args) => _ctx.closeModal && _ctx.closeModal(...args))
            }),
            vue.createElementVNode("view", { class: "modal-content" }, [
              vue.createElementVNode("view", { class: "modal-title" }, "绑定车辆"),
              vue.createElementVNode("input", {
                class: "modal-input",
                placeholder: "请输入车牌号 (如: 京A88888)",
                onInput: _cache[2] || (_cache[2] = (...args) => _ctx.onInput && _ctx.onInput(...args)),
                value: _ctx.plate_number,
                focus: _ctx.showModal
              }, null, 40, ["value", "focus"]),
              vue.createElementVNode("view", { class: "modal-footer" }, [
                vue.createElementVNode("button", {
                  class: "btn-cancel",
                  onClick: _cache[3] || (_cache[3] = (...args) => _ctx.closeModal && _ctx.closeModal(...args))
                }, "取消"),
                vue.createElementVNode("button", {
                  class: "btn-confirm",
                  onClick: _cache[4] || (_cache[4] = (...args) => _ctx.handleBindConfirm && _ctx.handleBindConfirm(...args))
                }, "确定")
              ])
            ])
          ],
          64
          /* STABLE_FRAGMENT */
        )) : vue.createCommentVNode("v-if", true)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesServiceParking = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__file", "C:/Users/30776/Desktop/shequapp/shequ-android-uniapp/pages/service/parking.vue"]]);
  function confirmAction$2(title, content) {
    return new Promise((resolve) => {
      uni.showModal({
        title,
        content,
        success: (res) => resolve(!!res.confirm),
        fail: () => resolve(false)
      });
    });
  }
  function promptPaymentPassword$3(options = {}) {
    const title = options.title || "安全支付验证";
    const placeholder = options.placeholder || "请输入登录密码";
    return new Promise((resolve) => {
      uni.showModal({
        title,
        editable: true,
        placeholderText: placeholder,
        success: (res) => {
          if (!res.confirm) {
            resolve("");
            return;
          }
          resolve((res.content || "").trim());
        },
        fail: () => resolve("")
      });
    });
  }
  const __dep3 = {
    confirmAction: confirmAction$2,
    promptPaymentPassword: promptPaymentPassword$3
  };
  const GREEN_POINTS_PER_YUAN$2 = 10;
  const CENTS_PER_GREEN_POINT = Math.round(100 / GREEN_POINTS_PER_YUAN$2);
  function getMixedPaymentPreview$2(amount, greenPoints) {
    const amountInCents = Math.max(0, Math.round(Number(amount || 0) * 100));
    const points = Math.max(0, Math.floor(Number(greenPoints || 0)));
    const maxDeductiblePoints = Math.floor(amountInCents / CENTS_PER_GREEN_POINT);
    const usedPoints = Math.min(points, maxDeductiblePoints);
    const balanceInCents = amountInCents - usedPoints * CENTS_PER_GREEN_POINT;
    return {
      points: usedPoints,
      balance: balanceInCents / 100
    };
  }
  const __dep4 = {
    GREEN_POINTS_PER_YUAN: GREEN_POINTS_PER_YUAN$2,
    getMixedPaymentPreview: getMixedPaymentPreview$2
  };
  const { getPropertyFeeList, payPropertyFee } = __dep2$1;
  const { getUserInfo: getUserInfo$4 } = __dep2;
  const { formatTime } = __dep3$2;
  const { confirmAction: confirmAction$1, promptPaymentPassword: promptPaymentPassword$2 } = __dep3;
  const { GREEN_POINTS_PER_YUAN: GREEN_POINTS_PER_YUAN$1, getMixedPaymentPreview: getMixedPaymentPreview$1 } = __dep4;
  function formatAmount$2(value) {
    return Number(value || 0).toFixed(2);
  }
  const pageDef$b = {
    data: {
      activeTab: 0,
      list: [],
      page: 1,
      size: 10,
      total: 0,
      loading: false,
      userInfo: null,
      userBalanceText: "0.00",
      greenPointsPerYuan: GREEN_POINTS_PER_YUAN$1
    },
    async onLoad() {
      await this.initPage();
    },
    async onShow() {
      await this.refreshUserInfo();
    },
    async initPage() {
      await this.refreshUserInfo();
      await this.getList(true);
    },
    switchTab(e) {
      const index = Number(e.currentTarget.dataset.index);
      this.setData({ activeTab: index, page: 1, list: [] });
      this.getList(true);
    },
    async refreshUserInfo() {
      try {
        const user = await getUserInfo$4();
        this.setData({
          userInfo: user || null,
          userBalanceText: formatAmount$2(user && user.balance || 0)
        });
      } catch (e) {
        formatAppLog("error", "at pages/service/property.page.js:57", e);
      }
    },
    buildFeeViewModel(list) {
      const currentPoints = Number(this.data.userInfo && this.data.userInfo.green_points || 0);
      return (list || []).map((item) => {
        const date = new Date(item.pay_time);
        const isValid = !Number.isNaN(date.getTime()) && date.getFullYear() > 2e3;
        const payTimeText = isValid ? formatTime(date).split(" ")[0].replace(/\//g, "-") : "";
        const preview = getMixedPaymentPreview$1(item.amount, currentPoints);
        return {
          ...item,
          amount_text: formatAmount$2(item.amount),
          pay_time: payTimeText,
          used_balance_text: formatAmount$2(item.used_balance || 0),
          payment_preview: {
            points: preview.points,
            balance: preview.balance,
            balance_text: formatAmount$2(preview.balance)
          }
        };
      });
    },
    async getList(reset = false) {
      if (this.data.loading)
        return;
      this.setData({ loading: true });
      try {
        const res = await getPropertyFeeList({
          page: this.data.page,
          size: this.data.size,
          status: this.data.activeTab
        });
        let list = res.list || res || [];
        list = list.filter((item) => Number(item.status) === Number(this.data.activeTab));
        list = this.buildFeeViewModel(list);
        if (reset) {
          this.setData({ list, total: res.total || 0 });
        } else {
          this.setData({ list: [...this.data.list, ...list], total: res.total || 0 });
        }
      } catch (e) {
        formatAppLog("error", "at pages/service/property.page.js:103", e);
      } finally {
        this.setData({ loading: false });
      }
    },
    onReachBottom() {
      if (this.data.list.length < this.data.total) {
        this.setData({ page: this.data.page + 1 });
        this.getList();
      }
    },
    async handlePay(e) {
      const id = e.currentTarget.dataset.id;
      const fee = this.data.list.find((item) => item.id === id);
      if (!fee)
        return;
      const preview = fee.payment_preview || getMixedPaymentPreview$1(fee.amount, 0);
      const confirmed = await confirmAction$1(
        "混合支付确认",
        `本次将优先抵扣 ${preview.points} 积分，余额支付 ￥${formatAmount$2(preview.balance)}，确认缴费吗？`
      );
      if (!confirmed)
        return;
      const password = await promptPaymentPassword$2({
        title: "物业费支付",
        placeholder: "请输入登录密码"
      });
      if (!password) {
        uni.showToast({ title: "已取消支付", icon: "none" });
        return;
      }
      try {
        const result = await payPropertyFee({ related_id: id, password });
        uni.showToast({
          title: `支付成功 积分${Number(result.used_points || 0)} 余额￥${formatAmount$2(result.used_balance || 0)}`,
          icon: "none"
        });
        await this.refreshUserInfo();
        await this.getList(true);
      } catch (err) {
      }
    }
  };
  const _sfc_main$c = createPage(pageDef$b);
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      _ctx.userInfo ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "mix-pay-tip card"
      }, [
        vue.createElementVNode(
          "view",
          { class: "tip-title" },
          "当前绿色积分 " + vue.toDisplayString(_ctx.userInfo.green_points || 0) + "，账户余额 ￥" + vue.toDisplayString(_ctx.userBalanceText),
          1
          /* TEXT */
        ),
        vue.createElementVNode(
          "view",
          { class: "tip-desc" },
          "支付时将按 " + vue.toDisplayString(_ctx.greenPointsPerYuan) + " 积分 = 1 元 自动优先扣除积分，不足部分再扣余额。",
          1
          /* TEXT */
        )
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", { class: "tabs" }, [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass("tab-item " + (_ctx.activeTab === 0 ? "active" : "")),
            onClick: _cache[0] || (_cache[0] = (...args) => _ctx.switchTab && _ctx.switchTab(...args)),
            "data-index": "0"
          },
          "待缴费",
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass("tab-item " + (_ctx.activeTab === 1 ? "active" : "")),
            onClick: _cache[1] || (_cache[1] = (...args) => _ctx.switchTab && _ctx.switchTab(...args)),
            "data-index": "1"
          },
          "已缴费",
          2
          /* CLASS */
        )
      ]),
      vue.createElementVNode("view", { class: "list" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList(_ctx.list, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: item.id,
              class: "fee-card card"
            }, [
              vue.createElementVNode("view", { class: "header" }, [
                vue.createElementVNode(
                  "text",
                  { class: "title" },
                  vue.toDisplayString(item.title || "物业费账单"),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "amount" },
                  "￥" + vue.toDisplayString(item.amount_text),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "info" }, [
                vue.createElementVNode("view", { class: "row" }, [
                  vue.createElementVNode("text", { class: "label" }, "账单月份："),
                  vue.createElementVNode(
                    "text",
                    { class: "val" },
                    vue.toDisplayString(item.month),
                    1
                    /* TEXT */
                  )
                ]),
                _ctx.activeTab === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "row"
                }, [
                  vue.createElementVNode("text", { class: "label" }, "预计抵扣："),
                  vue.createElementVNode(
                    "text",
                    { class: "val" },
                    vue.toDisplayString(item.payment_preview.points) + " 积分",
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true),
                _ctx.activeTab === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 1,
                  class: "row"
                }, [
                  vue.createElementVNode("text", { class: "label" }, "预计余额："),
                  vue.createElementVNode(
                    "text",
                    { class: "val" },
                    "￥" + vue.toDisplayString(item.payment_preview.balance_text),
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true),
                _ctx.activeTab === 1 ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 2,
                  class: "row"
                }, [
                  vue.createElementVNode("text", { class: "label" }, "实际积分："),
                  vue.createElementVNode(
                    "text",
                    { class: "val" },
                    vue.toDisplayString(item.used_points || 0),
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true),
                _ctx.activeTab === 1 ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 3,
                  class: "row"
                }, [
                  vue.createElementVNode("text", { class: "label" }, "实际余额："),
                  vue.createElementVNode(
                    "text",
                    { class: "val" },
                    "￥" + vue.toDisplayString(item.used_balance_text),
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true),
                _ctx.activeTab === 1 ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 4,
                  class: "row"
                }, [
                  vue.createElementVNode("text", { class: "label" }, "缴费时间："),
                  vue.createElementVNode(
                    "text",
                    { class: "val" },
                    vue.toDisplayString(item.pay_time),
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              _ctx.activeTab === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "footer"
              }, [
                vue.createElementVNode("button", {
                  class: "pay-btn",
                  size: "mini",
                  type: "primary",
                  onClick: _cache[2] || (_cache[2] = (...args) => _ctx.handlePay && _ctx.handlePay(...args)),
                  "data-id": item.id
                }, "立即缴费", 8, ["data-id"])
              ])) : (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "footer"
              }, [
                vue.createElementVNode("text", { class: "status-tag" }, "已缴费")
              ]))
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        _ctx.list.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty-state"
        }, [
          vue.createElementVNode("image", {
            src: _imports_0$2,
            mode: "widthFix",
            class: "empty-icon"
          }),
          vue.createElementVNode("view", { class: "empty-text" }, "暂无相关费用")
        ])) : vue.createCommentVNode("v-if", true)
      ])
    ]);
  }
  const PagesServiceProperty = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__file", "C:/Users/30776/Desktop/shequapp/shequ-android-uniapp/pages/service/property.vue"]]);
  function uploadGarbageImage$1(filePath) {
    return new Promise((resolve, reject) => {
      const token = uni.getStorageSync("token");
      const header = {};
      if (token) {
        header.Authorization = `Bearer ${token}`;
      }
      uni.uploadFile({
        url: `${BASE_URL}/green-points/upload-garbage`,
        filePath,
        name: "file",
        header,
        success: (res) => {
          let data = null;
          try {
            data = JSON.parse(res.data || "{}");
          } catch (e) {
            uni.showToast({ title: "响应解析失败", icon: "none" });
            reject(e);
            return;
          }
          if (res.statusCode >= 200 && res.statusCode < 300 && data.code === 200) {
            resolve(data.data);
            return;
          }
          if (data.code === 401 || res.statusCode === 401) {
            uni.removeStorageSync("token");
            uni.redirectTo({ url: "/pages/auth/login" });
          }
          uni.showToast({
            title: data.msg || "上传失败",
            icon: "none"
          });
          reject(data);
        },
        fail: (err) => {
          uni.showToast({ title: "网络错误", icon: "none" });
          reject(err);
        }
      });
    });
  }
  function getGreenPointsLeaderboard$1(params) {
    return request({
      url: "/green-points/leaderboard",
      method: "GET",
      data: params
    });
  }
  const __dep1$3 = {
    uploadGarbageImage: uploadGarbageImage$1,
    getGreenPointsLeaderboard: getGreenPointsLeaderboard$1
  };
  const { uploadGarbageImage, getGreenPointsLeaderboard } = __dep1$3;
  const { getUserInfo: getUserInfo$3 } = __dep2;
  const pageDef$a = {
    data: {
      userInfo: {},
      imagePath: "",
      uploading: false,
      leaderboard: [],
      loadingLeaderboard: false,
      recognitionResult: null
    },
    onShow() {
      this.loadPageData();
    },
    async loadPageData() {
      await Promise.all([this.loadUserInfo(), this.loadLeaderboard()]);
    },
    async loadUserInfo() {
      try {
        const res = await getUserInfo$3();
        this.setData({ userInfo: res || {} });
      } catch (e) {
        formatAppLog("error", "at pages/service/green-points.page.js:30", e);
        this.setData({ userInfo: {} });
      }
    },
    async loadLeaderboard() {
      this.setData({ loadingLeaderboard: true });
      try {
        const res = await getGreenPointsLeaderboard({ limit: 10 });
        this.setData({
          leaderboard: res.list || res || []
        });
      } catch (e) {
        formatAppLog("error", "at pages/service/green-points.page.js:43", e);
        this.setData({ leaderboard: [] });
      } finally {
        this.setData({ loadingLeaderboard: false });
      }
    },
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sourceType: ["album", "camera"],
        success: (res) => {
          const filePath = Array.isArray(res.tempFilePaths) ? res.tempFilePaths[0] : "";
          this.setData({
            imagePath: filePath || "",
            recognitionResult: null
          });
        },
        fail: (err) => {
          formatAppLog("error", "at pages/service/green-points.page.js:62", err);
          uni.showToast({
            title: "选择图片失败",
            icon: "none"
          });
        }
      });
    },
    async submitImage() {
      if (!this.data.imagePath) {
        uni.showToast({ title: "请先选择图片", icon: "none" });
        return;
      }
      if (this.data.uploading)
        return;
      this.setData({ uploading: true });
      try {
        const res = await uploadGarbageImage(this.data.imagePath);
        this.setData({ recognitionResult: res || null });
        uni.showToast({
          title: `识别成功 +${res && res.points || 0}积分`,
          icon: "success"
        });
        await Promise.all([this.loadUserInfo(), this.loadLeaderboard()]);
      } catch (e) {
        formatAppLog("error", "at pages/service/green-points.page.js:88", e);
      } finally {
        this.setData({ uploading: false });
      }
    }
  };
  const _sfc_main$b = createPage({
    ...pageDef$a,
    computed: {
      safeUserInfo() {
        return this.userInfo || {};
      }
    }
  });
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "green-points-page" }, [
      vue.createElementVNode("view", { class: "hero card" }, [
        vue.createElementVNode("view", { class: "hero-title" }, "绿色积分中心"),
        vue.createElementVNode("view", { class: "hero-desc" }, "上传垃圾分类图片，识别后自动发放积分奖励。"),
        vue.createElementVNode("view", { class: "hero-stats" }, [
          vue.createElementVNode("view", { class: "stat" }, [
            vue.createElementVNode("view", { class: "stat-label" }, "当前积分"),
            vue.createElementVNode(
              "view",
              { class: "stat-value" },
              vue.toDisplayString(_ctx.safeUserInfo.green_points || 0),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "stat" }, [
            vue.createElementVNode("view", { class: "stat-label" }, "账户余额"),
            vue.createElementVNode(
              "view",
              { class: "stat-value" },
              "¥" + vue.toDisplayString(_ctx.safeUserInfo.balance || 0),
              1
              /* TEXT */
            )
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "upload-card card" }, [
        vue.createElementVNode("view", { class: "section-title" }, "上传垃圾分类图片"),
        _ctx.imagePath ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "preview-wrap"
        }, [
          vue.createElementVNode("image", {
            class: "preview-image",
            src: _ctx.imagePath,
            mode: "aspectFit"
          }, null, 8, ["src"])
        ])) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "empty-preview"
        }, [
          vue.createElementVNode("text", { class: "empty-preview-icon" }, "📷"),
          vue.createElementVNode("text", { class: "empty-preview-text" }, "请选择相册图片或直接拍照")
        ])),
        vue.createElementVNode("view", { class: "btn-row" }, [
          vue.createElementVNode("button", {
            class: "btn btn-light",
            onClick: _cache[0] || (_cache[0] = (...args) => _ctx.chooseImage && _ctx.chooseImage(...args))
          }, "选择图片"),
          vue.createElementVNode("button", {
            class: "btn btn-primary",
            onClick: _cache[1] || (_cache[1] = (...args) => _ctx.submitImage && _ctx.submitImage(...args)),
            loading: _ctx.uploading,
            disabled: !_ctx.imagePath || _ctx.uploading
          }, " 识别并领取积分 ", 8, ["loading", "disabled"])
        ]),
        _ctx.recognitionResult ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "result-box"
        }, [
          vue.createElementVNode(
            "view",
            { class: "result-title" },
            "本次奖励 " + vue.toDisplayString(_ctx.recognitionResult.points || 0) + " 积分",
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "view",
            { class: "result-text" },
            vue.toDisplayString(_ctx.recognitionResult.reason || "识别完成"),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "view",
            { class: "result-text" },
            " 积分余额：" + vue.toDisplayString(_ctx.recognitionResult.green_points || _ctx.safeUserInfo.green_points || 0),
            1
            /* TEXT */
          )
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createElementVNode("view", { class: "leaderboard-card card" }, [
        vue.createElementVNode("view", { class: "section-title" }, "绿色积分排行榜"),
        _ctx.loadingLeaderboard ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "loading"
        }, "加载中...")) : _ctx.leaderboard.length > 0 ? (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          { key: 1 },
          vue.renderList(_ctx.leaderboard, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: item.id || index,
              class: "rank-item"
            }, [
              vue.createElementVNode(
                "view",
                { class: "rank-no" },
                "#" + vue.toDisplayString(item.rank || index + 1),
                1
                /* TEXT */
              ),
              vue.createElementVNode("image", {
                class: "rank-avatar",
                src: item.avatar || "/assets/icons/user.png",
                mode: "aspectFill"
              }, null, 8, ["src"]),
              vue.createElementVNode(
                "view",
                { class: "rank-name" },
                vue.toDisplayString(item.nickname || item.username || "匿名用户"),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "view",
                { class: "rank-score" },
                vue.toDisplayString(item.points || 0) + " 分",
                1
                /* TEXT */
              )
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        )) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "empty"
        }, "暂无排行榜数据"))
      ])
    ]);
  }
  const PagesServiceGreenPoints = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__file", "C:/Users/30776/Desktop/shequapp/shequ-android-uniapp/pages/service/green-points.vue"]]);
  const __dep1$2 = {
    sendChat(data) {
      return request({
        url: "/chat/send",
        method: "POST",
        data,
        timeout: 6e4
      });
    },
    getChatHistory(params) {
      return request({
        url: "/chat/history",
        method: "GET",
        data: params
      });
    }
  };
  const { getChatHistory, sendChat } = __dep1$2;
  const { promptPaymentPassword: promptPaymentPassword$1 } = __dep3;
  function nowTime() {
    const date = /* @__PURE__ */ new Date();
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }
  function buildGreetingMessage() {
    return {
      role: "assistant",
      content: "您好，我是智慧社区助手。您可以让我帮您总结通知、创建报修、搜索商品、下单和支付。",
      time: nowTime()
    };
  }
  const pageDef$9 = {
    data: {
      messages: [buildGreetingMessage()],
      inputContent: "",
      loading: false,
      lastMessageId: "msg-0"
    },
    onLoad() {
      this.loadHistory();
    },
    async loadHistory() {
      try {
        const res = await getChatHistory({ limit: 100 });
        const list = Array.isArray(res && res.list) ? res.list : [];
        if (list.length === 0) {
          this.setData({ messages: [buildGreetingMessage()] }, this.scrollToBottom);
          return;
        }
        const messages = list.map((item) => ({
          role: item.role || "assistant",
          content: item.content || "",
          time: this.formatMessageTime(item.created_at)
        }));
        this.setData({ messages }, this.scrollToBottom);
      } catch (e) {
        formatAppLog("error", "at pages/chat/index.page.js:50", e);
        this.setData({ messages: [buildGreetingMessage()] }, this.scrollToBottom);
      }
    },
    formatMessageTime(value) {
      if (!value)
        return nowTime();
      const date = new Date(value);
      if (Number.isNaN(date.getTime()))
        return nowTime();
      const hh = String(date.getHours()).padStart(2, "0");
      const mm = String(date.getMinutes()).padStart(2, "0");
      return `${hh}:${mm}`;
    },
    onInput(e) {
      this.setData({ inputContent: e.detail.value });
    },
    isPayIntent(text) {
      const payKeywords = ["支付", "付款", "结算", "确认支付"];
      return payKeywords.some((kw) => text.includes(kw));
    },
    scrollToBottom() {
      const idx = this.data.messages.length - 1;
      this.setData({ lastMessageId: `msg-${idx}` });
    },
    async handleSend() {
      const content = (this.data.inputContent || "").trim();
      if (!content || this.data.loading)
        return;
      let paymentPassword = "";
      if (this.isPayIntent(content)) {
        paymentPassword = await promptPaymentPassword$1({
          title: "支付验证",
          placeholder: "请输入登录密码"
        });
        if (!paymentPassword) {
          uni.showToast({ title: "已取消支付请求", icon: "none" });
          return;
        }
      }
      const userMsg = {
        role: "user",
        content,
        time: nowTime()
      };
      const messages = [...this.data.messages, userMsg];
      this.setData({
        messages,
        inputContent: "",
        loading: true
      }, this.scrollToBottom);
      try {
        const res = await sendChat({
          content,
          payment_password: paymentPassword
        });
        const reply = (res && res.reply || "").trim();
        if (!reply) {
          throw new Error("empty AI response");
        }
        this.setData({
          messages: [
            ...this.data.messages,
            {
              role: "assistant",
              content: reply,
              time: nowTime()
            }
          ]
        }, this.scrollToBottom);
      } catch (e) {
        formatAppLog("error", "at pages/chat/index.page.js:128", e);
        this.setData({
          messages: [
            ...this.data.messages,
            {
              role: "system",
              content: `生成失败：${e && e.message || "网络错误"}`,
              time: nowTime()
            }
          ]
        }, this.scrollToBottom);
      } finally {
        this.setData({ loading: false });
      }
    }
  };
  const _sfc_main$a = createPage(pageDef$9);
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "chat-page" }, [
      vue.createElementVNode("view", { class: "chat-header card" }, [
        vue.createElementVNode("view", { class: "chat-title" }, "🤖 智慧社区助手"),
        vue.createElementVNode("view", { class: "chat-desc" }, "支持通知总结、报修创建、商品下单与支付。")
      ]),
      vue.createElementVNode("view", { class: "chat-card card" }, [
        vue.createElementVNode("scroll-view", {
          class: "chat-history",
          "scroll-y": "true",
          "scroll-into-view": _ctx.lastMessageId
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList(_ctx.messages, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                id: "msg-" + index,
                class: vue.normalizeClass("message-item " + item.role)
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "avatar" },
                  vue.toDisplayString(item.role === "user" ? "我" : item.role === "assistant" ? "AI" : "!"),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "content-wrap" }, [
                  vue.createElementVNode(
                    "view",
                    { class: "bubble" },
                    vue.toDisplayString(item.content),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    { class: "time" },
                    vue.toDisplayString(item.time),
                    1
                    /* TEXT */
                  )
                ])
              ], 10, ["id"]);
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          _ctx.loading ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "message-item assistant"
          }, [
            vue.createElementVNode("view", { class: "avatar" }, "AI"),
            vue.createElementVNode("view", { class: "content-wrap" }, [
              vue.createElementVNode("view", { class: "bubble" }, "正在思考中...")
            ])
          ])) : vue.createCommentVNode("v-if", true)
        ], 8, ["scroll-into-view"]),
        vue.createElementVNode("view", { class: "input-area" }, [
          vue.createElementVNode("textarea", {
            class: "input-box",
            value: _ctx.inputContent,
            placeholder: "请输入你的问题...",
            maxlength: "1000",
            "auto-height": "",
            onInput: _cache[0] || (_cache[0] = (...args) => _ctx.onInput && _ctx.onInput(...args))
          }, null, 40, ["value"]),
          vue.createElementVNode("button", {
            class: "btn btn-primary send-btn",
            onClick: _cache[1] || (_cache[1] = (...args) => _ctx.handleSend && _ctx.handleSend(...args)),
            loading: _ctx.loading,
            disabled: _ctx.loading
          }, "发送", 8, ["loading", "disabled"])
        ])
      ])
    ]);
  }
  const PagesChatIndex = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__file", "C:/Users/30776/Desktop/shequapp/shequ-android-uniapp/pages/chat/index.vue"]]);
  const { getOrderList, payOrder, cancelOrder, receiveOrder } = __dep1$5;
  const { getUserInfo: getUserInfo$2 } = __dep2;
  const { confirmAction, promptPaymentPassword } = __dep3;
  const { GREEN_POINTS_PER_YUAN, getMixedPaymentPreview } = __dep4;
  function formatAmount$1(value) {
    return Number(value || 0).toFixed(2);
  }
  const pageDef$8 = {
    data: {
      tabs: [
        { name: "全部", status: "all" },
        { name: "待支付", status: 0 },
        { name: "已支付", status: 1 },
        { name: "已发货", status: 2 },
        { name: "已完成", status: 3 }
      ],
      currentTabStatus: "all",
      orders: [],
      page: 1,
      size: 10,
      total: 0,
      loading: false,
      userInfo: null,
      userBalanceText: "0.00",
      greenPointsPerYuan: GREEN_POINTS_PER_YUAN,
      statusMap: { 0: "待支付", 1: "已支付", 2: "已发货", 3: "已完成", 40: "已取消" }
    },
    async onShow() {
      this.setData({ page: 1 });
      await this.initPage();
    },
    async initPage() {
      await this.refreshUserInfo();
      await this.getOrders(true);
    },
    onReachBottom() {
      if (this.data.orders.length < this.data.total) {
        this.setData({ page: this.data.page + 1 });
        this.getOrders();
      }
    },
    switchTab(e) {
      const status = e.currentTarget.dataset.status;
      if (status === this.data.currentTabStatus)
        return;
      this.setData({ currentTabStatus: status, page: 1 });
      this.getOrders(true);
    },
    async refreshUserInfo() {
      try {
        const user = await getUserInfo$2();
        this.setData({
          userInfo: user || null,
          userBalanceText: formatAmount$1(user && user.balance || 0)
        });
      } catch (e) {
        formatAppLog("error", "at pages/order/list.page.js:68", e);
      }
    },
    buildOrderViewModel(list) {
      const currentPoints = Number(this.data.userInfo && this.data.userInfo.green_points || 0);
      return (list || []).map((order) => {
        const preview = getMixedPaymentPreview(order.total_amount, currentPoints);
        return {
          ...order,
          total_amount_text: formatAmount$1(order.total_amount),
          used_balance_text: formatAmount$1(order.used_balance || 0),
          payment_preview: {
            points: preview.points,
            balance: preview.balance,
            balance_text: formatAmount$1(preview.balance)
          }
        };
      });
    },
    async getOrders(reset = false) {
      if (this.data.loading)
        return;
      this.setData({ loading: true });
      try {
        const { currentTabStatus, page, size } = this.data;
        const params = { page, size };
        if (currentTabStatus !== "all") {
          params.status = Number(currentTabStatus);
        }
        const res = await getOrderList(params);
        const list = this.buildOrderViewModel(res.list || res || []);
        const total = res.total || (Array.isArray(res) ? res.length : 0);
        if (reset) {
          this.setData({ orders: list, total });
        } else {
          this.setData({ orders: [...this.data.orders, ...list], total });
        }
      } catch (e) {
        formatAppLog("error", "at pages/order/list.page.js:110", e);
      } finally {
        this.setData({ loading: false });
      }
    },
    async payOrder(e) {
      const id = e.currentTarget.dataset.id;
      const order = this.data.orders.find((item) => item.id === id);
      if (!order)
        return;
      const preview = order.payment_preview || getMixedPaymentPreview(order.total_amount, 0);
      const confirmed = await confirmAction(
        "订单支付确认",
        `本次将优先抵扣 ${preview.points} 积分，余额支付 ￥${formatAmount$1(preview.balance)}，确认继续吗？`
      );
      if (!confirmed)
        return;
      const password = await promptPaymentPassword({
        title: "订单支付",
        placeholder: "请输入登录密码"
      });
      if (!password) {
        uni.showToast({ title: "已取消支付", icon: "none" });
        return;
      }
      try {
        const result = await payOrder({ order_id: id, password });
        uni.showToast({
          title: `支付成功 积分${Number(result.used_points || 0)} 余额￥${formatAmount$1(result.used_balance || 0)}`,
          icon: "none"
        });
        this.setData({ page: 1 });
        await this.refreshUserInfo();
        await this.getOrders(true);
      } catch (err) {
      }
    },
    async cancelOrder(e) {
      const id = e.currentTarget.dataset.id;
      const confirmed = await confirmAction("提示", "确定取消订单吗？");
      if (!confirmed)
        return;
      try {
        await cancelOrder(id);
        uni.showToast({ title: "已取消", icon: "success" });
        this.setData({ page: 1 });
        this.getOrders(true);
      } catch (err) {
        formatAppLog("error", "at pages/order/list.page.js:163", err);
      }
    },
    async confirmReceipt(e) {
      const id = e.currentTarget.dataset.id;
      try {
        await receiveOrder(id);
        uni.showToast({ title: "已确认收货", icon: "success" });
        this.setData({ page: 1 });
        this.getOrders(true);
      } catch (err) {
        formatAppLog("error", "at pages/order/list.page.js:175", err);
      }
    },
    goToDetail(e) {
      const id = e.currentTarget.dataset.id;
      uni.navigateTo({ url: `/pages/order/detail?id=${id}` });
    }
  };
  const _sfc_main$9 = createPage(pageDef$8);
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "order-page" }, [
      _ctx.userInfo ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "mix-pay-tip card"
      }, [
        vue.createElementVNode(
          "view",
          { class: "tip-title" },
          "混合支付已启用（" + vue.toDisplayString(_ctx.greenPointsPerYuan) + " 积分 = 1 元）",
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "tip-desc" }, "系统会优先扣除绿色积分，不足部分再扣除余额。"),
        vue.createElementVNode(
          "view",
          { class: "tip-desc" },
          "当前绿色积分 " + vue.toDisplayString(_ctx.userInfo.green_points || 0) + "，余额 ￥" + vue.toDisplayString(_ctx.userBalanceText),
          1
          /* TEXT */
        )
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", { class: "tabs" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList(_ctx.tabs, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: item.status,
              class: vue.normalizeClass("tab-item " + (_ctx.currentTabStatus === item.status ? "active" : "")),
              onClick: _cache[0] || (_cache[0] = (...args) => _ctx.switchTab && _ctx.switchTab(...args)),
              "data-status": item.status
            }, vue.toDisplayString(item.name), 11, ["data-status"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createElementVNode("view", { class: "order-list" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList(_ctx.orders, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: item.id,
              class: "order-card card",
              onClick: _cache[4] || (_cache[4] = (...args) => _ctx.goToDetail && _ctx.goToDetail(...args)),
              "data-id": item.id
            }, [
              vue.createElementVNode("view", { class: "order-header" }, [
                vue.createElementVNode(
                  "text",
                  { class: "order-no" },
                  "单号: " + vue.toDisplayString(item.order_no),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass("order-status " + (item.status === 1 ? "text-success" : item.status === 0 ? "text-warning" : ""))
                  },
                  vue.toDisplayString(_ctx.statusMap[item.status]),
                  3
                  /* TEXT, CLASS */
                )
              ]),
              vue.createElementVNode("view", { class: "order-body" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(item.items, (prod, index2) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: prod.id,
                      class: "prod-row"
                    }, [
                      vue.createElementVNode("image", {
                        class: "prod-img",
                        src: prod.product.image_url || "/assets/icons/mall.png",
                        mode: "aspectFill"
                      }, null, 8, ["src"]),
                      vue.createElementVNode("view", { class: "prod-info" }, [
                        vue.createElementVNode(
                          "view",
                          { class: "prod-name" },
                          vue.toDisplayString(prod.product.name),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "view",
                          { class: "prod-meta" },
                          "￥" + vue.toDisplayString(prod.price) + " x " + vue.toDisplayString(prod.quantity),
                          1
                          /* TEXT */
                        )
                      ])
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              vue.createElementVNode("view", { class: "payment-info" }, [
                vue.createElementVNode(
                  "text",
                  null,
                  "总额 ￥" + vue.toDisplayString(item.total_amount_text),
                  1
                  /* TEXT */
                ),
                item.status === 0 ? (vue.openBlock(), vue.createElementBlock(
                  "text",
                  { key: 0 },
                  "预计抵扣积分 " + vue.toDisplayString(item.payment_preview.points),
                  1
                  /* TEXT */
                )) : vue.createCommentVNode("v-if", true),
                item.status === 0 ? (vue.openBlock(), vue.createElementBlock(
                  "text",
                  { key: 1 },
                  "预计余额支付 ￥" + vue.toDisplayString(item.payment_preview.balance_text),
                  1
                  /* TEXT */
                )) : vue.createCommentVNode("v-if", true),
                item.used_points > 0 ? (vue.openBlock(), vue.createElementBlock(
                  "text",
                  { key: 2 },
                  "积分抵扣 " + vue.toDisplayString(item.used_points),
                  1
                  /* TEXT */
                )) : vue.createCommentVNode("v-if", true),
                item.used_balance > 0 ? (vue.openBlock(), vue.createElementBlock(
                  "text",
                  { key: 3 },
                  "余额支付 ￥" + vue.toDisplayString(item.used_balance_text),
                  1
                  /* TEXT */
                )) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createElementVNode("view", { class: "order-footer" }, [
                vue.createElementVNode(
                  "view",
                  { class: "total-row" },
                  "共" + vue.toDisplayString(item.items.length) + "件商品",
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "action-row" }, [
                  item.status === 0 ? (vue.openBlock(), vue.createElementBlock("button", {
                    key: 0,
                    class: "btn-mini btn-danger",
                    onClick: _cache[1] || (_cache[1] = vue.withModifiers((...args) => _ctx.payOrder && _ctx.payOrder(...args), ["stop"])),
                    "data-id": item.id
                  }, "立即支付", 8, ["data-id"])) : vue.createCommentVNode("v-if", true),
                  item.status === 0 ? (vue.openBlock(), vue.createElementBlock("button", {
                    key: 1,
                    class: "btn-mini",
                    onClick: _cache[2] || (_cache[2] = vue.withModifiers((...args) => _ctx.cancelOrder && _ctx.cancelOrder(...args), ["stop"])),
                    "data-id": item.id
                  }, "取消", 8, ["data-id"])) : vue.createCommentVNode("v-if", true),
                  item.status === 2 ? (vue.openBlock(), vue.createElementBlock("button", {
                    key: 2,
                    class: "btn-mini btn-primary",
                    onClick: _cache[3] || (_cache[3] = vue.withModifiers((...args) => _ctx.confirmReceipt && _ctx.confirmReceipt(...args), ["stop"])),
                    "data-id": item.id
                  }, "确认收货", 8, ["data-id"])) : vue.createCommentVNode("v-if", true)
                ])
              ])
            ], 8, ["data-id"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        !_ctx.loading && _ctx.orders.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty-state"
        }, "暂无订单")) : vue.createCommentVNode("v-if", true)
      ])
    ]);
  }
  const PagesOrderList = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__file", "C:/Users/30776/Desktop/shequapp/shequ-android-uniapp/pages/order/list.vue"]]);
  const { getOrderDetail } = __dep1$5;
  const pageDef$7 = {
    data: {
      order: null,
      statusMap: { 0: "待支付", 1: "已支付", 2: "已发货", 3: "已完成", 40: "已取消" }
    },
    onLoad(options) {
      if (options.id) {
        this.getDetail(options.id);
      }
    },
    async getDetail(id) {
      try {
        const res = await getOrderDetail(id);
        this.setData({ order: res });
      } catch (e) {
        formatAppLog("error", "at pages/order/detail.page.js:22", e);
      }
    }
  };
  const _sfc_main$8 = createPage(pageDef$7);
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return _ctx.order ? (vue.openBlock(), vue.createElementBlock("view", {
      key: 0,
      class: "detail-page"
    }, [
      vue.createElementVNode("view", { class: "status-card card" }, [
        vue.createElementVNode(
          "view",
          { class: "status-text" },
          vue.toDisplayString(_ctx.statusMap[_ctx.order.status]),
          1
          /* TEXT */
        ),
        vue.createElementVNode(
          "view",
          { class: "order-no" },
          "订单号: " + vue.toDisplayString(_ctx.order.order_no),
          1
          /* TEXT */
        )
      ]),
      vue.createElementVNode("view", { class: "address-card card" }, [
        vue.createElementVNode("view", { class: "section-title" }, "收货信息/门店"),
        vue.createElementVNode(
          "view",
          { class: "address-text" },
          vue.toDisplayString(_ctx.order.store ? _ctx.order.store.name + " (" + _ctx.order.store.address + ")" : "自提"),
          1
          /* TEXT */
        )
      ]),
      vue.createElementVNode("view", { class: "prod-card card" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList(_ctx.order.items, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: item.id,
              class: "prod-row"
            }, [
              vue.createElementVNode("image", {
                class: "prod-img",
                src: item.product.image_url,
                mode: "aspectFill"
              }, null, 8, ["src"]),
              vue.createElementVNode("view", { class: "prod-info" }, [
                vue.createElementVNode(
                  "view",
                  { class: "prod-name" },
                  vue.toDisplayString(item.product.name),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "prod-meta" },
                  "¥" + vue.toDisplayString(item.price) + " x " + vue.toDisplayString(item.quantity),
                  1
                  /* TEXT */
                )
              ])
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        vue.createElementVNode("view", { class: "total-row" }, [
          vue.createElementVNode("text", null, "实付金额:"),
          vue.createElementVNode(
            "text",
            { class: "total-price" },
            "¥" + vue.toDisplayString(_ctx.order.total_amount),
            1
            /* TEXT */
          )
        ])
      ])
    ])) : vue.createCommentVNode("v-if", true);
  }
  const PagesOrderDetail = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__file", "C:/Users/30776/Desktop/shequapp/shequ-android-uniapp/pages/order/detail.vue"]]);
  const { getCartList, createOrder } = __dep1$5;
  const { getStoreList } = __dep2$1;
  const pageDef$6 = {
    data: {
      cartItems: [],
      storeList: [],
      selectedStoreIndex: 0,
      totalCount: 0,
      totalPrice: "0.00",
      submitting: false
    },
    onLoad() {
      this.loadData();
    },
    async loadData() {
      try {
        const [cartRes, storeRes] = await Promise.all([
          getCartList(),
          getStoreList()
        ]);
        const stores = storeRes || [];
        const items = cartRes || [];
        this.setData({
          storeList: stores,
          cartItems: items
        });
        this.calculateTotal();
        if (items.length === 0) {
          uni.showToast({ title: "购物车为空", icon: "none" });
          setTimeout(() => uni.switchTab({ url: "/pages/mall/index" }), 1500);
        }
      } catch (e) {
        formatAppLog("error", "at pages/order/create.page.js:43", e);
      }
    },
    calculateTotal() {
      let count = 0;
      let total = 0;
      this.data.cartItems.forEach((item) => {
        count += item.quantity;
        total += parseFloat(item.product.price) * item.quantity;
      });
      this.setData({
        totalCount: count,
        totalPrice: total.toFixed(2)
      });
    },
    bindStoreChange(e) {
      this.setData({ selectedStoreIndex: e.detail.value });
    },
    async submitOrder() {
      const { storeList, selectedStoreIndex, cartItems } = this.data;
      if (storeList.length === 0)
        return;
      const storeId = storeList[selectedStoreIndex].id;
      if (!storeId) {
        uni.showToast({ title: "请选择门店", icon: "none" });
        return;
      }
      this.setData({ submitting: true });
      const items = cartItems.map((item) => ({
        cart_id: item.id,
        quantity: item.quantity
      }));
      try {
        await createOrder({
          store_id: storeId,
          items
        });
        uni.showToast({ title: "下单成功" });
        setTimeout(() => {
          uni.redirectTo({ url: "/pages/order/list" });
        }, 1500);
      } catch (e) {
        formatAppLog("error", "at pages/order/create.page.js:94", e);
      } finally {
        this.setData({ submitting: false });
      }
    }
  };
  const _sfc_main$7 = createPage(pageDef$6);
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "create-order-page" }, [
      vue.createElementVNode("view", { class: "container" }, [
        vue.createElementVNode("view", { class: "page-title" }, "确认订单"),
        vue.createElementVNode("view", { class: "section card" }, [
          vue.createElementVNode("view", { class: "section-title" }, "选择服务门店"),
          vue.createElementVNode("picker", {
            range: _ctx.storeList,
            "range-key": "name",
            onChange: _cache[0] || (_cache[0] = (...args) => _ctx.bindStoreChange && _ctx.bindStoreChange(...args)),
            value: _ctx.selectedStoreIndex
          }, [
            vue.createElementVNode("view", { class: "picker-row" }, [
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString(_ctx.storeList[_ctx.selectedStoreIndex].name || "请选择门店"),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "arrow" }, ">")
            ])
          ], 40, ["range", "value"]),
          _ctx.storeList.length > 0 ? (vue.openBlock(), vue.createElementBlock(
            "view",
            {
              key: 0,
              class: "store-address"
            },
            vue.toDisplayString(_ctx.storeList[_ctx.selectedStoreIndex].address),
            1
            /* TEXT */
          )) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", { class: "section card" }, [
          vue.createElementVNode("view", { class: "section-title" }, "商品清单"),
          vue.createElementVNode("view", { class: "order-items" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(_ctx.cartItems, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item.id,
                  class: "item"
                }, [
                  vue.createElementVNode("image", {
                    class: "item-img",
                    src: item.product.image_url || "/assets/icons/mall.png",
                    mode: "aspectFill"
                  }, null, 8, ["src"]),
                  vue.createElementVNode("view", { class: "item-info" }, [
                    vue.createElementVNode(
                      "view",
                      { class: "name" },
                      vue.toDisplayString(item.product.name),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "view",
                      { class: "price" },
                      "¥" + vue.toDisplayString(item.product.price) + " x " + vue.toDisplayString(item.quantity),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode(
                    "view",
                    { class: "item-total" },
                    "¥" + vue.toDisplayString(item.product.price * item.quantity),
                    1
                    /* TEXT */
                  )
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "footer-bar" }, [
        vue.createElementVNode("view", { class: "total-info" }, [
          vue.createElementVNode(
            "text",
            null,
            "共 " + vue.toDisplayString(_ctx.totalCount) + " 件, 合计:",
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "text",
            { class: "total-price" },
            "¥" + vue.toDisplayString(_ctx.totalPrice),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("button", {
          class: "btn btn-primary submit-btn",
          onClick: _cache[1] || (_cache[1] = (...args) => _ctx.submitOrder && _ctx.submitOrder(...args)),
          loading: _ctx.submitting
        }, "提交订单", 8, ["loading"])
      ])
    ]);
  }
  const PagesOrderCreate = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__file", "C:/Users/30776/Desktop/shequapp/shequ-android-uniapp/pages/order/create.vue"]]);
  const __dep1$1 = {
    // 用户注册
    register(data) {
      return request({
        url: "/register",
        method: "POST",
        data
      });
    },
    // 用户登录
    login(data) {
      return request({
        url: "/login",
        method: "POST",
        data
      });
    },
    // 退出登录
    logout() {
      return request({
        url: "/logout",
        method: "POST"
      });
    },
    // 获取用户信息
    getUserInfo() {
      return request({
        url: "/user/info",
        method: "GET"
      });
    },
    // 更新用户信息
    updateUserInfo(data) {
      return request({
        url: "/user/update",
        method: "POST",
        data
      });
    },
    // 修改密码
    changePassword(data) {
      return request({
        url: "/user/change_password",
        method: "POST",
        data
      });
    },
    // 发送验证码
    sendCode(data) {
      return request({
        url: "/send_code",
        method: "POST",
        data
      });
    },
    // 验证码登录
    loginCode(data) {
      return request({
        url: "/login_code",
        method: "POST",
        data
      });
    }
  };
  const { getUserInfo: getUserInfo$1 } = __dep2;
  const { logout } = __dep1$1;
  const pageDef$5 = {
    data: {
      userInfo: null,
      showAIReportEntry: false,
      roleMap: {
        admin: "管理员",
        store: "商户",
        property: "物业",
        user: "居民"
      }
    },
    onShow() {
      this.fetchUserInfo();
    },
    async fetchUserInfo() {
      const token = uni.getStorageSync("token");
      if (!token)
        return;
      try {
        const res = await getUserInfo$1();
        const role = res && res.role || "";
        this.setData({
          userInfo: res || null,
          showAIReportEntry: role === "admin" || role === "property"
        });
      } catch (e) {
        formatAppLog("error", "at pages/user/index.page.js:35", e);
      }
    },
    handleLogout() {
      uni.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: async (res) => {
          if (!res.confirm)
            return;
          try {
            await logout();
          } catch (e) {
          }
          uni.removeStorageSync("token");
          this.setData({
            userInfo: null,
            showAIReportEntry: false
          });
          uni.reLaunch({ url: "/pages/auth/login" });
        }
      });
    },
    goToLogin() {
      uni.navigateTo({ url: "/pages/auth/login" });
    }
  };
  const _imports_0$1 = "/assets/user.06746484.png";
  const _sfc_main$6 = createPage(pageDef$5);
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "user-page" }, [
      vue.createElementVNode("view", { class: "user-header card" }, [
        _ctx.userInfo ? (vue.openBlock(), vue.createElementBlock(
          vue.Fragment,
          { key: 0 },
          [
            vue.createElementVNode("view", { class: "user-info-row" }, [
              vue.createElementVNode("image", {
                class: "avatar",
                src: _ctx.userInfo.avatar || "/assets/icons/user.png",
                mode: "aspectFill"
              }, null, 8, ["src"]),
              vue.createElementVNode("view", { class: "info-col" }, [
                vue.createElementVNode("view", { class: "name-row" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "name" },
                    vue.toDisplayString(_ctx.userInfo.real_name || _ctx.userInfo.username),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    { class: "role-tag" },
                    vue.toDisplayString(_ctx.roleMap[_ctx.userInfo.role] || "居民"),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode(
                  "text",
                  { class: "mobile" },
                  vue.toDisplayString(_ctx.userInfo.mobile),
                  1
                  /* TEXT */
                )
              ])
            ]),
            vue.createElementVNode("view", { class: "stats-row" }, [
              vue.createElementVNode("view", { class: "stat-item" }, [
                vue.createElementVNode("view", { class: "stat-label" }, "余额"),
                vue.createElementVNode(
                  "view",
                  { class: "stat-val" },
                  "￥" + vue.toDisplayString(_ctx.userInfo.balance || 0),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "stat-item" }, [
                vue.createElementVNode("view", { class: "stat-label" }, "绿色积分"),
                vue.createElementVNode(
                  "view",
                  { class: "stat-val" },
                  vue.toDisplayString(_ctx.userInfo.green_points || 0),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "stat-item" }, [
                vue.createElementVNode("view", { class: "stat-label" }, "状态"),
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass("stat-val status-" + _ctx.userInfo.status)
                  },
                  vue.toDisplayString(_ctx.userInfo.status === 1 ? "正常" : "异常"),
                  3
                  /* TEXT, CLASS */
                )
              ])
            ])
          ],
          64
          /* STABLE_FRAGMENT */
        )) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "unlogin-view",
          onClick: _cache[0] || (_cache[0] = (...args) => _ctx.goToLogin && _ctx.goToLogin(...args))
        }, [
          vue.createElementVNode("image", {
            class: "avatar",
            src: _imports_0$1
          }),
          vue.createElementVNode("view", { class: "login-text" }, "点击登录/注册")
        ]))
      ]),
      vue.createElementVNode("view", { class: "menu-grid" }, [
        vue.createElementVNode("navigator", {
          url: "/pages/order/list",
          class: "menu-item card"
        }, [
          vue.createElementVNode("view", { class: "menu-icon" }, "📝"),
          vue.createElementVNode("view", null, "我的订单")
        ]),
        vue.createElementVNode("navigator", {
          url: "/pages/user/favorites",
          class: "menu-item card"
        }, [
          vue.createElementVNode("view", { class: "menu-icon" }, "❤️"),
          vue.createElementVNode("view", null, "我的收藏")
        ]),
        vue.createElementVNode("navigator", {
          url: "/pages/service/index",
          "open-type": "switchTab",
          class: "menu-item card"
        }, [
          vue.createElementVNode("view", { class: "menu-icon" }, "🛠️"),
          vue.createElementVNode("view", null, "社区服务")
        ]),
        _ctx.showAIReportEntry ? (vue.openBlock(), vue.createElementBlock("navigator", {
          key: 0,
          url: "/pages/admin/ai-report/index",
          class: "menu-item card"
        }, [
          vue.createElementVNode("view", { class: "menu-icon" }, "📊"),
          vue.createElementVNode("view", null, "AI报表")
        ])) : vue.createCommentVNode("v-if", true),
        _ctx.userInfo ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "menu-item card",
          onClick: _cache[1] || (_cache[1] = (...args) => _ctx.handleLogout && _ctx.handleLogout(...args))
        }, [
          vue.createElementVNode("view", { class: "menu-icon" }, "🚪"),
          vue.createElementVNode("view", null, "退出登录")
        ])) : vue.createCommentVNode("v-if", true)
      ])
    ]);
  }
  const PagesUserIndex = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__file", "C:/Users/30776/Desktop/shequapp/shequ-android-uniapp/pages/user/index.vue"]]);
  const { login, sendCode, loginCode } = __dep1$1;
  const pageDef$4 = {
    data: {
      loginType: "password",
      // password | code
      mobile: "",
      password: "",
      code: "",
      loading: false,
      timer: 0,
      btnText: "发送验证码"
    },
    onLoad(options) {
    },
    switchTab(e) {
      const type = e.currentTarget.dataset.type;
      this.setData({ loginType: type });
    },
    onInput(e) {
      const field = e.currentTarget.dataset.field;
      this.setData({ [field]: e.detail.value });
    },
    async handleLogin() {
      if (this.data.loginType === "password") {
        if (!this.data.mobile || !this.data.password) {
          uni.showToast({ title: "请填写完整", icon: "none" });
          return;
        }
        this.doLogin({
          mobile: this.data.mobile,
          password: this.data.password,
          is_code: false
        });
      } else {
        if (!this.data.mobile || !this.data.code) {
          uni.showToast({ title: "请填写完整", icon: "none" });
          return;
        }
        this.doLogin({
          mobile: this.data.mobile,
          code: this.data.code,
          is_code: true
        });
      }
    },
    async doLogin(data) {
      this.setData({ loading: true });
      try {
        let res;
        if (data.is_code) {
          res = await loginCode({
            mobile: data.mobile,
            code: data.code
          });
        } else {
          res = await login({
            mobile: data.mobile,
            password: data.password
          });
        }
        if (res.token || res.data && res.data.token) {
          uni.setStorageSync("token", res.token || res.data.token);
          uni.showToast({ title: "登录成功", icon: "success" });
          setTimeout(() => {
            uni.switchTab({ url: "/pages/home/index" });
          }, 1500);
        } else {
          uni.showToast({ title: "登录失败: 无Token", icon: "none" });
        }
      } catch (err) {
        formatAppLog("error", "at pages/auth/login.page.js:82", err);
      } finally {
        this.setData({ loading: false });
      }
    },
    async sendCode() {
      if (this.data.timer > 0)
        return;
      if (!this.data.mobile || this.data.mobile.length !== 11) {
        uni.showToast({ title: "请输入正确手机号", icon: "none" });
        return;
      }
      try {
        await sendCode({ mobile: this.data.mobile });
        uni.showToast({ title: "发送成功", icon: "success" });
        this.setData({ timer: 60 });
        const interval = setInterval(() => {
          if (this.data.timer <= 0) {
            clearInterval(interval);
          } else {
            this.setData({ timer: this.data.timer - 1 });
          }
        }, 1e3);
      } catch (e) {
        formatAppLog("error", "at pages/auth/login.page.js:108", e);
      }
    },
    goToRegister() {
      uni.navigateTo({
        url: "/pages/auth/register"
      });
    }
  };
  const _sfc_main$5 = createPage(pageDef$4);
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "login-page" }, [
      vue.createElementVNode("view", { class: "login-container" }, [
        vue.createElementVNode("view", { class: "card login-card" }, [
          vue.createElementVNode("view", { class: "login-title" }, "欢迎回来"),
          vue.createElementVNode("view", { class: "login-subtitle" }, "登录智慧社区"),
          vue.createElementVNode("view", { class: "tabs" }, [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass("tab-item " + (_ctx.loginType === "password" ? "active" : "")),
                onClick: _cache[0] || (_cache[0] = (...args) => _ctx.switchTab && _ctx.switchTab(...args)),
                "data-type": "password"
              },
              "密码登录",
              2
              /* CLASS */
            ),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass("tab-item " + (_ctx.loginType === "code" ? "active" : "")),
                onClick: _cache[1] || (_cache[1] = (...args) => _ctx.switchTab && _ctx.switchTab(...args)),
                "data-type": "code"
              },
              "验证码登录",
              2
              /* CLASS */
            )
          ]),
          vue.createElementVNode("view", { class: "login-form" }, [
            _ctx.loginType === "password" ? (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 0 },
              [
                vue.createElementVNode("view", { class: "form-group" }, [
                  vue.createElementVNode("text", { class: "label" }, "手机号/用户名"),
                  vue.createElementVNode("input", {
                    class: "input",
                    type: "text",
                    placeholder: "请输入手机号/用户名",
                    onInput: _cache[2] || (_cache[2] = (...args) => _ctx.onInput && _ctx.onInput(...args)),
                    "data-field": "mobile",
                    value: _ctx.mobile
                  }, null, 40, ["value"])
                ]),
                vue.createElementVNode("view", { class: "form-group" }, [
                  vue.createElementVNode("text", { class: "label" }, "密码"),
                  vue.createElementVNode("input", {
                    class: "input",
                    type: "password",
                    placeholder: "请输入密码",
                    onInput: _cache[3] || (_cache[3] = (...args) => _ctx.onInput && _ctx.onInput(...args)),
                    "data-field": "password",
                    value: _ctx.password
                  }, null, 40, ["value"])
                ])
              ],
              64
              /* STABLE_FRAGMENT */
            )) : (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 1 },
              [
                _ctx.loginType === "code" ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "form-item"
                }, [
                  vue.createElementVNode("view", { class: "input-wrap" }, [
                    vue.createElementVNode("text", { class: "label" }, "手机号"),
                    vue.createElementVNode("input", {
                      class: "input",
                      type: "number",
                      placeholder: "请输入手机号",
                      "placeholder-class": "placeholder",
                      onInput: _cache[4] || (_cache[4] = (...args) => _ctx.onInput && _ctx.onInput(...args)),
                      "data-field": "mobile",
                      value: _ctx.mobile
                    }, null, 40, ["value"])
                  ]),
                  vue.createElementVNode("view", { class: "input-wrap" }, [
                    vue.createElementVNode("text", { class: "label" }, "验证码"),
                    vue.createElementVNode("input", {
                      class: "input",
                      type: "number",
                      placeholder: "请输入验证码",
                      "placeholder-class": "placeholder",
                      onInput: _cache[5] || (_cache[5] = (...args) => _ctx.onInput && _ctx.onInput(...args)),
                      "data-field": "code",
                      value: _ctx.code
                    }, null, 40, ["value"]),
                    vue.createElementVNode(
                      "view",
                      {
                        class: vue.normalizeClass("code-btn " + (_ctx.timer > 0 ? "disabled" : "")),
                        onClick: _cache[6] || (_cache[6] = (...args) => _ctx.sendCode && _ctx.sendCode(...args))
                      },
                      vue.toDisplayString(_ctx.timer > 0 ? _ctx.timer + "s" : "获取验证码"),
                      3
                      /* TEXT, CLASS */
                    )
                  ])
                ])) : vue.createCommentVNode("v-if", true)
              ],
              64
              /* STABLE_FRAGMENT */
            )),
            vue.createElementVNode("view", { class: "form-footer" }, [
              vue.createElementVNode("text", {
                class: "link",
                onClick: _cache[7] || (_cache[7] = (...args) => _ctx.goToRegister && _ctx.goToRegister(...args))
              }, "还没有账号？注册")
            ]),
            vue.createElementVNode("button", {
              class: "btn btn-primary btn-lg mt-md",
              onClick: _cache[8] || (_cache[8] = (...args) => _ctx.handleLogin && _ctx.handleLogin(...args)),
              loading: _ctx.loading
            }, "登录", 8, ["loading"])
          ])
        ])
      ])
    ]);
  }
  const PagesAuthLogin = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__file", "C:/Users/30776/Desktop/shequapp/shequ-android-uniapp/pages/auth/login.vue"]]);
  const { register } = __dep1$1;
  const pageDef$3 = {
    data: {
      mobile: "",
      real_name: "",
      password: "",
      loading: false
    },
    onInput(e) {
      const field = e.currentTarget.dataset.field;
      this.setData({ [field]: e.detail.value });
    },
    async handleRegister() {
      const { mobile, real_name, password } = this.data;
      if (!mobile || !real_name || !password) {
        uni.showToast({ title: "请填写完整信息", icon: "none" });
        return;
      }
      if (password.length < 6) {
        uni.showToast({ title: "密码至少6位", icon: "none" });
        return;
      }
      const username = "user_" + mobile.slice(-6);
      this.setData({ loading: true });
      try {
        await register({
          mobile,
          real_name,
          password,
          username,
          age: 0,
          gender: 0
        });
        uni.showToast({ title: "注册成功", icon: "success" });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      } catch (err) {
        formatAppLog("error", "at pages/auth/register.page.js:51", err);
      } finally {
        this.setData({ loading: false });
      }
    },
    goToLogin() {
      uni.navigateBack();
    }
  };
  const _sfc_main$4 = createPage(pageDef$3);
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "login-page" }, [
      vue.createElementVNode("view", { class: "login-container" }, [
        vue.createElementVNode("view", { class: "card login-card" }, [
          vue.createElementVNode("view", { class: "login-title" }, "创建账号"),
          vue.createElementVNode("view", { class: "login-subtitle" }, "加入智慧社区"),
          vue.createElementVNode("view", { class: "login-form" }, [
            vue.createElementVNode("view", { class: "form-group" }, [
              vue.createElementVNode("text", { class: "label" }, "手机号"),
              vue.createElementVNode(
                "input",
                {
                  class: "input",
                  type: "number",
                  placeholder: "请输入手机号",
                  onInput: _cache[0] || (_cache[0] = (...args) => _ctx.onInput && _ctx.onInput(...args)),
                  "data-field": "mobile"
                },
                null,
                32
                /* NEED_HYDRATION */
              )
            ]),
            vue.createElementVNode("view", { class: "form-group" }, [
              vue.createElementVNode("text", { class: "label" }, "真实姓名"),
              vue.createElementVNode(
                "input",
                {
                  class: "input",
                  type: "text",
                  placeholder: "请输入真实姓名",
                  onInput: _cache[1] || (_cache[1] = (...args) => _ctx.onInput && _ctx.onInput(...args)),
                  "data-field": "real_name"
                },
                null,
                32
                /* NEED_HYDRATION */
              )
            ]),
            vue.createElementVNode("view", { class: "form-group" }, [
              vue.createElementVNode("text", { class: "label" }, "密码"),
              vue.createElementVNode(
                "input",
                {
                  class: "input",
                  type: "password",
                  placeholder: "请输入密码（至少6位）",
                  onInput: _cache[2] || (_cache[2] = (...args) => _ctx.onInput && _ctx.onInput(...args)),
                  "data-field": "password",
                  maxlength: "20"
                },
                null,
                32
                /* NEED_HYDRATION */
              )
            ]),
            vue.createElementVNode("view", { class: "form-footer" }, [
              vue.createElementVNode("text", {
                class: "link",
                onClick: _cache[3] || (_cache[3] = (...args) => _ctx.goToLogin && _ctx.goToLogin(...args))
              }, "已有账号？登录")
            ]),
            vue.createElementVNode("button", {
              class: "btn btn-primary btn-lg mt-md",
              onClick: _cache[4] || (_cache[4] = (...args) => _ctx.handleRegister && _ctx.handleRegister(...args)),
              loading: _ctx.loading
            }, "注册", 8, ["loading"])
          ])
        ])
      ])
    ]);
  }
  const PagesAuthRegister = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "C:/Users/30776/Desktop/shequapp/shequ-android-uniapp/pages/auth/register.vue"]]);
  const { getFavoriteList, removeFavorite } = __dep1$6;
  const pageDef$2 = {
    data: {
      products: [],
      loading: false
    },
    onShow() {
      this.getFavorites();
    },
    async getFavorites() {
      this.setData({ loading: true });
      try {
        const res = await getFavoriteList();
        let rawList = [];
        if (Array.isArray(res)) {
          rawList = res;
        } else if (res && (res.list || Array.isArray(res.list))) {
          rawList = res.list || [];
        }
        const list = rawList.filter((item) => item && item.product).map((item) => {
          return {
            ...item.product,
            // keep favorite id if needed for removal? 
            // The removal API uses product_id based on api/product.js: toggleFavorite(id)
            // So item.product.id is correct.
            favorite_key: item.id
          };
        });
        this.setData({ products: list });
      } catch (e) {
        formatAppLog("error", "at pages/user/favorites.page.js:45", e);
      } finally {
        this.setData({ loading: false });
      }
    },
    async removeFavorite(e) {
      const id = e.currentTarget.dataset.id;
      const index = e.currentTarget.dataset.index;
      uni.showModal({
        title: "提示",
        content: "确定取消收藏吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await removeFavorite(id);
              const newProducts = [...this.data.products];
              newProducts.splice(index, 1);
              this.setData({ products: newProducts });
              uni.showToast({ title: "已取消" });
            } catch (e2) {
              formatAppLog("error", "at pages/user/favorites.page.js:67", e2);
            }
          }
        }
      });
    },
    goToDetail(e) {
      const id = e.currentTarget.dataset.id;
      uni.navigateTo({ url: `/pages/mall/detail?id=${id}` });
    }
  };
  const _imports_0 = "/assets/empty.cf5056f3.png";
  const _sfc_main$3 = createPage(pageDef$2);
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      _ctx.products.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "product-list"
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList(_ctx.products, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "product-item card",
              onClick: _cache[1] || (_cache[1] = (...args) => _ctx.goToDetail && _ctx.goToDetail(...args)),
              "data-id": item.id,
              key: item.id
            }, [
              vue.createElementVNode("image", {
                class: "product-img",
                src: item.image_url,
                mode: "aspectFill"
              }, null, 8, ["src"]),
              vue.createElementVNode("view", { class: "product-info" }, [
                vue.createElementVNode(
                  "view",
                  { class: "product-name" },
                  vue.toDisplayString(item.name),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "product-price" },
                  "¥" + vue.toDisplayString(item.price),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "action-row" }, [
                  vue.createElementVNode("view", {
                    class: "delete-btn",
                    onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => _ctx.removeFavorite && _ctx.removeFavorite(...args), ["stop"])),
                    "data-id": item.id,
                    "data-index": index
                  }, "取消收藏", 8, ["data-id", "data-index"])
                ])
              ])
            ], 8, ["data-id"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "empty-state"
      }, [
        vue.createElementVNode("image", {
          src: _imports_0,
          mode: "widthFix",
          class: "empty-icon"
        }),
        vue.createElementVNode("view", { class: "empty-text" }, "暂无收藏商品")
      ]))
    ]);
  }
  const PagesUserFavorites = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "C:/Users/30776/Desktop/shequapp/shequ-android-uniapp/pages/user/favorites.vue"]]);
  const __dep1 = {
    getAIReportList(params) {
      return request({
        url: "/admin/ai-report/list",
        method: "GET",
        data: params
      });
    },
    generateAIReport() {
      return request({
        url: "/admin/ai-report/generate",
        method: "POST",
        timeout: 12e4
      });
    },
    getAIReportDetail(id) {
      return request({
        url: `/admin/ai-report/${id}`,
        method: "GET"
      });
    }
  };
  const { getAIReportList, generateAIReport } = __dep1;
  const { getUserInfo } = __dep2;
  function formatDateTime$1(value) {
    if (!value)
      return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime()))
      return "-";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
  }
  const pageDef$1 = {
    data: {
      list: [],
      page: 1,
      size: 10,
      total: 0,
      loading: false,
      generating: false,
      roleAllowed: false
    },
    async onLoad() {
      await this.checkPermission();
      if (!this.data.roleAllowed)
        return;
      await this.fetchList(true);
    },
    async onPullDownRefresh() {
      if (!this.data.roleAllowed) {
        uni.stopPullDownRefresh();
        return;
      }
      this.setData({ page: 1 });
      await this.fetchList(true);
      uni.stopPullDownRefresh();
    },
    async onReachBottom() {
      if (!this.data.roleAllowed || this.data.loading)
        return;
      if (this.data.list.length >= this.data.total)
        return;
      this.setData({ page: this.data.page + 1 });
      await this.fetchList(false);
    },
    async checkPermission() {
      try {
        const user = await getUserInfo();
        const role = user && user.role || "";
        const roleAllowed = role === "admin" || role === "property";
        this.setData({ roleAllowed });
        if (!roleAllowed) {
          uni.showToast({ title: "无权限访问", icon: "none" });
          setTimeout(() => uni.navigateBack({ delta: 1 }), 1e3);
        }
      } catch (e) {
        formatAppLog("error", "at pages/admin/ai-report/index.page.js:65", e);
      }
    },
    async fetchList(reset) {
      if (this.data.loading)
        return;
      this.setData({ loading: true });
      try {
        const res = await getAIReportList({
          page: this.data.page,
          size: this.data.size
        });
        const rawList = res.list || [];
        const mapped = rawList.map((item) => ({
          ...item,
          created_at_text: formatDateTime$1(item.created_at)
        }));
        if (reset) {
          this.setData({
            list: mapped,
            total: Number(res.total || 0)
          });
        } else {
          this.setData({
            list: [...this.data.list, ...mapped],
            total: Number(res.total || 0)
          });
        }
      } catch (e) {
        formatAppLog("error", "at pages/admin/ai-report/index.page.js:94", e);
      } finally {
        this.setData({ loading: false });
      }
    },
    async handleGenerate() {
      if (this.data.generating)
        return;
      this.setData({ generating: true });
      try {
        const res = await generateAIReport();
        uni.showToast({ title: "报表生成成功", icon: "success" });
        this.setData({ page: 1 });
        await this.fetchList(true);
        if (res && res.id) {
          uni.navigateTo({
            url: `/pages/admin/ai-report/detail?id=${res.id}`
          });
        }
      } catch (e) {
        const msg = e && e.errMsg || "";
        if (/timeout/i.test(msg)) {
          uni.showToast({ title: "生成超时，请稍后刷新", icon: "none" });
        }
      } finally {
        this.setData({ generating: false });
      }
    },
    async refreshList() {
      this.setData({ page: 1 });
      await this.fetchList(true);
    },
    goDetail(e) {
      const { id } = e.currentTarget.dataset;
      if (!id)
        return;
      uni.navigateTo({
        url: `/pages/admin/ai-report/detail?id=${id}`
      });
    }
  };
  const _sfc_main$2 = createPage(pageDef$1);
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createElementVNode("view", { class: "header card" }, [
        vue.createElementVNode("view", { class: "title" }, "AI 智能日报汇编"),
        vue.createElementVNode("view", { class: "actions" }, [
          vue.createElementVNode("button", {
            class: "btn btn-primary action-btn",
            onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleGenerate && _ctx.handleGenerate(...args)),
            loading: _ctx.generating,
            disabled: _ctx.generating
          }, " 手动生成报告 ", 8, ["loading", "disabled"]),
          vue.createElementVNode("button", {
            class: "btn action-btn",
            onClick: _cache[1] || (_cache[1] = (...args) => _ctx.refreshList && _ctx.refreshList(...args)),
            loading: _ctx.loading,
            disabled: _ctx.loading
          }, "刷新列表", 8, ["loading", "disabled"])
        ])
      ]),
      vue.createElementVNode("view", { class: "list" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList(_ctx.list, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: item.id,
              class: "report-card card",
              onClick: _cache[2] || (_cache[2] = (...args) => _ctx.goDetail && _ctx.goDetail(...args)),
              "data-id": item.id
            }, [
              vue.createElementVNode(
                "view",
                { class: "report-time" },
                vue.toDisplayString(item.created_at_text),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "view",
                { class: "report-summary" },
                vue.toDisplayString(item.report_summary || "暂无摘要"),
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", { class: "detail-link" }, "查看详情 >")
            ], 8, ["data-id"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      _ctx.loading ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "state-tip"
      }, "加载中...")) : vue.createCommentVNode("v-if", true),
      !_ctx.loading && _ctx.list.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "state-tip"
      }, "暂无AI报表")) : vue.createCommentVNode("v-if", true),
      !_ctx.loading && _ctx.list.length > 0 && _ctx.list.length >= _ctx.total ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "state-tip"
      }, "没有更多了")) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesAdminAiReportIndex = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "C:/Users/30776/Desktop/shequapp/shequ-android-uniapp/pages/admin/ai-report/index.vue"]]);
  const { getAIReportDetail } = __dep1;
  function formatDateTime(value) {
    if (!value)
      return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime()))
      return "-";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
  }
  function formatAmount(value) {
    return Number(value || 0).toFixed(2);
  }
  function escapeHtml(text) {
    return String(text || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function inlineMarkdown(text) {
    return String(text || "").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/`([^`]+)`/g, '<code style="padding:2px 6px;border-radius:6px;background:#f2f5f7;color:#1f2937;">$1</code>');
  }
  function normalizeMarkdownInput(markdown) {
    let text = String(markdown || "").replace(/\r\n/g, "\n").trim();
    if (!text)
      return "";
    if (text.startsWith("```")) {
      const lines2 = text.split("\n");
      lines2.shift();
      while (lines2.length && !lines2[lines2.length - 1].trim())
        lines2.pop();
      if (lines2.length && lines2[lines2.length - 1].trim() === "```") {
        lines2.pop();
      }
      text = lines2.join("\n").trim();
    }
    const lines = text.split("\n");
    if (lines.length && /^(markdown|md)$/i.test(lines[0].trim())) {
      lines.shift();
      text = lines.join("\n").trim();
    }
    return text;
  }
  function isTableHeader(line) {
    return /\|/.test(line);
  }
  function isTableDivider(line) {
    return /^\|?[\s:-]+\|[\s|:-]*$/.test(line);
  }
  function isTableRow(line) {
    return /\|/.test(line);
  }
  function splitTableRow(line) {
    let content = line.trim();
    if (content.startsWith("|"))
      content = content.slice(1);
    if (content.endsWith("|"))
      content = content.slice(0, -1);
    return content.split("|").map((cell) => cell.trim());
  }
  function renderTable(headers, rows) {
    const thStyle = "border:1px solid #e7edf3;padding:8px 10px;text-align:left;background:#f4f8f7;font-size:14px;";
    const tdStyle = "border:1px solid #e7edf3;padding:8px 10px;text-align:left;font-size:14px;color:#374151;";
    const head = `<tr>${headers.map((h) => `<th style="${thStyle}">${inlineMarkdown(h)}</th>`).join("")}</tr>`;
    const body = rows.map((row) => `<tr>${row.map((cell) => `<td style="${tdStyle}">${inlineMarkdown(cell)}</td>`).join("")}</tr>`).join("");
    return `<table style="width:100%;border-collapse:collapse;margin:10px 0 14px;">${head}${body}</table>`;
  }
  function markdownToHtml(markdown) {
    const normalized = normalizeMarkdownInput(markdown);
    if (!normalized)
      return '<p style="margin:0;color:#6b7280;">暂无内容</p>';
    const lines = escapeHtml(normalized).split("\n");
    const html = [];
    let inUl = false;
    let inOl = false;
    const closeLists = () => {
      if (inUl) {
        html.push("</ul>");
        inUl = false;
      }
      if (inOl) {
        html.push("</ol>");
        inOl = false;
      }
    };
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i].trim();
      if (!line) {
        closeLists();
        continue;
      }
      if (/^```/.test(line)) {
        closeLists();
        const codeLines = [];
        i += 1;
        for (; i < lines.length; i += 1) {
          const codeLine = lines[i];
          if (/^```/.test(codeLine.trim()))
            break;
          codeLines.push(codeLine);
        }
        html.push(
          `<pre style="white-space:pre-wrap;word-break:break-all;background:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;padding:10px;margin:10px 0;color:#1f2937;font-size:13px;line-height:1.7;">${codeLines.join("\n")}</pre>`
        );
        continue;
      }
      if (isTableHeader(line) && i + 1 < lines.length && isTableDivider(lines[i + 1].trim())) {
        closeLists();
        const headers = splitTableRow(line);
        const rows = [];
        i += 2;
        for (; i < lines.length; i += 1) {
          const rowLine = lines[i].trim();
          if (!rowLine) {
            i -= 1;
            break;
          }
          if (!isTableRow(rowLine)) {
            i -= 1;
            break;
          }
          if (isTableDivider(rowLine))
            continue;
          rows.push(splitTableRow(rowLine));
        }
        html.push(renderTable(headers, rows));
        continue;
      }
      if (/^###\s+/.test(line)) {
        closeLists();
        html.push(`<h3 style="margin:12px 0 8px;color:#1f7a4d;font-size:16px;font-weight:700;">${inlineMarkdown(line.replace(/^###\s+/, ""))}</h3>`);
        continue;
      }
      if (/^##\s+/.test(line)) {
        closeLists();
        html.push(`<h2 style="margin:12px 0 8px;color:#1f7a4d;font-size:18px;font-weight:700;">${inlineMarkdown(line.replace(/^##\s+/, ""))}</h2>`);
        continue;
      }
      if (/^#\s+/.test(line)) {
        closeLists();
        html.push(`<h1 style="margin:12px 0 8px;color:#1f7a4d;font-size:20px;font-weight:700;">${inlineMarkdown(line.replace(/^#\s+/, ""))}</h1>`);
        continue;
      }
      if (/^>\s+/.test(line)) {
        closeLists();
        html.push(`<blockquote style="margin:10px 0;padding:10px 14px;border-left:4px solid #b7d8c6;background:#f8fbf9;color:#374151;">${inlineMarkdown(line.replace(/^>\s+/, ""))}</blockquote>`);
        continue;
      }
      if (/^[-*]\s+/.test(line)) {
        if (inOl) {
          html.push("</ol>");
          inOl = false;
        }
        if (!inUl) {
          html.push('<ul style="margin:8px 0 10px 18px;color:#374151;">');
          inUl = true;
        }
        html.push(`<li style="line-height:1.9;font-size:14px;">${inlineMarkdown(line.replace(/^[-*]\s+/, ""))}</li>`);
        continue;
      }
      if (/^\d+\.\s+/.test(line)) {
        if (inUl) {
          html.push("</ul>");
          inUl = false;
        }
        if (!inOl) {
          html.push('<ol style="margin:8px 0 10px 18px;color:#374151;">');
          inOl = true;
        }
        html.push(`<li style="line-height:1.9;font-size:14px;">${inlineMarkdown(line.replace(/^\d+\.\s+/, ""))}</li>`);
        continue;
      }
      if (/^---+$/.test(line)) {
        closeLists();
        html.push('<hr style="border:none;border-top:1px solid #e5e7eb;margin:10px 0;" />');
        continue;
      }
      closeLists();
      html.push(`<p style="margin:0 0 10px;color:#374151;line-height:1.9;font-size:14px;">${inlineMarkdown(line)}</p>`);
    }
    closeLists();
    return html.join("");
  }
  const pageDef = {
    data: {
      loading: false,
      report: null,
      reportText: "",
      reportHtml: ""
    },
    onLoad(options) {
      if (!options.id) {
        uni.showToast({ title: "缺少报表ID", icon: "none" });
        return;
      }
      this.fetchDetail(options.id);
    },
    async fetchDetail(id) {
      this.setData({ loading: true });
      try {
        const res = await getAIReportDetail(id);
        this.setData({
          report: {
            ...res,
            created_at_text: formatDateTime(res.created_at),
            property_paid_amount_text: formatAmount(res.property_paid_amount)
          },
          reportText: res.report || "",
          reportHtml: markdownToHtml(res.report || "")
        });
      } catch (e) {
        formatAppLog("error", "at pages/admin/ai-report/detail.page.js:242", e);
      } finally {
        this.setData({ loading: false });
      }
    }
  };
  const _sfc_main$1 = createPage(pageDef);
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      _ctx.loading ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "state-tip"
      }, "加载中...")) : vue.createCommentVNode("v-if", true),
      !_ctx.loading && _ctx.report ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "content"
      }, [
        vue.createElementVNode("view", { class: "meta card" }, [
          vue.createElementVNode("view", { class: "meta-row" }, [
            vue.createElementVNode("text", { class: "label" }, "生成时间："),
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString(_ctx.report.created_at_text),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "meta-row" }, [
            vue.createElementVNode("text", { class: "label" }, "新增报修："),
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString(_ctx.report.repair_new_count || 0),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "meta-row" }, [
            vue.createElementVNode("text", { class: "label" }, "未处理报修："),
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString(_ctx.report.repair_pending_count || 0),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "meta-row" }, [
            vue.createElementVNode("text", { class: "label" }, "新增访客："),
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString(_ctx.report.visitor_new_count || 0),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "meta-row" }, [
            vue.createElementVNode("text", { class: "label" }, "物业收缴："),
            vue.createElementVNode(
              "text",
              null,
              "￥" + vue.toDisplayString(_ctx.report.property_paid_amount_text),
              1
              /* TEXT */
            )
          ])
        ]),
        vue.createElementVNode("view", { class: "report-body card" }, [
          vue.createElementVNode("view", { class: "section-title" }, "AI 报告正文"),
          vue.createElementVNode("rich-text", {
            class: "report-rich",
            nodes: _ctx.reportHtml
          }, null, 8, ["nodes"]),
          !_ctx.reportHtml && _ctx.reportText ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "fallback-wrap"
          }, [
            vue.createElementVNode(
              "text",
              { class: "report-text" },
              vue.toDisplayString(_ctx.reportText),
              1
              /* TEXT */
            )
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ])) : vue.createCommentVNode("v-if", true),
      !_ctx.loading && !_ctx.report ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "state-tip"
      }, "未找到报表")) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesAdminAiReportDetail = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "C:/Users/30776/Desktop/shequapp/shequ-android-uniapp/pages/admin/ai-report/detail.vue"]]);
  __definePage("pages/home/index", PagesHomeIndex);
  __definePage("pages/mall/index", PagesMallIndex);
  __definePage("pages/mall/detail", PagesMallDetail);
  __definePage("pages/mall/cart", PagesMallCart);
  __definePage("pages/service/index", PagesServiceIndex);
  __definePage("pages/service/community-chat", PagesServiceCommunityChat);
  __definePage("pages/service/notice", PagesServiceNotice);
  __definePage("pages/service/repair", PagesServiceRepair);
  __definePage("pages/service/visitor", PagesServiceVisitor);
  __definePage("pages/service/parking", PagesServiceParking);
  __definePage("pages/service/property", PagesServiceProperty);
  __definePage("pages/service/green-points", PagesServiceGreenPoints);
  __definePage("pages/chat/index", PagesChatIndex);
  __definePage("pages/order/list", PagesOrderList);
  __definePage("pages/order/detail", PagesOrderDetail);
  __definePage("pages/order/create", PagesOrderCreate);
  __definePage("pages/user/index", PagesUserIndex);
  __definePage("pages/auth/login", PagesAuthLogin);
  __definePage("pages/auth/register", PagesAuthRegister);
  __definePage("pages/user/favorites", PagesUserFavorites);
  __definePage("pages/admin/ai-report/index", PagesAdminAiReportIndex);
  __definePage("pages/admin/ai-report/detail", PagesAdminAiReportDetail);
  const _sfc_main = {
    onLaunch() {
      const logs = uni.getStorageSync("logs") || [];
      logs.unshift(Date.now());
      uni.setStorageSync("logs", logs);
    },
    globalData: {
      userInfo: null
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "C:/Users/30776/Desktop/shequapp/shequ-android-uniapp/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
