<script setup>
import Display from './components/Display.vue';
import GyroscopeTest from './components/GyroscopeTest.vue';
import Measure from './components/Measure.vue';

</script>

<template>
  <div class="app-container">
  <h1>Sextant</h1>
  <Display />
  <Measure />
  <GyroscopeTest />
  <p>
    The offline GPS without satelit and network
  </p>
  </div>
</template>

<style scoped></style>
