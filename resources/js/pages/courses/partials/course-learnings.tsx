import { Check } from 'lucide-react';

const CourseLearnings = ({ learnings = [] }: { learnings?: CourseLearning[] }) => {
   return (
      <div className="space-y-4">
         {learnings.map((item) => (
            <div key={item.id} className="flex gap-3">
               <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#FD122E]" />
               <p className="leading-7 text-slate-700">{item.learning}</p>
            </div>
         ))}
      </div>
   );
};

export default CourseLearnings;
