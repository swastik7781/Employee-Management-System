import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/stores/themeStore';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function SettingsPage() {
    const { theme, setTheme } = useThemeStore();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your application preferences</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize how WorkSphere Pro looks for you</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-sm font-medium">Theme</p>
                        <div className="grid grid-cols-3 gap-4">
                            <button
                                onClick={() => setTheme('light')}
                                className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <Sun className="h-6 w-6" />
                                <span className="text-sm font-medium">Light</span>
                            </button>

                            <button
                                onClick={() => setTheme('dark')}
                                className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <Moon className="h-6 w-6" />
                                <span className="text-sm font-medium">Dark</span>
                            </button>

                            <button
                                onClick={() => setTheme('system')}
                                className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-all ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <Monitor className="h-6 w-6" />
                                <span className="text-sm font-medium">System</span>
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>Swastik Industries details</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm font-medium">Company Name</p>
                            <p className="text-sm text-muted-foreground">Swastik Industries</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">hr@swastikindustries.com</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Phone</p>
                            <p className="text-sm text-muted-foreground">+91-1234567890</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Address</p>
                            <p className="text-sm text-muted-foreground">Mumbai, Maharashtra, India</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
