import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const defaultSteps = [
  {
    step: 1,
    title: "Make an Appointment",
    description: "Schedule your free appraisal online or by phone.",
  },
  {
    step: 2,
    title: "Inspection & Appraisal",
    description: "Our expert appraiser inspects your vehicle and explains the offer.",
  },
  {
    step: 3,
    title: "Get a Check",
    description: "Accept your offer and receive same-day payment.",
  },
];

export function ProcessSteps({ large = false }: { large?: boolean }) {
  return (
    <section className={`mx-auto max-w-6xl px-4 ${large ? "py-20" : "py-16"}`}>
      <h2 className="text-center text-3xl font-bold text-brand-navy">How It Works</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {defaultSteps.map((item) => (
          <Card key={item.step}>
            <CardHeader>
              <span className="text-sm font-bold text-brand-gold">
                Step {item.step}
              </span>
              <CardTitle className={large ? "text-xl" : "text-lg"}>
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
