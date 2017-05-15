<template>
  <div>
    <input type="text" placeholder="Search..." v-model="query">
    <span class="tag is-main" :class="{ 'is-active': filters.main }" @click="filters.main = !filters.main">Main</span>
    <span class="tag is-renderer" :class="{ 'is-active': filters.renderer }" @click="filters.renderer = !filters.renderer">Renderer</span>
    <span class="tag is-both" :class="{ 'is-active': filters.both }" @click="filters.both = !filters.both">Both</span>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        query: '',
        filters: {
          main: true,
          renderer: true,
          both: true
        }
      }
    },
    methods: {
      update () {
        this.$emit('query', {
          query: this.query,
          filters: this.filters
        })
      }
    },
    watch: {
      query () { this.update() },
      filters: {
        deep: true,
        handler () { this.update() }
      }
    }
  }
</script>

<style lang="scss" scoped>
  input {
    border: 2px solid #f0f1f4;
    border-radius: 4px;
    font-family: 'Roboto', sans-serif;
    outline: none;
    padding: 10px;
    margin-right: 8px;
    width: 250px;
  }

  .tag {
    border-radius: 4px;
    color: #ecf0f1;
    cursor: pointer;
    margin-right: 6px;
    opacity: .35;
    padding: 6px 12px;

    &.is-active { opacity: 1; }

    &.is-main { background: linear-gradient(#36D1DC, #5B86E5); }
    &.is-renderer { background: linear-gradient(#F2C94C, #F2994A); }
    &.is-both { background: linear-gradient(#9D50BB, #6E48AA); }
  }
</style>
