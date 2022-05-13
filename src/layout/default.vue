<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" right :mini-variant="miniVariant" stateless app>
      <v-list-item style="height: 64px">
        <v-list-item-content>
          <v-list-item-title >
            برنامج المعهد الالكتروني
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-list dense nav>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="item.path"
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

    <v-app-bar height="65px" app elevation="0" style="border-bottom: 1px solid rgba(0,0,0,0.12)">
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
  </v-app>
</template>

<script>
export default {
  name: "defaultView",
  data() {
    return {
      miniVariant: true,
      drawer: true,
      items: [
        {
          title: "الرئيسية",
          icon: "home",
          path: "/",
        },
        // {
        //   title: "الاساتذة",
        //   icon: "people_alt",
        //   path: "/teachers",
        // },
        {
          title: "الطلاب",
          icon: "groups",
          path: "/students",
        },
        {
          title: "الصفوف",
          icon: "dashboard",
          path: "/classes",
        },
        {
          title: "المواد",
          icon: "library_books",
          path: "/subjects",
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
      if(this.$route.path !== "/") {
        this.$router.push("/");
      }
      localStorage.clear();
    },
  },

  computed: {
    username() {
      return this.$store.getters.user.username
    }
  },
};
</script>

<style>
</style>