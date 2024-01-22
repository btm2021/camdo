<template>
  <div>
    {{ data.field }}
    <div v-if="data.field.key === 'product_total_weight'">
      <b-input />
    </div>

    <div v-if="data.field.key === 'product_wage'">
      <b-input />
    </div>
  </div>
</template>

<script>
export default {
  props: ["data"],
};
</script>

<style>
</style>