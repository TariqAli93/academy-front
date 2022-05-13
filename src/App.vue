<template>
  <div class="layouts">
    <default-view v-if="isLoggedIn" />
    <login-page v-else />
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap");
html,
body,
.v-application {
  & > *:not(i) {
    font-family: "Cairo", sans-serif;
  }
}

.v-card {
  border: 1px solid rgba(black, .12) !important;
}
</style>

<script>
import defaultView from "@/layout/default.vue";
import LoginPage from "@/layout/login.vue";
export default {
  name: "App",
  components: {
    defaultView,
    LoginPage,
  },

  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
};
</script>
