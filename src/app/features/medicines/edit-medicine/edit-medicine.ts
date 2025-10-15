import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MedicinesService, Medicine } from '../../../core/services/medicines';

@Component({
  selector: 'app-edit-medicine',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-medicine.html',
  styleUrls: ['./edit-medicine.css']
})
export class EditMedicineComponent implements OnInit {
  medicineForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  medicineId!: string; // ✅ Doit être une string si ton ID est "f0dd"

  constructor(
    private fb: FormBuilder,
    private medicineService: MedicinesService,
    private route: ActivatedRoute,
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

  ngOnInit(): void {
    // ✅ Récupération et stockage de l’ID
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.medicineId = id; // ⚠️ C’est ce qu’il manquait
      this.medicineService.getById(id).subscribe({
        next: (med) => this.medicineForm.patchValue(med),
        error: () => this.errorMessage = '❌ Impossible de charger les données du médicament.'
      });
    } else {
      this.errorMessage = '❌ Aucun identifiant trouvé dans l’URL.';
    }
  }

  onSubmit() {
    if (this.medicineForm.valid) {
      this.medicineService.update(this.medicineId, this.medicineForm.value).subscribe({
        next: () => {
          this.successMessage = '✅ Médicament modifié avec succès !';
          setTimeout(() => this.router.navigate(['/medicines']), 1000);
        },
        error: (err) => {
          console.error('Erreur de mise à jour :', err);
          this.errorMessage = '❌ Une erreur est survenue lors de la modification.';
        }
      });
    } else {
      this.errorMessage = '⚠️ Veuillez remplir tous les champs correctement.';
    }
  }
}
