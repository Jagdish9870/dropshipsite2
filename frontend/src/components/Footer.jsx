import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom';


const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

      <div className="flex items-center gap-4 mb-5">
  <img src={assets.logo2} className="w-32" alt="logo" />
  <p className="text-gray-600 max-w-xl">
    Wills Thrills was born out of a passion for innovation and a vision to redefine the way people explore and experience electronic products online
  </p>
</div>



        <div>
            <p className='text-xl font-medium mb-5'>Wills Thrills</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>
               <Link to="/return-policy" className="hover:underline">Return Policy</Link>
              </li>

                <li>
                <Link to="/privacy-policy" className="hover:underline">Privacy policy</Link>
                </li>

            </ul>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>panditvivek5051@gmail.com</li>
            </ul>
        </div>

      </div>

        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Affiliation by Vivek Sharma.</p>
            <p className='py-5 text-sm text-center'>Copyright 2025@ Wills Thrills  - All Right Reserved.</p>
        </div>

    </div>
  )
}

export default Footer
