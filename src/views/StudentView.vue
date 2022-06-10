<template>
  <div class="StudentPage">
    <!-- toolbar -->
    <v-card elevation="0" class="mb-5">
      <v-toolbar elevation="0" class="transparent">
        <v-toolbar-title>
          <span class="primary--text text-3">الطلاب</span>
        </v-toolbar-title>

        <v-spacer />

        <v-text-field
          label="ابحث عن طالب"
          dense
          color="primary"
          hide-details
        ></v-text-field>

        <v-btn color="primary" class="mr-5" depressed @click="openDialog">
          <v-icon>add</v-icon>
          <span>اضافة طالب</span>
        </v-btn>
      </v-toolbar>
    </v-card>
    <!-- /toolbar -->

    <v-card elevation="0">
      <v-data-table
        class="transparent elevation-0"
        :headers="headers"
        :items="students"
      >
        <template #[`item.user.userName`]="{ item }">
          <v-chip>{{ item.user.userName }}</v-chip>
        </template>

        <template #[`item.createdAt`]="{ item }">
          <v-chip color="success">{{ item.createdAt | formatDate }}</v-chip>
        </template>

        <template #[`item.updatedAt`]="{ item }">
          <v-chip color="warning" text-color="black">{{
            item.updatedAt | formatDate
          }}</v-chip>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="edit(item)"
            :title="`تعديل ${item.firstName}`"
          >
            edit
          </v-icon>
          <v-icon
            small
            class="mr-2"
            @click="confirmDelete(item)"
            :title="`حذف ${item.firstName}`"
          >
            delete
          </v-icon>

          <v-icon
            small
            class="mr-2"
            @click="showCourses(item)"
            :title="`عرض الكورسات للطالب ${item.firstName}`"
          >
            menu_book
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <createComponent />
    <updateComponent />
    <coursesComponent />
  </div>
</template>

<script>
import { bus } from "../main";
import moment from "moment";
import createComponent from "@/components/students/create.vue";
import updateComponent from "@/components/students/update.vue";
import coursesComponent from "@/components/students/courses.vue";
export default {
  components: {
    createComponent,
    updateComponent,
    coursesComponent,
  },

  filters: {
    formatDate(date) {
      return moment(date).format("DD/MM/YYYY HH:mm a");
    },
  },

  data: () => ({
    students: [],
    headers: [
      { text: "اسم الطالب", align: "right", value: "studentName" },
      { text: "رقم الهاتف", align: "right", value: "phone" },
      { text: "رقم هاتف ولي الامر", align: "right", value: "parentPhone" },
      { text: "الصف", align: "right", value: "grade.gradeName" },
      { text: "بواسطة", align: "right", value: "user.userName" },
      { text: "تاريخ الانشاء", align: "right", value: "createdAt" },
      { text: "تاريخ اخر تعديل", align: "right", value: "updatedAt" },
      { text: "العمليات", value: "actions", sortable: false },
    ],
    lastUpdatedItem: null,
  }),

  methods: {
    async fetch() {
      try {
        const students = await this.axios.get("students");
        this.students = students.data.data;
      } catch (error) {
        console.error(error);
      }
    },

    async deleteStudent(item) {
      try {
        await this.axios.delete(`students/${item.studentId}`);
        this.fetch();
      } catch (error) {
        console.error(error);
      }
    },

    confirmDelete(item) {
      this.$toasted.error("هل تريد حذف الطالب ؟", {
        theme: "outline",
        position: "bottom-center",
        duration: 6000,
        action: [
          {
            text: "حذف الطالب",
            onClick: () => {
              this.deleteStudent(item);
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

    openDialog() {
      bus.$emit("openCreateStudent", true);
    },

    edit(item) {
      bus.$emit("openEditStudent", item);
    },

    showCourses(item) {
      bus.$emit("open-courses", item);
      this.lastUpdatedItem = item;
    },
  },

  created() {
    bus.$on("student-created", () => {
      this.fetch();
    });

    bus.$on("student-course-add", () => {
      this.fetch();
    });

    bus.$on("student-course-delete", () => {
      // this.showCourses(this.lastUpdatedItem);
      this.fetch();
    });

    this.fetch();
  },
};
</script>

<style lang="scss">
</style>