import { UntypedFormGroup } from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import moment from 'moment';
import { ApiResponse } from '../model/api-response.model';
import * as _ from "lodash";

export default class Utils {
  static errorDuplicateMessage = 'พบข้อมูลซ้ำ <br/> กรุณาตรวจสอบก่อนดำเนินการ';

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

  // Modern minimal alert styles
  static swalCustomClass = {
    popup: 'swal-modern-popup',
    title: 'swal-modern-title',
    htmlContainer: 'swal-modern-content',
    confirmButton: 'swal-modern-btn swal-modern-btn-primary',
    cancelButton: 'swal-modern-btn swal-modern-btn-default',
    actions: 'swal-modern-actions',
  };

  static alertSuccess(options: SweetAlertOptions) {
    return Swal.fire({
      icon: 'success',
      iconColor: '#10b981',
      confirmButtonColor: '#337ab7',
      customClass: this.swalCustomClass,
      ...options
    });
  }

  static confirmDelete() {
    return Swal.fire({
      icon: 'warning',
      iconColor: '#f59e0b',
      title: 'ยืนยันการลบ?',
      text: 'คุณจะไม่สามารถกู้คืนข้อมูลนี้ได้!',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      customClass: this.swalCustomClass,
      reverseButtons: true,
    });
  }

  static confirm(title, content, btnText) {
    return Swal.fire({
      icon: 'question',
      iconColor: '#337ab7',
      title: title,
      text: content,
      showCancelButton: true,
      confirmButtonText: btnText,
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#337ab7',
      cancelButtonColor: '#6b7280',
      customClass: this.swalCustomClass,
      reverseButtons: true,
    });
  }

  static alertDuplicateError() {
    return Swal.fire({
      icon: 'error',
      iconColor: '#ef4444',
      title: 'ข้อมูลซ้ำ',
      html: this.errorDuplicateMessage,
      confirmButtonColor: '#337ab7',
      customClass: this.swalCustomClass,
    });
  }

  static alertError(options: SweetAlertOptions) {
    return Swal.fire({
      icon: 'error',
      iconColor: '#ef4444',
      confirmButtonColor: '#337ab7',
      customClass: this.swalCustomClass,
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
        text: 'วันที่เริ่มต้นต้องอยู่ก่อนวันที่สิ้นสุด',
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
        text: `เกิดข้อผิดพลาด
        รหัสข้อผิดพลาด : ${obj1.errorCode}
        ข้อความ : ${obj1.message}`,
      });
    } else {
      this.alertError({
        text: `เกิดปัญหาที่เซิร์ฟเวอร์ กรุณาลองใหม่ภายหลัง
        รหัสข้อผิดพลาด : ${obj2.errorCode}
        ข้อความ : ${obj2.message}`,
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
      msgTitle = isCreated ? 'สร้างสำเร็จ!' : 'อัปเดตสำเร็จ!';
      msgText = isCreated ? `${objName} ถูกสร้างแล้ว` : `${objName} ถูกอัปเดตแล้ว`;
      this.alertSuccess({
        title: msgTitle,
        text: msgText,
      });
    } else {
      msgTitle = 'ลบสำเร็จ';
      msgText = `${objName} ถูกลบแล้ว`;
      this.alertSuccess({
        title: msgTitle,
        text: msgText,
      });
    }
  }

  static showUploadSuccess(result: ApiResponse<any>, uploadTarget?: string) {

    let msgTitle = 'อัปโหลดข้อมูล';

    if (uploadTarget !== null || uploadTarget !== undefined) {
      msgTitle = uploadTarget;
    }

    const msgError = result.data.error;
    const msgSuccess = result.data.success;
    const msgTotalRecord = result.data.totalRecord;

    const msgText = `สรุป - ทั้งหมด : ${msgTotalRecord}, สำเร็จ : ${msgSuccess}, ผิดพลาด : ${msgError}`;

    this.alertSuccess({
      title: msgTitle,
      text: msgText,
    });
  }

  static showUploadError(result: ApiResponse<any>) {

    const msgTitle = 'อัปโหลดข้อมูล';

    const msgError = result.data.error;
    const msgSuccess = result.data.success;
    const msgTotalRecord = result.data.totalRecord;

    const msgText = `สรุป - ทั้งหมด : ${msgTotalRecord}, สำเร็จ : ${msgSuccess}, ผิดพลาด : ${msgError}`;

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
            text: 'เลขบัตรประชาชนไม่ถูกต้อง',
          });
          return false;
        }
      }
    }
    else {
      this.alertError({
        text: 'กรุณาระบุเลขบัตรประชาชน 13 หลัก',
      });
      return false;
    }
  }


  static replaceThCodePhoneNo(ani: string) {
    return ani.replace("+66", "0");
  }

}
