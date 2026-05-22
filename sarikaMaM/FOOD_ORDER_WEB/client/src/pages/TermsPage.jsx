export function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using My Vaggie, you agree to be bound by these Terms of Use. If you do not agree, please refrain from using our services."
    },
    {
      title: "2. Ordering & Payments",
      content: "All orders placed through our platform are subject to availability. Prices are inclusive of applicable taxes unless stated otherwise. Payments must be made through our authorized payment gateways."
    },
    {
      title: "3. Delivery & ETA",
      content: "Estimated time of arrival (ETA) is provided for convenience and may vary due to traffic, weather, or kitchen load. We strive for punctuality but do not guarantee exact delivery times."
    },
    {
      title: "4. Cancellations & Refunds",
      content: "Orders can only be cancelled before they enter the 'Preparing' stage. Refunds for cancelled orders will be processed within 5-7 business days to the original payment source."
    },
    {
      title: "5. User Conduct",
      content: "Users are expected to provide accurate delivery information and treat our delivery partners with respect. Any fraudulent activity will lead to immediate account suspension."
    }
  ];

  return (
    <section className="animate-fade-in max-w-4xl mx-auto py-10">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-kk-dark mb-4">Terms of <span className="text-kk-red">Use</span></h2>
        <p className="text-kk-dark/60">Last Updated: May 2026</p>
      </div>

      <div className="glass-card premium-shadow rounded-[2.5rem] p-10 space-y-10">
        {sections.map((s, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="text-xl font-bold text-kk-dark">{s.title}</h3>
            <p className="text-kk-dark/70 leading-relaxed">
              {s.content}
            </p>
          </div>
        ))}

        <div className="pt-10 border-t border-kk-dark/5 text-center">
          <p className="text-kk-dark/50 text-sm italic">
            Questions about our terms? Contact us at <span className="text-kk-red font-bold">legal@veggietoing.com</span>
          </p>
        </div>
      </div>
    </section>
  );
}
