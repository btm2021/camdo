<template>
  <div>
    <b-container class="mt-5">
      <h3>Thanh lý</h3>
      <b-input-group>
        <b-input
          v-model="inputMaGiay"
          size="lg"
          autocomplete="off"
          type="search"
          placeholder="Mã giấy..."
          @keypress="checkMaGiay($event)"
        ></b-input>
        <b-input-group-append>
          <b-button variant="outline-success" @click="setThanhLy"
            >Check</b-button
          >
        </b-input-group-append>
      </b-input-group>
      <hr />
    </b-container>

    <b-container class="mt-5">
      <b-overlay :show="overlayListInovice">
        <b-row>
          <b-col cols="3" v-for="(invoice, index) in listInvoice" :key="index">
            <b-card class="mt-3" header="Form Data Result" no-body>
              <template #header>
                <table
                  style="
                    width: 100%;
                    height: 100%;
                    color: blue;

                    font-weight: bold;
                    font-size: normalize;
                  "
                >
                  <tr>
                    <td style="text-align: left">
                      {{ invoice.customer_name }}
                    </td>
                    <td style="text-align: right; color: red">
                      {{ invoice.invoice_number }}
                    </td>
                    <td rowspan="2">
                      <b-badge
                        class="ml-2"
                        variant="danger"
                        style="cursor: pointer"
                        >X</b-badge
                      >
                    </td>
                  </tr>

                  <tr>
                    <td style="text-align: left">
                      {{ formatN(invoice.invoice_money) }}
                    </td>
                    <td style="text-align: right">
                      {{ getNgay(invoice.invoice_date_create) }}
                    </td>
                  </tr>
                </table>
              </template>
            </b-card>
          </b-col>
        </b-row></b-overlay
      >
    </b-container>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      overlayListInovice: false,
      inputMaGiay: null,
      listMaGiay: [],
      listInvoice: [],
    };
  },
  methods: {
    setThanhLy() {
      const h = this.$createElement;
      const messageVNode = h("div", { class: ["foobar"] }, [
        h("p", { class: ["text-center"] }, [
          "Ngày thanh lý (mặc định hôm nay)",
        ]),
        h("b-input", {
          props: {
            type: "search",
            value: new this.$moment().format("DD/MM/YYYY"),
            id: "modal_thanhly_date",
          },
        }),
      ]);
      this.$bvModal
        .msgBoxConfirm(messageVNode, {
          title: "Xác nhận THANH LÝ",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "YES",
          cancelTitle: "NO",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          //   console.log(this.listInvoice);

          //   let ngaythanhli = document.getElementById("modal_thanhly_date").value;
          //   let isValid = this.checkRegexDate(ngaythanhli);
          //   if (isValid === false) {
          //     alert("Ngày sai");
          //     return;
          //   }
          if (this.listInvoice.length < 0) {
            alert("Chưa có hóa đơn để thanh lý");
            return;
          }
          let listBulkUpsert = this.handleListUpsert(this.listInvoice);
          console.log(listBulkUpsert);
          /*
           {
                id:'',
        //         invoice_type: "THANH LÝ",
        //         invoice_status: true,
        //         invoice_date_get: ngaythanhli,
        //         invoice_profit,
        //       }

          */
          //   if (value === true && ngaythanhli && isValid) {
          //     //chuoc do
          //     console.log(ngaythanhli);
          //     let invoice_profit =
          //       parseInt(
          //         (
          //           (this.getCountDateComponent(this.itemEdit) *
          //             this.itemEdit.invoice_money *
          //             this.profitPercent) /
          //           3 /
          //           1000 /
          //           1000
          //         ).toFixed(0)
          //       ) * 1000;
          //     this.$supabase
          //       .from("invoice")
          //       .update({
          //         invoice_type: "THANH LÝ",
          //         invoice_status: true,
          //         invoice_date_get: ngaythanhli,
          //         invoice_profit,
          //       })
          //       .eq("id", this.itemEdit.id)
          //       .then((data) => {
          //         this.$bvToast.toast(
          //           `Thanh lý đồ thế ${this.itemEdit.invoice_number} thành công`,
          //           {
          //             title: "Thông báo",
          //             autoHideDelay: 1000,
          //             appendToast: true,
          //             variant: "primary",
          //           }
          //         );
          //         this.$refs.modal_edit.hide();
          //         this.itemEdit = null;
          //         this.$refs.my_table.refresh();
          //       });
          //   } else {
          //     alert("Ngày thanh lí không được bỏ trống");
          //   }
        })
        .catch((err) => {
          // An error occurred
        });
    },
    handleListUpsert(list) {
      list.map((item) => {
        let invoice_profit =
          parseInt(
            (
              (this.getCountDateComponent(this.itemEdit) *
                this.itemEdit.invoice_money *
                this.profitPercent) /
              3 /
              1000 /
              1000
            ).toFixed(0)
          ) * 1000;
        item.invoice_profit = invoice_profit;
      });
      return list;
    },
    getCountDateComponent(item) {
      let dateStart;
      let dateEnd;
      dateStart = item.invoice_date_create;

      if (item.invoice_status) {
        dateEnd = item.invoice_date_get;
        //đã chuộc, invoice_status : false. => đã chuộc, lấy ra invoice_date_get
      } else {
        dateEnd = new Date();
        //chưa chuộc, lấy ra invoice_date_create - now
      }
      let count = this.getCountDate(dateStart, dateEnd);
      return count + 1;
    },
    checkInvoice() {},
    getNgay(x) {
      let date = x.split("-");
      let newDate = new Date(date[0], date[1] - 1, date[1]);
      return `${date[2]}/${date[1]}/${date[0]}`;
    },
    formatN(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    checkMaGiay(event) {
      if (event.key === ",") {
        let listMaso = this.inputMaGiay.split(",");
        this.listMaGiay = listMaso;
        this.getData();
      }
    },
    async getData() {
      this.overlayListInovice = true;
      let query = this.$supabase
        .from("invoice")
        .select(
          "id,customer_name,invoice_number,invoice_date_create,invoice_money"
        )
        .in("invoice_number", this.listMaGiay);
      let r = await query;
      this.overlayListInovice = false;
      this.listInvoice = r.data;
    },
  },
};
</script>
  
  <style>
</style>"