import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import Product from '../../models/Product';
import db from '../../utils/db';
import { Store } from '../../utils/Store';
import { BiArrowBack } from "react-icons/bi";

export default function ProductScreen(props) {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  if (!product) {
    return <Layout title="Produt Not Found">Produt Not Found</Layout>;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };

  return (
    <Layout title={product.name}>
      <div className="py-2" style={{ display: 'flex', alignItems: 'center' }}>
        <Link href="/" className="inline-block px-4 py-2 rounded-full bg-blue-500 text-white no-underline hover:bg-blue-400 hover:text-white">
          <div style={{ display: 'flex', alignItems: 'center' }}>
          <BiArrowBack />
          <p style={{ marginLeft: '8px' }}>Back to products</p>
        </div>
        </Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2 ">
          <Image className="rounded-lg"
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            sizes="100vw"
            style={{
              width: '100%',
              height: 'auto',
            }}
          ></Image>
        </div>
        <div className='ml-4'>
          <ul>
            <li>
              <h1 className="text-4xl font-semibold pb-4">{product.name}</h1>
            </li>
            <li className="pb-2 ">Category : <a className='inline-block px-4 py-2 rounded-full bg-blue-500 text-white no-underline hover:bg-blue-400 hover:text-white' href={`/search?category=${encodeURIComponent(product.category)}`}> {product.category}</a></li>
            <li className="pb-2">Brand: <a className='inline-block px-4 py-2 rounded-full bg-blue-500 text-white no-underline hover:bg-blue-400 hover:text-white' href={`/search?brand=${encodeURIComponent(product.brand)}`}>{product.brand}</a></li>
            <li className="pb-2">
              <span > {product.rating} </span>of {product.numReviews} reviews
            </li>
            <li className='pb-2'>Description :
               <h4>{product.description}</h4>
            </li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>${product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{product.countInStock > 0 ? 'In stock' : 'Unavailable'}</div>
            </div>
            <button
              className="primary-button w-full"
              onClick={addToCartHandler}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
