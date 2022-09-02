<template>
  <v-dialog v-model="createDialog" persistent max-width="650px">
    <v-card>
      <v-card-title>
        <span class="text-h5">اضافة بيانات جديدة</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form
            ref="createFormRef"
            v-model="createFormModel"
            lazy-validation
            @submit.prevent="create"
          >
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="createForm.idStudent"
                  label="الطالب"
                  :items="students"
                  item-text="studentName"
                  item-value="studentId"
                  @change="getCourses"
                  required
                  return-object
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="createForm.installment"
                  label="عدد الاقساط"
                  :rules="rules"
                  :disabled="installmentDisabled"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="createForm.amount"
                  label="المبلغ الواصل"
                  :rules="rules"
                  :disabled="amountDisabled"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="createForm.remaining"
                  label="المبلغ المتبقي"
                  disabled
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="monthlyPaid"
                  label="القسط الشهري"
                  disabled
                ></v-text-field>
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
import { bus } from "@/main";
export default {
  data: () => ({
    createFormModel: false,
    createDialog: false,
    createForm: {
      idStudent: "",
      installment: 1,
      createdBy: "",
      amount: 0 * 1,
      remaining: 0 * 1,
      idCourse: "",
      monthlyPaid: 0 * 1,
    },
    rules: [(v) => !!v || "لا يمكنك ترك الحقل فارغ"],
    students: [],
    courses: [],
    installmentDisabled: false,
    amountDisabled: false,
  }),

  computed: {
    monthlyPaid() {
      const coursesPrice = this.courses.reduce((acc, course) => {
        return acc + course.course.coursePrice * 1;
      }, 0);

      this.createForm.remaining = coursesPrice - this.createForm.amount;

      const paid = coursesPrice / this.createForm.installment;

      this.createForm.monthlyPaid = Number(paid);

      console.log(this.createForm.monthlyPaid);

      return paid.toLocaleString("ar-AR", {
        style: "currency",
        currency: "IQD",
      });
    },
  },

  created() {
    bus.$on("open-create", () => {
      this.createForm.createdBy = this.$store.state.user.userId;
      this.createDialog = true;
    });

    this.fetchStudents();
  },

  methods: {
    async create() {
      if (this.$refs.createFormRef.validate()) {
        if (this.createForm.idCourse.length < 1) {
          this.$toasted.error(
            "يجب ان يكون على الحد الادنى لعدد الكورسات لدى الطالب 1",
            {
              position: "top-center",
              duration: 3000,
            }
          );
          return;
        } else {
          const data = {
            idStudent: this.createForm.idStudent.studentId * 1,
            installment: this.createForm.installment * 1,
            createdBy: this.createForm.createdBy * 1,
            amount: this.createForm.amount * 1,
            remaining: this.createForm.remaining * 1,
            monthlyPaid: this.createForm.monthlyPaid * 1,
            idCourse: this.createForm.idCourse,
          };

          try {
            await this.axios.post("invoices", data);

            this.createDialog = false;
            bus.$emit("invoice-created");
          } catch (error) {
            this.$toasted.error("حدث خطأ في اضافة البيانات", {
              position: "top-center",
              duration: 3000,
            });
          }
        }
      }
    },

    async fetchStudents() {
      try {
        const { data } = await this.axios.get("students");
        this.students = data.data;
      } catch (error) {
        console.error(error);
      }
    },

    getCourses(event) {
      if (event.StudentCourses.length > 0) {
        this.createForm.idCourse = event.StudentCourses.map((c) => {
          return c.idCourse;
        });
        this.courses = event.StudentCourses;
        this.installmentDisabled = false;
        this.amountDisabled = false;
        this.createFormModel = true;
      } else {
        this.installmentDisabled = true;
        this.amountDisabled = true;
        this.createFormModel = false;
        this.$toasted.error("لا يوجد كورسات لهذا الطالب", {
          position: "top-center",
          duration: 3000,
        });
      }
    },
  },
};
</script>

<style>
</style>