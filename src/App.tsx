import { Network } from 'lucide-react';
import './App.css';

function App() {
    return (
        <>
            <div className="container">
                <header>
                    <div className="status-indicator">
                        <div className="status-dot" />
                        <span>EXPERIMENTAL</span>
                    </div>
                    <a href="https://nuts3745.dev" className="back-link" rel="noopener noreferrer">←</a>
                    <div className="logo">
                        <div className="logo-text">
                            lab.nuts3745.dev
                        </div>
                    </div>
                </header>

                <div className="grid">
                    <a href="/binary_heap/" className="card" rel="noopener noreferrer">
                        <div className="card-icon">
                            <Network />
                        </div>
                        <h2>Binary Heap</h2>
                    </a>
                </div>
            </div>

            <footer>
                <small>Copyright © 2019-2025 nuts3745 All rights reserved.</small>
            </footer>
        </>
    )
}

export default App
