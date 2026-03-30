<template>
<view class="cart-page page-shell">
  <view class="cart-list" v-if="cartItems.length > 0">
    <template v-for="(item, index) in cartItems" :key="item.id">
      <view class="cart-item card">
        <image class="item-image" :src="item.product.image_url || '/assets/icons/mall.png'" mode="aspectFill"></image>
        <view class="item-info">
          <view class="item-name">{{item.product.name}}</view>
          <view class="item-price">￥{{item.product.price}}</view>
        </view>

        <view class="quantity-control">
          <view class="qty-btn" @tap="updateQuantity" :data-index="index" :data-delta="-1">-</view>
          <view class="qty-num">{{item.quantity}}</view>
          <view class="qty-btn" @tap="updateQuantity" :data-index="index" :data-delta="1">+</view>
        </view>

        <view class="delete-btn" @tap="deleteItem" :data-id="item.id">删除</view>
      </view>
    </template>
  </view>
  
  <view class="empty-state" v-else>
    <view class="empty-icon">🛒</view>
    <view class="empty-text">购物车是空的</view>
    <navigator url="/pages/mall/index" open-type="switchTab" class="btn btn-primary mt-md">去购物</navigator>
  </view>

  <view class="cart-footer" v-if="cartItems.length > 0">
    <view class="total-info">
      <text>总计:</text>
      <text class="total-price">￥{{totalPrice}}</text>
    </view>
    <button class="btn btn-primary checkout-btn" @tap="checkout">结算</button>
  </view>
</view>
</template>

<script>
import { createPage } from '@/common/page-compat.js';
import pageDef from './cart.page.js';

export default createPage(pageDef);
</script>

<style>
.cart-page {
  padding: 24rpx 24rpx calc(180rpx + env(safe-area-inset-bottom));
  min-height: 100vh;
  background: var(--bg-page);
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.cart-item {
  margin: 0;
  display: flex;
  align-items: center;
  padding: 28rpx;
}

.item-image {
  width: 144rpx;
  height: 144rpx;
  border-radius: 20rpx;
  background: #e8eef5;
  margin-right: 20rpx;
}

.item-info {
  flex: 1;
  margin-right: 20rpx;
}

.item-name {
  font-size: 28rpx;
  color: var(--text-primary);
  margin-bottom: 12rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-price {
  color: #c74545;
  font-weight: 700;
  font-size: 28rpx;
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 2rpx solid var(--border-strong);
  border-radius: 999rpx;
  height: 60rpx;
  background: #f8fafc;
}

.qty-btn {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 32rpx;
}

.qty-num {
  width: 56rpx;
  text-align: center;
  font-size: 24rpx;
  color: var(--text-primary);
}

.delete-btn {
  margin-left: 20rpx;
  font-size: 24rpx;
  color: var(--text-tertiary);
}

.empty-state {
  text-align: center;
  padding-top: 200rpx;
}

.empty-icon {
  font-size: 96rpx;
}

.empty-text {
  margin-top: 20rpx;
  color: var(--text-secondary);
}

.mt-md {
  margin-top: 32rpx;
  display: inline-flex;
  min-width: 240rpx;
}

.cart-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 2rpx solid var(--border-color);
  padding: 20rpx 24rpx calc(20rpx + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
}

.total-info {
  color: var(--text-secondary);
  font-size: 28rpx;
}

.total-price {
  margin-left: 12rpx;
  color: #c74545;
  font-size: 36rpx;
  font-weight: 700;
}

.checkout-btn {
  min-width: 240rpx;
}
</style>
