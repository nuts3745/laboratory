import type { ToastMessage } from '../../types/heap.js';

interface ToastProps {
    toast: ToastMessage;
    onClose: (id: string) => void;
}

/**
 * Individual toast notification component
 */
export function Toast({ toast, onClose }: ToastProps) {
    const getToastIcon = () => {
        switch (toast.type) {
            case 'success': return '✅';
            case 'warning': return '⚠️';
            case 'error': return '❌';
            default: return 'ℹ️';
        }
    };

    return (
        <div className={`toast toast-${toast.type} show`}>
            <div className="toast-content">
                <span className="toast-icon">{getToastIcon()}</span>
                <span className="toast-message">{toast.message}</span>
            </div>
            {!toast.persistent && (
                <button
                    type="button"
                    className="toast-close"
                    onClick={() => onClose(toast.id)}
                    aria-label="通知を閉じる"
                >
                    ×
                </button>
            )}
            {!toast.persistent && (
                <div
                    className="toast-progress"
                    style={{
                        animationDuration: `${toast.duration}ms`,
                        animationName: 'progressBar'
                    }}
                />
            )}
        </div>
    );
}

interface ToastContainerProps {
    toasts: ToastMessage[];
    onToastClose: (id: string) => void;
}

/**
 * Toast container component
 * Toast通知の表示管理を担当
 */
export function ToastContainer({ toasts, onToastClose }: ToastContainerProps) {
    if (toasts.length === 0) return null;

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    toast={toast}
                    onClose={onToastClose}
                />
            ))}
        </div>
    );
}
