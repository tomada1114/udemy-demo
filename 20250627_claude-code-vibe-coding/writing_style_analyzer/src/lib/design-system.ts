/**
 * Apple風デザインシステム - 8色テーマカラーシステム
 * 統一感のあるグラデーションとアクセントカラーで構成
 */

export const THEME_COLORS = [
  {
    name: 'サンシャイン',
    class: 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300/30',
    value: 'sunshine',
    accent: '#FCD34D'
  },
  {
    name: 'ブロッサム',
    class: 'bg-gradient-to-br from-pink-100 to-rose-200 border-pink-300/30',
    value: 'blossom',
    accent: '#FB7185'
  },
  {
    name: 'オーシャン',
    class: 'bg-gradient-to-br from-sky-100 to-blue-200 border-blue-300/30',
    value: 'ocean',
    accent: '#60A5FA'
  },
  {
    name: 'フォレスト',
    class: 'bg-gradient-to-br from-emerald-100 to-green-200 border-green-300/30',
    value: 'forest',
    accent: '#34D399'
  },
  {
    name: 'ラベンダー',
    class: 'bg-gradient-to-br from-purple-100 to-violet-200 border-purple-300/30',
    value: 'lavender',
    accent: '#A78BFA'
  },
  {
    name: 'サンセット',
    class: 'bg-gradient-to-br from-orange-100 to-amber-200 border-orange-300/30',
    value: 'sunset',
    accent: '#F59E0B'
  },
  {
    name: 'ミスト',
    class: 'bg-gradient-to-br from-gray-50 to-slate-100 border-gray-300/30',
    value: 'mist',
    accent: '#64748B'
  },
  {
    name: 'ミント',
    class: 'bg-gradient-to-br from-teal-100 to-cyan-200 border-teal-300/30',
    value: 'mint',
    accent: '#14B8A6'
  },
] as const

export type ThemeColor = typeof THEME_COLORS[number]['value']

/**
 * テーマカラーオブジェクト（キーでアクセス可能）
 */
export const THEME_COLORS_MAP = {
  sunshine: {
    primary: 'text-yellow-600',
    glassmorphism: 'bg-gradient-to-br from-yellow-100/70 to-yellow-200/70'
  },
  blossom: {
    primary: 'text-pink-600',
    glassmorphism: 'bg-gradient-to-br from-pink-100/70 to-rose-200/70'
  },
  ocean: {
    primary: 'text-blue-600',
    glassmorphism: 'bg-gradient-to-br from-sky-100/70 to-blue-200/70'
  },
  forest: {
    primary: 'text-green-600',
    glassmorphism: 'bg-gradient-to-br from-emerald-100/70 to-green-200/70'
  },
  lavender: {
    primary: 'text-purple-600',
    glassmorphism: 'bg-gradient-to-br from-purple-100/70 to-violet-200/70'
  },
  sunset: {
    primary: 'text-orange-600',
    glassmorphism: 'bg-gradient-to-br from-orange-100/70 to-amber-200/70'
  },
  mist: {
    primary: 'text-gray-600',
    glassmorphism: 'bg-gradient-to-br from-gray-50/70 to-slate-100/70'
  },
  mint: {
    primary: 'text-teal-600',
    glassmorphism: 'bg-gradient-to-br from-teal-100/70 to-emerald-200/70'
  }
} as const

/**
 * テーマカラーから対応するクラス名を取得
 */
export const getColorClass = (color: ThemeColor): string => {
  const theme = THEME_COLORS.find(t => t.value === color)
  return theme?.class ?? THEME_COLORS[0]?.class ?? ''
}

/**
 * テーマカラーから対応するアクセントカラーを取得
 */
export const getAccentColor = (color: ThemeColor): string => {
  const theme = THEME_COLORS.find(t => t.value === color)
  return theme?.accent ?? THEME_COLORS[0]?.accent ?? '#60A5FA'
}

/**
 * Apple風背景グラデーション定義
 * 3層構造: ベース + 装飾レイヤー1 + 装飾レイヤー2,3
 */
export const BACKGROUND_LAYERS = {
  // ベースグラデーション
  base: 'min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50',
  
  // 装飾レイヤー1: 全体的な色彩調整
  decoration1: 'absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5',
  
  // 装飾レイヤー2: 大きなblur円（右上）
  decoration2: 'absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl',
  
  // 装飾レイヤー3: 小さなblur円（左下）
  decoration3: 'absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-orange-400/10 rounded-full blur-3xl'
} as const

/**
 * Glassmorphismスタイル定義
 */
export const GLASSMORPHISM_STYLES = {
  // ヘッダー用
  header: 'bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm',
  
  // カード用
  card: 'bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30',
  
  // ボタン用
  button: 'bg-white/40 hover:bg-white/60 backdrop-blur-sm border border-white/30 hover:border-white/50',
  
  // パネル用
  panel: 'bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30'
} as const

/**
 * アニメーション設定
 */
export const ANIMATIONS = {
  // 基本トランジション
  base: 'transition-all duration-200 ease-out',
  
  // アイコン回転用
  icon: 'transition-transform duration-300',
  
  // 色変化用
  color: 'transition-colors',
  
  // ホバー時スケール
  scale: 'hover:scale-105',
  
  // マイクロインタラクション
  micro: 'hover:scale-110'
} as const

/**
 * レスポンシブブレークポイント
 */
export const BREAKPOINTS = {
  mobile: 'px-4',
  tablet: 'md:px-6',
  desktop: 'lg:px-8',
  wide: 'xl:px-12'
} as const

/**
 * グリッドシステム
 */
export const GRID_SYSTEMS = {
  // 1列→3列レスポンシブ
  responsive: 'grid grid-cols-1 md:grid-cols-3',
  
  // 2列固定
  dual: 'grid grid-cols-1 sm:grid-cols-2',
  
  // 4列グリッド（セレクター用）
  selector: 'grid grid-cols-4'
} as const

/**
 * 影システム
 */
export const SHADOW_SYSTEM = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  xxl: 'shadow-2xl'
} as const

/**
 * タイポグラフィ
 */
export const TYPOGRAPHY = {
  // グラデーションタイトル
  gradientTitle: 'bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent',
  
  // サブタイトル
  subtitle: 'text-gray-600',
  
  // メインテキスト
  body: 'text-gray-700',
  
  // 注意テキスト
  muted: 'text-gray-500'
} as const