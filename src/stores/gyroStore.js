import { ref} from 'vue'
import { defineStore } from 'pinia'

export const useGyroStore = defineStore('gyro', () => {
    const beta = ref(0);
    const isListening = ref(false);
    const errorMessage = ref('');

    const handleOrientation = (event) => {
        // Kerekítés 2 tizedesjegyre a stabilitásért
        beta.value = event.beta ? parseFloat(event.beta.toFixed(2)) : 0
    }

    const toggleGyro = async () => {
        if (isListening.value) {
            window.removeEventListener('deviceorientation', handleOrientation)
            isListening.value = false
        } else {
            errorMessage.value = ''
            if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                try {
                    const permissionState = await DeviceOrientationEvent.requestPermission()
                    if (permissionState === 'granted') {
                        startListener()
                    } else {
                        errorMessage.value = 'Szenzor hozzáférés megtagadva.'
                    }
                } catch (error) {
                    errorMessage.value = 'Szenzor hiba: ' + error
                }
            } else {
                startListener()
            }
        }
    }
    const startListener = () => {
        window.addEventListener('deviceorientation', handleOrientation)
        isListening.value = true
    }

    return {
        beta,
        isListening,
        errorMessage,
        toggleGyro
    }
})