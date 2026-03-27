import { useState, useMemo } from 'react';
import { openings, getOpeningsByCategory } from '../data/openings';
import { OpeningCard } from '../components/home/OpeningCard';
import { useProgress } from '../hooks/useProgress';
import type { Color, Opening } from '../data/types';

const CATEGORIES = ['White Openings', "Black vs King's Pawn (e4)", "Black vs Queen's Pawn (d4)"] as const;

type SortOption = 'category' | 'popular' | 'alphabetical' | 'difficulty' | 'oldest' | 'newest' | 'lines' | 'progress';

const SORT_LABELS: Record<SortOption, string> = {
  category:     'By category',
  popular:      'Most popular',
  alphabetical: 'A – Z',
  difficulty:   'Difficulty',
  oldest:       'Oldest first',
  newest:       'Newest first',
  lines:        'Most lines',
  progress:     'Your progress',
};

const DIFFICULTY_ORDER: Record<string, number> = { beginner: 0, intermediate: 1, advanced: 2 };
const PROGRESS_ORDER: Record<string, number> = { 'not-started': 0, learning: 1, mastered: 2 };

export function Home() {
  const [selectedColor, setSelectedColor] = useState<Color | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('category');
  const { getProgress } = useProgress();
  const grouped = getOpeningsByCategory();

  const filteredOpenings = useMemo(() =>
    openings.filter((o) => {
      const matchColor = selectedColor === 'all' || o.userColor === selectedColor;
      const matchSearch = !search || o.name.toLowerCase().includes(search.toLowerCase());
      return matchColor && matchSearch;
    }),
    [selectedColor, search]
  );

  // Grouped view (default)
  const filteredGrouped = useMemo(() => {
    const result: Record<string, Opening[]> = {};
    for (const cat of CATEGORIES) {
      const items = (grouped[cat] ?? []).filter((o) => filteredOpenings.includes(o));
      if (items.length) result[cat] = items;
    }
    return result;
  }, [filteredOpenings, grouped]);

  // Sorted flat view
  const sortedFlat = useMemo(() => {
    if (sort === 'category') return [];
    const arr = [...filteredOpenings];
    switch (sort) {
      case 'popular':
        arr.sort((a, b) => b.popularity - a.popularity || a.name.localeCompare(b.name));
        break;
      case 'alphabetical':
        arr.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'difficulty':
        arr.sort((a, b) => (DIFFICULTY_ORDER[a.difficulty] ?? 1) - (DIFFICULTY_ORDER[b.difficulty] ?? 1) || a.name.localeCompare(b.name));
        break;
      case 'oldest':
        arr.sort((a, b) => a.yearPopularized - b.yearPopularized);
        break;
      case 'newest':
        arr.sort((a, b) => b.yearPopularized - a.yearPopularized);
        break;
      case 'lines':
        arr.sort((a, b) => {
          const aLines = a.forks?.reduce((n, f) => n + f.options.length, 0) ?? 0;
          const bLines = b.forks?.reduce((n, f) => n + f.options.length, 0) ?? 0;
          return bLines - aLines || a.name.localeCompare(b.name);
        });
        break;
      case 'progress':
        arr.sort((a, b) => {
          const aP = PROGRESS_ORDER[getProgress(a.id).status] ?? 0;
          const bP = PROGRESS_ORDER[getProgress(b.id).status] ?? 0;
          return bP - aP || a.name.localeCompare(b.name);
        });
        break;
    }
    return arr;
  }, [sort, filteredOpenings, getProgress]);

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%', padding: '24px 16px 80px' }}>
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

      {/* Filter row: color buttons + sort */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {/* Color filters */}
        <div style={{ display: 'flex', gap: '8px', flex: 1, flexWrap: 'wrap' }}>
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

        {/* Sort dropdown */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            minHeight: '40px',
            appearance: 'none',
            WebkitAppearance: 'none',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\'%3E%3Cpath d=\'M0 0l5 6 5-6z\' fill=\'%23888\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 10px center',
            paddingRight: '30px',
          }}
        >
          {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
            <option key={key} value={key}>{SORT_LABELS[key]}</option>
          ))}
        </select>
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

      {/* Grouped view (default) */}
      {sort === 'category' &&
        Object.entries(filteredGrouped).map(([category, items]) => (
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '8px' }}>
              {items.map((o) => (
                <OpeningCard key={o.id} opening={o} />
              ))}
            </div>
          </div>
        ))}

      {/* Flat sorted view */}
      {sort !== 'category' && sortedFlat.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '8px' }}>
          {sortedFlat.map((o) => (
            <OpeningCard key={o.id} opening={o} />
          ))}
        </div>
      )}

      {filteredOpenings.length === 0 && (
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '40px' }}>
          No openings match your search.
        </p>
      )}
    </div>
  );
}
