<template>
  <div class="ClaasesPage">
    <!-- toolbar -->
    <v-card elevation="0" class="mb-5">
      <v-toolbar elevation="0" class="transparent">
        <v-toolbar-title>
          <span class="primary--text text-3">المواد</span>
        </v-toolbar-title>

        <v-spacer />

        <v-text-field
          v-model="search"
          label="ابحث عن مادة"
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
          <span>اضافة مادة</span>
        </v-btn>
      </v-toolbar>
    </v-card>
    <!-- /toolbar -->

    <!-- students list -->
    <v-card elevation="0">
      <v-data-table
        :items="items"
        :headers="headers"
        :search="search"
        class="transparent elevation-0"
      >
        <template #[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="edit(item)"
            :title="`تعديل ${item.subjectName}`"
          >
            edit
          </v-icon>
          <v-icon
            small
            class="mr-2"
            @click="confirmDelete(item)"
            :title="`حذف ${item.subjectName}`"
          >
            delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
    <!-- /students list -->

    <createComponent />
    <updateComponent />
  </div>
</template>

<script>
import { bus } from "@/main";
import createComponent from "@/components/subjects/create.vue";
import updateComponent from "@/components/subjects/update.vue";
export default {
  data() {
    return {
      headers: [
        {
          text: "#",
          align: "start",
          sortable: false,
          value: "subjectId",
        },
        {
          text: "المادة",
          align: "start",
          sortable: false,
          value: "subjectFullName",
        },
        {
          text: "الصف",
          align: "start",
          sortable: false,
          value: "grade.gradeName",
        },
        {
          text: "الاجراءات",
          align: "start",
          sortable: false,
          value: "actions",
        },
      ],
      items: [],
      search: "",
    };
  },

  components: {
    createComponent,
    updateComponent,
  },

  created() {
    this.fetch();

    bus.$on("subject-created", () => {
      this.fetch();
    });
  },

  methods: {
    async fetch() {
      try {
        const { data } = await this.axios.get("subjects");
        this.items = data.data;
      } catch (error) {
        this.$toasted.error("حدث خطأ في جلب البيانات", {
          position: "top-center",
          duration: 3000,
        });
      }
    },


    confirmDelete(item) {
      this.$toasted.error("هل تريد حذف المادة ؟", {
        theme: "outline",
        position: "bottom-center",
        duration: 6000,
        action: [
          {
            text: "حذف المادة",
            onClick: () => {
              this.deleteSubject(item);
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

    async deleteSubject(item) {
      try {
        await this.axios.delete(`subjects/${item.subjectId}`);
        this.fetch();
      } catch (error) {
        console.error(error);
      }
    },

    openCreate() {
      bus.$emit("open-create");
    },

    edit(item) {
      bus.$emit("open-edit", item);
    },
  },
};
</script>

<style>
</style>