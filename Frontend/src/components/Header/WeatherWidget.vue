<template>
  <div
    class="glass-panel rounded-3xl p-6 h-[140px] flex flex-col justify-between transition-all duration-300 hover:scale-[1.02]"
  >
    <!-- Header -->
    <div class="flex justify-between items-center">
      <span
        class="text-[10px] uppercase tracking-[0.3em] text-main/40 font-mono"
      >
        METEO.LOC
      </span>

      <Cloud class="w-5 h-5 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)" />
    </div>

    <!-- Weather -->
    <div>
      <h2 class="text-4xl font-dot tracking-widest text-main/90">
        {{ temperature }}°C
      </h2>

      <div class="flex justify-between items-end mt-2">
        <p class="text-xs uppercase text-main/60 tracking-wider">
          {{ condition }}
        </p>

        <p
          class="text-[10px] uppercase text-main/30 tracking-[0.2em] font-mono"
        >
          {{ city }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Cloud } from "lucide-vue-next";
import axios from "axios";

const temperature = ref("--");
const condition = ref("Loading");
const city = ref("Detecting");

const weatherCodes = {
  0: "CLEAR",
  1: "MAINLY CLEAR",
  2: "PARTLY CLOUDY",
  3: "CLOUDY",
  45: "FOG",
  48: "FOG",
  51: "DRIZZLE",
  53: "DRIZZLE",
  55: "DRIZZLE",
  61: "RAIN",
  63: "RAIN",
  65: "HEAVY RAIN",
  71: "SNOW",
  80: "SHOWERS",
  95: "STORM",
};

async function loadWeather(lat, lon) {
  try {
    const weatherRes = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
    );

    const geoRes = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );

    temperature.value = Math.round(
      weatherRes.data.current.temperature_2m
    );

    condition.value =
      weatherCodes[weatherRes.data.current.weather_code] || "UNKNOWN";

    city.value =
      geoRes.data.address.city ||
      geoRes.data.address.town ||
      geoRes.data.address.village ||
      "UNKNOWN";

  } catch (e) {
    console.log(e);
  }
}

onMounted(() => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      loadWeather(
        position.coords.latitude,
        position.coords.longitude
      );
    },
    () => {
      loadWeather(28.6139, 77.2090);
    }
  );
});
</script>