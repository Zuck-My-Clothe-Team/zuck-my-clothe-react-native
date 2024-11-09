export interface IMachineInBranch {
  sort(arg0: (a: any, b: any) => number): unknown;
  branch_id: string;
  machine_label: string;
  created_at: string;
  created_by: string;
  deleted_at: string;
  deleted_by: string;
  is_active: boolean;
  machine_serial: string;
  machine_type: string;
  updated_at: string;
  updated_by: string;
  weight: number;
}
