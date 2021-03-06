import { Block, PendingTx, Tx, Uncle } from '@app/core/models'
import { State } from '@app/core/store/state'
import { BlockMetrics } from 'ethvm-common'

const NEW_BLOCK = (state: State, raw: Block | Block[]) => {
  const blocks = !Array.isArray(raw) ? [raw] : raw
  blocks.forEach(block => state.blocks.add(block))
}

const NEW_BLOCK_METRIC = (state: State, raw: BlockMetrics | BlockMetrics[]) => {
  const bms = !Array.isArray(raw) ? [raw] : raw
  bms.forEach(bm => state.blockMetrics.add(bm))
}

const NEW_TX = (state: State, raw: Tx | Tx[]) => {
  const txs = !Array.isArray(raw) ? [raw] : raw
  txs.forEach(tx => state.txs.add(tx))
}

const NEW_PENDING_TX = (state: State, raw: PendingTx | PendingTx[]) => {
  const pTxs = !Array.isArray(raw) ? [raw] : raw
  pTxs.forEach(pTx => state.pendingTxs.add(pTx))
}

const NEW_UNCLE = (state: State, raw: Uncle | Uncle[]) => {
  const uncles = !Array.isArray(raw) ? [raw] : raw
  uncles.forEach(uncle => state.uncles.add(uncle))
}

export default {
  NEW_BLOCK,
  NEW_BLOCK_METRIC,
  NEW_TX,
  NEW_UNCLE,
  NEW_PENDING_TX
}
