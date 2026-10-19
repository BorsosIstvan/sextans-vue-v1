<script setup>
import Display from './components/Display.vue';
import Footer from './components/Footer.vue';
import GyroscopeTest from './components/GyroscopeTest.vue';
import GyroToggle from './components/GyroToggle.vue';
import Logo from './components/Logo.vue';
import Measure from './components/Measure.vue';
import MeasureButton from './components/MeasureButton.vue';
import SextantDeck from './components/SextantDeck.vue';

</script>

<template>
  <div class="app-container">
  <Logo />
  <Display />
  <MeasureButton />
  <GyroToggle />
  <Footer />
  </div>
</template>

<style scoped></style>
