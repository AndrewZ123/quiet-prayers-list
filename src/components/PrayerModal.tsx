
import { useState } from 'react';
import { PrayerRequest } from '@/types/PrayerRequest';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Heart, Check, Edit3 } from 'lucide-react';
import { format } from 'date-fns';

interface PrayerModalProps {
  prayer: PrayerRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (prayer: PrayerRequest) => void;
  onPray: (prayerId: string) => void;
}

const PrayerModal = ({ prayer, isOpen, onClose, onUpdate, onPray }: PrayerModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrayer, setEditedPrayer] = useState<PrayerRequest | null>(null);

  const handleEdit = () => {
    if (prayer) {
      setEditedPrayer({ ...prayer });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (editedPrayer) {
      onUpdate(editedPrayer);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPrayer(null);
  };

  const handleMarkAnswered = () => {
    if (prayer) {
      const updatedPrayer = {
        ...prayer,
        isAnswered: true,
        answeredDate: new Date(),
      };
      onUpdate(updatedPrayer);
    }
  };

  const handlePray = () => {
    if (prayer && !prayer.isAnswered) {
      onPray(prayer.id);
    }
  };

  if (!prayer) return null;

  const currentPrayer = editedPrayer || prayer;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 rounded-3xl border-0 bg-white/95 backdrop-blur-sm">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-slate-800">
              Prayer Details
            </DialogTitle>
            {!isEditing && !prayer.isAnswered && (
              <Button
                onClick={handleEdit}
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-800"
              >
                <Edit3 size={16} />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {isEditing ? (
            // Edit Mode
            <>
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-slate-700">
                  Prayer Title
                </Label>
                <Input
                  id="title"
                  value={currentPrayer.title}
                  onChange={(e) =>
                    setEditedPrayer(prev => prev ? { ...prev, title: e.target.value } : null)
                  }
                  className="rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={currentPrayer.description}
                  onChange={(e) =>
                    setEditedPrayer(prev => prev ? { ...prev, description: e.target.value } : null)
                  }
                  className="rounded-xl border-slate-200 min-h-[100px]"
                  placeholder="Share more details about this prayer request..."
                />
              </div>

              {prayer.isAnswered && (
                <div className="space-y-2">
                  <Label htmlFor="reflection" className="text-sm font-medium text-slate-700">
                    Reflection
                  </Label>
                  <Textarea
                    id="reflection"
                    value={currentPrayer.reflection || ''}
                    onChange={(e) =>
                      setEditedPrayer(prev => prev ? { ...prev, reflection: e.target.value } : null)
                    }
                    className="rounded-xl border-slate-200 min-h-[80px]"
                    placeholder="Reflect on how this prayer was answered..."
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700">
                  Save Changes
                </Button>
                <Button onClick={handleCancel} variant="outline" className="flex-1 rounded-xl">
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            // View Mode
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h2 className={`text-lg font-semibold ${prayer.isAnswered ? 'line-through text-slate-600' : 'text-slate-800'}`}>
                    {prayer.title}
                  </h2>
                  {prayer.isAnswered && (
                    <Badge className="bg-green-100 text-green-700">
                      Answered
                    </Badge>
                  )}
                </div>

                {prayer.description && (
                  <p className="text-slate-600 leading-relaxed">
                    {prayer.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Heart size={14} />
                    {prayer.notificationCount} prayers
                  </span>
                  {prayer.answeredDate && (
                    <span>
                      Answered {format(new Date(prayer.answeredDate), 'MMM d, yyyy')}
                    </span>
                  )}
                </div>
              </div>

              {prayer.reflection && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-slate-700">Reflection</h3>
                    <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-xl">
                      {prayer.reflection}
                    </p>
                  </div>
                </>
              )}

              <div className="flex gap-2">
                {!prayer.isAnswered && (
                  <>
                    <Button
                      onClick={handlePray}
                      className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Heart size={16} className="mr-2" />
                      Pray
                    </Button>
                    <Button
                      onClick={handleMarkAnswered}
                      variant="outline"
                      className="flex-1 rounded-xl border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <Check size={16} className="mr-2" />
                      Mark Answered
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrayerModal;
