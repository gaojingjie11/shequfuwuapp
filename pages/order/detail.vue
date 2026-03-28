<template>
<view class="detail-page" v-if="order">
  <view class="status-card card">
    <view class="status-text">{{statusMap[order.status]}}</view>
    <view class="order-no">订单号: {{order.order_no}}</view>
  </view>
  
  <view class="address-card card">
    <view class="section-title">收货信息/门店</view>
    <view class="address-text">{{order.store ? order.store.name + ' (' + order.store.address + ')' : '自提'}}</view>
  </view>

  <view class="prod-card card">
    <template v-for="(item, index) in order.items" :key="item.id">
      <view class="prod-row">
         <image class="prod-img" :src="item.product.image_url" mode="aspectFill"></image>
         <view class="prod-info">
           <view class="prod-name">{{item.product.name}}</view>
           <view class="prod-meta">¥{{item.price}} x {{item.quantity}}</view>
         </view>
      </view>
    </template>
    <view class="total-row">
      <text>实付金额:</text>
      <text class="total-price">¥{{order.total_amount}}</text>
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
/* pages/order/detail.wxss */
.detail-page {
  padding: 32rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
  background: #f7f8fa;
  min-height: 100vh;
}
.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
}
.status-text {
  font-size: 40rpx;
  font-weight: 600;
  color: #00b894;
  margin-bottom: 16rpx;
}
.order-no { color: #999; font-size: 28rpx; }
.section-title { font-weight: 600; margin-bottom: 16rpx; }
.address-text { color: #666; font-size: 28rpx; }
.prod-row { display: flex; margin-bottom: 24rpx; }
.prod-img { width: 120rpx; height: 120rpx; border-radius: 8rpx; margin-right: 24rpx; background: #eee; }
.prod-info { flex: 1; }
.prod-name { font-size: 28rpx; margin-bottom: 8rpx; }
.prod-meta { color: #999; font-size: 24rpx; }
.total-row { text-align: right; border-top: 2rpx solid #f0f0f0; padding-top: 24rpx; font-weight: 600; }
.total-price { color: #ff4d4f; font-size: 36rpx; margin-left: 16rpx; }

</style>
