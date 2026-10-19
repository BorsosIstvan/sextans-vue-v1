<script setup>
import { useMeasurementStore } from '../stores/measurementStore'
const measurementStore = useMeasurementStore()
</script>

<template>
    <div class="display">
        <h3>🪛 MÉRÉSI EREDMÉNYEK</h3>
        <hr />

        <!-- 1. MÉRÉS -->
        <div>
            <h4>1. Mérés adatai:</h4>
            <p>Időpont: {{ measurementStore.m1Time }}</p>
            <p>Szög: {{ measurementStore.measurement1 ? measurementStore.measurement1.altitude + '°' : '0°' }}</p>
        </div>
        <hr />

        <!-- 2. MÉRÉS -->
        <div>
            <h4>2. Mérés adatai:</h4>
            <p>Időpont: {{ measurementStore.m2Time }}</p>
            <p>Szög: {{ measurementStore.measurement2 ? measurementStore.measurement2.altitude + '°' : '0°' }}</p>
        </div>
        <hr />

        <!-- SZÁMÍTOTT GPS POZÍCIÓ -->
        <div>
            <h4>📍 Számított GPS pozíció:</h4>
            <p>Szélesség (LAT): <strong>{{ measurementStore.currentPosition.lat ? measurementStore.currentPosition.lat.toFixed(4) + '°' : '0' }}</strong></p>
            <p>Hosszúság (LNG): <strong>{{ measurementStore.currentPosition.lng ? measurementStore.currentPosition.lng.toFixed(4) + '°' : '0' }}</strong></p>
        </div>
    </div>
</template>
