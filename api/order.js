import request from '../utils/request';

export default {
    addToCart(data) {
        return request({
            url: '/cart/add',
            method: 'POST',
            data
        });
    },

    getCartList() {
        return request({
            url: '/cart/list',
            method: 'GET'
        });
    },

    deleteCartItem(id) {
        return request({
            url: `/cart/${id}`,
            method: 'DELETE'
        });
    },

    updateCartQuantity(id, quantity) {
        return request({
            url: `/cart/${id}`,
            method: 'POST',
            data: { quantity }
        });
    },

    createOrder(data) {
        return request({
            url: '/order/create',
            method: 'POST',
            data
        });
    },

    getOrderList(params) {
        return request({
            url: '/order/list',
            method: 'GET',
            data: params
        });
    },

    payOrder(data) {
        const businessId = data.business_id || data.order_id || data.id;
        return request({
            url: '/finance/pay',
            method: 'POST',
            data: {
                business_id: businessId,
                business_type: data.business_type || 1,
                pay_type: data.pay_type || 'password',
                password: data.password || '',
                face_image_url: data.face_image_url || ''
            }
        });
    },

    cancelOrder(orderId) {
        return request({
            url: '/order/cancel',
            method: 'POST',
            data: { id: orderId }
        });
    },

    receiveOrder(id) {
        return request({
            url: '/order/receive',
            method: 'POST',
            data: { id }
        });
    },

    getOrderDetail(id) {
        return request({
            url: '/order/detail',
            method: 'GET',
            data: { id }
        });
    }
};
