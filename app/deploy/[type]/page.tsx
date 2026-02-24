import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { DeployForm } from "@/components/deploy";
import { DEPLOY_TYPES, type MinterType } from "@/lib/types";

const LABELS: Record<MinterType, string> = {
  "capped-v3": "Capped Minter V3",
  "capped-v2": "Capped Minter V2",
  delay: "Delay Minter Mod",
  "rate-limit": "Rate Limit Mod",
};

type PageProps = {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ admin?: string; mintable?: string }>;
};

export default async function DeployPage({ params, searchParams }: PageProps) {
  const { type } = await params;
  const { admin: adminFromUrl, mintable: mintableFromUrl } = await searchParams;

  if (!DEPLOY_TYPES.includes(type as MinterType)) {
    notFound();
  }

  const label = LABELS[type as MinterType];

  return (
    <div className="min-h-screen bg-background font-sans">
      <main className="mx-auto w-full max-w-6xl px-6 py-12">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Deploy ({label})</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Card>
          <CardHeader>
            <CardTitle>{label}</CardTitle>
            <CardDescription>
              Deployment form and factory integration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeployForm
            type={type as MinterType}
            initialAdmin={adminFromUrl}
            initialMintable={mintableFromUrl}
          />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
