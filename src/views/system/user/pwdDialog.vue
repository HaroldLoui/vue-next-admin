<!-- eslint-disable vue/valid-v-model -->
<template>
	<div class="system-user-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="ruleFormRef" :rules="rules" :model="state.ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="新密码" prop="password">
							<el-input v-model="state.ruleForm.password" placeholder="请输入新密码" type="password" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="确认密码" prop="passwordRepeat">
							<el-input v-model="state.ruleForm.passwordRepeat" placeholder="请再次输入新密码" type="password" clearable />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit(ruleFormRef)" size="default">{{ state.dialog.submitTxt }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemUserDialog">
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { useUserApi } from '/@/api/user/index';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义接口
const userApi = useUserApi();

// 定义变量内容
const ruleFormRef = ref<FormInstance>();
const state = reactive({
	ruleForm: {
		userId: '', // 用户id
		password: '', // 新密码
		passwordRepeat: '', // 再次确认密码
	},
	dialog: {
		isShowDialog: false,
		title: '',
		submitTxt: '',
	},
});

/**
 * 自定义密码校验器
 */
const validatePass = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('请输入新密码'));
	} else {
		if (value.length < 6) {
			callback(new Error('密码长度应大于6位数'));
		}
		if (state.ruleForm.passwordRepeat !== '') {
			if (!ruleFormRef.value) return;
			ruleFormRef.value.validateField('passwordRepeat', () => null);
		}
		callback();
	}
};

/**
 * 自定义密码校验器
 */
const validatePass2 = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('请再次输入新密码'));
	} else if (value !== state.ruleForm.password) {
		callback(new Error('两次密码不一致'));
	} else {
		callback();
	}
};

/**
 * 校验规则
 */
const rules = reactive<FormRules>({
	password: [{ required: true, validator: validatePass, trigger: 'blur' }],
	passwordRepeat: [{ required: true, validator: validatePass2, trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (row: RowUserType) => {
	state.ruleForm.userId = row.id;
	state.dialog.title = '修改密码';
	state.dialog.submitTxt = '确 认';
	state.dialog.isShowDialog = true;
	resetForm(ruleFormRef.value);
};

// 关闭弹窗
const closeDialog = () => {
	state.dialog.isShowDialog = false;
};

/**
 * 取消
 */
const onCancel = () => {
	closeDialog();
};

/**
 * 提交
 */
const onSubmit = (formEl: FormInstance | undefined) => {
	if (!formEl) {
		return;
	}
	formEl.validate(async (valid) => {
		if (valid) {
			const data = {
				id: state.ruleForm.userId,
				password: state.ruleForm.password,
			};
			updatePwd(data);
		} else {
			return false;
		}
	});
};

const updatePwd = async (data: object) => {
	const res = await userApi.updatePwd(data);
	if (res.code === 200) {
		ElMessage.success(res.msg);
		emit('refresh');
		closeDialog();
	} else {
		ElMessage.warning(res.msg);
	}
};

/**
 * 清空表单内容及验证
 */
const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
