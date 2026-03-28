<template>
<view class="container">
  <view class="product-list" v-if="products.length > 0">
    <view class="product-item card" @tap="goToDetail" :data-id="item.id" v-for="(item, index) in products" :key="item.id">
      <image class="product-img" :src="item.image_url" mode="aspectFill"></image>
      <view class="product-info">
        <view class="product-name">{{item.name}}</view>
        <view class="product-price">¥{{item.price}}</view>
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
  background: #f7f8fa;
  padding: 20rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}

.product-item {
  display: flex;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.product-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
}

.product-price {
  font-size: 32rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.action-row {
  display: flex;
  justify-content: flex-end;
}

.delete-btn {
  font-size: 24rpx;
  color: #999;
  padding: 8rpx 16rpx;
  border: 1rpx solid #eee;
  border-radius: 20rpx;
}

.empty-state {
  padding-top: 200rpx;
  text-align: center;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  color: #999;
  font-size: 28rpx;
}

</style>
