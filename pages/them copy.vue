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
                <b-form @submit.prevent="insertSp()">
                  <b-row>
                    <b-col cols="6">
                      <b-form-group
                        label="Tên khách:"
                        description="Nhập tên khách trong bọc"
                      >
                        <b-form-input
                          v-model="form.ten"
                          ref="inputTen"
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
                        :description="
                          stateMsg.sotien
                            ? stateMsg.sotien
                            : formatN(form.sotien * 1000)
                        "
                      >
                        <b-input-group append=".000">
                          <b-form-input
                            v-model="form.sotien"
                            type="number"
                            autocomplete="off"
                            :state="state.sotien"
                            required
                            min="100"
                            @change="checkSoTien"
                            :formatter="formatterSotien"
                          ></b-form-input>
                        </b-input-group>
                        <sup></sup>
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
                      <b-form-group
                        :description="stateMsg.tag"
                        label="Món đồ :"
                      >
                        <b-form-tags
                          ref="bformtag"
                          required
                          remove-on-delete
                          separator=","
                          :state="state.tag"
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
                      <div v-if="state.ngaycam">
                        Ngày: {{ getNgayCam(form.ngaycam).toShort }}
                      </div>
                    </td>
                  </tr>
                </table>
              </template>
            </b-card>
          </b-col>
          <b-col cols="3">
            <b-card class="mt-3" header="Sản phẩm vừa thêm">
              <div v-if="lastInsert">
                <div>
                  Mã : {{ lastInsert.invoice_number }}<br />
                  Tên : {{ lastInsert.customer_name }}<br />
                  Tiền : {{ formatN(lastInsert.invoice_money) }}<br />
                  Ngày :
                  {{
                    $moment(lastInsert.invoice_date_create).format(
                      "DD/MM/YYYY"
                    )
                  }}<br />
                  <b-button variant="danger" @click="deleteLastItem" block
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
export default {
  watch: {},
  data() {
    return {
      lastInsert: null,
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
    changeInputMode() {
      this.setCurrentDay();
    },
    setCurrentDay() {
      this.form.ngaycam = this.$moment().format("DD/MM/YYYY");
    },
    formatN(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    checkMaSo() {
      this.isStatus = true;
      let maso = parseInt(this.form.maso);
      //
      const regex = /^-?\d+$/g;
      let valid = regex.test(this.form.maso);
      let str_maso = this.form.maso || "";

      if (!valid || str_maso.includes(".")) {
        this.stateMsg.maso = "Mã sai định dạng";
        this.state.maso = false;
        this.form.maso = null;
        this.isStatus = false;
        console.log("Sai mã số");
      } else {
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
      }
    },
    checkSoTien() {
      this.isStatus = true;
      let sotien = parseInt(this.form.sotien) * 1000;

      //Lon hon 100.000
      if (sotien < 100000 || sotien % 100000 != 0) {
        this.stateMsg.sotien = "Số tiền sai";
        this.state.sotien = false;
        this.form.sotien = null;
        this.isStatus = false;
      } else {
        this.stateMsg.sotien = null;
        this.state.sotien = true;
        this.isStatus = false;
      }
      this.isStatus = false;
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
    focusTen() {
      this.$refs.inputTen.focus();
    },
    deleteLastItem() {
      this.$supabase
        .from("invoice")
        .delete()
        .eq("id", this.lastInsert.id)
        .then((data) => {
          this.lastInsert = null;
          this.$bvToast.toast(`Xóa sản phẩm vừa thêm`, {
            title: "Thông báo",
            autoHideDelay: 1000,
            appendToast: true,
            variant: "danger",
          });
        });
    },
    changeTag() {
      if (this.form.tag.length == 0) {
        this.state.tag = false;
        this.stateMsg.tag = "Vui lòng nhập món đồ";
      } else {
        this.state.tag = true;
        this.stateMsg.tag = "Hợp lệ";
      }
    },
    insertSp() {
      //check all Valid

      let result = this.getNgayCam(this.form.ngaycam);

      if (this.form.tag.length == 0 || !this.form.tag) {
        this.state.tag = false;
        console.log("tag lỗi");
        this.stateMsg.tag = "Vui lòng nhập món đồ";
        this.$refs.bformtag.focus();
        return;
      } else {
        this.state.tag = true;
        this.stateMsg.tag = "Hợp lệ";
      }

      if (parseInt(this.form.sotien) < 100) {
        this.state.sotien = false;
        console.log("Số tiền lỗi");
        this.stateMsg.sotien = "Vui lòng đúng số tiền";
        return;
      } else {
        this.state.sotien = true;
        this.stateMsg.sotien = "Hợp lệ";
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
        invoice_tag: this.form.tag,
        invoice_store: this.form.store,
        invoice_store_type: this.form.store_type,
        invoice_cat: this.form.cat,
      };
      this.isStatus = true;
      this.$supabase
        .from("invoice")
        .insert([objectInser])
        .select()
        .then((data, error) => {
          console.log(data, error);
          this.lastInsert = data.data[0];
          this.isStatus = false;
          this.focusTen();

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
          if (this.inputMode) {
            this.setCurrentDay();
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
    this.focusTen();
  },
};
</script>

<style>
</style>