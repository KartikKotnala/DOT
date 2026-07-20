<template>
  <g>
    <!-- Background Architectural Grid Pattern / Floor Texture Details -->
    <defs>
      <pattern id="floorGrid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f8fafc" stroke-width="1" />
      </pattern>
    </defs>
    <rect x="15" y="15" width="770" height="570" fill="url(#floorGrid)" rx="6" />

    <!-- Floor Identifier Title Header -->
    <text x="30" y="45" fill="#1e293b" font-size="18" font-weight="800" font-family="sans-serif" letter-spacing="0.5">
      Level 2 - Hypermarket, Fashion & Footwear
    </text>

    <!-- ========================================================= -->
    <!-- 1. CENTRAL OPEN ATRIUM, CORRIDORS & CROSSWAY SKY-BRIDGES   -->
    <!-- ========================================================= -->
    <!-- Open Atrium Void Center Frame -->
    <circle cx="400" cy="300" r="115" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3" />
    <circle cx="400" cy="300" r="125" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="8,5" />
    
    <!-- Architectural Sky-Bridges cutting cleanly across the Atrium Space -->
    <g fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2">
      <rect x="375" y="135" width="50" height="40" />
      <rect x="235" y="275" width="50" height="50" />
      <rect x="515" y="275" width="50" height="50" />
    </g>

    <text x="400" y="304" fill="#64748b" font-size="11" font-weight="bold" font-family="sans-serif" text-anchor="middle" letter-spacing="1">
      OPEN ATRIUM VIEW (DOWN TO L1)
    </text>

    <!-- ========================================================= -->
    <!-- 2. NORTH WING: MEGA HYPERMARKET & GROCERY (Suites 201-204)-->
    <!-- ========================================================= -->
    <!-- Styled in Soft Emerald Green to represent fresh food/produce zones -->
    <g fill="#d1fae5" stroke="#065f46" stroke-width="3.5">
      <!-- Suite 201: Fresh Fruits & Vegetables Section -->
      <rect x="50" y="70" width="130" height="90" class="room" :class="{'active-zone': phone.brandId === 'b1' && phone.floor === 2}" />
      <!-- Suite 202: Dairy & Frozen Foods aisle -->
      <rect x="195" y="70" width="105" height="90" class="room" :class="{'active-zone': phone.brandId === 'b2' && phone.floor === 2}" />
      <!-- Suite 203: Organic Herbs & Health Foods Entrance -->
      <rect x="315" y="70" width="130" height="90" class="room" :class="{'active-zone': phone.brandId === 'b3' && phone.floor === 2}" />
      <!-- Suite 204: Gourmet Snacks & Beverages -->
      <rect x="460" y="70" width="130" height="90" class="room" :class="{'active-zone': phone.brandId === 'b4' && phone.floor === 2}" />
      <!-- Suite 205: Main Hypermarket billing & checkout anchor hall -->
      <rect x="605" y="70" width="145" height="90" class="room" :class="{'active-zone': phone.brandId === 'b5' && phone.floor === 2}" />
    </g>

    <!-- Labels for Grocery Wing Retail Spaces -->
    <g fill="#064e3b" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">
      <text x="115" y="115">FRESH PRODUCE 201</text>
      <text x="247" y="115">DAIRY CO. 202</text>
      <text x="380" y="115">ORGANICS 203</text>
      <text x="525" y="115">GOURMET 204</text>
      <text x="677" y="115">HYPERMARKET 205</text>
    </g>

    <!-- ========================================================= -->
    <!-- 3. WEST WING: FOOTWEAR EMPORIUMS & SPORTSWEAR (206-208)    -->
    <!-- ========================================================= -->
    <!-- Styled in Cool Indigo to represent sport sneakers & shoe shops -->
    <g fill="#e0e7ff" stroke="#3730a3" stroke-width="3.5">
      <!-- Suite 206: Premium Athletic Sneakers (Nike/Adidas style layout) -->
      <polygon points="50,180 180,180 180,280 140,310 50,310" class="room" :class="{'active-zone': phone.brandId === 'b6' && phone.floor === 2}" />
      <!-- Suite 207: Formal Leather Shoes & Luxury Boots -->
      <rect x="50" y="330" width="130" height="90" class="room" :class="{'active-zone': phone.brandId === 'b7' && phone.floor === 2}" />
      <!-- Suite 208: Casual Footwear, Sandals & Kids Shoes -->
      <rect x="50" y="440" width="130" height="110" class="room" :class="{'active-zone': phone.brandId === 'b8' && phone.floor === 2}" />
    </g>

    <!-- Labels for Footwear Wing Retail Spaces -->
    <g fill="#312e81" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">
      <text x="115" y="240">SNEAKER HUB 206</text>
      <text x="115" y="380">LEATHER SHOES 207</text>
      <text x="115" y="500">STEP ZONE 208</text>
    </g>

    <!-- ========================================================= -->
    <!-- 4. EAST WING: APPAREL, CLOTHING & ACCESORIES (209-211)     -->
    <!-- ========================================================= -->
    <!-- Styled in Warm Amber/Rose to represent retail fashion and styling studios -->
    <g fill="#ffe4e6" stroke="#9f1239" stroke-width="3.5">
      <!-- Suite 209: Trendsetters Western Wear Clothing Apparel -->
      <polygon points="750,180 620,180 620,280 660,310 750,310" class="room" :class="{'active-zone': phone.brandId === 'b9' && phone.floor === 2}" />
      <!-- Suite 210: Ethnic & Traditional Wear Studio -->
      <rect x="620" y="330" width="130" height="90" class="room" :class="{'active-zone': phone.brandId === 'b10' && phone.floor === 2}" />
      <!-- Suite 211: Home Linen, Handbags & Luggage -->
      <rect x="620" y="440" width="130" height="110" class="room" :class="{'active-zone': phone.brandId === 'b11' && phone.floor === 2}" />
    </g>

    <!-- Labels for Apparel Wing Retail Spaces -->
    <g fill="#881337" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">
      <text x="685" y="240">FASHION VIBE 209</text>
      <text x="685" y="380">ETHNIC STUDIO 210</text>
      <text x="685" y="500">BAGS & DECOR 211</text>
    </g>

    <!-- ========================================================= -->
    <!-- 5. SOUTH WING: BAKERY, ICE CREAM & RESTROOMS (212-214)     -->
    <!-- ========================================================= -->
    <!-- Styled in Cream-Brown to match artisanal cafes/bakeries near escalator core -->
    <g fill="#fef3c7" stroke="#92400e" stroke-width="3.5">
      <!-- Bakery Suite 212 -->
      <rect x="210" y="460" width="110" height="90" class="room" :class="{'active-zone': phone.brandId === 'b12' && phone.floor === 2}" />
      <!-- Gelato & Dessert Corner Suite 213 -->
      <rect x="480" y="460" width="110" height="90" class="room" :class="{'active-zone': phone.brandId === 'b13' && phone.floor === 2}" />
      
      <!-- Facility Service Node Desk Block -->
      <rect x="340" y="500" width="120" height="50" fill="#f1f5f9" stroke="#475569" />
    </g>

    <!-- Labels for South Wing Food & Facilities Spaces -->
    <g fill="#78350f" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">
      <text x="265" y="510">THE BAKERY CRUST 212</text>
      <text x="535" y="510">SWEET TREATS 213</text>
      <text x="400" y="530" fill="#475569" font-size="15">Entry</text>
    </g>

    <!-- ========================================================= -->
    <!-- 6. INNER ATRIUM CIRCLE: CENTER SPREAD KIOSKS               -->
    <!-- ========================================================= -->
    <!-- Styled as fast-access central booths for pop-up items -->
    <g fill="#fef08a" stroke="#ca8a04" stroke-width="2.5">
      <!-- Kiosk K201: Fresh Fruit Juice Bar -->
      <circle cx="270" cy="220" r="18" class="room" :class="{'active-zone': phone.brandId === 'k1' && phone.floor === 2}" />
      <!-- Kiosk K202: Artisan Footwear Polish & Accessories -->
      <circle cx="530" cy="220" r="18" class="room" :class="{'active-zone': phone.brandId === 'k2' && phone.floor === 2}" />
      <!-- Kiosk K203: Socks & Hosiery Quick Station -->
      <circle cx="270" cy="380" r="18" class="room" :class="{'active-zone': phone.brandId === 'k3' && phone.floor === 2}" />
      <!-- Kiosk K204: Organic Honey & Spices Counter -->
      <circle cx="530" cy="380" r="18" class="room" :class="{'active-zone': phone.brandId === 'k4' && phone.floor === 2}" />
    </g>

    <!-- Labels for Central Pavilions -->
    <g fill="#713f12" font-size="8" font-weight="bold" font-family="sans-serif" text-anchor="middle">
      <text x="270" y="223">JUICE</text>
      <text x="530" y="223">SHOE FIX</text>
      <text x="270" y="383">SOCKS</text>
      <text x="530" y="383">SPICES</text>
    </g>

    <!-- ========================================================= -->
    <!-- 7. COMFORT AMENITIES: GREEN PLATFORMS & SEATING LOUNGES    -->
    <!-- ========================================================= -->
    <!-- Central North promenade relaxation square park node -->
    <g transform="translate(400, 185)">
      <circle cx="0" cy="0" r="16" fill="#ecfdf5" stroke="#10b981" stroke-width="2" />
      <path d="M -6,2 Q 0,-8 6,2 M -2,4 Q 2,-4 4,4" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" />
      <text x="0" y="25" fill="#065f46" font-size="9" font-weight="bold" text-anchor="middle" font-family="sans-serif">MALL GREEN LOUNGE</text>
    </g>

    <!-- Corridor Rest Benches for tired shoppers -->
    <g fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5" rx="3">
      <rect x="220" y="285" width="8" height="30" />
      <rect x="572" y="285" width="8" height="30" />
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
/* Active structural selector parameters synchronizing targeting pulses uniformly */
.active-zone {
  filter: drop-shadow(0 0 12px rgba(239, 68, 68, 0.45));
  stroke: #ef4444 !important;
  fill: #fef2f2 !important;
  fill-opacity: 1 !important;
}
</style>