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
}

const caseTypes: Record<CaseType, string> = {
  '1': 'Уголовное дело',
  '2': 'Гражданское дело',
  '2a': 'Административное дело',
  '3': 'Судебный контроль',
  '4': 'Исполнение приговоров',
  '5': 'Административные правонарушения'
};

const Index = () => {
  const { toast } = useToast();
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
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [formData, setFormData] = useState({
    type: '2' as CaseType,
    plaintiff: '',
    defendant: '',
    description: ''
  });

  const getNextCaseNumber = (type: CaseType) => {
    const year = new Date().getFullYear();
    const sameCases = cases.filter(c => c.type === type);
    const nextNumber = String(sameCases.length + 1).padStart(3, '0');
    return `${type}-${nextNumber}/${year}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.plaintiff || !formData.defendant || !formData.description) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    const newCase: Case = {
      id: String(cases.length + 1),
      caseNumber: getNextCaseNumber(formData.type),
      type: formData.type,
      typeName: caseTypes[formData.type],
      plaintiff: formData.plaintiff,
      defendant: formData.defendant,
      description: formData.description,
      status: 'Принято',
      date: new Date().toISOString().split('T')[0]
    };

    setCases([...cases, newCase]);
    setFormData({
      type: '2',
      plaintiff: '',
      defendant: '',
      description: ''
    });

    toast({
      title: 'Дело принято',
      description: `Присвоен номер: ${newCase.caseNumber}`
    });
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.plaintiff.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.defendant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || c.type === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: Case['status']) => {
    switch (status) {
      case 'Принято': return 'bg-blue-100 text-blue-800';
      case 'В работе': return 'bg-amber-100 text-amber-800';
      case 'Завершено': return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Icon name="Scale" size={40} className="text-accent" />
              <div>
                <h1 className="text-3xl font-bold font-montserrat">Южный городской суд</h1>
                <p className="text-sm opacity-90 mt-1">Нижегородская обл., г. Южный, пр-кт Победы, д. 3</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-accent text-accent-foreground border-0 text-lg px-4 py-2">
              Motion Project 2025
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="cases" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="cases">
              <Icon name="FolderOpen" size={18} className="mr-2" />
              Дела
            </TabsTrigger>
            <TabsTrigger value="submit">
              <Icon name="FileText" size={18} className="mr-2" />
              Подать документ
            </TabsTrigger>
            <TabsTrigger value="search">
              <Icon name="Search" size={18} className="mr-2" />
              Поиск
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cases" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Icon name="Briefcase" size={28} className="mr-3 text-accent" />
                  Текущие дела
                </CardTitle>
                <CardDescription>Всего дел в производстве: {cases.length}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {cases.map((caseItem) => (
                    <Card key={caseItem.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {caseItem.caseNumber}
                              <Badge className={getStatusColor(caseItem.status)}>
                                {caseItem.status}
                              </Badge>
                            </CardTitle>
                            <CardDescription className="mt-1">{caseItem.typeName}</CardDescription>
                          </div>
                          <Icon name="FileText" size={20} className="text-muted-foreground" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
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
                        <div className="pt-2">
                          <p className="text-muted-foreground text-sm">Описание:</p>
                          <p className="text-sm mt-1">{caseItem.description}</p>
                        </div>
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

          <TabsContent value="submit" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Icon name="FileText" size={28} className="mr-3 text-accent" />
                  Форма подачи документов
                </CardTitle>
                <CardDescription>
                  Заполните форму для регистрации нового дела. Номер будет присвоен автоматически.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="type">Тип дела *</Label>
                    <Select value={formData.type} onValueChange={(value: CaseType) => setFormData({...formData, type: value})}>
                      <SelectTrigger id="type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(caseTypes).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {key} — {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Номер дела: {getNextCaseNumber(formData.type)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="plaintiff">Истец/Заявитель *</Label>
                      <Input
                        id="plaintiff"
                        value={formData.plaintiff}
                        onChange={(e) => setFormData({...formData, plaintiff: e.target.value})}
                        placeholder="ФИО или наименование организации"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="defendant">Ответчик/Обвиняемый *</Label>
                      <Input
                        id="defendant"
                        value={formData.defendant}
                        onChange={(e) => setFormData({...formData, defendant: e.target.value})}
                        placeholder="ФИО или наименование организации"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Описание дела *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Краткое описание сути дела"
                      rows={4}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    <Icon name="Send" size={20} className="mr-2" />
                    Подать документ
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Icon name="Search" size={28} className="mr-3 text-accent" />
                  Поиск дел
                </CardTitle>
                <CardDescription>
                  Найдите дело по номеру, истцу или ответчику
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Поисковый запрос</Label>
                    <Input
                      id="search"
                      placeholder="Номер дела, ФИО..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="filter">Фильтр по типу</Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger id="filter">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все типы</SelectItem>
                        {Object.entries(caseTypes).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Результаты поиска</h3>
                    <Badge variant="outline">{filteredCases.length} дел</Badge>
                  </div>
                  
                  {filteredCases.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Icon name="FileSearch" size={48} className="mx-auto mb-4 opacity-50" />
                      <p>Дела не найдены</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {filteredCases.map((caseItem) => (
                        <Card key={caseItem.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                  {caseItem.caseNumber}
                                  <Badge className={getStatusColor(caseItem.status)}>
                                    {caseItem.status}
                                  </Badge>
                                </CardTitle>
                                <CardDescription className="mt-1">{caseItem.typeName}</CardDescription>
                              </div>
                              <Icon name="FileText" size={20} className="text-muted-foreground" />
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2">
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
                            <div className="pt-2">
                              <p className="text-muted-foreground text-sm">Описание:</p>
                              <p className="text-sm mt-1">{caseItem.description}</p>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground pt-2">
                              <Icon name="Calendar" size={16} className="mr-2" />
                              {new Date(caseItem.date).toLocaleDateString('ru-RU')}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-secondary text-secondary-foreground mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold font-montserrat text-lg mb-3 flex items-center">
                <Icon name="MapPin" size={20} className="mr-2" />
                Адрес
              </h3>
              <p className="text-sm opacity-90">Нижегородская обл., г. Южный</p>
              <p className="text-sm opacity-90">пр-кт Победы, д. 3</p>
            </div>
            <div>
              <h3 className="font-bold font-montserrat text-lg mb-3 flex items-center">
                <Icon name="Phone" size={20} className="mr-2" />
                Контакты
              </h3>
              <p className="text-sm opacity-90">Приёмная: +7 (831) 123-45-67</p>
              <p className="text-sm opacity-90">Канцелярия: +7 (831) 123-45-68</p>
            </div>
            <div>
              <h3 className="font-bold font-montserrat text-lg mb-3 flex items-center">
                <Icon name="Clock" size={20} className="mr-2" />
                Часы работы
              </h3>
              <p className="text-sm opacity-90">Пн-Чт: 9:00 - 18:00</p>
              <p className="text-sm opacity-90">Пт: 9:00 - 16:45</p>
            </div>
          </div>
          <div className="border-t border-white/20 mt-6 pt-6 text-center text-sm opacity-75">
            <p>© 2025 Южный городской суд. Motion Project.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
