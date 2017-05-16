<template>
  <div class="module" :class="[ 'is-' + module.type ]">
    <div class="header" @click="expanded = true">
      <div class="name">{{ name }}</div>
    </div>

    <div class="modal" :class="{ 'is-active': expanded }">
      <span class="close" @click="expanded = false">&times;</span>
      <div class="title">{{ name }}</div>
      <div class="desc">{{ module.description }}</div>

      <div class="docs">
        <section v-if="module.properties.length > 0">
          <div class="title">Static Properties</div>
          <ul>
            <li v-for="property in module.properties" @click="open(property, 'static-method')">{{ property }}</li>
          </ul>
        </section>

        <section v-if="module.methods.length > 0">
          <div class="title">Static Methods</div>
          <ul>
            <li v-for="method in module.methods" @click="open(method, 'static-method')">{{ method }}</li>
          </ul>
        </section>

        <section v-if="module.instanceEvents.length > 0">
          <div class="title">Instance Events</div>
          <ul>
            <li v-for="event in module.instanceEvents" @click="open(event, 'event')">{{ event }}</li>
          </ul>
        </section>

        <section v-if="module.instanceMethods.length > 0">
          <div class="title">Instance Methods</div>
          <ul>
            <li v-for="method in module.instanceMethods" @click="open(method, 'instance-method')">{{ method }}</li>
          </ul>
        </section>

        <section v-if="module.instanceProperties.length > 0">
          <div class="title">Instance Properites</div>
          <ul>
            <li v-for="property in module.instanceProperties" @click="open(property, 'instance-property')">{{ property }}</li>
          </ul>
        </section>
      </div>
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
    },
    methods: {
      open (meta, type) {
        let name = this.name
        let camels = this.name.match(/[A-Z]/g)
        if (camels !== null) {
          camels.forEach(letter => {
            name = name.replace(letter, `-${letter.toLowerCase()}`)
          })
        }
        name = name.replace(/^-/, '')

        let anchor = ''

        switch (type) {
          case 'static-method':
            anchor = this.name
            anchor += meta.match(/^[A-z]+(\.[A-z]+)?(\.[A-z]+)?/g)[0].replace(/\./g, '')

            let params = meta.match(/\(.+\)/g)
            if (params !== null) {
              anchor += params[0].replace(/\[?,\s|\],\s|\]|\(/g, '-').replace(/\[|\)|^-|\.\.\./g, '')
            }

            let tags = meta.match(/_[A-z]+_/g)
            if (tags !== null) {
              tags.forEach(tag => {
                anchor += `-${tag.replace(/_/g, '')}`
              })
            }
            break

          case 'event':
            anchor += 'event-'
            anchor += meta

            let tags__ = meta.match(/_[A-z]+_/g)
            if (tags__ !== null) {
              tags__.forEach(tag => {
                anchor += `-${tag.replace(/_/g, '')}`
              })
            }

            anchor = anchor.replace(/(\s_[A-z]+_)?(\s_[A-z]+_)?(\s_[A-z]+_)?/g, '')
            break

          case 'instance-method':
            anchor += meta.match(/^[A-z]+(\.[A-z]+)?(\.[A-z]+)?/g)[0].replace(/\./g, '')

            let params_ = meta.match(/\(.+\)/g)
            if (params_ !== null) {
              anchor += params_[0].replace(/\[?,\s|\],\s|\]|\(/g, '-').replace(/\[|\)|^-/g, '')
            }

            let tags_ = meta.match(/_[A-z]+_/g)
            if (tags_ !== null) {
              tags_.forEach(tag => {
                anchor += `-${tag.replace(/_/g, '')}`
              })
            }
            break

          case 'instance-property':
            anchor += meta.replace(/\./g, '')
        }

        anchor = anchor.replace(/-$/g, '').replace(/--/g, '-')
        anchor = anchor.toLowerCase()

        window.open(`https://electron.atom.io/docs/api/${name}/#${anchor}`)
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
    height: calc(100vh - 80px);
    left: 50%;
    overflow: hidden;
    padding: 26px 32px;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: calc(100vw - 80px);
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

    & > .title {
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
      margin-bottom: 14px;
      margin-top: 12px;
      padding: 16px;
      width: calc(50% - 10px);
    }

    .docs {
      column-count: 2;
      column-gap: 20px;
    }
  }

  .modal section {
    display: inline-block;
    margin-bottom: 10px;
    width: 100%;

    .title {
      font-size: 18px;
      margin-bottom: 10px;
    }

    ul {
      border-radius: 4px;
      max-height: 200px;
      overflow-y: auto;
    }

    li {
      cursor: pointer;
      font-size: 14px;
      padding: 8px 12px;
      transition: background 100ms ease-in-out;

      &:hover { background: rgba(0,0,0,.4) !important; }

      &:nth-child(2n-1) { background: rgba(0,0,0,.2); }
      &:nth-child(2n) { background: rgba(0,0,0,.3); }
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
