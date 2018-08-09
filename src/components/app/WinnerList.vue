<template>
  <div class="winner-list">
    <div class="top-apps-wrap">
      <div class="top-app-item" v-for="(app, appIndex) in topApps" :key="appIndex" :style="{ 'width': `calc((100% - ${topApps.length} * 2 * 0.2rem) / ${topApps.length})` }">
        <i :style="{ 'background-image': `url(${app.icon})` }"></i>
        <span>{{app.text}}</span>
      </div>
    </div>
    <comm-table :title="tableTitles" :second-title="tableSecondTitles" :data="tableData" :show-index="true" :line-num="3"></comm-table>
  </div>
</template>

<script>
import Table from '@/components/CommTable'

export default {
  name: 'AppWinnerList',
  components: {
    'comm-table': Table
  },
  data () {
    return {
      topApps: [
        {
          icon: require('@/assets/do_yjpm.png'),
          text: '业绩排名'
        },
        {
          icon: require('@/assets/do_jfph.png'),
          text: '积分排行'
        },
        {
          icon: require('@/assets/do_cgjj.png'),
          text: '闯关晋级'
        },
        {
          icon: require('@/assets/do_pyxb.png'),
          text: '评优选拔'
        },
        {
          icon: require('@/assets/do_ambjs.png'),
          text: '阿米巴竞赛'
        }
      ],
      tableTitles: [
        {
          label: '贡献度',
          prop: 'gxd'
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
          label: '保险',
          prop: 'bx'
        },
        {
          label: '二手车',
          prop: 'esc'
        }
      ],
      tableSecondTitles: {
        'gxd': [
          '姓名', '金额（元）'
        ],
        'zcxs': [
          '姓名', '台数'
        ],
        'qcyp': [
          '姓名', '销售额'
        ],
        'jr': [
          '姓名', '信贷量'
        ],
        'bx': [
          '姓名', '投保量（单）'
        ],
        'esc': [
          '姓名', '销售（台）'
        ]
      },
      tableData: [
        {
          'gxd': [
            '高兆祥', '6374.30'
          ],
          'zcxs': [
            '高兆祥', '6374.30'
          ],
          'qcyp': [
            '高兆祥', '6374.30'
          ],
          'jr': [
            '高兆祥', '6374.30'
          ],
          'bx': [
            '高兆祥', '6374.30'
          ],
          'esc': [
            '高兆祥', '6374.30'
          ]
        },
        {
          'gxd': [
            '陈俊锋', '6374.30'
          ],
          'zcxs': [
            '戈凯', '6374.30'
          ],
          'qcyp': [
            '陆雪梦', '6374.30'
          ],
          'jr': [
            '高兆祥', '6374.30'
          ],
          'bx': [
            '高兆祥', '6374.30'
          ],
          'esc': [
            '高兆祥', '6374.30'
          ]
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.winner-list {
  position: relative;
  height: 100vh;
  .top-apps-wrap {
    position: relative;
    font-size: 0;
    padding: 0.2rem 0.6rem 0.8rem;
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
