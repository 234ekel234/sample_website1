import { Smartphone, Building2, Truck } from "lucide-react";

const methods = [
  {
    icon: Smartphone,
    name: "GCash",
    desc: "Send via GCash QR or mobile number",
  },
  {
    icon: Smartphone,
    name: "PayMaya",
    desc: "Pay using your PayMaya e-wallet",
  },
  {
    icon: Building2,
    name: "Bank Transfer",
    desc: "Direct bank deposit or online transfer",
  },
  {
    icon: Truck,
    name: "Cash on Delivery",
    desc: "Pay upon delivery or pickup",
  },
];

export default function PaymentMethods() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Flexible Payments
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Payment Methods We Accept
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {methods.map(({ icon: Icon, name, desc }) => (
            <div
              key={name}
              className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <Icon size={22} />
              </div>
              <h3 className="font-semibold text-slate-900">{name}</h3>
              <p className="mt-1 text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
