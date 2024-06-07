import { Component } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-sweetalert-cmp',
  templateUrl: 'sweetalert.component.html'
})

export class SweetAlertComponent {

  showSwal(type) {
    if (type === 'custom_html') {
      new SwalComponent({
        title: 'HTML example',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-success',
        html: 'You can use <b>bold text</b>, ' + '<a href="http://github.com">links</a> ' + 'and other HTML tags'
      }).show();
    } else if (type === 'warning-message-and-confirmation') {
      new SwalComponent({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        confirmButtonText: 'Yes, delete it!',
        buttonsStyling: false
      }).show().then(result => {
        if (result.value) {
          new SwalComponent({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            type: 'success',
            confirmButtonClass: 'btn btn-success',
            buttonsStyling: false
          }).show();
        }
      });
    } else if (type === 'warning-message-and-cancel') {
      new SwalComponent({
        title: 'Are you sure?',
        text: 'You will not be able to recover this imaginary file!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false
      }).show().then((result) => {
        if (result.value) {
          new SwalComponent({
            title: 'Deleted!',
            text: 'Your imaginary file has been deleted.',
            type: 'success',
            confirmButtonClass: 'btn btn-success',
            buttonsStyling: false
          }).show().catch();
        } else {
          new SwalComponent({
            title: 'Cancelled',
            text: 'Your imaginary file is safe :)',
            type: 'error',
            confirmButtonClass: 'btn btn-info',
            buttonsStyling: false
          }).show().catch();
        }
      });
    } else if (type === 'auto-close') {
      new SwalComponent({
        title: 'Auto close alert!',
        text: 'I will close in 2 seconds.',
        timer: 2000,
        showConfirmButton: false
      }).show().catch();
    } else if (type === 'input-field') {
      new SwalComponent({
        title: 'Input something',
        input: 'text',
        inputPlaceholder: 'Email',
        inputValue: 'test@test.com',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false
      }).show().then(result => {
        if (result.value) {
          new SwalComponent({
            type: 'success',
            html: 'You entered: <strong>' + result.value + '</strong>',
            confirmButtonClass: 'btn btn-success',
            buttonsStyling: false
          }).show();
        }
      }).catch();
    }
  }
}
