<template>
<view class="container">
  <view class="tabs">
    <view :class="'tab-item ' + (activeTab === 0 ? 'active' : '')" @tap="switchTab" data-index="0">访客登记</view>
    <view :class="'tab-item ' + (activeTab === 1 ? 'active' : '')" @tap="switchTab" data-index="1">访客记录</view>
  </view>

  <!-- Register Form -->
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
         <!-- Use simple input for now or picker if needed, simplified for text input due to format variance -->
        <input class="input" placeholder="yyyy-MM-dd HH:mm" @input="onInput" data-field="visit_time" :value="visit_time" />
      </view>
      <view class="form-item">
        <text class="label">来访事由</text>
        <input class="input" placeholder="例如：亲友拜访" @input="onInput" data-field="reason" :value="reason" />
      </view>
      <button class="submit-btn" type="primary" @tap="handleSubmit">提交登记</button>
    </view>
  </view>

  <!-- History List -->
  <view class="tab-content" v-if="activeTab === 1">
    <button class="refresh-btn" size="mini" @tap="getHistory">刷新</button>
    <view class="history-list">
      <template v-for="(item, index) in historyList" :key="item.id">
        <view class="history-item card">
             <view class="row">
                <text class="name">{{item.visitor_name}}</text>
                <text :class="'status status-' + (item.status)">{{item.status === 1 ? '已通过' : (item.status === 2 ? '已拒绝' : '待审核')}}</text>
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
  background: #f7f8fa;
  padding: 20rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
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
  background: #409EFF;
  font-weight: bold;
}

.form-card {
  padding: 30rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 12rpx;
}

.input {
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  padding: 16rpx;
  font-size: 28rpx;
}

.submit-btn {
  margin-top: 40rpx;
  width: 100%;
}

.history-item {
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.name {
  font-size: 30rpx;
  font-weight: bold;
}

.sub {
  font-size: 24rpx;
  color: #666;
}

.reason {
  font-size: 26rpx;
  color: #333;
  margin-top: 10rpx;
  padding-top: 10rpx;
  border-top: 1rpx dashed #eee;
}

.empty-text {
  text-align: center;
  color: #999;
  margin-top: 50rpx;
}

.refresh-btn {
    margin-bottom: 20rpx;
}

</style>
