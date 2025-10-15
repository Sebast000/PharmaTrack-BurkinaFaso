import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { MedicinesService, Medicine } from '../../../core/services/medicines';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-medicines',
  standalone: true,
  imports: [CommonModule, NgClass, FormsModule],


  templateUrl: './list-medicines.html',
  styleUrls: ['./list-medicines.css']
})
export class ListMedicinesComponent implements OnInit {
  medicines: Medicine[] = [];
  filteredMedicines: Medicine[] = [];
  searchTerm: string = '';

  constructor(private medicineService: MedicinesService, private router: Router) {}

  ngOnInit() {
    this.loadMedicines();
  }

  loadMedicines() {
    this.medicineService.getAll().subscribe(data => {
      this.medicines = data;
      this.filteredMedicines = data;
    });
  }

  editMedicine(med: Medicine) {
    this.router.navigate(['/medicines/edit', med.id]);
  }

  deleteMedicine(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce médicament ?')) {
      this.medicineService.delete(id).subscribe(() => this.loadMedicines());
    }
  }

  hasLowStock(): boolean {
    return this.medicines.some(m => m.stock < 10);
  }

  filterMedicines() {
    const term = this.searchTerm.toLowerCase();
    this.filteredMedicines = this.medicines.filter(
      m => m.name.toLowerCase().includes(term) || m.category.toLowerCase().includes(term)
    );
  }
}
