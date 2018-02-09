<template>
  <category-detail :is-edit='false'></category-detail>
</template>

<script>
import CategoryDetail from './components/CategoryDetail'

export default {
  name: 'createForm',
  components: { CategoryDetail }
}
</script>

