<template>
  <b-container>
    <b-row>
      <b-col cols="12">
        <b-input
          v-model="inputMaGiay"
          @change="themSp"
          autocomplete="off"
          type="text"
        ></b-input>
        <b-button variant="outline-primary" @click="them()">Check</b-button>
      </b-col>
      <b-col cols="12">
        {{ listInput }}
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  layout: "thanhly",

  data() {
    return {
      inputMaGiay: null,
      listInput: [],
    };
  },

  methods: {
    themSp() {
      if (this.inputMaGiay && this.inputMaGiay.length > 0) {
        this.listInput.push(this.inputMaGiay);
        this.inputMaGiay = null;
      } else {
        alert("Vui lòng nhập đúng mã giấy");
      }
    },
    them() {
      console.log(this.listInput);
    },
  },
};
</script>

<style>
</style>