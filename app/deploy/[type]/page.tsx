import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DEPLOY_TYPES = [
  "capped-v3",
  "capped-v2",
  "delay",
  "rate-limit",
] as const;

type DeployType = (typeof DEPLOY_TYPES)[number];

const LABELS: Record<DeployType, string> = {
  "capped-v3": "Capped Minter V3",
  "capped-v2": "Capped Minter V2",
  delay: "Delay Minter Mod",
  "rate-limit": "Rate Limit Mod",
};

type PageProps = {
  params: Promise<{ type: string }>;
};

export default async function DeployPage({ params }: PageProps) {
  const { type } = await params;

  if (!DEPLOY_TYPES.includes(type as DeployType)) {
    notFound();
  }

  const label = LABELS[type as DeployType];

  return (
    <div className="min-h-screen bg-background font-sans">
      <main className="mx-auto max-w-2xl px-6 py-12">
        <Card>
          <CardHeader>
            <CardTitle>{label}</CardTitle>
            <CardDescription>
              Deployment form and factory integration.
            </CardDescription>
          </CardHeader>
          <div className="px-6 pb-6">
            <Button variant="outline" asChild>
              <Link href="/">Back to Dashboard</Link>
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
