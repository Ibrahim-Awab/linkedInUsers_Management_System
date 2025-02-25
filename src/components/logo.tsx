import darkLogo from "@/assets/logos/InBug-Black.png";
import logo from "@/assets/logos/InBug-White.png";
import Image from "next/image";

export function Logo() {
  return (
    <div className="relative h-12 max-w-[3.847rem]">
      <Image
        src={logo}
        fill
        className="dark:hidden"
        alt="NextAdmin logo"
        role="presentation"
        quality={100}
      />

      <Image
        src={darkLogo}
        fill
        className="hidden dark:block"
        alt="NextAdmin logo"
        role="presentation"
        quality={100}
      />
    </div>
  );
}
