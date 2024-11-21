export interface IMachineInBranch {
  sort(arg0: (a: any, b: any) => number): unknown;
  branch_id: string;
  machine_label: string;
  created_at: string;
  created_by: string;
  deleted_at: string;
  deleted_by: string;
  is_active: boolean;
  is_available: boolean;
  machine_serial: string;
  machine_type: string;
  updated_at: string;
  updated_by: string;
  weight: TWeight;
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

export const MachinePrice = {
  0: 0,
  7: 50,
  14: 100,
  21: 150,
};

export type TWeight = 0 | 7 | 14 | 21;
