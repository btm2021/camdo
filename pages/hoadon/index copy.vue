<template>
  <div>
    <b-modal id="modalImage1" hide-footer hide-header>
      <b-img :src="imgUrl" style="width: 100%; height: 500px"> </b-img>
    </b-modal>
    <b-row class="mx-auto mt-2">
      <b-col cols="2">
        <b-form-group label="Ngày bắt đầu">
          <b-form-datepicker
            locale="vi-VN"
            block
            :date-format-options="{
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            }"
            v-model="ngaybatdau"
            @input="changeDate"
          ></b-form-datepicker>
        </b-form-group>
        <b-form-group label="Ngày Kết thúc">
          <b-form-datepicker
            locale="vi-VN"
            v-model="ngayketthuc"
            :date-format-options="{
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            }"
            block
            @input="changeDate"
          ></b-form-datepicker>
        </b-form-group>
      </b-col>

      <b-col cols="10">
        <b-tabs content-class="mt-3">
          <b-tab title="Danh sách hóa đơn" active>
            <h3 class="mx-auto">Danh sách Hóa Đơn {{ ngaychon }}</h3>
            <b-overlay :show="overlayGioHang">
              <b-table
                bordered
                no-border-collapse
                class="default_tablegiohang text-center"
                hover
                :items="listhoadon"
                show-empty
                small
                :fields="fieldHoaDon"
                selected-variant="success"
                responsive
              >
                <template #cell(stt)="data">
                  {{ data.index + 1 }}
                </template>
                <template #cell(created_at)="data">
                  {{ $moment(data.value).format("HH:mm") }}
                </template>
                <template #cell(somon)="data">
                  <b> {{ data.value }}</b>
                </template>
                <template #cell(tongtien)="data">
                  <code>{{ $formatSoTien(data.value) }}</code>
                </template>
                <template #cell(tool)="data">
                  <b-button variant="danger" @click="deleteItem(data.item)"
                    >Delete</b-button
                  >
                </template>
                <template #cell(thucnhan)="data">
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

                              <th>Tool</th>
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
                                  $formatSoVang(item.product_gold_weight)
                                    .fullStr
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
                              <td>
                                <b-button
                                  variant="danger"
                                  @click="xoasanphamhoadon(item, row.item)"
                                  >Xóa</b-button
                                >
                              </td>
                            </tr>
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colspan="5" class="text-center">
                                <b>Tổng</b>
                              </td>

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
                                        (sum, item) =>
                                          sum + (item.giahientai || 0),
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
            </b-overlay></b-tab
          >
          <b-tab title="Danh sách sản phẩm">
            <b-row>
              <b-col cols="3" class="mx-auto mb-3">
                <b-form-select
                  v-model="filter.product_catalog"
                  :options="$store.state.config.sanpham_optionCatalog_view"
                ></b-form-select>
              </b-col>
              <b-col cols="3" class="mx-auto mb-3">
                <b-form-select
                  v-model="filter.product_type"
                  :options="$store.state.config.sanpham_optionLoaiVang_view"
                ></b-form-select>
              </b-col>
              <b-col cols="2" class="mx-auto mb-3">
                <b-input
                  v-model="filter.product_barcode"
                  block
                  class="text-center text-danger"
                ></b-input>
              </b-col>
              <b-col cols="2" class="mx-auto mb-3">
                <b-input
                  v-model="filter.product_barcode"
                  block
                  class="text-center text-danger"
                ></b-input>
              </b-col>
              <b-col cols="2" class="mx-auto mb-3">
                <b-input
                  v-model="filter.product_barcode"
                  block
                  class="text-center text-danger"
                ></b-input>
              </b-col>
            </b-row>

            <b-table
              bordered
              no-border-collapse
              class="default_tablegiohang text-center"
              hover
              :items="listsanpham"
              show-empty
              small
              :fields="fieldsGioHang"
              selected-variant="success"
              responsive
            >
              <template #cell(stt)="data">
                {{ data.index + 1 }}
              </template>
              <template #cell(price)="data">
                {{ data.item.price.sellingPrice }}
              </template>
              <template #cell(product_wage)="data">
                <strong>{{ data.item.product_wage }}</strong>
              </template>

              <template #cell(giahientai)="data">
                <strong class="text-danger">{{
                  $formatN(data.item.giahientai)
                }}</strong>
              </template>

              <template #cell(tool)="data">
                <b-button variant="danger" @click="deleteItem(data.item.id)"
                  >Delete</b-button
                >
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

              <template #cell(product_barcode)="data">
                <b
                  class="myHoverProductBarcode"
                  @click="showInfoSanPham(data.item)"
                >
                  {{ data.item.product_barcode }}
                  <span>
                    <b-badge variant="primary">{{
                      data.item.hoadon_id
                    }}</b-badge>
                  </span>
                </b>
              </template>

              <template #cell(propduct_type)="data">
                <strong class="text-primary">{{
                  data.item.product_type
                }}</strong>
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
                  lazy
                  @click="showImage(data.item.product_image_url)"
                  :src="data.item.product_image_url"
                  style="width: 25px; height: 25px"
                />
              </template>
            </b-table>
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ngaybatdau: this.$moment().format("YYYY-MM-DD"),
      ngayketthuc: this.$moment().format("YYYY-MM-DD"),
      context: null,
      ngaychon: this.$moment().format("YYYY-MM-DD"),
      overlayGioHang: false,
      fieldHoaDon: [
        { key: "stt", label: "#" },

        { key: "created_at", label: "Thời gian" },
        { key: "bill_code", label: "Mã hóa đơn" },
        { key: "tenkhach", label: "Tên khách" },
        { key: "tongtien", label: "Tổng số tiền" },
        { key: "somon", label: "Số món" },
        { key: "thucnhan", label: "Thực nhận" },
        { key: "ghichu", label: "Ghi chú" },
        { key: "chitiet", label: "Chi tiết" },

        { key: "tool", label: "#" },
      ],
      fieldsGioHang: [
        { key: "stt", label: "#" },
        { key: "product_image_url", label: "Ảnh" },
        { key: "product_barcode", label: "Mã" },
        { key: "product_type", label: "Loại" },
        { key: "price", label: "GiáV" },
        { key: "product_catalog", label: "Kiểu" },
        { key: "product_total_weight", label: "Tổng", sortable: true },
        { key: "product_stone_weight", label: "Hột", sortable: true },
        { key: "product_gold_weight", label: "Vàng", sortable: true },
        { key: "product_wage", label: "Công", sortable: true },
        { key: "giahientai", label: "Giá", sortable: true },
        { key: "tool", label: "#", sortable: true },
      ],
      filter: {
        product_catalog: "null",
        product_type: "null",
      },
      listhoadon: [],
      listsanpham: [],
      imgUrl: null,
    };
  },
  mounted() {
    this.getHoaDon(this.ngaybatdau, this.ngayketthuc).then((data) => {
      this.listhoadon = data;
    });
  },
  methods: {
    async deleteItem(item) {
      //xoa item sp có refe
      this.overlayGioHang=true;
      for (let i = 0; i < item.sanpham.length; i++) {
        await this.$supabase
          .from("sanpham")
          .update({ id_hoadonban: null })
          .eq("id", item.sanpham[i].id);
      }
      //xoa
      await this.$supabase.from("hoadon_ban").delete().eq("id", item.id);
      this.getHoaDon(this.ngaybatdau, this.ngayketthuc).then((data) => {
        this.listhoadon = data;
      });
    },

    xoasanphamhoadon(sanpham, hoadon) {
      console.log(sanpham);
      console.log(hoadon);
    },
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
    getListSanpham(listhoadon) {
      let listsanpham = [];
      listhoadon.map((item) => {
        item.bill_listsanpham.map((itemSp) => {
          listsanpham.push(itemSp);
        });
      });
      this.listsanpham = listsanpham;
    },
    changeDate() {
      this.overlayGioHang = true;
      this.getHoaDon(this.ngaybatdau, this.ngayketthuc).then((data) => {
        this.listhoadon = data;
        this.overlayGioHang = false;
      });
    },
    async getHoaDon(dateStart, dateEnd) {
      console.log(dateEnd, dateStart);
      this.overlayGioHang = true;
      dateEnd = this.$moment(dateEnd).add(1, "days").format("YYYY-MM-DD");
      return new Promise(async (resolve, reject) => {
        let hoadon_hientai = await this.$supabase
          .from("hoadon_ban")
          .select(
            "*,sanpham(*,banggia(*),kieusanpham(*),nhacungcap(*)),giohangsanpham(*)"
          )
          .gte("created_at", dateStart)
          .lte("created_at", dateEnd);
        this.overlayGioHang = false;
        resolve(hoadon_hientai.data);
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