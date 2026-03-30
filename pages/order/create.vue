<template>
<view class="create-order-page page-shell">
  <view class="container">
    <view class="page-title">确认订单</view>
    
    <view class="section card">
      <view class="section-title">选择服务门店</view>
      <picker :range="storeList" range-key="name" @change="bindStoreChange" :value="selectedStoreIndex">
        <view class="picker-row">
          <text>{{storeList[selectedStoreIndex].name || '请选择门店'}}</text>
          <text class="arrow">></text>
        </view>
      </picker>
      <view class="store-address" v-if="storeList.length > 0">{{storeList[selectedStoreIndex].address}}</view>
    </view>
    
    <view class="section card">
      <view class="section-title">商品清单</view>
      <view class="order-items">
        <template v-for="item in cartItems" :key="item.id">
          <view class="item">
            <image class="item-img" :src="item.product.image_url || '/assets/icons/mall.png'" mode="aspectFill"></image>
            <view class="item-info">
              <view class="name">{{item.product.name}}</view>
              <view class="price">￥{{item.product.price}} x {{item.quantity}}</view>
            </view>
            <view class="item-total">￥{{(item.product.price * item.quantity)}}</view>
          </view>
        </template>
      </view>
    </view>
  </view>
  
  <view class="footer-bar">
    <view class="total-info">
      <text>共 {{totalCount}} 件 合计:</text>
      <text class="total-price">￥{{totalPrice}}</text>
    </view>
    <button class="btn btn-primary submit-btn" @tap="submitOrder" :loading="submitting">提交订单</button>
  </view>
</view>
</template>

<script>
import { createPage } from '@/common/page-compat.js';
import pageDef from './create.page.js';

export default createPage(pageDef);
</script>

<style>
.create-order-page {
  min-height: 100vh;
  padding: 24rpx 0 168rpx;
  background: var(--bg-page);
}

.page-title {
  font-size: 44rpx;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 24rpx;
}

.section {
  margin: 0 0 24rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
  margin-bottom: 20rpx;
  color: var(--text-primary);
  padding-bottom: 16rpx;
  border-bottom: 2rpx solid var(--border-color);
}

.picker-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  font-size: 28rpx;
  color: var(--text-primary);
}

.arrow {
  color: var(--text-tertiary);
}

.store-address {
  font-size: 24rpx;
  color: var(--text-secondary);
}

.item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.item:last-child {
  margin-bottom: 0;
}

.item-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 16rpx;
  background: #e8eef5;
  margin-right: 20rpx;
}

.item-info {
  flex: 1;
}

.name {
  font-size: 28rpx;
  color: var(--text-primary);
  margin-bottom: 8rpx;
}

.price {
  font-size: 24rpx;
  color: var(--text-secondary);
}

.item-total {
  font-weight: 700;
  font-size: 28rpx;
  color: #c74545;
}

.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx calc(20rpx + env(safe-area-inset-bottom));
  border-top: 2rpx solid var(--border-color);
  z-index: 20;
}

.total-info {
  font-size: 26rpx;
  color: var(--text-secondary);
}

.total-price {
  color: #c74545;
  font-size: 40rpx;
  font-weight: 700;
  margin-left: 12rpx;
}

.submit-btn {
  margin: 0;
  min-width: 260rpx;
}
</style>
