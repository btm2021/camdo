<template>
  <div>
    <b-modal
      no-stacking
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
                    <a
                      style="color: red !important"
                      :href="'/camdo/chitietcamdo?id=' + tempCheckDothe.id"
                      target="_blank"
                    >
                      {{ tempCheckDothe.invoice_number }}</a
                    >

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
              <b-td>Khách Hàng</b-td>
              <b-td colspan="5" style="border-bottom: 1px dotted black">
                <span
                  style="color: #dc3545; font-weight: bold; font-size: 40px"
                >
                  {{ tempCheckDothe.customer_name }}
                </span>
                <span
                  class="blink"
                  style="color: yellow; font-weight: bold; font-size: 40px"
                  v-if="tempCheckDothe.invoice_type == 'THANH LÝ'"
                >
                  👉
                  {{
                    tempCheckDothe.invoice_type == "THANH LÝ"
                      ? "(ĐÃ THANH LÝ)"
                      : ""
                  }}
                  👈</span
                >
              </b-td>
            </b-tr>
            <b-tr>
              <b-td>Tên vật cầm</b-td>
              <b-td colspan="5" style="border-bottom: 1px dotted black">
                <span style="color: yellow; font-weight: bold; font-size: 24px">
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
              <b-td>Số tiền</b-td>
              <b-td colspan="5" style="border-bottom: 1px dotted black">
                <span style="color: yellow; font-weight: bold; font-size: 24px">
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
              <b-td
                colspan="6"
                style="color: yellow !important; font-weight: bold"
              >
                <b-row style="width: 95%">
                  <b-col cols="6">
                    <b-button-group>
                      <b-button
                        variant="success"
                        @click="intemSingle(tempCheckDothe)"
                        >In Mã</b-button
                      >
                      <b-button
                        variant="warning"
                        :href="'/camdo/chitietcamdo?id=' + tempCheckDothe.id"
                        >Chỉnh sửa</b-button
                      >
                    </b-button-group>
                  </b-col>
                  <b-col cols="3">
                    <b-form-group label="Tình trạng IN">
                      <b-form-checkbox
                        v-model="tempCheckDothe.invoice_label"
                        @change="switch_in_camdo_onchange(tempCheckDothe)"
                        switch
                      >
                        {{ tempCheckDothe.invoice_label ? "ĐÃ IN" : "CHƯA IN" }}
                      </b-form-checkbox>
                    </b-form-group>
                  </b-col>
                  <b-col cols="3">
                    <b-form-group label="Tình trạng CHUỘC">
                      <b-form-checkbox
                        v-model="tempCheckDothe.invoice_status"
                        @change="switch_chuoc_camdo_onchange(tempCheckDothe)"
                        switch
                      >
                        {{
                          tempCheckDothe.invoice_status
                            ? "ĐÃCHUỘC"
                            : "CHƯACHUỘC"
                        }}
                      </b-form-checkbox>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
      </b-overlay>
    </b-modal>
    <b-modal
      no-stacking
      id="modal_sanpham"
      size="xl"
      hide-footer
      @hidden="closeModalSanPham"
      title="Thông tin sản phẩm"
    >
      <b-overlay :show="overlaySanPham">
        <b-row v-if="itemFromScanner">
          <b-col cols="4">
            <b-img lazy :src="itemFromScanner.anhsanpham" center fluid />
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
                      {{
                        $formatN(
                          itemFromScanner._sotheodoi
                            ? itemFromScanner._sotheodoi.thanhtien
                            : 0
                        )
                      }}
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Giá hiện tại</span>
                  </b-td>
                  <b-td>
                    <div class="value text-danger">
                      <h3>
                        {{ $formatN(itemFromScanner.giahientai || 0) }}
                      </h3>
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Giá Xuất</span>
                  </b-td>
                  <b-td>
                    <div class="value">
                      {{ $formatN(itemFromScanner.giatrixuat || 0) }}
                    </div>
                  </b-td>
                </b-tr>

                <b-tr>
                  <b-td colspan="2">
                    <b-button-group>
                      <!--    <b-button variant="primary">Tạo hóa đơn và in tem</b-button>-->
                    </b-button-group>
                  </b-td>
                </b-tr>
              </b-tbody>
            </b-table-simple>
          </b-col>
          <b-col cols="4">
            <b-table-simple small hover bordered responsive fixed>
              <b-tbody>
                <b-tr>
                  <b-td>
                    <span class="title">Mã sản phẩm</span>
                  </b-td>
                  <b-td>
                    <div class="value text-success bd-highlight">
                      {{ itemFromScanner.maso }}
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
                          $moment(itemFromScanner.ngayxuat),
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
                        {{ itemFromScanner.kieusanpham.short }}</b-badge
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
                      {{ itemFromScanner.banggia.code }}
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Trọng Lượng Tổng</span>
                  </b-td>
                  <b-td>
                    <div class="value">
                      {{ $formatSoVang(itemFromScanner.klt).fullStr }}
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Trọng Lượng Vàng</span>
                  </b-td>
                  <b-td>
                    <div class="value text-warning">
                      {{ $formatSoVang(itemFromScanner.klv).fullStr }}
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Trọng Lượng hột</span>
                  </b-td>
                  <b-td>
                    <div class="value">
                      {{ $formatSoVang(itemFromScanner.klh).fullStr }}
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Tiền công nhập</span>
                  </b-td>
                  <b-td>
                    <div class="value">
                      {{ itemFromScanner.giacongnhap }}
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
                      {{ itemFromScanner.cong }}
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
                      <b-badge variant="warning" v-if="itemFromScanner.daban"
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
                      <b-badge variant="warning">{{
                        itemFromScanner.nhacungcap.short
                      }}</b-badge>
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Giá Vàng Nhập</span>
                  </b-td>
                  <b-td>
                    <div class="value">
                      {{
                        itemFromScanner._sotheodoi
                          ? itemFromScanner._sotheodoi.giamua
                          : 0
                      }}
                    </div>
                  </b-td>
                </b-tr>
              </b-tbody>
            </b-table-simple>
          </b-col>
          <b-col v-if="itemFromScanner._sotheodoi" cols="4">
            <h4 class="text-center">HÓA ĐƠN NHẬP</h4>
            <b-table-simple small hover bordered responsive fixed>
              <b-tbody>
                <b-tr>
                  <b-td>
                    <span class="title">NGUỒN GỐC NHẬP</span>
                  </b-td>
                  <b-td>
                    <b> NHẬP TỪ KHÁCH LẺ</b>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Mã Hóa đơn Nhập</span>
                  </b-td>
                  <b-td>
                    <div class="value text-success bd-highlight">
                      <a
                        :href="
                          '/hoadon/chitiethoadonnhap?id=' +
                          itemFromScanner._sotheodoi.id
                        "
                        >{{ itemFromScanner._sotheodoi.id }}</a
                      >
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Ngày nhập</span>
                  </b-td>
                  <b-td>
                    <div class="value text-success bd-highlight">
                      {{
                        $moment(itemFromScanner._sotheodoi.created_at).format(
                          "DD/MM/YYYY"
                        )
                      }}
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Tên khách nhập</span>
                  </b-td>
                  <b-td>
                    <div class="value text-success bd-highlight">
                      {{ itemFromScanner._sotheodoi.tenkhach }}
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Địa chỉ</span>
                  </b-td>
                  <b-td>
                    <div class="value text-success bd-highlight">
                      {{ itemFromScanner._sotheodoi.diachi }}
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Khối lượng tổng</span>
                  </b-td>
                  <b-td>
                    <div class="value text-success bd-highlight">
                      {{ itemFromScanner._sotheodoi.klt / 1000 }} <b>Chỉ</b>
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Khối lượng Hột</span>
                  </b-td>
                  <b-td>
                    <div class="value text-success bd-highlight">
                      {{ itemFromScanner._sotheodoi.klh / 1000 }} <b>Chỉ</b>
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Khối lượng Vàng nhập</span>
                  </b-td>
                  <b-td>
                    <div class="value text-success bd-highlight">
                      {{ itemFromScanner._sotheodoi.klv / 1000 }} <b>Chỉ</b>
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Ghi chú nhập</span>
                  </b-td>
                  <b-td>
                    <div class="value text-success bd-highlight">
                      {{ itemFromScanner._sotheodoi.ghichu }}
                    </div>
                  </b-td>
                </b-tr>
              </b-tbody>
            </b-table-simple>
          </b-col>
          <b-col v-else-if="itemFromScanner.hoadonnhap" cols="4">
            <h4 class="text-center">HÓA ĐƠN NHẬP</h4>
            <b-table-simple small hover bordered responsive fixed>
              <b-tbody>
                <b-tr>
                  <b-td>
                    <span class="title">NGUỒN GỐC NHẬP</span>
                  </b-td>
                  <b-td>
                    <b> NHẬP TỪ CHÀNH SỈ</b>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Mã Hóa đơn Nhập</span>
                  </b-td>
                  <b-td>
                    <div class="value text-success bd-highlight">
                      <a
                        :href="
                          '/sanpham/chitiethoadonnhap?id=' +
                          itemFromScanner.hoadonnhap.id
                        "
                        >{{ itemFromScanner.hoadonnhap.mahoadon }}</a
                      >
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Ngày nhập</span>
                  </b-td>
                  <b-td>
                    <div class="value text-success bd-highlight">
                      {{
                        $moment(itemFromScanner.hoadonnhap.ngaytao).format(
                          "DD/MM/YYYY"
                        )
                      }}
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Tên nhà sản xuất nhập</span>
                  </b-td>
                  <b-td>
                    <div class="value text-success bd-highlight">
                      {{ itemFromScanner.hoadonnhap.nhacungcap.name }}
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Địa chỉ nhà cung cấp</span>
                  </b-td>
                  <b-td>
                    <div class="value text-success bd-highlight">
                      {{ itemFromScanner.hoadonnhap.nhacungcap.address }}
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Mũi hiệu</span>
                  </b-td>
                  <b-td>
                    <div class="value text-success bd-highlight">
                      {{ itemFromScanner.hoadonnhap.nhacungcap.short }}
                    </div>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-td>
                    <span class="title">Tiêu chuẩn cơ sở</span>
                  </b-td>
                  <b-td>
                    <div class="value text-success bd-highlight">
                      {{ itemFromScanner.hoadonnhap.nhacungcap.tccs }}
                    </div>
                  </b-td>
                </b-tr>

                <b-tr>
                  <b-td>
                    <span class="title">Ghi chú nhập</span>
                  </b-td>
                  <b-td>
                    <div class="value text-success bd-highlight">
                      {{ itemFromScanner.hoadonnhap.nhacungcap.ghichu }}
                    </div>
                  </b-td>
                </b-tr>

                <b-tr>
                  <b-td>
                    <span class="title">Thông tin đồ nhập</span>
                  </b-td>
                  <b-td>
                    <div class="value text-success bd-highlight">
                      ←← Như bên phải
                    </div>
                  </b-td>
                </b-tr>
              </b-tbody>
            </b-table-simple>
          </b-col>
        </b-row>
      </b-overlay>
    </b-modal>
    <b-modal
      no-stacking
      id="modal_input"
      hide-header
      hide-footer
      hide-header-close
    >
      <b-input
        v-model="modal_input"
        autofocus
        @change="checkInput"
        size="lg"
        class="text-center"
        style="font-size: 50px; font-weight: bold"
      ></b-input>
    </b-modal>
    <b-modal no-stacking id="modalImage" hide-footer hide-header>
      <b-img lazy :src="imgUrl" style="width: 100%; height: 500px"> </b-img>
    </b-modal>
    <b-modal size="lg" no-stacking id="modal_taonhanh" hide-footer hide-header>
      <div>
        <b-form @submit.prevent="taohoadonnhanh">
          <b-row>
            <b-col cols="12" class="text-center font-weight-bold">
              <h4>TẠO HÓA ĐƠN NHANH</h4>
            </b-col>
            <b-col cols="6">
              <b-form-group label="Tên khách :" description="Tên khách mua">
                <b-form-input
                  autocomplete="off"
                  v-model="formHoaDonNhanh.tenkhach"
                  placeholder="Nhập tên khách"
                ></b-form-input>
              </b-form-group>
              <b-form-group
                label="Căn Cước Công Dân Khách :"
                description="CCCD của khách"
              >
                <b-form-input
                  autocomplete="off"
                  v-model="formHoaDonNhanh.cccd"
                ></b-form-input>
              </b-form-group>
              <b-form-group label="Tổng tiền :" description="Tổng số tiền VND">
                <b-form-input
                  autocomplete="off"
                  v-model="formHoaDonNhanh.tongtien"
                ></b-form-input>
              </b-form-group>
              <b-form-group
                label="Thực nhận :"
                :description="
                  formHoaDonNhanh.thucnhan
                    ? $formatN(formHoaDonNhanh.thucnhan)
                    : '0'
                "
              >
                <b-form-input
                  autocomplete="off"
                  v-model="formHoaDonNhanh.thucnhan"
                ></b-form-input>
              </b-form-group>
              <b-form-group label="Địa chỉ :" description="Địa chỉ khách">
                <b-form-input
                  autocomplete="off"
                  v-model="formHoaDonNhanh.diachi"
                ></b-form-input>
              </b-form-group>
              <b-form-group
                label="Số điện thoại :"
                description="Số điện thoại khách"
              >
                <b-form-input
                  autocomplete="off"
                  v-model="formHoaDonNhanh.sodienthoai"
                ></b-form-input>
              </b-form-group>
            </b-col>
            <b-col cols="6">
              <b-form-group
                label="Trọng Lượng Vàng :"
                :description="
                  $formatSoVang(parseFloat(formHoaDonNhanh.klv) * 1000).fullStr
                "
              >
                <b-form-input
                  type="range"
                  step="0.1"
                  min="0.3"
                  max="50"
                  autocomplete="off"
                  v-model="formHoaDonNhanh.klv"
                  required
                ></b-form-input>
              </b-form-group>
              <b-form-group
                label="Loại Vàng :"
                description="Loại vàng : [9950]"
              >
                <b-form-input
                  autocomplete="off"
                  disabled
                  v-model="formHoaDonNhanh.id_banggia"
                  required
                ></b-form-input>
              </b-form-group>

              <b-form-group label="Ghi chú hóa đơn :" description="Ghi chú">
                <b-form-textarea
                  v-model="formHoaDonNhanh.ghichu"
                  autocomplete="off"
                ></b-form-textarea>
              </b-form-group>
              <b-button type="submit" variant="primary">Submit</b-button>
              <b-button type="reset" variant="danger">Reset</b-button>
            </b-col>
          </b-row>
        </b-form>
      </div>
    </b-modal>
    <b-modal
      scrollable
      no-stacking
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
                  <span class="text-primary">{{ raw_hoadon.tenkhach }}</span>
                </b-td>

                <b-td><b>Tổng tiền hóa đơn :</b></b-td>
                <b-td>
                  <b>
                    <span class="text-danger">{{
                      $formatSoTien(raw_hoadon.tongtien)
                    }}</span></b
                  >
                </b-td>
              </b-tr>
              <b-tr>
                <b-td><b>Thực nhận :</b></b-td>
                <b-td>
                  <b>
                    <span class="text-danger">{{
                      $formatSoTien(raw_hoadon.thucnhan)
                    }}</span></b
                  >
                </b-td>

                <b-td><b>Số món :</b></b-td>
                <b-td>{{ raw_hoadon.sanpham.length }}</b-td>
              </b-tr>
              <b-tr>
                <b-td colspan="4"> Chi tiết : {{ raw_hoadon.chitiet }} </b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-col>
        <b-col cols="12">
          <b-table
            responsive
            :items="raw_hoadon.sanpham"
            :fields="fieldSanphamhoadon"
          >
            <template #cell(stt)="data">
              {{ data.index + 1 }}
            </template>
            <template #cell(klt)="data">
              <span>{{ $formatSoVang(data.value).fullStr }}</span>
            </template>
            <template #cell(klh)="data">
              <span>{{ $formatSoVang(data.value).fullStr }}</span>
            </template>
            <template #cell(klv)="data">
              <span>{{ $formatSoVang(data.value).fullStr }}</span>
            </template>
            <template #cell(maso)="data">
              <b
                class="myHoverProductBarcode"
                @click="showInfoSanPham(data.item)"
              >
                {{ data.item.maso }}
                <span v-if="data.item.hoadon_ban" style="font-size: 30px">
                  <b-badge variant="warning">{{
                    formatBillCode(data.item.hoadon_ban.bill_code)
                  }}</b-badge>
                </span>
              </b>
            </template>

            <template #cell(anhsanpham)="data">
              <b-img
                @click="showImage(data.value)"
                :src="data.item.anhsanpham"
                style="width: 100px; height: 100px"
              />
            </template>
          </b-table>
        </b-col>
        <b-col cols="12" class="text-center">
          <b-row>
            <b-col cols="6">
              <b>
                Tổng công :
                {{
                  raw_hoadon.sanpham.reduce(
                    (sum, item) => sum + (item.cong || 0),
                    0
                  )
                }}
              </b>
            </b-col>
            <b-col cols="6">
              <b
                >Tổng tiền :
                {{
                  $formatSoTien(
                    raw_hoadon.sanpham.reduce(
                      (sum, item) => sum + (item.giatrixuat || 0),
                      0
                    )
                  )
                }}</b
              >
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-modal>
    <b-modal
      id="modal_camdo_kiemtra"
      no-stacking
      size="xl"
      hide-footer
      hide-header
      @hide="reset_camdo_kiemtra"
    >
      <b-row style="min-height: 80vh">
        <b-col cols="7">
          <b-table-simple
            v-if="camdo_kiemtra_giaythe"
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
                </b-th>
              </b-tr>
              <b-tr> </b-tr>
              <b-tr>
                <b-th colspan="4">
                  <div>
                    <h3 style="float: right; color: #dc3545 !important">
                      <span v-if="camdo_kiemtra_giaythe.invoice_status">
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
                <b-td>Tên</b-td>
                <b-td colspan="5" style="border-bottom: 1px dotted black">
                  <span
                    style="color: #dc3545; font-weight: bold; font-size: 40px"
                  >
                    {{ camdo_kiemtra_giaythe.customer_name }}
                  </span>
                </b-td>
              </b-tr>
              <b-tr>
                <b-td> Đồ cầm</b-td>
                <b-td colspan="5" style="border-bottom: 1px dotted black">
                  <span
                    style="color: #dc3545; font-weight: bold; font-size: 24px"
                  >
                    <span
                      v-for="(item, index) in JSON.parse(
                        camdo_kiemtra_giaythe.invoice_tag
                      )"
                      :key="index"
                    >
                      {{ item }} ,
                    </span>
                  </span>
                  {{ camdo_kiemtra_giaythe.invoice_store }} -
                  {{ camdo_kiemtra_giaythe.invoice_store_type }}
                </b-td>
              </b-tr>

              <b-tr>
                <b-td>Tiền</b-td>
                <b-td colspan="5" style="border-bottom: 1px dotted black">
                  <span
                    style="color: #dc3545; font-weight: bold; font-size: 24px"
                  >
                    {{ $formatN(camdo_kiemtra_giaythe.invoice_money) }} ({{
                      docsotien(camdo_kiemtra_giaythe.invoice_money)
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
                      $moment(camdo_kiemtra_giaythe.invoice_date_create).format(
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
                          $moment(camdo_kiemtra_giaythe.invoice_date_create),
                          "days"
                        )
                      }}
                      ngày
                    </span>
                    <br />
                    Số tiền lãi :<span
                      style="color: yellow; font-size: 50px; font-weight: 800"
                    >
                      {{ $formatN(getTienLai(camdo_kiemtra_giaythe)) }}
                    </span>
                  </p>
                </b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-col>
        <b-col cols="1">
          <div
            v-if="camdo_kiemtra_status"
            style="width: 100%; height: 100%; background-color: green"
          ></div>
          <div
            v-else
            style="width: 100%; height: 100%; background-color: red"
          ></div>
        </b-col>
        <b-col cols="4" class="mt-4">
          <b-table-simple
            v-if="camdo_kiemtra_bocdo"
            class="mt-5"
            borderless
            style="
              border: 1px solid black;
              color: red;
              font-size: 25px;
              font-weight: bolder;
            "
          >
            <b-tbody>
              <b-tr style="background-color: rgb(121, 175, 232)">
                <b-td>{{ camdo_kiemtra_bocdo.customer_name }}</b-td>
                <b-td>{{ camdo_kiemtra_bocdo.invoice_number }}</b-td>
              </b-tr>

              <b-tr
                style="
                  border-bottom: 1px solid black;
                  background-color: rgb(121, 175, 232);
                "
              >
                <b-td>{{ camdo_kiemtra_bocdo.invoice_money }}</b-td>
                <b-td>{{ camdo_kiemtra_bocdo.invoice_date_create }}</b-td>
              </b-tr>

              <b-tr
                style="
                  width: 100%;
                  height: 200px;
                  background-image: url('/placehold_camdo_bocdo.png');
                  background-size: cover;
                  background-repeat: no-repeat;
                "
              >
                <b-td colspan="2"> </b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>

          <div v-if="camdo_kiemtra_status && camdo_kiemtra_bocdo">
            <h3 style="color: green">Mã vạch khớp</h3>
            <div>
              <table style="font-size: 25px; font-weight: bolder; width: 100%">
                <tr>
                  <td>Tên</td>
                  <td>{{ camdo_kiemtra_bocdo.customer_name }}</td>
                </tr>
                <tr>
                  <td>Mã</td>
                  <td>{{ camdo_kiemtra_bocdo.invoice_number }}</td>
                </tr>
                <tr>
                  <td>Tiền</td>
                  <td>
                    {{ $formatSoTien(camdo_kiemtra_bocdo.invoice_money) }}
                  </td>
                </tr>
                <tr>
                  <td>Ngày thế</td>
                  <td>
                    {{
                      $moment(camdo_kiemtra_bocdo.invoice_date_create).format(
                        "DD/MM/YYYY"
                      )
                    }}
                  </td>
                </tr>
                <tr>
                  <td>Số ngày thế</td>
                  <td class="text-danger">
                    {{
                      $moment().diff(
                        $moment(camdo_kiemtra_bocdo.invoice_date_create),
                        "days"
                      )
                    }}
                    ngày
                  </td>
                </tr>
                <tr>
                  <td>Tiền lãi :</td>
                  <td class="text-danger">
                    {{ $formatN(getTienLai(camdo_kiemtra_bocdo)) }}
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div v-else>
            <h3 class="blink" style="color: red">Mã không khớp</h3>
          </div>
        </b-col>
      </b-row>
    </b-modal>

    <b-sidebar
      ref="sidebargiohang"
      width="900px"
      id="sidebargiohang"
      :title="'Giỏ hàng : ' + $moment().format('DD/MM/YYYY')"
      shadow
      @shown="getGioHang"
      @hidden="showTinhToan = false"
    >
      <b-overlay :show="overlayGioHang">
        <div class="px-3 py-2">
          <b-input
            placeholder="Gõ tìm sản phẩm..."
            v-model="filterGioHang"
            size="xl"
            style="
              color: red;
              font-size: xx-large;
              text-align: center;
              text-transform: uppercase;
              font-weight: bold;
            "
            autocomplete="off"
            class="px-3 mb-3"
          ></b-input>
          <b-table
            :filter="filterGioHang"
            bordered
            no-border-collapse
            class="default_tablegiohang text-center"
            hover
            ref="default_tablegiohang"
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

            <template #cell(klt)="data">
              <span>{{ $formatSoVang(data.item.klt).fullStr }}</span>
            </template>
            <template #cell(klh)="data">
              <span>{{ $formatSoVang(data.item.klh).fullStr }}</span>
            </template>

            <template #cell(giahientai)="data">
              <span>{{ $formatN(data.item.giahientai) }}</span>
            </template>
            <template #cell(klv)="data">
              <b class="text-primary">{{
                $formatSoVang(data.item.klv).fullStr
              }}</b>
            </template>
            <template #cell(maso)="data">
              <b
                class="myHoverProductBarcode"
                @click="showInfoSanPham(data.item)"
              >
                {{ data.item.maso }}
                <span v-if="data.item.hoadon_ban" style="font-size: 30px">
                  <b-badge variant="warning">{{
                    formatBillCode(data.item.hoadon_ban.bill_code)
                  }}</b-badge>
                </span>
              </b>
            </template>
            <template #cell(remove)="data">
              <b-button variant="danger" @click="xoaSanPhamGioHang(data.item)"
                >Xóa</b-button
              >
            </template>

            <template #cell(anhsanpham)="data">
              <b-img
                @click="showImage(data.value)"
                :src="data.item.anhsanpham"
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
                    $formatSoTien(bill.thucnhan) != ''
                      ? $formatSoTien(bill.thucnhan)
                      : '.'
                  "
                  label="Tiền thực nhận:"
                >
                  <b-form-input
                    autocomplete="off"
                    v-model="bill.thucnhan"
                    type="text"
                  ></b-form-input>
                </b-form-group>
                <b-form-group label="Ghi chú hóa đơn">
                  <b-form-input
                    autocomplete="off"
                    v-model="bill.ghichu"
                    type="text"
                  ></b-form-input>
                </b-form-group>
                <b-form-group label="Số điện thoại khách:">
                  <b-form-input
                    autocomplete="off"
                    v-model="bill.sodienthoai"
                    type="text"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col cols="6">
                <b-form-group label="Địa chỉ:" description=".">
                  <b-form-input
                    autocomplete="off"
                    v-model="bill.diachi"
                    type="text"
                  ></b-form-input>
                </b-form-group>
                <b-form-group label="Tên khách:">
                  <b-form-input
                    autocomplete="off"
                    v-model="bill.tenkhach"
                    type="text"
                  ></b-form-input>
                </b-form-group>
                <b-form-group label="Số món">
                  <b-form-input
                    autocomplete="off"
                    v-model="selectGioHang.length"
                    disabled
                    type="text"
                  ></b-form-input>
                </b-form-group>
              </b-col>

              <b-col cols="12">
                <b-form-group label="Chi tiết hóa đơn:">
                  <b-form-textarea
                    autocomplete="off"
                    v-model="bill.chitiet"
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
                    {{ item.kieusanpham.short }}
                  </b>
                </td>

                <td>
                  <b class="text-danger">{{ item.banggia.code }}</b>
                </td>

                <td>
                  <b class="text-danger">{{
                    $formatSoVang(item.klv).fullStr
                  }}</b>
                </td>

                <td>
                  <b>{{ item.banggia.code }}</b>
                </td>

                <td>
                  <b>{{ item.cong }}</b>
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
                <td colspan="5" class="text-center">
                  <span>{{
                    docsotien(
                      selectGioHang.reduce(
                        (sum, item) => sum + (item.giahientai || 0),
                        0
                      )
                    )
                  }}</span>
                </td>

                <td>
                  <b class="text-primary text-right">
                    {{
                      $formatSoTien(
                        selectGioHang.reduce(
                          (sum, item) => sum + (item.cong || 0),
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
              '#' + (index + 1) + '_' + item.kieusanpham.short + '-' + item.maso
            "
            :img-src="item.anhsanpham"
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
                          $formatSoVang(item.klt).fullStr
                        }}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>Trọng lượng hột</td>
                      <td>
                        <b class="text-danger">{{
                          $formatSoVang(item.klh).fullStr
                        }}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>Trọng lượng đá</td>
                      <td>
                        <b class="text-danger">{{
                          $formatSoVang(item.klv).fullStr
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
                        <b>{{ item.banggia.code }}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>Giá vàng</td>
                      <td>
                        <b>{{ item.banggia.sellingPrice }}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>Tiền công</td>
                      <td>
                        <b>{{ item.cong }}</b>
                      </td>
                    </tr>
                  </table>
                </b-col>
                <b-col cols="12">
                  <div class="text-center text-primary">
                    Tính :
                    {{
                      `${$formatSoVang(item.klv).fullStr}x${
                        item.banggia.sellingPrice
                      }+${item.cong}=${$formatSoTien(item.giahientai)}`
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
          <b-button variant="primary" @click="inhoadon()"
            >Tạo hóa đơn và In Giấy</b-button
          >
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
                selectGioHang.reduce((sum, item) => sum + (item.cong || 0), 0)
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
              <b-dropdown-item href="/camdo/matgiay">Mất giấy</b-dropdown-item>
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
              <b-dropdown-item href="/sanpham/intem"
                >In tem sản phẩm</b-dropdown-item
              >
            </b-dropdown-group>
            <b-dropdown-group header="Tiền công">
              <b-dropdown-item href="/sanpham/thaydoicong"
                >Đổi tiền công</b-dropdown-item
              >
            </b-dropdown-group>
            <b-dropdown-group id="dropdown-group-2" header="Bảng giá">
              <b-dropdown-item href="/sanpham/hoadonnhap"
                >Hóa đơn nhập</b-dropdown-item
              >
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
            <b-dropdown-group id="dropdown-group-1" header="Hóa đơn nhập">
              <b-dropdown-item href="/hoadon/themhoadonnhap"
                >Thêm Hóa đơn Nhập Hàng</b-dropdown-item
              >
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
              <b-dropdown-item href="/tool/kiemcan">Kiểm cân</b-dropdown-item>
              <b-dropdown-item href="/tool/nhacungcap"
                >Nhà cung cấp</b-dropdown-item
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
          <b-nav-item-dropdown text="Tạo nhanh">
            <b-dropdown-group header="Số lượng sẵn vàng 9950">
              <b-dropdown-item href="#" @click="showModalTaoNhanhHoadon(0.5)"
                >Tạo Nhẫn 5p</b-dropdown-item
              >
              <b-dropdown-item href="#" @click="showModalTaoNhanhHoadon(1)"
                >Tạo Nhẫn 1C</b-dropdown-item
              >
              <b-dropdown-item href="#" @click="showModalTaoNhanhHoadon(2)"
                >Tạo Nhẫn 2C</b-dropdown-item
              >
              <b-dropdown-item href="#" @click="showModalTaoNhanhHoadon(5)"
                >Tạo Nhẫn 5C</b-dropdown-item
              >
              <b-dropdown-item href="#" @click="showModalTaoNhanhHoadon(null)">
                Tự chọn trọng lượng Y
              </b-dropdown-item>
            </b-dropdown-group>
            <b-dropdown-group header="Hàng 18k">
              <b-dropdown-item href="#" @click="showModalTaoNhanhHoadon(null)">
                Tự chọn trọng lượng 18k
              </b-dropdown-item>
            </b-dropdown-group>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <!-- 
        <b-navbar-nav>
          <b-nav-item-dropdown text="Thống kê">
            <b-dropdown-group id="dropdown-group-1" header="Các mục" style="width: 300px">
              <b-dropdown-item href="/thongke/ngay">Theo ngày</b-dropdown-item>
              <b-dropdown-item href="/thongke/sanpham">Sản phẩm</b-dropdown-item>
              <b-dropdown-item href="/thongke/camdo">Cầm đồ</b-dropdown-item>
            </b-dropdown-group>
          </b-nav-item-dropdown>
        </b-navbar-nav> -->
        <!-- <b-navbar-nav>
          <b-nav-item href="/chat/">Chat</b-nav-item>
        </b-navbar-nav> -->
        <b-navbar-nav>
          <b-nav-item v-b-toggle.sidebargiohang>Giỏ hàng</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-form @submit.prevent="findItem">
            <b-overlay :show="overlay_search">
              <b-input
                style="text-transform: uppercase"
                autocomplete="off"
                v-model="searchInput"
                size="sm"
                placeholder="Tìm kiếm..."
                class="mr-sm-2"
              ></b-input>
            </b-overlay>
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <nuxt />
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
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
      filterGioHang: null,
      searchInput: null,
      id_giohang: null,
      default_overlaySanPham: false,
      formDefault_sanpham_gia: null,

      bill: {
        tongtien: 0,
        thucnhan: 0,
        tenkhach: "khong",
        diachi: "khong",
        chitiet: "khong",
        ghichu: "khong",
        sodienthoai: "khong",
        id_giohang: null,
        isPrint: false,
        bill_code: null,
        listsanpham: [],
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
        {
          key: "anhsanpham",
          label: "Ảnh",
          formatter: (val) => {
            return val;
          },
        },
        { key: "maso", label: "Mã", sortable: true },
        { key: "banggia.code", label: "Loại", sortable: true },
        { key: "banggia.sellingPrice", label: "GiáV", sortable: true },
        { key: "kieusanpham.short", label: "Kiểu", sortable: true },
        { key: "nhacungcap.short", label: "Chành", sortable: true },
        { key: "klt", label: "Tổng", sortable: true },
        { key: "klh", label: "Hột", sortable: true },
        { key: "klv", label: "Vàng", sortable: true },
        { key: "cong", label: "Công", sortable: true },
        { key: "giahientai", label: "Giá", sortable: true },
        { key: "remove", label: "Giá" },
      ],
      fieldSanphamhoadon: [
        { key: "stt", label: "#" },
        {
          key: "anhsanpham",
          label: "Ảnh",
          formatter: (val) => {
            return val;
          },
        },
        { key: "maso", label: "Mã", sortable: true },
        { key: "banggia.code", label: "Loại", sortable: true },
        { key: "banggia.sellingPrice", label: "GiáV", sortable: true },
        { key: "kieusanpham.short", label: "Kiểu", sortable: true },
        { key: "nhacungcap.short", label: "Chành", sortable: true },
        { key: "klt", label: "Tổng", sortable: true },
        { key: "klh", label: "Hột", sortable: true },
        { key: "klv", label: "Vàng", sortable: true },
        { key: "cong", label: "Công", sortable: true },
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

      //
      camdo_kiemtra_status: false,
      camdo_kiemtra_giaythe_invoice_number: null,
      camdo_kiemtra_bocdo_invoice_number: null,
      camdo_kiemtra_giaythe: null,
      camdo_kiemtra_bocdo: null,
      camdo_kiemtra_giaythe_danhan: false,
      overlay_search: false,
      //hoadonnhanh
      formHoaDonNhanh: {
        tenkhach: null,
        thucnhan: null,
        tongtien: null,
        diachi: null,
        klv: 0,
        id_nhacungcap: 0,
        id_banggia: 0,
        id_kieusanpham: 0,
        sodienthoai: null,
        bill_code: null,
        isPrint: false,
        id_giohang: null,
        ghichu: null,
        chitiet: null,
        somon: null,
        cccd: null,
        created_at: null,
      },
    };
  },
  watch: {
    camdo_kiemtra_giaythe_invoice_number(newVal, oldVal) {
      this.check_camdo_kiemtra_trungnhau();
    },
    camdo_kiemtra_bocdo_invoice_number(newVal, oldVal) {
      this.check_camdo_kiemtra_trungnhau();
    },
    selectGioHang(newVal, oldVal) {
      // this.getBarcode();
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
    //taohoadonhnhanh
    async taohoadonnhanh() {
      //lấy banggia
      let bg = await this.$supabase.from("banggia").select("").eq("id", 1);
      let banggia = bg.data[0];
      //tạo bill
      let tongtien =
        parseFloat(this.formHoaDonNhanh.klv) * banggia.sellingPrice * 1000;
      let billObject = {
        tongtien,
        thucnhan: parseInt(this.formHoaDonNhanh.thucnhan) || 0,
        tenkhach: this.formHoaDonNhanh.tenkhach || "",
        diachi: this.formHoaDonNhanh.diachi || "",
        cccd: this.formHoaDonNhanh.cccd || "",
        sodienthoai: this.formHoaDonNhanh.sodienthoai || "",
        bill_code: `NK-${this.$moment().format("DD/MM/YYYY")}`,
        isPrint: false,
        id_giohang: 0,
        chitiet: "",
        ghichu: this.formHoaDonNhanh.ghichu || "",
        somon: 1,
        created_at: new Date(),
        listsp: [
          {
            name: "NHẪNKHÂU",
            maso: "NK9950",
            klt: parseFloat(this.formHoaDonNhanh.klv) * 1000,
            klv: parseFloat(this.formHoaDonNhanh.klv) * 1000,
            klh: 0,
            cong: 0,
            gia: banggia.sellingPrice,
            giatrixuat: tongtien,
            code: banggia.hienthi,
          },
        ],
      };
      console.log(billObject);

      this.$pnPublish(
        {
          channel: "printserver",
          message: { type: "inhoadon", list: billObject },
        },
        (status, response) => {
          if (status.error) {
            console.log(status);
            this.selectGioHang = [];
          } else {
          }
        }
      );
    },
    //end
    intemSingle(item) {
      let list = [
        {
          maso: item.invoice_number,
          tien: item.invoice_money,
          ten: item.customer_name,
          ngay: item.invoice_date_create,
          id: item.id,
        },
      ];
      this.$pnPublish(
        {
          channel: "printserver",
          message: { type: "ingiaythe", list },
        },
        (status, response) => {
          if (status.error) {
            console.log(status);
          } else {
            alert("Chờ máy in ra tem ra rồi hẵn bấm OK");
            console.log("Message Published", response);
          }
        }
      );
    },
    formatBillCode(item) {
      //6-25042024
      let billNumber = String(item).split("-")[0];
      return billNumber;
    },
    findItem() {
      this.overlay_search = true;
      if (this.searchInput && this.searchInput != "") {
        //SN1150 sp
        let input = String(this.searchInput).toUpperCase();
        const productRegex = /^[S][A-Z][0-9]+$/;
        //12321321 dothe
        const itemRegex = /^[0-9]+$/;
        //4-15042024 hóa đơn
        const billRegex = /^\d+-\d+$/;
        if (productRegex.test(input)) {
          this.checkSanPham_search(input);
        }
        if (itemRegex.test(input)) {
          this.checkDoThe_search(input);
        }
        if (billRegex.test(input)) {
          this.checkHoaDon(input);
        }
        this.overlay_search = false;
        this.searchInput = null;
      }
    },
    reset_camdo_kiemtra() {
      if (!this.camdo_kiemtra_giaythe_danhan) {
        this.camdo_kiemtra_bocdo = null;
        this.camdo_kiemtra_giaythe = null;
        this.camdo_kiemtra_bocdo_invoice_number = null;
        this.camdo_kiemtra_giaythe_invoice_number = null;
        this.camdo_kiemtra_status = true;
        this.camdo_kiemtra_giaythe_danhan = false;
      }
    },
    check_camdo_kiemtra_buoc2(id) {
      console.log(id);
      let invoice_number = parseInt(id);
      this.$supabase
        .from("invoice")
        .select()
        .eq("invoice_number", invoice_number)
        .then(async (data) => {
          if (data.data[0]) {
            this.camdo_kiemtra_bocdo = data.data[0];
            this.camdo_kiemtra_bocdo_invoice_number =
              data.data[0].invoice_number;
            this.check_camdo_kiemtra_trungnhau();
            if (this.camdo_kiemtra_status) {
              //chuoc
              this.tempCheckDothe = this.camdo_kiemtra_bocdo;
              this.check_invoice_auto();
            }
            this.camdo_kiemtra_giaythe_danhan = false;
            console.log();
            this.$bvModal.show("modal_camdo_kiemtra");
          }
        });
    },
    check_camdo_kiemtra_trungnhau() {
      if (
        parseInt(this.camdo_kiemtra_bocdo_invoice_number) ==
        parseInt(this.camdo_kiemtra_giaythe_invoice_number)
      ) {
        this.camdo_kiemtra_status = true;
      } else {
        this.camdo_kiemtra_status = false;
      }
    },
    check_camdo_kiemtra(id) {
      //id = -----0
      let invoice_number = parseInt(String(id).split("-")[1]);

      this.$supabase
        .from("invoice")
        .select()
        .eq("invoice_number", invoice_number)
        .then(async (data) => {
          if (data.data[0]) {
            console.log(data.data[0]);
            this.camdo_kiemtra_giaythe = data.data[0];
            this.camdo_kiemtra_giaythe_invoice_number =
              data.data[0].invoice_number;
            this.camdo_kiemtra_giaythe_danhan = true;
            this.$bvModal.show("modal_camdo_kiemtra");
          }
        });
    },
    getBarcode() {
      this.$getBill_code().then((data) => {
        // console.log(data);
        this.bill.bill_code = data;
      });
    },

    async inhoadon() {
      //tạo hóa đơn
      //gửi link ve client in
      //client
      //
      let giohangtemp = await this.$supabase
        .from("giohangsanpham")
        .select()
        .eq("id", this.id_giohang);
      let count_hoadon = giohangtemp.data[0].count_hoadon;
      console.log(count_hoadon);
      let bill_code = `${count_hoadon + 1}-${this.$moment().format(
        "DDMMYYYY"
      )}`;
      let spLength = this.selectGioHang.length;
      let listName = this.selectGioHang.map(
        (item) =>
          `${item.name}-${this.$formatSoVang(item.klv).fullStr}-${
            item.cong
          }-${this.$formatN(item.giahientai)}`
      );
      let tongtien = parseInt(
        this.selectGioHang.reduce(
          (sum, item) => sum + (item.giahientai || 0),
          0
        )
      );
      let thucnhan = this.$formatN(this.bill.thucnhan || 0);
      console.log(listName);
      let billObject = {
        tongtien,
        thucnhan: parseInt(this.bill.thucnhan),
        tenkhach: this.bill.tenkhach,
        diachi: this.bill.diachi,
        sodienthoai: this.bill.sodienthoai,
        bill_code,
        isPrint: false,
        id_giohang: this.id_giohang,
        chitiet: this.bill.chitiet,
        ghichu: this.bill.ghichu,
        somon: this.selectGioHang.length,
      };

      //tao hoa don
      let hoadon_ban = await this.$insertBill(billObject);
      //cap nhap count gio hang
      await this.$supabase
        .from("giohangsanpham")
        .update({ count_hoadon: count_hoadon + 1 })
        .eq("id", this.id_giohang);
      let _listsp = this.selectGioHang.map((i) => {
        return {
          name: i.name,
          maso: i.maso,
          klt: i.klt,
          klv: i.klv,
          klh: i.klh,
          cong: i.cong,
          gia: i.banggia.sellingPrice,
          giatrixuat: i.giahientai,
          code: i.banggia.code,
        };
      });

      billObject.listsp = _listsp;
      //update vao sanpham
      this.$bvToast.toast(
        `Tạo hóa đơn ${hoadon_ban.bill_code} ${
          this.selectGioHang.length
        } sản phẩm. Tổng tiền hàng ${this.$formatSoTien(
          billObject.tongtien
        )}. Tổng thực nhận ${this.$formatSoTien(thucnhan)}`,
        {
          title: "Thông báo",
          autoHideDelay: 3000,
          appendToast: true,
          variant: "primary",
        }
      );
      for (let listsp = 0; listsp < this.selectGioHang.length; listsp++) {
        let idSp = this.selectGioHang[listsp].id;
        let giatrixuat = this.selectGioHang[listsp].giahientai;
        let objectUpdate = {
          id_hoadonban: hoadon_ban.id,
          daban: true,
          ngayxuat: new Date(),
          giavangxuat: this.selectGioHang[listsp].banggia.sellingPrice,
          giatrixuat,
        };
        let spUpdate = await this.$supabase
          .from("sanpham")
          .update(objectUpdate)
          .eq("id", idSp);
      }
      //update gio hang
      this.getGioHang();
      //tắt sidebar
      this.showTinhToan = false;
      //hienthngbao

      this.$refs.default_tablegiohang.clearSelected();

      this.$root.$emit("bv::toggle::collapse", "sidebargiohang");
      this.bill = {
        tongtien: 0,
        thucnhan: 0,
        tenkhach: "khong",
        diachi: "khong",
        chitiet: "khong",
        ghichu: "khong",
        sodienthoai: "khong",
        id_giohang: null,
        isPrint: false,
        bill_code: null,
        listsanpham: [],
      };
      let bodyStr = `${this.$moment().format(
        "DD/MM/YYYY hh:mm"
      )}*HóaĐơnMới:[${bill_code}]*SốMón:${spLength} *Sp:[${listName}] *Tổng Tiền:${tongtien} *Thực Nhận:${thucnhan}`;
      // await fetch("https://ntfy.sh/tiemvangbaophuong2025", {
      //   method: "POST",
      //   headers: {
      //     Click: "https://simplegold.vercel.app/hoadon/" + hoadon_ban.id,
      //     Tags: ["tada"],
      //   },
      //   body: bodyStr,
      // });

      this.$pnPublish(
        {
          channel: "printserver",
          message: { type: "inhoadon", list: billObject },
        },
        (status, response) => {
          if (status.error) {
            console.log(status);
            this.selectGioHang = [];
          } else {
          }
        }
      );
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
        this.giahientai = Math.round(result / 1000) * 1000;
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
        this.giatrinhap = Math.round(result / 1000) * 1000;
      }
    },
    showModalTaoNhanhHoadon(weight) {
      this.formHoaDonNhanh.klv = weight;
      this.$bvModal.show("modal_taonhanh");
    },
    async switch_in_camdo_onchange(item) {
      this.overlayCamDo = true;
      await this.$supabase
        .from("invoice")
        .update({
          invoice_label: item.invoice_label,
        })
        .eq("id", item.id);
      this.$bvToast.toast(
        `Thay đổi tình trạng IN của gói cầm đồ [${item.invoice_number}].Từ [${
          !item.invoice_label ? "ĐÃ IN" : "CHƯA IN"
        }] thành [${item.invoice_label ? "ĐÃ IN" : "CHƯA IN"}] thành công`,
        {
          title: "Thông báo",
          autoHideDelay: 3000,
          appendToast: true,
          variant: "primary",
        }
      );
      this.overlayCamDo = false;
    },
    async switch_chuoc_camdo_onchange(item) {
      this.overlayCamDo = true;
      await this.$supabase
        .from("invoice")
        .update({
          invoice_status: item.invoice_status,
        })
        .eq("id", item.id);
      this.$bvToast.toast(
        `Thay đổi tình trạng CHUỘC của gói cầm đồ [${
          item.invoice_number
        }].Từ [${!item.invoice_status ? "ĐÃ CHUỘC" : "CHƯA CHUỘC"}] thành [${
          item.invoice_status ? "ĐÃ CHUỘC" : "CHƯA CHUỘC"
        }] thành công`,
        {
          title: "Thông báo",
          autoHideDelay: 3000,
          appendToast: true,
          variant: "primary",
        }
      );
      this.overlayCamDo = false;
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
      //  zoomLens.style.visibility = "hidden";
    },
    getTienLai(x) {
      let tienlai =
        ((x.invoice_money / 1000) *
          this.$moment().diff(this.$moment(x.invoice_date_create), "days") *
          2) /
        3;

      return this.$roundToThousand(tienlai, x.invoice_money);
    },
    async xoaSanPhamGioHang(item) {
      this.overlayGioHang = true;
      this.listGioHang = this.listGioHang.filter((x) => x !== item);
      //xoa reference trong sanpham

      this.$supabase
        .from("sanpham")
        .update({ id_giohang: null })
        .eq("id", item.id)
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
        .select("*")
        .eq("invoice_number", id)
        .then(async (data) => {
          this.tempCheckDothe = data.data[0];

          this.$bvModal.show("modal_camdo");
          //unset
          this.check_invoice_auto();
        });
    },
    checkDoThe_search(id) {
      this.$supabase
        .from("invoice")
        .select("*")
        .eq("invoice_number", id)
        .then(async (data) => {
          if (data.data.length > 0) {
            this.tempCheckDothe = data.data[0];
            console.log(data.data[0]);
            this.$bvModal.show("modal_camdo");
          } else {
            alert("Không tìm thấy Đồ Thế");
          }

          //unset
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
        .from("hoadon_ban")
        .select("*,sanpham(*,banggia(*),nhacungcap(*),kieusanpham(*))")
        .eq("bill_code", String(id))
        .then((data) => {
          this.raw_hoadon = data.data[0];
          console.log(data.data[0]);
          this.$bvModal.show("modalHoaDon");
        });
    },
    async getGioHang() {
      let idGioHang = this.id_giohang;
      this.$supabase
        .from("sanpham")
        .select(
          "*,kieusanpham(*),banggia(*),nhacungcap(*),kihieu(*),giohangsanpham(*),hoadon_ban(*)"
        )
        .eq("id_giohang", idGioHang)
        .then((data) => {
          //   console.log(data);
          this.rawGioHang = data.data;
          let d = data.data;

          d = d.map((item) => {
            //lấy ra giá hiện tại
            let giahientai =
              parseInt(
                (parseInt(item.klv) * parseInt(item.banggia.sellingPrice) +
                  parseInt(item.cong) * 1000) /
                  1000
              ) * 1000;

            return {
              ...item,
              giahientai,
            };
          });
          this.listGioHang = d;
        });
    },
    async insertGioHang(item) {
      // console.log(item);
      let currentDay = this.$moment().format("YYYY-MM-DD");

      if (this.id_giohang != null) {
        //kiểm tra coi sản phẩm này có tồn tại trong giỏ hàng không
        const sanphamhientai = await this.$supabase
          .from("sanpham")
          .select("*", { count: "exact" })
          .eq("maso", item.maso)
          .eq("id_giohang", this.id_giohang);
        let count = sanphamhientai.count;
        if (count > 0) {
          this.$bvToast.toast(
            `Mã sản phẩm ${item.maso} đã tồn tại trong giỏ hàng`,
            {
              title: "Thông báo",
              autoHideDelay: 1000,
              appendToast: true,
              variant: "primary",
            }
          );
        } else {
          await this.$supabase
            .from("sanpham")
            .update({ id_giohang: this.id_giohang })
            .eq("id", item.id);
          //edit sản phẩm

          this.$bvToast.toast(
            `Thêm sản phẩm ${item.maso} vào giỏ hàng ngày ${currentDay} `,
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
        let { data, error } = await this.$supabase
          .from("giohangsanpham")
          .insert({});
        this.insertGioHang(item);
      }
    },
    checkSanPham(id) {
      //DL2083
      id = String(id).toUpperCase();
      //insert to gioHang

      this.$supabase
        .from("sanpham")
        .select(
          "*,kieusanpham(*),banggia(*),nhacungcap(*),kihieu(*),hoadon_ban(*),giohangsanpham(*),sotheodoimuahang(*),hoadonnhap(*,nhacungcap(*))"
        )
        .eq("maso", id)
        .then(async (data) => {
          let d = data.data[0];
          console.log(d);
          //them cac truong
          //giahientai
          d.giahientai = d.klv * d.banggia.sellingPrice + d.cong * 1000;
          //gialech
          if (!d.daban) {
            d.chenhlech = d.giahientai - d.giatrinhap;
          }
          if (d.sotheodoimuahang) {
            d._sotheodoi = d.sotheodoimuahang[0];
          } else {
            d._sotheodoi = null;
          }
          this.itemFromScanner = d;

          this.insertGioHang(d);
          this.$bvModal.show("modal_sanpham");
          // if (d) {
          //   this.itemFromScanner = { ...d, ...a };
          //   //  console.log(this.itemFromScanner);
          //   this.$bvModal.show("modal_sanpham");
          // } else {
          //   alert("Mã sản phẩm không tồn tại");
          // }
        });
    },
    checkSanPham_search(id) {
      //DL2083
      id = String(id).toUpperCase();
      //insert to gioHang
      console.log(id);
      this.$supabase
        .from("sanpham")
        .select(
          "*,kieusanpham(*),banggia(*),nhacungcap(*),kihieu(*),hoadon_ban(*),giohangsanpham(*),sotheodoimuahang(*),hoadonnhap(*,nhacungcap(*))"
        )
        .eq("maso", id)
        .then(async (data) => {
          let d = data.data[0];
          if (d == undefined) {
            this.$bvToast.toast(
              "Có lỗi với Database, dường như dữ liệu cho sản phẩm này bị lỗi",
              {
                title: "Thông báo",
                autoHideDelay: 3000,
                appendToast: true,
                variant: "danger",
              }
            );
            this.overlay_search = false;
            return;
          }
          console.log(d);
          //them cac truong
          //giahientai
          d.giahientai = d.klv * d.banggia.sellingPrice + d.cong * 1000;
          //gialech
          if (!d.daban) {
            d.chenhlech = d.giahientai - d.giatrinhap;
          }
          if (d.sotheodoimuahang) {
            d._sotheodoi = d.sotheodoimuahang[0];
          } else {
            d._sotheodoi = null;
          }
          this.itemFromScanner = d;
          this.overlay_search = false;
          //   this.insertGioHang(d);
          this.$bvModal.show("modal_sanpham");
          // if (d) {
          //   this.itemFromScanner = { ...d, ...a };
          //   //  console.log(this.itemFromScanner);
          //   this.$bvModal.show("modal_sanpham");
          // } else {
          //   alert("Mã sản phẩm không tồn tại");
          // }
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
    subGioHang() {
      console.log("sub giohang");
      this.$supabase
        .from("giohang")
        .on("UPDATE", (payload) => {
          console.log("payload", payload);
        })
        .subscribe();
    },
    subBanggia() {
      // láy bảng giá hiện tại và thêm vào store.banggia_vang
      this.$supabase
        .from("banggia")
        .select("*")
        .then((data) => {
          //có bảng giá
          this.$store.commit("config/setBanggia", data.data);
        });
    },
    async checkGioHangHomNay() {
      let currentDay = this.$moment().format("YYYY-MM-DD");
      // console.log("tìm kiếm giỏ hàng");
      let dataGioHangHienTai = await this.$supabase
        .from("giohangsanpham")
        .select("*")
        .gte("created_at", currentDay);

      if (dataGioHangHienTai.data && dataGioHangHienTai.data.length > 0) {
        console.log("Đã có giỏ hàng");
        this.id_giohang = dataGioHangHienTai.data[0].id;
      } else {
        console.log("tạo mới giỏ hàng");
        let { data, error } = await this.$supabase
          .from("giohangsanpham")
          .insert({})
          .select();
        this.id_giohang = data[0].id;
      }
    },
  },
  async mounted() {
    await this.checkGioHangHomNay();
    this.subBanggia();
    // this.subGioHang();

    let listDisableRouter = ["/camdo/chuocdo", "/chat"];
    var isDisable = listDisableRouter.includes(this.$nuxt.$route.fullPath);
    if (isDisable) {
      return;
    } else {
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
          let regexSp = /^[a-zA-Z]{2}\d+$/;
          let regexDoThe = /^=\-?\d+$/;
          let regexHoadon = /^(\d+)-(\d{8})$/;
          let regexGiayCamDo = /^-{1}\d{6}$/;
          let scannerInput = this.barcodeInput.replace(/[\s\n]+/g, "");
          scannerInput = removeSpecialKeysFromString(scannerInput);

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

            if (regexGiayCamDo.test(scannerInput)) {
              action = "giaycamdo";
            }
            console.log("Barcode detected:", scannerInput, action);
            this.barcodeInput = ""; // Xóa chuỗi sau khi xử lý
            switch (action) {
              case "dothe":
                {
                  scannerInput = scannerInput.replace("=", "");

                  if (this.camdo_kiemtra_giaythe_danhan) {
                    this.check_camdo_kiemtra_buoc2(scannerInput);
                    this.barcodeInput = ""; // Xóa chuỗi sau khi xử lý
                  } else {
                    //binh thuong
                    this.camdo_kiemtra_giaythe_danhan = false;
                    this.checkDoThe(scannerInput);
                    this.barcodeInput = ""; // Xóa chuỗi sau khi xử lý
                  }
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
              case "giaycamdo":
                {
                  this.check_camdo_kiemtra(scannerInput);
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
