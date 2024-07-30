import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { RouterModule } from '@angular/router';
import { QuillModule } from 'ngx-quill'
import { QuillConfigModule } from 'ngx-quill/config';
@NgModule({
  imports: [
    ReactiveFormsModule.withConfig({ callSetDisabledState: 'whenDisabledForLegacyCode' }),
    QuillModule.forRoot({
      modules: {
        toolbar: {
          container: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'align': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['link'],
            ['clean']
          ]
        }
      }
      // ,
      // customOptions: [{
      //   import: 'formats/font',
      //   whitelist: ['mirza', 'roboto', 'aref', 'serif', 'sansserif', 'monospace']
      // }]
    }),
    QuillConfigModule.forRoot({
      modules: {
        syntax: true,
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],

          [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
          [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
          [{ 'direction': 'rtl' }],                         // text direction

          [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

          [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          [{ 'font': [] }],
          [{ 'align': [] }],

          ['clean'],                                         // remove formatting button

          ['link', 'image', 'video']                         // link and image, video
        ]
      }
    }),
  ],
  exports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule,
    QuillModule,

  ], schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {



}
