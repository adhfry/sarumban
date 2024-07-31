<template>
    <layout>
    <div class="row">
        <BCol cols="12" class="container">
            <div class="page-title-box d-flex align-items-center justify-content-between">
                <h4 class="mb-0 font-size-18">Referensi Dapodik</h4>
            </div>
        </BCol>
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="card-title">
                        Kelas
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                        <th>No</th>
                        <th>Kelas</th>
                        <th>Kurimulum</th>
                        </thead>
                        <tbody>
                        <tr v-for="(kls, index) in kelass" :key="kls.id">
                            <td>{{ index + 1 }}</td>
                            <td><span class="bg rounded-pill text-white bg-info">{{ kls.nama }}</span></td>
                            <td>
                                <span class="bg rounded-pill text-white bg-info">{{ kls.kurikulum_id_str }}</span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="card-title">
                        Siswa
                    </div>
                </div>
                <div class="card-body">
                    <form action="">
                        <div class="form-group">
                            <label for="">Pilih kelas</label>
                            <select class="form-control" @change="getSiswas(kelas_id)" v-model="kelas_id">
                                <option value="">---</option>
                                <option v-for="kls in kelass" :key="kls.id" :value="kls.rombongan_belajar_id">{{kls.nama}}</option>
                            </select>
                        </div>
                    </form>
                    <hr>
                    <DataTable class="table table-bordered" :columns="columns" :data="siswas"></DataTable>
                </div>
            </div>
        </div>
    </div>
    </layout>
</template>

<script>
import Layout from "@/layouts/main.vue";
import axios from "axios";
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';
import 'datatables.net-select';
import 'datatables.net-responsive';

DataTable.use(DataTablesCore);
export default {
    components:{
        Layout, DataTable
    },
    data(){
        return{
            kelass:[],
            siswas:[],
            columns:[
                {title:"Nisn", data:"nisn"},
                {title: "Nama", data:"nama"},
            ]
        }
    },
    methods:{
        async getKelas(){
            await axios.get('/api/admin/dapo/getDatas')
                .then(res => {
                    this.kelass = res.data.kelas;
                })
        },
        async getSiswas(id){
            await axios.post('/api/admin/dapo/getSiswa', {
                "kelas_id" : id
            })
                .then(res => {
                    this.siswas = res.data
                })
        }
    },
    mounted() {
        this.getKelas();
    }
}
</script>
<style>
@import 'datatables.net-dt';
</style>
