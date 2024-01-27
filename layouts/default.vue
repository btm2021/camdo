<template>
  <div>
    <b-modal
      ref="modal_camdo"
      id="modal_camdo"
      title="Cầm đồ - Hóa đơn "
      hide-footer
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
                :placeholder="itemEdit.customer_name"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Mã số:">
              <b-form-input
                autocomplete="off"
                :disabled="itemEdit.invoice_status ? true : false"
                autocapitalize
                v-model="itemEdit.invoice_number"
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
              :description="$formatN(itemEdit.invoice_money)"
            >
              <b-form-input
                autocomplete="off"
                :disabled="itemEdit.invoice_status ? true : false"
                autocapitalize
                v-model="itemEdit.invoice_money"
                type="number"
                :placeholder="$formatN(itemEdit.invoice_money)"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Ngày thế">
              <b-form-input
                autocomplete="off"
                :disabled="itemEdit.invoice_status ? true : false"
                autocapitalize
                @change="changeEditDate"
                v-model="itemEdit.invoice_date_create"
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
                    {{ $getCountDateComponent(itemEdit) }}
                  </td>
                </tr>
                <tr>
                  <td class="text-left">Tiền Vốn</td>
                  <td class="text-right">
                    {{ $formatN(itemEdit.invoice_money) }}
                  </td>
                </tr>
                <tr>
                  <td class="text-left">Tiền Lãi</td>
                  <td class="text-right">
                    {{
                      $formatN(
                        parseInt(
                          (
                            ($getCountDateComponent(itemEdit) *
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
                    {{ $formatN($getTongTien(itemEdit)) }}
                  </td>
                </tr>
              </table>
            </b-form-group>
          </b-col>
        </b-row>
      </div>
    </b-modal>
    <b-modal
      id="modal_sanpham"
      size="lg"
      hide-footer
      no-close-on-backdrop
      title="Thông tin sản phẩm"
    >
      <b-overlay :show="overlaySanPham">
        <b-row v-if="itemFromScanner">
          <b-col cols="6">
            <b-img :src="itemFromScanner.product_image_url" center fluid />
            <b-table-simple
              small
              hover
              bordered
              responsive
              fixed
              class="default_table"
            >
              <b-tbody>
                <b-tr>
                  <b-td>
                    <span class="title">Tổng giá nhập</span>
                  </b-td>
                  <b-td>
                    <div class="value">
                      {{ $formatN(itemFromScanner.gianhap || 0) }}
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Giá hiện tại</span>
                  </b-td>
                  <b-td>
                    <div class="value text-danger">
                      <span class="blink">👉</span>
                      {{ $formatN(itemFromScanner.giahientai || 0) }}
                      <span class="blink">👈</span>
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Giá Xuất</span>
                  </b-td>
                  <b-td>
                    <div class="value">
                      {{ $formatN(itemFromScanner.giaxuat || 0) }}
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <div class="title">Lệch</div>
                  </b-td>
                  <b-td>
                    <div class="value">
                      {{ $formatN(itemFromScanner.gialech || 0) }}
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td colspan="2">
                    <b-button-group>
                      <b-button
                        :disabled="!itemFromScanner.product_status"
                        variant="danger"
                        :href="`/sanpham/${itemFromScanner.product_barcode}`"
                        >Sửa Sp
                      </b-button>
                      <b-button
                        :disabled="!itemFromScanner.product_status"
                        variant="primary"
                        @click="thanhtoan"
                        >Thanh toán</b-button
                      >
                      <b-button
                        :disabled="!itemFromScanner.product_status"
                        variant="success"
                        @click="themgiohang"
                        >Thêm giỏ hàng</b-button
                      >
                      <b-button
                        :disabled="!itemFromScanner.product_status"
                        variant="danger"
                        @click="themgiohang"
                        >Xóa trong giỏ hàng</b-button
                      >
                    </b-button-group>
                  </b-td>
                </b-tr>
              </b-tbody>
            </b-table-simple>
          </b-col>
          <b-col cols="6">
            <b-table-simple small hover bordered responsive fixed>
              <b-tbody>
                <b-tr>
                  <b-td colspan="2">
                    <div
                      v-if="
                        itemFromScanner.product_status &&
                        listGioHang.find(
                          (item) =>
                            item.product_barcode ==
                            itemFromScanner.product_barcode
                        )
                      "
                    >
                      <b-badge variant="success"
                        >Sản phẩm đang có trong giỏ hàng</b-badge
                      >
                    </div>
                    <div v-else>
                      <b-badge variant="danger"
                        >Sản phẩm KHÔNG có trong giỏ hàng</b-badge
                      >
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Mã sản phẩm</span>
                  </b-td>
                  <b-td>
                    <div class="value text-success bd-highlight">
                      {{ itemFromScanner.product_barcode }}
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Ngày Nhập</span>
                  </b-td>
                  <b-td>
                    <div class="value">
                      <span class="text-primary">
                        {{
                          $moment(itemFromScanner.created_at).format(
                            "DD/MM/YYYY"
                          )
                        }}</span
                      >
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Ngày Bán</span>
                  </b-td>
                  <b-td>
                    <div class="value" v-if="itemFromScanner.product_sell_date">
                      <span class="text-primary">
                        {{
                          $moment(itemFromScanner.product_sell_date).format(
                            "DD/MM/YYYY"
                          )
                        }}</span
                      >
                      -
                      {{
                        $moment(itemFromScanner.created_at).diff(
                          $moment(itemFromScanner.product_sell_date),
                          "days"
                        ) + 1
                      }}
                      ngày
                    </div>
                    <div v-else>Chưa bán</div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Kiểu dáng sản phẩm</span>
                  </b-td>
                  <b-td>
                    <div class="value">
                      <b-badge variant="success">
                        {{ itemFromScanner.product_catalog }}</b-badge
                      >
                      {{
                        $store.state.config.sanpham_optionCatalog.filter(
                          (i) => i.value === itemFromScanner.product_catalog
                        )[0].text
                      }}
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Loại Vàng</span>
                  </b-td>
                  <b-td>
                    <div class="value text-danger">
                      {{ itemFromScanner.product_type }}
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Trọng Lượng Tổng</span>
                  </b-td>
                  <b-td>
                    <div class="value">
                      {{
                        $formatSoVang(itemFromScanner.product_total_weight)
                          .fullStr
                      }}
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Trọng Lượng Vàng</span>
                  </b-td>
                  <b-td>
                    <div class="value text-warning">
                      {{
                        $formatSoVang(itemFromScanner.product_gold_weight)
                          .fullStr
                      }}
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Trọng Lượng hột</span>
                  </b-td>
                  <b-td>
                    <div class="value">
                      {{
                        $formatSoVang(itemFromScanner.product_stone_weight)
                          .fullStr
                      }}
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Tiền công nhập</span>
                  </b-td>
                  <b-td>
                    <div class="value">
                      {{ itemFromScanner.product_wage_in }}
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <div class="title">Tiền công xuất</div>
                  </b-td>
                  <b-td>
                    <div class="value text-danger text-bold">
                      <span class="blink">👉</span>
                      {{ itemFromScanner.product_wage }}
                      <span class="blink">👈</span>
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Tình Trạng sản phẩm</span>
                  </b-td>
                  <b-td>
                    <div class="value">
                      <b-badge
                        variant="warning"
                        v-if="itemFromScanner.product_status"
                        >Chưa bán</b-badge
                      >
                      <b-badge variant="success" v-else>Đã bán</b-badge>
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Chành Nhập</span>
                  </b-td>
                  <b-td>
                    <div class="value">
                      <b-badge
                        variant="warning"
                        v-if="itemFromScanner.product_import_type"
                        >Chành SG</b-badge
                      >
                      <b-badge variant="primary" v-else>Hàng Nội Bộ</b-badge>
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Giá Vàng Nhập</span>
                  </b-td>
                  <b-td>
                    <div class="value">
                      {{ itemFromScanner.product_price_import }}
                    </div>
                  </b-td>
                </b-tr>
              </b-tbody>
            </b-table-simple>
          </b-col>
        </b-row>
      </b-overlay>
    </b-modal>
    <b-modal id="modal_input" hide-header hide-footer hide-header-close>
      <b-input
        v-model="modal_input"
        autofocus
        @change="checkInput"
        size="lg"
        class="text-center"
        style="font-size: 50px; font-weight: bold"
      ></b-input>
    </b-modal>
    <b-sidebar width="700px" id="sidebargiohang" title="Giỏ hàng" shadow>
      <b-overlay :show="overlayGioHang">
        <div class="px-3 py-2">
          <b-table
            bordered
            no-border-collapse
            class="default_tablegiohang"
            hover
            :fields="fieldsGioHang"
            :items="listGioHang"
            show-empty
            small
            responsive
          >
            <template #cell(stt)="data">
              {{ data.index + 1 }}
            </template>

            <template #cell(product_wage)="data">
              <strong>{{ data.item.product_wage }}</strong>
            </template>

            <template #cell(giahientai)="data">
              <strong class="text-danger">{{
                $formatN(data.item.giahientai)
              }}</strong>
            </template>
            <template #cell(product_total_weight)="data">
              <span>{{
                $formatSoVang(data.item.product_total_weight).fullStr
              }}</span>
            </template>
            <template #cell(product_stone_weight)="data">
              <span>{{
                $formatSoVang(data.item.product_stone_weight).fullStr
              }}</span>
            </template>
            <template #cell(product_gold_weight)="data">
              <b class="text-primary">{{
                $formatSoVang(data.item.product_gold_weight).fullStr
              }}</b>
            </template>

            <template #cell(propduct_barcode)="data">
              <strong class="text-primary">{{
                data.item.product_barcode
              }}</strong>
            </template>

            <template #cell(propduct_type)="data">
              <strong class="text-primary">{{ data.item.product_type }}</strong>
            </template>
            <template #cell(product_catalog)="data">
              <strong class="text-primary">
                {{
                  $store.state.config.sanpham_optionCatalog.find(
                    (i) => i.value === data.item.product_catalog
                  ).text
                }}
              </strong>
            </template>

            <template #cell(remove)="data">
              <b-button variant="danger" @click="xoaSanPhamGioHang(data.item)"
                >Xóa</b-button
              >
            </template>
            <template #cell(product_image_url)="data">
              <b-img
                class="hoverImage"
                :src="data.item.product_image_url"
                style="width: 100px; height: 100px"
              />
            </template>
          </b-table>
        </div>
      </b-overlay>

      <template #footer>
        <div
          class="d-flextext-light bg-warning align-items-center px-3 py-2 text-right"
        >
          <b-button
            v-if="listGioHang.length > 0"
            @click="thanhtoangiohang"
            variant="success"
            >Thanh toán</b-button
          >
          <strong
            v-if="listGioHang.length > 0"
            class="mr-auto text-danger text-right"
            >Tổng giá trị trong giỏ :
            {{ $formatSoTien(getTongGiaTriGioHang()) }}</strong
          >
          <strong v-else>Giỏ hàng trống</strong>
        </div>
      </template>
    </b-sidebar>
    <b-navbar
      style="padding: 0px; height: 40px"
      toggleable="lg"
      type="dark"
      variant="primary"
    >
      <b-navbar-brand to="/">BPJ</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item-dropdown text="Cầm Đồ">
            <b-dropdown-group id="dropdown-group-1">
              <b-dropdown-item href="/camdo/">
                Danh sách hóa đơn
              </b-dropdown-item>
              <b-dropdown-item href="/camdo/them"
                >Thêm hóa đơn thế</b-dropdown-item
              >
              <b-dropdown-item href="/camdo/chuocdo">Rút giấy</b-dropdown-item>
              <b-dropdown-item href="/camdo/thanhly"> Thanh lý</b-dropdown-item>
            </b-dropdown-group>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <b-navbar-nav>
          <b-nav-item-dropdown text="Sản phẩm">
            <b-dropdown-group id="dropdown-group-1" header="Sản phẩm">
              <b-dropdown-item href="/sanpham/"
                >Danh sách sản phẩm</b-dropdown-item
              >
              <b-dropdown-item to="/sanpham/them"
                >Thêm sản phẩm</b-dropdown-item
              >
            </b-dropdown-group>
            <b-dropdown-group id="dropdown-group-2" header="Bảng giá">
              <b-dropdown-item href="/">Bảng Giá</b-dropdown-item>
            </b-dropdown-group>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <b-navbar-nav>
          <b-nav-item-dropdown text="Hóa đơn">
            <b-dropdown-group id="dropdown-group-1" header="Sản phẩm">
              <b-dropdown-item href="/hoadon/"
                >Danh sách hóa đơn phẩm</b-dropdown-item
              >
              <b-dropdown-item to="/hoadon/them">Tạo Hóa Đơn</b-dropdown-item>
            </b-dropdown-group>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <b-navbar-nav>
          <b-nav-item-dropdown text="Công cụ">
            <b-dropdown-group
              id="dropdown-group-1"
              header="Sản phẩm"
              style="width: 300px"
            >
              <b-dropdown-item href="/tv">Bảng giá</b-dropdown-item>
              <b-dropdown-item href="/tool/cannuoc">Cân Nước</b-dropdown-item>
              <b-dropdown-item-button>Đặt đồ</b-dropdown-item-button>
              <b-dropdown-item-button>Tiền công thợ</b-dropdown-item-button>
              <b-dropdown-item-button>Chế vàng</b-dropdown-item-button>
              <b-dropdown-item href="/tool/kiemtien">Kiểm tiền</b-dropdown-item>
              <b-dropdown-item-button>Thông tin tiệm</b-dropdown-item-button>
              <b-dropdown-item-button>Sổ đánh bóng</b-dropdown-item-button>
            </b-dropdown-group>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <b-navbar-nav>
          <b-nav-item-dropdown text="Thống kê">
            <b-dropdown-group
              id="dropdown-group-1"
              header="Sản phẩm"
              style="width: 300px"
            >
              <b-dropdown-item-button>Sản phẩm</b-dropdown-item-button>
              <b-dropdown-item href="/thongke/camdo">Cầm đồ</b-dropdown-item>
            </b-dropdown-group>
          </b-nav-item-dropdown>
        </b-navbar-nav>
        <b-navbar-nav>
          <b-nav-item to="/chat">Chat</b-nav-item>
        </b-navbar-nav>
        <!-- Right aligned nav items -->
        <!-- <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input
              size="sm"
              class="mr-sm-2"
              placeholder="Search"
            ></b-form-input>
          </b-nav-form>
        </b-navbar-nav> -->
      </b-collapse>
    </b-navbar>
    <nuxt />
  </div>
</template>
<script>
export default {
  data() {
    return {
      overlayGioHang: false,
      fieldsGioHang: [
        { key: "stt", label: "#" },
        { key: "product_image_url", label: "Ảnh" },
        { key: "product_barcode", label: "Mã" },

        { key: "product_type", label: "Loại" },

        { key: "product_catalog", label: "Kiểu" },
        { key: "product_total_weight", label: "Tổng" },
        { key: "product_stone_weight", label: "Hột" },
        { key: "product_gold_weight", label: "Vàng" },
        { key: "product_wage", label: "Công" },
        { key: "giahientai", label: "Giá" },
        { key: "remove", label: "Giá" },
      ],
      overlaySanPham: false,
      question: "",
      answer: "",
      modal_input: null,
      type: null,
      itemEdit: null,
      tempInput: "",
      inputFromScanner: "",
      lastKeypressTime: 0,
      MAX_DURATION_BETWEEN_KEYS: 50, // Đơn vị là milliseconds
      barcodeInput: "",
      itemFromScanner: null,
      listGioHang: [],
    };
  },
  methods: {
    xoaSanPhamGioHang(item) {
      this.listGioHang = this.listGioHang.filter((x) => x !== item);
    },
    getTongGiaTriGioHang() {
      let count = 0;
      this.listGioHang.forEach((item) => {
        count += item.giahientai;
      });
      return count;
    },
    themgiohang() {
      this.listGioHang.push(this.itemFromScanner);

      this.$root.$emit("bv::toggle::collapse", "sidebargiohang");
    },
    async thanhtoan() {
      this.overlaySanPham = true;
      //updatr product
      await this.$supabase
        .from("product")
        .update({
          product_sell_date: new Date(),
          product_total_price: this.itemFromScanner.giahientai,
          product_status: false,
          product_price_export: this.itemFromScanner.sellingPrice,
        })
        .eq("id", this.itemFromScanner.id);
      //them vao hoa don
      let { error, data } = await this.$supabase
        .from("hoadon")
        .insert({
          tongsotien: this.itemFromScanner.giahientai,
          sanpham: [this.itemFromScanner.product_barcode],
        })
        .select();
      data = data[0];

      await fetch("https://ntfy.sh/tiemvangbaophuong2024", {
        method: "POST",
        headers: {
          Click: "https://simplegold.vercel.app/hoadon/" + data.id,
          Tags: ["tada"],
        },
        body: `${this.$moment().format(
          "DD/MM/YYYY hh:mm"
        )} Hóa đơn vừa được tạo với 1 sản phẩm ${
          this.itemFromScanner.product_barcode
        } với tổng giá trị ${this.$formatN(this.itemFromScanner.giahientai)}
        `,
      });

      this.$bvModal.hide("modal_sanpham");
      this.$bvToast.toast(
        `Bán sản phẩm ${
          this.itemFromScanner.product_barcode
        } với giá ${this.$formatN(this.itemFromScanner.giaxuat)}`,
        {
          title: "Thông báo",
          autoHideDelay: 3000,
          appendToast: true,
          variant: "success",
        }
      );

      this.overlaySanPham = false;
      this.itemFromScanner = null;
    },
    async thanhtoangiohang() {
      //tạo hóa đơn
      this.overlayGioHang = true;
      let obInsert = {
        tongsotien: this.getTongGiaTriGioHang(),
        sanpham: this.listGioHang.map((item) => item.product_barcode),
      };
      let { data, error } = await this.$supabase
        .from("hoadon")
        .insert(obInsert);
      //update san pham
      for (let i = 0; i < this.listGioHang.length; i++) {
        let item = this.listGioHang[i];
        await this.$supabase
          .from("product")
          .update({
            product_sell_date: new Date(),
            product_total_price: item.giahientai,
            product_status: false,
            product_price_export: item.sellingPrice,
          })
          .eq("id", item.id);
      }
      data = data[0];
      await fetch("https://ntfy.sh/tiemvangbaophuong2024", {
        method: "POST",
        headers: {
          Click: "https://simplegold.vercel.app/hoadon/" + data.id,
          Tags: ["tada"],
        },
        body: `${this.$moment().format(
          "DD/MM/YYYY hh:mm"
        )} Hóa đơn vừa được tạo với ${this.listGioHang.length} sản phẩm.
        Tổng giá trị ${this.$formatN(obInsert.tongsotien)}
        `,
      });
      this.$bvToast.toast(
        `Tạo hóa đơn ${data.id} thành công  với giá ${this.$formatN(
          obInsert.tongsotien
        )}`,
        {
          title: "Thông báo",
          autoHideDelay: 3000,
          appendToast: true,
          variant: "success",
        }
      );
      this.listGioHang = [];
      this.overlayGioHang = false;
    },
    checkInput() {
      this.$bvModal.hide("modal_input");
      if (this.type === "@") {
        this.checkCamDo();
      }
      if (this.type === "#") {
        this.checkSanPham();
      }
      this.type = null;
      this.modal_input = null;
    },
    checkCamDo() {
      let hoadon = this.modal_input;
      this.$supabase
        .from("invoice")
        .select()
        .eq("invoice_number", hoadon)
        .then((data) => {
          this.itemEdit = data.data[0];
          //console.log(this.itemEdit);
          this.$bvModal.show("modal_camdo");
        });
    },
    checkSanPham(id) {
      this.$supabase
        .from("product")
        .select()
        .eq("product_barcode", id)
        .then(async (data) => {
          let d = data.data[0];
          let a = await this.$sp_laygiatri(d);

          if (d) {
            this.itemFromScanner = { ...d, ...a };
            console.log(this.itemFromScanner);
            this.$bvModal.show("modal_sanpham");
          } else {
            alert("Mã sản phẩm không tồn tại");
          }
        });
    },
    isBarcodeScan(input, duration) {
      return input.endsWith("\n") && duration < this.MAX_DURATION_BETWEEN_KEYS;
    },
    getCamDo() {},
  },
  mounted() {
    //init pubnub
    window.addEventListener("keyup", (event) => {
      // check router
      this.itemFromScanner = null;
      this.$bvModal.hide("modal_sanpham");
      this.$bvModal.hide("modal_camdo");

      if (event.key === "Meta") {
        return;
      }
      const currentTime = event.timeStamp;
      const duration = currentTime - this.lastKeypressTime;
      this.lastKeypressTime = currentTime;

      // Thêm ký tự vào chuỗi barcodeInput
      if (event.key !== "Enter") {
        this.barcodeInput += event.key;
      } else {
        this.barcodeInput += "\n"; // Thêm ký tự Enter vào cuối chuỗi
      }

      // Kiểm tra khi phím Enter được nhấn
      if (event.key === "Enter") {
        let regexSp = /^[a-z]{2}\d+$/;
        let regexDoThe = /^=\-?\d+$/;
        let scannerInput = this.barcodeInput.replace(/[\s\n]+/g, "");
        if (
          this.isBarcodeScan(this.barcodeInput, duration) &&
          scannerInput != ""
        ) {
          let action = "";

          if (regexDoThe.test(scannerInput)) {
            console.log(action);
            action = "dothe";
          }
          if (regexSp.test(scannerInput)) {
            console.log(action);
            action = "sanpham";
          }
          console.log("Barcode detected:", scannerInput, action);
          this.barcodeInput = ""; // Xóa chuỗi sau khi xử lý
          switch (action) {
            case "dothe":
              {
                this.checkSanPham(scannerInput);
                this.barcodeInput = ""; // Xóa chuỗi sau khi xử lý
              }
              break;
            case "sanpham":
              {
                this.checkSanPham(scannerInput);
                this.barcodeInput = ""; // Xóa chuỗi sau khi xử lý
              }
              break;
          }
        } else {
          console.log("Regular input", this.barcodeInput);
          this.barcodeInput = ""; // Xóa chuỗi sau khi xử lý
        }
      }
    });
  },
};
</script>
<style>
.title {
  font-weight: 500;
}
.value:hover {
  color: blue;
  cursor: pointer;
}
.value {
  color: #007bff;
  text-align: center;
}
.default_table td {
  text-align: center;
}
.blink {
  animation: blink-animation 1s steps(5, start) infinite;
  -webkit-animation: blink-animation 0.5s steps(5, start) infinite;
}
@keyframes blink-animation {
  to {
    visibility: hidden;
  }
}
@-webkit-keyframes blink-animation {
  to {
    visibility: hidden;
  }
}
.default_tablegiohang td {
  vertical-align: middle;
  cursor: pointer;
}
.hoverImage:hover {
  transform-origin: 40% 20%;
  transform: scale(
    4
  ); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport) */
}
</style>
