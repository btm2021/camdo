<template>
  <b-row>
    <b-col cols="12" class="mt-3">
      <b-row no-gutters>
        <b-col cols="4">
          <b-button variant="primary" @click="intemSingle"
            >In Tem Cầm đồ đã chọn
          </b-button>

          <b-button variant="success" @click="selectAllRow"
            >Chọn tất cả</b-button
          ></b-col
        >

        <b-col cols="12" class="min-vw-100">
          <b-table
            caption="Sản phẩm chưa in tem"
            caption-top
            style="min-height: 400px"
            class="my_table align-middle w-auto"
            responsive
            bordered
            small
            no-border-collapse
            ref="my_table"
            :busy="tableOverlay"
            :items="myProvider"
            show-empty
            select-mode="multi"
            selectable
            head-row-variant="success"
            :fields="tableField"
            @row-dblclicked="
              cellClick(arguments[0], arguments[1], arguments[2])
            "
            @row-selected="onRowSelected"
          >
            <template #cell(index)="data">
              {{ data.index + 1 }}
            </template>
            <template #cell(invoice_tag)="data">
              <b-badge
                v-for="(item, index) in data.value"
                :key="index"
                variant="primary"
                >{{ item }}</b-badge
              >
            </template>
            <template #cell(invoice_money)="data">
              <div class="textLeft">{{ data.value }}</div>
            </template>
            <template #cell(ngaycam)="data">
              <!-- `data.value` is the value after formatted by the Formatter -->
              {{ getNgay(data.item.ngaycam) }}
            </template>
            <template #cell(invoice_profit)="data">
              <div class="textLeft">{{ $formatN(data.value) }}</div>
            </template>
            <template #cell(invoice_date_get)="data">
              <span v-if="data.item.invoice_status">
                {{ $moment(data.item.invoice_date_get).format("DD/MM/YYYY") }}
              </span>
              <span v-else>
                <b-badge variant="success">Chưa chuộc</b-badge>
              </span>
            </template>
            <template #cell(invoice_count)="data">
              <div
                class=""
                v-b-tooltip.hover
                :title="
                  data.value < 90
                    ? 'Thời gian thế dưới 3 tháng, an toàn'
                    : data.value > 90 && data.value < 180
                    ? 'Thời gian thế 3-6 tháng, lưu ý'
                    : 'Thời gian thế trên 6 tháng, nguy hiểm'
                "
              >
                <span
                  v-if="data.item.invoice_status"
                  style="text-align: left !important"
                >
                  <b-icon
                    icon="backspace-reverse-fill"
                    variant="primary"
                  ></b-icon>
                </span>
                <span v-else>
                  <b-icon
                    icon="backspace-reverse-fill"
                    variant="success"
                  ></b-icon>
                </span>
                {{ data.value }}

                <b-icon
                  v-if="data.value < 90"
                  icon="exclamation-circle-fill"
                  variant="success"
                ></b-icon>
                <b-icon
                  v-if="data.value > 90 && data.value < 180"
                  icon="exclamation-circle-fill"
                  variant="warning"
                ></b-icon>
                <b-icon
                  v-if="data.value > 180"
                  icon="exclamation-circle-fill"
                  variant="danger"
                ></b-icon>
              </div>
            </template>
            <template #cell(tool)="data">
              <!-- `data.value` is the value after formatted by the Formatter -->
              <b-button
                size="sm"
                variant="primary"
                @click="deleteItem(data.item.id)"
                >Xóa</b-button
              >
            </template>
            <template #cell(invoice_status)="data">
              <!-- `data.value` is the value after formatted by the Formatter -->

              <center>
                <span v-if="data.item.invoice_status">
                  <!-- da chuoc -->
                  <b-badge variant="primary">Đã chuộc</b-badge>
                </span>
                <span v-else>
                  <b-badge variant="success">Chưa chuộc</b-badge>
                </span>
              </center>
            </template>
            <template #head()="scope">
              <div class="text-nowrap">{{ scope.label }}</div>
            </template>
            <template #table-busy>
              <div class="text-center text-danger my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>Chờ xíu...</strong>
              </div>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
