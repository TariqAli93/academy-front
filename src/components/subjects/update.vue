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
              <v-col cols="12">
                <v-text-field
                  v-model="createForm.subjectName"
                  :rules="rules"
                  label="اسم المادة"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="createForm.idGrade"
                  :items="classes"
                  item-text="gradeName"
                  item-value="gradeId"
                  :rules="rules"
                  label="الصف"
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
import { bus } from "@/main";
export default {
  data: () => ({
    createFormModel: false,
    createDialog: false,
    classes: [],
    createForm: {
      subjectName: "",
      idGrade: "",
      createdBy: "",
    },
    subjectId: "",
    rules: [(v) => !!v || "لا يمكنك ترك الحقل فارغ"],
  }),

  created() {
    bus.$on("open-edit", (item) => {
      console.log(item);
      this.createDialog = true;
      this.createForm.subjectName = item.subjectName;
      this.createForm.idGrade = item.idGrade;
      this.subjectId = item.subjectId * 1;
    });

    this.createForm.createdBy = this.$store.state.user.userId;
    this.fetchClass();
  },

  methods: {
    async create() {
      if (this.$refs.createFormRef.validate()) {
        try {
          await this.axios.put(`subjects/${this.subjectId}`, {
            subjectName: this.createForm.subjectName,
            idGrade: this.createForm.idGrade,
          });
          this.createDialog = false;
          bus.$emit("subject-created");
        } catch (error) {
          this.$toasted.error("حدث خطأ في تحديث البيانات", {
            position: "top-center",
            duration: 3000,
          });
        }
      }
    },

    async fetchClass() {
      try {
        const { data } = await this.axios.get("grades");
        this.classes = data.data;
      } catch (error) {
        this.$toasted.error("حدث خطأ في جلب البيانات", {
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