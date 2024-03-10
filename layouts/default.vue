<template>
  <div>
    <b-modal
      ref="modal_camdo"
      id="modal_camdo"
      class="default_modal_camdo"
      title="Cầm đồ - Hóa đơn "
      hide-footer
      size="lg"
      hide-header
    >
      <b-overlay :show="overlayCamDo">
        <b-table-simple
          v-if="tempCheckDothe"
          class="table_giaycamdo"
          responsive
          borderless
          style="min-height: 600px"
        >
          <b-thead>
            <b-tr>
              <b-th colspan="2" rowspan="3">
                <b-img
                  lazy
                  src="~assets/logo.png"
                  style="width: 100px; height: 100px; vertical-align: middle"
                  fluid
                />
              </b-th>
              <b-th colspan="4" rowspan="2">
                <h3 class="text-center">Tiệm Vàng BẢO PHƯƠNG</h3>
                <p>
                  Chuyên mua bán, cầm cố các loại trang sức nữ trang
                  <br />
                  KHU PHỐ 2, THỊ TRẤN PHƯỚC DÂN, NINH PHƯỚC, TỈNH NINH THUẬN<BR />
                  ĐT : 0329.984.983 - 0982.646.754
                </p>
              </b-th>
            </b-tr>
            <b-tr> </b-tr>
            <b-tr>
              <b-th colspan="4">
                <div>
                  <h3 style="float: right; color: #dc3545 !important">
                    {{ tempCheckDothe.invoice_number }}
                    <span v-if="tempCheckDothe.invoice_status">
                      <!-- da chuoc -->
                      <b-badge variant="primary">Đã chuộc</b-badge>
                    </span>
                    <span v-else>
                      <b-badge variant="success">Chưa chuộc</b-badge>
                    </span>
                  </h3>
                  <h2
                    class="text-center"
                    style="
                      color: blue;
                      text-decoration: underline;
                      font-weight: bold;
                    "
                  >
                    GIẤY CẦM
                  </h2>
                </div>
              </b-th>
              <!-- <b-th><h5 class="text-center text-danger">121213</h5></b-th> -->
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr>
              <b-td>Khách Hàng : </b-td>
              <b-td colspan="5" style="border-bottom: 1px dotted black">
                <span
                  style="color: #dc3545; font-weight: bold; font-size: 40px"
                >
                  {{ tempCheckDothe.customer_name }}
                </span>
              </b-td>
            </b-tr>
            <b-tr>
              <b-td>Tên vật cầm :</b-td>
              <b-td colspan="5" style="border-bottom: 1px dotted black">
                <span
                  style="color: #dc3545; font-weight: bold; font-size: 24px"
                >
                  <span
                    v-for="(item, index) in JSON.parse(
                      tempCheckDothe.invoice_tag
                    )"
                    :key="index"
                  >
                    {{ item }} ,
                  </span>
                </span>
                {{ tempCheckDothe.invoice_store }} -
                {{ tempCheckDothe.invoice_store_type }}</b-td
              >
            </b-tr>

            <b-tr>
              <b-td>Số tiền : </b-td>
              <b-td colspan="5" style="border-bottom: 1px dotted black">
                <span
                  style="color: #dc3545; font-weight: bold; font-size: 24px"
                >
                  {{ $formatN(tempCheckDothe.invoice_money) }} ({{
                    docsotien(tempCheckDothe.invoice_money)
                  }})
                </span>
              </b-td>
            </b-tr>
            <b-tr>
              <b-td colspan="4"></b-td>
              <b-td>Ngày thế</b-td>
              <b-td style="border-bottom: 1px dotted black">
                <span
                  style="color: #dc3545; font-weight: bold; font-size: 24px"
                >
                  {{
                    $moment(tempCheckDothe.invoice_date_create).format(
                      "DD/MM/YYYY"
                    )
                  }}
                </span>
              </b-td>
            </b-tr>
            <b-tr>
              <b-td>Thông tin</b-td>
              <b-td colspan="5">
                <p class="default_thongtin" style="text-align: left">
                  Số ngày cầm :
                  <span class="text-danger">
                    {{
                      $moment().diff(
                        $moment(tempCheckDothe.invoice_date_create),
                        "days"
                      )
                    }}
                    ngày
                  </span>
                  <br />
                  Số tiền lãi :<span
                    style="color: yellow; font-size: 50px; font-weight: 800"
                  >
                    {{ $formatN(getTienLai(tempCheckDothe)) }}
                  </span>
                  <span class="text-danger">
                    ({{ docsotien(getTienLai(tempCheckDothe)) }})
                  </span>
                  <br />
                  Số tiền tổng :
                  <span class="text-danger">
                    {{
                      $formatN(
                        tempCheckDothe.invoice_money +
                          getTienLai(tempCheckDothe)
                      )
                    }}
                    (
                    {{
                      docsotien(
                        tempCheckDothe.invoice_money +
                          getTienLai(tempCheckDothe)
                      )
                    }})
                    <br />
                  </span>
                  <span style="font-style: italic">
                    Ghi chú : {{ tempCheckDothe.invoice_comment }}</span
                  >
                  <span style="font-style: italic">
                    SDT : {{ tempCheckDothe.invoice_phone }}</span
                  >
                </p>
              </b-td>
            </b-tr>
            <b-tr>
              <b-td colspan="6">
                <b-button variant="success" @click="check_invoice()">
                  Chuộc Đồ</b-button
                >
              </b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
      </b-overlay>
    </b-modal>
    <b-modal
      id="modal_sanpham"
      size="lg"
      hide-footer
      @hidden="closeModalSanPham"
      title="Thông tin sản phẩm"
    >
      <b-overlay :show="overlaySanPham">
        <b-row v-if="itemFromScanner">
          <b-col cols="6">
            <b-img
              lazy
              v-zoom-on-hover
              :src="itemFromScanner.product_image_url"
              center
              fluid
            />
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
                      <b-button variant="primary" @click="taohoadon"
                        >Tạo hóa đơn</b-button
                      >
                      <b-button
                        :disabled="!itemFromScanner.product_status"
                        variant="primary"
                        @click="thanhtoan"
                        >Thanh toán</b-button
                      >
                      <b-button
                        variant="success"
                        @click="themgiohang"
                        :disabled="
                          !itemFromScanner.product_status &&
                          !listGioHang.find(
                            (item) => item.id == itemFromScanner.id
                          )
                        "
                        >Thêm giỏ hàng</b-button
                      >
                      <b-button
                        :disabled="!itemFromScanner.product_status"
                        variant="danger"
                        @click="xoaSanPhamGioHang"
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
    <b-modal id="modalImage" hide-footer hide-header>
      <b-img lazy :src="imgUrl" style="width: 100%; height: 500px"> </b-img>
    </b-modal>
    <b-modal
      scrollable
      :title="raw_hoadon ? 'Hóa đơn #' + raw_hoadon.bill_code : ''"
      size="lg"
      id="modalHoaDon"
      hide-footer
    >
      <b-row v-if="raw_hoadon">
        <b-col cols="12">
          <b-table-simple fixed bordered small outlined responsive>
            <b-tbody>
              <b-tr>
                <b-td><b>Tên khách</b></b-td>

                <b-td>
                  <span class="text-primary">{{
                    raw_hoadon.customer_name
                  }}</span>
                </b-td>

                <b-td><b>Tổng tiền hóa đơn :</b></b-td>
                <b-td>
                  <b>
                    <span class="text-danger">{{
                      $formatSoTien(raw_hoadon.bill_totalmoney)
                    }}</span></b
                  >
                </b-td>
              </b-tr>
              <b-tr>
                <b-td><b>Thực nhận :</b></b-td>
                <b-td>
                  <b>
                    <span class="text-danger">{{
                      $formatSoTien(raw_hoadon.bill_realmoney_get)
                    }}</span></b
                  >
                </b-td>

                <b-td><b>Số món :</b></b-td>
                <b-td>{{ raw_hoadon.bill_listsanpham.length }}</b-td>
              </b-tr>
              <b-tr>
                <b-td colspan="4">
                  {{ raw_hoadon.billDetail }}
                </b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-col>
        <b-col cols="12">
          <table
            class="table table-sm table-bordered table-hover"
            style="width: 100%"
          >
            <thead>
              <tr>
                <th>#</th>
                <th>Loại</th>
                <th>GiáV</th>
                <th>TL.Vàng</th>
                <th>Kiểu</th>
                <th>Công</th>
                <th>Giá</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in raw_hoadon.bill_listsanpham"
                :key="index"
              >
                <td>
                  <b>{{ index + 1 }}</b>
                </td>
                <td>
                  <b
                    @click="showInfoSanPham(item)"
                    class="myHoverProductBarcode"
                  >
                    {{
                      $store.state.config.sanpham_optionCatalog.find(
                        (i) => i.value === item.product_catalog
                      ).text
                    }}</b
                  >
                </td>

                <td>
                  <b class="text-danger">{{ item.price.sellingPrice }}</b>
                </td>

                <td>
                  <b class="text-danger">{{
                    $formatSoVang(item.product_gold_weight).fullStr
                  }}</b>
                </td>

                <td>
                  <b>{{ item.product_type }}</b>
                </td>

                <td>
                  <b>{{ item.product_wage }}</b>
                </td>

                <td>
                  <b class="text-danger">{{
                    $formatSoTien(item.giahientai)
                  }}</b>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="5" class="text-center"><b>Tổng</b></td>

                <td>
                  <b class="text-primary text-right">
                    {{
                      $formatSoTien(
                        raw_hoadon.bill_listsanpham.reduce(
                          (sum, item) => sum + (item.product_wage || 0),
                          0
                        )
                      )
                    }}</b
                  >
                </td>
                <td>
                  <b class="text-primary text-right">
                    {{
                      $formatSoTien(
                        raw_hoadon.bill_listsanpham.reduce(
                          (sum, item) => sum + (item.giahientai || 0),
                          0
                        )
                      )
                    }}</b
                  >
                </td>
              </tr>
            </tfoot>
          </table>
        </b-col>

        <b-col cols="12">
          <b-row>
            <b-col
              cols="6"
              v-for="(item, index) in raw_hoadon.bill_listsanpham"
              :key="index"
            >
              <b-card
                :title="
                  '#' +
                  (index + 1) +
                  '_' +
                  $store.state.config.sanpham_optionCatalog.find(
                    (i) => i.value === item.product_catalog
                  ).text +
                  '-' +
                  item.product_barcode
                "
                :img-src="item.product_image_url"
                :img-alt="item.product_barcode"
                img-top
                class="mb-2"
              >
                <b-card-text>
                  <b-row>
                    <b-col cols="6">
                      <table class="table table-sm">
                        <tr>
                          <td>TL.Tổng</td>
                          <td>
                            <b class="text-danger">{{
                              $formatSoVang(item.product_total_weight).fullStr
                            }}</b>
                          </td>
                        </tr>
                        <tr>
                          <td>TL.Hột</td>
                          <td>
                            <b class="text-danger">{{
                              $formatSoVang(item.product_stone_weight).fullStr
                            }}</b>
                          </td>
                        </tr>
                        <tr>
                          <td>TL.Vang2</td>
                          <td>
                            <b class="text-danger">{{
                              $formatSoVang(item.product_gold_weight).fullStr
                            }}</b>
                          </td>
                        </tr>
                      </table>
                    </b-col>
                    <b-col cols="6">
                      <table class="table table-sm">
                        <tr>
                          <td>Loại vàng</td>
                          <td>
                            <b>{{ item.product_type }}</b>
                          </td>
                        </tr>
                        <tr>
                          <td>Giá vàng</td>
                          <td>
                            <b>{{ item.price.sellingPrice }}</b>
                          </td>
                        </tr>
                        <tr>
                          <td>Tiền công</td>
                          <td>
                            <b>{{ item.product_wage }}</b>
                          </td>
                        </tr>
                      </table>
                    </b-col>
                    <b-col cols="12">
                      <div class="text-center text-primary">
                        Tính :
                        {{
                          `${$formatSoVang(item.product_gold_weight).fullStr}x${
                            item.price.sellingPrice
                          }+${item.product_wage}=${$formatSoTien(
                            item.giahientai
                          )}`
                        }}
                      </div>
                    </b-col>
                  </b-row>
                </b-card-text>
              </b-card>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-modal>

    <b-modal
      size="lg"
      hide-footer
      id="default_modal_SanPham"
      title="Tạo nhanh sản phẩm"
    >
      <b-form>
        <b-form-row>
          <b-col cols="12">
            <b-row>
              <b-col cols="4">
                <b-overlay :show="default_overlaySanPham">
                  <b-form-group label="Kiểu SP">
                    <b-form-select
                      v-model="product_catalog"
                      :options="this.$store.state.config.sanpham_optionCatalog"
                    ></b-form-select>
                  </b-form-group>
                </b-overlay>
              </b-col>
              <b-col cols="4">
                <b-overlay :show="default_overlayproductimportprice">
                  <b-form-group label="Loại vàng">
                    <b-form-select
                      v-model="product_type"
                      :options="this.$store.state.config.sanpham_optionLoaiVang"
                    ></b-form-select>
                  </b-form-group>
                </b-overlay>
              </b-col>
              <b-col cols="4">
                <b-form-group
                  label="Nguồn SP"
                  :description="product_import_type ? 'Chành' : 'Nội bộ '"
                >
                  <b-form-checkbox
                    switch
                    size="lg"
                    v-model="product_import_type"
                  >
                  </b-form-checkbox>
                </b-form-group>
              </b-col>
            </b-row>
          </b-col>
          <b-col cols="12">
            <b-row>
              <b-col cols="4">
                <b-form-group label="Trọng Lượng Tổng">
                  <b-form-input
                    autocomplete="off"
                    v-model="product_total_weight"
                    required
                  ></b-form-input>
                </b-form-group>
                <b-form-group label="Tiền công">
                  <b-form-input
                    autocomplete="off"
                    v-model="product_wage"
                    required
                  ></b-form-input>
                </b-form-group>
              </b-col>

              <b-col cols="4">
                <b-form-group label="Trọng lượng hột">
                  <b-form-input
                    id="input-1"
                    autocomplete="off"
                    v-model="product_stone_weight"
                    required
                  ></b-form-input>
                </b-form-group>
                <b-form-group label="Mã sản phẩm">
                  <b-form-input
                    disabled
                    class="text-danger"
                    v-model="product_barcode"
                    required
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col cols="4">
                <b-form-group label="Trọng lượng Vàng">
                  <b-form-input
                    disabled
                    v-model="product_gold_weight"
                    required
                  ></b-form-input>
                </b-form-group>
                <b-form-group>
                  <b-button
                    class="mt-2"
                    @click="default_insertSanPham('taomoithemvaogio')"
                    variant="primary"
                    block
                    >Tạo mới,thêm vào giỏ</b-button
                  >
                  <b-button
                    class="mt-2"
                    @click="default_insertSanPham('taomoiintem')"
                    variant="success"
                    block
                    >Tạo mới,In Tem</b-button
                  >
                </b-form-group>
              </b-col>
            </b-row>
            <b-row no-gutters>
              <b-col cols="6">
                <b-table-simple small hover bordered responsive fixed>
                  <b-tbody>
                    <b-tr>
                      <b-td>
                        <span class="title">Trọng Lượng Tổng</span>
                      </b-td>
                      <b-td>
                        <div class="value text-warning">
                          {{ $formatSoVang(product_total_weight).fullStr }}
                        </div>
                      </b-td>
                    </b-tr>
                    <b-tr>
                      <b-td>
                        <span class="title">Trọng Lượng Vàng</span>
                      </b-td>
                      <b-td>
                        <div class="value text-warning">
                          {{ $formatSoVang(product_gold_weight).fullStr }}
                        </div>
                      </b-td>
                    </b-tr>
                    <b-tr>
                      <b-td>
                        <span class="title">Trọng Lượng hột</span>
                      </b-td>
                      <b-td>
                        <div class="value">
                          {{ $formatSoVang(product_stone_weight).fullStr }}
                        </div>
                      </b-td>
                    </b-tr>
                    <b-tr>
                      <b-td>
                        <span class="title">Tiền công nhập</span>
                      </b-td>
                      <b-td>
                        <div class="value">
                          {{ product_wage_in }}
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
                          {{ product_wage }}
                          <span class="blink">👈</span>
                        </div>
                      </b-td>
                    </b-tr>

                    <b-tr>
                      <b-td>
                        <span class="title">Chành Nhập</span>
                      </b-td>
                      <b-td>
                        <div class="value">
                          <b-badge variant="warning" v-if="product_import_type"
                            >Chành SG</b-badge
                          >
                          <b-badge variant="primary" v-else
                            >Hàng Nội Bộ</b-badge
                          >
                        </div>
                      </b-td>
                    </b-tr>
                    <b-tr>
                      <b-td>
                        <span class="title">Giá Vàng Nhập</span>
                      </b-td>
                      <b-td>
                        <div class="value">
                          {{ product_price_import }}
                        </div>
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
                        <div class="value text-success bd-highlight">
                          {{ product_barcode }}
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
                            {{ $moment().format("DD/MM/YYYY") }}</span
                          >
                        </div>
                      </b-td>
                    </b-tr>

                    <b-tr>
                      <b-td>
                        <span class="title">Kiểu dáng sản phẩm</span>
                      </b-td>
                      <b-td>
                        <div class="value">
                          <b-badge variant="success">
                            {{ product_catalog }}</b-badge
                          >
                        </div>
                      </b-td>
                    </b-tr>
                    <b-tr>
                      <b-td>
                        <span class="title">Loại Vàng</span>
                      </b-td>
                      <b-td>
                        <div class="value text-danger">
                          {{ product_type }}
                        </div>
                      </b-td>
                    </b-tr>
                    <b-tr>
                      <b-td>
                        <span class="title">Giá nhập </span>
                      </b-td>
                      <b-td>
                        <div class="value">
                          {{ $formatN(giatrinhap) }}
                        </div>
                      </b-td>
                    </b-tr>
                    <b-tr>
                      <b-td>
                        <span class="title">Giá hiện tại</span>
                      </b-td>
                      <b-td>
                        <div class="value text-warning">
                          {{ $formatN(giahientai) }}
                        </div>
                      </b-td>
                    </b-tr>
                    <b-tr>
                      <b-td>
                        <span class="title">Lệch</span>
                      </b-td>
                      <b-td>
                        <div class="value">
                          {{ $formatN(giahientai - giatrinhap) }}
                        </div>
                      </b-td>
                    </b-tr>
                  </b-tbody>
                </b-table-simple>
              </b-col>
            </b-row>
          </b-col>
        </b-form-row>
      </b-form>
    </b-modal>
    <b-sidebar
      ref="sidebargiohang"
      width="900px"
      id="sidebargiohang"
      :title="'Giỏ hàng : ' + $moment().format('DD/MM/YYYY')"
      shadow
      @shown="getGioHang()"
      @hidden="showTinhToan = false"
    >
      <b-overlay :show="overlayGioHang">
        <div class="px-3 py-2">
          <b-table
            bordered
            no-border-collapse
            class="default_tablegiohang"
            hover
            ref="default_tablegiohang"
            style=""
            :fields="fieldsGioHang"
            :items="listGioHang"
            show-empty
            small
            select-mode="multi"
            selectable
            selected-variant="success"
            responsive
            @row-selected="onRowSelectedGioHang"
          >
            <template #cell(stt)="data">
              {{ data.index + 1 }}
            </template>
            <template #cell(price)="data">
              {{ data.item.price.sellingPrice }}
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

            <template #cell(product_barcode)="data">
              <b
                class="myHoverProductBarcode"
                @click="showInfoSanPham(data.item)"
              >
                {{ data.item.product_barcode }}
                <span>
                  <b-badge variant="primary">{{ data.item.hoadon_id }}</b-badge>
                </span>
              </b>
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
                lazy
                @click="showImage(data.item.product_image_url)"
                :src="data.item.product_image_url"
                style="width: 25px; height: 25px"
              />
            </template>
          </b-table>
        </div>
      </b-overlay>

      <template #footer>
        <div class="d-flextext-light bg-warning align-items-center px-3 py-2">
          <b-row>
            <b-col cols="4" class="text-left">
              <strong class="mr-auto text-danger text-right"
                >Sản phẩm đang chọn : {{ selectGioHang.length }}</strong
              >
            </b-col>
            <b-col cols="8" class="text-right">
              <b-button variant="success" v-b-modal.default_modal_SanPham
                >Tạo nhanh sản phẩm</b-button
              >
              <strong
                v-if="listGioHang.length > 0"
                class="mr-auto text-danger text-right"
                >Tổng giá trị trong giỏ :
                {{ $formatSoTien(getTongGiaTriGioHang()) }}</strong
              >
              <strong v-else>Giỏ hàng trống</strong>
            </b-col>
          </b-row>
        </div>
      </template>
    </b-sidebar>
    <b-sidebar
      width="500px"
      id="sidebar-right"
      v-model="showTinhToan"
      :title="selectGioHang.length + ' sản phẩm'"
      right
      shadow
    >
      <b-row v-if="selectGioHang.length > 0">
        <b-col cols="12" class="mx-2">
          <b-form>
            <b-row>
              <b-col cols="6">
                <b-form-group
                  :description="
                    $formatSoTien(bill.bill_realmoney_get) != ''
                      ? $formatSoTien(bill.bill_realmoney_get)
                      : '.'
                  "
                  label="Tiền thực nhận:"
                >
                  <b-form-input
                    autocomplete="off"
                    v-model="bill.bill_realmoney_get"
                    type="text"
                  ></b-form-input>
                </b-form-group>
                <b-form-group label="Ghi chú hóa đơn" description=".">
                  <b-form-input
                    autocomplete="off"
                    v-model="bill.bill_comment"
                    type="text"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col cols="6">
                <b-form-group label="Mã bill:" description=".">
                  <b-form-input
                    autocomplete="off"
                    v-model="bill.bill_code"
                    type="text"
                    disabled
                  ></b-form-input>
                </b-form-group>
                <b-form-group label="Tên khách:" description=".">
                  <b-form-input
                    autocomplete="off"
                    v-model="bill.customer_name"
                    type="text"
                  ></b-form-input>
                </b-form-group>
              </b-col>

              <b-col cols="12">
                <b-form-group label="Chi tiết hóa đơn:">
                  <b-form-textarea
                    autocomplete="off"
                    v-model="bill.bill_detail"
                    rows="5"
                  >
                  </b-form-textarea>
                </b-form-group>
              </b-col>
            </b-row>
          </b-form>
        </b-col>
        <b-col cols="12" class="mx-2">
          <table class="table table-sm table-bordered" style="width: 100%">
            <thead>
              <tr>
                <th>#</th>
                <th>Loại</th>
                <th>GiáV</th>
                <th>TL.Vàng</th>
                <th>Kiểu</th>
                <th>Công</th>
                <th>Giá</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in selectGioHang" :key="index">
                <td>
                  <b>{{ index + 1 }}</b>
                </td>
                <td>
                  <b
                    @click="showInfoSanPham(item)"
                    class="myHoverProductBarcode"
                  >
                    {{
                      $store.state.config.sanpham_optionCatalog.find(
                        (i) => i.value === item.product_catalog
                      ).text
                    }}</b
                  >
                </td>

                <td>
                  <b class="text-danger">{{ item.price.sellingPrice }}</b>
                </td>

                <td>
                  <b class="text-danger">{{
                    $formatSoVang(item.product_gold_weight).fullStr
                  }}</b>
                </td>

                <td>
                  <b>{{ item.product_type }}</b>
                </td>

                <td>
                  <b>{{ item.product_wage }}</b>
                </td>

                <td>
                  <b class="text-danger">{{
                    $formatSoTien(item.giahientai)
                  }}</b>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="5" class="text-center"><b>Tổng</b></td>

                <td>
                  <b class="text-primary text-right">
                    {{
                      $formatSoTien(
                        selectGioHang.reduce(
                          (sum, item) => sum + (item.product_wage || 0),
                          0
                        )
                      )
                    }}</b
                  >
                </td>
                <td>
                  <b class="text-primary text-right">
                    {{
                      $formatSoTien(
                        selectGioHang.reduce(
                          (sum, item) => sum + (item.giahientai || 0),
                          0
                        )
                      )
                    }}</b
                  >
                </td>
              </tr>
            </tfoot>
          </table>
        </b-col>
        <b-col cols="12" v-for="(item, index) in selectGioHang" :key="index">
          <b-card
            :title="
              '#' +
              (index + 1) +
              '_' +
              $store.state.config.sanpham_optionCatalog.find(
                (i) => i.value === item.product_catalog
              ).text +
              '-' +
              item.product_barcode
            "
            :img-src="item.product_image_url"
            :img-alt="item.product_barcode"
            img-top
            class="mb-2"
          >
            <b-card-text>
              <b-row>
                <b-col cols="6">
                  <table class="table table-sm">
                    <tr>
                      <td>Trọng lượng Tổng</td>
                      <td>
                        <b class="text-danger">{{
                          $formatSoVang(item.product_total_weight).fullStr
                        }}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>Trọng lượng hột</td>
                      <td>
                        <b class="text-danger">{{
                          $formatSoVang(item.product_stone_weight).fullStr
                        }}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>Trọng lượng đá</td>
                      <td>
                        <b class="text-danger">{{
                          $formatSoVang(item.product_gold_weight).fullStr
                        }}</b>
                      </td>
                    </tr>
                  </table>
                </b-col>
                <b-col cols="6">
                  <table class="table table-sm">
                    <tr>
                      <td>Loại vàng</td>
                      <td>
                        <b>{{ item.product_type }}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>Giá vàng</td>
                      <td>
                        <b>{{ item.price.sellingPrice }}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>Tiền công</td>
                      <td>
                        <b>{{ item.product_wage }}</b>
                      </td>
                    </tr>
                  </table>
                </b-col>
                <b-col cols="12">
                  <div class="text-center text-primary">
                    Tính :
                    {{
                      `${$formatSoVang(item.product_gold_weight).fullStr}x${
                        item.price.sellingPrice
                      }+${item.product_wage}=${$formatSoTien(item.giahientai)}`
                    }}
                  </div>
                </b-col>
              </b-row>
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
      <template #footer>
        <div
          class="d-flextext-light bg-warning align-items-center px-3 py-2 text-left"
        >
          <b-button variant="danger" @click="inhoadon()">In Giấy</b-button>
          Giá :
          <strong class="mr-auto text-danger">
            {{
              $formatSoTien(
                selectGioHang.reduce(
                  (sum, item) => sum + (item.giahientai || 0),
                  0
                )
              )
            }}</strong
          >
          Công :
          <strong class="mr-auto text-danger">
            {{
              $formatSoTien(
                selectGioHang.reduce(
                  (sum, item) => sum + (item.product_wage || 0),
                  0
                )
              )
            }}</strong
          >
        </div>
      </template>
    </b-sidebar>
    <b-navbar toggleable="md" type="dark" variant="primary">
      <b-navbar-brand href="/">BPJ</b-navbar-brand>

      <b-navbar-toggle target="navbar-toggle-collapse"> </b-navbar-toggle>

      <b-collapse id="navbar-toggle-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item-dropdown text="Cầm Đồ">
            <b-dropdown-group id="dropdown-group-1">
              <b-dropdown-item href="/camdo/">
                Danh sách hóa đơn
              </b-dropdown-item>
              <b-dropdown-item href="/camdo/them"
                >Thêm hóa đơn thế</b-dropdown-item
              >

              <b-dropdown-item href="/camdo/intem"
                >In tem bọc cầm đồ</b-dropdown-item
              >
              <b-dropdown-item href="/camdo/chuocdo"
                >Đánh dấu chuộc</b-dropdown-item
              >
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
              <b-dropdown-item href="/sanpham/them"
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
              <b-dropdown-item href="/hoadon/giohang"
                >Giỏ hàng
              </b-dropdown-item>
              <b-dropdown-item href="/hoadon/">Hóa đơn</b-dropdown-item>
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
              <b-dropdown-item href="/thongke/ngay">Theo ngày</b-dropdown-item>
              <b-dropdown-item-button>Sản phẩm</b-dropdown-item-button>
              <b-dropdown-item href="/thongke/camdo">Cầm đồ</b-dropdown-item>
            </b-dropdown-group>
          </b-nav-item-dropdown>
        </b-navbar-nav>
        <b-navbar-nav>
          <b-nav-item href="/chat/">Chat</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav>
          <b-nav-item v-b-toggle.sidebargiohang>Giỏ hàng</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <nuxt />
  </div>
