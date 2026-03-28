import __dep1 from '../../api/service';
import __dep2 from '../../utils/util';

const { getNoticeList } = __dep1;
const { formatTime } = __dep2;

export default {
    data: {
        notices: [],
        noticeLoaded: false
    },

    onShow() {
        if (!this.data.noticeLoaded) {
            this.getNotices();
        }
    },

    async getNotices() {
        try {
            const res = await getNoticeList({
                page: 1,
                size: 5
            }, {
                timeout: 4000
            });

            // res provides the unwrapped data.
            // If backend returns { list: [...], total: ... }, res is that object.
            // If backend returns array [...], res is that array.
            let list = [];
            if (Array.isArray(res)) {
                list = res;
            } else if (res && res.list) {
                list = res.list;
            }

            // Format dates
            list = list.map(item => {
                const date = new Date(item.created_at);
                const isValid = !isNaN(date.getTime()) && date.getFullYear() > 2000;
                return {
                    ...item,
                    created_at: isValid ? formatTime(date) : ''
                };
            });

            this.setData({
                notices: list.slice(0, 5),
                noticeLoaded: true
            });

        } catch (err) {
            console.error(err);
            this.setData({ noticeLoaded: true });
        }
    },

    goToNotice(e) {
        const id = e.currentTarget.dataset.id;
        uni.navigateTo({
            url: `/pages/service/notice?id=${id}`,
        });
    },

    showTip() {
        uni.showToast({
            title: '请在PC端查看数据大屏',
            icon: 'none'
        });
    }
};
