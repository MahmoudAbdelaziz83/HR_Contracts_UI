import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StaffContractModel, StaffModel } from '../Models/model';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class HRContractService {
  private apiurl = `${environment.apiUrl}/StaffContract`;

  constructor(private http: HttpClient) { }

  searchStaff(keyword: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiurl}/Search?name=${keyword}`);
  }
    getAllClauses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiurl}/GetClauses`);
  }
  getStaffTypes(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiurl}/GetStaffTypes`);
}

  addClause(data: any): Observable<any> {
    return this.http.post(`${this.apiurl}/SaveClause`, data);
  }
    saveContract(contract: StaffContractModel): Observable<any> {
    return this.http.post(`${this.apiurl}/Save`, contract);
  }

  getAllContracts(): Observable<StaffContractModel[]> {
    return this.http.get<StaffContractModel[]>(`${this.apiurl}/GetAll`);
  }
   deleteContract(contractId: number): Observable<any> {
    return this.http.delete(`${this.apiurl}/Delete/${contractId}`);
  }
    updateContract(contractId: number, newClauseId: number): Observable<any> {
    const body = { ClauseId: newClauseId };
    return this.http.put(`${this.apiurl}/Update/${contractId}`, body);
  }

updateClause(data: any): Observable<any> {
  return this.http.put(`${this.apiurl}/UpdateClause`, data);
}

}
