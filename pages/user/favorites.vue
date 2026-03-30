<template>
<view class="container page-shell">
  <view class="product-list" v-if="products.length > 0">
    <view class="product-item card" @tap="goToDetail" :data-id="item.id" v-for="(item, index) in products" :key="item.id">
      <image class="product-img" :src="item.image_url" mode="aspectFill"></image>
      <view class="product-info">
        <view class="product-name">{{item.name}}</view>
        <view class="product-price">￥{{item.price}}</view>
        <view class="action-row">
            <view class="delete-btn" @tap.stop="removeFavorite" :data-id="item.id" :data-index="index">取消收藏</view>
        </view>
      </view>
    </view>
  </view>
  
  <view class="empty-state" v-else>
    <image src="/assets/icons/empty.png" mode="widthFix" class="empty-icon"></image>
    <view class="empty-text">暂无收藏商品</view>
  </view>
</view>
</template>

<script>
import { createPage } from '@/common/page-compat.js';
import pageDef from './favorites.page.js';

export default createPage(pageDef);
</script>

<style>
.container {
  min-height: 100vh;
  padding: 24rpx;
  background: var(--bg-page);
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.product-item {
  margin-bottom: 0;
  display: flex;
  padding: 24rpx;
}

.product-img {
  width: 172rpx;
  height: 172rpx;
  border-radius: 20rpx;
  margin-right: 20rpx;
  background: #e8eef5;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text-primary);
}

.product-price {
  font-size: 36rpx;
  color: #c74545;
  font-weight: 700;
}

.action-row {
  display: flex;
  justify-content: flex-end;
}

.delete-btn {
  font-size: 22rpx;
  color: var(--text-secondary);
  padding: 6rpx 20rpx;
  border: 2rpx solid var(--border-strong);
  border-radius: 999rpx;
  background: #f7fafc;
}

.empty-state {
  padding-top: 180rpx;
  text-align: center;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
  opacity: 0.72;
}

.empty-text {
  color: var(--text-tertiary);
  font-size: 28rpx;
}
</style>