export default {
  data() {
    return {
      selected: [],
      currentPage: 1,
      totalRows: 0,
      perPage: 200,
      tableField: [
        {
          key: "index",
          label: "#",
          thStyle: { width: "2%", textAlign: "center" },
        },
        {
          key: "customer_name",
          label: "Tên",
          sortable: true,
          stickyColumn: true,
          thClass: "myThClass",
        },
        {
          key: "invoice_number",
          label: "Mã số",
          sortable: true,

          thClass: "myThClass20percent",
        },
        {
          key: "invoice_date_create",
          label: "Ngày cầm",
          sortable: true,
          thClass: "myThClass20percent",
          formatter: (value) => {
            //yyyy/mm/dd
            //  console.log(value);
            let date = value.split("-");
            let newDate = new Date(date[0], date[1] - 1, date[1]);
            let newDateStr = `${date[2]}/${date[1]}/${date[0]}`;
            return newDateStr;
          },
        },
        {
          key: "invoice_tag",
          label: "Sản phẩm",
          sortable: true,
          formatter: (value) => {
            let arr = JSON.parse(value);
            return arr;
          },
          thClass: "myThClass500px",
        },
        {
          key: "invoice_date_get",
          label: "Ngày chuộc",
          sortable: true,
          thClass: "myThClass",
        },
        {
          key: "invoice_money",
          sortable: true,
          label: "Số tiền",

          thClass: "myThClass",
          formatter: (value) => {
            return this.$formatN(value);
          },
        },
        {
          key: "invoice_status",
          sortable: true,
          label: "Tình trạng",
          thClass: "myThClass",
        },

        {
          key: "invoice_cat",
          label: "Loại thế",
          sortable: true,
          thClass: "myThClass",
        },

        {
          key: "invoice_type",
          sortable: true,
          label: "Phân loại",
          thClass: "myThClass",
          formatter: (value, key, item) => {
            return value;
          },
        },
        {
          key: "invoice_comment",
          sortable: true,
          label: "Ghi chú",
          thClass: "myThClass",
          formatter: (value, key, item) => {
            if (value && value.trim().length > 0) {
              return value;
            } else {
              return "không";
            }
          },
        },
        {
          key: "invoice_store",
          sortable: true,
          label: "Loại lưu kho",
          thClass: "myThClass",
        },
        {
          key: "invoice_store_type",
          sortable: true,
          label: "Nơi Lưu",
          thClass: "myThClass",
        },
        {
          key: "invoice_phone",
          sortable: true,
          label: "Phone",
          thClass: "myThClass",
          formatter: (value, key, item) => {
            if (value && value.trim().length > 0) {
              return value;
            } else {
              return "không";
            }
          },
        },
      ],
      allListData: null,
      tableOverlay: false,
    };
  },
  methods: {
    selectAllRow() {
      this.$refs["my_table"].selectAllRows();
    },
    async myProvider(ctx) {
      this.tableOverlay = true;
      try {
        let query = this.$supabase
          .from("invoice")
          .select("*")
          .eq("invoice_label", false)
          .order("invoice_number", { ascending: ctx.sortDesc });

        let item = await query;
        let result = item.data;
        this.allListData = item.data;
        let newResult = [];
        result.forEach((item) => {
          if (item.invoice_date_get != null) {
            item.invoice_date_get_beauty = this.formatDay(
              item.invoice_date_get
            );
          }
          item.invoice_date_create_beauty = this.formatDay(
            item.invoice_date_create
          );
          item.invoice_number_beauty = item.invoice_number;
          newResult.push(item);
        });
        this.tableOverlay = false;
        return newResult;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    async intemSingle() {
      if (this.selected.length > 0) {
        let list_tem = this.selected.map((item) => {
          return {
            maso: item.invoice_number,
            tien: item.invoice_money,
            ten: item.customer_name,
            ngay: item.invoice_date_create,
            id: item.id,
          };
        });
        this.$pnPublish(
          {
            channel: "printserver",
            message: { type: "ingiaythe", list: list_tem },
          },
          (status, response) => {
            if (status.error) {
              console.log(status);
            } else {
              alert("Chờ máy in ra tem ra rồi hẵn bấm OK");
              this.$refs["my_table"].refresh();
              this.select = [];
              console.log("Message Published", response);
            }
          }
        );
      }
    },
    onRowSelected(items) {
      this.selected = items;
    },
    formatDay(d) {
      let n = this.$moment(d);
      return n.format("DD/MM/YYYY");
    },
  },
};
</script>

<style>
</style>