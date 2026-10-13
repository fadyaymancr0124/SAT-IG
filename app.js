/**
 * تطبيق فروعنا الذكي (Branches Locator Web App)
 * - دعم كامل للغة العربية (RTL)
 * - تحديد الموقع الجغرافي التلقائي (Geolocation)
 * - خوارزمية حساب المسافات الدقيقة (Haversine Formula)
 * - الترتيب الذكي للأقرب فالأبعد
 * - الربط المباشر مع خرائط جوجل (Google Maps)
 * - خريطة تفاعلية مدعومة بـ Leaflet
 */

// =============================================================================
// 1. بيانات الفروع الحقيقية (Real Branches Data)
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
    mapUrl: 'https://maps.app.goo.gl/GCoPy6z8fq2wbqFYA',
    lat: 29.9971307,
    lng: 31.1619592,
    workingHours: '7:00 ص - 12:00 منتصف الليل',
    isOpen: true,
    features: ['فرع الهرم', 'مناهج EST و SAT و IGCSE', 'استشارات واختيار المواد']
  },
  {
    id: 'ken-nasr-city',
    name: 'KEN',
    city: 'القاهرة',
    area: 'مدينة نصر',
    address: 'Ken Copy Center & Bookstore، مدينة نصر، القاهرة',
    phone: '01014413903',
    phoneFormatted: '0101 441 3903',
    mapUrl: 'https://maps.app.goo.gl/YCLvoR9ouuQFUCdv8',
    lat: 30.0565601,
    lng: 31.3348015,
    workingHours: '7:00 ص - 12:00 منتصف الليل',
    isOpen: true,
    features: ['مركز KEN للطباعة والتصوير', 'طباعة مذكرات وامتحانات', 'خدمات سريعة']
  }
];

// =============================================================================
// 2. حالة التطبيق (Application State)
// =============================================================================
const state = {
  userLocation: null, // { lat: number, lng: number, accuracy: number, name?: string }
  isLocating: false,
  locationPermissionDenied: false,
  branches: [...BRANCHES_DATA],
  activeFilter: 'all', // 'all' | 'open'
  searchQuery: '',
  isDarkMode: false,
  map: null,
  tileLayer: null,
  markers: {},
  userMarker: null
};

// =============================================================================
// 3. خوارزمية حساب المسافة الدقيقة (Haversine Formula)
// =============================================================================
/**
 * حساب المسافة بين نقطتين جغرافيتين بالكيلومتر
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // نصف قطر الأرض بالكيلومتر
  const toRad = deg => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // المسافة بالكيلومتر
}

/**
 * تنسيق المسافة لتظهر بشكل أنيق ومفهوم للمستخدم
 */
function formatDistance(distanceInKm) {
  if (distanceInKm === null || distanceInKm === undefined || isNaN(distanceInKm)) {
    return 'غير محدد';
  }

  if (distanceInKm < 1) {
    const meters = Math.round(distanceInKm * 1000);
    return `${meters} متر`;
  }

  return `${distanceInKm.toFixed(1)} كم`;
}

// =============================================================================
// 4. إدارة تحديد الموقع (Geolocation Management)
// =============================================================================

/**
 * طلب موقع العميل عبر ميزة Geolocation في المتصفح مع آلية احتياطية ذكية ومؤشرات تفاعلية فورية
 */
