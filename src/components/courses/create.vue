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
                  v-model="createForm.courseName"
                  label="اسم الكورس"
                  :rules="rules"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-text-field
                  v-model="createForm.coursePrice"
                  label="سعر الكورس"
                  :rules="rules"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" lg="6" xl="6">
                <v-dialog
                  ref="startAtDialog"
                  v-model="startAtDialog"
                  :return-value.sync="createForm.startAt"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="createForm.startAt"
                      label="تاريخ البدء"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="createForm.startAt" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="startAtDialog = false">
                      الغاء
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.startAtDialog.save(createForm.startAt)"
                    >
                      حفظ
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-col>

              <v-col cols="12" md="6" lg="6" xl="6">
                <v-dialog
                  ref="endAtDialog"
                  v-model="endAtDialog"
                  :return-value.sync="createForm.endAt"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="createForm.endAt"
                      label="تاريخ الانتهاء"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="createForm.endAt" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="endAtDialog = false">
                      الغاء
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.endAtDialog.save(createForm.endAt)"
                    >
                      حفظ
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-col>

              <v-col cols="12" md="6" lg="6" xl="6">
                <v-text-field
                  v-model="createForm.discount"
                  label="الخصم"
                  :rules="rules"
                  hint="ادخل 0 للعدم وجود خصم او ادخل المبلغ الكلي للخصم"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-text-field
                  v-model="createForm.percentage"
                  label="نسبة الاستاذ"
                  :rules="rules"
                  hint="ادخل 0 للعدم وجود نسبة محددة للاستاذ او ادخل قيمة النسبة المئوية"
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
    startAtDialog: false,
    endAtDialog: false,
    rules: [(v) => !!v || "لا يمكنك ترك الحقل فارغ"],
    createForm: {
      courseName: "",
      coursePrice: "",
      startAt: null,
      endAt: null,
      isFinished: false,
      discount: 0,
      percentage: 0,
      createdBy: "",
    },
  }),

  created() {
    this.createForm.createdBy = this.$store.state.user.userId;

    bus.$on("open-create", () => {
      this.createDialog = true;
    });
  },

  methods: {
    async create() {
      if (this.$refs.createFormRef.validate()) {
        try {
          await this.axios.post("courses", {
            courseName: this.createForm.courseName,
            coursePrice: this.createForm.coursePrice,
            startAt: new Date(this.createForm.startAt).toISOString(),
            endAt: new Date(this.createForm.endAt).toISOString(),
            isFinished: false,
            discount: this.createForm.discount * 1,
            percentage: this.createForm.percentage * 1,
            createdBy: this.createForm.createdBy,
          });

          
          this.createDialog = false;
          bus.$emit("course-created");
        } catch (error) {
          console.error(error);
          this.$toasted.error("حدث خطأ في اضافة البيانات", {
            position: "top-center",
            duration: 3000,
          });
        }
      }
    },
  },
};
</script>

<style>
</style>