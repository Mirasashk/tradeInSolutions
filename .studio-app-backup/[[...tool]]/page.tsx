import StudioClient from "./StudioClient";

export const dynamicParams = true;

export function generateStaticParams() {
  return [{ tool: [] }];
}

export default function StudioPage() {
  return <StudioClient />;
}
