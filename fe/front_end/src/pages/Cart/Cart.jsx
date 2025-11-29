"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();

  const [cart, setCart] = useState([
    { id: 1, name: "Book A", price: 50000, qty: 1 },
    { id: 2, name: "Book B", price: 82000, qty: 2 },
  ]);

  const updateQty = (id, amount) => {
    setCart(cart.map(item =>
      item.id === id
        ? { ...item, qty: Math.max(1, item.qty + amount) }
        : item
    ));
  };

  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between p-4 border rounded-lg shadow">
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-gray-600">{item.price.toLocaleString()} đ</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => updateQty(item.id, -1)}
                >-</button>

                <span>{item.qty}</span>

                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => updateQty(item.id, 1)}
                >+</button>

                <button
                  className="ml-4 px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => removeItem(item.id)}
                >
                  X
                </button>
              </div>
            </div>
          ))}

          <div className="text-right text-xl font-bold mt-4">
            Total: {total.toLocaleString()} đ
          </div>

          <button
            onClick={() => router.push("/checkout")}
            className="mt-5 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
