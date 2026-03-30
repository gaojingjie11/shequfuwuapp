<template>
<view class="notice-page page-shell">
  <view class="container">
    <view class="notice-head card">
      <view class="notice-title-main">社区公告</view>
      <view class="notice-subtitle">政策通知与社区动态</view>
    </view>

    <view class="notice-list">
      <template v-for="item in notices" :key="item.id">
        <view class="notice-card card">
          <view class="notice-header">
            <view class="notice-tag">公告</view>
            <view class="notice-meta">
              <text class="publisher">{{item.publisher}}</text>
              <text class="date">{{item.created_at}}</text>
            </view>
          </view>
          <view class="notice-title">{{item.title}}</view>
          <view class="notice-content">{{item.content}}</view>
          <view class="notice-footer">
            <text class="views">👀 {{item.view_count || 0}} 次浏览</text>
          </view>
        </view>
      </template>
    </view>

    <view v-if="loading" class="loading-text">加载中...</view>
    <view v-if="!loading && notices.length === 0" class="empty-state card">暂无公告</view>
    <view v-if="!loading && notices.length > 0 && notices.length >= total" class="no-more">没有更多了</view>
  </view>
</view>
</template>

<script>
import { createPage } from '@/common/page-compat.js';
import pageDef from './notice.page.js';

export default createPage(pageDef);
</script>

<style>
.notice-page {
  min-height: 100vh;
  padding: 24rpx 0 36rpx;
}

.notice-head {
  margin-bottom: 24rpx;
  background: linear-gradient(135deg, #f5faff 0%, #edf4fb 100%);
}

.notice-title-main {
  font-size: 40rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.notice-subtitle {
  margin-top: 12rpx;
  font-size: 24rpx;
  color: var(--text-secondary);
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.notice-card {
  margin-bottom: 0;
}

.notice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.notice-tag {
  display: inline-block;
  font-size: 22rpx;
  color: var(--primary-color);
  background: var(--primary-soft);
  border-radius: 999rpx;
  padding: 4rpx 18rpx;
}

.notice-meta {
  font-size: 22rpx;
  color: var(--text-tertiary);
  display: flex;
  gap: 16rpx;
}

.notice-title {
  font-size: 32rpx;
  font-weight: 700;
  margin-bottom: 16rpx;
  color: var(--text-primary);
}

.notice-content {
  font-size: 28rpx;
  color: var(--text-secondary);
  line-height: 1.7;
}

.notice-footer {
  padding-top: 20rpx;
  margin-top: 20rpx;
  border-top: 2rpx dashed var(--border-color);
  font-size: 22rpx;
  color: var(--text-tertiary);
}

.loading-text,
.no-more,
.empty-state {
  text-align: center;
  padding: 36rpx;
  color: var(--text-tertiary);
  font-size: 24rpx;
}
</style>
