/**
 * OphirCredit — the standard "Site by Ophir Digital" footer credit.
 *
 * Drop this into EVERY client site we build to drive referral traffic and SEO
 * backlinks to ophirdigital.com. Theme-agnostic: uses only standard Tailwind
 * grays so it renders cleanly in client repos that lack our custom brand theme.
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

export default function OphirCredit({
  variant = 'light',
  client,
  href = 'https://ophirdigital.com',
}: OphirCreditProps) {
  const ref = client ?? 'client-site';
  const url = `${href}?ref=${ref}&utm_source=client-site&utm_medium=footer`;

  const textColor =
    variant === 'dark'
      ? 'text-slate-400 hover:text-slate-200'
      : 'text-slate-400 hover:text-slate-600';

  return (
    <div className="text-center">
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
    </div>
  );
}
