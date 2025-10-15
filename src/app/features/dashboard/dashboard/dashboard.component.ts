import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, NgIf, NgFor } from '@angular/common';
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
    datasets: [{ data: [], label: 'Ventes XOF' }]
  };

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Ventes hebdomadaires' }
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

  loadMedicines(): void {
    this.medicineService.getAll().subscribe((data: Medicine[]) => {
      // 🟢 CORRECTION : Convertir le stock en nombre au chargement des données
      const formattedData: Medicine[] = data.map(m => ({
        ...m,
        stock: Number(m.stock) 
      }));

      this.medicines = formattedData;
      // 🟢 Application du filtre sur les données avec le stock numérique
      this.lowStockMedicines = this.medicines.filter(m => m.stock < 10);
    });
  }

  loadSales(): void {
    this.salesService.getAll().subscribe((sales: Sale[]) => {
      // 🟢 Amélioration : Utiliser toISOString().split('T')[0] pour comparer la date
      const today = new Date().toISOString().split('T')[0];
      const todaySales = sales.filter(s => s.date.startsWith(today));

      this.totalSalesToday = todaySales.reduce((sum, s) => sum + s.total, 0);
      this.totalSalesCount = todaySales.length;

      this.updateChartData(sales);
    });
  }

  updateChartData(sales: Sale[]): void {
    const weekData = [0, 0, 0, 0, 0, 0, 0]; // Lundi → Dimanche

    sales.forEach(s => {
      // ⚠️ Problème de format de date : si s.date est 'YYYY-MM-DD', new Date() peut échouer
      // Si votre date de vente vient de new Date().toISOString().split('T')[0], 
      // il faut la reconvertir en Date pour getDay() :
      const d = new Date(s.date);
      
      // La ligne ci-dessous peut donner des résultats incohérents si la date est mal formatée
      const dayIndex = d.getDay() === 0 ? 6 : d.getDay() - 1; // dimanche à la fin

      weekData[dayIndex] += s.total;
    });

    this.chartData.datasets[0].data = weekData; // mise à jour
  }
}
