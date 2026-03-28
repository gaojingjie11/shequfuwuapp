<template>
<view class="create-order-page">
  <view class="container">
    <view class="page-title">确认订单</view>
    
    <!-- Store Selector -->
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
    
    <!-- Items -->
    <view class="section card">
      <view class="section-title">商品清单</view>
      <view class="order-items">
        <template v-for="(item, index) in cartItems" :key="item.id">
          <view class="item">
            <image class="item-img" :src="item.product.image_url || '/assets/icons/mall.png'" mode="aspectFill"></image>
            <view class="item-info">
              <view class="name">{{item.product.name}}</view>
              <view class="price">¥{{item.product.price}} x {{item.quantity}}</view>
            </view>
            <view class="item-total">¥{{(item.product.price * item.quantity)}}</view>
          </view>
        </template>
      </view>
    </view>
  </view>
  
  <view class="footer-bar">
    <view class="total-info">
      <text>共 {{totalCount}} 件, 合计:</text>
      <text class="total-price">¥{{totalPrice}}</text>
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
/* pages/order/create.wxss */
.create-order-page {
  min-height: 100vh;
  padding-bottom: calc(170rpx + env(safe-area-inset-bottom));
  background: #f7f8fa;
  padding-top: 20rpx;
}

.page-title {
  padding: 0 32rpx;
  font-size: 40rpx;
  font-weight: 600;
  margin-bottom: 32rpx;
}

.section {
  background: #fff;
  border-radius: 24rpx;
  margin: 0 32rpx 32rpx;
  padding: 32rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 24rpx;
  border-bottom: 2rpx solid #f0f0f0;
  padding-bottom: 16rpx;
}

.picker-row {
  display: flex;
  justify-content: space-between;
  padding: 24rpx 0;
  font-size: 32rpx;
}

.store-address {
  font-size: 24rpx;
  color: #999;
}

.item {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.item-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
  background: #eee;
  margin-right: 24rpx;
}

.item-info {
  flex: 1;
}

.name {
  font-size: 28rpx;
  margin-bottom: 8rpx;
}

.price {
  font-size: 24rpx;
  color: #999;
}

.item-total {
  font-weight: 600;
  font-size: 28rpx;
}

.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  min-height: 120rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48rpx calc(12rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.05);
}

.total-price {
  color: #ff4d4f;
  font-size: 40rpx;
  font-weight: 700;
  margin-left: 16rpx;
}

.submit-btn {
  margin: 0;
  border-radius: 40rpx;
  padding: 16rpx 64rpx;
  font-size: 28rpx;
}

.submit-btn::after {
  border: none;
}

</style>
