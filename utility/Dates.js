export default class Dates {

  static dateToPickerFormat(date) {
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  }

  static formattedToDate(formatted) {
    let chunks = formatted.split("-");
    return new Date(chunks[0], (chunks[1] - 1), chunks[2]);
  }
  
}
