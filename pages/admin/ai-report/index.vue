<template>
<view class="page">
  <view class="header card">
    <view class="title">AI 智能日报汇编</view>
    <view class="actions">
      <button class="btn btn-primary action-btn" @tap="handleGenerate" :loading="generating" :disabled="generating">
        手动生成报告
      </button>
      <button class="btn action-btn" @tap="refreshList" :loading="loading" :disabled="loading">刷新列表</button>
    </view>
  </view>

  <view class="list">
    <template v-for="(item, index) in list" :key="item.id">
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
  background: #f7f8fa;
  padding: 32rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
}

.header {
  margin-bottom: 32rpx;
}

.title {
  font-size: 36rpx;
  font-weight: 700;
  margin-bottom: 24rpx;
}

.actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  flex: 1;
  margin: 0;
}

.report-card {
  margin-bottom: 24rpx;
}

.report-time {
  color: #999;
  font-size: 24rpx;
  margin-bottom: 16rpx;
}

.report-summary {
  color: #333;
  font-size: 28rpx;
  line-height: 1.6;
  margin-bottom: 20rpx;
}

.detail-link {
  color: #00b894;
  font-size: 26rpx;
}

.state-tip {
  text-align: center;
  color: #999;
  font-size: 26rpx;
  padding: 24rpx 0 36rpx;
}

</style>
