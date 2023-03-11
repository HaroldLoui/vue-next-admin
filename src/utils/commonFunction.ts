// 通用函数
import useClipboard from 'vue-clipboard3';
import { ElMessage } from 'element-plus';
import { formatDate } from '/@/utils/formatTime';
import { useI18n } from 'vue-i18n';

export function commonFunction() {
	const { t } = useI18n();
	const { toClipboard } = useClipboard();

	return {
		// 百分比格式化
		percentFormat: (row: EmptyArrayType, column: number, cellValue: string) => {
			return cellValue ? `${cellValue}%` : '-';
		},
		// 列表日期时间格式化
		dateFormatYMD: (row: EmptyArrayType, column: number, cellValue: string) => {
			if (!cellValue) return '-';
			return formatDate(new Date(cellValue), 'YYYY-mm-dd');
		},
		// 列表日期时间格式化
		dateFormatYMDHMS: (row: EmptyArrayType, column: number, cellValue: string) => {
			if (!cellValue) return '-';
			return formatDate(new Date(cellValue), 'YYYY-mm-dd HH:MM:SS');
		},
		// 列表日期时间格式化
		dateFormatHMS: (row: EmptyArrayType, column: number, cellValue: string) => {
			if (!cellValue) return '-';
			let time = 0;
			if (typeof row === 'number') time = row;
			if (typeof cellValue === 'number') time = cellValue;
			return formatDate(new Date(time * 1000), 'HH:MM:SS');
		},
		// 小数格式化
		scaleFormat: (value: string = '0', scale: number = 4) => {
			return Number.parseFloat(value).toFixed(scale);
		},
		// 小数格式化
		scale2Format: (value: string = '0') => {
			return Number.parseFloat(value).toFixed(2);
		},
		// 点击复制文本
		copyText: (text: string) => {
			return new Promise((resolve, reject) => {
				try {
					//复制
					toClipboard(text);
					//下面可以设置复制成功的提示框等操作
					ElMessage.success(t('message.layout.copyTextSuccess'));
					resolve(text);
				} catch (e) {
					//复制失败
					ElMessage.error(t('message.layout.copyTextError'));
					reject(e);
				}
			});
		},
		// 深拷贝对象
		copyObject: (obj: any) => {
			return JSON.parse(JSON.stringify(obj));
		},
	};
}
