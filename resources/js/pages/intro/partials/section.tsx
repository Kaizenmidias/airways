import SectionEditor from '@/components/section-editor';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Pencil } from 'lucide-react';
import { ReactNode } from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
   children: ReactNode;
   customize: boolean;
   pageSection: PageSection | undefined;
   contentClass?: string;
   containerClass?: string;
   containerStyle?: React.CSSProperties;
   contentStyle?: React.CSSProperties;
   editorButtonClassName?: string;
}

const Section = ({
   containerClass,
   contentClass,
   children,
   pageSection,
   customize,
   containerStyle,
   contentStyle,
   editorButtonClassName = 'top-3 right-3',
   ...props
}: SectionProps) => {
   return (
      <section className={cn('container', containerClass)} {...props} style={containerStyle}>
         <div className={cn(contentClass, customize && 'section-edit')} style={contentStyle}>
            {customize && pageSection && (
               <SectionEditor
                  section={pageSection}
                  actionComponent={
                     <Button size="icon" variant="secondary" className={cn('absolute z-50', editorButtonClassName)}>
                        <Pencil className="h-7 w-7" />
                     </Button>
                  }
               />
            )}

            {/* Content */}
            {children}
         </div>
      </section>
   );
};

export default Section;

