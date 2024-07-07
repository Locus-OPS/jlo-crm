import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'memberCard', standalone: true })
export class MemberCardPipe implements PipeTransform {
  transform(value: string): string {
    try {
      return value.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4");
    } catch (e) {
      return value;
    }

  }
}
