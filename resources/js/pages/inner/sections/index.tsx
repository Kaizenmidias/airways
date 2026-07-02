import CallToAction from './call-to-action';
import Hero from './hero';
import SuccessStatistics from './success-statistics';
import Team from './team';
import TopInstructors from './top-instructors';
import { isAirwaysFeatureEnabled } from '@/lib/airways';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types/global';

interface Props {
   sections: PageSection[];
}

const Index = ({ sections }: Props) => {
   const { props } = usePage<SharedData>();
   const components: any[] = [];

   sections
      .filter((section) => section.active)
      .map((section) => {
         switch (section.slug) {
            case 'hero':
               components.push(Hero);
               break;

            case 'success_statistics':
               components.push(SuccessStatistics);
               break;

            case 'team':
               components.push(Team);
               break;

            case 'call_to_action':
               components.push(CallToAction);
               break;

            case 'top_instructors':
               if (!isAirwaysFeatureEnabled(props.airways, 'instructors')) break;
               components.push(TopInstructors);
               break;

            default:
               break;
         }
      });

   return (
      <div>
         {components.map((Component, index) => (
            <Component key={`about-us-1-${index}`} />
         ))}
      </div>
   );
};

export default Index;
