import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount,discount } = useContext(ShopContext);
  console.log(discount);
  

  // Subtotal is the original total before any discount
  const subtotal = getCartAmount();

  const total = subtotal === 0 ? 0 : subtotal + delivery_fee - discount;

  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm'>
        <div className='flex justify-between'>
          <p>Subtotal</p>
          <p>{currency} {subtotal.toFixed(2)}</p>
        </div>

        <hr />

        <div className='flex justify-between'>
          <p>Shipping Fee</p>
          <p>{currency} {delivery_fee.toFixed(2)}</p>
        </div>

        {discount > 0 && (
          <>
            <hr />
            <div className='flex justify-between text-green-600'>
              <p>Discount</p>
              <p>- {currency} {discount.toFixed(2)}</p>
            </div>
          </>
        )}

        <hr />

        <div className='flex justify-between'>
          <b>Total</b>
          <b>{currency} {total.toFixed(2)}</b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
