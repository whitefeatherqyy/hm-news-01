<template>
  <div class="manage">
    <hm-header>栏目管理</hm-header>
    <div class="list">
      <div class="delete">
        <h5 class="title">点击删除以下栏目</h5>
        <div class="active list_item">
          <div
            v-for="(item,index) in activated"
            :key="item.id"
            class="items"
            @click="remove(index)"
          >{{item.name}}</div>
        </div>
      </div>
      <div class="add">
        <h5 class="title">点击添加以下栏目</h5>
        <div class="deactive list_item">
          <div
            v-for="(item,index) in deactivated"
            :key="item.id"
            class="items"
            @click="add(index)"
          >{{item.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activated: [],
      deactivated: []
    }
  },
  methods: {
    async getCategories() {
      const activated = JSON.parse(localStorage.getItem('activated'))
      const deactivated = JSON.parse(localStorage.getItem('deactivated'))
      if (activated) {
        this.activated = activated
        this.deactivated = deactivated
        return
      }
      const res = await this.$axios.get('/category')
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.activated = data
      }
    },
    remove(index) {
      if (this.activated.length <= 4) {
        return this.$toast('保留的栏目不能低于四个')
      }
      this.deactivated.push(this.activated[index])
      this.activated.splice(index, 1)
    },
    add(index) {
      this.activated.push(this.deactivated[index])
      this.deactivated.splice(index, 1)
    }
  },
  created() {
    this.getCategories()
  },
  watch: {
    activated: {
      deep: true,
      handler(value) {
        localStorage.setItem('activated', JSON.stringify(value))
        localStorage.setItem('deactivated', JSON.stringify(this.deactivated))
      }
    }
  }
}
</script>

<style lang="less" scoped>
.list {
  padding: 10px;
  .title {
    color: #aaa;
    font-size: 16px;
    font-weight: normal;
    margin-bottom: 10px;
  }
  .list_item {
    font-size: 18px;
    overflow: hidden;
    .items {
      float: left;
      margin-right: 10px;
      padding: 10px 20px;
      border: 1px solid #ccc;
      margin-bottom: 10px;
    }
  }
}
</style>
