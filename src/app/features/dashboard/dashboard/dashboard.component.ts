import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { MedicinesService, Medicine } from '../../../core/services/medicines';
import { SalesService, Sale } from '../../../core/services/sales';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  medicines: Medicine[] = [];
  lowStockMedicines: Medicine[] = [];
  totalSalesToday = 0;
  totalSalesCount = 0;

  // ✅ Données du graphique
  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [{ data: [], label: 'Ventes XOF', backgroundColor: '#007bff', borderRadius: 8 }]
  };

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Ventes hebdomadaires' }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  constructor(
    private medicineService: MedicinesService,
    private salesService: SalesService
  ) {}

  ngOnInit(): void {
    this.loadMedicines();
    this.loadSales();
  }

  // 💊 Chargement des médicaments
  loadMedicines(): void {
    this.medicineService.getAll().subscribe((data: Medicine[]) => {
      const formattedData = data.map(m => ({
        ...m,
        stock: Number(m.stock)
      }));

      this.medicines = formattedData;
      this.lowStockMedicines = this.medicines.filter(m => m.stock < 10);
    });
  }

  // 💰 Chargement des ventes
  loadSales(): void {
    this.salesService.getAll().subscribe({
      next: (sales: Sale[]) => {
        if (!sales || sales.length === 0) {
          this.chartData.datasets[0].data = [0, 0, 0, 0, 0, 0, 0];
          return;
        }

        const today = new Date().toISOString().split('T')[0];
        const todaySales = sales.filter(s => s.date.startsWith(today));

        this.totalSalesToday = todaySales.reduce((sum, s) => sum + s.total, 0);
        this.totalSalesCount = todaySales.length;

        this.updateChartData(sales);
      },
      error: err => {
        console.error('Erreur lors du chargement des ventes :', err);
      }
    });
  }

  // 📊 Mise à jour du graphique
  updateChartData(sales: Sale[]): void {
    const weekData = Array(7).fill(0); 

    sales.forEach(s => {
      try {
        const date = new Date(s.date);
        if (isNaN(date.getTime())) return; 

        const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
        weekData[dayIndex] += s.total;
      } catch {
        console.warn('Date invalide ignorée:', s.date);
      }
    });

    this.chartData = {
      ...this.chartData,
      datasets: [{ ...this.chartData.datasets[0], data: weekData }]
    };
  }
}
