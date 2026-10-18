/**
 * SAT&IG BOOKSTORE - الجيل الجديد من تطبيق الفروع الذكي (2026 Edition)
 * - واجهة تطبيق حقيقية (App-Like UI) بنظام Split-View على الكمبيوتر
 * - تجربة موبايل 10/10 أصلية مع شريط تحكم عائم وبطاقات سفلية منبثقة
 * - أداء فائق 60/120fps بدون أي بطء أو ضغط على المعالج
 * - حساب دقيق للمسافات الجغرافية (Haversine Formula)
 * - ترتيب فوري للأقرب فالأبعد مع تمييز ذهبي متألق لأقرب فرع
 * - ملاحة مباشرة عبر Google Maps ومحادثة فورية عبر واتساب
 */

// =============================================================================
// 1. بيانات الفروع المعتمدة (Verified Branches Data)
// =============================================================================
const BRANCHES_DATA = [
  {
    id: 'sat-ig-nasr-city-1',
    name: 'SAT&IG Bookstore Nasr City',
    city: 'القاهرة',
    area: 'مدينة نصر',
    address: 'الفرع الرئيسي، مدينة نصر، بالقرب من طريق النصر',
    phone: '01281847737',
    phoneFormatted: '0128 184 7737',
    whatsapp: '201281847737',
    mapUrl: 'https://maps.app.goo.gl/TYiUmGvoc6zCvvMM9',
    lat: 30.0590748,
    lng: 31.3346301,
    workingHours: '7:00 ص - 12:00 منتصف الليل',
    isOpen: true,
    features: ['الفرع الرئيسي', 'كتب SAT & IG', 'Past Papers & Notes', 'استلام فوري']
  },
  {
    id: 'sat-ig-nasr-city-2',
    name: 'SAT&IG BookStore Nasr City 2',
    city: 'القاهرة',
    area: 'مدينة نصر',
    address: 'الفرع الثاني، المنطقة الأولى، مدينة نصر، القاهرة',
    phone: '01204477029',
    phoneFormatted: '0120 447 7029',
    whatsapp: '201204477029',
    mapUrl: 'https://maps.app.goo.gl/Ke3XxM1C9HSZr8us5',
    lat: 30.0596997,
    lng: 31.3334088,
    workingHours: '7:00 ص - 12:00 منتصف الليل',
    isOpen: true,
    features: ['فرع مدينة نصر 2', 'كتب وملازم لجميع المراحل', 'دعم واستفسارات']
  },
  {
    id: 'sat-ig-maadi',
    name: 'SAT&IG BOOKSTORE MAADI',
    city: 'القاهرة',
    area: 'المعادي',
    address: 'المعادي الجديدة، بالقرب من شارع النصر، القاهرة',
    phone: '01277004112',
    phoneFormatted: '0127 700 4112',
    whatsapp: '201277004112',
    mapUrl: 'https://maps.app.goo.gl/Az666MCe3jDjRtst5',
    lat: 29.9824482,
    lng: 31.3106525,
    workingHours: '7:00 ص - 12:00 منتصف الليل',
    isOpen: true,
    features: ['فرع المعادي', 'مناهج IG و SAT كاملة', 'خدمة سريعة']
  },
  {
    id: 'sat-ig-mohandessin',
    name: 'SAT&IG BOOKSTORE Mohandessin',
    city: 'الجيزة',
    area: 'المهندسين',
    address: '14 شارع جدة، متفرع من محي الدين أبو العز، أمام البوابة 2 لنادي الصيد، المهندسين',
    phone: '01277004112',
    phoneFormatted: '0127 700 4112',
    whatsapp: '201277004112',
    mapUrl: 'https://maps.google.com/?q=30.0468,31.2018',
    lat: 30.0468,
    lng: 31.2018,
    workingHours: '7:00 ص - 12:00 منتصف الليل',
    isOpen: true,
    features: ['فرع المهندسين', 'أمام بوابة نادي الصيد', 'Classified & Past Papers']
  },
  {
    id: 'sat-ig-haram',
    name: 'SAT&IG BOOKSTORE Haram',
    city: 'الجيزة',
    area: 'الهرم',
    address: 'شارع الهرم الرئيسي، الجيزة',
    phone: '01281843818',
    phoneFormatted: '0128 184 3818',
    whatsapp: '201281843818',
    mapUrl: 'https://maps.app.goo.gl/GCoPy6z8fq2wbqFYA',
    lat: 29.9971307,
    lng: 31.1619592,
    workingHours: '7:00 ص - 12:00 منتصف الليل',
    isOpen: true,
    features: ['فرع الهرم', 'مناهج EST و SAT و IGCSE', 'استشارات واختيار المواد']
  },
  {
    id: 'ken-nasr-city',
    name: 'KEN Copy Center & Bookstore',
    city: 'القاهرة',
    area: 'مدينة نصر',
    address: 'Ken Copy Center & Bookstore، مدينة نصر، القاهرة',
    phone: '01014413903',
    phoneFormatted: '0101 441 3903',
    whatsapp: '201014413903',
    mapUrl: 'https://maps.app.goo.gl/YCLvoR9ouuQFUCdv8',
    lat: 30.0565601,
    lng: 31.3348015,
    workingHours: '7:00 ص - 12:00 منتصف الليل',
    isOpen: true,
    features: ['مركز KEN للطباعة والتصوير', 'طباعة مذكرات وامتحانات', 'خدمات سريعة']
  }
];

