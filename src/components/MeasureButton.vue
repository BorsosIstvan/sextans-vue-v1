<script setup>
import { useGyroStore } from '../stores/gyroStore'
import { useMeasurementStore } from '../stores/measurementStore'

const gyroStore = useGyroStore()
const measurementStore = useMeasurementStore()

const triggerMeasure = () => {
    if (!gyroStore.isListening) return
    
    // Elküldjük a gyro store-ban lévő élő szöget a mérési store-nak
    measurementStore.addMeasurement(gyroStore.beta)

    // Haptikus visszajelzés (rezgés) a telefonon, ha a rendszer támogatja
    if (navigator.vibrate) {
        navigator.vibrate(100)
    }
}
</script>

<template>
    <div class="measure-action" v-if="gyroStore.isListening">
        <!-- Kis méretben mutatjuk az élő szöget a gomb felett -->
        <p style="font-family: monospace; font-size: 1.1rem; margin-bottom: 5px;">
            Aktuális szög: <strong>{{ gyroStore.beta }}°</strong>
        </p>
        
        <button @click="triggerMeasure" class="hitjam-btn" >
            ☀️ LOCK / NAP MÉRÉSE
        </button>
        <button @click="measurementStore.resetMeasurements" class="hitjam-btn">Clear Measurement</button>
    </div>
</template>
