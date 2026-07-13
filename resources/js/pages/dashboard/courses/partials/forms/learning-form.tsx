import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Input } from '@/components/ui/input';
import { onHandleChange } from '@/lib/inertia';
import { SharedData } from '@/types/global';
import { useForm, usePage } from '@inertiajs/react';

const LearningForm = ({ learning }: { learning: CourseLearning }) => {
   const { props } = usePage<SharedData>();
   const { translate } = props;
   const { button } = translate;

   const {
      data,
      setData,
      put,
      delete: destroy,
      errors,
      processing,
   } = useForm({
      learning: learning ? learning.learning : '',
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      put(route('learnings.update', { learning: learning.id }));
   };

   const handleDelete = () => {
      destroy(route('learnings.destroy', { learning: learning.id }));
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-2">
         <div>
            <Input
               required
               type="text"
               name="learning"
               value={data.learning || ''}
               placeholder="Digite uma frase que o aluno irá aprender"
               onChange={(e) => onHandleChange(e, setData)}
            />

            <InputError message={errors.learning} />
         </div>

         <div className="flex items-center justify-end gap-2">
            <LoadingButton
               type="button"
               variant="outline"
               loading={processing}
               onClick={handleDelete}
               className="h-7 w-full bg-red-50 text-xs hover:bg-red-100"
            >
               {button.remove}
            </LoadingButton>
            <LoadingButton variant="secondary" className="h-7 w-full text-xs" loading={processing}>
               {button.save}
            </LoadingButton>
         </div>
      </form>
   );
};

export default LearningForm;
