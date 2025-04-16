import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div>
      
      <div className='text-center text-2xl pt-10 border-t'>
          <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Wills Thrills</p>
          <p className='text-gray-500'>Company Owner  : Vivek Sharma</p>
          <p className=' text-gray-500'>Email: panditvivek5051@gmail.com</p>
          <p className=' text-gray-500'> Company Address: Khandeha, 202137, Aligarh, U.P</p>
          <p className=' text-gray-500'>24*7 Email Support</p>


         </div>
      </div>

      <NewsletterBox/>
    </div>
  )
}

export default Contact
