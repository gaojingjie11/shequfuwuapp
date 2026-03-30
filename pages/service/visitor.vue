<template>
<view class="container page-shell">
  <view class="tabs">
    <view :class="'tab-item ' + (activeTab === 0 ? 'active' : '')" @tap="switchTab" data-index="0">访客登记</view>
    <view :class="'tab-item ' + (activeTab === 1 ? 'active' : '')" @tap="switchTab" data-index="1">访客记录</view>
  </view>

  <view class="tab-content" v-if="activeTab === 0">
    <view class="form-card card">
      <view class="form-item">
        <text class="label">访客姓名</text>
        <input class="input" placeholder="请输入姓名" @input="onInput" data-field="name" :value="name" />
      </view>
      <view class="form-item">
        <text class="label">手机号码</text>
        <input class="input" type="number" placeholder="请输入手机号" @input="onInput" data-field="mobile" :value="mobile" />
      </view>
      <view class="form-item">
        <text class="label">来访时间</text>
        <input class="input" placeholder="yyyy-MM-dd HH:mm" @input="onInput" data-field="visit_time" :value="visit_time" />
      </view>
      <view class="form-item">
        <text class="label">来访事由</text>
        <input class="input" placeholder="例如：亲友拜访" @input="onInput" data-field="reason" :value="reason" />
      </view>
      <button class="submit-btn btn btn-primary" @tap="handleSubmit">提交登记</button>
    </view>
  </view>

  <view class="tab-content" v-if="activeTab === 1">
    <button class="refresh-btn" size="mini" @tap="getHistory">刷新</button>
    <view class="history-list">
      <template v-for="item in historyList" :key="item.id">
        <view class="history-item card">
          <view class="row">
            <text class="name">{{item.visitor_name}}</text>
            <text :class="'status status-' + item.status">{{item.status === 1 ? '已通过' : (item.status === 2 ? '已拒绝' : '待审核')}}</text>
          </view>
          <view class="row sub">
            <text>手机：{{item.visitor_mobile}}</text>
            <text>时间：{{item.visit_time}}</text>
          </view>
          <view class="row sub" v-if="item.plate_number">
            <text>车牌：{{item.plate_number}}</text>
          </view>
          <view class="reason">事由：{{item.reason}}</view>
        </view>
      </template>
      <view v-if="historyList.length === 0" class="empty-text">暂无记录</view>
    </view>
  </view>
</view>
</template>

<script>
import { createPage } from '@/common/page-compat.js';
import pageDef from './visitor.page.js';

export default createPage(pageDef);
</script>

<style>
.container {
  min-height: 100vh;
  padding: 24rpx;
  background: var(--bg-page);
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
  color: var(--text-secondary);
  background: #e9eff6;
  border-radius: 999rpx;
}

.tab-item.active {
  color: #fff;
  background: var(--primary-color);
  font-weight: 600;
}

.form-card {
  margin-bottom: 0;
}

.form-item {
  margin-bottom: 24rpx;
}

.label {
  display: block;
  font-size: 24rpx;
  color: var(--text-secondary);
  margin-bottom: 12rpx;
}

.submit-btn {
  margin-top: 12rpx;
}

.refresh-btn {
  margin-bottom: 20rpx;
  border-radius: 999rpx;
  border: 2rpx solid #c8dbed;
  color: var(--primary-color);
  background: #edf4fb;
}

.refresh-btn::after {
  border: none;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.history-item {
  margin-bottom: 0;
}

.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.name {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.sub {
  font-size: 24rpx;
  color: var(--text-secondary);
}

.reason {
  font-size: 26rpx;
  color: var(--text-primary);
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 2rpx dashed var(--border-color);
}

.status {
  font-size: 22rpx;
  border-radius: 999rpx;
  padding: 4rpx 16rpx;
}

.status-0 {
  background: #fff8e8;
  color: #a36a00;
}

.status-1 {
  background: #e9f8f2;
  color: #1f9d72;
}

.status-2 {
  background: #fff1f1;
  color: #c74545;
}

.empty-text {
  text-align: center;
  color: var(--text-tertiary);
  padding: 48rpx 0;
}
</style>
