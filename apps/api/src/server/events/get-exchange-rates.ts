import { exchangeRatePayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Events } from 'ethvm-common'

const getExchangeRatesEvent: SocketEvent = {
  id: Events.getExchangeRates,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = exchangeRatePayloadValidator(payload) as boolean
    return {
      valid,
      errors: []
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<any> =>
    server.exchangesService.getExchangeRate(payload.symbol, payload.to)
}

export default getExchangeRatesEvent
