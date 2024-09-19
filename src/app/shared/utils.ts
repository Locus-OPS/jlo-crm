import { UntypedFormGroup } from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import moment from 'moment';
import { ApiResponse } from '../model/api-response.model';
import * as _ from "lodash";

export default class Utils {
  static errorDuplicateMessage = 'There is duplicate information. <br/> Please recheck before proceeding.';

  static asyncDebounce(func, wait) {
    const debounced = _.debounce(async (resolve, reject, bindSelf, args) => {
      try {
        const result = await func.bind(bindSelf)(...args);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, wait);

    // This is the function that will be bound by the caller, so it must contain the `function` keyword.
    function returnFunc(...args) {
      return new Promise((resolve, reject) => {
        debounced(resolve, reject, this, args);
      });
    }

    return returnFunc;
  }

  static alertSuccess(options: SweetAlertOptions) {
    // return new SwalComponent({
    //   type: 'success',
    //   confirmButtonClass: 'btn btn-success',
    //   buttonsStyling: false,
    //   ...options
    // }).show();

    // return Swal.fire({
    //   icon: 'success',
    //   customClass: 'btn btn-success',
    //   ...options
    // });

    return Swal.fire({
      icon: 'success',
      customClass: {
        confirmButton: 'btn btn-info'
      },
      ...options
    });
  }

  static confirmDelete() {
    // return new SwalComponent({
    //   title: 'Are you sure?',
    //   text: 'You won\'t be able to revert this!',
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonClass: 'btn btn-success',
    //   cancelButtonClass: 'btn btn-danger',
    //   confirmButtonText: 'Yes, delete it!',
    //   buttonsStyling: false
    // }).show();

    return Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      didClose: () => {
        return false;
      }
    });
  }

  static confirm(title, content, btnText) {
    // return new SwalComponent({
    //   title: title,
    //   text: content,
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonClass: 'btn btn-success',
    //   cancelButtonClass: 'btn btn-danger',
    //   confirmButtonText: btnText,
    //   buttonsStyling: false
    // }).show();

    return Swal.fire({
      icon: 'warning',
      title: title,
      text: content,
      showCancelButton: true,
      confirmButtonText: btnText,
    });
  }
  static alertDuplicateError() {
    // return new SwalComponent({
    //   type: 'error',
    //   confirmButtonClass: 'btn btn-info',
    //   buttonsStyling: false,
    //   html: this.errorDuplicateMessage
    // }).show();

    return Swal.fire({
      icon: 'error',
      html: this.errorDuplicateMessage,
      showCancelButton: true,
      didClose: () => {
        return false;
      }
    });

  }

  static alertError(options: SweetAlertOptions) {
    // return new SwalComponent({
    //   type: 'error',
    //   confirmButtonClass: 'btn btn-info',
    //   buttonsStyling: false,
    //   ...options
    // }).show();

    // return Swal.fire({
    //   icon: 'error',
    //   customClass: 'btn btn-info',
    //   ...options
    // });

    return Swal.fire({
      icon: 'error',
      customClass: {
        confirmButton: 'btn btn-info'
      },
      ...options
    });

  }

  static assign(target: object, ...sources: object[]) {
    sources.forEach((source) => {
      return Object.keys(source).forEach((key) => {
        target[key] = source[key];
      });
    });
    return target;
  }

  static getDateString(input): string {
    if (input) {
      return moment(input).format('DD/MM/YYYY');
    }
    return '';
  }

  static getDateTimeString(date, time): string {
    if (!time) {
      time = "00:00:00";
    }
    if (date) {
      return moment(date).format('DD/MM/YYYY') + " " + time + ":00";
    }
    return '';
  }

  /**
   * Compares two Date objects and returns e number value that represents
   * the result:
   * 0 if the two dates are equal.
   * 1 if the first date is greater than second.
   * -1 if the first date is less than second.
   * @param startDate First date object to compare.
   * @param endDate Second date object to compare.
   */
  static validateDateTimeRange(startDate: Date, endDate: Date, startTime: string, endTime: string): boolean {
    let result = 0;

    // With Date object we can compare dates them using the >, <, <= or >=.
    // The ==, !=, ===, and !== operators require to use date.getTime(),
    // so we need to create a new instance of Date with 'new Date()'
    let d1 = new Date(startDate);
    let d2 = new Date(endDate);

    // Check if the dates are equal
    let same = d1.getTime() === d2.getTime();

    if (same) {
      let time1Split = startTime.split(":");
      let hours1 = Number(time1Split[0]);
      let minutes1 = Number(time1Split[1]);

      let time2Split = endTime.split(":");
      let hours2 = Number(time2Split[0]);
      let minutes2 = Number(time2Split[1]);

      if (hours1 == hours2) {
        if (minutes1 == minutes2) {
          result = 0;
        } else if (minutes1 < minutes2) {
          result = -1;
        } else {
          result = 1;
        }
      } else if (hours1 < hours2) {
        result = -1;
      } else {
        result = 1;
      }
    } else if (d1 > d2) { // Check if the first is greater than second
      result = 1;
    } else if (d1 < d2) { // Check if the first is less than second
      result = -1;
    }

    if (result > 0) {
      this.alertError({
        text: 'Start date must be before end date.',
      });
      return false;
    } else {
      return true;
    }
  }

