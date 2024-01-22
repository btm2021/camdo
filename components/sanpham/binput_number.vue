<template>
  <div>
    <template
      v-if="tooltipData && tooltipData.field.key === 'product_total_weight'"
    >
      <!-- Sử dụng props ở đây để hiển thị dữ liệu -->
      <div>
        as
        <b-input />
      </div>
    </template>

    <template v-if="tooltipData && tooltipData.field.key === 'product_catalog'">
      <!-- Sử dụng props ở đây để hiển thị dữ liệu -->
      <div>
        as1
        <b-select
          v-model="tempEdit"
          :options="this.$store.state.config.sanpham_optionCatalog"
        ></b-select>
      </div>
    </template>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>