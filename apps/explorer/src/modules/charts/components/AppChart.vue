<template>
  <v-card color="white" flat class="mb-3 pa-1">
    <v-layout align-end row wrap mb-0>
      <v-flex xs12>
        <v-card-title class="title font-weight-bold pb-1">{{ chartTitle }}</v-card-title>
        <v-card-text class="pt-0 pb-0 info--text caption">{{ chartDescription }}</v-card-text>
      </v-flex>
      <v-flex xs12 v-if="!liveChart" pt-0>
        <v-toolbar flat color="transparent" height="40">
          <v-layout align-center justify-end>
            <v-btn-toggle depressed v-model="toggleData" mandatory>
              <v-btn flat :value="0" active-class="active-button white--text" small>{{ $t('charts.options.all') }}</v-btn>
              <v-btn flat :value="1" active-class="active-button white--text" small>{{ $t('charts.options.w') }}</v-btn>
              <v-btn flat :value="2" active-class="active-button white--text" small>{{ $t('charts.options.m') }}</v-btn>
              <!--<v-btn flat :value="3" active-class="active-button white--text" small>1Y</v-btn> -->
            </v-btn-toggle>
          </v-layout>
        </v-toolbar>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-layout align-center justify-end row fill-height v-if="footnotes"> <app-footnotes :footnotes="footnotes" /> </v-layout>
    <app-info-load v-show="data && data.datasets && data.datasets[0].data.length === 0" />
    <div v-show="data && data.datasets && data.datasets[0].data.length !== 0"><canvas ref="chart" /></div>
  </v-card>
</template>

<script lang="ts">
import Chart from 'chart.js'
import AppFootnotes from '@app/core/components/ui/AppFootnotes.vue'
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Footnote } from '@app/core/components/props'
import { ChartData } from '@app/modules/charts/props'

Chart.defaults.global = Object.assign(Chart.defaults.global, {
  defaultFontFamily: "'Open Sans', 'sans-serif'",
  defaultFontStyle: '200'
})

Chart.defaults.global.title = Object.assign(Chart.defaults.global.title, {
  display: false
})

Chart.defaults.global.tooltips = Object.assign(Chart.defaults.global.tooltips, {
  titleFontStyle: '400',
  backgroundColor: '#686868'
})

Chart.defaults.global.legend = Object.assign(Chart.defaults.global.legend, {
  display: false
})

Chart.defaults.global.layout = Object.assign(Chart.defaults.global.layout, {
  padding: {
    left: 5,
    right: 5,
    top: 20,
    bottom: 20
  }
})

Chart.defaults.global.elements.point = Object.assign(Chart.defaults.global.elements.point, {
  hoverRadius: 6,
  borderWidth: 1
})

Chart.defaults.doughnut.animation = Object.assign(Chart.defaults.doughnut.animation, {
  animateRotate: true
})

@Component({
  components: {
    AppFootnotes,
    AppInfoLoad
  }
})
export default class AppChart extends Vue {
  @Prop({ type: Boolean, default: false }) liveChart!: boolean
  @Prop({ type: String, required: true }) type!: string
  @Prop({ type: Object, required: true }) data!: ChartData
  @Prop({ type: Boolean }) redraw!: boolean
  @Prop({ type: Object }) options!: object
  @Prop({ type: String }) chartTitle!: string
  @Prop({ type: String }) chartDescription!: string
  @Prop({ type: Array }) footnotes?: Footnote[]
  @Prop({ type: Boolean }) dataLoading?: boolean

  toggleData = 1
  updateChart = false
  chart = null

  /*LifeCycle: */
  created() {
    if (!this.liveChart) {
      this.$emit('timeFrame', this.toggleData)
    }
  }
  mounted() {
    if (this.data && this.data.datasets && this.data.datasets[0].data.length !== 0) {
      this.createChart()
    }
  }

  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy()
    }
  }

  /* Watchers: */
  @Watch('data')
  onDataChanged(): void {
    if (this.redraw) {
      if (this.chart) {
        this.chart.destroy()
      }
      this.createChart()
    } else {
      if (!this.chart) {
        this.createChart()
      }
      this.chart.update()
    }
  }

  @Watch('toggleData')
  onTogleDataChanged(newVal: number, oldVal: number): void {
    this.$emit('timeFrame', newVal)
  }

  /*Methods: */
  createChart() {
    this.chart = new Chart(this.$refs.chart, {
      type: this.type,
      data: this.data,
      options: this.options
    })
  }
}
</script>

<style scoped lang="css">
.active-button{
  background-color:#6270fc;
  opacity: 1;
}
</style>
