export interface BurnData {
  txnId?: number;
	earnId?: number;
	burnId?: number;

	value?: number;

	promotionId?: number;
	promotion?: string;

	ruleId?: number;
	rule?: string;

	actionId?: number;
	actionDetail?: string;
}
