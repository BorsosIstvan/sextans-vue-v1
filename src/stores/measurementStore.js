import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useAlmanachStore } from '../stores/almanachStore'

export const useMeasurementStore = defineStore('measurement', () => {
    // 1. Elérhetővé tesszük a Nap almanachot a store-on belül
    const almanachStore = useAlmanachStore()

    // 2. Beolvassuk a localStorage-ból. Ha van valami, JSON-ná alakítjuk, ha nincs, üres tömb [] lesz.
    const measurements = ref(
        localStorage.getItem("hitjam_measurements") 
            ? JSON.parse(localStorage.getItem("hitjam_measurements")) 
            : []
    )

    // Ide jönnek majd az action függvények (addMeasurement, reset, stb.)

    const addMeasurement = (measuredAltitude) => {
        // 1. Nap pozíció frissítése a mostani idővel
        almanachStore.calculateSunGP(new Date());

        // 2. Új mérés objektum létrehozása
        const newDoc = {
            timestamp: new Date().toISOString(),
            gha: almanachStore.geographicPosition.gha,
            dec: almanachStore.geographicPosition.dec,
            altitude: measuredAltitude
        };

        // 3. Hozzáadás a reaktív listához
        measurements.value.push(newDoc);

        // 4. Mentés a telefon belső memóriájába (a te sorod!)
        localStorage.setItem("hitjam_measurements", JSON.stringify(measurements.value));
        if (measurements.value.length === 2) { calculateCurrentPosition(); }

    };

    // Adjunk hozzá egy gyors törlés (Reset) függvényt is, ha újra akarjuk kezdeni:
    const resetMeasurements = () => {
        measurements.value = [];
        localStorage.removeItem("hitjam_measurements");
    };

    const currentPosition = ref(
        localStorage.getItem("hitjam_last_position")
            ? JSON.parse(localStorage.getItem("hitjam_last_position"))
            : { lat: 0, lng: 0 }
    )


    const calculateCurrentPosition = () => {
        if (measurements.value.length < 2) return;

        const TORAD = Math.PI / 180;
        const TODEG = 180 / Math.PI;

        const m1 = measurements.value[0];
        const m2 = measurements.value[1];

        // 1. Átváltás radiánba és zenit távolságok (sugarak) kiszámítása
        const dec1 = m1.dec * TORAD;
        const dec2 = m2.dec * TORAD;
        
        // A GHA nyugati irányú szög, ezt radiánná alakítjuk
        const gha1 = m1.gha * TORAD;
        const gha2 = m2.gha * TORAD;

        const r1 = (90 - m1.altitude) * TORAD;
        const r2 = (90 - m2.altitude) * TORAD;

        // Ide jön majd a gömbi trigonometriai metszéspont számítás...
        // Sferische cosinusregel om de afstand tussen GP1 en GP2 te berekenen
        const cos_d_sun = Math.sin(dec1) * Math.sin(dec2) + Math.cos(dec1) * Math.cos(dec2) * Math.cos(gha1 - gha2);
        const d_sun = Math.acos(Math.max(-1, Math.min(1, cos_d_sun))); // Beperk tussen -1 en 1 tegen afrondingsfouten

        // Als de cirkels elkaar niet kunnen raken (wiskundig onmogelijk), stoppen we
        if (d_sun === 0 || r1 + r2 < d_sun || Math.abs(r1 - r2) > d_sun) {
            console.error("Metingen zijn wiskundig inconsistent of te dicht bij elkaar.");
            return;
        }

        const cos_A = (Math.cos(r2) - Math.cos(r1) * Math.cos(d_sun)) / (Math.sin(r1) * Math.sin(d_sun));
        const A = Math.acos(Math.max(-1, Math.min(1, cos_A)));

        // Bereken de koers (bearing) van GP1 naar GP2
        const cos_B = (Math.sin(dec2) - Math.sin(dec1) * Math.cos(d_sun)) / (Math.cos(dec1) * Math.sin(d_sun));
        let B = Math.acos(Math.max(-1, Math.min(1, cos_B)));
        if (Math.sin(gha1 - gha2) < 0) {
            B = 2 * Math.PI - B;
        }

        // Er zijn twee mogelijke snijpunten (Z1 en Z2)
        const angle1 = B + A;
        const angle2 = B - A;

        // Optie 1 (Eerste snijpunt)
        const lat1 = Math.asin(Math.sin(dec1) * Math.cos(r1) + Math.cos(dec1) * Math.sin(r1) * Math.cos(angle1)) * TODEG;
        let d_lng1 = Math.asin(Math.sin(angle1) * Math.sin(r1) / Math.cos(lat1 * TORAD)) * TODEG;
        let lng1 = (gha1 * TODEG) - d_lng1;

        // Optie 2 (Tweede snijpunt)
        const lat2 = Math.asin(Math.sin(dec1) * Math.cos(r1) + Math.cos(dec1) * Math.sin(r1) * Math.cos(angle2)) * TODEG;
        let d_lng2 = Math.asin(Math.sin(angle2) * Math.sin(r1) / Math.cos(lat2 * TORAD)) * TODEG;
        let lng2 = (gha1 * TODEG) - d_lng2;

                const convertGhaToLng = (lng) => {
            let normalized = (lng % 360 + 360) % 360;
            // Als de hoek groter is dan 180°, is het in het Oostelijk halfrond
            if (normalized > 180) {
                return 360 - normalized;
            } else {
                // Anders is het in het Westelijk halfrond (negatief)
                return -normalized;
            }
        };

        // A végén frissítjük a currentPosition-t:
        const finalLng1 = convertGhaToLng(lng1);
        const finalLng2 = convertGhaToLng(lng2);

        // Om te kiezen welk van de 2 punten de juiste is, kiezen we hier voor nu Optie 1.
        // Later kunnen we een logica bouwen die kijkt welke het dichtst bij Europa ligt.
        // currentPosition.value = { lat: ..., lng: ... };
        currentPosition.value = {
            lat: lat1,
            lng: finalLng1
        };
        localStorage.setItem("hitjam_last_position", JSON.stringify(currentPosition.value));

    };
    // Mérés 1 adatai (Ha nincs, null)
    const measurement1 = computed(() => {
        return measurements.value[0] || null
    })

    // Mérés 2 adatai (Ha nincs, null)
    const measurement2 = computed(() => {
        return measurements.value[1] || null
    })

    // Szépen formázott időpontok a kijelzőnek
    const m1Time = computed(() => {
        if (!measurement1.value) return 'Nincs mérés'
        const date = new Date(measurement1.value.timestamp)
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    })

    const m2Time = computed(() => {
        if (!measurement2.value) return 'Nincs mérés'
        const date = new Date(measurement2.value.timestamp)
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    })

    // Ne felejtsd el hozzáadni a return objektumhoz mindet!
    return { 
        measurements,
        currentPosition,
        measurement1,
        measurement2,
        m1Time,
        m2Time,
        addMeasurement,
        resetMeasurements
    }
})
