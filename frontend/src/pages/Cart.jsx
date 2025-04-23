import  { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate,deleteItemFromCart} = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const [discountValue, setDiscountValue] = useState(0);
  const [discountType, setDiscountType] = useState('flat'); // flat or percentage

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              color: item,
              quantity: cartItems[items][item]
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'flat100') {
      setDiscountValue(100);
      setDiscountType('flat');
      setPromoMessage('Promo code applied: ₹100 off');
    } else if (promoCode.toLowerCase() === 'save20') {
      setDiscountValue(20);
      setDiscountType('percentage');
      setPromoMessage('Promo code applied: 20% off');
    } else {
      setDiscountValue(0);
      setPromoMessage('Invalid promo code');
    }
  };

  const getSubtotal = () => {
    let total = 0;
    cartData.forEach((item) => {
      const productData = products.find((product) => product._id === item._id);
      if (productData) {
        total += productData.price * item.quantity;
      }
    });
    return total;
  };

  const subtotal = getSubtotal();
  const shipping = 100;

  let discount = 0;
  if (discountType === 'flat') {
    discount = discountValue;
  } else if (discountType === 'percentage') {
    discount = (discountValue / 100) * subtotal;
  }

  const total = subtotal + shipping - discount;

  const handleProceedToCheckout = () => {
    if (cartData.length === 0) {
      toast.error('Please add a product to your cart before proceeding to checkout.');
      return;
    }
    navigate('/place-order');
  };

  return (
    <div className='border-t pt-14'>
      <div className=' text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div>
        {cartData.map((item, index) => {
          const productData = products.find((product) => product._id === item._id);

          return (
            <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
              <div className=' flex items-start gap-6'>
                <img className='w-16 sm:w-20' src={productData.image[0]} alt='' />
                <div>
                  <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                  <div className='flex items-center gap-5 mt-2'>
                    <p>{currency}{productData.price}</p>
                    <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.color}</p>
                  </div>
                </div>
              </div>
              <input
                onChange={(e) =>
                  e.target.value === '' || e.target.value === '0'
                    ? null
                    : updateQuantity(item._id, item.color, Number(e.target.value))
                }
                className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1'
                type='number'
                min={1}
                defaultValue={item.quantity}
              />
              <img
                onClick={() => deleteItemFromCart(item._id, item.color, 0)}
                className='w-4 mr-4 sm:w-5 cursor-pointer'
                src={assets.bin_icon}
                alt='delete'
              />
            </div>
          );
        })}
      </div>

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>

          {/* Promo Code Section */}
          <div className={`mb-6 ${cartData.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
            <label className='block mb-1 font-medium text-gray-700'>Have a Promo Code?</label>
            <div className='flex gap-2 mb-2'>
              <input
                type='text'
                className='border px-3 py-2 flex-grow'
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder='Enter promo code'
                list='promoCodes'
                disabled={cartData.length === 0}
              />
              <button
                className='bg-black text-white px-4 py-2 text-sm'
                onClick={applyPromoCode}
                disabled={cartData.length === 0}
              >
                Apply
              </button>
            </div>

            <datalist id='promoCodes'>
              <option value='FLAT100' />
              <option value='SAVE20' />
            </datalist>

            {promoMessage && (
              <p
                className={`text-sm mt-1 ${
                  promoMessage.toLowerCase().includes('invalid') ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {promoMessage}
              </p>
            )}
          </div>

          {/* Cart Totals Section */}
          <div className='text-sm text-gray-800'>
            <h3 className='text-xl font-semibold border-b pb-2 mb-4'>CART TOTALS</h3>
            <div className='flex justify-between mb-2'>
              <span>Subtotal</span>
              <span>{currency}{subtotal.toFixed(2)}</span>
            </div>
            <div className='flex justify-between mb-2'>
              <span>Shipping Fee</span>
              <span>{currency}{shipping.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className='flex justify-between mb-2 text-green-600'>
                <span>Discount</span>
                <span>-{currency}{discount.toFixed(2)}</span>
              </div>
            )}
            <div className='flex justify-between font-bold text-lg border-t pt-2'>
              <span>Total</span>
              <span>{currency}{total.toFixed(2)}</span>
            </div>
          </div>

          <div className=' w-full text-end'>
            <button
              onClick={handleProceedToCheckout}
              className='bg-black text-white text-sm my-8 px-8 py-3'
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
