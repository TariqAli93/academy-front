<template>
  <div class="TeachersPage">
    <v-card elevation="0" class="mb-5">
      <v-toolbar elevation="0" class="transparent">
        <v-toolbar-title>
          <span class="primary--text text-3">الاساتذة</span>
        </v-toolbar-title>

        <v-spacer />

        <v-text-field
          v-model="search"
          label="ابحث عن استاذ"
          dense
          color="primary"
          hide-details
        ></v-text-field>

        <v-btn
          color="primary"
          class="mr-5"
          depressed
          @click="createDialog = true"
        >
          <v-icon>add</v-icon>
          <span>اضافة استاذ</span>
        </v-btn>
      </v-toolbar>
    </v-card>

    <v-card elevation="0">
      <v-data-table
        :items="items"
        :headers="headers"
        :search="search"
        class="transparent elevation-0"
      >

      <template #[`item.user.userName`]="{ item }">
        <v-chip>{{ item.user.userName }}</v-chip>
      </template>

      <template #[`item.createdAt`]="{ item }">
        <v-chip color="success">{{ item.createdAt | formatDate }}</v-chip>
      </template>

      <template #[`item.updatedAt`]="{ item }">
        <v-chip color="warning" text-color="black">{{ item.updatedAt | formatDate }}</v-chip>
      </template>

        <template #[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="edit(item)"
            :title="`تعديل ${item.teacherName}`"
          >
            edit
          </v-icon>
          <v-icon
            small
            class="mr-2"
            @click="confirmDeleteTeacher(item)"
            :title="`حذف ${item.teacherName}`"
          >
            delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <!-- update dialog -->
    <v-dialog v-model="editDialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">تعديل البيانات</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="editFormRef" v-model="editFormModel" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="اسم الاستاذ"
                    v-model="teacherForm.teacherName"
                    :rules="rules"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="التخصص"
                    v-model="teacherForm.specialization"
                    :rules="rules"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="رقم الهاتف"
                    v-model="teacherForm.phone"
                    :rules="rules"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-btn color="success" :disabled="!editFormModel" @click="update">
            حفظ التعديلات
          </v-btn>

          <v-btn color="error" @click="cancelEdit"> إلغاء التعديلات </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- create dialog -->
    <v-dialog v-model="createDialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">اضافة بيانات جديدة</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form
              ref="createFormRef"
              v-model="createFormModel"
              lazy-validation
            >
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="اسم الاستاذ"
                    v-model="teacherForm.teacherName"
                    :rules="rules"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="التخصص"
                    v-model="teacherForm.specialization"
                    :rules="rules"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="رقم الهاتف"
                    v-model="teacherForm.phone"
                    :rules="rules"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-btn color="success" :disabled="!createFormModel" @click="create">
            حفظ البيانات
          </v-btn>

          <v-btn color="error" @click="createDialog = false">
            إلغاء الامر
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "TeachersPage",
  data() {
    return {
      search: "",
      headers: [
        {
          text: "#",
          value: "teacherId",
          sortable: false,
          align: "start",
        },
        {
          text: "اسم الاستاذ",
          value: "teacherName",
          sortable: false,
          align: "start",
        },
        {
          text: "رقم الهاتف",
          value: "phone",
          sortable: false,
          align: "start",
        },
        {
          text: "التخصص",
          value: "specialization",
          sortable: false,
          align: "start",
        },
        {
          text: "بواسطة",
          value: "user.userName",
          sortable: false,
          align: "start",
        },
        {
          text: "تاريخ الانشاء",
          value: "createdAt",
          sortable: false,
          align: "start",
        },
        {
          text: "تاريخ اخر تعديل",
          value: "updatedAt",
          sortable: false,
          align: "start",
        },
        {
          text: "الاجرائات",
          value: "actions",
          sortable: false,
          align: "start",
        },
      ],
      items: [],
      rules: [(v) => !!v || "لا يمكنك ترك الحقل فارغ"],
      editDialog: false,
      editFormModel: false,

      createDialog: false,
      createFormModel: false,
      teacherForm: {
        teacherId: "",
        teacherName: null,
        phone: null,
        specialization: null,
      },
    };
  },

  filters: {
    formatDate(date) {
      return moment(date).format("DD/MM/YYYY HH:mm a");
    }
  },

  methods: {
    // fetch data from teachers api
    async fetch() {
      try {
        const teachers = await this.axios.get("teachers");
        this.items = teachers.data.data;
      } catch (error) {
        this.$toasted.error(
          "حدث خطأ ما يرجى التحقق من اتصال الانترنت والمحاولة مرة اخرى",
          {
            position: "top-center",
            duration: 3000,
          }
        );
      }
    },

    // create teachers
    async create() {
      if (this.$refs.createFormRef.validate()) {
        try {
          const teachers = await this.axios.post("teachers", {
            teacherName: this.teacherForm.teacherName,
            phone: this.teacherForm.phone,
            specialization: this.teacherForm.specialization,
            createdBy: this.$store.state.user.userId,
          });

          this.fetch();
          this.cancelEdit();
          this.createDialog = false;
          this.$toasted.success("تم اضافة البيانات بنجاح", {
            position: "top-center",
            duration: 3000,
          });
        } catch (error) {
          console.error(error);
        }
      }
    },

    // update teachers
    async update() {
      if (this.$refs.editFormRef.validate()) {
        try {
          const teachers = await this.axios.put(
            `teachers/${this.teacherForm.teacherId}`,
            {
              teacherName: this.teacherForm.teacherName,
              phone: this.teacherForm.phone,
              specialization: this.teacherForm.specialization,
            }
          );
          this.fetch();
          this.$toasted.success("تم تعديل البيانات بنجاح", {
            position: "top-center",
            duration: 3000,
          });
          this.cancelEdit();
        } catch (error) {
          console.error(error);
          this.$toasted.error(
            "حدث خطأ في تحديث البيانات يرجى التحقق من صحة البيانات المدخلة",
            {
              position: "top-center",
              duration: 3000,
            }
          );
        }
      }
    },

    // open edit dialog
    edit(item) {
      this.teacherForm = {
        teacherId: item.teacherId,
        teacherName: item.teacherName,
        phone: item.phone,
        specialization: item.specialization,
      };

      this.editDialog = true;
    },

    // cancel edit dialog
    cancelEdit() {
      this.editDialog = false;
      this.teacherForm = {
        teacherId: null,
        teacherName: null,
        phone: null,
        specialization: null,
      };
    },

    confirmDeleteTeacher(item) {
      this.$toasted.error("هل تريد حذف الاستاذ ؟", {
        theme: "outline",
        position: "bottom-center",
        duration: 6000,
        action: [
          {
            text: "حذف الاستاذ",
            onClick: () => {
              this.deleteTeacher(item);
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

    async deleteTeacher(item) {
      try {
        const teacher = await this.axios.delete(`teachers/${item.teacherId}`);
        this.fetch();
      } catch (error) {
        console.error(error);
      }
    },
  },

  mounted() {
    this.fetch();
  },
};
</script>

<style lang="scss">
.border-bottom {
  border-color: rgba(black, 0.12) !important;
  border-bottom: 1px solid rgba(black, 0.12) !important;
}
</style>