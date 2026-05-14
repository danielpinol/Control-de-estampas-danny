/* ============ Screens ============ */

function Dashboard({ album, coll, activity, onGo, onExport }) {
  const overall = AlbumData.statsFor(album.allStickers, coll);
  const intro = album.sections.find((s) => s.id === 'intro');
  const museum = album.sections.find((s) => s.id === 'museum');
  const introStats = AlbumData.statsFor(intro.items, coll);
  const museumStats = AlbumData.statsFor(museum.items, coll);
  const teamSections = album.sections.filter((s) => s.kind === 'team');

  // top 3 teams by progress (excluding 0% and 100%)
  const teamStats = teamSections.map((t) => ({ t, s: AlbumData.statsFor(t.items, coll) }));
  const inProgress = teamStats
    .filter((x) => x.s.got > 0 && x.s.got < x.s.total)
    .sort((a, b) => b.s.pct - a.s.pct)
    .slice(0, 4);
  const lastAdded = activity.filter((a) => a.kind === 'have').slice(0, 4);

  return (
    <div className="main">
      <div className="hero">
        <div className="hero-meta"><span className="live-dot" /> HECHO POR · DANIEL PIÑOL PEDROSO</div>
        <h1 className="hero-title">Control <span className="accent">de Estampas</span></h1>
        <div className="bignum">
          {overall.got}
          <span className="of">/ {album.total}</span>
          <span className="pct">{overall.pct}%</span>
        </div>
        <div style={{ marginTop: 12 }}><Pbar pct={overall.pct} thick /></div>
      </div>

      <div className="stats-row">
        <div className="stat">
          <div className="stat-label">Obtenidas</div>
          <div className="stat-val ok">{overall.got}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Faltantes</div>
          <div className="stat-val missing">{overall.missing}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Repetidas</div>
          <div className="stat-val dupe">{overall.dupes}</div>
        </div>
      </div>

      <div className="section-label">Intercambios</div>
      <div className="recent">
        <div className="recent-item" onClick={onExport} style={{ cursor: 'pointer', background: 'var(--accent-glow)', borderColor: 'var(--accent)' }}>
          <span className="dot dupe" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="what" style={{ color: 'var(--accent)', fontWeight: 700 }}>Enviar lista de repetidas</div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>Descarga tu lista para intercambiar</div>
          </div>
          <span className="when">{overall.dupes}</span>
        </div>
      </div>

      <div className="section-label">En progreso <span className="count">{inProgress.length} eq.</span></div>
      {inProgress.length === 0 ? (
        <div className="empty" style={{ padding: '20px 16px' }}>
          Aún no marcas estampas en ningún equipo.
        </div>
      ) : (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {inProgress.map(({ t, s }) => (
            <button key={t.id} className="team-card" data-complete={s.pct === 100 ? 1 : 0}
              onClick={() => onGo({ tab: 'team', teamId: t.id })}
              style={{ width: '100%', minHeight: 'auto', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="code">{t.code} {!t.verified && <span className="unv-badge">?</span>}</div>
                <div className="name" style={{ fontSize: 16 }}>{t.name}</div>
              </div>
              <div className="ratio">
                {s.got}<span className="denom">/{s.total}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="section-label">Últimas obtenidas <span className="count">{lastAdded.length}</span></div>
      {lastAdded.length === 0 ? (
        <div className="empty" style={{ padding: '20px 16px' }}>
          Tap en una estampa para marcarla como obtenida.
        </div>
      ) : (
        <div className="recent">
          {lastAdded.map((a, i) => (
            <div className="recent-item" key={i}>
              <span className="dot ok" />
              <span className="code">{a.code}</span>
              <span className="what">{a.name}</span>
              <span className="when">{relTime(a.at)}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ height: 40 }} />
    </div>
  );
}

function TeamsList({ album, coll, onGo, search, setSearch }) {
  const teams = album.sections.filter((s) => s.kind === 'team');
  const q = (search || '').trim().toLowerCase();
  const filtered = q
    ? teams.filter((t) => t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q) || (t.confed || '').toLowerCase().includes(q))
    : teams;

  const GROUP_ORDER = ['A','B','C','D','E','F','G','H','I','J','K','L'];
  const grouped = GROUP_ORDER.map((g) => ({
    label: `Grupo ${g}`,
    teams: filtered.filter((t) => t.group === g),
  })).filter((g) => g.teams.length > 0);
  const ungrouped = filtered.filter((t) => !t.group);

  const renderCard = (t) => {
    const s = AlbumData.statsFor(t.items, coll);
    return (
      <button key={t.id} className="team-card" data-complete={s.pct === 100 ? 1 : 0}
        onClick={() => onGo({ tab: 'team', teamId: t.id })}>
        {!t.verified && <span className="unverified">?</span>}
        <div className="code">{t.code}{t.host && ' · HOST'}{t.debut && ' · DEBUT'}</div>
        <div className="name">{t.name}</div>
        <div className="ratio">
          {s.got}<span className="denom">/20</span>
        </div>
        <Pbar pct={s.pct} thin />
      </button>
    );
  };

  return (
    <div className="main">
      <div className="page-head">
        <div className="breadcrumb">SECCIÓN · 48 SELECCIONES</div>
        <h1 className="title">Equipos</h1>
        <div className="sub">20 estampas por selección · 960 totales</div>
      </div>
      <div className="search-bar">
        <Icon name="search" size={16} />
        <input placeholder="Buscar equipo, código o confederación…" value={search || ''}
          onChange={(e) => setSearch(e.target.value)} />
      </div>
      {q ? (
        <>
          <div style={{ height: 12 }} />
          <div className="team-grid">{filtered.map(renderCard)}</div>
        </>
      ) : (
        <>
          {grouped.map((g) => (
            <React.Fragment key={g.label}>
              <div className="section-label">{g.label} <span className="count">{g.teams.length}</span></div>
              <div className="team-grid">{g.teams.map(renderCard)}</div>
            </React.Fragment>
          ))}
          {ungrouped.length > 0 && (
            <>
              <div className="section-label">Sin grupo asignado <span className="count">{ungrouped.length}</span></div>
              <div className="team-grid">{ungrouped.map(renderCard)}</div>
            </>
          )}
        </>
      )}
      <div style={{ height: 40 }} />
    </div>
  );
}

function TeamDetail({ album, section, coll, onTap, onLongPress, onBack, onEdit }) {
  const stats = AlbumData.statsFor(section.items, coll);
  const [filter, setFilter] = React.useState('all');
  const filtered = section.items.filter((s) => {
    const u = coll[s.id];
    if (filter === 'missing') return !(u && u.have);
    if (filter === 'have') return !!(u && u.have);
    if (filter === 'dupes') return !!(u && u.dupes > 0);
    return true;
  });

  return (
    <div className="main">
      <div className="page-head">
        <div className="breadcrumb">
          <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text-dim)' }}>
            <Icon name="chevronLeft" size={14} /> Equipos
          </button>
          <span>·</span>
          <span>{section.code}</span>
          {!section.verified && <span className="unv-badge">No verificado</span>}
        </div>
        <h1 className="title">{section.name}</h1>
        <div className="sub">
          {section.code}1 – {section.code}20 · 20 estampas
          {section.group && section.group !== '?' && ` · Grupo ${section.group}`}
          {section.confed && ` · ${section.confed}`}
          {section.host && ' · HOST'}
          {section.debut && ' · DEBUTANTE'}
          {' · '}<button onClick={onEdit} style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Editar</button>
        </div>
        <div className="progress-row">
          <Pbar pct={stats.pct} thick />
          <span className="pct">{stats.got}/{stats.total} · {stats.pct}%</span>
        </div>
      </div>
      <div className="chips">
        <button className={"chip" + (filter === 'all' ? ' active' : '')} onClick={() => setFilter('all')}>Todas</button>
        <button className={"chip" + (filter === 'missing' ? ' active' : '')} onClick={() => setFilter('missing')}>Faltan {stats.missing}</button>
        <button className={"chip" + (filter === 'have' ? ' active' : '')} onClick={() => setFilter('have')}>Tengo {stats.got}</button>
        <button className={"chip" + (filter === 'dupes' ? ' active' : '')} onClick={() => setFilter('dupes')}>Repetidas {stats.dupes}</button>
      </div>
      <div className="hint-bar">
        Toca el <span className="accent">○</span> para obtener · otra vez <span className="accent">+1 repetida</span> · <span className="accent">Long-press</span> editar
      </div>
      <div className="sticker-list">
        {filtered.map((s) => (
          <StickerRow key={s.id} s={s} userData={coll[s.id]}
            onTap={onTap} onLongPress={onLongPress} />
        ))}
        {filtered.length === 0 && <div className="empty">Nada por aquí</div>}
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}

function MarkScreen({ album, coll, onTap, onLongPress }) {
  const [filter, setFilter] = React.useState('missing');
  const [scope, setScope] = React.useState('all'); // all | intro | museum | teams
  const [q, setQ] = React.useState('');
  const query = q.trim().toLowerCase();
  const all = album.allStickers;
  let list = all;
  if (scope === 'intro') list = list.filter((s) => s.section === 'intro');
  else if (scope === 'museum') list = list.filter((s) => s.section === 'museum');
  else if (scope === 'teams') list = list.filter((s) => s.team);
  if (filter === 'missing') list = list.filter((s) => !(coll[s.id] && coll[s.id].have));
  else if (filter === 'have') list = list.filter((s) => coll[s.id] && coll[s.id].have);
  else if (filter === 'dupes') list = list.filter((s) => coll[s.id] && coll[s.id].dupes > 0);
  if (query.length > 0) {
    list = list.filter((s) =>
      s.code.toLowerCase().includes(query) ||
      s.name.toLowerCase().includes(query) ||
      (s.team && s.team.toLowerCase().includes(query))
    );
  }

  return (
    <div className="main">
      <div className="page-head">
        <div className="breadcrumb">MARCADO RÁPIDO</div>
        <h1 className="title">Tachar</h1>
        <div className="sub">Toca para marcar estampas mientras abres sobres.</div>
      </div>
      <div className="search-bar">
        <Icon name="search" size={16} />
        <input placeholder="Buscar jugador, equipo o código…"
          value={q} onChange={(e) => setQ(e.target.value)} />
        {q && <button onClick={() => setQ('')} style={{ color: 'var(--text-faint)' }}><Icon name="cross" size={16} /></button>}
      </div>
      <div className="chips">
        <button className={"chip" + (scope === 'all' ? ' active' : '')} onClick={() => setScope('all')}>Todo</button>
        <button className={"chip" + (scope === 'intro' ? ' active' : '')} onClick={() => setScope('intro')}>Intro</button>
        <button className={"chip" + (scope === 'museum' ? ' active' : '')} onClick={() => setScope('museum')}>Museum</button>
        <button className={"chip" + (scope === 'teams' ? ' active' : '')} onClick={() => setScope('teams')}>Equipos</button>
      </div>
      <div className="chips" style={{ paddingTop: 0 }}>
        <button className={"chip" + (filter === 'missing' ? ' active' : '')} onClick={() => setFilter('missing')}>Faltan</button>
        <button className={"chip" + (filter === 'all' ? ' active' : '')} onClick={() => setFilter('all')}>Todas</button>
        <button className={"chip" + (filter === 'have' ? ' active' : '')} onClick={() => setFilter('have')}>Tengo</button>
        <button className={"chip" + (filter === 'dupes' ? ' active' : '')} onClick={() => setFilter('dupes')}>Repetidas</button>
      </div>
      <div className="hint-bar">
        <span className="accent">{list.length}</span> estampas · Toca el ○ para marcar / +1 repetida
      </div>
      <div className="sticker-list">
        {list.slice(0, 400).map((s) => (
          <StickerRow key={s.id} s={s} userData={coll[s.id]}
            onTap={onTap} onLongPress={onLongPress} />
        ))}
        {list.length === 0 && <div className="empty"><div className="icon">·</div>Vacío</div>}
        {list.length > 400 && <div className="empty">+{list.length - 400} más · filtra para ver el resto</div>}
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}

function FindScreen({ album, coll, onTap, onLongPress }) {
  const [q, setQ] = React.useState('');
  const query = q.trim().toLowerCase();
  let results = [];
  if (query.length > 0) {
    results = album.allStickers.filter((s) => {
      if (s.code.toLowerCase().includes(query)) return true;
      if (s.name.toLowerCase().includes(query)) return true;
      if (s.team && s.team.toLowerCase().includes(query)) return true;
      return false;
    }).slice(0, 100);
  }
  return (
    <div className="main">
      <div className="page-head">
        <div className="breadcrumb">BUSCADOR</div>
        <h1 className="title">Buscar</h1>
        <div className="sub">Por código, nombre, equipo o jugador.</div>
      </div>
      <div className="search-bar">
        <Icon name="search" size={16} />
        <input autoFocus placeholder="MEX1, FWC, Argentina…"
          value={q} onChange={(e) => setQ(e.target.value)} />
        {q && <button onClick={() => setQ('')} style={{ color: 'var(--text-faint)' }}><Icon name="cross" size={16} /></button>}
      </div>
      <div style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        {query.length === 0 ? 'Empieza a escribir' : `${results.length} resultado${results.length === 1 ? '' : 's'}`}
      </div>
      <div className="sticker-list">
        {results.map((s) => (
          <StickerRow key={s.id} s={s} userData={coll[s.id]}
            onTap={onTap} onLongPress={onLongPress} />
        ))}
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}

function MoreScreen({ album, coll, onGo, onReset, onExport, onBackup, onRestoreBackup }) {
  const fileRef = React.useRef(null);
  function handleRestore(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try { onRestoreBackup(JSON.parse(r.result)); }
      catch { alert('Archivo inválido'); }
    };
    r.readAsText(file);
    e.target.value = '';
  }
  const overall = AlbumData.statsFor(album.allStickers, coll);
  const missing = album.allStickers.filter((s) => !(coll[s.id] && coll[s.id].have));
  const dupes = album.allStickers.filter((s) => coll[s.id] && coll[s.id].dupes > 0);
  const sections = album.sections.filter((s) => s.kind === 'team');

  return (
    <div className="main">
      <div className="page-head">
        <div className="breadcrumb">MÁS</div>
        <h1 className="title">Listas</h1>
        <div className="sub">Faltantes, repetidas, secciones e importar.</div>
      </div>

      <div className="section-label">Listas</div>
      <div className="recent">
        <div className="recent-item" onClick={() => onGo({ tab: 'list', listKind: 'missing' })} style={{ cursor: 'pointer' }}>
          <span className="dot" style={{ background: 'var(--missing)' }} />
          <span className="what">Faltantes</span>
          <span className="when">{missing.length}</span>
        </div>
        <div className="recent-item" onClick={() => onGo({ tab: 'list', listKind: 'dupes' })} style={{ cursor: 'pointer' }}>
          <span className="dot dupe" />
          <span className="what">Repetidas (para cambio)</span>
          <span className="when">{dupes.length}</span>
        </div>
        <div className="recent-item" onClick={() => onGo({ tab: 'list', listKind: 'have' })} style={{ cursor: 'pointer' }}>
          <span className="dot ok" />
          <span className="what">Obtenidas</span>
          <span className="when">{overall.got}</span>
        </div>
      </div>

      <div className="section-label">Secciones</div>
      <div>
        {sections.map((sec, i) => {
          const s = AlbumData.statsFor(sec.items, coll);
          return (
            <div key={sec.id} className="sec-row" onClick={() => {
              if (sec.kind === 'team') onGo({ tab: 'team', teamId: sec.id });
              else onGo({ tab: 'sections', sectionId: sec.id });
            }}>
              <div className="idx">{String(i + 1).padStart(2, '0')}</div>
              <div className="info">
                <div className="name">
                  {sec.name}
                  {!sec.verified && <span className="unv-badge" style={{ marginLeft: 6 }}>?</span>}
                </div>
                <div className="meta">
                  {sec.kind === 'intro' && 'Introducción · 9 estampas FOIL'}
                  {sec.kind === 'museum' && 'FWC9 – FWC19 · 11 estampas'}
                  {sec.kind === 'team' && `${sec.code}1 – ${sec.code}20 · 20 estampas`}
                  {sec.kind === 'extras' && 'Sección separada · sin numeración'}
                </div>
              </div>
              <div className="right">
                <div className="ratio">{s.got}<span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>/{s.total || '?'}</span></div>
                <div className="pct">{s.total ? s.pct + '%' : '—'}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="section-label">Datos</div>
      <div className="recent">
        <div className="recent-item" onClick={onExport} style={{ cursor: 'pointer', background: 'var(--accent-glow)', borderColor: 'var(--accent)' }}>
          <Icon name="list" size={14} />
          <span className="what" style={{ color: 'var(--accent)', fontWeight: 700 }}>Descargar lista de repetidas</span>
          <Icon name="chevron" size={14} />
        </div>
        <div className="recent-item" onClick={onReset} style={{ cursor: 'pointer', background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.4)' }}>
          <Icon name="cross" size={14} />
          <span className="what" style={{ color: 'var(--missing)' }}>Resetear toda la colección</span>
          <Icon name="chevron" size={14} />
        </div>
      </div>

      <div style={{ padding: '24px 16px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', letterSpacing: '0.12em', lineHeight: 1.6 }}>
        <div>FUENTE OFICIAL · CHECKLIST PANINI/FIFA WC26</div>
        <div>980 ESTAMPAS · 112 PÁGINAS · 48 EQUIPOS × 20</div>
      </div>
      <div style={{ padding: '4px 16px 8px', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-faintest)', letterSpacing: '0.1em', display: 'flex', gap: 10 }}>
        <input ref={fileRef} type="file" accept=".json" onChange={handleRestore} style={{ display: 'none' }} />
        <span onClick={onBackup} style={{ cursor: 'pointer' }}>BACKUP</span>
        <span>·</span>
        <span onClick={() => fileRef.current && fileRef.current.click()} style={{ cursor: 'pointer' }}>RESTAURAR</span>
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}

function ListScreen({ album, coll, kind, onTap, onLongPress, onBack }) {
  const titles = { missing: 'Faltantes', dupes: 'Repetidas', have: 'Obtenidas' };
  let list = album.allStickers;
  if (kind === 'missing') list = list.filter((s) => !(coll[s.id] && coll[s.id].have));
  else if (kind === 'have') list = list.filter((s) => coll[s.id] && coll[s.id].have);
  else if (kind === 'dupes') list = list.filter((s) => coll[s.id] && coll[s.id].dupes > 0);

  return (
    <div className="main">
      <div className="page-head">
        <div className="breadcrumb">
          <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text-dim)' }}>
            <Icon name="chevronLeft" size={14} /> Más
          </button>
        </div>
        <h1 className="title">{titles[kind]}</h1>
        <div className="sub">{list.length} estampas</div>
      </div>
      <div className="sticker-list">
        {list.slice(0, 500).map((s) => (
          <StickerRow key={s.id} s={s} userData={coll[s.id]}
            onTap={onTap} onLongPress={onLongPress} />
        ))}
        {list.length === 0 && <div className="empty"><div className="icon">·</div>Vacío</div>}
        {list.length > 500 && <div className="empty">+{list.length - 500} más</div>}
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}

function SectionDetail({ album, section, coll, onTap, onLongPress, onBack }) {
  const stats = AlbumData.statsFor(section.items, coll);
  return (
    <div className="main">
      <div className="page-head">
        <div className="breadcrumb">
          <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text-dim)' }}>
            <Icon name="chevronLeft" size={14} /> Más
          </button>
          {!section.verified && <span className="unv-badge">No verificado</span>}
        </div>
        <h1 className="title">{section.name}</h1>
        <div className="sub">{section.items.length} estampas</div>
        <div className="progress-row">
          <Pbar pct={stats.pct} thick />
          <span className="pct">{stats.got}/{stats.total} · {stats.pct}%</span>
        </div>
      </div>
      {section.kind === 'extras' && (
        <div className="onb" style={{ marginTop: 16 }}>
          <div className="icon">!</div>
          <div className="body">
            <div className="title">Sin numeración oficial</div>
            <div className="desc">Las Extra Stickers son una sección separada del set base. Importa el listado oficial para poblarla.</div>
          </div>
        </div>
      )}
      <div className="sticker-list">
        {section.items.map((s) => (
          <StickerRow key={s.id} s={s} userData={coll[s.id]}
            onTap={onTap} onLongPress={onLongPress} />
        ))}
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}

// Modal: sticker details (long-press)
function StickerDetailModal({ s, userData, onClose, onSet, onEdit }) {
  if (!s) return null;
  const have = !!(userData && userData.have);
  const dupes = (userData && userData.dupes) || 0;
  return (
    <Modal open={true} onClose={onClose} title={s.code} sub={s.name + (s.foil ? ' · FOIL' : '')}>
      <div className="field">
        <label>Estado</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={"btn" + (have ? ' primary' : '')} onClick={() => onSet({ have: !have })}>
            {have ? '✓ Obtenida' : 'Marcar obtenida'}
          </button>
        </div>
      </div>
      <div className="field">
        <label>Repetidas</label>
        <div className="counter">
          <button onClick={() => onSet({ dupes: Math.max(0, dupes - 1) })}><Icon name="minus" size={14} /></button>
          <div className="val">{dupes}</div>
          <button onClick={() => onSet({ dupes: dupes + 1 })}><Icon name="plus" size={14} /></button>
        </div>
      </div>
      {!s.verified && (
        <div className="field">
          <label>Datos no verificados</label>
          <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 8 }}>
            El nombre o posición de esta estampa aún no está confirmado por el checklist oficial.
          </div>
          <button className="btn" onClick={onEdit}>Editar nombre</button>
        </div>
      )}
      <div className="actions">
        <button className="btn full" onClick={onClose}>Listo</button>
      </div>
    </Modal>
  );
}

Object.assign(window, {
  Dashboard, TeamsList, TeamDetail, MarkScreen, FindScreen,
  MoreScreen, ListScreen, SectionDetail, StickerDetailModal,
});

function relTime(ts) {
  const d = (Date.now() - ts) / 1000;
  if (d < 60) return 'ahora';
  if (d < 3600) return Math.floor(d / 60) + 'm';
  if (d < 86400) return Math.floor(d / 3600) + 'h';
  return Math.floor(d / 86400) + 'd';
}
window.relTime = relTime;
