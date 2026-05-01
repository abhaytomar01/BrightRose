import ScrollToTopOnRouteChange from "../../utils/ScrollToTopOnRouteChange";
import Banner from "./Banner/Banner";
import SeoData from "../../SEO/SeoData";
import FeaturedStyle from "../../components/FeatureStyle";
import FeaturedProducts from "../../components/FeaturedProducts";
import WhyChooseUs from "../../components/WhyChooseUs";
import LifestyleBanner from "../../components/LifestyleBanner";
import abouthomeimage from "../../assets/images/abouthomeimage.webp";

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

        {/* <FeaturedCollections
        title="Shop By Weave"
        subtitle="Discover timeless pieces crafted for modern living"
        
    /> */}


        {/* <BrandStory
        title="Our Story"
        description1="Bright Rose is an endeavor to bring back Indian Handloom so that we can clothe the world once again in a natural way through the beauty of INTRICATE WEAVES."
        description2="Rose is known as the Queen of Flowers for its intricate petal structure, wide spectrum of colors, and diverse forms. Similarly, our garments reflect intricate weaves, vibrant and bold hues, and a variety of weaves, each with its own distinctive character, just like you."
        description3="Our knowledge of weaving is often deeply valued within families and seen as a time-honored tradition. Some skilled artisans become masters of the craft to the point where they can weave with their eyes closed - as quoted by Master weaver, Chand from Varanasi.
"
        imageUrl={ourstory}
        learnMoreLink="/ourheritage"
    /> */}

        <section className="relative w-full overflow-hidden min-h-screen flex items-center">
          {/* gpu-section */}
          {/* BACKGROUND IMAGE */}
          {/* BACKGROUND IMAGE */}
          <div className="absolute inset-0">
            <img
              src={abouthomeimage}
              alt="Bright Rose Story"
              className="w-full h-full object-cover object-[65%_center] md:object-center will-change-transform"

            />
            <div
              className="
        absolute inset-0
        bg-[rgba(0,0,0,0.55)]
        md:bg-[rgba(0,0,0,0.45)]
      "
            />
          </div>

          {/* CONTENT */}
          <div
            className="
       relative z-10
    w-full
    flex flex-col items-center justify-center text-center
    min-h-screen
    px-6 sm:px-10
    transform-gpu
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
              Our Atelier
            </p>

            {/* MAIN TITLE */}
            <h1
              className="
        text-white/95
        font-light
        text-[20px] sm:text-[26px] md:text-[38px] lg:text-[46px]
        tracking-wide
        leading-tight
        uppercase
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
              Let's turn your most treasured memories into the
              most iconic dress
              in your wardrobe
            </p>

            {/* CTA */}
            <a
              href="/atelier"
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
              Custom Order
            </a>

          </div>
        </section>




        <FeaturedProducts
          title="BESTSELLERS"
          subtitle="Our most-loved products, handpicked for you"
        />



        <LifestyleBanner />

        <WhyChooseUs />


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
