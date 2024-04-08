<template>
  <b-row>
    <b-col cols="12" class="mt-3">
      <b-row no-gutters>
        <b-col cols="4">
          <b-button variant="primary" @click="intemSingle">In Tem Cầm đồ đã chọn
          </b-button>

          <b-button variant="success" @click="selectAllRow">Chọn tất cả</b-button></b-col>

        <b-col cols="12" class="min-vw-100">
          <b-table caption="Sản phẩm chưa in tem" caption-top style="min-height: 400px"
            class="my_table align-middle w-auto" responsive bordered small no-border-collapseÏ ref="my_table"
            :busy="tableOverlay" :items="myProvider" show-empty select-mode="multi" selectable
            head-row-variant="success" :fields="tableField" @row-selected="onRowSelected">
            <template #cell(index)="data">
              {{ data.index + 1 }}
            </template>

            <template #cell(klt)="data">
              <!-- `data.value` is the value after formatted by the Formatter -->
              {{ $formatSoVang(data.value).fullStr }}
            </template>
            <template #cell(klv)="data">
              <!-- `data.value` is the value after formatted by the Formatter -->
              {{ $formatSoVang(data.value).fullStr }}
            </template>
            <template #cell(klh)="data">
              <!-- `data.value` is the value after formatted by the Formatter -->
              {{ $formatSoVang(data.value).fullStr }}
            </template>

            <template #cell(anhsanpham)="data">
              <!-- `data.value` is the value after formatted by the Formatter -->
              <b-img-lazy :src="data.value" width="50px" height="50px"></b-img-lazy>
            </template>

            <template #table-busy>
              <div class="text-center text-danger my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>Chờ xíu...</strong>
              </div>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
export default {
  data() {
    return {
      selected: [],
      currentPage: 1,
      totalRows: 0,
      perPage: 30,
      tableField: [
        {
          key: "index",
          label: "#",
        },
        {
          key: "anhsanpham",
          label: "Ảnh",
        },
        {
          key: "kieusanpham.short",
          label: "Kiểu sản phẩm",
        },
        {
          key: "banggia.code",
          label: "Loại vàng",
        },
        {
          key: "klt",
          label: "TL. Tổng",
        },
        {
          key: "klh",
          label: "TL. Đá",
        },
        {
          key: "klv",
          label: "TL. Vàng",
        },
        {
          key: "cong",
          label: "Công",
        }
      ],
      allListData: null,
      tableOverlay: false,
    };
  },
  methods: {
    deleteItem(id) {
      this.$supabase
        .from("sanpham")
        .delete()
        .eq("id", id)
        .then((data) => {
          alert("Xóa sản phẩm thành công");
          this.$refs.my_table.refresh();
        });
    },
    selectAllRow() {
      this.$refs["my_table"].selectAllRows();
    },
    async myProvider(ctx) {
      this.tableOverlay = true;
      try {
        let query = this.$supabase
          .from("sanpham")
          .select(`*,kieusanpham(*),banggia(*),nhacungcap(*),kihieu(*)`)
          .eq("product_intem", false)
          .order("id", { ascending: ctx.sortDesc });

        let item = await query;
        let result = item.data;
        // console.log(result)
        this.allListData = item.data;

        this.tableOverlay = false;
        return result;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    async intemSingle() {

      if (this.selected.length > 0) {
        let myarr = this.selected.map(item => {
          return {
            id: item.id,
            ncc: item.nhacungcap.name,
            ncc_diachi: item.nhacungcap.address,
            tccs: item.nhacungcap.tccs,
            ten: item.name,
            kihieu: item.kihieu.short,
            klt: item.klt,
            klv: item.klv,
            klh: item.klh,
            cong: item.cong,
            hamluongvang: item.banggia.code,
            maso: item.maso
          }
        })

        this.$pl_sanpham_intem(this, myarr).then(data => {
          this.selected = [];
          alert('Chờ máy in ra rồi bấm OK')
          window.location.reload()
        })


      } else {
        alert("Không có gì để in");
      }
    },
    onRowSelected(items) {
      this.selected = items;
    },
    formatDay(d) {
      let n = this.$moment(d);
      return n.format("DD/MM/YYYY");
    },
  },
};
</script>

<style></style>