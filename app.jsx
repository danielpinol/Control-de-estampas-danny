/* ============ App root ============ */

const { useState, useEffect, useMemo, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#d4ff3d",
  "density": "comfortable",
  "showHints": true
}/*EDITMODE-END*/;

function App() {
  const album = useMemo(() => AlbumData.buildAlbum(), []);
  const [coll, setColl] = useState(() => AlbumData.loadCollection());
  const [activity, setActivity] = useState(() => AlbumData.loadActivity());
  const [prefs, setPrefs] = useState(() => ({
    onboardingDismissed: false,
    ...AlbumData.loadPrefs(),
  }));
  const [route, setRoute] = useState({ tab: 'home' });
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const [detail, setDetail] = useState(null); // sticker for long-press modal

  const [editTeam, setEditTeam] = useState(null);
  const toastTimer = useRef(null);
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply CSS variables for tweaks
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', t.accent);
    document.documentElement.style.setProperty('--accent-soft', shade(t.accent, -0.1));
    document.documentElement.style.setProperty('--accent-glow', hexA(t.accent, 0.22));
    document.documentElement.setAttribute('data-density', t.density);
  }, [t.accent, t.density]);

  function flash(msg) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 1400);
  }

  function pushActivity(kind, sticker) {
    const entry = { kind, code: sticker.code, name: sticker.name, at: Date.now() };
    const next = [entry, ...activity].slice(0, 80);
    setActivity(next);
    AlbumData.saveActivity(next);
  }

  function setStickerState(sticker, partial) {
    const prev = coll[sticker.id] || { have: false, dupes: 0 };
    const next = { ...prev, ...partial };
    const updated = { ...coll, [sticker.id]: next };
    setColl(updated);
    AlbumData.saveCollection(updated);
  }

  // Tap behavior:
  // 1. !have      -> have=true     ("Obtenida")
  // 2. have, d=0  -> dupes=1       ("+1 repetida")
  // 3. have, d>0  -> dupes++       ("+1 repetida")
  function onTap(s) {
    const u = coll[s.id] || { have: false, dupes: 0 };
    if (!u.have) {
      setStickerState(s, { have: true });
      pushActivity('have', s);
      flash(`✓ ${s.code} obtenida`);
    } else {
      setStickerState(s, { dupes: (u.dupes || 0) + 1 });
      pushActivity('dupe', s);
      flash(`+1 repetida · ${s.code}`);
    }
  }

  function onLongPress(s) {
    setDetail(s);
  }

  function exportColl() {
    const dupes = album.allStickers
      .filter((s) => coll[s.id] && coll[s.id].dupes > 0)
      .sort((a, b) => a.code.localeCompare(b.code));
    const rows = [
      ['Repetidas WC26'],
      ['Código', 'Nombre'],
      ...dupes.map((s) => [s.code, s.name]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'repetidas-wc26.csv'; a.click();
    URL.revokeObjectURL(url);
    flash('Exportado');
  }

  function exportBackup() {
    const date = new Date().toISOString().slice(0, 10);
    const blob = new Blob([JSON.stringify(coll)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `backup-wc26-${date}.json`; a.click();
    URL.revokeObjectURL(url);
    flash('Backup guardado');
  }

  function importBackup(data) {
    if (!confirm('¿Restaurar colección desde backup? Esto reemplazará tu colección actual.')) return;
    setColl(data);
    AlbumData.saveCollection(data);
    flash('Colección restaurada');
  }

  function resetAll() {
    if (!confirm('¿Borrar toda tu colección? Esto no se puede deshacer.')) return;
    setColl({});
    setActivity([]);
    AlbumData.saveCollection({});
    AlbumData.saveActivity([]);
    flash('Colección reseteada');
  }

  // Render screen based on route
  let screen;
  if (route.tab === 'home') {
    screen = <Dashboard album={album} coll={coll} activity={activity}
      onGo={(r) => setRoute(r)} onExport={exportColl} />;
  } else if (route.tab === 'teams') {
    screen = <TeamsList album={album} coll={coll}
      search={search} setSearch={setSearch}
      onGo={(r) => setRoute(r)} />;
  } else if (route.tab === 'team') {
    const sec = album.sections.find((s) => s.id === route.teamId);
    if (!sec) { setRoute({ tab: 'teams' }); return null; }
    screen = <TeamDetail album={album} section={sec} coll={coll}
      onTap={onTap} onLongPress={onLongPress}
      onBack={() => setRoute({ tab: 'teams' })}
      onEdit={() => setEditTeam(sec)} />;
  } else if (route.tab === 'sections') {
    const sec = album.sections.find((s) => s.id === route.sectionId);
    if (!sec) { setRoute({ tab: 'more' }); return null; }
    screen = <SectionDetail album={album} section={sec} coll={coll}
      onTap={onTap} onLongPress={onLongPress}
      onBack={() => setRoute({ tab: 'more' })} />;
  } else if (route.tab === 'mark') {
    screen = <MarkScreen album={album} coll={coll}
      onTap={onTap} onLongPress={onLongPress} />;
  } else if (route.tab === 'find') {
    screen = <FindScreen album={album} coll={coll}
      onTap={onTap} onLongPress={onLongPress} />;
  } else if (route.tab === 'list') {
    screen = <ListScreen album={album} coll={coll} kind={route.listKind}
      onTap={onTap} onLongPress={onLongPress}
      onBack={() => setRoute({ tab: 'more' })} />;
  } else if (route.tab === 'more') {
    screen = <MoreScreen album={album} coll={coll}
      onGo={(r) => setRoute(r)}
      onReset={resetAll}
      onExport={exportColl}
      onBackup={exportBackup}
      onRestoreBackup={importBackup}
      />;
  }

  // Bottom nav tab mapping
  const navTab = ['team', 'sections'].includes(route.tab) ? 'teams'
                : route.tab === 'list' ? 'more'
                : route.tab;

  // Header title
  const headerTitle = {
    home: 'WC26',
    teams: 'WC26',
    team: 'WC26',
    sections: 'WC26',
    mark: 'WC26',
    find: 'WC26',
    more: 'WC26',
    list: 'WC26',
  }[route.tab] || 'WC26';

  return (
    <div className="app-shell">
      <div className="grain" />
      <Header
        title={headerTitle}
        sub="TRACKER"
      />
      {screen}
      <BottomNav tab={navTab} onTab={(t) => {
        setRoute({ tab: t });
        if (t === 'teams') setSearch('');
      }} />
      <Toast message={toast} />
      {detail && (
        <StickerDetailModal
          s={detail}
          userData={coll[detail.id]}
          onClose={() => setDetail(null)}
          onSet={(partial) => setStickerState(detail, partial)}
          onEdit={() => { setDetail(null); /* future: open edit name */ }}
        />
      )}

      {editTeam && (
        <EditTeamModal section={editTeam}
          onClose={() => setEditTeam(null)}
          onSave={(patch) => {
            // Patch in-memory; saving team edits to localStorage left as TODO
            Object.assign(editTeam, patch);
            setEditTeam(null);
            flash('Equipo actualizado');
          }} />
      )}
      <TweaksPanel>
        <TweakSection title="Acento">
          <TweakColor
            label="Color"
            value={t.accent}
            onChange={(v) => setTweak('accent', v)}
            options={['#d4ff3d', '#22d3ee', '#fb923c', '#ec4899']}
          />
        </TweakSection>
        <TweakSection title="Lista">
          <TweakRadio
            label="Densidad"
            value={t.density}
            onChange={(v) => setTweak('density', v)}
            options={[
              { label: 'Cómoda', value: 'comfortable' },
              { label: 'Compacta', value: 'compact' },
            ]}
          />
          <TweakToggle
            label="Mostrar hints"
            value={t.showHints}
            onChange={(v) => setTweak('showHints', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}


function EditTeamModal({ section, onClose, onSave }) {
  const [name, setName] = useState(section.name);
  const [code, setCode] = useState(section.code);
  const [group, setGroup] = useState(section.group === '?' ? '' : section.group);
  return (
    <Modal open={true} onClose={onClose}
      title="Editar selección" sub="Datos no verificados — edítalos cuando confirmes">
      <div className="field">
        <label>Nombre</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="field">
        <label>Código (3 letras)</label>
        <input value={code} maxLength={4} onChange={(e) => setCode(e.target.value.toUpperCase())} />
      </div>
      <div className="field">
        <label>Grupo</label>
        <input value={group} maxLength={2} onChange={(e) => setGroup(e.target.value.toUpperCase())}
          placeholder="A, B, C…" />
      </div>
      <div className="actions">
        <button className="btn" onClick={onClose}>Cancelar</button>
        <button className="btn primary full" onClick={() => onSave({
          name: name || section.name,
          code: code || section.code,
          group: group || '?',
          verified: true,
        })}>Guardar</button>
      </div>
    </Modal>
  );
}

// ============ Helpers ============
function hexA(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
function shade(hex, amt) {
  const h = hex.replace('#', '');
  let r = parseInt(h.slice(0, 2), 16);
  let g = parseInt(h.slice(2, 4), 16);
  let b = parseInt(h.slice(4, 6), 16);
  r = Math.max(0, Math.min(255, Math.round(r + 255 * amt)));
  g = Math.max(0, Math.min(255, Math.round(g + 255 * amt)));
  b = Math.max(0, Math.min(255, Math.round(b + 255 * amt)));
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
