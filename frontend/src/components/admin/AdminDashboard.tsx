import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchAllUsers, fetchAnalytics, updateUserRole, deleteUser } from '@/store/slices/adminSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Navbar } from '@/components/layout/Navbar';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  FileText, 
  BarChart3, 
  Activity, 
  Trash2, 
  Shield,
  ShieldCheck,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, analytics, isLoading, error } = useSelector((state: RootState) => state.admin);
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAnalytics());
  }, [dispatch]);

  const handleRoleChange = async (userId: string, role: 'user' | 'admin') => {
    try {
      const result = await dispatch(updateUserRole({ userId, role }));
      if (result.type === 'admin/updateUserRole/fulfilled') {
        toast({
          title: 'Success',
          description: 'User role updated successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const result = await dispatch(deleteUser(userId));
      if (result.type === 'admin/deleteUser/fulfilled') {
        toast({
          title: 'Success',
          description: 'User deleted successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
    }
  };

  const stats = [
    {
      title: 'Total Users',
      value: analytics.totalUsers,
      description: 'Registered users',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Uploads',
      value: analytics.totalUploads,
      description: 'Files uploaded',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Charts',
      value: analytics.totalCharts,
      description: 'Charts created',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Active Today',
      value: analytics.recentActivity?.length || 0,
      description: 'Recent activities',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage users, monitor system analytics, and oversee platform operations
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Users Management */}
          <Card className="lg:col-span-2 shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage user accounts, roles, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading users...</div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No users found
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-primary text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role === 'admin' ? (
                                <ShieldCheck className="h-3 w-3 mr-1" />
                              ) : (
                                <Users className="h-3 w-3 mr-1" />
                              )}
                              {user.role}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Select
                          value={user.role}
                          onValueChange={(value) => handleRoleChange(user.id, value as 'user' | 'admin')}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Analytics */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                System Analytics
              </CardTitle>
              <CardDescription>
                Recent platform activity and metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-6 border rounded-lg">
                  <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Platform Health</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Uptime</div>
                      <div className="text-success">99.9%</div>
                    </div>
                    <div>
                      <div className="font-medium">Performance</div>
                      <div className="text-success">Excellent</div>
                    </div>
                  </div>
                </div>
                
                {analytics.recentActivity && analytics.recentActivity.length > 0 ? (
                  <div>
                    <h4 className="font-semibold mb-3">Recent Activity</h4>
                    <div className="space-y-2">
                      {analytics.recentActivity.slice(0, 5).map((activity: any, index: number) => (
                        <div key={index} className="text-sm p-2 bg-accent/30 rounded">
                          <div className="font-medium">{activity.action}</div>
                          <div className="text-muted-foreground">
                            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-4">
                    No recent activity
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};