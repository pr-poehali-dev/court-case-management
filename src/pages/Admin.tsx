import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type CaseType = '1' | '2' | '2a' | '3' | '4' | '5';

interface Case {
  id: string;
  caseNumber: string;
  type: CaseType;
  typeName: string;
  plaintiff: string;
  defendant: string;
  description: string;
  status: 'Принято' | 'В работе' | 'Завершено';
  date: string;
  notes?: string;
}

const caseTypes: Record<CaseType, string> = {
  '1': 'Уголовное дело',
  '2': 'Гражданское дело',
  '2a': 'Административное дело',
  '3': 'Судебный контроль',
  '4': 'Исполнение приговоров',
  '5': 'Административные правонарушения'
};

const Admin = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [cases, setCases] = useState<Case[]>([
    {
      id: '1',
      caseNumber: '2-001/2025',
      type: '2',
      typeName: 'Гражданское дело',
      plaintiff: 'Иванов И.И.',
      defendant: 'Петров П.П.',
      description: 'Взыскание задолженности по договору займа',
      status: 'В работе',
      date: '2025-01-15'
    },
    {
      id: '2',
      caseNumber: '1-002/2025',
      type: '1',
      typeName: 'Уголовное дело',
      plaintiff: 'Прокуратура',
      defendant: 'Сидоров С.С.',
      description: 'Дело о краже имущества',
      status: 'В работе',
      date: '2025-01-20'
    },
    {
      id: '3',
      caseNumber: '5-003/2025',
      type: '5',
      typeName: 'Административные правонарушения',
      plaintiff: 'ГИБДД',
      defendant: 'Смирнов А.А.',
      description: 'Нарушение правил дорожного движения',
      status: 'Принято',
      date: '2025-02-01'
    },
    {
      id: '4',
      caseNumber: '2-002/2025',
      type: '2',
      typeName: 'Гражданское дело',
      plaintiff: 'Козлов К.К.',
      defendant: 'ООО "Строй"',
      description: 'Расторжение договора подряда',
      status: 'Завершено',
      date: '2025-01-10'
    }
  ]);

  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [deletingCaseId, setDeletingCaseId] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.username === 'admin' && loginData.password === 'admin123') {
      setIsAuthenticated(true);
      toast({
        title: 'Вход выполнен',
        description: 'Добро пожаловать в административную панель'
      });
    } else {
      toast({
        title: 'Ошибка входа',
        description: 'Неверное имя пользователя или пароль',
        variant: 'destructive'
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginData({ username: '', password: '' });
    toast({
      title: 'Выход выполнен',
      description: 'Вы вышли из административной панели'
    });
  };

  const handleUpdateCase = () => {
    if (!editingCase) return;

    setCases(cases.map(c => c.id === editingCase.id ? editingCase : c));
    setEditingCase(null);
    toast({
      title: 'Дело обновлено',
      description: `Дело ${editingCase.caseNumber} успешно обновлено`
    });
  };

  const handleDeleteCase = () => {
    if (!deletingCaseId) return;

    const caseToDelete = cases.find(c => c.id === deletingCaseId);
    setCases(cases.filter(c => c.id !== deletingCaseId));
    setDeletingCaseId(null);
    toast({
      title: 'Дело удалено',
      description: `Дело ${caseToDelete?.caseNumber} удалено из системы`
    });
  };

  const getStatusColor = (status: Case['status']) => {
    switch (status) {
      case 'Принято': return 'bg-blue-100 text-blue-800';
      case 'В работе': return 'bg-amber-100 text-amber-800';
      case 'Завершено': return 'bg-green-100 text-green-800';
    }
  };

  const stats = {
    total: cases.length,
    byStatus: {
      'Принято': cases.filter(c => c.status === 'Принято').length,
      'В работе': cases.filter(c => c.status === 'В работе').length,
      'Завершено': cases.filter(c => c.status === 'Завершено').length
    },
    byType: Object.fromEntries(
      Object.entries(caseTypes).map(([key, value]) => [
        value,
        cases.filter(c => c.type === key).length
      ])
    )
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-scale-in">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-accent rounded-full flex items-center justify-center">
              <Icon name="Lock" size={40} className="text-white" />
            </div>
            <CardTitle className="text-2xl font-montserrat">Административная панель</CardTitle>
            <CardDescription>
              Южный городской суд
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Имя пользователя</Label>
                <Input
                  id="username"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  placeholder="admin"
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                <Icon name="LogIn" size={20} className="mr-2" />
                Войти
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                Тестовый доступ: admin / admin123
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="Shield" size={32} className="text-accent" />
              <div>
                <h1 className="text-2xl font-bold font-montserrat">Админ-панель</h1>
                <p className="text-xs opacity-80">Управление судебной системой</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="bg-white/10 border-white/20 hover:bg-white/20">
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-2">
            <TabsTrigger value="dashboard">
              <Icon name="BarChart3" size={18} className="mr-2" />
              Статистика
            </TabsTrigger>
            <TabsTrigger value="cases">
              <Icon name="FolderEdit" size={18} className="mr-2" />
              Управление делами
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="pb-3">
                  <CardDescription className="text-blue-700">Всего дел</CardDescription>
                  <CardTitle className="text-4xl font-bold text-blue-900">{stats.total}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Icon name="FolderOpen" size={24} className="text-blue-500 opacity-50" />
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <CardHeader className="pb-3">
                  <CardDescription className="text-amber-700">В работе</CardDescription>
                  <CardTitle className="text-4xl font-bold text-amber-900">{stats.byStatus['В работе']}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Icon name="Clock" size={24} className="text-amber-500 opacity-50" />
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
                <CardHeader className="pb-3">
                  <CardDescription className="text-cyan-700">Принято</CardDescription>
                  <CardTitle className="text-4xl font-bold text-cyan-900">{stats.byStatus['Принято']}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Icon name="Inbox" size={24} className="text-cyan-500 opacity-50" />
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="pb-3">
                  <CardDescription className="text-green-700">Завершено</CardDescription>
                  <CardTitle className="text-4xl font-bold text-green-900">{stats.byStatus['Завершено']}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Icon name="CheckCircle2" size={24} className="text-green-500 opacity-50" />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="PieChart" size={24} className="mr-3 text-accent" />
                    Распределение по типам
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(stats.byType).map(([type, count]) => {
                      const percentage = stats.total > 0 ? (count / stats.total * 100).toFixed(0) : 0;
                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{type}</span>
                            <span className="text-muted-foreground">{count} дел ({percentage}%)</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-accent transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="Activity" size={24} className="mr-3 text-accent" />
                    Распределение по статусам
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(stats.byStatus).map(([status, count]) => {
                      const percentage = stats.total > 0 ? (count / stats.total * 100).toFixed(0) : 0;
                      const colors = {
                        'Принято': 'bg-blue-500',
                        'В работе': 'bg-amber-500',
                        'Завершено': 'bg-green-500'
                      };
                      return (
                        <div key={status} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{status}</span>
                            <span className="text-muted-foreground">{count} дел ({percentage}%)</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${colors[status as keyof typeof colors]} transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cases" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon name="FolderEdit" size={28} className="mr-3 text-accent" />
                    Управление делами
                  </div>
                  <Badge variant="outline">{cases.length} дел</Badge>
                </CardTitle>
                <CardDescription>
                  Редактирование статусов и информации по делам
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cases.map((caseItem) => (
                    <Card key={caseItem.id} className="border-l-4 border-l-accent">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-lg flex items-center gap-2">
                              {caseItem.caseNumber}
                              <Badge className={getStatusColor(caseItem.status)}>
                                {caseItem.status}
                              </Badge>
                            </CardTitle>
                            <CardDescription>{caseItem.typeName}</CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingCase(caseItem)}
                            >
                              <Icon name="Edit" size={16} className="mr-1" />
                              Редактировать
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeletingCaseId(caseItem.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Icon name="Trash2" size={16} className="mr-1" />
                              Удалить
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Истец/Заявитель:</p>
                            <p className="font-medium">{caseItem.plaintiff}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Ответчик/Обвиняемый:</p>
                            <p className="font-medium">{caseItem.defendant}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">Описание:</p>
                          <p className="text-sm mt-1">{caseItem.description}</p>
                        </div>
                        {caseItem.notes && (
                          <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                            <p className="text-xs text-amber-700 font-medium mb-1">Служебные заметки:</p>
                            <p className="text-sm text-amber-900">{caseItem.notes}</p>
                          </div>
                        )}
                        <div className="flex items-center text-sm text-muted-foreground pt-2">
                          <Icon name="Calendar" size={16} className="mr-2" />
                          {new Date(caseItem.date).toLocaleDateString('ru-RU')}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={!!editingCase} onOpenChange={(open) => !open && setEditingCase(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактирование дела {editingCase?.caseNumber}</DialogTitle>
            <DialogDescription>
              Изменение статуса и добавление служебных заметок
            </DialogDescription>
          </DialogHeader>
          {editingCase && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Статус дела</Label>
                <Select
                  value={editingCase.status}
                  onValueChange={(value: Case['status']) =>
                    setEditingCase({...editingCase, status: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Принято">Принято</SelectItem>
                    <SelectItem value="В работе">В работе</SelectItem>
                    <SelectItem value="Завершено">Завершено</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Служебные заметки</Label>
                <Textarea
                  value={editingCase.notes || ''}
                  onChange={(e) => setEditingCase({...editingCase, notes: e.target.value})}
                  placeholder="Дополнительная информация для внутреннего использования"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 text-sm bg-muted p-4 rounded-md">
                <div>
                  <p className="text-muted-foreground">Тип дела:</p>
                  <p className="font-medium">{editingCase.typeName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Дата регистрации:</p>
                  <p className="font-medium">{new Date(editingCase.date).toLocaleDateString('ru-RU')}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCase(null)}>
              Отмена
            </Button>
            <Button onClick={handleUpdateCase}>
              <Icon name="Save" size={18} className="mr-2" />
              Сохранить изменения
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingCaseId} onOpenChange={(open) => !open && setDeletingCaseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтвердите удаление</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить дело {cases.find(c => c.id === deletingCaseId)?.caseNumber}?
              Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCase} className="bg-destructive hover:bg-destructive/90">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;
