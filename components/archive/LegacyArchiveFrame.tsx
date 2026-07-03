'use client';

export default function LegacyArchiveFrame({ title, html }: { title: string; html: string }) {
  return (
    <div style={{ minHeight: '100vh' }}>
      <div
        style={{
          padding: '8px 14px',
          background: '#1e3320',
          color: '#ddecd4',
          fontSize: 12,
          fontFamily: 'system-ui',
        }}
      >
        <a href="/" style={{ color: '#B8965A', marginRight: 12 }}>← Maida</a>
        {title} <span style={{ opacity: 0.6 }}>(archive)</span>
      </div>
      <iframe
        title={title}
        srcDoc={html}
        style={{ width: '100%', minHeight: 'calc(100vh - 36px)', border: 'none' }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
}
