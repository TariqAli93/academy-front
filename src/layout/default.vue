<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      right
      :mini-variant="miniVariant"
      stateless
      app
      color="primary"
      dark
    >
      <v-list-item style="height: 64px">
        <v-list-item-content>
          <v-list-item-title> {{ settings.appName }} </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-list dense nav>
        <v-list-item
          v-for="item in list"
          :key="item.title"
          link
          :to="item.path"
          :disabled="item.disabled"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      height="65px"
      app
      elevation="0"
      style="border-bottom: 1px solid rgba(0, 0, 0, 0.12)"
    >
      <v-app-bar-nav-icon
        @click.stop="miniVariant = !miniVariant"
      ></v-app-bar-nav-icon>

      <v-spacer />

      <v-menu transition="slide-y-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" depressed dark v-bind="attrs" v-on="on">
            {{ username }}
          </v-btn>
        </template>
        <v-list dense nav>
          <v-list-item @click="logout">
            <v-list-item-title>تسجيل الخروج</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <v-footer style="border-top: 1px solid rgba(0, 0, 0, 0.12)" app inset>
      <v-btn depressed @click="devInfo = true"> تواصل معنا </v-btn>
      <v-spacer />
      <span> الاصدار: {{ settings.appVersion }} </span>
    </v-footer>

    <v-dialog v-model="devInfo" max-width="500" persistent>
      <v-card elevation="0">
        <v-toolbar elevation="0" class="transparent border-bottom">
          <v-toolbar-title>
            <span class="primary--text text-3">تواصل معنا</span>
          </v-toolbar-title>

          <v-spacer />

          <v-btn icon @click.stop="devInfo = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-divider />

        <v-card-text class="mt-5">
          <v-list nav dense>
            <v-list-item @click="">
              <v-list-item-icon>
                <v-icon>phone</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>07824082356</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider />

            <v-list-item @click="">
              <v-list-item-icon>
                <v-icon>chat</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>07824082356</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider />

            <v-list-item @click="" class="mt-1">
              <v-list-item-icon>
                <v-icon>email</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>tariqali9300@gmail.com</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import settings from "@/settings";

export default {
  name: "defaultView",
  data() {
    return {
      miniVariant: true,
      drawer: true,
      settings: settings,
      devInfo: false,
      list: [
        {
          title: "الرئيسية",
          icon: "home",
          path: "/",
        },
        {
          title: "الاساتذة",
          icon: "people_alt",
          path: "/teachers",
          disabled: this.$store.state.user.role === "USER"
        },
        {
          title: "الصفوف",
          icon: "dashboard",
          path: "/classes",
          disabled: this.$store.state.user.role === "USER"
        },
        {
          title: "المواد",
          icon: "library_books",
          path: "/subjects",
          disabled: this.$store.state.user.role === "USER"
        },
        {
          title: "القاعات",
          icon: "meeting_room",
          path: "/halls",
          disabled: this.$store.state.user.role === "USER"
        },
        {
          title: "الكورسات",
          icon: "menu_book",
          path: "/courses",
          disabled: this.$store.state.user.role === "USER"
        },
        {
          title: "الطلاب",
          icon: "groups",
          path: "/students",
        },
        {
          title: "التقارير",
          icon: "analytics",
          path: "/reports",
          disabled: this.$store.state.user.role === "USER"
        },
        {
          title: "الفواتير",
          icon: "payments",
          path: "/bills",
        },
      ],
    };
  },

  methods: {
    logout() {
      this.$store.dispatch("logout");
      if (this.$route.path !== "/") {
        this.$router.push("/");
      }
      localStorage.clear();
    },
  },

  computed: {
    username() {
      return this.$store.getters.user.userName;
    },

    showList() {
      return this.$store.getters.user.role === 'ADMIN';
    },
  },
};
</script>

<style>
</style>