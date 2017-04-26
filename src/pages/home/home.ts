import {Component }from '@angular/core';
import {NavController} from 'ionic-angular';
import {Lecture} from '../../models/lecture';
import {Time} from '../../models/time';
import {LectureProvider} from '../../providers/providers';
import {Map} from '../map/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class Home {
  lectures: Lecture[];
  nextLectures: Lecture[];

  days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  constructor(public navCtrl: NavController, public lectureProvider: LectureProvider) {
    this.lectureProvider.findAll().then((values) => {
      this.lectures = <Array<Lecture>> values;

      let currentDate = new Date(), currentDuration = null;

      for (let i = 0; i < this.lectures.length; i++) {
        let startTime = JSON.parse(JSON.stringify(this.lectures[i].startTime));
        startTime = new Time(startTime._hours + ":" + startTime._minutes);

        let lectureDate = Home.getNextDayOfWeek(currentDate, this.lectures[i].day);
        lectureDate.setHours(startTime.hours);
        lectureDate.setMinutes(startTime.minutes);
        lectureDate.setSeconds(0);

        if (currentDuration == null || (currentDuration > (lectureDate.getTime() - currentDate.getTime()) && (lectureDate.getTime() - currentDate.getTime()) > 0)) {
          this.nextLectures = [this.lectures[i]];

          currentDuration = lectureDate.getTime() - currentDate.getTime();
        }
      }
    });
  }

  // http://codereview.stackexchange.com/questions/33527/find-next-occurring-friday-or-any-dayofweek
  static getNextDayOfWeek(date: Date, dayOfWeek: Number): Date {
    let result = new Date(date.getTime());

    result.setDate(date.getDate() + (7 + dayOfWeek.valueOf() - date.getDay()) % 7);

    return result;
  }

  onClickDirections(lecture: Lecture) {
    navigator.geolocation.getCurrentPosition((position) => {
      let building = JSON.parse(JSON.stringify(lecture.building));

      this.navCtrl.setRoot(Map, {
        origin: {lat: position.coords.latitude, lng: position.coords.longitude},
        destination: {lat: building._lat, lng: building._lng}
      });
    });
  }
}
