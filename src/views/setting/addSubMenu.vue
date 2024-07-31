<template>
  <div>
    <BModal
      v-model="showModal"
      @hide.prevent
      @ok="simSub"
      @cancel="closeModal"
      @close="closeModal"
      id="modal-center-SubMenu"
      centered
      title="Add Sub Menu"
    >
      <form>
        <div class="form-group">
          <label for="" class="mt-4">Parent</label>
          <select
            name=""
            id=""
            v-model="parent"
            class="form-control"
            @focus="removePlaceholder"
          >
            <option v-if="!parent" disabled value="">
              - Pilih Parent Menu -
            </option>
            <option v-for="m in menus" :key="m.id" :value="m.id">
              {{ m.label }}
            </option>
          </select>
          <label for="" class="mt-4">Label</label>
          <input type="text" class="form-control" v-model="label" />
          <label for="" class="mt-4">Link</label>
          <input type="text" class="form-control" v-model="link" />
        </div>
      </form>
    </BModal>
  </div>
</template>

<script>
import axios from "axios";
import { fetchMenuItems } from "../../components/menu";
export default {
  name: "ModalAddSubMenu",
  props: ["menus", "roles"],
  data() {
    return {
      showModal: false,
      parent: "", // Initialize parent with empty string
      label: "",
      link: "",
    };
  },
  methods: {
    closeModal() {
      this.showModal = !this.showModal;
      this.parent = "";
      this.label = "";
      this.link = "";
    },
    removePlaceholder() {
      // Remove the placeholder option when the select is focused
      this.parent = this.parent || null; // Force reactivity update
    },
    async simSub() {
      if (this.parent === "" || this.label === "" || this.link === "") {
        return this.$toast.error("Tolong lengkapi form terlebih dahulu!");
      }
      await axios
        .post("/api/admin/menus", {
          parent: this.parent,
          label: this.label,
          link: this.link,
        })
        .then(() => {
          this.showModal = false;
          this.$emit("reload");
          this.parent = ""; // Reset parent to default value
          this.$toast.success(`Sub Menu : ${this.label} berhasil ditambahkan!`);
          this.label = "";
          this.link = "";
          fetchMenuItems();
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
