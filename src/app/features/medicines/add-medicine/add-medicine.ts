import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MedicinesService } from '../../../core/services/medicines';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-add-medicine',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './add-medicine.html',
  styleUrls: ['./add-medicine.css']
})
export class AddMedicineComponent {
  medicineForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private medicineService: MedicinesService,
    private router: Router
  ) {
    this.medicineForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      expiryDate: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.medicineForm.valid) {
      this.medicineService.add(this.medicineForm.value).subscribe({
        next: () => {
          this.successMessage = '✅ Médicament ajouté avec succès !';
          this.medicineForm.reset();
          setTimeout(() => this.router.navigate(['/medicines']), 1200);
        },
        error: () => {
          this.errorMessage = '❌ Une erreur est survenue.';
        }
      });
    } else {
      this.errorMessage = ' Veuillez remplir tous les champs correctement.';
    }
  }
}
