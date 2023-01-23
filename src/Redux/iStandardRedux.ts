export default interface iStandardRedux<iState, iPayload, iAction> {
  key: string;
  action: (payload: iPayload) => iAction;
  reducer: (state: iState, action: any) => iState;
}
