<template>
<view class="service-page">
  <view class="container">
    <view class="page-title">社区服务</view>

    <view class="service-menu">
      <template v-for="(item, index) in menuList" :key="item.name">
        <view class="service-card card" @tap="handleTap" :data-url="item.url">
          <view class="service-icon">{{item.icon}}</view>
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
/* pages/service/index.wxss */
.service-page {
  min-height: 100vh;
  background: #f5f7fb;
  padding: 24rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
}

.page-title {
  font-size: 44rpx;
  font-weight: 600;
  margin-bottom: 24rpx;
  color: #333;
}

.service-menu {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20rpx;
}

.service-card {
  text-align: center;
  min-height: 220rpx;
  padding: 28rpx 16rpx;
  background: #fff;
  border-radius: 22rpx;
  box-shadow: 0 10rpx 28rpx rgba(0,0,0,0.05);
}

.service-icon {
  font-size: 56rpx;
  margin-bottom: 12rpx;
}

.service-name {
  font-size: 34rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.service-desc {
  font-size: 24rpx;
  color: #999;
  line-height: 1.45;
}

</style>
