<template>
  <div id="fullDiv" @keypress="checkInput(e)">
    <b-row no-gutters>
      <b-col sm="12" lg="3">
        <div v-if="giavang && giado" class="mt-3">
          <h3 class="text-center">Bảng Giá MHJ</h3>
          <div class="text-right text-danger">
            cập nhật lúc {{ dateTimeEdit }}
          </div>
          <b-table-simple
            hover
            responsive
            striped
            bordered
            class="text-center"
            style="font-size: 16px"
          >
            <b-thead>
              <b-tr>
                <b-th>Tên</b-th>
                <b-th>Giá Mua</b-th>
                <b-th>Giá Bán</b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr v-for="(item, index) in giavang" :key="index">
                <b-td
                  ><b>{{ item.code }}</b>
                </b-td>
                <b-td
                  >{{ formatN(item.buyingPrice / 1000) }}
                  <span v-if="item.buyChange > 0" class="text-success">
                    ▲ <sub>{{ Math.abs(item.buyChange) / 1000 }}</sub>
                  </span>
                  <span v-else class="text-danger"
                    >▼ <sub>{{ Math.abs(item.buyChange) / 1000 }}</sub></span
                  >
                </b-td>
                <b-td
                  >{{ formatN(item.sellingPrice / 1000) }}
                  <span v-if="item.sellChange > 0" class="text-success">
                    ▲ <sub>{{ Math.abs(item.sellChange) / 1000 }}</sub>
                  </span>
                  <span v-else class="text-danger"
                    >▼ <sub>{{ Math.abs(item.sellChange) / 1000 }}</sub></span
                  >
                </b-td>
              </b-tr>
            </b-tbody>
            <b-tfoot>
              <b-tr>
                <b-td colspan="3" style="background-color: black; color: red">
                  <h3 style="font-weight: bolder">
                    USD: <span style="color: white">{{ giado }}</span>
                  </h3>
                </b-td>
              </b-tr>
            </b-tfoot>
          </b-table-simple>
        </div>
      </b-col>
      <b-col sm="12" lg="3">
        <div v-if="giavangnha" class="mt-3">
          <h3 class="text-center">Bảng Giá Nhà</h3>
          <div>&nbsp;</div>
          <b-table-simple
            hover
            responsive
            striped
            bordered
            class="text-center"
            style="font-size: 16px; padding: 0px; margin: 0px"
          >
            <b-thead>
              <b-tr>
                <b-th>Tên</b-th>
                <b-th>Giá Mua</b-th>
                <b-th>Giá Bán</b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr v-for="(item, index) in giavangnha" :key="index">
                <b-td
                  ><b>{{ item.code }}</b></b-td
                >
                <b-td @dblclick="changePrice('buyingPrice', item)"
                  >{{ formatN(item.buyingPrice) }}
                </b-td>
                <b-td @dblclick="changePrice('sellingPrice', item)">{{
                  formatN(item.sellingPrice)
                }}</b-td>
              </b-tr>
            </b-tbody>
            <b-tfoot>
              <b-tr>
                <b-td> Giờ </b-td>
                <b-td colspan="2">{{ gio }} </b-td>
              </b-tr>
              <b-tr>
                <b-td> Dương lịch </b-td>
                <b-td colspan="2"> {{ $moment().format("DD/MM/YYYY") }} </b-td>
              </b-tr>
              <b-tr>
                <b-td> Âm lịch </b-td>
                <b-td colspan="2">
                  {{ $moment().lunar().format("DD/MM/YYYY") }}
                </b-td>
              </b-tr>
              <b-tr>
                <b-td colspan="3">
                  <div
                    id="ww_f408917858fa3"
                    v="1.3"
                    loc="id"
                    a='{"t":"horizontal","lang":"vi","sl_lpl":1,"ids":["wl5533"],"font":"Arial","sl_ics":"one_a","sl_sot":"celsius","cl_bkg":"image","cl_font":"#FFFFFF","cl_cloud":"#FFFFFF","cl_persp":"#81D4FA","cl_sun":"#FFC107","cl_moon":"#FFC107","cl_thund":"#FF5722"}'
                  >
                    <a
                      href="https://weatherwidget.org/"
                      id="ww_f408917858fa3_u"
                      target="_blank"
                      >Widget weather</a
                    >
                  </div>
                  <script
                    async
                    src="https://app2.weatherwidget.org/js/?id=ww_f408917858fa3"
                  ></script>
                </b-td>
              </b-tr>
            </b-tfoot>
          </b-table-simple>
        </div>
      </b-col>
      <b-col sm="12" lg="6">
        <VueTradingView style="height: 90vh" :options="chartOp" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import VueTradingView from "vue-trading-view";
