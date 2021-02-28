import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { HelperFunService } from 'src/app/services/helper/helper-fun.service.js';
import { Transaction } from 'src/app/services/models/transaction.model.js';
import { Chart } from '../../../../../node_modules/chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @Input() transactionsData: Transaction[];
  @ViewChild('chartRef', { static: true }) chart: ElementRef;

  filteredTrans: Transaction[];

  // mode = 'all' ;

  xyAxis: {
    xAxis: string[];
    yAxis: number[];
  };

  startDate: Date;
  endDate: Date;

  constructor(private helperService: HelperFunService) {}

  private getXYAxis(transactions: Transaction[], mode) {
    let months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    let xAxis;

    switch (mode) {
      case 'day':
        xAxis = transactions.map((trans) => new Date(trans.time).getHours() + ':' + new Date(trans.time).getMinutes());
        break;
      case 'week':
        xAxis = transactions.map(
          (trans) => new Date(trans.time).getDate() + '/' + months[new Date(trans.time).getMonth()].substring(0, 3)
        );
        break;
      case 'month':
        xAxis = transactions.map(
          (trans) => new Date(trans.time).getDate() + '/' + months[new Date(trans.time).getMonth()].substring(0, 3)
        );
        break;
      case 'year':
        xAxis = transactions.map(
          (trans) =>
            months[new Date(trans.time).getMonth()].substring(0, 3) +
            '/' +
            new Date(trans.time).getFullYear().toString().substr(-2)
        );
        break;
      case 'all':
        // xAxis = transactions.map((trans) => months[new Date(trans.time).getMonth()].substring(0, 3));
        xAxis = transactions.map(
          (trans) =>
            months[new Date(trans.time).getMonth()].substring(0, 3) +
            '/' +
            new Date(trans.time).getFullYear().toString().substr(-2)
        );
        break;
      default:
        // xAxis = transactions.map((trans) => months[new Date(trans.time).getMonth()].substring(0, 3));
        xAxis = transactions.map(
          (trans) =>
            months[new Date(trans.time).getMonth()].substring(0, 3) +
            '/' +
            new Date(trans.time).getFullYear().toString().substr(-2)
        );
        break;
    }

    // const xAxis = transactions.map((trans) => months[new Date(trans.time).getMonth()].substring(0, 3));
    const yAxis = transactions.map((trans) => trans.amountAUD);
    this.xyAxis = { xAxis, yAxis };
    return this.xyAxis;
    // return { xAxis, yAxis };
  }

  private createChart(xyAxis: { xAxis; yAxis }) {
    this.getXYAxis(this.filteredTrans, 'all');

    const options: {} = {
      responsive: true,
      legend: {
        display: false,
      },

      elements: {
        point: {
          radius: 0,
        },
      },

      layout: {
        padding: {
          left: 0,
          right: 5,
          top: 30,
          bottom: 0,
        },
      },

      scales: {
        yAxes: [
          {
            gridLines: {
              drawBorder: false,
              color: '#f9fafc',
              drawTicks: true,
            },
            position: 'right',
            ticks: {
              display: true,
              fontColor: '#bfbfc4',
              min: 0,
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              drawBorder: false,
              display: false,
            },
            ticks: {
              fontColor: '#bfbfc4',
            },
          },
        ],
      },
    };

    const gradientBG = this.chart.nativeElement.getContext('2d').createLinearGradient(0, 20, 0, 220);
    gradientBG.addColorStop(0, '#074673');
    gradientBG.addColorStop(0.5, '#41a1c8');

    const transactionChart = new Chart('chart', {
      type: 'line',
      data: {
        labels: xyAxis.xAxis,
        datasets: [
          {
            data: xyAxis.yAxis,
            // fill: false,
            // borderColor: '#f7f7f7',
            borderWidth: 0,
            fill: true,
            backgroundColor: gradientBG,
          },
        ],
      },
      options: options,
    });
  }

  ngOnInit() {
    // this.createChart();
    this.allData();
  }

  dayFilter() {
    // this.mode = 'day';
    // get today's transactions
    this.filteredTrans = this.helperService.onDayFilter(this.transactionsData);
    // extract labels(amount) & time(month) from filtered data
    console.log('day:', this.filteredTrans);
    this.xyAxis = this.getXYAxis(this.filteredTrans, 'day');
    console.log('day', this.xyAxis);
    this.createChart(this.xyAxis);
  }

  weekFilter() {
    // this.mode = 'week';

    this.filteredTrans = this.helperService.onWeekFilter(this.transactionsData);
    console.log('week', this.filteredTrans);
    this.xyAxis = this.getXYAxis(this.filteredTrans, 'week');
    console.log('week', this.xyAxis);
    this.createChart(this.xyAxis);
  }

  monthFilter() {
    // this.mode = 'month';

    this.filteredTrans = this.helperService.onMonthFilter(this.transactionsData);
    console.log('month', this.filteredTrans);
    this.xyAxis = this.getXYAxis(this.filteredTrans, 'month');
    console.log('month', this.xyAxis);
    this.createChart(this.xyAxis);
  }

  yearFilter() {
    // this.mode = 'year';

    this.filteredTrans = this.helperService.onYearFilter(this.transactionsData);
    console.log('year', this.filteredTrans);
    this.xyAxis = this.getXYAxis(this.filteredTrans, 'year');
    console.log('year', this.xyAxis);
    this.createChart(this.xyAxis);
  }

  allData() {
    // this.mode = 'all';

    this.filteredTrans = this.transactionsData;
    console.log('all', this.filteredTrans);
    this.xyAxis = this.getXYAxis(this.filteredTrans, 'all');
    console.log('all', this.xyAxis);
    this.createChart(this.xyAxis);
  }

  getStartDateSel(e: any) {
    this.startDate = new Date(e.detail.value);
  }
  getEndDateSel(e: any) {
    this.endDate = new Date(e.detail.value);
  }

  customFilter() {
    if (this.startDate && this.endDate) {
      this.filteredTrans = this.helperService.dateRangeFilter(this.transactionsData, this.startDate, this.endDate);
      this.xyAxis = this.getXYAxis(this.filteredTrans, 'year');
      this.createChart(this.xyAxis);
    }
  }
}
