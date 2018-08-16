<template>
  <div v-if="rowDatas && rowDatas.length > 0" class="comm-table" :style="!lineNum ? { 'overflow-x': 'auto', 'overflow-y': 'hidden' } : {}">
    <template>
      <div class="comm-table-rail-wrap" :style="!lineNum ? { 'width': `calc(${(title.length + (showIndex ? 1 : 0))} * 3rem)` } : {}">
        <table border="0" cellpadding="0" cellspacing="0" v-for="(t, tIndex) in tableCount" :key="tIndex">
          <tr>
            <th v-if="!secondTitle && showIndex">排名</th>
            <th v-if="secondTitle && showIndex" rowspan="2">排名</th>
            <template v-if="lineNum">
              <th v-for="(th, thIndex) in title" :key="thIndex" v-if="thIndex >= (lineNum * tIndex) && thIndex < (lineNum * (tIndex + 1))" :colspan="thIndex % lineNum === 0 && showIndex ? (isArr(rowDatas[0][thIndex]) ? (!secondTitle ? rowDatas[0][thIndex].length : rowDatas[0][thIndex].length + 1) : (!secondTitle ? 1 : 2)) : (isArr(rowDatas[0][thIndex]) ? rowDatas[0][thIndex].length : 1)">{{th.label}}</th>
            </template>
            <template v-if="!lineNum">
              <th v-for="(th, thIndex) in title" :key="thIndex" :colspan="showIndex ? (isArr(rowDatas[0][thIndex]) ? (!secondTitle ? rowDatas[0][thIndex].length : rowDatas[0][thIndex].length + 1) : (!secondTitle ? 1 : 2)) : (isArr(rowDatas[0][thIndex]) ? rowDatas[0][thIndex].length : 1)">{{th.label}}</th>
            </template>
          </tr>
          <tr v-if="secondTitle">
            <template v-if="lineNum">
              <template v-for="(second, secondIndex) in secondTitles" v-if="secondIndex >= (lineNum * tIndex) && secondIndex < (lineNum * (tIndex + 1))">
                <template v-if="isArr(second)">
                  <td v-for="(s, sIndex) in second" :key="secondIndex + '-' + sIndex">{{s}}</td>
                </template>
                <template v-if="!isArr(second)">
                  <td :key="secondIndex">{{second}}</td>
                </template>
              </template>
            </template>
            <template v-if="!lineNum">
              <template v-for="(second, secondIndex) in secondTitles">
                <template v-if="isArr(second)">
                  <td v-for="(s, sIndex) in second" :key="secondIndex + '-' + sIndex">{{s}}</td>
                </template>
                <template v-if="!isArr(second)">
                  <td :key="secondIndex">{{second}}</td>
                </template>
              </template>
            </template>
          </tr>
          <tr v-for="(row, rowIndex) in rowDatas" :key="rowIndex">
            <td v-if="showIndex">
              <template v-if="rankBadge">
                <template v-if="rowIndex === 0"><i class="rank-gold"></i></template>
                <template v-if="rowIndex === 1"><i class="rank-silver"></i></template>
                <template v-if="rowIndex === 2"><i class="rank-cuprum"></i></template>
                <template v-if="rowIndex > 2">{{rowIndex + 1}}</template>
              </template>
              <template v-if="!rankBadge">{{rowIndex + 1}}</template>
            </td>
            <template v-if="lineNum">
              <template v-for="(col, colIndex) in row" v-if="colIndex >= (lineNum * tIndex) && colIndex < (lineNum * (tIndex + 1))">
                <template v-if="isArr(col)">
                  <td v-for="(c, cIndex) in col" :key="colIndex + '-' + cIndex">{{c}}</td>
                </template>
                <template v-if="!isArr(col)">
                  <td :key="colIndex">{{col}}</td>
                </template>
              </template>
            </template>
            <template v-if="!lineNum">
              <template v-for="(col, colIndex) in row">
                <template v-if="isArr(col)">
                  <td v-for="(c, cIndex) in col" :key="colIndex + '-' + cIndex">{{c}}</td>
                </template>
                <template v-if="!isArr(col)">
                  <td :key="colIndex">{{col}}</td>
                </template>
              </template>
            </template>
          </tr>
        </table>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'comm-table',
  props: ['title', 'second-title', 'data', 'show-index', 'line-num', 'rank-badge'],
  data () {
    return {
      rowDatas: [],
      secondTitles: [],
      tableCount: 1
    }
  },
  mounted () {
    if (this.data && this.title) {
      for (let r = 0; r < this.data.length; r++) {
        let columnDatas = []
        for (let c = 0; c < this.title.length; c++) {
          columnDatas.push(this.data[r][this.title[c].prop])
        }
        this.rowDatas.push(columnDatas)
      }
      if (this.lineNum) {
        this.tableCount = Math.ceil(this.title.length / this.lineNum)
      }
      if (this.secondTitle) {
        for (let c = 0; c < this.title.length; c++) {
          this.secondTitles.push(this.secondTitle[this.title[c].prop])
        }
      }
    }
  },
  methods: {
    isArr (obj) {
      return this.$comfun.isArr(obj)
    }
  }
}
</script>

<style lang="scss" scoped>
.comm-table {
  position: relative;
  font-size: 0.8rem;
  .comm-table-rail-wrap {
    position: relative;
  }
  table {
    position: relative;
    width: 100%;
    border-top: 1px solid #1CA9F1;
    border-bottom: 1px solid #1CA9F1;
    tr {
      th {
        padding: 0.8rem 0;
        background-color: #1CA9F1;
        color: #ffffff;
        font-weight: normal;
        white-space: nowrap;
      }
      th:nth-of-type(n + 2) {
        border-left: 1px solid rgb(70, 189, 248);
      }
      td {
        text-align: center;
        padding: 0.4rem 0;
        border-top: 1px solid rgb(70, 189, 248);
        white-space: nowrap;
        background-color: #ffffff;
        .rank-gold {
          position: relative;
          display: inline-block;
          width: 1.2rem;
          height: 1rem;
          background-image: url('./../assets/rank-gold.png');
          background-size: auto 100%;
          background-repeat: no-repeat;
          background-position: center;
        }
        .rank-silver {
          position: relative;
          display: inline-block;
          width: 1.2rem;
          height: 1rem;
          background-image: url('./../assets/rank-silver.png');
          background-size: auto 100%;
          background-repeat: no-repeat;
          background-position: center;
        }
        .rank-cuprum {
          position: relative;
          display: inline-block;
          width: 1.2rem;
          height: 1rem;
          background-image: url('./../assets/rank-cuprum.png');
          background-size: auto 100%;
          background-repeat: no-repeat;
          background-position: center;
        }
      }
      td:nth-of-type(n + 2) {
        border-left: 1px solid rgb(70, 189, 248);
      }
    }
  }
  table:nth-of-type(n + 2) {
    margin-top: 0.8rem;
  }
  table:last-child {
    margin-bottom: 1.2rem;
  }
}
</style>
