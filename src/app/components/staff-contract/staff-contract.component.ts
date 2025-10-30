import { Component } from '@angular/core';
import { HRContractService } from '../../service/hr-contract.service';
import { ContractClauseModel, StaffContractModel, StaffModel } from '../../Models/model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-staff-contract',
  standalone: false,
  templateUrl: './staff-contract.component.html',
  styleUrl: './staff-contract.component.css'
})
export class StaffContractComponent {
  newClause = { ClauseName: '', ClauseDescription: '' };
  searchKeyword = '';
  staffList: any[] = [];
  staffTypes: any[] = [];
selectedStaffType: number | null = null;
  selectedStaff: any = null;
  clauseList: any[] = [];
  // selectedClauseId: number | null = null;
  selectedClauses: number[] = [];
  clauseSearchKeyword: string = '';
  filteredClauses: any[] = [];
  contracts: StaffContractModel[] = [];
  showContractsScreen: boolean = false;
  contractSearchKeyword: string = '';
  groupedContracts: { staff_name: string, clauses: ContractClauseModel[] }[] = [];
  showForm: boolean = false; // التحكم بين العرض والإضافة
openedEmployee: string | null = null; // لتحديد الموظف المفتوح حاليًا
editingClause: any = null;



  constructor(private hrService: HRContractService,
    private toastr: ToastrService
  ) { }
  ngOnInit() {
    this.loadContracts();
    this.loadClauses();
    this.loadStaffTypes();
  }
searchStaff() {
  const keyword = this.searchKeyword.trim();

  if (keyword.length < 2) {
    this.staffList = [];
    return;
  }

  this.hrService.searchStaff(keyword).subscribe({
    next: (res) => {
      this.staffList = res || [];

      // if (!isNaN(+keyword) && this.staffList.length === 1) {
      //   this.selectStaff(this.staffList[0]);
      // }
      if (!isNaN(+keyword) && keyword.length >= 6 && this.staffList.length === 1) {
    this.selectStaff(this.staffList[0]);
}

    },
    error: (err) => {
      console.error('❌ خطأ في البحث عن الموظف:', err);
      this.staffList = [];
    }
  });
  }
  openClauseEdit(c: any) {
  this.editingClause = { ...c };
  }

// updateClause() {
//   this.hrService.updateClause(this.editingClause).subscribe({
//     next: () => {
//       this.toastr.success("✅ تم تعديل البند");
//       this.editingClause = null;
//       this.loadClauses();
//       this.searchClauses();
//     },
//     error: () => this.toastr.error("❌ فشل التعديل"),
//   });
//   }
  updateClause() {
  this.hrService.updateClause(this.editingClause).subscribe(
    (res) => {

      // ✅ حدّث البيانات في نفس القائمة بدون Reload
      const index = this.filteredClauses.findIndex(c => c.ClauseId === this.editingClause.ClauseId);
      if (index !== -1) {
        this.filteredClauses[index].ClauseName = this.editingClause.ClauseName;
        this.filteredClauses[index].ClauseDescription = this.editingClause.ClauseDescription;
      }

      // ✅ كمان حدّث القائمة الأصلية لو عندك قائمة للكل
      const allIndex = this.clauseList.findIndex(c => c.ClauseId === this.editingClause.ClauseId);
      if (allIndex !== -1) {
        this.clauseList[allIndex].ClauseName = this.editingClause.ClauseName;
        this.clauseList[allIndex].ClauseDescription = this.editingClause.ClauseDescription;
      }

      this.editingClause = null; // ✅ اغلاق النافذة
    },
    (err) => console.log(err)
  );
}


deleteClause() {
  if (!confirm("هل انت متأكد من حذف البند؟")) return;

  this.hrService.deleteContract(this.editingClause.ClauseId).subscribe({
    next: () => {
      this.toastr.success("🗑️ تم حذف البند");
      this.editingClause = null;
      this.loadClauses();
      this.searchClauses();
      this.selectedClauses = this.selectedClauses.filter(id => id !== this.editingClause.ClauseId);
    },
    error: () => this.toastr.error("❌ حدث خطأ"),
  });
}

