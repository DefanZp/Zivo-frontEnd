import { Component, input } from '@angular/core';

@Component({
  selector: 'app-cart-button',
  imports: [],
  templateUrl: './cart-button.html',
  styleUrl: './cart-button.css',
})
export class CartButton {
  addingToCart = input(false);
  isInCart = input(false);
  text = input.required<string>();
  loadingText = input('Loading...');
  type = input<'button' | 'submit'>('button');
}
