import Link from "next/link";
import Image from "next/image";
import logoImg from "@/public/images/logo4.png";

const Logo = () => {
  // console.log('logoUrl', logoUrl)
  return (
    <Link href="/" className="relative z-60">
      <div className="flex items-center justify-center -mt-2 -ml-2 transition-transform duration-200 hover:scale-105">
        <Image
          src={logoImg}
          alt="Jubotara Logo"
          width={160}
          height={70}
          priority
          className="object-contain"
        />
      </div>
    </Link>
  );
};

export default Logo;
