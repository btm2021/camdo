<template>
  <div>
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
              <b-dropdown-item href="/sanpham/intem"
                >In tem sản phẩm</b-dropdown-item
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
    return {};
  },

  mounted() {
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
        let regexHoadon = /^(\d+)-(\d{8})$/;
        let scannerInput = this.barcodeInput.replace(/[\s\n]+/g, "");
        console.log(scannerInput);
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
  },
};
</script>
  
  <style>
</style>
  