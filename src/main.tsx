// /**
//  * アプリケーションのメインエントリーポイント
//  */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { setupCardHoverEffects, setupLoadAnimations } from "./cards.js";
import { setupMouseTrailEffect } from "./effects.js";
import "./index.css";
import App from "./App.tsx";

function initializeApp() {
	// カードのホバー効果設定
	setupCardHoverEffects();
}

// DOMContentLoadedイベントでアプリケーションを初期化
document.addEventListener("DOMContentLoaded", initializeApp);

// マウス軌跡エフェクトは即座に開始
setupMouseTrailEffect();

// ページロード時のアニメーション
window.addEventListener("load", setupLoadAnimations);
const rootElement = document.getElementById("root");
if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
}
