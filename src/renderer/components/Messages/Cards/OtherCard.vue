<template></template>

<script setup>
  const {
    props: { appmsg, appinfo },
  } = defineProps(["props"]);

  console.log(appmsg);
  console.log(appinfo);
</script>

<style scoped></style>