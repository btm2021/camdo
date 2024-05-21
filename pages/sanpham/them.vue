<template>
  <div>
    <b-row no-gutters>
      <b-col cols="6">
        <b-overlay :show="!dataReady">
          <b-card>
            <template #header>
              <div class="mb-0">
                <b-form>
                  <b-row>
                    <b-col cols="6"> <b-form-checkbox name="check-button" v-model="inputMode" switch
                        @change="changeInputMode">
                        Chế độ nhập :
                        <b>{{ inputMode ? " Nhập Nhanh" : " Nhập Thường" }}</b>
                        <span v-if="inputMode">(Lấy kết quả từ cân)</span>
                      </b-form-checkbox></b-col>
                    <b-col cols="6">

                      <b-form-checkbox name="check-button" v-model="cameraMode" switch @change="toggleCamera">
                        Trạng thái Camera :
                        <b> {{ cameraMode ? "Đang Bật" : " Đang tắt" }}</b>
                        <span v-if="cameraMode">(Lấy ảnh)</span>
                      </b-form-checkbox>
                    </b-col>
                  </b-row>

                </b-form>
              </div>
            </template>
            <b-form>
              <b-form-group style="display:none;padding: 0px !important" label="Nhập nâng cao:(sẽ giữ lại các mục)">
                <b-form-checkbox-group v-model="inputConfig">
                  <b-form-checkbox value="id_kieusanpham">Kiểu SP</b-form-checkbox>
                  <b-form-checkbox value="cong">Tiền Công</b-form-checkbox>
                  <b-form-checkbox value="id_nhacungcap">Nhà cung cấp</b-form-checkbox>
                  <b-form-checkbox value="id_hamluongvang">Hàm lượng Vàng</b-form-checkbox>
                </b-form-checkbox-group>
              </b-form-group>
            </b-form>
            <ValidationObserver ref="veeForm" v-slot="{ invalid }">
              <b-form ref="bformSanPham" @submit.prevent="insertSanPham">
                <b-row>
                  <b-col cols="4">
                    <ValidationProvider rules="required" v-slot="{ errors, valid, failedRules }">
                      <b-form-group :state="valid" label="Kiểu SP:" :description="valid
                        ? 'ID Kiểu SP:' + formSanPham.id_kieusanpham
                        : ''
                        ">
                        <b-form-select :state="valid" :options="list_option.kieusanpham" required
                          v-model="formSanPham.id_kieusanpham"></b-form-select>
                        <b-form-invalid-feedback>
                          Chọn loại sản phẩm
                        </b-form-invalid-feedback>
                      </b-form-group>
                    </ValidationProvider>
                  </b-col>

                  <b-col cols="4">
                    <ValidationProvider rules="required" v-slot="{ errors, valid, failedRules }">
                      <b-form-group label="Nhà cung cấp:" :description="valid
                        ? 'ID Nhà cung cấp:' + formSanPham.id_nhacungcap
                        : ''
                        ">
                        <b-form-select :state="valid" :options="list_option.nhacungcap" required
                          v-model="formSanPham.id_nhacungcap"></b-form-select>
                        <b-form-invalid-feedback>
                          Chọn nhà cung cấp
                        </b-form-invalid-feedback>
                      </b-form-group>
                    </ValidationProvider>
                  </b-col>
                  <b-col cols="4">
                    <ValidationProvider rules="required" v-slot="{ errors, valid, failedRules }">
                      <b-form-group label="Hàm Lượng Vàng:" :description="valid
                        ? 'ID Hàm lượng vàng :' +
                        formSanPham.id_hamluongvang
                        : ''
                        ">
                        <b-form-select :state="valid" :options="list_option.hamluongvang" required
                          v-model="formSanPham.id_hamluongvang"></b-form-select>
                        <b-form-invalid-feedback>
                          Chọn hàm lượng vàng
                        </b-form-invalid-feedback>
                      </b-form-group>
                    </ValidationProvider>
                  </b-col>

                  <b-col cols="4">
                    <ValidationProvider rules="required" v-slot="{ errors, valid, failedRules }">
                      <b-form-group label="Kí hiệu:" :description="valid
                        ? 'ID Hàm lượng vàng :' + formSanPham.id_kihieu
                        : ''
                        ">
                        <b-form-select :state="valid" :options="list_option.kihieu" required
                          v-model="formSanPham.id_kihieu"></b-form-select>
                        <b-form-invalid-feedback>
                          Chọn kí hiệu sản phẩm
                        </b-form-invalid-feedback>
                      </b-form-group>
                    </ValidationProvider>
                  </b-col>
                  <b-col cols="4">
                    <b-form-group label="Mã sản phẩm">
                      <b-overlay :show="overlay.maso">
                        <b-form-input disabled autocomplete="off" v-model="formSanPham.maso"></b-form-input>
                      </b-overlay>
                    </b-form-group>
                  </b-col>
                  <b-col cols="4">
                    <b-form-group label="Tên sản phẩm">
                      <b-overlay :show="overlay.name">
                        <b-form-input disabled autocomplete="off" v-model="formSanPham.name"></b-form-input></b-overlay>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="5">
                    <ValidationProvider rules="required|min_value:0|max_value:10000|numeric"
                      v-slot="{ errors, valid, failedRules }">
                      <b-form-group label="Tiền công" :description="valid
                        ? 'Tiền công : ' +
                        $formatN(parseInt(formSanPham.cong || 0))
                        : ''
                        ">
                        <b-form-input required min="0" max="10000" type="number" :state="valid" autocomplete="off"
                          v-model="formSanPham.cong">
                        </b-form-input>
                        <b-form-invalid-feedback>
                          Nhập sai tiền công
                        </b-form-invalid-feedback>
                      </b-form-group>
                    </ValidationProvider>
                    <ValidationProvider rules="required|min_value:0|max_value:10000|numeric"
                      v-slot="{ errors, valid, failedRules }">
                      <b-form-group label="TL.Hột" :description="valid
                        ? 'Trọng lượng đá : ' +
                        $formatSoVang(formSanPham.klh).fullStr
                        : ''
                        ">
                        <b-form-input autocomplete="off" v-model="formSanPham.klh" type="number"
                          :state="valid"></b-form-input>
                        <b-form-invalid-feedback>
                          Xin nhập đúng trọng lượng HỘT
                        </b-form-invalid-feedback>
                      </b-form-group>
                    </ValidationProvider>

                    <ValidationProvider rules="required|min_value:0|max_value:100000|numeric"
                      v-slot="{ errors, valid, failedRules }">
                      <b-form-group label="TL.Tổng" :description="valid
                        ? 'Trọng lượng tổng : ' +
                        $formatSoVang(formSanPham.klt).fullStr
                        : ''
                        ">
                        <b-form-input autocomplete="off" v-model="formSanPham.klt" type="number"
                          :state="valid"></b-form-input>
                        <b-form-invalid-feedback>
                          Xin nhập đúng trọng lượng TỔNG
                        </b-form-invalid-feedback>
                      </b-form-group>
                    </ValidationProvider>
                    <ValidationProvider rules="required|min_value:10|max_value:100000|numeric"
                      v-slot="{ errors, valid, failedRules }">
                      <b-form-group label="TL.Vàng" :description="valid
                        ? 'Trọng lượng vàng : ' +
                        $formatSoVang(formSanPham.klv).fullStr
                        : ''
                        ">
                        <b-form-input v-model="formSanPham.klv" autocomplete="off" type="number"
                          :state="valid"></b-form-input>
                        <b-form-invalid-feedback>
                          Xin nhập đúng trọng lượng VÀNG
                        </b-form-invalid-feedback>
                      </b-form-group>
                    </ValidationProvider>
                  </b-col>
                  <b-col cols="7">

                    <div style="max-width: 100%; position: relative">
                      <video ref="camera" autoplay width="100%" id="cameraDiv"></video>

                      <div id="topLeftControls" style="position: absolute; top: 5px; left: 5px">
                        <b-button variant="warning" id="rotateLeft" @click="rotationLeft">
                          -
                        </b-button>
                      </div>
                      <div id="topRightControls" style="position: absolute; top: 5px; right: 5px">
                        <b-button variant="warning" id="rotateRight" @click="rotationRight">
                          +
                        </b-button>
                      </div>
                      <div id="bottomLeftControls" style="position: absolute; bottom: 10px; left: 5px">
                        <b-button variant="warning" id="flipHorizontal" @click="flipHoz">
                          D
                        </b-button>
                      </div>
                      <div id="bottomRightControls" style="position: absolute; bottom: 10px; right: 5px">
                        <b-button variant="warning" id="flipVertical" @click="flipVert">N</b-button>
                      </div>

                      <canvas v-if="$refs.camera" style="display: none" id="canvas" ref="canvas"></canvas>
                    </div>
                    <b-button type="submit" block variant="primary">Thêm</b-button>
                  </b-col>
                </b-row>
              </b-form>
            </ValidationObserver>
          </b-card>
        </b-overlay>
      </b-col>
      <b-col cols="6">
        <b-card>
          <template #header>
            <div class="mb-0">
              <b-row>
                <b-col cols="6"></b-col>
                <b-col cols="6"></b-col>
              </b-row>
              <span>Số sản phẩm đã nhập</span>
              <b-button size="sm" variant="primary" @click="intemSingle">In Tem toàn bộ</b-button>
            </div>
          </template>
          <b-card-body style="padding: 0px; margin: 0px">
            <b-table responsive small hover selectable select-mode="single" show-empty striped :items="productList"
              @row-selected="onRowSelected" class="text-center" :fields="fieldsSanPham">
              <template #cell(stt)="data">
                {{ data.index + 1 }}
              </template>
              <template #cell(tool)="data">
                <b-button variant="danger" @click="deleteItem(data.item)">X</b-button>
              </template>
              <template #cell(product_image_url)="data">
                <div>
                  <b-img thumbnail rounded v-zoom-on-hover center :src="data.item.anhsanpham" fluid height="100"
                    width="100"></b-img>
                </div>
              </template>
              <template #cell(product_catalog)="data">
                <span>{{
                  optionCatalog.find(
                    (x) => x.value == data.item.product_catalog
                  ).text
                }}</span>
              </template>
            </b-table>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { extend, configure } from "vee-validate";