// =============================================================================
// 2. حالة التطبيق (State)
// =============================================================================
const state = {
  userLocation: null,
  isLocating: false,
  branches: [...BRANCHES_DATA],
  activeFilter: 'all',
  searchQuery: '',
  mobileMode: 'list',
  map: null,
  markers: {},
  userMarker: null,
  activeBranchId: null
};

// =============================================================================
// 3. خوارزمية حساب المسافة (Haversine Formula)
// =============================================================================
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = deg => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDistance(distKm) {
  if (distKm === null || distKm === undefined || isNaN(distKm)) return 'اضغط للمسافة';
  if (distKm < 1) {
    return `${Math.round(distKm * 1000)} متر`;
  }
  return `${distKm.toFixed(1)} كم`;
}

// =============================================================================
// 4. تحديد الموقع الجغرافي الخفيف والذكي (Non-Blocking Geolocation)
// =============================================================================
function requestUserLocation(manual = false) {
  const beaconDot = document.getElementById('gpsBeaconDot');
  const gpsText = document.getElementById('gpsStatusText');
  const locateMeBtn = document.getElementById('locateMeBtn');
  const dockBtnLocate = document.getElementById('dockBtnLocate');

  if (locateMeBtn) {
    locateMeBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i><span>جاري الفحص...</span>';
  }

  if (beaconDot) beaconDot.className = 'beacon-dot';
  if (gpsText) gpsText.textContent = manual ? 'جاري تحديد موقعك الجغرافي بدقة...' : 'جاري فحص وتحديد موقعك...';

  state.isLocating = true;

  function onSuccess(lat, lng, name = 'موقعي الحالي') {
    state.isLocating = false;
    state.userLocation = { lat: parseFloat(lat), lng: parseFloat(lng), name };

    if (beaconDot) beaconDot.className = 'beacon-dot success';
    if (gpsText) gpsText.textContent = `الموقع: ${name} 🎯`;

    if (locateMeBtn) {
      locateMeBtn.innerHTML = '<i class="fa-solid fa-check"></i><span>تم التحديد</span>';
      setTimeout(() => {
        locateMeBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i><span>تحديد موقعي</span>';
      }, 3000);
    }

    if (dockBtnLocate) {
      dockBtnLocate.classList.add('accent-gps');
    }

    showToast(`تم تحديد موقعك بدقة وترتيب الفروع للأقرب إليك!`, 'success');
    sortAndRender();
    updateMap();
  }

  function fallbackToIp() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
      .then(res => res.json())
      .then(data => {
        if (data && data.latitude && data.longitude) {
          onSuccess(data.latitude, data.longitude, data.city || 'القاهرة');
        } else {
          onError();
        }
      })
      .catch(() => onError());
  }

  function onError() {
    state.isLocating = false;
    if (gpsText) gpsText.textContent = 'اختر منطقتك من الشرائح أدناه لتحديد الأقرب';

    if (locateMeBtn) {
      locateMeBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i><span>تحديد موقعي</span>';
    }

    if (manual) {
      showToast('يرجى تفعيل صلاحية الـ GPS أو الضغط على منطقتك مباشرة.', 'warning');
    }

    sortAndRender();
  }

  if (!navigator.geolocation) {
    fallbackToIp();
    return;
  }

  // استخدام إعداد خفيف عند البدء لتفادي تعليق المتصفح، وإعداد عالي الدقة فقط عند النقر اليدوي
  const geoOptions = manual
    ? { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    : { enableHighAccuracy: false, timeout: 3500, maximumAge: 300000 };

  navigator.geolocation.getCurrentPosition(
    pos => onSuccess(pos.coords.latitude, pos.coords.longitude, 'موقعي الحالي'),
    () => fallbackToIp(),
    geoOptions
  );
}

