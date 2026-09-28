import { PRODUCTS, siteUrl } from "@codeloom/config";
import { ClientsLanding } from "@codeloom/ui";
import type { Metadata } from "next";import { TuiMock } from '@codeloom/ui/src/mocks/tui-mock';
import { AgentMock } from '@codeloom/ui/src/mocks/agent-mock';


const product = PRODUCTS.clients;

export const metadata: Metadata = {
  title: product.shortName,
  description: product.description,
  openGraph: {
    title: product.name,
    description: product.tagline,
    url: siteUrl(product.path),
  },
};

export default function ClientsPage() {
  return <ClientsLanding />;
}
