import { Link, useParams } from 'react-router-dom'

const pages = {
  contact: {
    eyebrow: 'We are here to help',
    title: 'Contact ZELIA',
    intro:
      'Need help finding something? Start with the frequently asked questions while we set up a direct customer-support contact channel.',
    sections: [
      {
        title: 'Customer support',
        body:
          'A support email address or contact form has not been configured for this store yet. We do not want to show you a made-up address or pretend a message has been sent.',
      },
      {
        title: 'Find an answer',
        body:
          'For help with browsing, sizes, your bag, or the current checkout experience, visit our FAQs.',
        link: { label: 'Browse FAQs', to: '/faqs' },
      },
    ],
  },
  shipping: {
    eyebrow: 'Delivery information',
    title: 'Shipping & Delivery',
    intro:
      'Here is what the current ZELIA storefront shows about delivery.',
    sections: [
      {
        title: 'Shipping charges',
        body:
          'The shopping bag currently displays free shipping. Any delivery charge or order total shown in your bag and checkout is the information to use for your current session.',
      },
      {
        title: 'Delivery estimates',
        body:
          'Delivery locations, dispatch timelines, and tracking are not connected to a fulfilment service in this storefront, so we cannot provide a delivery estimate or tracking number here.',
      },
      {
        title: 'Checkout',
        body:
          'The checkout page is a frontend demonstration and does not submit or fulfil a real order. Please do not enter sensitive payment information.',
      },
    ],
  },
  returns: {
    eyebrow: 'Our store information',
    title: 'Returns & Exchanges',
    intro:
      'We want return information to be clear before you buy.',
    sections: [
      {
        title: 'Current return process',
        body:
          'Returns and exchanges are not currently connected to an order-management or support service in this storefront. No return window, eligibility rule, or refund timeline has been set, so we cannot promise one.',
      },
      {
        title: 'Need assistance?',
        body:
          'A direct customer-support address has not been configured yet. Visit the FAQs for details about the current demo shopping experience.',
        link: { label: 'Read FAQs', to: '/faqs' },
      },
    ],
  },
  faqs: {
    eyebrow: 'A few useful details',
    title: 'Frequently Asked Questions',
    intro:
      'Answers about what you can do in the current ZELIA storefront.',
    questions: [
      {
        question: 'Can I browse products by collection?',
        answer:
          'Yes. Use New In, Men, Women, and Sale in the navigation to open collections and categories. Collection pages include category filters and sorting.',
      },
      {
        question: 'How do I save a product?',
        answer:
          'Select the heart on a product card or product page to add it to your wishlist. Wishlist and bag contents currently live in the page session and are not connected to an account or saved between visits.',
      },
      {
        question: 'Which payment method is shown?',
        answer:
          'The checkout demonstration currently shows Cash on Delivery. Checkout does not submit a real order, and no payment details should be entered.',
      },
      {
        question: 'Can I track an order or request a return?',
        answer:
          'Order submission, shipment tracking, returns, and exchanges are not connected to backend services in this storefront yet.',
      },
      {
        question: 'How can I contact customer support?',
        answer:
          'A customer-support email address or contact form has not been configured yet. The Contact page explains the current options.',
      },
    ],
  },
  privacy: {
    eyebrow: 'Your information',
    title: 'Privacy Policy',
    intro:
      'This page describes the current behavior of this ZELIA frontend demonstration, not a production privacy program.',
    sections: [
      {
        title: 'Information you enter',
        body:
          'The account, registration, search, newsletter, and checkout screens are frontend interfaces and are not connected to a server for submitting their form data.',
      },
      {
        title: 'Shopping bag and wishlist',
        body:
          'Bag and wishlist data are held in in-memory application state. They are not currently saved to an account or browser storage and may clear when you leave or refresh the site.',
      },
      {
        title: 'Payments and orders',
        body:
          'This frontend does not process payments, create real orders, or provide shipment tracking. Do not enter sensitive payment information.',
      },
      {
        title: 'Questions',
        body:
          'A privacy contact has not been configured yet. Contact information will be added here when the store has an official support channel.',
      },
    ],
  },
}

function InformationPage() {
  const { page, platform } = useParams()
  const socialChannels = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    pinterest: 'Pinterest',
  }
  const socialName = platform ? socialChannels[platform] : null
  const content = pages[page]

  if (platform && !socialName) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-4xl">Social page not found</h1>
        <Link to="/" className="mt-6 inline-block underline underline-offset-4">
          Return to ZELIA
        </Link>
      </main>
    )
  }

  if (socialName) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-6 py-16 text-center md:px-10">
        <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.24em] text-[#6f6258]">
          Follow ZELIA
        </p>
        <h1 className="text-4xl font-normal tracking-tight text-[#2b211b] md:text-6xl">
          Find us on {socialName}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#6f6258] md:text-base">
          Our official {socialName} profile link has not been added yet. This
          page is ready for the ZELIA social link when it becomes available.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-block bg-[#6b4f3a] px-7 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#b98b67]"
        >
          Explore the collection
        </Link>
      </main>
    )
  }

  if (!content) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-4xl">Page not found</h1>
        <Link to="/" className="mt-6 inline-block underline underline-offset-4">
          Return to ZELIA
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-[60vh] max-w-5xl px-6 py-16 md:px-10 md:py-24">
      <header className="mx-auto max-w-3xl border-b border-[#e3d8cc] pb-10 text-center">
        <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.24em] text-[#6f6258]">
          {content.eyebrow}
        </p>
        <h1 className="text-4xl font-normal tracking-tight text-[#2b211b] md:text-6xl">
          {content.title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#6f6258] md:text-base">
          {content.intro}
        </p>
      </header>

      {content.questions ? (
        <section className="mx-auto max-w-3xl divide-y divide-[#e3d8cc]">
          {content.questions.map((item) => (
            <details key={item.question} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-medium text-[#2b211b]">
                {item.question}
                <span
                  aria-hidden="true"
                  className="text-xl text-[#6f6258] transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-2xl pt-4 text-sm leading-7 text-[#6f6258]">
                {item.answer}
              </p>
            </details>
          ))}
        </section>
      ) : (
        <section className="mx-auto max-w-3xl divide-y divide-[#e3d8cc]">
          {content.sections.map((section) => (
            <article key={section.title} className="py-7">
              <h2 className="text-2xl font-normal text-[#2b211b]">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#6f6258]">
                {section.body}
              </p>
              {section.link && (
                <Link
                  to={section.link.to}
                  className="mt-4 inline-block border-b border-[#6b4f3a] pb-1 text-xs font-medium uppercase tracking-[0.12em] text-[#6b4f3a] transition-colors hover:border-[#b98b67] hover:text-[#b98b67]"
                >
                  {section.link.label}
                </Link>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  )
}

export default InformationPage
