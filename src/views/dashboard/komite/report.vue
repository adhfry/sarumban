<!-- @format -->

<template>
	<div>
		<BRow>
			<BCol>
				<BCard no-body>
					<BCardBody>
						<BCardTitle>Report Keuangan</BCardTitle>
						<form action="">
							<div class="row">
								<div class="form-group col-6">
									<label for="">Pilih Opsi</label>
									<select
										@change="status1"
										v-model="opsi1"
										class="form-control">
										<option value="1">Harian</option>
										<option value="2">Bulanan</option>
										<option value="3">Tahunan</option>
									</select>
								</div>
								<div class="form-group col-6">
									<label for="">Pilih Opsi</label>
									<flat-pickr
										v-if="showHarian1"
										v-model="picked11"
										lang="id"
										class="form-control">
									</flat-pickr>
									<flat-pickr
										v-if="showBulanan1"
										v-model="picked12"
										:config="config"
										lang="id"
										class="form-control">
									</flat-pickr>
									<flat-pickr
										v-if="showTahunan1"
										v-model="picked22"
										:config="config1"
										lang="id"
										class="form-control">
									</flat-pickr>
								</div>
							</div>
							<button
								type="button"
								class="btn btn-info mt-3"
								@click="getReport">
								Pilih
							</button>
						</form>
						<h1
							class="mt-5"
							v-if="totalHarian">
							Pendapatan Harian : {{ formatPrice(totalHarian) }}
						</h1>
						<h1
							class="mt-5"
							v-if="totalBulan">
							Pendapatan Bulanan : {{ formatPrice(totalBulan) }}
						</h1>
						<h1
							class="mt-5"
							v-if="totalTahun">
							Pendapatan Tahunan : {{ formatPrice(totalTahun) }}
						</h1>
					</BCardBody>
				</BCard>
			</BCol>
		</BRow>
	</div>
</template>

<script>
	import flatPickr from 'vue-flatpickr-component';
	import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect';
	import 'flatpickr/dist/flatpickr.css';
	import axios from 'axios';
	export default {
		data() {
			return {
				komites: [],
				totalHarian: null,
				totalBulan: null,
				totalTahun: null,
				opsi1: '',
				picked11: '',
				picked12: '',
				picked22: '',
				showHarian1: false,
				showBulanan1: false,
				showTahunan1: false,
				config: {
					plugins: [
						new monthSelectPlugin({
							shorthand: true, //defaults to false
							dateFormat: 'm-Y', //defaults to "F Y"
							altFormat: 'F Y', //defaults to "F Y"
							theme: 'light', // defaults to "light"
						}),
					],
				},
				config1: {
					plugins: [
						new monthSelectPlugin({
							shorthand: true, //defaults to false
							dateFormat: 'Y', //defaults to "F Y"
							altFormat: 'Y', //defaults to "F Y"
							theme: 'light', // defaults to "light"
						}),
					],
				},
			};
		},
		methods: {
			formatPrice(value) {
				let val = (value / 1).toFixed(2).replace('.', ',');
				return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
			},
			status1() {
				if (this.opsi1 === '1') {
					this.showHarian1 = true;
					this.showBulanan1 = false;
					this.showTahunan1 = false;
				} else if (this.opsi1 === '2') {
					this.showBulanan1 = true;
					this.showHarian1 = false;
					this.showTahunan1 = false;
				} else if (this.opsi1 === '3') {
					this.showTahunan1 = true;
					this.showBulanan1 = false;
					this.showHarian1 = false;
				} else {
					this.showHarian1 = false;
					this.showBulanan1 = false;
					this.showTahunan1 = false;
				}
			},
			async getHarian() {
				await axios
					.post('/api/admin/komites/income', {
						tanggal: this.picked11,
					})
					.then((res) => {
						this.totalHarian = res.data.harian;
						this.totalBulan = null;
						this.totalTahun = null;
					});
			},
			async getBulanan() {
				await axios
					.post('/api/admin/komites/income', {
						bulan: this.picked12,
					})
					.then((res) => {
						this.totalBulan = res.data.bulanan;
						this.totalHarian = null;
						this.totalTahun = null;
					});
			},
			async getTahunan() {
				await axios
					.post('/api/admin/komites/income', {
						tahun: this.picked22,
					})
					.then((res) => {
						this.totalTahun = res.data.tahunan;
						this.totalBulan = null;
						this.totalHarian = null;
					});
			},
			async getReport() {
				if (this.opsi1 === '1') {
					this.getHarian();
				} else if (this.opsi1 === '2') {
					this.getBulanan();
				} else if (this.opsi1 === '3') {
					this.getTahunan();
				} else {
					alert('maaf item belum terpilih');
				}
			},
		},
		components: {
			flatPickr,
		},
		mounted() {},
	};
</script>

<style lang="scss" scoped></style>
