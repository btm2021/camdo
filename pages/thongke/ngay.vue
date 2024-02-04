<template>
  <div>
    <b-container>
      <b-row>
        <b-col cols="3">
          <div>
            <label for="example-input">Ngày bắt đầu</label>
            <b-form-datepicker
              v-model="dayStart"
              :date-format-options="{
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              }"
              locale="vi"
            ></b-form-datepicker>
          </div>
        </b-col>
        <b-col cols="3">
          <div>
            <label for="example-input">Ngày kết thúc</label>
            <b-form-datepicker
              :date-format-options="{
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              }"
              v-model="dayEnd"
              locale="vi"
            ></b-form-datepicker>
          </div>
        </b-col>
        <b-col cols="12">
          <b-button @click="getStat" class="mt-3" variant="success"
            >Tìm</b-button
          >
        </b-col>
      </b-row>
      <div v-if="info">
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
      </div>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dayStart: new Date(),
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
      xAxis: [],
      yAxis: [],
      options: {
        chart: {
          id: "vuechart-example",
        },
        xaxis: {
          categories: [],
        },
      },
      optionsDaily: {
        chart: {
          id: "daily-example",
        },
        xaxis: {
          categories: [],
        },
      },
      series: [],
      seriesDaily: [],
    };
  },
  methods: {
    formatN(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    async getStat() {
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
        );

      this.info.tongdothe = soTheMoi.data.length;

      this.info.tongtienduara = soTheMoi.data.reduce(
        (total, item) => total + item.invoice_money,
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
    },
  },
  mounted() {},
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