</template>

<script>
var DocTienBangChu = function () {
  this.ChuSo = new Array(
    " không ",
    " một ",
    " hai ",
    " ba ",
    " bốn ",
    " năm ",
    " sáu ",
    " bảy ",
    " tám ",
    " chín "
  );
  this.Tien = new Array(
    "",
    " nghìn",
    " triệu",
    " tỷ",
    " nghìn tỷ",
    " triệu tỷ"
  );
};

DocTienBangChu.prototype.docSo3ChuSo = function (baso) {
  var tram;
  var chuc;
  var donvi;
  var KetQua = "";
  tram = parseInt(baso / 100);
  chuc = parseInt((baso % 100) / 10);
  donvi = baso % 10;
  if (tram == 0 && chuc == 0 && donvi == 0) return "";
  if (tram != 0) {
    KetQua += this.ChuSo[tram] + " trăm ";
    if (chuc == 0 && donvi != 0) KetQua += " linh ";
  }
  if (chuc != 0 && chuc != 1) {
    KetQua += this.ChuSo[chuc] + " mươi";
    if (chuc == 0 && donvi != 0) KetQua = KetQua + " linh ";
  }
  if (chuc == 1) KetQua += " mười ";
  switch (donvi) {
    case 1:
      if (chuc != 0 && chuc != 1) {
        KetQua += " mốt ";
      } else {
        KetQua += this.ChuSo[donvi];
      }
      break;
    case 5:
      if (chuc == 0) {
        KetQua += this.ChuSo[donvi];
      } else {
        KetQua += " lăm ";
      }
      break;
    default:
      if (donvi != 0) {
        KetQua += this.ChuSo[donvi];
      }
      break;
  }
  return KetQua;
};

