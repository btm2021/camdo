<template>
  <div>
    <b-row no-gutters>
      <b-modal
        no-close-on-backdrop
        no-close-on-esc
        hide-footer
        id="modal_nhansanpham"
        title="Nhân sản phẩm"
      >
        <b-overlay :show="nhanOverlay">
          <template #overlay>
            <div style="width: 100%">
              <b-progress
                style="width: 200px; height: 50px"
                :value="solannhanCount"
                :max="solannhan"
                show-progress
                animated
                show-value
              ></b-progress>
            </div>
          </template>
          <ValidationObserver v-slot="{ invalid }" ref="formNhanSanPham">
            <b-form @submit.prevent="nhansanpham">
              <ValidationProvider
                rules="required|min_value:0|max_value:100|numeric"
                v-slot="{ errors, valid, failedRules }"
              >
                <b-form-group
                  label="Số lần nhân"
                  :description="'Số sản phẩm được nhân : ' + solannhan"
                >
                  <b-form-input
                    :state="valid"
                    v-model="solannhan"
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                  >
                  </b-form-input>
                </b-form-group>

                <b-button type="submit" variant="primary">Nhân</b-button>
              </ValidationProvider>
            </b-form>
          </ValidationObserver>
        </b-overlay>
      </b-modal>
      <b-col cols="6">
        <b-overlay :show="insertOverlay">
          <b-card style="margin: 0px">
            <template #header>
              <div class="mb-0">
                <b-form-checkbox
                  name="check-button"
                  v-model="inputMode"
                  @change="changeInputMode"
                  switch
                >
                  Chế độ nhập
                  <b>{{ inputMode ? "Nhập Nhanh" : "Nhập Thường" }}</b>
                  <span v-if="inputMode">(Lấy kết quả từ cân)</span>
                </b-form-checkbox>
              </div>
            </template>
            <b-card-body style="padding: 0px !important">
              <b-form-group
                style="padding: 0px !important"
                label="Nhập nâng cao:(sẽ giữ lại các mục)"
              >
                <b-form-checkbox-group v-model="inputConfig">
                  <b-form-checkbox value="product_catalog"
                    >Kiểu dáng SP</b-form-checkbox
                  >
                  <b-form-checkbox value="product_wage"
                    >Tiền Công</b-form-checkbox
                  >
                  <b-form-checkbox value="product_import_type"
                    >Nguồn gốc</b-form-checkbox
                  >
                  <b-form-checkbox value="product_type"
                    >Loại Vàng</b-form-checkbox
                  >
                </b-form-checkbox-group>
              </b-form-group>
              <ValidationObserver v-slot="{ invalid }" ref="formThem">
                <b-form @submit.prevent="insertSanPham">
                  <b-form-row>
                    <b-col cols="6">
                      <b-form-row>
                        <b-col cols="6">
                          <ValidationProvider
                            rules="required"
                            v-slot="{ errors, valid, failedRules }"
                          >
                            <b-form-group
                              label="Kiểu dáng  sản phẩm"
                              :description="
                                valid ? 'KDáng:' + form.product_catalog : ''
                              "
                            >
                              <b-form-select
                                :state="valid"
                                @change="changeCatalog"
                                v-model="form.product_catalog"
                                :options="optionCatalog"
                              ></b-form-select>
                              <b-form-invalid-feedback>
                                Chọn loại sản phẩm
                              </b-form-invalid-feedback>
                            </b-form-group>
                          </ValidationProvider>
                        </b-col>
                        <b-col cols="6">
                          <ValidationProvider rules="required">
                            <b-form-group
                              label="Nguồn Sản phẩm"
                              :description="
                                form.product_import_type
                                  ? 'Nhập chành'
                                  : 'Nhập nội bộ '
                              "
                            >
                              <b-form-checkbox
                                switch
                                size="lg"
                                v-model="form.product_import_type"
                              >
                              </b-form-checkbox>
                            </b-form-group>
                          </ValidationProvider>
                        </b-col>
                      </b-form-row>

                      <ValidationProvider
                        rules="required|min_value:0|max_value:10000|numeric"
                        v-slot="{ errors, valid, failedRules }"
                      >
                        <b-form-group
                          label="Trọng lượng đá:"
                          :description="
                            valid
                              ? 'Trọng lượng đá : ' +
                                $formatSoVang(form.product_stone_weight).fullStr
                              : ''
                          "
                        >
                          <b-form-input
                            v-model="form.product_stone_weight"
                            type="number"
                            autocomplete="off"
                            :state="valid"
                          ></b-form-input>
                          <b-form-invalid-feedback>
                            Nhập sai trọng lượng đá
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </ValidationProvider>

                      <ValidationProvider
                        rules="required"
                        v-slot="{ errors, valid, failedRules }"
                      >
                        <b-form-group label="Loại vàng">
                          <b-form-select
                            @change="loaiVangChange"
                            :state="valid"
                            v-model="form.product_type"
                            :options="optionLoaiVang"
                          ></b-form-select>
                          <b-form-invalid-feedback>
                            Nhập sai loại vàng
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </ValidationProvider>
                      <ValidationProvider
                        rules="required|min_value:0|max_value:10000|numeric"
                        v-slot="{ errors, valid, failedRules }"
                      >
                        <b-form-group
                          label="Tiền công:"
                          :description="
                            valid
                              ? 'Tiền công : ' +
                                $formatN(parseInt(form.product_wage || 0))
                              : ''
                          "
                        >
                          <b-form-input
                            v-model="form.product_wage"
                            type="number"
                            autocomplete="off"
                            :state="valid"
                          ></b-form-input>
                          <b-form-invalid-feedback>
                            Nhập sai tiền công
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </ValidationProvider>

                      <ValidationProvider
                        rules="required|min_value:0|max_value:10000|numeric"
                        v-slot="{ errors, valid, failedRules }"
                      >
                        <b-form-group
                          label="Trọng lượng tổng:"
                          :description="
                            valid
                              ? 'Trọng lượng tổng : ' +
                                $formatSoVang(form.product_total_weight).fullStr
                              : ''
                          "
                        >
                          <b-form-input
                            v-model="form.product_total_weight"
                            type="number"
                            autocomplete="off"
                            :state="valid"
                          ></b-form-input>
                          <b-form-invalid-feedback>
                            Nhập sai trọng lượng
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </ValidationProvider>
                    </b-col>
                    <b-col cols="6">
                      <b-form-group
                        label="Mã sản phẩm"
                        :description="'Mã sản phẩm : ' + form.product_barcode"
                      >
                        <b-form-input
                          disabled
                          v-model="form.product_barcode"
                          type="text"
                        ></b-form-input
                      ></b-form-group>
                      <ValidationProvider
                        rules="required|min_value:10|max_value:1000000|numeric"
                        v-slot="{ errors, valid, failedRules }"
                      >
                        <b-form-group
                          label="Trọng lượng vàng"
                          :description="
                            valid
                              ? 'Trọng lượng vàng ' +
                                $formatSoVang(form.product_gold_weight).fullStr
                              : ''
                          "
                        >
                          <b-form-input
                            disabled
                            v-model="form.product_gold_weight"
                            type="text"
                            :state="valid"
                          ></b-form-input>
                          <b-form-invalid-feedback>
                            Nhập sai trọng lượng
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </ValidationProvider>
                      <div style="max-width: 100%; position: relative">
                        <video
                          ref="camera"
                          autoplay
                          width="100%"
                          id="cameraDiv"
                        ></video>

                        <div
                          id="topLeftControls"
                          style="position: absolute; top: 5px; left: 5px"
                        >
                          <b-button
                            variant="warning"
                            @click="rotationLeft"
                            id="rotateLeft"
                          >
                            -
                          </b-button>
                        </div>
                        <div
                          id="topRightControls"
                          style="position: absolute; top: 5px; right: 5px"
                        >
                          <b-button
                            variant="warning"
                            @click="rotationRight"
                            id="rotateRight"
                          >
                            +
                          </b-button>
                        </div>
                        <div
                          id="bottomLeftControls"
                          style="position: absolute; bottom: 10px; left: 5px"
                        >
                          <b-button
                            variant="warning"
                            id="flipHorizontal"
                            @click="flipHoz"
                          >
                            D
                          </b-button>
                        </div>
                        <div
                          id="bottomRightControls"
                          style="position: absolute; bottom: 10px; right: 5px"
                        >
                          <b-button
                            variant="warning"
                            @click="flipVert"
                            id="flipVertical"
                            >N</b-button
                          >
                        </div>

                        <canvas
                          v-if="$refs.camera"
                          style="display: none"
                          id="canvas"
                          ref="canvas"
                          :width="getWidth"
                          :height="getHeight"
                        ></canvas>
                      </div>
                    </b-col>
                  </b-form-row>

                  <b-button type="submit" variant="primary"
                    >Thêm sản phẩm</b-button
                  >
                </b-form>
              </ValidationObserver>
            </b-card-body>
          </b-card>
        </b-overlay>
      </b-col>
      <b-col cols="6">
        <b-card>
          <template #header>
            <div class="mb-0">
              <span>Số sản phẩm đã nhập</span>
              <b-button variant="primary" size="sm" @click="inTemSelect"
                >In Tem Toàn Bộ</b-button
              >
              <b-button
                variant="success"
                size="sm"
                @click="show_modal_nhansanpham"
                >Nhân sản phẩm</b-button
              >
            </div>
          </template>
          <b-card-body style="padding: 0px; margin: 0px">
            <b-table
              responsive
              small
              hover
              selectable
              select-mode="single"
              show-empty
              striped
              :items="productList"
              @row-selected="onRowSelected"
              class="text-center"
              :fields="fieldsSanPham"
            >
              <template #cell(stt)="data">
                {{ data.index + 1 }}
              </template>
              <template #cell(tool)="data">
                <b-button variant="danger" @click="deleteItem(data.item)"
                  >X</b-button
                >
              </template>
              <template #cell(product_image_url)="data">
                <div>
                  <b-img
                    thumbnail
                    rounded
                    v-zoom-on-hover
                    center
                    :src="data.item.product_image_url"
                    fluid
                    height="100"
                    width="100"
                  ></b-img>
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
    getWidth() {
      return this.$refs.camera.clientWidth;
    },
    getHeight() {
      return this.$refs.camera.clientHeight;
    },
  },
  watch: {
    "form.product_total_weight": function (newVal, oldVal) {
      this.updateGoldWeight();
    },
    "form.product_stone_weight": function (newVal, oldVal) {
      this.updateGoldWeight();
    },
  },
  data() {
    return {
      solannhanCount: 0,
      nhanOverlay: false,
      inputConfig: [],
      inputMode: false,
      productList: [],
      banggiasanpham: null,
      fieldsSanPham: [
        { key: "stt", label: "#", tdClass: "align-middle" },
        { key: "product_image_url", label: "Avatar", tdClass: "align-middle" },
        { key: "product_barcode", label: "Mã", tdClass: "align-middle" },
        { key: "product_catalog", label: "Kiểu", tdClass: "align-middle" },
        {
          tdClass: "align-middle",
          key: "product_total_weight",
          label: "TL.Tổng",
          formatter: (v) => {
            return this.$formatSoVang(v).fullStr;
          },
        },

        {
          tdClass: "align-middle",
          key: "product_stone_weight",
          label: "TL.Hột",
          formatter: (v) => {
            return this.$formatSoVang(v).fullStr;
          },
        },
        {
          tdClass: "align-middle",
          key: "product_gold_weight",
          label: "TL.Vàng",
          formatter: (v) => {
            return this.$formatSoVang(v).fullStr;
          },
        },
        { key: "product_wage", label: "C", tdClass: "align-middle" },
        { key: "Tool", label: "#", tdClass: "align-middle" },
      ],
      form: {
        product_image_name: null,
        product_wage_in: null,
        product_wage: null,
        product_type: "610",
        product_stone_weight: null,
        product_total_weight: null,
        product_gold_weight: null,
        product_catalog: null,
        product_barcode: null,
        product_import_type: true,
        product_price_import: null,
      },
      isCameraOpen: false,
      isPhotoTaken: false,
      isShotPhoto: false,
      optionLoaiVang: [
        { text: "Vàng 9999", value: "9999" },
        { text: "Vàng 980", value: "980" },
        { text: "Vàng 710", value: "750" },
        { text: "Vàng 610", value: "610" },
      ],
      streamCamera: null,
      insertOverlay: false,
      optionCatalog: [
        { text: "NHẪN NỮ", value: "NT" },
        { text: "NHẪN CƯỚI", value: "NC" },
        { text: "NHẪN NAM", value: "NN" },
        { text: "BÔNG LỚN", value: "BL" },
        { text: "BÔNG EM BÉ", value: "BE" },
        { text: "DÂY LỚN", value: "DL" },
        { text: "DÂY EM BÉ", value: "DE" },
        { text: "MẶT", value: "MD" },
        { text: "VÒNG TRƠN", value: "VT" },
        { text: "VÒNG KIỂU", value: "VK" },
        { text: "VÒNG EM BÉ", value: "VE" },
        { text: "LẮC LỚN", value: "LL" },
        { text: "LẮC EM BÉ", value: "LE" },
        { text: "KIỀNG 18K", value: "KT" },
        { text: "KIỀNG CƯỚI", value: "KC" },
        { text: "XIMEN", value: "XM" },
        { text: "KHÁC", value: "KK" },
      ],
      selected: [],
      solannhan: 1,
      rotationAngle: 180,
      fh: 1,
      fd: 1,
    };
  },
  methods: {
    rotationLeft() {
      this.rotationAngle -= 10;
      this.updateVideo();
    },
    inTemSelect() {
      if (this.productList.length > 0) {
        alert("Chờ máy in tem xong rồi bấm OK");
        this.$pl_sanpham_intem(this, this.productList);
        this.productList = [];
     
      } else {
        alert("Không có gì để in");
      }
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
    async insertSingle(item) {
      return new Promise((resolve, reject) => {
        this.$supabase
          .from("product")
          .insert(item)
          .select()
          .then((data) => {
            resolve(data);
          });
      });
    },
    nhansanpham() {
      this.$refs.formNhanSanPham.validate().then(async (data) => {
        if (data) {
          this.nhanOverlay = true;
          this.toggleOverlay();
          let itemChoice = this.selected[0];
          for (let i = 0; i < parseInt(this.solannhan); i++) {
            //tao so san pham với thông tin giống nhau nhưng khác mã
            this.solannhanCount++;
            let objectInsert = {
              product_wage: parseInt(itemChoice.product_wage),
              product_price_import: itemChoice.product_price_import,
              product_wage_in: itemChoice.product_wage_in,
              product_stone_weight: parseInt(itemChoice.product_stone_weight),
              product_total_weight: parseInt(itemChoice.product_total_weight),
              product_gold_weight: parseInt(itemChoice.product_gold_weight),
              product_image_url: itemChoice.product_image_url,
              product_image_name: itemChoice.product_image_name,
              product_catalog: itemChoice.product_catalog,
              product_type: itemChoice.product_type,
              product_status: true,
              product_import_type: itemChoice.product_import_type,
              product_barcode: await this.changeCatalogWithReturn(
                itemChoice.product_catalog
              ),
            };
            let sanpham = await this.insertSingle(objectInsert);
            this.productList.push(sanpham.data[0]);
          }
          await this.changeCatalog();
          this.toggleOverlay();
          this.resetForm();
          this.nhanOverlay = false;
          this.solannhanCount = 0;
          this.$bvModal.hide("modal_nhansanpham");
        }
      });
    },
    show_modal_nhansanpham() {
      if (this.selected.length > 0) {
        this.$bvModal.show("modal_nhansanpham");
      } else {
        alert("Vui lòng chọn ít nhất một sản phẩm để nhân");
      }
    },
    onRowSelected(item) {
      this.selected = item;
    },
    deleteItem(item) {
      this.toggleOverlay();
      this.$supabase
        .from("product")
        .delete()
        .eq("id", item.id)
        .then((data) => {
          this.toggleOverlay();
          this.productList = this.productList.filter((i) => i.id != item.id);
          this.$bvToast.toast(
            `Xóa sản phẩm ${item.product_barcode} thành công`,
            {
              title: "Thông báo",
              autoHideDelay: 1000,
              appendToast: true,
              variant: "primary",
            }
          );
        });
    },
    toggleOverlay() {
      if (this.insertOverlay) {
        this.insertOverlay = false;
      } else {
        this.insertOverlay = true;
      }
    },
    updateGoldWeight() {
      this.form.product_gold_weight =
        parseFloat(this.form.product_total_weight) -
        parseFloat(this.form.product_stone_weight);
    },

    async changeCatalog() {
      let lastProduct = await this.$supabase
        .from("product")
        .select()
        .limit(1)
        .order("id", { ascending: false });
      let lastId = lastProduct.data[0].id + 1;
      let barcode = `${String(
        this.form.product_catalog
      ).toLowerCase()}${lastId}`;
      this.form.product_barcode = barcode;
    },
    async changeCatalogWithReturn(cat) {
      return new Promise(async (resolve, reject) => {
        let lastProduct = await this.$supabase
          .from("product")
          .select()
          .limit(1)
          .order("id", { ascending: false });
        let lastId = lastProduct.data[0].id + 1;
        let barcode = `${String(cat).toLowerCase()}${lastId}`;
        resolve(barcode);
      });
    },
    async loaiVangChange() {
      let result = await this.$supabase
        .from("banggia")
        .select()
        .eq("code", this.form.product_type);
      this.banggiasanpham = result.data[0];
    },
    insertSanPham() {
      this.$refs.formThem.validate().then(async (data) => {
        if (data) {
          this.toggleOverlay();
          let lastProduct = await this.$supabase
            .from("product")
            .select()
            .limit(1)
            .order("id", { ascending: false });
          let lastId = lastProduct.data[0].id + 1;
          let fileName = `a_${lastId}`;
          //   upload ảnh imgbb
          //   capture
          this.takePhoto();
          const canvas = document.getElementById("canvas");
          const imageData = canvas.toDataURL("image/webp", 0.1);
          // Lấy phần dữ liệu base64 (bỏ qua phần tiêu đề)
          const base64Image = imageData.split(",")[1];
          let fileUpload = {
            fileName,
            base64Image,
          };
          let uploadResult = await this.$uploadPicture(fileUpload);

          this.form.product_image_name = uploadResult.data.data.id;

          if (this.form.product_import_type) {
            //chanh
            //gia hien tai - 50
            this.form.product_price_import =
              this.banggiasanpham.sellingPrice - 30;
            this.form.product_wage_in = parseInt(this.form.product_wage / 2);
          } else {
            //noi bo
            //gia vang - 100
            this.form.product_price_import =
              this.banggiasanpham.sellingPrice - 100;
            this.form.product_wage_in = 0;
          }
          let objectInsert = {
            product_wage: parseInt(this.form.product_wage),
            product_price_import: this.form.product_price_import,
            product_wage_in: this.form.product_wage_in,
            product_stone_weight: parseInt(this.form.product_stone_weight),
            product_total_weight: parseInt(this.form.product_total_weight),
            product_gold_weight: parseInt(this.form.product_gold_weight),
            product_image_url: uploadResult.data.data.url,
            product_image_name: this.form.product_image_name,
            product_catalog: this.form.product_catalog,
            product_type: this.form.product_type,
            product_status: true,
            product_import_type: this.form.product_import_type,
            product_barcode: this.form.product_barcode,
          };
          let product = await this.$supabase
            .from("product")
            .insert(objectInsert)
            .select();
          this.productList.push(product.data[0]);

          //reset form
          this.toggleOverlay();
          this.resetForm();
        } else {
          console.log("form sai");
        }
      });
      //lấy last id
    },
    resetForm() {
      let newform = {
        product_image_name: null,
        product_wage_in: null,
        product_wage: null,
        product_type: "610",
        product_stone_weight: null,
        product_total_weight: null,
        product_gold_weight: null,
        product_catalog: null,
        product_barcode: null,
        product_import_type: true,
        product_price_import: null,
      };
      let isLoaiVang = false;
      this.inputConfig.forEach((item) => {
        newform[item] = this.form[item];
        if (item === "product_catalog") {
          isLoaiVang = true;
        }
      });
      this.form = newform;
      if (isLoaiVang) {
        this.changeCatalog();
      }
    },
    toggleCamera() {
      this.isCameraOpen = true;
      this.createCameraElement();
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
      } catch (err) {}
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
              this.form.product_total_weight = roundedValue;
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
  },
  mounted() {
    //console.log("hello port");
    //  alert("Vui lòng kiểm tra chế độ nhập, nhập nâng cao");
    this.toggleCamera();
    this.loaiVangChange();
    this.updateVideo();
    //  this.connectToPort();
  },
};
</script>

<style>
</style>