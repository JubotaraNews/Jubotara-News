import Link from "next/link";
import Image from "next/image";
import logoImg from "@/public/images/logo4.png";

const Logo = ({ logoUrl, className = "" }) => {
  const displayLogo = logoUrl || logoImg;
  
  return (
    <Link href="/" className={`relative inline-block ${className}`}>
      <div className="flex items-center justify-center -mt-2 -ml-2 transition-transform duration-200 hover:scale-105">
        <Image
          src={displayLogo}
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
