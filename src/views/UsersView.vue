<template>
  <div class="ClaasesPage">
    <!-- toolbar -->
    <v-card elevation="0" class="mb-5">
      <v-toolbar elevation="0" class="transparent">
        <v-toolbar-title>
          <span class="primary--text text-3">المستخدمين</span>
        </v-toolbar-title>

        <v-spacer />

        <v-text-field
          v-model="search"
          label="ابحث عن مستخدم"
          dense
          color="primary"
          hide-details
        ></v-text-field>

        <v-btn color="primary" class="mr-5" depressed @click="openCreate">
          <v-icon>add</v-icon>
          <span>اضافة مستخدم</span>
        </v-btn>
      </v-toolbar>
    </v-card>
    <!-- /toolbar -->

    <!-- students list -->
    <v-card elevation="0">
      <v-data-table
        :items="users"
        :headers="headers"
        :search="search"
        class="transparent elevation-0"
      >
        <template #[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="edit(item)"
            :title="`تعديل ${item.userName}`"
          >
            edit
          </v-icon>
          <v-icon
            small
            class="mr-2"
            @click="confirmDelete(item)"
            :title="`الغاء التفعيل ${item.userName}`"
          >
            lock
          </v-icon>
        </template>

        <template #[`item.isActive`]="{ item }">
          <v-chip :color="item.isActive ? 'success' : 'error'">
            {{ item.isActive ? "مفعل" : "غير مفعل" }}
          </v-chip>
        </template>

        <template #[`item.role`]="{ item }">
          <v-chip color="secondary">
            {{ item.role === "ADMIN" ? "صلاحيات كاملة" : "محاسب" }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>

    <createComponent />
    <updateComponent />
  </div>
</template>

<script>
import { bus } from "@/main";
import createComponent from "@/components/users/create.vue";
import updateComponent from "@/components/users/update.vue";
export default {
  data() {
    return {
      headers: [
        {
          text: "#",
          align: "start",
          sortable: false,
          value: "userId",
        },
        {
          text: "اسم الحساب",
          align: "start",
          sortable: false,
          value: "userName",
        },
        {
          text: "رقم الهاتف",
          align: "start",
          sortable: false,
          value: "phone",
        },
        {
          text: "الصلاحيات",
          align: "start",
          sortable: false,
          value: "role",
        },
        {
          text: "الحالة",
          align: "start",
          sortable: false,
          value: "isActive",
        },
        {
          text: "الاجراءات",
          align: "start",
          sortable: false,
          value: "actions",
        },
      ],
      users: [],
      search: "",
      isActive: true,
    };
  },

  components: {
    createComponent,
    updateComponent,
  },

  mounted() {
    bus.$on("user-created", () => {
      this.fetch();
    });
    this.fetch();
  },

  methods: {
    async fetch() {
      try {
        const users = await this.axios.get("users");
        this.users = users.data;
      } catch (error) {
        console.error(error);
      }
    },

    openCreate() {
      bus.$emit("open-create");
    },

    edit(item) {
      bus.$emit("open-update", item);
    },

    confirmDelete(item) {
      this.isActive = item.isActive;
      this.$toasted.error(
        this.isActive ? "هل تريد الغاء تفعيل الحساب ؟" : "هل تريد تفعيل الحساب",
        {
          theme: "outline",
          position: "bottom-center",
          duration: 6000,
          action: [
            {
              text: "نعم",
              onClick: () => {
                this.deactive(item);
                this.$toasted.clear();
              },
            },
            {
              text: "الغاء الامر",
              onClick: () => {
                this.$toasted.clear();
              },
            },
          ],
        }
      );
    },

    async deactive(item) {
      try {
        await this.axios.delete(`users/${item.userId}`, {
          data: {
            isActive: this.isActive ? false : true,
          },
        });
        this.fetch();
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style>
</style>