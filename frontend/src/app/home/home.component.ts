import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedFile: File = null;
  imgURL = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
  }

  onUpload() {
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name);
    console.log("fd: ", fd);
    this.http.post('http://localhost:3000/', fd,
       {
      reportProgress: true,
      observe: 'events'
    })
      .subscribe(event => {
        console.log("res:", event);
      });

    var reader = new FileReader();
    reader.readAsDataURL(this.selectedFile); 
    reader.onload = (_event) => { 
    this.imgURL = reader.result;

    }
    }
  ngOnInit(): void {
  }

}
