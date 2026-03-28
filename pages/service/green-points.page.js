import __dep1 from '../../api/greenPoints';
import __dep2 from '../../api/user';

const { uploadGarbageImage, getGreenPointsLeaderboard } = __dep1;
const { getUserInfo } = __dep2;

export default {
    data: {
        userInfo: {},
        imagePath: '',
        uploading: false,
        leaderboard: [],
        loadingLeaderboard: false,
        recognitionResult: null
    },

    onShow() {
        this.loadPageData();
    },

    async loadPageData() {
        await Promise.all([this.loadUserInfo(), this.loadLeaderboard()]);
    },

    async loadUserInfo() {
        try {
            const res = await getUserInfo();
            this.setData({ userInfo: res || {} });
        } catch (e) {
            console.error(e);
            this.setData({ userInfo: {} });
        }
    },

    async loadLeaderboard() {
        this.setData({ loadingLeaderboard: true });
        try {
            const res = await getGreenPointsLeaderboard({ limit: 10 });
            this.setData({
                leaderboard: res.list || res || []
            });
        } catch (e) {
            console.error(e);
            this.setData({ leaderboard: [] });
        } finally {
            this.setData({ loadingLeaderboard: false });
        }
    },

    chooseImage() {
        uni.chooseImage({
            count: 1,
            sourceType: ['album', 'camera'],
            success: (res) => {
                const filePath = Array.isArray(res.tempFilePaths) ? res.tempFilePaths[0] : '';
                this.setData({
                    imagePath: filePath || '',
                    recognitionResult: null
                });
            },
            fail: (err) => {
                console.error(err);
                uni.showToast({
                    title: '选择图片失败',
                    icon: 'none'
                });
            }
        });
    },

    async submitImage() {
        if (!this.data.imagePath) {
            uni.showToast({ title: '请先选择图片', icon: 'none' });
            return;
        }
        if (this.data.uploading) return;

        this.setData({ uploading: true });
        try {
            const res = await uploadGarbageImage(this.data.imagePath);
            this.setData({ recognitionResult: res || null });
            uni.showToast({
                title: `识别成功 +${(res && res.points) || 0}积分`,
                icon: 'success'
            });
            await Promise.all([this.loadUserInfo(), this.loadLeaderboard()]);
        } catch (e) {
            console.error(e);
        } finally {
            this.setData({ uploading: false });
        }
    }
};
