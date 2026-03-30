<template>
<view class="service-page page-shell">
  <view class="service-hero">
    <view class="container">
      <view class="service-title">社区服务</view>
      <view class="service-subtitle">物业服务、民生办理与智能助手</view>
    </view>
  </view>

  <view class="container service-main">
    <view class="service-menu">
      <template v-for="item in menuList" :key="item.name">
        <view class="service-card card" @tap="handleTap" :data-url="item.url">
          <view class="service-icon-wrap">
            <view class="service-icon">{{item.icon}}</view>
          </view>
          <view class="service-name">{{item.name}}</view>
          <view class="service-desc">{{item.desc}}</view>
        </view>
      </template>
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
.service-page {
  min-height: 100vh;
}

.service-hero {
  background: linear-gradient(135deg, #2d597b 0%, #2f699a 65%, #4c86b8 100%);
  color: #fff;
  padding: 60rpx 0 48rpx;
}

.service-title {
  font-size: 52rpx;
  font-weight: 700;
  letter-spacing: 1rpx;
}

.service-subtitle {
  margin-top: 16rpx;
  opacity: 0.92;
  font-size: 28rpx;
}

.service-main {
  margin-top: -16rpx;
  padding-top: 32rpx;
  padding-bottom: 48rpx;
}

.service-menu {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

.service-card {
  margin-bottom: 0;
  text-align: left;
  padding: 32rpx 28rpx;
}

.service-icon-wrap {
  width: 92rpx;
  height: 92rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #edf4fb;
  margin-bottom: 24rpx;
}

.service-icon {
  font-size: 48rpx;
  line-height: 1;
}

.service-name {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8rpx;
}

.service-desc {
  font-size: 24rpx;
  color: var(--text-secondary);
  line-height: 1.5;
}
</style>
