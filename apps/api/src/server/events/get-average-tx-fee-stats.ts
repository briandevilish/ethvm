import { chartPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Events, Statistic } from 'ethvm-common'

const getAvgTxFeeStats: SocketEvent = {
  id: Events.getAverageTxFeeStats,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = chartPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<Statistic[]> =>
    server.statisticsService.getAverageTxFee(payload.duration)
}

export default getAvgTxFeeStats
