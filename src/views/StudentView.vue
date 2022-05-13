<template>
  <div class="StudentPage">
    <!-- add subject dialog -->
    <v-dialog
      v-model="addSubjectDialog"
      persistent
      max-width="500px"
      transition="slide-y-transition"
    >
      <v-card elevation="0">
        <v-toolbar elevation="0" class="transparent border-bottom">
          <v-toolbar-title>اضافة مادة للطالب</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.stop="addSubjectDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-divider />

        <v-card-text class="mt-5">
          <v-form
            ref="addSubjectRef"
            v-model="addSubjectForm"
            lazy-validation
            @submit.prevent="addSubjectToStudent"
          >
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="subjectId"
                  label="المادة"
                  required
                  outlined
                  dense
                  :items="subjects"
                  item-text="subjectName"
                  item-value="subjectId"
                  :rules="[(v) => !!v || 'الرجاء اختيار المادة']"
                ></v-select>
              </v-col>
            </v-row>

            <v-btn
              block
              large
              color="primary"
              depressed
              :disabled="!addSubjectForm"
              type="submit"
            >
              اضافة المادة
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- /add subject dialog -->

    <!-- add new student dialog -->
    <v-dialog
      v-model="newStudentDialog"
      persistent
      max-width="500px"
      transition="slide-y-transition"
    >
      <v-card elevation="0">
        <v-toolbar elevation="0" class="transparent border-bottom">
          <v-toolbar-title>اضافة طالب جديد</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.stop="newStudentDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-divider />

        <v-card-text class="mt-5">
          <v-form
            ref="addStudentRef"
            v-model="newStudentForm"
            lazy-validation
            @submit.prevent="newStudent"
          >
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="studentName"
                  label="اسم الطالب"
                  required
                  outlined
                  dense
                  :rules="[(v) => !!v || 'الرجاء إدخال اسم الطالب']"
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
              :disabled="!newStudentForm"
              type="submit"
            >
              اضافة الطالب
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- /add new student dialog -->

    <!-- add new student dialog -->
    <v-dialog
      v-model="updateStudentDialog"
      persistent
      max-width="500px"
      transition="slide-y-transition"
    >
      <v-card elevation="0">
        <v-toolbar elevation="0" class="transparent border-bottom">
          <v-toolbar-title>اضافة طالب جديد</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.stop="updateStudentDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-divider />

        <v-card-text class="mt-5">
          <v-form
            ref="updateStudentRef"
            v-model="updateStudentForm"
            lazy-validation
            @submit.prevent="UpdateStudent"
          >
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="studentName"
                  label="اسم الطالب"
                  required
                  outlined
                  dense
                  :rules="[(v) => !!v || 'الرجاء إدخال اسم الطالب']"
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
              :disabled="!updateStudentForm"
              type="submit"
            >
              تحديث الطالب
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- /add new student dialog -->
    <!-- toolbar -->
    <v-card elevation="0" class="mb-5">
      <v-toolbar elevation="0" class="transparent">
        <v-toolbar-title>
          <span class="primary--text text-3">الطلاب</span>
        </v-toolbar-title>

        <v-spacer />

        <v-text-field
          outlined
          v-model="search"
          label="ابحث عن طالب"
          dense
          color="primary"
          hide-details
        ></v-text-field>

        <v-btn
          color="primary"
          class="mr-5"
          depressed
          @click="newStudentDialog = true"
        >
          <v-icon>add</v-icon>
          <span>اضافة طالب</span>
        </v-btn>

        <v-btn
          color="secondary"
          class="mr-5"
          depressed
          v-show="selectedStudents.length > 0"
          @click="addSubjectDialog = true"
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
        show-select
        v-model="selectedStudents"
        item-key="studentId"
        class="transparent elevation-0"
      >
        <template #[`item.subjects`]="{ item, index }">
          <div
            class="popover"
            :id="`popover-${index}`"
            v-if="item.subjects.length > 0"
          >
            <div
              class="popover-activator"
              :id="`activator-${index}`"
              @click.stop="PopOvers($event)"
            >
              <v-icon>info</v-icon>
              <span>
                {{ item.subjects.length }}
                {{ item.subjects.length >= 2 ? "مواد" : "مادة" }}
              </span>
            </div>

            <div class="popover-content">
              <ul class="popover-list">
                <li v-for="list in item.subjects" :key="list.studentSubjectId">
                  {{ list.subjectName }}
                  <v-spacer></v-spacer>
                  <v-icon
                    small
                    class="mr-2"
                    :title="`حذف ${list.subjectName} من الطالب ${item.studentName}`"
                    color="white"
                    @click="DeleteSubjectFromStudent(list.studentSubjectId)"
                  >
                    delete
                  </v-icon>
                </li>
              </ul>
            </div>
          </div>

          <v-chip color="warning" v-else> لا يوجد مواد </v-chip>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editStudent(item)"
            :title="`تعديل ${item.studentName}`"
          >
            edit
          </v-icon>
          <v-icon
            small
            class="mr-2"
            @click="confirmDeleteStudent(item)"
            :title="`حذف ${item.studentName}`"
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
      newStudentDialog: false,
      updateStudentDialog: false,
      addSubjectDialog: false,
      addSubjectForm: false,
      newStudentForm: false,
      updateStudentForm: false,
      subjectId: "",
      search: "",
      studentClass: "",
      studentName: "",
      studentId: "",
      updateStudentClass: "",
      items: [],
      classes: [],
      subjects: [],
      selectedStudents: [],
      showSelection: false,
      headers: [
        {
          text: "#",
          align: "start",
          sortable: false,
          value: "studentId",
        },
        {
          text: "اسم الطالب",
          align: "start",
          sortable: false,
          value: "studentName",
        },
        {
          text: "الصف",
          align: "start",
          sortable: false,
          value: "className",
        },
        {
          text: "عدد المواد",
          align: "start",
          sortable: false,
          value: "subjects",
        },
        {
          text: "تاريخ انشاء الحساب",
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
    };
  },

  created() {
    this.GetStudents();
    this.GetClasses();
    this.GetSubjects();
  },

  methods: {
    async GetStudents() {
      try {
        const response = await this.axios.get(`students`);
        this.items = response.data;
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

    async GetSubjects() {
      try {
        const subjects = await this.axios.get(`subjects`);
        this.subjects = subjects.data;
      } catch (error) {
        console.log(error);
      }
    },

    async DeleteSubjectFromStudent(id) {
      try {
        const subject = await this.axios.delete(`students/subjects/${id}`);
        this.GetStudents();
        console.log(subject);
      } catch (error) {
        console.log(error);
      }
    },

    async addSubjectToStudent() {
      try {
        if (this.$refs.addSubjectRef.validate()) {
          const adSubjects = await this.axios.post("students/subjects", {
            studentIds: this.selectedStudents.map((item) => {
              return {
                studentId: item.studentId,
              };
            }),
            subjectId: this.subjectId,
          });

          this.GetStudents();
          this.addSubjectDialog = false;
          this.selectedStudents = [];
        }
      } catch (error) {
        console.log(error);
      }
    },

    async newStudent() {
      try {
        if (this.$refs.addStudentRef.validate()) {
          const newStudent = await this.axios.post("students", {
            studentName: this.studentName,
            idClass: this.studentClass,
          });

          console.log(newStudent);
          this.GetStudents();
          this.newStudentDialog = false;
          this.studentName = "";
          this.studentClass = "";
        }
      } catch (error) {
        console.log(error);
      }
    },

    editStudent(item) {
      this.updateStudentDialog = true;
      this.studentClass = item.StudentClasses[0].idClass;
      this.studentName = item.studentName;
      this.updateStudentClass = item.StudentClasses[0].studentClassId;
      this.studentId = item.studentId;
    },

    async UpdateStudent() {
      try {
        if (this.$refs.updateStudentRef.validate()) {
          const updateStudent = await this.axios.put(
            `students/${this.studentId}`,
            {
              studentName: this.studentName,
              idClass: this.studentClass,
              updatedClassId: this.updateStudentClass,
            }
          );

          this.GetStudents();
          this.updateStudentDialog = false;
          this.studentName = "";
          this.studentClass = "";
          this.updateStudentClass = "";
        }
      } catch (error) {
        console.log(error);
      }
    },

    async confirmDeleteStudent(item) {
      this.$toasted.error("هل تريد حذف الطالب ؟", {
        theme: "outline",
        position: "bottom-center",
        duration: 6000,
        action: [
          {
            text: "حذف الاستاذ",
            onClick: () => {
              this.deleteStudent(item);
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

    async deleteStudent(item) {
      let studentId = item.studentId;
      let classStudentId = item.StudentClasses[0].studentClassId;
      let subjectStudentId = item.Studentsubjects.map((item) => {
        return item.studentSubjectId;
      });

      try {
        const deleteStudent = await this.axios.delete(`students/${studentId}`, {
          studentClassId: classStudentId,
          studentSubjectId: subjectStudentId,
        });

        console.log(deleteStudent);
        this.GetStudents();
      } catch (error) {
        console.log(error);
      }
    },

    PopOvers(event) {
      const activator = document.getElementById(event.target.id);
      const content = document.querySelector(
        `#${event.target.offsetParent.id} .popover-content`
      );
      const { right, top } = activator.getBoundingClientRect();
      const centerX = right + activator.outerWidth / 2;
      const centerY = top + activator.outerHeight / 2;

      content.style.right = `${centerX}px`;
      content.style.top = `${centerY + 15}px`;
      content.style.maxWidth = "350px";

      //   document.querySelectorAll('.popover-content').forEach(el => el.classList.remove('active'));
      content.classList.contains("active")
        ? content.classList.remove("active")
        : content.classList.add("active");
    },
  },
};
</script>

<style lang="scss">
.popover {
  position: relative;

  &-activator {
    display: inline-block;
    position: relative;
    cursor: pointer;
    margin-right: 10px;

    span,
    i {
      user-select: none;
      pointer-events: none;
    }
  }

  &-content {
    display: block;
    position: fixed;
    width: 100%;
    padding: 10px;
    background-color: var(--v-primary-base);
    border: 1px solid var(--v-primary-darken1);
    border-radius: 4px;
    transform: translateY(-20%);
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    visibility: hidden;
    opacity: 0;
    transition: all 0.3s ease-in-out;
    z-index: 1000;

    .popover-list {
      display: block;
      padding: 0 !important;
      margin: 0 !important;
      list-style: none;
      width: 100%;

      li {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 0.5em;
        margin-inline: auto;
        border-bottom: 1px solid rgba(black, 0.12);
        color: white;

        i {
          color: white;
        }

        &:last-child {
          border-bottom: none;
        }
      }
    }

    &.active {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>