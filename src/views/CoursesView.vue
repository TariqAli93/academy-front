<template>
  <div class="CoursesPage">
    <!-- toolbar -->
    <v-card elevation="0" class="mb-5">
      <v-toolbar elevation="0" class="transparent">
        <v-toolbar-title>
          <span class="primary--text text-3">الكورسات</span>
        </v-toolbar-title>

        <v-spacer />

        <v-text-field
          label="ابحث عن كورس"
          dense
          color="primary"
          hide-details
          v-model="search"
        ></v-text-field>

        <v-btn color="primary" class="mr-5" depressed @click="openCreate">
          <v-icon>add</v-icon>
          <span>اضافة كورس</span>
        </v-btn>
      </v-toolbar>
    </v-card>
    <!-- /toolbar -->

    <v-card elevation="0">
      <v-data-table
        class="transparent elevation-0"
        :headers="headers"
        :items="courses"
        :search="search"
      >
        <template #[`item.endAt`]="{ item }">
          <v-chip
            :color="checkDate(item.endAt) ? 'warning' : 'primary'"
            :text-color="checkDate(item.endAt) ? 'black' : 'white'"
            >{{ item.endAt | formatDate }}</v-chip
          >
        </template>

        <template #[`item.startAt`]="{ item }">
          <v-chip color="secondary" text-color="white">{{
            item.startAt | formatDate
          }}</v-chip>
        </template>

        <template #[`item.createdAt`]="{ item }">
          <v-chip color="success" text-color="white">{{
            item.createdAt | formatDate
          }}</v-chip>
        </template>

        <template #[`item.updatedAt`]="{ item }">
          <v-chip color="error" text-color="white">{{
            item.updatedAt | formatDate
          }}</v-chip>
        </template>

        <template #[`item.subject`]="{ item }">
          <v-chip>{{ item.SubjectCourse | subjectName }}</v-chip>
        </template>

        <template #[`item.user.userName`]="{ item }">
          <v-chip text-color="black">{{ item.user.userName }}</v-chip>
        </template>

        <template #[`item.coursePrice`]="{ item }">
          {{ item.coursePrice | currency }}
        </template>

        <template #[`item.percentage`]="{ item }">
          {{ item.percentage | percent }}
        </template>

        <template #[`item.discount`]="{ item }">
          {{ item.discount | currency }}
        </template>

        <template #[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="openUpdate(item)" :title="`تعديل`">
            edit
          </v-icon>
          <v-icon
            small
            class="mr-2"
            @click="confirmDelete(item)"
            :title="`حذف`"
          >
            delete
          </v-icon>

          <v-icon
            small
            class="mr-2"
            @click="openAddSubject(item)"
            :title="`${
              item.SubjectCourse.length < 1 ? 'اضافة مادة' : 'تعديل مادة'
            }`"
          >
            menu_book
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <createComponent />
    <updateComponent />
    <subjectComponent />
  </div>
</template>

<script>
import moment from "moment";
import { bus } from "@/main";
import createComponent from "@/components/courses/create.vue";
import updateComponent from "@/components/courses/update.vue";
import subjectComponent from "@/components/courses/subject.vue";
export default {
  data: () => ({
    headers: [
      { text: "اسم الكورس", value: "courseName", width: "230" },
      { text: "سعر الكورس", value: "coursePrice", width: "150" },
      { text: "نسبة الاستاذ", value: "percentage", width: "150" },
      { text: "نسبة الخصم", value: "discount", width: "150" },
      { text: "المادة", value: "subject", width: "150" },
      { text: "بواسطة", value: "user.userName", width: "150" },
      { text: "تاريخ الانشاء", value: "createdAt", width: "150" },
      { text: "تاريخ اخر تعديل", value: "updatedAt", width: "150" },
      { text: "تاريخ فتح الكورس", value: "startAt", width: "150" },
      { text: "تاريخ انتهاء الكورس", value: "endAt", width: "150" },
      { text: "العمليات", value: "actions", width: "150" },
    ],
    courses: [],
    search: "",
  }),

  components: {
    createComponent,
    updateComponent,
    subjectComponent,
  },

  filters: {
    formatDate(value) {
      return moment(value).format("DD/MM/YYYY HH:mm a");
    },

    subjectName(value) {
      return value.length > 0 ? value[0].subjectFullName : "لا يوجد";
    },

    currency(value) {
      const price = value * 1;
      return price.toLocaleString("ar-AE", {
        style: "currency",
        currency: "IQD",
      });
    },

    percent(value) {
      const percent = value * 1 + "%";
      return percent;
    },
  },

  methods: {
    async fetch() {
      const courses = await this.axios.get("courses");
      this.courses = courses.data;
    },

    checkDate(value) {
      return moment(value).isBefore(moment(new Date().toISOString()));
    },

    openCreate() {
      bus.$emit("open-create");
    },

    openUpdate(item) {
      bus.$emit("open-update", item);
    },

    openAddSubject(item) {
      bus.$emit("open-add-subject", item);
    },

    async deleteCourse(item) {
      try {
        const course = await this.axios.delete(`courses/${item.courseId}`);
        window.location.reload();
        this.fetch();
      } catch (error) {
        console.error(error);

        this.$toasted.error("حدث خطأ ما برجاء المحاولة مرة اخرى", {
          position: "top-center",
          duration: 3000,
        });
      }
    },

    confirmDelete(item) {
      this.$toasted.error("هل تريد حذف الكورس ؟", {
        theme: "outline",
        position: "bottom-center",
        duration: 6000,
        action: [
          {
            text: "حذف الكورس",
            onClick: () => {
              this.deleteCourse(item);
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
  },

  mounted() {
    this.fetch();

    bus.$on("course-created", () => {
      this.fetch();
      window.location.reload();
    });

    bus.$on("subject-course-added", () => {
      this.fetch();
    });
  },
};
</script>

<style>
</style>