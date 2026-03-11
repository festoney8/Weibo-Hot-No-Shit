<template>
  <div></div>
</template>

<script setup lang="ts">
import { useFilteredDefaultHotSearch } from './composables/defaultHot'
import { useFilteredMineHotSearch } from './composables/mineHot'

console.log(useFilteredMineHotSearch().hotSearches.value)
console.log(useFilteredDefaultHotSearch().hotSearches.value)
</script>

<style scoped></style>
