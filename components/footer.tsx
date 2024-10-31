import Image from "next/image";
import Link from "next/link";

export const Footer = () => (
  <footer className="bg-background h-16 flex items-center border-t w-full">
    <div className="flex items-center justify-around px-20 md:px-6 w-full">
      <div className="">
        <Link
          href="#"
          className="flex items-center text-lg font-bold"
          prefetch={false}
        >
          <Image
            src="/logo.png"
            alt="Chicken Near Me Logo"
            className="h-10 w-10"
            height={500}
            width={500}
          />
          Chicken Near Me
        </Link>
      </div>

      <nav className="flex items-center flex-wrap space-x-4 text-sm  justify-end">
        <Link href="#" className="hover:underline" prefetch={false}>
          About
        </Link>
        <Link href="#" className="hover:underline" prefetch={false}>
          Contact
        </Link>
        <Link href="#" className="hover:underline" prefetch={false}>
          Privacy Policy
        </Link>
        <Link href="#" className="hover:underline" prefetch={false}>
          Terms
        </Link>
      </nav>
    </div>
  </footer>
);
