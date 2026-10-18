<script setup>
import { ref, onUnmounted } from 'vue'

const beta = ref(0)
const alpha = ref(0)
const gamma = ref(0)
const isListening = ref(false)
const errorMessage = ref('')

// Ez a függvény kezeli a beérkező szenzoradatokat
const handleOrientation = (event) => {
    // Kerekítsük le 2 tizedesjegyre, hogy ne ugráljanak a számok a kijelzőn
    beta.value = event.beta ? event.beta.toFixed(2) : 0
    alpha.value = event.alpha ? event.alpha.toFixed(2) : 0
    gamma.value = event.gamma ? event.gamma.toFixed(2) : 0
}

// Szenzorok elindítása engedélykéréssel (iOS kompatibilis módon)
const startGyro = async () => {
    errorMessage.value = ''
    
    // Ellenőrizzük, hogy modern iOS-en vagyunk-e, ami engedélyhez köti a szenzort
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
            const permissionState = await DeviceOrientationEvent.requestPermission()
            if (permissionState === 'granted') {
                initListener()
            } else {
                errorMessage.value = 'A szenzorokhoz való hozzáférés meg lett tagadva.'
            }
        } catch (error) {
            errorMessage.value = 'Hiba az engedélykérés során: ' + error
        }
    } else {
        // Android vagy régebbi böngészők esetén azonnal indítható
        initListener()
    }
}

const initListener = () => {
    window.addEventListener('deviceorientation', handleOrientation)
    isListening.value = true
}

const stopGyro = () => {
    window.removeEventListener('deviceorientation', handleOrientation)
    isListening.value = false
}

// Ha elnavigálunk az oldalról, takarítsunk fel magunk után, kapcsoljuk le a szenzort
onUnmounted(() => {
    stopGyro()
})
</script>

<template>
    <div class="gyro-test" style="padding: 20px; font-family: monospace; text-align: center;">
        <h3>Giroszkóp Élő Teszt</h3>
        <hr />

        <div v-if="!isListening">
            <button @click="startGyro" class="hitjam-btn" style="padding: 15px 30px; font-size: 1.2rem;">
                Szenzorok Aktiválása
            </button>
        </div>
        <div v-else>
            <button @click="stopGyro" class="hitjam-btn-danger">Szenzorok Leállítása</button>
        </div>

        <p v-if="errorMessage" style="color: red; font-weight: bold;">{{ errorMessage }}</p>

        <hr />

        <!-- A nekünk legfontosabb szög óriási méretben, hogy napfényben is lásd -->
        <div style="margin: 20px 0;">
            <p style="font-size: 1.2rem; margin-bottom: 5px;">MÉRÉSI SZÖG (BETA):</p>
            <h1 style="font-size: 4rem; color: #41B883; margin: 0;">{{ beta }}°</h1>
        </div>

        <div style="display: flex; justify-content: space-around; margin-top: 30px; font-size: 0.9rem; color: #888;">
            <p>Alpha (Iránytű): {{ alpha }}°</p>
            <p>Gamma (Dőlés): {{ gamma }}°</p>
        </div>
    </div>
</template>
