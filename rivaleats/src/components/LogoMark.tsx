import Image from "next/image";

/**
 * Displays the provided Rival Eats logo if present in /public, otherwise
 * falls back to a simple branded circle.
 */
export function LogoMark() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-full border border-charcoal bg-ink text-white">
      <Image
        src="/rival-eats-logo.png"
        alt="Rival Eats logo"
        fill
        sizes="64px"
        className="object-contain"
        priority
        unoptimized
      />
      <span className="sr-only">Rival Eats</span>
    </div>
  );
}
