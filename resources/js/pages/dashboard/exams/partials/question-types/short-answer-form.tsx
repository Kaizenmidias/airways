import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Props {
   data: any;
   setData: (key: string, value: any) => void;
   errors: any;
}

const ShortAnswerForm = ({ data, setData, errors }: Props) => {
   return (
      <div className="space-y-4">
         <div>
            <Label>Instruções</Label>
            <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-900">
               <p className="mb-1 font-medium">Sobre questões de resposta curta:</p>
               <p>• Os alunos vão digitar a resposta em uma caixa de texto</p>
               <p>• Essas questões exigem correção manual do instrutor</p>
               <p>• Você pode adicionar uma resposta modelo ou critério de correção abaixo</p>
            </div>
         </div>

         <div>
            <Label>Orientações (opcional)</Label>
            <Textarea
               placeholder="Digite uma resposta modelo ou orientações para correção desta questão..."
               rows={5}
               value={data.options?.sample_answer || ''}
               onChange={(e) =>
                  setData('options', {
                     ...data.options,
                     sample_answer: e.target.value,
                  })
               }
            />
            <p className="mt-1 text-xs text-gray-500">Isso ajuda os corretores a avaliar as respostas de forma consistente</p>
            <InputError message={errors.options} />
         </div>
      </div>
   );
};

export default ShortAnswerForm;
