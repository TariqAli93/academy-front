<template>
  <div class="TeachersPage">
    <v-dialog
      v-model="newTeacherDialog"
      persistent
      max-width="500px"
      transition="slide-y-transition"
    >
      <v-card elevation="0">
        <v-toolbar elevation="0" class="transparent border-bottom">
          <v-toolbar-title>اضافة استاذ</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.stop="newTeacherDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-divider />

        <v-card-text class="mt-5">
          <v-form
            ref="createRef"
            v-model="createForm"
            lazy-validation
            @submit.prevent="createTeacher"
          >
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="teacherName"
                  label="اسم الاستاذ"
                  required
                  outlined
                  dense
                  :rules="[(v) => !!v || 'الرجاء إدخال اسم الاستاذ']"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-btn
              block
              large
              color="primary"
              depressed
              :disabled="!createForm"
              type="submit"
            >
              اضافة الاستاذ
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="updateTeacherDialog"
      persistent
      max-width="500px"
      transition="slide-y-transition"
    >
      <v-card elevation="0">
        <v-toolbar elevation="0" class="transparent border-bottom">
          <v-toolbar-title>تحديث الاستاذ</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.stop="updateTeacherDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-divider />

        <v-card-text class="mt-5">
          <v-form
            ref="updateRef"
            v-model="updateForm"
            lazy-validation
            @submit.prevent="updateTeacher"
          >
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="teacherName"
                  label="اسم الاستاذ"
                  required
                  outlined
                  dense
                  :rules="[(v) => !!v || 'الرجاء إدخال اسم الاستاذ']"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-btn
              block
              large
              color="primary"
              depressed
              :disabled="!updateForm"
              type="submit"
            >
              تحديث الاستاذ
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-card elevation="0" class="mb-5">
      <v-toolbar elevation="0" class="transparent">
        <v-toolbar-title>
          <span class="primary--text text-3">الاساتذة</span>
        </v-toolbar-title>

        <v-spacer />

        <v-text-field
          outlined
          v-model="search"
          label="ابحث عن استاذ"
          dense
          color="primary"
          hide-details
        ></v-text-field>

        <v-btn
          color="primary"
          class="mr-5"
          depressed
          @click="newTeacherDialog = true"
        >
          <v-icon>add</v-icon>
          <span>اضافة استاذ</span>
        </v-btn>
      </v-toolbar>
    </v-card>

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
            @click="editTeacher(item)"
            :title="`تعديل ${item.teacherName}`"
          >
            edit
          </v-icon>
          <v-icon
            small
            class="mr-2"
            @click="confirmDeleteTeacher(item)"
            :title="`حذف ${item.teacherName}`"
          >
            delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "TeachersPage",
  data() {
    return {
      search: "",
      newTeacherDialog: false,
      updateTeacherDialog: false,
      createForm: false,
      teacherName: "",
      teacherId: "",
      updateForm: false,
      headers: [
        {
          text: "#",
          value: "teacherId",
          sortable: false,
          align: "start",
        },

        {
          text: "اسم الاستاذ",
          value: "teacherName",
          sortable: false,
          align: "start",
        },

        {
          text: "تاريخ انشاء الحساب",
          value: "createdAt",
          sortable: false,
          align: "start",
        },

        {
          text: "الاجرائات",
          value: "actions",
          sortable: false,
          align: "start",
        },
      ],
      items: [],
    };
  },

  methods: {
    async GetTeachers() {
      try {
        const teachers = await this.axios.get("teachers");
        this.items = teachers.data;
      } catch (error) {
        console.log(error);
      }
    },

    async createTeacher() {
      try {
        if (this.$refs.createRef.validate()) {
          const teacher = await this.axios.post("teachers", {
            teacherName: this.teacherName,
          });
          this.items.push(teacher.data);
          this.teacherName = "";
          this.newTeacherDialog = false;
        }
      } catch (error) {
        console.log(error);
      }
    },

    confirmDeleteTeacher(item) {
      this.$toasted.error("هل تريد حذف الاستاذ ؟", {
        theme: "outline",
        position: "bottom-center",
        duration: 6000,
        action: [
          {
            text: "حذف الاستاذ",
            onClick: () => {
              this.deleteTeacher(item.teacherId);
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

    editTeacher(item) {
      this.updateTeacherDialog = true;
      this.teacherName = item.teacherName;
      this.teacherId = item.teacherId;
    },

    async updateTeacher() {
      try {
        if (this.$refs.updateRef.validate()) {
          const teacher = await this.axios.put(`teachers/${this.teacherId}`, {
            teacherName: this.teacherName,
          });

          this.teacherName = "";
          this.teacherId = "";
          this.updateTeacherDialog = false;
          console.log(teacher);
          this.GetTeachers();
        }
      } catch (error) {
        console.log(error);
      }
    },

    async deleteTeacher(id) {
      try {
        const teacher = await this.axios.delete(`teachers/${id}`);
        console.log(teacher);
        this.GetTeachers();
      } catch (error) {
        console.log(error);
      }
    },
  },

  mounted() {
    this.GetTeachers();
  },
};
</script>

<style lang="scss">
.border-bottom {
  border-color: rgba(black, 0.12) !important;
  border-bottom: 1px solid rgba(black, 0.12) !important;
}
</style>