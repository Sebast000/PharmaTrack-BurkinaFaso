import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MedicinesService, Medicine } from '../../../core/services/medicines';
import { SalesService, Sale } from '../../../core/services/sales';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-list-sales',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './list-sales.html',
  styleUrls: ['./list-sales.css']
})
export class ListSalesComponent implements OnInit {
  sales: any[] = []; // ✅ on met `any[]` pour ajouter le nom du médicament
  medicines: Medicine[] = [];
  saleForm!: FormGroup;
  totalDay = 0;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private medicineService: MedicinesService,
    private salesService: SalesService
  ) {}

  ngOnInit() {
    this.loadData();

    this.saleForm = this.fb.group({
      medicineId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      date: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  loadData() {
    this.medicineService.getAll().subscribe((data: Medicine[]) => {
      this.medicines = data.map(m => ({
        ...m,
        stock: Number(m.stock)
      }));

      // ✅ Une fois les médicaments récupérés, on charge les ventes
      this.salesService.getAll().subscribe((sales: Sale[]) => {
        // 🧠 Associer chaque vente à son médicament
        this.sales = sales.map(sale => {
          const med = this.medicines.find(m => m.id === sale.medicineId);
          return {
            ...sale,
            medicineName: med ? med.name : 'Inconnu',
            price: med ? med.price : 0
          };
        });
        this.calculateTotal();
      });
    });
  }

  onSubmit() {
    if (this.saleForm.valid) {
      const { medicineId, quantity, date } = this.saleForm.value;
      const selectedMed = this.medicines.find(m => m.id == medicineId);

      if (!selectedMed) {
        this.errorMessage = '❌ Médicament introuvable.';
        return;
      }

      const currentStock = selectedMed.stock;
      const quantityToSell = Number(quantity);

      if (currentStock < quantityToSell) {
        this.errorMessage = `⚠️ Stock insuffisant (Stock actuel: ${currentStock}).`;
        return;
      }

      const newStock = currentStock - quantityToSell;
      const total = selectedMed.price * quantityToSell;

      // ✅ On enregistre aussi le nom du médicament pour l’affichage direct
      const sale: any = {
        medicineId: selectedMed.id,
        medicineName: selectedMed.name,
        quantity: quantityToSell,
        total,
        date
      };

      this.salesService.add(sale).pipe(
        switchMap(() => this.medicineService.updateStock(selectedMed.id!, newStock))
      ).subscribe({
        next: () => {
          this.successMessage = '✅ Vente enregistrée avec succès !';
          this.errorMessage = '';
          this.loadData();
          this.saleForm.reset({
            medicineId: '',
            quantity: 1,
            date: new Date().toISOString().split('T')[0]
          });
          setTimeout(() => this.successMessage = '', 2000);
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.errorMessage = '❌ Erreur lors de l’enregistrement.';
        }
      });
    } else {
      this.errorMessage = '⚠️ Veuillez remplir tous les champs.';
    }
  }

  calculateTotal() {
    const today = new Date().toISOString().split('T')[0];
    this.totalDay = this.sales
      .filter(s => s.date.startsWith(today))
      .reduce((sum, s) => sum + s.total, 0);
  }
}
