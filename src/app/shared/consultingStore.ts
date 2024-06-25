
import { ConsultingModel } from '../pages/consulting/consulting.model';

const CONSULTING_KEY = 'consulting_data';

export default class ConsultingUtils {

  static setConsultingData(constModel: ConsultingModel) {
    sessionStorage.setItem(CONSULTING_KEY, JSON.stringify(constModel));
  }
  static getConsultingData(): string {
    return sessionStorage.getItem(CONSULTING_KEY);
  }
  static removeConsultingData() {
    sessionStorage.removeItem(CONSULTING_KEY);
  }

  public static isConsulting() {
    if (JSON.parse(ConsultingUtils.getConsultingData()) != null && JSON.parse(ConsultingUtils.getConsultingData()) != undefined) {
      return true;
    } else {
      return false;
    }
  }


}
