import ExamStatsCard from '@/components/exam/exam-stats-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import DashboardLayout from '@/layouts/dashboard/layout';
import { Head, Link } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Award, BookOpen, Calendar, DollarSign, Edit, Eye, TrendingUp, Users } from 'lucide-react';

interface Props {
   exam: Exam & {
      instructor: Instructor;
      exam_category: ExamCategory;
      questions: ExamQuestion[];
      enrollments: ExamEnrollment[];
      attempts: ExamAttempt[];
      reviews: ExamReview[];
   };
   stats: {
      total_enrollments: number;
      active_enrollments: number;
      total_attempts: number;
      completed_attempts: number;
      pass_rate: number;
      average_score: number;
      total_revenue: number;
   };
}

const ShowExam = ({ exam, stats }: Props) => {
   const recentEnrollments = exam.enrollments.slice(0, 5);
   const recentAttempts = exam.attempts.slice(0, 5);

   return (
      <DashboardLayout>
         <Head title={exam.title} />

         <div className="space-y-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <Link href={route('exams.index')}>
                     <Button variant="outline" size="sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar
                     </Button>
                  </Link>
                  <div>
                     <h1 className="text-3xl font-bold text-gray-900">{exam.title}</h1>
                     <p className="mt-1 text-gray-600">{exam.exam_category.title}</p>
                  </div>
               </div>
               <div className="flex gap-2">
                  <Link href={route('exams.edit', exam.id)}>
                     <Button size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                     </Button>
                  </Link>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
               <ExamStatsCard icon={Users} label="Matrículas totais" value={stats.total_enrollments.toString()} />
               <ExamStatsCard icon={TrendingUp} label="Alunos ativos" value={stats.active_enrollments.toString()} />
               <ExamStatsCard icon={Award} label="Taxa de aprovação" value={`${stats.pass_rate.toFixed(1)}%`} />
               <ExamStatsCard icon={DollarSign} label="Receita" value={`$${stats.total_revenue.toFixed(2)}`} />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
               <div className="space-y-6 lg:col-span-2">
                  <Card>
                     <CardHeader>
                        <CardTitle>Detalhes da prova</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <p className="text-sm text-gray-600">Status</p>
                              <Badge variant={exam.status === 'published' ? 'default' : exam.status === 'draft' ? 'secondary' : 'outline'}>
                                 {exam.status}
                              </Badge>
                           </div>
                           <div>
                              <p className="text-sm text-gray-600">Preço</p>
                              <p className="font-semibold">{exam.pricing_type === 'free' ? 'Grátis' : `$${exam.discount_price || exam.price}`}</p>
                           </div>
                           <div>
                              <p className="text-sm text-gray-600">Total de questões</p>
                              <p className="font-semibold">{exam.total_questions}</p>
                           </div>
                           <div>
                              <p className="text-sm text-gray-600">Nota total</p>
                              <p className="font-semibold">{exam.total_marks}</p>
                           </div>
                           <div>
                              <p className="text-sm text-gray-600">Duração</p>
                              <p className="font-semibold">
                                 {exam.duration_hours > 0 && `${exam.duration_hours}h `}
                                 {exam.duration_minutes > 0 && `${exam.duration_minutes}m`}
                              </p>
                           </div>
                           <div>
                              <p className="text-sm text-gray-600">Nota mínima</p>
                              <p className="font-semibold">{exam.pass_mark}</p>
                           </div>
                           <div>
                              <p className="text-sm text-gray-600">Máximo de tentativas</p>
                              <p className="font-semibold">{exam.max_attempts}</p>
                           </div>
                           <div>
                              <p className="text-sm text-gray-600">Nível</p>
                              <p className="font-semibold">{exam.level || 'Não definido'}</p>
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle>Análise de desempenho</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Total de tentativas</span>
                              <span className="font-semibold">{stats.total_attempts}</span>
                           </div>
                           <Separator />
                           <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Tentativas concluídas</span>
                              <span className="font-semibold">{stats.completed_attempts}</span>
                           </div>
                           <Separator />
                           <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Nota média</span>
                              <span className="font-semibold">{stats.average_score.toFixed(1)}%</span>
                           </div>
                           <Separator />
                           <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Taxa de aprovação</span>
                              <Badge variant={stats.pass_rate >= 70 ? 'default' : 'destructive'}>{stats.pass_rate.toFixed(1)}%</Badge>
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle>Tentativas recentes</CardTitle>
                     </CardHeader>
                     <CardContent>
                        {recentAttempts.length > 0 ? (
                           <div className="space-y-3">
                              {recentAttempts.map((attempt) => (
                                 <div key={attempt.id} className="flex items-center justify-between rounded-lg border p-3">
                                    <div>
                                       <p className="font-semibold">{attempt.user?.name}</p>
                                       <p className="text-sm text-gray-600">{format(parseISO(attempt.start_time), 'dd MMM yyyy HH:mm', { locale: ptBR })}</p>
                                    </div>
                                    <div className="text-right">
                                       <Badge
                                          variant={
                                             attempt.status === 'completed' ? 'default' : attempt.status === 'abandoned' ? 'destructive' : 'secondary'
                                          }
                                       >
                                          {attempt.status}
                                       </Badge>
                                       <p className="mt-1 text-sm font-semibold">
                                          {attempt.obtained_marks}/{attempt.total_marks}
                                       </p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <p className="text-center text-sm text-gray-600">Nenhuma tentativa ainda</p>
                        )}
                     </CardContent>
                  </Card>
               </div>

               <div className="space-y-6">
                  <Card>
                     <CardHeader>
                        <CardTitle className="text-base">Ações rápidas</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-2">
                        <Link href={route('student.exams.show', exam.slug)} target="_blank">
                           <Button variant="outline" className="w-full justify-start">
                              <Eye className="mr-2 h-4 w-4" />
                              Ver como aluno
                           </Button>
                        </Link>
                        <Link href={route('exams.questions.index', exam.id)}>
                           <Button variant="outline" className="w-full justify-start">
                              <BookOpen className="mr-2 h-4 w-4" />
                              Gerenciar questões
                           </Button>
                        </Link>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle className="text-base">Matrículas recentes</CardTitle>
                     </CardHeader>
                     <CardContent>
                        {recentEnrollments.length > 0 ? (
                           <div className="space-y-3">
                              {recentEnrollments.map((enrollment) => (
                                 <div key={enrollment.id} className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <div className="flex-1">
                                       <p className="text-sm font-semibold">{enrollment.user?.name}</p>
                                       <p className="text-xs text-gray-600">{format(parseISO(enrollment.entry_date), 'dd MMM yyyy', { locale: ptBR })}</p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <p className="text-center text-sm text-gray-600">Nenhuma matrícula ainda</p>
                        )}
                     </CardContent>
                  </Card>

                  {exam.reviews.length > 0 && (
                     <Card>
                        <CardHeader>
                           <CardTitle className="text-base">Avaliações</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="text-center">
                              <p className="text-3xl font-bold">{(exam.reviews.reduce((sum, r) => sum + r.rating, 0) / exam.reviews.length).toFixed(1)}</p>
                              <p className="text-sm text-gray-600">{exam.reviews.length} avaliações</p>
                           </div>
                        </CardContent>
                     </Card>
                  )}
               </div>
            </div>
         </div>
      </DashboardLayout>
   );
};

export default ShowExam;
