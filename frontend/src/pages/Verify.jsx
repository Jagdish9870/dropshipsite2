import { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

const Verify = () => {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Verifying your payment...');
  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');

  const verifyPayment = async () => {
    try {
      if (!token) {
        setStatus('Login required to verify your order.');
        return;
      }

      if (!orderId) {
        setStatus('Order ID is missing.');
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/order/verifyPayU`,
        {txnid: searchParams.get('orderId'),
            status: searchParams.get('success') === 'true' ? 'success' : 'failure', },
        { headers: { token } }
      );

      console.log("response", response.data);
      
      if (response.data.success) {
        setCartItems({});
        localStorage.removeItem('cart');
        setStatus('Payment verified! Redirecting to your orders...');
        setTimeout(() => navigate('/orders'), 2000);
      } else {
        setStatus('Payment failed. Redirecting to cart...');
        setTimeout(() => navigate('/cart'), 2000);
      }
    } catch (error) {
      console.log(error);
      toast.error('Payment verification failed');
      setStatus('Something went wrong. Redirecting to cart...');
      setTimeout(() => navigate('/cart'), 2000);
    }
  };

  useEffect(() => {
    // Ensure that the payment verification occurs when the component mounts
    if (success && orderId) {
      verifyPayment();
    } else {
      setStatus('Invalid payment verification parameters.');
    }
  }, [success, orderId, token]); // This effect runs only when success, orderId, or token changes.

  return (
    <div className="flex justify-center items-center h-screen text-xl font-semibold">
      {status}
    </div>
  );
};

export default Verify;
