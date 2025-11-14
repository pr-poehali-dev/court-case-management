import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

interface AdminDashboardProps {
  cases: Case[];
  caseTypes: Record<CaseType, string>;
}

const AdminDashboard = ({ cases, caseTypes }: AdminDashboardProps) => {
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

  return (
    <div className="space-y-6 animate-fade-in">
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
    </div>
  );
};

export default AdminDashboard;
