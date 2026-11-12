import { useState } from 'react';
import './CustomizerAtelier.css';

function getKitVisualTheme(team = '') {
  const lower = team.toLowerCase();
  if (lower.includes('barcelona')) {
    return {
      mode: 'half-and-half',
      bodyPrimary: '#003580',
      bodySecondary: '#8f1136',
      sleeveLeft: '#003580',
      sleeveRight: '#8f1136',
      collar: '#002359',
      trim: '#facc15',
      textColor: '#facc15',
      textStroke: '#001a4d'
    };
  }
  if (lower.includes('city')) {
    return {
      mode: 'solid',
      bodyPrimary: '#6cabdd',
      sleeveLeft: '#6cabdd',
      sleeveRight: '#6cabdd',
      collar: '#1c2c5b',
      trim: '#1c2c5b',
      textColor: '#ffffff',
      textStroke: '#1c2c5b'
    };
  }
  if (lower.includes('arsenal')) {
    return {
      mode: 'raglan',
      bodyPrimary: '#db0007',
      sleeveLeft: '#ffffff',
      sleeveRight: '#ffffff',
      collar: '#063672',
      trim: '#063672',
      textColor: '#ffffff',
      textStroke: '#9c0005'
    };
  }
  if (lower.includes('argentina')) {
    return {
      mode: 'stripes',
      bodyPrimary: '#ffffff',
      stripeColor: '#6bb8e8',
      sleeveLeft: '#6bb8e8',
      sleeveRight: '#6bb8e8',
      collar: '#6bb8e8',
      trim: '#d4af37',
      textColor: '#0f172a',
      textStroke: '#ffffff'
    };
  }
  if (lower.includes('milan')) {
    return {
      mode: 'retro-piping',
      bodyPrimary: '#ffffff',
      sleeveLeft: '#ffffff',
      sleeveRight: '#ffffff',
      collar: '#111827',
      trim: '#dc2626',
      textColor: '#111827',
      textStroke: '#dc2626'
    };
  }
  // Default: Real Madrid crisp white
  return {
    mode: 'solid',
    bodyPrimary: '#ffffff',
    sleeveLeft: '#ffffff',
    sleeveRight: '#ffffff',
    collar: '#0f172a',
    trim: '#0f172a',
    textColor: '#0f172a',
    textStroke: '#cbd5e1'
  };
}

function getPresetsForTeam(team = '') {
  const lower = team.toLowerCase();
  if (lower.includes('barcelona')) {
    return [
      { name: 'YAMAL', number: '19' },
      { name: 'PEDRI', number: '8' }
    ];
  }
  if (lower.includes('city')) {
    return [
      { name: 'HAALAND', number: '9' },
      { name: 'FODEN', number: '47' }
    ];
  }
  if (lower.includes('arsenal')) {
    return [
      { name: 'SAKA', number: '7' },
      { name: 'ODEGAARD', number: '8' }
    ];
  }
  if (lower.includes('argentina')) {
    return [
      { name: 'MESSI', number: '10' },
      { name: 'ALVAREZ', number: '9' }
    ];
  }
  if (lower.includes('milan')) {
    return [
      { name: 'KAKA', number: '22' },
      { name: 'MALDINI', number: '3' }
    ];
  }
  return [
    { name: 'BELLINGHAM', number: '5' },
    { name: 'MBAPPE', number: '9' }
  ];
}

