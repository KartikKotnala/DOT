<template>
  <g>
    <!-- Background Architectural Grid Pattern / Floor Texture Details -->
    <defs>
      <pattern id="floorGrid3" width="50" height="50" patternUnits="userSpaceOnUse">
        <circle cx="50" cy="50" r="1.5" fill="#cbd5e1" opacity="0.3" />
      </pattern>
    </defs>
    <rect x="15" y="15" width="770" height="570" fill="url(#floorGrid3)" rx="6" />

    <!-- Floor Identifier Title Header -->
    <text x="30" y="45" fill="#1e293b" font-size="18" font-weight="800" font-family="sans-serif" letter-spacing="0.5">
      Level 3 - Sports, Dining & Luxury Deck
    </text>

    <!-- ========================================================= -->
    <!-- 1. NORTH WING: EXPANSIVE FOOD COURT PLAZA (Category ID 8) -->
    <!-- ========================================================= -->
    <!-- Designed as a large, continuous dining strip with communal seating clusters -->
    <g fill="#ffedd5" stroke="#ea580c" stroke-width="3.5">
      <!-- Suite 301: Fast Food Corner (McDonald's Style / mcd.jpg) -->
      <rect x="50" y="70" width="130" height="100" class="room" :class="{'active-zone': phone.brandId === 'b301' && phone.floor === 3}" />
      <!-- Suite 302: Asian & Continental Kitchen -->
      <rect x="195" y="70" width="115" height="100" class="room" :class="{'active-zone': phone.brandId === 'b302' && phone.floor === 3}" />
      <!-- Suite 303: Desserts, Waffles & Beverage Lounge -->
      <rect x="325" y="70" width="150" height="100" class="room" :class="{'active-zone': phone.brandId === 'b303' && phone.floor === 3}" />
      <!-- Suite 304: Traditional & Fine Dining Pavilion -->
      <rect x="490" y="70" width="130" height="100" class="room" :class="{'active-zone': phone.brandId === 'b304' && phone.floor === 3}" />
      <!-- Suite 305: Pizzeria & Italian Table -->
      <rect x="635" y="70" width="115" height="100" class="room" :class="{'active-zone': phone.brandId === 'b305' && phone.floor === 3}" />
    </g>

    <!-- Centralized Food Court Shared Communal Seating Tables -->
    <g fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5">
      <circle cx="120" cy="210" r="14" /><circle cx="250" cy="210" r="14" />
      <circle cx="550" cy="210" r="14" /><circle cx="680" cy="210" r="14" />
      <rect x="345" y="195" width="110" height="30" rx="4" />
    </g>

    <!-- Labels for Food Court Dining Units -->
    <g fill="#c2410c" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">
      <text x="115" y="120">BURGER & BITES 301</text>
      <text x="252" y="120">WOK STIR 302</text>
      <text x="400" y="120">DESSERT BAR 303</text>
      <text x="555" y="120">GRAND PLAZA 304</text>
      <text x="692" y="120">PIZZA CORNER 305</text>
      <text x="400" y="214" fill="#94a3b8" font-size="9">SHARED DINING ZONE</text>
    </g>

    <!-- ========================================================= -->
    <!-- 2. WEST WING: SPORTS & FITNESS EMPORIUMS (Category ID 4) -->
    <!-- ========================================================= -->
    <!-- Styled in Bold Slate/Orange to simulate active gym/sportswear storefronts -->
    <g fill="#fff7ed" stroke="#c2410c" stroke-width="3.5">
      <!-- Suite 306: Activewear, Tracks & WHOOP Bands Showcase -->
      <polygon points="50,195 180,195 180,295 130,325 50,325" class="room" :class="{'active-zone': phone.brandId === 'b306' && phone.floor === 3}" />
      <!-- Suite 307: Fitness Gym Equipment & Dumbbells Hub -->
      <rect x="50" y="345" width="130" height="90" class="room" :class="{'active-zone': phone.brandId === 'b307' && phone.floor === 3}" />
    </g>

    <!-- Labels for Sports Wing Retail Spaces -->
    <g fill="#9a3412" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">
      <text x="115" y="250">FITNESS APPAREL 306</text>
      <text x="115" y="395">GEAR & TRACKS 307</text>
    </g>

    <!-- ========================================================= -->
    <!-- 3. EAST WING: PREMIUM JEWELRY BOUTIQUES (Category ID 5)  -->
    <!-- ========================================================= -->
    <!-- Styled in Elegant Gold/Yellow tones representing fine luxury diamonds -->
    <g fill="#fef9c3" stroke="#b45309" stroke-width="3.5">
      <!-- Suite 308: Diamond & Platinum Bridal Lounge -->
      <polygon points="750,195 620,195 620,295 670,325 750,325" class="room" :class="{'active-zone': phone.brandId === 'b308' && phone.floor === 3}" />
      <!-- Suite 309: Heritage Gold Craftsmanship House -->
      <rect x="620" y="345" width="130" height="90" class="room" :class="{'active-zone': phone.brandId === 'b309' && phone.floor === 3}" />
    </g>

    <!-- Labels for Jewelry Wing Luxury Spaces -->
    <g fill="#78350f" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">
      <text x="685" y="250">DIAMOND SALON 308</text>
      <text x="685" y="395">GOLD LUXE 309</text>
    </g>

    <!-- ========================================================= -->
    <!-- 4. SOUTH-WEST WING: PERFUMES & ESSENTIALS (Category ID 6)-->
    <!-- ========================================================= -->
    <!-- Styled in Royal Purple for premium cosmetic scent counters -->
    <g fill="#f3e8ff" stroke="#6b21a8" stroke-width="3.5">
      <!-- Suite 310: Luxury French & Arabian Scent House -->
      <rect x="50" y="455" width="130" height="100" class="room" :class="{'active-zone': phone.brandId === 'b310' && phone.floor === 3}" />
      <!-- Suite 311: Cologne, Deodorants & Grooming Station -->
      <rect x="195" y="455" width="115" height="100" class="room" :class="{'active-zone': phone.brandId === 'b311' && phone.floor === 3}" />
    </g>

    <g fill="#581c87" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">
      <text x="115" y="510">PERFUME LAB 310</text>
      <text x="252" y="510">SCENT HUB 311</text>
    </g>

    <!-- ========================================================= -->
    <!-- 5. SOUTH-EAST WING: WELLNESS & PHARMACY (Category ID 7)  -->
    <!-- ========================================================= -->
    <!-- Styled in Medical Blue representing family health and diagnostic counters -->
    <g fill="#e0f2fe" stroke="#0369a1" stroke-width="3.5">
      <!-- Suite 312: Main Pharmacy Medical Dispensing Desk -->
      <rect x="490" y="455" width="125" height="100" class="room" :class="{'active-zone': phone.brandId === 'b312' && phone.floor === 3}" />
      <!-- Suite 313: Wellness Vitamins, Organics & Healthcare Needs -->
      <rect x="630" y="455" width="120" height="100" class="room" :class="{'active-zone': phone.brandId === 'b313' && phone.floor === 3}" />
    </g>

    <g fill="#0c4a6e" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">
      <text x="552" y="510">MEDI CARE 312</text>
      <text x="690" y="510">WELLNESS CO. 313</text>
    </g>

    <!-- ========================================================= -->
    <!-- 6. ATRIUM WALKWAY PROMENADE: PAVILION KIOSKS              -->
    <!-- ========================================================= -->
    <!-- Center floor-level custom isolated display islands -->
    <g fill="#e0f2fe" stroke="#0284c7" stroke-width="2.5">
      <!-- Kiosk K301: Sports Protein Shakes Counter -->
      <rect x="250" y="275" width="30" height="30" rx="3" class="room" :class="{'active-zone': phone.brandId === 'k301' && phone.floor === 3}" />
      <!-- Kiosk K302: Silver Trinkets Kiosk -->
      <rect x="520" y="275" width="30" height="30" rx="3" class="room" :class="{'active-zone': phone.brandId === 'k302' && phone.floor === 3}" />
      <!-- Kiosk K303: Gourmet Candy / Popcorn booth -->
      <rect x="250" y="345" width="30" height="30" rx="3" class="room" :class="{'active-zone': phone.brandId === 'k303' && phone.floor === 3}" />
      <!-- Kiosk K304: Essential Oils Aromatherapy bar -->
      <rect x="520" y="345" width="30" height="30" rx="3" class="room" :class="{'active-zone': phone.brandId === 'k304' && phone.floor === 3}" />
    </g>

    <g fill="#0369a1" font-size="8" font-weight="bold" font-family="sans-serif" text-anchor="middle">
      <text x="265" y="293">WHEY</text>
      <text x="535" y="293">GEMS</text>
      <text x="265" y="363">CANDY</text>
      <text x="535" y="363">OILS</text>
    </g>

    <!-- ========================================================= -->
    <!-- 7. SERVICE TERMINALS & REST AREAS                        -->
    <!-- ========================================================= -->
    <!-- Dedicated Restrooms/Infodesk block sandwiched beneath escalator arrivals -->
    <rect x="340" y="500" width="120" height="55" fill="#f8fafc" stroke="#64748b" stroke-width="3" />
    <text x="400" y="533" fill="#475569" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">Entry Level 3</text>

    <!-- Decorative structural columns giving the sky deck depth -->
    <g fill="#cbd5e1" stroke="#94a3b8" stroke-width="1">
      <circle cx="210" cy="445" r="5" /><circle cx="590" cy="445" r="5" />
      <circle cx="210" cy="180" r="5" /><circle cx="590" cy="180" r="5" />
    </g>
  </g>
</template>

<script setup>
defineProps({
  phone: { type: Object, required: true }
});
</script>

<style scoped>
.room {
  cursor: pointer;
  transition: all 0.3s ease;
}
.room:hover {
  fill-opacity: 0.85;
  stroke-width: 4.5px;
}
/* Multi-floor sync active zone targets rules matching global template definitions */
.active-zone {
  filter: drop-shadow(0 0 12px rgba(239, 68, 68, 0.45));
  stroke: #ef4444 !important;
  fill: #fef2f2 !important;
  fill-opacity: 1 !important;
}
</style>