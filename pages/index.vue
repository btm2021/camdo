<template>
  <div>
    <div>
      <b-card>
        <b-card-body>
          <b-row style="text-align: center">
            <b-col cols="2">
              Tên
              <b-input
                style="text-transform: uppercase; text-align: center"
                v-model="filter_ten"
                autocomplete="off"
                type="search"
                @change="refreshTable()"
              ></b-input>
            </b-col>
            <b-col cols="5">
              <b-row>
                <b-col cols="6">
                  Ngày bắt đầu
                  <b-input
                    type="search"
                    autocomplete="off"
                    v-model="filter_ngaycam_start"
                    @change="refreshTable()"
                  ></b-input>
                </b-col>
                <b-col cols="6">
                  Ngày kết thúc
                  <b-input
                    type="search"
                    autocomplete="off"
                    v-model="filter_ngaycam_end"
                    @change="refreshTable()"
                  ></b-input>
                </b-col>
              </b-row>
            </b-col>
            <b-col cols="5">
              <b-row>
                <b-col cols="6">
                  Số tiền đầu
                  <b-input
                    type="search"
                    autocomplete="off"
                    v-model="filter_sotien_start"
                    @change="refreshTable()"
                  ></b-input>
                  {{ formatN(filter_sotien_start * 1000) }}
                </b-col>
                <b-col cols="6">
                  Số tiền Kết thúc
                  <b-input
                    type="search"
                    autocomplete="off"
                    v-model="filter_sotien_end"
                    @change="refreshTable()"
                  ></b-input>
                  {{ formatN(filter_sotien_end * 1000) }}
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </div>
    <b-table
      class="ml-2"
      hover
      small
      ref="my_table"
      :busy="tableOverlay"
      :items="myProvider"
      show-empty
      :fields="tableField"
    >
      <template #cell(ngaycam)="data">
        <!-- `data.value` is the value after formatted by the Formatter -->
        {{ getNgay(data.item.ngaycam) }}
      </template>
      <template #cell(tool)="data">
        <!-- `data.value` is the value after formatted by the Formatter -->
        <b-button size="sm" variant="primary" @click="deleteItem(data.item.id)"
          >Xóa</b-button
        >
      </template>
      <template #table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Chờ xíu...</strong>
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filter_ten: "",
      filter_ngaycam_start: null,
      filter_ngaycam_end: null,
      filter_sotien_start: null,
      filter_sotien_end: null,

      tableOverlay: false,
      listData: [],
      tableField: [
        { key: "customer_name", label: "Tên" },
        { key: "invoice_number", label: "Mã số" },
        {
          key: "invoice_date_create",
          label: "Ngày cầm",
          formatter: (value) => {
            //yyyy/mm/dd
            console.log(value)
            let date = value.split("-");
            let newDate = new Date(date[0], date[1] - 1, date[1]);
            let newDateStr=`${date[2]}/${date[1]}/${date[0]}`
            return newDateStr;
          },
        },
        {
          key: "invoice_money",
          label: "Số tiền",
          formatter: (value) => {
            return this.formatN(value);
          },
        },
        {
          key: "tool",
          label: "Tool",
        },
      ],
    };
  },
  methods: {
    refreshTable() {
      this.$refs.my_table.refresh();
    },
    getNgayCam(ngayhople) {
      try {
        let ngay = ngayhople.split("/")[0];
        let thang = ngayhople.split("/")[1];
        let nam = ngayhople.split("/")[2];
        if (typeof ngay === "undefined" || ngay === "" || parseInt(ngay) > 31) {
          throw new Error("Ngày khong hop le");
        }
        if (
          typeof thang === "undefined" ||
          thang === "" ||
          parseInt(thang) > 12
        ) {
          throw new Error("Tháng khong hop le");
        }
        if (
          typeof nam === "undefined" ||
          nam === "" ||
          parseInt(nam) > 2050 ||
          parseInt(nam) < 2022
        ) {
          throw new Error("Năm khong hop le");
        }
        let ngayFinal = {
          isValid: true,
          toInsert: `${nam}/${thang}/${ngay}`,
          toFormat: `Ngày ${ngay} tháng ${thang} năm ${nam}`,
          toShort: `${ngay}/${thang}/${nam}`,
          msg: "ok",
        };
        return ngayFinal;
      } catch (err) {
        let errMsg = err.toString();
        console.log("==", errMsg, "==");
        if (
          errMsg == "Error: Ngày khong hop le" ||
          errMsg == "Error: Tháng khong hop le" ||
          errMsg == "Error: Năm khong hop le"
        ) {
          return {
            isValid: false,
            msg: "Ngày/tháng/năm không hợp lệ",
          };
        } else {
          return {
            isValid: false,
            msg: "",
          };
        }
      }
    },
    async myProvider(ctx) {
      this.tableOverlay = true;
      try {
        let query = this.$supabase
          .from("invoice")
          .select("id,customer_name,invoice_number,invoice_date_create,invoice_money")
          .limit(100);
        if (this.filter_ten && this.filter_ten.length > 1) {
          query = query.ilike("customer_name", `%${this.filter_ten}%`);
        }
        if (parseInt(this.filter_sotien_start) > 0) {
          query = query.gte(
            "invoice_money",
            parseInt(this.filter_sotien_start) * 1000
          );
        }
        if (parseInt(this.filter_sotien_end) > 0) {
          query = query.lte("invoice_money", parseInt(this.filter_sotien_end) * 1000);
        }

        //ngaystart
        if (
          this.filter_ngaycam_start &&
          this.filter_ngaycam_start.length > 1 &&
          this.getNgayCam(this.filter_ngaycam_start).isValid
        ) {
          let ngayStart = this.getNgayCam(this.filter_ngaycam_start);
          query = query.gte("invoice_date_create", ngayStart.toInsert);
        }

        if (
          this.filter_ngaycam_end &&
          this.filter_ngaycam_end.length > 1 &&
          this.getNgayCam(this.filter_ngaycam_end).isValid
        ) {
          let ngayEnd = this.getNgayCam(this.filter_ngaycam_end);
          query = query.lte("invoice_date_create", ngayEnd.toInsert);
        }
        let item = await query;
        let result = item.data;
        this.tableOverlay = false;
        return result;
      } catch (error) {
        return [];
      }
    },
    formatN(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    deleteItem(id) {
      this.tableOverlay = true;
      console.log(id);
      this.$supabase
        .from("invoice")
        .delete()
        .eq("id", id)
        .then((data) => {
          this.getData();
          this.$bvToast.toast(`Xóa đồ thế ${id} thành công`, {
            title: "Thông báo",
            autoHideDelay: 1000,
            appendToast: true,
            variant: "primary",
          });
        });
    },
    getNgay(x) {
      let date = x.split("-");
      let newDate = new Date(date[0], date[1] - 1, date[1]);
      return `${date[2]}/${date[1]}/${date[0]}`;
    },
    getData() {
      this.$supabase
        .from("invoice")
        .select("id,customer_name,invoice_number,invoice_date_create,invoice_money")
        .range(0, 20)
        .then((data) => {
          this.listData = data.data;
          this.tableOverlay = false;
        });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style>
</style>