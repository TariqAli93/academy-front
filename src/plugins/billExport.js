import * as ExcelJS from 'exceljs';
import settings from '@/settings';
import tafqeet from '@/plugins/Tafqeet';

const bill = (item) => {
    console.log(item);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(
        `الفاتورة رقم ${item.invoiceId} - ${item.student}`
    );
    worksheet.views = [{ rightToLeft: true }];
    worksheet.getCell(`A1`).value = settings.appName; // Assign title to cell A1 -- THIS IS WHAT YOU'RE LOOKING FOR.
    worksheet.mergeCells("A1:C1"); // Extend cell over all column headers
    worksheet.getCell(`A1`).alignment = { horizontal: "center" }; // Horizontally center your text
    worksheet.getCell(`A2`).value = `التاريخ: ${item.createdAt}`; // Assign title to cell A1 -- THIS IS WHAT YOU'RE LOOKING FOR.
    worksheet.getCell(`B2`).value = `رقم الفاتورة: ${item.invoiceId}`; // Assign title to cell A1 -- THIS IS WHAT YOU'RE LOOKING FOR.
    worksheet.getCell(`C2`).value = `اسم الطالب: ${item.student}`; // Assign title to cell A1 -- THIS IS WHAT YOU'RE LOOKING FOR.
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
        "اسم الكورس",
        "سعر الكورس",
        "سعر الكورس كتابة",
    ];
    worksheet.columns = [
        { key: "courseName", width: 55 },
        { key: "coursePrice", width: 55 },
        { key: "coursePriceText", width: 55 },
    ];
    item.courses.forEach((course) => {
        worksheet.addRow({
            ...course,
            coursePriceText: `${tafqeet(course.coursePrice)} دينار عراقي`,
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
    if (item.courses.length > 0) {
        let lastRowAfterData = item.courses.length + 5;
        worksheet.getRow(lastRowAfterData).values = [
            "سعر الفاتورة",
            "الخصم على الفاتورة",
        ];

        worksheet.getRow(lastRowAfterData + 1).values = [
            `${item.totalCoursePrice} - ${tafqeet(item.totalCoursePrice)} دينار عراقي`,
            `${item.discount} - ${tafqeet(item.discount)} دينار عراقي`,
        ];

        worksheet.getRow(lastRowAfterData + 3).values = [
            "المبلغ الواصل",
            "المبلغ المتبقي",
            'الملاحظات',
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
}

export default bill