<template>
  <div>
    <div>
      <b-overlay :show="isStatus">
        <b-row>
          <b-col cols="6">
            <b-card class="mt-3 ml-2" header="Mẫu Đồ thế">
              <b-card-body>
                <b-form @submit.prevent="insertSp()">
                  <b-row>
                    <b-col cols="6">
                      <b-form-group
                        label="Tên khách:"
                        description="Nhập tên khách trong bọc"
                      >
                        <b-form-input
                          v-model="form.ten"
                          :state="state.ten"
                          type="text"
                          autocomplete="off"
                          required
                          :formatter="formatterTen"
                        ></b-form-input>
                      </b-form-group>

                      <b-form-group
                        label="Mã số :"
                        :description="stateMsg.maso"
                      >
                        <b-form-input
                          v-model="form.maso"
                          :state="state.maso"
                          type="number"
                          autocomplete="off"
                          @change="checkMaSo()"
                          placeholder=""
                          required
                          :formatter="formatterMaso"
                        ></b-form-input>
                      </b-form-group>
                    </b-col>
                    <b-col cols="6">
                      <b-form-group
                        label="Số tiền :"
                        :description="formatN(form.sotien * 1000)"
                      >
                        <b-input-group append=".000">
                          <b-form-input
                            v-model="form.sotien"
                            type="number"
                            autocomplete="off"
                            :state="state.sotien"
                            required
                            :formatter="formatterSotien"
                          ></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      <b-form-group
                        label="Ngày thế:"
                        :description="stateMsg.ngaycam"
                      >
                        <b-form-input
                          v-model="form.ngaycam"
                          type="text"
                          autocomplete="off"
                          placeholder="Nhập ngày thế theo mẫu ngay/thang/nam"
                          required
                          @keyup="formatterNgayCam"
                          :state="state.ngaycam"
                        ></b-form-input>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="6">
                      <b-form-group label="Món đồ :">
                        <b-form-tags
                          tag-variant="primary"
                          v-model="form.tag"
                        ></b-form-tags>
                      </b-form-group>
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
                  <b-button block type="submit" variant="primary"
                    >Submit</b-button
                  >
                  <b-button block type="reset" variant="danger">Reset</b-button>
                </b-form>
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
                    font-size: x-large;
                  "
                >
                  <tr>
                    <td style="text-align: left">{{ form.ten }}</td>
                    <td style="text-align: right">{{ form.maso }}</td>
                  </tr>

                  <tr>
                    <td style="text-align: left">
                      {{ formatN(form.sotien * 1000) }}
                    </td>
                    <td style="text-align: right">
                      <div v-if="state.ngaycam">
                        {{ getNgayCam(form.ngaycam).toShort }}
                      </div>
                    </td>
                  </tr>
                </table>
              </template>
            </b-card>
          </b-col>
          <b-col cols="3"> </b-col>
        </b-row>
      </b-overlay>
    </div>
  </div>
</template>

<script>
export default {
  watch: {},
  data() {
    return {
      isStatus: false,
      listData: [],
      stateMsg: {
        maso: null,
      },
      state: {
        ten: null,
        maso: null,
        sotien: null,
        ngaycam: null,
        phone: "không",
      },
      
      form: {
        ten: null,
        maso: null,
        sotien: null,
        ngaythe: null,
        comment: "không",
        phone: "không",
        tag: null,
        store: "BỊCH KÉO MIỆNG",
        store_type: "KHAY",
        cat: "THẾ MỚI",
      },
    };
  },
  methods: {
    formatN(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    checkMaSo() {
      this.isStatus = true;
      let maso = parseInt(this.form.maso);
      this.$supabase
        .from("invoice")
        .select("invoice_number")
        .eq("invoice_number", maso)
        .then((data) => {
          this.isStatus = false;
          if (data.data.length > 0) {
            this.stateMsg.maso = "Mã này đã trùng";
            this.state.maso = false;
            this.form.maso = null;
          } else {
            this.stateMsg.maso = "Mã số hợp lệ";
          }
        });
    },
    getNgayCam(ngayhople) {
      try {
        let ngay = ngayhople.split("/")[0];
        let thang = ngayhople.split("/")[1];
        let nam = ngayhople.split("/")[2];
        if (typeof ngay === "undefined" || ngay === "" || parseInt(ngay) > 31) {
          throw new Error("Ngày khong hop le");
        }
        if (
          typeof thang === "undefined" ||
          thang === "" ||
          parseInt(thang) > 12
        ) {
          throw new Error("Tháng khong hop le");
        }
        if (
          typeof nam === "undefined" ||
          nam === "" ||
          parseInt(nam) > 2050 ||
          parseInt(nam) < 2022
        ) {
          throw new Error("Năm khong hop le");
        }
        let ngayFinal = {
          isValid: true,
          toInsert: `${nam}/${thang}/${ngay}`,
          toFormat: `Ngày ${ngay} tháng ${thang} năm ${nam}`,
          toShort: `${ngay}/${thang}/${nam}`,
          msg: "ok",
        };
        return ngayFinal;
      } catch (err) {
        let errMsg = err.toString();
        console.log("==", errMsg, "==");
        if (
          errMsg == "Error: Ngày khong hop le" ||
          errMsg == "Error: Tháng khong hop le" ||
          errMsg == "Error: Năm khong hop le"
        ) {
          return {
            isValid: false,
            msg: "Ngày/tháng/năm không hợp lệ",
          };
        } else {
          return {
            isValid: false,
            msg: "",
          };
        }
      }
    },
    insertSp() {
      //check all Valid
      let result = this.getNgayCam(this.form.ngaycam);
      if (!result.isValid) {
        this.form.ngaycam = null;
        this.stateMsg.ngaycam = "Ngày tháng sai định dạng";
        return;
      } else {
        this.state.ngaycam = true;
        this.stateMsg.ngaycam = null;
      }

      //valid
      let ngayFinal = this.getNgayCam(this.form.ngaycam);

      let objectInser = {
        invoice_number: parseInt(this.form.maso),
        invoice_date_create: ngayFinal.toInsert,
        customer_name: this.form.ten,
        invoice_money: parseInt(this.form.sotien) * 1000,
        invoice_comment: this.form.comment,
        invoice_phone: this.form.phone,
        invoice_type: "BÌNH THƯỜNG",
        invoice_status: false,
        invoice_tag: JSON.stringify(this.form.tag),
        invoice_store: this.form.store,
        invoice_store_type: this.form.store_type,
        invoice_cat: this.form.cat,
      };
      this.isStatus = true;
      this.$supabase
        .from("invoice")
        .insert([objectInser])
        .then(() => {
          this.isStatus = false;
          this.$bvToast.toast(`Thêm đồ thế ${this.form.maso} thành công`, {
            title: "Thông báo",
            autoHideDelay: 5000,
            appendToast: true,
            variant: "primary",
          });
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
    formatterMaso(value) {
      if (!isNaN(parseInt(value))) {
        this.state.maso = true;
        return value;
      } else {
        this.form.maso = null;
        this.state.maso = false;
      }
    },
    formatterSotien(value) {
      if (!isNaN(parseInt(value))) {
        this.state.sotien = true;
        return value;
      } else {
        this.form.sotien = null;
        this.state.sotien = false;
      }
    },
    formatterNgayCam() {
      let result = this.getNgayCam(this.form.ngaycam);
      if (result.isValid) {
        this.state.ngaycam = true;
        this.stateMsg.ngaycam = "ngày hợp lệ";
      } else {
        this.state.ngaycam = false;
        this.stateMsg.ngaycam = "ngày không hợp lệ";
      }
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
  },
};
</script>

<style>
</style>