// =============================================================================
// 5. المعالجة والفرز (Sorting & Distances)
// =============================================================================
function sortAndRender() {
  state.branches = state.branches.map(branch => {
    let d = null;
    if (state.userLocation) {
      d = calculateDistance(state.userLocation.lat, state.userLocation.lng, branch.lat, branch.lng);
    }
    return { ...branch, distance: d };
  });

  if (state.userLocation) {
    state.branches.sort((a, b) => {
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });
  }

  renderBranchCards();
}

function getFilteredList() {
  return state.branches.filter(branch => {
    if (state.activeFilter === 'open' && !branch.isOpen) return false;

    const quickAreas = ['مدينة نصر', 'المعادي', 'المهندسين', 'الهرم', 'التجمع الخامس', 'الشيخ زايد'];
    if (quickAreas.includes(state.activeFilter)) {
      const match = branch.area.includes(state.activeFilter) || branch.address.includes(state.activeFilter);
      if (!match) return false;
    }

    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.trim().toLowerCase();
      const matchName = branch.name.toLowerCase().includes(q);
      const matchArea = branch.area.toLowerCase().includes(q);
      const matchAddr = branch.address.toLowerCase().includes(q);
      return matchName || matchArea || matchAddr;
    }

    return true;
  });
}

// =============================================================================
// 6. توليد وتصميم البطاقات المتقنة (Render Branch Cards)
// =============================================================================
function renderBranchCards() {
  const container = document.getElementById('cardsListContainer');
  const emptyState = document.getElementById('noResultsState');
  const feedCountTag = document.getElementById('feedCountTag');
  const totalBranchesBadge = document.getElementById('totalBranchesBadge');
  const dockBranchesCount = document.getElementById('dockBranchesCount');

  if (!container) return;

  const filtered = getFilteredList();

  if (totalBranchesBadge) totalBranchesBadge.textContent = BRANCHES_DATA.length;
  if (feedCountTag) feedCountTag.textContent = `${filtered.length} فروع متاحة`;
  if (dockBranchesCount) dockBranchesCount.textContent = filtered.length;

  if (filtered.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  } else {
    if (emptyState) emptyState.classList.add('hidden');
  }

  const nearestId = (state.userLocation && filtered.length > 0 && filtered[0].distance !== null)
    ? filtered[0].id
    : null;

  container.innerHTML = filtered.map((branch, index) => {
    const isNearest = branch.id === nearestId;
    const distText = branch.distance !== null ? formatDistance(branch.distance) : 'اضغط للمسافة';
    const gmapsUrl = branch.mapUrl || `https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`;
    
    const waMsg = encodeURIComponent(`مرحباً SAT&IG BOOKSTORE، أود الاستفسار بخصوص الكتب والمناهج المتاحة في فرع (${branch.name})`);
    const waUrl = `https://wa.me/${branch.whatsapp}?text=${waMsg}`;
    const staggerDelay = Math.min(index * 0.04, 0.24).toFixed(2);

    return `
      <article class="next-branch-card ${isNearest ? 'is-nearest' : ''}" onclick="focusBranch('${branch.id}')" data-id="${branch.id}" style="animation-delay: ${staggerDelay}s;">
        
        <!-- الصف العلوي من البطاقة -->
        <div class="card-top-row">
          <div class="branch-main-info">
            <div class="branch-badges-strip">
              ${isNearest ? `
                <span class="badge-nearest-star">
                  <i class="fa-solid fa-crown"></i> الفرع الأقرب إليك
                </span>
              ` : ''}
              <span class="badge-area-pill">
                <i class="fa-solid fa-location-dot"></i> ${branch.area}
              </span>
              <span class="badge-live-open">
                <i class="fa-solid fa-circle" style="font-size: 0.42rem;"></i> مفتوح الآن
              </span>
            </div>
            <h2 class="card-branch-title">${branch.name}</h2>
          </div>

          <div class="card-distance-badge ${isNearest ? 'gold-distance' : ''}" title="المسافة التقديرية">
            <i class="fa-solid fa-route"></i>
            <span>${distText}</span>
          </div>
        </div>

        <!-- تفاصيل العنوان ومواعيد العمل ورقم الهاتف -->
        <div class="card-meta-details">
          <div class="meta-line">
            <i class="fa-solid fa-map-pin"></i>
            <div>${branch.address}</div>
          </div>

          <div class="meta-line">
            <i class="fa-solid fa-phone"></i>
            <div>
              <span>الهاتف: </span>
              <a href="tel:${branch.phone}" class="phone-clickable-link" dir="ltr" onclick="event.stopPropagation()">${branch.phoneFormatted}</a>
            </div>
          </div>

          <div class="meta-line">
            <i class="fa-regular fa-clock"></i>
            <div>مواعيد العمل: ${branch.workingHours}</div>
          </div>

          <!-- وسوم الميزات والكتب -->
          <div class="card-features-chips">
            ${branch.features.map(f => `<span class="feature-chip-tag">${f}</span>`).join('')}
          </div>
        </div>

        <!-- شبكة أزرار الإجراءات المتناسقة هندسياً 2x2 -->
        <div class="card-actions-grid" onclick="event.stopPropagation()">
          <!-- زر خرائط جوجل -->
          <a href="${gmapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-action-base btn-action-maps" title="فتح الملاحة عبر خرائط جوجل">
            <i class="fa-solid fa-diamond-turn-right"></i>
            <span>الاتجاهات</span>
          </a>

          <!-- زر واتساب -->
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-action-base btn-action-whatsapp" title="محادثة واتساب مباشرة مع الفرع">
            <i class="fa-brands fa-whatsapp"></i>
            <span>واتساب</span>
          </a>

          <!-- زر الاتصال الهاتفي -->
          <a href="tel:${branch.phone}" class="btn-action-base btn-action-call" title="اتصال مباشر بالفرع">
            <i class="fa-solid fa-phone"></i>
            <span>اتصال بالفرع</span>
          </a>

          <!-- زر عرض على الخريطة -->
          <button type="button" class="btn-action-base btn-action-focus" onclick="focusBranch('${branch.id}')" title="عرض موقع الفرع على الخريطة">
            <i class="fa-solid fa-map-location-dot"></i>
            <span>الخريطة</span>
          </button>
        </div>

      </article>
    `;
  }).join('');
}

