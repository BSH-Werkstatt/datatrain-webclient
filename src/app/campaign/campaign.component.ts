import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from "@angular/material";

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent implements OnInit {
  constructor(private snackBar: MatSnackBar) {
	this.reset();
  }

  ngOnInit(): void {

  }

	selectedCount(): number {
		return this.dataset.images.filter(e => e.selected == true).length;
	}

	correctCount(): number {
		return this.dataset.images.filter(e => e.selected == e.isValid).length;
	}

	validate() {
		let correctCount = this.correctCount();

		this.snackBar.open(
			"You correctly selected " +
				correctCount +
				"/" +
				this.dataset.images.length +
				" images."
		);

		setTimeout(() => {
			this.snackBar.dismiss();
		}, 3000);
		
		if (correctCount < this.dataset.images.length) {
			this.incorrect = this.dataset.images.filter(e => e.selected != e.isValid);
			this.incorrectItem = this.incorrect[this.incorrectValidated];
		} else {
			this.reset();
		}
	}

	validateIncorrect() {
		this.incorrectValidated++;

		if (this.incorrectValidated >= 3 || this.incorrect.length - 1 < this.incorrectValidated) {
			this.incorrectValidated = 0;
			this.incorrect = [];
			this.incorrectItem = {};

			this.reset();
			return;
		}		

		this.incorrectItem = this.incorrect[this.incorrectValidated];
	}

	reset() {
		this.dataset.images.forEach((e) => {
			e.selected = false;
		});

		var left = this.dataset.images.length
		var temp;
		var index;

		var cpy = this.dataset.images.slice(0);

		while (left > 0) {
			index = Math.floor(Math.random() * left);
			left--;

			temp = cpy[left];
			cpy[left] = cpy[index];
			cpy[index] = temp;
		}

		this.dataset.images = cpy;
	}

	checkingIncorrect = false;
	incorrect = [];
	incorrectValidated = 0;
	incorrectItem = {};

	dataset = {
		class: "potatoes",
		classSingular: "potato",
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
