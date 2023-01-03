<template>
  <article>
    <div class="dashboard-panel-chart" style="height:100%;">
      <Chart v-if="loadedChart" :chart-data="dataChart" :options="optionsChart" style="height:100%;"></Chart>
    </div>
  </article>
</template>
<script>
import Chart from "@/components/dashboard/Chart.vue"
import CommonUtil from "@/lib/CommonUtil";
import EventBus from "@/common/EventBus";

export default {
  name: '',
  components: {
    Chart
  },
  props: {
    panelTitle: {
      type: String,
      default: '',
    },
    refresh: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      radioRange: '일별',
      isActive: false,
      // 차트 데이터
      loadedChart: false,
      optionsChart: {
        type: 'bar',
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 30,
          },
        },
        scales: {
          yAxes: [
            {
              id: 'Y',
              type: 'linear',
              position: 'left',
              ticks: {
                // 없으면 자동조절?
                // max: 400,
                min: 0,
                stepSize: 100,
              },
              gridLines: {
                drawBorder: false,
              },
            },
            {
              id: 'Y1',
              type: 'linear',
              position: 'right',
              ticks: {
                // 없으면 자동조절?
                // max: 100,
                // min: 60,
                stepSize: 30,
              },
              gridLines: {
                drawBorder: false,
                display: false,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
                fontColor: '#57c3e6',
              },
              gridLines: {
                display: false,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
      },
      dataChart: {
        labels: [],
        datasets: [
          {
            label: 'a',
            data: [],
            borderColor: '#fc6177',
            borderWidth: 1,
            pointRadius: 4,
            pointBackgroundColor: '#fc6177',
            backgroundColor: 'rgba(255,255,255,0)',
            type: 'line',
            order: 0,
            yAxisID: 'Y1',
            datalabels: {
              align: 'end',
              color: '#fc6177',
              font: {
                weight: 'bold',
              },
              padding: 0,
              formatter: (value, context) => value + '%',
            },
          },
          {
            label: 'b',
            data: [],
            backgroundColor: '#161573',
            yAxisID: 'Y',
            datalabels: {
              // align: 'end',
              color: 'white',
              font: {
                weight: 'bold',
              },
              padding: 0,
            },
          },
          {
            label: 'c',
            data: [],
            backgroundColor: '#1bc0fd',
            yAxisID: 'Y',
            datalabels: {
              // align: 'top',
              color: 'white',
              font: {
                weight: 'bold',
              },
              padding: 6,
            },
          },
        ],
      },
    };
  },
  watch: {
    radioRange: {
      handler(value, oldValue) {
        this.retrieve();
      },
      immediate: true, // 컴포넌트가 생성되자마자 즉시 실행
    },
    refresh: {
      handler(value, oldValue) {
        if (value) {
          this.retrieve();
        }
      },
    },
  },
  created() {},
  mounted() {
    this.loadedChart = true; // 마운트 시 차트 보여주기

    EventBus.$off('loadChartRelease');
    EventBus.$on("loadChartRelease", (param)=>{
      this.retrieve();
    });
  },
  unmounted() {},
  methods: {
    chartReload() {
      this.isActive = true;
      setTimeout(() => (this.isActive = false), 1000);
    },
    retrieve() {
      // 대시보드 / 7일 / 6개월 / 3년
      let termsCode = 'D';
      let dateFormat = 'YYYYMMDD';

      if (this.radioRange === '월별') {
        termsCode = 'M';
        dateFormat = 'YYYY.MM';
      } else if (this.radioRange === '년별') {
        termsCode = 'Y';
        dateFormat = 'YYYY';
      } else {
        // this.radioRange === '일별'
        termsCode = 'D';
        dateFormat = 'YYYY.MM.DD';
      }

      this.searchMap = {
        termsClCd: termsCode, // 년:Y / 월:M / 일:D
        usrId: this.getLoginSession.aud,
      };

      this.$fetchData({
        url: process.env.VUE_APP_URL+'/dashboard/list',
        method: 'GET',
        params: this.searchMap
      }).then((response) => {
        console.log('조회 성공 : ',response);

        if (CommonUtil.isEmpty(response)) {
          if (this.refresh) {
            this.$emit('set-result', false);
          }
          return;
        }

        const data = response.reduce(function (nData, el) {
          const group = el[termsCode];

          if (!nData[group]) {
            nData[group] = [];
          }

          nData[group].push(el);

          return nData;
        }, {});

        const labels = [];
        const ratio = [];
        const chulgo = [];
        const done = [];

        // 날짜
        Object.keys(data).forEach((item) => {
          labels.push(this.$moment(item).format(dateFormat));
        });

        // a
        Object.values(data).forEach((item) => {
          ratio.push(item[0].sumDlvRate);
        });

        // b
        Object.values(data).forEach((item) => {
          chulgo.push(item[0].sumKpiQty);
        });

        // c
        Object.values(data).forEach((item) => {
          done.push(item[0].dlvKpiQty);
        });

        // 날짜
        this.dataChart.labels = labels;

        // a
        this.dataChart.datasets[0].data = ratio;

        // b
        this.dataChart.datasets[1].data = chulgo;

        // c
        this.dataChart.datasets[2].data = done;

        // 차트 렌더링...
        this.dataChart = {
          ...this.dataChart,
        };
        console.log("dataChart : ",this.dataChart)

        if (this.refresh) {
          this.$emit('set-result', false);
        }
      });
    },
  },
};
</script>
