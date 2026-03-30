<template>
<view class="community-chat-page page-shell">
  <view class="chat-card card">
    <scroll-view
      class="chat-list"
      scroll-y="true"
      :scroll-into-view="lastMessageId"
      :scroll-top="scrollTop"
    >
      <view v-if="loading" class="state-text">加载中...</view>
      <view v-if="!loading && messages.length === 0" class="state-text">暂无消息，来发第一条吧</view>

      <template v-for="item in messages" :key="item.id">
        <view :id="item.viewId" :class="'message-item ' + (item.isSelf ? 'is-self' : '')">
          <image class="avatar" :src="item.avatar || defaultAvatar" mode="aspectFill"></image>
          <view class="bubble-wrap">
            <view class="meta">
              <text class="name">{{item.username}}</text>
              <text class="time">{{item.timeText}}</text>
            </view>
            <view class="bubble">{{item.content}}</view>
          </view>
        </view>
      </template>
      <view id="chat-bottom-anchor" class="bottom-anchor"></view>
    </scroll-view>

    <view class="composer">
      <textarea
        class="composer-input"
        :value="draft"
        maxlength="1000"
        placeholder="说点什么..."
        auto-height
        @input="onDraftInput"
      />
      <view class="composer-actions">
        <text class="hint">最多支持 1000 字</text>
        <button
          class="btn btn-primary send-btn"
          size="mini"
          @tap="handleSend"
          :loading="sending"
          :disabled="sending || !canSend"
        >
          发送
        </button>
      </view>
    </view>
  </view>
</view>
</template>

<script>
import { createPage } from '@/common/page-compat.js';
import pageDef from './community-chat.page.js';

export default createPage(pageDef);
</script>

<style>
.community-chat-page {
  min-height: 100vh;
  background: var(--bg-page);
  padding: 24rpx;
  box-sizing: border-box;
}

.chat-card {
  height: calc(100vh - 48rpx);
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}

.chat-list {
  flex: 1;
  min-height: 0;
  padding: 24rpx;
  box-sizing: border-box;
  background: #f8fbff;
}

.state-text {
  text-align: center;
  color: var(--text-tertiary);
  font-size: 26rpx;
  padding: 48rpx 0;
}

.message-item {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.message-item.is-self {
  flex-direction: row-reverse;
}

.avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #e2edf8;
}

.bubble-wrap {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.message-item.is-self .bubble-wrap {
  align-items: flex-end;
}

.meta {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 8rpx;
}

.name {
  font-size: 24rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.time {
  font-size: 22rpx;
  color: var(--text-tertiary);
}

.bubble {
  max-width: 78%;
  background: #fff;
  color: var(--text-primary);
  border: 2rpx solid var(--border-color);
  border-radius: 24rpx;
  padding: 18rpx 24rpx;
  font-size: 28rpx;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.message-item.is-self .bubble {
  background: linear-gradient(135deg, #47719b 0%, #2d597b 100%);
  border-color: transparent;
  color: #fff;
}

.composer {
  border-top: 2rpx solid var(--border-color);
  padding: 20rpx;
  background: #fff;
  position: relative;
  z-index: 2;
}

.composer-input {
  width: 100%;
  min-height: 140rpx;
  background: #f7fafc;
  border: 2rpx solid var(--border-color);
  border-radius: 24rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: var(--text-primary);
}

.composer-actions {
  margin-top: 16rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hint {
  font-size: 22rpx;
  color: var(--text-tertiary);
}

.send-btn {
  min-width: 168rpx;
  margin: 0;
}

.bottom-anchor {
  height: 4rpx;
}
</style>
