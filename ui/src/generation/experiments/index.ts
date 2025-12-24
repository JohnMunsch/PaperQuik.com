import add from 'date-fns/add';
import { LitElement, css, svg } from 'lit';

import { getDayNames, getMonthNames } from './calendarLocalization';

class MonthCalendar extends LitElement {
  static properties = {
    month: { type: Number },
    year: { type: Number },
  };

  // First day of the year.
  calendarYear = [];

  static styles = css`
    :host {
      display: inline-block;
    }

    .day {
      font-family: 'Roboto Condensed', Sans-Serif;
      font-size: 10px;
      text-anchor: middle;
    }

    .saturday {
      fill: red;
    }

    .month {
      font-family: 'Roboto Condensed', Sans-Serif;
      font-size: 13px;
      text-anchor: middle;
    }
  `;

  constructor() {
    super();

    this.preferredLanguage = navigator.language;

    this.dayNames = getDayNames(this.preferredLanguage);
    this.monthNames = getMonthNames(this.preferredLanguage);
  }

  /**
   * If either the month or year input changes, recalculates the calendar year.
   */
  attributeChangedCallback(name, oldVal, newVal) {
    super.attributeChangedCallback(name, oldVal, newVal);

    this.setupCalendarYear();
  }

  position(index) {
    return { x: 20 + (index % 7) * 20, y: 55 + Math.floor(index / 7) * 20 };
  }

  day(day, index, offset) {
    let date = day.getDate();
    let { x, y } = this.position(index + offset);

    return svg`<text x="${x}" y="${y}" class="day ${
      day.getDay() === 6 ? 'saturday' : ''
    }">${date}</text>`;
  }

  dayOfTheWeek(dayOfTheWeek, index) {
    return svg`<text x="${20 + index * 20}" y="35" class="day ${
      index === 6 ? 'saturday' : ''
    }">${dayOfTheWeek.charAt(0)}</text>`;
  }

  render() {
    console.log(this.month, this.year);
    if (this.month === undefined || this.year === undefined) {
      return svg``;
    }

    this.monthDays = this.filterToMonth(this.month);
    this.monthName = this.monthNames[this.month];

    let offset = this.monthDays[0].getDay();

    return svg`<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
      <text x="80" y="15" class="month">${this.month + 1} | ${
      this.monthName
    }</text>
      
      ${this.dayNames.map((dayOfTheWeek, index) =>
        this.dayOfTheWeek(dayOfTheWeek, index)
      )}
      <line x1="5" y1="40" x2="155" y2="40" stroke="black" />

      ${this.monthDays.map((day, index) => this.day(day, index, offset))}
    </svg>`;
  }

  // Helpers
  setupCalendarYear() {
    console.log(this.year);
    let day = new Date(this.year, 0, 1);
    this.calendarYear = [];

    do {
      this.calendarYear.push(day);
      day = add(day, { days: 1 });
    } while (day.getFullYear() === this.year);

    console.log(this.calendarYear);

    // At this point the calendar year is an array
    // of 365-366 days.
  }

  filterToMonth(targetMonth) {
    return this.calendarYear.filter((day) => day.getMonth() === targetMonth);
  }
}

customElements.define('month-calendar', MonthCalendar);
