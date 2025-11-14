import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

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

interface AdminCasesListProps {
  cases: Case[];
  onEdit: (caseItem: Case) => void;
  onDelete: (caseId: string) => void;
}

const AdminCasesList = ({ cases, onEdit, onDelete }: AdminCasesListProps) => {
  const getStatusColor = (status: Case['status']) => {
    switch (status) {
      case 'Принято': return 'bg-blue-100 text-blue-800';
      case 'В работе': return 'bg-amber-100 text-amber-800';
      case 'Завершено': return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
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
                        onClick={() => onEdit(caseItem)}
                      >
                        <Icon name="Edit" size={16} className="mr-1" />
                        Редактировать
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(caseItem.id)}
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
    </div>
  );
};

export default AdminCasesList;
