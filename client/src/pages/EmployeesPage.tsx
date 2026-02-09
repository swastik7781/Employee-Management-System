import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Download, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { getStatusColor, getInitials } from '@/lib/utils';

export default function EmployeesPage() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ['employees', page, search],
        queryFn: async () => {
            const response = await api.get(`/employees?page=${page}&limit=10&search=${search}`);
            return response.data;
        },
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Employees</h1>
                    <p className="text-muted-foreground mt-1">Manage your workforce</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Import
                    </Button>
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Employee
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search employees..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Employee List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-6">
                                <div className="h-32 bg-muted rounded" />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    data?.data?.map((employee: any) => (
                        <motion.div
                            key={employee._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
                                            {getInitials(employee.personalInfo.firstName, employee.personalInfo.lastName)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold truncate">
                                                {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                                            </h3>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {employee.professionalInfo.designation}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {employee.employeeNumber}
                                            </p>
                                            <div className="flex items-center space-x-2 mt-3">
                                                <Badge className={getStatusColor(employee.professionalInfo.employmentStatus)}>
                                                    {employee.professionalInfo.employmentStatus}
                                                </Badge>
                                                <Badge variant="outline">
                                                    {employee.professionalInfo.employeeType}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {data?.pagination && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, data.pagination.total)} of {data.pagination.total} employees
                    </p>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page + 1)}
                            disabled={page >= data.pagination.pages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
