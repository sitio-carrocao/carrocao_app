enum EExternalRequestStatus {
  FinishLater = 'ADIADO',
  Finished = 'FINALIZADO',
  Pending = 'PENDENTE',
  InQuotation = 'EM_COTACAO',
  AwaitingApproval = 'AGUARDANDO_APROVACAO',
  AwaitingPurchase = 'AGUARDANDO_COMPRA',
  AwaitingDelivery = 'AGUARDANDO_ENTREGA',
}

export default EExternalRequestStatus

// em cotação -> aguardando aprovação -> aguardando compra -> aguardando entrega -> finalizado
