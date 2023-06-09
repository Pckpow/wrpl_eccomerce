import axios from 'axios';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import Product from '../models/Product';
import db from '../utils/db';
import { Store } from '../utils/Store';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Link from 'next/link';
import { FaRocket } from "react-icons/fa";
import { BiRotateLeft} from "react-icons/bi";
import { FiPercent, FiLifeBuoy } from "react-icons/fi";

export default function Home({ products, featuredProducts }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

    toast.success('Product added to the cart');
  };

  return (
    <Layout title="Home Page">
      <Carousel showThumbs={false} autoPlay>
        {featuredProducts.map((product) => (
          <div key={product._id}>
            <Link href={`/product/${product.slug}`} passHref className="flex">
              <img src={product.banner} alt={product.name} />
            </Link>
          </div>
        ))}
      </Carousel>
      
      <div className="flex justify-center content-center text-center pt-5 py-3 my-3">
      <div className="w-1/2">
        <div className="icon-box icon-box-side">
          <span className="icon-box-icon flex items-center">
              <i className="icon-rocket text-4xl">
              </i>
          </span>
          <div className="icon-box-content pl-28">
              <h3 className="icon-box-title font-bold flex items-center">
              <FaRocket className="mr-2 text-3xl" />
              <span className="align-middle">Free Shipping</span>
              </h3>
              <p className="flex items-center">Orders $50 or more</p>
          </div>
        </div>
        </div>
        <div className="w-1/2">
        <div className="icon-box icon-box-side">
          <span className="icon-box-icon">
              <i className="icon-rocket text-4xl">
              </i>
          </span>
          <div className="icon-box-content pl-28">
              <h3 className="icon-box-title font-bold flex items-center">
              <BiRotateLeft className="mr-2 text-4xl" />
              <span className="align-middle">Free Returns</span>
              </h3>
              <p className="flex items-center">Within 30 days</p>
          </div>
        </div>
        </div>

        <div className="w-1/2">
        <div className="icon-box icon-box-side">
          <span className="icon-box-icon">
              <i className="icon-rocket text-4xl">
              </i>
          </span>
          <div className="icon-box-content pl-28">
              <h3 className="icon-box-title font-bold flex items-center">
              <FiPercent className="mr-2 text-4xl" />
              <span className="align-middle">Get 20% Off 1 Item</span>
              </h3>
              <p className="flex items-center">When you sign up</p>
          </div>
        </div>
        </div>

        <div className="w-1/2">
        <div className="icon-box icon-box-side">
          <span className="icon-box-icon">
              <i className="icon-rocket text-4xl">
              </i>
          </span>
          <div className="icon-box-content pl-28">
              <h3 className="icon-box-title font-bold flex items-center">
              <FiLifeBuoy className="mr-2 text-4xl" />
              <span className="align-middle">We Support</span>
              </h3>
              <p className="flex items-center">24/7 amazing services</p>
          </div>
        </div>
        </div>

      </div>

      <h2 className="text-3xl font-semibold h2 my-4">Latest Products</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem
            product={product}
            key={product.slug}
            addToCartHandler={addToCartHandler}
          ></ProductItem>
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  const featuredProducts = await Product.find({ isFeatured: true }).lean();
  return {
    props: {
      featuredProducts: featuredProducts.map(db.convertDocToObj),
      products: products.map(db.convertDocToObj),
    },
  };
}
