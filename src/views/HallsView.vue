<template>
  <div class="ClaasesPage">
    <!-- toolbar -->
    <v-card elevation="0" class="mb-5">
      <v-toolbar elevation="0" class="transparent">
        <v-toolbar-title>
          <span class="primary--text text-3">القاعات</span>
        </v-toolbar-title>

        <v-spacer />

        <v-text-field
          v-model="search"
          label="ابحث عن قاعة"
          dense
          color="primary"
          hide-details
        ></v-text-field>

        <v-btn
          color="primary"
          class="mr-5"
          depressed
          @click="openCreate"
        >
          <v-icon>add</v-icon>
          <span>اضافة قاعة</span>
        </v-btn>
      </v-toolbar>
    </v-card>
    <!-- /toolbar -->

    <!-- students list -->
    <v-card elevation="0">
      <v-data-table
        :items="halls"
        :headers="headers"
        :search="search"
        class="transparent elevation-0"
      >
        <template #[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="edit(item)"
            :title="`تعديل ${item.hallName}`"
          >
            edit
          </v-icon>
          <v-icon
            small
            class="mr-2"
            @click="confirmDelete(item)"
            :title="`حذف ${item.hallName}`"
          >
            delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <createComponent />
    <updateComponent />
  </div>
</template>

<script>
import { bus } from "@/main";
import createComponent from '@/components/halls/create.vue'
import updateComponent from '@/components/halls/update.vue'
export default {
  data() {
    return {
      headers: [
        {
          text: "#",
          align: "start",
          sortable: false,
          value: "hallId",
        },
        {
          text: "اسم القاعة",
          align: "start",
          sortable: false,
          value: "hallName",
        },
        {
          text: "الاجراءات",
          align: "start",
          sortable: false,
          value: "actions",
        },
      ],
      halls: [],
      search: "",
    };
  },

  components: {
    createComponent,
    updateComponent,
  },

  mounted() {
    bus.$on("hall-created", () => {
      this.fetch();
    });
    this.fetch();
  },

  methods: {
    async fetch() {
      try {
        const { data } = await this.axios.get("halls");
        this.halls = data;
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
      this.$toasted.error("هل تريد حذف القاعة ؟", {
        theme: "outline",
        position: "bottom-center",
        duration: 6000,
        action: [
          {
            text: "حذف القاعة",
            onClick: () => {
              this.deleteHall(item);
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
      });
    },

    async deleteHall(item) {
      try {
        await this.axios.delete(`halls/${item.hallId}`);
        this.fetch()
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style>
</style>