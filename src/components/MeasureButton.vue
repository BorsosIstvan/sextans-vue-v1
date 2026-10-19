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
    <div v-if="gyroStore.isListening">
        <!-- Kis méretben mutatjuk az élő szöget a gomb felett -->
        <p>
            Aktuális szög: <strong>{{ gyroStore.beta }}°</strong>
        </p>
        
        <button @click="triggerMeasure">
            ☀️ LOCK / NAP MÉRÉSE
        </button>
        <button @click="measurementStore.resetMeasurements">Clear Measurement</button>
    </div>
</template>
