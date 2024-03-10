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
        <h3 class="mx-auto">Danh sách Hóa Đơn {{ ngaychon }}</h3>
        <b-overlay :show="overlayGioHang">
          <b-table
            bordered
            no-border-collapse
            class="default_tablegiohang text-center"
            hover
            :items="listhoadon"
            show-empty
            :fields="fieldHoaDon"
            small
            selected-variant="success"
            responsive
          >
            <template #cell(stt)="data">
              {{ data.index + 1 }}
            </template>
            <template #cell(giohang_id)="data">
              <b> {{ data.value }}</b>
            </template>
            <template #cell(somon)="data">
              <b> {{ data.item.bill_listsanpham.length }}</b>
            </template>
            <template #cell(bill_totalmoney)="data">
              <code>{{ $formatSoTien(data.value) }}</code>
            </template>
            <template #cell(bill_realmoney_get)="data">
              <code>{{ $formatSoTien(data.value) }}</code>
            </template>
            <template #cell(bill_code)="data">
              <b class="text-primary" @click="data.toggleDetails">
                {{ data.item.bill_code }}
              </b>
            </template>
            <template #row-details="row">
              <b-card title="Danh sách sản phẩm trong hóa đơn">
                <b-row>
                  <b-col cols="12">
                    <table
                      class="table table-sm table-bordered table-hover"
                      style="width: 100%"
                    >
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Loại</th>
                          <th>GiáV</th>
                          <th>TL.Vàng</th>
                          <th>Kiểu</th>
                          <th>Công</th>
                          <th>Giá</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(item, index) in row.item.bill_listsanpham"
                          :key="index"
                        >
                          <td>
                            <b>{{ index + 1 }}</b>
                          </td>
                          <td>
                            <b
                              @click="showInfoSanPham(item)"
                              class="myHoverProductBarcode"
                            >
                              {{
                                $store.state.config.sanpham_optionCatalog.find(
                                  (i) => i.value === item.product_catalog
                                ).text
                              }}</b
                            >
                          </td>

                          <td>
                            <b class="text-danger">{{
                              item.price.sellingPrice
                            }}</b>
                          </td>

                          <td>
                            <b class="text-danger">{{
                              $formatSoVang(item.product_gold_weight).fullStr
                            }}</b>
                          </td>

                          <td>
                            <b>{{ item.product_type }}</b>
                          </td>

                          <td>
                            <b>{{ item.product_wage }}</b>
                          </td>

                          <td>
                            <b class="text-danger">{{
                              $formatSoTien(item.giahientai)
                            }}</b>
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colspan="5" class="text-center"><b>Tổng</b></td>

                          <td>
                            <b class="text-primary text-right">
                              {{
                                $formatSoTien(
                                  row.item.bill_listsanpham.reduce(
                                    (sum, item) =>
                                      sum + (item.product_wage || 0),
                                    0
                                  )
                                )
                              }}</b
                            >
                          </td>
                          <td>
                            <b class="text-primary text-right">
                              {{
                                $formatSoTien(
                                  row.item.bill_listsanpham.reduce(
                                    (sum, item) => sum + (item.giahientai || 0),
                                    0
                                  )
                                )
                              }}</b
                            >
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </b-col>
                  <b-col
                    cols="6"
                    v-for="(item, index) in row.item.bill_listsanpham"
                    :key="index"
                  >
                    <b-card
                      :title="
                        '#' +
                        (index + 1) +
                        '_' +
                        $store.state.config.sanpham_optionCatalog.find(
                          (i) => i.value === item.product_catalog
                        ).text +
                        '-' +
                        item.product_barcode
                      "
                      :img-src="item.product_image_url"
                      :img-alt="item.product_barcode"
                      img-top
                      class="mb-2"
                    >
                      <b-card-text>
                        <b-row>
                          <b-col cols="6">
                            <table class="table table-sm">
                              <tr>
                                <td>Trọng lượng Tổng</td>
                                <td>
                                  <b class="text-danger">{{
                                    $formatSoVang(item.product_total_weight)
                                      .fullStr
                                  }}</b>
                                </td>
                              </tr>
                              <tr>
                                <td>Trọng lượng hột</td>
                                <td>
                                  <b class="text-danger">{{
                                    $formatSoVang(item.product_stone_weight)
                                      .fullStr
                                  }}</b>
                                </td>
                              </tr>
                              <tr>
                                <td>Trọng lượng đá</td>
                                <td>
                                  <b class="text-danger">{{
                                    $formatSoVang(item.product_gold_weight)
                                      .fullStr
                                  }}</b>
                                </td>
                              </tr>
                            </table>
                          </b-col>
                          <b-col cols="6">
                            <table class="table table-sm">
                              <tr>
                                <td>Loại vàng</td>
                                <td>
                                  <b>{{ item.product_type }}</b>
                                </td>
                              </tr>
                              <tr>
                                <td>Giá vàng</td>
                                <td>
                                  <b>{{ item.price.sellingPrice }}</b>
                                </td>
                              </tr>
                              <tr>
                                <td>Tiền công</td>
                                <td>
                                  <b>{{ item.product_wage }}</b>
                                </td>
                              </tr>
                            </table>
                          </b-col>
                          <b-col cols="12">
                            <div class="text-center text-primary">
                              Tính :
                              {{
                                `${
                                  $formatSoVang(item.product_gold_weight)
                                    .fullStr
                                }x${item.price.sellingPrice}+${
                                  item.product_wage
                                }=${$formatSoTien(item.giahientai)}`
                              }}
                            </div>
                          </b-col>
                        </b-row>
                      </b-card-text>
                    </b-card>
                  </b-col>
                </b-row>
              </b-card>
            </template>
          </b-table>
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
      fieldHoaDon: [
        { key: "stt", label: "#" },
        { key: "bill_code", label: "Mã hóa đơn" },
        { key: "customer_name", label: "Tên khách" },
        { key: "bill_totalmoney", label: "Tổng số tiền" },

        { key: "somon", label: "Số món" },
        { key: "bill_realmoney_get", label: "Thực nhận" },
        { key: "bill_comment", label: "Ghi chú" },
        { key: "giohang_id", label: "Giỏ hàng" },
      ],
      listhoadon: [],
      listGioHang: [],
      imgUrl: null,
    };
  },
  mounted() {
    this.getHoaDon(this.ngaychon).then((data) => {
      console.log(data);
      this.listhoadon = data;
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
      this.getHoaDon(this.ngaychon).then((data) => {
        this.listhoadon = data;
        this.overlayGioHang = false;
      });
    },
    async getHoaDon(date) {
      this.overlayGioHang = true;
      return new Promise(async (resolve, reject) => {
        this.$supabase
          .from("hoadon")
          .select()
          .gte("created_at", date)
          .lte(
            "created_at",
            this.$moment(date).add(1, "days").format("YYYY-MM-DD")
          )
          .then((data) => {
            if (data.data.length > 0) {
              this.overlayGioHang = false;
              resolve(data.data);
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