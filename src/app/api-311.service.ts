import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//this is the URL for the 311 dataset, filtered to only return pothole reports and sort in order of date descending (most recent first)
const apiTarget : string = "https://grand-rapids-proxy.herokuapp.com/potholes?Script%20Used=PUBLIC%20SERVICES%20-%20Pothole&$order=date_and_time%20DESC";

@Injectable({
  providedIn: 'root'
})

export class Api311Service {

  constructor(private myHTTP : HttpClient) { }

  //data is where the returned data is stored after API calls
  data = [];

  //pings the API to get a fresh copy of the data
  retrieveData () {
    this.myHTTP.get(apiTarget).subscribe((data : any) => {this.data = data});
  }

  //extracts coordinates from the currently stored dataset, back to the cutoff date provided
  processCoordinates (cutoffDate : string) {
    this.retrieveData();
    let myReturn = [];
    let dateCutoff = new Date(cutoffDate); //flipping the cutoff date into a Date object
    for (let report of this.data) {
      let reportDate = new Date(report.date_and_time);
      if(reportDate >= dateCutoff && report.coordinates != null) {
        //please note that the coordinates are in socrata in lng/lat (x/y) order, so they have to be transcribed reversed. 
        let myCoords = {'lat' : report.coordinates.coordinates[1], 'lng' : report.coordinates.coordinates[0]};
        myReturn.push(myCoords);
      }
      //if you've reached reports that are too old, return
      else if (reportDate < dateCutoff ) {
        return myReturn;
      }
    }
    return myReturn;
  }
}
