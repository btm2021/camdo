<template>
  <b-container class="mt-4">
    <b-overlay :show="overlay">
      <div v-if="dataReady">
        <h3 class="text-danger text-center">Thông tin hóa đơn</h3>
        <b-table-simple responsive small hover bordered class="mt-3" fixed>
          <b-tbody>
            <b-tr>
              <b-td><b>Mã hóa đơn</b></b-td>

              <b-td
                ><b class="text-danger">{{ dataHoadon.mahoadon }}</b></b-td
              >
            </b-tr>
            <b-tr>
              <b-td><b>Ngày tạo hóa đơn</b></b-td>

              <b-td
                ><b class="text-danger">{{
                  $moment(dataHoadon.ngaytao).format("DD/MM/YYYY")
                }}</b></b-td
              >
            </b-tr>
            <b-tr>
              <b-td><b>Tổng sản phẩm trong hóa đơn</b></b-td>

              <b-td
                ><b class="text-danger">{{
                  dataHoadon.sanpham.length
                }}</b></b-td
              >
            </b-tr>
            <b-tr>
              <b-td
                ><b
                  >Tổng giá trị nhập (tính bằng tổng số tiền sản phẩm nhập không
                  trừ giẻ)
                </b></b-td
              >

              <b-td
                ><b class="text-danger"
                  >{{
                    $formatSoTien(
                      dataHoadon.sanpham.reduce(
                        (acc, current) => acc + current.giatrinhap,
                        0
                      )
                    )
                  }}
                  VND</b
                ></b-td
              >
            </b-tr>
            <b-tr>
              <b-td><b>Nhà cung cấp</b></b-td>

              <b-td
                ><b class="text-danger">{{
                  dataHoadon.nhacungcap.name
                }}</b></b-td
              >
            </b-tr>
            <b-tr>
              <b-td><b>Mũi hiệu nhà cung cấp</b></b-td>

              <b-td
                ><b class="text-danger">{{
                  dataHoadon.nhacungcap.short
                }}</b></b-td
              >
            </b-tr>
            <b-tr>
              <b-td><b>Địa chỉ Nhà cung cấp</b></b-td>

              <b-td
                ><b class="text-danger">{{
                  dataHoadon.nhacungcap.address
                }}</b></b-td
              >
            </b-tr>
            <b-tr>
              <b-td><b>Tiêu chuẩn cơ sở nhà cung cấp</b></b-td>

              <b-td
                ><b class="text-danger">{{
                  dataHoadon.nhacungcap.tccs
                }}</b></b-td
              >
            </b-tr>
            <b-tr>
              <b-td colspan="2"
                ><b>Giấy tờ tương ứng</b>
                <b-row>
                  <b-col
                    cols="4"
                    v-for="(hinhanh, index) in dataHoadon.hinhanh"
                    :key="index"
                  >
                    <b-img
                      lazy
                      :src="hinhanh.link"
                      style="width: 100%; height: 300px"
                    ></b-img>
                  </b-col>
                </b-row>
              </b-td>
            </b-tr>
            <b-tr>
              <b-td colspan="2"
                ><b class="text-danger text-center"
                  >Danh sách sản phẩm trong hóa đơn</b
                ></b-td
              >
            </b-tr>
            <b-tr>
              <b-td colspan="2">
                <b-row>
                  <b-col cols="12">
                    <b-table
                      :items="dataHoadon.sanpham"
                      :fields="fieldSanpham"
                      small
                      hover
                      responsive
                    >
                      <template #cell(klt)="data">
                        <b>{{ $formatSoVang(data.value).fullStr }}</b>
                      </template>
                      <template #cell(stt)="data">
                        <b>{{ data.index + 1 }}</b>
                      </template>
                      <template #cell(anhsanpham)="data">
                        <b-img
                          :src="data.value"
                          style="width: 50px; height: 50px"
                          lazy
                        ></b-img>
                      </template>

                      <template #cell(klh)="data">
                        <b>{{ $formatSoVang(data.value).fullStr }}</b>
                      </template>
                      <template #cell(klv)="data">
                        <b class="text-danger">{{
                          $formatSoVang(data.value).fullStr
                        }}</b>
                      </template>
                    </b-table>
                  </b-col>
                </b-row>
              </b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
      </div>
    </b-overlay>
  </b-container>
</template>
<script>
export default {
  mounted() {
    this.overlay = true;
    this.getHoadon(this.$route.query.id || null).then((data) => {
      this.dataHoadon = data;
      this.overlay = false;
      this.dataReady = true;
    });
  },
  methods: {
    async getHoadon(id) {
      console.log(id);
      return new Promise((resolve, reject) => {
        if (!id) {
        } else {
          this.$supabase
            .from("hoadonnhap")
            .select(
              "*,sanpham(*,kieusanpham(*),banggia(*)),nhacungcap(*),hinhanh(*)"
            )
            .eq("id", id)
            .then((data) => {
              console.log(data.data[0]);
              resolve(data.data[0]);
            });
        }
      });
    },
  },
  data() {
    return {
      overlay: false,
      dataHoadon: null,
      dataReady: false,
      fieldSanpham: [
        { key: "stt", label: "STT" },
        { key: "maso", label: "Công" },
        { key: "anhsanpham", label: "Ảnh" },
        { key: "name", label: "Tên Sản phẩm" },
        { key: "kieusanpham.short", label: "Loại Sản phẩm" },
        { key: "banggia.code", label: "Loại Vàng" },
        { key: "klt", label: "KL.Tổng" },
        { key: "klh", label: "KL.Hột" },
        { key: "klv", label: "KL.Vàng" },
        { key: "cong", label: "Công" },
      ],
    };
  },
};
</script>