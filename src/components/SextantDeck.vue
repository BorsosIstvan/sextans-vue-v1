<script setup>
import { ref, onUnmounted } from 'vue';
import { useMeasurementStore } from '../stores/measurementStore';

const measurementStore = useMeasurementStore();

const beta = ref(0);
const isListening = ref(false);
const errorMessage = ref('');

const handleOrientation = (event) => {
    // We ronden af op 2 decimalen voor stabiliteit
    beta.value = event.beta ? parseFloat(event.beta.toFixed(2)) : 0;
};

const startGyro = async () => {
    errorMessage.value = '';
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
            const permissionState = await DeviceOrientationEvent.requestPermission();
            if (permissionState === 'granted') {
                initListener();
            } else {
                errorMessage.value = 'Toegang tot sensoren geweigerd.';
            }
        } catch (error) {
            errorMessage.value = 'Fout bij machtiging: ' + error;
        }
    } else {
        initListener();
    }
};

const initListener = () => {
    window.addEventListener('deviceorientation', handleOrientation);
    isListening.value = true;
};

const stopGyro = () => {
    window.removeEventListener('deviceorientation', handleOrientation);
    isListening.value = false;
};

// DIT IS DE NIEUWE EN BELANGRIJKSTE FUNCTIE
const captureSun = () => {
    if (!isListening.value) return;
    
    // We sturen de huidige live hoek naar de store!
    measurementStore.addMeasurement(beta.value);
    
    // Een korte visuele bevestiging of trilling (indien ondersteund)
    if (navigator.vibrate) {
        navigator.vibrate(100); 
    }
};

onUnmounted(() => {
    stopGyro();
});
</script>

<template>
    <div class="sextant-deck" style="padding: 20px; text-align: center; font-family: monospace;">
        <!-- Knop voor activering van de sensoren -->
        <div v-if="!isListening" style="margin-bottom: 20px;">
            <button @click="startGyro" class="hitjam-btn" style="padding: 15px 30px; font-size: 1.2rem; width: 100%;">
                Systeem Activeren
            </button>
        </div>

        <p v-if="errorMessage" style="color: red; font-weight: bold;">{{ errorMessage }}</p>

        <!-- Live vizier als de sensoren actief zijn -->
        <div v-if="isListening" class="visor-container">
            <div style="background: #1a1a1a; padding: 20px; border-radius: 10px; border: 2px solid #41B883;">
                <p style="margin: 0; color: #888; font-size: 0.9rem;">LIVE HOEK VIZIER</p>
                <h1 style="font-size: 5rem; color: #41B883; margin: 10px 0;">{{ beta }}°</h1>
            </div>

            <!-- Grote schietknop / Lock-knop -->
            <button 
                @click="captureSun" 
                class="hitjam-btn" 
                style="margin-top: 20px; padding: 25px; font-size: 1.5rem; width: 100%; font-weight: bold; background-color: #41B883;"
            >
                ☀️ LOCK / METING DOEN
            </button>
            
            <button @click="stopGyro" class="hitjam-btn-secondary" style="margin-top: 15px; font-size: 0.8rem; opacity: 0.6;">
                Sensoren Uitschakelen
            </button>
        </div>
    </div>
</template>
