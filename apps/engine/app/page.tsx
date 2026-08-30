import type { ProductId } from "@codeloom/config";
import { AgentLanding, CliLanding, EngineLanding, IdeLanding, TuiLanding } from "@codeloom/ui";
import type { ComponentType } from "react";

import { PRODUCT_ID } from "../product";

const landings: Record<ProductId, ComponentType> = {
  agent: AgentLanding,
  ide: IdeLanding,
  tui: TuiLanding,
  cli: CliLanding,
  engine: EngineLanding,
};

export default function Page() {
  const Landing = landings[PRODUCT_ID];
  return <Landing />;
}
