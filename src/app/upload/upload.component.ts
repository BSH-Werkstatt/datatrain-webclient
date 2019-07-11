import { Component, OnInit } from '@angular/core';
import { CampaignComponent } from '../campaign/campaign.component';
import { DefaultService, ImageData } from '../../swagger';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent extends CampaignComponent implements OnInit {
  private uploadDone = false;
  private uploadedCount = 0;
  private failedCount = 0;
  private chosenFileCount = 0;
  private uploadInProgress = false;

  private files: File[] = [];
  private fileSrcs: string[] = [];
  private fileSrcSuccess: number[] = [];
  private uploaded: ImageData[] = [];

  constructor(route: ActivatedRoute, router: Router, defaultService: DefaultService) {
    super(route, router, defaultService);
  }

  /**
   * Checks if the given file is an image by looking at the last segment of the filename split by '.'
   * @param file File to be checked
   */
  static fileIsImage(file: File): boolean {
    const filenameParts = file.name.split('.');
    const imageExts = ['jpg', 'jpeg'];
    const ext = filenameParts[filenameParts.length - 1].toLowerCase();

    return imageExts.includes(ext);
  }

  /**
   * initializes the event listeners used for drag/drop upload
   */
  ngOnInit() {
    super.ngOnInit();

    const uploadArea = document.getElementById('upload-area');

    const preventDefaultsEvents = ['dragenter', 'dragover', 'dragleave', 'drop'];
    preventDefaultsEvents.forEach(event => {
      uploadArea.addEventListener(event, this.preventDefaults);
    });

    const addHighlightEvents = ['dragenter', 'dragover'];
    addHighlightEvents.forEach(event => {
      uploadArea.addEventListener(event, this.addHighlight);
    });

    const removeHighlightEvents = ['dragleave', 'drop'];
    removeHighlightEvents.forEach(event => {
      uploadArea.addEventListener(event, this.removeHighlight);
    });

    uploadArea.addEventListener('drop', this.handleDrop.bind(this), false);
  }

  preventDefaults(e: any) {
    e.preventDefault();
    e.stopPropagation();
  }

  addHighlight() {
    document.getElementById('upload-area').classList.add('highlight');
  }

  removeHighlight() {
    document.getElementById('upload-area').classList.remove('highlight');
  }

  /**
   * Handles the drop on the upload area by pushing the file to this.files and creating the preview
   * @param e event
   */
  handleDrop(e: any) {
    const dt = e.dataTransfer;
    const files: File[] = dt.files;

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < files.length; i++) {
      if (UploadComponent.fileIsImage(files[i])) {
        this.files.push(files[i]);
        this.previewFile(files[i]);
      }
    }
  }

  /**
   * Creates the preview of a file in the upload preview element
   * @param file file to create preview of
   */
  previewFile(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      document.getElementById('upload-btn').removeAttribute('disabled');

      this.fileSrcs.push(reader.result.toString());
      this.fileSrcSuccess.push(0);
    };
  }

  /**
   * Calls this.uploadFile on all files selected by the user
   */
  handleUploadButton() {
    document.getElementById('upload-btn').setAttribute('disabled', 'true');
    this.uploadInProgress = true;

    this.chosenFileCount = this.files.length;
    if (this.files.length > 0) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.files.length; i++) {
        const file = this.files[i];
        this.uploadFile(file, i);
      }

      this.files = [];
    } else {
      // TODO: handle some files were not images
    }
  }

  /**
   * Uploads the given file (with position i in the upload preview) using the Swagger DefaultService
   * @param file File to be uploaded
   * @param i Position of the file in the upload preview
   */
  uploadFile(file: File, i: number) {
    const userToken = localStorage.getItem('datatrainUserToken');

    try {
      this.defaultService.postImage(file, userToken, this.campaign.id).subscribe(
        (imageData: ImageData) => {
          this.uploaded.push(imageData);
          this.fileSrcSuccess[i] = 1;
          this.uploadedCount++;

          this.checkUploadProgress();
        },
        (err: Error) => {
          throw err;
        }
      );
    } catch (e) {
      this.fileSrcSuccess[i] = -1;
      this.failedCount++;

      this.checkUploadProgress();
    }
  }

  /**
   * Determines if the upload process is finished
   */
  checkUploadProgress() {
    if (this.uploadedCount + this.failedCount >= this.chosenFileCount) {
      this.uploadDone = true;
      this.uploadInProgress = false;
    }
  }

  /**
   * Handles the Choose Files input
   */
  onFileSelected() {
    const fileChooser: any = document.getElementById('choose-file');

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < fileChooser.files.length; i++) {
      const file = fileChooser.files[i];
      if (UploadComponent.fileIsImage(file)) {
        this.files.push(file);

        this.previewFile(file);
      }
    }

    fileChooser.value = '';
  }

  /**
   * Sets the function page name in the navigation bar
   */
  setNavBar() {
    super.setNavBar();

    const navFunctionSlash = document.getElementById('nav-function-slash');
    navFunctionSlash.classList.remove('nav-hidden');

    const navFunctionBtn = document.getElementById('nav-function-btn');
    navFunctionBtn.innerHTML = 'Upload';
    // @ts-ignore
    navFunctionBtn.href = '/campaigns/' + this.campaign.urlName + '/upload';
  }

  /**
   * Saved to be annotated imageIds to the local storage, navigates to annotation page
   */
  goToAnnotate() {
    const uploadedIds = [];
    this.uploaded.forEach(imgData => {
      uploadedIds.push(imgData.id);
    });

    localStorage.setItem('datatrainToAnnotate', JSON.stringify(uploadedIds));

    this.router.navigateByUrl('/campaigns/' + this.campaign.urlName + '/annotate');
  }
}
