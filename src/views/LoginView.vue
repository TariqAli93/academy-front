<template>
  <v-form
    v-model="form"
    ref="form"
    lazy-validation
    @submit.prevent="login"
    style="min-width: 450px"
  >
    <v-text-field
      label="اسم المستخدم"
      v-model="username"
      outlined
      required
      autofocus
      :rules="[(v) => !!v || 'الرجاء إدخال اسم المستخدم']"
      prepend-inner-icon="person"
    ></v-text-field>

    <v-text-field
      label="كلمة المرور"
      v-model="password"
      outlined
      required
      :type="showPassword ? 'text' : 'password'"
      :rules="[(v) => !!v || 'الرجاء إدخال اسم المستخدم']"
      :append-icon="showPassword ? 'visibility_off' : 'visibility'"
      prepend-inner-icon="lock"
      @click:append="showPassword = !showPassword"
    ></v-text-field>

    <v-btn
      type="submit"
      large
      color="primary"
      depressed
      block
      :disabled="!form"
    >
      تسجيل الدخول
    </v-btn>
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      form: false,
      username: null,
      password: null,
      showPassword: false,
    };
  },

  methods: {
    async login() {
      if (this.$refs.form.validate()) {
        try {
          const token = await this.axios.post("/users/login", {
            username: this.username,
            password: this.password,
          });

          let user = this.$jwt.decode(token.data);

          this.$store.commit("setToken", token.data);
          localStorage.setItem("token", token.data);
          this.$store.commit("setUser", user);
          localStorage.setItem("user", JSON.stringify(user));
          this.$toasted.success("تم تسجيل الدخول بنجاح", {
            duration: 3000,
            position: "top-center",
          });

          if(this.$route.path !== '/') {
            this.$router.push('/');
          }
        } catch (error) {
          this.$refs.form.validate();
          console.error(error);
          this.$toasted.error('حدث خطأ في تسجيل الدخول', {
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