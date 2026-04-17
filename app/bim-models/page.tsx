// Server Component — intentionally no "use client".
// Dynamic import with ssr:false from a Server Component creates a true
// RSC→Client boundary. Webpack does NOT evaluate the client module graph
// during SSR, which prevents the Three.js / WebGL crash on every page load.
import dynamic from "next/dynamic"

const BIMModelsContent = dynamic(
  () => import("./bim-models-content").then((m) => m.BIMModelsContent),
  { ssr: false }
)

export default function BIMModelsPage() {
  return <BIMModelsContent />
}
