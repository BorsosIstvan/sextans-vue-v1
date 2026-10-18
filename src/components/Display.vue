<script setup>
import { useMeasurementStore } from '../stores/measurementStore'; // Let op het juiste pad!
import { useAlmanachStore } from '@/stores/almanachStore';
const almanachStore = useAlmanachStore();
const measurementStore = useMeasurementStore();
</script>

<template>
    <div class="display" style="padding: 20px; font-family: monospace;">
        <h2>Digitale Sextant Dashboard</h2>
        <hr />

        <!-- STATUS 1: Nog geen metingen gedaan -->
        <div v-if="measurementStore.measurements.length === 0">
            <p><strong>Status:</strong> Geen actieve metingen.</p>
            <p>Richt de zijkant van je telefoon op de zon en druk op de meetknop.</p>
        </div>

        <!-- STATUS 2: Eerste meting is gedaan -->
        <div v-else-if="measurementStore.measurements.length === 1">
            <p style="color: orange;"><strong>Status: Eerste meting vastgelegd!</strong></p>
            <p><strong>Tijdstip:</strong> {{ measurementStore.measurements[0].timestamp }}</p>
            <p><strong>Tijdstip:</strong> {{ almanachStore.geographicPosition }}</p>
            <p><strong>Geregistreerde Zonshoek:</strong> {{ measurementStore.measurements[0].altitude }}°</p>
            <p><em>Wacht nu tot de zon verder is gedraaid (2-3 uur) voor de tweede meting.</em></p>
        </div>

        <!-- STATUS 3: Beide metingen zijn voltooid -->
        <div v-else-if="measurementStore.measurements.length === 2">
            <p style="color: green;"><strong>Status: Beide metingen succesvol voltooid!</strong></p>
            <p>Meting 1 Hoek: {{ measurementStore.measurements[0].altitude }}°</p>
            <p>Meting 2 Hoek: {{ measurementStore.measurements[1].altitude }}°</p>
            <hr />
            <p><strong>Berekening:</strong> jouw exacte GPS-locatie: {{ measurementStore.currentPosition }}</p>
        </div>

        <!-- Extra knop om de metingen te resetten en opnieuw te beginnen -->
        <div v-if="measurementStore.measurements.length > 0" style="margin-top: 20px;">
            <button @click="measurementStore.resetMeasurements" class="hitjam-btn">Clear Measurement</button>
        </div>
    </div>
</template>

