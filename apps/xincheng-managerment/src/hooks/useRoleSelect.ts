import { useState } from 'react';

export type Role = 'admin' | 'user';

interface UseRoleSelectResult {
  role: Role;
  setRole: (role: Role) => void;
  roleOptions: { value: string; label: string }[];
  handleRoleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function useRoleSelect(initialRole: Role = 'user'): UseRoleSelectResult {
  const [role, setRole] = useState<Role>(initialRole);

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' },
  ];

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as Role);
  };

  return {
    role,
    setRole,
    roleOptions,
    handleRoleChange,
  };
} 