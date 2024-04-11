<template>
  <div>
    <b-row>
      <b-col cols="6">
        <b-overlay :show="overlay.hoadon">
          <b-button class="mt-3 mb-3" variant="success"
            >Tạo mới hóa đơn</b-button
          >
          <b-table
            :items="listhoadon"
            show-empty
            small
            responsive
            striped
            hover
            :fields="fieldHoaDon"
          >
            <template #cell(stt)="data">
              <b @click="xemHoaDon(data.item)" class="myHoadon">
                {{ data.index + 1 }}
              </b>
            </template>
            <template #cell(created_at)="data">
              <b>
                {{ $moment(data.value).format("DD/MM/YYYY") }}
              </b>
            </template>
          </b-table>
        </b-overlay>
      </b-col>
      <b-col cols="6">
        <b-overlay :show="overlay.sanpham">
          <b-button class="mt-3 mb-3" variant="success"
            >Thêm SP vào hóa đơn</b-button
          >
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
              <b-img-lazy :src="data.value" style="width: 50px; height: 50px" />
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
        </b-overlay>
      </b-col>
    </b-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      overlay: {
        hoadon: false,
        sanpham: false,
      },
      listhoadon: [],
      listsanpham: [],
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
      fieldHoaDon: [
        { key: "stt", label: "#" },
        { key: "created_at", label: "Ngày nhập" },
        { key: "somon", label: "Số món" },
        { key: "klv", label: "KLV" },
        { key: "nhacungcap.short", label: "Nơi nhập" },
        { key: "giatrinhap", label: "Giá hóa đơn" },
      ],
    };
  },
  mounted() {
    this.getHoaDon();
  },
  methods: {
    async xemHoaDon(id) {
      this.overlay.sanpham = true;
      let d = await this.$supabase
        .from("sanpham")
        .select("*")
        .eq("id_hoadonnhap", id.id);

      this.listsanpham = d.data;
      this.overlay.sanpham = false;
    },
    async getHoaDon() {
      this.overlay.hoadon = true;
      let listhd = await this.$supabase
        .from("hoadonnhap")
        .select("*,nhacungcap(*)");
      this.listhoadon = listhd.data;
      this.overlay.hoadon = false;
    },
  },
};
</script>
<style>
.myHoadon:hover {
  color: red;
  cursor: pointer;
}
</style>
