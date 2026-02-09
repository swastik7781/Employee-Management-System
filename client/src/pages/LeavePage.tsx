import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText } from 'lucide-react';

export default function LeavePage() {
    const leaveRequests = [
        { id: 1, employee: 'Rajesh Sharma', type: 'Annual Leave', from: '2024-12-20', to: '2024-12-22', days: 3, status: 'pending' },
        { id: 2, employee: 'Priya Patel', type: 'Sick Leave', from: '2024-12-15', to: '2024-12-16', days: 2, status: 'approved' },
        { id: 3, employee: 'Amit Kumar', type: 'Casual Leave', from: '2024-12-18', to: '2024-12-18', days: 1, status: 'rejected' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Leave Management</h1>
                    <p className="text-muted-foreground mt-1">Manage leave requests and balances</p>
                </div>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Apply Leave
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {['Annual Leave', 'Sick Leave', 'Casual Leave', 'Comp Off'].map((type, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle className="text-sm">{type}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline space-x-2">
                                <span className="text-3xl font-bold">{15 - index * 3}</span>
                                <span className="text-sm text-muted-foreground">/ {21 - index * 3} days</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Leave Requests</CardTitle>
                    <CardDescription>Pending and recent leave applications</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {leaveRequests.map((request) => (
                            <div key={request.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">{request.employee}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {request.type} • {request.from} to {request.to} ({request.days} days)
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Badge className={
                                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                    }>
                                        {request.status}
                                    </Badge>
                                    {request.status === 'pending' && (
                                        <>
                                            <Button size="sm" variant="outline">Approve</Button>
                                            <Button size="sm" variant="outline">Reject</Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
