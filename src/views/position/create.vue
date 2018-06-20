<template>
  <position-detail :is-edit='false'></position-detail>
</template>

<script>
import PositionDetail from './components/positionDetail'

export default {
  name: 'createPosition',
  components: { PositionDetail }
}
</script>

