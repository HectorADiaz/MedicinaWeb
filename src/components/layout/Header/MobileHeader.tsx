// src/components/layout/MobileHeader.tsx

import '../layout/layout/Layout.css'; 

const MobileHeader = () => {
  return (
    <header className="mobile-header">
      <h2>MedicinaWeb 💊</h2>
      <button className="hamburger-button">
        ☰
      </button>
    </header>
  );
};

export default MobileHeader;