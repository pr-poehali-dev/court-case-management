import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface AdminLoginProps {
  loginData: { username: string; password: string };
  setLoginData: (data: { username: string; password: string }) => void;
  onLogin: (e: React.FormEvent) => void;
}

const AdminLogin = ({ loginData, setLoginData, onLogin }: AdminLoginProps) => {
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
          <form onSubmit={onLogin} className="space-y-4">
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
};

export default AdminLogin;
