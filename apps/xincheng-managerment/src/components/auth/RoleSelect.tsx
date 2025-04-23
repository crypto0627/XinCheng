"use client";

import FormSelect from "./FormSelect";
import { useRoleSelect, Role } from "@/hooks/useRoleSelect";

interface RoleSelectProps {
  initialRole?: Role;
  onChange?: (role: Role) => void;
  label?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function RoleSelect({
  initialRole = "user",
  onChange,
  label = "Role",
  disabled = false,
  required = false,
}: RoleSelectProps) {
  const { role, roleOptions, handleRoleChange } = useRoleSelect(initialRole);

  // Call the external onChange handler when the role changes
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleRoleChange(e);
    if (onChange) {
      onChange(e.target.value as Role);
    }
  };

  return (
    <FormSelect
      id="role"
      name="role"
      label={label}
      value={role}
      onChange={handleChange}
      options={roleOptions}
      required={required}
      disabled={disabled}
      placeholder="Select role"
    />
  );
} 