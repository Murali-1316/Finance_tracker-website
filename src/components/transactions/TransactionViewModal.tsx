import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/stores/financeStore";

interface TransactionViewModalProps {
  open: boolean;
  transaction?: Transaction;
  onClose: () => void;
}

export const TransactionViewModal = ({ open, transaction, onClose }: TransactionViewModalProps) => {
  if (!transaction) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <span className="font-semibold">Description:</span> {transaction.description}
          </div>
          <div>
            <span className="font-semibold">Type:</span> {transaction.type}
          </div>
          <div>
            <span className="font-semibold">Amount:</span> {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(transaction.amount))}
          </div>
          <div>
            <span className="font-semibold">Category:</span> {transaction.category}
          </div>
          <div>
            <span className="font-semibold">Account:</span> {transaction.account}
          </div>
          <div>
            <span className="font-semibold">Date:</span> {transaction.date}
          </div>
          {transaction.tags && transaction.tags.length > 0 && (
            <div>
              <span className="font-semibold">Tags:</span> {transaction.tags.map(tag => <Badge key={tag} variant="secondary" className="ml-1">{tag}</Badge>)}
            </div>
          )}
          {transaction.recurring && (
            <div>
              <span className="font-semibold">Recurring:</span> {transaction.recurringInterval}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 