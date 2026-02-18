import { Header } from "./header";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <main className="mx-auto max-w-3xl px-6 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Capped Minter Dashboard</CardTitle>
            <CardDescription>
              Connect your wallet to get started.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    </div>
  );
}
