import { Link } from 'react-router-dom'

function HeroButtons() {
  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <Link
        to="/women"
        className="w-full bg-[#6b4f3a] px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#b98b67] sm:w-auto"
      >
        Shop Women
      </Link>

      <Link
        to="/men"
        className="w-full border border-[#6b4f3a] px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#6b4f3a] transition-colors hover:border-[#b98b67] hover:bg-[#b98b67] hover:text-white sm:w-auto"
      >
        Shop Men
      </Link>
    </div>
  )
}

export default HeroButtons