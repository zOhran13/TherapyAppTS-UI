// Updated ArticlesComponent
import { Component, OnInit } from '@angular/core';
import {
  Article,
  ExpendedArticle as ExpandedArticle,
  Psychologist,
} from '../../../../viewmodels/classes';
import { CommonModule } from '@angular/common';
import { ArticleCardComponent } from '../article-card/article-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ArticleModalComponent } from '../article-modal/article-modal.component';
import { map } from 'rxjs/operators';
import { ArticleService } from '../../services/article.service';
import {
  IArticle,
  IPsychologistArticleMap,
  IUser,
} from '../../../../viewmodels/viewmodels';
import { AuthService } from '../../../auth/services/auth.service';
import { UserRole } from '../../../../viewmodels/enums';
import { PatientService } from '../../../patient/services/patient/patient.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [
    CommonModule,
    ArticleCardComponent,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent implements OnInit {
  allExpandedArticles: ExpandedArticle[] = [];
  articlesAndPsychologist: IPsychologistArticleMap[] = [];
  currentUserRole: UserRole;

  constructor(
    private _articlesService: ArticleService,
    private _dialog: MatDialog,
    private _authService: AuthService,
    private _patientService: PatientService
  ) {}

  ngOnInit(): void {
    this._authService.role$().subscribe((role: UserRole) => {
      this.currentUserRole = role;
    });
    //console.log(this.currentUserRole);
    if (this.currentUserRole == "Psychologist"){
      this._articlesService.getAllPsychologistsArticles(this._authService.currentUserId).subscribe(
        (articles: IArticle[]) => {
      
          // Kreiranje proširenih članaka bez tekstualnog sadržaja
          this.allExpandedArticles = articles.map((article) => {
            return new ExpandedArticle({
              authorName: this._authService.currentUserName,
              article: article, // Bez dodavanja `textContent`
            });
          });
      
          //console.log('Expanded articles:', this.allExpandedArticles); // Debug log
        },
        (error) => {
          //console.error('Error fetching articles:', error);
        }
      );
    }
    else{
      this._articlesService.getAllArticles().subscribe(
        (articles: IArticle[]) => {
      
          // Kreiranje proširenih članaka bez tekstualnog sadržaja
          this.allExpandedArticles = articles.map((article) => {
            return new ExpandedArticle({
              authorName: article.author || 'Unknown',
              article: article, // Bez dodavanja `textContent`
            });
          });
      
          //console.log('Expanded articles:', this.allExpandedArticles); // Debug log
        },
        (error) => {
          //console.error('Error fetching articles:', error);
        }
      );
    }
    }
  
  
  
  openNewArticleModal() {
    this._dialog.open(ArticleModalComponent, {
      panelClass: 'article-modal-container',
    });
  }
}
