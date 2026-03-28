<template>
<view class="order-page">
  <view class="mix-pay-tip card" v-if="userInfo">
    <view class="tip-title">混合支付已启用（{{greenPointsPerYuan}} 积分 = 1 元）</view>
    <view class="tip-desc">系统会优先扣除绿色积分，不足部分再扣除余额。</view>
    <view class="tip-desc">当前绿色积分 {{userInfo.green_points || 0}}，余额 ￥{{userBalanceText}}</view>
  </view>

  <view class="tabs">
    <template v-for="(item, index) in tabs" :key="item.status">
      <view :class="'tab-item ' + (currentTabStatus === item.status ? 'active' : '')" @tap="switchTab" :data-status="item.status">
        {{item.name}}
      </view>
    </template>
  </view>

  <view class="order-list">
    <template v-for="(item, index) in orders" :key="item.id">
      <view class="order-card card" @tap="goToDetail" :data-id="item.id">
        <view class="order-header">
          <text class="order-no">单号: {{item.order_no}}</text>
          <text :class="'order-status ' + (item.status === 1 ? 'text-success' : (item.status === 0 ? 'text-warning' : ''))">
            {{statusMap[item.status]}}
          </text>
        </view>

        <view class="order-body">
          <template v-for="(prod, index) in item.items" :key="prod.id">
            <view class="prod-row">
              <image class="prod-img" :src="prod.product.image_url || '/assets/icons/mall.png'" mode="aspectFill"></image>
              <view class="prod-info">
                <view class="prod-name">{{prod.product.name}}</view>
                <view class="prod-meta">￥{{prod.price}} x {{prod.quantity}}</view>
              </view>
            </view>
          </template>
        </view>

        <view class="payment-info">
          <text>总额 ￥{{item.total_amount_text}}</text>
          <text v-if="item.status === 0">预计抵扣积分 {{item.payment_preview.points}}</text>
          <text v-if="item.status === 0">预计余额支付 ￥{{item.payment_preview.balance_text}}</text>
          <text v-if="item.used_points > 0">积分抵扣 {{item.used_points}}</text>
          <text v-if="item.used_balance > 0">余额支付 ￥{{item.used_balance_text}}</text>
        </view>

        <view class="order-footer">
          <view class="total-row">共{{item.items.length}}件商品</view>
          <view class="action-row">
            <button class="btn-mini btn-danger" v-if="item.status === 0" @tap.stop="payOrder" :data-id="item.id">立即支付</button>
            <button class="btn-mini" v-if="item.status === 0" @tap.stop="cancelOrder" :data-id="item.id">取消</button>
            <button class="btn-mini btn-primary" v-if="item.status === 2" @tap.stop="confirmReceipt" :data-id="item.id">确认收货</button>
          </view>
        </view>
      </view>
    </template>
    <view v-if="!loading && orders.length === 0" class="empty-state">暂无订单</view>
  </view>
</view>

</template>

<script>
import { createPage } from '@/common/page-compat.js';
import pageDef from './list.page.js';

export default createPage(pageDef);
</script>

<style>
.order-page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
}

.mix-pay-tip {
  margin: 32rpx;
  background: #f6ffed;
  border: 2rpx solid #b7eb8f;
}

.tip-title {
  font-size: 28rpx;
  color: #389e0d;
  font-weight: 600;
  margin-bottom: 12rpx;
}

.tip-desc {
  color: #5b8c00;
  font-size: 24rpx;
  line-height: 1.6;
}

.tabs {
  display: flex;
  background: #fff;
  border-bottom: 2rpx solid #eee;
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 24rpx 0;
  font-size: 28rpx;
  color: #666;
  border-bottom: 4rpx solid transparent;
}

.tab-item.active {
  color: #00b894;
  font-weight: 600;
  border-bottom-color: #00b894;
}

.order-list {
  padding: 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
}

.order-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24rpx;
  font-size: 24rpx;
  border-bottom: 2rpx solid #f0f0f0;
  padding-bottom: 16rpx;
}

.order-no { color: #666; }
.order-status { font-weight: 600; }
.text-success { color: #52c41a; }
.text-warning { color: #faad14; }

.prod-row {
  display: flex;
  margin-bottom: 24rpx;
}

.prod-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
  background: #eee;
  margin-right: 24rpx;
}

.prod-info {
  flex: 1;
}

.prod-name {
  font-size: 28rpx;
  margin-bottom: 8rpx;
}

.prod-meta {
  color: #999;
  font-size: 24rpx;
}

.payment-info {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  color: #666;
  font-size: 24rpx;
  margin-bottom: 24rpx;
}

.order-footer {
  border-top: 2rpx solid #f0f0f0;
  padding-top: 24rpx;
}

.total-row {
  text-align: right;
  font-size: 28rpx;
  margin-bottom: 24rpx;
  color: #333;
}

.action-row {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
}

.btn-mini {
  margin: 0;
  font-size: 24rpx;
  padding: 8rpx 24rpx;
  border-radius: 28rpx;
  background: #fff;
  border: 2rpx solid #ddd;
  color: #666;
}

.btn-danger {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

.btn-primary {
  color: #00b894;
  border-color: #00b894;
}

.empty-state {
  text-align: center;
  padding-top: 100rpx;
  color: #999;
}

</style>
