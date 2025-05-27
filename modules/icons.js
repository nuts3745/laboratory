/**
 * アイコン関連の機能モジュール
 */

/**
 * Lucideアイコンの初期化
 */
export function initializeLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}
