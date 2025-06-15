
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Settings, Bell } from 'lucide-react';
import { useSettings, NotificationFrequency } from '@/contexts/SettingsContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { 
    notificationFrequency, 
    setNotificationFrequency 
  } = useSettings();

  const frequencyOptions = [
    { value: '15-mins' as NotificationFrequency, label: '15 Minutes', description: 'Every 15 minutes' },
    { value: '30-mins' as NotificationFrequency, label: '30 Minutes', description: 'Every 30 minutes' },
    { value: '1-hour' as NotificationFrequency, label: '1 Hour', description: 'Every hour' },
    { value: '3-hours' as NotificationFrequency, label: '3 Hours', description: 'Every 3 hours' },
    { value: '6-hours' as NotificationFrequency, label: '6 Hours', description: 'Every 6 hours' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 rounded-3xl border-0 bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Settings size={20} className="text-indigo-600" />
            <DialogTitle className="text-xl font-semibold text-slate-800">
              Settings
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Notification Frequency Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-indigo-600" />
              <Label className="text-sm font-medium text-slate-700">
                Prayer Reminder Frequency
              </Label>
            </div>
            
            <RadioGroup 
              value={notificationFrequency} 
              onValueChange={(value) => setNotificationFrequency(value as NotificationFrequency)}
              className="space-y-3"
            >
              {frequencyOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <div className="flex-1">
                    <Label htmlFor={option.value} className="text-sm font-medium text-slate-700">
                      {option.label}
                    </Label>
                    <p className="text-xs text-slate-500">{option.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-600 mb-4">
              The app will randomly select a prayer from your active prayers to remind you about.
            </p>
            
            <Button
              onClick={onClose}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
