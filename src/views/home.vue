<script>
import Layout from "../layouts/main.vue";
// import Profile from "../components/widgets/profile.vue";
// import Earning from "../components/widgets/earning.vue";
import Stat from "../components/widgets/stat.vue";
// import Transaction from "../components/widgets/transaction.vue";
// import Emailsent from "../components/widgets/emailsent.vue";
// import TableQ from "../components/widgets/tableQ.vue";
// import Buttons from "./ui/buttons.vue";
// import this.$axios from "../services/api";
/**
 * Dashboard Component
 */
export default {
  components: {
    // Buttons,
    Layout,
    // Profile,
    Stat,
    // Transaction,
    // Earning,
    // Emailsent,
    // TableQ,
  },
  data() {
    return {
      title: "Dashboard",
      loading: false,
      showModal: false,
      kelass: [],
      siswas: [],
      gurus: [],
      statData: [
        {
          title: "Kelas",
          value: "30",
        },
        {
          icon: "bx bx-archive-in",
          title: "Revenue",
          value: "$35, 723",
        },
        {
          icon: "bx bx-purchase-tag-alt",
          title: "Average Price",
          value: "$16.2",
        },
      ],
      transactions: [
        {
          id: "#SK2540",
          name: "Neal Matthews",
          date: "07 Oct, 2019",
          total: "$400",
          status: "Paid",
          payment: ["fa-cc-mastercard", "Mastercard"],
          index: 1,
        },
        {
          id: "#SK2541",
          name: "Jamal Burnett",
          date: "07 Oct, 2019",
          total: "$380",
          status: "Chargeback",
          payment: ["fa-cc-visa", "Visa"],
          index: 2,
        },
        {
          id: "#SK2542",
          name: "Juan Mitchell",
          date: "06 Oct, 2019",
          total: "$384",
          status: "Paid",
          payment: ["fab fa-cc-paypal", "Paypal"],
          index: 3,
        },
        {
          id: "#SK2543",
          name: "Barry Dick",
          date: "05 Oct, 2019",
          total: "$412",
          status: "Paid",
          payment: ["fa-cc-mastercard", "Mastercard"],
          index: 4,
        },
        {
          id: "#SK2544",
          name: "Ronald Taylor",
          date: "04 Oct, 2019",
          total: "$404",
          status: "Refund",
          payment: ["fa-cc-visa", "Visa"],
          index: 5,
        },
        {
          id: "#SK2545",
          name: "Jacob Hunter",
          date: "04 Oct, 2019",
          total: "$392",
          status: "Paid",
          payment: ["fab fa-cc-paypal", "Paypal"],
          index: 6,
        },
      ],
      ip: "",
      npsn: "",
      token: "",
      tokens: {},
    };
  },
  props: {
    updating: {
      type: Boolean,
    },
  },
  methods: {
    async simpan() {
      if (
        this.ip === "" ||
        this.npsn === 0 ||
        this.token === "" ||
        this.npsn === ""
      ) {
        alert("Data Harus Diisi Semua");
        return;
      }
      await this.$axios
        .post("/api/admin/dapo/sim", {
          ip: this.ip,
          npsn: this.npsn,
          token: this.token,
        })
        .then(() => {
          this.getDataToken();
        });
    },
    async getDataToken() {
      await this.$axios.get("/api/admin/dapo/getDataToken").then((res) => {
        this.tokens = res.data;
        this.ip = "";
        this.npsn = "";
        this.token = "";
      });
    },
    async delToken(id) {
      await this.$axios.delete("/api/admin/dapo/delToken/" + id).then(() => {
        this.getDataToken();
      });
    },
    async singkron() {
      await this.$axios.get("/api/admin/dapo/getData").then(() => {
        alert("sukses");
      });
    },
    async getKelas() {
      await this.$axios.get("/api/admin/dapo/getDatas").then((res) => {
        this.kelass = res.data.kelas;
        this.siswas = res.data.siswas;
        this.gurus = res.data.gurus;
      });
    },
  },
  mounted() {
    setTimeout(() => {
      this.showModal = false;
    }, 1500);
    this.getDataToken();
    this.getKelas();
  },
};
</script>

