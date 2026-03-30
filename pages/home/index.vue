<template>
<view class="home-page page-shell">
  <view class="hero">
    <view class="container">
      <view class="hero-title">欢迎来到智享生活</view>
      <view class="hero-subtitle">让服务更高效，让生活更安心</view>
      <view class="hero-tags">
        <text class="hero-tag">便民服务</text>
        <text class="hero-tag">社区商城</text>
        <text class="hero-tag">AI 助手</text>
      </view>
    </view>
  </view>

  <view class="container home-content">
    <view class="section-header">
      <view class="section-title">快捷服务</view>
      <view class="section-subtitle">常用功能一键直达</view>
    </view>

    <view class="quick-menu">
      <navigator url="/pages/mall/index" open-type="switchTab" class="quick-item card">
        <view class="quick-icon-wrap"><view class="quick-icon">🛍</view></view>
        <view class="quick-text">社区商城</view>
      </navigator>
      <navigator url="/pages/service/notice" class="quick-item card">
        <view class="quick-icon-wrap"><view class="quick-icon">📚</view></view>
        <view class="quick-text">公告通知</view>
      </navigator>
      <navigator url="/pages/service/repair" class="quick-item card">
        <view class="quick-icon-wrap"><view class="quick-icon">🛠</view></view>
        <view class="quick-text">报修投诉</view>
      </navigator>
      <navigator url="/pages/service/visitor" class="quick-item card">
        <view class="quick-icon-wrap"><view class="quick-icon">🪪</view></view>
        <view class="quick-text">访客登记</view>
      </navigator>
      <navigator url="/pages/service/green-points" class="quick-item card">
        <view class="quick-icon-wrap"><view class="quick-icon">🌿</view></view>
        <view class="quick-text">绿色积分</view>
      </navigator>
      <navigator url="/pages/chat/index" class="quick-item card">
        <view class="quick-icon-wrap"><view class="quick-icon">🤖</view></view>
        <view class="quick-text">AI 对话</view>
      </navigator>
      <navigator url="/pages/service/community-chat" class="quick-item card">
        <view class="quick-icon-wrap"><view class="quick-icon">💬</view></view>
        <view class="quick-text">社区群聊</view>
      </navigator>
    </view>

    <view class="section-header notice-header">
      <view class="section-title">最新公告</view>
      <view class="section-subtitle">社区动态实时更新</view>
    </view>

    <view class="notice-list">
      <template v-for="item in notices" :key="item.id">
        <view class="notice-item card" @tap="goToNotice" :data-id="item.id">
          <view class="notice-tag">公告</view>
          <view class="notice-title">{{item.title}}</view>
          <view class="notice-meta">
            <text>{{item.publisher}}</text>
            <text>{{item.created_at}}</text>
          </view>
        </view>
      </template>
      <view v-if="notices.length === 0" class="empty-state card">
        <text>暂无公告</text>
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
.home-page {
  min-height: 100vh;
}

.hero {
  position: relative;
  padding: 68rpx 0 56rpx;
  background: linear-gradient(135deg, #2d597b 0%, #276193 58%, #3e78a8 100%);
  color: #fff;
  overflow: hidden;
}

.hero::before {
  content: "";
  position: absolute;
  width: 440rpx;
  height: 440rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  top: -180rpx;
  right: -60rpx;
}

.hero::after {
  content: "";
  position: absolute;
  width: 320rpx;
  height: 320rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  bottom: -160rpx;
  left: -80rpx;
}

.hero-title,
.hero-subtitle,
.hero-tags {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 54rpx;
  font-weight: 700;
  letter-spacing: 1rpx;
}

.hero-subtitle {
  margin-top: 16rpx;
  font-size: 28rpx;
  opacity: 0.92;
}

.hero-tags {
  margin-top: 24rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.hero-tag {
  padding: 8rpx 24rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.12);
}

.home-content {
  margin-top: -24rpx;
  padding-bottom: 48rpx;
}

.section-header {
  margin: 36rpx 0 24rpx;
}

.section-title {
  font-size: 40rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.section-subtitle {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: var(--text-secondary);
}

.quick-menu {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

.quick-item {
  margin-bottom: 0;
  text-align: center;
  padding: 36rpx 24rpx;
}

.quick-icon-wrap {
  width: 104rpx;
  height: 104rpx;
  margin: 0 auto 20rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eef5fc;
}

.quick-icon {
  font-size: 48rpx;
}

.quick-text {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-primary);
}

.notice-header {
  margin-top: 48rpx;
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.notice-item {
  margin-bottom: 0;
}

.notice-tag {
  display: inline-block;
  margin-bottom: 16rpx;
  padding: 4rpx 20rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  color: var(--primary-color);
  background: var(--primary-soft);
}

.notice-title {
  font-size: 32rpx;
  color: var(--text-primary);
  font-weight: 700;
  line-height: 1.5;
}

.notice-meta {
  margin-top: 24rpx;
  padding-top: 20rpx;
  border-top: 2rpx dashed var(--border-color);
  display: flex;
  justify-content: space-between;
  font-size: 22rpx;
  color: var(--text-tertiary);
}

.empty-state {
  margin-bottom: 0;
  text-align: center;
  color: var(--text-secondary);
  padding: 36rpx 0;
}
</style>