function requestUserLocation(manualTrigger = false) {
  const detectBtn = document.getElementById('detectLocationBtn');
  const requestPermissionBtn = document.getElementById('requestPermissionBtn');
  const permissionNotice = document.getElementById('permissionNotice');

  if (detectBtn) {
    detectBtn.disabled = true;
    detectBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>جاري التحديد...</span>';
  }

  if (requestPermissionBtn) {
    requestPermissionBtn.disabled = true;
    requestPermissionBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>جاري الفحص...</span>';
  }

  updateLocationStatus('جاري فحص وتحديد موقعك الجغرافي...', 'pulse');
  state.isLocating = true;

  function onLocationSuccess(lat, lng, accuracy, sourceName = 'موقعي الحالي') {
    state.isLocating = false;
    state.locationPermissionDenied = false;
    if (permissionNotice) permissionNotice.classList.add('hidden');

    state.userLocation = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      accuracy: accuracy || 50,
      name: sourceName
    };

    updateLocationStatus(`تم تحديد موقعك بدقة بنجاح 🎯`, 'success');
    showToast(`تم تحديد موقعك بنجاح وترتيب فروع SAT&IG حسب الأقرب إليك!`, 'success');

    if (detectBtn) {
      detectBtn.disabled = false;
      detectBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>تم التحديد</span>';
      setTimeout(() => {
        detectBtn.innerHTML = '<i class="fa-solid fa-crosshairs"></i> <span>تحديد موقعي</span>';
      }, 3500);
    }

    if (requestPermissionBtn) {
      requestPermissionBtn.disabled = false;
      requestPermissionBtn.innerHTML = '<i class="fa-solid fa-location-arrow"></i> تفعيل الموقع الآن';
    }

    processBranchesDistances();
    sortAndRenderBranches();
    updateMapWithLocation();
  }

  function fallbackToIpLocation(reason = '') {
    // محاولة تحديد الموقع التلقائي بالاعتماد على مزود IP السريع والآمن في حال تعذر GPS
    fetch('https://get.geojs.io/v1/ip/geo.json')
      .then(res => res.json())
      .then(data => {
        if (data && data.latitude && data.longitude) {
          const cityName = data.city || 'القاهرة';
          onLocationSuccess(data.latitude, data.longitude, 1500, cityName);
        } else {
          onLocationFailure('تعذر العثور على الإحداثيات');
        }
      })
      .catch(() => {
        onLocationFailure(reason || 'تعذر تحديد الموقع تلقائياً');
      });
  }

  function onLocationFailure(errMsg) {
    state.isLocating = false;
    state.locationPermissionDenied = true;
    if (permissionNotice) permissionNotice.classList.remove('hidden');

    updateLocationStatus('لم يتم منح إذن الموقع (يمكنك البحث باسم منطقتك)', 'warning');
    if (manualTrigger) {
      showToast('يرجى تفعيل صلاحية الموقع من إعدادات المتصفح لمعرفة أقرب فرع بالكيلومتر.', 'warning');
    }

    if (detectBtn) {
      detectBtn.disabled = false;
      detectBtn.innerHTML = '<i class="fa-solid fa-crosshairs"></i> <span>تحديد موقعي</span>';
    }

    if (requestPermissionBtn) {
      requestPermissionBtn.disabled = false;
      requestPermissionBtn.innerHTML = '<i class="fa-solid fa-location-arrow"></i> تفعيل الموقع الآن';
    }

    processBranchesDistances();
    sortAndRenderBranches();
    updateMapWithLocation();
  }

  // إذا لم يكن المتصفح يدعم Geolocation، يتم التبديل فوراً للموقع عبر IP
  if (!navigator.geolocation) {
    fallbackToIpLocation('المتصفح لا يدعم Geolocation');
    return;
  }

  // محاولة تحديد الموقع بالدقة المتاحة
  navigator.geolocation.getCurrentPosition(
    position => {
      onLocationSuccess(
        position.coords.latitude,
        position.coords.longitude,
        position.coords.accuracy,
        'موقعي الحالي'
      );
    },
    error => {
      // إذا فشلت المحاولة الأولى (مثلاً بسبب Timeout في أجهزة الكمبيوتر التي لا تحتوي على شريحة GPS)
      // نحاول فوراً بنمط الشبكة السريعة أو عبر IP
      if (error.code === error.PERMISSION_DENIED) {
        fallbackToIpLocation('تم رفض الصلاحية');
      } else {
        navigator.geolocation.getCurrentPosition(
          pos => {
            onLocationSuccess(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy, 'موقعي الحالي');
          },
          () => {
            fallbackToIpLocation('فحص الشبكة المباشر');
          },
          { enableHighAccuracy: false, timeout: 6000, maximumAge: 180000 }
        );
      }
    },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
  );
}

/**
 * محاكاة موقع العميل من زر تجريبي (لاختبار تجربة الاستخدام من مناطق مختلفة)
 */
function setSimulatedLocation(lat, lng, locationName) {
  state.userLocation = {
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    name: locationName
  };

  // إخفاء تنبيه الصلاحيات
  const permissionNotice = document.getElementById('permissionNotice');
  if (permissionNotice) permissionNotice.classList.add('hidden');

  updateLocationStatus(`الموقع الحالي: ${locationName} (محاكاة تجريبية)`, 'success');
  showToast(`تم تغيير موقعك إلى "${locationName}" وإعادة ترتيب الفروع للأقرب فوراً!`, 'info');

  // تنشيط الزر في شريط الأزرار التجريبية
  document.querySelectorAll('.demo-pill').forEach(pill => {
    if (pill.dataset.name === locationName) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });

  processBranchesDistances();
  sortAndRenderBranches();
  updateMapWithLocation();
}

