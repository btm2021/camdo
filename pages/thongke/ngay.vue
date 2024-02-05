<template>
  <div>
    <b-container>
      <b-row class="mt-3">
        <b-col cols="5">
          <div>
            <label for="example-input"
              >Ngày bắt đầu
              <code>{{ $moment(dayStart).format("DD/MM/YYYY") }}</code></label
            >
            <b-form-datepicker
              v-model="dayStart"
              :date-format-options="{
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              }"
              @input="getStat()"
              locale="vi"
            ></b-form-datepicker>
          </div>
        </b-col>
        <b-col cols="2" style="text-align: center">
          <div>
            <label for="example-input"
              >Chu kì<br />
              <code>{{
                $moment(dayEnd).diff($moment(dayStart), "days") + 1
              }}</code
              ><br />Ngày</label
            >
          </div>
        </b-col>
        <b-col cols="5">
          <div>
            <label for="example-input"
              >Ngày kết thúc
              <code>{{ $moment(dayEnd).format("DD/MM/YYYY") }}</code></label
            >
            <b-form-datepicker
              :date-format-options="{
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              }"
              @input="getStat()"
              v-model="dayEnd"
              locale="vi"
            ></b-form-datepicker>
          </div>
        </b-col>
      </b-row>
      <div v-if="info">
        <b-overlay :show="overlayChartTheMoiDongLai">
          <div class="row">
            <div class="col-12">
              <div class="tile">
                <div class="wrapper">
                  <div class="stats">
                    <div>
                      <strong>TỔNG ĐỒ THẾ</strong>
                      {{ info.tongdothe }}
                    </div>
                    <div>
                      <strong>TỔNG TIỀN ĐƯA RA</strong>
                      {{ formatN(info.tongtienduara) }}
                    </div>
                    <div>
                      <strong>THẾ MỚI/ĐÓNG LÃI</strong>
                      {{ info.themoi }}<code>/</code>{{ info.donglai }}
                    </div>
                  </div>
                  <div class="stats">
                    <div>
                      <strong>TỔNG ĐỒ CHUỘC</strong>
                      {{ info.tongdochuoc }}
                    </div>
                    <div>
                      <strong>TỔNG TIỀN CHUỘC</strong>
                      {{ formatN(info.tongtienchuoc) }}
                    </div>
                    <div>
                      <strong>LÃI THỰC NHẬN</strong>
                      {{ formatN(info.tongtienlai) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-overlay>
      </div>
      <b-row>
        <b-col cols="12">
          <b-tabs card>
            <b-tab title="Đồ thế" active @click="whatChartShow = 'dothe'">
              <div v-if="whatChartShow === 'dothe'">
                <apexchart
                  v-for="(item, index) in _chartGetDoThe"
                  :key="'aa_' + index"
                  style="width: 100%"
                  type="bar"
                  :series="item.series"
                  :options="item.chartOptions"
                ></apexchart>
              </div>
            </b-tab>
            <b-tab
              title="Thế mới/Đóng lãi"
              @click="whatChartShow = 'themoidonglai'"
            >
              <div v-if="whatChartShow === 'themoidonglai'">
                <apexchart
                  v-for="(item, index) in _chartThemoidonglai"
                  :key="'bb_' + index"
                  style="width: 100%"
                  type="bar"
                  :series="item.series"
                  :options="item.chartOptions"
                ></apexchart>
              </div>
            </b-tab>
            <b-tab lazy title="Thế/Chuộc" @click="whatChartShow = 'thechuoc'">
              <div v-if="whatChartShow === 'thechuoc'">
                <!-- <span
                  v-for="(item, index) in _chartTheChuoc"
                  :key="'cc_' + index"
                >
                  {{ item }}
                </span> -->
                <apexchart
                  v-for="(item, index) in _chartTheChuoc"
                  :key="'cc_' + index"
                  style="width: 100%"
                  type="area"
                  :series="item.series"
                  :options="item.chartOptions"
                ></apexchart>
              </div>
            </b-tab>
            <b-tab
              lazy
              title="Tiền ra/vào"
              @click="whatChartShow = 'tienravao'"
            >
              <div v-if="whatChartShow === 'tienravao'">
                <apexchart
                  v-for="(item, index) in _chartTienRaVao"
                  :key="'cc_' + index"
                  style="width: 100%"
                  type="bar"
                  :series="item.series"
                  :options="item.chartOptions"
                ></apexchart>
              </div>
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      overlayChartTheMoiDongLai: false,
      isNewData: false,
      dayStart: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      ).toLocaleDateString("en-CA"),
      dayEnd: new Date(),
      info: {
        tongdothe: 0,
        tongtienduara: 0,
        themoi: 0,
        donglai: 0,
        tongdochuoc: 0,
        tongtienchuoc: 0,
        tongtienlai: 0,
      },
      dailyChart: null,
      isChartData: null,
      chartData: null,
      listDataRaw: [],
      tempDataConfig: [],
      whatChartShow: "dothe",
      //
    };
  },
  computed: {
    _chartGetDoThe() {
      let item = JSON.parse(JSON.stringify(this.listDataRaw));
      item = _.filter(item, { invoice_status: false });

      let cat = _.groupBy(item, "invoice_date_create");

      let seriesData = _.map(cat, (invoices, date) => {
        return { x: date, y: invoices.length };
      });

      let series = [
        {
          name: "Số lượng hóa đơn",
          data: seriesData,
        },
      ];
      let objectChart = {
        series,

        chartOptions: {
          dataLabels: {
            enabled: true,
          },
          chart: {
            height: 400,
            type: "bar",
            zoom: {
              enabled: false,
            },
          },
          stroke: {
            curve: "smooth",
          },

          title: {
            text: "Danh sách đồ thế theo ngày",
            align: "center",
          },

          xaxis: {
            type: "date",
            categories: Object.keys(cat),
          },
          yaxis: {
            opposite: true,
          },
          legend: {
            position: "top",
            horizontalAlign: "left",
          },
        },
      };
      return [objectChart];
    },
    _chartThemoidonglai() {
      let item = JSON.parse(JSON.stringify(this.listDataRaw));
      item = _.filter(item, { invoice_status: false });

      let cat = _.groupBy(item, "invoice_date_create");

      let dongLaiSeries = _.map(cat, (invoices, date) => {
        return {
          x: date,
          y: _.filter(invoices, { invoice_cat: "ĐÓNG LÃI" }).length,
        };
      });

      let theMoiSeries = _.map(cat, (invoices, date) => {
        return {
          x: date,
          y: _.filter(invoices, { invoice_cat: "THẾ MỚI" }).length,
        };
      });

      let series = [
        {
          name: "Thế Mới",
          data: theMoiSeries,
        },
        {
          name: "Đóng Lãi",
          data: dongLaiSeries,
        },
      ];
      let objectChart = {
        series,

        chartOptions: {
          dataLabels: {
            enabled: true,
          },
          chart: {
            stacked: true,
            type: "bar",
            height: 400,
            zoom: {
              enabled: false,
            },
          },
          stroke: {
            curve: "smooth",
          },

          title: {
            text: "Danh sách đồ thế theo ngày",
            align: "center",
          },

          xaxis: {
            type: "date",
            categories: Object.keys(cat),
          },
          yaxis: {
            opposite: true,
          },
          legend: {
            position: "top",
            horizontalAlign: "left",
          },
        },
      };
      return [objectChart];
    },
    _chartTheChuoc() {
      let categories = [];
      let invoices = JSON.parse(JSON.stringify(this.listDataRaw));
      for (
        let m = this.$moment(this.dayStart);
        m.isSameOrBefore(this.dayEnd);
        m.add(1, "days")
      ) {
        categories.push(m.format("DD/MM/YYYY"));
      }
      let result = categories.map((date) => {
        // Tìm các hóa đơn thế đồ

        let theDoInvoices = _.filter(
          invoices,
          (invoice) =>
            invoice.invoice_status === false &&
            invoice.invoice_date_get === null &&
            this.$moment(invoice.invoice_date_create).format("DD/MM/YYYY") ===
              date
        );

        // Tìm các hóa đơn chuộc
        let chuocInvoices = _.filter(invoices, (invoice) => {
          let isChuoc =
            invoice.invoice_status === true &&
            this.$moment(invoice.invoice_date_get).format("DD/MM/YYYY") ===
              date;
          if (isChuoc) {
          }
          return isChuoc;
        });
        return {
          date,
          theDoInvoices: theDoInvoices.length,
          chuocInvoices: chuocInvoices.length,
        };
      });

      let theDoSeries = {
        name: "Thế Đồ",
        data: result.map((item) => ({ x: item.date, y: item.theDoInvoices })),
      };

      let chuocSeries = {
        name: "Chuộc",
        data: result.map((item) => ({ x: item.date, y: item.chuocInvoices })),
      };
      let series = [theDoSeries, chuocSeries];
      let objectChart = {
        series,
        chartOptions: {
          dataLabels: {
            enabled: true,
          },
          chart: {
            height: 400,
            type: "area",
            zoom: {
              enabled: false,
            },
          },
          stroke: {
            curve: "smooth",
          },

          title: {
            text: "Danh sách đồ thế theo ngày",
            align: "center",
          },

          xaxis: {
            type: "date",
            categories,
          },
          yaxis: {
            opposite: true,
          },
          legend: {
            position: "top",
            horizontalAlign: "left",
          },
        },
      };
      return [objectChart];
    },
    _chartTienRaVao() {
      let categories = [];
      let invoices = JSON.parse(JSON.stringify(this.listDataRaw));
      for (
        let m = this.$moment(this.dayStart);
        m.isSameOrBefore(this.dayEnd);
        m.add(1, "days")
      ) {
        categories.push(m.format("DD/MM/YYYY"));
      }
      let result = categories.map((date) => {
        // Tìm các hóa đơn thế đồ

        let theDoInvoices = _.filter(
          invoices,
          (invoice) =>
            invoice.invoice_status === false &&
            invoice.invoice_date_get === null &&
            this.$moment(invoice.invoice_date_create).format("DD/MM/YYYY") ===
              date
        );
        let totalTheDoMoney = _.sumBy(theDoInvoices, "invoice_money");

        // Tìm các hóa đơn chuộc
        let chuocInvoices = _.filter(invoices, (invoice) => {
          let isChuoc =
            invoice.invoice_status === true &&
            this.$moment(invoice.invoice_date_get).format("DD/MM/YYYY") ===
              date;
          if (isChuoc) {
          }
          return isChuoc;
        });
        let totalChuocMoney = _.sumBy(
          chuocInvoices,
          (invoice) => invoice.invoice_money + invoice.invoice_profit
        );

        return {
          date,
          theDoInvoices: totalTheDoMoney,
          chuocInvoices: totalChuocMoney * -1,
        };
      });

      let theDoSeries = {
        name: "Thế Đồ",
        data: result.map((item) => ({ x: item.date, y: item.theDoInvoices })),
      };

      let chuocSeries = {
        name: "Chuộc",
        data: result.map((item) => ({ x: item.date, y: item.chuocInvoices })),
      };

      let series = [theDoSeries, chuocSeries];
      let objectChart = {
        series,
        chartOptions: {
          chart: {
            type: "bar",
            height: 400,
            stacked: true,
          },
          colors: ["#008FFB", "#FF4560"],
          plotOptions: {
            bar: {
              horizontal: true,
              barHeight: "80%",
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            width: 1,
            colors: ["#fff"],
          },

          grid: {
            xaxis: {
              lines: {
                show: false,
              },
            },
          },

          tooltip: {
            shared: false,
            x: {
              formatter: (val) => {
                return "số tiền";
              },
            },
            y: {
              formatter: (val) => {
                return this.$formatN(Math.abs(val));
              },
            },
          },
          title: {
            text: "Dòng tiền",
          },
          xaxis: {
            categories: categories,
            title: {
              text: "Ngày",
            },
            labels: {
              formatter: function (val) {
                return val;
              },
            },
          },
        },
      };
      return [objectChart];
    },
  },
  methods: {
    formatN(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    async getStat() {
      // lay toan bo data phat sinh trong khoang thoi gian
      let query = await this.$supabase
        .from("invoice")
        .select()
        .gte(
          "invoice_date_create",
          this.$moment(this.dayStart).format("YYYY/MM/DD")
        )
        .lte(
          "invoice_date_create",
          this.$moment(this.dayEnd).format("YYYY/MM/DD")
        )
        .limit(999999);
      let query1 = await this.$supabase
        .from("invoice")
        .select("*")
        .gte(
          "invoice_date_get",
          this.$moment(this.dayStart).format("YYYY/MM/DD")
        )
        .lte("invoice_date_get", this.$moment(this.dayEnd).format("YYYY/MM/DD"))
        .limit(999999);
      let the = query.data.map((item) => {
        item.isChuoc = false;
        item.isThe = true;
        return item;
      });
      let chuoc = query1.data.map((item) => {
        item.isChuoc = true;
        item.isThe = false;
        return item;
      });
      let newData = _.unionBy(chuoc, the, "id");

      this.listDataRaw = newData;
      this.renderInfo(newData);
    },
    renderInfo(item) {
      this.info = {
        tongdothe: _.filter(item, { invoice_status: false }).length,
        tongtienduara: _.sumBy(
          _.filter(item, {
            invoice_status: false,
          }),
          "invoice_money"
        ),
        themoi: _.filter(item, {
          invoice_status: false,
          invoice_cat: "THẾ MỚI",
        }).length,
        donglai: _.filter(item, {
          invoice_status: false,
          invoice_cat: "ĐÓNG LÃI",
        }).length,
        tongdochuoc: _.filter(item, {
          invoice_status: true,
        }).length,
        tongtienchuoc: _.sumBy(
          _.filter(item, {
            invoice_status: true,
          }),
          (invoice) => {
            return invoice.invoice_money + invoice.invoice_profit;
          }
        ),
        tongtienlai: _.sumBy(
          _.filter(item, {
            invoice_status: true,
          }),
          "invoice_profit"
        ),
      };
    },

    async getTienRaVao() {
      let listData = JSON.parse(JSON.stringify(this.listDataRaw));

      let cat = _.groupBy(listData, "invoice_date_create"); //_.groupBy soTheMoi.data);
      let a = Object.keys(cat);
      function prepareDataForBarChart(groupedData) {
        const theMoiData = [];
        const dongLaiData = [];

        // Duyệt qua từng ngày trong dữ liệu đã nhóm
        Object.keys(groupedData).forEach((date) => {
          let theMoiCount = 0;
          let chuocDoCount = 0;

          // Đếm số lượng "THẾ MỚI" và "ĐÓNG LÃI"

          groupedData[date].forEach((item) => {
            if (item.invoice_status) {
              chuocDoCount += item.invoice_money;
            } else {
              theMoiCount += item.invoice_money;
            }
          });

          // Thêm số lượng vào mảng tương ứng
          theMoiData.push(theMoiCount);
          dongLaiData.push(chuocDoCount * -1);
        });

        return [
          {
            name: "THẾ MỚI",
            data: theMoiData,
          },
          {
            name: "CHUỘC ĐỒ",
            data: dongLaiData,
          },
        ];
      }
      a.sort((a, b) => new Date(a) - new Date(b));
      const series = prepareDataForBarChart(cat);

      let objectChart = {
        cat: a,
        chartOptions: {
          chart: {
            type: "bar",
            height: 440,
            stacked: true,
          },
          colors: ["#008FFB", "#FF4560"],
          plotOptions: {
            bar: {
              horizontal: true,
              barHeight: "80%",
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            width: 1,
            colors: ["#fff"],
          },

          grid: {
            xaxis: {
              lines: {
                show: false,
              },
            },
          },

          title: {
            text: "Dòng tiền ra vào",
          },
          xaxis: {
            categories: a,
            title: {
              text: "Percent",
            },
          },
        },
        series,
      };
      this.tempDataConfig[0] = objectChart;
      this.whatChartShow = "tienravao";

      this.isNewData = true;
      console.log(objectChart);
    },
  },
  mounted() {
    this.getStat();
  },
};
</script>

<style scoped>
body {
  background: #ecf1f5;
  font: 14px "Open Sans", sans-serif;
  text-align: center;
}

.tile {
  width: 100%;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0px 2px 3px -1px rgba(151, 171, 187, 0.7);
  float: left;
  transform-style: preserve-3d;
  margin: 10px 5px;
}

.header {
  border-bottom: 1px solid #ebeff2;
  padding: 19px 0;
  text-align: center;
  color: #59687f;
  font-size: 600;
  font-size: 19px;
  position: relative;
}

.banner-img {
  padding: 5px 5px 0;
}

.banner-img img {
  width: 100%;
  border-radius: 5px;
}

.dates {
  border: 1px solid #ebeff2;
  border-radius: 5px;
  padding: 20px 0px;
  margin: 10px 20px;
  font-size: 16px;
  color: #5aadef;
  font-weight: 600;
  overflow: auto;
}
.dates div {
  float: left;
  width: 50%;
  text-align: center;
  position: relative;
}
.dates strong,
.stats strong {
  display: block;
  color: #adb8c2;
  font-size: 11px;
  font-weight: 700;
}
.dates span {
  width: 1px;
  height: 40px;
  position: absolute;
  right: 0;
  top: 0;
  background: #ebeff2;
}
.stats {
  border-top: 1px solid #ebeff2;
  background: #f7f8fa;
  overflow: auto;
  padding: 15px 0;
  font-size: 16px;
  color: #59687f;
  font-weight: 600;
  border-radius: 0 0 5px 5px;
}
.stats div {
  border-right: 1px solid #ebeff2;
  width: 33.33333%;
  float: left;
  text-align: center;
}

.stats div:nth-of-type(3) {
  border: none;
}
</style>