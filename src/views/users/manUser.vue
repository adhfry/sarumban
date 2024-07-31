<!-- @format -->

<template>
  <div class="col-6">
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <h3>Management User</h3>
        </div>
      </div>
      <div class="card-body">
        <div class="clearfix">
          <BButton v-b-modal.modal-center class="float-end mb-2 btn-success"
            ><span class="fa fa-user"></span
          ></BButton>
        </div>
        <vue3-datatable
          :rows="rows"
          :columns="cols"
          :loading="loading"
          :totalRows="total_rows"
          :isServerMode="true"
          :pageSize="params.pagesize"
          @change="changeServer"
          :pageSizeOptions="[5, 10, 20, 50, 100]"
          class="table"
        >
          <template #id="data">
            <strong>{{ data.value.id }}</strong>
          </template>
          <template #actions="data">
            <div class="flex gap-4">
              <button
                type="button"
                class="btn btn-success btn-sm bt-sm !py-1 m-2"
                @click="viewUser(data.value)"
              >
                <span class="fa fa-eye"></span>
              </button>
              <button
                type="button"
                class="btn btn-danger btn-sm !py-1"
                @click="deleteUser(data.value)"
              >
                <span class="fa fa-trash"></span>
              </button>
            </div>
          </template>
        </vue3-datatable>
        <BModal
          v-model="showModal"
          @hide.prevent
          @ok="simRole"
          @cancel="showModal = !showModal"
          @close="showModal = !showModal"
          id="modal-center"
          centered
          title="Add User"
        >
          <form>
            <div class="form-group">
              <label for="">Create User</label>
              <BFormInput
                id="input-invalid"
                :state="state"
                v-model="name"
                placeholder="users"
              />
              <BFormInvalidFeedback id="input-live-feedback" v-if="errors">
                {{ errors.message }}
              </BFormInvalidFeedback>
              <label for="" class="mt-4">Email</label>
              <BFormInput
                id="input-invalid"
                :state="state"
                v-model="email"
                placeholder="email"
              />
              <BFormInvalidFeedback id="input-live-feedback" v-if="errors">
                {{ errors.message }}
              </BFormInvalidFeedback>
              <label for="" class="mt-4">Password</label>
              <BFormInput
                id="input-invalid"
                :state="state"
                v-model="password"
                placeholder="password"
              />
              <BFormInvalidFeedback id="input-live-feedback" v-if="errors">
                {{ errors.message }}
              </BFormInvalidFeedback>
            </div>
          </form>
        </BModal>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
export default {
  components: {
    Vue3Datatable,
  },
  data() {
    return {
      roles: [],
      cols: [
        { field: "id", width: "50px", title: "ID" },
        { field: "name", title: "NAME" },
        { field: "email", title: "EMAIL", width: "250px" },
        { field: "actions", title: "ACTION" },
      ],
      loading: true,
      total_rows: 0,
      params: { current_page: 1, pagesize: 5 },
      rows: [],
      name: "",
      email: "",
      password: "",
      showModal: false,
      state: null,
      errors: null,
    };
  },
  methods: {
    kesini() {
      this.showModal = false;
    },
    async getRoles() {
      await axios.get("/api/admin/user").then((res) => {
        this.rows = res.data.data;
        this.pagi = res.data.links.length;
        this.loading = false;
        this.total_rows = res.data.total;
      });
    },
    viewUser(gg) {
      alert("View User \n" + gg.id);
    },
    async deleteUser(gg) {
      if (confirm("yakin akan menghapus")) {
        await axios.delete("/api/admin/user/" + gg.id).then(() => {
          this.getRoles();
          this.$toast.success(
            "Berhasil Menghapus User, Silahkan Sync Data User Role"
          );
        });
      }
    },
    async changeServer(page) {
      // console.log(page)
      this.loading = true;
      await axios
        .get(
          "/api/admin/user?page=" +
            page.current_page +
            "&paginate=" +
            parseInt(page.pagesize)
        )
        .then((res) => {
          this.rows = res.data.data;
          this.loading = false;
        });
    },
    async simRole() {
      await axios
        .post("/api/admin/user", {
          name: this.name,
          email: this.email,
          password: this.password,
        })
        .then(() => {
          this.getRoles();
          this.name = "";
          this.email = "";
          this.password = "";
          this.errors = null;
          this.state = null;
          this.showModal = false;
          this.$toast.success(
            "Berhasil Menambahkan User, Silahkan Sync Data User Role"
          );
        })
        .catch((e) => {
          this.errors = e.response.data;
          this.state = false;
          this.$toast.error("Gagal Menambahkan User");
        });
    },
  },
  created() {
    this.getRoles();
  },
};
</script>

<style></style>
