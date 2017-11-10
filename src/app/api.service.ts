import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {

  constructor(protected http: HttpClient) {}

  getData() {
    return this.http.get<{data: string, chartdata: any}>('/api');
  }

}