<template>
  <Layout>
    <BRow>
      <BCol cols="12" class="container">
        <div
          class="page-title-box d-flex align-items-center justify-content-between"
        >
          <h4 class="mb-0 font-size-18">Dashboard</h4>
        </div>
      </BCol>
    </BRow>

    <BRow>
      <BCol xl="4">
        <!--        <Profile :updating="fetchingStats" />-->
        <!--        <Earning :updating="earningStatus" />-->
      </BCol>
      <BCol xl="12">
        <BRow>
          <BCol md="3">
            <Stat icon="asdf" title="Kelas" :value="kelass.length" />
          </BCol>
          <BCol md="3">
            <Stat icon="asdf" title="Siswa" :value="siswas.length" />
          </BCol>
          <BCol md="3">
            <Stat icon="asdf" title="Guru" :value="gurus.length" />
          </BCol>
          <BCol md="3">
            <Stat icon="asdf" title="Guru" :value="gurus.length" />
          </BCol>
        </BRow>
        <button class="btn btn-success my-3" v-if="tokens.ip" @click="singkron">
          <i class="fa fa-radiation"></i> Singkron Dapodik
        </button>
        <div class="col-12">
          <div class="row">
            <div class="col-md card">
              <div class="card-header">
                <div class="card-title">Setting Dapodik</div>
              </div>
              <div class="card-body">
                <form @submit.prevent="simpan">
                  <div class="form-group mb-2">
                    <label for="">Input IP</label>
                    <input type="text" class="form-control" v-model="ip" />
                  </div>
                  <div class="form-group mb-2">
                    <label for="">NPSN</label>
                    <input type="text" class="form-control" v-model="npsn" />
                  </div>
                  <div class="form-group mb-2">
                    <label for="">Token</label>
                    <input type="text" class="form-control" v-model="token" />
                  </div>
                  <button class="btn btn-sm btn-dark mt-3">Simpan</button>
                </form>
              </div>
            </div>
            <div class="col-md card">
              <div class="card-header">
                <div class="card-title">Hasil dapodik</div>
              </div>
              <div class="card-body">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th>Ip</th>
                      <th>NPSN</th>
                      <th>token</th>
                      <th>#</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="tokens.ip">
                      <td>{{ tokens.ip }}</td>
                      <td>{{ tokens.npsn }}</td>
                      <td>{{ tokens.token }}</td>
                      <td>
                        <button
                          class="btn btn-sm btn-danger"
                          @click="delToken(tokens.id)"
                        >
                          <i class="fa fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <!--          <div class="card p-4">-->
        <!--            <TableQ/>-->
        <!--          </div>-->
        <!-- <Transaction :transactions="transactions" :updating="fetchingStats"/> -->
        <!-- <Emailsent :updating="fetchingStats" /> -->
      </BCol>
    </BRow>

    <!--    <BRow>-->
    <!--      <BCol xl="4">-->
    <!--          <BCard no-body>-->
    <!--            <BCardBody>-->
    <!--              <BCardTitle class="mb-4">Social Source</BCardTitle>-->
    <!--              <div class="text-center">-->
    <!--                <div class="avatar-sm mx-auto mb-4">-->
    <!--                  <span class="avatar-title rounded-circle bg-primary-subtle font-size-24">-->
    <!--                    <i class="mdi mdi-facebook text-primary"></i>-->
    <!--                  </span>-->
    <!--                </div>-->
    <!--                <p class="font-16 text-muted mb-2"></p>-->
    <!--                <h5>-->
    <!--                  <BLink href="javascript: void(0);" class="text-dark">-->
    <!--                    Facebook - -->
    <!--                    <span class="text-muted font-16">125 sales</span>-->
    <!--                  </BLink>-->
    <!--                </h5>-->
    <!--                <p class="text-muted">Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis-->
    <!--                  faucibus tincidunt.</p>-->
    <!--                <BLink href="javascript: void(0);" class="text-primary font-16">-->
    <!--                  Learn more-->
    <!--                  <i class="mdi mdi-chevron-right"></i>-->
    <!--                </BLink>-->
    <!--              </div>-->
    <!--              <BRow class="mt-4">-->
    <!--                <BCol sm="4">-->
    <!--                  <div class="social-source text-center mt-3">-->
    <!--                    <div class="avatar-xs mx-auto mb-3">-->
    <!--                      <span class="avatar-title rounded-circle bg-primary font-size-16">-->
    <!--                        <i class="mdi mdi-facebook text-white"></i>-->
    <!--                      </span>-->
    <!--                    </div>-->
    <!--                    <h5 class="font-size-15">Facebook</h5>-->
    <!--                    <p class="text-muted mb-0">125 sales</p>-->
    <!--                  </div>-->
    <!--                </BCol>-->
    <!--                <BCol sm="4">-->
    <!--                  <div class="social-source text-center mt-3">-->
    <!--                    <div class="avatar-xs mx-auto mb-3">-->
    <!--                      <span class="avatar-title rounded-circle bg-info font-size-16">-->
    <!--                        <i class="mdi mdi-twitter text-white"></i>-->
    <!--                      </span>-->
    <!--                    </div>-->
    <!--                    <h5 class="font-size-15">Twitter</h5>-->
    <!--                    <p class="text-muted mb-0">112 sales</p>-->
    <!--                  </div>-->
    <!--                </BCol>-->
    <!--                <BCol sm="4">-->
    <!--                  <div class="social-source text-center mt-3">-->
    <!--                    <div class="avatar-xs mx-auto mb-3">-->
    <!--                      <span class="avatar-title rounded-circle bg-pink font-size-16">-->
    <!--                        <i class="mdi mdi-instagram text-white"></i>-->
    <!--                      </span>-->
    <!--                    </div>-->
    <!--                    <h5 class="font-size-15">Instagram</h5>-->
    <!--                    <p class="text-muted mb-0">104 sales</p>-->
    <!--                  </div>-->
    <!--                </BCol>-->
    <!--              </BRow>-->
    <!--            </BCardBody>-->
    <!--          </BCard>-->
    <!--      </BCol>-->
    <!--      <BCol xl="4">-->
    <!--          <BCard no-body>-->
    <!--            <BCardBody>-->
    <!--              <BCardTitle class="mb-5">Activity</BCardTitle>-->
    <!--              <ul class="verti-timeline list-unstyled">-->
    <!--                <li class="event-list">-->
    <!--                  <div class="event-timeline-dot">-->
    <!--                    <i class="bx bx-right-arrow-circle font-size-18"></i>-->
    <!--                  </div>-->
    <!--                  <div class="d-flex">-->
    <!--                    <div class="me-3">-->
    <!--                      <h5 class="font-size-14">-->
    <!--                        22 Nov-->
    <!--                        <i class="bx bx-right-arrow-alt font-size-16 text-primary align-middle ms-2"></i>-->
    <!--                      </h5>-->
    <!--                    </div>-->
    <!--                    <div class="flex-grow-1">-->
    <!--                      <div>Responded to need “Volunteer Activities</div>-->
    <!--                    </div>-->
    <!--                  </div>-->
    <!--                </li>-->
    <!--                <li class="event-list">-->
    <!--                  <div class="event-timeline-dot">-->
    <!--                    <i class="bx bx-right-arrow-circle font-size-18"></i>-->
    <!--                  </div>-->
    <!--                  <div class="d-flex">-->
    <!--                    <div class="me-3">-->
    <!--                      <h5 class="font-size-14">-->
    <!--                        17 Nov-->
    <!--                        <i class="bx bx-right-arrow-alt font-size-16 text-primary align-middle ms-2"></i>-->
    <!--                      </h5>-->
    <!--                    </div>-->
    <!--                    <div class="flex-grow-1">-->
    <!--                      <div>-->
    <!--                        Everyone realizes why a new common language would be desirable...-->
    <!--                        <BLink href="javascript: void(0);">Read more</BLink>-->
    <!--                      </div>-->
    <!--                    </div>-->
    <!--                  </div>-->
    <!--                </li>-->
    <!--                <li class="event-list active">-->
    <!--                  <div class="event-timeline-dot">-->
    <!--                    <i class="bx bxs-right-arrow-circle font-size-18 bx-fade-right"></i>-->
    <!--                  </div>-->
    <!--                  <div class="d-flex">-->
    <!--                    <div class="me-3">-->
    <!--                      <h5 class="font-size-14">-->
    <!--                        15 Nov-->
    <!--                        <i class="bx bx-right-arrow-alt font-size-16 text-primary align-middle ms-2"></i>-->
    <!--                      </h5>-->
    <!--                    </div>-->
    <!--                    <div class="flex-grow-1">-->
    <!--                      <div>Joined the group “Boardsmanship Forum”</div>-->
    <!--                    </div>-->
    <!--                  </div>-->
    <!--                </li>-->
    <!--                <li class="event-list">-->
    <!--                  <div class="event-timeline-dot">-->
    <!--                    <i class="bx bx-right-arrow-circle font-size-18"></i>-->
    <!--                  </div>-->
    <!--                  <div class="d-flex">-->
    <!--                    <div class="me-3">-->
    <!--                      <h5 class="font-size-14">-->
    <!--                        12 Nov-->
    <!--                        <i class="bx bx-right-arrow-alt font-size-16 text-primary align-middle ms-2"></i>-->
    <!--                      </h5>-->
    <!--                    </div>-->
    <!--                    <div class="flex-grow-1">-->
    <!--                      <div>Responded to need “In-Kind Opportunity”</div>-->
    <!--                    </div>-->
    <!--                  </div>-->
    <!--                </li>-->
    <!--              </ul>-->
    <!--              <div class="text-center mt-4">-->
    <!--                <BLink href="javascript: void(0);" class="btn btn-primary btn-sm">View More <i-->
    <!--                    class="mdi mdi-arrow-right ms-1"></i></BLink>-->
    <!--              </div>-->
    <!--            </BCardBody>-->
    <!--          </BCard>-->
    <!--      </BCol>-->
    <!--      <BCol xl="4">-->
    <!--          <BCard no-body>-->
    <!--            <BCardBody>-->
    <!--              <BCardTitle class="mb-4">Top Cities Selling Product</BCardTitle>-->

    <!--              <div class="text-center">-->
    <!--                <div class="mb-4">-->
    <!--                  <i class="bx bx-map-pin text-primary display-4"></i>-->
    <!--                </div>-->
    <!--                <h3>1,456</h3>-->
    <!--                <p>San Francisco</p>-->
    <!--              </div>-->

    <!--              <div class="table-responsive mt-4">-->
    <!--                <BTableSimple class="table-centered">-->
    <!--                  <BTbody>-->
    <!--                    <BTr>-->
    <!--                      <BTd style="width: 140px">-->
    <!--                        <p class="mb-0">San Francisco</p>-->
    <!--                      </BTd>-->
    <!--                      <BTd style="width: 120px">-->
    <!--                        <h5 class="mb-0">1,456</h5>-->
    <!--                      </BTd>-->
    <!--                      <BTd>-->
    <!--                        <BProgress :value="94" variant="primary" height="5px"></BProgress>-->
    <!--                      </BTd>-->
    <!--                    </BTr>-->
    <!--                    <BTr>-->
    <!--                      <BTd>-->
    <!--                        <p class="mb-0">Los Angeles</p>-->
    <!--                      </BTd>-->
    <!--                      <BTd>-->
    <!--                        <h5 class="mb-0">1,123</h5>-->
    <!--                      </BTd>-->
    <!--                      <BTd>-->
    <!--                        <BProgress :value="82" variant="success" height="5px"></BProgress>-->
    <!--                      </BTd>-->
    <!--                    </BTr>-->
    <!--                    <BTr>-->
    <!--                      <BTd>-->
    <!--                        <p class="mb-0">San Diego</p>-->
    <!--                      </BTd>-->
    <!--                      <BTd>-->
    <!--                        <h5 class="mb-0">1,026</h5>-->
    <!--                      </BTd>-->
    <!--                      <BTd>-->
    <!--                        <BProgress :value="70" variant="warning" height="5px"></BProgress>-->
    <!--                      </BTd>-->
    <!--                    </BTr>-->
    <!--                  </BTbody>-->
    <!--                </BTableSimple>-->
    <!--              </div>-->
    <!--            </BCardBody>-->
    <!--          </BCard>-->
    <!--      </BCol>-->
    <!--    </BRow>-->

    <!--    <BRow>-->
    <!--      <BCol lg="12">-->
    <!--        <BCard no-body>-->
    <!--          <BCardBody>-->
    <!--            <BCardTitle class="mb-4">Latest Transaction</BCardTitle>-->
    <!--            <Transaction :transactions="transactions" :updating="fetchingStats"/>-->
    <!--          </BCardBody>-->
    <!--        </BCard>-->
    <!--      </BCol>-->
    <!--    </BRow>-->

    <!--    <BModal v-model="showModal" hide-footer centered header-class="border-0">-->
    <!--      <div class="text-center mb-4">-->
    <!--        <div class="avatar-md mx-auto mb-4">-->
    <!--          <div class="avatar-title bg-light rounded-circle text-primary h1">-->
    <!--            <i class="mdi mdi-email-open"></i>-->
    <!--          </div>-->
    <!--        </div>-->

    <!--        <BRow class="justify-content-center">-->
    <!--          <BCol xl="10">-->
    <!--            <h4 class="text-primary">Subscribe !</h4>-->
    <!--            <p class="text-muted font-size-14 mb-4">-->
    <!--              Subscribe our newletter and get notification to stay update.-->
    <!--            </p>-->

    <!--            <div class="input-group bg-light rounded">-->
    <!--              <input type="email" class="form-control bg-transparent border-0" placeholder="Enter Email address"-->
    <!--                aria-label="Recipient's username" aria-describedby="button-addon2" />-->

    <!--              <BButton variant="primary" type="button" id="button-addon2">-->
    <!--                <i class="bx bxs-paper-plane"></i>-->
    <!--              </BButton>-->
    <!--            </div>-->
    <!--          </BCol>-->
    <!--        </BRow>-->
    <!--      </div>-->
    <!--    </BModal>-->
  </Layout>
</template>
