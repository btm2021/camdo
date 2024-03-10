<template>
  <div>
    <b-modal id="modalImage1" hide-footer hide-header>
      <b-img :src="imgUrl" style="width: 100%; height: 500px"> </b-img>
    </b-modal>
    <b-row class="mx-auto mt-2">
      <b-col cols="3">
        <b-calendar
          block
          v-model="ngaychon"
          @context="onContext"
          locale="vi-VN"
          today-variant="primary"
          selected-variant="success"
          nav-button-variant="primary"
          @input="changeDate()"
        ></b-calendar>
      </b-col>

      <b-col cols="9">
        <h3 class="mx-auto">Danh sách sản phẩm đã bán {{ ngaychon }}</h3>
        <b-overlay :show="overlayGioHang">
          <b-table
            bordered
            no-border-collapse
            class="default_tablegiohang text-center"
            hover
            style=""
            :fields="fieldsGioHang"
            :items="listGioHang"
            show-empty
            small
            selected-variant="success"
            responsive
          >
            <template #cell(stt)="data">
              {{ data.index + 1 }}
            </template>

            <template #cell(product_wage)="data">
              <strong>{{ data.item.product_wage }}</strong>
            </template>

            <template #cell(giahientai)="data">
              <strong class="text-danger">{{
                $formatN(data.item.giahientai)
              }}</strong>
            </template>
            <template #cell(product_total_weight)="data">
              <span>{{
                $formatSoVang(data.item.product_total_weight).fullStr
              }}</span>
            </template>
            <template #cell(product_stone_weight)="data">
              <span>{{
                $formatSoVang(data.item.product_stone_weight).fullStr
              }}</span>
            </template>
            <template #cell(product_gold_weight)="data">
              <b class="text-primary">{{
                $formatSoVang(data.item.product_gold_weight).fullStr
              }}</b>
            </template>

            <template #cell(propduct_barcode)="data">
              <strong class="text-primary">{{
                data.item.product_barcode
              }}</strong>
            </template>

            <template #cell(propduct_type)="data">
              <strong class="text-primary">{{ data.item.product_type }}</strong>
            </template>
            <template #cell(product_catalog)="data">
              <strong class="text-primary">
                {{
                  $store.state.config.sanpham_optionCatalog.find(
                    (i) => i.value === data.item.product_catalog
                  ).text
                }}
              </strong>
            </template>

            <template #cell(remove)="data">
              <b-button variant="danger" @click="xoaSanPhamGioHang(data.item)"
                >Xóa</b-button
              >
            </template>
            <template #cell(product_image_url)="data">
              <b-img
                @click="showImage(data.item.product_image_url)"
                :src="data.item.product_image_url"
                style="width: 25px; height: 25px"
              />
            </template>
          </b-table>
          <strong
            v-if="listGioHang && listGioHang.length > 0"
            class="mr-auto text-danger"
          >
            <ul>
              <li>
                Tổng giá trị : {{ $formatSoTien(getTongGiaTriGioHang()) }}
              </li>
              <li>
                Tổng trọng lượng :
                {{ $formatSoVang(getTongTrongLuongGioHang()).fullStr }}
              </li>
              <li>
                Tổng tiền công :
                {{ $formatSoTien(getTongGiaTriTienCongGioHang()) }}
              </li>
            </ul>
          </strong>

          <strong v-else>Giỏ hàng trống</strong>
        </b-overlay>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      context: null,
      ngaychon: this.$moment().format("YYYY-MM-DD"),
      overlayGioHang: false,
      fieldsGioHang: [
        { key: "stt", label: "#" },
        { key: "product_image_url", label: "Ảnh" },
        { key: "product_barcode", label: "Mã" },
        { key: "product_type", label: "Loại", sortable: true },
        { key: "product_catalog", label: "Kiểu", sortable: true },
        { key: "product_total_weight", label: "Tổng", sortable: true },
        { key: "product_stone_weight", label: "Hột", sortable: true },
        { key: "product_gold_weight", label: "Vàng", sortable: true },
        { key: "product_wage", label: "Công", sortable: true },
        { key: "giahientai", label: "Giá", sortable: true },
        { key: "remove", label: "#" },
      ],
      listGioHang: [],
      imgUrl: null,
    };
  },
  mounted() {
    this.getGioHang(this.ngaychon).then((data) => {
      this.listGioHang = data.listsanpham;
    });
  },
  methods: {
    getTongGiaTriGioHang() {
      let count = 0;
      this.listGioHang.forEach((item) => {
        count += item.giahientai;
      });
      return count;
    },
    getTongGiaTriTienCongGioHang() {
      let count = 0;
      this.listGioHang.forEach((item) => {
        count += item.product_wage;
      });
      return count;
    },
    getTongTrongLuongGioHang() {
      let count = 0;
      this.listGioHang.forEach((item) => {
        count += item.product_gold_weight;
      });
      return count;
    },
    showImage(url) {
      this.imgUrl = url;
      this.$bvModal.show("modalImage1");
    },
    xoaSanPhamGioHang(item) {
      this.overlayGioHang = true;
      this.listGioHang = this.listGioHang.filter((x) => x !== item);

      this.$supabase
        .from("giohang")
        .update({ listsanpham: this.listGioHang })
        .eq("created_at", this.ngaychon)
        .then((data) => {
          this.overlayGioHang = false;
        });
    },
    changeDate() {
      this.overlayGioHang = true;
      this.getGioHang(this.ngaychon).then((data) => {
        this.listGioHang = data.listsanpham;
        this.overlayGioHang = false;
      });
    },
    async getGioHang(date) {
      return new Promise(async (resolve, reject) => {
        this.$supabase
          .from("hoadon")
          .select()
          .eq("created_at", date)
          .then((data) => {
            if (data.data.length > 0) {
              resolve(data.data[0]);
            } else {
              resolve([]);
            }
          });
      });
    },
    onContext(ctx) {
      this.context = ctx;
    },
  },
};
</script>

<style>
</style>