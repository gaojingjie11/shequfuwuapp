<template>
  <view class="repair-page page-shell">
    <view class="container">
      <view class="page-title">报修投诉</view>
      
      <view class="card repair-form">
        <view class="form-title">提交新的报修/投诉</view>
        
        <picker @change="bindTypeChange" :value="typeIndex" :range="types">
          <view class="form-group">
            <text class="label">类型</text>
            <view class="picker-val">{{types[typeIndex]}}</view>
            <text class="arrow">></text>
          </view>
        </picker>
        
        <view class="form-group">
          <text class="label">分类</text>
          <input class="input" placeholder="如：水电、门窗、噪音等" @input="onInput" data-field="category" :value="category" />
        </view>
        
        <view class="form-group">
          <text class="label">详细描述</text>
          <textarea class="textarea" placeholder="请详细描述问题" @input="onInput" data-field="content" :value="content"></textarea>
        </view>
        
        <button class="btn btn-primary btn-submit" @tap="submitRepair" :loading="submitting">提交</button>
      </view>
      
      <view class="section-title">我的记录</view>
      <view class="repair-list">
        <view v-for="item in repairs" :key="item.id" class="repair-card card">
          <view class="repair-header">
            <view :class="'tag ' + (item.type === 1 ? 'tag-info' : 'tag-warning')">
              {{item.type === 1 ? '报修' : '投诉'}}
            </view>
            <view class="repair-category">{{item.category}}</view>
            <view class="tag tag-status">{{statusMap[item.status]}}</view>
          </view>
          <view class="repair-content">{{item.content}}</view>
          <view class="repair-result" v-if="item.result">
            <text class="bold">处理结果:</text> {{item.result}}
          </view>
          <view class="repair-time">{{item.created_at_text || item.created_at}}</view>
        </view>
        <view v-if="repairs.length === 0" class="empty-state">暂无记录</view>
      </view>
    </view>
  </view>
</template>

<script>
import { createPage } from '@/common/page-compat.js';
import pageDef from './repair.page.js';

export default createPage(pageDef);
</script>

<style>
.repair-page {
  min-height: 100vh;
  background: var(--bg-page);
  padding: 24rpx;
}

.page-title {
  font-size: 44rpx;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 24rpx;
}

.repair-form {
  margin-bottom: 36rpx;
  padding: 32rpx;
}

.form-title {
  font-size: 32rpx;
  font-weight: 700;
  margin-bottom: 24rpx;
  color: var(--text-primary);
}

.form-group {
  margin-bottom: 24rpx;
  position: relative;
}

.label {
  display: block;
  font-size: 24rpx;
  color: var(--text-secondary);
  margin-bottom: 12rpx;
}

.picker-val {
  width: 100%;
  min-height: 84rpx;
  border: 2rpx solid var(--border-strong);
  border-radius: 24rpx;
  padding: 20rpx 24rpx;
  background: #f9fbfd;
  color: var(--text-primary);
}

.arrow {
  position: absolute;
  right: 24rpx;
  top: 64rpx;
  color: var(--text-tertiary);
}

.input,
.textarea {
  width: 100%;
  border: 2rpx solid var(--border-strong);
  border-radius: 24rpx;
  padding: 20rpx 24rpx;
  font-size: 28rpx;
  background: #f9fbfd;
  color: var(--text-primary);
}

.textarea {
  min-height: 200rpx;
}

.btn-submit {
  margin-top: 12rpx;
}

.section-title {
  font-size: 34rpx;
  font-weight: 700;
  margin-bottom: 20rpx;
  color: var(--text-primary);
}

.repair-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.repair-card {
  margin-bottom: 0;
}

.repair-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  gap: 16rpx;
}

.repair-category {
  font-weight: 700;
  flex: 1;
  color: var(--text-primary);
  font-size: 28rpx;
}

.tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999rpx;
  font-size: 22rpx;
  padding: 4rpx 16rpx;
}

.tag-info {
  background: #edf4fb;
  color: var(--primary-color);
}

.tag-warning {
  background: #fff8e8;
  color: #a36a00;
}

.tag-status {
  background: #eef3f8;
  color: var(--text-secondary);
}

.repair-content {
  font-size: 28rpx;
  color: var(--text-primary);
  line-height: 1.7;
}

.repair-result {
  margin-top: 20rpx;
  padding: 16rpx 20rpx;
  border-radius: 20rpx;
  background: #f7fafc;
  color: var(--text-secondary);
  font-size: 26rpx;
}

.bold {
  color: var(--text-primary);
  font-weight: 600;
}

.repair-time {
  margin-top: 20rpx;
  font-size: 22rpx;
  color: var(--text-tertiary);
}

.empty-state {
  text-align: center;
  color: var(--text-tertiary);
  padding: 68rpx 0 40rpx;
}
</style>