// =============================================================================
// 7. الخريطة التفاعلية (Leaflet Map Integration)
// =============================================================================
function initializeMap() {
  const mapElement = document.getElementById('leafletMap');
  if (!mapElement || typeof L === 'undefined') return;

  state.map = L.map('leafletMap', {
    center: [30.0444, 31.2357],
    zoom: 12,
    zoomControl: false,
    scrollWheelZoom: true
  });

  // وضع زوم الخريطة في أعلى اليسار لتفادي زر التوسيط في أعلى اليمين
  L.control.zoom({ position: 'topleft' }).addTo(state.map);

  // طبقة خريطة جوجل الرسمية
  L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: 'خرائط &copy; Google Maps'
  }).addTo(state.map);

  renderMapMarkers();
}

function renderMapMarkers() {
  if (!state.map) return;

  Object.values(state.markers).forEach(m => m.remove());
  state.markers = {};

  const nearestBranch = (state.userLocation && state.branches.length > 0 && state.branches[0].distance !== null)
    ? state.branches[0]
    : null;

  state.branches.forEach(branch => {
    const isNearest = nearestBranch && branch.id === nearestBranch.id;

    const iconHtml = `
      <div class="custom-marker-pin ${isNearest ? 'gold-pin' : 'blue-pin'}">
        <i class="fa-solid ${isNearest ? 'fa-crown' : 'fa-store'}"></i>
      </div>
    `;

    const icon = L.divIcon({
      html: iconHtml,
      className: '',
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36]
    });

    const gmapsUrl = branch.mapUrl || `https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`;
    const waUrl = `https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(`مرحباً فرع ${branch.name}`)}`;
    const distText = branch.distance ? formatDistance(branch.distance) : '';

    const popupHtml = `
      <div style="direction: rtl; text-align: right; padding: 12px 14px; min-width: 220px; font-family: var(--font);">
        <h3 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 4px; color: var(--text-1);">${branch.name}</h3>
        <p style="font-size: 0.78rem; color: var(--text-2); margin-bottom: 8px;">${branch.address}</p>
        ${distText ? `<div style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.78rem; font-weight: 800; color: #3b82f6; background: rgba(59,130,246,0.15); padding: 2px 8px; border-radius: 6px; margin-bottom: 8px;"><i class="fa-solid fa-route"></i> المسافة: ${distText}</div>` : ''}
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 6px;">
          <a href="${gmapsUrl}" target="_blank" style="background: #2563eb; color: #fff; padding: 6px; border-radius: 6px; font-size: 0.76rem; font-weight: 800; text-align: center; display: flex; align-items: center; justify-content: center; gap: 4px;">
            <i class="fa-solid fa-diamond-turn-right"></i> الاتجاهات
          </a>
          <a href="${waUrl}" target="_blank" style="background: #10b981; color: #fff; padding: 6px; border-radius: 6px; font-size: 0.76rem; font-weight: 800; text-align: center; display: flex; align-items: center; justify-content: center; gap: 4px;">
            <i class="fa-brands fa-whatsapp"></i> واتساب
          </a>
        </div>
      </div>
    `;

    const marker = L.marker([branch.lat, branch.lng], { icon })
      .addTo(state.map)
      .bindPopup(popupHtml);

    marker.on('click', () => {
      openBottomSheet(branch);
    });

    state.markers[branch.id] = marker;
  });
}

function updateMap() {
  if (!state.map) return;
  renderMapMarkers();

  if (state.userLocation) {
    if (state.userMarker) state.userMarker.remove();

    const userHtml = `
      <div class="custom-marker-pin user-pin">
        <i class="fa-solid fa-location-crosshairs"></i>
      </div>
    `;

    const icon = L.divIcon({
      html: userHtml,
      className: '',
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });

    state.userMarker = L.marker([state.userLocation.lat, state.userLocation.lng], { icon })
      .addTo(state.map)
      .bindPopup(`
        <div style="direction: rtl; text-align: right; padding: 8px 12px; font-family: var(--font);">
          <strong style="color: #10b981;">📍 ${state.userLocation.name || 'موقعك الحالي'}</strong>
        </div>
      `);

    const points = [
      [state.userLocation.lat, state.userLocation.lng],
      ...state.branches.map(b => [b.lat, b.lng])
    ];
    state.map.fitBounds(points, { padding: [60, 60], maxZoom: 14 });
  }
}

// عرض البطاقة العائمة السفلية عند النقر على أي ماركر بتنسيق متقن
function openBottomSheet(branch) {
  const sheet = document.getElementById('mapBottomSheet');
  const content = document.getElementById('bottomSheetContent');
  if (!sheet || !content) return;

  const gmapsUrl = branch.mapUrl || `https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`;
  const waUrl = `https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(`مرحباً فرع ${branch.name}`)}`;
  const distText = branch.distance ? formatDistance(branch.distance) : '';

  content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; padding-left: 32px;">
      <div>
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
          <span style="font-size: 0.72rem; font-weight: 800; color: #3b82f6; background: rgba(59,130,246,0.15); padding: 2px 7px; border-radius: 20px;">
            ${branch.area}
          </span>
          <span style="font-size: 0.7rem; font-weight: 800; color: #10b981; background: rgba(16,185,129,0.15); padding: 2px 7px; border-radius: 20px;">
            مفتوح الآن
          </span>
        </div>
        <h3 style="font-size: 1.02rem; font-weight: 900; color: var(--text-1); margin: 0;">${branch.name}</h3>
      </div>
      ${distText ? `<span style="font-size: 0.78rem; font-weight: 800; color: #f59e0b; background: rgba(245,158,11,0.15); padding: 3px 8px; border-radius: 20px; white-space: nowrap;"><i class="fa-solid fa-route"></i> ${distText}</span>` : ''}
    </div>
    <p style="font-size: 0.82rem; color: var(--text-2); margin-bottom: 10px; line-height: 1.4;">${branch.address}</p>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
      <a href="${gmapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-action-base btn-action-maps">
        <i class="fa-solid fa-diamond-turn-right"></i> الاتجاهات
      </a>
      <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-action-base btn-action-whatsapp">
        <i class="fa-brands fa-whatsapp"></i> واتساب
      </a>
      <a href="tel:${branch.phone}" class="btn-action-base btn-action-call" style="grid-column: span 2;">
        <i class="fa-solid fa-phone"></i> اتصال بالفرع (${branch.phoneFormatted})
      </a>
    </div>
  `;

  sheet.classList.remove('hidden');
}

