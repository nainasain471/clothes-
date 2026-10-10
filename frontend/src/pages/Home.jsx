import HeroSection from '../components/Hero/HeroSection'
import NewArrivals from '../components/sections/NewArrivals'
import ShopWomen from '../components/sections/ShopWomen'
import ShopMen from '../components/sections/ShopMen'
import BestSellers from '../components/sections/BestSellers'
import FeaturedCollection from '../components/sections/FeaturedCollection'
import EditorialSection from '../components/sections/EditorialSection'
import BenefitsSection from '../components/sections/BenefitsSection'
import Newsletter from '../components/Newsletter'

function Home() {
  return (
    <div>
      <HeroSection />
      <NewArrivals />
      <ShopWomen />
      <ShopMen />
      <BestSellers />
      <FeaturedCollection />
      <EditorialSection />
      <BenefitsSection />
      <Newsletter />
    </div>
  )
}

export default Home