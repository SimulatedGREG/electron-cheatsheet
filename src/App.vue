<template>
  <div id="app">
    <h1>electron-cheatsheet</h1>
    <search @query="searchSettings = $event"></search>
    <div id="modules">
      <module v-for="(module, key) in filteredModules" :key="key" :module="module" :name="key"></module>
    </div>
  </div>
</template>

<script>
import Module from '@/components/Module'
import Search from '@/components/Search'
import modules from '../electron/docs'

export default {
  name: 'app',
  components: {
    Module,
    Search
  },
  computed: {
    filteredModules () {
      let obj = JSON.parse(JSON.stringify(this.modules))

      Object.keys(this.modules).forEach(key => {
        if (!this.searchSettings.filters[obj[key].type]) {
          delete obj[key]
        }

        if (!new RegExp(this.searchSettings.query, 'gi').test(key)) {
          delete obj[key]
        }
      })

      return obj
    }
  },
  data () {
    return {
      modules,
      searchSettings: {
        query: '',
        filters: {
          main: true,
          renderer: true,
          both: true
        }
      }
    }
  }
}
</script>

<style>
  @import "~minireset.css";
  @import url('https://fonts.googleapis.com/css?family=Roboto+Mono');
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}
  body {
    background: #f8f9fa;
    font-family: 'Roboto Mono', monospace;
  }

  h1 {
    color: #454d5d;
    font-size: 30px;
    margin-bottom: 20px;
  }

  #app { padding: 40px; }

  #modules {
    column-count: 4;
    margin-top: 20px;
  }
</style>
