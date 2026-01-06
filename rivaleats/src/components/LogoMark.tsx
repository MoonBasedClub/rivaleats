import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";

const logoPath = path.join(process.cwd(), "public", "rival-eats-logo.png");
const hasLogo = existsSync(logoPath);

export function LogoMark() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-full border border-charcoal bg-ink text-white">
      {hasLogo ? (
        <Image
          src="/rival-eats-logo.png"
          alt="Rival Eats logo"
          fill
          sizes="64px"
          className="object-contain"
          priority
          unoptimized
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-brand-red text-cream">
          <span className="display text-xs font-semibold tracking-[0.3em]">
            RE
          </span>
        </div>
      )}
      <span className="sr-only">Rival Eats</span>
    </div>
  );
}
