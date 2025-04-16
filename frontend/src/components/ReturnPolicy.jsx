import React from 'react';

const ReturnPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-2xl font-bold mb-6">Return Policy</h1>
      <p className="mb-4">
        At Wills Thrills, customer satisfaction is our top priority. We understand the importance of receiving products in perfect condition, which is why we offer a flexible return policy on specific cases.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">1. Eligibility for Returns</h2>
      <p className="mb-4">
        We accept returns only for products that are damaged or defective at the time of delivery.
        <br />
        Return requests must be initiated within 3 days of receiving your order.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">2. Return Conditions</h2>
      <p className="mb-4">
        To qualify for a return, customers must provide a clear unboxing video as proof that the product was damaged or defective when received.
        <br />
        The product must be unused and in its original packaging.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">3. Non-Returnable Items</h2>
      <p className="mb-4">
        Products that are damaged after use or due to mishandling are not eligible for return. No returns will be accepted without the unboxing video proof.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">4. How to Request a Return</h2>
      <p className="mb-4">
        To initiate a return, please contact us via our Contact Page and include:
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>Order ID</li>
          <li>Reason for return</li>
          <li>Unboxing video (uploaded to Google Drive, YouTube, etc., with a shareable link)</li>
        </ul>
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">5. Refund Process</h2>
      <p className="mb-4">
        Once your return request is approved, we will arrange for pickup and initiate a refund or replacement as per your preference.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Need Help?</h2>
      <p>
        If you have any questions, feel free to reach out to our support team anytime through the Contact Page.
      </p>
    </div>
  );
};

export default ReturnPolicy;
