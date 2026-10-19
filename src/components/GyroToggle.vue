<script setup>
import { useGyroStore } from '../stores/gyroStore'
const gyroStore = useGyroStore()
</script>

<template>
    <div>
        <button @click="gyroStore.toggleGyro">
            {{ gyroStore.isListening ? 'Szenzorok Kikapcsolása' : 'Szenzorok Bekapcsolása' }}
        </button>
        <p v-if="gyroStore.errorMessage" style="color: red; font-size: 0.8rem;">
            {{ gyroStore.errorMessage }}
        </p>
    </div>
</template>
