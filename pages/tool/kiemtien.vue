<template>
  <b-container class="mt-2">
    <b-row>
      <b-col cols="6" class="mypic">
        <img src="~/assets/A400500.png" alt="" width="100%" height="100%" />
      </b-col>
      <b-col cols="6">
        <b-table-simple bordered class="mt-5 text-center" small>
          <b-tbody>
            <b-tr>
              <b-td> Loại Tiền </b-td>
              <b-td> Số tờ </b-td>
              <b-td> Giá Trị </b-td>
            </b-tr>
            <b-tr>
              <b-td> <b class="name_loaitien">500k</b> </b-td>
              <b-td>
                <b-input type="number" v-model="tien.loai500"></b-input>
              </b-td>
              <b-td>
                <b class="name_giatri text-danger">{{
                  $formatN(tien.loai500 * 500000)
                }}</b>
              </b-td>
            </b-tr>
            <b-tr>
              <b-td> <b class="name_loaitien">200k</b> </b-td>
              <b-td>
                <b-input type="number" v-model="tien.loai200"></b-input>
              </b-td>
              <b-td>
                <b class="name_giatri text-danger">{{
                  $formatN(tien.loai200 * 200000)
                }}</b>
              </b-td>
            </b-tr>
            <b-tr>
              <b-td> <b class="name_loaitien">100k</b> </b-td>
              <b-td>
                <b-input type="number" v-model="tien.loai100"></b-input>
              </b-td>
              <b-td>
                <b class="name_giatri text-danger">{{
                  $formatN(tien.loai100 * 100000)
                }}</b>
              </b-td>
            </b-tr>
            <b-tr>
              <b-td> <b class="name_loaitien">50k</b> </b-td>
              <b-td>
                <b-input type="number" v-model="tien.loai50"></b-input>
              </b-td>
              <b-td>
                <b class="name_giatri text-danger">{{
                  $formatN(tien.loai50 * 50000)
                }}</b>
              </b-td>
            </b-tr>
            <b-tr>
              <b-td> <b class="name_loaitien">20k</b> </b-td>
              <b-td>
                <b-input type="number" v-model="tien.loai20"></b-input>
              </b-td>
              <b-td>
                <b class="name_giatri text-danger">{{
                  $formatN(tien.loai20 * 20000)
                }}</b>
              </b-td>
            </b-tr>
            <b-tr>
              <b-td> <b class="name_loaitien">10k</b> </b-td>
              <b-td>
                <b-input type="number" v-model="tien.loai10"></b-input>
              </b-td>
              <b-td>
                <b class="name_giatri text-danger">{{
                  $formatN(tien.loai10 * 10000)
                }}</b>
              </b-td>
            </b-tr>
            <b-tr>
              <b-td> <b class="name_loaitien">5k</b> </b-td>
              <b-td>
                <b-input type="number" v-model="tien.loai5"></b-input>
              </b-td>
              <b-td>
                <b class="name_giatri text-danger">{{
                  $formatN(tien.loai5 * 5000)
                }}</b>
              </b-td>
            </b-tr>
            <b-tr>
              <b-td> <b class="name_loaitien">2k</b> </b-td>
              <b-td>
                <b-input type="number" v-model="tien.loai2"></b-input>
              </b-td>
              <b-td>
                <b class="name_giatri text-danger">{{
                  $formatN(tien.loai2 * 2000)
                }}</b>
              </b-td>
            </b-tr>
            <b-tr>
              <b-td> <b class="name_loaitien">1k</b> </b-td>
              <b-td>
                <b-input type="number" v-model="tien.loai1"></b-input>
              </b-td>
              <b-td>
                <b class="name_giatri text-danger">{{
                  $formatN(tien.loai1 * 1000)
                }}</b>
              </b-td>
            </b-tr>
            <b-tr>
              <b-td> <b class="name_loaitien">Tổng</b> </b-td>
              <b-td colspan="2">
                <b>{{ $formatN(tongsotien) }}</b>
              </b-td>
            </b-tr>

            <b-tr>
              <b-td colspan="3">
                <b-button variant="primary" block @click="reset"
                  >Reset</b-button
                >
              </b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  watch: {},
  methods: {
    reset() {
      this.tien = {
        loai500: 0,
        loai200: 0,
        loai100: 0,
        loai50: 0,
        loai20: 0,
        loai10: 0,
        loai5: 0,
        loai2: 0,
        loai1: 0,
      };
      this.tongsotien = 0;
    },
  },
  computed: {
    tongsotien() {
      return (
        this.tien.loai500 * 500000 +
        this.tien.loai200 * 200000 +
        this.tien.loai100 * 100000 +
        this.tien.loai50 * 50000 +
        this.tien.loai20 * 20000 +
        this.tien.loai10 * 10000 +
        this.tien.loai5 * 5000 +
        this.tien.loai2 * 2000 +
        this.tien.loai1 * 1000
      );
    },
  },
  mounted() {},
  data() {
    return {
      tien: {
        loai500: 0,
        loai200: 0,
        loai100: 0,
        loai50: 0,
        loai20: 0,
        loai10: 0,
        loai5: 0,
        loai2: 0,
        loai1: 0,
      },
    };
  },
};
</script>

<style scoped>
.name_loaitien,
.name_giatri {
  vertical-align: middle;
}
</style>