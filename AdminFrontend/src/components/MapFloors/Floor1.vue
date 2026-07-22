<template>
  <g>
    <!-- Background Descriptor Label -->
    <text x="30" y="40" fill="#444" font-size="16" font-weight="bold" font-family="sans-serif">Ground Floor - Main Market</text>

    <!-- BLUE ZONE (Left Column) -->
    <g fill="#7ebbe7" stroke="#ffffff" stroke-width="4">
       <rect x="50" y="50" width="120" height="80" />
       <rect x="50" y="150" width="120" height="80" class="room" :class="{'active-zone': phone.brandId === '2'}" />
       <rect x="50" y="250" width="120" height="80" />
       <rect x="50" y="350" width="120" height="80" />
       <polygon points="50,450 170,450 170,530 110,530 50,490" />
    </g>
    <g fill="#333" font-size="14" font-weight="bold" font-family="sans-serif" text-anchor="middle">
       <text x="110" y="95">01</text>
       <text x="110" y="195">02</text>
       <text x="110" y="295">03</text>
       <text x="110" y="395">04</text>
       <text x="105" y="485">05</text>
    </g>

    <!-- GREEN ZONE (Center Left) -->
    <g fill="#a1c95b" stroke="#ffffff" stroke-width="4">
       <rect x="250" y="50" width="120" height="120" />
       <rect x="250" y="190" width="120" height="120" />
       <rect x="250" y="330" width="120" height="120" />
       <circle cx="310" cy="510" r="40" fill="#8cb938" />
    </g>
    <g fill="#333" font-size="14" font-weight="bold" font-family="sans-serif" text-anchor="middle">
       <text x="310" y="115">10</text>
       <text x="310" y="255">11</text>
       <text x="310" y="395">12</text>
       <text x="310" y="515">13</text>
    </g>

    <!-- RED ZONE (Center Right) -->
    <g fill="#c04e4e" stroke="#ffffff" stroke-width="4">
       <polygon points="450,50 590,50 590,200 450,200" />
       <polygon points="450,220 590,220 590,370 510,370 450,310" class="room" :class="{'active-zone': phone.brandId === '1'}" />
       <rect x="450" y="390" width="140" height="90" />
    </g>
    <g fill="#fff" font-size="14" font-weight="bold" font-family="sans-serif" text-anchor="middle">
       <text x="520" y="130">20</text>
       <text x="520" y="290">21</text>
       <text x="520" y="440">22</text>
    </g>

    <!-- YELLOW ZONE (Far Right) -->
    <g fill="#fae879" stroke="#ffffff" stroke-width="4">
       <rect x="610" y="50" width="140" height="100" />
       <rect x="610" y="170" width="140" height="100" />
       <rect x="610" y="290" width="140" height="100" />
       <rect x="610" y="410" width="140" height="100" />
    </g>
    <g fill="#333" font-size="14" font-weight="bold" font-family="sans-serif" text-anchor="middle">
       <text x="680" y="105">30</text>
       <text x="680" y="225">31</text>
       <text x="680" y="345">32</text>
       <text x="680" y="465">33</text>
    </g>

    <!-- Main Entrance Visual Base Steps -->
    <g>
      <rect x="350" y="550" width="100" height="30" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2" rx="4" />
      <text x="400" y="570" font-size="12" font-weight="bold" fill="#475569" font-family="sans-serif" text-anchor="middle">ENTRANCE</text>
    </g>

    <!-- Source Pin (Main Entrance [400, 550]) -->
    <g transform="translate(400, 550)">
      <circle cx="0" cy="0" r="32" fill="#10b981" opacity="0.12" class="animate-pulse" />
      <ellipse cx="0" cy="2" rx="7" ry="2.5" fill="rgba(0, 0, 0, 0.2)" />
      <path d="M 0 0 C -14 -18 -22 -28 -22 -40 A 22 22 0 1 1 22 -40 C 22 -28 14 -18 0 0 Z" fill="#10b981" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round" />
      <circle cx="0" cy="-40" r="9" fill="#ffffff" /><circle cx="0" cy="-40" r="4" fill="#10b981" />
    </g>
  </g>
</template>

<script setup>
defineProps({
  phone: { type: Object, required: true }
});
</script>