<template>
  <div id="app">
    <nav>
      <router-link to="/"></router-link>
      <router-link to="/buildingdetail"></router-link>
    </nav>
    <router-view/>
  </div>
</template>

<style lang="less">
html,
body,
#app,
.el-container
{
  overflow: hidden;
  /*设置内部填充为0，几个布局元素之间没有间距*/
  padding: 0;
  /*外部间距也是如此设置*/
  margin: 0;
  /*统一设置高度为100%*/
  height: 100%;
}
</style>
