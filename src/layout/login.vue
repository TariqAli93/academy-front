<template>
  <v-app>
    <v-main>
      <div class="login-container">
        <h1>برنامج المعهد الالكتروني</h1>
        <login-view />
      </div>
    </v-main>
  </v-app>
</template>

<script>
import LoginView from "@/views/LoginView.vue";
export default {
  components: {
    LoginView,
  },
};
</script>

<style lang="scss">
.login-container {
  height: 100%;
  width: 100%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  h1 {
    display: block;
    text-align: center;
    margin-bottom: 1em;
    font-size: 2.5em;
    font-weight: 900;
  }
}
</style>