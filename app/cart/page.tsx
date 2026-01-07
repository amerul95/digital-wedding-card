
import React from 'react'
import Cart from '@/components/cart/Cart'
export default function page() {
  return (
    <div>
      <Cart/>
    </div>
  )
}

// import React from 'react';

// export default function Cart() {
//   return (
//     <div className='flex'>
//         <div className='w-2/3'>
//            <p>helo</p>
//         </div>
//       <div className='w-1/3'>
//         <OrderSummary/>
//       </div>
//     </div>
//   )
// }

// function ShoppingCartList(){
//     return (
//         <div>
//             <p>YOUR SHOPPING CART IS EMPTY</p>
//             <p>WOULD YOU LIKE TO BROWSE OUR DESIGNS?</p>
//         </div>
//     )
// }

// function ShoppingCartwithItem(){
//     return (
//         <div>
//             <p>SHOPPING CART</p>
//             <p>REVIEW YOUR ITEMS BEFORE PURCHASING</p>
//         </div>
//     )
// }
// function OrderSummary() {
//   return (
//     <section className="w-full pt-8 px-4">
//       {/* Title */}
//       <div className="mb-6">
//         <p className="text-2xl font-semibold text-gray-800">Order Summary</p>
//       </div>

//       {/* Promo Code Section */}
//       <div className="mb-8">
//         <p className="text-sm text-gray-600 mb-3">
//           Have a Promo Code or Gift Card? Type Here!
//         </p>

//         <form
//           action="https://aliveinvite.com/shop/cart/validate_code"
//           acceptCharset="UTF-8"
//           method="get"
//           className="flex gap-2"
//         >
//           <input type="hidden" name="utf8" value="✓" />

//           <input
//             type="text"
//             name="coupon_code"
//             id="coupon_code"
//             placeholder="Enter promo code"
//             className="flex-1 border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />

//           <button
//             type="submit"
//             name="commit"
//             className="bg-blue-600 text-white px-5 py-3 rounded-md text-sm font-medium uppercase hover:bg-blue-700 transition"
//           >
//             Apply
//           </button>
//         </form>

//         <small className="block text-right mt-2 text-sm">
//           <a
//             rel="nofollow"
//             data-method="delete"
//             href="https://aliveinvite.com/shop/cart/clear/code"
//             className="text-blue-600 hover:underline"
//           >
//             Remove
//           </a>
//         </small>
//       </div>

//       {/* Price Table */}
//       <div className="border-t border-gray-200 pt-4">
//         <div className="flex justify-between text-sm py-2">
//           <span className="text-gray-500">Subtotal</span>
//           <span className="text-gray-700">RM0.00</span>
//         </div>
//         <div className="flex justify-between text-sm py-2">
//           <span className="text-gray-500">Delivery</span>
//           <span className="text-gray-700">FREE SHIPPING</span>
//         </div>
//         <div className="flex justify-between text-sm py-3 border-t border-gray-200 mt-2">
//           <span className="text-gray-800 font-semibold">Total</span>
//           <span className="text-gray-900 font-bold">RM0.00</span>
//         </div>
//       </div>

//       {/* Checkout Button */}
//       <div className="mt-6">
//         <button
//           disabled
//           className="w-full bg-gray-300 text-gray-600 py-3 rounded-md uppercase font-medium cursor-not-allowed"
//         >
//           Proceed to Checkout
//         </button>
//       </div>
//     </section>
//   );
// }

