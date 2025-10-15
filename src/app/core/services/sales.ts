import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Sale {
  id?: number;
  medicineId: number;
  date: string;
  quantity: number;
  total: number;
}


@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = 'http://localhost:3000/sales';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  add(sale: any): Observable<any> {
    return this.http.post(this.apiUrl, sale);
  }
}
