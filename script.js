
// ⚙️ عناصر التحكم
L.control.scale({ position: 'bottomleft' }).addTo(map);
L.control.measure({
  primaryLengthUnit: 'kilometers',
  primaryAreaUnit: 'sqkilometers',
  activeColor: '#005f73',
  completedColor: '#94d2bd'
}).addTo(map);

// 📍 إحداثيات
map.on('click', e => {
  L.popup().setLatLng(e.latlng)
    .setContent(`📍 <b>إحداثيات:</b><br>${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`)
    .openOn(map);
});

// 🏠 زر العودة
L.Control.ZoomHome = L.Control.extend({
  onAdd: function() {
    const btn = L.DomUtil.create("button", "home-btn");
    btn.innerHTML = "🏠";
    btn.title = "الرجوع لمنطقة الدراسة";
    btn.onclick = () => map.setView([26.7, 33.9], 7);
    return btn;
  }
});
L.control.zoomHome = opts => new L.Control.ZoomHome(opts);
L.control.zoomHome({ position: "topleft" }).addTo(map);

// 🧩 تحكم في الطبقات
var layerControl;
function updateLayerControl() {
  if (layerControl) map.removeControl(layerControl);
  var baseLayers = {
    "🗺️ الخريطة الأساسية": baseMap,
    "🌊 الارتفاعات": elevation,
    "🏔️ الانحدار": slope,
    "⚠️ أخطار السيول": floodHazard,
    "🏘️ استخدامات الأراضي": landUse
  };
  var overlays = {};
  if (floodLayer) overlays["🔴 مناطق السيول"] = floodLayer;
  if (damsLayer) overlays["🔵 مواقع السدود"] = damsLayer;
  layerControl = L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(map);
}



function openPopup(imgSrc, title, desc) {
  const popup = document.getElementById('imagePopup');
  const img = document.getElementById('popupImg');
  const titleEl = document.getElementById('popupTitle');
  const descEl = document.getElementById('popupDesc');

  img.src = imgSrc;
  img.style.display = "block"; // تأكيد ظهور الصورة
  titleEl.innerText = title;
  descEl.innerText = desc;

  popup.style.display = "block";
}

function closePopup() {
  document.getElementById('imagePopup').style.display = "block";
}

// إغلاق عند الضغط خارج الصورة
window.onclick = function(e) {
  const popup = document.getElementById('imagePopup');
  if (e.target === popup) closePopup();
};
// 🖼️ دالة فتح الصورة في الـ Popup
function openPopup(imgSrc, title, desc) {
  const popup = document.getElementById("imagePopup");
  const popupImg = document.getElementById("popupImg");
  const popupTitle = document.getElementById("popupTitle");
  const popupDesc = document.getElementById("popupDesc");

  // ضبط المحتوى
  popupImg.src = imgSrc;
  popupTitle.textContent = title;
  popupDesc.textContent = desc;

  // عرض النافذة
  popup.style.display = "block";
}

// ❌ دالة إغلاق النافذة
function closePopup() {
  document.getElementById("imagePopup").style.display = "none";
}


// 🖌️ إضافة FeatureGroup لتخزين العناصر المرسومة
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// 🛠️ أدوات الرسم
const drawControl = new L.Control.Draw({
  draw: {
    polyline: true,
    polygon: true,
    rectangle: true,
    circle: false, // يمكن تفعيله لو أردت
    marker: true,
    circlemarker: false
  },
  edit: {
    featureGroup: drawnItems,
    remove: true
  }
});
map.addControl(drawControl);



map.on(L.Draw.Event.CREATED, function (event) {
  const layer = event.layer;
  drawnItems.addLayer(layer);

  const geojson = layer.toGeoJSON();

  // حساب المساحة أو الطول باستخدام turf.js
  let resultText = '';

  if (geojson.geometry.type === "Polygon") {
    const area = turf.area(geojson); // بالمتر المربع
    const areaKm2 = (area / 1e6).toFixed(2);
    resultText = `📐 المساحة: ${areaKm2} كم²`;
  } else if (geojson.geometry.type === "LineString") {
    const length = turf.length(geojson, { units: 'kilometers' }).toFixed(2);
    resultText = `📏 الطول: ${length} كم`;
  } else if (geojson.geometry.type === "Point") {
    resultText = `📍 نقطة تم وضعها: [${geojson.geometry.coordinates.map(c => c.toFixed(4)).join(", ")}]`;
  }

  // عرض النتيجة في Popup
  layer.bindPopup(resultText).openPopup();
});



const images = [
  "img/map1.jpg",
  "img/map2.jpg",
  "img/map3.jpg"
];

let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  lightboxImg.src = images[currentIndex];
  lightbox.classList.add("show");
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("show");
}

function changeImage(direction) {
  currentIndex += direction;
  if (currentIndex < 0) currentIndex = images.length - 1;
  if (currentIndex >= images.length) currentIndex = 0;

  document.getElementById("lightbox-img").src = images[currentIndex];
}

// ✅ إغلاق عند الضغط خارج الصورة
document.getElementById("lightbox").addEventListener("click", (e) => {
  if (e.target.id === "lightbox") closeLightbox();
});

// ✅ التنقل بالكيبورد
document.addEventListener("keydown", (e) => {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox.classList.contains("show")) return;

  if (e.key === "ArrowRight") changeImage(1);
  if (e.key === "ArrowLeft") changeImage(-1);
  if (e.key === "Escape") closeLightbox();
});
document.querySelector('#laeq a').addEventListener('click', function() {
    alert('تم الضغط على زر فتح المعرض!');
});
