import Image from "next/image";

export default function LogoCss() {
  return (
    // ... existing code ...
    <div className="flex justify-between items-center m-1 mb-1">
      {/* Logo Sportstips com Tailwind */}

      <Image
        src="/images/logo2.png"
        alt="Logo"
        className="w-full h-[40px] object-cover scale-[6]"
        width={100}
        height={50}
      />
    </div>
    // ... existing code ...
  );
}
