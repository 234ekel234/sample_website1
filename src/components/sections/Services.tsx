import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BarChart3, Code2, Package } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: BarChart3,
    title: "Consulting & Strategy",
    badge: "Advisory",
    description:
      "Expert business advisory to help you navigate challenges, identify opportunities, and build strategies that last.",
  },
  {
    icon: Code2,
    title: "Digital Solutions",
    badge: "Technology",
    description:
      "Web, software, and digital tools tailored to modernize your operations and sharpen your competitive edge.",
  },
  {
    icon: Package,
    title: "Product Supply",
    badge: "Supply Chain",
    description:
      "Quality-assured products sourced and delivered reliably — from procurement to your doorstep.",
  },
];

export default function Services() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            What We Do
          </p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            Our Core Services
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            From strategy to execution, we provide end-to-end solutions that
            move your business forward.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {services.map(({ icon: Icon, title, badge, description }) => (
            <Card
              key={title}
              className="group border-slate-200 transition-shadow hover:shadow-lg"
            >
              <CardHeader className="pb-4">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 transition-colors group-hover:bg-blue-700 group-hover:text-white">
                  <Icon size={24} />
                </div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg text-slate-900">
                    {title}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-slate-500">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/services"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-600"
            )}
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
