import Link from "next/link";
import { footerLinks } from "@/constants";
import Logo from "@/components/Logo";

function Footer() {
  return (
    <footer className="flex flex-col text-black-100 border-t-2">
      <div className="flex max-md:flex-col flex-wrap justify-between gap-5 sm:px-16 px-6 py-10 mt-10">
        <div className="flex flex-col justify-start items-start gap-6">
          <Logo />
        </div>

        <div className="footer__links">
          {footerLinks.map((link) => (
            <div key={link.title} className="footer__link">
              <h3 className="font-bold">{link.title}</h3>
              {link.links.map((item) => (
                <Link
                  key={item.title}
                  href={item.url}
                  className="text-gray-500"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end items-center border-t px-16 py-4 text-gray-500 text-sm gap-10">
        <Link href="/">Privacy Policy</Link>
        <Link href="/">Terms of Use</Link>
      </div>
    </footer>
  );
}

export default Footer;
