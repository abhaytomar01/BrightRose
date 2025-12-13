import { useAuth } from "../../context/auth";
import ScrollToTopOnRouteChange from "../../utils/ScrollToTopOnRouteChange";
// import Categories from "../../components/header/Categories"; 
import Banner from "./Banner/Banner";
import { electronicProducts } from "../../utils/electronics";
import { fashionProducts } from "../../utils/fashion";
import SeoData from "../../SEO/SeoData";
import FeaturedCollections from "../../components/FeatureCollection";
import FeaturedProducts from "../../components/FeaturedProducts";
import WhyChooseUs from "../../components/WhyChooseUs"; 
import LifestyleBanner from "../../components/LifestyleBanner";
import brightrosehome from "../../assets/Kanchipuram/Brightrosehome.jpg";
const Home = () => {
    return (
        <>
            <SeoData
  title="Bright Rose – Luxury Handloom Couture | Kanchipuram Silk | Artisanal Wear"
  description="Bright Rose revives Indian handloom craftsmanship with luxurious Kanchipuram silk jackets, capes, and artisanal couture crafted by master weavers."
  keywords={[
    "handloom couture",
    "Kanchipuram silk",
    "luxury womenswear",
    "artisanal clothing",
    "designer jacket dresses",
    "handwoven fashion",
    "pure silk certified"
  ]}
  image="/og-image-home.jpg"
  url="/"
/>

            <ScrollToTopOnRouteChange />
            {/* <Categories /> */}
           <main className="flex flex-col items-center gap-6 pb-10 bg-pureWhite text-neutralDark">

    <Banner />

    <FeaturedCollections
        title="Explore Our Collections"
        subtitle="Discover timeless pieces crafted for modern living"
        
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

     
    <section className="w-full bg-gradient-to-b from-[#faf8f6] via-white to-[#f8f6f4] py-10 md:py-20 px-5 md:px-10 lg:px-20 select-none">

  <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">

    {/* LEFT SIDE — LUXURY TEXT BLOCK */}
    <div
      className="relative animate-fadeIn"
      style={{ animationDuration: "1.2s" }}
    >

      {/* Vertical Title */}
      <div className="absolute left-4 -top-4 hidden md:block opacity-80">
        <p className="text-[11px] tracking-[0.4em] text-neutral-600 rotate-180 writing-vertical-rl uppercase">
          Our Story
        </p>
      </div>

      {/* Luxury Heading */}
      <h2 className="text-[28px] sm:text-[34px] md:text-[42px] font-light text-neutral-900 leading-tight mb-6">
        <span className="border-l-4 border-[#bca47c] pl-4">
          Bright Rose •
          <br className="hidden md:block" />
          A Journey Woven in Tradition
        </span>
      </h2>

      {/* PARAGRAPHS */}
      <div className="space-y-6 text-neutral-700 text-[14px] md:text-[16px] leading-relaxed font-light">

        <p>
          Bright Rose is an endeavor to bring back Indian Handloom so that we can
          clothe the world once again in a natural way through the beauty of
          <span className="font-medium text-neutral-900"> intricate weaves.</span>
        </p>

        <p>
          Just as a rose — the Queen of Flowers — carries layers of petals, bold hues,
          and striking forms, our garments mirror the same essence:
          <span className="font-medium text-neutral-900">
            {" "}
            intricate craftsmanship, vibrant palettes,
          </span>
          and the authenticity of India's rich weaving heritage.
        </p>

        <p className="tracking-wide font-medium text-neutral-800 uppercase text-[13px]">
          Bright Rose • Artisan Made in India
        </p>

        {/* Quote Block */}
        <blockquote className="border-l-4 border-[#d8c7a0] pl-5 bg-white/60 py-4 rounded-md shadow-sm italic text-neutral-700">
          “Our knowledge of weaving is deeply valued within families and preserved
          through generations. Some artisans weave with such mastery that their hands
          move as if guided by instinct alone.”
          <br />
          <span className="not-italic font-medium text-neutral-900 block mt-3">
            — Rajeev Yadav
          </span>
        </blockquote>
      </div>

      {/* CTA BUTTON */}
      <button href="/products" className="mt-10 px-8 py-3 border border-neutral-900 rounded-full text-sm tracking-wide hover:bg-neutral-900 hover:text-white transition-all duration-300">
        Discover Our World
      </button>
    </div>

    {/* RIGHT SIDE — LUXURY IMAGE STACK */}
    <div className="relative animate-fadeInUp" style={{ animationDuration: "1.2s" }}>

      {/* Main Image */}
      <div className="w-full h-[360px] md:h-[450px] rounded-3xl overflow-hidden shadow-lg">
        <img
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e"
          className="w-full h-full object-cover transition-transform duration-[1.4s] hover:scale-110"
        />
      </div>

      {/* Small Second Image */}
      <div className="w-[75%] h-[220px] md:h-[260px] rounded-3xl overflow-hidden shadow-lg ml-auto mt-8">
        <img
          src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c"
          className="w-full h-full object-cover transition-transform duration-[1.4s] hover:scale-110"
        />
      </div>

      {/* Light Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white/20 to-transparent"></div>
    </div>

  </div>

  {/* Keyframe Animations */}
  <style>{`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn { animation: fadeIn ease forwards; }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(35px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeInUp { animation: fadeInUp ease forwards; }
  `}</style>

</section>




    <FeaturedProducts
        title="BESTSELLERS"
        subtitle="Our most-loved products, handpicked for you"
    />

    <WhyChooseUs />

    <LifestyleBanner
        title="The Ruby Red Edit — Luxury with Simplicity"
        subtitle="Experience the elegance of handloom fashion reimagined..."
        buttonText="Explore the Look"
        buttonLink="product/692d33e2c95fc6c18d3609b7"
        imageUrl={brightrosehome}
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