DocTienBangChu.prototype.doc = function (SoTien) {
  var lan = 0;
  var i = 0;
  var so = 0;
  var KetQua = "";
  var tmp = "";
  var soAm = false;
  var ViTri = new Array();
  if (SoTien < 0) soAm = true; //return "Số tiền âm !";
  if (SoTien == 0) return "Không đồng"; //"Không đồng !";
  if (SoTien > 0) {
    so = SoTien;
  } else {
    so = -SoTien;
  }
  if (SoTien > 8999999999999999) {
    //SoTien = 0;
    return ""; //"Số quá lớn!";
  }
  ViTri[5] = Math.floor(so / 1000000000000000);
  if (isNaN(ViTri[5])) ViTri[5] = "0";
  so = so - parseFloat(ViTri[5].toString()) * 1000000000000000;
  ViTri[4] = Math.floor(so / 1000000000000);
  if (isNaN(ViTri[4])) ViTri[4] = "0";
  so = so - parseFloat(ViTri[4].toString()) * 1000000000000;
  ViTri[3] = Math.floor(so / 1000000000);
  if (isNaN(ViTri[3])) ViTri[3] = "0";
  so = so - parseFloat(ViTri[3].toString()) * 1000000000;
  ViTri[2] = parseInt(so / 1000000);
  if (isNaN(ViTri[2])) ViTri[2] = "0";
  ViTri[1] = parseInt((so % 1000000) / 1000);
  if (isNaN(ViTri[1])) ViTri[1] = "0";
  ViTri[0] = parseInt(so % 1000);
  if (isNaN(ViTri[0])) ViTri[0] = "0";
  if (ViTri[5] > 0) {
    lan = 5;
  } else if (ViTri[4] > 0) {
    lan = 4;
  } else if (ViTri[3] > 0) {
    lan = 3;
  } else if (ViTri[2] > 0) {
    lan = 2;
  } else if (ViTri[1] > 0) {
    lan = 1;
  } else {
    lan = 0;
  }
  for (i = lan; i >= 0; i--) {
    tmp = this.docSo3ChuSo(ViTri[i]);
    KetQua += tmp;
    if (ViTri[i] > 0) KetQua += this.Tien[i];
    if (i > 0 && tmp.length > 0) KetQua += ""; //',';//&& (!string.IsNullOrEmpty(tmp))
  }
  if (KetQua.substring(KetQua.length - 1) == ",") {
    KetQua = KetQua.substring(0, KetQua.length - 1);
  }
  KetQua = KetQua.substring(1, 2).toUpperCase() + KetQua.substring(2);
  if (soAm) {
    return "Âm " + KetQua + " đồng"; //.substring(0, 1);//.toUpperCase();// + KetQua.substring(1);
  } else {
    return KetQua + " đồng"; //.substring(0, 1);//.toUpperCase();// + KetQua.substring(1);
  }
};

