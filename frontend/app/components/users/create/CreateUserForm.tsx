import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { User } from "lucide-react";
import { PersonalInformationFields } from "./PersonalInformationFields";
import { PasswordFields } from "./PasswordFields";
import { AccountSettingsFields } from "./AccountSettingsFields";
import { FormActions } from "./FormActions";

interface CreateUserFormProps {
  formData: any;
  setFormData: (data: any) => void;
  errors: any;
  setErrors: (errors: any) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isCreating: boolean;
  showSuccess: boolean;
  isAdmin: boolean;
  onCancel: () => void;
}

export function CreateUserForm({
  formData,
  setFormData,
  errors,
  setErrors,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  handleSubmit,
  isCreating,
  showSuccess,
  isAdmin,
  onCancel,
}: CreateUserFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PersonalInformationFields
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
          <PasswordFields
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />
          <AccountSettingsFields
            formData={formData}
            setFormData={setFormData}
            isAdmin={isAdmin}
          />
        </CardContent>
      </Card>
      <FormActions
        onCancel={onCancel}
        isCreating={isCreating}
        showSuccess={showSuccess}
      />
    </form>
  );
}
