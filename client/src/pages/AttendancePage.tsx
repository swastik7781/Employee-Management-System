import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin } from 'lucide-react';

export default function AttendancePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Attendance</h1>
                <p className="text-muted-foreground mt-1">Track employee attendance and working hours</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Clock className="h-5 w-5" />
                            <span>Check In/Out</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600">
                            Check In
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Today's Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Present</span>
                                <span className="font-semibold">87</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Absent</span>
                                <span className="font-semibold">5</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">On Leave</span>
                                <span className="font-semibold">8</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Working Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <p className="text-4xl font-bold">8.5</p>
                            <p className="text-sm text-muted-foreground mt-1">hours today</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Attendance Calendar</CardTitle>
                    <CardDescription>View and manage attendance records</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                        <Calendar className="h-12 w-12 mr-4" />
                        <p>Calendar view coming soon...</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
