// Updated ArticleService
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { catchError, switchMap, tap } from 'rxjs/operators';
import {
  IArticle,
  IPsychologistArticleMap,
} from '../../../viewmodels/viewmodels';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private currentExpandedArticleSource = new BehaviorSubject<any>(null);

  private _articles: BehaviorSubject<IPsychologistArticleMap[]> =
    new BehaviorSubject<IPsychologistArticleMap[]>([]);

  currentArticle$ = this.currentExpandedArticleSource.asObservable();
  private _http = inject(HttpClient);

  get articles$(): Observable<IPsychologistArticleMap[]> {
    return this._articles.asObservable();
  }

  constructor() {}

  setCurrentArticle(expandedArticle: any) {
    this.currentExpandedArticleSource.next(expandedArticle);
  }

  /*getPsychologistDetails(psychologistID: string): Observable<any> {
    const token = localStorage.getItem('authToken');
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    return this._http
      .get<any>(`${environment.apiUrl}users/${psychologistID}`, { headers })
      .pipe(
        tap((details) => {
          console.log('Fetched psychologist details:', details);
        }),
        catchError((error) => {
          console.error('Error fetching psychologist details:', error);
          return of(null); // Return null if there's an error
        })
      );
  }
  */

  getAllArticles() {
    const token = localStorage.getItem('authToken');
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    
    return this._http
      .get<IArticle[]>(environment.apiUrl + 'articles/all', { headers })
      .pipe(
        tap((result) => {
         // console.log('Fetched articles:', result); // Debug log
        }),
        catchError((error) => {
          //console.error('Error fetching articles:', error);
          return of([]); // Sprečava rušenje aplikacije
        })
      );
  }
  getAllPsychologistsArticles(currentUserId) {
    const token = localStorage.getItem('authToken');
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    
    return this._http
      .get<IArticle[]>(environment.apiUrl + 'articles/allPsychologists?id=' + currentUserId , { headers })
      .pipe(
        tap((result) => {
         // console.log('Fetched articles:', result); // Debug log
        }),
        catchError((error) => {
          console.error('Error fetching articles:', error);
          return of([]); // Sprečava rušenje aplikacije
        })
      );
  }
  

  createArticle(article: IArticle) {
    return this._http
      .post(environment.apiUrl + 'articles/add', article)
      .pipe(
        switchMap(() => this.getAllPsychologistsArticles(article.author)),
        catchError((error) => {
          console.error('Error creating article:', error);
          return of(null);
        })
      );
  }

  deleteArticle(articleID: string) {
    return this._http
      .delete(`${environment.apiUrl}articles/remove/${articleID}`)
      .pipe(
        switchMap(() => this.getAllArticles()),
        catchError((error) => {
          console.error('Error deleting article:', error);
          return of(null);
        })
      );
  }

  updateArticle(articleID: string, updatedArticle: any) {
    const url = `${environment.apiUrl}articles/update/${articleID}`;
    return this._http.put(url, updatedArticle).pipe(
      catchError((error) => {
        console.error('Error updating article:', error);
        return of(null);
      })
    );
  }
}