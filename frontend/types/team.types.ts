export interface Team {
  id: string;
  name: string;
  description?: string;
  managerId: string;
  managerName?: string;
  // members: string[];
  members_detail?: TeamMember[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  fullname: string;
}

export interface CreateTeamInput {
  name: string;
  description?: string;
  manager: string;
  members?: string[];
  status?: 'active' | 'inactive';
}

export interface UpdateTeamInput {
  name?: string;
  description?: string;
  managerId?: string;
  memberIds?: string[];
  status?: string;
}

export interface TeamStats {
  totalMembers: number;
  activeMembers: number;
  avgWorkingHours: number;
  totalWorkingHours: number;
  lateRate: number;
  absenceRate: number;
}