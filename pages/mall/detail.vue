<template>
<view class="detail-page page-shell">
  <image class="detail-image" :src="product.image_url || '/assets/icons/mall.png'" mode="aspectFill"></image>

  <view class="detail-info card">
    <view class="detail-title">{{product.name}}</view>
    <view class="detail-desc">{{product.description}}</view>
    
    <view class="detail-price">
      <text class="price-symbol">￥</text>
      <text class="price-val">{{product.price}}</text>
      <text v-if="product.original_price" class="price-original">￥{{product.original_price}}</text>
      <text v-if="product.is_promotion" class="promo-tag">促销中</text>
    </view>
    
    <view class="detail-meta">
      <view class="meta-item">销量 {{product.sales}}</view>
      <view class="meta-item">库存 {{product.stock}}</view>
    </view>
  </view>

  <view class="comments-section card">
    <view class="section-title">商品评价</view>
    <view class="comment-list">
      <template v-for="item in comments" :key="item.id">
        <view class="comment-item">
          <image class="comment-avatar" :src="item.user.avatar || '/assets/icons/user.png'"></image>
          <view class="comment-body">
            <view class="comment-header">
              <text class="username">{{item.user.real_name || item.user.username || '匿名用户'}}</text>
              <text class="time">{{item.created_at}}</text>
            </view>
            <view class="comment-content">{{item.content}}</view>
          </view>
        </view>
      </template>
      <view v-if="comments.length === 0" class="empty-comment">暂无评价</view>
    </view>
  </view>

  <view class="bottom-bar">
    <button :class="'action-btn ' + (isFavorite ? 'fav-active' : '')" @tap="toggleFavorite">
      <text class="icon-star">{{isFavorite ? '★' : '☆'}}</text>
      <text>{{isFavorite ? '已收藏' : '收藏'}}</text>
    </button>

    <button class="action-btn btn-cart" @tap="addToCart">加入购物车</button>
  </view>
</view>
</template>

<script>
import { createPage } from '@/common/page-compat.js';
import pageDef from './detail.page.js';

export default createPage(pageDef);
</script>

<style>
.detail-page {
  padding-bottom: 172rpx;
  min-height: 100vh;
  background: var(--bg-page);
}

.detail-image {
  width: 100%;
  height: 750rpx;
  background: #e8eef5;
}

.detail-info {
  margin: 24rpx;
}

.detail-title {
  font-size: 40rpx;
  font-weight: 700;
  margin-bottom: 16rpx;
  color: var(--text-primary);
}

.detail-desc {
  font-size: 28rpx;
  color: var(--text-secondary);
  margin-bottom: 24rpx;
  line-height: 1.7;
}

.detail-price {
  margin-bottom: 24rpx;
  display: flex;
  align-items: baseline;
}

.price-symbol {
  font-size: 28rpx;
  color: #c74545;
}

.price-val {
  font-size: 52rpx;
  font-weight: 700;
  color: #c74545;
}

.price-original {
  font-size: 24rpx;
  color: var(--text-tertiary);
  text-decoration: line-through;
  margin-left: 16rpx;
}

.promo-tag {
  font-size: 22rpx;
  color: #c74545;
  border: 2rpx solid #efb5b5;
  background: #fff1f1;
  padding: 2rpx 16rpx;
  border-radius: 999rpx;
  margin-left: 16rpx;
}

.detail-meta {
  display: flex;
  gap: 24rpx;
  font-size: 24rpx;
  color: var(--text-secondary);
}

.comments-section {
  margin: 0 24rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  margin-bottom: 20rpx;
  color: var(--text-primary);
}

.comment-item {
  display: flex;
  margin-bottom: 24rpx;
}

.comment-avatar {
  width: 68rpx;
  height: 68rpx;
  border-radius: 50%;
  background: #e8eef5;
  margin-right: 16rpx;
}

.comment-body {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.username {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--text-primary);
}

.time {
  font-size: 22rpx;
  color: var(--text-tertiary);
}

.comment-content {
  font-size: 26rpx;
  color: var(--text-secondary);
  line-height: 1.6;
}

.empty-comment {
  text-align: center;
  color: var(--text-tertiary);
  padding: 32rpx 0;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 20;
  background: #fff;
  border-top: 2rpx solid var(--border-color);
  padding: 20rpx 24rpx calc(20rpx + env(safe-area-inset-bottom));
  display: flex;
  gap: 20rpx;
}

.action-btn {
  flex: 1;
  margin: 0;
  min-height: 84rpx;
  border-radius: 24rpx;
  font-size: 28rpx;
  font-weight: 600;
  background: #edf4fb;
  color: var(--primary-color);
  border: 2rpx solid #c8dbed;
}

.action-btn::after {
  border: none;
}

.action-btn.fav-active {
  background: #fff7e7;
  color: #b07600;
  border-color: #f2d9a0;
}

.btn-cart {
  color: #fff;
  border-color: transparent;
  background: linear-gradient(135deg, #47719b 0%, #2d597b 100%);
}

.icon-star {
  margin-right: 10rpx;
}
</style>
