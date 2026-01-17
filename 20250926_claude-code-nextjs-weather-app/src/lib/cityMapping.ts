// 日本の主要都市名の日英マッピング
const cityMapping: Record<string, string> = {
  '東京': 'Tokyo',
  '大阪': 'Osaka',
  '名古屋': 'Nagoya',
  '札幌': 'Sapporo',
  '福岡': 'Fukuoka',
  '京都': 'Kyoto',
  '横浜': 'Yokohama',
  '神戸': 'Kobe',
  '仙台': 'Sendai',
  '広島': 'Hiroshima',
  '千葉': 'Chiba',
  '埼玉': 'Saitama',
  '新潟': 'Niigata',
  '浜松': 'Hamamatsu',
  '静岡': 'Shizuoka',
  '岡山': 'Okayama',
  '熊本': 'Kumamoto',
  '鹿児島': 'Kagoshima',
  '那覇': 'Naha',
  '金沢': 'Kanazawa',
}

/**
 * 日本語の都市名を英語に変換する
 * マッピングにない場合はそのまま返す
 */
export function translateCityName(cityName: string): string {
  // 空白を削除
  const trimmedCity = cityName.trim()
  
  // マッピングに存在すれば英語名を返す
  if (cityMapping[trimmedCity]) {
    return cityMapping[trimmedCity]
  }
  
  // マッピングにない場合はそのまま返す（英語名の可能性がある）
  return trimmedCity
}