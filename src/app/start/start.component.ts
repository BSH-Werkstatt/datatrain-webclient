import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from "@angular/material";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {

  }

	selectedCount(): number {
		return this.dataset.images.filter(e => e.selected == true).length;
	}

	correctCount(): number {
		return this.dataset.images.filter(e => e.selected == e.isValid).length;
	}

	validate() {
		this.snackBar.open(
			"You correctly selected " +
				this.correctCount() +
				"/" +
				this.dataset.images.length +
				" images."
		);
	}

	dataset = {
		class: "potatoes",
		images: [
			{
				id: 1,
				src: "/assets/potatoes/potato1.jpg",
				isValid: true,
				selected: false
			},
			{
				id: 2,
				src: "/assets/potatoes/banana.jpg",
				isValid: false,
				selected: false
			},
			{
				id: 3,
				src: "/assets/potatoes/potato2.png",
				isValid: true,
				selected: false
			},
			{
				id: 4,
				src: "/assets/potatoes/carrot.png",
				isValid: false,
				selected: false
			},
			{
				id: 5,
				src: "/assets/potatoes/potato3.jpg",
				isValid: true,
				selected: false
			},
			{
				id: 6,
				src: "/assets/potatoes/potato4.jpg",
				isValid: true,
				selected: false
			},
			{
				id: 7,
				src: "/assets/potatoes/cucumber.jpg",
				isValid: false,
				selected: false
			},
			{
				id: 8,
				src: "/assets/potatoes/potato5.jpg",
				isValid: true,
				selected: false
			},
			{
				id: 9,
				src: "/assets/potatoes/radish.jpg",
				isValid: false,
				selected: false
			}
		]
	};
}
