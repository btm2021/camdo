<template>
  <b-row no-gutters>
    <b-col cols="3">
      <iframe
        src="http://34.83.102.208/d-solo/b732af6c-14be-4593-8350-698bb9ef9a96/san-pham?orgId=1&from=1705952047119&to=1705973647119&panelId=1"
        width="100%"
        height="300px"
        frameborder="0"
      ></iframe>
    </b-col>
    <b-col cols="9" style="font-size: 13px">
      <b-table
        :items="myProvider"
        class="mytable text-center"
        show-empty
        responsive
        bordered
        striped
        no-border-collapse
        small
        :fields="fieldsSanPham"
        :per-page="perPage"
        selectable
        select-mode="single"
        :current-page="currentPage"
        @filtered="onFiltered"
      >
        <template #head(product_barcode)="data">
          <span>
            {{ data.label }}
            <b-input
              size="sm"
              type="search"
              autocomplete="off"
              v-model="filter.product_barcode"
            />
          </span>
        </template>

        <template #head(product_wage)="data">
          <span>
            {{ data.label }}
            <b-input
              size="sm"
              type="search"
              v-model="filter.product_wage"
              autocomplete="off"
            />
          </span>
        </template>

        <template #head(product_type)="data">
          <span>
            {{ data.label }}
            <b-select
              size="sm"
              v-model="filter.product_type"
              :options="$store.state.config.sanpham_optionLoaiVang_view"
            ></b-select>
          </span>
        </template>

        <template #head(product_catalog)="data">
          <span>
            {{ data.label }}
            <b-select
              size="sm"
              v-model="filter.product_catalog"
              :options="$store.state.config.sanpham_optionCatalog_view"
            ></b-select>
          </span>
        </template>

        <template #head(product_total_weight)="data">
          <span>
            {{ data.label }}
            <b-input
              size="sm"
              type="search"
              v-model="filter.product_total_weight"
              autocomplete="off"
            />
          </span>
        </template>

        <template #head(product_gold_weight)="data">
          <span>
            {{ data.label }}
            <b-input
              type="search"
              v-model="filter.product_gold_weight"
              size="sm"
              autocomplete="off"
            />
          </span>
        </template>

        <template #head(product_stone_weight)="data">
          <span>
            {{ data.label }}
            <b-input
              type="search"
              v-model="filter.product_stone_weight"
              size="sm"
              autocomplete="off"
            />
          </span>
        </template>

        <template #head(product_price_import)="data">
          <span>
            {{ data.label }}
            <b-input
              type="search"
              v-model="filter.product_price_import"
              size="sm"
              autocomplete="off"
            />
          </span>
        </template>

        <template #head(product_price_export)="data">
          <span>
            {{ data.label }}
            <b-input
              type="search"
              v-model="filter.product_price_export"
              size="sm"
              autocomplete="off"
            />
          </span>
        </template>

        <template #head(product_sell_date)="data">
          <span>
            {{ data.label }}
            <b-input
              type="search"
              v-model="filter.product_sell_date"
              size="sm"
              autocomplete="off"
            />
          </span>
        </template>

        <template #head(product_total_price)="data">
          <span>
            {{ data.label }}
            <b-input
              type="search"
              v-model="filter.product_total_price"
              size="sm"
              autocomplete="off"
            />
          </span>
        </template>

        <template #head(product_import_type)="data">
          <span>
            {{ data.label }}
            <b-select
              v-model="filter.product_import_type"
              size="sm"
              :options="$store.state.config.sanpham_optionImportype_view"
            >
            </b-select>
          </span>
        </template>

        <template #cell(product_total_price)="data">
          {{ $formatN(data.value) }}
        </template>

        <!-- Template cho trường product_wage -->
        <template #cell(product_wage)="data">
          {{ $formatN(data.value) }}
        </template>

        <template #cell(product_total_weight)="data">
          <span
            :id="'tooltip-edit-weight-' + data.index"
            variant="outline-success"
            @dblclick="showTooltip('tooltip-edit-weight-' + data.index, data)"
          >
            {{ $formatSoVang(data.value).fullStr }}
            <b-tooltip
              :target="'tooltip-edit-weight-' + data.index"
              :triggers="''"
              :ref="'tooltip-edit-weight-' + data.index"
            >
              <cell-edit :data="data" />
            </b-tooltip>
          </span>
        </template>
        <!-- Template cho trường product_gold_weight -->
        <template #cell(product_gold_weight)="data">
          {{ $formatSoVang(data.value).fullStr }}
        </template>

        <!-- Template cho trường product_stone_weight -->
        <template #cell(product_stone_weight)="data">
          {{ $formatSoVang(data.value).fullStr }}
        </template>

        <!-- Template cho trường product_image_url -->
        <template #cell(product_image_url)="data">
          <img
            :src="data.value"
            alt="Product Image"
            style="width: 50px; height: auto"
          />
        </template>
        <template #cell(id)="data">
          {{ data.value }}
        </template>

        <!-- Template cho trường created_at -->
        <template #cell(created_at)="data">
          {{ $moment(data.value).format("DD/MM/YYYY") }}
        </template>

        <!-- Template cho trường product_type -->
        <template #cell(product_type)="data">
          {{ data.value }}
        </template>

        <!-- Template cho trường product_price_import -->
        <template #cell(product_price_import)="data">
          {{ data.value }}
        </template>

        <!-- Template cho trường product_price_export -->
        <template #cell(product_price_export)="data">
          {{ data.value }}
        </template>

        <!-- Template cho trường product_barcode -->
        <template #cell(product_barcode)="data">
          {{ data.value }}
        </template>

        <!-- Template cho trường product_catalog -->
        <template #cell(product_catalog)="data">
          {{ data.value }}
        </template>

        <!-- Template cho trường product_status -->
        <template #cell(product_status)="data">
          {{ data.value }}
        </template>

        <!-- Template cho trường product_sell_date -->
        <template #cell(product_sell_date)="data">
          {{ data.value }}
        </template>

        <!-- Template cho trường product_total_price -->

        <!-- Template cho trường product_image_name -->
        <template #cell(product_image_name)="data">
          {{ data.value }}
        </template>

        <!-- Template cho trường edit_at -->
        <template #cell(edit_at)="data">
          {{ data.value }}
        </template>

        <!-- Template cho trường product_import_type -->
        <template #cell(product_import_type)="data">
          {{ data.value }}
        </template>
      </b-table>

      <div
        class="pagination-container"
        style="position: absolute; bottom: 0; width: 100%"
      >
        <b-select v-model="perPage" class="per-page-selector">
          <option value="20">20 mục/trang</option>
          <option value="50">50 mục/trang</option>
          <option value="100">100 mục/trang</option>
          <!-- Thêm các giá trị khác tùy theo nhu cầu -->
        </b-select>

        <!-- b-pagination -->
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          aria-controls="my-table"
        ></b-pagination>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import cellEdit from "~/components/sanpham/cellEdit.vue";