/**
 * تحديث شارة حالة تحديد الموقع في الواجهة
 */
function updateLocationStatus(text, type = 'pulse') {
  const statusText = document.getElementById('locationStatusText');
  const statusDot = document.querySelector('.status-dot');

  if (statusText) statusText.textContent = text;
  if (statusDot) {
    statusDot.className = 'status-dot';
    if (type === 'pulse') statusDot.classList.add('pulse');
    if (type === 'warning') statusDot.classList.add('warning');
  }
}

// =============================================================================
// 5. معالجة المسافات والترتيب الذكي (Smart Sorting & Distance Processing)
// =============================================================================

/**
 * حساب مسافة كل فرع وترتيبها بحيث يكون الأقرب في أعلى القائمة
 */
function processBranchesDistances() {
  state.branches = state.branches.map(branch => {
    let distance = null;
    if (state.userLocation) {
      distance = calculateDistance(
        state.userLocation.lat,
        state.userLocation.lng,
        branch.lat,
        branch.lng
      );
    }
    return {
      ...branch,
      distance: distance
    };
  });

  // إذا تم تحديد موقع العميل، نرتب الفروع تصاعدياً من الأقرب إلى الأبعد
  if (state.userLocation) {
    state.branches.sort((a, b) => {
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });
  }
}

// =============================================================================
// 6. عرض وتوليد بطاقات الفروع (Render Branch Cards)
// =============================================================================

