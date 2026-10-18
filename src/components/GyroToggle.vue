<script setup>
import { useGyroStore } from '../stores/gyroStore'
const gyroStore = useGyroStore()
</script>

<template>
    <div class="gyro-toggle" style="margin-bottom: 15px;">
        <button @click="gyroStore.toggleGyro" class="hitjam-btn">
            {{ gyroStore.isListening ? 'Szenzorok Kikapcsolása' : 'Szenzorok Bekapcsolása' }}
        </button>
        <p v-if="gyroStore.errorMessage" style="color: red; font-size: 0.8rem;">
            {{ gyroStore.errorMessage }}
        </p>
    </div>
</template>
