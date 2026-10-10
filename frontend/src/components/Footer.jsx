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
    },
    {
      name: "Facebook",
      url: "https://facebook.com",
    },
    {
      name: "Pinterest",
      url: "https://pinterest.com",
    },
  ];

  return (
    <footer className="bg-[#2b211b] text-white">
      <div className="px-5 py-10 sm:px-9 md:px-12 lg:px-16">

        {/* Footer Main */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">

          {/* Brand */}
          <div>
            <Link
              to="/"
              className="text-3xl font-semibold tracking-[0.25em]"
            >
              ZELIA
            </Link>

            <p className="mt-7 max-w-[300px] text-base leading-7 text-[#f6f0e8]">
              Contemporary essentials designed for everyday style.
            </p>
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

          {/* Follow Us */}
          <div>
            <h3 className="font-serif text-sm tracking-[0.2em]">
              FOLLOW US
            </h3>

            <ul className="mt-7 space-y-4">
              {socialLinks.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-[#f6f0e8] transition-colors hover:text-[#b98b67]"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Border */}
        <div className="mt-16 border-t border-[#f6f0e8]/20 pt-8 text-center">
          <p className="text-sm text-[#f6f0e8]">
            © {new Date().getFullYear()} ZELIA. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;