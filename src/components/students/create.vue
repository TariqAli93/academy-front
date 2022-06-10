<template>
  <v-dialog v-model="createDialog" persistent max-width="650px">
    <v-card>
      <v-card-title>
        <span class="text-h5">اضافة بيانات جديدة</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="createFormRef" v-model="createFormModel" lazy-validation @submit.prevent="create">
            <v-row>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-text-field
                  label="اسم الطالب"
                  v-model="createForm.firstName"
                  :rules="rules"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" lg="6" xl="6">
                <v-text-field
                  label="اسم الاب و اللقب"
                  v-model="createForm.lastName"
                  :rules="rules"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" lg="6" xl="6">
                <v-text-field
                  label="رقم الهاتف"
                  v-model="createForm.phone"
                  :rules="rules"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" lg="6" xl="6">
                <v-text-field
                  label="رقم هاتف ولي الامر"
                  v-model="createForm.parentPhone"
                  :rules="rules"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" lg="6" xl="6">
                <v-select
                  :items="grades"
                  label="الصف"
                  v-model="createForm.idGrade"
                  :rules="rules"
                  item-text="gradeName"
                  item-value="gradeId"
                  required
                ></v-select>
              </v-col>

              <v-col cols="12" md="6" lg="6" xl="6">
                <v-select
                  :items="courses"
                  label="الكورسات"
                  v-model="createForm.idCourse"
                  :rules="rules"
                  required
                  item-text="courseName"
                  item-value="courseId"
                  multiple
                ></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-btn color="success" :disabled="!createFormModel" @click="create">
          حفظ البيانات
        </v-btn>

        <v-btn color="error" @click="createDialog = false"> إلغاء الامر </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { bus } from "../../main";
export default {
  data: () => ({
    createDialog: false,
    createFormModel: false,
    createForm: {
      firstName: null,
      lastName: null,
      phone: null,
      parentPhone: null,
      idGrade: null,
      idCourse: null,
      createdBy: null,
    },
    grades: null,
    courses: null,
    rules: [(v) => !!v || "لا يمكنك ترك الحقل فارغ"],
  }),

  methods: {
    async create() {
      if (this.$refs.createFormRef.validate()) {
        try {
          this.createForm.createdBy = this.$store.state.user.userId;
          const student = await this.axios.post("students", this.createForm);
          this.createDialog = false;
          this.createForm = {
            firstName: null,
            lastName: null,
            phone: null,
            parentPhone: null,
            idGrade: null,
            idCourse: null,
          };
          bus.$emit("student-created", student.data);
          this.$toasted.success("تم اضافة البيانات بنجاح", {
            position: "top-center",
            duration: 3000,
          });
        } catch (error) {
          console.error(error);

          this.$toasted.error("حدث خطأ أثناء إضافة البيانات", {
            position: "top-center",
            duration: 3000,
          });
        }
      }
    },

    async fetchGrades() {
      try {
        const grade = await this.axios.get("grades");
        this.grades = grade.data.data;
      } catch (error) {
        console.error(error);
      }
    },

    async fetchCourses() {
      try {
        const course = await this.axios.get("courses");
        this.courses = course.data;
      } catch (error) {
        console.error(error);
      }
    },
  },

  created() {
    bus.$on("openCreateStudent", () => {
      this.createDialog = true;
    });

    this.fetchGrades();
    this.fetchCourses();
  },
};
</script>

<style>
</style>