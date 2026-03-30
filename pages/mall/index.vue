<template>
<view class="mall-page page-shell">
  <view class="mall-top">
    <view class="container">
      <view class="mall-title">社区商城</view>
      <view class="mall-subtitle">精选好物，配送到家</view>
    </view>
  </view>

  <view class="search-section container">
    <view class="search-bar">
      <text class="search-icon">搜索</text>
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
    <template v-for="item in categories" :key="item.id">
      <view
        :class="'category-item ' + (selectedCategory === item.id ? 'active' : '')"
        @tap="selectCategory"
        :data-id="item.id"
      >
        {{ item.name }}
      </view>
    </template>
  </scroll-view>

  <view class="product-grid">
    <template v-for="item in products" :key="item.id">
      <navigator :url="'/pages/mall/detail?id=' + item.id" class="product-card">
        <image class="product-img" :src="item.image_url || '/assets/icons/mall.png'" mode="aspectFill"></image>
        <view class="product-info">
          <view class="product-name">{{ item.name }}</view>
          <view class="product-price">
            <text class="price-symbol">¥</text>
            <text class="price-val">{{ item.price }}</text>
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
  min-height: 100vh;
  background: var(--bg-page);
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
}

.mall-top {
  background: linear-gradient(135deg, #2d597b 0%, #366e9d 70%, #4a84b5 100%);
  color: #fff;
  padding: 48rpx 0 40rpx;
}

.mall-title {
  font-size: 48rpx;
  font-weight: 700;
}

.mall-subtitle {
  margin-top: 10rpx;
  font-size: 24rpx;
  opacity: 0.9;
}

.search-section {
  margin-top: 20rpx;
  margin-bottom: 20rpx;
}

.search-bar {
  display: flex;
  align-items: center;
  height: 80rpx;
  padding: 0 28rpx;
  border-radius: 999rpx;
  background: #fff;
  border: 2rpx solid var(--border-color);
  box-shadow: var(--shadow-soft);
}

.search-icon {
  flex-shrink: 0;
  margin-right: 16rpx;
  color: var(--text-tertiary);
  font-size: 24rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: var(--text-primary);
}

.category-scroll {
  white-space: nowrap;
  padding: 0 24rpx 12rpx;
  height: 92rpx;
  display: flex;
  align-items: center;
}

.category-item {
  display: inline-block;
  margin-right: 12rpx;
  padding: 0 28rpx;
  height: 64rpx;
  line-height: 64rpx;
  border-radius: 999rpx;
  font-size: 24rpx;
  color: var(--text-secondary);
  background: #edf2f8;
}

.category-item.active {
  color: #fff;
  background: var(--primary-color);
  font-weight: 600;
}

.product-grid {
  padding: 0 24rpx;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24rpx;
}

.product-card {
  overflow: hidden;
  border-radius: 28rpx;
  border: 2rpx solid var(--border-color);
  background: #fff;
  box-shadow: var(--shadow-soft);
}

.product-img {
  width: 100%;
  height: 340rpx;
  background: #eef2f6;
}

.product-info {
  padding: 22rpx;
}

.product-name {
  min-height: 80rpx;
  margin-bottom: 16rpx;
  font-size: 28rpx;
  line-height: 1.45;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  display: flex;
  align-items: baseline;
  color: #d94848;
}

.price-symbol {
  font-size: 22rpx;
}

.price-val {
  font-size: 36rpx;
  font-weight: 700;
}

.promo-tag {
  margin-left: 12rpx;
  padding: 2rpx 12rpx;
  border-radius: 999rpx;
  border: 2rpx solid #f4b9b9;
  background: #fff3f3;
  color: #d94848;
  font-size: 20rpx;
  line-height: 1.5;
}

.loading-more,
.no-more,
.empty-state {
  padding: 40rpx 24rpx;
  text-align: center;
  color: var(--text-tertiary);
  font-size: 24rpx;
}
</style>