  cancelEdit() {
  this.editingClause = null;
}

getClauseName(id: number): string {
  const clause = this.clauseList.find(x => x.ClauseId === id);
  return clause ? clause.ClauseName : '';
}

loadStaffTypes() {
  this.hrService.getStaffTypes().subscribe({
    next: (res) => this.staffTypes = res,
    error: (err) => console.error('❌ خطأ في تحميل أنواع العقود:', err)
  });
  }
  editClause(c: any) {
  this.editingClause = { ...c }; // اعمل نسخة للتعديل
  }
//   updateClause() {
//   this.hrService.updateClause(this.editingClause).subscribe({
//     next: () => {
//       this.toastr.success('تم تعديل البند بنجاح ✅');
//       this.editingClause = null;
//       this.loadClauses();
//       this.loadContracts();
//     },
//     error: () => this.toastr.error('❌ فشل تعديل البند'),
//   });
// }

// cancelEdit() {
//   this.editingClause = null;
// }


  openAddForm() {
    this.showForm = true;
    this.selectedStaff = null;
    this.selectedClauses = [];
    this.searchKeyword = '';
    this.loadContracts();
  }
  deleteContractByClause(staffName: string, clauseId: number) {
    const contract = this.contracts.find(c =>
      c.Staff?.staff_name === staffName && c.Clause?.ClauseId === clauseId
    );

    if (contract && confirm('هل أنت متأكد من حذف هذا البند من العقد؟')) {
      this.deleteContract(contract.StaffContractId);
    }
  }

  groupContracts() {
    // ترتيب العقود حسب اسم الموظف
    const sorted = this.contracts.sort((a, b) => a.Staff!.staff_name.localeCompare(b.Staff!.staff_name));

    // تجميع البنود لكل موظف
    const groupedMap = new Map<string, ContractClauseModel[]>();

    sorted.forEach(c => {
      if (!groupedMap.has(c.Staff!.staff_name)) {
        groupedMap.set(c.Staff!.staff_name, []);
      }
      if (c.Clause) groupedMap.get(c.Staff!.staff_name)!.push(c.Clause);
    });

    this.groupedContracts = Array.from(groupedMap.entries()).map(([staff_name, clauses]) => ({ staff_name, clauses }));
  }
filterContracts() {
  const keyword = this.contractSearchKeyword.trim().toLowerCase();

  if (!keyword) {
    this.groupContracts();
    return;
  }

  const filteredMap = new Map<string, ContractClauseModel[]>();

  this.contracts.forEach(c => {
    const staffName = c.Staff?.staff_name?.toLowerCase() ?? '';
    const clauseName = c.Clause?.ClauseName?.toLowerCase() ?? '';
    const staffKey = c.Staff?.staff_key?.toString() ?? '';

    // 🔹 الشرط: البحث بالاسم أو رقم الموظف أو اسم البند
    if (
      staffName.includes(keyword) ||
      clauseName.includes(keyword) ||
      staffKey.includes(keyword)
    ) {
      if (!filteredMap.has(c.Staff!.staff_name)) {
        filteredMap.set(c.Staff!.staff_name, []);
      }
      if (c.Clause) filteredMap.get(c.Staff!.staff_name)!.push(c.Clause);
    }
  });

  this.groupedContracts = Array.from(filteredMap.entries()).map(([staff_name, clauses]) => ({ staff_name, clauses }));
}

toggleEmployee(staffName: string) {
  // لو ضغطت على نفس الموظف → يقفل
  if (this.openedEmployee === staffName) {
    this.openedEmployee = null;
  } else {
    // لو ضغطت على موظف جديد → يقفل القديم ويفتح الجديد
    this.openedEmployee = staffName;
  }
}
  searchClauses() {
    const keyword = this.clauseSearchKeyword.toLowerCase();
    this.filteredClauses = this.clauseList.filter(c => c.ClauseName.toLowerCase().includes(keyword));
  }
  selectStaff(staff: any) {
    this.selectedStaff = staff;
    this.searchKeyword = staff.staff_name;
    this.staffList = [];
  }



