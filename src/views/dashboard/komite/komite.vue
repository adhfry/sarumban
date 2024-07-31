<template>
  <Layout>
    <PageHeader title="Komite" pageTitle="Dashboards" />
    <!-- <Loader v-show="loading"></Loader> -->
    <BRow>
      <BCol lg="6">
        <BCard no-body>
          <BCardBody id="formku">
            <BCardTitle class="mb-4">Pengaturan Komite</BCardTitle>
            <BForm>
              <BFormGroup
                class="mb-3"
                label="Biaya"
                label-for="formrow-firstname-input"
              >
                <BFormInput
                  id="formrow-firstname-input"
                  type="number"
                  v-model="form.price"
                  placeholder="Enter Your Price"
                ></BFormInput>
              </BFormGroup>
              <div>
                <BButton
                  type="submit"
                  @click="simpan"
                  variant="primary"
                  class="btn btn-sm"
                  >Submit</BButton
                >
              </div>
            </BForm>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol lg="6">
        <BCard no-body>
          <BCardBody>
            <BCardTitle class="mb-4">Result</BCardTitle>
            <BTableSimple responsive>
              <BThead>
                <BTr>
                  <BTh>No</BTh>
                  <BTh>Biaya</BTh>
                  <BTh>Action</BTh>
                </BTr>
              </BThead>
              <BTbody>
                <BTr v-for="(price, index) in prices" :key="price">
                  <BTh>{{ index + 1 }}</BTh>
                  <BTd>{{ formatPrice(price.price) }}</BTd>
                  <BTd>
                    <BButton
                      class="btn btn-sm btn-success mx-2"
                      @click="editPrice(price.price, price.id)"
                    >
                      <i class="mdi mdi-pencil"></i>
                    </BButton>
                    <BButton
                      class="btn btn-sm btn-danger"
                      @click="removePrice(price.id)"
                    >
                      <i class="mdi mdi-trash-can"></i>
                    </BButton>
                  </BTd>
                </BTr>
              </BTbody>
            </BTableSimple>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol lg="12">
        <input-custom :price="prices" />
      </BCol>
      <BCol lg="12">
        <table-komite />
      </BCol>
      <BModal v-model="showModal" hide-footer centered header-class="border-0">
        <div class="text-center mb-4">
          <div class="avatar-md mx-auto mb-4">
            <div class="avatar-title bg-light rounded-circle text-primary h1">
              <i class="mdi mdi-tooltip-edit"></i>
            </div>
          </div>
          <BRow class="justify-content-center">
            <BCol xl="10">
              <h4 class="text-primary">Edit !</h4>
              <BFormGroup
                class="mb-3"
                label="Biaya"
                label-for="formrow-firstname-input"
              >
                <BFormInput
                  id="formrow-firstname-input"
                  type="number"
                  v-model="form.price"
                  placeholder="Enter Your Price"
                ></BFormInput>
                <BButton class="mt-2 btn btn-sm btn-info" @click="update"
                  >Update</BButton
                >
              </BFormGroup>
            </BCol>
          </BRow>
        </div>
      </BModal>
    </BRow>
  </Layout>
</template>

<script>
import Layout from "../../../layouts/main.vue";
import PageHeader from "../../../components/page-header.vue";
import axios from "../../../services/api";
import { BModal } from "bootstrap-vue-next";
// import Loader from "../../../components/widgets/loader.vue";
import inputCustom from "./input.vue";
import tableKomite from "./tableKomite.vue";

export default {
  components: {
    BModal,
    Layout,
    PageHeader,
    // Loader,
    inputCustom,
    tableKomite,
  },
  data() {
    return {
      form: {
        price: "",
        id: "",
      },
      prices: [],
      showModal: false,
      loading: false,
      value: null,
      options: ["list", "of", "options"],
    };
  },
  methods: {
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    async simpan() {
      this.loading = true;
      try {
        const response = await axios.post("/api/admin/komite", {
          price: this.form.price,
        });
        console.log(response);
        this.form.price = "";
        this.getPrice();
        this.loading = false;
      } catch (error) {
        console.error("Error saving price:", error);
        this.loading = false;
      }
    },
    async getPrice() {
      try {
        const res = await axios.get("/api/admin/getPrice");
        this.prices = res.data;
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    },
    editPrice(price, id) {
      this.showModal = true;
      this.form.price = price;
      this.form.id = id;
    },
    async update() {
      this.loading = true;
      try {
        const response = await axios.put("/api/admin/update", {
          id: this.form.id,
          price: this.form.price,
        });
        console.log(response);
        this.getPrice();
        this.showModal = false;
        this.form.price = "";
        this.form.id = "";
        this.loading = false;
      } catch (error) {
        console.error("Error updating price:", error);
        this.loading = false;
      }
    },
    async removePrice(id) {
      this.loading = true;
      try {
        const response = await axios.delete("/api/admin/delPrice/" + id);
        console.log(response);
        this.getPrice();
        this.loading = false;
      } catch (error) {
        console.error("Error removing price:", error);
        this.loading = false;
      }
    },
    myChangeEvent(val) {
      console.log(val);
    },
    mySelectEvent({ id, text }) {
      console.log({ id, text });
    },
  },
  created() {
    this.getPrice();
  },
};
</script>
