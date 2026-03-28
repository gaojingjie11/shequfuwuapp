import request from '../utils/request';


export default {
    getCommunityMessages(params) {
        return request({
            url: '/community/messages',
            method: 'GET',
            data: params
        });
    },

    sendCommunityMessage(data) {
        return request({
            url: '/community/message',
            method: 'POST',
            data
        });
    }
};

