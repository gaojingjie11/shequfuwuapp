<template>
<view class="order-page page-shell">
  <view class="mix-pay-tip card" v-if="userInfo">
    <view class="tip-title">混合支付已启用（{{greenPointsPerYuan}} 积分 = 1 元）</view>
    <view class="tip-desc">系统会优先扣除绿色积分，不足部分再扣除余额。</view>
    <view class="tip-desc">当前绿色积分 {{userInfo.green_points || 0}}，余额 ￥{{userBalanceText}}</view>
  </view>

  <view class="tabs">
    <template v-for="item in tabs" :key="item.status">
      <view :class="'tab-item ' + (currentTabStatus === item.status ? 'active' : '')" @tap="switchTab" :data-status="item.status">
        {{item.name}}
      </view>
    </template>
  </view>

  <view class="order-list">
    <template v-for="item in orders" :key="item.id">
      <view class="order-card card" @tap="goToDetail" :data-id="item.id">
        <view class="order-header">
          <text class="order-no">单号: {{item.order_no}}</text>
          <text :class="'order-status ' + (item.status === 1 ? 'text-success' : (item.status === 0 ? 'text-warning' : ''))">
            {{statusMap[item.status]}}
          </text>
        </view>

        <view class="order-body">
          <template v-for="prod in item.items" :key="prod.id">
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
          <view class="total-row">共 {{item.items.length}} 件商品</view>
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
  background: var(--bg-page);
  padding-bottom: 16rpx;
}

.mix-pay-tip {
  margin: 24rpx;
  background: #eef8ef;
  border: 2rpx solid #cde8d1;
}

.tip-title {
  font-size: 28rpx;
  color: #227b58;
  font-weight: 700;
  margin-bottom: 12rpx;
}

.tip-desc {
  color: #3d7d61;
  font-size: 24rpx;
  line-height: 1.6;
}

.tabs {
  display: flex;
  gap: 16rpx;
  padding: 0 24rpx 20rpx;
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--bg-page);
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 14rpx 0;
  font-size: 26rpx;
  color: var(--text-secondary);
  border-radius: 999rpx;
  background: #e9eff6;
}

.tab-item.active {
  color: #fff;
  background: var(--primary-color);
  font-weight: 600;
}

.order-list {
  padding: 0 24rpx 28rpx;
}

.order-card {
  margin-bottom: 24rpx;
  border-radius: 28rpx;
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
  font-size: 24rpx;
  border-bottom: 2rpx solid var(--border-color);
  padding-bottom: 16rpx;
}

.order-no {
  color: var(--text-secondary);
}

.order-status {
  font-weight: 700;
}

.text-success {
  color: #1f9d72;
}

.text-warning {
  color: #c47b00;
}

.prod-row {
  display: flex;
  margin-bottom: 20rpx;
}

.prod-row:last-child {
  margin-bottom: 0;
}

.prod-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 16rpx;
  background: #e8eef5;
  margin-right: 20rpx;
}

.prod-info {
  flex: 1;
}

.prod-name {
  font-size: 28rpx;
  color: var(--text-primary);
  margin-bottom: 8rpx;
}

.prod-meta {
  color: var(--text-secondary);
  font-size: 24rpx;
}

.payment-info {
  margin-top: 20rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12rpx 16rpx;
  color: var(--text-secondary);
  font-size: 24rpx;
}

.order-footer {
  margin-top: 20rpx;
  border-top: 2rpx solid var(--border-color);
  padding-top: 20rpx;
}

.total-row {
  text-align: right;
  font-size: 26rpx;
  margin-bottom: 20rpx;
  color: var(--text-primary);
}

.action-row {
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
}

.btn-mini {
  margin: 0;
  min-height: 60rpx;
  line-height: 60rpx;
  font-size: 24rpx;
  padding: 0 24rpx;
  border-radius: 999rpx;
  background: #fff;
  border: 2rpx solid var(--border-strong);
  color: var(--text-secondary);
}

.btn-mini::after {
  border: none;
}

.btn-danger {
  color: var(--danger-color);
  border-color: #f2c2c2;
  background: #fff3f3;
}

.btn-primary {
  color: var(--primary-color);
  border-color: #b7d1e8;
  background: #edf5fd;
}

.empty-state {
  text-align: center;
  padding: 96rpx 0 44rpx;
  color: var(--text-tertiary);
}
</style>
