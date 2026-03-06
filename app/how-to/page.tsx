import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FACTORY_ADDRESSES, getZkTokenAddress } from "@/lib/contracts";
import { getBlockExplorerAddressUrl, getChainId } from "@/lib/utils";

const NETWORK_LABELS: Record<number, string> = {
  324: "zkSync Era mainnet (chainId 324)",
  300: "zkSync Sepolia testnet (chainId 300)",
};

const MINTER_TYPE_LABELS: Record<string, string> = {
  "capped-v3": "Capped Minter V3",
  "capped-v2": "Capped Minter V2",
  delay: "Delay Minter Mod",
  "rate-limit": "Rate Limit Mod",
};

export default function HowToPage() {
  const chainId = getChainId();
  const currentNetworkLabel =
    NETWORK_LABELS[chainId] ?? `chainId ${chainId}`;


  const zkTokenAddress = getZkTokenAddress(chainId);

  return (
    <div className="min-h-screen bg-background font-sans">
      <main className="mx-auto w-full max-w-4xl px-6 py-12 space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">
            How to use the Capped Minter dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Quick guide for deploying mods, chaining them, granting roles, and
            registering programs.
          </p>
          <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 space-y-1">
            <li>Create a mod from the header Deploy menu.</li>
            <li>Chain mods by deploying the next mod with mintable set to the last mod.</li>
            <li>Grant roles via the Grant role page or post-deploy prompt.</li>
            <li>Addresses and PR instructions are listed below.</li>
          </ul>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Create a mod</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            <ol className="list-decimal space-y-1 pl-5">
              <li>
                From the header <span className="font-medium">Deploy</span>{" "}
                menu, pick a mod type.
              </li>
              <li>
                Enter <span className="font-medium">mintable</span> (token or
                upstream mod), <span className="font-medium">admin</span>, and
                any type-specific params.
              </li>
              <li>
                Connect your wallet, click{" "}
                <span className="font-medium">Deploy</span>, and wait for the
                progress modal to finish.
              </li>
              <li>
                When prompted, use{" "}
                <span className="font-medium">Grant Minter Role</span> to assign{" "}
                <code>MINTER_ROLE</code> from your token or upstream mod to the
                new mod.
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to chain mods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            <ol className="list-decimal space-y-1 pl-5">
              <li>
                Deploy the first mod with{" "}
                <span className="font-medium">mintable</span> set to your token.
              </li>
              <li>
                In the deploy progress modal, use{" "}
                <span className="font-medium">Deploy and link another mod</span>{" "}
                to prefill the next deploy form so{" "}
                <span className="font-medium">mintable</span> is the previous
                mod.
              </li>
              <li>
                Repeat to add more mods (for example, a rate limit mod wrapping
                a capped minter).
              </li>
              <li>
                Grant roles in order: token → first mod → second mod → … using
                the <span className="font-medium">Grant role</span> page when
                needed.
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>When to grant minter roles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            <ul className="list-disc space-y-1 pl-5">
              <li>
                After each deploy, grant <code>MINTER_ROLE</code> from the
                upstream contract to the new mod so it can mint.
              </li>
              <li>
                When chaining, grant roles between every pair in the flow
                (upstream is role admin, downstream is role holder).
              </li>
              <li>
                Use the <span className="font-medium">Grant role</span> page
                any time you need to rotate mods or extend an existing chain.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Factory and program addresses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <p className="mb-1 font-medium text-foreground">Network</p>
              <p>{currentNetworkLabel}</p>
            </div>

            <div>
              <p className="mb-2 font-medium text-foreground">
                Factory and token addresses
              </p>
              <ul className="list-disc space-y-1 pl-5">
                {Object.entries(FACTORY_ADDRESSES).map(([type, perChain]) => {
                  const address = perChain[chainId as keyof typeof perChain];
                  if (!address) return null;
                  const href = getBlockExplorerAddressUrl(address);
                  return (
                    <li key={type}>
                      {MINTER_TYPE_LABELS[type] ?? type}:{" "}
                      <Link
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-2 hover:opacity-80"
                      >
                        <code>{address}</code>
                      </Link>
                    </li>
                  );
                })}
                {zkTokenAddress && (
                  <li>
                    ZK token:{" "}
                    <Link
                      href={getBlockExplorerAddressUrl(zkTokenAddress)}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-2 hover:opacity-80"
                    >
                      <code>{zkTokenAddress}</code>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

