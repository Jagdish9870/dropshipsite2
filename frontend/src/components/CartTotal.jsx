// import React, { useContext } from 'react'
// import { ShopContext } from '../context/ShopContext'
// import Title from './Title';

// const CartTotal = () => {

//     const {currency,delivery_fee,getCartAmount} = useContext(ShopContext);

//   return (
//     <div className='w-full'>
//       <div className='text-2xl'>
//         <Title text1={'CART'} text2={'TOTALS'} />
//       </div>

//       <div className='flex flex-col gap-2 mt-2 text-sm'>
//             <div className='flex justify-between'>
//                 <p>Subtotal</p>
//                 <p>{currency} {getCartAmount()}.00</p>
//             </div>
//             <hr />
//             <div className='flex justify-between'>
//                 <p>Shipping Fee</p>
//                 <p>{currency} {delivery_fee}.00</p>
//             </div>
//             <hr />
//             <div className='flex justify-between'>
//                 <b>Total</b>
//                 <b>{currency} {getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00</b>
//             </div>
//       </div>
//     </div>
//   )
// }

// export default CartTotal


import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = ({ discount = 0 }) => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  const subtotal = getCartAmount();
  let discountAmount = 0;

  if (typeof discount === 'number') {
    discountAmount = discount < 1 ? subtotal * discount : discount;
  }

  const total = subtotal === 0 ? 0 : subtotal + delivery_fee - discountAmount;

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
        {discountAmount > 0 && (
          <>
            <hr />
            <div className='flex justify-between text-green-600'>
              <p>Discount</p>
              <p>- {currency} {discountAmount.toFixed(2)}</p>
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
