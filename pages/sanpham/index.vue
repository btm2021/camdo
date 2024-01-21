<template>
  <b-row no-gutters>
    <b-col cols="3"> </b-col>
    <b-col cols="9">
      <ag-grid-vue
        style="width: 100%; height: 80vh"
        @grid-ready="onGridReady"
        class="ag-theme-quartz"
        rowModelType="serverSide"
        :columnDefs="columnDefs"
        :rowBuffer="0"
        :cacheBlockSize="10"
        :maxBlocksInCache="10"
      >
      </ag-grid-vue>
      <!-- <b-row>
        <b-col cols="12" class="mb-0">
          <b-table-simple
            small
            class="mb-0"
            style="margin-bottom: 0px !important"
          >
            <b-thead
              head-variant="light"
              class="text-center"
              style="margin-bottom: 0px !important"
            >
              <b-tr>
                <b-th>Hiển thị</b-th>
                <b-th>Mã</b-th>
                <b-th>Kiểu</b-th>
                <b-th>Loại</b-th>
                <b-th>T.Trạng</b-th>
                <b-th>Từ.N</b-th>
                <b-th>Đến.N</b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr>
                <b-td>
                  <b-form-select
                    id="per-page-select"
                    v-model="perPage"
                    :options="[50, 100, 200]"
                  ></b-form-select>
                </b-td>
                <b-td>
                  <b-input
                    class="filter_input"
                    style="text-transform: uppercase; text-align: center"
                    v-model="filter_product_barcode"
                    autocomplete="off"
                    placeholder="Mã"
                    type="search"
                    @change="refreshTable()"
                  ></b-input>
                </b-td>
                <b-td>
                  <b-select
                    v-model="filter_product_catalog"
                    :options="$store.state.config.sanpham_optionCatalog_view"
                  >
                  </b-select>
                </b-td>
                <b-td>
                  <b-select
                    v-model="filter_product_type"
                    :options="$store.state.config.sanpham_optionLoaiVang_view"
                  >
                  </b-select>
                </b-td>
                <b-td>
                  <b-form-checkbox switch v-model="filter_product_status">
                  </b-form-checkbox>
                </b-td>
                <b-td>
                  <b-input
                    class="filter_input"
                    style="text-transform: uppercase; text-align: center"
                    v-model="filter_product_barcode"
                    autocomplete="off"
                    placeholder="Mã"
                    type="search"
                    @change="refreshTable()"
                  ></b-input>
                </b-td>
                <b-td>
                  <b-input
                    class="filter_input"
                    style="text-transform: uppercase; text-align: center"
                    v-model="filter_product_barcode"
                    autocomplete="off"
                    placeholder="Mã"
                    type="search"
                    @change="refreshTable()"
                  ></b-input>
                </b-td>
                <b-td> </b-td> </b-tr
            ></b-tbody>
          </b-table-simple>
        </b-col>
        <b-col cols="12">
          <b-table
            :items="myProvider"
            ref="my_table"
            show-empty
            style="min-height: 600px"
            responsive
            bordered
            no-border-collapse
            sticky-header="500px"
            small
            :busy="tableOverlay"
            head-row-variant="success"
            @row-dblclicked="
              cellClick(arguments[0], arguments[1], arguments[2])
            "
            select-mode="single"
            selectable
            :fields="tableField"
          >
          </b-table>
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            first-number
            last-number
          >
            <template #first-text><span class="">Đầu</span></template>
            <template #prev-text><span class="">Lùi</span></template>
            <template #next-text><span class="">Tới</span></template>
            <template #last-text><span class="">Cuối</span></template>
          </b-pagination>
        </b-col>
      </b-row> -->
    </b-col>
  </b-row>
</template>

<script>
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue";

