import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminCasesList from '@/components/admin/AdminCasesList';

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

  if (!isAuthenticated) {
    return (
      <AdminLogin
        loginData={loginData}
        setLoginData={setLoginData}
        onLogin={handleLogin}
      />
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

          <TabsContent value="dashboard">
            <AdminDashboard cases={cases} caseTypes={caseTypes} />
          </TabsContent>

          <TabsContent value="cases">
            <AdminCasesList
              cases={cases}
              onEdit={setEditingCase}
              onDelete={setDeletingCaseId}
            />
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
