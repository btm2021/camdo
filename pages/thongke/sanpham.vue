<template>
  <div>
    <b-container>
      <div v-if="info">
        <div class="row">
          <div class="col-12">
            <div class="tile">
              <div class="wrapper">
                <div class="stats">
                  <div>
                    <strong>TỔNG SẢN PHẨM</strong>
                    {{
                      info.reduce((accumulator, currentItem) => {
                        return accumulator + currentItem.count;
                      }, 0)
                    }}
                  </div>
                  <div>
                    <strong>TỔNG CÔNG</strong>
                    {{
                      $formatN(
                        info.reduce((accumulator, currentItem) => {
                          return accumulator + currentItem.tongcong;
                        }, 0) * 1000
                      )
                    }}
                  </div>
                  <div>
                    <strong>KLV SP (TỒN)</strong>
                    {{
                      $formatSoVang(
                        info.reduce((accumulator, currentItem) => {
                          return accumulator + currentItem.klv_chuaban;
                        }, 0)
                      ).fullStr
                    }}
                  </div>
                  <div>
                    <strong>SP BÁN TRONG THÁNG</strong>
                    {{
                      $formatN(
                        info.reduce((accumulator, currentItem) => {
                          return accumulator + currentItem.daban_trong_thang;
                        }, 0)
                      )
                    }}
                  </div>
                  <div>
                    <strong>TIỀN ĐÃ BÁN TRONG THÁNG</strong>
                    {{
                      $formatSoVang(
                        info.reduce((accumulator, currentItem) => {
                          return (
                            accumulator +
                            currentItem.giatrixuat_daban_trong_thang
                          );
                        }, 0)
                      ).fullStr
                    }}
                  </div>
                  <div>
                    <strong>KLV SP ĐÃ BÁN TRONG THÁNG</strong>
                    {{
                      $formatN(
                        info.reduce((accumulator, currentItem) => {
                          return (
                            accumulator + currentItem.klv_daban_trong_thang
                          );
                        }, 0)
                      )
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <b-row>
        <b-col cols="12" v-if="isChartData">
          <b-card>
            <b-card-body>
              <apexchart
                style="width: 100%; height: 300px"
                type="bar"
                :options="options"
                :series="series"
              ></apexchart>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      info: null,
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

      series: [],
    };
  },
  methods: {
    getStat() {
      this.$supabase
        .from("view_tongquan_sanpham")
        .select()
        .then((data) => {
          this.info = data.data;
          console.log(this.info);
          this.xAxis = this.info.map(item=>item.name)
          this.yAxis = [200, 3, 100];
          this.isChartData = true;
        });
    },
    initAll() {
      this.getStat();
    },
  },
  mounted() {
    this.initAll();
  },
};
</script>
  
  <style scoped>
/*	Reset & General
  ---------------------------------------------------------------------- */

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