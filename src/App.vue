<script setup>
import Display from './components/Display.vue';
import GyroscopeTest from './components/GyroscopeTest.vue';
import GyroToggle from './components/GyroToggle.vue';
import Measure from './components/Measure.vue';
import MeasureButton from './components/MeasureButton.vue';
import SextantDeck from './components/SextantDeck.vue';

</script>

<template>
  <div class="app-container">
  <h1>Sextant</h1>
  <Display />
  <MeasureButton />
  <GyroToggle />
  <p>
    The offline GPS without satelit and network
  </p>
  </div>
</template>

<style scoped></style>
