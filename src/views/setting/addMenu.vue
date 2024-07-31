<template>
  <div>
    <BModal
      v-model="showModal"
      @hide.prevent
      @ok="simMenu"
      @cancel="closeModal"
      @close="closeModal"
      id="modal-center-menu"
      centered
      title="Add Menu or Title"
    >
      <form>
        <div class="form-group">
          <label for="">Label</label>
          <input type="text" class="form-control" v-model="label" />
        </div>
        <div class="form-group">
          <label for="">Sebagai Title?</label>
          <select
            name=""
            id=""
            class="form-control"
            v-model="isTitle"
            @focus="removeIsTitlePlaceholder"
          >
            <option :value="null" disabled>- Pilih Title Option -</option>
            <option :value="false">Tidak, jadikan parent menu</option>
            <option :value="true">Ya, jadikan title menu</option>
          </select>
        </div>
        <div class="form-group" v-if="!isTitle">
          <label for="">Icon</label>
          <input type="text" class="form-control" v-model="icon" />
        </div>
        <div class="form-group">
          <label for="">Role</label>
          <select
            name=""
            id=""
            class="form-control"
            v-model="role"
            @focus="removeRolePlaceholder"
          >
            <option v-if="!role" disabled value="">- Pilih Role -</option>
            <option v-for="r in roles" :key="r.id" :value="r.role">
              {{ r.role }}
            </option>
          </select>
        </div>
      </form>
    </BModal>
  </div>
</template>

<script>
import axios from "axios";
import { fetchMenuItems } from "../../components/menu";

export default {
  name: "ModalAddMenu",
  props: ["roles"],
  data() {
    return {
      showModal: false,
      label: "",
      isTitle: null, // Initialize isTitle with null for placeholder
      icon: "",
      role: "", // Initialize role with empty string for placeholder
    };
  },
  watch: {
    isTitle(newVal) {
      if (newVal === true) {
        // If isTitle is true
        this.icon = "bx";
      }
    },
  },
  methods: {
    closeModal() {
      this.showModal = !this.showModal;
      this.label = "";
      this.isTitle = null; // Reset to null for placeholder
      this.role = ""; // Reset to empty string for placeholder
      this.icon = "bx";
    },
    removeIsTitlePlaceholder() {
      // Remove the placeholder option when the select is focused
      if (this.isTitle === null) {
        this.isTitle = false;
      }
    },
    removeRolePlaceholder() {
      // Remove the placeholder option when the select is focused
      this.role = this.role || null; // Force reactivity update
    },
    async simMenu() {
      if (this.isTitle === null) {
        return this.$toast.error("Title Option tidak boleh kosong!");
      } else if (this.role === null || this.role === "") {
        return this.$toast.error("Role Menu tidak boleh kosong!");
      } else if (this.label === "") {
        return this.$toast.error("Label tidak boleh kosong!");
      }
      await axios
        .post("/api/admin/menus", {
          label: this.label,
          isTitle: this.isTitle,
          role: this.role,
          icon: this.isTitle ? "bx" : this.icon,
        })
        .then(() => {
          this.showModal = false;
          this.$emit("reload");
          this.$toast.success(
            `${this.isTitle === false ? "Parent Menu" : "Title"} : ${
              this.label
            } berhasil ditambahkan!`
          );
          this.label = "";
          this.isTitle = null;
          this.role = "";
          this.icon = "";
          fetchMenuItems();
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
