export interface GeneralModel<T> {
  code: number,
  content: T,
  error: string,
  total: number,
  modelStateError: any
}
