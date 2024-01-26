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
    <b-modal id="modal_sanpham" size="lg" title="Thông tin sản phẩm">
      <b-row v-if="itemFromScanner">
        <b-col cols="6">
          <b-img :src="itemFromScanner.product_image_url" center fluid />
          <b-table-simple small hover bordered responsive fixed>
            <b-tbody>
              <b-tr>
                <b-td>
                  <span class="title">Mã sản phẩm</span>
                </b-td>
                <b-td>
                  <span class="value">{{
                    itemFromScanner.product_barcode
                  }}</span>
                </b-td>
              </b-tr>
              <b-tr>
                <b-td>
                  <span class="title">Ngày Nhập</span>
                </b-td>
                <b-td>
                  <span class="value">{{
                    $moment(itemFromScanner.created_at).format("DD/MM/YYYY")
                  }}</span>
                </b-td>
              </b-tr>
              <b-tr>
                <b-td>
                  <span class="title">Kiểu dáng sản phẩm</span>
                </b-td>
                <b-td>
                  <span class="value">{{
                    itemFromScanner.product_catalog
                  }}</span>
                </b-td>
              </b-tr>
              <b-tr>
                <b-td>
                  <span class="title">Loại Vàng</span>
                </b-td>
                <b-td>
                  <span class="value">{{ itemFromScanner.product_type }}</span>
                </b-td>
              </b-tr>
              <b-tr>
                <b-td>
                  <span class="title">Trọng Lượng Tổng</span>
                </b-td>
                <b-td>
                  <span class="value">{{
                    itemFromScanner.product_total_weight
                  }}</span>
                </b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-col>
        <b-col cols="6">
          <b-table-simple small hover bordered responsive fixed>
            <b-tbody>
              <b-tr>
                <b-td>
                  <span class="title">Mã sản phẩm</span>
                </b-td>
                <b-td>
                  <span class="value">{{
                    itemFromScanner.product_barcode
                  }}</span>
                </b-td>
              </b-tr>
              <b-tr>
                <b-td>
                  <span class="title">Ngày Nhập</span>
                </b-td>
                <b-td>
                  <span class="value">{{
                    $moment(itemFromScanner.created_at).format("DD/MM/YYYY")
                  }}</span>
                </b-td>
              </b-tr>
              <b-tr>
                <b-td>
                  <span class="title">Kiểu dáng sản phẩm</span>
                </b-td>
                <b-td>
                  <span class="value">{{
                    itemFromScanner.product_catalog
                  }}</span>
                </b-td>
              </b-tr>
              <b-tr>
                <b-td>
                  <span class="title">Loại Vàng</span>
                </b-td>
                <b-td>
                  <span class="value">{{ itemFromScanner.product_type }}</span>
                </b-td>
              </b-tr>
              <b-tr>
                <b-td>
                  <span class="title">Trọng Lượng Tổng</span>
                </b-td>
                <b-td>
                  <span class="value">{{
                    itemFromScanner.product_total_weight
                  }}</span>
                </b-td>
              </b-tr>
              <b-tr>
                <b-td>
                  <span class="title">Trọng Lượng Vàng</span>
                </b-td>
                <b-td>
                  <span class="value">{{
                    itemFromScanner.product_gold_weight
                  }}</span>
                </b-td>
              </b-tr>
              <b-tr>
                <b-td>
                  <span class="title">Trọng Lượng hột</span>
                </b-td>
                <b-td>
                  <span class="value">{{
                    itemFromScanner.product_stone_weight
                  }}</span>
                </b-td>
              </b-tr>
              <b-tr>
                <b-td>
                  <span class="title">Tiền công nhập</span>
                </b-td>
                <b-td>
                  <span class="value">{{
                    itemFromScanner.product_wage_in
                  }}</span>
                </b-td>
              </b-tr>
              <b-tr>
                <b-td>
                  <span class="title">Tiền công xuất</span>
                </b-td>
                <b-td>
                  <span class="value">{{ itemFromScanner.product_wage }}</span>
                </b-td>
              </b-tr>
              <b-tr>
                <b-td>
                  <span class="title">Tình Trạng sản phẩm</span>
                </b-td>
                <b-td>
                  <span class="value">{{
                    itemFromScanner.product_status
                  }}</span>
                </b-td>
              </b-tr>
              <b-tr>
                <b-td>
                  <span class="title">Chành Nhập</span>
                </b-td>
                <b-td>
                  <span class="value">{{
                    itemFromScanner.product_import_type
                  }}</span>
                </b-td>
              </b-tr>
              <b-tr>
                <b-td>
                  <span class="title">Giá Vàng Nhập</span>
                </b-td>
                <b-td>
                  <span class="value">{{
                    itemFromScanner.product_price_import
                  }}</span>
                </b-td>
              </b-tr>
              <b-tr>
                <b-td>
                  <span class="title">Tổng giá trị</span>
                </b-td>
                <b-td>
                  <span class="value">{{
                    itemFromScanner.product_total_price
                  }}</span>
                </b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-col>
      </b-row>
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
    };
  },
  methods: {
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
      console.log("ma", id);
      this.$supabase
        .from("product")
        .select()
        .eq("product_barcode", id)
        .then((data) => {
          this.itemFromScanner = data.data[0];
          let d = data.data[0];
          console.log(d);
          if (d) {
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
    console.log(this.itemFromScanner);
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
</style>
