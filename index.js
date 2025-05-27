/**
 * アプリケーションのメインエントリーポイント
 */

import { initializeLucideIcons } from './modules/icons.js';
import { setupCardHoverEffects, setupLoadAnimations } from './modules/cards.js';
import { setupMouseTrailEffect } from './modules/effects.js';

/**
 * アプリケーションの初期化
 */
function initializeApp() {
    // Lucideアイコンの初期化
    initializeLucideIcons();
    
    // カードのホバー効果設定
    setupCardHoverEffects();
}

// DOMContentLoadedイベントでアプリケーションを初期化
document.addEventListener('DOMContentLoaded', initializeApp);

// マウス軌跡エフェクトは即座に開始
setupMouseTrailEffect();

// ページロード時のアニメーション
window.addEventListener('load', setupLoadAnimations);