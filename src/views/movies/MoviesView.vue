<script setup>

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

</script>

<template>
  <div>
    <h1 style="color: white;">{{ props.id }}</h1>
  </div>
</template>
