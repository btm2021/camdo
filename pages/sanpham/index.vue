<template>
  <div class="mt-2">
     <b-row no-gutters>

      <b-col cols="12" style="font-size: 13px">
        <b-card no-body>
          <div>
            <b-overlay>

              <b-table style="min-height: 600px" responsive :per-page="perPage" :current-page="currentPage" bordered
                no-border-collapse sticky-header="800px" ref="my_table" show-empty select-mode="single" selectable
                head-row-variant="success" :items="listData" class="mytable text-center w-auto" striped :busy="spBusy"
                :fields="fieldSp" small>
                <template #table-busy>
                  <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                  </div>
                </template>
                <template #cell(maso)="data">
                  <b-badge variant="success">{{ data.value }}</b-badge>
                </template>
                <template #cell(banggia.code)="data">
                  <b-badge variant="warning">{{ data.value }}</b-badge>
                </template>
                <template #cell(klt)="data">
                  <code>{{ $formatSoVang(data.value).fullStr }}</code>
                </template>
                <template #cell(klh)="data">
                  <code>{{ $formatSoVang(data.value).fullStr }}</code>
                </template>
                <template #cell(klv)="data">
                  <code>{{ $formatSoVang(data.value).fullStr }}</code>
                </template>
                <template #cell(cong)="data">
                  <span class="text-primary">{{ data.value }}</span>
                </template>
                <template #cell(giatrinhap)="data">
                  <span class="text-primary">{{ $formatN(data.value) }}</span>
                </template>
                <template #cell(tool)="data">
                  <b-button-group size="sm">
                    <b-button variant="success">View</b-button>
                    <b-button variant="warning" >Edit</b-button>
                    <b-button variant="danger" @click="deleteItem(data.item.id)">Delete</b-button>
                  </b-button-group>
                </template>
                <template #cell(product_intem)="data">
                  <b-form-checkbox v-model="data.value" @change="changeInTem(data.item.id, data.value)" switch>

                  </b-form-checkbox>
                </template>


              </b-table>

              <div class="pagination-container" style="position: absolute; bottom: 0; width: 100%">
                <b-select v-model="perPage" class="per-page-selector">
                  <option value="20">20 mục/trang</option>
                  <option value="50">50 mục/trang</option>
                  <option value="100">100 mục/trang</option>
                  <!-- Thêm các giá trị khác tùy theo nhu cầu -->
                </b-select>

                <!-- b-pagination -->
                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"
                  aria-controls="my-table"></b-pagination>
              </div>
            </b-overlay>
          </div>
        </b-card>
      </b-col>
      </b-row>
  </div>
</template>

<script>
import cellEdit from "~/components/sanpham/cellEdit.vue";
export default {
  components: { cellEdit },
  data() {
    return {
      isChange: false,
      spBusy: false,
      fieldSp: [

        { "key": "maso", "label": "Mã" },
        { "key": "name", "label": "Tên" },
        { "key": "banggia.code", "label": "Hàm lượng" },
        { "key": "klt", "label": "KLT" },
        { "key": "klh", "label": "KLH" },
        { "key": "klv", "label": "KLV" },
        { "key": "product_intem", "label": "In Tem" },

        { "key": "cong", "label": "Công" },

        { "key": "nhacungcap.short", "label": "Chành" },
        { "key": "giatrinhap", "label": "Giá nhập" },
        { "key": "tool", "label": "#" },
      ],
      currentPage: 1, // Trang hiện tại
      perPage: 50, // Số dòng mỗi trang
      totalRows: 0, // Tổng số dòng,
      tooltipData: null,
      tempEdit: null,
      isZoomed: false,
      listData: []
    };
  },

  methods: {
    async changeInTem(id, value) {
      this.spBusy = true;
      const { data, error } = await this.$supabase
        .from('sanpham')
        .update({ product_intem: value })
        .eq('id', id)
      this.getData()
      this.spBusy = false
    },
    async getData() {
      this.spBusy = true;
      const { currentPage, perPage } = this;

      try {
        const { data, error, count } = await this.$supabase
          .from("sanpham")
          .select("*,kieusanpham(*),banggia(*),nhacungcap(*),kihieu(*)", { count: "exact" })
          .order("id", { ascending: false })
          .range((currentPage - 1) * perPage, currentPage * perPage - 1);

        this.spBusy = false;
        this.totalRows = count;
        this.listData = data
      } catch (error) {
        console.error("Error loading data:", error);
        return [];
      }
    },
    async deleteItem(id) {
      this.spBusy = true;
      const { data, error } = await this.$supabase
        .from('sanpham').delete()
        .eq('id', id)
      this.getData()
      this.spBusy = false
    },
    onFiltered(filteredItems) {
      // Cập nhật tổng số dòng dựa trên kết quả lọc
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
  mounted() {
    this.getData()
  }
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
  width: auto;
  /* Điều chỉnh chiều rộng nếu cần */
}

::v-deep td:hover {
  /* Các styles của bạn ở đây */
  background-color: wheat;
  /* Ví dụ: thay đổi màu nền khi hover */
  cursor: cell;
}
</style>
