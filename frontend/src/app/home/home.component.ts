import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { default as anime } from '../../../node_modules/animejs/lib/anime.es.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedFile: File = null;
  imgURL = null;
  result = '';


  constructor(private http: HttpClient) {}

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
  }

  onUpload() {
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
        }
      })

    var reader = new FileReader();
    reader.readAsDataURL(this.selectedFile); 
    reader.onload = (_event) => { 
    this.imgURL = reader.result;

    }

    anime({
      targets: '#ok .el',
      translateY: 250,
      duration: 3000,
      delay: 1000
  });


   

    }
  ngOnInit(): void {    
  }

  ngAfterViewInit() {

    
    var basicTimeline = anime.timeline({
      autoplay: true
    });
    
  
    basicTimeline
      .add({
        targets: ".atext",
        duration: 1,
        opacity: "0",
        delay: 1000
      })
      .add({
        targets: "#ab",
        duration: 1300,
        height: 10,
        width: 300,
        backgroundColor: "red",
        border: "0",
        borderRadius: 100
      })
      .add({
        targets: ".aprogress-bar",
        duration: 2000,
        width: 300,
        easing: "linear"
      })
      .add({
        targets: "#ab",
        width: 0,
        duration: 1
      })
      .add({
        targets: ".aprogress-bar",
        width: 80,
        height: 80,
        delay: 500,
        duration: 750,
        borderRadius: 80,
        backgroundColor: "#71DFBE"
      });

      basicTimeline.play();
  }

}
