<script setup>
import { useAlmanachStore } from '../stores/almanachStore';
import { useMeasurementStore } from '@/stores/measurementStore';

const almanachStore = useAlmanachStore();
const measurementStore = useMeasurementStore();

// Amikor a komponens megjelenik a kijelzőn, azonnal lefuttatjuk a számítást a mostani idővel
const measure = () => {
  almanachStore.calculateSunGP(new Date());
  measurementStore.addMeasurement(34.88)
};
</script>
<template>
    <div>
        <button  class="hitjam-btn" v-on:click="measure">Measure</button>
    </div>
</template>