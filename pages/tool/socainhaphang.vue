<template>
  <b-container>
    <b-row>
      <b-col cols="12" class="mt-5">
        <b-input-group prepend="Mã số" class="mt-3">
          <b-form-input size="lg" v-model="inputMaGiay" @change="themSp" autocomplete="off" type="text"></b-form-input>

        </b-input-group>

      </b-col>
      <b-col cols="12" class="mt-5">
        <h2> <b-badge v-for="item, index in listInput" class="mx-2" size="lg" variant="primary" :key="index">{{ item
            }}</b-badge></h2>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  layout: "tv",

  data() {
    return {
      inputMaGiay: null,
      listInput: [],
    };
  },

  methods: {
    async themSp() {
      if (this.inputMaGiay && this.inputMaGiay.length > 0) {

        this.$supabase
          .from('sanpham')
          .update({ isShow: true })
          .eq('maso', this.inputMaGiay).then(data => {
            this.$bvToast.toast(
              `Update sản phẩm ${this.inputMaGiay} thành công`,
              {
                title: "Thông báo",
                autoHideDelay: 3000,
                appendToast: true,
                variant: "primary",
              }
            );
            console.log('ok')

            this.listInput.push(this.inputMaGiay);
            this.inputMaGiay = null;
          })
      } else {
        alert("Vui lòng nhập đúng mã giấy");
      }
    },
    them() {

    },
  },
};
</script>

<style></style>