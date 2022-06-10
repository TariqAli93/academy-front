<template>
  <v-app>
    <v-main>
      <div class="login-container">
        <h1>{{ settings.appName }}</h1>
        <div class="form-container">
          <login-view />
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import LoginView from "@/views/LoginView.vue";
import settings from "@/settings";
export default {
  data: () => ({
    settings: settings,
  }),
  
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
  box-shadow: 0px 0px 10px 0px rgba(blue, 1);

  h1 {
    display: block;
    text-align: center;
    margin-bottom: 1em;
    font-size: 2.5em;
    font-weight: 900;
  }

  .form-container {
    padding: 2em;
    box-shadow: 15px -20px 45px -43px hsl(240deg 100% 50% / 42%),
      -15px -20px 45px -43px hsl(240deg 100% 50% / 42%);
    background-color: white;
    border-radius: 1em;
  }
}
</style>