<template>
<view class="detail-page">
  <image class="detail-image" :src="product.image_url || '/assets/icons/mall.png'" mode="aspectFill"></image>

  <view class="detail-info card">
    <view class="detail-title">{{product.name}}</view>
    <view class="detail-desc">{{product.description}}</view>
    
    <view class="detail-price">
      <text class="price-symbol">¥</text>
      <text class="price-val">{{product.price}}</text>
      <text v-if="product.original_price" class="price-original">¥{{product.original_price}}</text>
      <text v-if="product.is_promotion" class="promo-tag">促销中</text>
    </view>
    
    <view class="detail-meta">
      <view class="meta-item">销量: {{product.sales}}</view>
      <view class="meta-item">库存: {{product.stock}}</view>
    </view>
  </view>

  <!-- Comments -->
  <view class="comments-section card">
    <view class="section-title">商品评价</view>
    <view class="comment-list">
      <template v-for="(item, index) in comments" :key="item.id">
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

  <!-- Bottom Bar -->
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
/* pages/mall/detail.wxss */
.detail-page {
  padding-bottom: calc(130rpx + env(safe-area-inset-bottom));
  background: #f7f8fa;
  min-height: 100vh;
}

.detail-image {
  width: 100%;
  height: 620rpx;
  background: #fff;
}

.detail-info {
  background: #fff;
  padding: 26rpx;
  margin: 18rpx 20rpx 12rpx;
}

.detail-title {
  font-size: 44rpx;
  font-weight: 600;
  margin-bottom: 10rpx;
  color: #333;
}

.detail-desc {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 14rpx;
  line-height: 1.5;
}

.detail-price {
  margin-bottom: 24rpx;
  display: flex;
  align-items: baseline;
}

.price-symbol {
  font-size: 30rpx;
  color: #ff4d4f;
}

.price-val {
  font-size: 58rpx;
  font-weight: 700;
  color: #ff4d4f;
}

.price-original {
  font-size: 26rpx;
  color: #999;
  text-decoration: line-through;
  margin-left: 12rpx;
}

.promo-tag {
  font-size: 22rpx;
  color: #ff4d4f;
  border: 2rpx solid #ff4d4f;
  padding: 2rpx 10rpx;
  border-radius: 8rpx;
  margin-left: 10rpx;
}

.detail-meta {
  display: flex;
  font-size: 26rpx;
  color: #999;
}

.meta-item {
  margin-right: 30rpx;
}

.comments-section {
  background: #fff;
  padding: 24rpx;
  margin: 0 20rpx 18rpx;
}

.section-title {
  font-size: 36rpx;
  font-weight: 600;
  margin-bottom: 14rpx;
  border-left: 8rpx solid #00b894;
  padding-left: 14rpx;
}

.comment-item {
  display: flex;
  padding: 18rpx 0;
  border-bottom: 1rpx solid #eee;
}

.comment-avatar {
  width: 68rpx;
  height: 68rpx;
  border-radius: 50%;
  margin-right: 16rpx;
  background: #eee;
}

.comment-body {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6rpx;
  font-size: 24rpx;
}

.username {
  color: #333;
  font-weight: 500;
}

.time {
  color: #999;
}

.comment-content {
  font-size: 28rpx;
  color: #666;
}

.empty-comment {
  text-align: center;
  padding: 28rpx;
  color: #999;
  font-size: 24rpx;
}

.bottom-bar {
  display: flex;
  gap: 18rpx;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 14rpx 20rpx;
  box-shadow: 0 -8rpx 24rpx rgba(0,0,0,0.08);
  padding-bottom: calc(14rpx + env(safe-area-inset-bottom));
}

.action-btn {
  width: 180rpx;
  flex: 0 0 180rpx;
  height: 84rpx;
  display: flex;
  flex-direction: row;
  gap: 10rpx;
  align-items: center;
  justify-content: center;
  background: #fff;
  color: #555;
  border: 1rpx solid #e5e6eb;
  border-radius: 18rpx;
  font-size: 28rpx;
  padding: 0;
}

.fav-active {
  color: #ffcc00;
  border-color: #ffe28a;
  background: #fff9e8;
}

.btn-cart {
  flex: 1;
  height: 84rpx;
  margin: 0;
  border: none;
  background: #00b894;
  color: #fff;
  border-radius: 18rpx;
  padding: 0;
  font-size: 30rpx;
  font-weight: 600;
}

.action-btn::after,
.btn-cart::after {
  border: none;
}

</style>
