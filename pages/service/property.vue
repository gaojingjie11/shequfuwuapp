<template>
<view class="container page-shell">
  <view class="mix-pay-tip card" v-if="userInfo">
    <view class="tip-title">当前绿色积分 {{userInfo.green_points || 0}}，账户余额 ￥{{userBalanceText}}</view>
    <view class="tip-desc">支付时将按 {{greenPointsPerYuan}} 积分 = 1 元，自动优先扣除积分，不足部分再扣余额。</view>
  </view>

  <view class="tabs">
    <view :class="'tab-item ' + (activeTab === 0 ? 'active' : '')" @tap="switchTab" data-index="0">待缴费</view>
    <view :class="'tab-item ' + (activeTab === 1 ? 'active' : '')" @tap="switchTab" data-index="1">已缴费</view>
  </view>

  <view class="list">
    <template v-for="item in list" :key="item.id">
      <view class="fee-card card">
        <view class="header">
          <text class="title">{{item.title || '物业费账单'}}</text>
          <text class="amount">￥{{item.amount_text}}</text>
        </view>

        <view class="info">
          <view class="row">
            <text class="label">账单月份：</text>
            <text class="val">{{item.month}}</text>
          </view>
          <view class="row" v-if="activeTab === 0">
            <text class="label">预计抵扣：</text>
            <text class="val">{{item.payment_preview.points}} 积分</text>
          </view>
          <view class="row" v-if="activeTab === 0">
            <text class="label">预计余额：</text>
            <text class="val">￥{{item.payment_preview.balance_text}}</text>
          </view>
          <view class="row" v-if="activeTab === 1">
            <text class="label">实际积分：</text>
            <text class="val">{{item.used_points || 0}}</text>
          </view>
          <view class="row" v-if="activeTab === 1">
            <text class="label">实际余额：</text>
            <text class="val">￥{{item.used_balance_text}}</text>
          </view>
          <view class="row" v-if="activeTab === 1">
            <text class="label">缴费时间：</text>
            <text class="val">{{item.pay_time}}</text>
          </view>
        </view>

        <view class="footer" v-if="activeTab === 0">
          <button class="pay-btn" size="mini" type="primary" @tap="handlePay" :data-id="item.id">立即缴费</button>
        </view>
        <view class="footer" v-else>
          <text class="status-tag">已缴费</text>
        </view>
      </view>
    </template>

    <view v-if="list.length === 0" class="empty-state">
      <image src="/assets/icons/service.png" mode="widthFix" class="empty-icon"></image>
      <view class="empty-text">暂无相关费用</view>
    </view>
  </view>
</view>
</template>

<script>
import { createPage } from '@/common/page-compat.js';
import pageDef from './property.page.js';

export default createPage(pageDef);
</script>

<style>
.container {
  min-height: 100vh;
  padding: 24rpx;
  background: var(--bg-page);
}

.mix-pay-tip {
  margin-bottom: 24rpx;
  background: #eef8ef;
  border: 2rpx solid #cde8d1;
}

.tip-title {
  color: #227b58;
  font-size: 28rpx;
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
  margin-bottom: 24rpx;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  font-size: 26rpx;
  border-radius: 999rpx;
  color: var(--text-secondary);
  background: #e9eff6;
}

.tab-item.active {
  color: #fff;
  background: var(--primary-color);
  font-weight: 600;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.fee-card {
  margin-bottom: 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx dashed var(--border-color);
}

.title {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.amount {
  font-size: 40rpx;
  font-weight: 700;
  color: #c74545;
}

.row {
  display: flex;
  margin-bottom: 12rpx;
  font-size: 26rpx;
}

.label {
  color: var(--text-secondary);
  width: 184rpx;
}

.val {
  color: var(--text-primary);
}

.footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 2rpx solid var(--border-color);
}

.pay-btn {
  margin: 0;
  min-height: 60rpx;
  line-height: 60rpx;
  border-radius: 999rpx;
  padding: 0 24rpx;
  background: var(--primary-color) !important;
}

.pay-btn::after {
  border: none;
}

.status-tag {
  font-size: 22rpx;
  color: #1f9d72;
  background: #e9f8f2;
  padding: 6rpx 18rpx;
  border-radius: 999rpx;
}

.empty-state {
  text-align: center;
  padding-top: 120rpx;
  color: var(--text-tertiary);
}

.empty-icon {
  width: 180rpx;
  opacity: 0.65;
  margin-bottom: 20rpx;
}
</style>
