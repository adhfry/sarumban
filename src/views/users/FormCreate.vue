<!-- @format -->

<template>
	<div class="row">
		<div class="col-12">
			<div class="row">
				<man-user />
				<man-role />
			</div>
		</div>
		<div class="col-12">
			<div class="row">
				<man-role-user />
			</div>
		</div>
	</div>
</template>

<script>
	import manRole from './manRole.vue';
	import manUser from './manUser.vue';
	import manRoleUser from './manRoleUser.vue';
	export default {
		components: {
			manRole,
			manUser,
			manRoleUser,
		},
	};
</script>

<style></style>
