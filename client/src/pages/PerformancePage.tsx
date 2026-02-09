import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Award } from 'lucide-react';

export default function PerformancePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Performance</h1>
                <p className="text-muted-foreground mt-1">Track employee performance and reviews</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Award className="h-5 w-5" />
                            <span>Average Rating</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">4.2</p>
                        <p className="text-sm text-muted-foreground mt-1">out of 5.0</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Reviews Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">78</p>
                        <p className="text-sm text-muted-foreground mt-1">this quarter</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pending Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">12</p>
                        <p className="text-sm text-muted-foreground mt-1">to be completed</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Performance Trends</CardTitle>
                    <CardDescription>Employee performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                        <TrendingUp className="h-12 w-12 mr-4" />
                        <p>Performance charts coming soon...</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
