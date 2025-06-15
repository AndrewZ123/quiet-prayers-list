
import { PrayerRequest } from '@/types/PrayerRequest';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface PrayerCardProps {
  prayer: PrayerRequest;
  onClick: () => void;
}

const PrayerCard = ({ prayer, onClick }: PrayerCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.01] hover:bg-white ${
        prayer.isAnswered ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className={`font-semibold text-slate-800 ${prayer.isAnswered ? 'line-through' : ''}`}>
              {prayer.title}
            </h3>
            {prayer.isAnswered && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                Answered
              </Badge>
            )}
          </div>
          {prayer.description && (
            <p className="text-slate-600 text-sm line-clamp-2 mb-2">
              {prayer.description}
            </p>
          )}
          {prayer.isAnswered && prayer.answeredDate && (
            <p className="text-xs text-slate-500">
              Answered on {format(new Date(prayer.answeredDate), 'MMM d, yyyy')}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge 
            variant="outline" 
            className="bg-indigo-50 text-indigo-700 border-indigo-200 rounded-full px-2 py-1 text-xs font-medium"
          >
            {prayer.notificationCount} prayers
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default PrayerCard;
