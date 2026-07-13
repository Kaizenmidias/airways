import TiptapRenderer from '@/components/text-editor/tiptap-renderer/client-renderer';

const Overview = ({ course }: { course: Course }) => {
   return (
      <div className="prose max-w-none">
         <TiptapRenderer>{course.description as string}</TiptapRenderer>
      </div>
   );
};

export default Overview;
