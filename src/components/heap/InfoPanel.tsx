import type { HeapState } from '../../types/heap.js';
import { BinaryHeapUtils } from '../../utils/heapUtils.js';

interface InfoPanelProps {
  heapState: HeapState;
}

/**
 * Information panel component
 * 情報表示の責任のみを持つコンポーネント
 */
export function InfoPanel({ heapState }: InfoPanelProps) {
  
  const getNodeInfo = () => {
    if (heapState.activeIndex === null) {
      return {
        title: '💡 バイナリヒープについて',
        content: `
バイナリヒープは完全二分木の構造を持つデータ構造です。

🔹 ${heapState.type === 'max' ? '最大ヒープ' : '最小ヒープ'}では、親ノードは子ノードより${heapState.type === 'max' ? '大きい' : '小さい'}値を持ちます
🔹 ノードをクリックすると詳細情報が表示されます
🔹 配列表現では親子関係が理解しやすくなります

ヒープの性質:
• 挿入: O(log n)
• 削除: O(log n)
• 最${heapState.type === 'max' ? '大' : '小'}値取得: O(1)
        `.trim()
      };
    }

    const index = heapState.activeIndex;
    const value = heapState.data[index];
    const parentIndex = BinaryHeapUtils.getParentIndex(index);
    const leftChild = BinaryHeapUtils.getLeftChildIndex(index);
    const rightChild = BinaryHeapUtils.getRightChildIndex(index);

    let content = `📍 インデックス: ${index}\n🔢 値: ${value}\n\n`;

    // Parent information
    if (parentIndex !== null) {
      content += `👆 親ノード: インデックス ${parentIndex}, 値 ${heapState.data[parentIndex]}\n`;
    } else {
      content += '👆 親ノード: なし（ルートノード）\n';
    }

    // Children information
    const children = [];
    if (leftChild < heapState.data.length) {
      children.push(`左の子: インデックス ${leftChild}, 値 ${heapState.data[leftChild]}`);
    }
    if (rightChild < heapState.data.length) {
      children.push(`右の子: インデックス ${rightChild}, 値 ${heapState.data[rightChild]}`);
    }

    if (children.length > 0) {
      content += `👇 子ノード:\n${children.map(child => `   • ${child}`).join('\n')}\n`;
    } else {
      content += '👇 子ノード: なし（葉ノード）\n';
    }

    // Array access formula
    content += '\n📐 配列アクセス公式:\n';
    content += `   • 親: (${index} - 1) ÷ 2 = ${parentIndex}\n`;
    content += `   • 左の子: 2 × ${index} + 1 = ${leftChild}\n`;
    content += `   • 右の子: 2 × ${index} + 2 = ${rightChild}`;

    return {
      title: `🎯 ノード詳細 (インデックス: ${index})`,
      content
    };
  };

  const { title, content } = getNodeInfo();

  return (
    <div className="info-panel">
      <h3 className="info-title">{title}</h3>
      <pre className="info-content">{content}</pre>
      
      {heapState.data.length > 0 && (
        <div className="heap-stats">
          <h4>ヒープ統計</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">要素数:</span>
              <span className="stat-value">{heapState.data.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">高さ:</span>
              <span className="stat-value">{Math.floor(Math.log2(heapState.data.length)) + 1}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">ルート値:</span>
              <span className="stat-value">{heapState.data[0] || 'N/A'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">有効性:</span>
              <span className={`stat-value ${BinaryHeapUtils.isValidHeap(heapState.data, heapState.type) ? 'valid' : 'invalid'}`}>
                {BinaryHeapUtils.isValidHeap(heapState.data, heapState.type) ? '✅ 有効' : '❌ 無効'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
