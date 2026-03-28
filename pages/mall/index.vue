<template>
<view class="mall-page">
  <view class="top-panel">
    <view class="panel-title">社区商城</view>
    <view class="search-bar">
      <text class="search-icon">🔍</text>
      <input
        class="search-input"
        placeholder="搜索商品"
        confirm-type="search"
        @confirm="handleSearch"
        @input="onSearchInput"
        :value="searchKeyword"
      />
    </view>
  </view>

  <scroll-view scroll-x class="category-scroll" enable-flex>
    <view
      :class="'category-item ' + (selectedCategory === 0 ? 'active' : '')"
      @tap="selectCategory"
      :data-id="0"
    >
      全部
    </view>
    <template v-for="(item, index) in categories" :key="item.id">
      <view
        :class="'category-item ' + (selectedCategory === item.id ? 'active' : '')"
        @tap="selectCategory"
        :data-id="item.id"
      >
        {{item.name}}
      </view>
    </template>
  </scroll-view>

  <view class="product-grid">
    <template v-for="(item, index) in products" :key="item.id">
      <navigator :url="'/pages/mall/detail?id=' + (item.id)" class="product-card">
        <image class="product-img" :src="item.image_url || '/assets/icons/mall.png'" mode="aspectFill"></image>
        <view class="product-info">
          <view class="product-name">{{item.name}}</view>
          <view class="product-bottom">
            <view class="product-price">
              <text class="price-symbol">¥</text>
              <text class="price-val">{{item.price}}</text>
            </view>
            <text v-if="item.is_promotion" class="promo-tag">促销</text>
          </view>
        </view>
      </navigator>
    </template>
  </view>

  <view v-if="loading" class="loading-more">加载中...</view>
  <view v-if="!loading && products.length === 0" class="empty-state">暂无商品</view>
  <view v-if="!loading && products.length > 0 && products.length >= total" class="no-more">没有更多了</view>
</view>

</template>

<script>
import { createPage } from '@/common/page-compat.js';
import pageDef from './index.page.js';

export default createPage(pageDef);
</script>

<style>
.mall-page {
  background: #f5f7fb;
  min-height: 100vh;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
}

.top-panel {
  background: #f5f7fb;
  padding: 20rpx 24rpx 14rpx;
  position: sticky;
  top: 0;
  z-index: 50;
}

.panel-title {
  font-size: 42rpx;
  font-weight: 700;
  color: #2d3436;
  margin-bottom: 14rpx;
}

.search-bar {
  background: #fff;
  border-radius: 36rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  padding: 0 22rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
}

.search-icon {
  margin-right: 12rpx;
  font-size: 28rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
}

.category-scroll {
  white-space: nowrap;
  background: #f5f7fb;
  padding: 6rpx 18rpx 12rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
}

.category-item {
  display: inline-block;
  padding: 0 24rpx;
  height: 64rpx;
  line-height: 64rpx;
  font-size: 26rpx;
  color: #666f80;
  position: relative;
  border-radius: 32rpx;
  margin-right: 12rpx;
  background: #ffffff;
  border: 2rpx solid #edf0f3;
}

.category-item.active {
  color: #fff;
  font-weight: 600;
  background: linear-gradient(135deg, #00b894, #0984e3);
  border-color: transparent;
}

.category-item.active::after {
  content: none;
}

.product-grid {
  padding: 10rpx 24rpx 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.product-card {
  background: #fff;
  border-radius: 22rpx;
  overflow: hidden;
  box-shadow: 0 10rpx 28rpx rgba(0, 0, 0, 0.05);
}

.product-img {
  width: 100%;
  height: 310rpx;
  background: #eee;
}

.product-info {
  padding: 18rpx 18rpx 20rpx;
}

.product-name {
  font-size: 27rpx;
  color: #222;
  margin-bottom: 12rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 76rpx;
  line-height: 1.4;
}

.product-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-price {
  display: flex;
  align-items: baseline;
  color: #ff4d4f;
}

.price-symbol {
  font-size: 22rpx;
}

.price-val {
  font-size: 34rpx;
  font-weight: 700;
}

.promo-tag {
  font-size: 20rpx;
  border: 2rpx solid #ff4d4f;
  border-radius: 10rpx;
  padding: 2rpx 10rpx;
  color: #ff4d4f;
  background: #fff5f5;
}

.loading-more,
.no-more,
.empty-state {
  text-align: center;
  padding: 44rpx 20rpx;
  color: #96a0aa;
  font-size: 25rpx;
}

</style>
