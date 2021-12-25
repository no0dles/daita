export interface IwentContractRemoveHandlerChange {
  type: 'remove_event_handler';
  event: string;
  handler: string;
  name: string;
}
