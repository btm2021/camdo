<template>
  <div>
    <b-card>
      <b-row>


        <b-col cols="6">
          <b-form-group label="Hóa đơn nhập">
            <b-button href="/sanpham/taohoadonnhap" variant="primary">Tạo mới hóa đơn nhập hàng chành</b-button>
          </b-form-group>
          <b-overlay :show="overlay.hoadon">
            <b-table select-mode="single" selectable selected-variant="success" small :items="listhoadon"
              :fields="fieldsHoaDon">
              <template #cell(ngaytao)="data">
                <b class="text-danger">{{
                  $moment(data.value).format("DD-MM-YYYY")
                }}</b>
              </template>
              <template #cell(mahoadon)="data">
                <b class="text-danger" @click="data.toggleDetails">{{
                  shortenUUID(data.value)
                }}</b>
              </template>

              <template #row-details="row">
                <b-card>
                  <b-row class="mb-2">
                    <b-col cols="6" class="mt-2" v-for="(anh, index) in row.item.hinhanh" :key="index">
                      <b-img lazy :src="anh.link" style="height: 300px"></b-img>
                    </b-col>
                  </b-row>

                  <b-button size="sm" @click="row.toggleDetails">Ẩn chi tiết</b-button>
                </b-card>
              </template>
              <template #cell(nhacungcap.short)="data">
                <b class="text-primary">{{ data.value }}</b>
              </template>
              <template #cell(tool)="data">
                <b-button size="sm" variant="danger" @click="removeHoadon(data.item)">Delete</b-button>
              </template>
            </b-table>
          </b-overlay>
        </b-col>

        <b-col cols="6">
          <b-row>
            <b-col cols="6">
              <b-form-group label="Ngày tạo sản phẩm">
                <b-form-datepicker @input="refreshListSanPham" v-model="dayChoice"></b-form-datepicker>
              </b-form-group>
            </b-col>
            <b-col cols="6">
              <b-form-group label="Nhập sản phẩm">
                <b-button variant="primary" @click="taohoadontuongung">Nhập hóa đơn cho sản phẩm</b-button>
              </b-form-group>

            </b-col>

          </b-row>

          <b-overlay :show="overlay.sanpham">
            <b-table select-mode="single" selectable selected-variant="success" :fields="fieldSanpham" small
              :items="listsanpham">
              <template #cell(klv)="data">
                <b class="text-danger">{{
                  $formatSoVang(data.value).fullStr
                }}</b>
              </template>
              <template #cell(anhsanpham)="data">
                <b-img lazy :src="data.value" style="width:50px;height: 50px;"/>
              </template>

            </b-table>
          </b-overlay>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      listhoadon: [],
      listsanpham: [],
      ngaychon: null,
      dayChoice: this.$moment().format("YYYY-MM-DD"),
      fieldsHoaDon: [
        { key: "mahoadon", label: "Mã", sortable: true },
        { key: "nhacungcap.short", label: "Chành", sortable: true },
        { key: "ngaytao", label: "Ngày Hóa đơn", sortable: true },
        { key: "countsanpham", label: "Số sản phẩm", sortable: true },
        { key: "tool", label: "Tool" },
      ],
      fieldSanpham: [
        { key: "anhsanpham", label: "Ảnh", sortable: true },
        { key: "maso", label: "Mã", sortable: true },
        { key: "klt", label: "KLT", sortable: true },
        { key: "klv", label: "KLV", sortable: true },
        { key: "cong", label: "Công", sortable: true },
        { key: "banggia.code", label: "Loại vàng", sortable: true },
        { key: "kieusanpham.short", label: "Kiểu", sortable: true },
        { key: "nhacungcap.short", label: "Ncc", sortable: true },

      ],
      overlay: {
        hoadon: true,
        sanpham: true,
      },
    };
  },
  mounted() {
    this.getListhoadon().then((data) => {
      this.listhoadon = data;

      this.overlay.hoadon = false;
    });
    this.getlistsanpham(this.dayChoice).then((data) => {
      this.listsanpham = data;
      this.overlay.sanpham = false;
    });
  },
  methods: {
    taohoadontuongung() {

    },
    shortenUUID(uuid) {
      return uuid.substring(0, 3) + "..." + uuid.substring(uuid.length - 3);
    },
    removeHoadon(item) {
      this.overlay.hoadon = true;
      this.$supabase
        .from("hoadonnhap")
        .delete()
        .eq("id", item.id)
        .then((data) => {
          this.getListhoadon().then((data) => {
            this.listhoadon = data;
            this.overlay.hoadon = false;
          });
        });
    },
    async getListhoadon() {
      return new Promise(async (resolve, reject) => {
        let result = await this.$supabase
          .from("hoadonnhap")
          .select("*,nhacungcap(*),sanpham(count),hinhanh(*)")
          .order("ngaytao", { ascending: false });
        let d = result.data.map((item) => {
          return {
            ...item,
            countsanpham: item.sanpham[0].count,
          };
        });
        resolve(d);
      });
    },
    refreshListSanPham() {

      this.overlay.sanpham = true;
      this.getlistsanpham(this.dayChoice).then((data) => {
        this.listsanpham = data;
        console.log(data);
        this.overlay.sanpham = false;
      });
    },
    async getlistsanpham(datetime) {
      console.log(datetime)
      let t1 = (new Date(datetime)).toISOString()
      let date2 = new Date(datetime);
      date2.setDate(date2.getDate() + 1) // just for example so that we do not have the same date twice
      let t2 = date2.toISOString()

      return new Promise(async (resolve, reject) => {
        let result = await this.$supabase
          .from("sanpham")
          .select("*,nhacungcap(*),banggia(*),kieusanpham(*)")
          .gte("created_at", t1)
          .lte("created_at", t2)

        resolve(result.data);
      });
    },
  },
};
</script>