import { AsyncStorage } from "react-native"

const STORE = AsyncStorage;
const DREAMLISTKEY = "dreamList";
export default class DreamStore {

  static makeRecord(recordId, title) {
    let record = {
      id: recordId, 
      title: title
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
    let listText = await STORE.getItem(DREAMLISTKEY);
    return JSON.parse(listText);
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
