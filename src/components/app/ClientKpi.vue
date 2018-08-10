<template>
  <div class="client-kpi">
    <div class="top-apps-wrap">
      <div class="top-app-item" v-for="(app, appIndex) in topApps" :key="appIndex" :style="{ 'width': `calc((100% - 5 * 2 * 0.2rem) / 5)` }">
        <i :style="{ 'background-image': `url(${app.icon})` }"></i>
        <span>{{app.text}}</span>
      </div>
    </div>
    <comm-table :title="tableTitles" :data="tableData" :show-index="true" :line-num="6" :rank-badge="true"></comm-table>
  </div>
</template>

<script>
import Table from '@/components/CommTable'

export default {
  name: 'AppClientKpi',
  components: {
    'comm-table': Table
  },
  data () {
    return {
      topApps: [
        {
          icon: require('@/assets/do_qkhx.png'),
          text: '潜客画像'
        },
        {
          icon: require('@/assets/do_ddgl.png'),
          text: '订单管理'
        },
        {
          icon: require('@/assets/do_qkfx.png'),
          text: '潜客分析'
        },
        {
          icon: require('@/assets/do_cjfx.png'),
          text: '成交分析'
        },
        {
          icon: require('@/assets/do_zbfx.png'),
          text: '战败分析'
        }
      ],
      tableTitles: [
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '成交量',
          prop: 'cjl'
        },
        {
          label: '成交率',
          prop: 'cjlv'
        },
        {
          label: '二次到店量',
          prop: 'ecddl'
        },
        {
          label: '二次到店率',
          prop: 'ecddlv'
        },
        {
          label: '留档量',
          prop: 'ldl'
        },
        {
          label: '留档率',
          prop: 'ldlv'
        },
        {
          label: '试驾人数',
          prop: 'sjrs'
        },
        {
          label: '试驾率',
          prop: 'sjlv'
        },
        {
          label: '接待量',
          prop: 'jdl'
        },
        {
          label: '战败',
          prop: 'zb'
        }
      ],
      tableData: [
        {
          'name': '高兆祥',
          'cjl': '9',
          'cjlv': '60%',
          'ecddl': '36',
          'ecddlv': '60%',
          'ldl': '90',
          'ldlv': '60%',
          'sjrs': '2',
          'sjlv': '8',
          'jdl': '9',
          'zb': '6'
        },
        {
          'name': '高兆祥',
          'cjl': '9',
          'cjlv': '60%',
          'ecddl': '36',
          'ecddlv': '60%',
          'ldl': '90',
          'ldlv': '60%',
          'sjrs': '2',
          'sjlv': '8',
          'jdl': '9',
          'zb': '6'
        },
        {
          'name': '高兆祥',
          'cjl': '9',
          'cjlv': '60%',
          'ecddl': '36',
          'ecddlv': '60%',
          'ldl': '90',
          'ldlv': '60%',
          'sjrs': '2',
          'sjlv': '8',
          'jdl': '9',
          'zb': '6'
        },
        {
          'name': '高兆祥',
          'cjl': '9',
          'cjlv': '60%',
          'ecddl': '36',
          'ecddlv': '60%',
          'ldl': '90',
          'ldlv': '60%',
          'sjrs': '2',
          'sjlv': '8',
          'jdl': '9',
          'zb': '6'
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
.client-kpi {
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
