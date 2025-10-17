import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Medicine {
  id?: number;
  name: string;
  category: string;
  price: number;
  stock: number; 

  stockRemaining?: number; 
  expiryDate: string; 
}

@Injectable({
  providedIn: 'root'
})
export class MedicinesService {
  private apiUrl = 'http://localhost:3000/medicines'; 

  constructor(private http: HttpClient) {}

  getAll(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(this.apiUrl);
  }

  getById(id: string | number): Observable<Medicine> {
  return this.http.get<Medicine>(`${this.apiUrl}/${id}`);
}


  add(medicine: Medicine): Observable<Medicine> {
    return this.http.post<Medicine>(this.apiUrl, medicine);
  }

  update(id: string, medicine: Medicine): Observable<Medicine> {
  return this.http.put<Medicine>(`${this.apiUrl}/${id}`, medicine);
}


  updateStock(id: number, newStock: number) {
  return this.http.patch(`${this.apiUrl}/${id}`, { stock: newStock });
}


  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
