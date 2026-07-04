import ChunkedUploaderInput from '@/components/chunked-uploader-input';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface Props {
   data: any;
   errors: any;
   setData: (key: string, value: any) => void;
   isSubmit: boolean;
   setIsFileSelected: (value: boolean) => void;
   setIsFileUploaded: (value: boolean) => void;
   setIsSubmit: (value: boolean) => void;
}

const ListeningForm = ({ data, setData, errors, isSubmit, setIsFileSelected, setIsFileUploaded, setIsSubmit }: Props) => {
   const [audioSource, setAudioSource] = useState<'url' | 'upload'>(data.options?.audio_source || 'url');

   const updateAudioSource = (source: 'url' | 'upload') => {
      setAudioSource(source);
      setData('options', {
         ...data.options,
         audio_source: source,
         audio_url: source === 'url' ? data.options?.audio_url || '' : '',
      });
   };

   return (
      <div className="space-y-4">
         <div>
            <Label>Instruções</Label>
            <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-900">
               <p className="mb-1 font-medium">Como funcionam as questões de compreensão auditiva:</p>
               <p>• Envie ou adicione o link de um arquivo de áudio</p>
               <p>• Os alunos ouvem o áudio e respondem à questão</p>
               <p>• Você pode usar múltipla escolha ou resposta curta</p>
            </div>
         </div>

         <div>
            <Label>Fonte do áudio</Label>
            <RadioGroup value={audioSource} onValueChange={(value: 'url' | 'upload') => updateAudioSource(value)} className="flex gap-4 pt-2">
               <div className="flex items-center space-x-2">
                  <RadioGroupItem value="url" id="url" />
                  <Label htmlFor="url" className="cursor-pointer font-normal">
                     URL do áudio
                  </Label>
               </div>
               <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upload" id="upload" />
                  <Label htmlFor="upload" className="cursor-pointer font-normal">
                     Enviar arquivo
                  </Label>
               </div>
            </RadioGroup>
         </div>

         {audioSource === 'url' ? (
            <div>
               <Label>URL do áudio *</Label>
               <Input
                  type="url"
                  placeholder="https://example.com/audio.mp3"
                  value={data.options?.audio_url || ''}
                  onChange={(e) =>
                     setData('options', {
                        ...data.options,
                        audio_url: e.target.value,
                     })
                  }
               />
               <p className="mt-1 text-xs text-gray-500">Link direto para um arquivo de áudio (MP3, WAV ou OGG)</p>
            </div>
         ) : (
            <div className="space-y-3">
               <div>
                  <Label>Enviar arquivo de áudio *</Label>
                  <ChunkedUploaderInput
                     isSubmit={isSubmit}
                     filetype="audio"
                     delayUpload={true}
                     onFileSelected={() => {
                        setIsFileSelected(true);
                     }}
                     onFileUploaded={(fileData) => {
                        setIsFileUploaded(true);
                        setData('options', {
                           ...data.options,
                           new_audio_url: fileData.file_url,
                        });
                     }}
                     onError={() => {
                        setIsSubmit(false);
                        setIsFileSelected(false);
                     }}
                     onCancelUpload={() => {
                        setIsSubmit(false);
                        setIsFileSelected(false);
                     }}
                  />
                  <p className="mt-1 text-xs text-gray-500">Formatos aceitos: MP3, WAV e OGG (máximo de 100 MB)</p>
               </div>
            </div>
         )}

         <div>
            <Label>Instruções da resposta</Label>
            <Textarea
               placeholder="O que os alunos devem responder após ouvir? (ex.: 'Resuma os pontos principais' ou 'Responda às perguntas a seguir')"
               rows={3}
               value={data.options?.instructions || ''}
               onChange={(e) =>
                  setData('options', {
                     ...data.options,
                     instructions: e.target.value,
                  })
               }
            />
         </div>

         <InputError message={errors.options} />
      </div>
   );
};

export default ListeningForm;
