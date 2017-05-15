<template>
  <div class="module" :class="[ 'is-' + module.type ]">
    <div class="header" @click="expanded = true">
      <div class="name">{{ name }}</div>
    </div>

    <div class="modal" :class="{ 'is-active': expanded }">
      <span class="close" @click="expanded = false">&times;</span>
      <div class="title">{{ name }}</div>
      <div class="desc">{{ module.description }}</div>
    </div>
    <div class="bg" :class="{ 'is-active': expanded }" @click="expanded = false"></div>
  </div>
</template>

<script>
  export default {
    props: ['module', 'name'],
    data () {
      return {
        expanded: false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .module {
    border-radius: 6px;
    box-shadow: 0;
    color: #ecf0f1;
    display: inline-block;
    margin: 0 0 14px;
    transition: box-shadow 200ms;
    width: 100%;

    &:hover {
      transition: box-shadow 200ms;
      box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    &.is-main { background: linear-gradient(#36D1DC, #5B86E5); }
    &.is-renderer { background: linear-gradient(#F2C94C, #F2994A); }
    &.is-both { background: linear-gradient(#9D50BB, #6E48AA); }

    .header {
      cursor: pointer;
      padding: 16px;
    }
  }

  .is-main .modal { background: linear-gradient(#36D1DC, #5B86E5); }
  .is-renderer .modal { background: linear-gradient(#F2C94C, #F2994A); }
  .is-both .modal { background: linear-gradient(#9D50BB, #6E48AA); }

  .name {
    font-family: 'Roboto Mono', monospace;
    font-size: 18px;
  }

  .modal {
    border-radius: 10px;
    box-shadow:
      0 16px 24px 2px rgba(0, 0, 0, 0.14),
      0 6px 30px 5px rgba(0, 0, 0, 0.12),
      0 8px 10px -5px rgba(0, 0, 0, 0.3);
    color: #fff;
    display: none;
    height: 600px;
    left: 50%;
    padding: 26px 32px;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    z-index: 4;

    &.is-active { display: block; }

    .close {
      cursor: pointer;
      font-size: 34px;
      opacity: .7;
      position: absolute;
      right: 32px;
      top: 24px;
      transition: opacity 125ms ease-in-out;

      &:hover { opacity: 1; }
    }

    .title {
      // border-bottom: 2px solid rgba(255, 255, 255, .7);
      font-family: 'Roboto Mono', monospace;
      font-size: 26px;
      padding-bottom: 12px;
    }

    .desc {
      background: rgba(0, 0, 0, .2);
      border-left: 8px solid rgba(0, 0, 0, .3);
      border-radius: 4px;
      font-family: 'Roboto Mono', monospace;
      font-size: 14px;
      margin-top: 12px;
      padding: 16px;
    }
  }

  .bg {
    background: rgba(0, 0, 0, .5);
    display: none;
    height: 100vh;
    left: 0;
    position: absolute;
    top: 0;
    width: 100vw;
    z-index: 2;

    &.is-active { display: block; }
  }
</style>
