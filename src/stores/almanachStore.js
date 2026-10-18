import { ref} from 'vue'
import { defineStore } from 'pinia'

export const useAlmanachStore = defineStore('almanach', () => {
    const geographicPosition = ref({ gha: 0, dec: 0 })
    function calculateSunGP(customDate = new Date()) {
        // 1. Itt kinyerjük az UTC adatokat a customDate-ből
        // A kapott dátum átváltása Unix időbélyeggé (ez ezredmásodpercben van)
        const ms = customDate.getTime();

        // Kiszámoljuk, hány nap telt el a J2000.0 epoch óta.
        // A J2000.0 pontos csillagászati időpontja: 2000. január 1. 12:00 UTC.
        // Unix időbélyegben ez pontosan: 946728000000 ms.
        // Egy napban 86,400,000 ezredmásodperc van.
        const d = (ms - 946728000000) / 86400000;
        // 2. Ide jön majd a csillagászati számítás
        // 3. Végén frissítjük: geographicPosition.value = { gha: ..., dec: ... }
        const TORAD = Math.PI / 180;
        const TODEG = 180 / Math.PI;

        // 1. Számítások sima változókkal (NEM computed)
        let L = 280.460 + 0.9856474 * d;
        let M = 357.528 + 0.9856003 * d;

        // 2. Normalizálás 0 és 360 fok közé
        L = (L % 360 + 360) % 360;
        M = (M % 360 + 360) % 360;

        // 3. A pálya és a tengelyferdeség számítása (szintén sima változókkal, immár a normalizált M-ből)
        let lambda = L + 1.915 * Math.sin(M * TORAD) + 0.020 * Math.sin(2 * M * TORAD);
        let obliq = 23.439 - 0.0000004 * d;

        // Lambda normalizálása is biztos ami biztos
        lambda = (lambda % 360 + 360) % 360;

        let dec = Math.asin(Math.sin(obliq * TORAD) * Math.sin(lambda * TORAD)) * TODEG;

        // q a Nap közepes hosszúsága átszámítva radiánba
        let q = L * TORAD;
        let eot = 9.87 * Math.sin(2 * q) - 7.53 * Math.cos(M * TORAD) - 1.5 * Math.sin(M * TORAD);

        // Kinyerjük az óra, perc, másodperc értékeket UTC-ben a customDate-ből
        let utchours = customDate.getUTCHours();
        let utcminutes = customDate.getUTCMinutes();
        let utcseconds = customDate.getUTCSeconds();

        // Átváltjuk az egészet egyetlen tizedes jegyes óra értékké (pl. 13:30 -> 13.5)
        let utcTimeInHours = utchours + (utcminutes / 60) + (utcseconds / 3600);

        let gha = (utcTimeInHours - 12 + (eot / 60)) * 15;

        // Fontos: a GHA-t is 0 és 360 fok közé kell szorítani a már ismert módszerrel!
        gha = (gha % 360 + 360) % 360;

        // 3. Végén frissítjük a reaktív állapotot
        geographicPosition.value = { gha, dec };

    }

    return { 
        geographicPosition,
        calculateSunGP
    }
})