// التركيز على الفرع بالخريطة
window.focusBranch = function(branchId) {
  const branch = state.branches.find(b => b.id === branchId);
  const marker = state.markers[branchId];

  if (window.innerWidth < 1024) {
    switchMobileMode('map');
  }

  setTimeout(() => {
    if (state.map && branch) {
      state.map.invalidateSize();
      state.map.setView([branch.lat, branch.lng], 16, { animate: true });
      if (marker) marker.openPopup();
      openBottomSheet(branch);
    }
  }, 160);

  showToast(`تم توجيه الخريطة إلى فرع "${branch.name}"`, 'info');
};

// =============================================================================
// 8. التحكم والتبديل على شاشات الموبايل (Mobile Modes)
// =============================================================================
function switchMobileMode(mode) {
  state.mobileMode = mode;

  const btnList = document.getElementById('dockBtnList');
  const btnMap = document.getElementById('dockBtnMap');

  if (mode === 'map') {
    document.body.classList.remove('mobile-mode-list');
    document.body.classList.add('mobile-mode-map');
    if (btnList) btnList.classList.remove('active');
    if (btnMap) btnMap.classList.add('active');

    // تحديث فوري وسلس بدون شاشات رمادية
    if (state.map) {
      state.map.invalidateSize();
      requestAnimationFrame(() => state.map && state.map.invalidateSize());
      setTimeout(() => state.map && state.map.invalidateSize(), 150);
    }
  } else {
    document.body.classList.remove('mobile-mode-map');
    document.body.classList.add('mobile-mode-list');
    if (btnList) btnList.classList.add('active');
    if (btnMap) btnMap.classList.remove('active');
  }
}

