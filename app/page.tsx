"use client";
import React, { useState, useRef } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

interface InvoiceItem {
  item: string;
  quantity: number;
  price: number;
}

const InvoicePage: React.FC = () => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const [storeName, setStoreName] = useState<string>("Good Donuts Company");
  const [tagline, setTagline] = useState<string>(
    "Making you happy since 1988!"
  );
  const [contact, setContact] = useState<string>("Nelson, MT\n390-300-3393");
  const [server, setServer] = useState<string>("6");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [items, setItems] = useState<InvoiceItem[]>([
    { item: "Dozen Donuts", quantity: 1, price: 13.99 },
    { item: "Large Coffee", quantity: 2, price: 4.58 },
  ]);
  const [taxRate] = useState<number>(7.5); // Example tax rate
  const [tip, setTip] = useState<number>(0);

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const updatedItems = items.map((item, i) =>
      i === index
        ? {
            ...item,
            [field]:
              field === "price" || field === "quantity" ? Number(value) : value,
          }
        : item
    );
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([...items, { item: "", quantity: 1, price: 0 }]);
  };

  const calculateSubtotal = () =>
    items.reduce((total, item) => total + item.quantity * item.price, 0);

  const calculateTax = () => (calculateSubtotal() * taxRate) / 100;

  const calculateTotal = () => calculateSubtotal() + calculateTax() + tip;

  const handleDownload = async () => {
    if (invoiceRef.current) {
      try {
        const image = await toPng(invoiceRef.current);
        const pdf = new jsPDF();
        pdf.addImage(image, "PNG", 0, 0, 110, 150); // Scale for receipt size
        pdf.save("invoice.pdf");
      } catch (error) {
        console.error("Failed to generate PDF:", error);
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-6 space-y-4 font-mono ">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* it is input section user can enter input */}
        <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-3xl space-y-4">
          <div>
            <label className="block text-sm font-medium">Store Name:</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Tagline:</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Contact Info:</label>
            <textarea
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm mt-1"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium">Server:</label>
            <input
              type="text"
              value={server}
              onChange={(e) => setServer(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm mt-1"
            />
          </div>
        </div>

        {/* it is item section here user enter item  */}
        <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-3xl">
          <h2 className="text-lg font-bold mb-2">Items</h2>
          {items.map((item, index) => (
            <div key={index} className="flex space-x-4 mb-2">
              <input
                type="text"
                placeholder="Item Name"
                value={item.item}
                onChange={(e) =>
                  handleItemChange(index, "item", e.target.value)
                }
                className="flex-1 border-gray-300 rounded-md shadow-sm"
              />
              <input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                className="w-20 border-gray-300 rounded-md shadow-sm"
              />
              <input
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) =>
                  handleItemChange(index, "price", e.target.value)
                }
                className="w-24 border-gray-300 rounded-md shadow-sm"
              />
            </div>
          ))}
          <button
            onClick={handleAddItem}
            className="mt-2 text-blue-600 hover:underline"
          >
            + Add Item
          </button>
        </div>

        {/* it is Receipt Section */}
        <div
          ref={invoiceRef}
          className="bg-white p-4 rounded-lg shadow-md w-full max-w-md border text-sm font-t text-2xl"
        >
          <p className="text-center font-bold">{storeName}</p>
          <p className="text-center">{tagline}</p>
          <p className="text-center whitespace-pre-wrap">{contact}</p>
          <p className="text-center">SALE</p>
          <p className="mt-4">Server: {server}</p>

          <p>Date: {date}</p>
          <p>VISA 4884</p>
          <p>Card XXXXXXXXX</p>
          <p>Card present </p>
          <p>Card entry swip / Chip</p>

          <table className="w-full text-left border-collapse mt-4">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.item}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4">Tax: ${calculateTax().toFixed(2)}</p>
          <p>Tip: ${tip.toFixed(2)}</p>
          <p className="font-bold">Total: ${calculateTotal().toFixed(2)}</p>
          <p className="text-center">Customer copy</p>
        </div>
      </div>

      {/* Tip Section */}
      <div className="w-full max-w-3xl flex space-x-4">
        <p>tip Amount</p>
        <input
          type="number"
          placeholder="Tip Amount dfdfdfdfdff"
          value={tip}
          onChange={(e) => setTip(Number(e.target.value))}
          className="w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Actions */}
      <button
        onClick={handleDownload}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
      >
        Download
      </button>
    </div>
  );
};

export default InvoicePage;
