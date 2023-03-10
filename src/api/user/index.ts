import request from '/@/utils/request';

export function useUserApi() {
	return {
		getList: (params?: object) => {
			return request({
				url: '/sys/user/list',
				method: 'get',
				params: params,
			});
		},
		saveUser: (data?: object) => {
			return request({
				url: '/sys/user/save',
				method: 'post',
				data: data,
			});
		},
		updateUser: (data?: object) => {
			return request({
				url: '/sys/user/update',
				method: 'put',
				data: data,
			});
		},
		updatePwd: (data?: object) => {
			return request({
				url: '/sys/user/updatePwd',
				method: 'put',
				data: data,
			});
		},
		deleteUser: (params?: object) => {
			return request({
				url: '/sys/user/delete',
				method: 'delete',
				params: params,
			});
		},
	};
}
