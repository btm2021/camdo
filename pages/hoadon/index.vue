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
                  <b-button variant="primary" @click="inHoaDon(data.item)"
                    >In Hóa Đơn</b-button
                  >
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
                    <b-table
                      :items="row.item.sanpham"
                      :fields="fieldSanpham"
                      small
                      hover
                      responsive
                    >
                      <template #cell(stt)="data">
                        <b>{{ data.index + 1 }}</b>
                      </template>
                      <template #cell(klt)="data">
                        <span class="text-primary font-weight-bold">
                          {{ $formatSoVang(data.value).fullStr }}
                        </span>
                      </template>
                      <template #cell(anhsanpham)="data">
                        <b-img-lazy
                          :src="data.value"
                          style="width: 50px; height: 50px"
                        />
                      </template>
                      <template #cell(klh)="data">
                        <span class="text-primary font-weight-bold">
                          {{ $formatSoVang(data.value).fullStr }}
                        </span>
                      </template>
                      <template #cell(tool)="data">
                        <b-button
                          variant="danger"
                          @click="deleteSpInHoaDon(data.item, row.item)"
                          >Xóa khỏi hóa đơn</b-button
                        >
                      </template>
                      <template #cell(created_at)="data">
                        <span class="text-primary font-weight-bold">
                          {{ $moment(data.value).format("DD/MM/YYYY") }}
                        </span>
                      </template>
                      <template #cell(klv)="data">
                        <span class="text-danger font-weight-bold">
                          {{ $formatSoVang(data.value).fullStr }}
                        </span>
                      </template>
                      <template #cell(giatrixuat)="data">
                        <span class="text-danger font-weight-bold">
                          {{ $formatSoTien(data.value) }}
                        </span>
                      </template>
                      <template #cell(maso)="data">
                        <span class="text-warning font-weight-bold">
                          {{ data.value }}
                        </span>
                      </template>
                    </b-table>
                  </b-card>
                </template>
              </b-table>
            </b-overlay></b-tab
          >
          <b-tab title="Danh sách sản phẩm">
            <b-table
              bordered
              no-border-collapse
              class="default_tablegiohang text-center"
              hover
              :fields="fieldSanpham"
              :items="listsanpham"
              show-empty
              small
              selected-variant="success"
              responsive
            >
              <template #cell(stt)="data">
                <b>{{ data.index + 1 }}</b>
              </template>
              <template #cell(klt)="data">
                <span class="text-primary font-weight-bold">
                  {{ $formatSoVang(data.value).fullStr }}
                </span>
              </template>
              <template #cell(anhsanpham)="data">
                <b-img-lazy
                  :src="data.value"
                  style="width: 50px; height: 50px"
                />
              </template>
              <template #cell(klh)="data">
                <span class="text-primary font-weight-bold">
                  {{ $formatSoVang(data.value).fullStr }}
                </span>
              </template>
              <template #cell(tool)="data">
                <b-button
                  variant="danger"
                  @click="deleteSpInHoaDon(data.item, row.item)"
                  >Xóa khỏi hóa đơn</b-button
                >
              </template>
              <template #cell(created_at)="data">
                <span class="text-primary font-weight-bold">
                  {{ $moment(data.value).format("DD/MM/YYYY") }}
                </span>
              </template>
              <template #cell(klv)="data">
                <span class="text-danger font-weight-bold">
                  {{ $formatSoVang(data.value).fullStr }}
                </span>
              </template>
              <template #cell(giatrixuat)="data">
                <span class="text-danger font-weight-bold">
                  {{ $formatSoTien(data.value) }}
                </span>
              </template>
              <template #cell(maso)="data">
                <span class="text-warning font-weight-bold">
                  {{ data.value }}
                </span>
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
      fieldSanpham: [
        { key: "stt", label: "#" },
        { key: "anhsanpham", label: "Ảnh" },
        { key: "name", label: "Sp" },

        { key: "maso", label: "Mã số" },
        { key: "klt", label: "KLT" },
        { key: "klh", label: "KLH" },
        { key: "klv", label: "KLV" },
        { key: "cong", label: "Công" },

        { key: "giatrixuat", label: "Giá xuất" },

        { key: "created_at", label: "Ngày nhập" },

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
    async deleteSpInHoaDon(item, hoadon) {
      this.overlayGioHang = true;
      await this.$supabase
        .from("sanpham")
        .update({ id_hoadonban: null, daban: false })
        .eq("id", item.id);
      if (hoadon.somon == 1) {
        //xóa luôn hoadon
        await this.$supabase.from("hoadon_ban").delete().eq("id", hoadon.id);
      } else {
        await this.$supabase
          .from("hoadon_ban")
          .update({ somon: hoadon.somon - 1 })
          .eq("id", hoadon.id);
      }

      this.getHoaDon(this.ngaybatdau, this.ngayketthuc).then((data) => {
        this.listhoadon = data;
      });
      this.overlayGioHang = false;
    },
    async deleteItem(item) {
      //xoa item sp có refe
      this.overlayGioHang = true;
      for (let i = 0; i < item.sanpham.length; i++) {
        await this.$supabase
          .from("sanpham")
          .update({ id_hoadonban: null, daban: false })
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
  watch: {
    listhoadon(newVal, oldVal) {
      console.log(newVal);
      let allSp = [];
      newVal.map((i) => {
        i.sanpham.map((item) => {
          allSp.push(item);
        });
      });
      this.listsanpham = allSp;
    },
  },
};
</script>

<style>
</style>