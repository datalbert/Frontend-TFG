
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeoApiService {

  private conf = {
    url: 'https://apiv1.geoapi.es/',  // Note: Ensure you use the correct protocol (https)
    type: 'JSON',
    key: '935f304a117600b9407a41c8d89fc614090f3fe4bdcdc56f5e86ce6cbe0bf570',
    sandbox: 0
  };

  private _data = {
    lastQuery: {
      url: '',
      params: {}
    },
    lastResult: {
      status: 0,
      data: {}
    }
  };

  constructor(private http: HttpClient) {}

  setConfig(constant: string, value: any): void {
    (this.conf as any)[constant] = value;
  }

  getLastQuery() {
    return this._data.lastQuery;
  }

  getLastResult() {
    return this._data.lastResult;
  }

  private _call(accion: string, params: any): Observable<any> {
    const fullParams = { ...this.conf, ...params };
    delete fullParams.url;

    const httpParams = new HttpParams({ fromObject: fullParams });

    const url = `${this.conf.url}${accion}`;
    this._data.lastQuery = { url, params: fullParams };

    return this.http.get(url, { params: httpParams }).pipe(
      map((response: any) => {
        this._data.lastResult = {
          status: 200, // Assuming success, you might need to adjust based on actual response
          data: response
        };
        return response;
      })
    );
  }

  calles(params: any): Observable<any> {
    return this._call('calles', params);
  }

  comunidades(params: any): Observable<any> {
    return this._call('comunidades', params);
  }

  cps(params: any): Observable<any> {
    return this._call('cps', params);
  }

  municipios(params: any): Observable<any> {
    return this._call('municipios', params);
  }

  nucleos(params: any): Observable<any> {
    return this._call('nucleos', params);
  }

  poblaciones(params: any): Observable<any> {
    return this._call('poblaciones', params);
  }

  provincias(params: any): Observable<any> {
    return this._call('provincias', params);
  }

  qcalles(params: any): Observable<any> {
    return this._call('qcalles', params);
  }
}
