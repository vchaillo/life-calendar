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

  user = {
    id: "1",
    name: "Valentin Chaillou",
    nickName: "Onefroza",
    birth: "10.20.1989",
    events: [
      {
        id: "1",
        userId: "1",
        title: "Evènement ponctuel",
        color: "cornflowerblue",
        yearStart: 18,
        yearEnd: 18,
        weekStart: 40,
        weekEnd: 40
      },
      {
        id: "2",
        userId: "1",
        title: "Evènement période",
        color: "yellow",
        yearStart: 28,
        yearEnd: 35,
        weekStart: 0,
        weekEnd: 32
      }
    ]
  };

  ngOnInit(): void {
    this.initUser();
    // this.initCalendar();

    // console.log('years : ', this.years);
    console.log('weekNumbers : ', this.weekNumbers);
  }

  initUser(): void {
    this.user.events.forEach(event => {

    });

    for (let i = 0; i < 90; i++) {
      let weeks: Week[] = [];

      for (let j = 1; j <= 52; j++) {
        let color = (j - 1 === 0 && i % 5 === 0) ? 'coral' : 'white';
        weeks.push(new Week(color, j, null));
      }

      this.years[i] = new Year(i, weeks);
    }

    this.initCalendar
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
