import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useState } from 'react';
import CertificatePreview from './certificate-preview';

const CertificateBuilderForm = ({ template }: { template?: CertificateTemplate | null }) => {
   const [logoPreview, setLogoPreview] = useState(template?.logo_path);

   const { data, setData, post, processing, errors } = useForm({
      type: template?.type || 'course',
      name: template?.name || 'Meu modelo de certificado',
      logo: null as File | null,
      template_data: template?.template_data || {
         primaryColor: '#3730a3',
         secondaryColor: '#4b5563',
         backgroundColor: '#dbeafe',
         borderColor: '#f59e0b',
         titleText: 'Certificado de conclusão',
         descriptionText: 'Este certificado é concedido a',
         completionText: 'por concluir com sucesso o curso',
         footerText: 'Certificado autorizado',
         fontFamily: 'serif',
      },
   });

   const onLogoChange = (name: string, value: unknown) => {
      setData(name as any, value as any);
      setLogoPreview(URL.createObjectURL(value as File));
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (template) {
         // Update existing template
         post(route('certificate.templates.update', template.id));
      } else {
         // Create new template
         post(route('certificate.templates.store'));
      }
   };

   return (
      <div className="grid gap-6 lg:grid-cols-2">
         {/* Form Section */}
         <div className="space-y-6">
            <Card>
               <CardHeader>
                  <CardTitle>Informações básicas</CardTitle>
                  <CardDescription>Defina o nome do modelo e o status de ativação</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor="type">Tipo de modelo</Label>
                     <Select value={data.type} onValueChange={(value) => setData('type', value as any)}>
                        <SelectTrigger>
                           <SelectValue placeholder="Selecione o tipo de modelo" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="course">Curso</SelectItem>
                           <SelectItem value="exam">Prova</SelectItem>
                        </SelectContent>
                     </Select>
                     {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="name">Nome do modelo</Label>
                     <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Ex.: Certificado azul moderno"
                     />
                     {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle>Logo e identidade visual</CardTitle>
                  <CardDescription>Envie o logo da instituição ou do curso</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor="logo">Imagem do logo</Label>
                     <div className="space-y-2">
                        {logoPreview && (
                           <div className="h-20 w-20 overflow-hidden rounded border">
                              <img src={logoPreview} alt="Logo preview" className="h-full w-full object-contain" />
                           </div>
                        )}
                        <div className="flex-1">
                           <Input id="logo" type="file" accept="image/*" onChange={(e) => onLogoChange('logo', e.target.files?.[0])} />
                        </div>
                     </div>
                     <p className="text-muted-foreground text-xs">Recomendado: PNG ou SVG, máximo de 1 MB</p>
                     <InputError message={errors.logo} />
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle>Cores</CardTitle>
                  <CardDescription>Personalize o esquema de cores do certificado</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="primaryColor">Cor primária</Label>
                        <div className="flex gap-2">
                           <Input
                              id="primaryColor"
                              type="color"
                              value={data.template_data.primaryColor}
                              onChange={(e) => setData('template_data', { ...data.template_data, primaryColor: e.target.value })}
                              className="h-10 w-16"
                           />
                           <Input
                              value={data.template_data.primaryColor}
                              onChange={(e) => setData('template_data', { ...data.template_data, primaryColor: e.target.value })}
                              placeholder="#3730a3"
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="secondaryColor">Cor secundária</Label>
                        <div className="flex gap-2">
                           <Input
                              id="secondaryColor"
                              type="color"
                              value={data.template_data.secondaryColor}
                              onChange={(e) => setData('template_data', { ...data.template_data, secondaryColor: e.target.value })}
                              className="h-10 w-16"
                           />
                           <Input
                              value={data.template_data.secondaryColor}
                              onChange={(e) => setData('template_data', { ...data.template_data, secondaryColor: e.target.value })}
                              placeholder="#4b5563"
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="backgroundColor">Cor de fundo</Label>
                        <div className="flex gap-2">
                           <Input
                              id="backgroundColor"
                              type="color"
                              value={data.template_data.backgroundColor}
                              onChange={(e) => setData('template_data', { ...data.template_data, backgroundColor: e.target.value })}
                              className="h-10 w-16"
                           />
                           <Input
                              value={data.template_data.backgroundColor}
                              onChange={(e) => setData('template_data', { ...data.template_data, backgroundColor: e.target.value })}
                              placeholder="#dbeafe"
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="borderColor">Cor da borda</Label>
                        <div className="flex gap-2">
                           <Input
                              id="borderColor"
                              type="color"
                              value={data.template_data.borderColor}
                              onChange={(e) => setData('template_data', { ...data.template_data, borderColor: e.target.value })}
                              className="h-10 w-16"
                           />
                           <Input
                              value={data.template_data.borderColor}
                              onChange={(e) => setData('template_data', { ...data.template_data, borderColor: e.target.value })}
                              placeholder="#f59e0b"
                           />
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle>Tipografia</CardTitle>
                  <CardDescription>Escolha o estilo de fonte do certificado</CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="space-y-2">
                     <Label htmlFor="fontFamily">Família da fonte</Label>
                     <Select
                        value={data.template_data.fontFamily}
                        onValueChange={(value) => setData('template_data', { ...data.template_data, fontFamily: value })}
                     >
                        <SelectTrigger>
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="serif">Serif (clássica)</SelectItem>
                           <SelectItem value="sans-serif">Sans Serif (moderna)</SelectItem>
                           <SelectItem value="monospace">Monospace (técnica)</SelectItem>
                           <SelectItem value="cursive">Cursiva (elegante)</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle>Texto do certificado</CardTitle>
                  <CardDescription>Personalize o conteúdo textual do certificado</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor="titleText">Texto do título</Label>
                     <Input
                        id="titleText"
                        value={data.template_data.titleText}
                        onChange={(e) => setData('template_data', { ...data.template_data, titleText: e.target.value })}
                        placeholder="Certificado de conclusão"
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="descriptionText">Texto da descrição</Label>
                     <Textarea
                        id="descriptionText"
                        value={data.template_data.descriptionText}
                        onChange={(e) => setData('template_data', { ...data.template_data, descriptionText: e.target.value })}
                        placeholder="Este certificado é concedido a"
                        rows={3}
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="completionText">Texto de conclusão</Label>
                     <Input
                        id="completionText"
                        value={data.template_data.completionText}
                        onChange={(e) => setData('template_data', { ...data.template_data, completionText: e.target.value })}
                        placeholder="por concluir com sucesso o curso"
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="footerText">Texto do rodapé</Label>
                     <Input
                        id="footerText"
                        value={data.template_data.footerText}
                        onChange={(e) => setData('template_data', { ...data.template_data, footerText: e.target.value })}
                        placeholder="Certificado autorizado"
                     />
                  </div>
               </CardContent>
            </Card>

            <Button onClick={handleSubmit} disabled={processing} className="w-full">
               <Save className="mr-2 h-4 w-4" />
               {processing ? 'Salvando...' : template ? 'Atualizar modelo' : 'Criar modelo'}
            </Button>
         </div>

         {/* Preview Section */}
         <div className="lg:sticky lg:top-6">
            <Card>
               <CardHeader>
                  <CardTitle>Prévia em tempo real</CardTitle>
                  <CardDescription>Veja como seu certificado ficará</CardDescription>
               </CardHeader>
               <CardContent>
                  <CertificatePreview
                     template={data}
                     studentName="John Doe"
                     courseName="Sample Course Name"
                     completionDate="1 de janeiro de 2025"
                     logoUrl={logoPreview}
                  />
               </CardContent>
            </Card>
         </div>
      </div>
   );
};

export default CertificateBuilderForm;
