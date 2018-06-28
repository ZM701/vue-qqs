<template>
  <header>
    <slot name="find"></slot>
    <slot name="two"></slot>
    <slot name="three"></slot>
    <slot name="four"></slot>
    <slot name="five"></slot>
    <slot name="my"></slot>
    <slot name="activities"></slot>
    <slot name="search"></slot>
    <slot name="attention"></slot>
    <slot name="attentionFans"></slot>
  </header>
</template>

<script>
  export default {}
</script>

<style>
  header {
    height: 1.2rem;
    width: 100%;
    line-height: 1.2rem;
    background: #d43d3d;
    position: fixed;
    left: 0;
    top: 0;
    text-align: center;
    z-index: 999;
  }
</style>
