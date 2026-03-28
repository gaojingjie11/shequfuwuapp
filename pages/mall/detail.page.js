import __dep1 from '../../api/product';
import __dep2 from '../../api/order';
import __dep3 from '../../api/comment';

const { getProductDetail, addFavorite, removeFavorite, checkFavorite } = __dep1;
const { addToCart } = __dep2;
const { getCommentList } = __dep3;

export default {
    data: {
        product: {},
        isFavorite: false,
        comments: [],
        page: 1,
        size: 10,
        total: 0
    },

    onLoad(options) {
        if (options.id) {
            this.getProductDetail(options.id);
            this.getComments(options.id);
            this.checkFavorite(options.id);
        }
    },

    async getProductDetail(id) {
        try {
            const res = await getProductDetail(id);
            this.setData({ product: res });
        } catch (e) {
            console.error(e);
        }
    },

    async getComments(id) {
        try {
            const res = await getCommentList({
                product_id: id,
                page: this.data.page,
                size: this.data.size
            });
            const list = (res.list || res || []).map((item) => ({
                ...item,
                created_at: this.formatCommentTime(item.created_at)
            }));
            this.setData({ comments: list });
        } catch (e) {
            console.error(e);
        }
    },

    formatCommentTime(value) {
        if (!value) return '';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return String(value);
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const mi = String(date.getMinutes()).padStart(2, '0');
        return `${mm}-${dd} ${hh}:${mi}`;
    },

    async checkFavorite(id) {
        try {
            const res = await checkFavorite(id);
            // res is { is_favorite: bool }
            this.setData({ isFavorite: res.is_favorite });
        } catch (e) {
            console.error(e);
        }
    },

    async toggleFavorite() {
        if (!this.data.product) return;
        const id = this.data.product.id;
        try {
            if (this.data.isFavorite) {
                await removeFavorite(id);
                this.setData({ isFavorite: false });
                uni.showToast({ title: '已取消', icon: 'none' });
            } else {
                await addFavorite(id);
                this.setData({ isFavorite: true });
                uni.showToast({ title: '已收藏', icon: 'none' });
            }
        } catch (e) {
            console.error(e);
            uni.showToast({ title: '操作失败', icon: 'none' });
        }
    },

    async addToCart() {
        if (!this.data.product) return;
        try {
            await addToCart({
                product_id: this.data.product.id,
                quantity: 1
            });
            uni.showToast({ title: '已加入购物车' });
        } catch (e) {
            console.error(e);
        }
    },

};
