import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Account } from "@/stores/financeStore";

interface AccountViewModalProps {
  open: boolean;
  account?: Account;
  onClose: () => void;
}

export const AccountViewModal = ({ open, account, onClose }: AccountViewModalProps) => {
  if (!account) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Account Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <span className="font-semibold">Name:</span> {account.name}
          </div>
          <div>
            <span className="font-semibold">Type:</span> {account.type}
          </div>
          <div>
            <span className="font-semibold">Balance:</span> {new Intl.NumberFormat('en-US', { style: 'currency', currency: account.currency }).format(account.balance)}
          </div>
          <div>
            <span className="font-semibold">Currency:</span> {account.currency}
          </div>
          {account.institution && (
            <div>
              <span className="font-semibold">Institution:</span> {account.institution}
            </div>
          )}
          <div>
            <span className="font-semibold">Status:</span> <Badge variant={account.isActive ? "default" : "secondary"}>{account.isActive ? "Active" : "Inactive"}</Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 