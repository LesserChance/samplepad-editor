export default {}
  /*
   * tune display value is -4 to +4 (unsigned int: 252,253,254,255,0,1,2,3,4)
   * @returns {String}
   */
  getTuneDisplayValue(tune) {
    // todo: theres definitely a better way to convert uint8 to signed int here, right?
    if (tune >= 252) {
      return '' + (-1 * (256 - tune));
    }

    return '' + tune;
  }

  /*
   * @param {String} value
   */
  getTuneFromDisplayValue(value) {
    let tune = parseInt(value, 10);

    if (tune < 0) {
      return (256 + tune);
    } else {
      return (tune);
    }
  }

  /*
   * sensitivity is 1 to 8 (5=23, 7=27, 8=32  -- cant figure the pattern out - need to map each)
   * @returns {String}
   */
  getSensitivityDisplayValue(sensitivity) {
    switch (sensitivity) {
      case 23:
        return '5';
      case 27:
        return '7';
      case 32:
        return '8';
      default:
        return '' + sensitivity;
    }
  }

  /*
   * @param {String} value
   */
  getSensitivityFromDisplayValue(value) {
    switch (value) {
      case '5':
        return 23;
      case '7':
        return 27;
      case '8':
        return 32;
      default:
        throw new Error("invalid sensitivity value");
    }
  }

  /*
   * pan display value is L4 to R4 (unsigned int: 252,253,254,255,0,1,2,3,4)
   * @returns {String}
   */
  getPanDisplayValue(pan) {
    if (pan === 0) {
      return 'ctr';
    } else if (pan >= 252) {
      return "L" + (256 - pan);
    } else {
      return "R" + pan;
    }
  }

  /*
   * @param {String} value
   */
  getPanFromDisplayValue(value) {
    if (value === 'ctr') {
      return 0;
    } else {
      if (value.length <= 1) {
        throw new Error("invalid pan value");
      }

      let direction = value.substring(0,1);
      let amount = parseInt(value.substring(1), 10);
      if (direction === 'L') {
        return (-1 * amount);
      } else if (direction === 'R') {
        return amount;
      } else {
        throw new Error("invalid pan value");
      }
    }
  }
}