function sortAndRenderBranches() {
  const container = document.getElementById('branchesContainer');
  const emptyState = document.getElementById('emptyState');
  const resultsCountBadge = document.getElementById('resultsCountBadge');
  const totalBranchesCount = document.getElementById('totalBranchesCount');

  if (!container) return;

  // تطبيق التصفية والبحث
  let filteredList = state.branches.filter(branch => {
    // تصفية الحالة (مفتوح الآن)
    if (state.activeFilter === 'open' && !branch.isOpen) {
      return false;
    }

    // تصفية البحث النصي
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.trim().toLowerCase();
      const matchName = branch.name.toLowerCase().includes(q);
      const matchArea = branch.area.toLowerCase().includes(q);
      const matchAddress = branch.address.toLowerCase().includes(q);
      const matchCity = branch.city.toLowerCase().includes(q);
      return matchName || matchArea || matchAddress || matchCity;
    }

    return true;
  });

  // تحديث عدادات الواجهة
  if (totalBranchesCount) totalBranchesCount.textContent = BRANCHES_DATA.length;
  if (resultsCountBadge) resultsCountBadge.textContent = `عرض ${filteredList.length} من ${BRANCHES_DATA.length} فروع`;

  // التعامل مع حالة عدم وجود نتائج
  if (filteredList.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  } else {
    if (emptyState) emptyState.classList.add('hidden');
  }

  // معرفة أقرب فرع لتمييزه بشارة مميزة "الفرع الأقرب إليك"
  const nearestBranchId = (state.userLocation && filteredList.length > 0 && filteredList[0].distance !== null)
    ? filteredList[0].id
    : null;

  // توليد كود HTML لكل بطاقة فرع
  const cardsHtml = filteredList.map((branch, index) => {
    const isNearest = branch.id === nearestBranchId;
    const distanceDisplay = branch.distance !== null ? formatDistance(branch.distance) : 'اضغط لتحديد المسافة';
    const googleMapsUrl = branch.mapUrl || `https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`;

    return `
      <article class="branch-card ${isNearest ? 'is-nearest' : ''}" data-branch-id="${branch.id}" id="card-${branch.id}">
        
        ${isNearest ? `
          <div class="nearest-ribbon">
            <i class="fa-solid fa-star"></i>
            <span>الفرع الأقرب إليك</span>
          </div>
        ` : ''}

        <!-- الجزء العلوي من البطاقة -->
        <div class="card-header-top">
          <div class="branch-name-wrap">
            <h4 class="branch-name">${branch.name}</h4>
            <span class="branch-city">
              <i class="fa-solid fa-city"></i>
              ${branch.city} - ${branch.area}
            </span>
          </div>

          <!-- شارة المسافة التفاعلية -->
          <div class="distance-pill ${isNearest ? 'highlight' : ''}" title="المسافة التقريبية">
            <i class="fa-solid fa-route"></i>
            <span>${distanceDisplay}</span>
          </div>
        </div>

        <!-- تفاصيل العنوان والتواصل -->
        <div class="card-body-details">
          
          <!-- تفاصيل العنوان بالتفصيل -->
          <div class="detail-row">
            <div class="detail-icon">
              <i class="fa-solid fa-map-pin"></i>
            </div>
            <div class="address-text">
              <strong>العنوان:</strong> ${branch.address}
            </div>
          </div>

          <!-- مواعيد وساعات العمل -->
          <div class="detail-row">
            <div class="detail-icon">
              <i class="fa-regular fa-clock"></i>
            </div>
            <div>
              <span>مواعيد العمل: ${branch.workingHours}</span>
              <span class="status-badge-inline ${branch.isOpen ? 'open' : ''}">
                <i class="fa-solid fa-circle" style="font-size: 0.5rem;"></i>
                ${branch.isOpen ? 'مفتوح الآن' : 'مغلق حالياً'}
              </span>
            </div>
          </div>

          <!-- رقم الموبايل مع إمكانية الاتصال المباشر -->
          <div class="phone-contact-box">
            <a href="tel:${branch.phone}" class="phone-link" title="انقر للاتصال المباشر بالفرع">
              <i class="fa-solid fa-phone-volume" style="color: var(--primary-color);"></i>
              <span>${branch.phoneFormatted}</span>
            </a>
            <span class="phone-action-tag">اتصال مباشر</span>
          </div>

        </div>

        <!-- أزرار الإجراءات والربط بخرائط جوجل -->
        <div class="card-actions-footer">
          <!-- زر التوجيه المباشر عبر Google Maps -->
          <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-gmaps" title="الانتقال إلى تطبيق أو موقع خرائط جوجل">
            <i class="fa-solid fa-diamond-turn-right"></i>
            <span>الاتجاهات (Google Maps)</span>
          </a>

          <!-- زر إظهار الفرع على الخريطة التفاعلية -->
          <button type="button" class="btn btn-locate" onclick="focusBranchOnMap('${branch.id}')" title="عرض الفرع على الخريطة هنا">
            <i class="fa-solid fa-eye"></i>
            <span>عرض بالخريطة</span>
          </button>
        </div>

      </article>
    `;
  }).join('');

  container.innerHTML = cardsHtml;
}

// =============================================================================
// 7. إدارة الخريطة التفاعلية المباشرة (Leaflet Map)
// =============================================================================

function updateMapTheme() {
  // يتم تبديل مظهر الخريطة تلقائياً بين الليلي والنهاري بسلاسة عبر CSS Filter في styles.css
}

function initializeMap() {
  const mapElement = document.getElementById('leafletMap');
  if (!mapElement || typeof L === 'undefined') return;

  // مركز افتراضي (وسط القاهرة)
  const defaultCenter = [30.0444, 31.2357];
  
  state.map = L.map('leafletMap', {
    center: defaultCenter,
    zoom: 12,
    zoomControl: true,
    scrollWheelZoom: false,
    maxZoom: 20
  });

  // طبقة خريطة Google Maps الرسمية المباشرة:
  // - تضمن ظهور جميع أسماء الشوارع والميادين باللغة العربية بدقة متناهية
  // - تدعم التكبير العالي حتى مستوى 20 بدون أن تختفي البيانات أو تظهر أي رسائل
  state.tileLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: 'خرائط &copy; Google'
  }).addTo(state.map);

  // رسم علامات الفروع على الخريطة
  renderBranchMarkers();
}

/**
 * إنشاء علامات مخصصة لكل فرع
 */
