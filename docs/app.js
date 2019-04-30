var main = function () {
  var data_url = "https://raw.githubusercontent.com/9bow/Seoul-MatZip-2019/master/geo/"
  var data = [
    "평양냉면"
    , "메밀국수(소바)"
    , "막국수"
    , "콩국수"
    , "국밥,해장국"
    , "설렁탕"
    , "감자탕"
    , "순대"
    , "닭볶음탕"
    , "추어탕"
    , "육개장"
    , "대구탕"
    , "김밥"
    , "김치찌개"
    , "부대찌개"
    , "청국장"
    , "된장"
    , "간장게장"
    , "삼계탕"
    , "보쌈"
    , "족발"
    , "치킨"
    , "돈까스"
    , "함박스테이크"
    , "떡볶이"
    , "라면"
    , "라멘"
    , "우동"
    , "튀김"
    , "순두부,두부"
    , "피자"
    , "아이스크림,젤라또"
    , "갓포요리집"
    , "죽"
    , "덮밥,백반,벤또(도시락)"
    , "꼬치구이,로바다야끼"
    , "냉동삼겹살"
    , "기사식당"
    , "스테이크,BBQ"
    , "칼국수"
    , "수제맥주,맥주맛있는곳"
    , "아구찜"
    , "생선구이&조림"
    , "돼지갈비"
    , "돼지고기"
    , "유럽음식"
    , "중동음식"
    , "아프리카음식"
    , "북중남미"
    , "아시아음식"
    , "기네스"
    , "사케"
    , "몰트위스키"
    , "칵테일"
    , "막걸리"
    , "중국집"
  ]
  var DEFAULT_SELECT_OPTION = '맛집 카테고리'
  var LAYER_TYPES = {
    init: 'init',
    category: 'category',
  }
  var INITIAL_MAP_OPTION = {
    center: [37.5654808, 126.9778923], // 서울 시청
    zoomDelta: 0.5,
    zoomSnap: 0.5,
  }
  var MY_POS = { lat: INITIAL_MAP_OPTION['center'][0], lng: INITIAL_MAP_OPTION['center'][1] }
  var MAX_POI = 500
  var currentLayer
  var map = L.map('map', INITIAL_MAP_OPTION)

  // MapBox 지도
  initializeTileLayer()
  initializeSelector()
  $('#bottom-sheet #opener').click(function toggleBottomSheetActive(e) {
    $('#bottom-sheet').toggleClass('active')
  })

  map.on('moveend', onMapMoveEnd)
  map.on('locationfound', onLocationFound)
  map.on('locationerror', onLocationError)

  map.locate({ setView: true })

  /**
   * 메소드 목록
   */

  /**
   * 타일 레이어 추가
   */
  function initializeTileLayer() {
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      maxZoom: 18,
      attribution: `
        Map data &copy <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors,
        <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,
        Imagery © <a href="https://www.mapbox.com/">Mapbox</a>
      `,
      id: 'mapbox.streets'
    }).addTo(map)
  }

  /**
   * 카테고리 셀렉터 초기화
   */
  function initializeSelector() {
    var $dataSelect = $('#data')
    var options = ($dataSelect.prop) ? $dataSelect.prop('options') : $dataSelect.attr('options')
    data.forEach(function (text) { options[options.length] = new Option(text, text) })

    /**
    * Selector가 변경되었을 때 (음식 종류가 바뀌었을 때) 발생
    */
    $dataSelect.on('change', function () {
      if ($dataSelect.val() === DEFAULT_SELECT_OPTION) {
        map.setView(new L.LatLng(MY_POS.lat, MY_POS.lng), 16)
        setTimeout(function () {
          onMapMoveEnd()
        }, 500)
        return
      }

      $.getJSON(data_url + $dataSelect.val() + ".geojson", function (data) {
        drawMarkers(LAYER_TYPES.category, $dataSelect.val(), data)
      })
    })
  }

  function drawMarkers(type, selected, data) {
    if (currentLayer) {
      map.removeLayer(currentLayer)
    }

    currentLayer = L.markerClusterGroup()

    markers = L.geoJson(data, {
      onEachFeature: function (feature, layer) {
        layer.bindPopup(makeMarkerPopup(feature), { maxWidth: 200 })
      }
    })
    currentLayer.addLayer(markers)
    map.addLayer(currentLayer)

    $("#opener").text(`${selected} 목록 보기 (${data.features.length}곳)`)
    $('#listing').html(data.features.map(makeListElement))

    if (type === LAYER_TYPES.category) {
      map.fitBounds(currentLayer.getBounds())
    }
  }

  /**
   *
   * @param {object} item : 각 마커에 필요한 항목
   * @return {string} 팝업 element
   */
  function makeMarkerPopup(item) {
    return `
    <div class="item-popup">
      <h3>${item.properties.name}</h3>
      <b>분류</b>: ${item.properties.category} <br />
      <b>주소</b>: ${item.properties.address} <br />
      <b>전화</b>: <a href="tel:${item.properties.phone}">${item.properties.phone}</a> <br /> <br />
      <div>
        <a href="${item.properties.website}" target="_blank" class="btn btn-info btn-sm">
          더보기
        </a>
        <a href="daummaps://route?sp=${MY_POS['lat']},${MY_POS['lng']}&ep=${item.geometry.coordinates[1]},${item.geometry.coordinates[0]}&by=CAR" target="_blank" class="btn btn-warning btn-sm">
          길찾기
        </a>
        <a href="https://api2.sktelecom.com/tmap/app/routes?appKey=6293a693-53aa-4500-a330-7cc66a2e163c&name=${item.properties.name}&lon=${item.geometry.coordinates[0]}&lat=${item.geometry.coordinates[1]}" target="_blank" class="btn btn-danger btn-sm">
          길찾기
        </a>
      </div>
    </div>
    `
  }

  /**
   *
   * @param {object} item : 각 리스트에 필요한 항목
   * @return {string} 팝업 element
   */
  function makeListElement(item) {
    return `
    <div id="place_${item.properties.pid}" class="item card" style="width: 18rem">
      <div class="card-body">
        <h5 class="card-title">${item.properties.name}</h5>
        <p class="card-text">
          <b>분류</b>: ${item.properties.category} <br />
          <b>주소</b>: ${item.properties.address} <br />
          <b>전화</b>: <a href="tel:${item.properties.phone}">${item.properties.phone}</a> <br />
          <b>원문</b>: ${item.properties.source}
        </p>
        <a href="${item.properties.website}" target="_blank" class="btn btn-info btn-sm">
          상세정보
        </a>
        <a href="daummaps://route?sp=${MY_POS['lat']},${MY_POS['lng']}&ep=${item.geometry.coordinates[1]},${item.geometry.coordinates[0]}&by=CAR" target="_blank" class="btn btn-warning btn-sm">
        Kakao 길찾기
        </a>
        <a href="https://api2.sktelecom.com/tmap/app/routes?appKey=6293a693-53aa-4500-a330-7cc66a2e163c&name=${item.properties.name}&lon=${item.geometry.coordinates[0]}&lat=${item.geometry.coordinates[1]}" target="_blank" class="btn btn-danger btn-sm">
        Tmap 길찾기
        </a>
      </div>
    </div>
    `
  }

  function onMapMoveEnd() {
    var $dataSelect = $('#data')
    if ($dataSelect.val() != DEFAULT_SELECT_OPTION) {
      return
    }

    var nearDataUrl = `https://moim.at/places/within?l=${map.getBounds()._southWest.lat}&b=${map.getBounds()._southWest.lng}&r=${map.getBounds()._northEast.lat}&t=${map.getBounds()._northEast.lng}`
    $.getJSON(nearDataUrl, function (data) {
      drawMarkers(LAYER_TYPES.init, '내 주변', data)
    })
  }

  function onLocationFound(e) {
    var radius = e.accuracy / 2
    var myIcon = L.icon({
      iconUrl: 'icon.png',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [-3, -3]
    })
    MY_POS = e.latlng
    L.marker(e.latlng, {
      icon: myIcon
    }).addTo(map)
      .bindPopup("상단의 " + DEFAULT_SELECT_OPTION + "를 눌러주세요!").openPopup()
    L.circle(e.latlng, radius).addTo(map)
    map.setZoom(15.75)
  }

  function onLocationError(e) {
    alert(e.message)
  }
}

$(document).ready(main)
