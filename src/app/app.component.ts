import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from './api.service';

import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ApiService]
})
export class AppComponent implements OnInit {
  title = 'kenneth';

  @ViewChild('canvasEl') canvasEl: any;
  context: any;
  margin: any;
  width: number;
  height: number;
  x: any;
  y: any;
  line: any;
  origindata: Array<any>;
  data = '';

  constructor(protected apiService: ApiService) {

  }

  ngOnInit() {
    this.setChartInit();
    this.apiService.getData().subscribe((response) => {
      this.data = response.data;
      this.x.domain([0, 1000000]);
      this.y.domain([0, 11000]);
      this.drawChart(response.chartdata);
    }, (error) => {
      this.data = 'Error with HTTP request';
    });
    // setTimeout(() => {
    //   this.setChartInit();
    //   this.setData();
    // }, 400);
  }

  onClick(event: any) {
    console.log('onClick : ', event);
  }

  setChartInit() {
    this.context = this.canvasEl.nativeElement.getContext('2d');
    console.log('canvas : ', this.canvasEl.nativeElement);
    this.margin = {top: 20, right: 20, bottom: 30, left: 50};
    this.width = this.canvasEl.nativeElement.width - this.margin.left - this.margin.right;
    this.height = this.canvasEl.nativeElement.height - this.margin.top - this.margin.bottom;
    this.x = d3.scaleLinear().range([0, this.width]);
    this.y = d3.scaleLinear().range([this.height, 0]);
    this.line = d3.line()
    // tslint:disable-next-line:arrow-return-shorthand
    .x((d: any) => { return this.x(d.date); })
    // tslint:disable-next-line:arrow-return-shorthand
    .y((d: any) => { return this.y(d.close); })
    .curve(d3.curveStep)
    .context(this.context);
    this.context.translate(this.margin.left, this.margin.top);
  }

  setData() {
    this.origindata = [];
    let temp;
    let value = 0;
    let isPlus = false;
    for (let i = 0; i < 1000000; i++) {
      if ( i % 10000 === 0 ) {
        isPlus = !isPlus;
      }
      if (isPlus) {
        value++;
      } else {
        value--;
      }
      temp = {
        date: i,
        close: value
      };
      this.origindata.push(temp);
    }
    this.x.domain([0, 1000000]);
    this.y.domain([0, 11000]);
    this.drawChart(this.origindata);
  }

  drawChart(data: any) {
    this.xAxis();
    this.yAxis();
    this.context.beginPath();
    this.line(data);
    this.context.lineWidth = 1.5;
    this.context.strokeStyle = 'steelblue';
    this.context.stroke();
  }

  xAxis() {
    const tickCount = 10;
    const tickSize = 6;
    const ticks = this.x.ticks(tickCount);
    const tickFormat = this.x.tickFormat();

    this.context.beginPath();
    ticks.forEach((d: any) => {
      this.context.moveTo(this.x(d), this.height);
      this.context.lineTo(this.x(d), this.height + tickSize);
    });
    this.context.strokeStyle = 'black';
    this.context.stroke();

    this.context.textAlign = 'center';
    this.context.textBaseline = 'top';
    ticks.forEach((d: any) => {
      this.context.fillText(tickFormat(d), this.x(d), this.height + tickSize);
    });
  }

  yAxis() {
    const tickCount = 10;
    const tickSize = 6;
    const tickPadding = 3;
    const ticks = this.y.ticks(tickCount);
    const tickFormat = this.y.tickFormat(tickCount);

    this.context.beginPath();
    ticks.forEach((d: any) => {
      this.context.moveTo(0, this.y(d));
      this.context.lineTo(-6, this.y(d));
    });
    this.context.strokeStyle = 'black';
    this.context.stroke();

    this.context.beginPath();
    this.context.moveTo(-tickSize, 0);
    this.context.lineTo(0.5, 0);
    this.context.lineTo(0.5, this.height);
    this.context.lineTo(-tickSize, this.height);
    this.context.strokeStyle = 'black';
    this.context.stroke();

    this.context.textAlign = 'right';
    this.context.textBaseline = 'middle';
    ticks.forEach((d: any) => {
      this.context.fillText(tickFormat(d), -tickSize - tickPadding, this.y(d));
    });

    this.context.save();
    this.context.rotate(-Math.PI / 2);
    this.context.textAlign = 'right';
    this.context.textBaseline = 'top';
    this.context.font = 'bold 10px sans-serif';
    this.context.fillText('Price (US$)', -10, 10);
    this.context.restore();
  }

}
