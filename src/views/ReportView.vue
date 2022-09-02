<template>
  <div class="reportPage">
    <v-card elevation="0" class="mb-5">
      <v-toolbar elevation="0" class="transparent">
        <v-toolbar-title>
          <span class="primary--text text-3">التقارير</span>
        </v-toolbar-title>

        <v-spacer />

        <v-btn
          color="primary"
          class="mr-5"
          depressed
          @click="dateDialog = true"
        >
          <v-icon>add</v-icon>
          <span>انشاء تقرير</span>
        </v-btn>

        <v-btn
          color="secondary"
          class="mr-5"
          depressed
          @click="exportToExcel"
          v-show="reports.length > 0"
        >
          <v-icon>add</v-icon>
          <span>تصدير التقرير</span>
        </v-btn>
      </v-toolbar>
    </v-card>

    <v-dialog
      ref="dateDialog"
      v-model="dateDialog"
      :return-value.sync="date"
      persistent
      width="290px"
    >
      <v-date-picker v-model="date" scrollable range>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="dateDialog = false"> الغاء </v-btn>
        <v-btn text color="primary" @click="createReport"> حفظ </v-btn>
      </v-date-picker>
    </v-dialog>

    <v-card elevation="0">
      <v-data-table
        :items="reports"
        :headers="headers"
        class="transparent elevation-0"
        id="reportTable"
      >
        <template #[`item.remainingPercentage`]="{ item }">
          {{ item | countPercentage }}
        </template>

        <template #[`item.percentage`]="{ item }">
          {{ item.percentage + "%" }}
        </template>

        <template #[`item.academyPrice`]="{ item }">
          {{ item | countAcadmyPrice }}
        </template>

        <template #[`item.teacherPrice`]="{ item }">
          {{ item | countTeacherPrice }}
        </template>

        <template #[`item.coursePrice`]="{ item }">
          {{ item.coursePrice | currency }}
        </template>

        <template #[`item.discount`]="{ item }">
          {{ item.discount | currency }}
        </template>
      </v-data-table>
    </v-card>

    <a class="d-none" id="dlink"></a>
  </div>
</template>

<script>
import tableToExcel from "@/plugins/tableExport.js";
export default {
  data: () => ({
    headers: [
      { text: "اسم الكورس", value: "courseName", width: 230, sortable: false },
      { text: "سعر الكورس", value: "coursePrice", width: 150, sortable: false },
      {
        text: "المادة",
        value: "SubjectCourse[0].subject.subjectName",
        width: 230,
        sortable: false,
      },
      {
        text: "الاستاذ",
        value: "SubjectCourse[0].teacher.teacherName",
        width: 150,
        sortable: false,
      },
      {
        text: "عدد الطلاب",
        value: "StudentCourses.length",
        width: 150,
        sortable: false,
      },
      { text: "الخصم", value: "discount", width: 150, sortable: false },
      {
        text: "نسبة الاستاذ",
        value: "percentage",
        width: 150,
        sortable: false,
      },
      {
        text: "نسبة المعهد",
        value: "remainingPercentage",
        width: 150,
        sortable: false,
      },
      {
        text: "مستحقات المعهد",
        value: "academyPrice",
        width: 250,
        sortable: false,
      },
      {
        text: "مستحقات الاستاذ",
        value: "teacherPrice",
        width: 250,
        sortable: false,
      },
    ],

    reports: [],
    dateDialog: false,
    date: [],
  }),

  filters: {
    countPercentage(value) {
      if (value.percentage < 1) {
        return `100%`;
      } else {
        let teacherPercentage = value.percentage;

        return `${100 - teacherPercentage}%`;
      }
    },

    countAcadmyPrice(value) {
      if (value.percentage > 0 && value.StudentCourses.length > 0) {
        let studentCount = value.StudentCourses.length;
        let coursePrice = value.coursePrice;
        let discount = value.discount;
        let percent_amount =
          (value.percentage / 100) * coursePrice * studentCount;

        let academyPrice =
          coursePrice * studentCount - discount - percent_amount;

        return academyPrice.toLocaleString("ar-US", {
          style: "currency",
          currency: "IQD",
        });
      } else {
        return `لا يوجد`;
      }
    },

    countTeacherPrice(value) {
      if (value.percentage > 0 && value.StudentCourses.length > 0) {
        let studentCount = value.StudentCourses.length;
        let coursePrice = value.coursePrice;
        let discount = value.discount;
        let per_num = coursePrice * studentCount;
        let percent_amount = (value.percentage / 100) * per_num;

        let academyPrice =
          coursePrice * studentCount - discount - percent_amount;

        let teacherPrice = Math.abs(academyPrice - per_num);

        return teacherPrice.toLocaleString("ar-US", {
          style: "currency",
          currency: "IQD",
        });
      } else {
        return "لا يوجد";
      }
    },

    currency(value) {
      const price = value * 1;
      return price.toLocaleString("ar-US", {
        style: "currency",
        currency: "IQD",
      });
    },
  },

  methods: {
    async createReport() {
      try {
        if (this.date.length == 1) {
          this.date.push(new Date().toISOString());
        }
        this.$refs.dateDialog.save(this.date);

        const query = `fromDate=${this.date[0]}&toDate=${this.date[1]}`;

        const { data } = await this.axios.get(`reports?${query}`);

        this.reports = data;
      } catch (error) {
        console.error(error);
      }
    },

    exportToExcel() {
      tableToExcel("#reportTable table", "التقارير", "reports.xls");
    },
  },
};
</script>

<style>
</style>