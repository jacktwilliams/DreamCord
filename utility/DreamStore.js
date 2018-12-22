import { AsyncStorage } from "react-native"

const store = AsyncStorage;
const DreamListKey = "dreamList";
export default class DreamStore {
  
  static initializeDreamList() {
    try {
      store.getAllKeys()
      .then((keys) => {
        if(keys.includes(DreamListKey)) {
          console.log("Successful AsyncStore initialization. List exists.");
        }
        else {
          store.setItem(DreamListKey, JSON.stringify(new Array())); //TODO: not sure if this is bad style..
        }
      });
    }
    catch {
      console.log("Error initializing a Dream list in the Async Storage.");
    }
  }

  static makeRecord(recordId, title) {
    return {id : recordId, title : title};
  }
}
