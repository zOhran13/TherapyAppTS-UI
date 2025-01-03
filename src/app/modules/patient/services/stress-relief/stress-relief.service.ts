import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environment';
import { IBreathControl, ICreateBreathContolLogRequest, ICreateMeditationLogRequest, ICreateWalkLogRequest, IMeditation, IUpdateActionDurationTimeRequest, IWalk } from '../../../../viewmodels/viewmodels';
import { GetStressReliefActionLogsResponse } from '../../../../viewmodels/classes';
import { finalize, interval, takeUntil, tap, timer,catchError,throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StressReliefService {
  private _http = inject(HttpClient);

  constructor() { }

  getMeditationAudio() {
    return this._http.get('assets/data/meditation_music.mp3', { responseType: 'blob' });
  }

  getBreathControlSignalAudio() {
    return this._http.get('assets/data/breath_control_signal.mp3', { responseType: 'blob' });
  }

  createMeditationLog(request: ICreateMeditationLogRequest) {
    return this._http.post<IMeditation>(environment.apiUrl + 'stressrelief/meditation', request);
  }

  createBreathControlLog(request: ICreateBreathContolLogRequest) {
    return this._http.post<IBreathControl>(environment.apiUrl + 'stressrelief/breathcontrol', request);
  }

  getPatientByUserId(userId: string) {
    //console.log(`Fetching patient by userId: ${userId}`);
    return this._http.get<any>(`${environment.apiUrl}patients/by-user-id?userId=${userId}`).pipe(
      tap((response) => console.log('Response from getPatientByUserId:', response)),
      catchError((error) => {
        console.error('Error in getPatientByUserId:', error);
        return throwError(error);
      })
    );
  }
  

  

  createWalkLog(request: ICreateWalkLogRequest) {
    return this._http.post<IWalk>(environment.apiUrl + 'stressrelief/walk', request);
  }

  updateActionDurationTime(request: IUpdateActionDurationTimeRequest) {
    return this._http.patch(environment.apiUrl + 'stressrelief/durationtime', request);
  }

  getAllActionLogs(patientId: string) {
    let params = new HttpParams().set('patientId', patientId).set('daysOffset', 1000);
    return this._http.get<GetStressReliefActionLogsResponse>(
      environment.apiUrl + 'stressrelief/actionlogs',
      { params: params }
    );
  }
}
