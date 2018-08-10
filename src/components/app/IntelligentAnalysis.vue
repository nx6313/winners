<template>
  <div class="inteligent-analysis">
    <div class="top-apps-wrap">
      <div class="top-app-item" v-for="(app, appIndex) in topApps" :key="appIndex" :style="{ 'width': `calc((100% - 5 * 2 * 0.2rem) / 5)` }">
        <i :style="{ 'background-image': `url(${app.icon})` }"></i>
        <span>{{app.text}}</span>
      </div>
    </div>
    <comm-table :title="tableTitles" :data="tableData" :show-index="true" :line-num="8" :rank-badge="true"></comm-table>
  </div>
</template>

<script>
import Table from '@/components/CommTable'

export default {
  name: 'AppIntelligentAnalysis',
  components: {
    'comm-table': Table
  },
  data () {
    return {
      topApps: [
        {
          icon: require('@/assets/do_ssjx.png'),
          text: '即时绩效'
        },
        {
          icon: require('@/assets/do_kpi.png'),
          text: 'KPI考核'
        },
        {
          icon: require('@/assets/do_yjjl.png'),
          text: '佣金奖励'
        }
      ],
      tableTitles: [
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '提成统计',
          prop: 'tctj'
        },
        {
          label: '整车销售',
          prop: 'zcxs'
        },
        {
          label: '汽车用品',
          prop: 'qcyp'
        },
        {
          label: '金融',
          prop: 'jr'
        },
        {
          label: '二手车',
          prop: 'esc'
        },
        {
          label: '保险',
          prop: 'bx'
        }
      ],
      tableData: [
        {
          'name': '高兆祥',
          'tctj': '6374.30',
          'zcxs': '6374.30',
          'qcyp': '6374.30',
          'jr': '6374.30',
          'esc': '6374.30',
          'bx': '6374.30'
        },
        {
          'name': '高兆祥',
          'tctj': '6374.30',
          'zcxs': '6374.30',
          'qcyp': '6374.30',
          'jr': '6374.30',
          'esc': '6374.30',
          'bx': '6374.30'
        },
        {
          'name': '高兆祥',
          'tctj': '6374.30',
          'zcxs': '6374.30',
          'qcyp': '6374.30',
          'jr': '6374.30',
          'esc': '6374.30',
          'bx': '6374.30'
        },
        {
          'name': '高兆祥',
          'tctj': '6374.30',
          'zcxs': '6374.30',
          'qcyp': '6374.30',
          'jr': '6374.30',
          'esc': '6374.30',
          'bx': '6374.30'
        }
      ]
    }
  },
  mounted () {
    this.$call('addTitleBtn', JSON.stringify([
      {
        event: 'title-btn-day',
        txt: '日'
      },
      {
        event: 'title-btn-month',
        txt: '月'
      },
      {
        event: 'title-btn-year',
        txt: '年'
      }
    ]))
  }
}
</script>

<style lang="scss" scoped>
.inteligent-analysis {
  position: relative;
  height: 100vh;
  .top-apps-wrap {
    position: relative;
    font-size: 0;
    padding: 0.2rem 0.6rem 0.8rem;
    text-align: center;
    .top-app-item {
      position: relative;
      display: inline-block;
      padding: 0.2rem;
      text-align: center;
      margin: 0 0.8rem;
      i {
        position: relative;
        display: inline-block;
        height: 0;
        width: 100%;
        padding-bottom: 100%;
        background-size: 80%;
        background-repeat: no-repeat;
        background-position: center;
      }
      span {
        position: relative;
        display: inline-block;
        font-size: 0.8rem;
        margin-top: 0.4rem;
        white-space: nowrap;
      }
    }
  }
}
</style>
