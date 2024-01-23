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
    <b-modal id="modal_sanpham">
      <h1>san pham</h1>
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
              <b-dropdown-item-button>Đặt đồ</b-dropdown-item-button>
              <b-dropdown-item-button>Tiền công thợ</b-dropdown-item-button>
              <b-dropdown-item-button>Chế vàng</b-dropdown-item-button>
              <b-dropdown-item-button>Kiểm tiền</b-dropdown-item-button>
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
    checkSanPham() {
      this.$bvModal.show("modal_sanpham");
    },
    getCamDo() {},
  },
  mounted() {
    window.addEventListener("keyup", (e) => {
      if (e.key === "@" || e.key === "#") {
        this.type = e.key;
        this.$bvModal.show("modal_input");
      }
    });
  },
};
</script>
<style>
</style>
