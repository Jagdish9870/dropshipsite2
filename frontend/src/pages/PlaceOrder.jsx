import { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  const [method, setMethod] = useState('stripe'); // Default set to 'stripe'
  const {
    backendUrl,
    token,
    cartItems,
    getCartAmount,
    delivery_fee,
    products
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const discountRate = 0.2;
  const subtotal = getCartAmount();
  const discount = subtotal * discountRate;
  const finalAmount = subtotal - discount + delivery_fee;

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items));
            if (itemInfo) {
              itemInfo.color = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: subtotal,
        discount: discount,
        delivery_fee: delivery_fee,
        final_amount: finalAmount,
        paymentMethod: method
      };

      switch (method) {
        case 'stripe':
          // const responseStripe = await axios.post(`${backendUrl}/api/order/stripe`, orderData, {
          //   headers: { token }
          // });
          // if (responseStripe.data.success) {
          //   const { session_url } = responseStripe.data;
          //   window.location.replace(session_url);
          // } else {
          //   toast.error(responseStripe.data.message);
          // }
          break;

          case "payu":
            console.log("hello");
            
            try {
              const responsePayU = await axios.post(
                backendUrl + "/api/order/payu",
                orderData,
                {
                  headers: {token},
                  
                }
              );
  
              console.log("responsePayU", responsePayU);
  
              if (responsePayU.data.success) {
                const { action, params } = responsePayU.data;
  
                // Log PayU params before redirection
                window.payuDebugData = { action, params };
                console.log("PayU data stored in window.payuDebugData");
  
                // Create a form and submit to PayU
                const form = document.createElement("form");
                form.method = "POST";
                form.action = action;
  
                Object.entries(params).forEach(([key, value]) => {
                  const input = document.createElement("input");
                  input.type = "hidden";
                  input.name = key;
                  input.value = value;
                  form.appendChild(input);
                });
  
                document.body.appendChild(form);
                console.log("Form created and appended to body:", form);
                
  
                // 🔁 Uncomment the next line to allow redirection to PayU
                form.submit();
              } else {
                toast.error(responsePayU.data.message);
              }
            } catch (error) {
              console.error("PayU order error:", error);
              toast.error("Something went wrong with PayU payment.");
            }
            break;

        case 'cod':
          toast.error("Cash on Delivery is currently unavailable.");
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
        <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
          <input onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
          <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
      </div>

      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal discount={discountRate} />
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer hidden'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
            </div>

            <div onClick={() => setMethod('payu')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'payu' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.payU_logo} alt="" />
            </div>

            {/* COD Disabled */}
            <div className='flex items-center gap-3 border p-2 px-3 opacity-50 cursor-not-allowed'>
              <p className='min-w-3.5 h-3.5 border rounded-full'></p>
              <p className='text-gray-400 text-sm font-medium mx-4 line-through'>CASH ON DELIVERY</p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
