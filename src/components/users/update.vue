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
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-text-field
                  v-model="user.userName"
                  :rules="rules"
                  label="اسم الحساب"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" lg="6" xl="6">
                <v-text-field
                  v-model="user.password"
                  :rules="rules"
                  label="كلمة المرور"
                  :type="showPassword ? 'text' : 'password'"
                  :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                  @click:append="showPassword = !showPassword"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" lg="6" xl="6">
                <v-text-field
                  v-model="user.phone"
                  :rules="rules"
                  label="رقم الهاتف"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" lg="6" xl="6">
                <v-select
                  v-model="user.role"
                  :items="role"
                  :rules="rules"
                  label="الصلاحيات"
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
    role: [
      {
        text: "صلاحيات كالمة",
        value: "ADMIN",
      },
      {
        text: "محاسب",
        value: "USER",
      },
    ],
    user: {
      userName: "",
      password: "",
      role: "",
      isActive: true,
      phone: "",
    },
    showPassword: false,
    userId: "",
    rules: [(v) => !!v || "لا يمكنك ترك الحقل فارغ"],
  }),

  created() {
    bus.$on("open-update", (item) => {
      this.createDialog = true;
      this.userId = item.userId;
      this.user = {
        userName: item.userName,
        password: item.password,
        role: item.role,
        isActive: item.isActive,
        phone: item.phone,
      };
    });
  },

  methods: {
    async create() {
      if (this.$refs.createFormRef.validate()) {
        try {
          await this.axios.put(`users/${this.userId}`, this.user);
          this.createDialog = false;
          bus.$emit("user-created");
        } catch (error) {
          this.$toasted.error("حدث خطأ في تحديث البيانات", {
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