
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PrayerCard from '@/components/PrayerCard';
import PrayerModal from '@/components/PrayerModal';
import AddPrayerModal from '@/components/AddPrayerModal';
import { usePrayerStorage } from '@/hooks/usePrayerStorage';
import { PrayerRequest } from '@/types/PrayerRequest';
import { NotificationService } from '@/services/notificationService';

const Index = () => {
  const { prayers, addPrayer, updatePrayer, incrementPrayerCount } = usePrayerStorage();
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerRequest | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Initialize notifications when app loads
  useEffect(() => {
    NotificationService.initialize();
  }, []);

  const handlePrayerClick = (prayer: PrayerRequest) => {
    setSelectedPrayer(prayer);
  };

  const handleClosePrayerModal = () => {
    setSelectedPrayer(null);
  };

  const handleAddPrayer = (title: string, description: string) => {
    addPrayer(title, description);
  };

  const handlePray = (prayerId: string) => {
    incrementPrayerCount(prayerId);
  };

  // Sort prayers: active prayers first, then answered prayers
  const sortedPrayers = [...prayers].sort((a, b) => {
    if (a.isAnswered !== b.isAnswered) {
      return a.isAnswered ? 1 : -1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Prompted</h1>
            <p className="text-slate-600">Your prayer requests</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {prayers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
              <Plus size={24} className="text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">No prayers yet</h2>
            <p className="text-slate-600 mb-6">Start by adding your first prayer request</p>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="rounded-full bg-indigo-600 hover:bg-indigo-700 px-6 py-2"
            >
              <Plus size={16} className="mr-2" />
              Add Prayer
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedPrayers.map((prayer) => (
              <PrayerCard
                key={prayer.id}
                prayer={prayer}
                onClick={() => handlePrayerClick(prayer)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      {prayers.length > 0 && (
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            size="lg"
            className="rounded-full w-14 h-14 bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus size={24} />
          </Button>
        </div>
      )}

      {/* Modals */}
      <PrayerModal
        prayer={selectedPrayer}
        isOpen={!!selectedPrayer}
        onClose={handleClosePrayerModal}
        onUpdate={updatePrayer}
        onPray={handlePray}
      />

      <AddPrayerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddPrayer}
      />
    </div>
  );
};

export default Index;
