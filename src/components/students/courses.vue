<template>
  <v-dialog v-model="coursesDialog" persistent max-width="750px">
    <v-card>
      <v-card-title>
        <span class="text-h5">كورسات الطالب {{ studentName }}</span>
        <v-spacer />
        <v-btn color="primary" icon @click="coursesDialog = false"
          ><v-icon>close</v-icon></v-btn
        >
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-container>
          <v-form
            class="pt-3 pb-3"
            v-model="studentCourseModel"
            ref="createFormRef"
            lazy-validation
            @submit.prevent="addStudentCourse"
          >
            <v-row justify="center" align="center">
              <v-col cols="12" md="8" lg="8" xl="8">
                <v-select
                  v-model="idCourse"
                  :items="courses"
                  item-text="courseName"
                  item-value="courseId"
                  label="الكورس"
                  :rules="rules"
                  multiple
                ></v-select>
              </v-col>

              <v-col cols="12" md="4" lg="4" xl="4">
                <v-btn
                  type="submit"
                  color="success"
                  block
                  :disabled="!studentCourseModel"
                >
                  حفظ البيانات
                </v-btn>
              </v-col>
            </v-row>
          </v-form>

          <v-divider />

          <v-data-table
            class="transparent elevation-0"
            :headers="headers"
            :items="studentCourses"
          >
            <template #[`item.course.createdAt`]="{ item }">
              <v-chip color="success">{{
                item.course.createdAt | formatDate
              }}</v-chip>
            </template>

            <template #[`item.actions`]="{ item }">
              <v-icon
                small
                class="mr-2"
                @click="deleteCourse(item)"
                :title="`حذف ${item.course.courseName} من الطالب`"
              >
                delete
              </v-icon>
            </template>
          </v-data-table>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { bus } from "@/main";
import moment from "moment";
export default {
  data: () => ({
    coursesDialog: false,
    studentCourses: [],
    courses: [],
    idCourse: [],
    idStudent: null,
    studentName: "",
    rules: [(v) => !!v || "لا يمكنك ترك الحقل فارغ"],
    studentCourseModel: false,
    headers: [
      { text: "المعرف", value: "course.courseId" },
      { text: "اسم الكورس", value: "course.courseName" },
      { text: "سعر الكورس", value: "course.coursePrice" },
      { text: "تاريخ الاضافة", value: "course.createdAt" },
      { text: "بواسطة", value: "user.userName" },
      { text: "التحكم", value: "actions" },
    ],
  }),

  filters: {
    formatDate(date) {
      return moment(date).format("DD/MM/YYYY HH:mm a");
    },
  },

  created() {
    this.fetchCourses();

    bus.$on("open-courses", (courses) => {
      this.coursesDialog = true;
      this.studentName = courses.studentName;
      this.idStudent = courses.studentId;
      this.studentCourses = courses.StudentCourses;
    });
  },

  methods: {
    async fetchCourses() {
      try {
        const course = await this.axios.get("courses");
        this.courses = course.data;
      } catch (error) {
        console.error(error);
      }
    },

    async addStudentCourse() {
      if (this.$refs.createFormRef.validate()) {
        try {
          await this.axios.post(`students/courses`, {
            idCourse: this.idCourse,
            idStudent: this.idStudent,
            createdBy: this.$store.state.user.userId,
          });

          this.fetchCourses();
          this.coursesDialog = false;
          bus.$emit("student-course-add");
        } catch (error) {
          console.error(error);
        }
      }
    },

    async deleteCourse(item) {
      const { studentCourseId } = item;
      try {
        await this.axios.delete(`students/courses/${studentCourseId}`);
        this.fetchCourses();
        this.coursesDialog = false;
        bus.$emit("student-course-delete");
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style>
</style>