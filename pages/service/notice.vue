<template>
<view class="notice-page">
  <view class="notice-list">
    <template v-for="(item, index) in notices" :key="item.id">
      <view class="notice-card card">
        <view class="notice-header">
          <view class="notice-title">{{item.title}}</view>
          <view class="notice-meta">
            <text class="publisher">{{item.publisher}}</text>
            <text class="date">{{item.created_at}}</text>
          </view>
        </view>
        <view class="notice-content">{{item.content}}</view>
        <view class="notice-footer">
          <text class="views">👁 {{item.view_count || 0}} 次浏览</text>
        </view>
      </view>
    </template>
  </view>

  <view v-if="loading" class="loading-text">加载中...</view>
  <view v-if="!loading && notices.length === 0" class="empty-state">暂无公告</view>
  <view v-if="!loading && notices.length > 0 && notices.length >= total" class="no-more">没有更多了</view>
</view>

</template>

<script>
import { createPage } from '@/common/page-compat.js';
import pageDef from './notice.page.js';

export default createPage(pageDef);
</script>

<style>
/* pages/service/notice.wxss */
.notice-page {
  min-height: 100vh;
  background: #f7f8fa;
  padding: 32rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
}

.notice-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 32rpx;
}

.notice-header {
  margin-bottom: 24rpx;
}

.notice-title {
  font-size: 36rpx;
  font-weight: 600;
  margin-bottom: 16rpx;
  color: #333;
}

.notice-meta {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  color: #999;
}

.publisher {
  color: #00b894;
  font-weight: 500;
}

.notice-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 24rpx;
}

.notice-footer {
  padding-top: 24rpx;
  border-top: 2rpx solid #f0f0f0;
  font-size: 24rpx;
  color: #999;
}

.loading-text, .no-more, .empty-state {
  text-align: center;
  padding: 40rpx;
  color: #999;
  font-size: 24rpx;
}

</style>
