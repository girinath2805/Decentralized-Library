import { ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/context/WalletContext";
import { ethers } from "ethers";
import { abi } from "@/abi";

const Hero = () => {
  const navigate = useNavigate();
  const { account, provider, isConnected } = useWallet();
  const handlePublishClick = async () => {
    if (!isConnected || !provider) {
      alert("Wallet not connected");
      return;
    }

    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        abi,
        signer
      );
      if (Number(await contract.allocatedId(account)) != 0) {
        return navigate("/upload");
      }
      const txn = await contract.allocateId();
      const receipt = await txn.wait();

      console.log("Transaction confirmed:", receipt);
      navigate("/upload");
    } catch (err) {
      console.error("Error calling allocateId:", err);
    }
  };
  return (
    <section className="relative overflow-hidden py-32">
      <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100">
        <img
          alt="background"
          src="https://shadcnblocks.com/images/block/patterns/square-alt-grid.svg"
          className="opacity-90 [mask-image:radial-gradient(75%_75%_at_center,white,transparent)]"
        />
      </div>
      <div className="relative z-10 container">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="rounded-xl bg-background/30 p-4 shadow-sm backdrop-blur-sm">
              <img
                src="https://shadcnblocks.com/images/block/block-1.svg"
                alt="logo"
                className="h-16"
              />
            </div>
            <div className="max-sm:p-1">
              <h1 className="mb-6 text-2xl font-bold tracking-tight text-pretty lg:text-5xl">
                Reimagine Knowledge with{" "}
                <span className="text-primary">Blocks</span>
              </h1>
              <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
                A decentralized library system that empowers readers and authors
                by storing, sharing, and securing knowledge on the blockchain —
                censorship-resistant, borderless, and always accessible.
              </p>
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <Button
                className="shadow-sm transition-shadow hover:shadow"
                onClick={() => navigate("/books")}
              >
                My Library
              </Button>
              <Button
                variant="outline"
                className="group"
                onClick={() => handlePublishClick()}
              >
                Publish Book{" "}
                <ExternalLink className="ml-2 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
            <div className="mt-20 flex flex-col items-center gap-5">
              <p className="font-medium text-muted-foreground lg:text-left">
                Built with open-source technologies
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group flex aspect-square h-12 items-center justify-center p-0"
                  )}
                >
                  <img
                    src="https://shadcnblocks.com/images/block/logos/typescript-icon.svg"
                    alt="TypeScript logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </a>

                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group flex aspect-square h-12 items-center justify-center p-0"
                  )}
                >
                  <img
                    src="https://shadcnblocks.com/images/block/logos/react-icon.svg"
                    alt="React logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </a>
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group flex aspect-square h-12 items-center justify-center p-0"
                  )}
                >
                  <img
                    src="https://shadcnblocks.com/images/block/logos/tailwind-icon.svg"
                    alt="Tailwind CSS logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </a>
                <a
                  href="https://hedera.com"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group flex aspect-square h-12 items-center justify-center p-0"
                  )}
                >
                  <img
                    src="./hedera-hbar-logo.svg"
                    alt="Hedera logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </a>
                <a
                  href="https://ipfs.io"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group flex aspect-square h-12 items-center justify-center p-0"
                  )}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/1/18/Ipfs-logo-1024-ice-text.png"
                    alt="IPFS logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </a>
                <a
                  href="https://nodejs.org"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group flex aspect-square h-12 items-center justify-center p-0"
                  )}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg"
                    alt="Node.js logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
