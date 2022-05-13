<template>
  <div class="ClaasesPage">
    <!-- add new class dialog -->
    <v-dialog
      v-model="newSubjectsDialog"
      persistent
      max-width="500px"
      transition="slide-y-transition"
    >
      <v-card elevation="0">
        <v-toolbar elevation="0" class="transparent border-bottom">
          <v-toolbar-title>اضافة مادة جديدة</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.stop="newSubjectsDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-divider />

        <v-card-text class="mt-5">
          <v-form
            ref="newSubjectsRef"
            v-model="newSubjectsForm"
            lazy-validation
            @submit.prevent="newSubjects"
          >
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="subjectName"
                  label="اسم المادة"
                  required
                  outlined
                  dense
                  :rules="[(v) => !!v || 'الرجاء إدخال اسم المادة']"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="subjectPrice"
                  label="سعر المادة"
                  required
                  outlined
                  dense
                  type="number"
                  :rules="[(v) => !!v || 'الرجاء إدخال سعر المادة']"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="studentClass"
                  label="الصف"
                  required
                  outlined
                  dense
                  :items="classes"
                  item-text="className"
                  item-value="classId"
                  :rules="[(v) => !!v || 'الرجاء اختيار الصف']"
                ></v-select>
              </v-col>
            </v-row>

            <v-btn
              block
              large
              color="primary"
              depressed
              :disabled="!newSubjectsForm"
              type="submit"
            >
              اضافة مادة جديدة
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- /add new class dialog -->

    <v-dialog
      v-model="updateSubjectsDialog"
      persistent
      max-width="500px"
      transition="slide-y-transition"
    >
      <v-card elevation="0">
        <v-toolbar elevation="0" class="transparent border-bottom">
          <v-toolbar-title>اضافة صف جديد</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.stop="updateSubjectsDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-divider />

        <v-card-text class="mt-5">
          <v-form
            ref="updateSubjectsRef"
            v-model="updateSubjectsForm"
            lazy-validation
            @submit.prevent="updateSubjects"
          >
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="subjectName"
                  label="اسم المادة"
                  required
                  outlined
                  dense
                  :rules="[(v) => !!v || 'الرجاء إدخال اسم المادة']"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="subjectPrice"
                  label="سعر المادة"
                  required
                  outlined
                  dense
                  type="number"
                  :rules="[(v) => !!v || 'الرجاء إدخال سعر المادة']"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="studentClass"
                  label="الصف"
                  required
                  outlined
                  dense
                  :items="classes"
                  item-text="className"
                  item-value="classId"
                  :rules="[(v) => !!v || 'الرجاء اختيار الصف']"
                ></v-select>
              </v-col>
            </v-row>

            <v-btn
              block
              large
              color="primary"
              depressed
              :disabled="!updateSubjectsForm"
              type="submit"
            >
              تحديث المادة
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- toolbar -->
    <v-card elevation="0" class="mb-5">
      <v-toolbar elevation="0" class="transparent">
        <v-toolbar-title>
          <span class="primary--text text-3">المواد</span>
        </v-toolbar-title>

        <v-spacer />

        <v-text-field
          outlined
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
          @click="newSubjectsDialog = true"
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
  </div>
</template>

<script>
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
          value: "subjectName",
        },
        {
          text: "سعر المادة",
          align: "start",
          sortable: false,
          value: "subjectPrice",
        },
        {
          text: "الصف",
          align: "start",
          sortable: false,
          value: "ClassesSubjects[0].class.className",
        },
        {
          text: "تاريخ انشاء المادة",
          align: "start",
          sortable: false,
          value: "createdAt",
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
      classes: [],
      studentClass: "",
      newSubjectsDialog: false,
      updateSubjectsDialog: false,
      newSubjectsForm: false,
      updateSubjectsForm: false,
      subjectName: "",
      subjectId: "",
      subjectPrice: "",
      classSubjectId: "",
    };
  },

  mounted() {
    this.GetSubjects();
    this.GetClasses();
  },

  methods: {
    async GetSubjects() {
      try {
        const response = await this.axios.get("subjects");
        this.items = response.data;
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    },

    async GetClasses() {
      try {
        const response = await this.axios.get(`classes`);
        this.classes = response.data;
      } catch (error) {
        console.log(error);
      }
    },

    async newSubjects() {
      try {
        if (this.$refs.newSubjectsRef.validate()) {
          const response = await this.axios.post("subjects", {
            subjectName: this.subjectName,
            subjectPrice: this.subjectPrice,
            classId: this.studentClass,
          });
          this.GetSubjects();
          this.newSubjectsDialog = false;
          this.subjectName = "";
        }
      } catch (error) {
        console.log(error);
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
      console.log(item.ClassesSubjects[0].classSubjectId);
      try {
        const response = await this.axios.delete(`subjects/${item.subjectId}`, {
          data: {
            classSubjectId: item.ClassesSubjects[0].classSubjectId,
          },
        });
        this.GetSubjects();
      } catch (error) {
        console.log(error);
      }
    },

    edit(item) {
      this.updateSubjectsDialog = true;
      this.subjectName = item.subjectName;
      this.subjectPrice = item.subjectPrice;
      this.subjectId = item.subjectId;
      this.studentClass = item.ClassesSubjects[0].class.classId;
      this.classSubjectId = item.ClassesSubjects[0].classSubjectId;
    },

    async updateSubjects() {
      try {
        if (this.$refs.updateSubjectsRef.validate()) {
          const response = await this.axios.put(`subjects/${this.subjectId}`, {
            subjectName: this.subjectName,
            subjectPrice: this.subjectPrice,
            classId: this.studentClass,
            classSubjectId: this.classSubjectId,
          });
          this.GetSubjects();
          this.updateSubjectsDialog = false;
          this.subjectName = "";
          this.subjectId = "";
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style>
</style>