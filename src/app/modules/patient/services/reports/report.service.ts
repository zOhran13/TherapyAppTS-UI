import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IQuestion, IReport } from '../../../../viewmodels/viewmodels';
import { Observable, map, tap, catchError } from 'rxjs';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private _http = inject(HttpClient);

  constructor() { }

  getDailyReportQuestions(): Observable<IQuestion[]> {
    return this._http.get<IQuestion[]>('assets/data/questions.json').pipe(
      map((questions: IQuestion[]) => {
        let commonQuestions = questions.slice(0,3);
        const otherQuestions = questions.slice(3);
        const rand1 = Math.round(Math.random() * (otherQuestions.length - 1));
        let rand2 = Math.round(Math.random() * (otherQuestions.length - 1));
        while (rand1 === rand2) {
          rand2 = Math.round(Math.random() * (otherQuestions.length - 1));
        }
        commonQuestions.push(otherQuestions[rand1]);
        commonQuestions.push(otherQuestions[rand2]);

        return commonQuestions;
      })
    );
  }

  createDailyReport(report: IReport) {
    return this._http.post(environment.apiUrl + 'daily-reports', report);
  }

  getPatientByUserId(userId: string): Observable<any> {
    const params = new HttpParams().set('userId', userId);
    return this._http.get(environment.apiUrl + 'patients/by-user-id', { params });
  }
  

  getDailyReportsForPatient(patientId: string) {
    //console.log('Calling getDailyReportsForPatient with patientId:', patientId); // Log za patientId
  
    const params = new HttpParams().set('patientId', patientId);
    return this._http.get<IReport[]>(environment.apiUrl + 'daily-reports', { params: params }).pipe(
      // Log uspješnog odgovora
      tap((response) => {
        console.log('Response from getDailyReportsForPatient:', response);
      }),
      // Log greške
      catchError((error) => {
        console.error('Error in getDailyReportsForPatient:', error);
        throw error; // Ponovo podignite grešku ako je potrebno za daljnje rukovanje
      })
    );
  }
}
  
