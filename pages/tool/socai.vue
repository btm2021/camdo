<template>
  <div>
    <b-modal id="modal_taomoi" title="Thêm khoản vàng">
      <b-form v-if="dataReady">

        <b-form-group label="Tên thợ">
          <b-form-select v-model="formInsert.id_tho" :options="optDanhSachTho"></b-form-select>
        </b-form-group>

        <b-form-group label="Loại vàng">
          <b-form-select v-model="formInsert.id_banggia" :options="optLoaivang"></b-form-select>
        </b-form-group>
        <b-form-group label="Loại nhập vàng">
          <b-form-select v-model="formInsert.loainhap" :options="optLoaiNhap"></b-form-select>
        </b-form-group>
        <b-form-group label="Khối lượng vàng">
          <b-input autocomplete="off" v-model="formInsert.trongluong"></b-input>
          <b class="text-danger">
            Khối lượng vàng xử lý : {{ $formatSoVang(formInsert.trongluong || 0).fullStr }}
          </b>
        </b-form-group>


      </b-form>
    </b-modal>
    <div>
      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="primary" v-b-modal.modal_taomoi>Tạo mới</b-button>
        </b-col>
        <b-col class="mt-2 border" cols="12" v-for="(item, index) in listData" :key="index">
          <h4 class="text-center">Thợ : {{ item.name }}</h4>
          <b-row>
            <b-col :cols="12 / item.history.length" v-for="(loaivang, index) in item.history" :key="'loaivang' + index">

              <b-card :title="'Vàng : ' + loaivang.name">
                {{ }}
                <table class="table b-table table-bordered b-table-small border text-center">
                  <tr v-for="(history, index) in loaivang.listHist" :key="'history' + index">
                    <td class="align-middle">
                      {{ $moment(history.created_at).format("DD/MM/YYYY") }}
                    </td>
                    <td class="align-middle">
                      {{ $formatSoVang(history.trongluong).fullStr }}<br />
                      <sub class="text-danger">Tồn cuối: ({{ history.toncuoi }})</sub>
                    </td>
                    <td class="align-middle">
                      <div class="align-middle" :style="{
                        'background-color': history.loainhap ? 'BLUE' : 'RED',
                      }">
                        <span class="text-white font-weight-bold">{{
                          history.loainhap ? "THÊM VÀNG" : "TRỪ VÀNG"
                        }}</span>
                      </div>
                    </td>
                  </tr>
                </table>
              </b-card>
              <!---->
            </b-col>
          </b-row>

        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listData: [],
      formInsert: {
        id_tho: null,
        id_banggia: null,
        toncuoi: null,
        loainhap: null,
        trongluong: null
      },
      optDanhSachTho: [],
      rawDanhSachTho: null,
      optLoaivang: [],
      rawLoaiVang: null,
      optLoaiNhap: [{ value: true, text: 'Cộng Thêm Vàng' }, { value: false, text: 'Trừ Vàng' }],
      dataReady: false
    };
  },
  methods: {
    async getOptionDanhSachTho() {
      return new Promise((resolve, reject) => {
        this.$supabase.from("danhsachtho").select().then(data => {
          let d = data.data
          let result = d.map(item => {
            return {
              text: item.ten,
              value: item.id
            }
          })
          resolve({ option: result, raw: data.data })
        })
      })
    },
    async getOptionLoaiVang() {
      return new Promise((resolve, reject) => {
        this.$supabase.from("banggia").select().then(data => {
          let d = data.data
          let result = d.map(item => {
            return {
              text: item.code,
              value: item.id
            }
          })
          resolve({ option: result, raw: data.data })
        })
      })
    },
    async getTrongLuong() {
      let result = await this.$supabase
        .from("sochevang")
        .select("*,banggia(*),danhsachtho(*)");
      return result;
    },
    initOption() {

      let taskOptTho = this.getOptionDanhSachTho().then(data => {

        this.optDanhSachTho = data.option;
        this.rawDanhSachTho = data.raw
      })
      let taskOptBanggia = this.getOptionLoaiVang().then(data => {

        this.optLoaivang = data.option;
        this.rawLoaiVang = data.raw
      })
      let listTask = [taskOptTho, taskOptBanggia]
      Promise.all(listTask).then(data => {
        this.dataReady = true
      })
    }
  },
  mounted() {
    this.initOption();
    this.getTrongLuong().then((data) => {

      let data1 = data.data;
      const groupedData = _.groupBy(data1, 'id_tho');
      // Tiếp tục nhóm theo id_bangia trong groupedData
      const finalData = _.map(groupedData, (value, key) => {
        // Nhóm dữ liệu theo id_bangia
        const groupedByBangia = _.groupBy(value, 'id_banggia');

        // Chuyển đổi dữ liệu trong từng nhóm id_bangia
        const transformedBangia = _.map(groupedByBangia, (bangiaValue, bangiaKey) => {
          return {
            name: bangiaValue[0].banggia.code,
            listHist: bangiaValue.map(item => ({ ...item })),
            lastRecord: {
              name: bangiaValue[0].banggia.code,
              lastRecord: _.maxBy(bangiaValue, 'created_at')
            }
          };
        });

        return {
          name: value[0].danhsachtho.ten,
          history: transformedBangia
        };
      });
      this.listData = finalData;

    });
  },
};
</script>

<style></style>