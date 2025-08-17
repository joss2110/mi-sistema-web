export default function CheckoutPage() {
  const handleCheckout = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
      method: "POST",
    });
    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <div>
      <h1>Pagar con Stripe</h1>
      <button onClick={handleCheckout}>Pagar $50</button>
    </div>
  );
}
