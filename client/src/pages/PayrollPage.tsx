import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Download } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function PayrollPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Payroll</h1>
                    <p className="text-muted-foreground mt-1">Manage employee salaries and payslips</p>
                </div>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                    Process Payroll
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <DollarSign className="h-5 w-5" />
                            <span>Total Payroll</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{formatCurrency(12500000)}</p>
                        <p className="text-sm text-muted-foreground mt-1">December 2024</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Processed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">95</p>
                        <p className="text-sm text-muted-foreground mt-1">out of 100 employees</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">5</p>
                        <p className="text-sm text-muted-foreground mt-1">employees</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Payslips</CardTitle>
                    <CardDescription>Download and view employee payslips</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
                                <div>
                                    <p className="font-medium">Employee {i + 1}</p>
                                    <p className="text-sm text-muted-foreground">December 2024 • {formatCurrency(125000 + i * 10000)}</p>
                                </div>
                                <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
