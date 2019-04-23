var main = function () {
  $(document).ready(function () {
    $('#bottom-sheet #opener').click(function () {
      $('#bottom-sheet').toggleClass('active')
    })
    var INITIAL_MAP_OPTION = {
      center: [37.5662952, 126.9429262], // 서울 시청
      zoom: 14
    };
    var CURR_POS;

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

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiOWJvdyIsImEiOiJjanV0NW53N2EwNGs2NDR0MHV1emJ1dm53In0.4Hg4JcruGTJaJ6QTFEovvg', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox.streets'
    }).addTo(map);


    var dataSelect = $('#data');
    var options = (dataSelect.prop) ? dataSelect.prop('options') : dataSelect.attr('options');
    // $('option', dataSelect).remove();

    $.each(data, function (val, text) {
      options[options.length] = new Option(text, text);
    });

    /**
     * Selector가 변경되었을 때 (음식 종류가 바뀌었을 때) 발생
     */
    dataSelect.on('change', function () {
      $.getJSON(data_url + dataSelect.val() + ".geojson", function (data) {
        L.geoJson(data, {
          onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.name);
          }
        }).addTo(map);

        if (dataSelect.val()) {
          $('#bottom-sheet').addClass('appear')
        }

        $("#opener").text(`${dataSelect.val()} 목록 보기 (${data.features.length}곳)`)

        const elements = data.features.map(function (item) {
          return `
          <div class="item card" style="width: 18rem;">
            <div class="card-body">
              <h5 class="card-title">${item.properties.name}</h5>
              <p class="card-text">
                <b>주소</b>: ${item.properties.address} <br />
                <b>원문</b>: ${item.properties.source}
              </p>
              <a href="${item.properties.website}" target="_blank" class="btn btn-info btn-sm">
                상세정보
              </a>
              <a href="daummaps://route?sp=${CURR_POS['lat']},${CURR_POS['lng']}&ep=${item.geometry.coordinates[1]},${item.geometry.coordinates[0]}&by=CAR" target="_blank" class="btn btn-warning btn-sm">
                Kakao 길찾기
              </a>
              <a href="tmap://?rGoName=${item.properties.name}&rGoX=${item.geometry.coordinates[0]}&rGoY=${item.geometry.coordinates[1]}" target="_blank" class="btn btn-danger btn-sm">
                Tmap 길찾기
              </a>
            </div>
          </div>
          `
        })
        $('#listing').html(elements)
      });
    })



    function onLocationFound(e) {
      var radius = e.accuracy / 2;
      var myIcon = L.icon({
        iconUrl: 'icon.png',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [-3, -3]
      });
      CURR_POS = e.latlng;
      console.log(CURR_POS);

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
