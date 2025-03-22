import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Week } from '../../models/week';
import { Year } from '../../models/year';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  years: Year[] = [];
  yearNumbers = Array.from({ length: 19 }, (_, i) => i * 5);
  weekNumbers = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

  majority: number = 18;

  ngOnInit(): void {
    this.initCalendar();
    // console.log('years : ', this.years);
    console.log('weekNumbers : ', this.weekNumbers);
  }

  initCalendar(): void {
    let color = 'white';
    for (let i = 0; i < 90; i++) {
      let weeks: Week[] = [];

      color = (i < this.majority) ? 'cornflowerblue' : 'white';

      for (let j = 1; j <= 52; j++) {
        color = (j - 1 === 0 && i % 5 === 0) ? 'coral' : color;
        weeks.push(new Week(color, j, null));
      }

      this.years[i] = new Year(i, weeks);
    }
  }

  displayWeek(yearNumber: number, weekNumber: number): void {
    alert(`Year number : ${yearNumber}\n Week number : ${weekNumber}`)
  }
}
