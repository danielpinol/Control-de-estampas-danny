/* ============ UI primitives + shared components ============ */

const Icon = ({ name, size = 20 }) => {
  const stroke = "currentColor";
  const sw = 1.6;
  const paths = {
    home: <><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    cross: <><path d="M6 6l12 12M18 6L6 18" /></>,
    chevron: <path d="m9 6 6 6-6 6" />,
    chevronLeft: <path d="m15 6-6 6 6 6" />,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    minus: <path d="M5 12h14" />,
    check: <path d="m5 12 5 5 9-10" />,
    list: <><path d="M8 6h13M8 12h13M8 18h13" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></>,
    flame: <path d="M12 3s4 5 4 9a4 4 0 0 1-8 0c0-2 1-3 1-3s2 2 2 4c0-3 1-7 1-10z" />,
    swap: <><path d="m7 3 3 3-3 3" /><path d="M3 6h10" /><path d="m17 21-3-3 3-3" /><path d="M21 18H11" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></>,
    upload: <><path d="M12 16V4M6 10l6-6 6 6" /><path d="M4 20h16" /></>,
    filter: <path d="M4 5h16l-6 8v6l-4-2v-4z" />,
    star: <path d="m12 3 2.5 5.5L20 9.5l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1z" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

function Pbar({ pct, thick, thin }) {
  const cls = "pbar" + (thick ? " thick" : "") + (thin ? " thin" : "");
  return (
    <div className={cls}>
      <div className="pbar-fill" style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
    </div>
  );
}

function Header({ title, sub, left, right }) {
  return (
    <header className="hdr">
      {left}
      <div className="hdr-title">
        <span>{title}</span>
        {sub && <span className="hdr-sub">{sub}</span>}
      </div>
      {right}
    </header>
  );
}

function BottomNav({ tab, onTab }) {
  const items = [
    { id: 'home',   label: 'Home',     icon: 'home' },
    { id: 'teams',  label: 'Equipos',  icon: 'grid' },
    { id: 'mark',   label: 'Marcar',   icon: 'flame' },
    { id: 'find',   label: 'Buscar',   icon: 'search' },
    { id: 'more',   label: 'Más',      icon: 'list' },
  ];
  return (
    <nav className="nav">
      {items.map((it) => (
        <button key={it.id}
          className={"nav-item" + (tab === it.id ? " active" : "")}
          onClick={() => onTab(it.id)}>
          <Icon name={it.icon} size={20} />
          <span>{it.label}</span>
        </button>
      ))}
    </nav>
  );
}

function StickerRow({ s, userData, onTap, onLongPress }) {
  const ref = React.useRef(null);
  const timer = React.useRef(null);
  const fired = React.useRef(false);
  const have = !!(userData && userData.have);
  const dupes = (userData && userData.dupes) || 0;

  const start = (e) => {
    e.stopPropagation();
    fired.current = false;
    timer.current = setTimeout(() => {
      fired.current = true;
      onLongPress(s);
      if (navigator.vibrate) navigator.vibrate(20);
    }, 450);
  };
  const cancel = () => { if (timer.current) clearTimeout(timer.current); };
  const release = (e) => {
    e.stopPropagation();
    if (timer.current) clearTimeout(timer.current);
    if (!fired.current) onTap(s);
  };

  return (
    <div ref={ref}
      className="srow"
      data-have={have ? 1 : 0}
      onContextMenu={(e) => { e.preventDefault(); }}>
      <div className="code">{s.code}</div>
      <div className="name">
        <span className="name-text">{s.name}</span>
        {s.foil && <span className="foil-pip">FOIL</span>}
        {!s.verified && <span className="unv-badge">?</span>}
      </div>
      <div className="badges">
        {dupes > 0 && <span className="dupe-count">×{dupes}</span>}
      </div>
      <div className="state"
        onPointerDown={start}
        onPointerUp={release}
        onPointerLeave={cancel}
        onPointerCancel={cancel}
        style={{ touchAction: 'none', cursor: 'pointer' }} />
    </div>
  );
}

function Modal({ open, onClose, children, title, sub }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog">
        {title && <h3>{title}</h3>}
        {sub && <div className="sub">{sub}</div>}
        {children}
      </div>
    </div>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return <div className="toast">{message}</div>;
}

function InstallBanner({ onDismiss }) {
  const ua = navigator.userAgent || '';
  const isIOS = /iPhone|iPad|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);
  if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) return null;
  if (!isIOS && !isAndroid) return null;
  return (
    <div className="install-banner">
      <div className="install-banner-inner">
        <div className="install-banner-text">
          <div className="install-banner-title">Instala la app en tu celular</div>
          {isIOS
            ? <div className="install-banner-desc">Tocá <strong>Compartir</strong> (el ícono de la flecha abajo) → <strong>"Agregar al inicio"</strong></div>
            : <div className="install-banner-desc">Tocá el menú <strong>⋮</strong> de Chrome → <strong>"Agregar a pantalla de inicio"</strong></div>
          }
        </div>
        <button className="install-banner-close" onClick={onDismiss}>✕</button>
      </div>
    </div>
  );
}

Object.assign(window, { Icon, Pbar, Header, BottomNav, StickerRow, Modal, Toast, InstallBanner });
