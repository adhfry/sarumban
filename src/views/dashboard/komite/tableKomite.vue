<!-- @format -->

<template>
	<div>
		<BRow>
			<BCol>
				<BCard no-body>
					<BCardBody>
						<BCardTitle>Hasil</BCardTitle>
						<form action="">
							<div class="row">
								<div class="form-group col-6">
									<label for="">Pilih Opsi</label>
									<select
										@change="status"
										v-model="opsi"
										class="form-control">
										<option value="1">Harian</option>
										<option value="2">Bulanan</option>
										<option value="3">Tahunan</option>
									</select>
								</div>
								<div class="form-group col-6">
									<label for="">Pilih Opsi</label>
									<flat-pickr
										v-if="showHarian"
										v-model="picked"
										lang="id"
										class="form-control">
									</flat-pickr>
									<flat-pickr
										v-if="showBulanan"
										v-model="picked1"
										:config="config"
										lang="id"
										class="form-control">
									</flat-pickr>
									<flat-pickr
										v-if="showTahunan"
										v-model="picked2"
										:config="config1"
										lang="id"
										class="form-control">
									</flat-pickr>
								</div>
							</div>
							<button
								type="button"
								class="btn btn-primary btn-sm mt-3"
								@click="getData">
								Pilih
							</button>
						</form>
						<div class="table table-responsive">
							<table class="table table-hover">
								<thead>
									<th>NISN</th>
									<th>Nama</th>
									<th>Kelas</th>
									<th>Nominal</th>
									<th>Pembayaran</th>
									<th>Action</th>
									<th>Create</th>
								</thead>
								<tbody>
									<tr
										v-for="komite in komites"
										:key="komite.id">
										<td>{{ komite.nisn }}</td>
										<td>{{ komite.peserta_didiks.nama }}</td>
										<td>{{ komite.peserta_didiks.nama_rombel }}</td>
										<td>{{ formatPrice(komite.nominal) }}</td>
										<td>{{ komite.tgl }}-{{ komite.bulan }}-{{ komite.tahun }}</td>
										<td>
											<button
												class="btn rounded-pill btn-outline-primary"
												@click="download(komite.id)">
												<span class="fa fa-print"></span>
											</button>
										</td>
										<td>{{ komite.created_at }}</td>
									</tr>
								</tbody>
							</table>
							<hr />
						</div>
					</BCardBody>
				</BCard>
			</BCol>
		</BRow>
		<report />
	</div>
</template>

<script>
	import report from './report.vue';
	import flatPickr from 'vue-flatpickr-component';
	import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect';
	import 'flatpickr/dist/flatpickr.css';
	import axios from 'axios';
	export default {
		data() {
			return {
				komites: [],
				totalBulan: null,
				totalTahun: null,
				opsi: '',
				picked: '',
				picked1: '',
				picked2: '',
				showHarian: false,
				showBulanan: false,
				showTahunan: false,
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
			status() {
				if (this.opsi === '1') {
					this.showHarian = true;
					this.showBulanan = false;
					this.showTahunan = false;
				} else if (this.opsi === '2') {
					this.showBulanan = true;
					this.showHarian = false;
					this.showTahunan = false;
				} else if (this.opsi === '3') {
					this.showTahunan = true;
					this.showBulanan = false;
					this.showHarian = false;
				} else {
					this.showHarian = false;
					this.showBulanan = false;
					this.showTahunan = false;
				}
			},
			cetak() {},
			download(id) {
				axios
					.get('/api/admin/komites/cetak/'+id, {
						responseType: 'blob',
					})
					.then((response) => {
						const url = window.URL.createObjectURL(new Blob([response.data]));
						const link = document.createElement('a');
						link.href = url;
						link.setAttribute('download', 'example.pdf'); // File name
						document.body.appendChild(link);
						link.click();
						link.remove();
					})
					.catch((error) => {
						console.error('Error downloading PDF:', error);
					});
			},
			async getKomites() {
				await axios.get('/api/admin/komites').then((res) => {
					this.komites = res.data.komites;
					this.totalBulan = res.data.sumBulan;
					this.totalTahun = res.data.sumTahun;
				});
			},
			async getHarian() {
				await axios
					.put('/api/admin/komites/show', {
						tanggal: this.picked,
					})
					.then((res) => {
						this.komites = res.data;
					});
			},
			async getBulanan() {
				await axios
					.put('/api/admin/komites/show', {
						bulan: this.picked1,
					})
					.then((res) => {
						this.komites = res.data;
					});
			},
			async getTahunan() {
				await axios
					.put('/api/admin/komites/show', {
						tahun: this.picked2,
					})
					.then((res) => {
						this.komites = res.data;
					});
			},
			async getData() {
				if (this.opsi === '1') {
					this.getHarian();
				} else if (this.opsi === '2') {
					this.getBulanan();
				} else if (this.opsi === '3') {
					this.getTahunan();
				} else {
					alert('maaf item belum terpilih');
				}
			},
		},
		components: {
			flatPickr,
			report,
		},
		mounted() {
			this.getKomites();
		},
	};
</script>
