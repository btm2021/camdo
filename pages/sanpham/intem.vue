<template>
  <b-row>
    <b-col cols="12" class="mt-3">
      <b-row no-gutters>
        <b-col cols="4">
          <b-button variant="primary" @click="intemSingle"
            >In Tem Cầm đồ đã chọn
          </b-button>

          <b-button variant="success" @click="selectAllRow"
            >Chọn tất cả</b-button
          ></b-col
        >

        <b-col cols="12" class="min-vw-100">
          <b-table
            caption="Sản phẩm chưa in tem"
            caption-top
            style="min-height: 400px"
            class="my_table align-middle w-auto"
            responsive
            bordered
            small
            no-border-collapseÏ
            ref="my_table"
            :busy="tableOverlay"
            :items="myProvider"
            show-empty
            select-mode="multi"
            selectable
            head-row-variant="success"
            :fields="tableField"
            @row-selected="onRowSelected"
          >
            <template #cell(index)="data">
              {{ data.index + 1 }}
            </template>

            <template #cell(tool)="data">
              <!-- `data.value` is the value after formatted by the Formatter -->
              <b-button
                size="sm"
                variant="danger"
                @click="deleteItem(data.item.id)"
                >Xóa</b-button
              >
            </template>

            <template #cell(product_catalog)="data">
              <!-- `data.value` is the value after formatted by the Formatter -->
              <b-badge variant="success">
                {{
                  $store.state.config.sanpham_optionCatalog.find(
                    (i) => i.value === data.value
                  ).text
                }}
              </b-badge>
            </template>
            <template #cell(product_total_weight)="data">
              <!-- `data.value` is the value after formatted by the Formatter -->
              {{ $formatSoVang(data.value).fullStr }}
            </template>
            <template #cell(product_stone_weight)="data">
              <!-- `data.value` is the value after formatted by the Formatter -->
              {{ $formatSoVang(data.value).fullStr }}
            </template>
            <template #cell(product_gold_weight)="data">
              <!-- `data.value` is the value after formatted by the Formatter -->
              {{ $formatSoVang(data.value).fullStr }}
            </template>

            <template #cell(product_image_url)="data">
              <!-- `data.value` is the value after formatted by the Formatter -->
              <b-img-lazy
                :src="
                  data.value && data.value != 'demo'
                    ? data.value
                    : `https://placehold.co/400/gray/white?text= + ${
                        $store.state.config.sanpham_optionCatalog.find(
                          (i) => i.value === data.item.product_catalog
                        ).text
                      }`
                "
                width="50px"
                height="50px"
              ></b-img-lazy>
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
      perPage: 200,
      tableField: [
        {
          key: "index",
          label: "#",
        },
        {
          key: "product_image_url",
          label: "Ảnh",
        },
        {
          key: "product_catalog",
          label: "Kiểu sản phẩm",
        },
        {
          key: "product_type",
          label: "Loại vàng",
        },
        {
          key: "product_total_weight",
          label: "TL. Tổng",
        },
        {
          key: "product_stone_weight",
          label: "TL. Đá",
        },
        {
          key: "product_gold_weight",
          label: "TL. Vàng",
        },
        {
          key: "product_wage",
          label: "Công",
        },

        {
          key: "tool",
          label: "tool",
        },
      ],
      allListData: null,
      tableOverlay: false,
    };
  },
  methods: {
    deleteItem(id) {
      this.$supabase
        .from("product")
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
          .from("product")
          .select("*")
          .eq("product_in_tem", false)
          .order("id", { ascending: ctx.sortDesc });

        let item = await query;
        let result = item.data;
        this.allListData = item.data;
        // let newResult = [];
        // result.forEach((item) => {
        //   if (item.invoice_date_get != null) {
        //     item.invoice_date_get_beauty = this.formatDay(
        //       item.invoice_date_get
        //     );
        //   }
        //   item.invoice_date_create_beauty = this.formatDay(
        //     item.invoice_date_create
        //   );
        //   item.invoice_number_beauty = item.invoice_number;
        //   newResult.push(item);
        // });
        this.tableOverlay = false;
        return result;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    async intemSingle() {

      if (this.selected.length > 0) {
        this.$pl_sanpham_intem(this, this.selected);
        this.selected = [];
      } else {
        alert("Không có gì để in");
      }
      // if (this.selected.length > 0) {
      //   let list_tem = this.selected.map((item) => {
      //     return {
      //       maso: item.invoice_number,
      //       tien: item.invoice_money,
      //       ten: item.customer_name,
      //       ngay: item.invoice_date_create,
      //       id: item.id,
      //     };
      //   });
      //   list_tem = list_tem.sort((a, b) => {
      //     return a.maso - b.maso;
      //   });
      //   this.$pnPublish(
      //     {
      //       channel: "printserver",
      //       message: { type: "ingiaythe", list: list_tem },
      //     },
      //     (status, response) => {
      //       if (status.error) {
      //         console.log(status);
      //       } else {
      //         alert("Chờ máy in ra tem ra rồi hẵn bấm OK");
      //         this.$refs["my_table"].refresh();
      //         this.select = [];
      //         console.log("Message Published", response);
      //       }
      //     }
      //   );
      // }
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
  
  <style>
</style>