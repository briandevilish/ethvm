<template>
  <app-chart
    type="line"
    :chart-title="title"
    :chart-description="description"
    :data="chartData"
    :options="chartOptions"
    :redraw="redraw"
    unfilled="true"
    @timeFrame="setTimeFrame"
  />
</template>

<script lang="ts">
import AppChart from '@app/modules/charts/components/AppChart.vue'
import { ChartMixin } from '@app/modules/charts/mixins'
import { Component, Mixins } from 'vue-property-decorator'
import { Events } from 'ethvm-common'

/* Time Variables: */

@Component({
  components: {
    AppChart
  }
})
export default class ChartBlockTime extends Mixins(ChartMixin) {
  //Temp Event String
  newEvent = Events.getAverageBlockTimeStats

  // Lifecycle
  created() {
    this.setTitle(this.title)
    this.setLabel(this.labelString)
    this.setEvent(this.newEvent)
  }

  // Computed
  get title() {
    return this.$i18n.t('charts.avgBlockTime').toString()
  }

  get labelString(): string {
    return this.$i18n.t('charts.block-time-history').toString()
  }
}
</script>
