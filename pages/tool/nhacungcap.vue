<template>
  <div class="mt-2">
    <b-row>
      <b-col cols="7">
        <b-button-group>
          <b-button variant="primary" @click="themnhacungcap">Thêm nhà cung cấp</b-button>
        </b-button-group>
        <b-overlay :show="overlay">
          <b-table :items="listnhacungcap" :fields="fieldlistcungcap" show-empty small responsive hover striped>
            <template #cell(stt)="data">
              <b>{{ data.index + 1 }}</b>
            </template>
            <template #cell(name)="data">
              <b class="text-success nhacungcap" @click="choiceCungCap(data.item)">
                {{ data.value }}</b>
            </template>
            <template #cell(tccs)="data">
              <b class="nhacungcap">{{ data.value }}</b>
            </template>
            <template #cell(short)="data">
              <b class="nhacungcap">{{ data.value }}</b>
            </template>
            <template #cell(address)="data">
              <b class="text-mute">{{ data.value }}</b>
            </template>
            <template #cell(tool)="data">
              <b-button variant="danger" @click="deleteItem(data.item)">Xóa</b-button>
            </template>
          </b-table>
        </b-overlay>
      </b-col>
      <b-col cols="5">
        <b-card>
          <ValidationObserver ref="veeForm" v-slot="{ invalid }">


            <b-form v-if="itemnhacungcap" @submit.prevent="insertSanPham">
              <ValidationProvider rules="required" v-slot="{ errors, valid, failedRules }">
                <b-form-group label="Tên nhà cung cấp:">
                  <b-form-input v-model="itemnhacungcap.name" :state="valid" autocomplete="off"></b-form-input>
                  <b-form-invalid-feedback>
                    Thiếu tên nhà cung cấp
                  </b-form-invalid-feedback>
                </b-form-group>
              </ValidationProvider>
              <ValidationProvider rules="required" v-slot="{ errors, valid, failedRules }">
                <b-form-group label="Địa chỉ nhà cung cấp:">
                  <b-form-input autocomplete="off" :state="valid" v-model="itemnhacungcap.address"></b-form-input>
                  <b-form-invalid-feedback>
                    Thiếu địa chỉ nhà cung cấp
                  </b-form-invalid-feedback>
                </b-form-group>
              </ValidationProvider>
              <ValidationProvider rules="required" v-slot="{ errors, valid, failedRules }">
                <b-form-group label="Tiêu chuẩn cơ cở:">
                  <b-form-input autocomplete="off" :state="valid" v-model="itemnhacungcap.tccs" required></b-form-input>
                  <b-form-invalid-feedback>
                    Thiếu tiêu chuẩn cơ sở
                  </b-form-invalid-feedback>
                </b-form-group>
              </ValidationProvider>
              <ValidationProvider rules="required" v-slot="{ errors, valid, failedRules }">
                <b-form-group label="Tên ngắn:">
                  <b-form-input autocomplete="off" :state="valid" v-model="itemnhacungcap.short"></b-form-input>
                  <b-form-invalid-feedback>
                    Thiếu tên ngắn
                  </b-form-invalid-feedback>
                </b-form-group>
              </ValidationProvider>
              <ValidationProvider rules="required" v-slot="{ errors, valid, failedRules }">
                <b-form-group description="là khoảng tiền cộng thêm khi nhập hàng(0.5 = Công nhập = công xuất/2)"
                  label="Tiền công">
                  <b-form-input v-model="itemnhacungcap.tiencong" :state="valid" autocomplete="off"></b-form-input>
                  <b-form-invalid-feedback>
                    Thiếu tiền công
                  </b-form-invalid-feedback>
                </b-form-group>
              </ValidationProvider>
              <ValidationProvider rules="required" v-slot="{ errors, valid, failedRules }">
                <b-form-group description="(là khoản tiền cộng thêm khi nhập hàng(50= giá bán ra hiện tại - 50k))"
                  label="Giá vàng">
                  <b-form-input v-model="itemnhacungcap.giavang" :state="valid" autocomplete="off"></b-form-input>
                  <b-form-invalid-feedback>
                    Thiếu giá vàng
                  </b-form-invalid-feedback>
                </b-form-group>
              </ValidationProvider>
              <ValidationProvider rules="" v-slot="{ errors, valid, failedRules }">
                <b-form-group :state="valid" label="Số điện thoại">
                  <b-form-input :state="valid" v-model="itemnhacungcap.sodienthoai">
                  </b-form-input>
                  <b-form-invalid-feedback>
                    Thiếu số điện thoại
                  </b-form-invalid-feedback>
                </b-form-group>
              </ValidationProvider>

              <b-button type="submit" variant="primary">Lưu</b-button>
              <b-button type="button" variant="warning" @click="huyhanhdong">Hủy</b-button>
            </b-form>
          </ValidationObserver>
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
  // console.log(rule);
  extend(rule, rules[rule]);
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  mounted() {
    this.getNhacungcap();
  },
  methods: {
    insertSanPham() {
      this.$refs.veeForm.validate().then(async (success) => {
        if (success) {
          this.overlay = true
          if (this.action === "new") {
            //tao moi
            let itemUpdate = {
              name: this.itemnhacungcap.name,
              address: this.itemnhacungcap.address,
              tccs: this.itemnhacungcap.tccs,
              short: this.itemnhacungcap.short,
              tiencong: parseFloat(this.itemnhacungcap.tiencong),
              giavang: parseFloat(this.itemnhacungcap.giavang),
              sdt: this.itemnhacungcap.sdt
            }
            await this.$supabase.from("nhacungcap").insert(itemUpdate)
            await this.getNhacungcap();
          } else if (this.action === "edit") {
            let itemUpdate = {
              name: this.itemnhacungcap.name,
              address: this.itemnhacungcap.address,
              tccs: this.itemnhacungcap.tccs,
              short: this.itemnhacungcap.short,
              tiencong: parseFloat(this.itemnhacungcap.tiencong),
              giavang: parseFloat(this.itemnhacungcap.giavang),
              sdt: this.itemnhacungcap.sdt
            }

            await this.$supabase.from("nhacungcap").update(itemUpdate).eq('id', this.itemnhacungcap.id)
            await this.getNhacungcap();
          }

        }
      })
    },
    themnhacungcap() {
      this.overlay = true;
      this.action = "new";
      this.itemnhacungcap = {
        name: null,
        address: null,
        tccs: null,
        short: null,
        tiencong: 0.5,
        giavang: -50,
        sodienthoai: null,
      };
    },
    async deleteItem(item) {
      this.overlay = true

      await this.$supabase.from("nhacungcap").delete().eq('id', item.id)
      await this.getNhacungcap();
    },
    choiceCungCap(item) {
      this.itemnhacungcap = item;
    },
    async getNhacungcap() {
      this.overlay = true;
      let listncc = await this.$supabase.from("nhacungcap").select();
      this.listnhacungcap = listncc.data;
      this.overlay = false;
    },
    huyhanhdong(){
      this.action='edit'
      this.overlay=false
      this.itemnhacungcap=null
    }
  },
  data() {
    return {
      action: 'edit',
      overlay: false,
      listnhacungcap: null,
      itemnhacungcap: null,
      fieldlistcungcap: [
        { key: "stt", label: "#" },
        { key: "name", label: "Tên" },
        { key: "address", label: "Tên" },
        { key: "tccs", label: "Tên" },
        { key: "short", label: "Tên" },
        { key: "tool", label: "#" },
      ],
    };
  },
};
</script>
<style>
.nhacungcap:hover {
  cursor: pointer;
  color: red !important;
}
</style>