// =============================================================================
// 9. نظام الإشعارات العائمة (Toast System)
// =============================================================================
function showToast(message, type = 'info') {
  const box = document.getElementById('toastBox');
  if (!box) return;

  const toast = document.createElement('div');
  toast.className = `app-toast ${type}`;

  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'warning') icon = 'fa-triangle-exclamation';

  toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
  box.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate3d(0, 12px, 0)';
    toast.style.transition = 'all 0.22s ease';
    setTimeout(() => toast.remove(), 240);
  }, 3200);
}

// =============================================================================
// 10. إعداد الأحداث والبدء (Setup & Init)
// =============================================================================
function setupEventListeners() {
  const locateBtn = document.getElementById('locateMeBtn');
  if (locateBtn) locateBtn.addEventListener('click', () => requestUserLocation(true));

  const refreshGpsBtn = document.getElementById('refreshGpsBtn');
  if (refreshGpsBtn) refreshGpsBtn.addEventListener('click', () => requestUserLocation(true));

  const dockBtnLocate = document.getElementById('dockBtnLocate');
  if (dockBtnLocate) dockBtnLocate.addEventListener('click', () => requestUserLocation(true));

  const dockBtnList = document.getElementById('dockBtnList');
  const dockBtnMap = document.getElementById('dockBtnMap');
  if (dockBtnList) dockBtnList.addEventListener('click', () => switchMobileMode('list'));
  if (dockBtnMap) dockBtnMap.addEventListener('click', () => switchMobileMode('map'));

  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');

  if (searchInput) {
    searchInput.addEventListener('input', e => {
      state.searchQuery = e.target.value;
      if (clearSearchBtn) {
        if (state.searchQuery.length > 0) clearSearchBtn.classList.remove('hidden');
        else clearSearchBtn.classList.add('hidden');
      }
      renderBranchCards();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        state.searchQuery = '';
        clearSearchBtn.classList.add('hidden');
        renderBranchCards();
        searchInput.focus();
      }
    });
  }

  document.querySelectorAll('#filterChipsRow .filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#filterChipsRow .filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filterType = chip.dataset.filter;
      const area = chip.dataset.area;
      const lat = chip.dataset.lat;
      const lng = chip.dataset.lng;

      if (area && lat && lng) {
        state.userLocation = { lat: parseFloat(lat), lng: parseFloat(lng), name: area };
        const gpsText = document.getElementById('gpsStatusText');
        if (gpsText) gpsText.textContent = `الموقع: ${area} (اختيار سريع) 🎯`;
        showToast(`تم تعيين موقعك إلى "${area}" وإعادة ترتيب الفروع للأقرب!`, 'info');
        sortAndRender();
        updateMap();
      } else {
        state.activeFilter = filterType;
        renderBranchCards();
      }
    });
  });

  const recenterBtn = document.getElementById('recenterMapBtn');
  if (recenterBtn) {
    recenterBtn.addEventListener('click', () => {
      if (state.map) {
        const bounds = Object.values(state.markers).map(m => m.getLatLng());
        if (state.userMarker) bounds.push(state.userMarker.getLatLng());
        if (bounds.length > 0) {
          state.map.fitBounds(bounds, { padding: [40, 40] });
          showToast('تمت إعادة ضبط إطار الخريطة على جميع الفروع.', 'info');
        }
      }
    });
  }

  const closeSheetBtn = document.getElementById('closeSheetBtn');
  if (closeSheetBtn) {
    closeSheetBtn.addEventListener('click', () => {
      const sheet = document.getElementById('mapBottomSheet');
      if (sheet) sheet.classList.add('hidden');
    });
  }

  const resetBtn = document.getElementById('resetSearchAction');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      state.searchQuery = '';
      state.activeFilter = 'all';
      document.querySelectorAll('#filterChipsRow .filter-chip').forEach(c => {
        c.classList.toggle('active', c.dataset.filter === 'all');
      });
      renderBranchCards();
    });
  }

  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      themeBtn.innerHTML = isLight ? '<i class="fa-solid fa-sun" style="color: #f59e0b;"></i>' : '<i class="fa-solid fa-moon"></i>';
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  sortAndRender();
  initializeMap();
  requestUserLocation(false);
});
