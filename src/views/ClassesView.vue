<template>
  <div class="ClaasesPage">
    <!-- add new class dialog -->
    <v-dialog
      v-model="newClassesDialog"
      persistent
      max-width="500px"
      transition="slide-y-transition"
    >
      <v-card elevation="0">
        <v-toolbar elevation="0" class="transparent border-bottom">
          <v-toolbar-title>اضافة صف جديد</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.stop="newClassesDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-divider />

        <v-card-text class="mt-5">
          <v-form
            ref="newClassesRef"
            v-model="newClassesForm"
            lazy-validation
            @submit.prevent="newClasses"
          >
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="className"
                  label="اسم الصف"
                  required
                  outlined
                  dense
                  :rules="[(v) => !!v || 'الرجاء إدخال اسم الصف']"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-btn
              block
              large
              color="primary"
              depressed
              :disabled="!newClassesForm"
              type="submit"
            >
              اضافة صف جديد
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- /add new class dialog -->

    <v-dialog
      v-model="updateClassesDialog"
      persistent
      max-width="500px"
      transition="slide-y-transition"
    >
      <v-card elevation="0">
        <v-toolbar elevation="0" class="transparent border-bottom">
          <v-toolbar-title>اضافة صف جديد</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.stop="updateClassesDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-divider />

        <v-card-text class="mt-5">
          <v-form
            ref="updateClassesRef"
            v-model="updateClassesForm"
            lazy-validation
            @submit.prevent="updateClass"
          >
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="className"
                  label="اسم الصف"
                  required
                  outlined
                  dense
                  :rules="[(v) => !!v || 'الرجاء إدخال اسم الصف']"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-btn
              block
              large
              color="primary"
              depressed
              :disabled="!updateClassesForm"
              type="submit"
            >
              تحديث الصف
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- toolbar -->
    <v-card elevation="0" class="mb-5">
      <v-toolbar elevation="0" class="transparent">
        <v-toolbar-title>
          <span class="primary--text text-3">الصفوف</span>
        </v-toolbar-title>

        <v-spacer />

        <v-text-field
          outlined
          v-model="search"
          label="ابحث عن صف"
          dense
          color="primary"
          hide-details
        ></v-text-field>

        <v-btn
          color="primary"
          class="mr-5"
          depressed
          @click="newClassesDialog = true"
        >
          <v-icon>add</v-icon>
          <span>اضافة صف</span>
        </v-btn>
      </v-toolbar>
    </v-card>
    <!-- /toolbar -->

    <!-- students list -->
    <v-card elevation="0">
      <v-data-table
        :items="items"
        :headers="headers"
        :search="search"
        class="transparent elevation-0"
      >
        <template #[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="edit(item)"
            :title="`تعديل ${item.className}`"
          >
            edit
          </v-icon>
          <v-icon
            small
            class="mr-2"
            @click="confirmDelete(item)"
            :title="`حذف ${item.className}`"
          >
            delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
    <!-- /students list -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: "#",
          align: "start",
          sortable: false,
          value: "classId",
        },
        {
          text: "الصف",
          align: "start",
          sortable: false,
          value: "className",
        },
        {
          text: "تاريخ انشاء الصف",
          align: "start",
          sortable: false,
          value: "createdAt",
        },
        {
          text: "الاجراءات",
          align: "start",
          sortable: false,
          value: "actions",
        },
      ],
      items: [],
      search: "",
      newClassesDialog: false,
      updateClassesDialog: false,
      newClassesForm: false,
      updateClassesForm: false,
      className: "",
      classId: "",
    };
  },

  mounted() {
    this.GetClasses();
  },

  methods: {
    async GetClasses() {
      try {
        const response = await this.axios.get("classes");
        this.items = response.data;
      } catch (error) {
        console.log(error);
      }
    },

    async newClasses() {
      try {
        if (this.$refs.newClassesRef.validate()) {
          const response = await this.axios.post("classes", {
            className: this.className,
          });
          this.items.push(response.data);
          this.newClassesDialog = false;
          this.className = "";
        }
      } catch (error) {
        console.log(error);
      }
    },

    confirmDelete(item) {
      this.$toasted.error("هل تريد حذف الصف ؟", {
        theme: "outline",
        position: "bottom-center",
        duration: 6000,
        action: [
          {
            text: "حذف الصف",
            onClick: () => {
              this.deleteClass(item);
              this.$toasted.clear();
            },
          },
          {
            text: "الغاء الامر",
            onClick: () => {
              this.$toasted.clear();
            },
          },
        ],
      });
    },

    async deleteClass(item) {
      try {
        const response = await this.axios.delete(`classes/${item.classId}`);
        this.GetClasses();
      } catch (error) {
        console.log(error);
      }
    },

    edit(item) {
      this.updateClassesDialog = true;
      this.className = item.className;
      this.classId = item.classId;
    },

    async updateClass() {
      try {
        if (this.$refs.updateClassesRef.validate()) {
          const response = await this.axios.put(`classes/${this.classId}`, {
            className: this.className,
          });
          this.GetClasses();
          this.updateClassesDialog = false;
          this.className = "";
          this.classId = "";
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style>
</style>