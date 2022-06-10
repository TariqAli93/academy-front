<template>
  <v-dialog v-model="createDialog" persistent max-width="650px">
    <v-card>
      <v-card-title>
        <span class="text-h5">اضافة مادة للكورس</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="createFormRef" v-model="createFormModel" lazy-validation @submit.prevent="upsert">
            <v-row>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-select
                  :items="subjects.list"
                  item-text="subjectFullName"
                  item-value="subjectId"
                  label="المادة"
                  :rules="rules"
                  v-model="subjects.id"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-select
                  :items="teachers.list"
                  item-text="teacherName"
                  item-value="teacherId"
                  label="الاستاذ"
                  :rules="rules"
                  v-model="teachers.id"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-select
                  :items="halls.list"
                  item-text="hallName"
                  item-value="hallId"
                  label="القاعة"
                  :rules="rules"
                  v-model="halls.id"
                ></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-btn color="success" :disabled="!createFormModel" @click="upsert">
          حفظ البيانات
        </v-btn>

        <v-btn color="error" @click="createDialog = false"> إلغاء الامر </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { bus } from "@/main";
export default {
  data: () => ({
    createFormModel: false,
    createDialog: false,
    rules: [(v) => !!v || "لا يمكنك ترك الحقل فارغ"],
    subjects: {
      id: null,
      list: [],
    },
    halls: {
      id: null,
      list: [],
    },
    teachers: {
      id: null,
      list: [],
    },

    idCourse: null,
    subjectCourseId: undefined,
  }),

  created() {
    bus.$on("open-add-subject", (item) => {
      this.createDialog = true;
      this.idCourse = item.courseId;

      if (item.SubjectCourse.length > 0) {
        this.halls.id = item.SubjectCourse[0].idHall;
        this.teachers.id = item.SubjectCourse[0].idTeacher;
        this.subjects.id = item.SubjectCourse[0].idSubject;
        this.subjectCourseId = item.SubjectCourse[0].subjectCourseId;
      } else {
        this.halls.id = null;
        this.teachers.id = null;
        this.subjects.id = null;
      }
    });

    this.fetchData();
  },

  methods: {
    async fetchData() {
      try {
        const subjects = await this.axios.get("subjects");
        const halls = await this.axios.get("halls");
        const teachers = await this.axios.get("teachers");

        this.subjects.list = subjects.data.data;
        this.halls.list = halls.data;
        this.teachers.list = teachers.data.data;
      } catch (error) {
        console.error(error);
      }
    },
    async upsert() {
      const data = {
        idSubject: this.subjects.id,
        idCourse: this.idCourse,
        idTeacher: this.teachers.id,
        idHall: this.halls.id,
        updatedAt: new Date().toISOString(),
        subjectCourseId: this.subjectCourseId,
      };

      if (this.$refs.createFormRef.validate()) {
        try {
          await this.axios.post("subjectCourse", data);
          this.createDialog = false;
          this.$refs.createFormRef.reset();
          this.subjects.id = null;
          this.teachers.id = null;
          this.halls.id = null;
          this.fetchData();

          bus.$emit("subject-course-added");
        } catch (error) {
          console.error(error);
        }
      }
    },
  },
};
</script>

<style>
</style>