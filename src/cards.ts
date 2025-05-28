/**
 * カード関連の機能モジュール
 */

export function setupCardHoverEffects() {
    for (const card of document.querySelectorAll('.card')) {
        const cardElement = card as HTMLElement;
        cardElement.addEventListener('mouseenter', () => {
            cardElement.style.transform = 'translateY(-4px) scale(1.02)';
        });

        cardElement.addEventListener('mouseleave', () => {
            cardElement.style.transform = 'translateY(0) scale(1)';
        });

        // 3D tilt effect on mouse move
        cardElement.addEventListener('mousemove', (e) => {
            const rect = cardElement.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = (e.clientX - centerX) / (rect.width / 2);
            const deltaY = (e.clientY - centerY) / (rect.height / 2);

            cardElement.style.transform = `translateY(-4px) scale(1.02) rotateX(${deltaY * 5}deg) rotateY(${deltaX * 5}deg)`;
        });
    }
}


export function setupLoadAnimations() {
    let index = 0;
    for (const card of document.querySelectorAll('.card')) {
        const cardElement = card as HTMLElement;
        cardElement.style.opacity = '0';
        cardElement.style.transform = 'translateY(30px)';

        setTimeout(() => {
            cardElement.style.transition = 'all 0.6s ease';
            cardElement.style.opacity = '1';
            cardElement.style.transform = 'translateY(0)';
        }, index * 100);
        index++;
    }
}

