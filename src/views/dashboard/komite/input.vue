<!-- @format -->

<template>
  <div class="row">
    <div class="col">
      <div class="card">
        <div class="card-header">
          <div class="card-title">Pembayaran Komite</div>
        </div>
        <div class="card-body">
          <form action="" @submit.prevent="simpan">
            <div class="row">
              <div class="form-group col-6">
                <label>Pilih Nominal</label>
                <select class="form-control" v-model="nominal">
                  <option v-for="p in price" :key="p.id" :value="p.price">
                    {{ formatPrice(p.price) }}
                  </option>
                </select>
              </div>
              <div class="form-group col-6">
                <label>Pilih kelas</label>
                <select class="form-control" v-model="kelas_id" @change="aksi">
                  <option
                    v-for="kls in kelass"
                    :key="kls.id"
                    :value="kls.rombongan_belajar_id"
                  >
                    {{ kls.nama }}
                  </option>
                </select>
              </div>
              <div class="form-group col-12 mt-3">
                <label>Pilih Tanggal</label>
                <flat-pickr
                  v-model="picked"
                  @change="getSiswas"
                  :first-day-of-week="1"
                  lang="en"
                  confirm
                  class="form-control"
                ></flat-pickr>
              </div>
            </div>

            <div class="form-group mt-3">
              <label>Pilih Siswa</label>
              <multiselect
                v-model="siswa_id"
                deselect-label="Can't remove this value"
                track-by="nama"
                label="nama"
                placeholder="Pilih Siswa"
                :options="siswas"
                :searchable="true"
                :allow-empty="true"
                multiple="true"
              >
              </multiselect>
            </div>
            <button class="btn btn-sm btn-primary mt-3">Submit</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Multiselect from "vue-multiselect";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
export default {
  props: ["price"],
  components: {
    Multiselect,
    flatPickr,
  },
  data() {
    return {
      kelass: [],
      siswas: [],
      siswa_id: [],
      nominal: 0,
      picked: "",
      kelas_id: "",
    };
  },
  methods: {
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    async getSiswas() {
      if (this.picked === "") return;
      await axios
        .post("/api/admin/dapo/getSiswaTrx", {
          tanggal: this.picked,
          kelas: this.kelas_id,
        })
        .then((res) => {
          this.siswas = res.data;
        });
    },
    aksi() {
      this.picked = "";
      this.siswas = [];
    },
    async getKelas() {
      await axios.get("/api/admin/dapo/getDatas").then((res) => {
        this.kelass = res.data.kelas;
      });
    },
    async simpan() {
      await axios
        .post("/api/admin/komites", {
          siswa_id: this.siswa_id,
          nominal: this.nominal,
          kelas_id: this.kelas_id,
          tgl: this.picked,
        })
        .then(() => {
          this.siswa_id = [];
          (this.nominal = ""), (this.kelas_id = ""), (this.picked = "");
        });
    },
  },
  mounted() {
    this.getKelas();
  },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.esm.css"></style>
