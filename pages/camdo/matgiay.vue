<template>
  <b-row>
    <b-col cols="12">
      <b-overlay :show="dataReady">
        <template #overlay>
          <b-row>
            <b-col cols="12">
              <b-progress height="5rem" :value="value" :max="max" show-progress animated>
                <b-progress-bar :value="value">
                  <span>Tiến trình: <strong>{{ value.toFixed(2) }} / {{ max }}</strong></span>
                </b-progress-bar>
              </b-progress>

            </b-col>
          </b-row>

        </template>
        <b-container>
          <h5 class="text-center mt-2">Mất giấy</h5>

          <table style="width: 100%">
            <tr>
              <td v-for="(src, index) in imageSrcs" :key="index">
                <b-img style="width: 100px; height: 100px" :src="src.url" alt="Preview Image" fluid
                  class="mb-2"></b-img>
              </td>
            </tr>
            <tr>
              <td v-for="(src, index) in imageSrcs" :key="index">
                <b-button variant="danger" @click="removeImage(src)">Xóa</b-button>
              </td>
            </tr>
          </table>

          <ValidationObserver v-slot="{ invalid }" ref="formThem">
            <b-form @submit.prevent="taomoi">
              <ValidationProvider rules="required|min:2|max:50|alpha_spaces" v-slot="{ errors, valid, failedRules }">
                <b-form-group label="Tên khách">
                  <b-input style="text-transform:uppercase;" v-model="form.tenkhach" :state="valid"
                    autocomplete="off"></b-input>
                  <b-form-invalid-feedback>
                    Nhập sai tên khách
                  </b-form-invalid-feedback>
                </b-form-group>
              </ValidationProvider>
              <ValidationProvider rules="required|integer|min_value:0|max_value:9999999"
                v-slot="{ errors, valid, failedRules }">
                <b-form-group label="Mã Bọc cầm">
                  <b-row>
                    <b-col cols="6">
                      <b-input autocomplete="off" v-model="form.id_invoice_search" @change="timinvoice"
                        :state="valid"></b-input>
                      <b-form-invalid-feedback>
                        Nhập sai mã bọc đồ
                      </b-form-invalid-feedback>
                    </b-col>
                    <b-col cols="6"> {{ messageInvoice }} </b-col>
                  </b-row>
                </b-form-group>
              </ValidationProvider>
              <ValidationProvider rules="required||min:0" v-slot="{ errors, valid, failedRules }">
                <b-form-group label="Thông tin">
                  <b-textarea v-model="form.thongtin" autocomplete="off" :state="valid" row="5"></b-textarea>
                  <b-form-invalid-feedback>
                    Nhập sai thông tin
                  </b-form-invalid-feedback>
                </b-form-group>
              </ValidationProvider>
              
              <ValidationProvider rules="required" v-slot="{ errors, valid, failedRules }">
                <b-form-group label="Ảnh">
                  <b-form-file v-model="files" :state="valid" placeholder="Choose files or take photos..."
                    accept="image/*" :capture="true" @change="handleFilesChange"></b-form-file>
                  <b-form-invalid-feedback>
                    Thiếu file ảnh
                  </b-form-invalid-feedback>
                </b-form-group>
              </ValidationProvider>
              <b-button block type="submit" variant="success" @submit="taomoi">Tạo mới mất giấy</b-button>
            </b-form>
          </ValidationObserver>
        </b-container>
      </b-overlay>
    </b-col>
  </b-row>
</template>
<script>
import Compressor from "compressorjs";
import { v4 as uuidv4 } from "uuid";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { extend, configure } from "vee-validate";

