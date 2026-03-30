<template>
<view class="detail-page page-shell" v-if="order">
  <view class="status-card card">
    <view class="status-text">{{statusMap[order.status]}}</view>
    <view class="order-no">订单号 {{order.order_no}}</view>
  </view>
  
  <view class="address-card card">
    <view class="section-title">收货信息 / 门店</view>
    <view class="address-text">{{order.store ? order.store.name + ' (' + order.store.address + ')' : '自提'}}</view>
  </view>

  <view class="prod-card card">
    <template v-for="item in order.items" :key="item.id">
      <view class="prod-row">
         <image class="prod-img" :src="item.product.image_url" mode="aspectFill"></image>
         <view class="prod-info">
           <view class="prod-name">{{item.product.name}}</view>
           <view class="prod-meta">￥{{item.price}} x {{item.quantity}}</view>
         </view>
      </view>
    </template>
    <view class="total-row">
      <text>实付金额:</text>
      <text class="total-price">￥{{order.total_amount}}</text>
    </view>
  </view>
</view>
</template>

<script>
import { createPage } from '@/common/page-compat.js';
import pageDef from './detail.page.js';

export default createPage(pageDef);
</script>

<style>
.detail-page {
  padding: 24rpx;
  background: var(--bg-page);
  min-height: 100vh;
}

.status-card,
.address-card,
.prod-card {
  margin-bottom: 24rpx;
}

.status-text {
  font-size: 40rpx;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 12rpx;
}

.order-no {
  color: var(--text-secondary);
  font-size: 26rpx;
}

.section-title {
  font-weight: 700;
  margin-bottom: 16rpx;
  color: var(--text-primary);
  font-size: 30rpx;
}

.address-text {
  color: var(--text-secondary);
  font-size: 28rpx;
  line-height: 1.6;
}

.prod-row {
  display: flex;
  margin-bottom: 20rpx;
}

.prod-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 16rpx;
  margin-right: 20rpx;
  background: #e8eef5;
}

.prod-info {
  flex: 1;
}

.prod-name {
  font-size: 28rpx;
  margin-bottom: 8rpx;
  color: var(--text-primary);
}

.prod-meta {
  color: var(--text-secondary);
  font-size: 24rpx;
}

.total-row {
  text-align: right;
  border-top: 2rpx solid var(--border-color);
  padding-top: 20rpx;
  font-weight: 600;
  color: var(--text-primary);
}

.total-price {
  color: #c74545;
  font-size: 40rpx;
  margin-left: 16rpx;
  font-weight: 700;
}
</style>
