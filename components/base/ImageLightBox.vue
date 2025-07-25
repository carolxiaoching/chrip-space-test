<script setup>
import { ref } from "vue";

const visibleRef = ref(false);
const indexRef = ref(0);
const imagesRef = ref([]);

function show(index, imgs = []) {
  imagesRef.value = imgs;
  indexRef.value = index;
  visibleRef.value = true;
}
function hide() {
  visibleRef.value = false;
}

defineExpose({
  show,
  hide,
});
</script>

<template>
  <VueEasyLightbox
    :visible="visibleRef"
    :imgs="imagesRef"
    :index="indexRef"
    :move-disabled="true"
    :rotate-disabled="true"
    @hide="hide"
  />
</template>
<style scoped></style>
