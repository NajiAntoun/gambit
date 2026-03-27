import { useState } from 'react';
import { openings, getOpeningsByCategory } from '../data/openings';
import { OpeningCard } from '../components/home/OpeningCard';
import type { Color } from '../data/types';

const CATEGORIES = ['White Openings', "Black vs King's Pawn (e4)", "Black vs Queen's Pawn (d4)"] as const;

export function Home() {
  const [selectedColor, setSelectedColor] = useState<Color | 'all'>('all');
  const [search, setSearch] = useState('');
  const grouped = getOpeningsByCategory();

  const filteredOpenings = openings.filter((o) => {
    const matchColor = selectedColor === 'all' || o.userColor === selectedColor;
    const matchSearch =
      !search || o.name.toLowerCase().includes(search.toLowerCase());
    return matchColor && matchSearch;
  });

  const filteredGrouped: Record<string, typeof openings> = {};
  for (const cat of CATEGORIES) {
    const items = (grouped[cat] ?? []).filter((o) => filteredOpenings.includes(o));
    if (items.length) filteredGrouped[cat] = items;
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%', padding: '24px 16px 80px' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--color-text)',
            margin: '0 0 4px',
            letterSpacing: '-0.5px',
          }}
        >
          Master your openings.
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '15px', margin: 0 }}>
          Own the board.
        </p>
      </div>

      {/* Color filter */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {(['all', 'white', 'black'] as const).map((c) => (
          <button
            key={c}
            onClick={() => setSelectedColor(c)}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.15s',
              minHeight: '40px',
              background: selectedColor === c ? 'var(--color-gold)' : 'var(--color-bg-card)',
              color: selectedColor === c ? '#0f1a0f' : 'var(--color-text)',
              border: selectedColor === c ? 'none' : '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {c === 'white' && <span style={{ fontSize: '18px', lineHeight: 1 }}>♙</span>}
            {c === 'black' && <span style={{ fontSize: '18px', lineHeight: 1 }}>♟</span>}
            {c === 'all' ? 'All Openings' : c === 'white' ? 'Playing White' : 'Playing Black'}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search openings..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 14px',
          borderRadius: '8px',
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text)',
          fontSize: '14px',
          marginBottom: '20px',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />

      {/* Opening list grouped */}
      {Object.entries(filteredGrouped).map(([category, items]) => (
        <div key={category} style={{ marginBottom: '24px' }}>
          <h2
            style={{
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              marginBottom: '10px',
            }}
          >
            {category}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {items.map((o) => (
              <OpeningCard key={o.id} opening={o} />
            ))}
          </div>
        </div>
      ))}

      {filteredOpenings.length === 0 && (
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '40px' }}>
          No openings match your search.
        </p>
      )}
    </div>
  );
}
