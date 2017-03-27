import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Storage} from '@ionic/storage';
import {Lecture} from '../models/lecture';

@Injectable()
export class Lectures {
  constructor(public http: Http, public storage: Storage) {

  }

  create(lecture: Lecture) {
    this.storage.get('_lectures').then((values) => {
      if (values == null) {
        this.storage.set('_lectures', [lecture]);
      } else {
        values.push(lecture);

        this.storage.set('_lectures', values);
      }
    });
  }

  delete(lecture: Lecture) {
    this.storage.get('_lectures').then((values) => {
      if (values != null) {
        for (let i = 0; i < values.length; i++) {
          let value = new Lecture(values[i]._module, values[i]._lecturer, values[i]._building, values[i]._room, values[i]._startTime, values[i]._finishTime);

          if (lecture.building == value.building && lecture.finishTime == value.finishTime && lecture.module == value.module && lecture.lecturer == value.lecturer && lecture.room == value.room && lecture.startTime == value.startTime) {
            values.splice(i, 1);
          }
        }

        this.storage.set('_lectures', values);
      }
    });
  }

  findAll() {
    let lectures = [];

    this.storage.get('_lectures').then((values) => {
      if (values != null) {
        for (let i = 0; i < values.length; i++) {
          lectures.push(new Lecture(values[i]._module, values[i]._lecturer, values[i]._building, values[i]._room, values[i]._startTime, values[i]._finishTime));
        }
      }
    });

    return lectures;
  }
}
