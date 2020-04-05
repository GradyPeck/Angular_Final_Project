import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { paserDataService } from './PaserResponse';

let linecolors : string[] = [
  "#000000",//0 0   0     0
  "#FF3300",//1 255 51    0
  "#FF6600",//2 255 102   0
  "#FF9900",//3 255 153   0
  "#FFcc00",//4 255 204   0
  "#FFFF00",//5 255 255   0
  "#ccF000",//6 204 255   0
  "#99FF00",//7 153 255   0
  "#66FF00",//8 102 255   0
  "#33FF00",//9 51  255   0
  "#00FF00"//10 0   255   0
];

const apiTarget = "https://grand-rapids-proxy.herokuapp.com/pacer?$limit=1000000";

@Injectable({
  providedIn: 'root'
})

export class ApiPaserService {

  constructor(private myHTTP : HttpClient) { }

  data = [];

  retrieveData () {
    this.myHTTP.get(apiTarget).subscribe((data : any) => {this.data = data});
  }

  processPolylines () {
    this.retrieveData();
    let myReturn = [];
    for (let segment of this.data) {
      for (let coords of segment.the_geom.coordinates) {
        let path = [];
        for (let ordpair of coords) {
          path.push(new google.maps.LatLng(ordpair[1], ordpair[0]));
        }
        let chroma : string = linecolors[segment.paser2019];
        let aLine = {'path' : path, 'strokeColor' : chroma};
        myReturn.push(aLine);
      }
    }
    return myReturn;
  }
}

