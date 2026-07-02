import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FaqItem {
  q: string;
  a: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <Accordion type="single" collapsible className="w-full divide-y divide-border">
      {items.map((item, i) => (
        <AccordionItem key={i} value={`item-${i}`} className="border-0">
          <AccordionTrigger className="text-start text-h3 font-medium hover:no-underline py-5">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="text-body text-muted-foreground pb-5">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
