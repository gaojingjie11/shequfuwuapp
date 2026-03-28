<template>
<view class="cart-page">
  <view class="cart-list" v-if="cartItems.length > 0">
    <template v-for="(item, index) in cartItems" :key="item.id">
      <view class="cart-item card">
        <view class="item-main">
          <image class="item-image" :src="item.product.image_url || '/assets/icons/mall.png'" mode="aspectFill"></image>
          <view class="item-info">
            <view class="item-name">{{item.product.name}}</view>
            <view class="item-price">单价 ¥{{item.product.price}}</view>
          </view>
          <view class="delete-btn" @tap="deleteItem" :data-id="item.id">删除</view>
        </view>

        <view class="item-bottom">
          <view class="subtotal">小计 ¥{{((parseFloat(item.product.price) || 0) * item.quantity).toFixed(2)}}</view>
          <view class="quantity-control">
            <view class="qty-btn" @tap="updateQuantity" :data-index="index" :data-delta="-1">-</view>
            <view class="qty-num">{{item.quantity}}</view>
            <view class="qty-btn qty-plus" @tap="updateQuantity" :data-index="index" :data-delta="1">+</view>
          </view>
        </view>
      </view>
    </template>
  </view>
  
  <view class="empty-state" v-else>
    <view class="empty-icon">🛍️</view>
    <view class="empty-title">购物车还是空的</view>
    <view class="empty-desc">把想买的商品先加入购物车吧</view>
    <navigator url="/pages/mall/index" open-type="switchTab" class="btn btn-primary empty-btn">去逛商城</navigator>
  </view>

  <view class="cart-footer" v-if="cartItems.length > 0">
    <view class="total-info">
      <text class="total-label">合计</text>
      <text class="total-price">¥{{totalPrice}}</text>
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
  padding-bottom: calc(170rpx + env(safe-area-inset-bottom));
  min-height: 100vh;
  background: #f5f7fb;
  padding: 20rpx 24rpx calc(170rpx + env(safe-area-inset-bottom));
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.cart-item {
  padding: 24rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 10rpx 28rpx rgba(0, 0, 0, 0.05);
}

.item-main {
  display: flex;
  align-items: flex-start;
}

.item-image {
  width: 146rpx;
  height: 146rpx;
  border-radius: 18rpx;
  background: #eee;
  margin-right: 20rpx;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 28rpx;
  color: #222;
  margin-bottom: 10rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.45;
}

.item-price {
  color: #8a94a1;
  font-size: 24rpx;
}

.delete-btn {
  margin-left: 16rpx;
  font-size: 24rpx;
  color: #8f99a5;
  padding: 6rpx 14rpx;
  border: 2rpx solid #e7ebef;
  border-radius: 22rpx;
}

.item-bottom {
  margin-top: 20rpx;
  padding-top: 16rpx;
  border-top: 2rpx solid #f1f3f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.subtotal {
  color: #ff4d4f;
  font-size: 30rpx;
  font-weight: 700;
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 2rpx solid #e1e5ea;
  border-radius: 16rpx;
  overflow: hidden;
  height: 62rpx;
}

.qty-btn {
  width: 62rpx;
  height: 62rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6d7784;
  font-size: 32rpx;
  background: #fff;
}

.qty-plus {
  color: #fff;
  background: #00b894;
}

.qty-num {
  min-width: 74rpx;
  text-align: center;
  font-size: 28rpx;
  font-weight: 600;
  border-left: 2rpx solid #e1e5ea;
  border-right: 2rpx solid #e1e5ea;
  height: 62rpx;
  line-height: 62rpx;
  color: #2d3436;
  padding: 0 8rpx;
}

.cart-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  min-height: 120rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14rpx 24rpx calc(12rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -10rpx 28rpx rgba(0, 0, 0, 0.08);
  z-index: 100;
}

.total-info {
  display: flex;
  align-items: baseline;
}

.total-label {
  font-size: 26rpx;
  color: #7a8593;
}

.total-price {
  color: #ff4d4f;
  font-size: 44rpx;
  font-weight: 700;
  margin-left: 12rpx;
}

.checkout-btn {
  margin: 0;
  border-radius: 40rpx;
  min-width: 230rpx;
  height: 84rpx;
  font-size: 30rpx;
  font-weight: 600;
}

.checkout-btn::after {
  border: none;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;
  color: #8c97a3;
}

.empty-icon {
  font-size: 122rpx;
  margin-bottom: 26rpx;
  opacity: 0.45;
}

.empty-title {
  font-size: 32rpx;
  color: #2d3436;
  font-weight: 600;
}

.empty-desc {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #8c97a3;
}

.empty-btn {
  margin-top: 28rpx;
  width: 300rpx;
  height: 82rpx;
  border-radius: 41rpx;
  font-size: 28rpx;
  line-height: 82rpx;
}

</style>
