<template>
<view class="page page-shell">
  <view class="header card">
    <view class="title">AI 智能日报汇编</view>
    <view class="actions">
      <button class="btn btn-primary action-btn" @tap="handleGenerate" :loading="generating" :disabled="generating">
        手动生成报告
      </button>
      <button class="btn btn-secondary action-btn" @tap="refreshList" :loading="loading" :disabled="loading">刷新列表</button>
    </view>
  </view>

  <view class="list">
    <template v-for="item in list" :key="item.id">
      <view class="report-card card" @tap="goDetail" :data-id="item.id">
        <view class="report-time">{{item.created_at_text}}</view>
        <view class="report-summary">{{item.report_summary || '暂无摘要'}}</view>
        <view class="detail-link">查看详情 ></view>
      </view>
    </template>
  </view>

  <view v-if="loading" class="state-tip">加载中...</view>
  <view v-if="!loading && list.length === 0" class="state-tip">暂无AI报表</view>
  <view v-if="!loading && list.length > 0 && list.length >= total" class="state-tip">没有更多了</view>
</view>
</template>

<script>
import { createPage } from '@/common/page-compat.js';
import pageDef from './index.page.js';

export default createPage(pageDef);
</script>

<style>
.page {
  min-height: 100vh;
  background: var(--bg-page);
  padding: 24rpx;
}

.header {
  margin-bottom: 24rpx;
}

.title {
  font-size: 36rpx;
  font-weight: 700;
  margin-bottom: 20rpx;
  color: var(--text-primary);
}

.actions {
  display: flex;
  gap: 16rpx;
}

.action-btn {
  flex: 1;
  margin: 0;
}

.report-card {
  margin-bottom: 20rpx;
}

.report-time {
  color: var(--text-tertiary);
  font-size: 24rpx;
  margin-bottom: 12rpx;
}

.report-summary {
  color: var(--text-primary);
  font-size: 28rpx;
  line-height: 1.6;
  margin-bottom: 16rpx;
}

.detail-link {
  color: var(--primary-color);
  font-size: 26rpx;
}

.state-tip {
  text-align: center;
  color: var(--text-tertiary);
  font-size: 24rpx;
  padding: 24rpx 0 36rpx;
}
</style>
