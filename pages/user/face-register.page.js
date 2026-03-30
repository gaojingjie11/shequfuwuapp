import __dep1 from '../../api/user';
import __dep2 from '../../utils/media';

const { getUserInfo, registerFace } = __dep1;
const { chooseSingleImage, isPermissionDeniedError, isUserCancelError } = __dep2;

export default {
    data: {
        userInfo: null,
        registering: false
    },

    onShow() {
        this.fetchUserInfo();
    },

    async fetchUserInfo() {
        const token = uni.getStorageSync('token');
        if (!token) {
            uni.reLaunch({ url: '/pages/auth/login' });
            return;
        }

        try {
            const user = await getUserInfo();
            this.setData({ userInfo: user || null });
        } catch (e) {
            uni.showToast({ title: '获取用户信息失败', icon: 'none' });
        }
    },

    async handleRegisterFace() {
        if (this.data.registering) return;

        this.setData({ registering: true });
        uni.showLoading({ title: '处理中', mask: true });
        try {
            const filePath = await chooseSingleImage({
                sourceType: ['camera'],
                sizeType: ['compressed']
            });
            await registerFace(filePath);
            uni.showToast({ title: '人脸录入成功', icon: 'success' });
            await this.fetchUserInfo();
        } catch (e) {
            if (isUserCancelError(e)) {
                return;
            }
            uni.showToast({
                title: isPermissionDeniedError(e)
                    ? '未获得摄像头权限，请在系统设置中打开相机权限'
                    : (e?.message || '人脸录入失败'),
                icon: 'none'
            });
        } finally {
            uni.hideLoading();
            this.setData({ registering: false });
        }
    }
};
