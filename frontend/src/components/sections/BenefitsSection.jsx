function BenefitsSection() {
  const benefits = [
    {
      title: 'Free Shipping',
      description: 'Free shipping on orders over ₹999.',
    },
    {
      title: 'Easy Returns',
      description: 'Simple and hassle-free returns.',
    },
    {
      title: 'Secure Payments',
      description: 'Your payments are safe and protected.',
    },
    {
      title: 'Customer Support',
      description: 'We are here to help whenever you need us.',
    },
  ]

  return (
    <section className="border-y border-[#e3d8cc] bg-white px-4 py-12 sm:px-6 sm:py-16 md:px-10 lg:px-16">
      <div className="grid grid-cols-1 gap-10 text-center sm:grid-cols-2 lg:grid-cols-4">
        
        {benefits.map((benefit) => (
          <div key={benefit.title}>
            <h3 className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#2b211b]">
              {benefit.title}
            </h3>

            <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#6f6258]">
              {benefit.description}
            </p>
          </div>
        ))}

      </div>
    </section>
  )
}

export default BenefitsSection