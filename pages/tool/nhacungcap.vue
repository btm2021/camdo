<template>
  <div class="mt-2">
    <b-row>
      <b-col cols="7">
        <b-button-group>
          <b-button variant="primary" @click="themnhacungcap"
            >Thêm nhà cung cấp</b-button
          >
        </b-button-group>
        <b-overlay :show="overlay">
          <b-table
            :items="listnhacungcap"
            :fields="fieldlistcungcap"
            show-empty
            small
            responsive
            hover
            striped
          >
            <template #cell(stt)="data">
              <b>{{ data.index + 1 }}</b>
            </template>
            <template #cell(name)="data">
              <b
                class="text-success nhacungcap"
                @click="choiceCungCap(data.item)"
              >
                {{ data.value }}</b
              >
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
          </b-table>
        </b-overlay>
      </b-col>
      <b-col cols="5">
        <b-card
          ><b-form v-if="itemnhacungcap">
            <b-form-group label="Tên nhà cung cấp:">
              <b-form-input
                v-model="itemnhacungcap.name"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Địa chỉ nhà cung cấp:">
              <b-form-input
                v-model="itemnhacungcap.address"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Tiêu chuẩn cơ cở:">
              <b-form-input
                v-model="itemnhacungcap.tccs"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Tiêu chuẩn cơ cở:">
              <b-form-input
                v-model="itemnhacungcap.short"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group
              description="là khoảng tiền cộng thêm khi nhập hàng(0.5 = Công nhập = công xuất/2)"
              label="Tiền công"
            >
              <b-form-input
                v-model="itemnhacungcap.tiencong"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group
              description="(là khoản tiền cộng thêm khi nhập hàng(50= giá bán ra hiện tại - 50k))"
              label="Giá vàng"
            >
              <b-form-input
                v-model="itemnhacungcap.giavang"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Số điện thoại">
              <b-form-input
                v-model="itemnhacungcap.sodienthoai"
                required
              ></b-form-input>
            </b-form-group>

            <b-button type="submit" variant="primary">Lưu</b-button>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
export default {
  mounted() {
    this.getNhacungcap();
  },
  methods: {
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
    choiceCungCap(item) {
      console.log(item);
      this.itemnhacungcap = item;
    },
    async getNhacungcap() {
      this.overlay = true;
      let listncc = await this.$supabase.from("nhacungcap").select();
      this.listnhacungcap = listncc.data;
      this.overlay = false;
    },
  },
  data() {
    return {
      action: null,
      overlay: false,
      listnhacungcap: false,
      itemnhacungcap: null,
      fieldlistcungcap: [
        { key: "stt", label: "#" },
        { key: "name", label: "Tên" },
        { key: "address", label: "Tên" },
        { key: "tccs", label: "Tên" },
        { key: "short", label: "Tên" },
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