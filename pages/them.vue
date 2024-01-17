<template>
  <div>
    <div>
      <b-overlay :show="isStatus">
        <b-row>
          <b-col cols="6">
            <b-card class="mt-3 ml-2" header="Mẫu Đồ thế">
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
                    <span v-if="inputMode">(Tự điền ngày hiện tại)</span>
                  </b-form-checkbox>
                </div>
              </template>
              <b-card-body>
                <ValidationObserver v-slot="{ invalid }" ref="formThem">
                  <b-form @submit.prevent="insertSp()">
                    <b-row>
                      <b-col cols="6">
                        <ValidationProvider
                          rules="required|min:2|max:50|alpha_spaces"
                          v-slot="{ errors, valid, failedRules }"
                        >
                          <b-form-group
                            label="Tên khách:"
                            :description="
                              valid ? 'Tên khách : ' + form.ten : ''
                            "
                          >
                            <b-form-input
                              v-model="form.ten"
                              :formatter="formatterTen"
                              ref="inputTen"
                              type="text"
                              autocomplete="off"
                              :state="valid"
                            ></b-form-input>
                            <b-form-invalid-feedback>
                              Nhập sai tên khách
                            </b-form-invalid-feedback>
                          </b-form-group>
                        </ValidationProvider>
                        <ValidationProvider
                          rules="required|numeric|min_value:0|max_value:999999"
                          v-slot="{ errors, valid, failedRules }"
                        >
                          <b-form-group
                            label="Mã số :"
                            :description="valid ? 'Mã số : ' + form.maso : ''"
                          >
                            <b-form-input
                              v-model="form.maso"
                              :state="valid"
                              type="number"
                              no-wheel
                              step="1"
                              @change="checkMaSo"
                              min="0"
                              :formatter="formatterMaSo"
                              autocomplete="off"
                            ></b-form-input>

                            <b-form-invalid-feedback v-if="maSoTrung">
                              Mã số trùng
                            </b-form-invalid-feedback>
                            <b-form-invalid-feedback v-if="!maSoTrung">
                              Nhập sai mã số
                            </b-form-invalid-feedback>
                          </b-form-group>
                        </ValidationProvider>
                      </b-col>
                      <b-col cols="6">
                        <ValidationProvider
                          rules="required|numeric|min_value:0|max_value:9999999|khongcosole"
                          v-slot="{ errors, valid, failedRules }"
                        >
                          <b-form-group
                            label="Số tiền :"
                            :description="
                              valid
                                ? 'Số tiền : ' +
                                  formatN(form.sotien * 1000) +
                                  ' vnd'
                                : ''
                            "
                          >
                            <b-form-input
                              v-model="form.sotien"
                              :state="valid"
                              type="number"
                              no-wheel
                              step="100"
                              min="0"
                              autocomplete="off"
                            ></b-form-input>
                            <b-form-invalid-feedback>
                              Nhập sai số tiền
                            </b-form-invalid-feedback>
                          </b-form-group>
                        </ValidationProvider>
                        <ValidationProvider
                          rules="required|ngaythang"
                          v-slot="{ errors, valid, failedRules }"
                        >
                          <b-form-group
                            label="Ngày thế:"
                            :description="
                              valid
                                ? 'Ngày : ' + formatNgayThang(form.ngaycam)
                                : ''
                            "
                          >
                            <b-form-input
                              v-model="form.ngaycam"
                              type="text"
                              autocomplete="off"
                              placeholder="ngay/thang/nam"
                              :state="valid"
                            ></b-form-input>

                            <b-form-invalid-feedback>
                              Nhập sai ngày DD/MM/YY
                            </b-form-invalid-feedback>
                          </b-form-group>
                        </ValidationProvider>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col cols="6">
                        <ValidationProvider
                          rules="required"
                          v-slot="{ errors, valid, failedRules }"
                        >
                          <b-form-group label="Món đồ :">
                            <b-form-tags
                              ref="bformtag"
                              remove-on-delete
                              separator=","
                              :state="valid"
                              tag-variant="primary"
                              v-model="form.tag"
                            ></b-form-tags>
                          </b-form-group>
                        </ValidationProvider>

                        <b-form-group label="Comment :">
                          <b-form-input
                            v-model="form.comment"
                            autocomplete="off"
                          ></b-form-input>
                        </b-form-group>
                        <b-form-group label="Số điện thoại :">
                          <b-form-input
                            v-model="form.phone"
                            autocomplete="off"
                          ></b-form-input>
                        </b-form-group>
                      </b-col>
                      <b-col cols="6">
                        <b-form-group label="Loại Lưu :">
                          <b-form-select
                            v-model="form.store"
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
                          ></b-form-select>
                        </b-form-group>

                        <b-form-group label="Nơi Lưu :">
                          <b-form-select
                            v-model="form.store_type"
                            :options="['KHAY', 'KÉT', 'KHÁC']"
                          ></b-form-select>
                        </b-form-group>
                        <b-form-group label="LOẠI THẾ :">
                          <b-form-select
                            v-model="form.cat"
                            :options="['THẾ MỚI', 'ĐÓNG LÃI', 'KHÁC']"
                          ></b-form-select>
                        </b-form-group>
                      </b-col>
                    </b-row>
                    <b-button
                      block
                      type="submit"
                      variant="primary"
                      :disabled="invalid"
                      >Thêm</b-button
                    >
                    <b-button block type="reset" variant="danger"
                      >Reset</b-button
                    >
                  </b-form>
                </ValidationObserver>
              </b-card-body>
            </b-card>
            <div></div>
          </b-col>
          <b-col cols="3">
            <b-card class="mt-3" header="Form Data Result">
              <template #header>
                <table
                  style="
                    width: 100%;
                    height: 100%;
                    color: blue;
                    font-weight: bold;
                    font-size: large;
                  "
                >
                  <tr>
                    <td style="text-align: left; width: 50%">
                      Tên :{{ form.ten }}
                    </td>
                    <td style="text-align: right; width: 50%">
                      Mã :{{ form.maso }}
                    </td>
                  </tr>

                  <tr>
                    <td style="text-align: left; width: 50%">
                      Tiền: {{ formatN(form.sotien * 1000) }}
                    </td>
                    <td style="text-align: right; width: 50%">
                      <div>Ngày: {{ formatNgayThang(form.ngaycam) }}</div>
                    </td>
                  </tr>
                </table>
              </template>
            </b-card>
          </b-col>
          <b-col cols="3">
            <b-card class="mt-3" header="Sản phẩm vừa thêm">
              <div v-for="(item, index) in lastInsert" :key="index">
                <div>
                  Mã : {{ item.invoice_number }}<br />
                  Tên : {{ item.customer_name }}<br />
                  Tiền : {{ formatN(item.invoice_money) }}<br />
                  Ngày :
                  {{ $moment(item.invoice_date_create).format("DD/MM/YYYY")
                  }}<br />
                  <b-button
                    variant="danger"
                    @click="deleteLastItem(item.id)"
                    block
                    >Xóa</b-button
                  >
                </div>
              </div>
            </b-card>
          </b-col>
        </b-row>
      </b-overlay>
    </div>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { extend, configure } from "vee-validate";

