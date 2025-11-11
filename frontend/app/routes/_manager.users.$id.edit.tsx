import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useGetUserByIdQuery, useUpdateUserMutation } from "~/store/services/usersApi";
import { useAuth } from "~/hooks/useAuth";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { AlertCircle, Check } from "lucide-react";
import { EditUserHeader } from "~/components/users/edit/EditUserHeader";
import { PersonalInformationFields } from "~/components/users/edit/PersonalInformationFields";
import { AccountSettingsFields } from "~/components/users/edit/AccountSettingsFields";
import { FormActions } from "~/components/users/edit/FormActions";

interface UserFormData {
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  is_active: boolean;
}

interface FormErrors {
  firstname?: string;
  lastname?: string;
  email?: string;
  general?: string;
}

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { data: user, isLoading: isLoadingUser } = useGetUserByIdQuery(id!);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  // Form state
  const [formData, setFormData] = useState<UserFormData>({
    firstname: "",
    lastname: "",
    email: "",
    role: "employee",
    is_active: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Load user data when available
  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        role: user.role || "employee",
        is_active: user.is_active,
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'is_active' ? value === 'true' : value }));
  };

  const validate = () => {
    const newErrors: any = {};

    if (!formData.firstname.trim()) newErrors.firstname = "First name is required";
    if (!formData.lastname.trim()) newErrors.lastname = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await updateUser({
        id: id!,
        data: {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          role: formData.role,
          is_active: formData.is_active
        },
      }).unwrap();

      setShowSuccess(true);
      setTimeout(() => {
        navigate(`/manager/users/${id}`);
      }, 2000);
    } catch (error: any) {
      setErrors({ general: error?.data?.message || "Failed to update user" });
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">User not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <EditUserHeader user={user} onBack={() => navigate(`/manager/users/${id}`)} />

      {showSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-3">
          <Check className="w-5 h-5 text-green-400" />
          <p className="text-green-400">User updated successfully! Redirecting...</p>
        </div>
      )}

      {errors.general && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-400">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <PersonalInformationFields
          formData={formData}
          handleInputChange={handleInputChange}
          errors={errors}
        />
        <AccountSettingsFields
          formData={formData}
          handleSelectChange={handleSelectChange}
          isAdmin={isAdmin()}
        />
        <FormActions
          onCancel={() => navigate(`/manager/users/${id}`)}
          isUpdating={isUpdating}
          showSuccess={showSuccess}
        />
      </form>
    </div>
  )
}