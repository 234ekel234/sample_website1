import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

const products = [
  {
    name: "Starter Pack",
    price: "₱2,500",
    tag: "Entry Level",
    color: "from-blue-400 to-blue-600",
    description: "Perfect for small teams getting started.",
  },
  {
    name: "Professional Bundle",
    price: "₱7,500",
    tag: "Most Popular",
    color: "from-indigo-500 to-blue-700",
    description: "Comprehensive package for growing businesses.",
    featured: true,
  },
  {
    name: "Enterprise Suite",
    price: "₱15,000",
    tag: "Full Feature",
    color: "from-slate-600 to-slate-800",
    description: "Full-featured solution for large operations.",
  },
  {
    name: "Custom Package",
    price: "Request Quote",
    tag: "Tailored",
    color: "from-blue-800 to-slate-900",
    description: "A solution built specifically around your needs.",
  },
];

export default function Products() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Our Offerings
          </p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            Products &amp; Packages
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Choose the package that fits your business — or let us build
            something custom just for you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map(({ name, price, tag, color, description, featured }) => (
            <Card
              key={name}
              className={`relative overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-xl ${
                featured ? "ring-2 ring-blue-600" : ""
              }`}
            >
              {featured && (
                <div className="absolute right-0 top-0 rounded-bl-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                  Popular
                </div>
              )}
              <div className={`h-32 bg-gradient-to-br ${color}`} />
              <CardContent className="pt-4">
                <Badge variant="secondary" className="mb-2 text-xs">
                  {tag}
                </Badge>
                <h3 className="font-semibold text-slate-900">{name}</h3>
                <p className="mt-1 text-sm text-slate-500">{description}</p>
                <p className="mt-3 text-xl font-bold text-blue-700">{price}</p>
              </CardContent>
              <CardFooter>
                <Link
                  href="/order"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "w-full bg-slate-900 text-white hover:bg-blue-700"
                  )}
                >
                  Order This
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/products"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-600"
            )}
          >
            Browse All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
