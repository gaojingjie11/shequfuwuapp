<template>
<view class="container page-shell">
  <view class="header-card card">
    <view class="title">我的车位</view>
    <view :class="'status-badge ' + (parkingList.length > 0 ? 'status-has' : 'status-none')">
      {{parkingList.length > 0 ? '已分配 ' + parkingList.length + ' 个' : '未分配'}}
    </view>
  </view>

  <template v-if="parkingList.length > 0">
    <template v-for="item in parkingList" :key="item.id">
      <view class="info-card card">
        <view class="info-item">
          <text class="label">车位编号</text>
          <text class="value">{{item.parking_no || '未知编号'}}</text>
        </view>
        <view class="info-item">
          <text class="label">区域位置</text>
          <text class="value">{{item.location || '地面车位'}}</text>
        </view>
        <view class="info-item">
          <text class="label">绑定车辆</text>
          <text class="value">{{item.car_plate || '暂无'}}</text>
        </view>
        <view class="footer-btn">
          <button class="bind-btn" type="primary" size="mini" @tap="showBindModal" :data-id="item.id">{{item.car_plate ? '修改绑定' : '绑定车辆'}}</button>
        </view>
      </view>
    </template>
  </template>

  <template v-else>
    <view class="empty-state card">
      <image src="/assets/icons/service.png" mode="widthFix" class="empty-icon"></image>
      <view class="empty-text">您名下暂无车位信息</view>
      <view class="empty-sub">请联系物业管理处办理车位租赁或购买</view>
    </view>
  </template>
</view>

<template v-if="showModal">
  <view class="modal-mask" @tap="closeModal"></view>
  <view class="modal-content">
    <view class="modal-title">绑定车辆</view>
    <input class="modal-input" placeholder="请输入车牌号 (如：粤A88888)" @input="onInput" :value="plate_number" :focus="showModal" />
    <view class="modal-footer">
      <button class="btn-cancel" @tap="closeModal">取消</button>
      <button class="btn-confirm" @tap="handleBindConfirm">确定</button>
    </view>
  </view>
</template>
</template>

<script>
import { createPage } from '@/common/page-compat.js';
import pageDef from './parking.page.js';

export default createPage(pageDef);
</script>

<style>
.container {
  min-height: 100vh;
  padding: 24rpx;
  background: var(--bg-page);
}

.header-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 40rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.status-badge {
  font-size: 22rpx;
  padding: 6rpx 18rpx;
  border-radius: 999rpx;
}

.status-has {
  background: #e9f8f2;
  color: #1f9d72;
}

.status-none {
  background: #eef3f8;
  color: var(--text-secondary);
}

.info-card {
  margin-bottom: 20rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
  font-size: 28rpx;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  color: var(--text-secondary);
}

.value {
  color: var(--text-primary);
  font-weight: 600;
}

.footer-btn {
  margin-top: 20rpx;
  text-align: right;
}

.bind-btn {
  margin: 0;
  border-radius: 999rpx;
  min-height: 60rpx;
  line-height: 60rpx;
  background: var(--primary-color) !important;
}

.bind-btn::after {
  border: none;
}

.empty-state {
  text-align: center;
  padding: 52rpx 28rpx;
}

.empty-icon {
  width: 180rpx;
  opacity: 0.65;
  margin-bottom: 20rpx;
}

.empty-text {
  color: var(--text-primary);
  font-size: 30rpx;
  font-weight: 700;
}

.empty-sub {
  margin-top: 12rpx;
  color: var(--text-secondary);
  font-size: 24rpx;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.38);
  z-index: 98;
}

.modal-content {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 84%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 32rpx;
  padding: 32rpx;
  z-index: 99;
}

.modal-title {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 20rpx;
}

.modal-input {
  width: 100%;
  min-height: 88rpx;
  border: 2rpx solid var(--border-strong);
  border-radius: 24rpx;
  padding: 20rpx 24rpx;
  font-size: 28rpx;
  background: #f9fbfd;
}

.modal-footer {
  margin-top: 24rpx;
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
}

.btn-cancel,
.btn-confirm {
  margin: 0;
  min-width: 160rpx;
  min-height: 68rpx;
  border-radius: 999rpx;
  font-size: 26rpx;
}

.btn-cancel {
  color: var(--text-secondary);
  background: #eef3f8;
}

.btn-confirm {
  color: #fff;
  background: var(--primary-color);
}

.btn-cancel::after,
.btn-confirm::after {
  border: none;
}
</style>
