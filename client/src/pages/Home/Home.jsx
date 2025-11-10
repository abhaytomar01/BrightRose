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
import furnitureCard from "../../assets/images/furniture-card.jpg";
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
            <main className="flex flex-col items-center gap-3 pb-5">
                {/* <pre className="min-h-[60vh]">
                    {JSON.stringify(auth, null, 3)}
                </pre> */}
                <Banner />
            <FeaturedCollections
                 title="Explore Our Collections"
        subtitle="Discover timeless pieces crafted for modern living"
        categories={electronicProducts}
        // isLoading={loading} 
             />
       
       
       <BrandStory 
            title="Our Story"
            description1="Bright Rose is an endeavor to bring back Indian Handloom so that we can clothe the world once again in a natural way through the beauty of INTRICATE WEAVES."
            description2="Rose is known as the Queen of Flowers for its intricate petal structure, wide spectrum of colors, and diverse forms. Similarly, our garments reflect intricate weaves, vibrant and bold hues, and a variety of weaves, each with its own distinctive character, just like you."
            description3="“Our knowledge of weaving is often deeply valued within families and seen as a time-honored tradition. Some skilled artisans become masters of the craft to the point where they can weave with their eyes closed” - as quoted by Master weaver, Chand from Varanasi."
            imageUrl="../../src/assets/images/ourstoryImage.jpg"
            learnMoreLink="/about"
       />
       <FeaturedProducts
        title="BestSellers"
        subtitle="Our most-loved products, handpicked for you"
        products={fashionProducts}
       />
        <WhyChooseUs />
         <LifestyleBanner
          title="The Red Gold Edit — Luxury with Simplicity"
        subtitle="Experience the elegance of handloom fashion reimagined for modern lifestyles."
        buttonText="Explore the Look"
        buttonLink="/collections"
        imageUrl="../../src/assets/images/lifestyle.jpg"
      />
      {/* <Newsletter /> */}
      <Testimonials />

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
