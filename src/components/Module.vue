<template>
  <div class="module" :class="[ 'is-' + module.type ]">
    <div class="header">
      <div class="name">{{ name }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['module', 'name']
  }
</script>

<style lang="scss">
  .module {
    border-radius: 6px;
    box-shadow: 0;
    color: #ecf0f1;
    padding: 16px;
    margin: 0 0 14px;
    transition: box-shadow .25s;

    &:hover {
      transition: box-shadow .25s;
      box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    &.is-main { background: linear-gradient(#36D1DC, #5B86E5); }
    &.is-renderer { background: linear-gradient(#F2C94C, #F2994A); }
    &.is-both { background: linear-gradient(#9D50BB, #6E48AA); }
  }

  .header {
    .name {
      font-family: 'Roboto Mono', monospace;
      font-size: 18px;
    }
  }
</style>
