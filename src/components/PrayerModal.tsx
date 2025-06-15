
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Bell, Check, X, Heart } from 'lucide-react';
import { PrayerRequest } from '@/types/PrayerRequest';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/useNotifications';

interface PrayerModalProps {
  prayer: PrayerRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (prayer: PrayerRequest) => void;
  onPray: (prayerId: string) => void;
}

const PrayerModal = ({ prayer, isOpen, onClose, onUpdate, onPray }: PrayerModalProps) => {
  const [editedPrayer, setEditedPrayer] = useState<PrayerRequest | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const { toast } = useToast();
  const { hasPermission, scheduleReminder, cancelReminder } = useNotifications();

  useEffect(() => {
    if (prayer) {
      setEditedPrayer({ ...prayer });
    }
  }, [prayer]);

  if (!prayer || !editedPrayer) return null;

  const handleSave = () => {
    onUpdate(editedPrayer);
    setIsEditing(false);
    toast({
      title: "Prayer Updated",
      description: "Your prayer has been saved successfully.",
    });
  };

  const handleMarkAnswered = () => {
    const updatedPrayer = {
      ...editedPrayer,
      isAnswered: !editedPrayer.isAnswered,
      answeredDate: !editedPrayer.isAnswered ? new Date() : undefined,
    };
    setEditedPrayer(updatedPrayer);
    onUpdate(updatedPrayer);
    
    if (!editedPrayer.isAnswered) {
      // Cancel any existing reminders when prayer is answered
      cancelReminder(prayer.id);
      toast({
        title: "Prayer Answered! 🙏",
        description: "Congratulations! This prayer has been marked as answered.",
      });
    } else {
      toast({
        title: "Prayer Reopened",
        description: "This prayer is now active again.",
      });
    }
  };

  const handlePray = () => {
    onPray(prayer.id);
    toast({
      title: "Prayer Counted 🙏",
      description: "Keep up the faithful prayers!",
    });
  };

  const handleSetReminder = async () => {
    if (!reminderDate || !reminderTime) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for the reminder",
        variant: "destructive",
      });
      return;
    }

    const reminderDateTime = new Date(`${reminderDate}T${reminderTime}`);
    if (reminderDateTime <= new Date()) {
      toast({
        title: "Invalid Time",
        description: "Please select a future date and time",
        variant: "destructive",
      });
      return;
    }

    const success = await scheduleReminder(
      prayer.id,
      prayer.title,
      prayer.description,
      reminderDateTime
    );

    if (success) {
      setReminderDate('');
      setReminderTime('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 rounded-3xl border-0 bg-white/95 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-slate-800">
              Prayer Details
            </DialogTitle>
            {editedPrayer.isAnswered && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Answered
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Prayer Content */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-slate-700">
                Prayer Title
              </Label>
              {isEditing ? (
                <Input
                  id="title"
                  value={editedPrayer.title}
                  onChange={(e) => setEditedPrayer({ ...editedPrayer, title: e.target.value })}
                  className="rounded-xl border-slate-200"
                />
              ) : (
                <p className="text-slate-800 font-medium">{editedPrayer.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                Description
              </Label>
              {isEditing ? (
                <Textarea
                  id="description"
                  value={editedPrayer.description}
                  onChange={(e) => setEditedPrayer({ ...editedPrayer, description: e.target.value })}
                  className="rounded-xl border-slate-200 min-h-[80px]"
                />
              ) : (
                <p className="text-slate-600">{editedPrayer.description || 'No description'}</p>
              )}
            </div>

            {editedPrayer.isAnswered && (
              <div className="space-y-2">
                <Label htmlFor="reflection" className="text-sm font-medium text-slate-700">
                  Reflection
                </Label>
                {isEditing ? (
                  <Textarea
                    id="reflection"
                    value={editedPrayer.reflection || ''}
                    onChange={(e) => setEditedPrayer({ ...editedPrayer, reflection: e.target.value })}
                    placeholder="How was this prayer answered? What did you learn?"
                    className="rounded-xl border-slate-200 min-h-[80px]"
                  />
                ) : (
                  <p className="text-slate-600 italic">
                    {editedPrayer.reflection || 'No reflection yet'}
                  </p>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Prayer Stats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Prayer Count</span>
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                {editedPrayer.notificationCount} prayers
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Created</span>
              <span className="text-sm text-slate-800">
                {format(new Date(editedPrayer.createdAt), 'MMM d, yyyy')}
              </span>
            </div>

            {editedPrayer.isAnswered && editedPrayer.answeredDate && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Answered</span>
                <span className="text-sm text-green-700 font-medium">
                  {format(new Date(editedPrayer.answeredDate), 'MMM d, yyyy')}
                </span>
              </div>
            )}

            {editedPrayer.lastNotificationDate && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Last Prayer</span>
                <span className="text-sm text-slate-800">
                  {format(new Date(editedPrayer.lastNotificationDate), 'MMM d, h:mm a')}
                </span>
              </div>
            )}
          </div>

          {/* Reminder Section - Only show if not answered */}
          {!editedPrayer.isAnswered && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Bell size={16} className="text-indigo-600" />
                  <Label className="text-sm font-medium text-slate-700">
                    Set Prayer Reminder
                  </Label>
                </div>
                
                {!hasPermission && (
                  <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                    Enable notifications in your device settings to receive prayer reminders
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    className="rounded-xl border-slate-200 text-sm"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <Input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="rounded-xl border-slate-200 text-sm"
                  />
                </div>

                <Button
                  onClick={handleSetReminder}
                  disabled={!hasPermission || !reminderDate || !reminderTime}
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl"
                >
                  <Bell size={14} className="mr-2" />
                  Schedule Reminder
                </Button>
              </div>
            </>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-3">
            {!editedPrayer.isAnswered && (
              <Button
                onClick={handlePray}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700"
              >
                <Heart size={16} className="mr-2" />
                Pray for This
              </Button>
            )}

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    className="flex-1 rounded-xl bg-green-600 hover:bg-green-700"
                  >
                    <Check size={16} className="mr-2" />
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setEditedPrayer({ ...prayer });
                      setIsEditing(false);
                    }}
                    variant="outline"
                    className="flex-1 rounded-xl"
                  >
                    <X size={16} className="mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="flex-1 rounded-xl"
                >
                  Edit
                </Button>
              )}

              <Button
                onClick={handleMarkAnswered}
                variant={editedPrayer.isAnswered ? "outline" : "default"}
                className={`flex-1 rounded-xl ${
                  editedPrayer.isAnswered 
                    ? 'border-slate-300' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {editedPrayer.isAnswered ? (
                  <>
                    <X size={16} className="mr-2" />
                    Reopen
                  </>
                ) : (
                  <>
                    <Check size={16} className="mr-2" />
                    Mark Answered
                  </>
                )}
              </Button>
            </div>

            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full rounded-xl"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrayerModal;
