<script>
export default {
  onLaunch() {
    const logs = uni.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    uni.setStorageSync('logs', logs);
  },
  globalData: {
    userInfo: null
  }
};
</script>

<style>
/* Global theme tokens */
page {
  --primary-color: #00b894;
  --primary-light: #55efc4;
  --primary-dark: #00997a;

  --secondary-color: #0984e3;
  --secondary-light: #74b9ff;

  --success-color: #00b894;
  --warning-color: #fdcb6e;
  --danger-color: #ff7675;
  --info-color: #74b9ff;

  --text-primary: #2d3436;
  --text-secondary: #636e72;
  --text-light: #b2bec3;
  --text-white: #ffffff;

  --bg-color: #f7f8fa;
  --bg-white: #ffffff;
  --bg-gray: #f1f3f5;

  --border-color: #e9ecef;
  --border-radius: 24rpx;
  --border-radius-sm: 16rpx;
  --shadow-sm: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
  --shadow-md: 0 12rpx 36rpx rgba(0, 0, 0, 0.1);

  color: #2d3436;
  background-color: #f7f8fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
  line-height: 1.6;
  padding-bottom: env(safe-area-inset-bottom);
}

view,
text,
image,
navigator,
input,
button,
textarea {
  box-sizing: border-box;
}

.container {
  box-sizing: border-box;
  width: 100%;
}

.card {
  background: #ffffff;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
  padding: 24rpx;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
}

.btn::after {
  border: none;
}

.btn-primary {
  background: #00b894;
  color: #fff;
}

.input {
  width: 100%;
  min-height: 88rpx;
  padding: 0 24rpx;
  border: 2rpx solid #e9ecef;
  border-radius: 16rpx;
  background: #fff;
}

.safe-bottom {
  padding-bottom: calc(env(safe-area-inset-bottom) + 12rpx);
}
</style>
