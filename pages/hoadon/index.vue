<template>
  <b-card title="Danh sách hóa đơn">
    <b-row no-gutters>
      <b-col cols="3"> </b-col>
      <b-col cols="9">
        <b-row no-gutters>
          <b-col cols="3">
            <b-form-group
              label="Hiển thị"
              label-for="per-page-select"
              label-cols-sm="6"
              label-cols-md="4"
              label-cols-lg="3"
              label-align-sm="right"
              label-size="sm"
              class="mb-0"
            >
              <b-form-select
                id="per-page-select"
                v-model="perPage"
                :options="[50, 100, 200]"
                size="sm"
              ></b-form-select>
            </b-form-group>
          </b-col>
          <b-col cols="4"></b-col>
          <b-col cols="4" class="mb-2">
            <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              size="sm"
              align="right"
              first-number
              last-number
              class="my-0"
            >
              <template #first-text><span class="">Đầu</span></template>
              <template #prev-text><span class="">Lùi</span></template>
              <template #next-text><span class="">Tới</span></template>
              <template #last-text><span class="">Cuối</span></template>
            </b-pagination>
          </b-col>
          <b-col cols="12">
            <b-table
              bordered
              :items="myProvider"
              :fields="fieldsHoaDon"
              show-empty
              small
              no-border-collapse
            >
              <template #cell(created_at)="data">
                {{ $moment(data.value).format("DD/MM/YYYY hh:mm") }}
              </template>
              <template #cell(tongsotien)="data">
                <div style="align-items: middle">
                  {{ $formatN(data.value) }}
                </div>
              </template>

              <template #cell(product)="data">
                <div v-for="(item, index) in data.value" :key="index">
                  <a href="#"> {{ item.product_barcode }}</a> -{{
                    item.product_type
                  }}-{{ $formatSoVang(item.product_gold_weight).fullStr }}:{{
                    $formatN(item.product_total_price || 0)
                  }}
                </div>
              </template>
            </b-table>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
export default {
  mounted() {},
  methods: {
    async myProvider(ctx) {
      let s = (ctx.currentPage - 1) * ctx.perPage;
      let e = s + ctx.perPage;
      let query = this.$supabase
        .from("hoadon")
        .select("*,product(*)")
        .range(s, e)
        .order("id", { ascending: ctx.sortDesc });
      let queryCount = this.$supabase
        .from("hoadon")
        .select("*", { count: "exact", head: true });

      let result = await query;
      let itemCount = await queryCount;
      console.log(result);
      this.totalRows = itemCount.count;
      return result.data;
    },
  },
  data() {
    return {
      totalRows: 0,
      perPage: 50,
      listHoaDon: [],
      fieldsHoaDon: [
        {
          key: "id",
          label: "ID",
          thClass: "tdHoaDonTable",
          tdClass: "tdHoaDonTableCell",
        },
        { key: "created_at", label: "Ngày tạo", tdClass: "tdHoaDonTableCell" },
        { key: "tongsotien", label: "Tổng tiền", tdClass: "tdHoaDonTableCell" },
        { key: "product", label: "Sản phẩm" },
      ],
    };
  },
};
</script>

<style>
.tdHoaDonTable {
  max-width: 10px;
}
.tdHoaDonTableCell {
  vertical-align: middle;
}
</style>