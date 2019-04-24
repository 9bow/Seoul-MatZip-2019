# 시사플러스 2019 서울맛집 지도화

### 현재 위치에서 가까운 맛집을 [mz.moim.at](https://mz.moim.at)에서 확인하실 수 있습니다. (위치 권한 필요)

## 개요

* [시사플러스 '2019 서울맛집' 기사](http://m.sisaplusnews.com/news/articleView.html?idxno=22423)의 맛집들을 지도 위에 표시하는 프로젝트입니다.
* 정확한 위치를 표시하기보다는 카테고리별 맛집의 분포 등을 재미삼아 보는 것을 목표로 하였습니다.
* 이 프로젝트는 [Chang-Joo Park](https://github.com/ChangJoo-Park)님께서 먼저 제안하시고 GeoJSON 사용법 등을 보여주시는 것으로 시작하였습니다.
* 잘못된 정보나 기능 추가는 [Issue](https://github.com/9bow/Seoul-MatZip-2019/issues) 또는 [Pull Request](https://github.com/9bow/Seoul-MatZip-2019/pulls) 부탁드립니다.

## 정제

* 기초 데이터는 [시사플러스 '2019 서울맛집'](http://m.sisaplusnews.com/news/articleView.html?idxno=22423)에서 가져왔습니다.
* 전체 데이터 중 `1. 평양냉면`부터 `45. 돼지고기`까지 가져왔으며, 이후 데이터는 수작업이 많을 것 같아 따로 정제하지 않았습니다.
* 기초 데이터는 `동 이름` (` - ` `역 이름`) ` - ` `음식점 이름` (` - ` `기타`) 형태로 정리하였으며, 가게명만 있는 경우 모두 제외하였습니다.
  * (`45. 돼지고기`의 경우 소제목을 `기타`에 포함시켰습니다.)
* 눈으로 보다가 확인한 오류들은 일부 수정하였습니다.
  * 예. `서초동 - 교대역 - 만경생태양재동 - 양재역 - 원산생태`, `여의도도 ㅇ- 여의도력 - 햇살도시락` 등

## 검색

* 식당 검색에는 [Kakao 지도/로컬 API](https://developers.kakao.com/features/platform#%EC%A7%80%EB%8F%84-%EB%A1%9C%EC%BB%AC)를 사용하였습니다.
  * [키워드로 장소 검색 API](https://developers.kakao.com/docs/restapi/local#%ED%82%A4%EC%9B%8C%EB%93%9C-%EA%B2%80%EC%83%89)를 사용하였고, 검색 시 음식점 카테고리(FD6)로 검색하였습니다.
  * `동 이름`과 `음식점 이름`으로 검색하였으며 `음식점 이름`에 괄호가 있는 경우 괄호 및 괄호 안의 내용은 무시합니다.
  * 검색 결과의 첫번째 값을 사용하였으며 없는 경우에는 무시합니다.
* [GeoJSON](https://tools.ietf.org/html/rfc7946) 형태로 정리하였습니다.

## 코드

* 데이터 검색을 위한 전체 코드는 [Seoul-MatZip-2019.ipynb](https://nbviewer.jupyter.org/github/9bow/Seoul-MatZip-2019/blob/master/Seoul-MatZip-2019.ipynb)에서 보실 수 있습니다.
  * Python 코드이며, 실행을 하기 위해서는 Jupyter Notebook과 Kakao API Key가 필요합니다.
* [mz.moim.at](https://mz.moim.at)의 소스코드는 [docs/](https://github.com/9bow/Seoul-MatZip-2019/tree/master/docs)에서 보실 수 있습니다.

## 결과 (GeoJSON 형태)

* [전체보기](geo/전체보기.geojson)
* [평양냉면](geo/평양냉면.geojson)
* [메밀국수(소바)](geo/메밀국수(소바).geojson)
* [막국수](geo/막국수.geojson)
* [콩국수](geo/콩국수.geojson)
* [국밥,해장국](geo/국밥,해장국.geojson)
* [설렁탕](geo/설렁탕.geojson)
* [감자탕](geo/감자탕.geojson)
* [순대](geo/순대.geojson)
* [닭볶음탕](geo/닭볶음탕.geojson)
* [추어탕](geo/추어탕.geojson)
* [육개장](geo/육개장.geojson)
* [대구탕](geo/대구탕.geojson)
* [김밥](geo/김밥.geojson)
* [김치찌개](geo/김치찌개.geojson)
* [부대찌개](geo/부대찌개.geojson)
* [청국장](geo/청국장.geojson)
* [된장](geo/된장.geojson)
* [간장게장](geo/간장게장.geojson)
* [삼계탕](geo/삼계탕.geojson)
* [보쌈](geo/보쌈.geojson)
* [족발](geo/족발.geojson)
* [치킨](geo/치킨.geojson)
* [돈까스](geo/돈까스.geojson)
* [함박스테이크](geo/함박스테이크.geojson)
* [떡볶이](geo/떡볶이.geojson)
* [라면](geo/라면.geojson)
* [라멘](geo/라멘.geojson)
* [우동](geo/우동.geojson)
* [튀김](geo/튀김.geojson)
* [순두부,두부](geo/순두부,두부.geojson)
* [피자](geo/피자.geojson)
* [아이스크림,젤라또](geo/아이스크림,젤라또.geojson)
* [갓포요리집](geo/갓포요리집.geojson)
* [죽](geo/죽.geojson)
* [덮밥,백반,벤또(도시락)](geo/덮밥,백반,벤또(도시락).geojson)
* [꼬치구이,로바다야끼](geo/꼬치구이,로바다야끼.geojson)
* [냉동삼겹살](geo/냉동삼겹살.geojson)
* [기사식당](geo/기사식당.geojson)
* [스테이크,BBQ](geo/스테이크,BBQ.geojson)
* [칼국수](geo/칼국수.geojson)
* [수제맥주,맥주맛있는곳](geo/수제맥주,맥주맛있는곳.geojson)
* [아구찜](geo/아구찜.geojson)
* [생선구이&조림](geo/생선구이&조림.geojson)
* [돼지갈비](geo/돼지갈비.geojson)
* [돼지고기](geo/돼지고기.geojson)

## 결과 (지도 형태)

* 현재 위치에서 가까운 맛집을 [mz.moim.at](https://mz.moim.at)에서 확인하실 수 있습니다. (위치 권한 필요)
