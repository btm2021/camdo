
<template>
  <div>
    <b-modal id="modal_taomoi"> </b-modal>
    <b-container>
      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="primary" v-b-modal.modal_taomoi>Tạo mới</b-button>
        </b-col>
        <b-col
          class="mt-2"
          cols="12"
          v-for="(item, index) in listData"
          :key="index"
        >
          <b-card :title="'Loại vàng : ' + item.banggia.code">
            <table class="table b-table table-bordered border text-center">
              <tr
                v-for="(history, index) in item.history"
                :key="'history' + index"
              >
                <td class="align-middle">
                  {{ $moment(history.created_at).format("DD/MM/YYYY") }}
                </td>
                <td class="align-middle">
                  {{ $formatSoVang(history.trongluong).fullStr }}<br />
                  <sub class="text-danger"
                    >Tồn cuối: ({{ history.toncuoi }})</sub
                  >
                </td>
                <td class="align-middle">
                  <div
                    class="align-middle"
                    :style="{
                      'background-color': history.loainhap ? 'BLUE' : 'RED',
                    }"
                  >
                    <span class="text-white font-weight-bold">{{
                      history.loainhap ? "THÊM VÀNG" : "TRỪ VÀNG"
                    }}</span>
                  </div>
                </td>
              </tr>
            </table>
            <template #header>
              <b-row class="align-middle">
                <b-col cols="6">
                  <div>
                    Tên thợ
                    <b class="text-danger">{{ item.danhsachtho.ten }}</b>
                  </div></b-col
                >
                <b-col cols="6" class="text-right align-middle">
                  <div>
                    Vàng tồn hiện tại :
                    {{ $formatSoVang(item.toncuoi).fullStr }}
                  </div>
                </b-col>
              </b-row>
            </template>
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
      listData: [],
    };
  },
  methods: {
    async getTrongLuong() {
      let result = await this.$supabase
        .from("sochevang")
        .select("*,banggia(*),danhsachtho(*)");
      return result;
    },
  },
  mounted() {
    this.getTrongLuong().then((data) => {
      let result = [];
      data = data.data;
      //dùng lodash để phân tách tên thợ
      let danhsachtho = this.$_.groupBy(data, "id_tho");
      for (let tho in danhsachtho) {
        //danh sách thợ
        //    let item_tho = danhsachtho[tho][0];
        //  console.log(item_tho)
        //trong danh sách thợ tiếp tục lặp qua tất cả loại vàng
        //     let loaivang = this.$_.groupBy(item_tho, "id_banggia");
        //    console.log(loaivang);
        //  result.push({ tentho: item_tho.danhsachtho.ten });
      }
      console.log(result);
      //   this.listData = result;
    });
  },
};
</script>

<style>
</style>