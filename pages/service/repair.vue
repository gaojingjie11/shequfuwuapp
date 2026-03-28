<template>
  <view class="repair-page">
    <view class="container">
      <view class="page-title">报修投诉</view>

      <view class="card repair-form">
        <view class="form-title">提交新的报修或投诉</view>

        <picker :value="typeIndex" :range="types" @change="bindTypeChange">
          <view class="form-group">
            <text class="label">类型</text>
            <view class="picker-field">
              <text class="picker-val">{{ types[typeIndex] }}</text>
              <text class="arrow">></text>
            </view>
          </view>
        </picker>

        <view class="form-group">
          <text class="label">分类</text>
          <input
            class="input"
            placeholder="例如：水电、门窗、电梯、噪音"
            @input="onInput"
            data-field="category"
            :value="category"
          />
        </view>

        <view class="form-group">
          <text class="label">详细描述</text>
          <textarea
            class="textarea"
            placeholder="请详细描述问题，便于物业快速处理"
            @input="onInput"
            data-field="content"
            :value="content"
          />
        </view>

        <button class="btn btn-primary btn-submit" @tap="submitRepair" :loading="submitting">
          提交
        </button>
      </view>

      <view class="section-title">我的记录</view>
      <view class="repair-list">
        <view v-for="item in repairs" :key="item.id" class="repair-card card">
          <view class="repair-header">
            <view :class="'tag ' + (item.type === 1 ? 'tag-info' : 'tag-warning')">
              {{ item.type === 1 ? '报修' : '投诉' }}
            </view>
            <view class="repair-category">{{ item.category }}</view>
            <view class="tag tag-status">{{ statusMap[item.status] || '待处理' }}</view>
          </view>
          <view class="repair-content">{{ item.content }}</view>
          <view v-if="item.result" class="repair-result">
            <text class="bold">处理结果：</text>{{ item.result }}
          </view>
          <view class="repair-time">{{ item.created_at_text || '-' }}</view>
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
  background: #f7f8fa;
  padding: 32rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
}

.page-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #18222f;
  margin-bottom: 32rpx;
}

.repair-form {
  background: #fff;
  padding: 36rpx;
  border-radius: 24rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 16rpx 48rpx rgba(15, 23, 42, 0.05);
}

.form-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #18222f;
  margin-bottom: 28rpx;
}

.form-group {
  margin-bottom: 28rpx;
}

.label {
  display: block;
  font-size: 26rpx;
  color: #5b6675;
  margin-bottom: 14rpx;
}

.picker-field,
.input,
.textarea {
  width: 100%;
  box-sizing: border-box;
  background: #f8fafc;
  border: 2rpx solid #e6edf3;
  border-radius: 18rpx;
  padding: 22rpx 24rpx;
  font-size: 28rpx;
  color: #18222f;
}

.picker-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.picker-val {
  color: #18222f;
}

.arrow {
  color: #94a3b8;
}

.textarea {
  height: 220rpx;
}

.btn-submit {
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 999rpx;
  font-size: 30rpx;
  border: none;
}

.section-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #18222f;
  margin-bottom: 24rpx;
}

.repair-card {
  background: #fff;
  padding: 28rpx;
  border-radius: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 16rpx 48rpx rgba(15, 23, 42, 0.04);
}

.repair-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.repair-category {
  flex: 1;
  font-size: 28rpx;
  font-weight: 700;
  color: #18222f;
}

.tag {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  line-height: 1;
}

.tag-info {
  background: #e8f7ff;
  color: #1477d4;
}

.tag-warning {
  background: #fff6dd;
  color: #c98512;
}

.tag-status {
  background: #eef2f6;
  color: #64748b;
}

.repair-content {
  font-size: 27rpx;
  line-height: 1.8;
  color: #475569;
}

.repair-result {
  margin-top: 18rpx;
  padding: 18rpx 20rpx;
  border-radius: 18rpx;
  background: #f8fafc;
  font-size: 25rpx;
  line-height: 1.7;
  color: #475569;
}

.bold {
  font-weight: 700;
  color: #18222f;
}

.repair-time {
  margin-top: 18rpx;
  font-size: 24rpx;
  color: #94a3b8;
}

.empty-state {
  text-align: center;
  color: #94a3b8;
  padding: 48rpx 0;
}
</style>
