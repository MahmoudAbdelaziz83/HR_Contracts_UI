export interface StaffModel {
  staff_key: number;
  staff_name: string;
  staffContracts?: StaffContractModel[]; // optional
}

export interface ContractClauseModel {
  ClauseId: number;
  ClauseName: string;
  ClauseDescription: string;
  staffContracts?: StaffContractModel[]; // optional
}
export interface StaffContractModel {
  StaffContractId: number;
  staff_key: number;
  ClauseId: number;
  Staff?: StaffModel;          // Navigation property (optional)
  Clause?: ContractClauseModel; // Navigation property (optional)
  staff_type_sys_key?: number;
  StaffType?: StaffTypeModel;


}
export interface StaffTypeModel {
  staff_type_sys_key: number;
  staff_type_code: string;
  a_desc: string;
}