export default {
  components: {
    AgGridVue, // Add AG Grid Vue3 component
  },
  data() {
    return {
      gridApi: null,
      defaultColDef: {
        flex: 1,
        minWidth: 100,
        sortable: false,
      },
      columnDefs: [
        { headerName: "Row ID", valueGetter: "node.id" },
        { field: "product_image_url" },
        { field: "product_catalog" },
        {
          field: "product_type",
          editable: true,
          cellEditorSelector: (params) => {
            return {
              component: "agRichSelectCellEditor",
              params: {
                values: this.$store.state.config.sanpham_optionLoaiVang,
              },
              popup: true,
            };
          },
        },
        { field: "product_barcode" },
        { field: "product_gold_weight" },
      ],
      rowBuffer: 5,
      rowModelType: null,
      cacheBlockSize: null,
      maxBlocksInCache: null,
    };
  },

  methods: {
    createServer() {
      return {
        getData: async (request) => {
          return new Promise((resolve, reject) => {
            this.$supabase
              .from("product")
              .select()
              .range(request.startRow, request.endRow)
              .then((data) => {
                resolve({
                  success: true,
                  rows: data.data,
                });
              });
          });
        },
      };
    },
    createServerSideDatasource(server) {
      return {
        getRows: async (params) => {
          const response = await server.getData(params.request);
          params.success({ rowData: response.rows });
        },
      };
    },
    onGridReady(params) {
      const supabase = this.createServer();
      const datasource = this.createServerSideDatasource(supabase);
      params.api.setGridOption("serverSideDatasource", datasource);
      this.gridApi = params.api;
    },
    cellClick() {},
    refreshTable() {
      this.$refs.my_table.refresh();
    },
    async myProvider(ctx) {
      let sortBy = "id";
      this.tableOverlay = true;
      try {
        let s = (ctx.currentPage - 1) * ctx.perPage;
        let e = s + ctx.perPage;

        let query = this.$supabase
          .from("product")
          .select("*")
          .range(s, e)
          .order(sortBy, { ascending: ctx.sortDesc });
        // if (this.filter_ten && this.filter_ten.length > 1) {
        //   query = query.ilike("customer_name", `%${this.filter_ten}%`);
        // }
        // if (parseInt(this.filter_sotien_start) > 0) {
        //   query = query.gte(
        //     "invoice_money",
        //     parseInt(this.filter_sotien_start) * 1000
        //   );
        // }
        // if (parseInt(this.filter_sotien_end) > 0) {
        //   query = query.lte(
        //     "invoice_money",
        //     parseInt(this.filter_sotien_end) * 1000
        //   );
        // }

        //ngaystart
        // if (
        //   this.filter_ngaycam_start &&
        //   this.filter_ngaycam_start.length > 1 &&
        //   this.getNgayCam(this.filter_ngaycam_start).isValid
        // ) {
        //   let ngayStart = this.getNgayCam(this.filter_ngaycam_start);
        //   query = query.gte("invoice_date_create", ngayStart.toInsert);
        // }

        // if (
        //   this.filter_ngaycam_end &&
        //   this.filter_ngaycam_end.length > 1 &&
        //   this.getNgayCam(this.filter_ngaycam_end).isValid
        // ) {
        //   let ngayEnd = this.getNgayCam(this.filter_ngaycam_end);
        //   query = query.lte("invoice_date_create", ngayEnd.toInsert);
        // }

        // if (this.filter_status != null) {
        //   if (this.filter_status) {
        //     query = query.eq("invoice_status", false);
        //   } else {
        //     query = query.eq("invoice_status", true);
        //   }
        // }
        // if (this.filter_invoice_store != null) {
        //   query = query.eq("invoice_store", this.filter_invoice_store);
        // }
        // if (this.filter_invoice_store_type != null) {
        //   query = query.eq(
        //     "invoice_store_type",
        //     this.filter_invoice_store_type
        //   );
        // }
        // if (this.filter_invoice_cat != null) {
        //   query = query.eq("invoice_cat", this.filter_invoice_cat);
        // }
        // if (
        //   this.filter_invoice_tag.length > 0 &&
        //   this.filter_invoice_tag != null
        // ) {
        //   for (let o = 0; o < this.filter_invoice_tag.length; o++) {
        //     console.log(this.filter_invoice_tag[o]);
        //     query = query.like(
        //       "invoice_tag",
        //       `%${this.filter_invoice_tag[o]}%`
        //     );
        //   }
        // }

        // if (this.filter_invoice_type != null) {
        //   query = query.eq("invoice_type", this.filter_invoice_type);
        // }
        // //kiểm tra kiểu thế
        // //   query = query.eq("invoice_store_type", this.filter_store_type);

        let item = await query;
        let result = item.data;
        let newResult = [];
        result.forEach((item) => {
          newResult.push(item);
        });

        this.tableOverlay = false;
        return newResult;
      } catch (error) {
        return [];
      }
    },
  },
};
</script>
<style>
</style>
