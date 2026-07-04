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
import MarksheetPreview from './marksheet-preview';

const MarksheetBuilderForm = ({ template }: { template?: MarksheetTemplate | null }) => {
   const [logoPreview, setLogoPreview] = useState(template?.logo_path);

   const { data, setData, post, processing, errors } = useForm({
      type: template?.type || 'course',
      name: template?.name || 'Meu modelo de boletim',
      logo: null as File | null,
      template_data: template?.template_data || {
         primaryColor: '#1e40af',
         secondaryColor: '#475569',
         backgroundColor: '#ffffff',
         borderColor: '#2563eb',
         headerText: 'Boletim do curso',
         institutionName: 'Nome da instituição',
         footerText: 'Este é um boletim oficial',
         fontFamily: 'sans-serif',
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
         post(route('marksheet.templates.update', template.id));
      } else {
         // Create new template
         post(route('marksheet.templates.store'));
      }
   };

   return (
      <div className="grid gap-6 lg:grid-cols-2">
         {/* Form Section */}
         <div className="space-y-6">
            <Card>
               <CardHeader>
                  <CardTitle>Informações básicas</CardTitle>
                  <CardDescription>Defina o nome do modelo</CardDescription>
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
                           {/* <SelectItem value="exam">Exam</SelectItem> */}
                        </SelectContent>
                     </Select>
                     {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="name">Nome do modelo</Label>
                     <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Ex.: Boletim azul moderno" />
                     {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle>Logo e identidade visual</CardTitle>
                  <CardDescription>Envie o logo da instituição</CardDescription>
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
                  <CardDescription>Personalize o esquema de cores do boletim</CardDescription>
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
                              placeholder="#1e40af"
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
                              placeholder="#475569"
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
                              placeholder="#ffffff"
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
                              placeholder="#2563eb"
                           />
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle>Tipografia</CardTitle>
                  <CardDescription>Escolha o estilo de fonte do boletim</CardDescription>
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
                        </SelectContent>
                     </Select>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle>Conteúdo do boletim</CardTitle>
                  <CardDescription>Personalize o conteúdo textual do boletim</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor="headerText">Texto do cabeçalho</Label>
                     <Input
                        id="headerText"
                        value={data.template_data.headerText}
                        onChange={(e) => setData('template_data', { ...data.template_data, headerText: e.target.value })}
                        placeholder="Boletim do curso"
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="institutionName">Nome da instituição</Label>
                     <Input
                        id="institutionName"
                        value={data.template_data.institutionName}
                        onChange={(e) => setData('template_data', { ...data.template_data, institutionName: e.target.value })}
                        placeholder="Nome da instituição"
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="footerText">Texto do rodapé</Label>
                     <Textarea
                        id="footerText"
                        value={data.template_data.footerText}
                        onChange={(e) => setData('template_data', { ...data.template_data, footerText: e.target.value })}
                        placeholder="Este é um boletim oficial"
                        rows={3}
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
                  <CardDescription>Veja como seu boletim ficará</CardDescription>
               </CardHeader>
               <CardContent>
                  <MarksheetPreview
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

export default MarksheetBuilderForm;
