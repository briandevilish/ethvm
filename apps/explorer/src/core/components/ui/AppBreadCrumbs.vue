<template>
  <v-card flat color="transparent" class="mb-4">
    <v-layout row wrap align-center justify-start class="pl-2 pr-2 mb-4">
      <v-card-title v-for="(item, i) in crumbs" :key="i" class="pl-0 pr-1 pb-0 text-truncate">
        <v-icon small v-if="item.icon" :class="[item.disabled ? 'black--text  pr-2' : 'info--text  pr-2']">{{ item.icon }}</v-icon>
        <p v-if="item.link" class="pa-0 ma-0 text-truncate">
          <router-link :class="[item.disabled ? 'black--text' : 'info--text']" :to="item.link">{{ item.text }}</router-link>
        </p>
        <p v-else class="black--text pa-0 ma-0 text-truncate">{{ item.text }}</p>
        <p v-if="i < crumbs.length - 1" class="pl-1 pr-0 pt-0 mb-0 caption">/</p>
      </v-card-title>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Crumb } from '@app/core/components/props'
@Component
export default class AppBreadCrumbs extends Vue {
  @Prop(Array) newItems!: Crumb[]

  crumbs = []

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  mounted() {
    this.prepareBreadcrumbs()
  }

  @Watch('newItems')
  onNewItemsChange() {
    this.prepareBreadcrumbs()
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  prepareBreadcrumbs() {
    this.setHome()
    this.addNewItems()
  }

  setHome() {
    this.crumbs = []
    this.crumbs.push(this.home)
  }

  addNewItems() {
    if (this.newItems) {
      this.crumbs[0].disabled = false
      for (const i in this.newItems) {
        this.crumbs.push(this.newItems[i])
      }
    }
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get home(): Crumb {
    const crumbHome = {
      text: this.$i18n.t('title.home').toString(),
      disabled: true,
      icon: 'fa fa-home',
      link: '/'
    }
    return crumbHome
  }
}
</script>
