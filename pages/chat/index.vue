<template>
<view class="chat-page page-shell">
  <view class="chat-header card">
    <view class="chat-title">🤖 智享生活助手</view>
    <view class="chat-desc">支持通知总结、报修投诉、商品下单与支付协助</view>
  </view>

  <view class="chat-card card">
    <scroll-view class="chat-history" scroll-y="true" :scroll-into-view="lastMessageId">
      <template v-for="(item, index) in messages" :key="index">
        <view :id="'msg-' + index" :class="'message-item ' + item.role">
          <view class="avatar">{{item.role === 'user' ? '我' : (item.role === 'assistant' ? 'AI' : '!')}}</view>
          <view class="content-wrap">
            <view class="bubble">{{item.content}}</view>
            <view class="time">{{item.time}}</view>
          </view>
        </view>
      </template>

      <view v-if="loading" class="message-item assistant">
        <view class="avatar">AI</view>
        <view class="content-wrap">
          <view class="bubble">正在思考中...</view>
        </view>
      </view>
    </scroll-view>

    <view class="input-area">
      <textarea
        class="input-box"
        :value="inputContent"
        placeholder="请输入你的问题..."
        maxlength="1000"
        auto-height
        @input="onInput"
      />
      <button class="btn btn-primary send-btn" @tap="handleSend" :loading="loading" :disabled="loading">发送</button>
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
.chat-page {
  min-height: 100vh;
  padding: 24rpx;
}

.chat-header {
  margin-bottom: 20rpx;
  background: linear-gradient(135deg, #f6faff 0%, #eef4fb 100%);
}

.chat-title {
  font-size: 40rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.chat-desc {
  margin-top: 16rpx;
  color: var(--text-secondary);
  font-size: 26rpx;
}

.chat-card {
  padding: 0;
  overflow: hidden;
}

.chat-history {
  height: 67vh;
  background: #f8fbff;
  padding: 24rpx;
}

.message-item {
  display: flex;
  margin-bottom: 24rpx;
}

.message-item.user {
  flex-direction: row-reverse;
}

.avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dcebf9;
  color: #1f3e5a;
  font-size: 24rpx;
  font-weight: 700;
}

.message-item.assistant .avatar {
  background: #e7f3ee;
  color: #18573f;
}

.message-item.system .avatar {
  background: #fff0f0;
  color: #9f2a2a;
}

.content-wrap {
  max-width: 78%;
  margin: 0 16rpx;
}

.bubble {
  padding: 20rpx 24rpx;
  border-radius: 24rpx;
  background: #fff;
  border: 2rpx solid var(--border-color);
  font-size: 28rpx;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--text-primary);
}

.message-item.user .bubble {
  background: linear-gradient(135deg, #47719b 0%, #2d597b 100%);
  color: #fff;
  border-color: transparent;
}

.time {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: var(--text-tertiary);
}

.message-item.user .time {
  text-align: right;
}

.input-area {
  padding: 20rpx;
  border-top: 2rpx solid var(--border-color);
  background: #fff;
}

.input-box {
  width: 100%;
  min-height: 152rpx;
  max-height: 320rpx;
  background: #f7fafc;
  border: 2rpx solid var(--border-color);
  border-radius: 24rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: var(--text-primary);
  margin-bottom: 20rpx;
}

.send-btn {
  width: 100%;
}
</style>
