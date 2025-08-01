import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ModalController,
  IonButton,
  IonContent,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonButton, IonContent],
})
export class TermsAndConditionsComponent implements OnInit {
  @Input() terms?: string | null;

  constructor(public modalController: ModalController) {}

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }
}
