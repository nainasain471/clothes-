import { Link, useLocation } from "react-router-dom";
import { getCollectionGender } from "../utils/collectionRoutes";

function Footer() {
  const { pathname } = useLocation();
  const collectionGender = getCollectionGender(pathname);
  const shopLinks = [
    {
      name: "New Arrivals",
      path: collectionGender
        ? `/new-arrivals/${collectionGender}`
        : "/new-arrivals",
    },
    { name: "Men", path: "/men" },
    { name: "Women", path: "/women" },
    { name: "Clothing", path: collectionGender ? `/${collectionGender}` : "/shop" },
    { name: "Sale", path: "/sale" },
  ].filter((link) => {
    if (!collectionGender) return true
    if (link.name === "Men" || link.name === "Women") {
      return link.name.toLowerCase() === collectionGender
    }
    return link.name !== "Sale" || collectionGender === "men"
  });

  const helpLinks = [
    { name: "Contact Us", path: "/contact" },
    { name: "Shipping & Delivery", path: "/shipping" },
    { name: "Returns & Exchanges", path: "/returns" },
    { name: "FAQs", path: "/faqs" },
    { name: "Privacy Policy", path: "/privacy-policy" },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      url: "https://instagram.com",
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      url: "https://facebook.com",
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
          <path d="M13.4 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.5 1.6-1.5h1.7V3.2c-.3 0-1.3-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3v2.3H7.2v3.2H10V21h3.4Z" />
        </svg>
      ),
    },
    {
      name: "Pinterest",
      url: "https://pinterest.com",
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
          <path d="M12 2a10 10 0 0 0-3.65 19.31c-.02-.78 0-1.72.2-2.57l1.34-5.67s-.33-.66-.33-1.64c0-1.54.9-2.69 2.01-2.69.95 0 1.4.71 1.4 1.56 0 .95-.6 2.37-.91 3.69-.26 1.1.55 2 1.63 2 1.96 0 3.28-2.52 3.28-5.5 0-2.27-1.53-3.97-4.32-3.97-3.15 0-5.11 2.35-5.11 4.98 0 .91.27 1.55.7 2.05.2.23.22.32.15.58l-.21.85c-.07.27-.28.36-.51.26-1.45-.59-2.12-2.17-2.12-3.95 0-2.94 2.48-6.46 7.4-6.46 3.95 0 6.55 2.86 6.55 5.93 0 4.06-2.26 7.1-5.6 7.1-1.12 0-2.17-.61-2.53-1.3l-.73 2.9c-.22.88-.66 1.76-1.06 2.45A10 10 0 1 0 12 2Z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-[#2b211b] text-white">
      <div className="px-5 py-10 sm:px-9 md:px-12 lg:px-16">

        {/* Footer Main */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-10 lg:grid-cols-3">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="text-3xl font-semibold tracking-[0.25em]"
            >
              ZELIA
            </Link>

            <p className="mt-7 max-w-[300px] text-base leading-7 text-[#f6f0e8]">
              Contemporary essentials designed for everyday style.
            </p>

            <ul className="mt-5 flex items-center gap-4">
              {socialLinks.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ZELIA on ${social.name}`}
                    title={social.name}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-[#f6f0e8] transition-colors hover:border-[#b98b67] hover:text-[#b98b67] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98b67]"
                  >
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-serif text-sm tracking-[0.2em]">
              SHOP
            </h3>

            <ul className="mt-7 space-y-4">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-base text-[#f6f0e8] transition-colors hover:text-[#b98b67]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-serif text-sm tracking-[0.2em]">
              HELP
            </h3>

            <ul className="mt-7 space-y-4">
              {helpLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-base text-[#f6f0e8] transition-colors hover:text-[#b98b67]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Border */}
        <div className="mt-16 border-t border-[#f6f0e8]/20 pt-8 text-center">
          <p className="text-sm text-[#f6f0e8]">
            © {new Date().getFullYear()}. Designed for everyday style.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;