export default {
  components: { cellEdit },
  data() {
    return {
      showEditPopover: false,
      popoverTarget: "",
      editItem: {},
      editType: "",

      filter: {
        product_barcode: null,
        product_wage: null,
        product_type: null,
        product_catalog: null,
        product_total_weight: null,
        product_gold_weight: null,
        product_stone_weight: null,
        product_price_import: null,
        product_price_export: null,
        product_sell_date: null,
        product_total_price: null,
      },
      fieldsSanPham: [
        {
          key: "product_barcode",
          label: "Mã",
          thClass: "myTdClass",
          stickyColumn: true,
        },
        {
          key: "product_wage",
          label: "Tiền Công",
          sortable: true,
          thClass: "myTdClass",
        },
        {
          key: "product_type",
          label: "Loại Vàng",
          sortable: true,
          thClass: "myTdClass",
        },
        {
          key: "product_catalog",
          label: "Kiểu dáng",
          sortable: true,
          thClass: "myTdClass",
          formatter: (val) => {
            let r = this.$store.state.config.sanpham_optionCatalog.find(
              (i) => i.value === val
            );
            return r.text;
          },
        },
        {
          key: "product_total_weight",
          label: "TL.Tổng",
          sortable: true,
          editable: false,
          thClass: "myTdClass",
        },
        {
          key: "product_gold_weight",
          label: "TL.Vàng",
          sortable: true,
          thClass: "myTdClass",
        },
        {
          key: "product_stone_weight",
          label: "TL.Hột",
          sortable: true,
          thClass: "myTdClass",
        },
        {
          key: "product_price_import",
          label: "Giá Vàng Nhập",
          sortable: true,
          thClass: "myTdClass",
        },
        {
          key: "product_price_export",
          label: "Price Export",
          sortable: true,
          thClass: "myTdClass",
        },

        {
          key: "product_sell_date",
          label: "Sell Date",
          sortable: true,
          thClass: "myTdClass",
        },
        {
          key: "product_total_price",
          label: "Total Price",
          thClass: "myTdClass",
        },

        {
          key: "product_import_type",
          label: "Import Type",
          sortable: true,

          thClass: "myTdClass",
        },
      ],
      currentPage: 1, // Trang hiện tại
      perPage: 50, // Số dòng mỗi trang
      totalRows: 0, // Tổng số dòng,
      tooltipData: null,
      tempEdit: null,
    };
  },

  methods: {
    showTooltip(v, data) {
      Object.keys(this.$refs).forEach((i) => {
        if (i.includes("tooltip")) {
          this.$refs[i].$emit("close");
        }
      });
      this.tooltipData = data;
      this.$refs[v].$emit("open");
    },

    updateItem() {
      // Logic cập nhật thông tin item vào danh sách hoặc database
      this.showEditPopover = false;
    },
    toggleEdit(item) {
      console.log(item);
      if (item.editable) {
        item.editable = false;
      } else {
        item.editable = true;
      }
      console.log(item);
    },
    async myProvider(ctx) {
      const { currentPage, perPage } = this;

      try {
        const { data, error, count } = await this.$supabase
          .from("product")
          .select("*", { count: "exact" })
          .range((currentPage - 1) * perPage, currentPage * perPage - 1);

        if (error) throw error;
        data.forEach((element) => {
          element.editable = false;
        });
        this.totalRows = count;
        return data;
      } catch (error) {
        console.error("Error loading data:", error);
        return [];
      }
    },
    onFiltered(filteredItems) {
      // Cập nhật tổng số dòng dựa trên kết quả lọc
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
};
</script>
<style>
.myTdClass {
  min-width: 200px;
}
</style>
<style scoped>
.pagination-container {
  background-color: white;
  border-top: 1px solid black;
  height: 30px;
  z-index: 10 !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  bottom: 0;
  width: 100%;
}

.per-page-selector {
  width: auto; /* Điều chỉnh chiều rộng nếu cần */
}

::v-deep td:hover {
  /* Các styles của bạn ở đây */
  background-color: wheat; /* Ví dụ: thay đổi màu nền khi hover */
  cursor: cell;
}
</style>
