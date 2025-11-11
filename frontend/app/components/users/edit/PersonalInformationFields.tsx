import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { User, Mail } from "lucide-react";
import { cn } from "~/lib/utils";

interface PersonalInformationFieldsProps {
    formData: {
        firstname: string;
        lastname: string;
        email: string;
    };
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors: any;
}

export function PersonalInformationFields({ formData, handleInputChange, errors }: PersonalInformationFieldsProps) {
    return (
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-400" />
                    Personal Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            First Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleInputChange}
                            className={cn(
                                "w-full px-4 py-3 bg-slate-800 border rounded-lg text-white",
                                "focus:outline-none focus:ring-2 focus:ring-purple-500",
                                errors.firstname ? "border-red-500/50" : "border-slate-700"
                            )}
                            placeholder="John"
                        />
                        {errors.firstname && (
                            <p className="mt-2 text-sm text-red-400">{errors.firstname}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Last Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleInputChange}
                            className={cn(
                                "w-full px-4 py-3 bg-slate-800 border rounded-lg text-white",
                                "focus:outline-none focus:ring-2 focus:ring-purple-500",
                                errors.lastname ? "border-red-500/50" : "border-slate-700"
                            )}
                            placeholder="Doe"
                        />
                        {errors.lastname && (
                            <p className="mt-2 text-sm text-red-400">{errors.lastname}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={cn(
                                "w-full pl-10 pr-4 py-3 bg-slate-800 border rounded-lg text-white",
                                "focus:outline-none focus:ring-2 focus:ring-purple-500",
                                errors.email ? "border-red-500/50" : "border-slate-700"
                            )}
                            placeholder="john.doe@example.com"
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}