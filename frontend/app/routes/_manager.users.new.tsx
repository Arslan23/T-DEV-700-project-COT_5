import { useState } from "react";
import { redirect, useNavigate, useActionData } from "react-router";
import { useCreateUserMutation } from "~/store/services/usersApi";
import { useAuth } from "~/hooks/useAuth";
import type { Route } from "./+types/_manager.users.new";
import type { UserRole } from "types/user.types";
import { CreateUserHeader } from "~/components/users/create/CreateUserHeader";
import { Alert } from "~/components/ui/Alert";
import { CreateUserForm } from "~/components/users/create/CreateUserForm";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const firstname = formData.get("firstname") as string;
  const lastname = formData.get("lastname") as string;
  const email = formData.get("email") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  // Validation
  if (!firstname || !lastname || !email || !password) {
    return { error: "All required fields must be filled" };
  }

  try {
    const response = await fetch(`${process.env.VITE_API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname,
        lastname,
        email,
        phoneNumber,
        password,
        role: role || "employee",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    return redirect("/manager/users");
  } catch (error) {
    return { error: "Failed to create user. Please try again." };
  }
}

export default function CreateUser() {
  const navigate = useNavigate();
  const { user: currentUser, isAdmin } = useAuth();
  const actionData = useActionData<typeof action>();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  // Form state
  const [formData, setFormData] = useState<{
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    role: UserRole;
    is_active: boolean;
  }>({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "employee",
    is_active: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validate = () => {
    const newErrors: any = {};

    if (!formData.firstname.trim()) newErrors.firstname = "First name is required";
    if (!formData.lastname.trim()) newErrors.lastname = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await createUser({
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        password_confirm: formData.confirmPassword,
        role: formData.role,
        // is_active: formData.is_active,
      }).unwrap();

      setShowSuccess(true);
      setTimeout(() => {
        navigate("/manager/users");
      }, 2000);
    } catch (error: any) {
      setErrors({ general: error?.data?.message || "Failed to create user" });
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <CreateUserHeader onBack={() => navigate("/manager/users")} />

      {showSuccess && (
        <Alert variant="success" message="User created successfully! Redirecting..." />
      )}

      {(actionData?.error || errors.general) && (
        <Alert variant="error" message={actionData?.error || errors.general} />
      )}

      <CreateUserForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
        handleSubmit={handleSubmit}
        isCreating={isCreating}
        showSuccess={showSuccess}
        isAdmin={isAdmin() ?? false}
        onCancel={() => navigate("/manager/users")}
      />
    </div>
  );
}