export default {
  data() {
    return {
      default_overlaySanPham: false,
      formDefault_sanpham_gia: null,

      bill: {
        bill_totalmoney: 0,
        bill_realmoney_get: 0,
        customer_name: "không",
        bill_detail: "không",
        bill_comment: "không",
        bill_print: false,
        giohang_id: null,
        bill_code: null,
      },

      product_barcode: null,
      product_total_weight: null,
      product_stone_weight: null,
      product_gold_weight: null,
      product_catalog: null,
      product_import_type: true,
      product_type: null,
      giahientai: 0,
      giatrinhap: 0,
      product_wage: null,
      product_wage_in: null,
      product_price_import: null,

      imgUrl: null,
      isImageShow: false,
      overlayCamDo: false,
      profitPercent: 2,
      itemEdit: null,
      overlayGioHang: false,
      fieldsGioHang: [
        { key: "stt", label: "#" },
        { key: "product_image_url", label: "Ảnh" },
        { key: "product_barcode", label: "Mã" },
        { key: "product_type", label: "Loại" },

        { key: "price", label: "GiáV" },
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
      tempCheckDothe: null,
      selectGioHang: [],
      showTinhToan: false,
      rawGioHang: null,
      raw_hoadon: null,
      default_overlayproductimportprice: false,
    };
  },
  watch: {
    selectGioHang(newVal, oldVal) {
      this.getBarcode();
      if (newVal.length >= 1) {
        this.showTinhToan = true;
      } else {
        this.showTinhToan = false;
      }
    },
    product_total_weight: {
      handler(val) {
        let result =
          parseFloat(val || 0) - parseFloat(this.product_stone_weight || 0);
        this.product_gold_weight = result;
        this.getGiaHienTai();
        this.getGiaNhap();
      },
    },
    product_stone_weight: {
      handler(val) {
        let result =
          parseFloat(this.product_total_weight || 0) - parseFloat(val || 0);
        this.product_gold_weight = result;
        this.getGiaHienTai();
        this.getGiaNhap();
      },
    },
    product_wage: {
      handler(val) {
        this.product_wage_in = this.product_import_type
          ? parseFloat(this.product_wage) / 2
          : 0;
        this.getGiaHienTai();
        this.getGiaNhap();
      },
    },
    product_import_type: {
      handler(val) {
        this.product_wage_in = this.product_import_type
          ? parseFloat(this.product_wage) / 2
          : 0;
        let product_type = this.product_type;

        if (product_type) {
          this.default_overlayproductimportprice = true;
          this.$supabase
            .from("banggia")
            .select()
            .eq("code", String(product_type))
            .then((data) => {
              let price = data.data[0];
              let result = this.product_import_type
                ? parseFloat(price.sellingPrice) - 30
                : parseFloat(price.sellingPrice) - 100;
              this.product_price_import = result;
              this.formDefault_sanpham_gia = price;
              this.default_overlayproductimportprice = false;
              this.getGiaHienTai();
              this.getGiaNhap();
            });
        }
      },
    },
    product_catalog: {
      handler(val) {
        this.default_overlaySanPham = true;
        this.$supabase
          .from("product")
          .select()
          .limit(1)
          .order("id", { ascending: false })
          .then((data) => {
            let lastId = data.data[0].id + 1;
            let barcode = `${String(val).toLowerCase()}${lastId}`;

            this.default_overlaySanPham = false;
            this.product_barcode = barcode;
            this.getGiaHienTai();
            this.getGiaNhap();
          });
      },
    },
    product_type: {
      handler(val) {
        this.default_overlayproductimportprice = true;
        this.$supabase
          .from("banggia")
          .select()
          .eq("code", String(val))
          .then((data) => {
            let price = data.data[0];
            let result = this.product_import_type
              ? parseFloat(price.sellingPrice) - 30
              : parseFloat(price.sellingPrice) - 100;
            this.product_price_import = result;

            this.formDefault_sanpham_gia = price;
            this.default_overlayproductimportprice = false;
            this.getGiaHienTai();
            this.getGiaNhap();
          });
      },
    },
  },
  components: {},
  computed: {},
  methods: {
    getBarcode() {
      this.$getBill_code().then((data) => {
        // console.log(data);
        this.bill.bill_code = data;
      });
    },

    inhoadon() {
      //tạo hóa đơn
      //gửi link ve client in
      //client
      let billObject = {
        bill_totalmoney: this.selectGioHang.reduce(
          (sum, item) => sum + (item.giahientai || 0),
          0
        ),
        bill_listsanpham: this.selectGioHang,
        bill_realmoney_get: parseFloat(this.bill.bill_realmoney_get),
        customer_name: this.bill.customer_name,
        billDetail: this.bill.bill_detail,
        bill_code: this.bill.bill_code,
        bill_comment: this.bill.bill_comment,
        bill_print: false,
        giohang_id: this.rawGioHang.id,
      };
      this.$insertBill(billObject).then((data) => {
        let hoadon = data;
        //hide sidebar,clear select
        this.$refs.default_tablegiohang.clearSelected();
        this.selectGioHang = [];

        this.$root.$emit("bv::toggle::collapse", "sidebargiohang");
        this.showTinhToan = false;

        this.$bvToast.toast(
          `Tạo hóa đơn ${hoadon.bill_code} ${
            this.selectGioHang.length
          } sản phẩm. Tổng tiền hàng ${this.$formatSoTien(
            billObject.bill_totalmoney
          )}. Tổng thực nhận ${this.$formatSoTien(
            billObject.bill_realmoney_get
          )}`,
          {
            title: "Thông báo",
            autoHideDelay: 3000,
            appendToast: true,
            variant: "primary",
          }
        );
        this.$pnPublish(
          {
            channel: "printserver",
            message: { type: "inhoadon", list: hoadon },
          },
          (status, response) => {
            if (status.error) {
              console.log(status);
            } else {
            }
          }
        );
      });
    },
    getGiaHienTai() {
      let product_price_import = parseFloat(this.product_price_import);
      let product_total_weight = parseFloat(this.product_total_weight);
      let product_stone_weight = parseFloat(this.product_stone_weight);
      let product_gold_weight = parseFloat(this.product_gold_weight);
      let product_wage = parseFloat(this.product_wage);
      let product_wage_in = parseFloat(this.product_wage_in);

      if (
        product_gold_weight &&
        product_total_weight &&
        product_stone_weight &&
        product_price_import &&
        product_wage &&
        product_wage_in &&
        this.formDefault_sanpham_gia
      ) {
        let result =
          product_gold_weight *
            parseFloat(this.formDefault_sanpham_gia.sellingPrice) +
          product_wage_in * 100;
        this.giahientai = result;
      }
    },
    getGiaNhap() {
      // phải dủ các biến mới tính
      let product_price_import = parseFloat(this.product_price_import);
      let product_total_weight = parseFloat(this.product_total_weight);
      let product_stone_weight = parseFloat(this.product_stone_weight);
      let product_gold_weight = parseFloat(this.product_gold_weight);
      let product_wage = parseFloat(this.product_wage);
      let product_wage_in = parseFloat(this.product_wage_in);

      if (
        product_gold_weight &&
        product_total_weight &&
        product_stone_weight &&
        product_price_import &&
        product_wage &&
        product_wage_in &&
        this.formDefault_sanpham_gia
      ) {
        let result =
          product_gold_weight * product_price_import + product_wage_in * 100;
        this.giatrinhap = result;
      }
    },

    default_insertSanPham(action) {
      if (action == "taomoiintem") {
        //console.log('taomoiintem')
      } else if (action === "taomoithemvaogio") {
        //console.log('taomoithemvaogio')
      }
    },
    onRowSelectedGioHang(items) {
      this.selectGioHang = items;
    },
    taohoadon() {},
    showImage(url) {
      this.imgUrl = url;
      this.$bvModal.show("modalImage");
    },
    chuocSanPham() {
      console.log("chuoc");
    },
    check_invoice() {
      this.itemEdit = this.tempCheckDothe;
      this.overlayCamDo = true;
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
          console.log("aaaaa");
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
                  `Chuộc đồ thế ${this.itemEdit.invoice_number} thành công`,
                  {
                    title: "Thông báo",
                    autoHideDelay: 1000,
                    appendToast: true,
                    variant: "primary",
                  }
                );
                this.overlayCamDo = false;
                this.$refs.modal_camdo.hide();
                this.itemEdit = null;
              });
          } else {
            alert("Ngày thanh lí không được bỏ trống");
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },
    check_invoice_auto() {
      this.itemEdit = this.tempCheckDothe;

      let ngaythanhli = this.$moment().format("YYYY/MM/DD");

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
            `Chuộc đồ thế ${this.itemEdit.invoice_number} thành công`,
            {
              title: "Thông báo",
              autoHideDelay: 1000,
              appendToast: true,
              variant: "primary",
            }
          );
        });
    },
    getCountDate(dateStart, dateEnd) {
      let _dateStart = this.$moment(dateStart);
      let _dateEnd = this.$moment(dateEnd);
      let count = _dateEnd.diff(_dateStart, "days");
      return count + 1;
      // =1
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
    checkRegexDate(str) {
      const regex =
        /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/(20[2-4][3-9]|2050)$/;
      return regex.test(str);
    },
    closeModalSanPham() {
      zoomLens.style.visibility = "hidden";
    },
    getTienLai(x) {
      let tienlai =
        ((x.invoice_money / 1000) *
          this.$moment().diff(this.$moment(x.invoice_date_create), "days") *
          2) /
        3;

      return this.$roundToThousand(tienlai, x.invoice_money);
    },
    xoaSanPhamGioHang(item) {
      this.overlayGioHang = true;
      this.listGioHang = this.listGioHang.filter((x) => x !== item);

      this.$supabase
        .from("giohang")
        .update({ listsanpham: this.listGioHang })
        .eq("created_at", this.$moment().format("YYYY-MM-DD"))
        .then((data) => {
          this.getGioHang().then((data) => {
            this.overlayGioHang = false;
          });
        });
    },
    docsotien(x) {
      let docTien = new DocTienBangChu();
      return docTien.doc(x);
    },
    getTongGiaTriGioHang() {
      let count = 0;

      this.listGioHang.forEach((item) => {
        count += item.giahientai;
      });
      return count;
    },
    themgiohang() {
      this.$bvModal.hide("modal_sanpham");
      console.log(this.$refs.sidebargiohang);

      let isDupplicate = this.listGioHang.find(
        (i) => i.id === this.itemFromScanner.id
      );
      console.log("=====", isDupplicate);
      if (!isDupplicate) {
        this.listGioHang.push(this.itemFromScanner);
      }
      if (this.$refs.sidebargiohang.isOpen) {
      } else {
        this.$root.$emit("bv::toggle::collapse", "sidebargiohang");
      }
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
      this.$root.$emit("bv::toggle::collapse", "sidebargiohang");
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

    checkDoThe(id) {
      this.$supabase
        .from("invoice")
        .select()
        .eq("invoice_number", id)
        .then(async (data) => {
          this.tempCheckDothe = data.data[0];
          this.$bvModal.show("modal_camdo");
          //unset
          this.check_invoice_auto();
        });
    },
    async capnhatgiohang() {
      return new Promise((resolve, reject) => {
        console.log("cập nhật giỏ hàng...");
        resolve(true);
      });
    },
    checkHoaDon(id) {
      this.$supabase
        .from("hoadon")
        .select()
        .eq("bill_code", id)
        .then((data) => {
          this.raw_hoadon = data.data[0];
          this.$bvModal.show("modalHoaDon");
        });
    },
    async getGioHang() {
      this.$supabase
        .from("giohang")
        .select("*")
        .eq("created_at", this.$moment().format("YYYY-MM-DD"))
        .then((data) => {
          this.rawGioHang = data.data[0];
          let d = data.data[0].listsanpham;

          //cập nhật giahientai theo bảng giá hiện tại, tránh trường hợp nhầm
          d = d.map((item) => {
            let price = this.$store.state.config.banggia_vang.find(
              (i) => String(i.code) == String(item.product_type)
            );
            return {
              ...item,
              giahientai:
                price.sellingPrice * item.product_gold_weight +
                item.product_wage * 1000,
              price,
            };
          });
          this.listGioHang = d;
        });
    },
    async insertGioHang(item) {
      let currentDay = this.$moment().format("YYYY-MM-DD");
      console.log("tìm kiếm giỏ hàng");
      let dataGioHangHienTai = await this.$supabase
        .from("giohang")
        .select()
        .eq("created_at", currentDay);

      if (dataGioHangHienTai.data.length > 0) {
        let dataGioHang = dataGioHangHienTai.data[0].listsanpham;
        let idGioHang = dataGioHangHienTai.data[0].id;

        let isItemExist = dataGioHang.find((i) => i.id === item.id);
        if (!isItemExist) {
          //đã tồn tại
          dataGioHang.push(item);

          await this.$supabase
            .from("giohang")
            .update({ listsanpham: dataGioHang })
            .eq("id", idGioHang);

          this.$bvToast.toast(
            `Thêm sản phẩm ${item.product_barcode} vào giỏ hàng ngày ${currentDay} `,
            {
              title: "Thông báo",
              autoHideDelay: 1000,
              appendToast: true,
              variant: "primary",
            }
          );
        } else {
          this.$bvToast.toast(
            `Mã sản phẩm ${item.product_barcode} đã tồn tại trong giỏ hàng`,
            {
              title: "Thông báo",
              autoHideDelay: 1000,
              appendToast: true,
              variant: "primary",
            }
          );
        }
      } else {
        //tạo mới giỏ hàng cho ngày nay
        let { data, error } = await this.$supabase.from("giohang").insert({
          listsanpham: JSON.stringify([]),
        });
        this.insertGioHang(item);
      }

      // return new Promise(async (resolve, reject) => {
      //   let currentDay = this.$moment().format("YYYY-MM-DD");
      //   let dataGioHangHienTai = await this.$supabase()
      //     .from("giohang")
      //     .select()
      //     .eq("invoice_date_create", currentDay);
      //   //kiểm tra ngày hiện tại đã có hay chưa, nếu chưa có thì tạo mới
      //   console.log(dataGioHangHienTai);
      //   resolve(dataGioHangHienTai);
      //   // let json_dataGioHangHienTai = JSON.parse(
      //   //   JSON.stringify(dataGioHangHienTai.data.listsanpham||'[]')
      //   // );
      //   // const exists = json_dataGioHangHienTai.includes(id);
      //   // if(exists){
      //   //   //insert new
      //   //   let objGioHang = {

      //   //   }
      //   //   this.$supabase.from('giohang').insert(objGioHang)
      //   // }
      // });
    },
    checkSanPham(id) {
      //DL2083
      id = String(id).toLowerCase();
      //insert to gioHang
      this.$supabase
        .from("product")
        .select()
        .eq("product_barcode", id)
        .then(async (data) => {
          let d = data.data[0];
          let a = await this.$sp_laygiatri(d);
          let item = { ...d, ...a };
          this.insertGioHang(item);
          if (d) {
            this.itemFromScanner = { ...d, ...a };
            //  console.log(this.itemFromScanner);
            this.$bvModal.show("modal_sanpham");
          } else {
            alert("Mã sản phẩm không tồn tại");
          }
        });
    },
    isBarcodeScan(input, duration) {
      return input.endsWith("\n") && duration < this.MAX_DURATION_BETWEEN_KEYS;
    },
    showInfoSanPham(item) {
      this.itemFromScanner = item;
      //  console.log(this.itemFromScanner);
      this.$bvModal.show("modal_sanpham");
    },
    getCamDo() {},
    subBanggia() {
      // láy bảng giá hiện tại và thêm vào store.banggia_vang
      this.$supabase
        .from("banggia")
        .select("*")
        .then((data) => {
          //có bảng giá
          this.$store.commit("config/setBanggia", data.data);
        });
      this.$supabase
        .from("banggia")
        .on("UPDATE", (payload) => {
          this.$supabase
            .from("banggia")
            .select("*")
            .then((data) => {
              //có bảng giá
              console.log("có bảng giá mới");
              this.$store.commit("config/setBanggia", data.data);
            });
        })
        .subscribe();
    },
  },
  mounted() {
    this.subBanggia();
    // this.checkHoaDon("1_10032024");
    // //
    // this.checkSanPham("md2003");
    // this.checkSanPham("md2004");
    // this.checkSanPham("md2006");
    // this.checkSanPham("md2008");
    // this.checkSanPham("md2009");
    // this.checkSanPham("md20010");
    // this.checkSanPham("dl2011");

    // this.checkSanPham("kk2066");
    // this.$bvModal.show("default_modal_SanPham");
    // this.checkSanPham("ve2065");
    let listDisableRouter = ["/camdo/chuocdo", "/chat"];
    var isDisable = listDisableRouter.includes(this.$nuxt.$route.fullPath);
    if (isDisable) {
      return;
    } else {
      //  this.checkDoThe(70850);
      window.addEventListener("keyup", (event) => {
        var specialKeys = [
          "Control",
          "Ctrl",
          "Alt",
          "Shift",
          "Backspace",
          "Tab",
          "Space",
          "Meta",
          "F1",
          "F2",
          "F3",
          "F4",
          "F5",
          "F6",
          "F7",
          "F8",
          "F9",
          "F10",
          "F11",
          "F12",
          "ShiftLeft",
          "ShiftRight",
          "ControlLeft",
          "ControlRight",
          "AltLeft",
          "AltRight",
          "Escape",
        ];

        function removeSpecialKeysFromString(str) {
          specialKeys.forEach(function (key) {
            // Tạo regex với từng từ khóa và thay thế chúng bằng chuỗi rỗng
            var regex = new RegExp(key, "g");
            str = str.replace(regex, "");
          });
          return str;
        }

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
          let regexHoadon = /^(\d+)_(\d{8})$/;
          let scannerInput = this.barcodeInput.replace(/[\s\n]+/g, "");
          if (
            this.isBarcodeScan(this.barcodeInput, duration) &&
            scannerInput != ""
          ) {
            let action = "";

            if (regexDoThe.test(scannerInput)) {
              action = "dothe";
            }
            if (regexSp.test(scannerInput)) {
              action = "sanpham";
            }

            if (regexHoadon.test(scannerInput)) {
              action = "hoadon";
            }
            scannerInput = removeSpecialKeysFromString(scannerInput);
            console.log("Barcode detected:", scannerInput, action);
            this.barcodeInput = ""; // Xóa chuỗi sau khi xử lý
            switch (action) {
              case "dothe":
                {
                  scannerInput = scannerInput.replace("=", "");
                  this.checkDoThe(scannerInput);
                  this.barcodeInput = ""; // Xóa chuỗi sau khi xử lý
                }
                break;
              case "sanpham":
                {
                  this.checkSanPham(scannerInput);
                  this.barcodeInput = ""; // Xóa chuỗi sau khi xử lý
                }
                break;
              case "hoadon":
                {
                  this.checkHoaDon(scannerInput);
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
    }
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
  transform: scale(4);
  /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport) */
}

.table_giaycamdo td {
  vertical-align: middle;
}

.table_giaycamdo {
  background-color: #7aafe8;
  color: blue !important;
}

.table_giaycamdo td,
.table_giaycamdo h3,
.table_giaycamdo P {
  color: blue !important;
  text-align: center;
}

.default_thongtin {
  color: red !important;
  font-size: 20px;
  font-weight: 500;
}
.myHoverProductBarcode:hover {
  cursor: pointer;
  color: red;
}
</style>
