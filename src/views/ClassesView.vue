<template>
  <div class="ClaasesPage">
    <!-- toolbar -->
    <v-card elevation="0" class="mb-5">
      <v-toolbar elevation="0" class="transparent">
        <v-toolbar-title>
          <span class="primary--text text-3">الصفوف</span>
        </v-toolbar-title>

        <v-spacer />

        <v-text-field
          v-model="search"
          label="ابحث عن صف"
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
          <span>اضافة صف</span>
        </v-btn>
      </v-toolbar>
    </v-card>
    <!-- /toolbar -->

    <!-- students list -->
    <v-card elevation="0">
      <v-data-table
        :items="classes"
        :headers="headers"
        :search="search"
        class="transparent elevation-0"
      >
        <template #[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="edit(item)"
            :title="`تعديل ${item.gradeName}`"
          >
            edit
          </v-icon>
          <v-icon
            small
            class="mr-2"
            @click="confirmDelete(item)"
            :title="`حذف ${item.gradeName}`"
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
import createComponent from '@/components/classes/create.vue'
import updateComponent from '@/components/classes/update.vue'
export default {
  data() {
    return {
      headers: [
        {
          text: "#",
          align: "start",
          sortable: false,
          value: "gradeId",
        },
        {
          text: "الصف",
          align: "start",
          sortable: false,
          value: "gradeName",
        },
        {
          text: "الاجراءات",
          align: "start",
          sortable: false,
          value: "actions",
        },
      ],
      classes: [],
      search: "",
    };
  },

  components: {
    createComponent,
    updateComponent,
  },

  mounted() {
    bus.$on("class-created", () => {
      this.fetch();
    });
    this.fetch();
  },

  methods: {
    async fetch() {
      try {
        const classes = await this.axios.get("grades");
        this.classes = classes.data.data;
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
      this.$toasted.error("هل تريد حذف الصف ؟", {
        theme: "outline",
        position: "bottom-center",
        duration: 6000,
        action: [
          {
            text: "حذف الصف",
            onClick: () => {
              this.deleteClass(item);
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

    async deleteClass(item) {
      try {
        await this.axios.delete(`grades/${item.gradeId}`);
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