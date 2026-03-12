<template>
  <div></div>
</template>

<script setup lang="ts">
import { useFilteredDefaultHotSearch } from './composables/defaultHot'
import { useFilteredMineHotSearch } from './composables/mineHot'

watchEffect(() => {
  console.log('mine', useFilteredMineHotSearch().hotSearches.value)
  console.log('default', useFilteredDefaultHotSearch().hotSearches.value)
})
</script>

<style lang="scss" scoped></style>
