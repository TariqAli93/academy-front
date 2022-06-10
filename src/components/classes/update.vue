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
            @submit.prevent="update"
          >
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="className"
                  :rules="rules"
                  label="اسم الصف"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-btn color="success" :disabled="!createFormModel" @click="update">
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
    className: "",
    classId: "",
    rules: [(v) => !!v || "لا يمكنك ترك الحقل فارغ"],
  }),

  created() {
    bus.$on("open-update", (item) => {
      this.className = item.gradeName;
      this.classId = item.gradeId;
      this.createDialog = true;
    });
  },

  methods: {
    async update() {
      if (this.$refs.createFormRef.validate()) {
        try {
          await this.axios.put(`grades/${this.classId}`, {
            gradeName: this.className,
          });
          this.createDialog = false;
          bus.$emit("class-created");
        } catch (error) {
          this.$toasted.error("حدث خطأ في تعديل البيانات", {
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