import * as rules from "vee-validate/dist/rules";
Object.keys(rules).forEach((rule) => {
  // console.log(rule);
  extend(rule, rules[rule]);
});

extend("maso", (value) => {
  let sotien = parseInt(value) * 1000;
  return sotien % 100000 === 0;
});
extend("ngaythang", (value) => {
  const regex =
    /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/((20[2-9][1-9]|2050)|[2-9][1-9])$/;
  return regex.test(value);
});

extend("khongcosole", (value) => {
  let sotien = parseInt(value) * 1000;
  return sotien % 100000 === 0;
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  watch: {},
  data() {
    return {
      maSoTrung: false,
      lastInsert: [],
      inputMode: false,
      isStatus: false,
      listData: [],
      stateMsg: {
        maso: null,
        tag: null,
        sotien: null,
      },
      state: {
        ten: null,
        ngaycam: null,
        maso: null,
        sotien: null,
        ngaycam: null,
        phone: "không",
        tag: null,
      },

      form: {
        ten: null,
        maso: null,
        sotien: null,
        ngaythe: null,
        comment: "không",
        phone: "không",
        tag: [],
        store: "BỊCH KÉO MIỆNG",
        store_type: "KHAY",
        cat: "THẾ MỚI",
      },
    };
  },
  methods: {
    //valid

    //
    changeInputMode() {
      this.setCurrentDay();
    },
    setCurrentDay() {
      this.form.ngaycam = this.$moment().format("DD/MM/YYYY");
    },
    formatN(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    formatNgayThang(ngayhople) {
      const regex =
        /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/((20[2-9][1-9]|2050)|[2-9][1-9])$/;
      let isValid = regex.test(ngayhople);
      if (isValid) {
        let ngay = ngayhople.split("/")[0];
        let thang = ngayhople.split("/")[1];
        let nam = parseInt(ngayhople.split("/")[2]);
        if (nam < 100) {
          nam += 2000;
        }
        return `${ngay}/${thang}/${nam}`;
      } else {
        return "";
      }
    },
    checkMaSo() {
      let maso = parseInt(this.form.maso);
      this.isStatus = true;
      this.$supabase
        .from("invoice")
        .select()
        .eq("invoice_number", maso)
        .then((data) => {
          this.isStatus = false;
          if (data.data.length > 0) {
            console.log(data);
            this.form.maso = null;
            this.maSoTrung = true;
            let str = `Đã có 1 hóa đơn mã số ${
              data.data[0].invoice_number
            } tồn tại. 
            Tên ${data.data[0].customer_name} - tiền ${this.formatN(
              data.data[0].invoice_money
            )} - ngày ${this.$moment(data.data[0].invoice_date_create).format(
              "DD/MM/YYYY"
            )}`;
            this.$bvToast.toast(str, {
              title: "Thông báo",
              autoHideDelay: 5000,
              appendToast: true,
              variant: "danger",
            });
          } else {
            this.maSoTrung = false;
          }
        });
    },

    focusTen() {
      this.$refs.inputTen.focus();
    },
    deleteLastItem(id) {
      this.$supabase
        .from("invoice")
        .delete()
        .eq("id", id)
        .then((data) => {
          this.lastInsert = this.lastInsert.filter((item) => item.id != id);
          this.$bvToast.toast(`Xóa sản phẩm vừa thêm`, {
            title: "Thông báo",
            autoHideDelay: 1000,
            appendToast: true,
            variant: "danger",
          });
        });
    },

    insertSp() {
      this.$refs.formThem.validate().then((data) => {
        if (data) {
          let ngayFinal = this.$moment(this.form.ngaycam, "DD/MM/YYYY");

          let objectInser = {
            invoice_number: parseInt(this.form.maso),
            invoice_date_create: ngayFinal.format("YYYY/MM/DD"),
            customer_name: this.form.ten,
            invoice_money: parseInt(this.form.sotien) * 1000,
            invoice_comment: this.form.comment,
            invoice_phone: this.form.phone,
            invoice_type: "BÌNH THƯỜNG",
            invoice_status: false,
            invoice_tag: this.form.tag,
            invoice_store: this.form.store,
            invoice_store_type: this.form.store_type,
            invoice_cat: this.form.cat,
          };
          console.log(objectInser);
          this.$supabase
            .from("invoice")
            .insert([objectInser])
            .select()
            .then((data, error) => {
              if (error) {
                this.$bvToast.toast(`Có lỗi xảy ra`, {
                  title: "Thông báo",
                  autoHideDelay: 1000,
                  appendToast: true,
                  variant: "danger",
                });
              } else {
                this.$bvToast.toast(
                  `Thêm đồ thế ${this.form.maso} thành công`,
                  {
                    title: "Thông báo",
                    autoHideDelay: 5000,
                    appendToast: true,
                    variant: "primary",
                  }
                );
                this.lastInsert.push(data.data[0]);
                this.focusTen();
                this.form = {
                  ten: null,
                  maso: null,
                  ngaycam: null,
                  sotien: null,
                  phone: "không",
                  comment: "không",
                  tag: null,
                  store: "BỊCH KÉO MIỆNG",
                  store_type: "KHAY",
                  cat: "THẾ MỚI",
                };
                this.maSoTrung = false;
                if (this.inputMode) {
                  this.setCurrentDay();
                }
              }
            });
        }
      });
    },

    formatterTen(value) {
      if (value.trim() != "") {
        this.state.ten = true;
        return value
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/g, "d")
          .replace(/Đ/g, "D")
          .toUpperCase();
      } else {
        this.form.ten = null;
        this.state.ten = false;
      }
    },
    formatterMaSo(value) {
      return value.replace(".", "");
    },
  },
  mounted() {
    this.form = {
      ten: null,
      maso: null,
      ngaycam: null,
      sotien: null,
      phone: "không",
      comment: "không",
      tag: null,
      store: "BỊCH KÉO MIỆNG",
      store_type: "KHAY",
      cat: "THẾ MỚI",
    };
    this.state = {
      ten: null,
      maso: null,
      ngaycam: null,
      sotien: null,
    };
    this.focusTen();
  },
};
</script>

<style>
</style>