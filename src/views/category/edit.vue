<template>
  <article-detail :is-edit='true'></article-detail>
</template>

<script>
import CategoryDetail from './components/CategoryDetail'

export default {
  name: 'editForm',
  components: { CategoryDetail }
}
</script>

