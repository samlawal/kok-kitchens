/**
 * OphirCredit — the standard "Site by Ophir Digital" footer credit + support link.
 *
 * Drop this into EVERY client site we build to drive referral traffic and SEO
 * backlinks to ophirdigital.com, AND to give the client a one-click way to
 * report a problem or request a change (routes to the Ophir support hub with
 * their site pre-filled). Theme-agnostic: uses only standard Tailwind grays so
 * it renders cleanly in client repos that lack our custom brand theme.
 *
 * Usage:
 *   <OphirCredit client="kok-kitchens" />
 */

type OphirCreditProps = {
  /** 'light' for light footers (default), 'dark' for dark footers. */
  variant?: 'light' | 'dark';
  /** Client slug used to build the tracked referral link (?ref=<client>). */
  client?: string;
  /** Destination base URL. Defaults to https://ophirdigital.com. */
  href?: string;
};

/**
 * Client slug → the site name the Ophir support hub expects. MUST match the
 * names in ophir-digital/lib/monitoring/sites.ts so /support pre-selects the
 * right site in the report/request forms.
 */
const SITE_NAMES: Record<string, string> = {
  'kok-kitchens': 'KOK Kitchen',
  'lopin-ltd': 'LOPIN Ltd',
  'manahaim-gallery': 'Mahanaim Gallery',
  'obarerebites': 'ObaRereBites',
  'fide-consulting': 'Fide Consulting',
  'harrybrown': 'HarryBrown (HB&CO)',
};

export default function OphirCredit({
  variant = 'light',
  client,
  href = 'https://ophirdigital.com',
}: OphirCreditProps) {
  const ref = client ?? 'client-site';
  const url = `${href}?ref=${ref}&utm_source=client-site&utm_medium=footer`;

  const siteName = client ? SITE_NAMES[client] : undefined;
  const supportUrl = `${href}/support${siteName ? `?site=${encodeURIComponent(siteName)}` : ''}`;

  const textColor =
    variant === 'dark'
      ? 'text-slate-400 hover:text-slate-200'
      : 'text-slate-400 hover:text-slate-600';

  return (
    <div className="text-center space-y-1.5">
      <a
        href={url}
        target="_blank"
        rel="noopener"
        className={`inline-flex items-center gap-1 text-xs transition-colors ${textColor}`}
      >
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: '#D4A017' }}
        />
        Site by Ophir Digital
        <span aria-hidden="true">↗</span>
      </a>
      <div>
        <a
          href={supportUrl}
          target="_blank"
          rel="noopener"
          className={`text-[11px] transition-colors ${textColor}`}
        >
          Report an issue or request a change
        </a>
      </div>
    </div>
  );
}
