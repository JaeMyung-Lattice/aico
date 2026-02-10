// KAMIS(농산물유통정보) 품목코드 매핑 테이블
// 재료명 → { itemCode, kindCode, categoryCode }
export interface KamisItemInfo {
  itemCode: string;
  kindCode: string;
  categoryCode: string;
  unit: string; // 기준 단위
}

export const KAMIS_ITEM_MAP: Record<string, KamisItemInfo> = {
  // 엽근채류
  배추: { itemCode: '211', kindCode: '00', categoryCode: '200', unit: '1포기' },
  양배추: { itemCode: '212', kindCode: '00', categoryCode: '200', unit: '1포기' },
  시금치: { itemCode: '213', kindCode: '00', categoryCode: '200', unit: '1단' },
  상추: { itemCode: '214', kindCode: '00', categoryCode: '200', unit: '100g' },
  깻잎: { itemCode: '215', kindCode: '00', categoryCode: '200', unit: '100g' },

  // 양념채류
  양파: { itemCode: '226', kindCode: '00', categoryCode: '200', unit: '1kg' },
  대파: { itemCode: '246', kindCode: '00', categoryCode: '200', unit: '1단' },
  마늘: { itemCode: '231', kindCode: '00', categoryCode: '200', unit: '1kg' },
  생강: { itemCode: '232', kindCode: '00', categoryCode: '200', unit: '1kg' },
  고추: { itemCode: '244', kindCode: '00', categoryCode: '200', unit: '100g' },

  // 과채류
  감자: { itemCode: '152', kindCode: '01', categoryCode: '100', unit: '1kg' },
  고구마: { itemCode: '151', kindCode: '00', categoryCode: '100', unit: '1kg' },
  토마토: { itemCode: '225', kindCode: '00', categoryCode: '200', unit: '1kg' },
  오이: { itemCode: '224', kindCode: '00', categoryCode: '200', unit: '10개' },
  호박: { itemCode: '223', kindCode: '00', categoryCode: '200', unit: '1개' },
  애호박: { itemCode: '223', kindCode: '01', categoryCode: '200', unit: '1개' },
  당근: { itemCode: '232', kindCode: '00', categoryCode: '200', unit: '1kg' },
  무: { itemCode: '211', kindCode: '01', categoryCode: '200', unit: '1개' },

  // 과일류
  사과: { itemCode: '411', kindCode: '00', categoryCode: '400', unit: '10개' },
  배: { itemCode: '412', kindCode: '00', categoryCode: '400', unit: '10개' },
  포도: { itemCode: '413', kindCode: '00', categoryCode: '400', unit: '1kg' },
  바나나: { itemCode: '418', kindCode: '00', categoryCode: '400', unit: '100g' },
  레몬: { itemCode: '419', kindCode: '03', categoryCode: '400', unit: '10개' },

  // 육류
  소고기: { itemCode: '312', kindCode: '00', categoryCode: '300', unit: '1kg' },
  돼지고기: { itemCode: '311', kindCode: '00', categoryCode: '300', unit: '1kg' },
  닭고기: { itemCode: '313', kindCode: '00', categoryCode: '300', unit: '1kg' },
  달걀: { itemCode: '315', kindCode: '00', categoryCode: '300', unit: '30개' },
  계란: { itemCode: '315', kindCode: '00', categoryCode: '300', unit: '30개' },

  // 수산물
  고등어: { itemCode: '611', kindCode: '00', categoryCode: '600', unit: '1마리' },
  오징어: { itemCode: '614', kindCode: '00', categoryCode: '600', unit: '1마리' },
  새우: { itemCode: '615', kindCode: '00', categoryCode: '600', unit: '1kg' },
  멸치: { itemCode: '619', kindCode: '00', categoryCode: '600', unit: '1kg' },

  // 가공식품 / 기본 양념 (고정 가격)
  두부: { itemCode: '222', kindCode: '00', categoryCode: '200', unit: '1모' },
  콩나물: { itemCode: '221', kindCode: '00', categoryCode: '200', unit: '1봉' },
  버섯: { itemCode: '252', kindCode: '00', categoryCode: '200', unit: '100g' },
  팽이버섯: { itemCode: '252', kindCode: '01', categoryCode: '200', unit: '1봉' },
  새송이버섯: { itemCode: '252', kindCode: '02', categoryCode: '200', unit: '1봉' },
};

// 재료명으로 KAMIS 품목 검색 (부분 매칭 지원)
export const findKamisItem = (ingredientName: string): KamisItemInfo | null => {
  // 정확히 일치하는 것 우선
  if (KAMIS_ITEM_MAP[ingredientName]) {
    return KAMIS_ITEM_MAP[ingredientName];
  }

  // 부분 매칭 (예: "대파 1대" → "대파")
  for (const [key, value] of Object.entries(KAMIS_ITEM_MAP)) {
    if (ingredientName.includes(key) || key.includes(ingredientName)) {
      return value;
    }
  }

  return null;
};
