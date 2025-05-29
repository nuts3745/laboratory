import { Network } from 'lucide-react';
import type React from 'react';


export const TopPage: React.FC<{ isClicked: boolean, setIsClicked: (arg0: boolean) => void }> = (props): React.ReactElement => {

    return <div className="container">
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
            <div className="card" onClick={() => props.setIsClicked(!props.isClicked)} onKeyDown={(e) => e.key === 'Enter' && props.setIsClicked(!props.isClicked)}>
                <div className="card-icon">
                    <Network />
                </div>
                <h2>Binary Heap</h2>
            </div>
        </div>
    </div>
};