import * as rules from "vee-validate/dist/rules";
Object.keys(rules).forEach((rule) => {
  console.log(rule);
  extend(rule, rules[rule]);
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      dataReady: false,
      files: [],
      fileCompress: [],
      messageInvoice: "",
      imageSrcs: [], // Mảng các URL xem trước
      value: 0,
      form: {
        id_invoice_search: null,
        tenkhach: null,
        id_invoice: null,
        thongtin: null,
      },
      max: 0,
    };
  },
  methods: {
    compressfile(file) {
      return new Promise((resolve, reject) => {
        new Compressor(file, {
          quality: 0.2,
          success(result) {
            resolve(result)
          },
          error: reject
        });
      });
    },
    async timinvoice() {
      let data = await this.$supabase
        .from("invoice")
        .select("*")
        .eq("invoice_number", String(this.form.id_invoice_search));

      if (data.data.length > 0) {
        let d = data.data[0];
        this.form.id_invoice = d.id;
        this.messageInvoice = `${d.invoice_number} - ${d.customer_name
          } - ${this.$formatN(d.invoice_money)} - ${d.invoice_date_create}`;
      } else {
        this.messageInvoice = "Không tìm thấy, vui lòng thử lại";
        this.form.id_invoice_search = null;
      }
    },

    taomoi() {
      //tạo
      this.$refs.formThem.validate().then(async (data) => {
        if (data) {
          this.dataReady = true;
          this.max = this.imageSrcs.length * 2 + 2;
          let matgiay = await this.taomatgiay();
          //edit invoice
          await this.$supabase
            .from("invoice")
            .update({
              id_matgiay:matgiay.id,
              invoice_comment: `Đồ mất giấy [${matgiay.id
                }] - Đã cho chuộc ngày ${this.$moment(matgiay.created_at).format(
                  "DD/MM/YYYY"
                )} - Người Chuộc ${this.form.tenkhach}`,
            })
            .eq("id", this.form.id_invoice);
          this.value++;
          for (let i = 0; i < this.imageSrcs.length; i++) {
            let f = await this.compressfile(this.imageSrcs[i].file);
            let name = `matgiay_${uuidv4()}_${matgiay.id}.jpg`;
            let anhUpload = await this.$supabase.storage
              .from("anh")
              .upload(name, f, {
                cacheControl: "3600",
                upsert: false,
              });
            this.value++;
            console.log(anhUpload, matgiay);
            let recordAnh = await this.$supabase.from("hinhanh").insert({
              link: `https://ajsrzteoovahabndebyp.supabase.co/storage/v1/object/public/${anhUpload.data.Key}`, //anhUpload.data.Key,
              id_matgiay: matgiay.id,
              loaianh: "MATGIAY",
            });
            this.value++;
            console.log(recordAnh);
          }
          this.dataReady = false;
          this.$bvToast.toast(
            `Tạo mất giấy cho hóa đơn  ${this.form.id_invoice_search} thành công`,
            {
              title: "Thông báo",
              autoHideDelay: 1000,
              appendToast: true,
              variant: "primary",
            }
          );
          this.form = {
            id_invoice_search: null,
            tenkhach: null,
            id_invoice: null,
            thongtin: null,
          };
          this.imageSrcs = []
          this.fileCompress = [];
          this.files = [];
          this.value = 0;
          this.max = 0;
          this.messageInvoice = "";
        } else {
          console.log("not ok");
        }
      });
    },
    async taomatgiay() {
      return new Promise(async (resolve, reject) => {
        let data = await this.$supabase
          .from("matgiay")
          .insert({
            tenkhach: String(this.form.tenkhach).toUpperCase(),
            thongtin: this.form.thongtin,
            id_invoice: parseInt(this.form.id_invoice),
            created_at: new Date(),
          })
          .select();
        this.value++;
        resolve(data.data[0]);
      });
    },

    removeImage(src) {
      this.imageSrcs = this.imageSrcs.filter((i) => i != src);
    },
    handleFilesChange(event) {
      this.files = Array.from(event.target.files); // Lấy tất cả các file được chọn
      this.files.map((file) => {
        this.imageSrcs.push({ url: URL.createObjectURL(file), file });
      });
    },
  },
};
</script>