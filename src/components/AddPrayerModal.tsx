
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface AddPrayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, description: string) => void;
}

const AddPrayerModal = ({ isOpen, onClose, onAdd }: AddPrayerModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (title.trim()) {
      onAdd(title.trim(), description.trim());
      setTitle('');
      setDescription('');
      onClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-4 rounded-3xl border-0 bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-800">
            New Prayer Request
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="new-title" className="text-sm font-medium text-slate-700">
              Prayer Title *
            </Label>
            <Input
              id="new-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What would you like to pray for?"
              className="rounded-xl border-slate-200"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-description" className="text-sm font-medium text-slate-700">
              Description
            </Label>
            <Textarea
              id="new-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share more details about this prayer request..."
              className="rounded-xl border-slate-200 min-h-[100px]"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              Add Prayer
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPrayerModal;
