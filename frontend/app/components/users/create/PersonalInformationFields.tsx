import { Mail, Phone } from "lucide-react";
import { cn } from "~/lib/utils";

interface PersonalInformationFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
  errors: any;
  setErrors: (errors: any) => void;
}

export function PersonalInformationFields({ formData, setFormData, errors, setErrors }: PersonalInformationFieldsProps) {
  return (
    <div className="space-y-4">
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            First Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.firstname}
            onChange={(e) => {
              setFormData({ ...formData, firstname: e.target.value });
              setErrors({ ...errors, firstname: undefined });
            }}
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
            value={formData.lastname}
            onChange={(e) => {
              setFormData({ ...formData, lastname: e.target.value });
              setErrors({ ...errors, lastname: undefined });
            }}
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

      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              setErrors({ ...errors, email: undefined });
            }}
            className={cn(
              "w-full pl-10 pr-4 py-3 bg-slate-800 border rounded-lg text-white",
              "focus:outline-none focus:ring-2 focus:ring-purple-500",
              errors.email ? "border-red-500/50" : "border-slate-700"
            )}
            placeholder="example@domain.com"
          />
        </div>
        {errors.email && (
          <p className="mt-2 text-sm text-red-400">{errors.email}</p>
        )}
      </div>

      {/* Phone Number Field */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Phone Number
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
            className={cn(
              "w-full pl-10 pr-4 py-3 bg-slate-800 border rounded-lg text-white",
              "focus:outline-none focus:ring-2 focus:ring-purple-500",
              "border-slate-700"
            )}
            placeholder="(123) 456-7890"
          />
        </div>
      </div>
    </div>
  );
}
