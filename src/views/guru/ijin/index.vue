<!-- @format -->

<template>
  <div>
    <Layout>
      <BRow>
        <BCol lg="6">
          <BCard no-body>
            <BCardHeader>
              <BCardTitle>
                <H5>Apps Perijinan</H5>
              </BCardTitle>
            </BCardHeader>
            <BCardBody>
              <div v-if="ptk">
                <button
                  class="btn btn-md btn-outline-primary me-2"
                  type="button"
                >
                  {{ ptk.nama.toUpperCase() }}
                </button>
              </div>
              <div class="row">
                <!-- <form action=""> -->
                <div class="form-group mt-5 col-6">
                  <label>Pilih mapel</label>
                  <select
                    v-model="mapel_id"
                    class="form-control"
                    @change="getkelas"
                  >
                    <option value="">---</option>
                    <option
                      v-for="mapel in mapels"
                      :key="mapel.mata_pelajaran_id"
                      :value="mapel.mata_pelajaran_id"
                    >
                      {{ mapel.mata_pelajaran_id_str }}
                    </option>
                  </select>
                </div>
                <div class="form-group mt-5 col-6">
                  <label>Pilih Kelas</label>
                  <select v-model="kelas_id" class="form-control">
                    <option value="">---</option>
                    <option
                      v-for="kls in kelas"
                      :key="kls.rb_id"
                      :value="kls.rb_id"
                    >
                      {{ kls.rombels.nama }}
                    </option>
                  </select>
                </div>
                <div class="form-group mt-3 col-6">
                  <label for="">Dari</label>
                  <flat-pickr
                    v-model="dari"
                    :first-day-of-week="1"
                    lang="en"
                    confirm
                    class="form-control"
                  >
                  </flat-pickr>
                </div>
                <div class="form-group mt-3 col-6">
                  <label for="">Sampai</label>
                  <flat-pickr
                    v-model="sampai"
                    :first-day-of-week="1"
                    lang="en"
                    confirm
                    class="form-control"
                  >
                  </flat-pickr>
                </div>
                <div class="form-group mt-3">
                  <label>Pilih Keterangan</label>
                  <select v-model="ket" class="form-control">
                    <option value="ijin">Ijin</option>
                    <option value="sakit">Sakit</option>
                    <option value="dl">Dinas Luar</option>
                  </select>
                </div>
                <div class="form-group mt-3">
                  <label>Deskripsi Tugas</label>
                  <textarea v-model="desk" type="text" class="form-control" />
                </div>
              </div>
              <button class="btn btn-primary mt-3" @click="simpan">
                simpan
              </button>
            </BCardBody>
          </BCard>
        </BCol>
        <bCol lg="6">
          <BCard np-body>
            <BCardBody>
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Ket</th>
                    <th>Kelas</th>
                    <th>Dari</th>
                    <th>Sampai</th>
                    <th>Desk</th>
                    <th>#</th>
                  </thead>
                  <tbody>
                    <tr v-for="(repot, index) in reports" :key="repot.id">
                      <td>{{ index + 1 }}</td>
                      <td>
                        <BBadge variant="primary">{{ repot.user.name }}</BBadge>
                      </td>
                      <td>
                        <BBadge variant="success">{{
                          repot.ket.toUpperCase()
                        }}</BBadge>
                      </td>
                      <td style="width: 10%">{{ repot.kelas.nama }}</td>
                      <td>{{ repot.dari }}</td>
                      <td>{{ repot.sampai }}</td>
                      <td>{{ repot.desk }}</td>
                      <td>
                        <button
                          class="btn btn-sm btn-danger"
                          @click="hapus(repot.id)"
                        >
                          <span class="fa fa-trash"></span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </BCardBody>
          </BCard>
        </bCol>
      </BRow>
    </Layout>
  </div>
</template>

<script>
import Layout from "@/layouts/main.vue";
// import PageHeader from "@/components/page-header.vue";
import axios from "../../../services/api";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")),
      ptk: null,
      mapels: [],
      kelas: [],
      reports: [],
      kelas_id: null,
      mapel_id: "",
      dari: "",
      sampai: "",
      ket: "",
      desk: "",
    };
  },
  methods: {
    async getPtk() {
      await axios.get("/api/guru/ijin").then((res) => {
        this.ptk = res.data;
      });
    },
    async getMapels() {
      await axios.get("/api/guru/getMapels").then((res) => {
        this.mapels = res.data;
      });
    },
    async getkelas() {
      await axios.get("/api/guru/getGuruKelas").then((res) => {
        this.kelas = res.data;
        // ini di sorting dulu
        this.kelas.sort((a, b) => a.rombels.nama.localeCompare(b.rombels.nama));
      });
    },
    async simpan() {
      await axios
        .post("/api/guru/simI", {
          mapel_id: this.mapel_id,
          kelas_id: this.kelas_id,
          dari: this.dari,
          sampai: this.sampai,
          ket: this.ket,
          desk: this.desk,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.log(e, "error");
        });
    },
    async getMe() {
      await axios
        .post("/api/guru/me", {
          user_id: this.user.user_id,
        })
        .then((res) => {
          this.reports = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async hapus(id) {
      if (confirm("yakin menghapus ?")) {
        await axios.delete("/api/guru/del/" + id).then(() => {
          this.getMe();
        });
      }
    },
  },
  components: {
    Layout,
    // PageHeader,
    flatPickr,
  },
  created() {
    this.getPtk();
    this.getMapels();
    this.getMe();
  },
};
</script>

<style lang="scss" scoped></style>
