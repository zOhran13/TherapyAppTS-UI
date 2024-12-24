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
import { ArticleService } from '../../services/article.service';
import {
  IArticle,
  IPsychologistArticleMap,
} from '../../../../viewmodels/viewmodels';
import { AuthService } from '../../../auth/services/auth.service';
import { UserRole } from '../../../../viewmodels/enums';

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
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this._authService.role$().subscribe((role: UserRole) => {
      this.currentUserRole = role;
    });
  
    this._articlesService.getAllArticles().subscribe(
      (articles: IArticle[]) => {
        console.log('Articles fetched:', articles); // Debug log
    
        // Kreiranje proširenih članaka bez tekstualnog sadržaja
        this.allExpandedArticles = articles.map((article) => {
          return new ExpandedArticle({
            authorName: article.author || 'Unknown',
            article: article, // Bez dodavanja `textContent`
          });
        });
    
        console.log('Expanded articles:', this.allExpandedArticles); // Debug log
      },
      (error) => {
        console.error('Error fetching articles:', error);
      }
    );
  }
  
  
  
  openNewArticleModal() {
    this._dialog.open(ArticleModalComponent, {
      panelClass: 'article-modal-container',
    });
  }
}