  static getStringForDate(input): string {
    if (input) {
      return moment(input, 'DD/MM/YYYY', true).format();
    }
    return '';
  }

  static getStringForDate2(input): string {
    if (input) {
      return moment(input, 'dd/MM/yyyy HH:mm:ss', true).format();
    }
    return '';
  }


  static setDatePicker(source: UntypedFormGroup) {
    if (source.get('startDate').value) {
      const startDate = new Date(this.getStringForDate(source.get('startDate').value));
      source.get('startDate').setValue(startDate);
    }
    if (source.get('endDate').value) {
      const endDate = new Date(this.getStringForDate(source.get('endDate').value));
      source.get('endDate').setValue(endDate);
    }
  }

  static setBirthDatePicker(source: UntypedFormGroup) {
    if (source.get('birthDate').value) {
      const birthDate = new Date(this.getStringForDate(source.get('birthDate').value));
      source.get('birthDate').setValue(birthDate);
    }
  }

  static showError(obj1, obj2) {
    if (obj1 !== null) {
      this.alertError({
        text: `There is a logical problem.
        errorCode : ${obj1.errorCode}
        message : ${obj1.message}`,
      });
    } else {
      this.alertError({
        text: `There is a problem in the server, please, try later.
        errorCode : ${obj2.errorCode}
        message : ${obj2.message}`,
      });
    }
  }

  static convertToBoolean(source: any, target: any, controlName: any) {
    source[controlName] === 'Y' ? target.patchValue({ [controlName]: true }) : target.patchValue({ [controlName]: false });
  }

  static convertToYN(source: any) {
    return source === true ? 'Y' : 'N';
  }

  static showSuccess(isCreated: any, objName: string, isDeleted?: boolean) {
    let msgTitle = null;
    let msgText = null;

    if (!isDeleted) {
      msgTitle = isCreated ? 'Created!' : 'Updated!';
      msgText = isCreated ? `${objName} has been created.!` : `${objName} has been updated.`;
      this.alertSuccess({
        title: msgTitle,
        text: msgText,
      });
    } else {
      msgTitle = 'Deleted';
      msgText = `${objName} has been deleted.!`;
      this.alertSuccess({
        title: msgTitle,
        text: msgText,
      });
    }
  }

  static showUploadSuccess(result: ApiResponse<any>, uploadTarget?: string) {

    let msgTitle = 'Product Upload';

    if (uploadTarget !== null || uploadTarget !== undefined) {
      msgTitle = uploadTarget;
    }

    const msgError = result.data.error;
    const msgSuccess = result.data.success;
    const msgTotalRecord = result.data.totalRecord;

    const msgText = `Summary -
                    Total Record : ${msgTotalRecord}, Success : ${msgSuccess}, Error : ${msgError}`;

    this.alertSuccess({
      title: msgTitle,
      text: msgText,
    });
  }

  static showUploadError(result: ApiResponse<any>) {

    const msgTitle = 'Product Upload';

    const msgError = result.data.error;
    const msgSuccess = result.data.success;
    const msgTotalRecord = result.data.totalRecord;

    const msgText = `Summary -
                    Total Record : ${msgTotalRecord}, Success : ${msgSuccess}, Error : ${msgError}`;

    this.alertSuccess({
      title: msgTitle,
      text: msgText,
    });
  }

  /**
   * Validate Thai citizen id value.
   */
  static isValidCitizenId(value: string) {
    var fullCitizenId = value.substring(0, 1) + '-' + value.substring(1, 5) + '-' + value.substring(5, 10) + '-' + value.substring(10, 12)
      + '-' + value.substring(12);

    if (fullCitizenId.length == 17) {
      var k = fullCitizenId.length;
      var r = 0;
      var j = 13; {
        for (var i = 0; i <= (k - 3); i++) {
          if (fullCitizenId.charAt(i) != '-') {

            r = r + Number(fullCitizenId.charAt(i)) * j;
            j--;
          }
        }
        var result = (11 - Number(r % 11)) % 10;

        if (result == Number(fullCitizenId.charAt(k - 1))) {
          return true;
        }
        else {
          this.alertError({
            text: 'Citizen ID is not compliant with the rules.',
          });
          return false;
        }
      }
    }
    else {
      this.alertError({
        text: 'Please specify a 13 digit ID citizen ID.',
      });
      return false;
    }
  }


  static replaceThCodePhoneNo(ani: string) {
    return ani.replace("+66", "0");
  }

}
