import { useAuth } from "../../context/auth";
import ScrollToTopOnRouteChange from "../../utils/ScrollToTopOnRouteChange";
// import Categories from "../../components/header/Categories"; 
import Banner from "./Banner/Banner";
import { electronicProducts } from "../../utils/electronics";
import { fashionProducts } from "../../utils/fashion";
import SeoData from "../../SEO/SeoData";
import FeaturedCollections from "../../components/FeatureCollection";
import FeaturedStyle from "../../components/FeatureStyle";
import FeaturedProducts from "../../components/FeaturedProducts";
import WhyChooseUs from "../../components/WhyChooseUs"; 
import LifestyleBanner from "../../components/LifestyleBanner";
import brightrosehome from "../../assets/Kanchipuram/Brightrosehome.jpg";
import abouthomeimage from "../../assets/images/abouthomeimage.jpg";
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
     <FeaturedStyle
        title="Shop By Style"
        subtitle="Discover timeless pieces crafted for modern living"
        
    />

    <FeaturedCollections
        title="Shop By Weave"
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

    <section className="relative w-full overflow-hidden">

  {/* BACKGROUND IMAGE */}
  <img
    src={abouthomeimage}
    alt="Bright Rose Story"
    className="
      absolute inset-0
      w-full h-full 
      object-cover
      object-[65%_center]
      md:object-center
    "
  />

  {/* DARK OVERLAY (luxury tone) */}
  <div
    className="
      absolute inset-0
      bg-[rgba(0,0,0,0.55)]
      md:bg-[rgba(0,0,0,0.45)]
    "
  />

  {/* CONTENT */}
  <div
    className="
      relative z-10
      flex flex-col items-center justify-center text-center
      min-h-[85vh] md:min-h-[90vh]
      px-6 sm:px-10
    "
  >

    {/* SMALL LABEL */}
    <p
      className="
        text-[10px] sm:text-[11px]
        tracking-[0.35em]
        uppercase
        text-white/75
        mb-4
      "
    >
      Our Story
    </p>

    {/* MAIN TITLE */}
    <h1
      className="
        text-white/95
        font-light
        text-[30px] sm:text-[36px] md:text-[48px] lg:text-[56px]
        tracking-wide
        leading-tight
      "
    >
      Bright Rose
    </h1>

    {/* SUBTITLE */}
    <p
      className="
        mt-3
        text-white/90
        text-[13px] sm:text-[14px] md:text-[16px]
        tracking-[0.18em]
        uppercase
        font-light
      "
    >
      A Journey Woven in Tradition
    </p>

    {/* CTA */}
    <a
      href="/ourheritage"
      className="
        mt-10
        inline-flex items-center justify-center
        px-10 py-3
        border border-white
        text-white
        text-[11px] sm:text-[12px]
        tracking-[0.25em]
        uppercase
        hover:bg-white hover:text-black
        transition-all duration-300
        backdrop-blur-[1px]
      "
    >
      Discover Our World
    </a>

  </div>
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
