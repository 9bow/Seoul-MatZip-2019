var main = function () {
  $(document).ready(function () {
    $('#bottom-sheet #opener').click(function () {
      $('#bottom-sheet').toggleClass('active')
    })
    var INITIAL_MAP_OPTION = {
      center: [37.5662952, 126.9429262], // 서울 시청
      zoom: 14
    };
    var CURR_POS = { lat: INITIAL_MAP_OPTION['center'][0], lng: INITIAL_MAP_OPTION['center'][1] };
    var currentLayer;
    var map = L.map('map', INITIAL_MAP_OPTION);
    var data_url = "https://raw.githubusercontent.com/9bow/Seoul-MatZip-2019/master/geo/";
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
    ]

    // MapBox 지도
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox.streets'
    }).addTo(map);

    var dataSelect = $('#data');
    var options = (dataSelect.prop) ? dataSelect.prop('options') : dataSelect.attr('options');

    $.each(data, function (val, text) {
      options[options.length] = new Option(text, text);
    });

    /**
    * Selector가 변경되었을 때 (음식 종류가 바뀌었을 때) 발생
    */
    dataSelect.on('change', function () {
      $.getJSON(data_url + dataSelect.val() + ".geojson", function (data) {
        // 현재 레이어가 있다면 데이터를 받은 후 정리합니다.
        if (currentLayer) {
          map.removeLayer(currentLayer)
        }
        currentLayer = L.geoJson(data, {
          onEachFeature: function (feature, layer) {
            const popupContent = `
          <div class="item-popup">
          <h3>${feature.properties.name}</h3>
          <b>주소</b>: ${feature.properties.address} <br />
          <b>전화</b>: <a href="tel:${feature.properties.phone}">${feature.properties.phone}</a> <br /> <br />
          <div>
          <a href="${feature.properties.website}" target="_blank" class="btn btn-info btn-sm">
          상세정보
          </a>
          <a href="daummaps://route?sp=${CURR_POS['lat']},${CURR_POS['lng']}&ep=${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}&by=CAR" target="_blank" class="btn btn-warning btn-sm">
          Kakao 길찾기
          </a>
          <a href="https://api2.sktelecom.com/tmap/app/routes?appKey=6293a693-53aa-4500-a330-7cc66a2e163c&name=${feature.properties.name}&lon=${feature.geometry.coordinates[0]}&lat=${feature.geometry.coordinates[1]}" target="_blank" class="btn btn-danger btn-sm">
          Tmap 길찾기
          </a>
          </div>
          </div>

          `
            // layer.bindPopup(feature.properties.name);
            layer.bindPopup(popupContent);
          }
        }).addTo(map);

        map.fitBounds(currentLayer.getBounds());

        if (dataSelect.val()) {
          $('#bottom-sheet').addClass('appear')
        }

        $("#opener").text(`${dataSelect.val()} 목록 보기 (${data.features.length}곳)`)

        const elements = data.features.map(function (item) {
          return `
        <div id="place_${item.properties.pid}" class="item card" style="width: 18rem;">
        <div class="card-body">
        <h5 class="card-title">${item.properties.name}</h5>
        <p class="card-text">
        <b>주소</b>: ${item.properties.address} <br />
        <b>전화</b>: <a href="tel:${item.properties.phone}">${item.properties.phone}</a> <br />
        <b>원문</b>: ${item.properties.source}
        </p>
        <a href="${item.properties.website}" target="_blank" class="btn btn-info btn-sm">
        상세정보
        </a>
        <a href="daummaps://route?sp=${CURR_POS['lat']},${CURR_POS['lng']}&ep=${item.geometry.coordinates[1]},${item.geometry.coordinates[0]}&by=CAR" target="_blank" class="btn btn-warning btn-sm">
        Kakao 길찾기
        </a>
        <a href="https://api2.sktelecom.com/tmap/app/routes?appKey=6293a693-53aa-4500-a330-7cc66a2e163c&name=${item.properties.name}&lon=${item.geometry.coordinates[0]}&lat=${item.geometry.coordinates[1]}" target="_blank" class="btn btn-danger btn-sm">
        Tmap 길찾기
        </a>
        </div>
        </div>
        `
        })
        $('#listing').html(elements)
      });
    })

    // 지도 이동 완료 시
    map.on('moveend', function () {
      if (dataSelect.val() == '카테고리 선택') {
        var nearDataUrl = `https://moim.at/places/within?l=${map.getBounds()._southWest.lat}&b=${map.getBounds()._southWest.lng}&r=${map.getBounds()._northEast.lat}&t=${map.getBounds()._northEast.lng}`
        $.getJSON(nearDataUrl, function (data) {
          if (data.features.length > 200) {
            alert("주변에 맛집이 너무 많습니다.\n범위를 좁히거나 카테고리를 선택해주세요.");
            return;
          }

          // 현재 레이어가 있다면 데이터를 받은 후 정리합니다.
          if (currentLayer) {
            map.removeLayer(currentLayer)
          }

          currentLayer = L.geoJson(data, {
            onEachFeature: function (feature, layer) {
              const popupContent = `
            <div class="item-popup">
            <h3>${feature.properties.name}</h3>
            <b>주소</b>: ${feature.properties.address} <br />
            <b>전화</b>: <a href="tel:${feature.properties.phone}">${feature.properties.phone}</a> <br /> <br />
            <div>
            <a href="${feature.properties.website}" target="_blank" class="btn btn-info btn-sm">
            상세정보
            </a>
            <a href="daummaps://route?sp=${CURR_POS['lat']},${CURR_POS['lng']}&ep=${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}&by=CAR" target="_blank" class="btn btn-warning btn-sm">
            Kakao 길찾기
            </a>
            <a href="https://api2.sktelecom.com/tmap/app/routes?appKey=6293a693-53aa-4500-a330-7cc66a2e163c&name=${feature.properties.name}&lon=${feature.geometry.coordinates[0]}&lat=${feature.geometry.coordinates[1]}" target="_blank" class="btn btn-danger btn-sm">
            Tmap 길찾기
            </a>
            </div>
            </div>

            `
              // layer.bindPopup(feature.properties.name);
              layer.bindPopup(popupContent);
            }
          }).addTo(map);

          if (dataSelect.val()) {
            $('#bottom-sheet').addClass('appear')
          }

          $("#opener").text(`주변 맛집 목록 보기 (${data.features.length}곳)`)

          const elements = data.features.map(function (item) {
            return `
          <div id="place_${item.properties.pid}" class="item card" style="width: 18rem;">
          <div class="card-body">
          <h5 class="card-title">${item.properties.name}</h5>
          <p class="card-text">
          <b>주소</b>: ${item.properties.address} <br />
          <b>전화</b>: <a href="tel:${item.properties.phone}">${item.properties.phone}</a> <br />
          <b>원문</b>: ${item.properties.source}
          </p>
          <a href="${item.properties.website}" target="_blank" class="btn btn-info btn-sm">
          상세정보
          </a>
          <a href="daummaps://route?sp=${CURR_POS['lat']},${CURR_POS['lng']}&ep=${item.geometry.coordinates[1]},${item.geometry.coordinates[0]}&by=CAR" target="_blank" class="btn btn-warning btn-sm">
          Kakao 길찾기
          </a>
          <a href="https://api2.sktelecom.com/tmap/app/routes?appKey=6293a693-53aa-4500-a330-7cc66a2e163c&name=${item.properties.name}&lon=${item.geometry.coordinates[0]}&lat=${item.geometry.coordinates[1]}" target="_blank" class="btn btn-danger btn-sm">
          Tmap 길찾기
          </a>
          </div>
          </div>
          `
          })
          $('#listing').html(elements)
        });
      }
    });


    function onLocationFound(e) {
      var radius = e.accuracy / 2;
      var myIcon = L.icon({
        iconUrl: 'icon.png',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [-3, -3]
      });
      CURR_POS = e.latlng;

      L.marker(e.latlng, {
        icon: myIcon
      }).addTo(map)
        .bindPopup("상단의 카테고리 선택을 눌러주세요!").openPopup();
      L.circle(e.latlng, radius).addTo(map);
    }

    function onLocationError(e) {
      alert(e.message);
    }

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    map.locate({ setView: true, maxZoom: 16 });
  })
}

main()