  loadClauses() {
    this.hrService.getAllClauses().subscribe({
      next: (res) => (this.clauseList = res),
      error: (err) => console.error('❌ خطأ في تحميل البنود:', err)
    });
  }
  toggleClause(clauseId: number) {
    const index = this.selectedClauses.indexOf(clauseId);
    if (index > -1) {
      this.selectedClauses.splice(index, 1); // إزالة إذا موجود
    } else {
      this.selectedClauses.push(clauseId); // إضافة إذا مش موجود
    }
  }

  addClause() {
    if (!this.newClause.ClauseName.trim()) {
      this.toastr.warning('من فضلك أدخل اسم البند ⚠️');
      return;
    }

    this.hrService.addClause(this.newClause).subscribe({
      next: () => {
        this.toastr.success('تم إضافة البند بنجاح ✅');
        this.newClause = { ClauseName: '', ClauseDescription: '' };
        this.loadClauses();
      },
      error: (err) => {
        console.error('❌ خطأ في إضافة البند:', err);
        this.toastr.error('حدث خطأ أثناء إضافة البند ❌');
      }
    });
  }

 loadContracts() {
  this.hrService.getAllContracts().subscribe({
    next: (res) => {
      this.contracts = res;
      this.groupContracts(); //  التحديث بعد التحميل مباشرة
    },
    error: (err) => console.error('❌ خطأ في تحميل العقود:', err)
  });
}

  deleteContract(contractId: number) {

    this.hrService.deleteContract(contractId).subscribe({
      next: () => {
        this.toastr.success('تم حذف البند بنجاح 🗑️');
        this.loadContracts();
        setTimeout(() => this.groupContracts(), 500); // ⏳ بعد التحديث أعد التجميع
      },
      error: (err) => {
        console.error('❌ خطأ في الحذف:', err);
        this.toastr.error('حدث خطأ أثناء الحذف ❌');
      }
    });
  }
   saveContract() {
    if (!this.selectedStaff || this.selectedClauses.length === 0) {
      this.toastr.warning('من فضلك اختر الموظف والبنود أولاً ⚠️');
      return;
    }

    // 🔹 البنود الموجودة فعلاً لهذا الموظف
    const existingClausesForStaff = this.contracts
      .filter(c => c.staff_key === this.selectedStaff.staff_key)
      .map(c => c.ClauseId);

    // 🔹 البنود الجديدة فقط
    const newClauses = this.selectedClauses.filter(id => !existingClausesForStaff.includes(id));

    if (newClauses.length === 0) {
      this.toastr.info('جميع البنود التي اخترتها مضافة بالفعل لهذا الموظف 🟡');
      return;
    }

    // 🔹 تجهيز البيانات للحفظ
    const requests: StaffContractModel[] = newClauses.map(clauseId => ({
      staff_key: this.selectedStaff.staff_key,
      ClauseId: clauseId,
staff_type_sys_key: this.selectedStaffType!,
      StaffContractId: 0,
      Staff: undefined,
      Clause: undefined
    }));

    let savedCount = 0;

    requests.forEach(contract => {
      this.hrService.saveContract(contract).subscribe({
        next: () => {
          savedCount++;
          if (savedCount === requests.length) {
            // ✅ عند انتهاء الحفظ كله
            this.toastr.success('تم حفظ العقد بنجاح 🎉');
            this.loadContracts();
            this.resetForm(); // 🔁 عمل reset بعد الحفظ
          }
        },
        error: (err) => {
          console.error('❌ خطأ في حفظ العقد:', err);
          this.toastr.error('حدث خطأ أثناء حفظ العقد ❌');
        }
      });
    });
  }
  resetForm() {
  this.selectedStaff = null;
  this.selectedClauses = [];
  this.searchKeyword = '';
  this.clauseSearchKeyword = '';
  this.filteredClauses = this.clauseList;
  this.showForm = false; // 🔙 يرجع لشاشة العقود
}

}
