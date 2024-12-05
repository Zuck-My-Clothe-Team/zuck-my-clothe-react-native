import { MachineType } from "./branch.interface";

export interface IMachineInBranch {
  branch_id: string;
  machine_label: string;
  is_active: boolean;
  finished_at: string;
  machine_serial: string;
  machine_type: string;
  weight: TWeight;
  created_at?: string;
  created_by?: string;
  deleted_at?: string;
  deleted_by?: string;
  updated_at?: string;
  updated_by?: string;
}

export interface IAvailableMachine {
  amount: any;
  machine_serial: string;
  machine_label: string;
  machine_type: string;
  finished_at: string;
  is_available: boolean;
  weight: TWeight;
}

export interface IMachineUpdateStatus {
  branch_id: string;
  created_at: string;
  created_by: string;
  deleted_at: null;
  deleted_by: string;
  is_active: true;
  machine_label: string;
  machine_serial: string;
  machine_type: MachineType;
  updated_at: string;
  updated_by: string;
  weight: 0;
}

export const MachinePrice = {
  0: 0,
  7: 50,
  14: 100,
  21: 150,
};

export type TWeight = 0 | 7 | 14 | 21;
