<template>
  <div>
    <b-container class="mt-5">
      <h3>Thanh lý</h3>
      <b-overlay :show="overlay_ipt">

        <b-input-group>


          <b-input v-model="inputMaGiay" size="lg" autocomplete="off" class="text-center text-danger font-weight-bold"
            ref="ipt_magiay" type="search" placeholder="Mã giấy..." @change="checkMaGiay($event)"></b-input>
          <b-input-group-append>
            <b-button variant="warning" @click="setThanhLy">Thanh Lý</b-button>
          </b-input-group-append>

        </b-input-group>
      </b-overlay>
      <hr />
    </b-container>

    <div class="mt-5">
      <b-overlay :show="overlayListInovice" v-if="listInvoice.length > 0">
        <b-row>
          <b-col cols="12">
            <b-col cols="12" class="min-vw-100">
              <b-table style="min-height: 400px" class="my_table align-middle w-auto" responsive bordered
                no-border-collapse ref="my_table" :items="listInvoice" show-empty select-mode="single" selectable
                head-row-variant="success" :fields="tableField" @row-dblclicked="
                  cellClick(arguments[0], arguments[1], arguments[2])
                  ">
                <template #cell(tool)="data">
                  <b-button size="sm" class="px-2" variant="danger" @click="deleteItem(data.item)">Xóa</b-button>
                </template>

                <template #cell(index)="data">
                  {{ data.index + 1 }}
                </template>
                <template #cell(invoice_tag)="data">
                  <b-badge v-for="(item, index) in data.value" :key="index" variant="primary">{{ item }}</b-badge>
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
                  <div class="" v-b-tooltip.hover :title="data.value < 90
                    ? 'Thời gian thế dưới 3 tháng, an toàn'
                    : data.value > 90 && data.value < 180
                      ? 'Thời gian thế 3-6 tháng, lưu ý'
                      : 'Thời gian thế trên 6 tháng, nguy hiểm'
                    ">
                    <span v-if="data.item.invoice_status" style="text-align: left !important">
                      <b-icon icon="backspace-reverse-fill" variant="primary"></b-icon>
                    </span>

                    <span v-else>
                      <b-icon icon="backspace-reverse-fill" variant="success"></b-icon>
                    </span>
                    {{ data.value }}

                    <b-icon v-if="data.value < 90" icon="exclamation-circle-fill" variant="success"></b-icon>
                    <b-icon v-if="data.value > 90 && data.value < 180" icon="exclamation-circle-fill"
                      variant="warning"></b-icon>
                    <b-icon v-if="data.value > 180" icon="exclamation-circle-fill" variant="danger"></b-icon>
                  </div>
                </template>

                <template #cell(invoice_status)="data">
                  <div>
                    <span>
                      <b-form-checkbox @change="toggleStatus(data.item)" v-model="data.item.invoice_status" switch
                        v-show="data.item.invoice_status">
                      </b-form-checkbox>
                    </span>
                    <span v-if="data.item.invoice_status">
                      <!-- da chuoc -->
                      <b-badge variant="primary">Đã chuộc</b-badge>
                    </span>
                    <span v-else>
                      <b-badge variant="success">Chưa chuộc</b-badge>
                    </span>
                  </div>
                  <!-- `data.value` is the value after formatted by the Formatter -->
                </template>
                <template #cell(invoice_label)="data">
                  <!-- `data.value` is the value after formatted by the Formatter -->
                  <b-form-checkbox v-model="data.item.invoice_label" @change="toggleInTem(data.item)" switch>
                    <span v-if="data.item.invoice_label">
                      <!-- da chuoc -->
                      <b-badge variant="primary">Đã In</b-badge>
                    </span>
                    <span v-else>
                      <b-badge variant="success">Chưa In</b-badge>
                    </span>
                  </b-form-checkbox>
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
          </b-col>
        </b-row></b-overlay>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'thanhly',
  data() {
    return {
      overlay_ipt: false,
      overlayListInovice: true,
      inputMaGiay: null,
      listMaGiay: [],
      listInvoice: [],
      tableField: [
        {
          key: "tool",
          label: "Tool",
          thStyle: { width: "2%", textAlign: "center" },
        },
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
            return this.$formatSoTien(value);
          },
        },
        {
          key: "invoice_status",
          sortable: true,
          label: "Tình trạng",
          thClass: "myThClass500px",
        },
        {
          key: "invoice_label",
          sortable: true,
          label: "Tem",
          thClass: "myThClass",
        },
        {
          key: "invoice_count",
          sortable: true,
          label: "Số ngày thế",
          thClass: "myThClass",

          formatter: (value, key, item) => {
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
            return count;
          },
        },
        {
          key: "invoice_cat",
          label: "Loại thế",
          sortable: true,
          thClass: "myThClass",
        },
        {
          key: "invoice_profit",
          sortable: true,
          label: "Lời",
          thClass: "myThClass",
          formatter: (value, key, item) => {
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
            let pnl =
              (count * item.invoice_money * (this.profitPercent / 3)) / 1000;
            pnl = parseInt((pnl / 1000).toFixed(0)) * 1000;

            pnl = parseInt(pnl.toFixed(0));

            return pnl;
          },
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
      profitPercent: 2,
    };
  },
  methods: {
    cellClick(item, index, event) {
      this.itemEdit = JSON.parse(JSON.stringify(item));
      this.$refs["modal_edit"].show();
    },
    setThanhLy() {
      if (this.listInvoice.length > 0) {
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
          .then(async (value) => {
            let listBulkUpsert = this.handleListUpsert(this.listInvoice);
            if (value) {
              console.log(listBulkUpsert);
            } else {
              return;
            }
            const regex =
              /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/(20[2-4][3-9]|2050)$/;
            let ngaythanhli = document.getElementById("modal_thanhly_date").value;
            let isValid = regex.test(ngaythanhli);

            if (isValid === false) {
              alert("Ngày sai");
              return;
            } else {
              console.log(ngaythanhli)
              this.overlayListInovice = true
              for (let i = 0; i < listBulkUpsert.length; i++) {
                let ntl = this.$moment(ngaythanhli, "DD/MM/YYYY")
                await this.$supabase.from('invoice').update({
                  invoice_type: "THANH LÝ",
                  invoice_status: true,
                  invoice_date_get: ntl,
                  invoice_profit: listBulkUpsert[i].invoice_profit
                }).eq('id',listBulkUpsert[i].id)
              }
              this.$bvToast.toast(
                `Thanh lý đồ thế với mã số [${listBulkUpsert.map(item => item.invoice_number)}] thành công`,
                {
                  title: "Thông báo",
                  autoHideDelay: 1000,
                  appendToast: true,
                  variant: "primary",
                }
              );
              this.listInvoice=[]
              this.overlayListInovice = false
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
            }
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
            console.log(err)
          });
      } else {
        alert('Không có sản phẩm để thanh lý')
      }

    },
    handleListUpsert(list) {
      list.map((item) => {
        let invoice_profit =
          parseInt(
            (
              (this.getCountDateComponent(item) *
                item.invoice_money *
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
    getCountDate(dateStart, dateEnd) {
      let _dateStart = this.$moment(dateStart);
      let _dateEnd = this.$moment(dateEnd);
      let count = _dateEnd.diff(_dateStart, "days");
      return count + 1;
      // =1
    },
    checkInvoice() { },
    getNgay(x) {
      let date = x.split("-");
      let newDate = new Date(date[0], date[1] - 1, date[1]);
      return `${date[2]}/${date[1]}/${date[0]}`;
    },

    async checkMaGiay(event) {
      this.overlay_ipt = true
      let tempMaso = String(this.inputMaGiay)
      let regex = /(=?\d+)$/;
      let test = (regex.test(tempMaso))
      if (test) {
        let maso = tempMaso.replace("=", "")

        let itemExist = this.listInvoice.find(i => {
          return i.invoice_number == parseInt(maso)
        })
        if (itemExist) {
          this.$bvToast.toast(
            `Mã đã tồn tại`,
            {
              title: "Thông báo",
              autoHideDelay: 3000,
              appendToast: true,
              variant: "danger",
            }
          );
        } else {
          let result = await this.getSingle(maso)
          if (result) {
            this.listInvoice.push(result)
          } else {
            this.$bvToast.toast(
              `Không tìm thấy mã số`,
              {
                title: "Thông báo",
                autoHideDelay: 3000,
                appendToast: true,
                variant: "primary",
              }
            );
          }
        }

      } else {
        this.$bvToast.toast(
          `Mã sai định dạng`,
          {
            title: "Thông báo",
            autoHideDelay: 3000,
            appendToast: true,
            variant: "danger",
          }
        );
      }
      this.inputMaGiay = null
      this.$refs.ipt_magiay.focus()
      this.overlay_ipt = false;
    },
    async getSingle(magiay) {
      let result = await this.$supabase.from('invoice').select('').eq('invoice_number', magiay)
      this.overlayListInovice = false
      if (result.data.length > 0) {
        return result.data[0]
      } else {
        return null
      }

    },
    deleteItem(item) {
      this.listInvoice = this.listInvoice.filter(i => i.id != item.id)
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
  mounted() {
    this.$refs.ipt_magiay.focus()
  }
};
</script>

<style scope>
body {
  font-family: Circular, custom-font, Helvetica Neue, Helvetica, Arial,
    sans-serif !important;

  height: 100vh;
  min-height: 100vh;
}

.my_table tr td {
  text-align: left;
  text-align: center !important;
  padding: 1px !important;
  margin: 0 !important;
}

.tdIndex {
  text-align: center !important;
}

.textLeft {
  text-align: left !important;
}

.myThClass {
  min-width: 200px !important;
  text-align: center;
}

.myThClass20percent {
  min-width: 20% !important;
  text-align: center;
}

.myThClass500px {
  min-width: 300px !important;
  text-align: center;
}

.filter_input {
  margin: 3px;
}

.my_table td:hover {
  cursor: cell;
  background-color: antiquewhite;
}
</style>