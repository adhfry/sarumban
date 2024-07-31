<!-- @format -->

<template>
  <div>
    <Layout>
      <BCol>
        <BRow>
          <div class="card">
            <div class="card-header">
              <div class="card-title">Setting Menu</div>
            </div>
            <div class="card-body">
              <div class="clearfix">
                <BButton
                  v-b-modal.modal-center-menu
                  class="float-end mb-2 btn-success"
                  >Add Menu or Title
                </BButton>
                <BButton
                  v-b-modal.modal-center-SubMenu
                  class="float-end mb-2 btn-info me-2"
                  >Add Sub Menu
                </BButton>
              </div>
              <div class="table table-responsive">
                <vue3-datatable
                  :rows="rows"
                  :columns="cols"
                  :loading="loading"
                  :totalRows="total_rows"
                  :isServerMode="true"
                  :pageSize="params.pagesize"
                  @change="changeServer"
                  :pageSizeOptions="[5, 10, 20, 50, 100]"
                  skin="bh-table-striped"
                >
                  <template #id="data">
                    <p>{{ data.value.id }}</p>
                  </template>
                  <template #sub_menus="data">
                    <ul v-for="sub in data.value.sub_menus" :key="sub.id">
                      <li
                        class="d-flex justify-content-between"
                        style="width: 190px"
                      >
                        {{ sub.label }}
                        <button
                          class="btn btn-danger btn-sm"
                          @click="remSub(sub.id)"
                        >
                          <span class="fa fa-trash"></span>
                        </button>
                      </li>
                    </ul>
                  </template>
                </vue3-datatable>
              </div>
            </div>
          </div>
        </BRow>
      </BCol>
      <add-menu :roles="roles" @reload="getMenus" />
      <add-sub-menu :menus="subRows" :roles="roles" @reload="getMenus()" />
    </Layout>
  </div>
</template>

<script>
import Layout from "@/layouts/main.vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import axios from "axios";
import AddMenu from "./addMenu.vue";
import AddSubMenu from "./addSubMenu.vue";
import { fetchMenuItems } from "../../components/menu";
export default {
  data() {
    return {
      cols: [
        { field: "id", title: "No" },
        { field: "label", title: "Label" },
        { field: "isTitle", title: "isTitle" },
        { field: "icon", title: "Icon" },
        { field: "role", title: "Role" },
        { field: "sub_menus", title: "SubMenu" },
      ],
      loading: true,
      total_rows: 0,
      params: { current_page: 1, pagesize: 5 },
      rows: [],
      errors: [],
      roles: [],
      subRows: [],
    };
  },
  methods: {
    async getMenus() {
      await axios
        .get("/api/admin/menus")
        .then((res) => {
          const data = res.data.data.filter(
            (item) => item.isTitle === 0 || item.isTitle === false
          );
          this.subRows = data;
          this.rows = res.data.data;
          this.total_rows = res.data.total;
          this.loading = false;
          fetchMenuItems();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getRoles() {
      await axios.get("/api/admin/role").then((res) => {
        this.roles = res.data.data;
      });
    },
    async remSub(id) {
      if (confirm("anda yakin menghapus sub menu ?")) {
        await axios.delete("/api/admin/menus/" + id).then(() => {
          this.getMenus();
          this.$toast.success("Berhasil Menghapus Sub Menu");
          fetchMenuItems();
        });
      }
    },
    async changeServer(page) {
      console.log(page);
      this.loading = true;
      await axios
        .get(
          "/api/admin/menus?page=" +
            page.current_page +
            "&paginate=" +
            parseInt(page.pagesize)
        )
        .then((res) => {
          const data = res.data.data.filter(
            (item) => item.isTitle === 0 || item.isTitle === false
          );
          this.subRows = data;
          this.rows = res.data.data;
          this.loading = false;
          fetchMenuItems();
        });
    },
  },
  components: {
    Layout,
    Vue3Datatable,
    AddMenu,
    AddSubMenu,
  },
  created() {
    this.getMenus();
    this.getRoles();
  },
};
</script>

<style scoped>
.bh-table-responsive table tfoot tr th,
.bh-table-responsive table thead tr th {
  font-weight: 600;
}
.bh-font-normal {
  font-family: var(--bs-body-font-family);
  font-weight: 400;
  font-size: 14px;
}
</style>
