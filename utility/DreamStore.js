/* Handles the AsyncStorage operations. We are storing a list of records which correspond to audio files we have saved on the device */
import { AsyncStorage } from "react-native"

const STORE = AsyncStorage;
const DREAMLISTKEY = "dreamList";
export default class DreamStore {

  static makeRecord(recordId, title, date, people) {
    let peopleList = people.split(',').map((element) => {
      let newElem = element.replace(' ', '');
      newElem = newElem.toLowerCase();
      return newElem;
    });
    let record = {
      id: recordId, 
      title: title,
      date: Date.parse(date.toUTCString()), //store milliseconds and we can construct a new object on other end
      people: peopleList,
    }
    console.log("NEW RECORD: " + JSON.stringify(record));
    return record;
  }

  static initializeDreamList() {
    try {
      STORE.getAllKeys()
      .then((keys) => {
        if(keys.includes(DREAMLISTKEY)) {
          console.log("Successful AsyncStore initialization. List exists.");
        }
        else {
          let dl = [];
          STORE.setItem(DREAMLISTKEY, JSON.stringify(dl)); 
          console.log("Successful AsyncStore initialization. Starting with an empty list.");
        }
      });
    }
    catch (e) {
      console.log("Error initializing a Dream list in the Async Storage: \n" + e);
    }
  }

  static async getDreamList() {
    return new Promise((resolve, reject) => {
      STORE.getItem(DREAMLISTKEY)
      .then((listText) => {
        let list = JSON.parse(listText);
        this.convertDates(list);
        resolve(list);
      })
      .catch((e) => {
        console.log("ERROR getting dream list from storage: \n" + e);
      });
    });
  }

  static convertDates(dreamL) {
    for(let i = 0; i < dreamL.length; ++i) {
      dreamL[i].date = new Date(JSON.parse(dreamL[i].date)); //was saved to Storage as milliseconds
    }
  }

  static clearDreamList() {
    STORE.removeItem(DREAMLISTKEY)
    .then(() => {
      console.log("Removed dream list from storage.");
    })
    .catch((error) => {
      console.log("Error removing dream list from storage: \n" + error);
    })
  }

}
