<template>
  <div id="chatContainer">
    <b-container style="height: 80vh; overflow: scroll">
      <div class="container1">
        <img src="/ai.webp" alt="Avatar" />
        <p>
          Xin chào bạn. tôi là trợ lý cho tiệm vàng bảo phương, do anh bảo đẹp
          trai mướn làm osin. Tôi sẽ trả lời mọi câu hỏi liên quan đến dữ liệu
          cầm đồ của tiệm anh bảo đẹp trai. vui lòng hỏi thoải mái.
        </p>
      </div>
      <span v-for="(item, index) in listChat" :key="index">
        <div class="container1 darker">
          <img src="/bao.webp" alt="Avatar" class="right" />
          <p>{{ item.questionFromUI }}</p>
        </div>
        <div class="container1">
          <img src="/ai.webp" alt="Avatar" />
          <div>
            Đây là kết quả tôi tìm được cho câu hỏi của bạn : <br />
            <span v-if="item.isValidTable">
              <b-table
                style="width: 90%; right: 0; text-align: center"
                small
                responsive
                :fields="tableField"
                :items="item.result"
                show-empty
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
                  <div class="textLeft">{{ formatN(data.value) }}</div>
                </template>
                <template #cell(invoice_date_get)="data">
                  <span v-if="data.item.invoice_status">
                    {{
                      $moment(data.item.invoice_date_get).format("DD/MM/YYYY")
                    }}
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
            </span>
            <span v-else>
              <b-table :items="item.result" small responsive></b-table>
            </span>
          </div>
        </div>
      </span>
    </b-container>
    <b-container>
      <div class="text">
        <b-overlay :show="questionOverlay">
          <b-input
            v-model="question"
            size="lg"
            type="search"
            autocomplete="off"
            placeholder="Câu hỏi"
            @keydown.enter="getChat"
          >
          </b-input>
        </b-overlay>
      </div>
    </b-container>

    <!-- <b-container>
      <b-row>

        <b-col cols="12" class="p-3">
         
        </b-col>
        <b-col cols="12" :key="forceRefresh">
          <result
            v-for="(item, index) in listChat"
            :key="index"
            :item="item"
            class="mt-5"
          >
          </result>
        </b-col>
      </b-row>
    </b-container> -->
  </div>
</template>

<script>
import result from "~/components/result.vue";
export default {
  components: { result },
  data() {
    return {
      tableField: [
        {
          key: "index",
          label: "#",
          thStyle: { width: "2%", textAlign: "center" },
        },
        {
          key: "customer_name",
          label: "Tên",
        },
        {
          key: "invoice_number",
          label: "Mã số",
          thClass: "myThClass20percent",
        },
        {
          key: "invoice_date_create",
          label: "Ngày cầm",
          formatter: (value) => {
            //yyyy/mm/dd
            //  console.log(value);
            let n = this.$moment(value).format("DD/MM/YYYY");
            return n || "";
          },
        },
        {
          key: "invoice_money",
          label: "Số tiền",

          thClass: "myThClass",
          formatter: (value) => {
            return this.formatN(value);
          },
        },

        {
          key: "invoice_count",
          label: "Số ngày thế",

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
          key: "invoice_profit",
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

            let pnl = count * item.invoice_money * 0.00666666;
            pnl = parseInt((pnl / 1000).toFixed(0)) * 1000;

            pnl = parseInt(pnl.toFixed(0));

            return pnl;
          },
        },
        {
          key: "invoice_tag",
          label: "Sản phẩm",
          formatter: (value) => {
            let arr = JSON.parse(value);
            return arr;
          },
          thClass: "myThClass500px",
        },
        {
          key: "invoice_date_get",
          label: "Ngày chuộc",
          thClass: "myThClass",
        },

        {
          key: "invoice_cat",
          label: "Loại thế",
          thClass: "myThClass",
        },

        {
          key: "invoice_type",
          label: "Phân loại",
          thClass: "myThClass",
          formatter: (value, key, item) => {
            return value;
          },
        },
        {
          key: "invoice_comment",
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
          label: "Loại lưu kho",
          thClass: "myThClass",
        },
        {
          key: "invoice_store_type",
          label: "Nơi Lưu",
          thClass: "myThClass",
        },
        {
          key: "invoice_phone",
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

      forceRefresh: 0,
      questionOverlay: false,
      url: "https://inquisitive-hare-long-underwear.cyclic.app/api/",
      listChat: [],
      question: "tìm các hóa đơn của khách hàng tên BAO",
    };
  },
  methods: {
    formatN(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
    formatResult(item) {
      let a = JSON.parse(item);
      return a;
    },
    checkIsResultValid(data) {
      let isValid;
      //kiểm tra
      let n = data[0];
      if (
        n.id != undefined &&
        n.invoice_date_create != undefined &&
        n.customer_name != undefined &&
        n.invoice_money != undefined &&
        n.invoice_status != undefined &&
        n.invoice_number != undefined
      ) {
        isValid = true;
      } else {
        isValid = false;
      }
      return isValid;
    },
    getChat() {
      document.getElementById("chatContainer").style.cursor = "wait";

      this.questionOverlay = true;
      let url = this.url;
      //  url = "http://localhost:3001/api";
      this.$axios({
        method: "post",
        url,
        data: {
          question: this.question, // This is the body part
        },
      }).then((data) => {
        debugger;
        this.questionOverlay = false;
        this.forceRefresh++;
        document.getElementById("chatContainer").style.cursor = "default";
        let n = JSON.parse(data.data);
        let valid = this.checkIsResultValid(n);
        this.listChat.push({
          questionFromUI: this.question,
          result: n,
          isValidTable: valid,
        });
      });
    },
  },
};
</script>

<style scoped>
.container1 {
  border: 2px solid #dedede;
  background-color: #f1f1f1;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
}

/* Darker chat container */
.darker {
  border-color: #ccc;
  background-color: #ddd;
}

/* Clear floats */
.container1::after {
  content: "";
  clear: both;
  display: table;
}

/* Style images */
.container1 img {
  float: left;
  max-width: 60px;
  width: 100%;
  margin-right: 20px;
  border-radius: 50%;
}

/* Style the right image */
.container1 img.right {
  float: right;
  margin-left: 20px;
  margin-right: 0;
}

/* Style time text */
.time-right {
  float: right;
  color: #aaa;
}

/* Style time text */
.time-left {
  float: left;
  color: #999;
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
</style>