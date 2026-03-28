import __dep1 from '../../api/service';
import __dep2 from '../../utils/util';

const { createRepair, getRepairList } = __dep1;
const { formatTime } = __dep2;

function formatRepairTime(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime()) || date.getFullYear() < 2000) {
        return String(value).replace('T', ' ').replace(/\.\d+Z?$/, '');
    }
    return formatTime(date, false).replace(/\//g, '-');
}

export default {
    data: {
        types: ['请选择', '报修', '投诉'],
        typeIndex: 1,
        category: '',
        content: '',
        submitting: false,
        repairs: [],
        page: 1,
        size: 10,
        total: 0,
        statusMap: { 0: '待处理', 1: '处理中', 2: '已完成' }
    },

    onLoad() {
        this.fetchRepairList();
    },

    bindTypeChange(e) {
        this.setData({ typeIndex: Number(e.detail.value) });
    },

    onInput(e) {
        const field = e.currentTarget.dataset.field;
        this.setData({ [field]: e.detail.value });
    },

    async submitRepair() {
        const { typeIndex, category, content } = this.data;
        if (typeIndex === 0) {
            uni.showToast({ title: '请选择类型', icon: 'none' });
            return;
        }
        if (!category || !content) {
            uni.showToast({ title: '请填写完整', icon: 'none' });
            return;
        }

        this.setData({ submitting: true });
        try {
            await createRepair({
                type: Number(typeIndex),
                category,
                content
            });

            uni.showToast({ title: '提交成功', icon: 'success' });
            this.setData({
                category: '',
                content: ''
            });
            await this.fetchRepairList(true);
        } catch (e) {
            console.error(e);
        } finally {
            this.setData({ submitting: false });
        }
    },

    async fetchRepairList(reset = false) {
        try {
            const res = await getRepairList({ page: 1, size: 20 });
            const list = (res.list || []).map(item => ({
                ...item,
                created_at_text: formatRepairTime(item.created_at)
            }));
            this.setData({ repairs: list });
        } catch (e) {
            console.error(e);
            if (reset) {
                this.setData({ repairs: [] });
            }
        }
    }
};
