<template>
  <div>
    <b-card>
      <b-row>
        <b-col cols="12"> </b-col>

        <b-col cols="6">
          <b-form-group label="Hóa đơn nhập">
            <b-button href="/sanpham/taohoadonnhap" variant="primary"
              >Tạo mới hóa đơn nhập hàng chành</b-button
            >
          </b-form-group>
          <b-overlay :show="overlay.hoadon">
            <b-table
              select-mode="single"
              selectable
              selected-variant="success"
              small
              :items="listhoadon"
              :fields="fieldsHoaDon"
            >
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
                    <b-col
                      cols="6"
                      class="mt-2"
                      v-for="(anh, index) in row.item.hinhanh"
                      :key="index"
                    >
                      <b-img lazy :src="anh.link" style="height: 300px"></b-img>
                    </b-col>
                  </b-row>

                  <b-button size="sm" @click="row.toggleDetails"
                    >Ẩn chi tiết</b-button
                  >
                </b-card>
              </template>
              <template #cell(nhacungcap.short)="data">
                <b class="text-primary">{{ data.value }}</b>
              </template>
              <template #cell(tool)="data">
                <b-button
                  size="sm"
                  variant="danger"
                  @click="removeHoadon(data.item)"
                  >Delete</b-button
                >
              </template>
            </b-table>
          </b-overlay>
        </b-col>

        <b-col cols="6">
          <b-form-group label="Ngày tạo sản phẩm">
            <b-form-datepicker v-model="dayChoice"></b-form-datepicker>
          </b-form-group>
          <b-overlay :show="overlay.sanpham">
            <b-table
              select-mode="single"
              selectable
              selected-variant="success"
              small
              :items="listhoadon"
              :fields="fieldsHoaDon"
            >
              <template #cell(ngaytao)="data">
                <b class="text-danger">{{
                  $moment(data.value).format("DD-MM-YYYY")
                }}</b>
              </template>
              <template #cell(nhacungcap.short)="data">
                <b class="text-primary">{{ data.value }}</b>
              </template>
              <template #cell(tool)="data">
                <b-button
                  size="sm"
                  variant="danger"
                  @click="removeHoadon(data.item)"
                  >Delete</b-button
                >
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
      overlay: {
        hoadon: true,
        sanpham: true,
      },
    };
  },
  mounted() {
    this.getListhoadon().then((data) => {
      this.listhoadon = data;
      console.log(data);
      this.overlay.hoadon = false;
    });
    // this.getlistsanpham(this.dayChoice).then((data) => {
    //   this.listsanpham = data;
    //   console.log(data);
    //   this.overlay.sanpham = false;
    // });
  },
  methods: {
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
    async getlistsanpham(datetime) {
      return new Promise(async (resolve, reject) => {
        let result = await this.$supabase
          .from("sanpham")
          .select("*,nhacungcap(*)")
          .eq("created_at", datetime);
        let d = result.data.map((item) => {
          return {
            ...item,
            countsanpham: item.sanpham[0].count,
          };
        });
        resolve(d);
      });
    },
  },
};
</script>