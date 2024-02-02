<template>
  <div>
    <b-overlay :show="!dataReady">
      <b-modal
        ref="modal_edit"
        id="modal_edit"
        title="Chỉnh sửa hợp đồng"
        hide-footer
        no-close-on-backdrop
        no-close-on-esc
        size="lg"
        @ok="edit_invoice()"
        @cancel="itemEdit = null"
      >
        <div v-if="itemEdit">
          <b-row>
            <b-col cols="4">
              <b-form-group label="Tên khách:" description="Tên khách">
                <b-form-input
                  autocomplete="off"
                  style="text-transform: uppercase"
                  :disabled="itemEdit.invoice_status ? true : false"
                  autocapitalize
                  v-model="itemEdit.customer_name"
                  type="text"
                  :state="editState.customer_name"
                  :placeholder="itemEdit.customer_name"
                ></b-form-input>
              </b-form-group>
              <b-form-group label="Mã số:">
                <b-form-input
                  autocomplete="off"
                  :disabled="itemEdit.invoice_status ? true : false"
                  autocapitalize
                  v-model="itemEdit.invoice_number"
                  :state="editState.invoice_number"
                  type="text"
                  @change="checkMaSo"
                ></b-form-input>
              </b-form-group>
              <b-form-group
                id="input-group-3"
                label="Phân loại:"
                label-for="input-3"
              >
                <b-form-select
                  v-model="itemEdit.invoice_type"
                  :options="['BÌNH THƯỜNG', 'MẤT GIẤY', 'THANH LÝ']"
                  :disabled="itemEdit.invoice_status ? true : false"
                  required
                ></b-form-select>
              </b-form-group>
              <b-form-group
                id="input-group-3"
                label="Loại lưu:"
                label-for="input-3"
              >
                <b-form-select
                  v-model="itemEdit.invoice_store"
                  :options="[
                    'BỊCH KÉO MIỆNG',
                    'HỘP TRÁI BÍ TO',
                    'HỘP TRÁI BÍ TRUNG',
                    'HỘP TRÁI BÍ NHỎ',
                    'HỘP HỒNG TRONG TO',
                    'HỘP HỒNG DẸP',
                    'HỘP NHUNG KIỀNG',
                    'HỘP NHUNG DẸP',
                    'HỘP KIỀNG',
                    'KHÁC',
                  ]"
                  :disabled="itemEdit.invoice_status ? true : false"
                  required
                ></b-form-select>
              </b-form-group>
              <b-form-group
                id="input-group-3"
                label="Nơi lưu:"
                label-for="input-3"
              >
                <b-form-select
                  v-model="itemEdit.invoice_store_type"
                  :options="['KHAY', 'KÉT', 'KHÁC']"
                  required
                ></b-form-select>
              </b-form-group>
              <b-form-group label="Comment">
                <b-form-textarea
                  id="textarea"
                  :disabled="itemEdit.invoice_status ? true : false"
                  v-model="itemEdit.invoice_comment"
                  rows="3"
                  max-rows="6"
                ></b-form-textarea>
              </b-form-group>
            </b-col>
            <b-col cols="4">
              <b-form-group
                label="Số tiền"
                :description="formatN(itemEdit.invoice_money)"
              >
                <b-form-input
                  autocomplete="off"
                  :disabled="itemEdit.invoice_status ? true : false"
                  autocapitalize
                  v-model="itemEdit.invoice_money"
                  type="number"
                  :state="editState.invoice_money"
                  :placeholder="formatN(itemEdit.invoice_money)"
                ></b-form-input>
              </b-form-group>
              <b-form-group label="Ngày thế">
                <b-form-input
                  autocomplete="off"
                  :disabled="itemEdit.invoice_status ? true : false"
                  autocapitalize
                  @change="changeEditDate"
                  v-model="itemEdit.invoice_date_create_beauty"
                  type="text"
                ></b-form-input>
              </b-form-group>
              <b-form-group label="Ngày lấy">
                <b-form-input
                  autocomplete="off"
                  autocapitalize
                  disabled
                  v-model="itemEdit.invoice_date_get_beauty"
                  :disable="true"
                  type="text"
                ></b-form-input>
              </b-form-group>

              <b-form-group label="Sdt">
                <b-form-input
                  type="search"
                  autocomplete="off"
                  v-model="itemEdit.invoice_phone"
                ></b-form-input>
              </b-form-group>
              <b-form-group
                id="input-group-3"
                label="Loại thế:"
                label-for="input-3"
              >
                <b-form-select
                  v-model="itemEdit.invoice_cat"
                  :options="['THẾ MỚI', 'ĐÓNG LÃI', 'KHÁC']"
                  :disabled="itemEdit.invoice_status ? true : false"
                  required
                ></b-form-select>
              </b-form-group>
            </b-col>
            <b-col cols="4">
              <b-form-group>
                <b-button
                  @click="intemSingle"
                  block
                  variant="primary"
                  :disabled="itemEdit.invoice_status ? true : false"
                  >In giấy</b-button
                >
                <b-button
                  @click="edit_invoice()"
                  block
                  variant="primary"
                  :disabled="itemEdit.invoice_status ? true : false"
                  >Chỉnh giấy</b-button
                >
                <b-button
                  block
                  variant="success"
                  @click="check_invoice()"
                  :disabled="itemEdit.invoice_status ? true : false"
                  >Chuộc đồ</b-button
                >
                <b-button
                  block
                  variant="warning"
                  @click="sell_invoice()"
                  :disabled="itemEdit.invoice_status ? true : false"
                  >Thanh Lý</b-button
                >

                <b-button
                  block
                  variant="danger"
                  @click="lost_invoice()"
                  :disabled="itemEdit.invoice_status ? true : false"
                  >Mất giấy</b-button
                >
                <b-button block variant="danger" @click="delete_invoice()"
                  >Xóa Giấy</b-button
                >
              </b-form-group>
              <b-form-group>
                <template #label>
                  <h5 class="text-center">Thông tin</h5>
                </template>
                <b-icon
                  icon="check-square-fill"
                  :variant="itemEdit.invoice_status ? 'primary' : 'success'"
                ></b-icon>
                {{ itemEdit.invoice_status ? "Đã chuộc" : "Chưa chuộc" }}
              </b-form-group>
              <b-form-group>
                <table style="width: 100%">
                  <tr>
                    <td class="text-left">Ngày thế</td>
                    <td class="text-right">
                      {{ getCountDateComponent(itemEdit) }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text-left">Tiền Vốn</td>
                    <td class="text-right">
                      {{ formatN(itemEdit.invoice_money) }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text-left">Tiền Lãi</td>
                    <td class="text-right">
                      {{
                        formatN(
                          parseInt(
                            (
                              (getCountDateComponent(itemEdit) *
                                itemEdit.invoice_money *
                                profitPercent) /
                              3 /
                              1000 /
                              1000
                            ).toFixed(0)
                          ) * 1000
                        )
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <hr />
                    </td>
                  </tr>
                  <tr>
                    <td class="text-left">Tổng tiền :</td>
                    <td class="text-right">
                      {{ formatN(getTongTien()) }}
                    </td>
                  </tr>
                </table>
              </b-form-group>
            </b-col>
          </b-row>
        </div>
      </b-modal>
      <div>
        <b-row>
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
                  <b-th>Mã</b-th>
                  <b-th>Tên</b-th>
                  <b-th>Ngày Đầu</b-th>
                  <b-th>Ngày Kết</b-th>
                  <b-th>Tiền Đầu</b-th>
                  <b-th>Tiền Kết</b-th>
                  <b-th>Loại</b-th>
                  <b-th>Chứa </b-th>
                  <b-th>Lưu</b-th>
                  <b-th>Nơi Cất</b-th>
                  <b-th>Loại thế</b-th>
                  <b-th>Sản phẩm</b-th>
                </b-tr>
              </b-thead>
              <b-tbody>
                <b-tr>
                  <b-td>
                    <b-input
                      class="filter_input"
                      style="text-transform: uppercase; text-align: center"
                      v-model="filter_ma"
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
                      v-model="filter_ten"
                      autocomplete="off"
                      placeholder="Tên"
                      type="search"
                      @change="refreshTable()"
                    ></b-input>
                  </b-td>
                  <b-td
                    ><b-input
                      class="filter_input"
                      style="text-transform: uppercase; text-align: center"
                      v-model="filter_ngaycam_start"
                      autocomplete="off"
                      type="search"
                      placeholder="Ngày Đầu"
                      @change="refreshTable()"
                    ></b-input
                  ></b-td>
                  <b-td>
                    <b-input
                      type="search"
                      autocomplete="off"
                      class="filter_input"
                      placeholder="Ngày End"
                      v-model="filter_ngaycam_end"
                      @change="refreshTable()"
                    ></b-input
                  ></b-td>
                  <b-td>
                    <b-input
                      type="search"
                      class="filter_input"
                      autocomplete="off"
                      placeholder="Tiền Đầu"
                      v-model="filter_sotien_start"
                      @change="refreshTable()"
                    ></b-input
                  ></b-td>
                  <b-td>
                    <b-input
                      class="filter_input"
                      type="search"
                      autocomplete="off"
                      placeholder="Tiền End"
                      v-model="filter_sotien_end"
                      @change="refreshTable()"
                    ></b-input>
                  </b-td>
                  <b-td>
                    <b-form-select
                      v-model="filter_invoice_type"
                      class="filter_input"
                      :options="option_filter_type"
                      @change="refreshTable()"
                    ></b-form-select
                  ></b-td>
                  <b-td>
                    <b-form-select
                      v-model="filter_status"
                      class="filter_input"
                      :options="option_filter_status"
                      @change="refreshTable()"
                    ></b-form-select
                  ></b-td>
                  <b-td>
                    <b-form-select
                      v-model="filter_invoice_store"
                      @change="refreshTable()"
                      class="filter_input"
                      :options="option_filter_store"
                    ></b-form-select
                  ></b-td>
                  <b-td>
                    <b-form-select
                      v-model="filter_invoice_store_type"
                      @change="refreshTable()"
                      class="filter_input"
                      :options="option_filter_store_type"
                    ></b-form-select
                  ></b-td>
                  <b-td>
                    <b-form-select
                      v-model="filter_invoice_cat"
                      @change="refreshTable()"
                      class="filter_input"
                      :options="option_filter_cat"
                    ></b-form-select
                  ></b-td>
                  <b-td>
                    <b-form-tags
                      class="filter_input"
                      remove-on-delete
                      placeholder="loại sản phẩm"
                      tag-variant="primary"
                      @input="refreshTable()"
                      v-model="filter_invoice_tag"
                    ></b-form-tags>
                  </b-td> </b-tr
              ></b-tbody>
            </b-table-simple>
          </b-col>
        </b-row>

        <b-row class="">
          <b-col cols="3">
            <b-form-group
              label="Hiển thị"
              label-for="per-page-select"
              label-cols-sm="6"
              label-cols-md="4"
              label-cols-lg="3"
              label-align-sm="right"
              label-size="sm"
              class="mb-0"
            >
              <b-form-select
                id="per-page-select"
                v-model="perPage"
                :options="[50, 100, 200]"
                size="sm"
              ></b-form-select>
            </b-form-group>
          </b-col>
          <b-col cols="4"></b-col>
          <b-col cols="4" class="mb-2">
            <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              size="sm"
              align="right"
              first-number
              last-number
              class="my-0"
            >
              <template #first-text><span class="">Đầu</span></template>
              <template #prev-text><span class="">Lùi</span></template>
              <template #next-text><span class="">Tới</span></template>
              <template #last-text><span class="">Cuối</span></template>
            </b-pagination>
          </b-col>
          <b-col cols="12" class="min-vw-100">
            <b-table
              style="min-height: 400px"
              class="my_table align-middle w-auto"
              responsive
              :per-page="perPage"
              :current-page="currentPage"
              bordered
              no-border-collapse
              ref="my_table"
              :busy="tableOverlay"
              :items="myProvider"
              show-empty
              select-mode="single"
              selectable
              head-row-variant="success"
              :fields="tableField"
              @row-dblclicked="
                cellClick(arguments[0], arguments[1], arguments[2])
              "
            >
              <template #cell(index)="data">
                {{ data.index + 1 }}
              </template>
              <template #cell(invoice_tag)="data">
                <b-badge
                  v-for="(item, index) in data.value"
                  :key="index"
                  variant="primary"
                  >{{ item }}</b-badge
                >
              </template>
              <template #cell(invoice_money)="data">
                <div class="textLeft">{{ data.value }}</div>
              </template>
              <template #cell(ngaycam)="data">
                <!-- `data.value` is the value after formatted by the Formatter -->
                {{ getNgay(data.item.ngaycam) }}
              </template>
              <template #cell(invoice_profit)="data">
                <div class="textLeft">{{ formatN(data.value) }}</div>
              </template>
              <template #cell(invoice_date_get)="data">
                <span v-if="data.item.invoice_status">
                  {{ $moment(data.item.invoice_date_get).format("DD/MM/YYYY") }}
                </span>
                <span v-else>
                  <b-badge variant="success">Chưa chuộc</b-badge>
                </span>
              </template>
              <template #cell(invoice_count)="data">
                <div
                  class=""
                  v-b-tooltip.hover
                  :title="
                    data.value < 90
                      ? 'Thời gian thế dưới 3 tháng, an toàn'
                      : data.value > 90 && data.value < 180
                      ? 'Thời gian thế 3-6 tháng, lưu ý'
                      : 'Thời gian thế trên 6 tháng, nguy hiểm'
                  "
                >
                  <span
                    v-if="data.item.invoice_status"
                    style="text-align: left !important"
                  >
                    <b-icon
                      icon="backspace-reverse-fill"
                      variant="primary"
                    ></b-icon>
                  </span>

                  <span v-else>
                    <b-icon
                      icon="backspace-reverse-fill"
                      variant="success"
                    ></b-icon>
                  </span>
                  {{ data.value }}

                  <b-icon
                    v-if="data.value < 90"
                    icon="exclamation-circle-fill"
                    variant="success"
                  ></b-icon>
                  <b-icon
                    v-if="data.value > 90 && data.value < 180"
                    icon="exclamation-circle-fill"
                    variant="warning"
                  ></b-icon>
                  <b-icon
                    v-if="data.value > 180"
                    icon="exclamation-circle-fill"
                    variant="danger"
                  ></b-icon>
                </div>
              </template>
              <template #cell(tool)="data">
                <!-- `data.value` is the value after formatted by the Formatter -->
                <b-button
                  size="sm"
                  variant="primary"
                  @click="deleteItem(data.item.id)"
                  >Xóa</b-button
                >
              </template>
              <template #cell(invoice_status)="data">
                <div>
                  <span>
                    <b-form-checkbox
                      @change="toggleStatus(data.item)"
                      v-model="data.item.invoice_status"
                      switch
                      v-show="data.item.invoice_status"
                    >
                    </b-form-checkbox>
                  </span>
                  <span v-if="data.item.invoice_status">
                    <!-- da chuoc -->
                    <b-badge variant="primary">Đã chuộc</b-badge>
                  </span>
                  <span v-else>
                    <b-badge variant="success">Chưa chuộc</b-badge>
                  </span>
                </div>
                <!-- `data.value` is the value after formatted by the Formatter -->
              </template>
              <template #cell(invoice_label)="data">
                <!-- `data.value` is the value after formatted by the Formatter -->
                <b-form-checkbox
                  v-model="data.item.invoice_label"
                  @change="toggleInTem(data.item)"
                  switch
                >
                  <span v-if="data.item.invoice_label">
                    <!-- da chuoc -->
                    <b-badge variant="primary">Đã In</b-badge>
                  </span>
                  <span v-else>
                    <b-badge variant="success">Chưa In</b-badge>
                  </span>
                </b-form-checkbox>
              </template>
              <template #head()="scope">
                <div class="text-nowrap">{{ scope.label }}</div>
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
      </div>
    </b-overlay>
  </div>
</template>

<script>
export default {
  data() {
    return {
      channels: null,
      editState: {
        customer_name: true,
        invoice_money: true,
        invoice_number: true,
        invoice_type: true,
        invoice_date_create: true,
      },
      itemEdit: null,
      profitPercent: 2,
      dataReady: false,
      currentPage: 1,
      totalRows: 0,
      perPage: 50,

      filter_ten: "",
      filter_ngaycam_start: null,
      filter_ngaycam_end: null,
      filter_sotien_start: null,
      filter_sotien_end: null,
      filter_ma: null,
      filter_status: null,
      filter_invoice_store: null,
      filter_invoice_store_type: null,
      filter_invoice_cat: null,
      filter_invoice_tag: null,
      filter_invoice_type: null,
      option_filter_status: [
        { value: true, text: "CHƯA CHUỘC" },
        { value: false, text: "ĐÃ CHUỘC" },
        { value: null, text: "TẤT CẢ" },
      ],
      option_filter_type: [
        "BÌNH THƯỜNG",
        "THANH LÝ",
        "MẤT GIẤY",
        "KHÁC",
        { value: null, text: "TẤT CẢ" },
      ],
      option_filter_store: [
        "BỊCH KÉO MIỆNG",
        "HỘP TRÁI BÍ TO",
        "HỘP TRÁI BÍ TRUNG",
        "HỘP TRÁI BÍ NHỎ",
        "HỘP HỒNG TRONG TO",
        "HỘP HỒNG DẸP",
        "HỘP NHUNG KIỀNG",
        "HỘP NHUNG DẸP",
        "HỘP KIỀNG",
        "KHÁC",
        { value: null, text: "TẤT CẢ" },
      ],

      option_filter_cat: [
        "THẾ MỚI",
        "ĐÓNG LÃI",
        "KHÁC",
        { value: null, text: "TẤT CẢ" },
      ],
      option_filter_store_type: [
        "KHAY",
        "KÉT",
        "KHÁC",
        { value: null, text: "TẤT CẢ" },
      ],
      tableOverlay: false,
      listData: [],
      tableField: [
        {
          key: "index",
          label: "#",
          thStyle: { width: "2%", textAlign: "center" },
        },
        {
          key: "customer_name",
          label: "Tên",
          sortable: true,
          stickyColumn: true,
          thClass: "myThClass",
        },
        {
          key: "invoice_number",
          label: "Mã số",
          sortable: true,

          thClass: "myThClass20percent",
        },
        {
          key: "invoice_date_create",
          label: "Ngày cầm",
          sortable: true,
          thClass: "myThClass20percent",
          formatter: (value) => {
            //yyyy/mm/dd
            //  console.log(value);
            let date = value.split("-");
            let newDate = new Date(date[0], date[1] - 1, date[1]);
            let newDateStr = `${date[2]}/${date[1]}/${date[0]}`;
            return newDateStr;
          },
        },
        {
          key: "invoice_tag",
          label: "Sản phẩm",
          sortable: true,
          formatter: (value) => {
            let arr = JSON.parse(value);
            return arr;
          },
          thClass: "myThClass500px",
        },
        {
          key: "invoice_date_get",
          label: "Ngày chuộc",
          sortable: true,
          thClass: "myThClass",
        },
        {
          key: "invoice_money",
          sortable: true,
          label: "Số tiền",

          thClass: "myThClass",
          formatter: (value) => {
            return this.formatN(value);
          },
        },
        {
          key: "invoice_status",
          sortable: true,
          label: "Tình trạng",
          thClass: "myThClass500px",
        },
        {
          key: "invoice_label",
          sortable: true,
          label: "Tem",
          thClass: "myThClass",
        },
        {
          key: "invoice_count",
          sortable: true,
          label: "Số ngày thế",
          thClass: "myThClass",

          formatter: (value, key, item) => {
            let dateStart;
            let dateEnd;
            dateStart = item.invoice_date_create;

            if (item.invoice_status) {
              dateEnd = item.invoice_date_get;
              //đã chuộc, invoice_status : false. => đã chuộc, lấy ra invoice_date_get
            } else {
              dateEnd = new Date();
              //chưa chuộc, lấy ra invoice_date_create - now
            }
            let count = this.getCountDate(dateStart, dateEnd);
            return count;
          },
        },
        {
          key: "invoice_cat",
          label: "Loại thế",
          sortable: true,
          thClass: "myThClass",
        },
        {
          key: "invoice_profit",
          sortable: true,
          label: "Lời",
          thClass: "myThClass",
          formatter: (value, key, item) => {
            let dateStart;
            let dateEnd;
            dateStart = item.invoice_date_create;

            if (item.invoice_status) {
              dateEnd = item.invoice_date_get;
              //đã chuộc, invoice_status : false. => đã chuộc, lấy ra invoice_date_get
            } else {
              dateEnd = new Date();
              //chưa chuộc, lấy ra invoice_date_create - now
            }
            let count = this.getCountDate(dateStart, dateEnd);
            let pnl =
              (count * item.invoice_money * (this.profitPercent / 3)) / 1000;
            pnl = parseInt((pnl / 1000).toFixed(0)) * 1000;

            pnl = parseInt(pnl.toFixed(0));

            return pnl;
          },
        },
        {
          key: "invoice_type",
          sortable: true,
          label: "Phân loại",
          thClass: "myThClass",
          formatter: (value, key, item) => {
            return value;
          },
        },
        {
          key: "invoice_comment",
          sortable: true,
          label: "Ghi chú",
          thClass: "myThClass",
          formatter: (value, key, item) => {
            if (value && value.trim().length > 0) {
              return value;
            } else {
              return "không";
            }
          },
        },
        {
          key: "invoice_store",
          sortable: true,
          label: "Loại lưu kho",
          thClass: "myThClass",
        },
        {
          key: "invoice_store_type",
          sortable: true,
          label: "Nơi Lưu",
          thClass: "myThClass",
        },
        {
          key: "invoice_phone",
          sortable: true,
          label: "Phone",
          thClass: "myThClass",
          formatter: (value, key, item) => {
            if (value && value.trim().length > 0) {
              return value;
            } else {
              return "không";
            }
          },
        },
      ],
    };
  },
  methods: {
    async toggleInTem(item) {
      this.tableOverlay = true;
      let v = item.invoice_label;
      let { data, error } = await this.$supabase
        .from("invoice")
        .update({ invoice_label: v })
        .eq("id", item.id)
        .select();
      this.$refs.my_table.refresh();
      this.tableOverlay = false;
    },
    async toggleStatus(item) {
      this.tableOverlay = true;
      if (item.invoice_status) {
        //từ chưa chuộc qua đã chuôc5
      } else {
        //đa chuoc qua chua chua chuoc
        //reset lại table
        console.log("a");
        await this.$supabase
          .from("invoice")
          .update({
            invoice_status: false,
            invoice_profit: null,
            invoice_date_get: null,
          })
          .eq("id", item.id)
          .select();
      }

      this.$refs.my_table.refresh();
      this.tableOverlay = false;
    },
    getVariant() {
      let listVariant = [
        { name: "day", variant: "warning" },
        { name: "daymat", variant: "warning" },
        { name: "dm", variant: "warning" },
        { name: "nhan", variant: "success" },
        { name: "mat", variant: "primary" },
        { name: "cong", variant: "danger" },
        { name: "ximen", variant: "success" },
        { name: "kieng", variant: "success" },
      ];
    },
    formatDay(d) {
      let n = this.$moment(d);
      return n.format("DD/MM/YYYY");
    },
    getTongTien() {
      let dayCount = this.getCountDateComponent(this.itemEdit);
      let profitPercent = this.profitPercent / 3;
      let result =
        (dayCount * parseInt(this.itemEdit.invoice_money) * profitPercent) /
        1000;
      let total =
        parseInt(result.toFixed(0)) + parseInt(this.itemEdit.invoice_money);
      return total;
    },
    edit_invoice() {
      let isValid = this.validateEdit(this.itemEdit);
      if (isValid) {
        this.$bvModal
          .msgBoxConfirm("Hãy xác nhận bạn muốn thay đổi", {
            title: "Xác nhận",
            size: "sm",
            buttonSize: "sm",
            okVariant: "danger",
            okTitle: "YES",
            cancelTitle: "NO",
            footerClass: "p-2",
            hideHeaderClose: false,
            centered: true,
          })
          .then((value) => {
            if (value === true && isValid) {
              let objectToUpdate = {
                invoice_number: this.itemEdit.invoice_number,
                invoice_status: this.itemEdit.invoice_status,
                invoice_comment: this.itemEdit.invoice_comment,
                invoice_money: this.itemEdit.invoice_money,
                invoice_date_create: this.itemEdit.invoice_date_create,
                invoice_phone: this.itemEdit.invoice_phone,
                invoice_type: this.itemEdit.invoice_type,
                invoice_cat: this.itemEdit.invoice_cat,
                invoice_store: this.itemEdit.invoice_store,
                invoice_store_type: this.itemEdit.invoice_store_type,
              };

              this.$supabase
                .from("invoice")
                .update(objectToUpdate)
                .eq("id", this.itemEdit.id)
                .then((data) => {
                  this.$bvToast.toast(
                    `Sửa đồ thế ${this.itemEdit.invoice_number} thành công`,
                    {
                      title: "Thông báo",
                      autoHideDelay: 1000,
                      appendToast: true,
                      variant: "primary",
                    }
                  );
                  this.$refs.modal_edit.hide();
                  this.itemEdit = null;
                  this.$refs.my_table.refresh();
                });
            }
          })
          .catch((err) => {
            // An error occurred
          });
      } else {
        alert("Vui lòng kiểm tra các trường");
      }
    },
    intem() {},
    intemSingle() {
      let list_tem = [];
      list_tem.push({
        maso: this.itemEdit.invoice_number,
        tien: this.itemEdit.invoice_money,
        ten: this.itemEdit.customer_name,
        ngay: this.itemEdit.invoice_date_create,
        id: this.itemEdit.id,
      });
      this.$pnPublish(
        {
          channel: "printserver",
          message: { type: "ingiaythe", list: list_tem },
        },
        (status, response) => {
          if (status.error) {
            console.log(status);
          } else {
            alert("Chờ máy in ra tem ra rồi mới bấm OK");
            this.$refs["my_table"].refresh();
            this.select = [];
            console.log("Message Published", response);
          }
        }
      );
    },
    delete_invoice() {
      this.$bvModal
        .msgBoxConfirm("Hãy xác nhận bạn muốn xóa hóa đơn", {
          title: "Xác nhận XÓA",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "YES",
          cancelTitle: "NO",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          if (value === true) {
            this.$supabase
              .from("invoice")
              .delete()
              .eq("id", this.itemEdit.id)
              .then((data) => {
                this.$bvToast.toast(
                  `Xóa đồ thế ${this.itemEdit.invoice_number} thành công`,
                  {
                    title: "Thông báo",
                    autoHideDelay: 1000,
                    appendToast: true,
                    variant: "primary",
                  }
                );
                this.$refs.modal_edit.hide();
                this.itemEdit = null;
                this.$refs.my_table.refresh();
              });
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },
    check_invoice() {
      const h = this.$createElement;
      const messageVNode = h("div", { class: ["foobar"] }, [
        h("p", { class: ["text-center"] }, [
          "Ngày chuộc đồ (mặc định hôm nay)",
        ]),
        h("b-input", {
          props: {
            type: "search",
            value: new this.$moment().format("DD/MM/YYYY"),
            id: "modal_thanhly_date",
          },
        }),
      ]);
      this.$bvModal
        .msgBoxConfirm(messageVNode, {
          title: "Xác nhận CHUỘC ĐỒ",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "YES",
          cancelTitle: "NO",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          let ngaythanhli = document.getElementById("modal_thanhly_date").value;
          let isValid = this.checkRegexDate(ngaythanhli);
          if (isValid === false) {
            alert("Ngày sai");
            return;
          }
          if (value === true && ngaythanhli && isValid) {
            //chuoc do
            console.log(ngaythanhli);
            let invoice_profit =
              parseInt(
                (
                  (this.getCountDateComponent(this.itemEdit) *
                    this.itemEdit.invoice_money *
                    this.profitPercent) /
                  3 /
                  1000 /
                  1000
                ).toFixed(0)
              ) * 1000;
            this.$supabase
              .from("invoice")
              .update({
                invoice_status: true,
                invoice_date_get: ngaythanhli,
                invoice_profit,
              })
              .eq("id", this.itemEdit.id)
              .then((data) => {
                this.$bvToast.toast(
                  `Thanh lý đồ thế ${this.itemEdit.invoice_number} thành công`,
                  {
                    title: "Thông báo",
                    autoHideDelay: 1000,
                    appendToast: true,
                    variant: "primary",
                  }
                );
                this.$refs.modal_edit.hide();
                this.itemEdit = null;
                this.$refs.my_table.refresh();
              });
          } else {
            alert("Ngày thanh lí không được bỏ trống");
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },

    lost_invoice() {
      const h = this.$createElement;
      const messageVNode = h("div", { class: ["foobar"] }, [
        h("p", { class: ["text-center"] }, ["Comment"]),
        h("b-textarea", {
          props: {
            type: "search",
            value: null,
            id: "modal_thanhly_textarea",
          },
        }),
        h("p", { class: ["text-center"] }, ["Số điện thoại"]),
        h("b-textarea", {
          props: {
            type: "search",
            value: null,
            id: "modal_thanhly_phone",
          },
        }),
      ]);
      this.$bvModal
        .msgBoxConfirm(messageVNode, {
          title: "Xác nhận MẤT GIẤY",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "YES",
          cancelTitle: "NO",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          let comment = document.getElementById("modal_thanhly_textarea").value;
          let sdt = document.getElementById("modal_thanhly_phone").value;

          if (value === true && comment && sdt) {
            //chuoc do
            let invoice_profit =
              parseInt(
                (
                  (this.getCountDateComponent(this.itemEdit) *
                    this.itemEdit.invoice_money *
                    this.profitPercent) /
                  3 /
                  1000 /
                  1000
                ).toFixed(0)
              ) * 1000;
            this.$supabase
              .from("invoice")
              .update({
                invoice_comment: comment,
                invoice_phone: sdt,
                invoice_type: "MẤT GIẤY",
                invoice_status: true,
                invoice_date_get: new this.$moment().format("YYYY/MM/DD"),
                invoice_profit,
              })
              .eq("id", this.itemEdit.id)
              .then((data) => {
                this.$bvToast.toast(
                  `Xác nhận mất giấy ${this.itemEdit.invoice_number} thành công`,
                  {
                    title: "Thông báo",
                    autoHideDelay: 1000,
                    appendToast: true,
                    variant: "primary",
                  }
                );
                this.$refs.modal_edit.hide();
                this.itemEdit = null;
                this.$refs.my_table.refresh();
              });
          } else {
            alert("Mất giấy phải có thông tin và số điện thoại");
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },
    validateEdit(itemEdit) {
      //valid
      let isValid = true;
      //name
      if (
        itemEdit.customer_name == null ||
        itemEdit.customer_name.trim().length == 0
      ) {
        this.editState.customer_name = false;
        isValid = false;
        return;
      } else {
        this.editState.customer_name = true;
      }
      //money
      if (
        itemEdit.invoice_money == "" ||
        itemEdit.invoice_money == null ||
        parseInt(itemEdit.invoice_money) < 0
      ) {
        isValid = false;
        this.editState.invoice_money = false;

        return false;
      } else {
        this.editState.invoice_money = true;
      }

      if (
        itemEdit.invoice_number == "" ||
        itemEdit.invoice_number == null ||
        parseInt(itemEdit.invoice_number) < 0
      ) {
        isValid = false;
        this.editState.invoice_number = false;

        return false;
      } else {
        this.editState.invoice_money = true;
      }

      return isValid;
    },
    checkMaSo() {
      //check regex
      const regex = /^[1-9]\d*$/g;
      let maso = parseInt(this.itemEdit.invoice_number);

      if (maso != this.itemEdit.invoice_number_beauty) {
        this.$supabase
          .from("invoice")
          .select("invoice_number")
          .eq("invoice_number", maso)
          .then((data) => {
            if (data.data.length > 0) {
              this.editState.invoice_number = false;
              alert("Mã số trùng");
            } else {
              this.editState.invoice_number = true;
            }
          });
      } else {
        this.editState.invoice_number = true;
      }
    },
    sell_invoice() {
      const h = this.$createElement;
      const messageVNode = h("div", { class: ["foobar"] }, [
        h("p", { class: ["text-center"] }, [
          "Ngày thanh lý (mặc định hôm nay)",
        ]),
        h("b-input", {
          props: {
            type: "search",
            value: new this.$moment().format("DD/MM/YYYY"),
            id: "modal_thanhly_date",
          },
        }),
      ]);
      this.$bvModal
        .msgBoxConfirm(messageVNode, {
          title: "Xác nhận THANH LÝ",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "YES",
          cancelTitle: "NO",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          let ngaythanhli = document.getElementById("modal_thanhly_date").value;
          let isValid = this.checkRegexDate(ngaythanhli);
          if (isValid === false) {
            alert("Ngày sai");
            return;
          }
          if (value === true && ngaythanhli && isValid) {
            //chuoc do
            console.log(ngaythanhli);
            let invoice_profit =
              parseInt(
                (
                  (this.getCountDateComponent(this.itemEdit) *
                    this.itemEdit.invoice_money *
                    this.profitPercent) /
                  3 /
                  1000 /
                  1000
                ).toFixed(0)
              ) * 1000;
            this.$supabase
              .from("invoice")
              .update({
                invoice_type: "THANH LÝ",
                invoice_status: true,
                invoice_date_get: ngaythanhli,
                invoice_profit,
              })
              .eq("id", this.itemEdit.id)
              .then((data) => {
                this.$bvToast.toast(
                  `Thanh lý đồ thế ${this.itemEdit.invoice_number} thành công`,
                  {
                    title: "Thông báo",
                    autoHideDelay: 1000,
                    appendToast: true,
                    variant: "primary",
                  }
                );
                this.$refs.modal_edit.hide();
                this.itemEdit = null;
                this.$refs.my_table.refresh();
              });
          } else {
            alert("Ngày thanh lí không được bỏ trống");
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },
    checkRegexDate(str) {
      const regex =
        /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/(20[2-4][3-9]|2050)$/;
      return regex.test(str);
    },
    cellClick(item, index, event) {
      this.itemEdit = JSON.parse(JSON.stringify(item));
      this.$refs["modal_edit"].show();
    },
    changeEditDate() {
      let dateConvert = this.getNgayCam(
        this.itemEdit.invoice_date_create_beauty
      );
      this.itemEdit.invoice_date_create = dateConvert.toInsert;
    },
    getCountDateComponent(item) {
      let dateStart;
      let dateEnd;
      dateStart = item.invoice_date_create;

      if (item.invoice_status) {
        dateEnd = item.invoice_date_get;
        //đã chuộc, invoice_status : false. => đã chuộc, lấy ra invoice_date_get
      } else {
        dateEnd = new Date();
        //chưa chuộc, lấy ra invoice_date_create - now
      }
      let count = this.getCountDate(dateStart, dateEnd);
      return count + 1;
    },
    getCountDate(dateStart, dateEnd) {
      let _dateStart = this.$moment(dateStart);
      let _dateEnd = this.$moment(dateEnd);
      let count = _dateEnd.diff(_dateStart, "days");
      return count + 1;
      // =1
    },
    getTotalRow() {
      this.$supabase
        .from("invoice")
        .select("*", { count: "exact", head: true })
        .then((data) => {
          this.totalRows = data.count;
          this.dataReady = true;
        });
    },
    refreshTable() {
      this.$refs.my_table.refresh();
    },

    getNgayCam(ngayhople) {
      try {
        let ngay = ngayhople.split("/")[0];
        let thang = ngayhople.split("/")[1];
        let nam = ngayhople.split("/")[2];
        if (typeof ngay === "undefined" || ngay === "" || parseInt(ngay) > 31) {
          throw new Error("Ngày khong hop le");
        }
        if (
          typeof thang === "undefined" ||
          thang === "" ||
          parseInt(thang) > 12
        ) {
          throw new Error("Tháng khong hop le");
        }
        if (
          typeof nam === "undefined" ||
          nam === "" ||
          parseInt(nam) > 2050 ||
          parseInt(nam) < 2022
        ) {
          throw new Error("Năm khong hop le");
        }
        let ngayFinal = {
          isValid: true,
          toInsert: `${nam}/${thang}/${ngay}`,
          toFormat: `Ngày ${ngay} tháng ${thang} năm ${nam}`,
          toShort: `${ngay}/${thang}/${nam}`,
          msg: "ok",
        };
        return ngayFinal;
      } catch (err) {
        let errMsg = err.toString();
        console.log("==", errMsg, "==");
        if (
          errMsg == "Error: Ngày khong hop le" ||
          errMsg == "Error: Tháng khong hop le" ||
          errMsg == "Error: Năm khong hop le"
        ) {
          return {
            isValid: false,
            msg: "Ngày/tháng/năm không hợp lệ",
          };
        } else {
          return {
            isValid: false,
            msg: "",
          };
        }
      }
    },
    async myProvider(ctx) {
      let sortBy = "id";
      // console.log(ctx);
      if (ctx.sortBy === "invoice_count") {
        ctx.sortBy = "invoice_date_create";
      }
      if (ctx.sortBy != "") {
        sortBy = ctx.sortBy;
      }
      if (ctx.sortBy === "invoice_status") {
        sortBy = "invoice_status";
      }
      this.tableOverlay = true;
      try {
        let s = (ctx.currentPage - 1) * ctx.perPage;
        let e = s + ctx.perPage;
        let queryCount = this.$supabase
          .from("invoice")
          .select("*", { count: "exact", head: true });
        let query = this.$supabase
          .from("invoice")
          .select("*")
          .range(s, e)
          .order(sortBy, { ascending: ctx.sortDesc });
        if (this.filter_ten && this.filter_ten.length > 1) {
          query = query.ilike("customer_name", `%${this.filter_ten}%`);
          queryCount = queryCount.ilike(
            "customer_name",
            `%${this.filter_ten}%`
          );
        }
        if (parseInt(this.filter_sotien_start) > 0) {
          query = query.gte(
            "invoice_money",
            parseInt(this.filter_sotien_start) * 1000
          );
          queryCount = queryCount.gte(
            "invoice_money",
            parseInt(this.filter_sotien_start) * 1000
          );
        }
        if (parseInt(this.filter_sotien_end) > 0) {
          query = query.lte(
            "invoice_money",
            parseInt(this.filter_sotien_end) * 1000
          );
          queryCount = queryCount.lte(
            "invoice_money",
            parseInt(this.filter_sotien_end) * 1000
          );
        }

        //ngaystart
        if (
          this.filter_ngaycam_start &&
          this.filter_ngaycam_start.length > 1 &&
          this.getNgayCam(this.filter_ngaycam_start).isValid
        ) {
          let ngayStart = this.getNgayCam(this.filter_ngaycam_start);
          query = query.gte("invoice_date_create", ngayStart.toInsert);
          queryCount = queryCount.gte(
            "invoice_date_create",
            ngayStart.toInsert
          );
        }

        if (
          this.filter_ngaycam_end &&
          this.filter_ngaycam_end.length > 1 &&
          this.getNgayCam(this.filter_ngaycam_end).isValid
        ) {
          let ngayEnd = this.getNgayCam(this.filter_ngaycam_end);
          queryCount = queryCount.lte("invoice_date_create", ngayEnd.toInsert);
          query = query.lte("invoice_date_create", ngayEnd.toInsert);
        }

        if (this.filter_status != null) {
          if (this.filter_status) {
            queryCount = queryCount.eq("invoice_status", false);
            query = query.eq("invoice_status", false);
          } else {
            queryCount = queryCount.eq("invoice_status", true);
            query = query.eq("invoice_status", true);
          }
        }
        if (this.filter_invoice_store != null) {
          query = query.eq("invoice_store", this.filter_invoice_store);
          queryCount = queryCount.eq(
            "invoice_store",
            this.filter_invoice_store
          );
        }
        if (this.filter_ma != null && this.filter_ma != "") {
          queryCount = queryCount.eq(
            "invoice_number",
            parseInt(this.filter_ma)
          );
          query = query.eq("invoice_number", parseInt(this.filter_ma));
        }
        if (this.filter_invoice_store_type != null) {
          query = query.eq(
            "invoice_store_type",
            this.filter_invoice_store_type
          );
          queryCount = queryCount.eq(
            "invoice_store_type",
            this.filter_invoice_store_type
          );
        }
        if (this.filter_invoice_cat != null) {
          query = query.eq("invoice_cat", this.filter_invoice_cat);
          queryCount = queryCount.eq("invoice_cat", this.filter_invoice_cat);
        }
        if (
          this.filter_invoice_tag.length > 0 &&
          this.filter_invoice_tag != null
        ) {
          for (let o = 0; o < this.filter_invoice_tag.length; o++) {
            query = query.like(
              "invoice_tag",
              `%${this.filter_invoice_tag[o]}%`
            );
            queryCount = queryCount.like(
              "invoice_tag",
              `%${this.filter_invoice_tag[o]}%`
            );
          }
        }

        if (this.filter_invoice_type != null) {
          queryCount = queryCount.eq("invoice_type", this.filter_invoice_type);
          query = query.eq("invoice_type", this.filter_invoice_type);
        }

        let item = await query;
        let itemCount = await queryCount;

        this.totalRows = itemCount.count;
        let result = item.data;
        let newResult = [];
        result.forEach((item) => {
          if (item.invoice_date_get != null) {
            item.invoice_date_get_beauty = this.formatDay(
              item.invoice_date_get
            );
          }
          item.invoice_date_create_beauty = this.formatDay(
            item.invoice_date_create
          );
          item.invoice_number_beauty = item.invoice_number;
          newResult.push(item);
        });
        this.tableOverlay = false;
        return newResult;
      } catch (error) {
        return [];
      }
    },
    formatN(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    deleteItem(id) {
      this.tableOverlay = true;
      console.log(id);
      this.$supabase
        .from("invoice")
        .delete()
        .eq("id", id)
        .then((data) => {
          this.getData();
          this.$bvToast.toast(`Xóa đồ thế ${id} thành công`, {
            title: "Thông báo",
            autoHideDelay: 1000,
            appendToast: true,
            variant: "primary",
          });
        });
    },
    getNgay(x) {
      let date = x.split("-");
      let newDate = new Date(date[0], date[1] - 1, date[1]);
      return `${date[2]}/${date[1]}/${date[0]}`;
    },
    getData() {
      this.$supabase
        .from("invoice")
        .select(
          "id,customer_name,invoice_number,invoice_date_create,invoice_money"
        )
        .range(0, 20)
        .then((data) => {
          this.listData = data.data;
          this.tableOverlay = false;
        });
    },
  },
  mounted() {
    this.getTotalRow();
    this.getData();
  },
};
</script>

<style scope>
body {
  font-family: Circular, custom-font, Helvetica Neue, Helvetica, Arial,
    sans-serif !important;

  height: 100vh;
  min-height: 100vh;
}
.my_table tr td {
  text-align: left;
  text-align: center !important;
  padding: 1px !important;
  margin: 0 !important;
}
.tdIndex {
  text-align: center !important;
}
.textLeft {
  text-align: left !important;
}
.myThClass {
  min-width: 200px !important;
  text-align: center;
}
.myThClass20percent {
  min-width: 20% !important;
  text-align: center;
}
.myThClass500px {
  min-width: 300px !important;
  text-align: center;
}
.filter_input {
  margin: 3px;
}
.my_table td:hover {
  cursor: cell;
  background-color: antiquewhite;
}
</style>