function renderBranchMarkers() {
  if (!state.map) return;

  // حذف العلامات القديمة إن وجدت
  Object.values(state.markers).forEach(marker => marker.remove());
  state.markers = {};

  const nearestBranch = (state.userLocation && state.branches.length > 0 && state.branches[0].distance !== null)
    ? state.branches[0]
    : null;

  state.branches.forEach(branch => {
    const isNearest = nearestBranch && branch.id === nearestBranch.id;

    // أيقونة مخصصة بتصميم عصري وألوان متناسقة
    const markerHtml = `
      <div class="custom-leaflet-marker">
        <div class="custom-marker-pin ${isNearest ? 'nearest-loc' : 'branch-loc'}">
          <i class="fa-solid ${isNearest ? 'fa-star' : 'fa-store'}"></i>
        </div>
      </div>
    `;

    const customIcon = L.divIcon({
      html: markerHtml,
      className: '',
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -32]
    });

    const googleMapsUrl = branch.mapUrl || `https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`;
    const distanceText = branch.distance ? formatDistance(branch.distance) : '';

    const popupHtml = `
      <div class="custom-map-popup">
        <div class="popup-header">
          <h4 class="popup-title">${branch.name}</h4>
          ${isNearest ? '<span class="popup-badge-nearest">الفرع الأقرب</span>' : ''}
        </div>
        <p class="popup-address"><i class="fa-solid fa-map-pin"></i> ${branch.address}</p>
        ${distanceText ? `<div class="popup-distance-pill"><i class="fa-solid fa-route"></i> المسافة: <strong>${distanceText}</strong></div>` : ''}
        <div class="popup-actions-grid">
          <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="popup-btn-gmaps">
            <i class="fa-solid fa-diamond-turn-right"></i>
            <span>Google Maps</span>
          </a>
          <a href="tel:${branch.phone}" class="popup-btn-call" title="اتصال مباشر بالفرع">
            <i class="fa-solid fa-phone"></i>
          </a>
        </div>
      </div>
    `;

    const marker = L.marker([branch.lat, branch.lng], { icon: customIcon })
      .addTo(state.map)
      .bindPopup(popupHtml, { className: 'sleek-popup-wrapper' });

    state.markers[branch.id] = marker;
  });
}

/**
 * تحديث موقع المستخدم على الخريطة مع إظهار النبض
 */
function updateMapWithLocation() {
  if (!state.map) return;

  renderBranchMarkers();

  if (state.userLocation) {
    if (state.userMarker) {
      state.userMarker.remove();
    }

    const userMarkerHtml = `
      <div class="custom-leaflet-marker">
        <div class="custom-marker-pin user-loc">
          <i class="fa-solid fa-person-walking"></i>
        </div>
      </div>
    `;

    const userIcon = L.divIcon({
      html: userMarkerHtml,
      className: '',
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -32]
    });

    state.userMarker = L.marker([state.userLocation.lat, state.userLocation.lng], { icon: userIcon })
      .addTo(state.map)
      .bindPopup(`
        <div class="custom-map-popup">
          <h4 class="popup-title"><i class="fa-solid fa-location-crosshairs" style="color: #3b82f6;"></i> ${state.userLocation.name || 'موقعك الحالي'}</h4>
          <p class="popup-address">تم حساب وترتيب الفروع انطلاقاً من هذه النقطة</p>
        </div>
      `, { className: 'sleek-popup-wrapper' });

    // تكبير الإطار ليشمل موقع المستخدم وأقرب فرع
    const points = [
      [state.userLocation.lat, state.userLocation.lng],
      ...state.branches.map(b => [b.lat, b.lng])
    ];
    state.map.fitBounds(points, { padding: [50, 50], maxZoom: 14 });
  }
}

/**
 * توجيه الخريطة وفتح نافذة الفرع عند الضغط على "عرض بالخريطة" من البطاقة
 */
window.focusBranchOnMap = function(branchId) {
  const branch = state.branches.find(b => b.id === branchId);
  const marker = state.markers[branchId];

  if (branch && state.map) {
    // التمرير للخريطة إذا كانت على شاشة الموبايل
    if (window.innerWidth < 1024) {
      // تفعيل وضع الخريطة للموبايل
      document.body.classList.remove('mobile-view-list');
      document.body.classList.add('mobile-view-map');
      updateViewButtons('map');
    }

    state.map.setView([branch.lat, branch.lng], 15, { animate: true });
    if (marker) {
      marker.openPopup();
    }

    showToast(`تم توجيه الخريطة إلى "${branch.name}"`, 'info');
  }
};

