import './DiscoveryBar.css';

function DiscoveryBar({ selectedLeague, onSelectLeague, totalCount = 6 }) {
  const leagues = [
    { id: 'all', label: '⚽ All Vault Kits' },
    { id: 'Premier League', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League' },
    { id: 'La Liga', label: '🇪🇸 La Liga' },
    { id: 'Serie A', label: '🇮🇹 Serie A' },
    { id: 'International', label: '🌍 International' },
    { id: 'Retro', label: '⏳ Retro Classics' }
  ];

  const clubs = [
    { name: 'Real Madrid', short: 'RMA', color: '#001C58' },
    { name: 'FC Barcelona', short: 'FCB', color: '#A50044' },
    { name: 'Arsenal', short: 'ARS', color: '#EF0107' },
    { name: 'Manchester City', short: 'MCI', color: '#6CABDD' },
    { name: 'Inter Milan', short: 'INT', color: '#00579C' },
    { name: 'Argentina', short: 'ARG', color: '#75AADB' }
  ];

  return (
    <div className="discovery-bar-wrapper">
      <div className="discovery-container">
        {/* Tier 1: League Filter Pills */}
        <div className="league-pills-row">
          <div className="pills-scroll-container">
            {leagues.map((league) => (
              <button
                key={league.id}
                type="button"
                className={`league-pill ${
                  selectedLeague.toLowerCase() === league.id.toLowerCase() ? 'active' : ''
                }`}
                onClick={() => onSelectLeague(league.id)}
              >
                {league.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tier 2: Club Avatar Quick-Access Bar */}
        <div className="clubs-sub-row">
          <div className="club-avatars">
            <span className="club-row-label">Top Clubs:</span>
            {clubs.map((club) => (
              <button
                key={club.name}
                type="button"
                className="club-avatar-chip"
                onClick={() => onSelectLeague(club.name)}
                title={`Filter by ${club.name}`}
              >
                <span
                  className="club-badge-circle"
                  style={{ backgroundColor: club.color }}
                >
                  {club.short}
                </span>
                <span className="club-chip-text">{club.name}</span>
              </button>
            ))}
          </div>

          <div className="catalog-meta">
            Showing <strong className="count-number">{totalCount}</strong> Kits
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscoveryBar;
