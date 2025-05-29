import { useState } from 'react';
import './App.css';
import { TopPage } from './TopPage';
import { BinaryHeap } from './BinaryHeap';

function App() {
    const [isClicked, setIsClicked] = useState(false);
    return (
        <>
            {
                isClicked ? <BinaryHeap isClicked={isClicked} setIsClicked={setIsClicked} /> :

                    <TopPage isClicked={isClicked} setIsClicked={setIsClicked} />
            }
            <footer>
                <small>Copyright © 2019-2025 nuts3745 All rights reserved.</small>
            </footer>
        </>
    )
}

export default App
