"use client";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import type { StoreBookType } from "../../types";
import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { toast } from "sonner";
import { ethers } from "ethers";
import { abi } from "@/abi";

interface PurchaseModalProps {
  book: StoreBookType;
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
}

export function PurchaseModal({
  book,
  isOpen,
  onClose,
  onPurchase,
}: PurchaseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { account, provider, network, isConnected } = useWallet();
  const handlePurchase = async () => {
    try {
      if (!account || !provider) {
        toast.error("Connect your wallet");
        return;
      }

      setIsSubmitting(true);

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        abi,
        signer
      );
      console.log(book.price);
      const tx = await contract.purchaseBook(book.id, {
        value: ethers.parseEther((book.price / 1e8).toString()),
      });

      await tx.wait(); // Wait for transaction to complete

      toast.success("Book purchased successfully!");
      setIsComplete(true);
      onPurchase(); // callback to update UI
    } catch (error) {
      console.error(error);
      toast.error("Purchase failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setIsComplete(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        {isComplete ? (
          <>
            <DialogHeader>
              <DialogTitle>Purchase Complete!</DialogTitle>
              <DialogDescription>
                Your transaction was successful.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-4 py-4">
              <img
                src={book.coverUrl || "/placeholder.svg"}
                alt={book.title}
                className="w-16 h-24 object-cover rounded"
              />
              <div>
                <h3 className="font-medium">{book.title}</h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
                <p className="text-sm font-medium mt-1">
                  ${book.price.toFixed(2)}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Purchase</DialogTitle>
              <DialogDescription>
                Are you sure you want to purchase this book?
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-4 py-4">
              <img
                src={book.coverUrl || "/placeholder.svg"}
                alt={book.title}
                className="w-16 h-24 object-cover rounded"
              />
              <div>
                <h3 className="font-medium">{book.title}</h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
                <p className="text-sm font-medium mt-1">
                  ${book.price.toFixed(2)}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handlePurchase} disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Confirm Purchase"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
