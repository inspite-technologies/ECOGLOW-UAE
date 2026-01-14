import React from 'react';
import '../components/Preloader.css'; // Reuse preloader styles
import './ComingSoon.css';

const ComingSoon = () => {
    return (
        <div className="coming-soon-page">
            <div className="preloader-content">
                {/* Premium Brand Name */}
                <div className="brand-name">
                    <span className="brand-eco">Eco</span>
                    <span className="brand-glow">Glow</span>
                </div>

                <h1 className="coming-soon-text">Coming Soon</h1>
            </div>
        </div>
    );
};

export default ComingSoon;
