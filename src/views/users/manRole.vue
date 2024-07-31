<!-- @format -->

<template>
  <div class="col-6">
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <h3>Management Role</h3>
        </div>
      </div>
      <div class="card-body">
        <div class="clearfix">
          <BButton v-b-modal.modal-center1 class="float-end my-3 btn-success"
            ><span class="fa fa-robot"></span
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
                @click="viewRole(data.value)"
              >
                <span class="fa fa-eye"></span>
              </button>
              <button
                type="button"
                class="btn btn-danger btn-sm !py-1"
                @click="deleteRole(data.value)"
              >
                <span class="fa fa-trash"></span>
              </button>
            </div>
          </template>
        </vue3-datatable>
        <BModal
          v-model="showModal"
          @hide.prevent
          @ok="saveRole"
          @cancel="showModal = !showModal"
          @close="showModal = !showModal"
          id="modal-center1"
          centered
          title="Add Role"
        >
          <form>
            <div class="form-group">
              <label for="">Create Role</label>
              <BFormInput
                id="input-invalid"
                :state="state"
                v-model="role"
                placeholder="Role"
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
import axios from "../../services/api";
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
        { field: "role", title: "ROLE" },
        { field: "actions", title: "ACTION" },
      ],
      loading: true,
      total_rows: 0,
      params: { current_page: 1, pagesize: 5 },
      rows: [],
      role: "",
      showModal: false,
      state: null,
      errors: null,
    };
  },
  methods: {
    async getRoles() {
      try {
        const res = await axios.get("/api/admin/role");
        this.rows = res.data.data;
        this.total_rows = res.data.total;
        this.loading = false;
      } catch (error) {
        console.error(error);
        this.loading = false;
      }
    },
    viewRole(role) {
      alert("View Role \n" + role.role);
    },
    async deleteRole(role) {
      if (confirm("Are you sure you want to delete this role?")) {
        try {
          await axios.delete(`/api/admin/role/${role.id}`);
          this.getRoles();
          this.$toast.success("Berhasil Menghapus Role");
        } catch (error) {
          this.$toast.error("Gagal Menghapus Role");
          console.error(error);
        }
      }
    },
    async changeServer(page) {
      this.loading = true;
      try {
        const res = await axios.get(
          `/api/admin/role?page=${page.current_page}&paginate=${page.pagesize}`
        );
        this.rows = res.data.data;
        this.loading = false;
      } catch (error) {
        console.error(error);
        this.loading = false;
      }
    },
    async saveRole() {
      try {
        await axios.post("/api/admin/role", { role: this.role });
        this.getRoles();
        this.role = "";
        this.errors = null;
        this.state = true;
        this.showModal = false;
        this.$toast.success("Berhasil Menambah Role");
      } catch (error) {
        this.errors = error.response.data;
        this.state = false;
        this.$toast.error("Gagal Menambah Role");
      }
    },
  },
  created() {
    this.getRoles();
  },
};
</script>

<style scoped></style>
