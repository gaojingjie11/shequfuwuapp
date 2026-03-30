import request from '../utils/request';

export default {
    getNoticeList(params, options = {}) {
        return request({
            url: '/notices',
            method: 'GET',
            data: params,
            ...options
        });
    },

    getNoticeDetail(id) {
        return request({
            url: `/notice/${id}`,
            method: 'GET'
        });
    },

    readNotice(id) {
        return request({
            url: `/notice/read/${id}`,
            method: 'POST'
        });
    },

    createRepair(data) {
        return request({
            url: '/repair/create',
            method: 'POST',
            data
        });
    },

    getRepairList(params) {
        return request({
            url: '/repair/list',
            method: 'GET',
            data: params
        });
    },

    createVisitor(data) {
        return request({
            url: '/visitor/create',
            method: 'POST',
            data
        });
    },

    getVisitorList(params) {
        return request({
            url: '/visitor/list',
            method: 'GET',
            data: params
        });
    },

    getMyParking() {
        return request({
            url: '/parking/my',
            method: 'GET'
        });
    },

    bindCar(data) {
        return request({
            url: '/parking/bind',
            method: 'POST',
            data
        });
    },

    getPropertyFeeList(params) {
        return request({
            url: '/property/list',
            method: 'GET',
            data: params
        });
    },

    payPropertyFee(data) {
        const businessId = data.business_id || data.related_id || data.id;
        return request({
            url: '/finance/pay',
            method: 'POST',
            data: {
                business_id: businessId,
                business_type: data.business_type || 2,
                pay_type: data.pay_type || 'password',
                password: data.password || '',
                face_image_url: data.face_image_url || ''
            }
        });
    },

    getStoreList() {
        return request({
            url: '/stores',
            method: 'GET'
        });
    }
};
