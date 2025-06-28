/**
 * マウス軌跡エフェクトモジュール
 */

/**
 * マウス軌跡エフェクトの設定
 */
export function setupMouseTrailEffect() {
	document.addEventListener("mousemove", (e) => {
		const interactiveEl = document.createElement("div");
		interactiveEl.className = "interactive-element";

		// スクロール位置を考慮した正確な位置計算
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		const scrollLeft =
			window.pageXOffset || document.documentElement.scrollLeft;

		interactiveEl.style.left = e.clientX + scrollLeft + "px";
		interactiveEl.style.top = e.clientY + scrollTop + "px";
		interactiveEl.style.position = "absolute";
		interactiveEl.style.zIndex = "9999";
		interactiveEl.style.pointerEvents = "none";

		document.body.appendChild(interactiveEl);

		setTimeout(() => {
			interactiveEl.style.width = "20px";
			interactiveEl.style.height = "20px";
			interactiveEl.style.marginLeft = "-10px";
			interactiveEl.style.marginTop = "-10px";
			interactiveEl.style.opacity = "0";
			interactiveEl.style.transform = "scale(1.5)";
			interactiveEl.style.boxShadow = `
                6px 6px 12px var(--shadow-dark),
                -6px -6px 12px var(--shadow-light),
                inset 2px 2px 4px var(--shadow-inset-light),
                inset -2px -2px 4px var(--shadow-inset-dark)
            `;
		}, 50);

		setTimeout(() => {
			if (document.body.contains(interactiveEl)) {
				document.body.removeChild(interactiveEl);
			}
		}, 550);
	});
}
