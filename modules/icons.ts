/**
 * アイコン関連の機能モジュール
 */

/**
 * Lucideアイコンの初期化
 */
import { createIcons, Network, TestTubeDiagonal } from 'lucide';

export function initializeLucideIcons() {
    // Lucideアイコンのセットアップ
    createIcons({
        icons: {
            Network,
            TestTubeDiagonal
        }
    });
}