function CustomizerAtelier({
  jerseys = [],
  selectedKitId,
  onSelectKitId,
  onAddCustomToCart
}) {
  // Controlled State for Custom Flocking
  const [customName, setCustomName] = useState('BELLINGHAM');
  const [customNumber, setCustomNumber] = useState('5');
  const [selectedSize, setSelectedSize] = useState('M');
  const [fontFinish, setFontFinish] = useState('official'); // 'official' | 'gold-foil'
  const [sleevePatch, setSleevePatch] = useState('ucl'); // 'none' | 'league' | 'ucl'

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // Active Kit from MySQL database (fallback to first kit)
  const activeKit =
    jerseys.find((j) => j.id === selectedKitId) || jerseys[0];

  if (!activeKit) return null;

  const theme = getKitVisualTheme(activeKit.team);
  const presets = getPresetsForTeam(activeKit.team);

  // Override typography color if user selected Champions Gold Foil
  const effectiveTextColor =
    fontFinish === 'gold-foil' ? '#d4af37' : theme.textColor;

  // Dynamic INR Price Calculation
  const basePrice = Number(activeKit.price);
  const hasPrinting = customName.trim().length > 0 || customNumber.trim().length > 0;
  const printFee = hasPrinting ? (fontFinish === 'gold-foil' ? 249 : 150) : 0;
  const patchFee = sleevePatch === 'ucl' ? 149 : sleevePatch === 'league' ? 99 : 0;
  const totalPrice = basePrice + printFee + patchFee;

  // Controlled Input Handler for Player Name (Uppercase + Letters/Spaces only)
  function handleNameChange(e) {
    const cleaned = e.target.value
      .toUpperCase()
      .replace(/[^A-Z\s-]/g, '')
      .slice(0, 12);
    setCustomName(cleaned);
  }

  // Controlled Input Handler for Squad Number (Digits 0-99 only)
  function handleNumberChange(e) {
    const cleaned = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
    setCustomNumber(cleaned);
  }

  function handleKitSwitch(kit) {
    if (onSelectKitId) {
      onSelectKitId(kit.id);
    }
    const teamPresets = getPresetsForTeam(kit.team);
    if (teamPresets[0]) {
      setCustomName(teamPresets[0].name);
      setCustomNumber(teamPresets[0].number);
    }
  }

  function handleAddToBag() {
    if (!activeKit.inStock) return;
    if (onAddCustomToCart) {
      onAddCustomToCart(activeKit, selectedSize, {
        customName: customName.trim(),
        customNumber: customNumber.trim(),
        fontFinish,
        sleevePatch,
        totalPrice
      });
    }
  }

  // Scale player name font size for longer surnames
  const nameFontSize = customName.length > 9 ? 20 : customName.length > 7 ? 24 : 28;

  return (
    <section className="customizer-section" id="customizer">
      <div className="customizer-container">
        {/* Section Header */}
        <div className="customizer-header">
          <div>
            <span className="section-kicker">BESPOKE FLOCKING STUDIO</span>
            <h2 className="section-title">2D Interactive Kit Customizer</h2>
          </div>
          <p className="customizer-subtitle">
            Personalize your kit with official heat-pressed name, squad number, and tournament sleeve badges.
          </p>
        </div>

        <div className="customizer-grid">
          {/* LEFT: Live 2D SVG Jersey Back Visualizer */}
          <div className="visualizer-stage">
            <div className="visualizer-badge-bar">
              <span className="live-indicator">● LIVE BACK-PRINT PREVIEW</span>
              <span className="kit-badge-label">{activeKit.team} • {activeKit.season}</span>
            </div>

            <div className="svg-jersey-wrapper">
              <svg
                viewBox="0 0 360 400"
                className="jersey-svg"
                role="img"
                aria-label={`Live customizer preview for ${activeKit.name}`}
              >
                <defs>
                  {/* Subtle Drop Shadow for Jersey */}
                  <filter id="kitShadow" x="-10%" y="-10%" width="120%" height="125%">
                    <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#0f172a" floodOpacity="0.14" />
                  </filter>

                  {/* Half and Half Clip for Barcelona */}
                  <clipPath id="jerseyBodyClip">
                    <path d="M95,48 L138,32 Q180,48 222,32 L265,48 L332,98 L302,160 L265,135 L265,365 Q180,378 95,365 L95,135 L58,160 L28,98 Z" />
                  </clipPath>
                </defs>

                {/* Base Shirt Silhouette */}
                <g filter="url(#kitShadow)">
                  <g clipPath="url(#jerseyBodyClip)">
                    {/* Background Base Color */}
                    <rect x="0" y="0" width="360" height="400" fill={theme.bodyPrimary} />

                    {/* Pattern Variants */}
                    {theme.mode === 'half-and-half' && (
                      <rect x="180" y="0" width="180" height="400" fill={theme.bodySecondary} />
                    )}

                    {theme.mode === 'stripes' && (
                      <>
                        <rect x="95" y="0" width="28" height="400" fill={theme.stripeColor} />
                        <rect x="166" y="0" width="28" height="400" fill={theme.stripeColor} />
                        <rect x="237" y="0" width="28" height="400" fill={theme.stripeColor} />
                      </>
                    )}

                    {/* Left & Right Sleeves */}
                    <path d="M95,48 L28,98 L58,160 L95,135 Z" fill={theme.sleeveLeft} />
                    <path d="M265,48 L332,98 L302,160 L265,135 Z" fill={theme.sleeveRight} />

                    {/* Sleeve Cuffs */}
                    <path d="M28,98 L58,160 L66,154 L36,92 Z" fill={theme.collar} opacity="0.9" />
                    <path d="M332,98 L302,160 L294,154 L324,92 Z" fill={theme.collar} opacity="0.9" />

                    {/* Retro Piping for AC Milan */}
                    {theme.mode === 'retro-piping' && (
                      <>
                        <path d="M95,135 Q120,230 105,370" stroke="#dc2626" strokeWidth="4" fill="none" />
                        <path d="M265,135 Q240,230 255,370" stroke="#dc2626" strokeWidth="4" fill="none" />
                        <path d="M90,52 L42,115" stroke="#dc2626" strokeWidth="5" fill="none" />
                        <path d="M270,52 L318,115" stroke="#dc2626" strokeWidth="5" fill="none" />
                      </>
                    )}

                    {/* Back Neck Collar */}
                    <path
                      d="M134,30 Q180,58 226,30 L220,44 Q180,72 140,44 Z"
                      fill={theme.collar}
                    />
                  </g>

                  {/* Outer crisp stroke for light shirts */}
                  <path
                    d="M95,48 L138,32 Q180,48 222,32 L265,48 L332,98 L302,160 L265,135 L265,365 Q180,378 95,365 L95,135 L58,160 L28,98 Z"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                  />
                </g>

                {/* Live Sleeve Patch Preview on Right Sleeve */}
                {sleevePatch !== 'none' && (
                  <g transform="translate(292, 112) rotate(22)">
                    <circle
                      cx="14"
                      cy="14"
                      r="13"
                      fill={sleevePatch === 'ucl' ? '#0f172a' : '#2563eb'}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <text
                      x="14"
                      y="17"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="7"
                      fontWeight="900"
                    >
                      {sleevePatch === 'ucl' ? 'UCL' : 'PRO'}
                    </text>
                  </g>
                )}

                {/* Live Controlled Player Name */}
                <text
                  x="180"
                  y="118"
                  textAnchor="middle"
                  fill={effectiveTextColor}
                  stroke={theme.textStroke}
                  strokeWidth="0.8"
                  fontSize={nameFontSize}
                  fontWeight="900"
                  letterSpacing="2.5"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {customName || 'YOUR NAME'}
                </text>

                {/* Live Controlled Giant Squad Number */}
                <text
                  x="180"
                  y="272"
                  textAnchor="middle"
                  fill={effectiveTextColor}
                  stroke={theme.textStroke}
                  strokeWidth="2"
                  fontSize="148"
                  fontWeight="900"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {customNumber || '10'}
                </text>

                {/* Authentic Hem Authenticity Seal */}
                <text
                  x="180"
                  y="340"
                  textAnchor="middle"
                  fill={effectiveTextColor}
                  opacity="0.55"
                  fontSize="9"
                  fontWeight="800"
                  letterSpacing="2"
                >
                  JERSEY4U OFFICIAL FLOCKING
                </text>
              </svg>
            </div>

            <div className="visualizer-summary-pill">
              <span>Previewing: <strong>{activeKit.name}</strong></span>
              <span>•</span>
              <span>Print: <strong>{customName || 'NONE'} #{customNumber || '-'}</strong></span>
            </div>
          </div>

          {/* RIGHT: Controlled Form Inputs & Options */}
          <div className="customizer-controls-card">
            {/* Step 1: Select Base Kit */}
            <div className="control-group">
              <label className="control-label">1. Choose Your Base Kit</label>
              <div className="kit-selector-pills">
                {jerseys.map((kit) => (
                  <button
                    key={kit.id}
                    type="button"
                    className={`kit-pill-btn ${activeKit.id === kit.id ? 'active' : ''}`}
                    onClick={() => handleKitSwitch(kit)}
                  >
                    {kit.team}
                    {!kit.inStock && <span className="pill-oos"> (Sold Out)</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Superstar Presets OR Custom Input */}
            <div className="control-group">
              <div className="label-with-presets">
                <label className="control-label">2. Player Name &amp; Number</label>
                <div className="preset-chips">
                  {presets.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      className="preset-chip"
                      onClick={() => {
                        setCustomName(p.name);
                        setCustomNumber(p.number);
                      }}
                    >
                      ⚡ {p.name} #{p.number}
                    </button>
                  ))}
                </div>
              </div>

              <div className="name-number-inputs">
                <div className="input-box-group name-input-col">
                  <div className="input-sublabel">
                    <span>Back Name (Max 12)</span>
                    <span>{customName.length}/12</span>
                  </div>
                  <input
                    type="text"
                    className="custom-text-input"
                    placeholder="e.g. RONALDO"
                    value={customName}
                    onChange={handleNameChange}
                  />
                </div>

                <div className="input-box-group number-input-col">
                  <div className="input-sublabel">
                    <span>Number (0–99)</span>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="custom-text-input number-center"
                    placeholder="7"
                    value={customNumber}
                    onChange={handleNumberChange}
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Flocking Finish & Sleeve Patch */}
            <div className="control-row-split">
              <div className="control-group">
                <label className="control-label">3. Flocking Finish</label>
                <div className="option-cards">
                  <button
                    type="button"
                    className={`option-card-btn ${fontFinish === 'official' ? 'active' : ''}`}
                    onClick={() => setFontFinish('official')}
                  >
                    <span className="opt-title">Official League</span>
                    <span className="opt-price">+₹150</span>
                  </button>
                  <button
                    type="button"
                    className={`option-card-btn ${fontFinish === 'gold-foil' ? 'active' : ''}`}
                    onClick={() => setFontFinish('gold-foil')}
                  >
                    <span className="opt-title">✨ Gold Foil</span>
                    <span className="opt-price">+₹249</span>
                  </button>
                </div>
              </div>

              <div className="control-group">
                <label className="control-label">4. Sleeve Patch</label>
                <div className="option-cards">
                  <button
                    type="button"
                    className={`option-card-btn ${sleevePatch === 'none' ? 'active' : ''}`}
                    onClick={() => setSleevePatch('none')}
                  >
                    <span className="opt-title">None</span>
                    <span className="opt-price">₹0</span>
                  </button>
                  <button
                    type="button"
                    className={`option-card-btn ${sleevePatch === 'league' ? 'active' : ''}`}
                    onClick={() => setSleevePatch('league')}
                  >
                    <span className="opt-title">League</span>
                    <span className="opt-price">+₹99</span>
                  </button>
                  <button
                    type="button"
                    className={`option-card-btn ${sleevePatch === 'ucl' ? 'active' : ''}`}
                    onClick={() => setSleevePatch('ucl')}
                  >
                    <span className="opt-title">🏆 UCL</span>
                    <span className="opt-price">+₹149</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Step 4: Size Selector */}
            <div className="control-group">
              <label className="control-label">5. Select Size</label>
              <div className="custom-size-row">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    className={`custom-size-btn ${selectedSize === sz ? 'active' : ''}`}
                    onClick={() => setSelectedSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Price Breakdown */}
            <div className="custom-price-summary">
              <div className="price-line">
                <span>Base Kit ({activeKit.team})</span>
                <span>₹{basePrice}</span>
              </div>
              <div className="price-line">
                <span>Custom Name &amp; Number Print</span>
                <span>{printFee > 0 ? `+₹${printFee}` : '₹0 (Blank)'}</span>
              </div>
              <div className="price-line">
                <span>Official Sleeve Badge</span>
                <span>{patchFee > 0 ? `+₹${patchFee}` : '₹0'}</span>
              </div>
              <div className="price-divider"></div>
              <div className="price-line total">
                <span>Total Custom Kit Price</span>
                <span className="total-inr">₹{totalPrice}</span>
              </div>
            </div>

            {/* Final CTA */}
            <button
              type="button"
              className="add-custom-bag-btn"
              disabled={!activeKit.inStock}
              onClick={handleAddToBag}
            >
              {activeKit.inStock
                ? `Add Custom Kit to Bag (Size ${selectedSize} • ₹${totalPrice}) 🛒`
                : 'Currently Sold Out — Select Another Club'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CustomizerAtelier;
