<template>
  <div class="container mt-3">
    <b-row>
      <b-col cols="6">
        <b-card header="Cân nước - Tính Tỷ lệ phần trăm kim loại nguyên chất">
          <b-card-body>
            <b-table-simple responsive bordered>
              <b-tbody>
                <b-tr>
                  <b-td colspan="2">
                    <b-button
                      variant="primary"
                      block
                      @click="step = 1"
                      :disabled="step === 0 ? false : true"
                      >Bắt đầu</b-button
                    >
                  </b-td>
                </b-tr>
                <b-tr :class="step === 1 ? 'bg-warning' : 'bg-dark'">
                  <b-td class="align-middle">
                    <h6>Bước 1</h6>
                  </b-td>
                  <b-td>
                    <h5>
                      Trọng lượng cân khô
                      {{
                        $formatSoVang(
                          parseFloat(parseFloat(weightDry).toFixed(4)) * 10000
                        ).fullStr
                      }}
                    </h5>
                    <b-input-group>
                      <b-form-input
                        v-model="weightDry"
                        autocomplete="off"
                        placeholder="Nhập trọng lượng cân khô"
                      ></b-form-input>
                      <b-input-group-append>
                        <b-button
                          variant="info"
                          @click="step = 2"
                          :disabled="step === 1 ? false : true"
                          >Qua Bước 2</b-button
                        >
                      </b-input-group-append>
                    </b-input-group>
                  </b-td>
                </b-tr>
                <b-tr :class="step === 2 ? 'bg-warning' : 'bg-dark'">
                  <b-td class="align-middle">
                    <h6>Bước 2</h6>
                  </b-td>
                  <b-td>
                    <h5>
                      Trọng lượng cân trong nước
                      {{
                        $formatSoVang(
                          parseFloat(parseFloat(weightWet).toFixed(4)) * 10000
                        ).fullStr
                      }}
                    </h5>
                    <b-input-group>
                      <b-form-input
                        v-model="weightWet"
                        autocomplete="off"
                        placeholder="Nhập trọng lượng cân nước"
                      ></b-form-input>
                      <b-input-group-append>
                        <b-button
                          variant="info"
                          @click="step = 2"
                          :disabled="step === 2 ? false : true"
                          >Qua Bước 3</b-button
                        >
                      </b-input-group-append>
                    </b-input-group>
                  </b-td>
                </b-tr>
              </b-tbody>
            </b-table-simple>
            <b-form @submit.prevent="onSubmit">
              <b-form-group label="Chọn kim loại:">
                <b-form-select
                  v-model="selectedMetal"
                  :options="metals"
                  @change="changeKimLoai"
                ></b-form-select>
              </b-form-group>

              <b-button variant="primary" @click="onSubmit">Tính toán</b-button>

              <b-button
                variant="warning"
                @click="
                  (step = 0),
                    (percentage = 0),
                    (weightDry = 0),
                    (weightWet = 0),
                    (convertTO95 = 0),
                    (selectedMetal = 19.3)
                "
                >Reset Lại</b-button
              >
            </b-form></b-card-body
          >
        </b-card>
      </b-col>
      <b-col cols="6" v-if="percentage > 0 && percentage < 100">
        <apexchart
          type="pie"
          :options="chartOptions"
          :series="chartSeries"
        ></apexchart>
        <b-table-simple class="text-center" bordered fixed>
          <b-tbody>
            <b-tr>
              <b-td> <h6 class="mb-0">Trọng Lượng Gốc</h6> </b-td>
              <b-td>
                <span class="text-secondary">
                  {{
                    this.$formatSoVang(parseFloat(this.weightDry) * 10000)
                      .fullStr
                  }}</span
                >
              </b-td>
              <b-td>
                <span class="text-secondary" v-if="percentage">
                  {{ percentage.toFixed(2) }}%</span
                ></b-td
              >
            </b-tr>
            <b-tr>
              <b-td> <h6 class="mb-0">Quy 95</h6> </b-td>
              <b-td>
                <span class="text-secondary">
                  {{ $formatSoVang(convertTO95).fullStr }}</span
                >
              </b-td>
              <b-td>
                <span class="text-secondary" v-if="percentage"> 95%</span></b-td
              >
            </b-tr>
          </b-tbody>
        </b-table-simple>
      </b-col>
    </b-row>
  </div>
</template>
  
  <script>
import VueApexCharts from "vue-apexcharts";
export default {
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      step: 0,
      convertTO95: 0,
      weightDry: 0,
      weightWet: 0,
      selectedMetal: 19.3,
      metals: [
        { value: 19.3, text: "Vàng (Au)" },
        { value: 10.5, text: "Bạc (Ag)" },
        { value: 8.9, text: "Đồng (Cu)" },
      ],
      percentage: null,
      chartOptions: {
        colors: ['#FDE767','#546E7A'],
        labels: ["Vàng (Au)", "Phần còn lại"],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
      chartSeries: [0, 100],
    };
  },
  mounted() {
    this.changeKimLoai();
    this.onSubmit();
  },
  methods: {
    start() {
      this.step = 1;
    },
    changeKimLoai() {
      this.$nextTick(() => {
        let text = this.metals.find((i) => i.value === this.selectedMetal).text;
        console.log(text);
        this.chartOptions.labels[0] = text;
      });
    },
    onSubmit() {
      //(dry weight)/(dry weight - weight in water)
      const waterDensity = 0.997; // Tỷ trọng nước (g/cm³)
      let dry = parseFloat(this.weightDry);
      let wet = parseFloat(this.weightWet);
      let percentage = (dry / (dry - wet)) * waterDensity;
      this.percentage = (percentage * 100) / parseFloat(this.selectedMetal);
      let convertTO95 = ((dry * 100) / 95) * 10000;
      this.convertTO95 = parseInt(convertTO95);
      this.updateChartData();
    },
    updateChartData() {
      let otherPercentage = 100 - parseFloat(this.percentage.toFixed(2));

      this.chartSeries = [
        parseFloat(this.percentage.toFixed(2)),
        parseFloat(otherPercentage.toFixed(2)),
      ];
    },
    async tinhgiatri() {
      this.getBangGia();
    },
    async getBangGia() {
      let banggia = await this.$getBangGia();
      console.log(banggia);
    },
  },
};
</script>
  
  <!-- Add Bootstrap Vue and Vue dependencies -->
  