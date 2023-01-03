<script>
import { Bar, mixins } from 'vue-chartjs'
import chartjsPluginDatalabels from 'chartjs-plugin-datalabels'

const { reactiveProp } = mixins

export default {
  namespaced: true,
  extends: Bar,
  mixins: [reactiveProp],
  props: {
    chartData: {
      type: Object,
      default: null,
    },
    options: {
      type: Object,
      default: null,
    },
  },
  mounted() {
    console.log("this.chartData this.chartData this.chartData : ",this.chartData)
    console.log("this.options this.options this.options : ",this.options)
    this.addPlugin(chartjsPluginDatalabels)
    this.renderChart(this.chartData, this.options)
  },
}
</script>
