<!-- @format -->

<template>
  <div class="col-12">
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <h3>Management User Role</h3>
        </div>
      </div>
      <div class="card-body">
        <div class="clearfix">
          <BButton class="btn-info" @click="syncData">
            <span class="fs-6 fw-bold">Sinkron Data </span>
            <i class="bx bx-sync"></i>
          </BButton>
          <BButton
            v-b-modal.modal-center-userR
            class="float-end mb-2 btn-success"
            ><span class="fas fa-atom"></span
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
          <template #role="data">
            <ul v-for="rl in data.value.roles" :key="rl.id">
              <li>
                <BBadge
                  variant="primary"
                  pill
                  @click="removeRole(rl.pivot.user_id, rl.id)"
                  class="btn"
                  >{{ rl.role }}</BBadge
                >
              </li>
            </ul>
          </template>
          <!-- <template #actions="data">
						<div class="flex gap-4">
							<button
								type="button"
								class="btn btn-success btn-sm bt-sm !py-1 m-2"
								@click="viewUser(data.value)">
								<span class="fa fa-eye"></span>
							</button>
							<button
								type="button"
								class="btn btn-danger btn-sm !py-1"
								@click="deleteUser(data.value)">
								<span class="fa fa-trash"></span>
							</button>
						</div>
					</template> -->
        </vue3-datatable>
        <BModal
          v-model="showModal"
          @hide.prevent
          @ok="simUserRole"
          @cancel="showModal = !showModal"
          @close="showModal = !showModal"
          id="modal-center-userR"
          centered
          title="Add User Role"
        >
          <form>
            <div class="form-group">
              <label for="">User</label>
              <select name="" id="" class="form-control" v-model="user">
                <option v-for="user in rows" :key="user.id" :value="user.id">
                  {{ user.name }}
                </option>
              </select>
              <BFormInvalidFeedback id="input-live-feedback" v-if="errors">
                {{ errors.message }}
              </BFormInvalidFeedback>
              <label for="">Role</label>
              <select name="" id="" class="form-control" v-model="role">
                <option v-for="role in roles" :key="role.id" :value="role.id">
                  {{ role.role }}
                </option>
              </select>
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
import { BButton } from "bootstrap-vue-next";
export default {
  components: {
    Vue3Datatable,
    BButton,
  },
  data() {
    return {
      roles: [],
      cols: [
        { field: "id", title: "ID" },
        { field: "name", title: "NAME" },
        { field: "email", title: "EMAIL" },
        { field: "role", title: "ROLE" },
      ],
      loading: true,
      total_rows: 0,
      params: { current_page: 1, pagesize: 5 },
      rows: [],
      user: "",
      role: "",
      showModal: false,
      state: null,
      errors: null,
    };
  },
  methods: {
    async getRoles() {
      await axios.get("/api/admin/role").then((res) => {
        this.roles = res.data.data;
      });
    },

    async getUser() {
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
          this.getUser();
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
    async simUserRole() {
      await axios
        .post("/api/admin/user", {
          user: this.user,
          role: this.role,
        })
        .then(() => {
          this.getUser();
          this.user = "";
          this.role = "";
          this.errors = null;
          this.state = null;
          this.showModal = false;
          this.$toast.success("Berhasil Menambahkan Role kepada User");
        })
        .catch((e) => {
          this.$toast.error("Gagal Menambahkan Role kepada User");
          this.errors = e.response.data;
          this.state = false;
        });
    },
    async removeRole(userId, roleId) {
      if (confirm("anda yakin menghapus role")) {
        await axios
          .delete("/api/admin/user/" + userId + "/" + roleId)
          .then(() => {
            this.getUser();
            this.$toast.success("Berhasil Menghapus Role User");
          });
      }
    },
    async syncData() {
      this.getUser();
      this.getRoles();
      this.$toast.info("Berhasil Sync Data Terbaru");
    },
  },
  created() {
    this.getUser();
    this.getRoles();
  },
};
</script>

<style></style>
