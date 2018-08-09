<template>
  <div class="comm-table">
    <template v-if="rowDatas.length > 0">
      <table border="0" cellpadding="0" cellspacing="0" v-for="(t, tIndex) in tableCount" :key="tIndex">
        <tr>
          <th v-for="(th, thIndex) in title" :key="thIndex" v-if="thIndex >= (lineNum * tIndex) && thIndex < (lineNum * (tIndex + 1))" :colspan="thIndex % lineNum === 0 && showIndex ? (isArr(rowDatas[0][thIndex]) ? rowDatas[0][thIndex].length + 1 : 2) : (isArr(rowDatas[0][thIndex]) ? rowDatas[0][thIndex].length : 1)">{{th.label}}</th>
        </tr>
        <tr v-if="secondTitle">
          <td v-if="showIndex">序号</td>
          <template v-for="(second, secondIndex) in secondTitles" v-if="secondIndex >= (lineNum * tIndex) && secondIndex < (lineNum * (tIndex + 1))">
            <template v-if="isArr(second)">
              <td v-for="(s, sIndex) in second" :key="secondIndex + '-' + sIndex">{{s}}</td>
            </template>
            <template v-if="!isArr(second)">
              <td :key="secondIndex">{{second}}</td>
            </template>
          </template>
        </tr>
        <tr v-for="(row, rowIndex) in rowDatas" :key="rowIndex">
          <td v-if="showIndex">{{rowIndex + 1}}</td>
          <template v-for="(col, colIndex) in row" v-if="colIndex >= (lineNum * tIndex) && colIndex < (lineNum * (tIndex + 1))">
            <template v-if="isArr(col)">
              <td v-for="(c, cIndex) in col" :key="colIndex + '-' + cIndex">{{c}}</td>
            </template>
            <template v-if="!isArr(col)">
              <td :key="colIndex">{{col}}</td>
            </template>
          </template>
        </tr>
      </table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'CommTable',
  props: ['title', 'second-title', 'data', 'show-index', 'line-num'],
  data () {
    return {
      rowDatas: [],
      secondTitles: [],
      tableCount: 1
    }
  },
  mounted () {
    for (let r = 0; r < this.data.length; r++) {
      let columnDatas = []
      for (let c = 0; c < this.title.length; c++) {
        columnDatas.push(this.data[r][this.title[c].prop])
      }
      this.rowDatas.push(columnDatas)
    }
    this.tableCount = Math.ceil(this.title.length / this.lineNum)
    for (let c = 0; c < this.title.length; c++) {
      this.secondTitles.push(this.secondTitle[this.title[c].prop])
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
  table {
    position: relative;
    width: 100%;
    border-top: 1px solid #1CA9F1;
    border-bottom: 1px solid #1CA9F1;
    tr {
      th {
        padding: 1rem 0;
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
        padding: 0.8rem 0;
        border-top: 1px solid rgb(70, 189, 248);
        white-space: nowrap;
      }
      td:nth-of-type(n + 2) {
        border-left: 1px solid rgb(70, 189, 248);
      }
    }
  }
  table:nth-of-type(n + 2) {
    margin-top: 0.8rem;
  }
}
</style>