function checkInput(e) {
  console.log(e);
}
export default {
  data() {
    return {
      dateTimeEdit: null,
      itemEdit: null,
      giavang: null,
      giavangnha: null,
      giado: null,
      gio: "",
      autosize: true,

      chartOp: {
        autosize: true,
        symbol: "OANDA:XAUUSD",
        interval: "1",
        timezone: "Asia/Ho_Chi_Minh",
        theme: "Light",
        style: "1",
        theme: "light",
        style: "3",
        locale: "vi_VN",
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        save_image: false,
        support_host: "https://www.tradingview.com",
      },
    };
  },
  computed: {
    isBanggiachange() {
      return this.$store.state.config.banggia_vang;
    },
  },
  watch: {
    isBanggiachange(newVal, oldVal) {
      this.getBangGia();
    },
  },
  components: {
    VueTradingView,
  },
  methods: {
    checkMaGiay(e) {
      console.log(e);
    },
    changePrice(type, item) {
      const h = this.$createElement;
      // Using HTML string
      const titleVNode = h("div", {
        domProps: { innerHTML: `Đổi giá <b><code>${item.code}</code></b>` },
      });
      // More complex structure
      const messageVNode = h("div", {}, [
        h("b-input", {
          id: "inputModal",
          props: {
            type: "number",
            value:
              type === "sellingPrice"
                ? String(item.sellingPrice)
                : String(item.buyingPrice),
            placeholder:
              type === "sellingPrice"
                ? String(item.sellingPrice)
                : String(item.buyingPrice),
          },
        }),
      ]);

      // We must pass the generated VNodes as arrays
      this.$bvModal
        .msgBoxConfirm([messageVNode], {
          title: [titleVNode],
          buttonSize: "sm",
          centered: true,
          size: "sm",
        })
        .then((data) => {
          if (data) {
            let val = parseFloat(messageVNode.children[0].elm.value);

            this.$supabase
              .from("banggia")
              .update({
                [type]: val,
              })
              .eq("id", item.id)
              .then((data) => {
                this.getBangGia();
              });
          }
        });
    },
    getCurrentTime() {
      this.gio = this.$moment().format("HH:mm:ss");
    },
    formatN(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    getGia() {
      console.log("get gia mi hong", new Date());
      let urlMH =
        "https://api.allorigins.win/raw?url=https://www.mihong.vn/api/v1/gold/prices/current";
      let urlDo =
        "https://api.allorigins.win/raw?url=http://taiem.com.vn/site/convertgoldw.html";
      urlDo =
        "https://api.allorigins.win/raw?url=https://www.mihong.vn/api/v1/currency/current";
      this.$axios(urlMH).then((data) => {
        this.giavang = data.data.data;

        let gia95 = this.giavang.find((i) => i.code === "950");
        this.dateTimeEdit = gia95.dateTime;

        this.giavang.push({
          buyChange: gia95.buyChange,
          sellChange: gia95.sellChange,
          code: "Giá SG",
          buyingPrice:
            (parseFloat(gia95.buyingPrice + 40000) / 95 / 100).toFixed(0) *
            10000,
          sellingPrice: 0,
        });
      });
      this.$axios(urlDo).then((data) => {
        // let htmlString = data.data;
        // var parser = new DOMParser();
        // var doc = parser.parseFromString(htmlString, "text/html");

        // // Lấy giá trị của input có id 'vnd_usd'
        // var vndUsdValue = doc.getElementById("vnd_usd").value;
       // console.log(data);
        let vndUsdValue = data.data.data[0].mihong.buyingPrice;
        this.giado = parseFloat(vndUsdValue);
      });
    },
    getBangGia() {
      this.$supabase
        .from("banggia")
        .select()
        .order("id", { ascending: true })
        .then((data) => {
          this.giavangnha = data.data;
        });
    },
  },
  mounted() {
    this.$supabase
      .from("banggia")
      .on("UPDATE", (payload) => {
        console.log("co bang gia");
        this.$supabase
          .from("banggia")
          .select("*")
          .then((data) => {
            //có bảng giá
            console.log("có bảng giá mới asdasdasdasdsa");
            this.getBangGia();
            this.$bvToast.toast(`CÓ BẢNG GIÁ MỚI`, {
              title: "Thông báo",
              autoHideDelay: 3000,
              appendToast: true,
              variant: "danger",
            });
          });
      })
      .subscribe();
    this.getGia();
    this.getBangGia();
    setInterval(() => {
      this.getCurrentTime();
    }, 1000);
    setInterval(() => {
      this.getGia();
    }, 1000 * 60 * 10);
  },
};
</script>

<style scoped></style>