import { Component, OnInit, Input } from "@angular/core";
import { Api311Service } from "../api-311.service";
import { ApiPaserService } from "../api-paser.service";

import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-road",
  styleUrls: ["./road.component.css"],
  templateUrl: "./road.component.html"
})
export class RoadComponent implements OnInit {
  address: string;
  width = "100%";
  height = "100%";
  Geocoder = new google.maps.Geocoder();
  zoom = 16;
  center = new google.maps.LatLng({ lng: -85.6681, lat: 42.9634 });
  markers = [];
  polylines = [];
  roadStuff;
  options: google.maps.MapOptions = {
    mapTypeId: "hybrid",
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 8
  };

  visible;

  constructor(
    private api311: Api311Service,
    private apiPaser: ApiPaserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.Lat && params.Lng) {
        this.center = new google.maps.LatLng({
          lat: parseFloat(params.Lat),
          lng: parseFloat(params.Lng)
        });
      }
    });

    this.apiPaser.retrieveData();
  }

  addMarker(myLat: number, myLng: number) {
    this.markers.push({
      position: {
        lat: myLat,
        lng: myLng
      },
      title: "Marker title " + (this.markers.length + 1)
    });
  }

  click(event: google.maps.MouseEvent) {}

  toggleOnRoad: boolean = true;
  toggleOnPothole: boolean = true;
  radioRoad: boolean = true;
  radioPothole: boolean = true;

  onClickRoad() {
    if (this.toggleOnRoad) {
      for (let lineyboi of this.apiPaser.processPolylines()) {
        this.polylines.push(lineyboi);
        this.radioRoad = false;
      }
      this.toggleOnRoad = false;
    } else {
      this.polylines = [];
      this.toggleOnRoad = true;
      this.radioRoad = true;
    }
  }

  onClickPothole() {
    if (this.toggleOnPothole) {
      for (let place of this.api311.processCoordinates("January 1 2019")) {
        this.addMarker(place.lat, place.lng);
      }
      this.toggleOnPothole = false;
      this.radioPothole = false;
    } else {
      this.markers = [];
      this.toggleOnPothole = true;
      this.radioPothole = true;
    }
  }

  locateAddress(event) {
    //  this.mapLocation.sendData()
    this.center = event.results;
    this.zoom = event.zoom;
  }
}
