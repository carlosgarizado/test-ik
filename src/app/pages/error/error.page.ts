import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.page.html',
  styleUrls: ['./error.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule],
})
export class ErrorPage implements OnInit {
  errorTitle = 'Ha ocurrido un error';
  errorMessage = 'Intenta nuevamente más tarde.';
  emoji = '😢';
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: { [x: string]: any }) => {
      const message = params['message'];

      switch (message) {
        case 'company_not_found':
          this.errorTitle = 'Compañía no encontrada';
          this.errorMessage =
            'La compañía no existe o no se encuentra configurada correctamente.';
          break;

        case 'unauthorized':
          this.errorTitle = 'No autorizado';
          this.errorMessage = 'No tienes permiso para acceder a este recurso.';
          break;

        // Puedes agregar más casos aquí
        default:
          this.errorTitle = 'Error desconocido';
          this.errorMessage = 'Ocurrió un error inesperado.';
          break;
      }
    });
  }
}
