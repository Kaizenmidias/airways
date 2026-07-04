import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

interface Props {
   data: any;
   setData: (key: string, value: any) => void;
   errors: any;
}

const FillBlankForm = ({ data, setData, errors }: Props) => {
   const answers: string[] = data.options?.answers || [];

   useEffect(() => {
      if (answers.length === 0) {
         setData('options', { answers: [''] });
      }
   }, []);

   const addAnswer = () => {
      const newAnswers = [...answers, ''];
      setData('options', { answers: newAnswers });
   };

   const removeAnswer = (index: number) => {
      const newAnswers = answers.filter((_, i) => i !== index);
      setData('options', { answers: newAnswers });
   };

   const updateAnswer = (index: number, value: string) => {
      const newAnswers = [...answers];
      newAnswers[index] = value;
      setData('options', { answers: newAnswers });
   };

   return (
      <div className="space-y-4">
         <div>
            <Label>Instruções</Label>
            <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-900">
               <p className="mb-1 font-medium">Como usar questões de preenchimento de lacunas:</p>
               <p>1. Escreva a questão no campo de título acima</p>
               <p>2. Use sublinhados (___) ou colchetes [blank] para marcar onde o aluno deve responder</p>
               <p>3. Adicione a(s) resposta(s) correta(s) abaixo</p>
            </div>
         </div>

         <div className="space-y-3">
            <div className="flex items-center justify-between">
               <Label>Respostas aceitas *</Label>
               <Button type="button" variant="outline" size="sm" onClick={addAnswer}>
                  <Plus className="h-4 w-4" />
                  Adicionar resposta alternativa
               </Button>
            </div>

            <p className="text-sm text-gray-600">Adicione variações quando houver diferentes formas corretas de responder</p>

            {answers.map((answer, index) => (
               <div key={index} className="flex gap-2">
                  <div className="flex-1">
                     <Input placeholder={`Resposta correta ${index + 1}`} value={answer} onChange={(e) => updateAnswer(index, e.target.value)} />
                  </div>
                  {answers.length > 1 && (
                     <Button type="button" variant="ghost" size="sm" onClick={() => removeAnswer(index)} className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  )}
               </div>
            ))}
         </div>

         <InputError message={errors.options} />
      </div>
   );
};

export default FillBlankForm;
