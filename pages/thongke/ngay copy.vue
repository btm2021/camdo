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
                      {{ info.tongthemoi }}<code>/</code>{{ info.tongdonglai }}
                    </div>
                  </div>
                  <div class="stats">
                    <div>
                      <strong>TỔNG ĐỒ CHUỘC</strong>
                      {{ info.sodochuoc }}
                    </div>
                    <div>
                      <strong>TỔNG TIỀN CHUỘC</strong>
                      {{ formatN(info.tongtienchuoc) }}
                    </div>
                    <div>
                      <strong>TỔNG TIỀN LÃI</strong>
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
            <b-tab title="Thế mới" active>
              <apexchart
                v-for="(item, index) in _chartGetTheMoi"
                :key="index"
                style="width: 100%"
                type="area"
                :series="item.series"
              ></apexchart>
            </b-tab>
            <b-tab title="Thế mới/Đóng lãi">
              <!-- <b-overlay :show="overlayChartTheMoiDongLai">
                <apexchart
                  style="width: 100%"
                  type="bar"
                  :key="optionsTheMoiDongLai.xaxis.categories"
                  :series="seriesTheMoiDongLai"
                  :options="optionsTheMoiDongLai"
                ></apexchart>
              </b-overlay> -->
            </b-tab>
            <b-tab lazy title="Thế mới/Chuộc">
              <!-- <b-overlay :show="overlayChartTheMoiDongLai">
                <apexchart
                  style="width: 100%"
                  type="bar"
                  :key="optionsTheMoiDongLai.xaxis.categories"
                  :series="seriesTheMoiDongLai"
                  :options="optionsTheMoiDongLai"
                ></apexchart>
              </b-overlay> -->
            </b-tab>
            <b-tab lazy title="Tiền ra/vào" @click="getTienRaVao">
              <div v-if="whatChartShow === 'tienravao'">
                <b-overlay
                  :show="overlayChartTheMoiDongLai"
                  v-for="(item, index) in tempDataConfig"
                  :key="index"
                >
                  <apexchart
                    style="width: 100%"
                    type="bar"
                    :key="index"
                    :series="item.series"
                    :options="item.chartOptions"
                  ></apexchart>
                </b-overlay>
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
      isNewData: false,
      overlayChartTheMoiDongLai: false,
      dayStart: new Date("2024/02/01"),
      dayEnd: new Date(),
      info: {
        tongdothe: 0,
        tongtienduara: 0,
        tongthemoi: 0,
        tongdonglai: 0,
        sodochuoc: 0,
        tongtienchuoc: 0,
        tongtienlai: 0,
      },
      dailyChart: null,
      isChartData: null,
      chartData: null,

      isDataTheMoiDongLai: false,
      optionsTheMoiDongLai: {
        chart: {
          toolbar: {
            show: false,
          },
          type: "bar",
          stacked: true,
          zoom: {
            enabled: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            dataLabels: {
              total: {
                enabled: true,
                style: {
                  fontSize: "13px",
                  fontWeight: 900,
                },
              },
            },
          },
        },
        xaxis: {
          type: "date",
        },
        legend: {
          position: "bottom",
        },
        fill: {
          opacity: 1,
        },
      },
      seriesTheMoiDongLai: [],
      listDataRaw: [],
      tempDataConfig: [],
      whatChartShow: "tienravao",
      //
    };
  },
  methods: {
    formatN(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    async getStat() {
      this.overlayChartTheMoiDongLai = true;
      let soTheMoi = await this.$supabase
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
      this.listDataRaw = soTheMoi.data;
      this.info.tongdothe = soTheMoi.data.length;

      this.info.tongtienduara = soTheMoi.data.reduce(
        (total, item) => total + parseFloat(item.invoice_money),
        0
      );

      this.info.tongthemoi = soTheMoi.data.filter(
        (item) => item.invoice_cat === "THẾ MỚI"
      ).length;
      this.info.tongdonglai = soTheMoi.data.filter(
        (item) => item.invoice_cat === "ĐÓNG LÃI"
      ).length;
      let soDoChuoc = await this.$supabase
        .from("invoice")
        .select()
        .gte(
          "invoice_date_get",
          this.$moment(this.dayStart).format("YYYY/MM/DD")
        )
        .lte(
          "invoice_date_get",
          this.$moment(this.dayEnd).format("YYYY/MM/DD")
        );
      this.info.sodochuoc = soDoChuoc.data.length;

      this.info.tongtienchuoc = soDoChuoc.data.reduce(
        (total, item) => total + item.invoice_money,
        0
      );
      this.info.tongtienlai = soDoChuoc.data.reduce(
        (total, item) => total + item.invoice_profit,
        0
      );

      let _tempArray = JSON.parse(JSON.stringify(soTheMoi.data));
      let dataForTheMoiDOngLai = _.groupBy(_tempArray, "invoice_date_create"); //_.groupBy soTheMoi.data);

      let a = Object.keys(dataForTheMoiDOngLai);
      console.log(a);
      a.sort((a, b) => new Date(a) - new Date(b));
      let newA = a.map((item) => this.$moment(item).format("DD/MM/YYYY"));
      this.optionsTheMoiDongLai.xaxis.categories = newA;
      function prepareDataForBarChart(groupedData) {
        const theMoiData = [];
        const dongLaiData = [];

        // Duyệt qua từng ngày trong dữ liệu đã nhóm
        Object.keys(groupedData).forEach((date) => {
          let theMoiCount = 0;
          let dongLaiCount = 0;

          // Đếm số lượng "THẾ MỚI" và "ĐÓNG LÃI"
          groupedData[date].forEach((item) => {
            if (item.invoice_cat === "THẾ MỚI") {
              theMoiCount++;
            } else if (item.invoice_cat === "ĐÓNG LÃI") {
              dongLaiCount++;
            }
          });

          // Thêm số lượng vào mảng tương ứng
          theMoiData.push(theMoiCount);
          dongLaiData.push(dongLaiCount);
        });

        return [
          {
            name: "THẾ MỚI",
            data: theMoiData,
          },
          {
            name: "ĐÓNG LÃI",
            data: dongLaiData,
          },
        ];
      }
      const seriesTheMoiDongLai = prepareDataForBarChart(dataForTheMoiDOngLai);

      this.seriesTheMoiDongLai = seriesTheMoiDongLai;

      this.overlayChartTheMoiDongLai = false;
      this.isDataTheMoiDongLai = false;
      this.isDataTheMoiDongLai = true;
    },
    _chartGetTheMoi() {
      let objectChart = {};
      return [];
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