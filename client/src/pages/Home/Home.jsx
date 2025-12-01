import { useAuth } from "../../context/auth";
import ScrollToTopOnRouteChange from "../../utils/ScrollToTopOnRouteChange";
// import Categories from "../../components/header/Categories"; 
import Banner from "./Banner/Banner";
import DealSlider from "./DealSlider/DealSlider";
import ProductSlider from "./ProductsListing/ProductSlider";
import { electronicProducts } from "../../utils/electronics";
import { accessories } from "../../utils/accessories";
import { fashionProducts } from "../../utils/fashion";
import { applianceProducts } from "../../utils/appliances";
import { furnitureProducts } from "../../utils/furniture";
import electronics from "../../assets/images/electronics-card.jpg";
import accessoryCard from "../../assets/images/accessory-card.jpg";
import fashionCard from "../../assets/images/fashion-card.jpg";
import applianceCard from "../../assets/images/appliance-card.jpg";
import ourstory from "../../assets/images/ourstoryImage.jpg";
import Suggestion from "./Suggestions/Suggestion";
import SeoData from "../../SEO/SeoData";
import CategoryShowcase from "./categoryShowcase";
import ProductCarousel from "./ProductCarousel";
import FeaturedCollections from "../../components/FeatureCollection";
import FeaturedProducts from "../../components/FeaturedProducts";
import BrandStory from "../../components/BrandStory";
import WhyChooseUs from "../../components/WhyChooseUs"; 
import LifestyleBanner from "../../components/LifestyleBanner";
import Newsletter from "../../components/Newsletter";
import Testimonials from "../../components/Testimonials";

const Home = () => {
    return (
        <>
            <SeoData title="The Bright Rose" />
            <ScrollToTopOnRouteChange />
            {/* <Categories /> */}
           <main className="flex flex-col items-center gap-6 pb-10 bg-pureWhite text-neutralDark">

    <Banner />

    <FeaturedCollections
        title="Explore Our Collections"
        subtitle="Discover timeless pieces crafted for modern living"
        categories={electronicProducts}
    />

    {/* <BrandStory
        title="Our Story"
        description1="Bright Rose is an endeavor to bring back Indian Handloom so that we can clothe the world once again in a natural way through the beauty of INTRICATE WEAVES."
        description2="Rose is known as the Queen of Flowers for its intricate petal structure, wide spectrum of colors, and diverse forms. Similarly, our garments reflect intricate weaves, vibrant and bold hues, and a variety of weaves, each with its own distinctive character, just like you."
        description3="Our knowledge of weaving is often deeply valued within families and seen as a time-honored tradition. Some skilled artisans become masters of the craft to the point where they can weave with their eyes closed - as quoted by Master weaver, Chand from Varanasi.
"
        imageUrl={ourstory}
        learnMoreLink="/ourheritage"
    /> */}

     
    <section className="w-full bg-white py-2 md:py-10 px-4 md:px-10 lg:px-10 select-none">

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-5 items-center">

        {/* LEFT SIDE — Modern Fashion Vertical Title + Text */}
        <div className="relative">

          {/* Vertical Title */}
          <div className="absolute -left-15 -top-5 hidden md:block">
            <p className="text-[13px] tracking-[0.35em] text-neutral-700 rotate-180 writing-vertical-rl uppercase">
              Our Story
            </p>
          </div>

          {/* Main Text */}
          <h2 className="text-xl md:text-4xl font-light tracking-wide text-neutral-900 leading-tight mb-6">
            Bright Rose • <br className="hidden md:block" />
            A Journey Woven in Tradition
          </h2>

          <div className="space-y-6 text-neutral-700 text-justify text-[13px] md:text-[15px] leading-relaxed">
            <p>
              Bright Rose is an endeavor to bring back Indian Handloom so that we can 
              clothe the world once again in a natural way through the beauty of 
              <span className="font-medium"> intricate weaves.</span>
            </p>

            <p>
              Just as a rose — the Queen of Flowers — carries layers of petals, bold hues, 
              and striking forms, our garments mirror the same essence: 
              <span className="font-medium"> intricate craftsmanship, vibrant palettes,</span> 
              and the authenticity of India’s rich weaving heritage.
            </p>

            <p className="tracking-wide font-medium text-neutral-800 uppercase pt-2">
              Bright Rose • Artisan Made in India
            </p>

            <blockquote className="text-neutral-600 italic text-justify border-l-4 border-neutral-300 pl-5 py-3 text-[12px] md:text-[15px] leading-relaxed">
              "Our knowledge of weaving is deeply valued within families and preserved 
              through generations. Some artisans weave with such mastery that their hands 
              move as if guided by instinct alone."
              <br />
              <span className="not-italic font-medium text-neutral-800 block mt-2">
                — Master Weaver, Chand from Varanasi
              </span>
            </blockquote>
          </div>

          {/* Button */}
          <button href="/ourheritage" className="mt-10 px-8 py-3 border border-neutral-900 rounded-md text-sm tracking-wide hover:bg-neutral-900 hover:text-white transition-all duration-300">
            Discover Our World
          </button>
        </div>

        {/* RIGHT SIDE — Luxe Dual Image Collage */}
        <div className="relative">

          {/* Top Image */}
          <div className="w-full h-[380px] md:h-[460px] rounded-3xl overflow-hidden shadow-md mb-8">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e"
              className="w-full h-full object-cover transform hover:scale-110 transition-all duration-[1.4s]"
            />
          </div>

          {/* Bottom Smaller Image */}
          <div className="w-[75%] h-[230px] md:h-[280px] rounded-3xl overflow-hidden shadow-md ml-auto">
            <img
              src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c"
              className="w-full h-full object-cover transform hover:scale-110 transition-all duration-[1.4s]"
            />
          </div>

          {/* Soft gradient overlay */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white/10 to-transparent"></div>
        </div>

      </div>
    </section>



    <FeaturedProducts
        title="BESTSELLERS"
        subtitle="Our most-loved products, handpicked for you"
        products={fashionProducts}
    />

    <WhyChooseUs />

    <LifestyleBanner
        title="The Red Gold Edit — Luxury with Simplicity"
        subtitle="Experience the elegance of handloom fashion reimagined..."
        buttonText="Explore the Look"
        buttonLink="/collections"
        imageUrl="../../src/assets/images/lifestyle.jpg"
    />

    {/* <Testimonials /> */}
        {/* <ProductCard
            title="Sample Product"
            product={fashionProducts[0]}
           
        /> */}
                {/* <CategoryShowcase /> */}
                {/* <ProductCarousel/> */}

                {/* <DealSlider title={"Discounts for You"} /> */}
                {/* <ProductSlider      
                    title={"New Arrivals"}
                    products={electronicProducts}
                    logo={electronics}
                /> */}
                {/* <ProductSlider
                    title={"Beauty, Toys & More"}
                    products={accessories}
                    logo={accessoryCard}
                /> */}
                {/* <Suggestion
                    title={"Suggested for You"}
                    tagline={"Based on Your Activity"}
                />
                <ProductSlider
                    title={"Fashion Top Deals"}
                    products={fashionProducts}
                    logo={fashionCard}
                />
                <ProductSlider
                    title={"TVs & Appliances"}
                    products={applianceProducts}
                    logo={applianceCard}
                />
                <ProductSlider
                    title={"Furniture & More"}
                    products={furnitureProducts}
                    logo={furnitureCard}
                /> */}
            </main>
        </>
    );
};

export default Home;
