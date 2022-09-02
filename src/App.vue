<template>
  <KeepAlive>
    <div class="layouts">
      <div class="loading" v-if="$store.getters.isLoading">
        <v-progress-circular
          indeterminate
          color="secondary"
          size="70"
        ></v-progress-circular>
      </div>
      <div class="window-titlebar">
        <div class="window-titlebar-right">
          <button class="window-close red" @click="quitApp">
            <img src="./assets/close.png" />
          </button>

          <button class="window-maximize" @click="maximizeApp">
            <img src="./assets/maximize.png" />
          </button>

          <button class="window-minimize" @click="minimizeApp">
            <img src="./assets/minimize.png" />
          </button>
        </div>

        <div class="window-titlebar-left">
          <span>{{ title }}</span>
        </div>
      </div>

      <div class="window">
        <default-view v-if="isLoggedIn" />
        <login-page v-else />
      </div>
    </div>
  </KeepAlive>
</template>

<style lang="scss">
$window-titlebar-size: 35px;
.loading {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.375);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}
@import url("https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap");
html,
body,
.v-application {
  & > *:not(i) {
    font-family: "Cairo", sans-serif;
  }
}

.v-card {
  border: 1px solid rgba(black, 0.12) !important;
}

.v-navigation-drawer--fixed {
  top: $window-titlebar-size !important;
}

.v-app-bar.v-toolbar {
  top: $window-titlebar-size !important;
}

.window-titlebar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: var(--v-primary-base);
  height: $window-titlebar-size;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10000;
  border-bottom: 0.3px solid rgba(black, 0.12);
  -webkit-app-region: drag;
  user-select: none;

  .window-titlebar-left {
    padding: 10px;

    span {
      font-size: 0.8rem;
      font-weight: 300;
      color: rgb(230, 230, 230);
    }
  }

  .window-titlebar-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0;
    -webkit-app-region: no-drag;
    user-select: none;

    button {
      width: $window-titlebar-size;
      height: $window-titlebar-size;
      border: none;
      background-color: rgba(black, 0);
      outline: none;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-inline: 5px;
      padding: 10px 10px;
      user-select: none;

      &:hover {
        opacity: 0.8;
        background: rgba(black, 0.05);
      }

      img {
        width: calc($window-titlebar-size - 15px);
        height: calc($window-titlebar-size - 15px);
      }

      &.red {
        margin-right: 0px;

        &:hover {
          background-color: red;
        }
      }
    }
  }
}
</style>

<script>
import defaultView from "@/layout/default.vue";
import LoginPage from "@/layout/login.vue";
import { quit, maximize, minimize } from "./plugins/preload";
export default {
  name: "App",
  data: () => ({
    title: "حسابات المعهد",
  }),

  components: {
    defaultView,
    LoginPage,
  },

  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },

  methods: {
    quitApp() {
      this.$store
        .dispatch("logout")
        .then(() => {
          console.log("logged out");
          localStorage.clear();
          setTimeout(() => {
            quit();
          }, 1000);
        })
        .catch(() => {
          console.log("logout failed");
          localStorage.clear();
          setTimeout(() => {
            quit();
          }, 1000);
        });
    },

    maximizeApp() {
      maximize();
    },

    minimizeApp() {
      minimize();
    },
  },
};
</script>
