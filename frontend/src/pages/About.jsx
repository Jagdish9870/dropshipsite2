import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
          <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px]' src={assets.about} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
              <p>Wills Thrills was born out of a passion for innovation and a vision to redefine the way people explore and experience electronic products online. Our journey began with a clear goal: to create a platform where technology enthusiasts can effortlessly discover, compare, and purchase the latest gadgets and devices—all in one place..</p>
              <p>Since day one, we’ve been committed to curating a dynamic selection of cutting-edge electronics that cater to every need and lifestyle. From smart home solutions and mobile accessories to wearables and entertainment systems, our collection features high-quality products sourced from trusted global brands and emerging tech innovators..</p>
              <b className='text-gray-800'>Our Mission</b>
              <p>At Wills Thrills, our mission is to empower customers with access to the newest technology, paired with the convenience and confidence of a seamless shopping experience. We are dedicated to making the world of electronics more accessible, enjoyable, and future-forward—from your first click to the moment your device arrives.</p>
          </div>
      </div>

      <div className=' text-xl py-4'>
          <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Quality Assurance:</b>
            <p className=' text-gray-600'>We meticulously select and vet each product to ensure it meets our stringent quality standards.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Convenience:</b>
            <p className=' text-gray-600'>With our user-friendly interface and hassle-free ordering process, shopping has never been easier.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Exceptional Customer Service:</b>
            <p className=' text-gray-600'>Our team of dedicated professionals is here to assist you the way, ensuring your satisfaction is our top priority.</p>
          </div>
      </div>

      <NewsletterBox/>
      
    </div>
  )
}

export default About
