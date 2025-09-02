import React from 'react';
import { Briefcase, Users, Calendar, CheckCircle } from 'lucide-react';

const CountCard = ({ title, count, period, icon }) => {
  const iconConfig = {
    briefcase: { bg: 'bg-pink-600', text: 'text-pink-400', icon: Briefcase },
    users: { bg: 'bg-purple-600', text: 'text-purple-400', icon: Users },
    calendar: { bg: 'bg-cyan-600', text: 'text-cyan-400', icon: Calendar },
    check: { bg: 'bg-green-600', text: 'text-green-400', icon: CheckCircle },
  };

  const { bg, text, icon: Icon } = iconConfig[icon] || { 
    bg: 'bg-gray-600', 
    text: 'text-gray-400', 
    icon: Briefcase 
  };

  return (
    <div className="w-full h-40 sm:h-44 bg-gray-800 border border-gray-700 rounded-lg flex flex-col items-center justify-center p-4 sm:p-6 text-white shadow-lg hover:border-pink-300 transition-all">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${bg} rounded-full flex items-center justify-center mb-2 sm:mb-3`}>
        <Icon color="white" size={20} className="sm:size-6" />
      </div>
      <div className={`text-2xl sm:text-3xl font-bold ${text} mb-1 sm:mb-2`}>{count}</div>
      <div className="text-sm sm:text-base text-gray-400 text-center">{title}</div>
      {period && <div className="text-xs text-gray-500 mt-1">{period}</div>}
    </div>
  );
};

export default CountCard;