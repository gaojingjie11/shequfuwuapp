<template>
<view class="container">
  <view class="mix-pay-tip card" v-if="userInfo">
    <view class="tip-title">当前绿色积分 {{userInfo.green_points || 0}}，账户余额 ￥{{userBalanceText}}</view>
    <view class="tip-desc">支付时将按 {{greenPointsPerYuan}} 积分 = 1 元 自动优先扣除积分，不足部分再扣余额。</view>
  </view>

  <view class="tabs">
    <view :class="'tab-item ' + (activeTab === 0 ? 'active' : '')" @tap="switchTab" data-index="0">待缴费</view>
    <view :class="'tab-item ' + (activeTab === 1 ? 'active' : '')" @tap="switchTab" data-index="1">已缴费</view>
  </view>

  <view class="list">
    <template v-for="(item, index) in list" :key="item.id">
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
  background: #f7f8fa;
  padding: 20rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}

.mix-pay-tip {
  margin-bottom: 20rpx;
  background: #f6ffed;
  border: 1rpx solid #b7eb8f;
}

.tip-title {
  color: #389e0d;
  font-size: 26rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.tip-desc {
  color: #5b8c00;
  font-size: 24rpx;
  line-height: 1.6;
}

.tabs {
  display: flex;
  background: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 24rpx 0;
  font-size: 28rpx;
  color: #666;
}

.tab-item.active {
  color: #fff;
  background: #409eff;
  font-weight: bold;
}

.fee-card {
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx dashed #eee;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
}

.amount {
  font-size: 36rpx;
  font-weight: bold;
  color: #f56c6c;
}

.row {
  display: flex;
  margin-bottom: 10rpx;
  font-size: 28rpx;
}

.label {
  color: #666;
  width: 170rpx;
}

.val {
  color: #333;
}

.footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f5f5f5;
}

.pay-btn {
  margin: 0;
}

.status-tag {
  font-size: 24rpx;
  color: #67c23a;
  background: #f0f9eb;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.empty-state {
  text-align: center;
  padding-top: 100rpx;
  color: #999;
}

.empty-icon {
  width: 200rpx;
  opacity: 0.5;
  margin-bottom: 20rpx;
}

</style>
