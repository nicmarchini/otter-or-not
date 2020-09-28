import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { default as anime } from '../../../node_modules/animejs/lib/anime.es.js';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedFile: File = null;
  imgURL = null;
  result = '';
  opac = 1;


  constructor(private http: HttpClient) {}

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
  }

  onUpload() {
    anime({
      targets: '#otterpng',
      opacity: 1,
      duration: 1,
      easing: "linear"
     });
     anime({
      targets: '#result',
      opacity: 0,
      duration: 1,
      easing: "linear"
     });
    this.result = '';
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name);
    console.log("fd: ", fd);
    this.http.post('http://54.91.17.31:5000/test', fd,
       {
      reportProgress: true,
      observe: 'events'
    })
      .subscribe(event => {
        console.log("res:", event);
        if (event['body']){
          this.result = event['body']
          anime({
            targets: '#result',
            opacity: 1,
            duration: 1000,
            easing: "linear"
           });
          anime({
            targets: '#otterpng',
            opacity: 0.15,
            duration: 600,
            easing: "linear"
        });
        }
      })

      var reader = new FileReader();
      reader.readAsDataURL(this.selectedFile); 
      reader.onload = (_event) => { 
          this.imgURL = reader.result;
      }

    }
    
  ngOnInit(): void {    
    this.imgURL = "../assets/blank.png";
    
  }

  ngAfterViewInit() {
    //do nothing
   }

}
