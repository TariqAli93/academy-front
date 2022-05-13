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
          const token = await this.axios.post("/login", {
            username: this.username,
            password: this.password,
          });
          this.$store.commit("setToken", token.data.token);
          localStorage.setItem("token", token.data.token);
          this.$store.commit("setUser", {
            username: token.data.username,
            userId: token.data.userId,
          });
          localStorage.setItem(
            "user",
            JSON.stringify({
              username: token.data.username,
              userId: token.data.userId,
            })
          );

          this.$router.push("/");
        } catch (error) {
          this.$refs.form.validate();
          console.error(error.response.data);
          this.$toasted.error(error.response.data.message, {
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