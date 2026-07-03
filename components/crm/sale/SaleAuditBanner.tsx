import { TIERS } from '@/lib/crm/sale/constants';
import type { AuditResult } from '@/lib/crm/sale/engine';
import { fmtD } from '@/lib/crm/sale/engine';

export default function SaleAuditBanner({ audit }: { audit: AuditResult }) {
  if (audit.lvl === 'none') return null;

  const chips = (
    <>
      {audit.bd.wd > 0 && <span className="bd-chip">{audit.bd.wd} đêm Thường</span>}
      {audit.bd.sat > 0 && <span className="bd-chip">{audit.bd.sat} đêm T7</span>}
      {audit.bd.hol > 0 && <span className="bd-chip">{audit.bd.hol} đêm Lễ/Tết</span>}
    </>
  );

  if (audit.lvl === 'info') {
    return (
      <div className="cal-audit info">
        <span className="ttl">Lịch chưa đủ thông tin</span>
        {audit.w[0]}
      </div>
    );
  }

  if (audit.lvl === 'ok') {
    return (
      <div className="cal-audit ok">
        <span className="ttl">✓ Mức giá khớp với lịch</span>
        {chips}
      </div>
    );
  }

  return (
    <div className="cal-audit warn">
      <span className="ttl">⚠ Kiểm tra lại mức giá theo lịch</span>
      {chips}
      <ul>
        {audit.w.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    </div>
  );
}

export function TierChips({
  itemId,
  cart,
}: {
  itemId: string;
  cart: Record<string, number>;
}) {
  const chips: string[] = [];
  (['wd', 'sat', 'hol'] as const).forEach((t) => {
    const n = cart[itemId + '@' + t] || 0;
    if (n > 0) chips.push(`${TIERS[t]} × ${n} đêm`);
  });
  if (!chips.length) return null;
  return (
    <div className="ci-chips">
      {chips.map((c) => (
        <span key={c} className="tier-chip">
          {c}
        </span>
      ))}
    </div>
  );
}
