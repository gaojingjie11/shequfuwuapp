<template>
<view class="home-page">
  <view class="banner">
    <view class="container">
      <view class="banner-title">欢迎来到智慧社区</view>
      <view class="banner-subtitle">让生活更便捷、更智能、更美好</view>
    </view>
  </view>

  <view class="container">
    <view class="quick-menu">
      <navigator url="/pages/mall/index" open-type="switchTab" class="quick-item">
        <view class="quick-icon">📦</view>
        <view class="quick-text">社区商城</view>
      </navigator>
      <navigator url="/pages/service/notice" class="quick-item">
        <view class="quick-icon">📙</view>
        <view class="quick-text">公告通知</view>
      </navigator>
      <navigator url="/pages/service/repair" class="quick-item">
        <view class="quick-icon">🔧</view>
        <view class="quick-text">报修投诉</view>
      </navigator>
      <navigator url="/pages/service/visitor" class="quick-item">
        <view class="quick-icon">👥</view>
        <view class="quick-text">访客登记</view>
      </navigator>
      <navigator url="/pages/service/green-points" class="quick-item">
        <view class="quick-icon">🏆</view>
        <view class="quick-text">绿色积分</view>
      </navigator>
      <navigator url="/pages/chat/index" class="quick-item">
        <view class="quick-icon">🤖</view>
        <view class="quick-text">AI 对话</view>
      </navigator>
      <navigator url="/pages/service/community-chat" class="quick-item">
        <view class="quick-icon">💬</view>
        <view class="quick-text">社区群聊</view>
      </navigator>
    </view>

    <view class="section">
      <view class="section-title">最新公告</view>
      <view class="notice-list">
        <template v-for="(item, index) in notices" :key="item.id">
          <view class="notice-item card" @tap="goToNotice" :data-id="item.id">
            <view class="notice-title">{{item.title}}</view>
            <view class="notice-meta">
              <text>{{item.publisher}}</text>
              <text>{{item.created_at}}</text>
            </view>
          </view>
        </template>
        <view v-if="notices.length === 0" class="empty-state">
          <text>暂无公告</text>
        </view>
      </view>
    </view>
  </view>
</view>

</template>

<script>
import { createPage } from '@/common/page-compat.js';
import pageDef from './index.page.js';

export default createPage(pageDef);
</script>

<style>
/* pages/home/index.wxss */
.home-page {
  min-height: 100vh;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: #f5f7fb;
}

.banner {
  background: linear-gradient(135deg, #00b894 0%, #0984e3 100%);
  color: #fff;
  padding: 56rpx 0;
  margin-bottom: 24rpx;
  position: relative;
  overflow: hidden;
  border-bottom-left-radius: 28rpx;
  border-bottom-right-radius: 28rpx;
}

.banner::after {
  content: '';
  position: absolute;
  right: -80rpx;
  top: -90rpx;
  width: 280rpx;
  height: 280rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
}

.banner-title {
  font-size: 54rpx;
  font-weight: 700;
  margin-bottom: 10rpx;
  text-align: center;
  letter-spacing: 2rpx;
  position: relative;
  z-index: 1;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.12);
}

.banner-subtitle {
  font-size: 28rpx;
  text-align: center;
  opacity: 0.9;
  position: relative;
  z-index: 1;
}

.container {
  padding: 0 24rpx;
}

.quick-menu {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20rpx;
  margin-bottom: 28rpx;
}

.quick-item {
  background: #fff;
  border-radius: 22rpx;
  min-height: 212rpx;
  padding: 28rpx 16rpx;
  text-align: center;
  box-shadow: 0 10rpx 28rpx rgba(0, 0, 0, 0.05);
}

.quick-icon {
  font-size: 56rpx;
  margin-bottom: 14rpx;
}

.quick-text {
  font-size: 34rpx;
  font-weight: 500;
  color: #2d3436;
  line-height: 1.35;
}

.section-title {
  font-size: 36rpx;
  font-weight: 600;
  margin-bottom: 16rpx;
  padding-left: 14rpx;
  border-left: 8rpx solid #00b894;
}

.notice-list {
  display: flex;
  flex-direction: column;
}

.notice-item {
  padding: 24rpx;
  border-radius: 20rpx;
  margin-bottom: 14rpx;
}

.notice-title {
  font-size: 32rpx;
  font-weight: 500;
  margin-bottom: 10rpx;
  color: #2d3436;
}

.notice-meta {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  color: #636e72;
}

</style>