// =============================================================================
// 8. نظام رسائل الإشعار العائمة (Toast System)
// =============================================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'warning') icon = 'fa-triangle-exclamation';

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// =============================================================================
// 9. تهيئة الأحداث والتفاعل (Event Listeners & Setup)
// =============================================================================
function setupEventListeners() {
  // زر تحديد الموقع في الهيدر
  const detectLocationBtn = document.getElementById('detectLocationBtn');
  if (detectLocationBtn) {
    detectLocationBtn.addEventListener('click', () => {
      requestUserLocation(true);
    });
  }

  // زر تفعيل الموقع في تنبيه الصلاحيات
  const requestPermissionBtn = document.getElementById('requestPermissionBtn');
  if (requestPermissionBtn) {
    requestPermissionBtn.addEventListener('click', () => {
      requestUserLocation(true);
    });
  }

  // حقل البحث السريع
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');

  if (searchInput) {
    searchInput.addEventListener('input', e => {
      state.searchQuery = e.target.value;
      if (clearSearchBtn) {
        if (state.searchQuery.length > 0) {
          clearSearchBtn.classList.remove('hidden');
        } else {
          clearSearchBtn.classList.add('hidden');
        }
      }
      sortAndRenderBranches();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        state.searchQuery = '';
        clearSearchBtn.classList.add('hidden');
        sortAndRenderBranches();
        searchInput.focus();
      }
    });
  }

  // أزرار تصفية الفروع (الكل / مفتوح الآن)
  document.querySelectorAll('.filter-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeFilter = btn.dataset.filter;
      sortAndRenderBranches();
    });
  });

  // أزرار التبديل بين عرض البطاقات والخريطة
  const viewListBtn = document.getElementById('viewListBtn');
  const viewMapBtn = document.getElementById('viewMapBtn');

  if (viewListBtn && viewMapBtn) {
    viewListBtn.addEventListener('click', () => {
      document.body.classList.remove('mobile-view-map');
      document.body.classList.add('mobile-view-list');
      updateViewButtons('list');
    });

    viewMapBtn.addEventListener('click', () => {
      document.body.classList.remove('mobile-view-list');
      document.body.classList.add('mobile-view-map');
      updateViewButtons('map');
      if (state.map) {
        setTimeout(() => state.map.invalidateSize(), 200);
      }
    });
  }

  // زر إعادة تركيز الخريطة
  const recenterMapBtn = document.getElementById('recenterMapBtn');
  if (recenterMapBtn) {
    recenterMapBtn.addEventListener('click', () => {
      if (state.map) {
        const bounds = Object.values(state.markers).map(m => m.getLatLng());
        if (state.userMarker) {
          bounds.push(state.userMarker.getLatLng());
        }
        if (bounds.length > 0) {
          state.map.fitBounds(bounds, { padding: [40, 40] });
          showToast('تمت إعادة ضبط إطار الخريطة.', 'info');
        }
      }
    });
  }

  // زر تغيير الثيم (ليلي / نهاري)
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    // استرجاع الثيم المفضل المخزن
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun" style="color: #f59e0b;"></i>';
      state.isDarkMode = true;
    }

    themeToggleBtn.addEventListener('click', () => {
      state.isDarkMode = !state.isDarkMode;
      if (state.isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun" style="color: #f59e0b;"></i>';
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem('theme', 'light');
      }
      updateMapTheme();
    });
  }

  // زر إعادة ضبط البحث من بطاقة البحث الفارغة
  const resetSearchBtn = document.getElementById('resetSearchBtn');
  if (resetSearchBtn) {
    resetSearchBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      state.searchQuery = '';
      state.activeFilter = 'all';
      document.querySelectorAll('.filter-tabs .tab-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.filter === 'all');
      });
      sortAndRenderBranches();
    });
  }
}

function updateViewButtons(activeView) {
  const viewListBtn = document.getElementById('viewListBtn');
  const viewMapBtn = document.getElementById('viewMapBtn');
  if (viewListBtn && viewMapBtn) {
    viewListBtn.classList.toggle('active', activeView === 'list');
    viewMapBtn.classList.toggle('active', activeView === 'map');
  }
}

// =============================================================================
// 10. بدء تشغيل التطبيق (Application Initialization)
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  processBranchesDistances();
  sortAndRenderBranches();
  initializeMap();

  // طلب الموقع تلقائياً بمجرد فتح التطبيق كما طلب العميل
  requestUserLocation(false);
});