import * as rules from "vee-validate/dist/rules";
Object.keys(rules).forEach((rule) => {
  //console.log(rule);
  extend(rule, rules[rule]);
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  computed: {
    id_kieusanpham() {
      return this.formSanPham.id_kieusanpham;
    },
    klt() {
      return this.formSanPham.klt;
    },
    klh() {
      return this.formSanPham.klh;
    },
    ncc() {
      return this.formSanPham.id_nhacungcap;
    },
    cong() {
      return this.formSanPham.cong;
    },
    _hamluongvang() {
      return this.formSanPham.id_hamluongvang;
    },
  },
  watch: {
    _hamluongvang(newVal, oldVal) {
      if (newVal) {
        let gia = this.hamluongvang.find((i) => i.id === newVal);
        this.formSanPham.giavangnhap =
          gia.sellingPrice - this.formSanPham.multiGiaVang;
      }
    },
    async id_kieusanpham(newVal, oldVal) {
      if (newVal) {
        this.overlay.maso = true;
        this.overlay.name = true;
        let name = this.kieusanpham.find((i) => i.id === newVal);
        this.formSanPham.name = name.short || "";
        //count
        let countLastId = 0;
        let notValid = true;
        do {

          let lastItem = await this.$supabase.from("sanpham").select("id").order("id", { ascending: false }).limit(1)
          let lastId = parseInt(lastItem.data[0].id) + countLastId
          let maso = `${name.barcode}${lastId}`;

          let isExits = await this.$supabase.from('sanpham').select('*', { count: 'exact', head: true }).eq('maso', maso)
          let isExitsTemp = await this.$supabase.from('temp_maso').select('*', { count: 'exact', head: true }).eq('maso', maso)
          //kiểm tra, nếu cả 2 đều không trùng mới gọi là đúng
          console.log(isExits.count, isExitsTemp.count, maso)
          if (isExits.count == 0 && isExitsTemp.count == 0) {

            console.log('không trùng')
            //tạo 1 temp
            let temp_maso = await this.$supabase.from("temp_maso").insert({
              maso,
              so: lastId
            }).select("*")

            this.temp_maso = temp_maso.data[0];
            console.log(this.temp_maso)
            this.formSanPham.maso = maso
            this.overlay.maso = false;
            this.overlay.name = false;
            notValid = false;
          } else {
            //1 trong 2 trùng, tăng lastId
            countLastId++;
          }
        } while (notValid)
        // this.$supabase
        //   .from("sanpham")
        //   .select("id")
        //   .order("id", { ascending: false })
        //   .limit(1)
        //   .then(async (data) => {
        //     let isValid = false;
        //     do {
        //       let maso = "";
        //       if (data.data.length > 0) {
        //         maso = `${name.barcode}${data.data[0].id}`;
        //       } else {
        //         maso = `${name.barcode}1`;
        //       }
        //       let isExits = await this.$supabase.from('sanpham').select('*', { count: 'exact', head: true }).eq('maso', maso)
        //       if(isExits.count<0){
        //       isValid=true
        //       }
        //     } while (isValid)


        //     this.formSanPham.maso = maso;
        //     this.overlay.maso = false;
        //     this.overlay.name = false;
        //   });
      }
      //tên
    },
    klt(newVal, oldVal) {
      if (newVal) {
        this.updateGoldWeight();
      }
    },
    klh(newVal, oldVal) {
      if (newVal) {
        this.updateGoldWeight();
      }
    },
    ncc(newVal, oldVal) {
      if (newVal) {
        let ncc = this.nhacungcap.find((i) => i.id === newVal);
        this.formSanPham.multi = parseFloat(ncc.tiencong);
        this.formSanPham.giacongnhap =
          ncc.tiencong * this.formSanPham.cong || 0;
        this.formSanPham.multiGiaVang = parseFloat(ncc.giavang);
      }

      //  this.formSanPham.giacongnhap = ncc.tiencong * this.formSanPham.cong || 0;
      //giavangnhap
    },
    cong(newVal, oldVal) {
      if (newVal) {
        this.formSanPham.giacongnhap = newVal * this.formSanPham.multi;
      }
    },
  },
  data() {
    return {
      temp_maso: null,
      //rotation
      rotationAngle: 180,
      fh: 1,
      fd: 1,
      //
      productList: [],
      inputConfig: [],
      cameraMode: false,
      overlay: {
        maso: false,
        name: false,
      },
      fieldsSanPham: [
        { key: "stt", label: "#", tdClass: "align-middle" },
        { key: "product_image_url", label: "Avatar", tdClass: "align-middle" },
        { key: "maso", label: "Mã", tdClass: "align-middle" },
        { key: "id_kieusanpham", label: "Kiểu", tdClass: "align-middle" },
        {
          tdClass: "align-middle",
          key: "klt",
          label: "TL.Tổng",
          formatter: (v) => {
            return this.$formatSoVang(v).fullStr;
          },
        },

        {
          tdClass: "align-middle",
          key: "klh",
          label: "TL.Hột",
          formatter: (v) => {
            return this.$formatSoVang(v).fullStr;
          },
        },
        {
          tdClass: "align-middle",
          key: "klv",
          label: "TL.Vàng",
          formatter: (v) => {
            return this.$formatSoVang(v).fullStr;
          },
        },
        {
          tdClass: "align-middle",
          key: "id_kieusanpham",
          label: "K",
        },
        { key: "cong", label: "C", tdClass: "align-middle" },
        { key: "Tool", label: "#", tdClass: "align-middle" },
      ],
      sanpham: {},
      dataReady: false,
      kihieu: null,
      kieusanpham: null,
      hamluongvang: null,
      inputMode: false,
      nhacungcap: null,
      formSanPham: {
        multiGiaVang: 30,
        multi: 1,
        name: null,
        klt: null,
        klh: null,
        klv: null,
        cong: null,
        id_kihieu: 5,
        id_kieusanpham: null,
        id_hamluongvang: null,
        id_nhacungcap: null,
        anhsanpham: null,
        ngayxuat: null,
        giacongnhap: null,
        giavangnhap: null,
        giavangxuat: null,
        maso: null,
        product_intem: false,
        chenhlech: null,
      },
      selected: null,
      list_option: {
        kieusanpham: [],
        kihieu: [],
        nhacungcap: [],
        hamluongvang: [],
      },
    };
  },
  methods: {
    async getMaSo(barcode, id) {
      return new Promise((resolve, reject) => {
        this.$supabase
          .from("sanpham")
          .select("id")
          .order("id", { ascending: false })
          .limit(1)
          .then(async (data) => {

          })

      })
    },
    async intemSingle() {

      if (this.productList.length > 0) {
        let myarr = this.productList.map(item => {
          return {
            id: item.id,
            ncc: item.nhacungcap.name,
            ncc_diachi: item.nhacungcap.address,
            tccs: item.nhacungcap.tccs,
            ten: item.name,
            kihieu: item.kihieu.short,
            klt: item.klt,
            klv: item.klv,
            klh: item.klh,
            cong: item.cong,
            hamluongvang: item.banggia.code,
            maso: item.maso
          }
        })

        this.$pl_sanpham_intem(this, myarr).then(data => {
          this.productList = [];
          alert('Chờ máy in ra rồi bấm OK')
          window.location.reload()
        })

      } else {
        alert("Không có gì để in");
      }
    },
    //rotale
    rotationLeft() {
      this.rotationAngle -= 10;
      this.updateVideo();
    },
    rotationRight() {
      this.rotationAngle += 10;
      this.updateVideo();
    },
    flipHoz() {
      this.fh *= -1;
      this.updateVideo();
    },
    flipVert() {
      this.fd *= -1;
      this.updateVideo();
    },
    updateVideo() {
      document.getElementById(
        "cameraDiv"
      ).style.transform = `rotate(${this.rotationAngle}deg) scaleX(${this.fd}) scaleY(${this.fh})`;
    },
    //
    //get scale
    connectToPort() {
      if ("serial" in navigator) {
        console.log("support");
        // The Web Serial API is supported.
      } else {
        console.log("not support");
      }
    },
    extractFloatValue(dataString) {
      const regex = /[+-]?\d+(\.\d+)?/;
      const matches = dataString.match(regex);

      if (matches && matches[0]) {
        return parseFloat(matches[0]);
      } else {
        return null; // Trả về null nếu không tìm thấy số float
      }
    },
    customRound(value) {
      // Lấy phần chục và đơn vị của số
      const tens = Math.floor(value / 10) * 10;
      const units = value % 10;

      if (units <= 3) {
        // Làm tròn xuống
        return tens;
      } else if (units <= 7) {
        // Làm tròn đến giữa của khoảng chục
        return tens + 5;
      } else {
        // Làm tròn lên
        return tens + 10;
      }
    },
    async changeInputMode() {
      if (!navigator.serial) {
        console.log("Web Serial API not supported in this browser.");
        return;
      }

      try {
        // Yêu cầu mở cổng Serial
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });

        const reader = port.readable.getReader();
        let receivedData = "";
        let decoder = new TextDecoder();
        console.log("asd")
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              // Đóng đối tượng đọc khi không còn dữ liệu
              reader.releaseLock();
              break;
            }
            // Chuyển đổi giá trị nhận được thành chuỗi
            const text = decoder.decode(value, { stream: true });

            // Kiểm tra xem có ký tự kết thúc dòng trong chuỗi không
            const lines = (receivedData + text).split(/\r?\n/);
            receivedData = lines.pop(); // Lưu dữ liệu chưa hoàn chỉnh

            lines.forEach((line) => {
              // Xử lý mỗi dòng hoàn chỉnh

              let d = this.extractFloatValue(line) * 10000;
              // Làm gì đó với dòng dữ liệu (line)
              let roundedValue = this.customRound(d);
              this.formSanPham.klt = roundedValue;
            });
          }
        } finally {
          reader.releaseLock();
        }

        await port.close();
      } catch (error) {
        console.error("Error reading data:", error);
      }
    },
    //
    resetForm() {
      let newform = {
        multi: 1,
        multiGiaVang: 30,
        name: null,
        klt: null,
        klh: null,
        klv: null,
        cong: null,
        id_kihieu: 5,
        id_kieusanpham: null,
        id_hamluongvang: null,
        id_nhacungcap: null,
        anhsanpham: null,
        ngayxuat: null,
        giacongnhap: null,
        giavangnhap: null,
        giavangxuat: null,
        maso: null,
        product_intem: false,
        chenhlech: false,
      };
      this.inputConfig.forEach((item) => {
        newform[item] = this.formSanPham[item];
      });
      this.formSanPham = newform;
    },
    onRowSelected(item) {
      this.selected = item;
    },
    deleteItem(item) {
      this.$deletePicture(`${item.maso}.webp`).then((data) => {
        this.$supabase
          .from("sanpham")
          .delete()
          .eq("id", item.id)
          .then((data) => {
            this.productList = this.productList.filter((i) => i.id != item.id);
            this.$bvToast.toast(`Xóa sản phẩm ${item.maso} thành công`, {
              title: "Thông báo",
              autoHideDelay: 1000,
              appendToast: true,
              variant: "primary",
            });
          });
      });
    },
    insertSanPham() {
      this.$refs.veeForm.validate().then(async (success) => {
        if (success) {
          this.dataReady = false;
          let fileName = this.formSanPham.maso;
          let anhmacdinh = this.kieusanpham.find(i => i.id === this.formSanPham.id_kieusanpham)

          if (this.cameraMode) {
            this.takePhoto();
            const canvas = document.getElementById("canvas");
            const imageData = canvas.toDataURL("image/webp", 0.5);
            let uploadResult = await this.$uploadPicture(fileName, imageData);
            this.formSanPham.anhsanpham = `https://pub-91065b58011a4fbca1134c0087aa4350.r2.dev/${uploadResult.data.Key}`;
          } else {
            this.formSanPham.anhsanpham = anhmacdinh.default_picture
          }
          // this.formSanPham.anhsanpham = this.formSanPham.maso;
          let giatrinhap = parseFloat(this.formSanPham.klv) * parseFloat(this.formSanPham.giavangnhap) + (parseFloat(this.formSanPham.giacongnhap * 1000))

          let objectInsert = {
            name: this.formSanPham.name,
            klt: parseFloat(this.formSanPham.klt),
            klh: parseFloat(this.formSanPham.klh),
            klv: parseFloat(this.formSanPham.klv),
            cong: parseInt(this.formSanPham.cong),
            id_kihieu: parseInt(this.formSanPham.id_kihieu),
            id_kieusanpham: parseInt(this.formSanPham.id_kieusanpham),
            id_hamluongvang: parseInt(this.formSanPham.id_hamluongvang),
            id_nhacungcap: parseInt(this.formSanPham.id_nhacungcap),
            anhsanpham: this.formSanPham.anhsanpham,
            giacongnhap: parseInt(this.formSanPham.giacongnhap || 0),
            giavangnhap: parseInt(this.formSanPham.giavangnhap || 0),
            maso: this.formSanPham.maso,
            product_intem: false,
            giatrinhap
          };
          console.log(objectInsert)
          let product = await this.$supabase
            .from("sanpham")
            .insert(objectInsert)
            .select("*,kieusanpham(*),banggia(*),nhacungcap(*),kihieu(*)");
          this.productList.push(product.data[0]);
          //xóa temp_maso
          await this.$supabase.from('temp_maso').delete().eq('id', this.temp_maso.id)
          //tạo 1 hóa đơn nhập

          console.log('xoa temp maso')

          this.resetForm();
          this.dataReady = true;
          this.makeHoadonnhap(product.data[0]).then(data => {
            console.log('Tạo 1 hóa đơn nhập tương ứng cho ' + product.data[0].id)
            console.log(data)
          })
        }
      });
    },
    async makeHoadonnhap(d) {
      return new Promise(async (resolve, reject) => {
        console.log('bat dau tao hoadonnhap')
        let tbCCCD = await this.$supabase.from("cccd").select();
        let listCCCD = tbCCCD.data;
        let randomCCCD =
          listCCCD[Math.floor(Math.random() * listCCCD.length)];
        let thanhtien = (d.klv + d.klv * 0.1) * (d.banggia.sellingPrice - 100);
        thanhtien = Math.round(thanhtien / 10000) * 10;
        let objectSoTheoDoi = {
          created_at: d.created_at, //random date ( từ 1/1/2024 hiện tại)
          id_masanpham: d.id,
          tenkhach: randomCCCD.ten,
          diachi: randomCCCD.diachi,
          ghichu: "BÁN",
          sanpham: d.name,
          id_banggia: d.banggia.id,
          id_nhacungcap: d.id_nhacungcap,
          klt: d.klt + d.klt * 0.1,
          klv: d.klv + d.klv * 0.1,
          klh: d.klh,
          giamua: d.banggia.sellingPrice - 100,
          thanhtien,
          cccd: randomCCCD.cccd,
        };
        let objectSo = await this.$supabase
          .from("sotheodoimuahang")
          .insert(objectSoTheoDoi)
          .select();
        resolve(objectSo.data[0])
      })
    },
    updateGoldWeight() {
      let klt = parseFloat(this.formSanPham.klt || 0);
      let klh = parseFloat(this.formSanPham.klh || 0);
      let klv = klt - klh;
      this.formSanPham.klv = klv;
    },
    async getOption_kieusanpham() {
      return new Promise((resolve, reject) => {
        this.$supabase
          .from("kieusanpham")
          .select()
          .then((data) => {
            resolve(data.data);
          });
      });
    },
    async getOption_kihieu() {
      return new Promise((resolve, reject) => {
        this.$supabase
          .from("kihieu")
          .select()
          .then((data) => {
            resolve(data.data);
          });
      });
    },
    async getOption_nhacungcap() {
      return new Promise((resolve, reject) => {
        this.$supabase
          .from("nhacungcap")
          .select()
          .then((data) => {
            resolve(data.data);
          });
      });
    },
    async getOption_banggia() {
      return new Promise((resolve, reject) => {
        this.$supabase
          .from("banggia")
          .select()
          .then((data) => {
            resolve(data.data);
          });
      });
    },
    async init() {
      this.dataReady = false;
      this.kihieu = await this.getOption_kihieu();
      this.list_option.kihieu = this.kihieu.map((item) => {
        return {
          value: item.id,
          text: item.short,
        };
      });
      this.kieusanpham = await this.getOption_kieusanpham();

      this.list_option.kieusanpham = this.kieusanpham.map((item) => {
        return {
          value: item.id,
          text: item.short,
        };
      });

      this.hamluongvang = await this.getOption_banggia();
      this.list_option.hamluongvang = this.hamluongvang.map((item) => {
        return {
          value: item.id,
          text: item.code,
        };
      });

      this.nhacungcap = await this.getOption_nhacungcap();
      this.list_option.nhacungcap = this.nhacungcap.map((item) => {
        return {
          value: item.id,
          text: item.short,
        };
      });

      this.dataReady = true;
    },
    //camera

    toggleCamera() {
      if (this.cameraMode) {

        this.isCameraOpen = true;
        this.createCameraElement();
      } else {
        window.location.reload()
      }
    },

    createCameraElement() {
      try {
        const constraints = (window.constraints = {
          audio: false,
          video: true,
        });

        navigator.mediaDevices
          .getUserMedia(constraints)
          .then((stream) => {
            this.$refs.camera.srcObject = stream;
          })
          .catch((error) => {
            console.log(error);
            alert("May the browser didn't support or there is some errors.");
          });
      } catch (err) { }
    },

    takePhoto() {
      // Lấy tham chiếu tới thẻ video và canvas
      const videoElement = this.$refs.camera;
      const canvasElement = document.getElementById("canvas");
      const context = canvasElement.getContext("2d");

      // Đảm bảo rằng video không phải là null và đang phát
      if (videoElement && !videoElement.paused && !videoElement.ended) {
        // Thiết lập kích thước của canvas bằng kích thước của video
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;

        // Xoay và lật context của canvas giống như đã làm với video
        context.translate(canvasElement.width / 2, canvasElement.height / 2);
        context.rotate((this.rotationAngle * Math.PI) / 180);
        context.scale(this.fd, this.fh);

        // Vẽ ảnh từ video lên canvas
        // Điều chỉnh tọa độ và kích thước vẽ để phù hợp với biến đổi
        context.drawImage(
          videoElement,
          -canvasElement.width / 2,
          -canvasElement.height / 2,
          canvasElement.width,
          canvasElement.height
        );

        // Quay context trở lại trạng thái ban đầu
        context.rotate(-(this.rotationAngle * Math.PI) / 180);
        context.scale(1 / this.fd, 1 / this.fh);
        context.translate(-canvasElement.width / 2, -canvasElement.height / 2);
      } else {
        console.error("Không thể chụp ảnh: Video không sẵn sàng.");
      }
    },
    onCameraLoaded(e) {
      console.log(e);
    },
    downloadImage() {
      const download = document.getElementById("downloadPhoto");
      const canvas = document
        .getElementById("photoTaken")
        .toDataURL("image/jpeg")
        .replace("image/jpeg", "image/octet-stream");
      download.setAttribute("href", canvas);
    },
    //end camera
  },
  mounted() {
    this.init();
    this.updateVideo();
  },
};
</script>

<style></style>