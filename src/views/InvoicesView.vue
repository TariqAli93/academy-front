<template>
  <div class="invoicesPage">
    <v-dialog
      v-model="newInvoiceDialog"
      persistent
      max-width="500px"
      transition="slide-y-transition"
    >
      <v-card elevation="0">
        <v-toolbar elevation="0" class="transparent border-bottom">
          <v-toolbar-title>اضافة فاتورة جديدة</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.stop="newInvoiceDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-divider />

        <v-card-text class="mt-5">
          <v-form
            ref="createRef"
            v-model="createForm"
            lazy-validation
            @submit.prevent="createInvoice"
          >
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="studentId"
                  label="الطالب"
                  required
                  outlined
                  dense
                  :items="students"
                  item-text="studentName"
                  item-value="studentId"
                  :rules="[(v) => !!v || 'الرجاء اختيار الطالب']"
                  return-object
                  @change="getStudentInfo($event)"
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="amount"
                  label="المبلغ الواصل"
                  required
                  outlined
                  dense
                  :rules="[(v) => !!v || 'الرجاء ادخال المبلغ الواصل']"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="discount"
                  label="الخصم"
                  required
                  outlined
                  dense
                  :rules="[(v) => !!v || 'الرجاء إدخال قيمة الخصم']"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-btn
              block
              large
              color="primary"
              depressed
              :disabled="!createForm"
              type="submit"
            >
              اضافة الفاتورة
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-card elevation="0" class="mb-5">
      <v-toolbar elevation="0" class="transparent">
        <v-toolbar-title>
          <span class="primary--text text-3">الفواتير</span>
        </v-toolbar-title>

        <v-spacer />

        <v-text-field
          outlined
          v-model="search"
          label="ابحث عن فاتورة"
          dense
          color="primary"
          hide-details
        ></v-text-field>

        <v-btn
          color="primary"
          class="mr-5"
          depressed
          @click="newInvoiceDialog = true"
        >
          <v-icon>add</v-icon>
          <span>اضافة فواتير</span>
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
        <template #[`item.subjects`]="{ item, index }">
          <div class="popover" :id="`popover-${index}`">
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
                  <v-spacer />
                  <span style="font-size: 10px">{{
                    list.subjectPrice | taf
                  }}</span>
                </li>
              </ul>
            </div>
          </div>
        </template>

        <template #[`item.price`]="{ item }">
          <span class="text-right">{{ item.price | taf }}</span>
        </template>

        <template #[`item.discount`]="{ item }">
          
          <span class="text-right" v-if="item.discount === 0">
            <v-chip color="warning">لا يوجد</v-chip>
          </span>
          <span class="text-right" v-else>{{ item.discount }} - {{ item.discount | taf }}</span>
        </template>

        <template #[`item.totalPrice`]="{ item }">
          <span class="text-right">{{ item.totalPrice | taf }}</span>
        </template>

        <template #[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="confirmDelete(item)"
            :title="`حذف الفاتورة رقم ${item.invoiceId}`"
          >
            delete
          </v-icon>

          <v-icon
            small
            class="mr-2"
            @click="exportInvoice(item)"
            :title="`تصدير الفاتورة رقم ${item.invoiceId}`"
          >
            print
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import tafqeet from "@/plugins/Tafqeet.js";
const ExcelJS = require("exceljs");
export default {
  name: "invoicesPage",
  data() {
    return {
      search: "",
      newInvoiceDialog: false,
      createForm: false,
      discount: 0,
      classId: "",
      studentId: "",
      invoiceId: "",
      remaining: "",
      amount: "",
      headers: [
        {
          text: "#",
          value: "invoiceId",
          sortable: false,
          align: "start",
        },

        {
          text: "اسم الاستاذ",
          value: "studentName",
          sortable: false,
          align: "start",
        },

        {
          text: "تاريخ انشاء الفاتورة",
          value: "invoiceDate",
          sortable: false,
          align: "start",
        },

        {
          text: "المواد",
          value: "subjects",
          sortable: false,
          align: "start",
        },

        {
          text: "السعر",
          value: "price",
          sortable: false,
          align: "start",
        },

        {
          text: "قيمة الخصم",
          value: "discount",
          sortable: false,
          align: "start",
        },

        {
          text: "السعر الكلي",
          value: "totalPrice",
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
      students: [],
      subjects: [],
    };
  },

  filters: {
    taf(num) {
      return `${tafqeet(num)} دينار عراقي`;
    },
  },

  methods: {
    async GetInvoices() {
      try {
        const invoices = await this.axios.get("invoices");
        this.items = invoices.data;
        console.log(invoices);
      } catch (error) {
        console.log(error);
      }
    },

    async createInvoice() {
      try {
        if (this.$refs.createRef.validate()) {
          if (this.subjects.length > 0) {
            const invoice = await this.axios.post("invoices", {
              discount: this.discount * 1,
              amount: this.amount * 1,
              remaining: this.remaining - this.amount * 1,
              idClass: this.classId,
              idStudent: this.studentId.studentId,
              idSubject: this.subjects,
            });
            this.GetInvoices();
            this.newInvoiceDialog = false;
          } else {
            this.$toasted.error(
              "لا يمكنك انشاء الفاتورة لهذا الطالب لعدم وجود اي مادة لديه",
              {
                position: "top-center",
                duration: 6000,
              }
            );
          }
        }
      } catch (error) {
        console.log(error.response);
      }
    },

    exportInvoice(item) {
      console.log(item);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(
        `الفاتورة رقم ${item.invoiceId} - ${item.studentName}`
      );
      worksheet.views = [{ rightToLeft: true }];

      worksheet.getCell(`A1`).value = "اسم المعهد"; // Assign title to cell A1 -- THIS IS WHAT YOU'RE LOOKING FOR.
      worksheet.mergeCells("A1:C1"); // Extend cell over all column headers
      worksheet.getCell(`A1`).alignment = { horizontal: "center" }; // Horizontally center your text

      worksheet.getCell(`A2`).value = `التاريخ: ${item.invoiceDate}`; // Assign title to cell A1 -- THIS IS WHAT YOU'RE LOOKING FOR.
      worksheet.getCell(`B2`).value = `رقم الفاتورة: ${item.invoiceId}`; // Assign title to cell A1 -- THIS IS WHAT YOU'RE LOOKING FOR.
      worksheet.getCell(`C2`).value = `اسم الطالب: ${item.studentName}`; // Assign title to cell A1 -- THIS IS WHAT YOU'RE LOOKING FOR.

      worksheet.getRow(1).eachCell((cell) => {
        cell.font = {
          name: "Comic Sans MS",
          family: 4,
          size: 20,
          underline: false,
          bold: true,
          color: "FFFFFF", 
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "1b6bb6",
          },
        };
      });

      worksheet.getRow(3).values = [
        "اسم المادة",
        "سعر المادة",
        "سعر المادة مكتوبا",
      ];

      worksheet.columns = [
        { key: "subjectName", width: 55 },
        { key: "subjectPrice", width: 55 },
        { key: "subjectPriceText", width: 55 },
      ];

      item.subjects.forEach((subject) => {
        worksheet.addRow({
          ...subject,
          subjectPriceText: `${tafqeet(subject.subjectPrice)} دينار عراقي`,
        });
      });

      worksheet.getRow(2).eachCell((cell) => {
        cell.font = {
          name: "Comic Sans MS",
          family: 4,
          size: 14,
          underline: false,
          bold: true,
        };
      });

      worksheet.getRow(3).eachCell((cell) => {
        cell.font = {
          name: "Comic Sans MS",
          family: 4,
          size: 14,
          underline: false,
          bold: true,
        };
      });

      worksheet.columns.forEach((column) => {
        column.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      if (item.subjects.length > 0) {
        let lastRowAfterData = item.subjects.length + 5;
        worksheet.getRow(lastRowAfterData).values = [
          "سعر الفاتورة",
          "الخصم على الفاتورة",
          "السعر الكلي بعد الخصم",
        ];

        worksheet.getRow(lastRowAfterData + 3).values = [
          "المبلغ الواصل",
          "المبلغ المتبقي",
          'الملاحظات',
        ];

        worksheet.getRow(lastRowAfterData + 1).values = [
          `${item.price} - ${tafqeet(item.price)} دينار عراقي`,
          `${item.discount} - ${tafqeet(item.discount)} دينار عراقي`,
          `${item.totalPrice} - ${tafqeet(item.totalPrice)} دينار عراقي`,
        ];

        worksheet.getRow(lastRowAfterData + 4).values = [
          `${item.amount} - ${tafqeet(item.amount)} دينار عراقي`,
          `${item.remaining} - ${tafqeet(item.remaining)} دينار عراقي`,
        ];

        worksheet.getRow(lastRowAfterData).eachCell((cell) => {
          cell.font = {
            name: "Comic Sans MS",
            family: 4,
            size: 16,
            underline: false,
            bold: true,
            color: "FFFFFF",
          };
        });

        worksheet.getRow(lastRowAfterData + 1).eachCell((cell) => {
          cell.font = {
            name: "Comic Sans MS",
            family: 2,
            size: 11,
            underline: false,
            bold: false,
          };

          cell.alignment = {
            horizontal: "right",
          };
        });

        worksheet.getRow(lastRowAfterData + 3).eachCell((cell) => {
          cell.font = {
            name: "Comic Sans MS",
            family: 4,
            size: 16,
            underline: false,
            bold: true,
            color: "FFFFFF",
          };
        });

        worksheet.getRow(lastRowAfterData + 4).eachCell((cell) => {
          cell.font = {
            name: "Comic Sans MS",
            family: 2,
            size: 11,
            underline: false,
            bold: false,
          };

          cell.alignment = {
            horizontal: "right",
          };
        });
      }

      workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.setAttribute("style", "display: none");
        a.href = url;
        a.download = `فاتورة رقم - ${item.invoiceId}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      });
    },

    async GetStudents() {
      try {
        const students = await this.axios.get("students");
        this.students = students.data;
      } catch (error) {
        console.log(error);
      }
    },

    getStudentInfo(event) {
      this.classId = event.StudentClasses[0].class.classId;
      this.subjects = event.Studentsubjects.map((subject) => subject.idSubject);
    },

    confirmDelete(item) {
      this.$toasted.error("هل تريد حذف الفاتورة ؟", {
        theme: "outline",
        position: "bottom-center",
        duration: 6000,
        action: [
          {
            text: "حذف الفتورة",
            onClick: () => {
              this.deleteInvoice(item.invoiceId);
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

    async deleteInvoice(id) {
      try {
        const invoice = await this.axios.delete(`invoices/${id}`);
        console.log(invoice);
        this.GetInvoices();
      } catch (error) {
        console.log(error.response);
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

  mounted() {
    this.GetInvoices();
    this.GetStudents();
  },
};
</script>

<style lang="scss">
.border-bottom {
  border-color: rgba(black, 0.12) !important;
  border-bottom: 1px solid rgba(black, 0.12) !important;
}
</style>