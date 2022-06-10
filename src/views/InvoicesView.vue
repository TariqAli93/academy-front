<template>
  <div class="invoicesPage">
    <v-card elevation="0" class="mb-5">
      <v-toolbar elevation="0" class="transparent">
        <v-toolbar-title>
          <span class="primary--text text-3">الفواتير</span>
        </v-toolbar-title>

        <v-spacer />

        <v-btn color="primary" class="mr-5" depressed @click="openCreate">
          <v-icon>add</v-icon>
          <span>اضافة فواتير</span>
        </v-btn>
      </v-toolbar>
    </v-card>

    <v-card elevation="0">
      <v-data-table
        :items="invoices"
        :headers="headers"
        class="transparent elevation-0"
      >
        <template #[`item.totalCoursePrice`]="{ item }">
          {{ item | courseTotalPrice }}
        </template>

        <template #[`item.discount`]="{ item, index }">
          {{ item | discount(item.courses[index]) }}
        </template>

        <template #[`item.amount`]="{ item }">
          {{ item.amount | currency }}
        </template>

        <template #[`item.remaining`]="{ item }">
          {{ (item.remaining - item.discount) | currency }}
        </template>

        <template #[`item.createdAt`]="{ item }">
          {{ item.createdAt | date }}
        </template>

        <template #[`item.courses.length`]="{ item }">
          {{ item.courses.length | tafqeet }}
        </template>

        <template #[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="print(item)"> print </v-icon>
          <v-icon small class="mr-2" @click="remove(item)"> delete </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <createComponent />
  </div>
</template>

<script>
import moment from "moment";
import tafqeet from "@/plugins/Tafqeet";
import { bus } from "@/main";
import billPrint from "@/plugins/billExport";

import createComponent from "@/components/invoices/create.vue";
export default {
  name: "invoicesPage",
  data() {
    return {
      headers: [
        {
          text: "#",
          value: "invoiceId",
          sortable: false,
          align: "start",
        },

        {
          text: "اسم الطالب",
          value: "student",
          sortable: false,
          align: "start",
        },

        {
          text: "عدد الكورسات",
          value: "courses.length",
          sortable: false,
          align: "start",
        },
        {
          text: "مجموع سعر الكورسات",
          value: "totalCoursePrice",
          sortable: false,
          align: "start",
        },

        {
          text: "مبلغ الخصم",
          value: "discount",
          sortable: false,
          align: "start",
        },

        {
          text: "المبلغ الواصل",
          value: "amount",
          sortable: false,
          align: "start",
        },

        {
          text: "المبلغ المتبقي",
          value: "remaining",
          sortable: false,
          align: "start",
        },

        {
          text: "تاريخ انشاء الفاتورة",
          value: "createdAt",
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
      invoices: [],
    };
  },

  components: {
    createComponent,
  },

  filters: {
    courseTotalPrice(value) {
      const price = value.courses.reduce((acc, course) => {
        return acc + course.coursePrice * 1;
      }, 0);

      return price.toLocaleString("ar-AE", {
        style: "currency",
        currency: "IQD",
      });
    },

    currency(value) {
      const price = value * 1;
      return price.toLocaleString("ar-AE", {
        style: "currency",
        currency: "IQD",
      });
    },

    date(value) {
      return moment(value).format("DD/MM/YYYY");
    },

    tafqeet(value) {
      return tafqeet(value);
    },

    discount(item) {
      return item.discount.toLocaleString("ar-AE", {
        style: "currency",
        currency: "IQD",
      });
    },
  },

  methods: {
    async fetch() {
      try {
        const { data } = await this.axios.get("invoices");
        this.invoices = data.data;
      } catch (error) {
        console.error(error);
      }
    },

    remove(item) {
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
        await this.axios.delete(`invoices/${id}`);
        this.fetch();
      } catch (error) {
        console.error(error);
      }
    },

    print(item) {
      const data = {
        invoiceId: item.invoiceId,
        remaining: item.remaining - item.discount,
        courses: item.courses.map((c) => {
          return {
            courseName: c.courseName,
            coursePrice: c.coursePrice,
          };
        }),
        student: item.student,
        createdAt: item.createdAt,
        discount: item.discount,
        amount: item.amount,
        totalCoursePrice: item.courses.reduce((acc, course) => {
          return acc + course.coursePrice * 1;
        }, 0),
      };

      billPrint(data);
    },

    openCreate() {
      bus.$emit("open-create");
    },
  },

  mounted() {
    bus.$on("invoice-created", () => {
      this.fetch();
    });
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