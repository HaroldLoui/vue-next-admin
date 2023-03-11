<template>
	<div class="system-user-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="ruleFormRef" :rules="rules" :model="state.ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="用户名" prop="username">
							<el-input v-model="state.ruleForm.username" placeholder="请输入用户名" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="用户昵称">
							<el-input v-model="state.ruleForm.nickname" placeholder="请输入用户昵称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="用户密码">
							<el-input v-model="state.ruleForm.password" placeholder="请输入密码" clearable disabled></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="用户类型">
							<el-select v-model="state.ruleForm.type" placeholder="请选择" clearable class="w100">
								<el-option label="超级管理员" :value="0" disabled></el-option>
								<el-option label="普通管理员" :value="1"></el-option>
								<el-option label="普通用户" :value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="手机号">
							<el-input v-model="state.ruleForm.phone" placeholder="请输入手机号" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="邮箱">
							<el-input v-model="state.ruleForm.email" placeholder="请输入邮箱	" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="用户状态">
							<el-switch v-model="state.ruleForm.status" inline-prompt active-text="启" inactive-text="禁"></el-switch>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="用户描述">
							<el-input v-model="state.ruleForm.remark" type="textarea" placeholder="请输入用户描述" maxlength="150"></el-input>
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
import { reactive, ref, nextTick } from 'vue';
import { useUserApi } from '/@/api/user/index';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义接口
const userApi = useUserApi();

// 定义变量内容
const ruleFormRef = ref<FormInstance>();
const state = reactive({
	ruleForm: {
		username: '', // 账户名称
		nickname: '', // 用户昵称
		phone: '', // 手机号
		email: '', // 邮箱
		password: '123456', // 账户密码
		type: '', // 用户类型
		status: true, // 用户状态
		remark: '', // 用户描述
	},
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});

// 表单验证规则
const rules = reactive<FormRules>({
	username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (type: string, row: RowUserType) => {
	if (type === 'edit') {
		state.ruleForm = row;
		state.dialog.title = '修改用户';
		state.dialog.submitTxt = '修 改';
	} else {
		state.dialog.title = '新增用户';
		state.dialog.submitTxt = '新 增';
	}
	state.dialog.type = type;
	state.dialog.isShowDialog = true;
};

// 关闭弹窗
const closeDialog = () => {
	state.dialog.isShowDialog = false;
	// 清空表单验证
	nextTick(() => {
		resetForm(ruleFormRef.value);
	});
};

// 取消
const onCancel = () => {
	closeDialog();
};

// 提交
const onSubmit = async (formEl: FormInstance | undefined) => {
	if (!formEl) {
		return;
	}
	formEl.validate(async (valid) => {
		if (valid) {
			if (state.dialog.type === 'edit') {
				// 修改用户
				updateUser(state.ruleForm);
			} else {
				// 新增用户
				insertUser(state.ruleForm);
			}
		} else {
			return false;
		}
	});
};

/**
 * 新增用户
 */
const insertUser = async (data: object) => {
	const res = await userApi.saveUser(data);
	if (res.code === 200) {
		ElMessage.success(res.msg);
		closeDialog();
		emit('refresh');
	} else {
		ElMessage.warning(res.msg);
	}
};

/**
 * 新增用户
 */
const updateUser = async (data: object) => {
	const res = await userApi.updateUser(data);
	if (res.code === 200) {
		ElMessage.success(res.msg);
		closeDialog();
		emit('refresh');
	} else {
		ElMessage.warning(res.msg);
	}
};

/**
 * 清空表单内容及验证
 */
const resetForm = (formEl: FormInstance | undefined) => {
	initRuleForm();
	if (!formEl) {
		return;
	}
	formEl.resetFields();
};

const initRuleForm = () => {
	state.ruleForm.username = '';
	state.ruleForm.nickname = '';
	state.ruleForm.phone = '';
	state.ruleForm.email = '';
	state.ruleForm.password = '123456';
	state.ruleForm.type = '';
	state.ruleForm.status = true;
	state.ruleForm.remark = '';
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
